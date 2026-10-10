// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ZarrLayer as DeckZarrLayer} from '@developmentseed/deck.gl-zarr';
import * as zarr from 'zarrita';

import {
  DatasetType,
  LAYER_TYPES,
  LAYER_VIS_CONFIGS,
  ZarrDatasetMetadata,
  ZarrDimensionInfo,
  ZarrVariableInfo
} from '@kepler.gl/constants';
import {
  KeplerTable as KeplerDataset,
  Datasets as KeplerDatasets,
  getZarrTimeDomain,
  getZarrVariable,
  openZarrNode
} from '@kepler.gl/table';
import {
  ColorRange,
  LayerBaseConfig,
  VisConfigColorRange,
  VisConfigInput,
  VisConfigNumber,
  VisConfigObject,
  VisConfigRange
} from '@kepler.gl/types';

import Layer from '../base-layer';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import ZarrLayerIcon from './zarr-layer-icon';
import {applyZarrColormap, estimateZarrDataRange} from './zarr-colormap';

export type ZarrLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  rescale: VisConfigRange;
  zarrVariable: VisConfigInput;
  dimensionIndexes: VisConfigObject;
};

export type ZarrLayerVisConfig = {
  opacity: number;
  colorRange: ColorRange;
  rescale: [number, number];
  /** Path of the rendered variable. Null falls back to the dataset's default. */
  zarrVariable: string | null;
  /** Index pinned on each non-spatial, non-time dimension, keyed by name. */
  dimensionIndexes: Record<string, number>;
};

export type ZarrLayerConfig = LayerBaseConfig & {
  visConfig: ZarrLayerVisConfig;
};

export type ZarrLayerData = {
  metadata: ZarrDatasetMetadata | null;
  variable: ZarrVariableInfo | null;
};

/** What `getTileData` hands to `renderTile`. */
type ZarrTileData = {
  width: number;
  height: number;
  values: ArrayLike<number | bigint>;
  byteLength?: number;
};

/**
 * Bytes a decoded tile occupies, which is what deck's tile cache holds its
 * memory budget against. Zarr dtypes run from one byte per sample to eight, so
 * only the typed array's own size is accurate.
 */
export function getZarrTileByteLength(
  values: ArrayLike<number | bigint>,
  width: number,
  height: number
): number {
  const {byteLength} = values as {byteLength?: number};
  return typeof byteLength === 'number' ? byteLength : width * height * 4;
}

/**
 * Registered default for `rescale`, which stands for "no range chosen yet"
 * rather than a deliberate 0-1 ramp. Almost no store holds 0-1 values, so a
 * range read off the data is allowed to replace it.
 */
export const DEFAULT_RESCALE: [number, number] = [0, 1];

function isSameRange(a?: [number, number] | null, b?: [number, number] | null): boolean {
  return Boolean(a && b && a[0] === b[0] && a[1] === b[1]);
}

function isUsableRange(range?: [number, number] | null): range is [number, number] {
  return Boolean(
    range && Number.isFinite(range[0]) && Number.isFinite(range[1]) && range[0] < range[1]
  );
}

export const zarrVisConfigs = {
  opacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    defaultValue: 1,
    property: 'opacity'
  } as VisConfigNumber,
  colorRange: 'colorRange' as const,
  rescale: {
    type: 'number',
    defaultValue: DEFAULT_RESCALE,
    isRanged: true,
    range: DEFAULT_RESCALE,
    step: 0.01,
    label: 'layerVisConfigs.zarrRescale',
    group: 'color',
    property: 'rescale'
  } as VisConfigRange,
  zarrVariable: {
    type: 'input',
    defaultValue: null,
    label: 'layerVisConfigs.zarrVariable',
    group: '',
    property: 'zarrVariable'
  } as VisConfigInput,
  dimensionIndexes: {
    type: 'object',
    defaultValue: {},
    label: 'layerVisConfigs.zarrDimensionIndexes',
    group: '',
    property: 'dimensionIndexes'
  } as VisConfigObject
};

/** Width in CSS pixels of deck.gl's world at zoom 0. */
const DECK_WORLD_SIZE = 512;

/**
 * Deepest pyramid level worth drawing at this map zoom, or `undefined` to leave
 * the choice to the renderer.
 *
 * The renderer picks a level per tile by comparing the level's resolution in
 * projected metres against the viewport's in ground metres. Under Mercator the
 * two differ by a factor of 1/cos(latitude), so away from the equator it keeps
 * subdividing past anything the screen can resolve — at low zoom that reaches
 * the finest level across most of the map and asks for thousands of chunks.
 *
 * A web-mercator pyramid covers the whole world at every level, so the level
 * that matches the screen follows from the map zoom alone.
 */
