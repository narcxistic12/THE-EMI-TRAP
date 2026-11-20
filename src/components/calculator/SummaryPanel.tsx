import React from 'react';
import { CreditCard, Percent, Wallet, ShieldCheck, AlertCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { EmiCommitment, EmiCalculationResult } from '../../types/calculator';
import { formatINR, formatPercentage } from '../../lib/utils';
import { SpotlightCard } from '../animated/SpotlightCard';
import { AnimatedCounter } from '../animated/AnimatedCounter';

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

  // Financial Health Zone
  const getHealthBadge = () => {
    if (monthlyIncome <= 0 || commitments.length === 0) {
      return null;
    }
    if (committedPercentNum > 50) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs sm:text-sm font-mono font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Critical: EMI Trap Risk (&gt;50%)
        </span>
      );
    }
    if (committedPercentNum >= 35) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs sm:text-sm font-mono font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Caution: Moderate Overlap (35–50%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-mono font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Healthy Debt Ratio (&lt;35%)
      </span>
    );
  };

  const maxTenure = Math.max(12, ...commitments.map((c) => c.tenureMonths || 12));

  return (
    <div className="space-y-4">
      {/* 3 Metric Cards with Spotlight Liquid Glass Lensing */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Total Monthly EMI */}
        <SpotlightCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-content-muted mb-2.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider">Total Monthly EMI</span>
            <CreditCard className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium tracking-tight text-content-primary">
            <AnimatedCounter value={totalMonthlyEmi} prefix="₹" />
          </div>
          <p className="text-xs sm:text-sm text-content-secondary mt-1.5">
            Across {commitments.length} active {commitments.length === 1 ? 'loan' : 'loans'}
          </p>
        </SpotlightCard>

        {/* Card 2: Percentage of Income Committed */}
        <SpotlightCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-content-muted mb-2.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider">Income Committed</span>
            <Percent className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium tracking-tight text-content-primary">
            {incomeCommittedPercentage !== null ? (
              <AnimatedCounter value={incomeCommittedPercentage} suffix="%" decimals={1} />
            ) : (
              '—'
            )}
          </div>
          <p className="text-xs sm:text-sm text-content-secondary mt-1.5">
            {monthlyIncome > 0
              ? `Of ${formatINR(monthlyIncome)} take-home`
              : 'Enter income to calculate'}
          </p>
        </SpotlightCard>

        {/* Card 3: Remaining Income */}
        <SpotlightCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between text-content-muted mb-2.5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider">Remaining Cash</span>
            <Wallet className="w-4 h-4 text-brand" />
          </div>
          <div
            className={`text-2xl sm:text-3xl lg:text-4xl font-mono font-medium tracking-tight ${
              remainingIncome < 0 ? 'text-semantic-danger' : 'text-content-primary'
            }`}
          >
            <AnimatedCounter value={remainingIncome} prefix="₹" />
          </div>
          <p className="text-xs sm:text-sm text-content-secondary mt-1.5">
            {remainingIncome < 0 ? 'Monthly deficit' : 'Left for living costs'}
          </p>
        </SpotlightCard>
      </div>

      {/* Income Allocation Visual & Health Gauge */}
      <Card variant="default" className="p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <h4 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted font-semibold">
              Monthly Inflow Allocation
            </h4>
            {getHealthBadge()}
          </div>
          <span className="text-xs sm:text-sm font-mono text-content-secondary font-medium">
            {formatPercentage(incomeCommittedPercentage)} Committed Outflow
          </span>
        </div>

        {/* Segmented Bar */}
        <div className="w-full h-2.5 rounded-full bg-surface-secondary overflow-hidden flex border border-surface-border/50">
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
        <div className="flex items-center justify-between text-xs sm:text-sm text-content-secondary mt-3.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
            <span>Committed to EMIs: <strong className="font-mono text-content-primary">{formatINR(totalMonthlyEmi)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 shrink-0" />
            <span>Residual: <strong className="font-mono text-content-primary">{formatINR(remainingIncome)}</strong></span>
          </div>
        </div>

        {isOverCommitted && (
          <p className="text-xs sm:text-sm text-semantic-warning mt-3.5 font-medium bg-amber-50/70 p-3 rounded-card border border-amber-200/50">
            Total monthly EMIs exceed your monthly take-home income.
          </p>
        )}

        {/* Multi-Commitment Distribution Bar */}
        {commitments.length > 1 && totalMonthlyEmi > 0 && (
          <div className="mt-5 pt-4 border-t border-surface-border/60">
            <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted mb-2.5 font-semibold">
              Loan Breakdown:
            </p>
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5 bg-surface-secondary">
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
            <div className="flex flex-wrap gap-4 mt-3 text-xs sm:text-sm text-content-secondary">
              {commitments.map((c, i) => {
                const colors = ['bg-[#176B57]', 'bg-[#3973B9]', 'bg-[#C18428]', 'bg-[#8066B2]', 'bg-[#5C9D83]'];
                const color = colors[i % colors.length];
                const share = ((c.monthlyAmount / totalMonthlyEmi) * 100).toFixed(0);
                return (
                  <div key={c.id} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="truncate max-w-[150px] font-medium">{c.name}</span>
                    <span className="font-mono text-content-muted">({share}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tenure Asynchrony Timeline (The Core Mechanism of the Trap) */}
        {commitments.length > 1 && (
          <div className="mt-5 pt-4 border-t border-surface-border/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-brand" /> Tenure Asynchrony Timeline
              </span>
              <span className="text-xs sm:text-sm font-mono text-content-muted">
                Horizon: {maxTenure} mos
              </span>
            </div>
            <div className="space-y-2.5">
              {commitments.map((c) => {
                const tenure = c.tenureMonths || 12;
                const widthPct = Math.min(100, Math.max(10, Math.round((tenure / maxTenure) * 100)));
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-medium text-content-primary truncate max-w-[220px]">{c.name}</span>
                      <span className="font-mono text-content-muted">{tenure} months</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className="h-full bg-brand/80 rounded-full transition-all duration-300"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs sm:text-sm text-content-muted mt-3 italic leading-relaxed">
              Staggered loan terms prevent debt freedom: as short installments finish, longer commitments continue to drain cash flow.
            </p>
          </div>
        )}

        {/* Simple Educational Note */}
        <p className="mt-4 text-xs sm:text-sm text-content-muted leading-relaxed">
          Note: Remaining income is shown before regular household expenses like food, rent, and utilities.
        </p>
      </Card>
    </div>
  );
};
