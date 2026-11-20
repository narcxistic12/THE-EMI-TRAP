import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmiCommitment } from '../../types/calculator';
import { simulateAdditionalEmi } from '../../lib/emiCalculations';
import { formatINR, formatPercentage, parseCleanNumber } from '../../lib/utils';

interface WhatIfSimulatorProps {
  income: number;
  commitments: EmiCommitment[];
}

const PRESET_SIMULATIONS = [
  { label: 'Consumer BNPL', amount: 2000 },
  { label: 'Smartphone EMI', amount: 3000 },
  { label: 'Two-Wheeler Loan', amount: 5500 },
  { label: 'Personal Loan', amount: 10000 },
];

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ income, commitments }) => {
  const [proposedName, setProposedName] = useState('Prospective Gadget BNPL');
  const [proposedAmount, setProposedAmount] = useState('3000');

  const numericAmount = parseCleanNumber(proposedAmount);

  // Compute simulation without mutating existing commitments
  const simulation = simulateAdditionalEmi(income, commitments, {
    name: proposedName,
    monthlyAmount: numericAmount,
  });

  const { current, simulated, difference } = simulation;

  const handleReset = () => {
    setProposedName('Prospective Gadget BNPL');
    setProposedAmount('0');
  };

  return (
    <Card className="border-surface-border bg-white shadow-subtle">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <CardTitle className="font-serif text-base sm:text-lg">What-If Debt Simulator</CardTitle>
            </div>
            <CardDescription>
              Test how taking an additional installment loan will impact your net disposable income before signing.
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="text-[11px] h-7 gap-1 text-content-muted hover:text-content-primary self-start sm:self-auto font-mono"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Scenario
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Input for Proposed EMI */}
        <div className="p-4 rounded-card bg-surface-secondary/40 border border-surface-border space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label htmlFor="sim-name-input" className="block text-[10px] uppercase tracking-widest font-semibold text-content-muted mb-1">
                Hypothetical Commitment Description
              </label>
              <input
                id="sim-name-input"
                type="text"
                value={proposedName}
                onChange={(e) => setProposedName(e.target.value)}
                placeholder="e.g. New Smartphone BNPL"
                className="w-full h-8 px-2.5 rounded-input border border-surface-border bg-white text-xs text-content-primary focus:outline-none focus:border-content-primary/40"
              />
            </div>
            <div className="sm:col-span-5">
              <label htmlFor="sim-amount-input" className="block text-[10px] uppercase tracking-widest font-semibold text-content-muted mb-1">
                Proposed Outflow (₹)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-content-muted text-xs font-mono">₹</span>
                <input
                  id="sim-amount-input"
                  type="text"
                  inputMode="numeric"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                  placeholder="3,000"
                  className="w-full h-8 pl-6 pr-2.5 rounded-input border border-surface-border bg-white text-xs font-mono text-content-primary focus:outline-none focus:border-content-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono text-content-muted mr-1 uppercase">Presets:</span>
            {PRESET_SIMULATIONS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setProposedName(preset.label);
                  setProposedAmount(preset.amount.toString());
                }}
                className={`px-2 py-0.5 rounded-btn text-[11px] font-mono transition-colors ${
                  numericAmount === preset.amount
                    ? 'bg-content-primary text-white font-medium'
                    : 'bg-white text-content-secondary hover:bg-surface-secondary border border-surface-border'
                }`}
              >
                {preset.label} ({formatINR(preset.amount)})
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-side Ledger Comparison Table */}
        <div className="border border-surface-border rounded-card overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-secondary/70 border-b border-surface-border text-content-muted font-semibold uppercase tracking-widest text-[9px] font-mono">
                <th className="py-2.5 px-4">Cash Flow Metric</th>
                <th className="py-2.5 px-4">Baseline (Current)</th>
                <th className="py-2.5 px-4">Projected (Simulated)</th>
                <th className="py-2.5 px-4 text-right">Variance (&Delta;)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {/* Row 1: Total EMI */}
              <tr className="hover:bg-surface-secondary/20 transition-colors">
                <td className="py-3 px-4 font-medium text-content-primary">
                  Total Monthly EMI
                </td>
                <td className="py-3 px-4 font-mono text-content-secondary">
                  {formatINR(current.totalMonthlyEmi)}
                </td>
                <td className="py-3 px-4 font-mono font-medium text-content-primary bg-brand-soft/20">
                  {formatINR(simulated.totalMonthlyEmi)}
                </td>
                <td className="py-3 px-4 font-mono text-right text-brand font-medium">
                  {difference.monthlyEmiChange > 0 ? `+${formatINR(difference.monthlyEmiChange)}` : '₹0'}
                </td>
              </tr>

              {/* Row 2: Percentage Committed */}
              <tr className="hover:bg-surface-secondary/20 transition-colors">
                <td className="py-3 px-4 font-medium text-content-primary">
                  Income Committed Ratio
                </td>
                <td className="py-3 px-4 font-mono text-content-secondary">
                  {formatPercentage(current.incomeCommittedPercentage)}
                </td>
                <td className="py-3 px-4 font-mono font-medium text-content-primary bg-brand-soft/20">
                  {formatPercentage(simulated.incomeCommittedPercentage)}
                </td>
                <td className="py-3 px-4 font-mono text-right text-brand font-medium">
                  {difference.percentagePointsChange !== null && difference.percentagePointsChange > 0
                    ? `+${difference.percentagePointsChange.toFixed(1)}%`
                    : '0%'}
                </td>
              </tr>

              {/* Row 3: Remaining Income */}
              <tr className="hover:bg-surface-secondary/20 transition-colors">
                <td className="py-3 px-4 font-medium text-content-primary">
                  Net Residual Income
                </td>
                <td className="py-3 px-4 font-mono text-content-secondary">
                  {formatINR(current.remainingIncome)}
                </td>
                <td className="py-3 px-4 font-mono font-medium text-content-primary bg-brand-soft/20">
                  {formatINR(simulated.remainingIncome)}
                </td>
                <td className="py-3 px-4 font-mono text-right text-content-muted">
                  {difference.remainingIncomeChange < 0
                    ? `-${formatINR(Math.abs(difference.remainingIncomeChange))}`
                    : '₹0'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual Allocation Delta Comparison */}
        <div className="space-y-2 pt-1 text-xs">
          <div className="flex items-center justify-between text-content-muted text-[11px]">
            <span>Baseline Allocation:</span>
            <span className="font-mono">{formatPercentage(current.incomeCommittedPercentage)}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden flex border border-surface-border/50">
            <div
              className="h-full bg-brand/60"
              style={{ width: `${Math.min(current.incomeCommittedPercentage || 0, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-brand font-medium">Projected with &ldquo;{proposedName}&rdquo;:</span>
            <span className="font-mono font-medium text-brand">
              {formatPercentage(simulated.incomeCommittedPercentage)}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden flex border border-surface-border/50">
            <div
              className="h-full bg-brand"
              style={{ width: `${Math.min(simulated.incomeCommittedPercentage || 0, 100)}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] font-mono text-content-muted/80 italic">
          * Non-mutating simulation: Existing commitments remain untouched.
        </p>
      </CardContent>
    </Card>
  );
};
