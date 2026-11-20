import {
  ColumnMapping,
  EmiCategoryKey,
  ExcludedRowInfo,
  RawCsvRow,
  RowValidationError,
  SurveyRespondentRecord,
  ValidationSummary,
} from '../../types/survey';

/**
 * Extracts and normalizes categorical loan keys from survey strings.
 * Conforms to DESIGN.md Section 10.2:
 * A = Personal Loan
 * B = Vehicle Loan
 * C = Consumer Durable / BNPL Loan
 * Other = Recorded separately (not debt-free)
 */
export function extractCategoriesFromText(rawText: string): {
  categories: EmiCategoryKey[];
  isExplicitlyNone: boolean;
} {
  if (!rawText || rawText.trim().length === 0) {
    return { categories: [], isExplicitlyNone: true };
  }

  const lower = rawText.toLowerCase().trim();

  // Explicit non-indebted responses
  if (
    lower === 'none' ||
    lower === 'no' ||
    lower === 'nil' ||
    lower === 'n/a' ||
    lower === 'debt free' ||
    lower === 'zero' ||
    lower.includes('no active')
  ) {
    return { categories: [], isExplicitlyNone: true };
  }

  const categories: EmiCategoryKey[] = [];

  // Match Set A: Personal Loan
  if (
    lower.includes('personal') ||
    lower.includes('unsecured') ||
    lower.includes('instant loan') ||
    lower.includes('salary advance')
  ) {
    categories.push('personal');
  }

  // Match Set B: Vehicle Loan
  if (
    lower.includes('vehicle') ||
    lower.includes('two-wheeler') ||
    lower.includes('two wheeler') ||
    lower.includes('bike') ||
    lower.includes('car loan') ||
    lower.includes('auto loan') ||
    lower.includes('scooter')
  ) {
    categories.push('vehicle');
  }

  // Match Set C: Consumer Durable / BNPL
  if (
    lower.includes('consumer durable') ||
    lower.includes('consumer') ||
    lower.includes('bnpl') ||
    lower.includes('smartphone') ||
    lower.includes('mobile') ||
    lower.includes('laptop') ||
    lower.includes('electronics') ||
    lower.includes('no-cost') ||
    lower.includes('no cost') ||
    lower.includes('pay later')
  ) {
    categories.push('consumer_durable');
  }

  // Match Other loans (Home, Education, Gold, Business)
  if (
    lower.includes('home') ||
    lower.includes('education') ||
    lower.includes('gold') ||
    lower.includes('mortgage') ||
    lower.includes('business') ||
    lower.includes('other')
  ) {
    categories.push('other');
  }

  return {
    categories: Array.from(new Set(categories)),
    isExplicitlyNone: categories.length === 0,
  };
}

/**
 * Validates, cleans, and deduplicates raw CSV rows according to Section 10.4 & 10.5 of DESIGN.md.
 */
