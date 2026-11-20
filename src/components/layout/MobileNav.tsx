import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Calculator,
  PieChart,
  Sigma,
  BookOpen,
  Info,
  Database,
  Palette,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAbout: () => void;
  onOpenSources: () => void;
  onOpenTheme: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenAbout,
  onOpenSources,
  onOpenTheme,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard, number: '01' },
    { label: 'EMI Calculator', path: '/calculator', icon: Calculator, number: '02' },
    { label: 'Research Dashboard', path: '/research', icon: PieChart, number: '03' },
    { label: 'Mathematical Analysis', path: '/math', icon: Sigma, number: '04' },
    { label: 'Learning Lab', path: '/learning-lab', icon: BookOpen, number: '05' },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-content-primary/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-surface h-full shadow-xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 border-r border-surface-border">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-surface-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm border border-brand/40 bg-brand-soft/40 flex items-center justify-center text-brand">
                <span className="font-serif font-bold text-xs">∏</span>
              </div>
              <div>
                <h2 className="text-xs font-bold tracking-widest uppercase text-content-primary">THE EMI TRAP</h2>
                <p className="text-[9px] font-mono tracking-widest uppercase text-content-muted">Research Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-btn text-content-muted hover:text-content-primary hover:bg-surface-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <p className="px-3 pt-2 pb-1.5 text-[9px] font-semibold uppercase tracking-widest text-content-muted">
              Platform Sections
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-btn text-xs transition-colors',
                      isActive
                        ? 'bg-surface-secondary text-content-primary font-medium border border-surface-border'
                        : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary/60'
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-brand" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-content-muted">{item.number}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info links */}
        <div className="p-4 border-t border-surface-border space-y-1 bg-surface-secondary/20">
          <button
            onClick={() => {
              onClose();
              onOpenAbout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs text-content-secondary hover:text-content-primary text-left"
          >
            <Info className="w-3.5 h-3.5 text-content-muted" />
            <span>About Project</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenSources();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs text-content-secondary hover:text-content-primary text-left"
          >
            <Database className="w-3.5 h-3.5 text-content-muted" />
            <span>Data Sources</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenTheme();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs text-content-secondary hover:text-content-primary text-left"
          >
            <Palette className="w-3.5 h-3.5 text-content-muted" />
            <span>Theme Tokens</span>
          </button>
        </div>
      </div>
    </div>
  );
};
