// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Pure CPU grid/hexagon aggregation used both on the main thread (tests / small
 * data) and inside a Web Worker (large data). This file must stay free of
 * imports so its functions can be serialized into a Blob worker.
 */

/** Point count at which grid/hex aggregation is offloaded to a worker. */
export const ASYNC_CPU_AGGREGATION_THRESHOLD = 20_000;

/** Kepler aggregation types that map onto deck.gl built-in CPU ops. */
export const WORKER_COMPATIBLE_AGGREGATIONS: Record<string, true> = {
  count: true,
  sum: true,
  average: true,
  maximum: true,
  minimum: true
};

export type DeckAggregationOperation = 'SUM' | 'MEAN' | 'MIN' | 'MAX' | 'COUNT';

export type AggregationBinType = 'grid' | 'hexagon';

export type AggregationWorkerRequest = {
  id: number;
  binType: AggregationBinType;
  pointCount: number;
  positions: Float64Array;
  positionSize: number;
  /**
   * When true, `positions` are already in deck.gl common space (the same space
   * as cellOriginCommon / cellSizeCommon). When false they are lng/lat.
   */
  preprojected: boolean;
  colorWeights: Float32Array;
  elevationWeights: Float32Array;
  colorOperation: DeckAggregationOperation;
  elevationOperation: DeckAggregationOperation;
  /**
   * Extra scale applied after zoom-0 Web Mercator. Deck.gl 9 `projectFlat` /
   * `projectPosition` use zoom-independent common space, so this must be `1`
   * when matching GridLayer / HexagonLayer bin ids.
   */
  scale: number;
  originX: number;
  originY: number;
  cellSizeX: number;
  cellSizeY: number;
  radiusCommon: number;
};

export type AggregationWorkerResult = {
  id: number;
  binCount: number;
  binIds: Float32Array;
  colorValues: Float32Array;
  elevationValues: Float32Array;
  counts: Uint32Array;
  colorDomain: [number, number];
  elevationDomain: [number, number];
  pointIndexOffsets: Uint32Array;
  pointIndices: Uint32Array;
};

/** math.gl / deck.gl WebMercator TILE_SIZE. */
export const WEB_MERCATOR_TILE_SIZE = 512;

const THIRD_PI = Math.PI / 3;
const HEX_DIST_X = 2 * Math.sin(THIRD_PI);
const HEX_DIST_Y = 1.5;

export function isWorkerCompatibleAggregation(aggregation: string | null | undefined): boolean {
  return Boolean(aggregation && WORKER_COMPATIBLE_AGGREGATIONS[aggregation]);
}

export function shouldUseAsyncCpuAggregation(
  pointCount: number,
  colorAggregation?: string | null,
  sizeAggregation?: string | null
): boolean {
  return (
    pointCount >= ASYNC_CPU_AGGREGATION_THRESHOLD &&
    isWorkerCompatibleAggregation(colorAggregation || 'count') &&
    isWorkerCompatibleAggregation(sizeAggregation || 'count')
  );
}

export function toDeckAggregationOperation(
  aggregation: string | null | undefined,
  opts?: {countAsSum?: boolean}
): DeckAggregationOperation {
  switch (aggregation) {
    case 'average':
      return 'MEAN';
    case 'sum':
      return 'SUM';
    case 'maximum':
      return 'MAX';
    case 'minimum':
      return 'MIN';
    case 'count':
    default:
      return opts?.countAsSum ? 'SUM' : 'COUNT';
  }
}

/**
 * Web Mercator world coordinates matching `@math.gl/web-mercator` lngLatToWorld
 * and deck.gl 9 `Viewport.projectFlat` (zoom-0 common space when scale is 1).
 * Y is clamped the same way deck.gl clamps projected latitude.
 */
export function lngLatToWorld(lng: number, lat: number, scale = 1): [number, number] {
  const lambda = (lng * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const x = (WEB_MERCATOR_TILE_SIZE * (lambda + Math.PI)) / (2 * Math.PI);
  let y =
    (WEB_MERCATOR_TILE_SIZE * (Math.PI + Math.log(Math.tan(Math.PI * 0.25 + phi * 0.5)))) /
    (2 * Math.PI);
  // deck.gl Viewport.projectFlat: shader clamps latitude to +-89.9
  y = Math.max(-318, Math.min(830, y));
  return [x * scale, y * scale];
}

/**
 * Adapted from d3-hexbin / deck.gl HexagonLayer.pointToHexbin.
 */
export function pointToHexbin(px: number, py: number, radius: number): [number, number] {
  // Match deck.gl HexagonLayer / d3-hexbin, including in-place px/py updates.
  py = py / radius / HEX_DIST_Y;
  let pj = Math.round(py);
  px = px / radius / HEX_DIST_X - (pj & 1) / 2;
  let pi = Math.round(px);
  const py1 = py - pj;

  if (Math.abs(py1) * 3 > 1) {
    const px1 = px - pi;
    const pi2 = pi + (px < pi ? -1 : 1) / 2;
    const pj2 = pj + (py < pj ? -1 : 1);
    const px2 = px - pi2;
    const py2 = py - pj2;
    if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) {
      pi = pi2 + (pj & 1 ? 1 : -1) / 2;
      pj = pj2;
    }
  }
  return [pi, pj];
}

