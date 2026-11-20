import React from 'react';
import { NavLink } from 'react-router-dom';
import {
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

interface SidebarProps {
  onOpenAbout: () => void;
  onOpenSources: () => void;
  onOpenTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenAbout,
  onOpenSources,
  onOpenTheme,
}) => {
  const primaryNavItems = [
    {
      label: 'Overview',
      path: '/',
      icon: LayoutDashboard,
      number: '01',
    },
    {
      label: 'EMI Calculator',
      path: '/calculator',
      icon: Calculator,
      number: '02',
    },
    {
      label: 'Research Dashboard',
      path: '/research',
      icon: PieChart,
      number: '03',
    },
    {
      label: 'Mathematical Analysis',
      path: '/math',
      icon: Sigma,
      number: '04',
    },
    {
      label: 'Learning Lab',
      path: '/learning-lab',
      icon: BookOpen,
      number: '05',
    },
  ];

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-surface border-r border-surface-border flex flex-col justify-between select-none z-20">
      {/* Top Branding Section */}
      <div className="flex flex-col">
        <div className="px-6 py-6 border-b border-surface-border/70">
          <div className="flex items-center gap-2.5">
            {/* Minimal architectural geometric mark */}
            <div className="w-7 h-7 rounded-sm border border-brand/40 bg-brand-soft/40 flex items-center justify-center text-brand">
              <span className="font-serif font-bold text-xs">∏</span>
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-widest text-content-primary uppercase">
                THE EMI TRAP
              </h1>
              <p className="text-[9px] uppercase tracking-widest font-mono text-content-muted mt-0.5">
                Discrete Math &amp; Finance
              </p>
            </div>
          </div>
        </div>

        {/* Primary Navigation List */}
        <nav className="p-3 space-y-1">
          <p className="px-3 pt-3 pb-2 text-[9px] font-semibold uppercase tracking-widest text-content-muted">
            Platform Index
          </p>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between px-3 py-2 rounded-btn text-xs transition-all duration-150',
                    isActive
                      ? 'bg-surface-secondary text-content-primary font-medium border border-surface-border shadow-xs'
                      : 'text-content-secondary hover:text-content-primary hover:bg-surface-secondary/50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          'w-3.5 h-3.5 shrink-0 transition-colors',
                          isActive ? 'text-brand' : 'text-content-muted group-hover:text-content-secondary'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-mono tracking-wider shrink-0 transition-colors',
                        isActive ? 'text-brand' : 'text-content-muted/70 group-hover:text-content-muted'
                      )}
                    >
                      {item.number}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Auxiliary Navigation */}
      <div className="p-4 border-t border-surface-border/70 space-y-0.5 bg-surface-secondary/20">
        <p className="px-2 pt-1 pb-1.5 text-[9px] font-semibold uppercase tracking-widest text-content-muted">
          Information
        </p>
        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-btn text-[11px] text-content-secondary hover:text-content-primary hover:bg-surface-secondary transition-colors text-left"
        >
          <Info className="w-3 h-3 text-content-muted" />
          <span>About Project</span>
        </button>
        <button
          onClick={onOpenSources}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-btn text-[11px] text-content-secondary hover:text-content-primary hover:bg-surface-secondary transition-colors text-left"
        >
          <Database className="w-3 h-3 text-content-muted" />
          <span>Data Sources</span>
        </button>
        <button
          onClick={onOpenTheme}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-btn text-[11px] text-content-secondary hover:text-content-primary hover:bg-surface-secondary transition-colors text-left"
        >
          <Palette className="w-3 h-3 text-content-muted" />
          <span>Theme Tokens</span>
        </button>
      </div>
    </aside>
  );
};
