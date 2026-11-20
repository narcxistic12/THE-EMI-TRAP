import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'neutral' | 'info' | 'warning' | 'danger' | 'setA' | 'setB' | 'setC';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-tight select-none',
        variant === 'brand' && 'bg-brand-soft text-brand-dark border border-brand/20',
        variant === 'neutral' && 'bg-surface-secondary text-content-secondary border border-surface-border',
        variant === 'info' && 'bg-blue-50/60 text-semantic-info border border-blue-200/40',
        variant === 'warning' && 'bg-amber-50/60 text-semantic-warning border border-amber-200/40',
        variant === 'danger' && 'bg-red-50/60 text-semantic-danger border border-red-200/40',
        variant === 'setA' && 'bg-setA-soft text-setA border border-setA/20',
        variant === 'setB' && 'bg-setB-soft text-setB border border-setB/20',
        variant === 'setC' && 'bg-setC-soft text-setC border border-setC/20',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