export function validateSurveyRows(
  rows: RawCsvRow[],
  mapping: ColumnMapping
): {
  validRecords: SurveyRespondentRecord[];
  summary: ValidationSummary;
} {
  const validRecords: SurveyRespondentRecord[] = [];
  const errors: RowValidationError[] = [];
  const warnings: RowValidationError[] = [];
  const excludedRows: ExcludedRowInfo[] = [];

  const seenIdentifiers = new Set<string>();
  const seenContentFingerprints = new Set<string>();

  rows.forEach((row, index) => {
    const rowNum = index + 2; // 1-based, accounting for header row

    // 1. Identifier extraction
    const rawId = mapping.id ? row[mapping.id]?.trim() : '';
    const rawTimestamp = mapping.timestamp ? row[mapping.timestamp]?.trim() : '';
    const fallbackId = `RESP-${String(rowNum).padStart(4, '0')}`;
    const recordId = rawId || fallbackId;

    // 2. Check for duplicate identifier if explicitly provided
    if (rawId && seenIdentifiers.has(rawId)) {
      const reason = `Duplicate respondent identifier: "${rawId}".`;
      errors.push({ rowNumber: rowNum, field: mapping.id, reason, severity: 'error', rawValue: rawId });
      excludedRows.push({ rowNumber: rowNum, identifier: recordId, reason, rawContent: row });
      return;
    }
    if (rawId) {
      seenIdentifiers.add(rawId);
    }

    // 3. Content-based fingerprint for duplicate survey records
    // Create a normalized fingerprint string of answers
    const contentSignature = Object.entries(row)
      .map(([k, v]) => `${k}:${(v || '').trim().toLowerCase()}`)
      .sort()
      .join('|');

    if (seenContentFingerprints.has(contentSignature)) {
      const reason = 'Identical response record duplicate (same timestamp and survey answers).';
      warnings.push({ rowNumber: rowNum, reason, severity: 'warning' });
      excludedRows.push({ rowNumber: rowNum, identifier: recordId, reason, rawContent: row });
      return;
    }
    seenContentFingerprints.add(contentSignature);

    // 4. Extract Category Membership
    const rawCategories = mapping.categories ? row[mapping.categories] || '' : '';
    const { categories, isExplicitlyNone } = extractCategoriesFromText(rawCategories);

    // 5. Active EMI status validation
    const rawActiveStatus = mapping.hasActiveEmi ? row[mapping.hasActiveEmi]?.trim().toLowerCase() : '';
    let hasActiveEmi = false;

    if (rawActiveStatus) {
      hasActiveEmi = rawActiveStatus.startsWith('y') || rawActiveStatus.includes('true');
    } else {
      // Derive from categories if active status column not mapped
      hasActiveEmi = categories.length > 0;
    }

    // Consistency check: Category list has loans but marked as "No" active EMI
    if (!hasActiveEmi && categories.length > 0) {
      warnings.push({
        rowNumber: rowNum,
        reason: 'Respondent reported "No" active EMI but selected loan categories. Overriding active status to Yes.',
        severity: 'warning',
      });
      hasActiveEmi = true;
    }

    // 6. Number of Active EMIs
    const rawNumEmis = mapping.numActiveEmis ? row[mapping.numActiveEmis]?.trim() : '';
    let numActiveEmis = categories.length;
    if (rawNumEmis) {
      const parsed = parseInt(rawNumEmis, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        numActiveEmis = parsed;
      }
    }

    // 7. Demographics & Financial Behavior with safe fallbacks
    const incomeRange = mapping.incomeRange ? (row[mapping.incomeRange] || '').trim() || 'Not specified' : 'Not specified';
    const emiRange = mapping.emiRange ? (row[mapping.emiRange] || '').trim() || 'Not specified' : 'Not specified';

    const parseSelect = <T extends string>(val: string | undefined, validValues: T[], defaultVal: T): T => {
      if (!val) return defaultVal;
      const match = validValues.find((v) => v.toLowerCase() === val.trim().toLowerCase());
      return match || defaultVal;
    };

    const calculatesCombinedEmi = parseSelect(
      mapping.calculatesCombinedEmi ? row[mapping.calculatesCombinedEmi] : undefined,
      ['Always', 'Sometimes', 'Never', 'Prefer not to say'],
      'Prefer not to say'
    );

    const normalizeDifficulty = (val: string | undefined): 'None' | 'Occasional' | 'Frequent' | 'Severe' | 'Prefer not to say' => {
      if (!val) return 'None';
      const clean = val.trim().toLowerCase();
      if (clean === 'none' || clean === 'never') return 'None';
      if (clean === 'occasional' || clean === 'rarely' || clean === 'sometimes') return 'Occasional';
      if (clean === 'frequent' || clean === 'often') return 'Frequent';
      if (clean === 'severe' || clean === 'always') return 'Severe';
      if (clean.includes('prefer not')) return 'Prefer not to say';
      return parseSelect(val, ['None', 'Occasional', 'Frequent', 'Severe', 'Prefer not to say'], 'None');
    };

    const repaymentDifficulty = normalizeDifficulty(
      mapping.repaymentDifficulty ? row[mapping.repaymentDifficulty] : undefined
    );

    const wouldTakeAnotherEmi = parseSelect(
      mapping.wouldTakeAnotherEmi ? row[mapping.wouldTakeAnotherEmi] : undefined,
      ['Yes', 'Maybe', 'No', 'Prefer not to say'],
      'Prefer not to say'
    );

    const normalizeSavings = (val: string | undefined): 'Yes' | 'Barely' | 'No' | 'Prefer not to say' => {
      if (!val) return 'Prefer not to say';
      const clean = val.trim().toLowerCase();
      if (clean === 'yes') return 'Yes';
      if (clean === 'barely') return 'Barely';
      if (clean === 'no') return 'No';
      if (clean.includes('prefer not')) return 'Prefer not to say';
      const num = parseFloat(clean.replace(/[^0-9.-]/g, ''));
      if (!isNaN(num)) {
        if (num <= 0) return 'No';
        if (num <= 2000) return 'Barely';
        return 'Yes';
      }
      return parseSelect(val, ['Yes', 'Barely', 'No', 'Prefer not to say'], 'Prefer not to say');
    };

    const hasSavingsAfterEmi = normalizeSavings(
      mapping.hasSavingsAfterEmi ? row[mapping.hasSavingsAfterEmi] : undefined
    );

    // Ensure completely empty survey answers are caught
    if (isExplicitlyNone && !hasActiveEmi && categories.length === 0 && incomeRange === 'Not specified') {
      // If row has zero meaningful data across all mapped fields
      if (Object.values(row).every((v) => !v || v.trim().length === 0)) {
        const reason = 'Empty row with no recorded answers.';
        errors.push({ rowNumber: rowNum, reason, severity: 'error' });
        excludedRows.push({ rowNumber: rowNum, identifier: recordId, reason, rawContent: row });
        return;
      }
    }

    validRecords.push({
      id: recordId,
      timestamp: rawTimestamp || undefined,
      hasActiveEmi,
      numActiveEmis,
      categories,
      incomeRange,
      emiRange,
      calculatesCombinedEmi,
      repaymentDifficulty,
      wouldTakeAnotherEmi,
      hasSavingsAfterEmi,
    });
  });

  const summary: ValidationSummary = {
    totalRows: rows.length,
    validRowCount: validRecords.length,
    invalidRowCount: excludedRows.filter((r) => !r.reason.toLowerCase().includes('duplicate')).length,
    duplicateRowCount: excludedRows.filter((r) => r.reason.toLowerCase().includes('duplicate')).length,
    errors,
    warnings,
    excludedRows,
    passedDeduplication: true,
    setConsistencyValid: true,
  };

  return { validRecords, summary };
}
