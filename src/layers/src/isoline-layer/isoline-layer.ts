// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PathLayer, TextLayer} from '@deck.gl/layers';
import {CHANNEL_SCALES, ALL_FIELD_TYPES, LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import Layer, {LayerBaseConfigPartial, LayerWeightConfig, VisualChannels} from '../base-layer';
import {
  ColorRange,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigSelection,
  HexColor,
  Merge,
  LayerColumn,
  LayerBaseConfig,
  MapState
} from '@kepler.gl/types';
import {hexToRgb as _hexToRgb, DataContainerInterface} from '@kepler.gl/utils';
import {notNullorUndefined} from '@kepler.gl/common-utils';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import DeckIsolineLayer from './deck-isoline-layer';
import IsolineLayerIcon from './isoline-layer-icon';
import {
  buildIsolineColors,
  buildLabelAnchors,
  buildPathLayerData,
  buildPickingLines,
  computeLevelThresholds,
  IsoLineFeature,
  readKDETexture
} from './isoline-utils';
import {
  pointPosAccessor,
  geoarrowPosAccessor,
  geojsonAccessor,
  pointRequiredColumns,
  geoarrowRequiredColumns,
  geojsonRequiredColumns,
  COLUMN_MODE_POINTS,
  COLUMN_MODE_GEOARROW,
  COLUMN_MODE_GEOJSON
} from '../heatmap-layer/heatmap-layer';
import {getFilterDataFunc} from '../aggregation-layer';
import {getGeoArrowPointLayerProps, FindDefaultLayerPropsReturnValue} from '../layer-utils';
import {DATA_TYPES} from 'type-analyzer';
import {GEOJSON_FIELDS} from '@kepler.gl/constants';
import {parseGeoJsonRawFeature} from '../geojson-layer/geojson-utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IsolineLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  radius: VisConfigNumber;
  levels: VisConfigNumber;
  showFill: VisConfigBoolean;
  showLines: VisConfigBoolean;
  lineWidth: VisConfigNumber;
  showLabels: VisConfigBoolean;
  labelSize: VisConfigNumber;
  aggregation: VisConfigSelection;
  intensity: VisConfigNumber;
};

export type IsolineLayerColumnsConfig = {
  lat: LayerColumn;
  lng: LayerColumn;
  geoarrow: LayerColumn;
  geojson: LayerColumn;
};

export type IsolineLayerVisConfig = {
  opacity: number;
  colorRange: ColorRange;
  radius: number;
  levels: number;
  showFill: boolean;
  showLines: boolean;
  lineWidth: number;
  showLabels: boolean;
  labelSize: number;
  aggregation: string;
  intensity: number;
};

export type IsolineLayerVisualChannelConfig = LayerWeightConfig;
export type IsolineLayerConfig = Merge<
  LayerBaseConfig,
  {columns: IsolineLayerColumnsConfig; visConfig: IsolineLayerVisConfig}
> &
  IsolineLayerVisualChannelConfig;

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const SUPPORTED_ANALYZER_TYPES: Record<string, boolean> = {
  [DATA_TYPES.GEOMETRY]: true,
  [DATA_TYPES.GEOMETRY_FROM_STRING]: true,
  [DATA_TYPES.PAIR_GEOMETRY_FROM_STRING]: true
};

const DEFAULT_COLUMN_MODE = COLUMN_MODE_POINTS;
const SUPPORTED_COLUMN_MODES = [
  {key: COLUMN_MODE_POINTS, label: 'Points', requiredColumns: pointRequiredColumns},
  {key: COLUMN_MODE_GEOJSON, label: 'GeoJSON', requiredColumns: geojsonRequiredColumns},
  {key: COLUMN_MODE_GEOARROW, label: 'Geoarrow Points', requiredColumns: geoarrowRequiredColumns}
];

