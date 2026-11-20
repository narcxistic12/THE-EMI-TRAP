import { SurveyDataset, SurveyRespondentRecord } from '../types/survey';
import { ILLUSTRATIVE_SET_DATA } from '../lib/math/setTheory';
import { computeDistributionStats, generateResearchInsights } from '../lib/survey/surveyAggregator';

/**
 * Generates the official 100-respondent illustrative benchmark dataset from DESIGN.md Section 8 & Section 11.
 * N = 100, A = 40, B = 35, C = 30, AB = 15, AC = 12, BC = 10, ABC = 5.
 * 8 Disjoint Partitions:
 * - Only A: 18
 * - Only B: 15
 * - Only C: 13
 * - Only AB: 10
 * - Only AC: 7
 * - Only BC: 5
 * - All Three: 5
 * - Outside: 27
 */
function generateIllustrativeRecords(): SurveyRespondentRecord[] {
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
        id: `DEMO-${String(idCounter++).padStart(3, '0')}`,
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

  // 1. Only A (Personal Loan): 18
  addRecords(18, ['personal'], '₹25,000 - ₹50,000', '₹5,000 - ₹15,000', 'Occasional', 'Barely');

  // 2. Only B (Vehicle Loan): 15
  addRecords(15, ['vehicle'], '₹25,000 - ₹50,000', '₹5,000 - ₹15,000', 'None', 'Yes');

  // 3. Only C (Consumer Durable / BNPL): 13
  addRecords(13, ['consumer_durable'], '< ₹25,000', '< ₹5,000', 'None', 'Yes');

  // 4. Only AB (Personal & Vehicle): 10
  addRecords(10, ['personal', 'vehicle'], '₹50,000 - ₹1,00,000', '₹15,000 - ₹30,000', 'Frequent', 'Barely');

  // 5. Only AC (Personal & Consumer): 7
  addRecords(7, ['personal', 'consumer_durable'], '₹25,000 - ₹50,000', '₹5,000 - ₹15,000', 'Occasional', 'Barely');

  // 6. Only BC (Vehicle & Consumer): 5
  addRecords(5, ['vehicle', 'consumer_durable'], '₹50,000 - ₹1,00,000', '₹15,000 - ₹30,000', 'Occasional', 'Yes');

  // 7. All Three (Core EMI Trap): 5
  addRecords(5, ['personal', 'vehicle', 'consumer_durable'], '₹50,000 - ₹1,00,000', '> ₹30,000', 'Severe', 'No');

  // 8. Outside Selected Sets: 27 (12 have unselected loans e.g. home loans, 15 are debt-free)
  addRecords(12, ['other'], '₹50,000 - ₹1,00,000', '₹15,000 - ₹30,000', 'None', 'Yes');
  addRecords(15, [], '> ₹1,00,000', '₹0', 'None', 'Yes');

  return records;
}

const records = generateIllustrativeRecords();
const calculatedSetData = ILLUSTRATIVE_SET_DATA;
const distributionStats = computeDistributionStats(records);
const insights = generateResearchInsights(calculatedSetData, distributionStats);

export const ILLUSTRATIVE_DATASET: SurveyDataset = {
  id: 'dataset-illustrative-100',
  name: 'Illustrative Benchmark Dataset',
  sourceType: 'illustrative',
  description: 'Theoretical demonstration model of 100 respondents strictly conforming to DESIGN.md Section 8 & Section 11.',
  collectionPeriod: 'Educational Benchmark Specification',
  records,
  totalRespondents: 100,
  validRespondents: 100,
  duplicateCount: 0,
  excludedCount: 0,
  calculatedSetData,
  distributionStats,
  insights,
};

