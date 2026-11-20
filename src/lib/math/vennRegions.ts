import { SetCardinalityInput, DisjointVennRegions, VennRegionDetail } from '../../types/setTheory';

/**
 * Calculates the exact count of respondents in each of the 8 mutually exclusive partition regions.
 * Strictly adheres to Section 4 & Section 6.1 of DESIGN.md.
 */
export function calculateDisjointRegions(data: SetCardinalityInput): DisjointVennRegions {
  // Exclusive pairwise overlaps (subtracting triple intersection)
  const onlyAB = data.intersectionAB - data.intersectionABC;
  const onlyBC = data.intersectionBC - data.intersectionABC;
  const onlyAC = data.intersectionAC - data.intersectionABC;

  // Exclusive single categories (subtracting pairwise and adding back triple intersection)
  const onlyA = data.setA - data.intersectionAB - data.intersectionAC + data.intersectionABC;
  const onlyB = data.setB - data.intersectionAB - data.intersectionBC + data.intersectionABC;
  const onlyC = data.setC - data.intersectionAC - data.intersectionBC + data.intersectionABC;

  // Triple intersection
  const allThree = data.intersectionABC;

  // Union of A, B, and C
  const unionTotal = onlyA + onlyB + onlyC + onlyAB + onlyBC + onlyAC + allThree;

  // Outside all three selected sets
  const outside = data.totalRespondents - unionTotal;

  return {
    onlyA,
    onlyB,
    onlyC,
    onlyAB,
    onlyBC,
    onlyAC,
    allThree,
    outside,
  };
}

/**
 * Returns comprehensive descriptive metadata and calculated percentages for each of the 8 regions.
 */
export function getVennRegionDetails(data: SetCardinalityInput): VennRegionDetail[] {
  const regions = calculateDisjointRegions(data);
  const total = Math.max(1, data.totalRespondents);
  const unionTotal = Math.max(
    1,
    regions.onlyA +
      regions.onlyB +
      regions.onlyC +
      regions.onlyAB +
      regions.onlyBC +
      regions.onlyAC +
      regions.allThree
  );

  return [
    {
      id: 'onlyA',
      name: 'Only Personal Loan',
      setExpression: 'A \\ (B ∪ C)',
      latexExpression: 'A \\setminus (B \\cup C)',
      exclusiveFormula: '|A| - |A ∩ B| - |A ∩ C| + |A ∩ B ∩ C|',
      count: regions.onlyA,
      percentageOfTotal: (regions.onlyA / total) * 100,
      percentageOfUnion: (regions.onlyA / unionTotal) * 100,
      color: '#3973B9',
      description: 'Respondents who only hold a Personal Loan and no vehicle or consumer durable EMI.',
    },
    {
      id: 'onlyB',
      name: 'Only Vehicle Loan',
      setExpression: 'B \\ (A ∪ C)',
      latexExpression: 'B \\setminus (A \\cup C)',
      exclusiveFormula: '|B| - |A ∩ B| - |B ∩ C| + |A ∩ B ∩ C|',
      count: regions.onlyB,
      percentageOfTotal: (regions.onlyB / total) * 100,
      percentageOfUnion: (regions.onlyB / unionTotal) * 100,
      color: '#C18428',
      description: 'Respondents who only hold a Vehicle Loan and no personal or consumer durable EMI.',
    },
    {
      id: 'onlyC',
      name: 'Only Consumer Durable',
      setExpression: 'C \\ (A ∪ B)',
      latexExpression: 'C \\setminus (A \\cup B)',
      exclusiveFormula: '|C| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|',
      count: regions.onlyC,
      percentageOfTotal: (regions.onlyC / total) * 100,
      percentageOfUnion: (regions.onlyC / unionTotal) * 100,
      color: '#8066B2',
      description: 'Respondents who only hold a Consumer Durable / BNPL EMI and no personal or vehicle loan.',
    },
    {
      id: 'onlyAB',
      name: 'Personal & Vehicle Only',
      setExpression: '(A ∩ B) \\ C',
      latexExpression: '(A \\cap B) \\setminus C',
      exclusiveFormula: '|A ∩ B| - |A ∩ B ∩ C|',
      count: regions.onlyAB,
      percentageOfTotal: (regions.onlyAB / total) * 100,
      percentageOfUnion: (regions.onlyAB / unionTotal) * 100,
      color: '#2E7A75',
      description: 'Respondents servicing both Personal and Vehicle loans, but no consumer durable EMI.',
    },
    {
      id: 'onlyBC',
      name: 'Vehicle & Consumer Only',
      setExpression: '(B ∩ C) \\ A',
      latexExpression: '(B \\cap C) \\setminus A',
      exclusiveFormula: '|B ∩ C| - |A ∩ B ∩ C|',
      count: regions.onlyBC,
      percentageOfTotal: (regions.onlyBC / total) * 100,
      percentageOfUnion: (regions.onlyBC / unionTotal) * 100,
      color: '#9C6E48',
      description: 'Respondents servicing both Vehicle and Consumer durable loans, but no personal loan.',
    },
    {
      id: 'onlyAC',
      name: 'Personal & Consumer Only',
      setExpression: '(A ∩ C) \\ B',
      latexExpression: '(A \\cap C) \\setminus B',
      exclusiveFormula: '|A ∩ C| - |A ∩ B ∩ C|',
      count: regions.onlyAC,
      percentageOfTotal: (regions.onlyAC / total) * 100,
      percentageOfUnion: (regions.onlyAC / unionTotal) * 100,
      color: '#5568A5',
      description: 'Respondents servicing both Personal and Consumer durable loans, but no vehicle loan.',
    },
    {
      id: 'allThree',
      name: 'All Three Categories (The Core EMI Trap)',
      setExpression: 'A ∩ B ∩ C',
      latexExpression: 'A \\cap B \\cap C',
      exclusiveFormula: '|A ∩ B ∩ C|',
      count: regions.allThree,
      percentageOfTotal: (regions.allThree / total) * 100,
      percentageOfUnion: (regions.allThree / unionTotal) * 100,
      color: '#176B57',
      description: 'Respondents simultaneously servicing Personal, Vehicle, and Consumer durable loans—the maximum debt fragmentation cohort.',
    },
    {
      id: 'outside',
      name: 'Outside Selected Categories',
      setExpression: 'U \\ (A ∪ B ∪ C)',
      latexExpression: 'U \\setminus (A \\cup B \\cup C)',
      exclusiveFormula: 'N - |A ∪ B ∪ C|',
      count: regions.outside,
      percentageOfTotal: (regions.outside / total) * 100,
      percentageOfUnion: 0,
      color: '#8A928C',
      description: 'Respondents who do not service any of the three selected categories (may have unselected loans or zero debt).',
    },
  ];
}

