import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { RESEARCH_SURVEY_DATASET, RESEARCH_RECORDS } from '../data/researchSurveyDataset';
import { deriveSetCardinalitiesFromRecords, computeDistributionStats } from '../lib/survey/surveyAggregator';
import { calculateThreeSetPIE, verifyPieInvariants } from '../lib/math/inclusionExclusion';
import { calculateDisjointRegions } from '../lib/math/vennRegions';
import { parseCsvText } from '../lib/survey/csvParser';
import { suggestColumnMapping } from '../lib/survey/columnMapper';
import { validateSurveyRows } from '../lib/survey/surveyValidator';

describe('Research Cohort (N=16) Dataset & Mathematical Invariants', () => {
  it('contains exactly 16 research records and excludes synthetic test submissions', () => {
    expect(RESEARCH_RECORDS).toHaveLength(16);
    expect(RESEARCH_SURVEY_DATASET.validRespondents).toBe(16);
    expect(RESEARCH_SURVEY_DATASET.totalRespondents).toBe(16);
    expect(RESEARCH_SURVEY_DATASET.excludedCount).toBe(2);

    // Verify synthetic test entries are completely absent
    const hasSynthetic = RESEARCH_RECORDS.some((r) =>
      r.id.toLowerCase().includes('synthetic') ||
      (r.timestamp && r.timestamp.includes('22:19:08')) ||
      (r.timestamp && r.timestamp.includes('22:48:00'))
    );
    expect(hasSynthetic).toBe(false);
  });

  it('dynamically computes expected set cardinalities for sets A, B, and C', () => {
    const cardinalities = deriveSetCardinalitiesFromRecords(RESEARCH_RECORDS);

    expect(cardinalities.totalRespondents).toBe(16);
    expect(cardinalities.setA).toBe(4); // Personal Loan
    expect(cardinalities.setB).toBe(6); // Vehicle Loan
    expect(cardinalities.setC).toBe(7); // Consumer Durable / BNPL

    expect(cardinalities.intersectionAB).toBe(1);
    expect(cardinalities.intersectionAC).toBe(1);
    expect(cardinalities.intersectionBC).toBe(2);
    expect(cardinalities.intersectionABC).toBe(0);

    const stats = computeDistributionStats(RESEARCH_RECORDS);
    expect(stats.categoryCounts.find((c) => c.name === 'Personal Loan')?.count).toBe(4);
    expect(stats.categoryCounts.find((c) => c.name === 'Vehicle Loan')?.count).toBe(6);
    expect(stats.categoryCounts.find((c) => c.name === 'Consumer Durable')?.count).toBe(7);
  });

  it('satisfies Principle of Inclusion-Exclusion (PIE) invariants', () => {
    const cardinalities = RESEARCH_SURVEY_DATASET.calculatedSetData;
    const pie = calculateThreeSetPIE(cardinalities);

    // S1, S2, S3
    expect(pie.S1).toBe(4 + 6 + 7); // 17
    expect(pie.S2).toBe(1 + 1 + 2);   // 4
    expect(pie.S3).toBe(0);    // 0

    // Union |A ∪ B ∪ C| = 17 - 4 + 0 = 13
    expect(pie.atLeastOne).toBe(13);

    // Outside all three = 16 - 13 = 3
    expect(pie.outside).toBe(3);

    // Cardinality breakdown by count
    expect(pie.exactlyOne).toBe(9);
    expect(pie.exactlyTwo).toBe(4);
    expect(pie.allThree).toBe(0);

    // Invariant check passes
    const invariants = verifyPieInvariants(cardinalities);
    expect(invariants.isConsistent).toBe(true);
  });

  it('calculates the 8 mutually exclusive Venn regions summing strictly to 16', () => {
    const cardinalities = RESEARCH_SURVEY_DATASET.calculatedSetData;
    const regions = calculateDisjointRegions(cardinalities);

    expect(regions.onlyA).toBe(2);
    expect(regions.onlyB).toBe(3);
    expect(regions.onlyC).toBe(4);
    expect(regions.onlyAB).toBe(1);
    expect(regions.onlyAC).toBe(1);
    expect(regions.onlyBC).toBe(2);
    expect(regions.allThree).toBe(0);
    expect(regions.outside).toBe(3);

    const partitionSum =
      regions.onlyA +
      regions.onlyB +
      regions.onlyC +
      regions.onlyAB +
      regions.onlyAC +
      regions.onlyBC +
      regions.allThree +
      regions.outside;

    expect(partitionSum).toBe(16);
    expect(regions.onlyA + regions.onlyB + regions.onlyC).toBe(9); // exactly one
    expect(regions.onlyAB + regions.onlyAC + regions.onlyBC).toBe(4); // exactly two
  });

  it('accurately preserves non-target debt among respondents outside sets A, B, and C', () => {
    // 3 respondents outside sets A, B, C:
    // Row 1 (Student) has active 'other' loan (₹5,000 EMI)
    // Row 9 and Row 16 are debt-free
    const outsideRecords = RESEARCH_RECORDS.filter(
      (r) =>
        !r.categories.includes('personal') &&
        !r.categories.includes('vehicle') &&
        !r.categories.includes('consumer_durable')
    );

    expect(outsideRecords).toHaveLength(3);

    const indebtedOutside = outsideRecords.filter((r) => r.hasActiveEmi);
    const debtFreeOutside = outsideRecords.filter((r) => !r.hasActiveEmi);

    expect(indebtedOutside).toHaveLength(1);
    expect(indebtedOutside[0].categories).toContain('other');
    expect(debtFreeOutside).toHaveLength(2);
  });

  it('verifies that THE_EMI_TRAP_RESEARCH_DATA_N16.csv parses and validates cleanly', () => {
    const csvPath = path.resolve(__dirname, '../../THE_EMI_TRAP_RESEARCH_DATA_N16.csv');
    expect(fs.existsSync(csvPath)).toBe(true);

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const parseResult = parseCsvText(csvContent);

    expect(parseResult.isValid).toBe(true);
    expect(parseResult.rows).toHaveLength(16);

    const mapping = suggestColumnMapping(parseResult.headers);
    expect(mapping.categories).toBeDefined();

    const { validRecords, summary } = validateSurveyRows(parseResult.rows, mapping);
    expect(validRecords).toHaveLength(16);
    expect(summary.totalRows).toBe(16);
    expect(summary.validRowCount).toBe(16);
    expect(summary.invalidRowCount).toBe(0);
    expect(summary.duplicateRowCount).toBe(0);
    expect(summary.excludedRows).toHaveLength(0);

    const setCard = deriveSetCardinalitiesFromRecords(validRecords);
    expect(setCard.setA).toBe(4);
    expect(setCard.setB).toBe(6);
    expect(setCard.setC).toBe(7);
  });
});
