import { describe, it, expect } from 'vitest';
import {
  calculateThreeSetPIE,
  calculateTwoSetPIE,
  verifyPieInvariants,
} from '../lib/math/inclusionExclusion';
import {
  calculateDisjointRegions,
  getVennRegionDetails,
} from '../lib/math/vennRegions';
import {
  validateSetInputs,
  ILLUSTRATIVE_SET_DATA,
} from '../lib/math/setTheory';
import {
  calculateExtendedPigeonhole,
  validatePigeonholeInputs,
} from '../lib/math/pigeonhole';
import { SetCardinalityInput } from '../types/setTheory';

describe('Principle of Inclusion-Exclusion (PIE) Engine', () => {
  describe('Two-Set Inclusion-Exclusion', () => {
    it('calculates two-set union and complement correctly for standard inputs', () => {
      // |A| = 40, |B| = 35, |A ∩ B| = 15, N = 100
      const result = calculateTwoSetPIE(40, 35, 15);
      expect(result.union).toBe(60); // 40 + 35 - 15 = 60
      expect(result.complement(100)).toBe(40); // 100 - 60 = 40
    });

    it('handles mutually disjoint two sets correctly', () => {
      // |A| = 25, |B| = 30, |A ∩ B| = 0, N = 100
      const result = calculateTwoSetPIE(25, 30, 0);
      expect(result.union).toBe(55);
      expect(result.complement(100)).toBe(45);
    });

    it('handles full subset condition correctly', () => {
      // B ⊆ A: |A| = 50, |B| = 20, |A ∩ B| = 20, N = 100
      const result = calculateTwoSetPIE(50, 20, 20);
      expect(result.union).toBe(50);
      expect(result.complement(100)).toBe(50);
    });
  });

  describe('Three-Set Inclusion-Exclusion (Illustrative Dataset: N=100)', () => {
    // Expected values from DESIGN.md Section 8 and Section 11:
    // A=40, B=35, C=30, AB=15, AC=12, BC=10, ABC=5
    const data = ILLUSTRATIVE_SET_DATA;

    it('calculates sum cardinalities S1, S2, S3 correctly', () => {
      const pie = calculateThreeSetPIE(data);
      expect(pie.S1).toBe(105); // 40 + 35 + 30
      expect(pie.S2).toBe(37); // 15 + 12 + 10
      expect(pie.S3).toBe(5); // 5
    });

    it('calculates Three-Set Union |A ∪ B ∪ C| via PIE alternating sum correctly', () => {
      const pie = calculateThreeSetPIE(data);
      // |A ∪ B ∪ C| = S1 - S2 + S3 = 105 - 37 + 5 = 73
      expect(pie.atLeastOne).toBe(73);
    });

    it('calculates Generalized PIE partition identities correctly', () => {
      const pie = calculateThreeSetPIE(data);

      // Exactly 1 category: S1 - 2*S2 + 3*S3 = 105 - 2(37) + 3(5) = 105 - 74 + 15 = 46
      expect(pie.exactlyOne).toBe(46);

      // Exactly 2 categories: S2 - 3*S3 = 37 - 3(5) = 37 - 15 = 22
      expect(pie.exactlyTwo).toBe(22);

      // At least 2 categories: S2 - 2*S3 = 37 - 2(5) = 37 - 10 = 27
      expect(pie.atLeastTwo).toBe(27);

      // All 3 categories: S3 = 5
      expect(pie.allThree).toBe(5);

      // Outside selected sets: N - |A ∪ B ∪ C| = 100 - 73 = 27
      expect(pie.outside).toBe(27);
    });

    it('calculates pairwise unions and complements correctly', () => {
      const pie = calculateThreeSetPIE(data);
      // |A ∪ B| = 40 + 35 - 15 = 60; Complement = 100 - 60 = 40
      expect(pie.twoSetUnionAB).toBe(60);
      expect(pie.twoSetComplementAB).toBe(40);

      // |A ∪ C| = 40 + 30 - 12 = 58
      expect(pie.twoSetUnionAC).toBe(58);

      // |B ∪ C| = 35 + 30 - 10 = 55
      expect(pie.twoSetUnionBC).toBe(55);
    });
  });

  describe('Eight Disjoint Venn Partition Regions', () => {
    it('computes exact counts for all 8 mutually exclusive regions', () => {
      const regions = calculateDisjointRegions(ILLUSTRATIVE_SET_DATA);

      // R1: Only A = |A| - |AB| - |AC| + |ABC| = 40 - 15 - 12 + 5 = 18
      expect(regions.onlyA).toBe(18);

      // R2: Only B = |B| - |AB| - |BC| + |ABC| = 35 - 15 - 10 + 5 = 15
      expect(regions.onlyB).toBe(15);

      // R3: Only C = |C| - |AC| - |BC| + |ABC| = 30 - 12 - 10 + 5 = 13
      expect(regions.onlyC).toBe(13);

      // R4: Only AB = |AB| - |ABC| = 15 - 5 = 10
      expect(regions.onlyAB).toBe(10);

      // R5: Only BC = |BC| - |ABC| = 10 - 5 = 5
      expect(regions.onlyBC).toBe(5);

      // R6: Only AC = |AC| - |ABC| = 12 - 5 = 7
      expect(regions.onlyAC).toBe(7);

      // R7: All Three = |ABC| = 5
      expect(regions.allThree).toBe(5);

      // R8: Outside = N - Sum(R1..R7) = 100 - 73 = 27
      expect(regions.outside).toBe(27);
    });

    it('generates accurate metadata and percentages in getVennRegionDetails', () => {
      const details = getVennRegionDetails(ILLUSTRATIVE_SET_DATA);
      expect(details).toHaveLength(8);

      const onlyA = details.find((d) => d.id === 'onlyA');
      expect(onlyA).toBeDefined();
      expect(onlyA?.count).toBe(18);
      expect(onlyA?.percentageOfTotal).toBeCloseTo(18.0, 1);
      expect(onlyA?.percentageOfUnion).toBeCloseTo((18 / 73) * 100, 1);

      const allThree = details.find((d) => d.id === 'allThree');
      expect(allThree).toBeDefined();
      expect(allThree?.count).toBe(5);
      expect(allThree?.percentageOfTotal).toBeCloseTo(5.0, 1);
      expect(allThree?.percentageOfUnion).toBeCloseTo((5 / 73) * 100, 1);

      const outside = details.find((d) => d.id === 'outside');
      expect(outside).toBeDefined();
      expect(outside?.count).toBe(27);
      expect(outside?.percentageOfTotal).toBeCloseTo(27.0, 1);
      expect(outside?.percentageOfUnion).toBe(0);
    });
  });

  describe('Mathematical Conservation Invariants', () => {
    it('satisfies Partition Sum Conservation: Σ R_i = N', () => {
      const regions = calculateDisjointRegions(ILLUSTRATIVE_SET_DATA);
      const sumRegions =
        regions.onlyA +
        regions.onlyB +
        regions.onlyC +
        regions.onlyAB +
        regions.onlyBC +
        regions.onlyAC +
        regions.allThree +
        regions.outside;

      expect(sumRegions).toBe(ILLUSTRATIVE_SET_DATA.totalRespondents);
    });

    it('satisfies Union Decomposition Invariant: Exactly1 + Exactly2 + All3 = Union', () => {
      const pie = calculateThreeSetPIE(ILLUSTRATIVE_SET_DATA);
      expect(pie.exactlyOne + pie.exactlyTwo + pie.allThree).toBe(pie.atLeastOne);
      expect(46 + 22 + 5).toBe(73);
    });

    it('satisfies Universal Complement Invariant: Outside + Union = N', () => {
      const pie = calculateThreeSetPIE(ILLUSTRATIVE_SET_DATA);
      expect(pie.outside + pie.atLeastOne).toBe(ILLUSTRATIVE_SET_DATA.totalRespondents);
      expect(27 + 73).toBe(100);
    });

    it('satisfies Overlap Hierarchy Invariant: AtLeastTwo = ExactlyTwo + AllThree', () => {
      const pie = calculateThreeSetPIE(ILLUSTRATIVE_SET_DATA);
      expect(pie.atLeastTwo).toBe(pie.exactlyTwo + pie.allThree);
      expect(27).toBe(22 + 5);
    });

    it('passes automated verifyPieInvariants comprehensive check', () => {
      const verification = verifyPieInvariants(ILLUSTRATIVE_SET_DATA);
      expect(verification.isConsistent).toBe(true);
      expect(verification.checks.unionMatchesRegions).toBe(true);
      expect(verification.checks.exactlyOneMatchesRegions).toBe(true);
      expect(verification.checks.exactlyTwoMatchesRegions).toBe(true);
      expect(verification.checks.atLeastTwoMatchesRegions).toBe(true);
      expect(verification.checks.allThreeMatchesRegions).toBe(true);
      expect(verification.checks.complementMatchesRegions).toBe(true);
      expect(verification.checks.partitionSumsToTotal).toBe(true);
    });
  });

  describe('Extended Pigeonhole Principle: ⌊(n - 1) / m⌋ + 1', () => {
    it('calculates the standard illustrative benchmark: n=100 respondents across m=4 tiers', () => {
      // floor((100 - 1) / 4) + 1 = floor(99 / 4) + 1 = 24 + 1 = 25
      const result = calculateExtendedPigeonhole({ n: 100, m: 4 });
      expect(result.guaranteedMinimum).toBe(25);
      expect(result.substitution).toContain('⌊(100 - 1) / 4⌋ + 1 = ⌊99 / 4⌋ + 1');
    });

    it('calculates exact results for edge cases of n and m', () => {
      // n = 1, m = 4 -> floor(0 / 4) + 1 = 1
      expect(calculateExtendedPigeonhole({ n: 1, m: 4 }).guaranteedMinimum).toBe(1);

      // n = 4, m = 4 -> floor(3 / 4) + 1 = 1
      expect(calculateExtendedPigeonhole({ n: 4, m: 4 }).guaranteedMinimum).toBe(1);

      // n = 5, m = 4 -> floor(4 / 4) + 1 = 2
      expect(calculateExtendedPigeonhole({ n: 5, m: 4 }).guaranteedMinimum).toBe(2);

      // n = 120, m = 3 -> floor(119 / 3) + 1 = 39 + 1 = 40
      expect(calculateExtendedPigeonhole({ n: 120, m: 3 }).guaranteedMinimum).toBe(40);

      // n = 100, m = 1 -> floor(99 / 1) + 1 = 100
      expect(calculateExtendedPigeonhole({ n: 100, m: 1 }).guaranteedMinimum).toBe(100);
    });

    it('validates pigeonhole input constraints correctly', () => {
      expect(validatePigeonholeInputs(100, 4).isValid).toBe(true);
      expect(validatePigeonholeInputs(0, 4).isValid).toBe(false);
      expect(validatePigeonholeInputs(-10, 4).isValid).toBe(false);
      expect(validatePigeonholeInputs(100, 0).isValid).toBe(false);
      expect(validatePigeonholeInputs(100.5, 4).isValid).toBe(false);
      expect(validatePigeonholeInputs(100, 4.2).isValid).toBe(false);
    });
  });

  describe('Edge Cases in Set Theory & Venn Configurations', () => {
    it('handles completely empty sets correctly', () => {
      const emptyData: SetCardinalityInput = {
        totalRespondents: 100,
        setA: 0,
        setB: 0,
        setC: 0,
        intersectionAB: 0,
        intersectionAC: 0,
        intersectionBC: 0,
        intersectionABC: 0,
      };

      const pie = calculateThreeSetPIE(emptyData);
      const regions = calculateDisjointRegions(emptyData);

      expect(pie.atLeastOne).toBe(0);
      expect(pie.outside).toBe(100);
      expect(regions.onlyA).toBe(0);
      expect(regions.allThree).toBe(0);
      expect(regions.outside).toBe(100);
      expect(verifyPieInvariants(emptyData).isConsistent).toBe(true);
    });

    it('handles identical / complete overlap sets (A = B = C)', () => {
      const identicalData: SetCardinalityInput = {
        totalRespondents: 100,
        setA: 60,
        setB: 60,
        setC: 60,
        intersectionAB: 60,
        intersectionAC: 60,
        intersectionBC: 60,
        intersectionABC: 60,
      };

      const pie = calculateThreeSetPIE(identicalData);
      const regions = calculateDisjointRegions(identicalData);

      // S1 = 180, S2 = 180, S3 = 60 -> Union = 180 - 180 + 60 = 60
      expect(pie.atLeastOne).toBe(60);
      expect(pie.exactlyOne).toBe(0); // 180 - 360 + 180 = 0
      expect(pie.exactlyTwo).toBe(0); // 180 - 180 = 0
      expect(pie.allThree).toBe(60);
      expect(pie.outside).toBe(40);

      expect(regions.onlyA).toBe(0);
      expect(regions.onlyB).toBe(0);
      expect(regions.onlyC).toBe(0);
      expect(regions.onlyAB).toBe(0);
      expect(regions.allThree).toBe(60);
      expect(regions.outside).toBe(40);

      expect(verifyPieInvariants(identicalData).isConsistent).toBe(true);
    });

    it('handles completely pairwise disjoint sets correctly', () => {
      const disjointData: SetCardinalityInput = {
        totalRespondents: 100,
        setA: 25,
        setB: 30,
        setC: 20,
        intersectionAB: 0,
        intersectionAC: 0,
        intersectionBC: 0,
        intersectionABC: 0,
      };

      const pie = calculateThreeSetPIE(disjointData);
      const regions = calculateDisjointRegions(disjointData);

      expect(pie.atLeastOne).toBe(75);
      expect(pie.exactlyOne).toBe(75);
      expect(pie.exactlyTwo).toBe(0);
      expect(pie.allThree).toBe(0);
      expect(pie.outside).toBe(25);

      expect(regions.onlyA).toBe(25);
      expect(regions.onlyB).toBe(30);
      expect(regions.onlyC).toBe(20);
      expect(regions.onlyAB).toBe(0);
      expect(regions.allThree).toBe(0);
      expect(regions.outside).toBe(25);

      expect(verifyPieInvariants(disjointData).isConsistent).toBe(true);
    });

    it('handles triple intersection equal to pairwise intersections', () => {
      // Pairwise intersections are purely triple intersections (no two-only overlap)
      const data: SetCardinalityInput = {
        totalRespondents: 100,
        setA: 40,
        setB: 40,
        setC: 40,
        intersectionAB: 10,
        intersectionAC: 10,
        intersectionBC: 10,
        intersectionABC: 10,
      };

      const regions = calculateDisjointRegions(data);
      expect(regions.onlyAB).toBe(0);
      expect(regions.onlyBC).toBe(0);
      expect(regions.onlyAC).toBe(0);
      expect(regions.allThree).toBe(10);
      expect(verifyPieInvariants(data).isConsistent).toBe(true);
    });
  });

  describe('Mathematical Validation Suite (validateSetInputs)', () => {
    it('approves mathematically valid dataset', () => {
      const result = validateSetInputs(ILLUSTRATIVE_SET_DATA);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects negative numbers and non-integers', () => {
      const negativeInput: SetCardinalityInput = {
        ...ILLUSTRATIVE_SET_DATA,
        setA: -10,
      };
      const res1 = validateSetInputs(negativeInput);
      expect(res1.isValid).toBe(false);
      expect(res1.errors.some((e) => e.includes('non-negative integer'))).toBe(true);

      const nonIntInput: SetCardinalityInput = {
        ...ILLUSTRATIVE_SET_DATA,
        totalRespondents: 100.5,
      };
      const res2 = validateSetInputs(nonIntInput);
      expect(res2.isValid).toBe(false);
      expect(res2.errors.some((e) => e.includes('non-negative integer'))).toBe(true);
    });

    it('detects set sizes exceeding universal set N', () => {
      const invalidData: SetCardinalityInput = {
        ...ILLUSTRATIVE_SET_DATA,
        setA: 120, // N = 100
      };
      const result = validateSetInputs(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('cannot exceed total respondents N'))).toBe(true);
    });

    it('detects pairwise intersection exceeding constituent set sizes', () => {
      const invalidData: SetCardinalityInput = {
        ...ILLUSTRATIVE_SET_DATA,
        setA: 20,
        setB: 35,
        intersectionAB: 25, // exceeds min(20, 35) = 20
      };
      const result = validateSetInputs(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('cannot exceed min(|A|, |B|)'))).toBe(true);
    });

    it('detects triple intersection exceeding pairwise intersection', () => {
      const invalidData: SetCardinalityInput = {
        ...ILLUSTRATIVE_SET_DATA,
        intersectionAB: 15,
        intersectionAC: 12,
        intersectionBC: 10,
        intersectionABC: 11, // exceeds min pairwise BC = 10
      };
      const result = validateSetInputs(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('cannot exceed smallest pairwise intersection'))).toBe(true);
    });

    it('detects negative disjoint partition region resulting from inconsistent intersections', () => {
      // In this case, AB + AC - ABC > A:
      // A = 20, AB = 15, AC = 15, BC = 10, ABC = 5
      // onlyA = 20 - 15 - 15 + 5 = -5 (impossible)
      const invalidData: SetCardinalityInput = {
        totalRespondents: 100,
        setA: 20,
        setB: 40,
        setC: 40,
        intersectionAB: 15,
        intersectionAC: 15,
        intersectionBC: 10,
        intersectionABC: 5,
      };
      const result = validateSetInputs(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Exclusive region "Only A" is negative'))).toBe(true);
    });

    it('detects total union exceeding population N', () => {
      // Disjoint sets summing to 110 > N = 100
      const invalidData: SetCardinalityInput = {
        totalRespondents: 100,
        setA: 50,
        setB: 40,
        setC: 20,
        intersectionAB: 0,
        intersectionAC: 0,
        intersectionBC: 0,
        intersectionABC: 0,
      };
      const result = validateSetInputs(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('exceeds total population N'))).toBe(true);
    });
  });
});

