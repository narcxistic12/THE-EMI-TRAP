import { SetCardinalityInput, PieCalculationResults } from '../../types/setTheory';
import { calculateDisjointRegions } from './vennRegions';

/**
 * Calculates all Principle of Inclusion-Exclusion (PIE) aggregate results and identities.
 * Strictly adheres to Section 5, 7, and 11.4 of DESIGN.md.
 */
export function calculateThreeSetPIE(data: SetCardinalityInput): PieCalculationResults {
  // S1: Sum of single set cardinalities
  const S1 = data.setA + data.setB + data.setC;

  // S2: Sum of pairwise intersection cardinalities (inclusive)
  const S2 = data.intersectionAB + data.intersectionAC + data.intersectionBC;

  // S3: Cardinality of the triple intersection
  const S3 = data.intersectionABC;

  // Union of three sets via PIE alternating sum
  const atLeastOne = S1 - S2 + S3;

  // Generalized PIE identities
  const exactlyOne = S1 - 2 * S2 + 3 * S3;
  const exactlyTwo = S2 - 3 * S3;
  const atLeastTwo = S2 - 2 * S3;
  const allThree = S3;
  const outside = Math.max(0, data.totalRespondents - atLeastOne);

  // Two-Set PIE identities
  const twoSetUnionAB = data.setA + data.setB - data.intersectionAB;
  const twoSetComplementAB = Math.max(0, data.totalRespondents - twoSetUnionAB);
  const twoSetUnionAC = data.setA + data.setC - data.intersectionAC;
  const twoSetUnionBC = data.setB + data.setC - data.intersectionBC;

  return {
    S1,
    S2,
    S3,
    atLeastOne,
    exactlyOne,
    exactlyTwo,
    atLeastTwo,
    allThree,
    outside,
    twoSetUnionAB,
    twoSetComplementAB,
    twoSetUnionAC,
    twoSetUnionBC,
  };
}

/**
 * Calculates Two-Set Inclusion-Exclusion Union:
 * |A ∪ B| = |A| + |B| − |A ∩ B|
 */
export function calculateTwoSetPIE(
  sizeA: number,
  sizeB: number,
  intersectionAB: number
): { union: number; complement: (totalN: number) => number } {
  const union = sizeA + sizeB - intersectionAB;
  return {
    union,
    complement: (totalN: number) => Math.max(0, totalN - union),
  };
}

/**
 * Verifies that the algebraic Inclusion-Exclusion results match
 * the sum of the disjoint partition regions exactly.
 */
export function verifyPieInvariants(data: SetCardinalityInput): {
  isConsistent: boolean;
  checks: {
    unionMatchesRegions: boolean;
    exactlyOneMatchesRegions: boolean;
    exactlyTwoMatchesRegions: boolean;
    atLeastTwoMatchesRegions: boolean;
    allThreeMatchesRegions: boolean;
    complementMatchesRegions: boolean;
    partitionSumsToTotal: boolean;
  };
} {
  const pie = calculateThreeSetPIE(data);
  const regions = calculateDisjointRegions(data);

  const regionUnion =
    regions.onlyA +
    regions.onlyB +
    regions.onlyC +
    regions.onlyAB +
    regions.onlyBC +
    regions.onlyAC +
    regions.allThree;

  const regionExactlyOne = regions.onlyA + regions.onlyB + regions.onlyC;
  const regionExactlyTwo = regions.onlyAB + regions.onlyBC + regions.onlyAC;
  const regionAtLeastTwo = regionExactlyTwo + regions.allThree;

  const checks = {
    unionMatchesRegions: pie.atLeastOne === regionUnion,
    exactlyOneMatchesRegions: pie.exactlyOne === regionExactlyOne,
    exactlyTwoMatchesRegions: pie.exactlyTwo === regionExactlyTwo,
    atLeastTwoMatchesRegions: pie.atLeastTwo === regionAtLeastTwo,
    allThreeMatchesRegions: pie.allThree === regions.allThree,
    complementMatchesRegions: pie.outside === regions.outside,
    partitionSumsToTotal: regionUnion + regions.outside === data.totalRespondents,
  };

  const isConsistent = Object.values(checks).every(Boolean);

  return { isConsistent, checks };
}
