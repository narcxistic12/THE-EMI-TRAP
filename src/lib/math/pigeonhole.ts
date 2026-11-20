import { PigeonholeInput, PigeonholeResult } from '../../types/setTheory';

/**
 * Validates inputs for the Extended Pigeonhole Principle:
 * n and m must be positive integers.
 */
export function validatePigeonholeInputs(n: number, m: number): { isValid: boolean; error?: string } {
  if (!Number.isInteger(n) || n <= 0) {
    return { isValid: false, error: 'Number of objects (n) must be a positive integer (n ≥ 1).' };
  }
  if (!Number.isInteger(m) || m <= 0) {
    return { isValid: false, error: 'Number of groups (m) must be a positive integer (m ≥ 1).' };
  }
  return { isValid: true };
}

/**
 * Calculates the Extended Pigeonhole Principle:
 * Guaranteed minimum in at least one category: ⌊(n - 1) / m⌋ + 1
 * Strictly follows Module 1 Discrete Mathematics specification.
 */
export function calculateExtendedPigeonhole(input: PigeonholeInput): PigeonholeResult {
  const { n, m } = input;

  // Safe fallback if invalid
  if (!Number.isInteger(n) || n <= 0 || !Number.isInteger(m) || m <= 0) {
    return {
      n: Math.max(1, Math.floor(n) || 1),
      m: Math.max(1, Math.floor(m) || 1),
      guaranteedMinimum: 0,
      formula: '⌊(n - 1) / m⌋ + 1',
      latexFormula: '\\lfloor \\frac{n - 1}{m} \\rfloor + 1',
      substitution: 'Invalid inputs provided',
      stepByStep: ['Inputs must be positive integers.'],
      interpretation: 'Calculation unavailable for invalid inputs.',
    };
  }

  const numerator = n - 1;
  const quotient = Math.floor(numerator / m);
  const guaranteedMinimum = quotient + 1;

  const formula = '⌊(n - 1) / m⌋ + 1';
  const latexFormula = '\\lfloor \\frac{n - 1}{m} \\rfloor + 1';
  const substitution = `⌊(${n} - 1) / ${m}⌋ + 1 = ⌊${numerator} / ${m}⌋ + 1`;

  const stepByStep = [
    `Subtract 1 from total objects n: ${n} - 1 = ${numerator}`,
    `Divide by number of categories m and apply floor function: ⌊${numerator} / ${m}⌋ = ${quotient}`,
    `Add 1 to determine the guaranteed minimum: ${quotient} + 1 = ${guaranteedMinimum}`,
  ];

  const interpretation = `If ${n} survey respondents are distributed across ${m} mutually exclusive EMI commitment tiers (e.g. 0 EMIs, 1 EMI, 2 EMIs, 3+ EMIs), at least one tier is mathematically guaranteed to contain at least ${guaranteedMinimum} respondents.`;

  return {
    n,
    m,
    guaranteedMinimum,
    formula,
    latexFormula,
    substitution,
    stepByStep,
    interpretation,
  };
}

