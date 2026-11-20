import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, prefixElement, suffixElement, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-widest text-content-muted"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-content-muted font-mono text-sm">
              {prefixElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-10 rounded-input border border-surface-border bg-white px-3 py-2 text-sm text-content-primary placeholder:text-content-muted/80 transition-colors duration-150',
              'focus:outline-none focus:border-content-primary/40 focus:ring-1 focus:ring-content-primary/20',
              'disabled:bg-surface-secondary disabled:cursor-not-allowed disabled:text-content-muted',
              prefixElement && 'pl-8',
              suffixElement && 'pr-8',
              error && 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger',
              className
            )}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-3 flex items-center pointer-events-none text-content-muted text-xs">
              {suffixElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-semantic-danger font-medium mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-content-muted mt-1 leading-relaxed">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
