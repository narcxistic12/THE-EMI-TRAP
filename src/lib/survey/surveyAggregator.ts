import { SetCardinalityInput } from '../../types/setTheory';
import {
  DistributionStatistics,
  ResearchInsight,
  SurveyDataset,
  SurveyRespondentRecord,
  ValidationSummary,
  DatasetSourceType,
} from '../../types/survey';
import { validateSetInputs } from '../math/setTheory';
import { calculateThreeSetPIE } from '../math/inclusionExclusion';

/**
 * Derives exact Set Cardinality Input from validated respondent records.
 * Set A: Personal Loan EMI
 * Set B: Vehicle Loan EMI
 * Set C: Consumer Durable / BNPL EMI
 */
export function deriveSetCardinalitiesFromRecords(
  records: SurveyRespondentRecord[]
): SetCardinalityInput {
  const totalRespondents = records.length;

  let countA = 0;
  let countB = 0;
  let countC = 0;
  let countAB = 0;
  let countAC = 0;
  let countBC = 0;
  let countABC = 0;

  records.forEach((r) => {
    const hasA = r.categories.includes('personal');
    const hasB = r.categories.includes('vehicle');
    const hasC = r.categories.includes('consumer_durable');

    if (hasA) countA++;
    if (hasB) countB++;
    if (hasC) countC++;

    if (hasA && hasB) countAB++;
    if (hasA && hasC) countAC++;
    if (hasB && hasC) countBC++;

    if (hasA && hasB && hasC) countABC++;
  });

  return {
    totalRespondents,
    setA: countA,
    setB: countB,
    setC: countC,
    intersectionAB: countAB,
    intersectionAC: countAC,
    intersectionBC: countBC,
    intersectionABC: countABC,
  };
}

/**
 * Computes descriptive distribution statistics across all survey dimensions.
 */
export function computeDistributionStats(
  records: SurveyRespondentRecord[]
): DistributionStatistics {
  const total = Math.max(1, records.length);

  // 1. Category Distribution
  let countPersonal = 0;
  let countVehicle = 0;
  let countConsumer = 0;
  let countOther = 0;

  records.forEach((r) => {
    if (r.categories.includes('personal')) countPersonal++;
    if (r.categories.includes('vehicle')) countVehicle++;
    if (r.categories.includes('consumer_durable')) countConsumer++;
    if (r.categories.includes('other')) countOther++;
  });

  const categoryCounts = [
    { name: 'Personal Loan', count: countPersonal, percentage: (countPersonal / total) * 100, color: '#3973B9' },
    { name: 'Vehicle Loan', count: countVehicle, percentage: (countVehicle / total) * 100, color: '#C18428' },
    { name: 'Consumer Durable', count: countConsumer, percentage: (countConsumer / total) * 100, color: '#8066B2' },
    { name: 'Other Obligations', count: countOther, percentage: (countOther / total) * 100, color: '#59675F' },
  ];

  // 2. Active EMI Count Distribution (0, 1, 2, 3, 4+)
  const activeEmiMap: Record<string, number> = { '0': 0, '1': 0, '2': 0, '3': 0, '4+': 0 };
  records.forEach((r) => {
    const n = r.numActiveEmis;
    if (n === 0) activeEmiMap['0']++;
    else if (n === 1) activeEmiMap['1']++;
    else if (n === 2) activeEmiMap['2']++;
    else if (n === 3) activeEmiMap['3']++;
    else activeEmiMap['4+']++;
  });

  const activeEmiCounts = Object.entries(activeEmiMap).map(([range, count]) => ({
    range: range === '0' ? '0 EMIs' : range === '1' ? '1 EMI' : range === '4+' ? '4+ EMIs' : `${range} EMIs`,
    count,
    percentage: (count / total) * 100,
  }));

  // 3. Monthly Income Range Distribution
  const incomeCountsMap: Record<string, number> = {};
  records.forEach((r) => {
    const inc = r.incomeRange || 'Not specified';
    incomeCountsMap[inc] = (incomeCountsMap[inc] || 0) + 1;
  });
  const incomeCounts = Object.entries(incomeCountsMap).map(([range, count]) => ({
    range,
    count,
    percentage: (count / total) * 100,
  }));

  // 4. Monthly Total EMI Range Distribution
  const emiCountsMap: Record<string, number> = {};
  records.forEach((r) => {
    const emi = r.emiRange || 'Not specified';
    emiCountsMap[emi] = (emiCountsMap[emi] || 0) + 1;
  });
  const emiAmountCounts = Object.entries(emiCountsMap).map(([range, count]) => ({
    range,
    count,
    percentage: (count / total) * 100,
  }));

  // 5. Repayment Difficulty Distribution
  const difficultyMap: Record<string, number> = { None: 0, Occasional: 0, Frequent: 0, Severe: 0, 'Prefer not to say': 0 };
  records.forEach((r) => {
    const diff = r.repaymentDifficulty;
    difficultyMap[diff] = (difficultyMap[diff] || 0) + 1;
  });
  const difficultyCounts = Object.entries(difficultyMap).map(([sentiment, count]) => ({
    sentiment,
    count,
    percentage: (count / total) * 100,
  }));

  // 6. Savings Remaining Status
  const savingsMap: Record<string, number> = { Yes: 0, Barely: 0, No: 0, 'Prefer not to say': 0 };
  records.forEach((r) => {
    const sav = r.hasSavingsAfterEmi;
    savingsMap[sav] = (savingsMap[sav] || 0) + 1;
  });
  const savingsCounts = Object.entries(savingsMap).map(([status, count]) => ({
    status,
    count,
    percentage: (count / total) * 100,
  }));

  return {
    categoryCounts,
    activeEmiCounts,
    incomeCounts,
    emiAmountCounts,
    difficultyCounts,
    savingsCounts,
  };
}

