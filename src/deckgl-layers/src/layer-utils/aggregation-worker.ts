// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  aggregatePointsToBins,
  AggregationWorkerRequest,
  AggregationWorkerResult
} from './cpu-aggregation-core';

type PendingJob = {
  request: AggregationWorkerRequest;
  resolve: (result: AggregationWorkerResult) => void;
  reject: (error: Error) => void;
};

let worker: Worker | null | undefined;
let workerObjectUrl: string | null = null;
let nextJobId = 1;
const pending = new Map<number, PendingJob>();

// Worker source is a literal script. Bundled function.toString() is unsafe:
// esbuild rewrites constants and can inject PURE comments into the body.
const WORKER_SOURCE = `
var WEB_MERCATOR_TILE_SIZE = 512;
var THIRD_PI = Math.PI / 3;
var HEX_DIST_X = 2 * Math.sin(THIRD_PI);
var HEX_DIST_Y = 1.5;

function lngLatToWorld(lng, lat, scale) {
  if (scale === void 0) scale = 1;
  var lambda = (lng * Math.PI) / 180;
  var phi = (lat * Math.PI) / 180;
  var x = (WEB_MERCATOR_TILE_SIZE * (lambda + Math.PI)) / (2 * Math.PI);
  var y =
    (WEB_MERCATOR_TILE_SIZE * (Math.PI + Math.log(Math.tan(Math.PI * 0.25 + phi * 0.5)))) /
    (2 * Math.PI);
  y = Math.max(-318, Math.min(830, y));
  return [x * scale, y * scale];
}

function pointToHexbin(px, py, radius) {
  py = py / radius / HEX_DIST_Y;
  var pj = Math.round(py);
  px = px / radius / HEX_DIST_X - (pj & 1) / 2;
  var pi = Math.round(px);
  var py1 = py - pj;
  if (Math.abs(py1) * 3 > 1) {
    var px1 = px - pi;
    var pi2 = pi + (px < pi ? -1 : 1) / 2;
    var pj2 = pj + (py < pj ? -1 : 1);
    var px2 = px - pi2;
    var py2 = py - pj2;
    if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) {
      pi = pi2 + (pj & 1 ? 1 : -1) / 2;
      pj = pj2;
    }
  }
  return [pi, pj];
}

function reduceChannel(indices, getValue, operation) {
  if (operation === 'COUNT') return indices.length;
  var sum = 0;
  var valid = 0;
  var min = Infinity;
  var max = -Infinity;
  for (var i = 0; i < indices.length; i++) {
    var value = getValue(indices[i]);
    if (!Number.isFinite(value)) continue;
    valid++;
    sum += value;
    if (value < min) min = value;
    if (value > max) max = value;
  }
  if (valid === 0) return operation === 'SUM' ? 0 : NaN;
  if (operation === 'SUM') return sum;
  if (operation === 'MEAN') return sum / valid;
  if (operation === 'MIN') return min;
  if (operation === 'MAX') return max;
  return valid;
}

function domainOf(values, count) {
  var min = Infinity;
  var max = -Infinity;
  for (var i = 0; i < count; i++) {
    var v = values[i];
    if (!Number.isFinite(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === Infinity) return [NaN, NaN];
  return [min, max];
}

function aggregatePointsToBins(request) {
  var id = request.id;
  var binType = request.binType;
  var pointCount = request.pointCount;
  var positions = request.positions;
  var positionSize = request.positionSize;
  var colorWeights = request.colorWeights;
  var elevationWeights = request.elevationWeights;
  var colorOperation = request.colorOperation;
  var elevationOperation = request.elevationOperation;
  var scale = request.scale;
  var originX = request.originX;
  var originY = request.originY;
  var cellSizeX = request.cellSizeX;
  var cellSizeY = request.cellSizeY;
  var radiusCommon = request.radiusCommon;
  var binPoints = new Map();
  var binIdsByKey = new Map();

  for (var i = 0; i < pointCount; i++) {
    var x;
    var y;
    if (request.preprojected) {
      x = positions[i * positionSize];
      y = positions[i * positionSize + 1];
    } else {
      var lng = positions[i * positionSize];
      var lat = positions[i * positionSize + 1];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
      var world = lngLatToWorld(lng, lat, scale);
      x = world[0];
      y = world[1];
    }
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    var col;
    var row;
    if (binType === 'hexagon') {
      var hex = pointToHexbin(x - originX, y - originY, radiusCommon);
      col = hex[0];
      row = hex[1];
    } else {
      col = Math.floor((x - originX) / cellSizeX);
      row = Math.floor((y - originY) / cellSizeY);
    }

    var key = col + ',' + row;
    var points = binPoints.get(key);
    if (!points) {
      points = [];
      binPoints.set(key, points);
      binIdsByKey.set(key, [col, row]);
    }
    points.push(i);
  }

  var binCount = binPoints.size;
  var binIds = new Float32Array(binCount * 2);
  var colorValues = new Float32Array(binCount);
  var elevationValues = new Float32Array(binCount);
  var counts = new Uint32Array(binCount);
  var pointIndexOffsets = new Uint32Array(binCount + 1);
  var totalPoints = 0;
  var binIndex = 0;
  binPoints.forEach(function (pts, k) {
    var idPair = binIdsByKey.get(k);
    binIds[binIndex * 2] = idPair[0];
    binIds[binIndex * 2 + 1] = idPair[1];
    counts[binIndex] = pts.length;
    colorValues[binIndex] = reduceChannel(pts, function (j) { return colorWeights[j]; }, colorOperation);
    elevationValues[binIndex] = reduceChannel(pts, function (j) { return elevationWeights[j]; }, elevationOperation);
    pointIndexOffsets[binIndex] = totalPoints;
    totalPoints += pts.length;
    binIndex++;
  });
  pointIndexOffsets[binCount] = totalPoints;

  var pointIndices = new Uint32Array(0);

  return {
    id: id,
    binCount: binCount,
    binIds: binIds,
    colorValues: colorValues,
    elevationValues: elevationValues,
    counts: counts,
    colorDomain: domainOf(colorValues, binCount),
    elevationDomain: domainOf(elevationValues, binCount),
    pointIndexOffsets: pointIndexOffsets,
    pointIndices: pointIndices
  };
}

self.onmessage = function (event) {
  try {
    var result = aggregatePointsToBins(event.data);
    self.postMessage(result, [
      result.binIds.buffer,
      result.colorValues.buffer,
      result.elevationValues.buffer,
      result.counts.buffer,
      result.pointIndexOffsets.buffer,
      result.pointIndices.buffer
    ]);
  } catch (err) {
    self.postMessage({
      id: event.data && event.data.id,
      error: String(err && err.message ? err.message : err)
    });
  }
};
`;

