// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  ASYNC_CPU_AGGREGATION_THRESHOLD,
  AggregationBinType,
  AggregationWorkerResult,
  DeckAggregationOperation
} from './cpu-aggregation-core';
import {isAggregationWorkerAvailable, runAggregationInWorker} from './aggregation-worker';

const BUILT_IN_OPS = new Set(['SUM', 'MEAN', 'MIN', 'MAX', 'COUNT']);

let aggregationsInProgress = 0;

export function getNumAggregationsBeingLoaded(): number {
  return aggregationsInProgress;
}

function beginAggregation(): void {
  aggregationsInProgress++;
}

function endAggregation(): void {
  aggregationsInProgress = Math.max(0, aggregationsInProgress - 1);
}

type SyncAggregator = {
  props?: Record<string, any>;
  binCount: number;
  setProps(props: Record<string, any>): void;
  setNeedsUpdate(channel?: number): void;
  update(): void;
  preDraw(): void;
  destroy(): void;
  getBins(): unknown;
  getResult(channel: number): unknown;
  getResultDomain(channel: number): [number, number];
  getBin(index: number): unknown;
};

/** Deck.gl 9 common space is zoom-0 Web Mercator (see Viewport.projectFlat). */
const DECK_COMMON_SPACE_SCALE = 1;

export type DisplayedBinOptions = {
  cellSizeCommon?: [number, number];
  cellOriginCommon?: [number, number];
  radiusCommon?: number;
  hexOriginCommon?: [number, number];
};

export type WorkerBackedCPUAggregatorOptions = {
  syncAggregator: SyncAggregator;
  binType: AggregationBinType;
  requestRedraw?: () => void;
};

function copyPositions(
  attr: any,
  pointCount: number
): {positions: Float64Array; positionSize: number} | null {
  const value = getAttributeValue(attr);
  if (!value) return null;
  const accessor = typeof attr.getAccessor === 'function' ? attr.getAccessor() : {};
  const size = accessor.size || attr.size || 3;
  const bytesPerElement = (value as {BYTES_PER_ELEMENT?: number}).BYTES_PER_ELEMENT || 8;
  const offset = (accessor.offset || 0) / bytesPerElement;
  const stride = accessor.stride ? accessor.stride / bytesPerElement : size;
  const needed = pointCount * size;

  if (
    offset === 0 &&
    stride === size &&
    typeof (value as Float64Array).subarray === 'function' &&
    value.length >= needed
  ) {
    const positions = new Float64Array(needed);
    positions.set((value as Float64Array).subarray(0, needed));
    return {positions, positionSize: size};
  }

  const out = new Float64Array(needed);
  for (let i = 0; i < pointCount; i++) {
    const src = offset + i * stride;
    for (let k = 0; k < size; k++) out[i * size + k] = value[src + k];
  }
  return {positions: out, positionSize: size};
}

function copyToFloat32(
  source: ArrayLike<number> | undefined,
  length: number,
  fill = 1
): Float32Array {
  const out = new Float32Array(length);
  if (!source) {
    out.fill(fill);
    return out;
  }
  if (typeof (source as Float32Array).subarray === 'function' && source.length >= length) {
    out.set((source as Float32Array).subarray(0, length));
    return out;
  }
  for (let i = 0; i < length; i++) out[i] = i < source.length ? source[i] : fill;
  return out;
}

function getAttributeValue(attr: any): ArrayLike<number> | null {
  if (!attr) return null;
  const value = attr.value ?? attr.getValue?.();
  return value && value.length ? value : null;
}

function binOptionsKey(binOptions: Record<string, any> | undefined): string {
  if (!binOptions) return '';
  const origin = binOptions.cellOriginCommon || binOptions.hexOriginCommon || [];
  const size = binOptions.cellSizeCommon || [];
  return [origin[0], origin[1], size[0], size[1], binOptions.radiusCommon].join(',');
}

function cloneBinOptions(binOptions: Record<string, any> | undefined): DisplayedBinOptions | null {
  if (!binOptions) return null;
  return {
    cellSizeCommon: binOptions.cellSizeCommon
      ? [binOptions.cellSizeCommon[0], binOptions.cellSizeCommon[1]]
      : undefined,
    cellOriginCommon: binOptions.cellOriginCommon
      ? [binOptions.cellOriginCommon[0], binOptions.cellOriginCommon[1]]
      : undefined,
    radiusCommon: binOptions.radiusCommon,
    hexOriginCommon: binOptions.hexOriginCommon
      ? [binOptions.hexOriginCommon[0], binOptions.hexOriginCommon[1]]
      : undefined
  };
}

function isBuiltInOperation(op: unknown): op is DeckAggregationOperation {
  return typeof op === 'string' && BUILT_IN_OPS.has(op);
}

/**
 * Deck.gl Aggregator that runs CPU grid/hex aggregation in a Web Worker for
 * large datasets, and delegates to deck.gl's CPUAggregator otherwise.
 *
 * While a job is in flight the last successful bins stay on screen, together
 * with the `binOptions` they were computed with. GridCellLayer places cells as
 * `origin + col * cellSize`; if those col/row ids are drawn at a new cell size
 * the layer looks like it is scaling around the origin. `displayedBinOptions`
 * lets renderLayers keep origin/size in lockstep with the visible bins until
 * the new result arrives.
 */
