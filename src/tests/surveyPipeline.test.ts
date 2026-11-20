import { describe, it, expect } from 'vitest';
import { parseCsvText } from '../lib/survey/csvParser';
import { suggestColumnMapping } from '../lib/survey/columnMapper';
import { extractCategoriesFromText, validateSurveyRows } from '../lib/survey/surveyValidator';
import {
  buildSurveyDataset,
} from '../lib/survey/surveyAggregator';
import { SAMPLE_SURVEY_DATASET, generateSampleCsvContent } from '../data/sampleSurveyDataset';
import { ILLUSTRATIVE_DATASET } from '../data/illustrativeDataset';
import { calculateThreeSetPIE, verifyPieInvariants } from '../lib/math/inclusionExclusion';
import { calculateDisjointRegions } from '../lib/math/vennRegions';
import { validateSetInputs } from '../lib/math/setTheory';
import { ColumnMapping } from '../types/survey';

describe('Phase 5 & 6 — Survey Data Ingestion Pipeline & Analytics', () => {
  describe('RFC 4180 CSV Parser', () => {
    it('parses valid CSV with standard headers and rows', () => {
      const csv = 'ID,Name,Value\n1,Alice,100\n2,Bob,200';
      const result = parseCsvText(csv);
      expect(result.isValid).toBe(true);
      expect(result.headers).toEqual(['ID', 'Name', 'Value']);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].Name).toBe('Alice');
      expect(result.rows[1].Value).toBe('200');
    });

    it('strips UTF-8 BOM (\\uFEFF) cleanly without corrupting first header', () => {
      const csvWithBom = '\uFEFFTimestamp,Respondent ID,Score\n2026-03-01,RESP-01,95';
      const result = parseCsvText(csvWithBom);
      expect(result.isValid).toBe(true);
      expect(result.headers[0]).toBe('Timestamp');
      expect(result.rows[0]['Timestamp']).toBe('2026-03-01');
    });

    it('correctly handles quoted fields containing commas', () => {
      const csv = 'ID,Categories,Amount\n1,"Personal Loan, Vehicle Loan",15000\n2,"Consumer Durable / Smartphone BNPL",5000';
      const result = parseCsvText(csv);
      expect(result.isValid).toBe(true);
      expect(result.rows[0].Categories).toBe('Personal Loan, Vehicle Loan');
      expect(result.rows[0].Amount).toBe('15000');
      expect(result.rows[1].Categories).toBe('Consumer Durable / Smartphone BNPL');
    });

    it('handles escaped double quotes ("") inside quoted fields', () => {
      const csv = 'ID,Comment\n1,"He said ""I need no-cost EMI"" to buy phone"';
      const result = parseCsvText(csv);
      expect(result.isValid).toBe(true);
      expect(result.rows[0].Comment).toBe('He said "I need no-cost EMI" to buy phone');
    });

    it('handles empty rows and trailing linebreaks gracefully', () => {
      const csv = 'ID,Score\n\n1,10\n\n2,20\n\n';
      const result = parseCsvText(csv);
      expect(result.isValid).toBe(true);
      expect(result.rows).toHaveLength(2);
    });

    it('reports error on unclosed quotes in CSV', () => {
      const brokenCsv = 'ID,Text\n1,"Unclosed quote here\n2,Normal';
      const result = parseCsvText(brokenCsv);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Unclosed quote'))).toBe(true);
    });

    it('reports error on empty CSV string', () => {
      const emptyCsv = '   \n  \n';
      const result = parseCsvText(emptyCsv);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The uploaded CSV file is empty.');
    });
  });

  describe('Column Mapping & Header Heuristics', () => {
    it('automatically recognizes Google Forms export question headers', () => {
      const headers = [
        'Timestamp',
        'Respondent ID',
        'Do you currently pay any active EMI?',
        'How many active EMI agreements do you pay?',
        'Which types of EMIs do you currently pay?',
        'What is your approximate monthly take-home income?',
        'What is your approximate total monthly EMI commitment?',
        'Have you experienced difficulty paying multiple EMIs?',
      ];

      const mapping = suggestColumnMapping(headers);

      expect(mapping.timestamp).toBe('Timestamp');
      expect(mapping.id).toBe('Respondent ID');
      expect(mapping.hasActiveEmi).toBe('Do you currently pay any active EMI?');
      expect(mapping.numActiveEmis).toBe('How many active EMI agreements do you pay?');
      expect(mapping.categories).toBe('Which types of EMIs do you currently pay?');
      expect(mapping.incomeRange).toBe('What is your approximate monthly take-home income?');
      expect(mapping.emiRange).toBe('What is your approximate total monthly EMI commitment?');
      expect(mapping.repaymentDifficulty).toBe('Have you experienced difficulty paying multiple EMIs?');
    });
  });

  describe('Survey Category Normalization & Set Classification', () => {
    it('normalizes single loan categories', () => {
      expect(extractCategoriesFromText('Personal Loan').categories).toEqual(['personal']);
      expect(extractCategoriesFromText('Two-Wheeler Loan (Bike/Scooter)').categories).toEqual(['vehicle']);
      expect(extractCategoriesFromText('Smartphone No-Cost EMI (BNPL)').categories).toEqual(['consumer_durable']);
    });

    it('normalizes multiple concurrent categories in a single response cell', () => {
      const text = 'Personal Loan, Car Loan (Vehicle), Smartphone BNPL';
      const result = extractCategoriesFromText(text);
      expect(result.categories).toContain('personal');
      expect(result.categories).toContain('vehicle');
      expect(result.categories).toContain('consumer_durable');
      expect(result.categories).toHaveLength(3);
    });

    it('classifies loans outside A, B, and C as "other" and NOT as debt-free', () => {
      const text = 'Home Loan / Mortgage';
      const result = extractCategoriesFromText(text);
      expect(result.categories).toEqual(['other']);
      expect(result.isExplicitlyNone).toBe(false);
    });

    it('identifies explicit debt-free / None responses correctly', () => {
      expect(extractCategoriesFromText('None').isExplicitlyNone).toBe(true);
      expect(extractCategoriesFromText('None').categories).toHaveLength(0);
      expect(extractCategoriesFromText('No active EMI').isExplicitlyNone).toBe(true);
    });
  });

  describe('Validation, Deduplication & Exclusions', () => {
    const mapping: ColumnMapping = {
      id: 'ID',
      categories: 'Categories',
      incomeRange: 'Income',
    };

    it('detects and excludes duplicate respondent IDs', () => {
      const rows = [
        { ID: 'RESP-01', Categories: 'Personal Loan', Income: '₹25,000 - ₹50,000' },
        { ID: 'RESP-01', Categories: 'Vehicle Loan', Income: '₹25,000 - ₹50,000' }, // Duplicate ID
        { ID: 'RESP-02', Categories: 'Personal Loan', Income: '₹25,000 - ₹50,000' },
      ];

      const { validRecords, summary } = validateSurveyRows(rows, mapping);
      expect(validRecords).toHaveLength(2);
      expect(summary.duplicateRowCount).toBe(1);
      expect(summary.excludedRows[0].identifier).toBe('RESP-01');
      expect(summary.excludedRows[0].reason).toContain('Duplicate respondent identifier');
    });

    it('detects and excludes identical duplicate submission rows (fingerprint check)', () => {
      const rows = [
        { ID: '', Categories: 'Personal Loan', Income: '₹25,000 - ₹50,000' },
        { ID: '', Categories: 'Personal Loan', Income: '₹25,000 - ₹50,000' }, // Identical fingerprint
        { ID: '', Categories: 'Vehicle Loan', Income: '₹25,000 - ₹50,000' },
      ];

      const { validRecords, summary } = validateSurveyRows(rows, mapping);
      expect(validRecords).toHaveLength(2);
      expect(summary.duplicateRowCount).toBe(1);
    });

    it('overrides active status if respondent checked "No" active EMI but entered loan types', () => {
      const rows = [
        { ID: 'RESP-01', Active: 'No', Categories: 'Personal Loan, Vehicle Loan', Income: '₹50,000' },
      ];
      const customMapping = { ...mapping, hasActiveEmi: 'Active' };
      const { validRecords, summary } = validateSurveyRows(rows, customMapping);
      expect(validRecords[0].hasActiveEmi).toBe(true);
      expect(summary.warnings.some((w) => w.reason.includes('Overriding active status to Yes'))).toBe(true);
    });
  });

  describe('Mathematical Engine Integration on Survey Data', () => {
    it('correctly aggregates Sample Field Survey Dataset (N=84) into exact set cardinalities', () => {
      const dataset = SAMPLE_SURVEY_DATASET;
      const setData = dataset.calculatedSetData;

      expect(setData.totalRespondents).toBe(84);
      expect(setData.setA).toBe(32);
      expect(setData.setB).toBe(28);
      expect(setData.setC).toBe(36);
      expect(setData.intersectionAB).toBe(11);
      expect(setData.intersectionAC).toBe(14);
      expect(setData.intersectionBC).toBe(12);
      expect(setData.intersectionABC).toBe(5);

      // Verify set input validity
      const valResult = validateSetInputs(setData);
      expect(valResult.isValid).toBe(true);
      expect(valResult.errors).toHaveLength(0);
    });

    it('satisfies all 8 exclusive partition regions and PIE invariants for the empirical survey cohort', () => {
      const setData = SAMPLE_SURVEY_DATASET.calculatedSetData;
      const regions = calculateDisjointRegions(setData);

      // R1: Only A = 32 - 11 - 14 + 5 = 12
      expect(regions.onlyA).toBe(12);
      // R2: Only B = 28 - 11 - 12 + 5 = 10
      expect(regions.onlyB).toBe(10);
      // R3: Only C = 36 - 14 - 12 + 5 = 15
      expect(regions.onlyC).toBe(15);
      // R4: Only AB = 11 - 5 = 6
      expect(regions.onlyAB).toBe(6);
      // R5: Only BC = 12 - 5 = 7
      expect(regions.onlyBC).toBe(7);
      // R6: Only AC = 14 - 5 = 9
      expect(regions.onlyAC).toBe(9);
      // R7: All Three = 5
      expect(regions.allThree).toBe(5);
      // R8: Outside = 84 - 64 = 20
      expect(regions.outside).toBe(20);

      // Conservation invariant: sum of regions = N = 84
      const sumRegions =
        regions.onlyA +
        regions.onlyB +
        regions.onlyC +
        regions.onlyAB +
        regions.onlyBC +
        regions.onlyAC +
        regions.allThree +
        regions.outside;
      expect(sumRegions).toBe(84);

      // Automated PIE invariant check
      const verification = verifyPieInvariants(setData);
      expect(verification.isConsistent).toBe(true);
    });

    it('end-to-end: parses realistic Google Forms CSV string and builds fully validated SurveyDataset', () => {
      const csvString = generateSampleCsvContent();
      const parseRes = parseCsvText(csvString);
      expect(parseRes.isValid).toBe(true);
      expect(parseRes.rows).toHaveLength(84);

      const mapping = parseRes.suggestedMapping;
      expect(mapping.categories).toBeDefined();

      const validation = validateSurveyRows(parseRes.rows, mapping);
      expect(validation.validRecords).toHaveLength(84);
      expect(validation.summary.excludedRows).toHaveLength(0);

      const dataset = buildSurveyDataset(
        'test-uploaded-dataset',
        'Bangalore Urban Survey',
        'uploaded_csv',
        'Uploaded test file',
        validation.validRecords,
        validation.summary,
        { fileName: 'survey.csv', fileSizeBytes: csvString.length }
      );

      expect(dataset.sourceType).toBe('uploaded_csv');
      expect(dataset.totalRespondents).toBe(84);
      expect(dataset.calculatedSetData.totalRespondents).toBe(84);
      expect(dataset.distributionStats.categoryCounts).toHaveLength(4);
      expect(dataset.insights.length).toBeGreaterThan(0);
    });

    it('verifies that the illustrative demo dataset preserves DESIGN.md Section 8 invariant results', () => {
      const demo = ILLUSTRATIVE_DATASET;
      expect(demo.totalRespondents).toBe(100);
      expect(demo.calculatedSetData.setA).toBe(40);
      expect(demo.calculatedSetData.setB).toBe(35);
      expect(demo.calculatedSetData.setC).toBe(30);
      expect(demo.calculatedSetData.intersectionAB).toBe(15);
      expect(demo.calculatedSetData.intersectionAC).toBe(12);
      expect(demo.calculatedSetData.intersectionBC).toBe(10);
      expect(demo.calculatedSetData.intersectionABC).toBe(5);

      const pie = calculateThreeSetPIE(demo.calculatedSetData);
      expect(pie.atLeastOne).toBe(73);
      expect(pie.exactlyOne).toBe(46);
      expect(pie.exactlyTwo).toBe(22);
      expect(pie.atLeastTwo).toBe(27);
      expect(pie.allThree).toBe(5);
      expect(pie.outside).toBe(27);
    });
  });
});