export function getZarrMaxZoom(
  levels: {shape: number[]}[],
  mapZoom?: number | null
): number | undefined {
  if (levels.length < 2 || !Number.isFinite(mapZoom)) {
    return undefined;
  }
  // `levels` is finest first; the renderer indexes them coarsest first.
  const worldPixels = levels[levels.length - 1].shape[1];
  if (!worldPixels) {
    return undefined;
  }
  const coarsestZoom = Math.log2(worldPixels / DECK_WORLD_SIZE);
  const level = Math.round((mapZoom as number) - coarsestZoom);
  return Math.min(levels.length - 1, Math.max(0, level));
}

/** Nearest index in a sorted list of timestamps. */
export function findNearestTimeIndex(timeSteps: number[], currentTime: number): number {
  if (timeSteps.length === 0) {
    return 0;
  }
  let nearest = 0;
  let smallestDelta = Number.POSITIVE_INFINITY;
  for (let i = 0; i < timeSteps.length; i++) {
    const delta = Math.abs(timeSteps[i] - currentTime);
    if (delta < smallestDelta) {
      smallestDelta = delta;
      nearest = i;
    }
  }
  return nearest;
}

/**
 * Build the `selection` prop for `ZarrLayer`, which requires exactly one entry
 * per non-spatial dimension. Time is driven by the animation timeline; every
 * other dimension is pinned by the layer config, defaulting to index 0.
 */
export function getZarrSelection({
  variable,
  dimensionIndexes,
  currentTime
}: {
  variable: ZarrVariableInfo | null;
  dimensionIndexes?: Record<string, number>;
  currentTime?: number | null;
}): Record<string, number> {
  const selection: Record<string, number> = {};
  if (!variable) {
    return selection;
  }
  for (const dimension of variable.nonSpatialDims) {
    const isTime = variable.timeDimension?.name === dimension.name;
    if (isTime && Number.isFinite(currentTime)) {
      const timeSteps = dimension.values ?? [];
      selection[dimension.name] = clampIndex(
        findNearestTimeIndex(timeSteps, currentTime as number),
        dimension
      );
      continue;
    }
    selection[dimension.name] = clampIndex(dimensionIndexes?.[dimension.name] ?? 0, dimension);
  }
  return selection;
}

/**
 * Id for the deck sublayer, keyed on the selection.
 *
 * deck.gl's `TileLayer` caches tile data by tile index and only refetches when
 * its own `getTileData` update trigger changes, which `RasterTileLayer` does not
 * forward — it forwards `renderTile`, and that only recolors data already in the
 * cache. So there is no way to invalidate fetched chunks in place. Changing the
 * id makes deck replace the layer instead, which is what lets a dimension or
 * time change actually load the new slice.
 */
export function getZarrSublayerId(layerId: string, selection: Record<string, number>): string {
  const key = getZarrSelectionKey(selection);
  return key ? `${layerId}-ZarrLayer-${key}` : `${layerId}-ZarrLayer`;
}

/** Order-independent key for a selection. */
function getZarrSelectionKey(selection: Record<string, number>): string {
  return Object.keys(selection)
    .sort()
    .map(name => `${name}=${selection[name]}`)
    .join(',');
}

function clampIndex(index: number, dimension: ZarrDimensionInfo): number {
  if (!Number.isFinite(index)) {
    return 0;
  }
  return Math.min(Math.max(0, Math.round(index)), Math.max(0, dimension.size - 1));
}

export default class ZarrLayer extends Layer {
  declare config: ZarrLayerConfig;
  declare visConfigSettings: ZarrLayerVisConfigSettings;

  /** Key of the currently opened store node, so it is opened once per source. */
  private _nodeKey: string | null = null;
  private _node: zarr.Array<zarr.DataType> | zarr.Group<zarr.Readable> | null = null;
  private _nodeError: Error | null = null;
  /**
   * Rescale fallback derived from the first tile, used when the store does not
   * advertise a value range. Without it the first tiles render as flat color.
   */
  private _sampledRange: [number, number] | null = null;

  /**
   * Inputs the tile callbacks need, held on the instance instead of captured in
   * closures. See `_tileCallbackContext` for why the callbacks have to keep a
   * stable identity.
   */
  private _tileContext: {
    colors: string[];
    rescale?: [number, number];
    nodataValue?: number;
    needsSampling: boolean;
  } = {colors: [], needsSampling: false};

