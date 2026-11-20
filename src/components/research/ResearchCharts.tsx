import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { DistributionStatistics } from '../../types/survey';
import { Card } from '../ui/Card';

interface ResearchChartsProps {
  stats: DistributionStatistics;
  totalRespondents: number;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 rounded-card border border-surface-border shadow-subtle text-xs space-y-1">
        <p className="font-semibold text-content-primary">{label || data.name}</p>
        <p className="font-mono text-content-secondary">
          Count: <span className="text-content-primary font-bold">{data.value}</span>
        </p>
        {data.payload.percentage !== undefined && (
          <p className="font-mono text-xs text-content-muted">
            Share: {Number(data.payload.percentage).toFixed(1)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const ResearchCharts: React.FC<ResearchChartsProps> = ({ stats, totalRespondents }) => {
  if (totalRespondents === 0) {
    return (
      <div className="p-8 text-center text-xs text-content-muted border border-dashed border-surface-border rounded-panel bg-surface-secondary/20">
        No survey data available to render research visualizations.
      </div>
    );
  }

  // Interpretations derived from data
  const sortedCategories = [...stats.categoryCounts].sort((a, b) => b.count - a.count);
  const dominantCategory = sortedCategories[0];

  const zeroEmi = stats.activeEmiCounts.find((e) => e.range.includes('0'))?.count || 0;
  const multiEmi = stats.activeEmiCounts
    .filter((e) => !e.range.includes('0') && !e.range.includes('1 EMI'))
    .reduce((sum, e) => sum + e.count, 0);

  const difficultyExperienced = stats.difficultyCounts
    .filter((d) => d.sentiment !== 'None' && d.sentiment !== 'Prefer not to say')
    .reduce((sum, d) => sum + d.count, 0);

  const DIFFICULTY_COLORS: Record<string, string> = {
    None: '#176B57',
    Occasional: '#C18428',
    Frequent: '#DC6803',
    Severe: '#B42318',
    'Prefer not to say': '#8A928C',
  };

  const SAVINGS_COLORS: Record<string, string> = {
    Yes: '#176B57',
    Barely: '#C18428',
    No: '#B42318',
    'Prefer not to say': '#8A928C',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: EMI Category Distribution */}
        <Card className="p-6 bg-white border-surface-border space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand block">
              Chart 01 &bull; Category Cardinalities
            </span>
            <h3 className="text-base font-serif font-normal text-content-primary">
              EMI Category Distribution
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-0.5">
              Unique individuals servicing loans in each broad borrowing classification.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryCounts} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#59675F' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#59675F' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.categoryCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border text-xs text-content-secondary font-serif leading-relaxed">
            <strong>Interpretation:</strong>{' '}
            {dominantCategory ? (
              <span>
                {dominantCategory.name} is the most prevalent commitment category in this cohort ({dominantCategory.count} respondents, {dominantCategory.percentage.toFixed(1)}%).
              </span>
            ) : (
              'Category participation is distributed evenly.'
            )}
          </div>
        </Card>

        {/* Chart 2: Number of Active EMIs */}
        <Card className="p-6 bg-white border-surface-border space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand block">
              Chart 02 &bull; Commitment Multiplicity
            </span>
            <h3 className="text-base font-serif font-normal text-content-primary">
              Active Loan Agreements per Person
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-0.5">
              Distribution of respondents across total concurrent EMI contracts.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.activeEmiCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#59675F' }} />
                <YAxis tick={{ fontSize: 10, fill: '#59675F' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#176B57" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border text-xs text-content-secondary font-serif leading-relaxed">
            <strong>Interpretation:</strong>{' '}
            <span>
              {multiEmi} respondents ({((multiEmi / totalRespondents) * 100).toFixed(1)}%) service two or more simultaneous EMIs, while {zeroEmi} respondents hold zero debt.
            </span>
          </div>
        </Card>

        {/* Chart 3: Monthly Take-Home Income Distribution */}
        <Card className="p-6 bg-white border-surface-border space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand block">
              Chart 03 &bull; Cohort Earning Profile
            </span>
            <h3 className="text-base font-serif font-normal text-content-primary">
              Monthly Income Distribution
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-0.5">
              Reported take-home income brackets among surveyed participants.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.incomeCounts} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: '#59675F' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#59675F' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3973B9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border text-xs text-content-secondary font-serif leading-relaxed">
            <strong>Interpretation:</strong>{' '}
            Provides baseline economic context for evaluating whether EMI totals represent disproportionate commitments.
          </div>
        </Card>

        {/* Chart 4: Monthly Total EMI Ranges */}
        <Card className="p-6 bg-white border-surface-border space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand block">
              Chart 04 &bull; Combined Outflow
            </span>
            <h3 className="text-base font-serif font-normal text-content-primary">
              Monthly Total EMI Commitments
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-0.5">
              Aggregate monthly debt outflow reported by respondents.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.emiAmountCounts} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: '#59675F' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#59675F' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#C18428" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border text-xs text-content-secondary font-serif leading-relaxed">
            <strong>Interpretation:</strong>{' '}
            Demonstrates how multiple smaller EMIs accumulate into significant fixed monthly cash deductions.
          </div>
        </Card>

        {/* Chart 5: Repayment Difficulty */}
        <Card className="p-6 bg-white border-surface-border space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand block">
              Chart 05 &bull; Repayment Sentiment
            </span>
            <h3 className="text-base font-serif font-normal text-content-primary">
              Experienced Repayment Strain
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-0.5">
              Frequency of reported difficulty meeting multiple monthly installments.
            </p>
          </div>

          <div className="h-56 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.difficultyCounts}
                  dataKey="count"
                  nameKey="sentiment"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {stats.difficultyCounts.map((entry) => (
                    <Cell
                      key={`diff-${entry.sentiment}`}
                      fill={DIFFICULTY_COLORS[entry.sentiment] || '#8A928C'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border text-xs text-content-secondary font-serif leading-relaxed">
            <strong>Interpretation:</strong>{' '}
            <span>
              {difficultyExperienced} respondents ({((difficultyExperienced / totalRespondents) * 100).toFixed(1)}%) report experiencing occasional, frequent, or severe repayment pressure.
            </span>
          </div>
        </Card>

        {/* Chart 6: Savings After EMI */}
        <Card className="p-6 bg-white border-surface-border space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand block">
              Chart 06 &bull; Cash Flow Resilience
            </span>
            <h3 className="text-base font-serif font-normal text-content-primary">
              Savings Remaining After EMI Outflow
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Proportion of respondents retaining discretionary savings after loan deductions.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.savingsCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#59675F' }} />
                <YAxis tick={{ fontSize: 10, fill: '#59675F' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.savingsCounts.map((entry) => (
                    <Cell key={`sav-${entry.status}`} fill={SAVINGS_COLORS[entry.status] || '#8A928C'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-card bg-surface-secondary/40 border border-surface-border text-xs text-content-secondary font-serif leading-relaxed">
            <strong>Interpretation:</strong>{' '}
            Signals vulnerable liquidity buffers among individuals who report zero or barely any savings remaining after servicing their monthly EMI obligations.
          </div>
        </Card>
      </div>
    </div>
  );
};

