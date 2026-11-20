import React from 'react';
import { CreditCard, Percent, Wallet, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { EmiCommitment, EmiCalculationResult } from '../../types/calculator';
import { formatINR, formatPercentage } from '../../lib/utils';

interface SummaryPanelProps {
  summary: EmiCalculationResult;
  commitments: EmiCommitment[];
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ summary, commitments }) => {
  const { totalMonthlyEmi, monthlyIncome, incomeCommittedPercentage, remainingIncome } = summary;

  // Percentage safe capping for bar fill
  const committedPercentNum = incomeCommittedPercentage !== null ? incomeCommittedPercentage : 0;
  const barCommittedWidth = Math.min(Math.max(committedPercentNum, 0), 100);
  const isOverCommitted = committedPercentNum > 100;

  return (
    <div className="space-y-4">
      {/* 3 Metric Cards with Refined Editorial Architecture */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Total Monthly EMI */}
        <Card className="p-5 border-surface-border bg-white">
          <div className="flex items-center justify-between text-content-muted mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest">Total Monthly EMI</span>
            <CreditCard className="w-3.5 h-3.5 text-brand" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-medium tracking-tight text-content-primary">
            {formatINR(totalMonthlyEmi)}
          </div>
          <p className="text-[11px] text-content-secondary mt-1">
            Aggregated across {commitments.length} {commitments.length === 1 ? 'obligation' : 'obligations'}
          </p>
        </Card>

        {/* Card 2: Percentage of Income Committed */}
        <Card className="p-5 border-surface-border bg-white">
          <div className="flex items-center justify-between text-content-muted mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest">Income Committed</span>
            <Percent className="w-3.5 h-3.5 text-brand" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-medium tracking-tight text-content-primary">
            {formatPercentage(incomeCommittedPercentage)}
          </div>
          <p className="text-[11px] text-content-secondary mt-1">
            {monthlyIncome > 0
              ? `Of ${formatINR(monthlyIncome)} net remuneration`
              : 'Enter income to evaluate ratio'}
          </p>
        </Card>

        {/* Card 3: Remaining Income */}
        <Card className="p-5 border-surface-border bg-white">
          <div className="flex items-center justify-between text-content-muted mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest">Residual Cashflow</span>
            <Wallet className="w-3.5 h-3.5 text-brand" />
          </div>
          <div
            className={`text-2xl sm:text-3xl font-mono font-medium tracking-tight ${
              remainingIncome < 0 ? 'text-semantic-danger' : 'text-content-primary'
            }`}
          >
            {formatINR(remainingIncome)}
          </div>
          <p className="text-[11px] text-content-secondary mt-1">
            {remainingIncome < 0 ? 'Negative cash flow margin' : 'Available before living costs'}
          </p>
        </Card>
      </div>

      {/* Income Allocation Visual */}
      <Card className="p-6 bg-white border-surface-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-content-muted">
            Monthly Inflow Allocation
          </h4>
          <span className="text-xs font-mono text-content-secondary">
            {formatPercentage(incomeCommittedPercentage)} Committed Outflow
          </span>
        </div>

        {/* Minimalist Segmented Bar (5px height) */}
        <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden flex border border-surface-border/50">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${barCommittedWidth}%` }}
            title={`Committed to EMIs: ${formatPercentage(incomeCommittedPercentage)}`}
          />
          {!isOverCommitted && (
            <div
              className="h-full bg-emerald-100/70 transition-all duration-300"
              style={{ width: `${100 - barCommittedWidth}%` }}
              title="Remaining available income"
            />
          )}
        </div>

        {/* Minimalist Legend */}
        <div className="flex items-center justify-between text-xs text-content-secondary mt-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
            <span>Committed to EMIs: <strong className="font-mono text-content-primary">{formatINR(totalMonthlyEmi)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-200 shrink-0" />
            <span>Residual: <strong className="font-mono text-content-primary">{formatINR(remainingIncome)}</strong></span>
          </div>
        </div>

        {isOverCommitted && (
          <p className="text-xs text-semantic-warning mt-3 font-medium bg-amber-50/50 p-2.5 rounded-sm border border-amber-200/40">
            Note: Total monthly EMI commitments currently exceed your entered net take-home remuneration.
          </p>
        )}

        {/* Multi-Commitment Distribution Bar */}
        {commitments.length > 1 && totalMonthlyEmi > 0 && (
          <div className="mt-5 pt-4 border-t border-surface-border/60">
            <p className="text-[10px] font-mono uppercase tracking-widest text-content-muted mb-2">
              Portfolio Distribution:
            </p>
            <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5 bg-surface-secondary">
              {commitments.map((c, i) => {
                const share = (c.monthlyAmount / totalMonthlyEmi) * 100;
                const colors = ['bg-[#176B57]', 'bg-[#3973B9]', 'bg-[#C18428]', 'bg-[#8066B2]', 'bg-[#5C9D83]'];
                const color = colors[i % colors.length];
                return (
                  <div
                    key={c.id}
                    className={`${color} h-full transition-all`}
                    style={{ width: `${share}%` }}
                    title={`${c.name}: ${formatINR(c.monthlyAmount)} (${share.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-2.5 text-[11px] text-content-secondary">
              {commitments.map((c, i) => {
                const colors = ['bg-[#176B57]', 'bg-[#3973B9]', 'bg-[#C18428]', 'bg-[#8066B2]', 'bg-[#5C9D83]'];
                const color = colors[i % colors.length];
                const share = ((c.monthlyAmount / totalMonthlyEmi) * 100).toFixed(0);
                return (
                  <div key={c.id} className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                    <span className="truncate max-w-[130px]">{c.name}</span>
                    <span className="font-mono text-content-muted">({share}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mandatory Educational Disclaimer in Quiet Italic Serif */}
        <div className="mt-5 p-3.5 rounded-card bg-surface-secondary/40 border border-surface-border flex items-start gap-2.5 text-xs text-content-secondary">
          <Info className="w-3.5 h-3.5 text-content-muted shrink-0 mt-0.5" />
          <p className="font-serif italic text-content-muted leading-relaxed">
            &ldquo;Remaining income is calculated before rent, food, utilities, transportation and other household expenses.&rdquo;
          </p>
        </div>
      </Card>
    </div>
  );
};
