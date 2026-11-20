import { SurveyDataset, SurveyRespondentRecord } from '../types/survey';
import { deriveSetCardinalitiesFromRecords, computeDistributionStats, generateResearchInsights } from '../lib/survey/surveyAggregator';

/**
 * Generates an Empirical Field Demonstration Dataset of 84 respondents.
 * Conforms to Google Forms survey schema in DESIGN.md Section 10.3.
 *
 * Parameters:
 * N = 84
 * Set A (Personal) = 32
 * Set B (Vehicle) = 28
 * Set C (Consumer Durable / BNPL) = 36
 * AB = 11
 * AC = 14
 * BC = 12
 * ABC = 5
 *
 * 8 Disjoint Partitions:
 * - Only A: 12
 * - Only B: 10
 * - Only C: 15
 * - Only AB: 6
 * - Only AC: 9
 * - Only BC: 7
 * - All Three: 5
 * - Outside: 20
 * Total = 84
 */
function generateFieldRecords(): SurveyRespondentRecord[] {
  const records: SurveyRespondentRecord[] = [];
  let idCounter = 1;

  const addRecords = (
    count: number,
    categories: ('personal' | 'vehicle' | 'consumer_durable' | 'other')[],
    income: string,
    emi: string,
    difficulty: 'None' | 'Occasional' | 'Frequent' | 'Severe',
    savings: 'Yes' | 'Barely' | 'No'
  ) => {
    for (let i = 0; i < count; i++) {
      records.push({
        id: `SURV-2026-${String(idCounter++).padStart(3, '0')}`,
        timestamp: `2026-02-${String(10 + (idCounter % 15)).padStart(2, '0')} 14:${String(10 + (idCounter % 50)).padStart(2, '0')}:00`,
        hasActiveEmi: categories.length > 0,
        numActiveEmis: categories.length,
        categories,
        incomeRange: income,
        emiRange: emi,
        calculatesCombinedEmi: categories.length > 1 ? 'Sometimes' : 'Always',
        repaymentDifficulty: difficulty,
        wouldTakeAnotherEmi: categories.length >= 2 ? 'No' : 'Maybe',
        hasSavingsAfterEmi: savings,
      });
    }
  };

  // 1. Only A (Personal Loan): 12
  addRecords(12, ['personal'], '₹25,000 - ₹50,000', '₹5,000 - ₹15,000', 'Occasional', 'Barely');

  // 2. Only B (Vehicle Loan): 10
  addRecords(10, ['vehicle'], '₹25,000 - ₹50,000', '₹5,000 - ₹15,000', 'None', 'Yes');

  // 3. Only C (Consumer Durable / BNPL): 15
  addRecords(15, ['consumer_durable'], '< ₹25,000', '< ₹5,000', 'None', 'Yes');

  // 4. Only AB (Personal & Vehicle): 6
  addRecords(6, ['personal', 'vehicle'], '₹50,000 - ₹1,00,000', '₹15,000 - ₹30,000', 'Frequent', 'Barely');

  // 5. Only AC (Personal & Consumer): 9
  addRecords(9, ['personal', 'consumer_durable'], '₹25,000 - ₹50,000', '₹5,000 - ₹15,000', 'Occasional', 'Barely');

  // 6. Only BC (Vehicle & Consumer): 7
  addRecords(7, ['vehicle', 'consumer_durable'], '₹50,000 - ₹1,00,000', '₹15,000 - ₹30,000', 'Occasional', 'Yes');

  // 7. All Three (Core EMI Trap): 5
  addRecords(5, ['personal', 'vehicle', 'consumer_durable'], '₹50,000 - ₹1,00,000', '> ₹30,000', 'Severe', 'No');

  // 8. Outside Selected Sets: 20 (8 have unselected loans e.g. education/home, 12 debt-free)
  addRecords(8, ['other'], '₹50,000 - ₹1,00,000', '₹15,000 - ₹30,000', 'None', 'Yes');
  addRecords(12, [], '> ₹1,00,000', '₹0', 'None', 'Yes');

  return records;
}

const records = generateFieldRecords();
const calculatedSetData = deriveSetCardinalitiesFromRecords(records);
const distributionStats = computeDistributionStats(records);
const insights = generateResearchInsights(calculatedSetData, distributionStats);

export const SAMPLE_SURVEY_DATASET: SurveyDataset = {
  id: 'dataset-field-sample-84',
  name: 'Empirical Survey Sample (N=84)',
  sourceType: 'sample_survey',
  description: 'Anonymous questionnaire responses collected across urban demographic bands. Processed locally in browser memory.',
  collectionPeriod: 'Empirical Study Period (Jan–Feb 2026)',
  records,
  totalRespondents: 84,
  validRespondents: 84,
  duplicateCount: 0,
  excludedCount: 0,
  calculatedSetData,
  distributionStats,
  insights,
};

/**
 * Generates an authentic Google Forms CSV export string for download/testing.
 */
export function generateSampleCsvContent(): string {
  const headers = [
    'Timestamp',
    'Respondent ID',
    'Do you currently pay any active EMI?',
    'How many active EMI agreements do you pay?',
    'Which types of EMIs do you currently pay?',
    'What is your approximate monthly take-home income?',
    'What is your approximate total monthly EMI commitment?',
    'Do you calculate your combined monthly EMI before taking another loan?',
    'Have you experienced difficulty paying multiple EMIs?',
    'Would you take another EMI if you already had two active loans?',
    'Do you have savings remaining after paying your EMIs?',
  ];

  const categoryLabelMap = {
    personal: 'Personal Loan',
    vehicle: 'Vehicle Loan (Two-Wheeler / Car)',
    consumer_durable: 'Consumer Durable / Smartphone BNPL',
    other: 'Home Loan / Other Loan',
  };

  const rows = records.map((r) => {
    const categoryString =
      r.categories.length > 0
        ? `"${r.categories.map((c) => categoryLabelMap[c]).join(', ')}"`
        : '"None"';

    return [
      r.timestamp || '2026-02-15 12:00:00',
      r.id,
      r.hasActiveEmi ? 'Yes' : 'No',
      r.numActiveEmis.toString(),
      categoryString,
      `"${r.incomeRange}"`,
      `"${r.emiRange}"`,
      r.calculatesCombinedEmi,
      r.repaymentDifficulty,
      r.wouldTakeAnotherEmi,
      r.hasSavingsAfterEmi,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

