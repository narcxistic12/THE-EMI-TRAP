import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { formatINR, parseCleanNumber } from '../../lib/utils';
import { validateIncome } from '../../lib/emiCalculations';

interface IncomeInputProps {
  income: number;
  onIncomeChange: (newIncome: number) => void;
}

const PRESET_INCOMES = [25000, 35000, 50000, 75000, 100000];

export const IncomeInput: React.FC<IncomeInputProps> = ({ income, onIncomeChange }) => {
  const [displayValue, setDisplayValue] = useState(income ? income.toString() : '');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setDisplayValue(income ? income.toString() : '');
  }, [income]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);

    if (raw.trim() === '-') {
      setError('Income cannot be negative');
      return;
    }

    if (raw.trim() === '') {
      setError(undefined);
      onIncomeChange(0);
      return;
    }

    const numeric = parseCleanNumber(raw);
    const validation = validateIncome(numeric);

    if (!validation.isValid) {
      setError(validation.error);
    } else {
      setError(undefined);
      onIncomeChange(numeric);
    }
  };

  const handlePresetClick = (amount: number) => {
    setDisplayValue(amount.toString());
    setError(undefined);
    onIncomeChange(amount);
  };

  return (
    <Card className="border-surface-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-serif text-base sm:text-lg">Monthly Net Income</CardTitle>
            <CardDescription>
              Net take-home remuneration received each month after statutory deductions and tax.
            </CardDescription>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-sm bg-surface-secondary border border-surface-border text-content-primary text-xs font-mono">
            {formatINR(income)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {/* Large Input Display */}
        <div>
          <label
            htmlFor="monthly-income-input"
            className="block text-[10px] font-semibold uppercase tracking-widest text-content-muted mb-1.5"
          >
            Monthly Inflow (INR ₹)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-content-muted font-serif text-lg pointer-events-none">
              ₹
            </span>
            <input
              id="monthly-income-input"
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleChange}
              placeholder="e.g. 50,000"
              className="w-full h-11 pl-9 pr-4 rounded-input border border-surface-border bg-white text-lg font-mono font-normal text-content-primary placeholder:text-content-muted/60 focus:outline-none focus:border-content-primary/40 focus:ring-1 focus:ring-content-primary/20 transition-colors"
            />
          </div>
          {error && <p className="text-[11px] text-semantic-danger font-medium mt-1.5">{error}</p>}
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-content-muted block mb-2">
            Reference Benchmarks:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_INCOMES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`px-3 py-1 rounded-btn text-xs font-mono transition-all ${
                  income === preset
                    ? 'bg-content-primary text-white font-medium shadow-xs'
                    : 'bg-surface-secondary text-content-secondary hover:bg-surface-border/70 border border-surface-border/70'
                }`}
              >
                {formatINR(preset)}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