export default class WorkerBackedCPUAggregator {
  readonly binType: AggregationBinType;
  private readonly syncAggregator: SyncAggregator;
  private readonly requestRedraw?: () => void;

  private needsUpdateFlag: boolean | boolean[] = true;
  private jobId = 0;
  private inFlightKey: string | null = null;
  private result: AggregationWorkerResult | null = null;
  /** Bin options that match `result` / the currently drawn cells. */
  displayedBinOptions: DisplayedBinOptions | null = null;
  private useWorkerOutput = false;
  isPending = false;
  private startTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;

  constructor(options: WorkerBackedCPUAggregatorOptions) {
    this.syncAggregator = options.syncAggregator;
    this.binType = options.binType;
    this.requestRedraw = options.requestRedraw;
  }

  get binCount(): number {
    if (this.useWorkerOutput) {
      return this.result?.binCount ?? 0;
    }
    return this.syncAggregator.binCount;
  }

  setProps(props: Record<string, any>): void {
    // CPUAggregator.setProps Object.assign's into `this.props`, so snapshot
    // values we need to diff before forwarding.
    const oldProps = this.syncAggregator.props || {};
    const prevBinKey = binOptionsKey(oldProps.binOptions);
    const prevPointCount = oldProps.pointCount;
    const prevOps = oldProps.operations || [];
    const prevCustom = oldProps.customOperations;
    this.syncAggregator.setProps(props);
    if (props.binOptions && binOptionsKey(props.binOptions) !== prevBinKey) {
      this.setNeedsUpdate();
    }
    if (props.pointCount !== undefined && props.pointCount !== prevPointCount) {
      this.setNeedsUpdate();
    }
    if (props.operations) {
      if (props.operations[0] !== prevOps[0] || props.operations[1] !== prevOps[1]) {
        this.setNeedsUpdate();
      }
    }
    if (props.customOperations && props.customOperations !== prevCustom) {
      this.setNeedsUpdate();
    }
  }

  setNeedsUpdate(channel?: number): void {
    this.syncAggregator.setNeedsUpdate(channel);
    if (channel === undefined) {
      this.needsUpdateFlag = true;
    } else if (this.needsUpdateFlag !== true) {
      this.needsUpdateFlag = this.needsUpdateFlag || [];
      this.needsUpdateFlag[channel] = true;
    }
  }

  update(): void {
    const dirty =
      this.needsUpdateFlag === true ||
      (Array.isArray(this.needsUpdateFlag) && this.needsUpdateFlag.some(Boolean));

    if (this.shouldUseWorker()) {
      this.useWorkerOutput = true;
      if (dirty) this.updateAsync();
      return;
    }

    this.jobId++;
    this.inFlightKey = null;
    if (this.startTimer != null) {
      clearTimeout(this.startTimer);
      this.startTimer = null;
    }
    if (this.isPending) {
      endAggregation();
      this.isPending = false;
    }
    this.useWorkerOutput = false;
    this.result = null;
    this.displayedBinOptions = null;
    this.syncAggregator.update();
  }

  preDraw(): void {
    this.syncAggregator.preDraw();
  }

  destroy(): void {
    this.destroyed = true;
    if (this.startTimer != null) {
      clearTimeout(this.startTimer);
      this.startTimer = null;
    }
    if (this.isPending) {
      endAggregation();
      this.isPending = false;
    }
    this.syncAggregator.destroy();
  }

  getBins() {
    if (this.useWorkerOutput) {
      return {
        value: this.result?.binIds || new Float32Array(0),
        type: 'float32' as const,
        size: 2
      };
    }
    return this.syncAggregator.getBins();
  }

  getResult(channel: number) {
    if (this.useWorkerOutput) {
      const value = this.result
        ? channel === 0
          ? this.result.colorValues
          : this.result.elevationValues
        : new Float32Array(0);
      const domain = this.result
        ? channel === 0
          ? this.result.colorDomain
          : this.result.elevationDomain
        : ([Infinity, -Infinity] as [number, number]);
      return {value, type: 'float32' as const, size: 1, domain};
    }
    return this.syncAggregator.getResult(channel);
  }

  getResultDomain(channel: number): [number, number] {
    if (this.useWorkerOutput) {
      if (!this.result) return [Infinity, -Infinity];
      return channel === 0 ? this.result.colorDomain : this.result.elevationDomain;
    }
    return this.syncAggregator.getResultDomain(channel);
  }

  getBin(index: number) {
    if (this.useWorkerOutput) {
      const result = this.result;
      if (!result || index < 0 || index >= result.binCount) return null;
      return {
        id: [result.binIds[index * 2], result.binIds[index * 2 + 1]],
        value: [result.colorValues[index], result.elevationValues[index]],
        count: result.counts[index]
      };
    }
    return this.syncAggregator.getBin(index);
  }

