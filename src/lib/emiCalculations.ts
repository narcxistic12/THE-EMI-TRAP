import { EmiCommitment, EmiCalculationResult, WhatIfSimulationInput, WhatIfComparisonResult } from '../types/calculator';

/**
 * Total Monthly EMI = Σ EMI_i
 * If commitments array is empty, returns 0.
 */
export function calculateTotalEMI(commitments: Pick<EmiCommitment, 'monthlyAmount'>[]): number {
  if (!Array.isArray(commitments) || commitments.length === 0) {
    return 0;
  }
  return commitments.reduce((sum, item) => {
    const amount = Number(item.monthlyAmount);
    return sum + (isNaN(amount) || amount < 0 ? 0 : amount);
  }, 0);
}

/**
 * EMI-to-Income Ratio = (Total Monthly EMI / Monthly Take-Home Income) * 100
 * Returns null if income <= 0 to prevent division by zero.
 */
export function calculateEMIRatio(totalEMI: number, income: number): number | null {
  if (isNaN(income) || income <= 0 || isNaN(totalEMI)) {
    return null;
  }
  return (totalEMI / income) * 100;
}

/**
 * Remaining Monthly Income = Monthly Take-Home Income - Total Monthly EMI
 */
export function calculateRemainingIncome(income: number, totalEMI: number): number {
  const safeIncome = isNaN(income) || income < 0 ? 0 : income;
  const safeEMI = isNaN(totalEMI) || totalEMI < 0 ? 0 : totalEMI;
  return safeIncome - safeEMI;
}

/**
 * Calculate complete EMI summary for an individual
 */
export function calculateEmiSummary(
  income: number,
  commitments: Pick<EmiCommitment, 'monthlyAmount'>[]
): EmiCalculationResult {
  const safeIncome = isNaN(income) || income < 0 ? 0 : income;
  const totalMonthlyEmi = calculateTotalEMI(commitments);
  const incomeCommittedPercentage = calculateEMIRatio(totalMonthlyEmi, safeIncome);
  const remainingIncome = calculateRemainingIncome(safeIncome, totalMonthlyEmi);

  return {
    totalMonthlyEmi,
    monthlyIncome: safeIncome,
    incomeCommittedPercentage,
    remainingIncome,
  };
}

/**
 * Simulate adding an additional hypothetical EMI without mutating existing commitments.
 * Returns a side-by-side Before vs After comparison.
 */
export function simulateAdditionalEmi(
  income: number,
  existingCommitments: Pick<EmiCommitment, 'monthlyAmount'>[],
  proposed: WhatIfSimulationInput
): WhatIfComparisonResult {
  const current = calculateEmiSummary(income, existingCommitments);

  const proposedAmount = isNaN(proposed.monthlyAmount) || proposed.monthlyAmount < 0 ? 0 : proposed.monthlyAmount;
  const simulatedCommitments = [...existingCommitments, { monthlyAmount: proposedAmount }];
  const simulated = calculateEmiSummary(income, simulatedCommitments);

  const monthlyEmiChange = simulated.totalMonthlyEmi - current.totalMonthlyEmi;
  const percentagePointsChange =
    simulated.incomeCommittedPercentage !== null && current.incomeCommittedPercentage !== null
      ? simulated.incomeCommittedPercentage - current.incomeCommittedPercentage
      : simulated.incomeCommittedPercentage;
  const remainingIncomeChange = simulated.remainingIncome - current.remainingIncome;

  return {
    current,
    simulated,
    difference: {
      monthlyEmiChange,
      percentagePointsChange,
      remainingIncomeChange,
    },
  };
}

/**
 * Validate income input
 */
export function validateIncome(income: number): { isValid: boolean; error?: string } {
  if (isNaN(income)) {
    return { isValid: false, error: 'Please enter a valid numeric amount' };
  }
  if (income < 0) {
    return { isValid: false, error: 'Income cannot be negative' };
  }
  return { isValid: true };
}

/**
 * Validate commitment inputs
 */
export function validateCommitment(
  commitment: Partial<EmiCommitment>
): { isValid: boolean; errors: { name?: string; amount?: string; tenure?: string } } {
  const errors: { name?: string; amount?: string; tenure?: string } = {};

  if (!commitment.name || commitment.name.trim().length === 0) {
    errors.name = 'Loan or purchase description is required';
  }

  if (commitment.monthlyAmount === undefined || isNaN(commitment.monthlyAmount) || commitment.monthlyAmount <= 0) {
    errors.amount = 'Monthly EMI must be greater than ₹0';
  }

  if (commitment.tenureMonths !== undefined && commitment.tenureMonths !== null) {
    if (isNaN(commitment.tenureMonths) || commitment.tenureMonths < 1) {
      errors.tenure = 'Tenure must be at least 1 month';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

