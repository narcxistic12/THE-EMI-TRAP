import { SetCardinalityInput } from './setTheory';

export type EmiCategoryKey = 'personal' | 'vehicle' | 'consumer_durable' | 'other';

/**
 * Standard survey respondent record matching DESIGN.md Section 10.3
 */
export interface SurveyRespondentRecord {
  id: string;
  timestamp?: string;
  hasActiveEmi: boolean;
  numActiveEmis: number; // 0, 1, 2, 3, 4+
  categories: EmiCategoryKey[];
  incomeRange: string;
  emiRange: string;
  calculatesCombinedEmi: 'Always' | 'Sometimes' | 'Never' | 'Prefer not to say';
  repaymentDifficulty: 'None' | 'Occasional' | 'Frequent' | 'Severe' | 'Prefer not to say';
  wouldTakeAnotherEmi: 'Yes' | 'Maybe' | 'No' | 'Prefer not to say';
  hasSavingsAfterEmi: 'Yes' | 'Barely' | 'No' | 'Prefer not to say';
}

export type DatasetSourceType = 'illustrative' | 'sample_survey' | 'uploaded_csv';

/**
 * Analytical Distribution Statistics for Research Dashboard Charts
 */
export interface DistributionStatistics {
  categoryCounts: { name: string; count: number; percentage: number; color: string }[];
  activeEmiCounts: { range: string; count: number; percentage: number }[];
  incomeCounts: { range: string; count: number; percentage: number }[];
  emiAmountCounts: { range: string; count: number; percentage: number }[];
  difficultyCounts: { sentiment: string; count: number; percentage: number }[];
  savingsCounts: { status: string; count: number; percentage: number }[];
}

/**
 * Core Research Insights
 */
export interface ResearchInsight {
  id: string;
  category: 'dominance' | 'overlap' | 'core_trap' | 'outside' | 'cash_flow';
  title: string;
  value: string;
  statement: string;
  significance: string;
}

/**
 * Top-Level Survey Dataset Model
 */
export interface SurveyDataset {
  id: string;
  name: string;
  sourceType: DatasetSourceType;
  description: string;
  fileName?: string;
  fileSizeBytes?: number;
  collectionPeriod?: string;
  records: SurveyRespondentRecord[];
  totalRespondents: number; // N
  validRespondents: number;
  duplicateCount: number;
  excludedCount: number;
  calculatedSetData: SetCardinalityInput;
  distributionStats: DistributionStatistics;
  insights: ResearchInsight[];
}

/**
 * Raw Row from CSV
 */
export type RawCsvRow = Record<string, string>;

/**
 * Canonical Survey Fields for Column Mapping
 */
export type CanonicalSurveyField =
  | 'id'
  | 'timestamp'
  | 'hasActiveEmi'
  | 'numActiveEmis'
  | 'categories'
  | 'personalLoan'
  | 'vehicleLoan'
  | 'consumerDurableLoan'
  | 'otherLoan'
  | 'incomeRange'
  | 'emiRange'
  | 'calculatesCombinedEmi'
  | 'repaymentDifficulty'
  | 'wouldTakeAnotherEmi'
  | 'hasSavingsAfterEmi';

export interface ColumnDefinition {
  key: CanonicalSurveyField;
  label: string;
  description: string;
  required: boolean;
  category: 'identity' | 'membership' | 'demographics' | 'behavior';
  sampleValues: string[];
}

export type ColumnMapping = Partial<Record<CanonicalSurveyField, string>>;

/**
 * Validation & Error Reporting
 */
export interface RowValidationError {
  rowNumber: number;
  field?: string;
  reason: string;
  severity: 'error' | 'warning';
  rawValue?: string;
}

export interface ExcludedRowInfo {
  rowNumber: number;
  identifier: string;
  reason: string;
  rawContent: RawCsvRow;
}

export interface ValidationSummary {
  totalRows: number;
  validRowCount: number;
  invalidRowCount: number;
  duplicateRowCount: number;
  errors: RowValidationError[];
  warnings: RowValidationError[];
  excludedRows: ExcludedRowInfo[];
  passedDeduplication: boolean;
  setConsistencyValid: boolean;
}

/**
 * CSV Parse Result
 */
export interface CsvParseResult {
  isValid: boolean;
  headers: string[];
  rows: RawCsvRow[];
  totalRows: number;
  errors: string[];
  warnings: string[];
  suggestedMapping: ColumnMapping;
}
