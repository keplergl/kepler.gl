// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const AGGREGATION_CELL_COUNT_WARNING_THRESHOLD = 100_000;

export type AggregationBinType = 'grid' | 'hexagon';

const KM_PER_DEG_LAT = 110.574;

/**
 * Approximate number of grid / hexagon cells that would cover a lng/lat bounding
 * box at the given cell size (km). This counts empty cells too and can be huge
 * when the data extent is large; deck.gl only creates occupied bins.
 *
 * bounds: [minLng, minLat, maxLng, maxLat]
 */
export function estimateBboxAggregationCellCount(
  bounds: number[] | null | undefined,
  cellSizeKm: number,
  binType: AggregationBinType = 'grid'
): number | null {
  if (!bounds || bounds.length < 4) return null;
  if (!Number.isFinite(cellSizeKm) || cellSizeKm <= 0) return null;

  const [minLng, minLat, maxLng, maxLat] = bounds;
  if (![minLng, minLat, maxLng, maxLat].every(Number.isFinite)) return null;
  if (maxLng <= minLng || maxLat <= minLat) return null;

  const midLat = (minLat + maxLat) / 2;
  const kmPerDegLng = 111.32 * Math.cos((midLat * Math.PI) / 180);
  const widthKm = (maxLng - minLng) * Math.abs(kmPerDegLng);
  const heightKm = (maxLat - minLat) * KM_PER_DEG_LAT;

  if (binType === 'hexagon') {
    // Pointy-top hexagon area for radius r: (3 * sqrt(3) / 2) * r^2
    const hexAreaKm2 = 1.5 * Math.sqrt(3) * cellSizeKm * cellSizeKm;
    if (hexAreaKm2 <= 0) return null;
    return Math.max(1, Math.ceil((widthKm * heightKm) / hexAreaKm2));
  }

  const cols = Math.max(1, Math.ceil(widthKm / cellSizeKm));
  const rows = Math.max(1, Math.ceil(heightKm / cellSizeKm));
  return cols * rows;
}

/**
 * Upper bound on cells the aggregation will actually create: occupied bins only,
 * so never more than the point count.
 */
export function estimateAggregationCellCount(
  bounds: number[] | null | undefined,
  cellSizeKm: number,
  binType: AggregationBinType = 'grid',
  pointCount?: number
): number | null {
  const bboxCount = estimateBboxAggregationCellCount(bounds, cellSizeKm, binType);
  const points =
    typeof pointCount === 'number' && Number.isFinite(pointCount) && pointCount >= 0
      ? Math.floor(pointCount)
      : null;

  if (bboxCount == null) {
    return points && points > 0 ? points : null;
  }
  if (points == null || points <= 0) {
    return bboxCount;
  }
  return Math.min(bboxCount, points);
}

/**
 * Warn only for large point sets that would also produce many occupied bins.
 * ~20k points is still fast at any radius; cost shows up around 100k+ occupied cells.
 */
export function isAggregationCellCountSlow(
  cellCount: number | null | undefined,
  pointCount?: number
): boolean {
  if (typeof cellCount !== 'number') return false;
  const points = typeof pointCount === 'number' && pointCount > 0 ? pointCount : cellCount;
  return (
    points >= AGGREGATION_CELL_COUNT_WARNING_THRESHOLD &&
    cellCount >= AGGREGATION_CELL_COUNT_WARNING_THRESHOLD
  );
}

export function getLayerPointCount(
  dataset:
    | {
        filteredIndex?: ArrayLike<unknown>;
        length?: number;
      }
    | null
    | undefined
): number {
  if (!dataset) return 0;
  if (dataset.filteredIndex && typeof dataset.filteredIndex.length === 'number') {
    return dataset.filteredIndex.length;
  }
  return typeof dataset.length === 'number' ? dataset.length : 0;
}