/**
 * Derives factual, descriptive research insights strictly from mathematical results.
 * Avoids unsupported claims or causal leaps.
 */
export function generateResearchInsights(
  setData: SetCardinalityInput,
  distStats: DistributionStatistics
): ResearchInsight[] {
  const pie = calculateThreeSetPIE(setData);
  const total = Math.max(1, setData.totalRespondents);

  // 1. Dominant Loan Category
  const sortedCategories = [...distStats.categoryCounts].sort((a, b) => b.count - a.count);
  const dominant = sortedCategories[0];

  // 2. Multi-Loan Overlap
  const multiOverlapCount = pie.atLeastTwo;
  const multiOverlapPct = ((multiOverlapCount / total) * 100).toFixed(1);

  // 3. Core EMI Trap
  const coreTrapCount = pie.allThree;
  const coreTrapPct = ((coreTrapCount / total) * 100).toFixed(1);

  // 4. Outside Selected Sets
  const outsideCount = pie.outside;
  const outsidePct = ((outsideCount / total) * 100).toFixed(1);

  return [
    {
      id: 'dominant-category',
      category: 'dominance',
      title: 'Dominant Credit Category',
      value: `${dominant?.name || 'N/A'} (${dominant?.count || 0})`,
      statement: `${dominant?.name} is the most frequently serviced loan type in this cohort, held by ${dominant?.percentage.toFixed(1)}% of respondents.`,
      significance: 'Highlights the primary debt entry point among surveyed participants.',
    },
    {
      id: 'multi-loan-compounding',
      category: 'overlap',
      title: 'Multi-Category Debt Overlap',
      value: `${multiOverlapCount} Respondents (${multiOverlapPct}%)`,
      statement: `Exactly ${multiOverlapCount} respondents (${multiOverlapPct}%) concurrently service obligations in two or more of the three analyzed EMI categories.`,
      significance: 'Multi-loan fragmentation increases cash flow vulnerability due to asynchronous tenure horizons.',
    },
    {
      id: 'core-trap',
      category: 'core_trap',
      title: 'Core EMI Trap (All 3 Categories)',
      value: `${coreTrapCount} Respondents (${coreTrapPct}%)`,
      statement: `A core segment of ${coreTrapCount} respondents (${coreTrapPct}%) holds Personal, Vehicle, and Consumer Durable agreements simultaneously.`,
      significance: 'Represents the maximum structural fragmentation cohort within the surveyed population.',
    },
    {
      id: 'outside-selected',
      category: 'outside',
      title: 'Outside Selected Categories',
      value: `${outsideCount} Respondents (${outsidePct}%)`,
      statement: `${outsideCount} respondents (${outsidePct}%) do not hold Personal, Vehicle, or Consumer Durable EMIs (they may be debt-free or hold unselected loans such as mortgages).`,
      significance: 'Confirms that set complement does not conflate unselected loans with debt-free status.',
    },
  ];
}

/**
 * Builds a validated SurveyDataset from parsed rows and mapping.
 */
export function buildSurveyDataset(
  id: string,
  name: string,
  sourceType: DatasetSourceType,
  description: string,
  validRecords: SurveyRespondentRecord[],
  summary: ValidationSummary,
  fileMeta?: { fileName: string; fileSizeBytes: number; collectionPeriod?: string }
): SurveyDataset {
  const calculatedSetData = deriveSetCardinalitiesFromRecords(validRecords);

  // Validate math consistency
  const mathValidation = validateSetInputs(calculatedSetData);
  if (!mathValidation.isValid) {
    console.warn('Mathematical validation warning for survey dataset:', mathValidation.errors);
  }

  const distributionStats = computeDistributionStats(validRecords);
  const insights = generateResearchInsights(calculatedSetData, distributionStats);

  return {
    id,
    name,
    sourceType,
    description,
    fileName: fileMeta?.fileName,
    fileSizeBytes: fileMeta?.fileSizeBytes,
    collectionPeriod: fileMeta?.collectionPeriod || 'Contemporary Survey Period',
    records: validRecords,
    totalRespondents: calculatedSetData.totalRespondents,
    validRespondents: validRecords.length,
    duplicateCount: summary.duplicateRowCount,
    excludedCount: summary.excludedRows.length,
    calculatedSetData,
    distributionStats,
    insights,
  };
}

