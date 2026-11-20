import React, { useState } from 'react';
import { SetCardinalityInput, VennRegionId, VennRegionDetail } from '../../types/setTheory';
import { getVennRegionDetails } from '../../lib/math/vennRegions';
import { RotateCcw, Info } from 'lucide-react';
import { Button } from '../ui/Button';

interface VennDiagramSvgProps {
  data: SetCardinalityInput;
  selectedRegionId?: VennRegionId | null;
  onSelectRegion?: (region: VennRegionDetail | null) => void;
}

/**
 * Exact geometric paths for the 8 mutually exclusive regions of a 3-circle Venn diagram.
 * Circle Centers: A(190, 160), B(310, 160), C(250, 264), Radius R = 100
 *
 * 6 Key Intersection Points:
 * P1: (250, 80)        - Top intersection of A and B (outside C)
 * P2: (250, 240)       - Bottom intersection of A and B (inside C)
 * P3: (289.27, 172.03) - Right intersection of A and C (inside B)
 * P4: (150.73, 251.97) - Left intersection of A and C (outside B)
 * P5: (349.27, 251.97) - Right intersection of B and C (outside A)
 * P6: (210.73, 172.03) - Left intersection of B and C (inside A)
 */
export const VENN_PATHS: Record<VennRegionId, string> = {
  // R8: Outside Region: Outer box with cutout of union A ∪ B ∪ C (rendered with fillRule="evenodd")
  outside:
    'M 10 10 H 490 V 390 H 10 Z ' +
    'M 150.73 251.97 ' +
    'A 100 100 0 1 1 250 80 ' +
    'A 100 100 0 1 1 349.27 251.97 ' +
    'A 100 100 0 1 1 150.73 251.97 Z',

  // R1: Only A = A \ (B ∪ C)
  onlyA:
    'M 150.73 251.97 ' +
    'A 100 100 0 1 1 250 80 ' +
    'A 100 100 0 0 0 210.73 172.03 ' +
    'A 100 100 0 0 0 150.73 251.97 Z',

  // R2: Only B = B \ (A ∪ C)
  onlyB:
    'M 250 80 ' +
    'A 100 100 0 1 1 349.27 251.97 ' +
    'A 100 100 0 0 0 289.27 172.03 ' +
    'A 100 100 0 0 0 250 80 Z',

  // R3: Only C = C \ (A ∪ B)
  onlyC:
    'M 349.27 251.97 ' +
    'A 100 100 0 1 1 150.73 251.97 ' +
    'A 100 100 0 0 0 250 240 ' +
    'A 100 100 0 0 0 349.27 251.97 Z',

  // R4: Only AB = (A ∩ B) \ C
  onlyAB:
    'M 250 80 ' +
    'A 100 100 0 0 1 289.27 172.03 ' +
    'A 100 100 0 0 0 210.73 172.03 ' +
    'A 100 100 0 0 1 250 80 Z',

  // R6: Only AC = (A ∩ C) \ B
  onlyAC:
    'M 150.73 251.97 ' +
    'A 100 100 0 0 1 210.73 172.03 ' +
    'A 100 100 0 0 0 250 240 ' +
    'A 100 100 0 0 1 150.73 251.97 Z',

  // R5: Only BC = (B ∩ C) \ A
  onlyBC:
    'M 250 240 ' +
    'A 100 100 0 0 0 289.27 172.03 ' +
    'A 100 100 0 0 1 349.27 251.97 ' +
    'A 100 100 0 0 1 250 240 Z',

  // R7: All Three = A ∩ B ∩ C
  allThree:
    'M 289.27 172.03 ' +
    'A 100 100 0 0 1 250 240 ' +
    'A 100 100 0 0 1 210.73 172.03 ' +
    'A 100 100 0 0 1 289.27 172.03 Z',
};

