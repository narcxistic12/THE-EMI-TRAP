import React, { useRef } from 'react';
import { cn } from '../../lib/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  spotlightColor = 'rgba(255, 255, 255, 0.28)',
  className,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !overlayRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    overlayRef.current.style.setProperty('--spotlight-x', `${x}px`);
    overlayRef.current.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleMouseEnter = () => {
    if (overlayRef.current) overlayRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (overlayRef.current) overlayRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-card overflow-hidden glass-plate-interactive',
        className
      )}
      {...props}
    >
      {/* Specular Optical Spotlight Lensing Overlay without React re-renders */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10 will-change-transform"
        style={{
          background: `radial-gradient(450px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), ${spotlightColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative z-1">{children}</div>
    </div>
  );
};