export const isolineVisConfigs: {
  opacity: VisConfigNumber;
  colorRange: 'colorRange';
  radius: 'heatmapRadius';
  levels: VisConfigNumber;
  showFill: VisConfigBoolean;
  showLines: VisConfigBoolean;
  lineWidth: VisConfigNumber;
  showLabels: VisConfigBoolean;
  labelSize: VisConfigNumber;
  aggregation: VisConfigSelection;
  intensity: VisConfigNumber;
} = {
  opacity: {...LAYER_VIS_CONFIGS.opacity, defaultValue: 1} as VisConfigNumber,
  colorRange: 'colorRange',
  radius: 'heatmapRadius',
  levels: {
    type: 'number',
    defaultValue: 6,
    label: 'layerVisConfigs.isolineLevels',
    isRanged: false,
    range: [2, 16],
    step: 1,
    property: 'levels'
  } as VisConfigNumber,
  showFill: {
    type: 'boolean',
    defaultValue: true,
    label: 'layerVisConfigs.showFill',
    property: 'showFill'
  } as VisConfigBoolean,
  showLines: {
    type: 'boolean',
    defaultValue: true,
    label: 'layerVisConfigs.showLines',
    property: 'showLines'
  } as VisConfigBoolean,
  lineWidth: {
    type: 'number',
    defaultValue: 2,
    label: 'layerVisConfigs.isolineWidth',
    isRanged: false,
    range: [1, 10],
    step: 0.5,
    property: 'lineWidth'
  } as VisConfigNumber,
  showLabels: {
    type: 'boolean',
    defaultValue: false,
    label: 'layerVisConfigs.showLabels',
    property: 'showLabels'
  } as VisConfigBoolean,
  labelSize: {
    type: 'number',
    defaultValue: 12,
    label: 'layerVisConfigs.labelSize',
    isRanged: false,
    range: [8, 32],
    step: 1,
    property: 'labelSize'
  } as VisConfigNumber,
  aggregation: {
    type: 'select',
    defaultValue: 'SUM',
    label: 'layerVisConfigs.weightAggregation',
    options: ['SUM', 'MEAN', 'MAX'],
    property: 'aggregation'
  } as VisConfigSelection,
  intensity: {
    type: 'number',
    defaultValue: 1,
    label: 'layerVisConfigs.isolineIntensity',
    isRanged: false,
    range: [0.1, 5],
    step: 0.1,
    property: 'intensity'
  } as VisConfigNumber
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function interpolateByZoom(
  zoom: number,
  minZoom: number,
  valAtMin: number,
  maxZoom: number,
  valAtMax: number
): number {
  const v = valAtMin + ((zoom - minZoom) / (maxZoom - minZoom)) * (valAtMax - valAtMin);
  return Math.min(Math.max(v, valAtMin), valAtMax);
}

const MAX_ZOOM_LEVEL = 18;

// ---------------------------------------------------------------------------
// IsolineLayer
// ---------------------------------------------------------------------------

class IsolineLayer extends Layer {
  declare visConfigSettings: IsolineLayerVisConfigSettings;
  declare config: IsolineLayerConfig;

  // CPU marching-squares output (rebuilt whenever the KDE texture changes)
  private _isoLines: IsoLineFeature[] = [];
  private _pickingData: {path: [number, number][]; levelIndex: number; level: number}[] = [];
  private _labelAnchors: ([number, number] | null)[] = [];
  private _linesVersion = 0;

  // GeoJSON helpers (for GeoJSON column mode — mirrors heatmap layer)
  dataToFeature: any[] = [];
  centroids: Array<number[] | null> = [];
  private _geojsonFieldIdx = -1;
  private _geojsonBounds: [number, number, number, number] | null = null;

  constructor(props: any) {
    super(props);
    this.registerVisConfig(isolineVisConfigs);

    this.getPositionAccessor = (dataContainer: DataContainerInterface) => {
      switch (this.config.columnMode) {
        case COLUMN_MODE_GEOARROW:
          return geoarrowPosAccessor(this.config.columns)(dataContainer);
        case COLUMN_MODE_GEOJSON:
          return geojsonAccessor(this.config.columns)(dataContainer);
        default:
          return pointPosAccessor(this.config.columns)(dataContainer);
      }
    };
  }

  get type(): 'isoline' {
    return 'isoline';
  }

  get name(): string {
    return 'Isoline';
  }

  get isAggregated(): true {
    return true;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get noneLayerDataAffectingProps() {
    return [
      ...super.noneLayerDataAffectingProps,
      'colorRange',
      'radius',
      'levels',
      'showFill',
      'showLines',
      'lineWidth',
      'showLabels',
      'labelSize',
      'aggregation'
    ];
  }

  get layerIcon() {
    return IsolineLayerIcon;
  }

  get visualChannels(): VisualChannels {
    return {
      // @ts-expect-error weight channel mirrors heatmap
      weight: {
        property: 'weight',
        field: 'weightField',
        scale: 'weightScale',
        domain: 'weightDomain',
        key: 'weight',
        defaultMeasure: 'property.density',
        supportedFieldTypes: [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer],
        channelScaleType: CHANNEL_SCALES.size
      }
    };
  }

  hasAllColumns() {
    const {columns, columnMode} = this.config;
    if (columnMode === COLUMN_MODE_GEOARROW) return this.hasColumnValue(columns.geoarrow);
    if (columnMode === COLUMN_MODE_GEOJSON) return this.hasColumnValue(columns.geojson);
    return super.hasAllColumns();
  }

  static findDefaultLayerProps(dataset: KeplerTable): FindDefaultLayerPropsReturnValue {
    const altProps = getGeoArrowPointLayerProps(dataset);

    const geojsonColumns = dataset.fields
      .filter(
        f =>
          (f.type === 'geojson' || f.type === 'geoarrow') &&
          f.analyzerType &&
          SUPPORTED_ANALYZER_TYPES[f.analyzerType]
      )
      .map(f => f.name);

    const defaultColumns = {
      geojson: [...(GEOJSON_FIELDS.geojson || []), ...geojsonColumns]
    };
    const foundColumns = IsolineLayer.findDefaultColumnField(defaultColumns, dataset.fields);

    if (foundColumns?.length) {
      altProps.push(
        ...foundColumns.map(columns => ({
          label: (typeof dataset.label === 'string' && dataset.label.replace(/\.[^/.]+$/, '')) || 'isoline',
          columns,
          columnMode: COLUMN_MODE_GEOJSON
        }))
      );
    }

    return {props: [], altProps};
  }

  getVisualChannelDescription(channel: string) {
    return channel === 'color'
      ? {label: 'property.color', measure: 'property.density'}
      : {
          label: 'property.weight',
          measure: this.config.weightField ? this.config.weightField.name : 'property.density'
        };
  }

  getDefaultLayerConfig(props: LayerBaseConfigPartial): IsolineLayerConfig {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {colorField, colorDomain, colorScale, ...layerConfig} = {
      ...super.getDefaultLayerConfig(props),
      columnMode: (props as any)?.columnMode ?? DEFAULT_COLUMN_MODE,
      weightField: null,
      weightDomain: [0, 1],
      weightScale: 'linear'
    };
    // @ts-expect-error
    return layerConfig;
  }

  getDataUpdateTriggers(dataset: KeplerTable): any {
    const triggers = super.getDataUpdateTriggers(dataset);
    const {columnMode} = this.config;
    return {
      ...triggers,
      getData: {...triggers.getData, columnMode},
      getMeta: {...triggers.getMeta, columnMode}
    };
  }

  updateLayerMeta(dataset: KeplerTable) {
    const {dataContainer} = dataset;
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      const getFeature = this.getPositionAccessor(dataContainer);
      this._buildGeojsonDataToFeature(dataContainer, getFeature);
      this.updateMeta({bounds: this._geojsonBounds});
    } else {
      this.dataToFeature = [];
      this.centroids = [];
      const getPosition = this.getPositionAccessor(dataContainer);
      const bounds = this.getPointsBounds(dataContainer, getPosition);
      this.updateMeta({bounds});
    }
  }

  private _buildGeojsonDataToFeature(dataContainer: DataContainerInterface, getFeature: any) {
    const fieldIdx = this.config.columns.geojson.fieldIdx;
    if (
      this.dataToFeature.length === dataContainer.numRows() &&
      this._geojsonFieldIdx === fieldIdx
    ) {
      return;
    }
    this._geojsonFieldIdx = fieldIdx;
    this.dataToFeature = [];
    this.centroids = [];

    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    let hasValid = false;

    for (let i = 0; i < dataContainer.numRows(); i++) {
      const rawFeature = getFeature({index: i});
      const feature = parseGeoJsonRawFeature(rawFeature);
      this.dataToFeature[i] = feature;
      this.centroids[i] = feature?.geometry ? this._getCentroid(feature.geometry) : null;

      if (feature?.geometry) {
        for (const pos of this._getAllPositions(feature.geometry)) {
          if (Number.isFinite(pos[0]) && Number.isFinite(pos[1])) {
            hasValid = true;
            if (pos[0] < minLng) minLng = pos[0];
            if (pos[0] > maxLng) maxLng = pos[0];
            if (pos[1] < minLat) minLat = pos[1];
            if (pos[1] > maxLat) maxLat = pos[1];
          }
        }
      }
    }
    this._geojsonBounds = hasValid ? [minLng, minLat, maxLng, maxLat] : null;
  }

  private _getCentroid(geometry: any): number[] | null {
    const positions = this._getAllPositions(geometry);
    if (!positions.length) return null;
    let sumLng = 0, sumLat = 0, count = 0;
    for (const pos of positions) {
      if (Number.isFinite(pos[0]) && Number.isFinite(pos[1])) {
        sumLng += pos[0]; sumLat += pos[1]; count++;
      }
    }
    return count > 0 ? [sumLng / count, sumLat / count] : null;
  }

  private _getAllPositions(geometry: any): number[][] {
    if (!geometry) return [];
    switch (geometry.type) {
      case 'Point': return [geometry.coordinates];
      case 'MultiPoint': case 'LineString': return geometry.coordinates;
      case 'MultiLineString': case 'Polygon': return geometry.coordinates.flat();
      case 'MultiPolygon': return geometry.coordinates.flat(2);
      case 'GeometryCollection': return (geometry.geometries || []).flatMap((g: any) => this._getAllPositions(g));
      default: return [];
    }
  }

  calculateDataAttribute({filteredIndex}: KeplerTable, getPosition: any) {
    if (this.config.columnMode === COLUMN_MODE_GEOJSON) {
      const data: {index: number; position: number[]}[] = [];
      for (const index of filteredIndex) {
        const feature = this.dataToFeature[index];
        if (!feature?.geometry) continue;
        const centroid = this._getCentroid(feature.geometry);
        if (centroid) data.push({index, position: centroid});
      }
      return data;
    }

    const data: {index: number}[] = [];
    for (const index of filteredIndex) {
      const pos = getPosition({index});
      if (pos.every(Number.isFinite)) data.push({index});
    }
    return data;
  }

  formatLayerData(datasets: Datasets, oldLayerData: unknown): Record<string, unknown> {
    const {dataId} = this.config;
    if (!notNullorUndefined(dataId)) return {};

    const dataset = datasets[dataId];
    const {weightField, weightScale, weightDomain} = this.config as IsolineLayerConfig & {
      weightScale: string;
      weightDomain: number[];
    };
    const {gpuFilter, dataContainer} = dataset;

    const oldData = oldLayerData as any;
    const baseOldLayerData = oldData?._unfiltered
      ? {...oldData, data: oldData._unfiltered}
      : oldLayerData;

    const {data = []} = this.updateData(datasets, baseOldLayerData);

    const isGeojsonMode = this.config.columnMode === COLUMN_MODE_GEOJSON;
    const getPosition = isGeojsonMode
      ? (d: {position: number[]}) => d.position
      : this.getPositionAccessor(dataContainer);

    const hasFilter = Object.values(gpuFilter.filterRange).some((arr: any) =>
      arr.some((v: number) => v !== 0)
    );

    let filteredData = data;
    if (hasFilter) {
      const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)(
        (d: {index: number}) => d.index,
        (dc: any, d: any, fieldIndex: number) => dc.valueAt(d.index, fieldIndex)
      );
      const filterFunc = getFilterDataFunc(gpuFilter.filterRange, getFilterValue);
      filteredData = data.filter(filterFunc);
    }

    let getWeight: ((d: {index: number}) => number) | number = 1;
    if (weightField) {
      const weightRange = [0, 1];
      const scaleFunc = this.getVisChannelScale(weightScale, weightDomain, weightRange);
      getWeight = (d: {index: number}) =>
        this.getEncodedChannelValue(scaleFunc || (x => x), d as any, weightField, 0 as any);
    }

    return {
      _unfiltered: data,
      data: filteredData,
      getWeight,
      getPosition
    };
  }

  getDefaultDeckLayerProps(opts: any) {
    const baseProp = super.getDefaultDeckLayerProps(opts);
    return {
      ...baseProp,
      extensions: [],
      pickable: false
    };
  }

  /**
   * Override hover data: for isoline layer we want to show the level value.
   * The picking data comes from the PathLayer sublayers, not the GPU layer.
   * Each PathLayer has pickable=true and carries a levelIndex in its data.
   */
  getHoverData(
    object: any,
    _dataContainer: DataContainerInterface
  ): {level: number; value: number} | null {
    if (!object || object.levelIndex === undefined) return null;
    const {levels} = this.config.visConfig;
    const thresholds = computeLevelThresholds(levels);
    const idx = object.levelIndex;
    const threshold = thresholds[idx] ?? 0;
    return {level: idx + 1, value: threshold};
  }

  /**
   * After the GPU layer renders we schedule an async CPU pass to read the
   * weights texture and rebuild the picking lines + label anchors.
   */
  private _schedulePickingRebuild(deckIsolineLayer: DeckIsolineLayer) {
    const state = (deckIsolineLayer as any).state;
    if (!state?.weightsTexture) return;

    const device = (deckIsolineLayer as any).context?.device;
    if (!device) return;

    const {visConfig} = this.config;
    const levels = computeLevelThresholds(visConfig.levels);
    const bounds = this.meta?.bounds as [number, number, number, number] | null;
    const size: number = (state.textureSize as number) || 512;
    const aggMode = visConfig.aggregation === 'MEAN' ? 1 : 0;

    // Run async so we don't block the render
    Promise.resolve().then(() => {
      try {
        const buf = readKDETexture(
          device,
          state.weightsTexture,
          state.maxWeightsTexture,
          size,
          aggMode
        );
        if (!buf) return;

        const useBounds: [number, number, number, number] = bounds ?? [-180, -85, 180, 85];
        const lines = buildPickingLines(buf, size, levels, useBounds);
        this._isoLines = lines;
        this._pickingData = buildPathLayerData(lines);
        this._labelAnchors = buildLabelAnchors(lines);
        this._linesVersion++;
      } catch (_e) {
        // silently ignore errors in the picking pass
      }
    });
  }

  renderLayer(opts: {
    data: any;
    gpuFilter: any;
    objectHovered: any;
    mapState: MapState;
    layerCallbacks: any;
    idx: number;
    visible: boolean;
  }): any[] {
    const {data, mapState} = opts;

    const globeMode = Boolean((mapState as any)?.globe?.enabled);
    const densityBounds = this.meta?.bounds as [number, number, number, number] | undefined;
    if (globeMode && (!densityBounds || densityBounds.length !== 4)) return [];

    const {_unfiltered, ...deckData} = data;
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const {visConfig} = this.config;

    const levels = computeLevelThresholds(visConfig.levels);
    const hexColors: HexColor[] = visConfig.colorRange?.colors ?? [];
    const {bandColors, lineColors} = buildIsolineColors(hexColors, levels.length, visConfig.opacity);

    // With the corrected max-weights normalisation (DeckIsolineLayer overrides
    // getShaders to skip the fragColor.r = 1.0 patch), the KDE weights are
    // properly divided by the actual per-frame max, so intensity now works
    // exactly like the heatmap: it amplifies contrast without collapsing the
    // distribution.  We let the user set it via visConfig.intensity (default 1).
    const intensity = visConfig.intensity ?? 1;
    const radiusPixels = interpolateByZoom(mapState.zoom, 0, 2, MAX_ZOOM_LEVEL, visConfig.radius);

    const updateTriggers = {
      getPosition: {columns: this.config.columns, columnMode: this.config.columnMode},
      getWeight: {weightField: this.config.weightField}
    };

    const gpuLayer = new DeckIsolineLayer({
      ...defaultLayerProps,
      ...deckData,
      aggregation: (visConfig.aggregation || 'SUM') as 'SUM' | 'MEAN' | 'MAX',
      radiusPixels,
      intensity,
      threshold: 0.001,
      updateTriggers,
      colorRange: hexColors.length > 0 ? [[0,0,0], [0,0,0]] : [[0,0,0], [0,0,0]], // unused
      weightsTextureSize: 512,
      debounceTimeout: 0,
      globeMode,
      densityBounds: densityBounds && densityBounds.length === 4 ? densityBounds : null,
      // Isoline-specific props
      levelCount: levels.length,
      levels,
      bandColors,
      lineColors,
      showFill: visConfig.showFill,
      showLines: visConfig.showLines,
      lineWidthPx: visConfig.lineWidth
    });

    // Schedule a CPU pass to rebuild picking lines from the KDE texture
    // (runs after current frame; uses a ref to the layer instance)
    setTimeout(() => this._schedulePickingRebuild(gpuLayer), 0);

    const layers: any[] = [gpuLayer];

    // ---- Invisible picking PathLayers ------------------------------------
    if (this._pickingData.length > 0 && this._isoLines.length > 0) {
      const pickingPathLayer = new PathLayer({
        id: `${this.id}-pick`,
        data: this._pickingData,
        getPath: (d: any) => d.path,
        getWidth: 8,
        getColor: [0, 0, 0, 0],
        pickable: true,
        visible: this.config.isVisible && opts.visible,
        opacity: 0,
        widthUnits: 'pixels',
        widthMinPixels: 8,
        parameters: {depthTest: false},
        wrapLongitude: true
      } as any);
      layers.push(pickingPathLayer);
    }

    // ---- Label TextLayer ------------------------------------------------
    if (visConfig.showLabels && this._labelAnchors.length > 0) {
      const thresholds = computeLevelThresholds(visConfig.levels);
      const labelData = this._labelAnchors
        .map((pos, i) =>
          pos
            ? {
                position: [pos[0], pos[1], 0] as [number, number, number],
                text: `${(thresholds[i] * 100).toFixed(0)}%`,
                levelIndex: i
              }
            : null
        )
        .filter(Boolean) as {position: [number, number, number]; text: string; levelIndex: number}[];

      if (labelData.length > 0) {
        const textLayer = new TextLayer({
          id: `${this.id}-labels`,
          data: labelData,
          getPosition: (d: any) => d.position,
          getText: (d: any) => d.text,
          getSize: visConfig.labelSize,
          getColor: [255, 255, 255, 230],
          outlineWidth: 2,
          outlineColor: [0, 0, 0, 200],
          fontSettings: {sdf: true},
          fontWeight: 600,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'center',
          pickable: false,
          visible: this.config.isVisible && opts.visible,
          parameters: {depthTest: false}
        } as any);
        layers.push(textLayer);
      }
    }

    return layers;
  }
}

export default IsolineLayer;