  /** Last selection object handed to deck, reused while the contents match. */
  private _selection: Record<string, number> = {};
  private _selectionKey = '';

  /**
   * Last selection whose tiles finished loading, and the selection currently on
   * screen. While they differ, both are drawn: see `_renderDeckLayer`.
   */
  private _loadedSelection: Record<string, number> | null = null;
  private _loadedKey: string | null = null;
  private _onRedrawNeeded: (() => void) | undefined;

  constructor(props: {dataId: string; visConfig?: Record<string, any>} & Record<string, any>) {
    super(props);
    this.registerVisConfig(zarrVisConfigs);
    // `registerVisConfig` resets every entry to its default, so anything the
    // layer was constructed with — the range from `findDefaultLayerProps`, or a
    // saved map's config — has to be put back afterwards.
    if (props.visConfig) {
      this.updateLayerVisConfig(props.visConfig);
    }
    this.meta = {};
  }

  get type(): string {
    return LAYER_TYPES.zarr;
  }

  get name(): string {
    return 'Zarr';
  }

  get requireData(): boolean {
    return false;
  }

  get requiredLayerColumns(): string[] {
    return [];
  }

  get layerIcon(): typeof ZarrLayerIcon {
    return ZarrLayerIcon;
  }

  get supportedDatasetTypes(): DatasetType[] {
    return [DatasetType.ZARR];
  }

  get visualChannels() {
    return {};
  }

  static findDefaultLayerProps(dataset: KeplerDataset): FindDefaultLayerPropsReturnValue {
    if (dataset.type !== DatasetType.ZARR) {
      return {props: []};
    }
    const metadata = (dataset.metadata || {}) as ZarrDatasetMetadata;
    const variable = getZarrVariable(metadata);
    const visConfig: Record<string, any> = {};
    const dataRange = variable?.dataRange ?? metadata.dataRange;
    if (dataRange) {
      visConfig.rescale = dataRange;
    }

    return {
      props: [
        {
          label: metadata.label || dataset.label || variable?.name || 'Zarr',
          isVisible: true,
          visConfig
        }
      ]
    };
  }

  shouldRenderLayer(): boolean {
    return Boolean(this.type && this.config.isVisible);
  }

  getHoverData(): null {
    return null;
  }

  /**
   * The variable is a layer choice rather than a dataset property, so two
   * layers can render two variables from the same store.
   */
  private _resolveVariable(metadata?: ZarrDatasetMetadata | null): ZarrVariableInfo | null {
    if (!metadata) {
      return null;
    }
    return getZarrVariable(metadata, this.config.visConfig?.zarrVariable ?? undefined) ?? null;
  }

  getDataUpdateTriggers(dataset: KeplerDataset): any {
    return {
      ...super.getDataUpdateTriggers(dataset),
      // Switching the variable changes the time coordinate, so the meta has to
      // be recomputed even though the dataset itself did not change.
      getMeta: {
        datasetId: dataset.id,
        metadata: dataset.metadata,
        zarrVariable: this.config.visConfig?.zarrVariable ?? null
      }
    };
  }

  formatLayerData(datasets: KeplerDatasets): ZarrLayerData {
    const {dataId} = this.config;
    if (!dataId || !datasets[dataId]) {
      return {metadata: null, variable: null};
    }
    const dataset = datasets[dataId];

    // Tileset layers have no rows, so `updateData` never runs. Drive
    // `updateLayerMeta` off the meta trigger directly.
    const triggerChanged = this.getChangedTriggers(this.getDataUpdateTriggers(dataset));
    if (triggerChanged && triggerChanged.getMeta) {
      this.updateLayerMeta(dataset);
    }

    const metadata = (dataset.metadata || null) as ZarrDatasetMetadata | null;
    return {
      metadata,
      variable: this._resolveVariable(metadata)
    };
  }

