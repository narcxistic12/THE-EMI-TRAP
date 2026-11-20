import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with optical blur */}
      <div
        className="fixed inset-0 bg-content-primary/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Liquid Glass Modal Surface */}
      <div
        className={cn(
          'relative w-full glass-modal rounded-panel z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200',
          maxWidth === 'sm' && 'max-w-md',
          maxWidth === 'md' && 'max-w-xl',
          maxWidth === 'lg' && 'max-w-2xl',
          maxWidth === 'xl' && 'max-w-4xl'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-surface-border/70">
          <div>
            <h3 className="text-base font-semibold text-content-primary tracking-tight font-serif">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-content-secondary mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-btn text-content-muted hover:text-content-primary hover:bg-surface-secondary transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-content-secondary leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-surface-border/70 bg-surface-secondary/30 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
