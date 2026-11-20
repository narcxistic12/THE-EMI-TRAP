import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { VennDiagramSvg, VENN_PATHS } from '../components/venn/VennDiagramSvg';
import { ILLUSTRATIVE_SET_DATA } from '../lib/math/setTheory';
import { getVennRegionDetails } from '../lib/math/vennRegions';
import { VennRegionId } from '../types/setTheory';

describe('VennDiagramSvg — Interactive Venn Explorer & Path Geometry', () => {
  const data = ILLUSTRATIVE_SET_DATA;
  const regionDetails = getVennRegionDetails(data);
  const regionMap = new Map(regionDetails.map((r) => [r.id, r]));

  describe('Geometric Path Definitions', () => {
    const regionIds: VennRegionId[] = [
      'onlyA',
      'onlyB',
      'onlyC',
      'onlyAB',
      'onlyAC',
      'onlyBC',
      'allThree',
      'outside',
    ];

    it('defines distinct, valid SVG path strings for all 8 mutually exclusive regions', () => {
      for (const id of regionIds) {
        const path = VENN_PATHS[id];
        expect(path).toBeDefined();
        expect(typeof path).toBe('string');
        expect(path.length).toBeGreaterThan(20);
        expect(path.startsWith('M')).toBe(true);
        expect(path.endsWith('Z')).toBe(true);
      }
    });

    it('ensures each path string is unique to its partition', () => {
      const allPaths = regionIds.map((id) => VENN_PATHS[id]);
      const uniquePaths = new Set(allPaths);
      expect(uniquePaths.size).toBe(8);
    });

    it('configures outside region with evenodd cutout syntax', () => {
      const outsidePath = VENN_PATHS.outside;
      // Must contain outer bounding box and inner cutout loop
      expect(outsidePath).toContain('M 10 10 H 490 V 390 H 10 Z');
      expect(outsidePath).toContain('M 150.73 251.97');
    });
  });

  describe('Centroid Hit-Target Mathematical Verification', () => {
    // Circle definitions
    const cA = { cx: 190, cy: 160, r: 100 };
    const cB = { cx: 310, cy: 160, r: 100 };
    const cC = { cx: 250, cy: 264, r: 100 };

    const dist = (p: { x: number; y: number }, c: { cx: number; cy: number }) =>
      Math.hypot(p.x - c.cx, p.y - c.cy);

    const getMathRegion = (p: { x: number; y: number }): VennRegionId => {
      const inA = dist(p, cA) <= 100.001;
      const inB = dist(p, cB) <= 100.001;
      const inC = dist(p, cC) <= 100.001;
      if (inA && inB && inC) return 'allThree';
      if (inA && inB && !inC) return 'onlyAB';
      if (inA && !inB && inC) return 'onlyAC';
      if (!inA && inB && inC) return 'onlyBC';
      if (inA && !inB && !inC) return 'onlyA';
      if (!inA && inB && !inC) return 'onlyB';
      if (!inA && !inB && inC) return 'onlyC';
      return 'outside';
    };

    const centroids: Record<VennRegionId, { x: number; y: number; expectedCount: number }> = {
      onlyA: { x: 145, y: 140, expectedCount: 18 },
      onlyB: { x: 355, y: 140, expectedCount: 15 },
      onlyC: { x: 250, y: 315, expectedCount: 13 },
      onlyAB: { x: 250, y: 130, expectedCount: 10 },
      onlyBC: { x: 295, y: 215, expectedCount: 5 },
      onlyAC: { x: 205, y: 215, expectedCount: 7 },
      allThree: { x: 250, y: 195, expectedCount: 5 },
      outside: { x: 45, y: 35, expectedCount: 27 },
    };

    it('verifies that each region centroid strictly satisfies its set-theoretic membership', () => {
      for (const [id, point] of Object.entries(centroids)) {
        const mathRegion = getMathRegion(point);
        expect(mathRegion).toBe(id);
      }
    });

    it('verifies exact counts and percentages across all 8 regions', () => {
      for (const [id, { expectedCount }] of Object.entries(centroids)) {
        const detail = regionMap.get(id as VennRegionId);
        expect(detail).toBeDefined();
        expect(detail?.count).toBe(expectedCount);
        expect(detail?.percentageOfTotal).toBeCloseTo((expectedCount / 100) * 100, 1);
      }
    });
  });

  describe('Static & Interactive Rendering Output', () => {
    it('renders the SVG with all 8 path elements and data-testid attributes', () => {
      const html = renderToString(<VennDiagramSvg data={data} />);

      // Verify SVG role and accessibility
      expect(html).toContain('role="img"');
      expect(html).toContain('aria-label="Three-Set Venn Diagram showing Personal, Vehicle, and Consumer Loan Overlaps"');

      // Verify all 8 interactive region paths exist
      const regionIds: VennRegionId[] = [
        'onlyA',
        'onlyB',
        'onlyC',
        'onlyAB',
        'onlyAC',
        'onlyBC',
        'allThree',
        'outside',
      ];

      for (const id of regionIds) {
        expect(html).toContain(`data-testid="venn-region-${id}"`);
        expect(html).toContain(`data-region-id="${id}"`);
        expect(html).toContain('role="button"');
        expect(html).toContain('tabindex="0"');
      }

      // Verify the 3 circular boundary stroke rings exist
      expect(html).toContain('stroke="#3973B9"');
      expect(html).toContain('stroke="#C18428"');
      expect(html).toContain('stroke="#8066B2"');

      // Verify numerical badges match counts in SVG text
      expect(html).toContain('>18<');
      expect(html).toContain('>15<');
      expect(html).toContain('>13<');
      expect(html).toContain('>10<');
      expect(html).toContain('>7<');
      expect(html).toContain('>5<');
      expect(html).toContain('Outside:');
      expect(html).toContain('27');
    });

    it('renders default inspector state when no region is selected', () => {
      const html = renderToString(<VennDiagramSvg data={data} />);
      expect(html).toContain('Partition Inspector');
      expect(html).toContain('No partition selected');
      expect(html).toContain('Click on any region inside the Venn diagram');
      expect(html).not.toContain('data-testid="reset-venn-selection"');
    });

    it('renders selected region details when selectedRegionId is provided', () => {
      // Test selecting "onlyA" (count: 18)
      const htmlA = renderToString(
        <VennDiagramSvg data={data} selectedRegionId="onlyA" />
      );

      expect(htmlA).toContain('Only Personal Loan');
      expect(htmlA).toContain('A \\ (B ∪ C)');
      expect(htmlA).toContain('data-testid="inspector-count">18<');
      expect(htmlA).toContain('|A| - |A ∩ B| - |A ∩ C| + |A ∩ B ∩ C|');
      expect(htmlA).toContain('data-testid="reset-venn-selection"');
      expect(htmlA).toContain('Selected');

      // Test selecting "allThree" (count: 5)
      const htmlAll = renderToString(
        <VennDiagramSvg data={data} selectedRegionId="allThree" />
      );

      expect(htmlAll).toContain('All Three Categories (The Core EMI Trap)');
      expect(htmlAll).toContain('A ∩ B ∩ C');
      expect(htmlAll).toContain('data-testid="inspector-count">5<');
      expect(htmlAll).toContain('|A ∩ B ∩ C|');
      expect(htmlAll).toContain('data-testid="reset-venn-selection"');

      // Test selecting "outside" (count: 27)
      const htmlOutside = renderToString(
        <VennDiagramSvg data={data} selectedRegionId="outside" />
      );

      expect(htmlOutside).toContain('Outside Selected Categories');
      expect(htmlOutside).toContain('U \\ (A ∪ B ∪ C)');
      expect(htmlOutside).toContain('data-testid="inspector-count">27<');
    });

    it('correctly sets aria-pressed="true" on selected path and false on others', () => {
      const html = renderToString(
        <VennDiagramSvg data={data} selectedRegionId="onlyB" />
      );

      // Extract the path element for onlyB
      const onlyBTag = html.match(/<path[^>]*data-testid="venn-region-onlyB"[^>]*>/)?.[0] || '';
      expect(onlyBTag).toContain('aria-pressed="true"');

      // Extract the path element for onlyA
      const onlyATag = html.match(/<path[^>]*data-testid="venn-region-onlyA"[^>]*>/)?.[0] || '';
      expect(onlyATag).toContain('aria-pressed="false"');
    });
  });

  describe('Interactive State Transitions & Inspection Priority', () => {
    // Pure function representing the inspector fallback logic:
    // inspectedRegion = hoveredRegion || selectedRegion
    const resolveInspectedRegion = (
      hoveredId: VennRegionId | null,
      selectedId: VennRegionId | null
    ): VennRegionId | null => {
      return hoveredId || selectedId;
    };

    it('returns null when neither hovered nor selected', () => {
      expect(resolveInspectedRegion(null, null)).toBeNull();
    });

    it('prioritizes hovered region when nothing is locked/selected', () => {
      expect(resolveInspectedRegion('onlyA', null)).toBe('onlyA');
      expect(resolveInspectedRegion('allThree', null)).toBe('allThree');
      expect(resolveInspectedRegion('outside', null)).toBe('outside');
    });

    it('preserves selected region in inspector when pointer leaves (hovered becomes null)', () => {
      const selectedId: VennRegionId = 'onlyA';
      // User hovered onlyA, clicked it (selectedId = 'onlyA'), then moved pointer away (hoveredId = null)
      expect(resolveInspectedRegion(null, selectedId)).toBe('onlyA');
    });

    it('temporarily displays hovered region in inspector when hovering over another region while one is selected', () => {
      const selectedId: VennRegionId = 'onlyA';
      // User moves mouse over 'onlyB'
      expect(resolveInspectedRegion('onlyB', selectedId)).toBe('onlyB');
      // User moves mouse away from 'onlyB' without clicking
      expect(resolveInspectedRegion(null, selectedId)).toBe('onlyA');
    });

    it('clears inspector back to null on reset', () => {
      let selectedId: VennRegionId | null = 'onlyA';
      let hoveredId: VennRegionId | null = null;

      // Reset action sets selectedId = null
      selectedId = null;
      hoveredId = null;

      expect(resolveInspectedRegion(hoveredId, selectedId)).toBeNull();
    });
  });
});