  updateLayerMeta(dataset: KeplerDataset): void {
    if (dataset.type !== DatasetType.ZARR) {
      return;
    }
    const metadata = (dataset.metadata || {}) as ZarrDatasetMetadata;
    const variable = this._resolveVariable(metadata);
    const timeDomain = getZarrTimeDomain(variable?.timeDimension);

    this._syncRescaleToVariable(variable, metadata);

    // A Zarr time coordinate is a discrete list of instants, so publishing both
    // `domain` and `timeSteps` lets the shared playback bar step through slices
    // instead of scrubbing continuously.
    if (timeDomain) {
      this.updateLayerConfig({
        animation: {
          ...this.config.animation,
          enabled: true,
          domain: timeDomain.domain,
          timeSteps: timeDomain.timeSteps,
          startTime: timeDomain.domain[0]
        }
      });
    } else {
      this.updateLayerConfig({
        animation: {...this.config.animation, enabled: false, domain: null, timeSteps: null}
      });
    }

    this.updateMeta({
      zarrUrl: metadata.url,
      variable: variable?.path,
      crs: metadata.crs?.code
    });
  }

  /**
   * Point the rescale control at the variable being rendered.
   *
   * Values are in whatever unit the store uses — Kelvin, millimetres, a count —
   * so a control fixed to 0-1 can neither show the data nor be dragged onto it.
   * Both the slider bounds and the value follow the variable, except for a
   * range the user chose for this same variable.
   */
  private _syncRescaleToVariable(
    variable: ZarrVariableInfo | null,
    metadata: ZarrDatasetMetadata
  ): void {
    const dataRange = variable?.dataRange ?? metadata.dataRange ?? null;
    this.visConfigSettings.rescale = {
      ...this.visConfigSettings.rescale,
      range: dataRange ?? DEFAULT_RESCALE,
      step: dataRange ? (dataRange[1] - dataRange[0]) / 100 : 0.01
    };

    // `meta.variable` still holds the previous render's variable here.
    const variableChanged = Boolean(this.meta?.variable) && this.meta.variable !== variable?.path;
    if (variableChanged) {
      this._sampledRange = null;
    }

    const current = this.config.visConfig?.rescale;
    const unset = !isUsableRange(current) || isSameRange(current, DEFAULT_RESCALE);
    if (variableChanged || unset) {
      // A variable that declares no range falls back to the placeholder, which
      // is what asks the first tile to supply one.
      this.updateLayerVisConfig({rescale: dataRange ?? DEFAULT_RESCALE});
    }
  }

  /**
   * Opening a Zarr store is async but `renderLayer` is not, so the node is
   * opened once per source and the map is asked to redraw when it lands.
   */
  private _getNode(
    metadata: ZarrDatasetMetadata,
    variable: ZarrVariableInfo | null,
    onReady?: () => void
  ): zarr.Array<zarr.DataType> | zarr.Group<zarr.Readable> | null {
    // Keyed on the variable rather than the node, because a pyramid's variables
    // share one node and each still needs its own sampled range.
    const key = `${metadata.url}#${variable?.path ?? ''}`;
    if (this._nodeKey === key) {
      return this._node;
    }
    this._nodeKey = key;
    this._node = null;
    this._nodeError = null;
    this._sampledRange = null;
    // Another variable's tiles are not a usable backdrop for this one.
    this._loadedKey = null;
    this._loadedSelection = null;

    openZarrNode(metadata.url, variable?.nodePath ?? variable?.path)
      .then(node => {
        if (this._nodeKey !== key) {
          return;
        }
        this._node = node;
        onReady?.();
      })
      .catch((error: unknown) => {
        if (this._nodeKey !== key) {
          return;
        }
        this._nodeError = error instanceof Error ? error : new Error(String(error));
        // eslint-disable-next-line no-console
        console.warn(`Failed to open Zarr store ${metadata.url}:`, this._nodeError);
        onReady?.();
      });

    return null;
  }

