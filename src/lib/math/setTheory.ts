import { SetCardinalityInput, SetValidationResult } from '../../types/setTheory';
import { calculateDisjointRegions } from './vennRegions';

/**
 * Official Illustrative Dataset from DESIGN.md Section 8 & Section 11
 * N = 100 respondents
 * Set A (Personal Loans) = 40
 * Set B (Vehicle Loans) = 35
 * Set C (Consumer Durable / BNPL) = 30
 * A ∩ B = 15
 * A ∩ C = 12
 * B ∩ C = 10
 * A ∩ B ∩ C = 5
 */
export const ILLUSTRATIVE_SET_DATA: SetCardinalityInput = {
  totalRespondents: 100,
  setA: 40,
  setB: 35,
  setC: 30,
  intersectionAB: 15,
  intersectionAC: 12,
  intersectionBC: 10,
  intersectionABC: 5,
};

/**
 * Validates mathematical consistency of set inputs according to Section 7 & 10.5 of DESIGN.md
 */
export function validateSetInputs(data: SetCardinalityInput): SetValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Helper to check for non-negative integer
  const isNonNegativeInt = (val: number) => Number.isInteger(val) && val >= 0;

  // 1. Integer and non-negativity checks
  if (!isNonNegativeInt(data.totalRespondents)) {
    errors.push('Total respondents (N) must be a non-negative integer.');
  }
  if (!isNonNegativeInt(data.setA)) errors.push('Set |A| must be a non-negative integer.');
  if (!isNonNegativeInt(data.setB)) errors.push('Set |B| must be a non-negative integer.');
  if (!isNonNegativeInt(data.setC)) errors.push('Set |C| must be a non-negative integer.');
  if (!isNonNegativeInt(data.intersectionAB)) errors.push('|A ∩ B| must be a non-negative integer.');
  if (!isNonNegativeInt(data.intersectionAC)) errors.push('|A ∩ C| must be a non-negative integer.');
  if (!isNonNegativeInt(data.intersectionBC)) errors.push('|B ∩ C| must be a non-negative integer.');
  if (!isNonNegativeInt(data.intersectionABC)) errors.push('|A ∩ B ∩ C| must be a non-negative integer.');

  // If there are fundamental integer errors, return early
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // 2. Set bounds relative to Universal Set N
  if (data.setA > data.totalRespondents) {
    errors.push(`Set |A| (${data.setA}) cannot exceed total respondents N (${data.totalRespondents}).`);
  }
  if (data.setB > data.totalRespondents) {
    errors.push(`Set |B| (${data.setB}) cannot exceed total respondents N (${data.totalRespondents}).`);
  }
  if (data.setC > data.totalRespondents) {
    errors.push(`Set |C| (${data.setC}) cannot exceed total respondents N (${data.totalRespondents}).`);
  }

  // 3. Pairwise intersections must not exceed individual sets
  if (data.intersectionAB > Math.min(data.setA, data.setB)) {
    errors.push(
      `Pairwise intersection |A ∩ B| (${data.intersectionAB}) cannot exceed min(|A|, |B|) = ${Math.min(
        data.setA,
        data.setB
      )}.`
    );
  }
  if (data.intersectionAC > Math.min(data.setA, data.setC)) {
    errors.push(
      `Pairwise intersection |A ∩ C| (${data.intersectionAC}) cannot exceed min(|A|, |C|) = ${Math.min(
        data.setA,
        data.setC
      )}.`
    );
  }
  if (data.intersectionBC > Math.min(data.setB, data.setC)) {
    errors.push(
      `Pairwise intersection |B ∩ C| (${data.intersectionBC}) cannot exceed min(|B|, |C|) = ${Math.min(
        data.setB,
        data.setC
      )}.`
    );
  }

  // 4. Triple intersection must not exceed any pairwise intersection
  const minPairwise = Math.min(data.intersectionAB, data.intersectionAC, data.intersectionBC);
  if (data.intersectionABC > minPairwise) {
    errors.push(
      `Triple intersection |A ∩ B ∩ C| (${data.intersectionABC}) cannot exceed smallest pairwise intersection (${minPairwise}).`
    );
  }

  // 5. Verify that all 8 exclusive partition regions are non-negative
  const regions = calculateDisjointRegions(data);
  if (regions.onlyA < 0) {
    errors.push(`Exclusive region "Only A" is negative (${regions.onlyA}). Inconsistent pairwise intersections.`);
  }
  if (regions.onlyB < 0) {
    errors.push(`Exclusive region "Only B" is negative (${regions.onlyB}). Inconsistent pairwise intersections.`);
  }
  if (regions.onlyC < 0) {
    errors.push(`Exclusive region "Only C" is negative (${regions.onlyC}). Inconsistent pairwise intersections.`);
  }
  if (regions.onlyAB < 0) {
    errors.push(`Exclusive region "A and B only" is negative (${regions.onlyAB}). |A ∩ B ∩ C| exceeds |A ∩ B|.`);
  }
  if (regions.onlyBC < 0) {
    errors.push(`Exclusive region "B and C only" is negative (${regions.onlyBC}). |A ∩ B ∩ C| exceeds |B ∩ C|.`);
  }
  if (regions.onlyAC < 0) {
    errors.push(`Exclusive region "A and C only" is negative (${regions.onlyAC}). |A ∩ B ∩ C| exceeds |A ∩ C|.`);
  }
  if (regions.outside < 0) {
    errors.push(
      `The union |A ∪ B ∪ C| exceeds total population N (${data.totalRespondents}) by ${Math.abs(regions.outside)}.`
    );
  }

  // 6. Conservation Invariant: Sum of all 8 exclusive regions must equal N
  const sumOfRegions =
    regions.onlyA +
    regions.onlyB +
    regions.onlyC +
    regions.onlyAB +
    regions.onlyBC +
    regions.onlyAC +
    regions.allThree +
    regions.outside;

  if (sumOfRegions !== data.totalRespondents) {
    errors.push(`Sum of all eight partition regions (${sumOfRegions}) does not equal total respondents N (${data.totalRespondents}).`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

