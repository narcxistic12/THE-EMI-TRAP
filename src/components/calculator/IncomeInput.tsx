import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
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
      <CardHeader className="pb-2.5">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-lg sm:text-xl">Monthly Take-Home Income</CardTitle>
          <span className="px-3 py-1 rounded-sm glass-pill text-content-primary text-xs sm:text-sm font-mono font-medium">
            {formatINR(income)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {/* Large Input Display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="monthly-income-input"
              className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-content-muted"
            >
              Net Inflow (₹)
            </label>
            <span className="text-xs sm:text-sm font-mono text-content-muted">
              Slide or type amount
            </span>
          </div>
          <div className="relative flex items-center mb-3">
            <span className="absolute left-3.5 text-content-muted font-serif text-xl pointer-events-none">
              ₹
            </span>
            <input
              id="monthly-income-input"
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleChange}
              placeholder="e.g. 50,000"
              className="w-full h-12 pl-10 pr-4 rounded-input border border-surface-border/80 bg-white/60 backdrop-blur-xs text-xl sm:text-2xl font-mono font-normal text-content-primary placeholder:text-content-muted/60 focus:outline-none focus:border-brand/60 focus:bg-white/90 focus:ring-1 focus:ring-brand/20 transition-all shadow-xs"
            />
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="10000"
              max="150000"
              step="1000"
              value={income || 10000}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setDisplayValue(val.toString());
                setError(undefined);
                onIncomeChange(val);
              }}
              className="w-full accent-brand cursor-pointer h-2 bg-surface-secondary rounded-lg"
              aria-label="Monthly income slider"
            />
            <div className="flex justify-between text-xs sm:text-sm font-mono text-content-muted">
              <span>₹10,000</span>
              <span>₹1,50,000</span>
            </div>
          </div>

          {error && <p className="text-xs sm:text-sm text-semantic-danger font-medium mt-1.5">{error}</p>}
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-content-muted mr-1">
            Presets:
          </span>
          {PRESET_INCOMES.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className={`px-3 py-1.5 rounded-btn text-xs sm:text-sm font-mono transition-all ${
                income === preset
                  ? 'bg-content-primary text-white font-medium shadow-xs'
                  : 'bg-surface-secondary text-content-secondary hover:bg-surface-border/70 border border-surface-border/70'
              }`}
            >
              {formatINR(preset)}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