export function reduceChannel(
  indices: number[],
  getValue: (index: number) => number,
  operation: DeckAggregationOperation
): number {
  if (operation === 'COUNT') {
    return indices.length;
  }

  let sum = 0;
  let valid = 0;
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < indices.length; i++) {
    const value = getValue(indices[i]);
    if (!Number.isFinite(value)) continue;
    valid++;
    sum += value;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  if (valid === 0) {
    return operation === 'SUM' ? 0 : NaN;
  }

  switch (operation) {
    case 'SUM':
      return sum;
    case 'MEAN':
      return sum / valid;
    case 'MIN':
      return min;
    case 'MAX':
      return max;
    default:
      return valid;
  }
}

export function domainOf(values: Float32Array, count: number): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < count; i++) {
    const v = values[i];
    if (!Number.isFinite(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === Infinity) return [NaN, NaN];
  return [min, max];
}

export function aggregatePointsToBins(request: AggregationWorkerRequest): AggregationWorkerResult {
  const {
    id,
    binType,
    pointCount,
    positions,
    positionSize,
    colorWeights,
    elevationWeights,
    colorOperation,
    elevationOperation,
    scale,
    originX,
    originY,
    cellSizeX,
    cellSizeY,
    radiusCommon
  } = request;

  const binPoints = new Map<string, number[]>();
  const binIdsByKey = new Map<string, [number, number]>();

  for (let i = 0; i < pointCount; i++) {
    let x: number;
    let y: number;
    if (request.preprojected) {
      x = positions[i * positionSize];
      y = positions[i * positionSize + 1];
    } else {
      const lng = positions[i * positionSize];
      const lat = positions[i * positionSize + 1];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
      const world = lngLatToWorld(lng, lat, scale);
      x = world[0];
      y = world[1];
    }
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    let col: number;
    let row: number;
    if (binType === 'hexagon') {
      const hex = pointToHexbin(x - originX, y - originY, radiusCommon);
      col = hex[0];
      row = hex[1];
    } else {
      col = Math.floor((x - originX) / cellSizeX);
      row = Math.floor((y - originY) / cellSizeY);
    }

    const key = `${col},${row}`;
    let points = binPoints.get(key);
    if (!points) {
      points = [];
      binPoints.set(key, points);
      binIdsByKey.set(key, [col, row]);
    }
    points.push(i);
  }

  const binCount = binPoints.size;
  const binIds = new Float32Array(binCount * 2);
  const colorValues = new Float32Array(binCount);
  const elevationValues = new Float32Array(binCount);
  const counts = new Uint32Array(binCount);
  const pointIndexOffsets = new Uint32Array(binCount + 1);

  let totalPoints = 0;
  let binIndex = 0;
  binPoints.forEach((points, key) => {
    const idPair = binIdsByKey.get(key) as [number, number];
    binIds[binIndex * 2] = idPair[0];
    binIds[binIndex * 2 + 1] = idPair[1];
    counts[binIndex] = points.length;
    colorValues[binIndex] = reduceChannel(points, j => colorWeights[j], colorOperation);
    elevationValues[binIndex] = reduceChannel(points, j => elevationWeights[j], elevationOperation);
    pointIndexOffsets[binIndex] = totalPoints;
    totalPoints += points.length;
    binIndex++;
  });
  pointIndexOffsets[binCount] = totalPoints;

  const pointIndices = new Uint32Array(totalPoints);
  binIndex = 0;
  binPoints.forEach(points => {
    const offset = pointIndexOffsets[binIndex];
    for (let p = 0; p < points.length; p++) {
      pointIndices[offset + p] = points[p];
    }
    binIndex++;
  });

  return {
    id,
    binCount,
    binIds,
    colorValues,
    elevationValues,
    counts,
    colorDomain: domainOf(colorValues, binCount),
    elevationDomain: domainOf(elevationValues, binCount),
    pointIndexOffsets,
    pointIndices
  };
}