function handleWorkerMessage(event: MessageEvent): void {
  const data = event.data as AggregationWorkerResult & {error?: string};
  const job = pending.get(data.id);
  if (!job) return;
  pending.delete(data.id);
  if (data.error) {
    job.reject(new Error(data.error));
    return;
  }
  job.resolve(data);
}

export function isAggregationWorkerAvailable(): boolean {
  return typeof Worker !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined';
}

function getWorker(): Worker | null {
  if (worker === undefined) {
    if (!isAggregationWorkerAvailable()) {
      worker = null;
      return worker;
    }
    try {
      workerObjectUrl = URL.createObjectURL(
        new Blob([WORKER_SOURCE], {type: 'application/javascript'})
      );
      worker = new Worker(workerObjectUrl);
      worker.onmessage = handleWorkerMessage;
      worker.onerror = event => {
        pending.forEach(job => job.reject(new Error(event.message || 'Aggregation worker error')));
        pending.clear();
      };
    } catch {
      worker = null;
    }
  }
  return worker;
}

export function runAggregationInWorker(
  request: Omit<AggregationWorkerRequest, 'id'>
): Promise<AggregationWorkerResult> {
  const w = getWorker();
  if (!w) {
    // Sync fallback for tests / missing Worker. Copies are cheap vs a 600k freeze
    // in the browser; callers should prefer the worker path.
    return Promise.resolve(aggregatePointsToBins({...request, id: 0}));
  }

  const id = nextJobId++;
  const payload: AggregationWorkerRequest = {...request, id};
  return new Promise((resolve, reject) => {
    pending.set(id, {request: payload, resolve, reject});
    w.postMessage(payload, [
      payload.positions.buffer,
      payload.colorWeights.buffer,
      payload.elevationWeights.buffer
    ]);
  });
}

export function destroyAggregationWorker(): void {
  pending.forEach(job => job.reject(new Error('Aggregation worker destroyed')));
  pending.clear();
  if (worker) {
    worker.terminate();
  }
  if (workerObjectUrl) {
    URL.revokeObjectURL(workerObjectUrl);
  }
  worker = undefined;
  workerObjectUrl = null;
}
