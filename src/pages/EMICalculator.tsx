import React, { useState } from 'react';
import { IncomeInput } from '../components/calculator/IncomeInput';
import { CommitmentManager } from '../components/calculator/CommitmentManager';
import { SummaryPanel } from '../components/calculator/SummaryPanel';
import { WhatIfSimulator } from '../components/calculator/WhatIfSimulator';
import { EmiCommitment } from '../types/calculator';
import { calculateEmiSummary } from '../lib/emiCalculations';

// Default initial commitments from DESIGN.md Section 5.3
const INITIAL_COMMITMENTS: EmiCommitment[] = [
  { id: '1', name: 'Smartphone (BNPL)', monthlyAmount: 2500, tenureMonths: 12 },
  { id: '2', name: 'Two-Wheeler Loan', monthlyAmount: 5500, tenureMonths: 24 },
  { id: '3', name: 'Work Laptop', monthlyAmount: 2000, tenureMonths: 6 },
];

export const EMICalculator: React.FC = () => {
  // Personal finance state
  const [income, setIncome] = useState<number>(35000);
  const [commitments, setCommitments] = useState<EmiCommitment[]>(INITIAL_COMMITMENTS);

  // Derived live calculation summary
  const summary = calculateEmiSummary(income, commitments);

  const handleAddCommitment = (newCommitment: Omit<EmiCommitment, 'id'>) => {
    const id = Date.now().toString();
    setCommitments((prev) => [...prev, { ...newCommitment, id }]);
  };

  const handleUpdateCommitment = (updated: EmiCommitment) => {
    setCommitments((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteCommitment = (id: string) => {
    setCommitments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLoadExample = () => {
    setIncome(35000);
    setCommitments(INITIAL_COMMITMENTS);
  };

  const handleClearAll = () => {
    setCommitments([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header Strip */}
      <div className="pb-4 border-b border-surface-border flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-content-primary">
            Personal Cash Flow &amp; Commitment Planning
          </h1>
          <p className="text-sm sm:text-base text-content-secondary mt-1.5">
            Calculate your combined monthly loan payments against your take-home salary.
          </p>
        </div>
        <div className="text-xs sm:text-sm font-mono text-content-muted">
          All values in INR (₹)
        </div>
      </div>

      {/* 2-Column Responsive Layout (DESIGN.md Section 5.1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inputs Workspace */}
        <div className="lg:col-span-6 space-y-6">
          <IncomeInput income={income} onIncomeChange={setIncome} />

          <CommitmentManager
            commitments={commitments}
            onAddCommitment={handleAddCommitment}
            onUpdateCommitment={handleUpdateCommitment}
            onDeleteCommitment={handleDeleteCommitment}
            onLoadExample={handleLoadExample}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Right Column: Live Results & What-If Simulator */}
        <div className="lg:col-span-6 space-y-6">
          <SummaryPanel summary={summary} commitments={commitments} />

          <WhatIfSimulator income={income} commitments={commitments} />
        </div>
      </div>
    </div>
  );
};
