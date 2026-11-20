/**
 * Set Theory, Principle of Inclusion-Exclusion (PIE), and Venn Partition Interfaces
 * Conforms strictly to DESIGN.md Section 6, 7, 8, 11
 */

export interface SetCardinalityInput {
  totalRespondents: number; // N = |U|
  setA: number; // |A| Personal Loan EMI
  setB: number; // |B| Vehicle Loan EMI
  setC: number; // |C| Consumer Durable / BNPL EMI
  intersectionAB: number; // |A ∩ B| (inclusive)
  intersectionAC: number; // |A ∩ C| (inclusive)
  intersectionBC: number; // |B ∩ C| (inclusive)
  intersectionABC: number; // |A ∩ B ∩ C| (triple intersection)
}

/**
 * The 8 mutually exclusive (disjoint) partition regions.
 * Every respondent belongs to exactly one region.
 * Conservation Invariant: Σ R_i = |U|
 */
export interface DisjointVennRegions {
  onlyA: number; // R1: A \ (B ∪ C)
  onlyB: number; // R2: B \ (A ∪ C)
  onlyC: number; // R3: C \ (A ∪ B)
  onlyAB: number; // R4: (A ∩ B) \ C
  onlyBC: number; // R5: (B ∩ C) \ A
  onlyAC: number; // R6: (A ∩ C) \ B
  allThree: number; // R7: A ∩ B ∩ C (Triple Overlap / Core EMI Trap)
  outside: number; // R8: U \ (A ∪ B ∪ C) (Outside Selected Sets)
}

export type VennRegionId = keyof DisjointVennRegions;

export interface VennRegionDetail {
  id: VennRegionId;
  name: string;
  setExpression: string;
  latexExpression: string;
  exclusiveFormula: string;
  count: number;
  percentageOfTotal: number;
  percentageOfUnion: number;
  color: string;
  description: string;
}

/**
 * Aggregated Inclusion-Exclusion results and identities
 */
export interface PieCalculationResults {
  S1: number; // |A| + |B| + |C|
  S2: number; // |A ∩ B| + |A ∩ C| + |B ∩ C|
  S3: number; // |A ∩ B ∩ C|
  atLeastOne: number; // |A ∪ B ∪ C| = S1 - S2 + S3
  exactlyOne: number; // S1 - 2*S2 + 3*S3
  exactlyTwo: number; // S2 - 3*S3
  atLeastTwo: number; // S2 - 2*S3
  allThree: number; // S3
  outside: number; // N - atLeastOne
  twoSetUnionAB: number; // |A ∪ B| = |A| + |B| - |A ∩ B|
  twoSetComplementAB: number; // N - |A ∪ B|
  twoSetUnionAC: number; // |A ∪ C|
  twoSetUnionBC: number; // |B ∪ C|
}

/**
 * Extended Pigeonhole Principle Inputs and Outputs
 * Formula: floor((n - 1) / m) + 1
 */
export interface PigeonholeInput {
  n: number; // number of items / respondents
  m: number; // number of categories / pigeonholes
}

export interface PigeonholeResult {
  n: number;
  m: number;
  guaranteedMinimum: number; // floor((n - 1) / m) + 1
  formula: string;
  latexFormula: string;
  substitution: string;
  stepByStep: string[];
  interpretation: string;
}

/**
 * Input validation result
 */
export interface SetValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
