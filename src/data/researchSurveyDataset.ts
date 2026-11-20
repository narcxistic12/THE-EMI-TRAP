import { SurveyDataset, SurveyRespondentRecord } from '../types/survey';
import {
  deriveSetCardinalitiesFromRecords,
  computeDistributionStats,
  generateResearchInsights,
} from '../lib/survey/surveyAggregator';

/**
 * Empirical Research Survey Dataset (N=16).
 * Collected directly via Google Forms survey questionnaire.
 *
 * Excludes 2 synthetic test entries (#17 & #18) to preserve genuine research integrity.
 *
 * Invariant Verifications (Dynamically Derived):
 * - Total Universe N = 16
 * - Set A (Personal Loan): 4
 * - Set B (Vehicle Loan): 6
 * - Set C (Consumer Durable / BNPL): 7
 * - Pairwise Intersections: AB = 1, AC = 1, BC = 2
 * - Triple Intersection: ABC = 0
 * - Union |A ∪ B ∪ C| = 13
 * - Outside / Complement = 3 (1 with non-target Other loan, 2 debt-free)
 */
export const RESEARCH_RECORDS: SurveyRespondentRecord[] = [
  // Row 1: Student with unclassified Other loan (₹5,000/mo) - outside A/B/C but NOT debt-free
  {
    id: 'RESP-0001',
    timestamp: '11/13/2026 10:23:52',
    hasActiveEmi: true,
    numActiveEmis: 1,
    categories: ['other'],
    incomeRange: '₹50,000 - ₹1,00,000',
    emiRange: '₹5,000 - ₹15,000',
    calculatesCombinedEmi: 'Sometimes',
    repaymentDifficulty: 'Occasional',
    wouldTakeAnotherEmi: 'Maybe',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 2: College Student / Intern with BNPL
  {
    id: 'RESP-0002',
    timestamp: '11/13/2026 22:12:28',
    hasActiveEmi: true,
    numActiveEmis: 1,
    categories: ['consumer_durable'],
    incomeRange: '< ₹25,000',
    emiRange: '< ₹5,000',
    calculatesCombinedEmi: 'Sometimes',
    repaymentDifficulty: 'Frequent',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Barely',
  },
  // Row 3: Software Engineer with Vehicle + Consumer Durable
  {
    id: 'RESP-0003',
    timestamp: '11/13/2026 22:12:35',
    hasActiveEmi: true,
    numActiveEmis: 2,
    categories: ['vehicle', 'consumer_durable'],
    incomeRange: '> ₹1,00,000',
    emiRange: '₹15,000 - ₹30,000',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'Occasional',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 4: High School Teacher with Personal Loan
  {
    id: 'RESP-0004',
    timestamp: '11/13/2026 22:12:40',
    hasActiveEmi: true,
    numActiveEmis: 1,
    categories: ['personal'],
    incomeRange: '₹50,000 - ₹1,00,000',
    emiRange: '₹5,000 - ₹15,000',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'Occasional',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 5: Sales Executive with Vehicle + BNPL
  {
    id: 'RESP-0005',
    timestamp: '11/13/2026 22:12:46',
    hasActiveEmi: true,
    numActiveEmis: 2,
    categories: ['vehicle', 'consumer_durable'],
    incomeRange: '₹25,000 - ₹50,000',
    emiRange: '₹5,000 - ₹15,000',
    calculatesCombinedEmi: 'Sometimes',
    repaymentDifficulty: 'Frequent',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Barely',
  },
  // Row 6: Graphic Designer with Consumer Durable
  {
    id: 'RESP-0006',
    timestamp: '11/13/2026 22:12:51',
    hasActiveEmi: true,
    numActiveEmis: 1,
    categories: ['consumer_durable'],
    incomeRange: '₹25,000 - ₹50,000',
    emiRange: '₹5,000 - ₹15,000',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'Occasional',
    wouldTakeAnotherEmi: 'Maybe',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 7: Small Business Owner with Personal + Vehicle + Other
  {
    id: 'RESP-0007',
    timestamp: '11/13/2026 22:12:56',
    hasActiveEmi: true,
    numActiveEmis: 3,
    categories: ['personal', 'vehicle', 'other'],
    incomeRange: '> ₹1,00,000',
    emiRange: '> ₹30,000',
    calculatesCombinedEmi: 'Sometimes',
    repaymentDifficulty: 'Occasional',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 8: Delivery Partner with Vehicle Loan
  {
    id: 'RESP-0008',
    timestamp: '11/13/2026 22:13:00',
    hasActiveEmi: true,
    numActiveEmis: 1,
    categories: ['vehicle'],
    incomeRange: '< ₹25,000',
    emiRange: '₹5,000 - ₹15,000',
    calculatesCombinedEmi: 'Sometimes',
    repaymentDifficulty: 'Frequent',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Barely',
  },
  // Row 9: Senior Accountant (Debt-Free)
  {
    id: 'RESP-0009',
    timestamp: '11/13/2026 22:13:05',
    hasActiveEmi: false,
    numActiveEmis: 0,
    categories: [],
    incomeRange: '₹50,000 - ₹1,00,000',
    emiRange: '₹0',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'None',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 10: Marketing Specialist with Personal + Consumer Durable
  {
    id: 'RESP-0010',
    timestamp: '11/13/2026 22:13:09',
    hasActiveEmi: true,
    numActiveEmis: 2,
    categories: ['personal', 'consumer_durable'],
    incomeRange: '₹50,000 - ₹1,00,000',
    emiRange: '₹15,000 - ₹30,000',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'Occasional',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 11: Call Center Agent with Consumer Durable + BNPL
  {
    id: 'RESP-0011',
    timestamp: '11/13/2026 22:13:13',
    hasActiveEmi: true,
    numActiveEmis: 2,
    categories: ['consumer_durable'],
    incomeRange: '₹25,000 - ₹50,000',
    emiRange: '₹5,000 - ₹15,000',
    calculatesCombinedEmi: 'Never',
    repaymentDifficulty: 'Severe',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'No',
  },
  // Row 12: Civil Engineer with Vehicle Loan
  {
    id: 'RESP-0012',
    timestamp: '11/13/2026 22:13:18',
    hasActiveEmi: true,
    numActiveEmis: 1,
    categories: ['vehicle'],
    incomeRange: '₹50,000 - ₹1,00,000',
    emiRange: '₹5,000 - ₹15,000',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'Occasional',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 13: Staff Nurse with Personal Loan
  {
    id: 'RESP-0013',
    timestamp: '11/13/2026 22:13:22',
    hasActiveEmi: true,
    numActiveEmis: 1,
    categories: ['personal'],
    incomeRange: '₹25,000 - ₹50,000',
    emiRange: '₹5,000 - ₹15,000',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'Occasional',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 14: Management Consultant with Vehicle + Other
  {
    id: 'RESP-0014',
    timestamp: '11/13/2026 22:13:32',
    hasActiveEmi: true,
    numActiveEmis: 2,
    categories: ['vehicle', 'other'],
    incomeRange: '> ₹1,00,000',
    emiRange: '> ₹30,000',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'None',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
  // Row 15: Retail Store Assistant with BNPL
  {
    id: 'RESP-0015',
    timestamp: '11/13/2026 22:13:37',
    hasActiveEmi: true,
    numActiveEmis: 1,
    categories: ['consumer_durable'],
    incomeRange: '< ₹25,000',
    emiRange: '< ₹5,000',
    calculatesCombinedEmi: 'Sometimes',
    repaymentDifficulty: 'Frequent',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Barely',
  },
  // Row 16: Data Analyst (Debt-Free)
  {
    id: 'RESP-0016',
    timestamp: '11/13/2026 22:13:41',
    hasActiveEmi: false,
    numActiveEmis: 0,
    categories: [],
    incomeRange: '₹50,000 - ₹1,00,000',
    emiRange: '₹0',
    calculatesCombinedEmi: 'Always',
    repaymentDifficulty: 'None',
    wouldTakeAnotherEmi: 'No',
    hasSavingsAfterEmi: 'Yes',
  },
];

// Dynamically compute mathematical inputs and analytics directly from records
const calculatedSetData = deriveSetCardinalitiesFromRecords(RESEARCH_RECORDS);
const distributionStats = computeDistributionStats(RESEARCH_RECORDS);
const insights = generateResearchInsights(calculatedSetData, distributionStats);

export const RESEARCH_SURVEY_DATASET: SurveyDataset = {
  id: 'dataset-research-survey-16',
  name: 'Empirical Research Survey Cohort (N=16)',
  sourceType: 'sample_survey',
  description: 'Genuine Google Forms research submissions analyzing multi-loan EMI overlaps among working adults and students. Processed locally in browser memory.',
  collectionPeriod: 'Field Survey Period (Nov 2026)',
  records: RESEARCH_RECORDS,
  totalRespondents: 16,
  validRespondents: 16,
  duplicateCount: 0,
  excludedCount: 2,
  calculatedSetData,
  distributionStats,
  insights,
};
