import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-btn transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/50 disabled:opacity-40 disabled:pointer-events-none select-none',
        // Variants
        variant === 'primary' && 'bg-brand text-white hover:bg-brand-hover active:bg-brand-dark shadow-xs',
        variant === 'secondary' && 'bg-surface-secondary text-content-primary hover:bg-surface-border/60 active:bg-surface-border',
        variant === 'outline' && 'border border-surface-border bg-white text-content-primary hover:bg-surface-secondary hover:border-content-muted/40',
        variant === 'ghost' && 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary/70',
        variant === 'danger' && 'bg-semantic-danger text-white hover:bg-semantic-danger/90',
        // Sizes
        size === 'sm' && 'h-8 px-3 text-xs gap-1.5',
        size === 'md' && 'h-9 px-4 text-xs tracking-wide gap-2',
        size === 'lg' && 'h-11 px-6 text-xs uppercase tracking-wider font-semibold gap-2.5',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
