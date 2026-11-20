export interface EmiCommitment {
  id: string;
  name: string;
  monthlyAmount: number;
  tenureMonths?: number;
}

export interface EmiCalculationResult {
  totalMonthlyEmi: number;
  monthlyIncome: number;
  incomeCommittedPercentage: number | null;
  remainingIncome: number;
}

export interface WhatIfSimulationInput {
  name: string;
  monthlyAmount: number;
  tenureMonths?: number;
}

export interface WhatIfComparisonResult {
  current: EmiCalculationResult;
  simulated: EmiCalculationResult;
  difference: {
    monthlyEmiChange: number;
    percentagePointsChange: number | null;
    remainingIncomeChange: number;
  };
}