  renderLayer(opts: any) {
    const {data, mapState, layerCallbacks, animationConfig} = opts;
    const metadata = data?.metadata as ZarrDatasetMetadata | null;
    const variable = (data?.variable as ZarrVariableInfo | null) ?? null;
    if (!metadata?.url) {
      return [];
    }

    // ZarrLayer reprojects each chunk into Web Mercator on the CPU, which the
    // globe view's draping pipeline does not support.
    if (mapState?.globe?.enabled) {
      return [];
    }

    const node = this._getNode(metadata, variable, layerCallbacks?.onRedrawNeeded);
    if (!node) {
      return [];
    }

    const {visConfig} = this.config;
    const selection = getZarrSelection({
      variable,
      dimensionIndexes: visConfig.dimensionIndexes,
      currentTime: this.config.animation?.enabled ? animationConfig?.currentTime : null
    });

    const nodataValue = variable?.nodataValue ?? metadata.nodataValue;
    const colors = visConfig.colorRange?.colors ?? [];
    const rescale = visConfig.rescale;
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    this._tileContext = {
      colors,
      rescale,
      nodataValue,
      // Nothing has picked a range, so the first tile has to supply one.
      needsSampling: !isUsableRange(rescale) || isSameRange(rescale, DEFAULT_RESCALE)
    };

    this._onRedrawNeeded = layerCallbacks?.onRedrawNeeded;
    const common = {
      node,
      // Stores that do not declare the GeoZarr conventions get attributes
      // derived at metadata time; passing them keeps the renderer agnostic.
      metadata: variable?.geoAttrs,
      opacity: visConfig.opacity,
      visible: defaultLayerProps.visible,
      ...(metadata.webMercatorPyramid && {
        maxZoom: getZarrMaxZoom(metadata.levels, mapState?.zoom)
      }),
      // Colormap changes only need the cached tiles recolored. The selection
      // is not listed here because it is handled by the id instead.
      updateTriggers: {
        renderTile: [colors.join(','), rescale?.[0], rescale?.[1], nodataValue]
      }
    };

    const selectionKey = getZarrSelectionKey(selection);
    // A new slice means a new deck layer with an empty tile cache, so the map
    // would blink to nothing until the first tiles arrive. Keep the last loaded
    // slice underneath until the new one has something to show.
    const backdrop =
      this._loadedSelection && this._loadedKey !== selectionKey
        ? this._renderDeckLayer(common, this._loadedSelection)
        : null;

    const current = this._stableSelection(selection);
    const top = this._renderDeckLayer(common, current, () => {
      // Only the top layer retires the backdrop, and only once it is the one
      // holding tiles. `onViewportLoad` is ignored by deck's prop comparison,
      // so a fresh closure per render costs nothing.
      if (this._loadedKey === selectionKey) {
        return;
      }
      this._loadedKey = selectionKey;
      this._loadedSelection = current;
      this._onRedrawNeeded?.();
    });

    return backdrop ? [backdrop, top] : [top];
  }

  private _renderDeckLayer(
    common: Record<string, any>,
    selection: Record<string, number>,
    onViewportLoad?: () => void
  ) {
    return new DeckZarrLayer({
      ...common,
      id: getZarrSublayerId(this.id, selection),
      selection,
      pickable: false,
      getTileData: this._getTileData,
      renderTile: this._renderTile,
      ...(onViewportLoad && {onViewportLoad})
    });
  }

  /**
   * deck.gl compares undeclared props by reference, and `RasterTileLayer` builds
   * its inner `TileLayer` from scratch whenever the props change, which drops
   * every tile's rendered sublayer and re-runs the CPU colormap. kepler rebuilds
   * its deck layers on every pan frame, so a fresh `selection` object or tile
   * callback would recolor every visible tile each frame.
   */
  private _stableSelection(selection: Record<string, number>): Record<string, number> {
    const key = getZarrSelectionKey(selection);
    if (key !== this._selectionKey) {
      this._selectionKey = key;
      this._selection = selection;
    }
    return this._selection;
  }

  private _getTileData = async (
    arr: zarr.Array<zarr.DataType, zarr.Readable>,
    {sliceSpec, width, height}: {sliceSpec: unknown; width: number; height: number}
  ): Promise<ZarrTileData> => {
    const {nodataValue, needsSampling} = this._tileContext;
    const chunk = await zarr.get(arr, sliceSpec as any);
    const values = (chunk as {data: ArrayLike<number | bigint>}).data;
    if (!this._sampledRange && needsSampling) {
      this._sampledRange = estimateZarrDataRange(values, nodataValue);
    }
    return {width, height, values, byteLength: getZarrTileByteLength(values, width, height)};
  };

  private _renderTile = (tile: ZarrTileData) => {
    if (!tile) {
      // A failed tile load still has to produce a texture source.
      return {image: new ImageData(1, 1)};
    }
    const {colors, rescale, nodataValue} = this._tileContext;
    const image = applyZarrColormap(tile.values, tile.width, tile.height, {
      rescale: this._effectiveRescale(rescale),
      colors,
      nodataValue
    });
    return {image: new ImageData(image.data, image.width, image.height)};
  };

  /** Prefer the chosen rescale, falling back to what the first tile showed. */
  private _effectiveRescale(rescale?: [number, number]): [number, number] {
    if (this._tileContext.needsSampling && this._sampledRange) {
      return this._sampledRange;
    }
    if (isUsableRange(rescale)) {
      return rescale;
    }
    return this._sampledRange ?? DEFAULT_RESCALE;
  }
}
