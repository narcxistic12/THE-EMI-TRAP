import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RotateCcw, Check, UserCheck, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface SampleRespondent {
  id: string;
  name: string;
  hasA: boolean; // Personal Loan
  hasB: boolean; // Vehicle Loan
  hasC: boolean; // Consumer Durable
}

const INITIAL_RESPONDENTS: SampleRespondent[] = [
  { id: 'R1', name: 'Respondent 01', hasA: true, hasB: false, hasC: false },
  { id: 'R2', name: 'Respondent 02', hasA: true, hasB: true, hasC: false },
  { id: 'R3', name: 'Respondent 03', hasA: true, hasB: true, hasC: true },
  { id: 'R4', name: 'Respondent 04', hasA: false, hasB: true, hasC: false },
  { id: 'R5', name: 'Respondent 05', hasA: false, hasB: false, hasC: true },
  { id: 'R6', name: 'Respondent 06', hasA: false, hasB: false, hasC: false },
];

export const SetMembershipExplorer: React.FC = () => {
  const [respondents, setRespondents] = useState<SampleRespondent[]>(INITIAL_RESPONDENTS);
  const [activeQuery, setActiveQuery] = useState<'A_union_B' | 'A_intersect_B' | 'allThree' | 'complement'>('A_intersect_B');

  const toggleCategory = (id: string, category: 'hasA' | 'hasB' | 'hasC') => {
    setRespondents((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [category]: !r[category] } : r))
    );
  };

  const handleReset = () => {
    setRespondents(INITIAL_RESPONDENTS);
  };

  // Evaluate query membership
  const matchesQuery = (r: SampleRespondent) => {
    switch (activeQuery) {
      case 'A_union_B':
        return r.hasA || r.hasB;
      case 'A_intersect_B':
        return r.hasA && r.hasB;
      case 'allThree':
        return r.hasA && r.hasB && r.hasC;
      case 'complement':
        return !r.hasA && !r.hasB && !r.hasC;
    }
  };

  const matchingCount = respondents.filter(matchesQuery).length;

  return (
    <Card className="p-6 bg-white border-surface-border space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-surface-border/70">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Set Membership Lab
          </span>
          <h3 className="text-base sm:text-lg font-serif font-normal text-content-primary mt-0.5">
            Respondent Set Membership &amp; Boolean Operations
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary">
            Toggle loan categories for individual sample participants to observe real-time set-theoretic operations.
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          className="text-xs font-mono h-7 gap-1 text-content-muted hover:text-content-primary self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" /> Reset Sample
        </Button>
      </div>

      {/* Query Selector Tabs */}
      <div className="space-y-1.5">
        <span className="text-xs font-mono uppercase tracking-widest text-content-muted block">
          Select Set Operation to Highlight
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveQuery('A_union_B')}
            className={`p-2.5 rounded-card border text-left transition-all ${
              activeQuery === 'A_union_B'
                ? 'bg-brand-soft/40 border-brand text-brand-dark font-medium shadow-xs'
                : 'bg-surface-secondary/40 border-surface-border text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            <span className="font-mono text-xs sm:text-sm block font-bold">A ∪ B</span>
            <span className="text-xs text-content-muted">Union (Personal OR Vehicle)</span>
          </button>

          <button
            onClick={() => setActiveQuery('A_intersect_B')}
            className={`p-2.5 rounded-card border text-left transition-all ${
              activeQuery === 'A_intersect_B'
                ? 'bg-brand-soft/40 border-brand text-brand-dark font-medium shadow-xs'
                : 'bg-surface-secondary/40 border-surface-border text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            <span className="font-mono text-xs sm:text-sm block font-bold">A ∩ B</span>
            <span className="text-xs text-content-muted">Intersection (Both A &amp; B)</span>
          </button>

          <button
            onClick={() => setActiveQuery('allThree')}
            className={`p-2.5 rounded-card border text-left transition-all ${
              activeQuery === 'allThree'
                ? 'bg-brand-soft/40 border-brand text-brand-dark font-medium shadow-xs'
                : 'bg-surface-secondary/40 border-surface-border text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            <span className="font-mono text-xs sm:text-sm block font-bold">A ∩ B ∩ C</span>
            <span className="text-xs text-content-muted">Core Trap (All 3 Loans)</span>
          </button>

          <button
            onClick={() => setActiveQuery('complement')}
            className={`p-2.5 rounded-card border text-left transition-all ${
              activeQuery === 'complement'
                ? 'bg-brand-soft/40 border-brand text-brand-dark font-medium shadow-xs'
                : 'bg-surface-secondary/40 border-surface-border text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            <span className="font-mono text-xs sm:text-sm block font-bold">(A ∪ B ∪ C)^c</span>
            <span className="text-xs text-content-muted">Complement (Outside All 3)</span>
          </button>
        </div>
      </div>

      {/* Interactive Respondent Table */}
      <div className="border border-surface-border rounded-card overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-surface-secondary/70 border-b border-surface-border font-mono uppercase tracking-widest text-xs text-content-muted">
            <tr>
              <th className="py-2.5 px-4">Participant</th>
              <th className="py-2.5 px-4 text-center">Set A (Personal)</th>
              <th className="py-2.5 px-4 text-center">Set B (Vehicle)</th>
              <th className="py-2.5 px-4 text-center">Set C (Consumer)</th>
              <th className="py-2.5 px-4 text-right">In Selected Operation?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/60 font-mono text-xs sm:text-sm">
            {respondents.map((r) => {
              const matches = matchesQuery(r);
              return (
                <tr
                  key={r.id}
                  className={`transition-colors ${
                    matches ? 'bg-brand-soft/20 font-medium' : 'hover:bg-surface-secondary/20'
                  }`}
                >
                  <td className="py-2.5 px-4 flex items-center gap-2">
                    <UserCheck className={`w-3.5 h-3.5 ${matches ? 'text-brand' : 'text-content-muted'}`} />
                    <span className={matches ? 'text-content-primary font-semibold' : 'text-content-secondary'}>
                      {r.name}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => toggleCategory(r.id, 'hasA')}
                      className={`px-2.5 py-1 rounded-sm border text-xs transition-all ${
                        r.hasA
                          ? 'bg-[#3973B9] text-white border-[#3973B9]'
                          : 'bg-transparent text-content-muted border-surface-border hover:bg-surface-secondary'
                      }`}
                    >
                      {r.hasA ? 'Active' : 'No'}
                    </button>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => toggleCategory(r.id, 'hasB')}
                      className={`px-2.5 py-1 rounded-sm border text-xs transition-all ${
                        r.hasB
                          ? 'bg-[#C18428] text-white border-[#C18428]'
                          : 'bg-transparent text-content-muted border-surface-border hover:bg-surface-secondary'
                      }`}
                    >
                      {r.hasB ? 'Active' : 'No'}
                    </button>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => toggleCategory(r.id, 'hasC')}
                      className={`px-2.5 py-1 rounded-sm border text-xs transition-all ${
                        r.hasC
                          ? 'bg-[#8066B2] text-white border-[#8066B2]'
                          : 'bg-transparent text-content-muted border-surface-border hover:bg-surface-secondary'
                      }`}
                    >
                      {r.hasC ? 'Active' : 'No'}
                    </button>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {matches ? (
                      <Badge variant="brand" className="font-mono text-xs gap-1">
                        <Check className="w-2.5 h-2.5" /> YES
                      </Badge>
                    ) : (
                      <span className="text-content-muted text-xs">NO</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Operation Summary Result */}
      <div className="p-4 rounded-card bg-surface-secondary/40 border border-surface-border flex items-center justify-between text-xs sm:text-sm">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-content-muted block">
            Operation Evaluation
          </span>
          <span className="font-serif text-content-primary text-sm font-medium">
            {matchingCount} of {respondents.length} participants satisfy this condition ({((matchingCount / respondents.length) * 100).toFixed(0)}%).
          </span>
        </div>
        <Badge variant="neutral" className="font-mono text-xs">
          Cardinality = {matchingCount}
        </Badge>
      </div>
    </Card>
  );
};

