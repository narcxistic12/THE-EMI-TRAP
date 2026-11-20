import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, CreditCard, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EmiCommitment } from '../../types/calculator';
import { formatINR, parseCleanNumber } from '../../lib/utils';
import { validateCommitment } from '../../lib/emiCalculations';

interface CommitmentManagerProps {
  commitments: EmiCommitment[];
  onAddCommitment: (commitment: Omit<EmiCommitment, 'id'>) => void;
  onUpdateCommitment: (commitment: EmiCommitment) => void;
  onDeleteCommitment: (id: string) => void;
  onLoadExample: () => void;
  onClearAll: () => void;
}

export const CommitmentManager: React.FC<CommitmentManagerProps> = ({
  commitments,
  onAddCommitment,
  onUpdateCommitment,
  onDeleteCommitment,
  onLoadExample,
  onClearAll,
}) => {
  // New commitment form state
  const [name, setName] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [tenureMonths, setTenureMonths] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; amount?: string; tenure?: string }>({});

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editTenure, setEditTenure] = useState('');
  const [editErrors, setEditErrors] = useState<{ name?: string; amount?: string; tenure?: string }>({});

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseCleanNumber(monthlyAmount);
    const tenureNum = tenureMonths ? parseInt(tenureMonths, 10) : undefined;

    const validation = validateCommitment({
      name: name.trim(),
      monthlyAmount: amountNum,
      tenureMonths: tenureNum,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    onAddCommitment({
      name: name.trim(),
      monthlyAmount: amountNum,
      tenureMonths: tenureNum,
    });

    // Reset form
    setName('');
    setMonthlyAmount('');
    setTenureMonths('');
    setFormErrors({});
  };

  const startEdit = (c: EmiCommitment) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditAmount(c.monthlyAmount.toString());
    setEditTenure(c.tenureMonths ? c.tenureMonths.toString() : '');
    setEditErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditErrors({});
  };

  const saveEdit = (id: string) => {
    const amountNum = parseCleanNumber(editAmount);
    const tenureNum = editTenure ? parseInt(editTenure, 10) : undefined;

    const validation = validateCommitment({
      name: editName.trim(),
      monthlyAmount: amountNum,
      tenureMonths: tenureNum,
    });

    if (!validation.isValid) {
      setEditErrors(validation.errors);
      return;
    }

    onUpdateCommitment({
      id,
      name: editName.trim(),
      monthlyAmount: amountNum,
      tenureMonths: tenureNum,
    });

    setEditingId(null);
    setEditErrors({});
  };

  return (
    <Card className="border-surface-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="font-serif text-lg sm:text-xl">Active EMI Commitments</CardTitle>
          <div className="flex items-center gap-2">
            {commitments.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs sm:text-sm text-content-muted hover:text-content-primary transition-colors underline mr-1.5"
              >
                Clear All
              </button>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onLoadExample}
              className="text-xs sm:text-sm h-8 px-3 gap-1.5 font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              Load Example
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Form */}
        <form onSubmit={handleAddSubmit} className="p-4 sm:p-5 rounded-card bg-white/45 backdrop-blur-xs border border-white/70 space-y-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-content-primary flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand" /> Add Loan or EMI
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: 'Smartphone', amt: 2500, tenure: 12 },
                { label: 'Two-Wheeler', amt: 5500, tenure: 24 },
                { label: 'Personal Loan', amt: 8000, tenure: 36 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setName(p.label);
                    setMonthlyAmount(p.amt.toString());
                    setTenureMonths(p.tenure.toString());
                    setFormErrors({});
                  }}
                  className="px-2 py-0.5 rounded-sm bg-white border border-surface-border text-xs font-mono text-content-secondary hover:text-content-primary hover:border-brand/40 transition-colors"
                >
                  +{p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Name */}
            <div className="sm:col-span-5">
              <label htmlFor="emi-name-input" className="block text-xs sm:text-sm uppercase tracking-wider font-semibold text-content-muted mb-1.5">
                Loan or Item *
              </label>
              <input
                id="emi-name-input"
                type="text"
                placeholder="e.g. Two-Wheeler, Phone"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`w-full h-10 px-3 rounded-input border bg-white text-sm text-content-primary placeholder:text-content-muted/60 focus:outline-none focus:border-content-primary/40 ${
                  formErrors.name ? 'border-semantic-danger' : 'border-surface-border'
                }`}
              />
              {formErrors.name && <p className="text-xs text-semantic-danger mt-1 font-medium">{formErrors.name}</p>}
            </div>

            {/* Monthly Amount */}
            <div className="sm:col-span-4">
              <label htmlFor="emi-amount-input" className="block text-xs sm:text-sm uppercase tracking-wider font-semibold text-content-muted mb-1.5">
                Monthly EMI (₹) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-content-muted text-sm font-mono">₹</span>
                <input
                  id="emi-amount-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="2,500"
                  value={monthlyAmount}
                  onChange={(e) => {
                    setMonthlyAmount(e.target.value);
                    setFormErrors((prev) => ({ ...prev, amount: undefined }));
                  }}
                  className={`w-full h-10 pl-7 pr-3 rounded-input border bg-white text-sm font-mono text-content-primary placeholder:text-content-muted/60 focus:outline-none focus:border-content-primary/40 ${
                    formErrors.amount ? 'border-semantic-danger' : 'border-surface-border'
                  }`}
                />
              </div>
              {formErrors.amount && <p className="text-xs text-semantic-danger mt-1 font-medium">{formErrors.amount}</p>}
            </div>

            {/* Optional Tenure */}
            <div className="sm:col-span-3">
              <label htmlFor="emi-tenure-input" className="block text-xs sm:text-sm uppercase tracking-wider font-semibold text-content-muted mb-1.5">
                Tenure (Mos)
              </label>
              <input
                id="emi-tenure-input"
                type="number"
                min="1"
                placeholder="12"
                value={tenureMonths}
                onChange={(e) => {
                  setTenureMonths(e.target.value);
                  setFormErrors((prev) => ({ ...prev, tenure: undefined }));
                }}
                className={`w-full h-10 px-3 rounded-input border bg-white text-sm font-mono text-content-primary placeholder:text-content-muted/60 focus:outline-none focus:border-content-primary/40 ${
                  formErrors.tenure ? 'border-semantic-danger' : 'border-surface-border'
                }`}
              />
              {formErrors.tenure && <p className="text-xs text-semantic-danger mt-1 font-medium">{formErrors.tenure}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" size="sm" className="h-9 px-4 text-xs sm:text-sm font-medium">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Loan
            </Button>
          </div>
        </form>

        {/* Commitments Ledger */}
        <div className="space-y-2.5">
          {commitments.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-card border border-dashed border-surface-border bg-surface-secondary/20">
              <CreditCard className="w-8 h-8 text-content-muted mx-auto mb-2.5 opacity-40" />
              <p className="text-sm sm:text-base font-medium text-content-primary font-serif">No active debt obligations recorded</p>
              <p className="text-xs sm:text-sm text-content-secondary max-w-xs mx-auto mt-1">
                Add an ongoing commitment or click &ldquo;Load Example&rdquo; to populate illustrative commitments.
              </p>
            </div>
          ) : (
            <div className="border border-white/70 rounded-card divide-y divide-surface-border/60 overflow-hidden bg-white/50 backdrop-blur-xs shadow-xs">
              {commitments.map((commitment, index) => {
                const isEditing = editingId === commitment.id;

                if (isEditing) {
                  return (
                    <div key={commitment.id} className="p-3.5 bg-surface-secondary/50 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        <div className="sm:col-span-5">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full h-9 px-3 rounded-input border border-content-primary/40 bg-white text-sm"
                            placeholder="Commitment name"
                          />
                          {editErrors.name && <p className="text-xs text-semantic-danger font-medium mt-1">{editErrors.name}</p>}
                        </div>
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-full h-9 px-3 rounded-input border border-content-primary/40 bg-white text-sm font-mono"
                            placeholder="Monthly amount"
                          />
                          {editErrors.amount && <p className="text-xs text-semantic-danger font-medium mt-1">{editErrors.amount}</p>}
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="number"
                            value={editTenure}
                            onChange={(e) => setEditTenure(e.target.value)}
                            className="w-full h-9 px-3 rounded-input border border-surface-border bg-white text-sm font-mono"
                            placeholder="Tenure (mos)"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8 text-xs sm:text-sm">
                          <X className="w-3.5 h-3.5 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveEdit(commitment.id)} className="h-8 text-xs sm:text-sm">
                          <Check className="w-3.5 h-3.5 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={commitment.id}
                    className="p-4 flex items-center justify-between hover:bg-surface-secondary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
                      <span className="w-6 h-6 rounded-sm bg-surface-secondary border border-surface-border text-content-muted font-mono text-xs flex items-center justify-center shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-content-primary truncate">
                          {commitment.name}
                        </p>
                        {commitment.tenureMonths && (
                          <p className="text-xs sm:text-sm font-mono text-content-muted truncate">
                            {commitment.tenureMonths} months remaining
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 shrink-0">
                      <span className="font-mono text-sm sm:text-base font-semibold text-content-primary">
                        {formatINR(commitment.monthlyAmount)}
                        <span className="text-xs text-content-muted font-normal"> /mo</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(commitment)}
                          className="p-1.5 rounded text-content-muted hover:text-content-primary hover:bg-surface-secondary transition-colors"
                          title="Edit commitment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCommitment(commitment.id)}
                          className="p-1.5 rounded text-content-muted hover:text-semantic-danger hover:bg-red-50 transition-colors"
                          title="Delete commitment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