export const VennDiagramSvg: React.FC<VennDiagramSvgProps> = ({
  data,
  selectedRegionId: externalSelectedRegionId,
  onSelectRegion,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<VennRegionId | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<VennRegionId | null>(null);

  const activeSelectedId =
    externalSelectedRegionId !== undefined ? externalSelectedRegionId : internalSelectedId;

  const regionDetails = getVennRegionDetails(data);
  const regionMap = new Map(regionDetails.map((r) => [r.id, r]));

  const handleRegionClick = (id: VennRegionId) => {
    const nextId = activeSelectedId === id ? null : id;
    setInternalSelectedId(nextId);
    if (onSelectRegion) {
      onSelectRegion(nextId ? regionMap.get(nextId) || null : null);
    }
  };

  const handleReset = () => {
    setInternalSelectedId(null);
    if (onSelectRegion) {
      onSelectRegion(null);
    }
  };

  const selectedRegion = activeSelectedId ? regionMap.get(activeSelectedId) : null;
  const hoveredRegion = hoveredRegionId ? regionMap.get(hoveredRegionId) : null;
  // Hover temporarily inspects; when pointer leaves, fall back to clicked selection
  const inspectedRegion = hoveredRegion || selectedRegion;

  // Geometry configuration
  const circleA = { cx: 190, cy: 160, r: 100 };
  const circleB = { cx: 310, cy: 160, r: 100 };
  const circleC = { cx: 250, cy: 264, r: 100 };

  const getRegionOpacity = (id: VennRegionId) => {
    const isSelected = activeSelectedId === id;
    const isHovered = hoveredRegionId === id;

    if (isHovered) return 0.8;
    if (isSelected) return 0.7;
    if (hoveredRegionId || activeSelectedId) return 0.18;
    return id === 'outside' ? 0.14 : 0.38;
  };

  const getRegionStroke = (id: VennRegionId, baseColor: string) => {
    const isSelected = activeSelectedId === id;
    const isHovered = hoveredRegionId === id;

    if (isSelected) return '#17231D';
    if (isHovered) return baseColor;
    return 'transparent';
  };

  const getRegionStrokeWidth = (id: VennRegionId) => {
    const isSelected = activeSelectedId === id;
    const isHovered = hoveredRegionId === id;

    if (isSelected) return 2.5;
    if (isHovered) return 1.5;
    return 0;
  };

  // Render ordered list: outside first, then disjoint circular partitions
  const regionsToRender: VennRegionId[] = [
    'outside',
    'onlyA',
    'onlyB',
    'onlyC',
    'onlyAB',
    'onlyAC',
    'onlyBC',
    'allThree',
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls & Reset Action */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand font-semibold block">
            Interactive Venn Explorer
          </span>
          <p className="text-xs sm:text-sm text-content-secondary mt-0.5">
            Hover or click any partition to inspect its exact mathematical derivation and respondent count.
          </p>
        </div>
        {activeSelectedId && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="text-xs h-7 gap-1 font-mono text-content-muted hover:text-content-primary"
            data-testid="reset-venn-selection"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Selection
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive SVG Diagram */}
        <div className="lg:col-span-7 bg-surface border border-surface-border rounded-panel p-6 shadow-subtle flex flex-col items-center">
          <svg
            viewBox="0 0 500 400"
            className="w-full h-auto max-w-[480px] select-none"
            role="img"
            aria-label="Three-Set Venn Diagram showing Personal, Vehicle, and Consumer Loan Overlaps"
          >
            {/* Outer Box Hairline Border */}
            <rect
              x="10"
              y="10"
              width="480"
              height="380"
              rx="8"
              fill="none"
              stroke="#D4D8D2"
              strokeWidth="1"
              strokeDasharray={activeSelectedId === 'outside' ? 'none' : '4 3'}
              className="pointer-events-none"
            />

            {/* Render 8 Independent Mutually Disjoint Geometric Region Paths */}
            {regionsToRender.map((id) => {
              const detail = regionMap.get(id);
              if (!detail) return null;
              const pathD = VENN_PATHS[id];
              const isSelected = activeSelectedId === id;
              const isHovered = hoveredRegionId === id;

              return (
                <path
                  key={id}
                  d={pathD}
                  fill={detail.color}
                  fillOpacity={getRegionOpacity(id)}
                  fillRule={id === 'outside' ? 'evenodd' : undefined}
                  stroke={getRegionStroke(id, detail.color)}
                  strokeWidth={getRegionStrokeWidth(id)}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-all duration-150 focus:outline-none"
                  role="button"
                  tabIndex={0}
                  aria-label={`${detail.name}: ${detail.count} respondents (${detail.percentageOfTotal.toFixed(1)}%)`}
                  aria-pressed={isSelected}
                  data-testid={`venn-region-${id}`}
                  data-region-id={id}
                  onClick={() => handleRegionClick(id)}
                  onMouseEnter={() => setHoveredRegionId(id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRegionClick(id);
                    }
                  }}
                  style={{
                    filter: isHovered || isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' : 'none',
                  }}
                />
              );
            })}

            {/* Structural Boundary Rings for Circles A, B, C */}
            <circle
              cx={circleA.cx}
              cy={circleA.cy}
              r={circleA.r}
              fill="none"
              stroke="#3973B9"
              strokeWidth={activeSelectedId === 'onlyA' ? '2.5' : '1.5'}
              strokeOpacity={activeSelectedId && activeSelectedId !== 'onlyA' ? 0.35 : 0.8}
              className="pointer-events-none transition-all duration-150"
            />
            <circle
              cx={circleB.cx}
              cy={circleB.cy}
              r={circleB.r}
              fill="none"
              stroke="#C18428"
              strokeWidth={activeSelectedId === 'onlyB' ? '2.5' : '1.5'}
              strokeOpacity={activeSelectedId && activeSelectedId !== 'onlyB' ? 0.35 : 0.8}
              className="pointer-events-none transition-all duration-150"
            />
            <circle
              cx={circleC.cx}
              cy={circleC.cy}
              r={circleC.r}
              fill="none"
              stroke="#8066B2"
              strokeWidth={activeSelectedId === 'onlyC' ? '2.5' : '1.5'}
              strokeOpacity={activeSelectedId && activeSelectedId !== 'onlyC' ? 0.35 : 0.8}
              className="pointer-events-none transition-all duration-150"
            />

            {/* Numerical Centroid Labels (Pass-through pointer events) */}
            {/* R1: Only A */}
            <g className="pointer-events-none" transform="translate(145, 140)">
              <text textAnchor="middle" dy="4" className="font-mono text-sm font-bold fill-content-primary">
                {regionMap.get('onlyA')?.count}
              </text>
            </g>

            {/* R2: Only B */}
            <g className="pointer-events-none" transform="translate(355, 140)">
              <text textAnchor="middle" dy="4" className="font-mono text-sm font-bold fill-content-primary">
                {regionMap.get('onlyB')?.count}
              </text>
            </g>

            {/* R3: Only C */}
            <g className="pointer-events-none" transform="translate(250, 315)">
              <text textAnchor="middle" dy="4" className="font-mono text-sm font-bold fill-content-primary">
                {regionMap.get('onlyC')?.count}
              </text>
            </g>

            {/* R4: Only AB */}
            <g className="pointer-events-none" transform="translate(250, 130)">
              <text textAnchor="middle" dy="4" className="font-mono text-xs font-bold fill-content-primary">
                {regionMap.get('onlyAB')?.count}
              </text>
            </g>

            {/* R5: Only BC */}
            <g className="pointer-events-none" transform="translate(295, 215)">
              <text textAnchor="middle" dy="4" className="font-mono text-xs font-bold fill-content-primary">
                {regionMap.get('onlyBC')?.count}
              </text>
            </g>

            {/* R6: Only AC */}
            <g className="pointer-events-none" transform="translate(205, 215)">
              <text textAnchor="middle" dy="4" className="font-mono text-xs font-bold fill-content-primary">
                {regionMap.get('onlyAC')?.count}
              </text>
            </g>

            {/* R7: All Three (The Core Trap) */}
            <g className="pointer-events-none" transform="translate(250, 195)">
              <circle r="12" fill="#176B57" fillOpacity="0.9" />
              <text textAnchor="middle" dy="4" className="font-mono text-xs font-bold fill-white">
                {regionMap.get('allThree')?.count}
              </text>
            </g>

            {/* R8: Outside label */}
            <g className="pointer-events-none" transform="translate(45, 35)">
              <text className="font-mono text-xs uppercase tracking-wider fill-content-muted">
                Outside: {regionMap.get('outside')?.count}
              </text>
            </g>

            {/* Set Identity Labels */}
            <text x="120" y="55" className="font-mono text-xs font-semibold fill-[#3973B9] pointer-events-none">
              Set A (Personal)
            </text>
            <text x="310" y="55" className="font-mono text-xs font-semibold fill-[#C18428] pointer-events-none">
              Set B (Vehicle)
            </text>
            <text x="210" y="380" className="font-mono text-xs font-semibold fill-[#8066B2] pointer-events-none">
              Set C (Consumer Durable / BNPL)
            </text>
          </svg>

          {/* Mathematical Disclaimer */}
          <div className="mt-4 p-3.5 rounded-card bg-surface-secondary/40 border border-surface-border text-center text-xs text-content-muted leading-relaxed max-w-md">
            <Info className="w-3.5 h-3.5 text-content-muted inline mr-1 -mt-0.5" />
            Venn diagram is a topological illustration of subset partitions. Displayed pixel areas are geometric conventions and not quantitatively proportional to respondent counts.
          </div>
        </div>

        {/* Right Column: Region Inspector Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="p-6 rounded-panel bg-white border border-surface-border shadow-subtle space-y-5"
            data-testid="venn-inspector-panel"
          >
            <div className="border-b border-surface-border/70 pb-3 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-content-muted">
                Partition Inspector
              </span>
              {inspectedRegion && (
                <div className="flex items-center gap-2">
                  {activeSelectedId === inspectedRegion.id && (
                    <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-brand-soft text-brand-dark font-medium">
                      Selected
                    </span>
                  )}
                  {hoveredRegionId === inspectedRegion.id && activeSelectedId !== inspectedRegion.id && (
                    <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-surface-secondary text-content-secondary font-medium">
                      Hovering
                    </span>
                  )}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: inspectedRegion.color }}
                  />
                </div>
              )}
            </div>

            {inspectedRegion ? (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h3
                    className="text-lg font-serif font-normal text-content-primary"
                    data-testid="inspector-region-name"
                  >
                    {inspectedRegion.name}
                  </h3>
                  <p
                    className="text-xs font-mono text-brand font-medium mt-0.5"
                    data-testid="inspector-set-expression"
                  >
                    {inspectedRegion.setExpression}
                  </p>
                </div>

                {/* Quantitative Metric Badges */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-card bg-surface-secondary/40 border border-surface-border">
                    <span className="text-xs font-mono uppercase tracking-widest text-content-muted block">
                      Respondent Count
                    </span>
                    <span
                      className="text-2xl font-mono font-normal text-content-primary mt-1 block"
                      data-testid="inspector-count"
                    >
                      {inspectedRegion.count}
                    </span>
                    <span className="text-xs text-content-secondary">
                      {inspectedRegion.percentageOfTotal.toFixed(1)}% of cohort (N={data.totalRespondents})
                    </span>
                  </div>

                  <div className="p-3.5 rounded-card bg-surface-secondary/40 border border-surface-border">
                    <span className="text-xs font-mono uppercase tracking-widest text-content-muted block">
                      Share of Indebted
                    </span>
                    <span
                      className="text-2xl font-mono font-normal text-content-primary mt-1 block"
                      data-testid="inspector-share-indebted"
                    >
                      {inspectedRegion.percentageOfUnion > 0
                        ? `${inspectedRegion.percentageOfUnion.toFixed(1)}%`
                        : 'N/A'}
                    </span>
                    <span className="text-xs text-content-secondary">
                      Of |A ∪ B ∪ C| union
                    </span>
                  </div>
                </div>

                {/* Subtraction Formula */}
                <div className="p-3.5 rounded-card bg-surface-secondary/50 border border-surface-border space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-content-muted block">
                    Exclusive Subtraction Formula
                  </span>
                  <div
                    className="font-mono text-xs sm:text-sm text-content-primary"
                    data-testid="inspector-formula"
                  >
                    {inspectedRegion.exclusiveFormula}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-serif">
                  {inspectedRegion.description}
                </p>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-content-muted space-y-2">
                <p className="font-serif italic text-base text-content-secondary">
                  No partition selected
                </p>
                <p className="text-xs max-w-xs mx-auto">
                  Click on any region inside the Venn diagram or choose from the partition breakdown table below to inspect details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