  /** Typed counts for all bins; avoids getBin() when building the legend map. */
  getBinCounts(): ArrayLike<number> | null {
    if (this.useWorkerOutput) {
      return this.result?.counts ?? null;
    }
    return null;
  }

  private getProps(): Record<string, any> {
    return this.syncAggregator.props || {};
  }

  private shouldUseWorker(): boolean {
    const props = this.getProps();
    const pointCount = props.pointCount || 0;
    if (pointCount < ASYNC_CPU_AGGREGATION_THRESHOLD) return false;
    if (!isAggregationWorkerAvailable()) return false;
    const custom = props.customOperations || [];
    if (custom[0] || custom[1]) return false;
    const ops = props.operations || [];
    if (!isBuiltInOperation(ops[0]) || !isBuiltInOperation(ops[1])) return false;
    if (!getAttributeValue(props.attributes?.positions)) return false;
    return true;
  }

  private fallbackToSync(): void {
    this.jobId++;
    this.inFlightKey = null;
    if (this.startTimer != null) {
      clearTimeout(this.startTimer);
      this.startTimer = null;
    }
    if (this.isPending) {
      endAggregation();
      this.isPending = false;
    }
    this.useWorkerOutput = false;
    this.result = null;
    this.displayedBinOptions = null;
    try {
      this.syncAggregator.update();
    } catch {
      // Keep the layer drawable; a throw here used to leave colors unset.
    }
    this.requestRedraw?.();
  }

  private makeJobKey(props: Record<string, any>): string | null {
    const binOptions = props.binOptions || {};
    const origin =
      this.binType === 'hexagon' ? binOptions.hexOriginCommon : binOptions.cellOriginCommon;
    if (!origin) return null;
    const cellSize = binOptions.cellSizeCommon || [1, 1];
    const ops = props.operations || [];
    return [
      this.binType,
      props.pointCount,
      ops[0],
      ops[1],
      origin[0],
      origin[1],
      cellSize[0] || 1,
      cellSize[1] || 1,
      binOptions.radiusCommon || 1
    ].join(',');
  }

  /**
   * Schedule copy + worker post on a later turn so Deck can finish the current
   * pointer/draw cycle. Copying 2M points inside update() is what freezes the map.
   */
  private updateAsync(): void {
    const props = this.getProps();
    const jobKey = this.makeJobKey(props);
    if (!jobKey) {
      this.fallbackToSync();
      return;
    }

    this.needsUpdateFlag = false;
    if (this.isPending && this.inFlightKey === jobKey) {
      return;
    }

    this.inFlightKey = jobKey;
    const jobId = ++this.jobId;
    if (!this.isPending) {
      beginAggregation();
      this.isPending = true;
    }
    if (this.startTimer != null) {
      clearTimeout(this.startTimer);
    }
    this.startTimer = setTimeout(() => {
      this.startTimer = null;
      this.postWorkerJob(jobId);
    }, 0);
  }

  private postWorkerJob(jobId: number): void {
    if (this.destroyed || jobId !== this.jobId) return;
    const props = this.getProps();
    const pointCount = props.pointCount as number;

    const copied = copyPositions(props.attributes?.positions, pointCount);
    if (!copied) {
      this.fallbackToSync();
      return;
    }
    const binOptions = props.binOptions || {};
    const origin =
      this.binType === 'hexagon' ? binOptions.hexOriginCommon : binOptions.cellOriginCommon;
    const cellSize = binOptions.cellSizeCommon || [1, 1];
    if (!origin) {
      this.fallbackToSync();
      return;
    }

    const colorWeights = copyToFloat32(
      getAttributeValue(props.attributes?.colorWeights),
      pointCount,
      1
    );
    const elevationWeights = copyToFloat32(
      getAttributeValue(props.attributes?.elevationWeights),
      pointCount,
      1
    );

    const request = {
      binType: this.binType,
      pointCount,
      positions: copied.positions,
      positionSize: copied.positionSize,
      preprojected: false,
      colorWeights,
      elevationWeights,
      colorOperation: props.operations[0] as DeckAggregationOperation,
      elevationOperation: props.operations[1] as DeckAggregationOperation,
      scale: DECK_COMMON_SPACE_SCALE,
      originX: origin[0],
      originY: origin[1],
      cellSizeX: cellSize[0] || 1,
      cellSizeY: cellSize[1] || 1,
      radiusCommon: binOptions.radiusCommon || 1
    };

    const jobBinOptions = cloneBinOptions(binOptions);
    runAggregationInWorker(request)
      .then(result => {
        if (this.destroyed || jobId !== this.jobId) return;
        this.result = result;
        this.displayedBinOptions = jobBinOptions;
        this.inFlightKey = null;
        this.needsUpdateFlag = false;
        this.isPending = false;
        endAggregation();
        const onUpdate = this.getProps().onUpdate;
        onUpdate?.({channel: 0});
        onUpdate?.({channel: 1});
        this.requestRedraw?.();
      })
      .catch(() => {
        if (this.destroyed || jobId !== this.jobId) return;
        this.fallbackToSync();
      });
  }
}
