import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  PieChart,
  Sigma,
  BookOpen,
  Info,
  Database,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onOpenAbout: () => void;
  onOpenSources: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenAbout,
  onOpenSources,
}) => {
  const navigate = useNavigate();

  const primaryNavItems = [
    {
      label: 'Overview',
      path: '/',
      icon: LayoutDashboard,
      number: '1',
    },
    {
      label: 'EMI Calculator',
      path: '/calculator',
      icon: Calculator,
      number: '2',
    },
    {
      label: 'Research Dashboard',
      path: '/research',
      icon: PieChart,
      number: '3',
    },
    {
      label: 'Mathematical Analysis',
      path: '/math',
      icon: Sigma,
      number: '4',
    },
    {
      label: 'Learning Lab',
      path: '/learning-lab',
      icon: BookOpen,
      number: '5',
    },
  ];

  // Linear-style keyboard shortcut navigation (1 - 5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      const keyIndex = parseInt(e.key, 10);
      if (keyIndex >= 1 && keyIndex <= primaryNavItems.length) {
        navigate(primaryNavItems[keyIndex - 1].path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, primaryNavItems]);

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 glass-sidebar flex flex-col justify-between select-none z-20">
      {/* Top Branding Section */}
      <div className="flex flex-col">
        <div className="px-6 py-6 border-b border-surface-border/70">
          <div className="flex items-center gap-2.5">
            {/* Minimal architectural geometric mark with glass styling */}
            <div className="w-8 h-8 rounded-btn border border-brand/30 bg-brand/10 backdrop-blur-xs flex items-center justify-center text-brand shadow-xs">
              <span className="font-serif font-bold text-sm">∏</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-content-primary uppercase">
                THE EMI TRAP
              </h1>
              <p className="text-xs uppercase tracking-wider font-mono text-content-muted mt-0.5">
                Discrete Math &amp; Finance
              </p>
            </div>
          </div>
        </div>

        {/* Primary Navigation List */}
        <nav className="p-3 space-y-1">
          <p className="px-3 pt-3 pb-2 text-xs font-semibold uppercase tracking-wider text-content-muted">
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
                    'group flex items-center justify-between px-3 py-2.5 rounded-btn text-sm transition-all duration-200',
                    isActive
                      ? 'glass-pill text-content-primary font-medium shadow-xs'
                      : 'text-content-secondary hover:text-content-primary hover:bg-white/40'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-brand' : 'text-content-muted group-hover:text-content-secondary'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-mono tracking-wider shrink-0 px-1.5 py-0.5 rounded transition-colors',
                        isActive ? 'text-brand font-semibold bg-brand/10' : 'text-content-muted/60 group-hover:text-content-muted'
                      )}
                      title={`Press ${item.number} to jump`}
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
      <div className="p-4 border-t border-surface-border/70 space-y-1 bg-surface-secondary/20">
        <p className="px-2 pt-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-content-muted">
          Information
        </p>
        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-btn text-xs sm:text-sm text-content-secondary hover:text-content-primary hover:bg-surface-secondary transition-colors text-left font-medium"
        >
          <Info className="w-3.5 h-3.5 text-content-muted" />
          <span>About Project</span>
        </button>
        <button
          onClick={onOpenSources}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-btn text-xs sm:text-sm text-content-secondary hover:text-content-primary hover:bg-surface-secondary transition-colors text-left font-medium"
        >
          <Database className="w-3.5 h-3.5 text-content-muted" />
          <span>Data Sources</span>
        </button>
      </div>
    </aside>
  );
};
