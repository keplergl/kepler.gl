// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  ClusterLevel,
  clusterLocations,
  LocalFlowmapDataProvider,
  makeLocationWeightGetter
} from '@flowmap.gl/data';
import {FlowmapLayer, PickingType} from '@flowmap.gl/layers';
import {format as d3Format} from 'd3-format';

import {TOOLTIP_FORMATS, LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {DataContainerInterface, maybeHexToGeo, getPositionFromHexValue} from '@kepler.gl/utils';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import {
  ColumnLabels,
  ColumnPairs,
  SupportedColumnMode,
  VisConfigBoolean,
  VisConfigNumber,
  MapState
} from '@kepler.gl/types';

import Layer, {LayerBaseConfig, LayerBaseConfigPartial} from '../base-layer';
import {getFilterDataFunc} from '../aggregation-layer';
import {diffUpdateTriggers} from '../layer-update';
import {FindDefaultLayerPropsReturnValue} from '../layer-utils';
import FlowLayerIcon from './flow-layer-icon';

const MAX_CLUSTER_ZOOM_LEVEL = 20;

export type LocationDatum = {
  id: number;
  name: string;
  lon: number;
  lat: number;
};

export type FlowDatum = {
  index: number;
  sourceId: number;
  targetId: number;
  count: number;
};

export type FlowLayerData = {
  locations: LocationDatum[];
  flows: FlowDatum[];
  clusterLevels: ClusterLevel[];
};

const flowmapDataAccessors = {
  getLocationId: (loc: LocationDatum) => loc.id,
  getLocationLon: (loc: LocationDatum) => loc.lon,
  getLocationLat: (loc: LocationDatum) => loc.lat,
  getLocationName: (loc: LocationDatum) => loc.name,
  getFlowOriginId: (flow: FlowDatum) => flow.sourceId,
  getFlowDestId: (flow: FlowDatum) => flow.targetId,
  getFlowMagnitude: (flow: FlowDatum) => flow.count
};

export enum FlowLayerColumnMode {
  LAT_LNG = 'LAT_LNG',
  H3 = 'H3'
}

const flowPosAccessor =
  (
    {lat0, lng0, lat1, lng1, sourceH3, targetH3}: Record<string, any>,
    columnMode?: FlowLayerColumnMode | null
  ) =>
  (dataContainer: DataContainerInterface): ((d: {index: number}) => number[]) => {
    if (columnMode === FlowLayerColumnMode.H3) {
      return (d: {index: number}): number[] => {
        const startPos = getPositionFromHexValue(dataContainer.valueAt(d.index, sourceH3.fieldIdx));
        const endPos = getPositionFromHexValue(dataContainer.valueAt(d.index, targetH3.fieldIdx));
        return [startPos?.[0] ?? 0, startPos?.[1] ?? 0, 0, endPos?.[0] ?? 0, endPos?.[1] ?? 0, 0];
      };
    }
    return (d: {index: number}): number[] => {
      const startPos = maybeHexToGeo(dataContainer, d, lat0, lng0);
      const endPos = maybeHexToGeo(dataContainer, d, lat1, lng1);
      return [
        startPos ? startPos[0] : dataContainer.valueAt(d.index, lng0.fieldIdx),
        startPos ? startPos[1] : dataContainer.valueAt(d.index, lat0.fieldIdx),
        0,
        endPos ? endPos[0] : dataContainer.valueAt(d.index, lng1.fieldIdx),
        endPos ? endPos[1] : dataContainer.valueAt(d.index, lat1.fieldIdx),
        0
      ];
    };
  };

const COLUMN_LABELS: ColumnLabels = {
  lat0: 'flow.source.lat',
  lng0: 'flow.source.lng',
  lat1: 'flow.target.lat',
  lng1: 'flow.target.lng',
  sourceName: 'flow.source.name',
  targetName: 'flow.target.name',
  count: 'flow.count',
  sourceH3: 'flow.source.h3',
  targetH3: 'flow.target.h3'
};

const SUPPORTED_COLUMN_MODES: SupportedColumnMode[] = [
  {
    key: FlowLayerColumnMode.LAT_LNG,
    label: 'Lat/Lng',
    requiredColumns: ['lat0', 'lng0', 'lat1', 'lng1'],
    optionalColumns: ['count', 'sourceName', 'targetName']
  },
  {
    key: FlowLayerColumnMode.H3,
    label: 'H3 hexagons',
    requiredColumns: ['sourceH3', 'targetH3'],
    optionalColumns: ['count', 'sourceName', 'targetName']
  }
];

const DEFAULT_COLUMN_MODE = FlowLayerColumnMode.LAT_LNG;

export const flowVisConfigs = {
  colorRange: 'colorRange' as const,
  opacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    defaultValue: 1.0
  },
  flowAnimationEnabled: {
    defaultValue: false,
    type: 'boolean',
    label: 'layerVisConfigs.flow.animationEnabled',
    property: 'flowAnimationEnabled'
  } as VisConfigBoolean,
  flowAdaptiveScalesEnabled: {
    defaultValue: true,
    type: 'boolean',
    label: 'layerVisConfigs.flow.adaptiveScalesEnabled',
    property: 'flowAdaptiveScalesEnabled'
  } as VisConfigBoolean,
  flowFadeEnabled: {
    defaultValue: true,
    type: 'boolean',
    label: 'layerVisConfigs.flow.fadeEnabled',
    property: 'flowFadeEnabled'
  } as VisConfigBoolean,
  flowFadeAmount: {
    defaultValue: 50,
    type: 'number',
    label: 'layerVisConfigs.flow.fadeAmount',
    property: 'flowFadeAmount',
    isRanged: false,
    range: [0, 100],
    step: 1.0
  } as VisConfigNumber,
  maxTopFlowsDisplayNum: {
    defaultValue: 5000,
    type: 'number',
    label: 'layerVisConfigs.flow.maxTopFlowsDisplayNum',
    property: 'maxTopFlowsDisplayNum',
    isRanged: false,
    range: [0, 10000],
    step: 1
  } as VisConfigNumber,
  flowLocationTotalsEnabled: {
    defaultValue: true,
    type: 'boolean',
    label: 'layerVisConfigs.flow.locationTotalsEnabled',
    property: 'flowLocationTotalsEnabled'
  } as VisConfigBoolean,
  flowClusteringEnabled: {
    defaultValue: true,
    type: 'boolean',
    label: 'layerVisConfigs.flow.clusteringEnabled',
    property: 'flowClusteringEnabled'
  } as VisConfigBoolean,
  flowCurvedLinesEnabled: {
    defaultValue: false,
    type: 'boolean',
    label: 'layerVisConfigs.flow.curvedLinesEnabled',
    property: 'flowCurvedLinesEnabled'
  } as VisConfigBoolean,
  darkBaseMapEnabled: 'darkBaseMapEnabled' as const
};

type Props = ConstructorParameters<typeof Layer>[0];

export default class FlowLayer extends Layer {
  _locationsByLatLon: Record<string, LocationDatum> | null = null;
  _dataProvider: LocalFlowmapDataProvider<LocationDatum, FlowDatum>;

  constructor(props: Props) {
    super(props);
    this.registerVisConfig(flowVisConfigs);
    this._dataProvider = new LocalFlowmapDataProvider<LocationDatum, FlowDatum>(
      flowmapDataAccessors
    );
  }

  get type(): string {
    return 'flow';
  }

  get isAggregated(): boolean {
    return true;
  }

  get layerIcon() {
    return FlowLayerIcon;
  }

  get columnLabels(): ColumnLabels {
    return COLUMN_LABELS;
  }

  get columnPairs(): ColumnPairs {
    return this.defaultLinkColumnPairs;
  }

  get supportedColumnModes(): SupportedColumnMode[] {
    return SUPPORTED_COLUMN_MODES;
  }

  static findDefaultLayerProps(): FindDefaultLayerPropsReturnValue {
    return {props: []};
  }

  getDefaultLayerConfig(config: {[key: string]: any}): LayerBaseConfig {
    const defaultLayerConfig = super.getDefaultLayerConfig(config as LayerBaseConfigPartial);

    return {
      ...defaultLayerConfig,
      columnMode: config?.columnMode ?? DEFAULT_COLUMN_MODE
    };
  }

  getDataProvider(): LocalFlowmapDataProvider<LocationDatum, FlowDatum> {
    return this._dataProvider;
  }

  getPositionAccessor = (dataContainer: DataContainerInterface): ((d: any) => number[]) =>
    flowPosAccessor(
      this.config.columns,
      this.config.columnMode
        ? FlowLayerColumnMode[this.config.columnMode as keyof typeof FlowLayerColumnMode]
        : null
    )(dataContainer);

  private getSourcePosition = (dataContainer: DataContainerInterface) => (d: any) =>
    this.getPositionAccessor(dataContainer)(d).slice(0, 2);

  private getTargetPosition = (dataContainer: DataContainerInterface) => (d: any) =>
    this.getPositionAccessor(dataContainer)(d).slice(3, 5);

  private static getLatLonKey = ([lon, lat]: number[]) => `${lat}:${lon}`;

  private getLocationFromPosition = (pos: number[]) =>
    this._locationsByLatLon?.[FlowLayer.getLatLonKey(pos)];

  private getMagnitude = (dataContainer: DataContainerInterface) => (rowIndex: number) => {
    const fieldIdx = this.config.columns.count?.fieldIdx;
    return fieldIdx >= 0 ? dataContainer.valueAt(rowIndex, fieldIdx) : 1;
  };

  private getSourceName = (dataContainer: DataContainerInterface, d: {index: number}) => {
    const {fieldIdx} = this.config.columns.sourceName ?? {};
    return fieldIdx != null && fieldIdx >= 0 ? dataContainer.valueAt(d.index, fieldIdx) : null;
  };

  private getTargetName = (dataContainer: DataContainerInterface, d: {index: number}) => {
    const {fieldIdx} = this.config.columns.targetName ?? {};
    return fieldIdx != null && fieldIdx >= 0 ? dataContainer.valueAt(d.index, fieldIdx) : null;
  };

  updateLayerMeta(dataset: KeplerTable): void {
    const {dataContainer} = dataset;

    const sourceBounds = this.getPointsBounds(dataContainer, this.getSourcePosition(dataContainer));
    const targetBounds = this.getPointsBounds(dataContainer, this.getTargetPosition(dataContainer));

    const bounds =
      targetBounds && sourceBounds
        ? [
            Math.min(sourceBounds[0], targetBounds[0]),
            Math.min(sourceBounds[1], targetBounds[1]),
            Math.max(sourceBounds[2], targetBounds[2]),
            Math.max(sourceBounds[3], targetBounds[3])
          ]
        : sourceBounds || targetBounds;

    this._locationsByLatLon = {};
    let nextId = 1;
    const maybeAddLocation = ([lon, lat]: number[], name: string | null) => {
      if (!this._locationsByLatLon) return;
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
      const latLon = `${lat}:${lon}`;
      const loc = this._locationsByLatLon[latLon];
      if (!loc) {
        const id = nextId++;
        this._locationsByLatLon[latLon] = {
          id,
          name: name ?? `Location#${id}`,
          lat,
          lon
        };
      }
    };

    const numRows = dataContainer.numRows();
    for (let i = 0; i < numRows; ++i) {
      const datum = {index: i};
      const sourcePos = this.getSourcePosition(dataContainer)(datum);
      const targetPos = this.getTargetPosition(dataContainer)(datum);
      maybeAddLocation(sourcePos, this.getSourceName(dataContainer, datum));
      maybeAddLocation(targetPos, this.getTargetName(dataContainer, datum));
    }

    const locations = Object.values(this._locationsByLatLon);

    const getFlowOriginId = (index: number) =>
      this.getLocationFromPosition(this.getSourcePosition(dataContainer)({index}))?.id || 0;
    const getFlowDestId = (index: number) =>
      this.getLocationFromPosition(this.getTargetPosition(dataContainer)({index}))?.id || 0;

    const flowIndices = dataContainer.getPlainIndex();
    const getLocationWeight = makeLocationWeightGetter(flowIndices, {
      getFlowOriginId,
      getFlowDestId,
      getFlowMagnitude: this.getMagnitude(dataContainer)
    });

    const clusterLevels = clusterLocations(locations, flowmapDataAccessors, getLocationWeight, {
      maxZoom: MAX_CLUSTER_ZOOM_LEVEL
    });

    this.updateMeta({bounds, locations, clusterLevels});
  }

  calculateDataAttribute(
    {dataContainer, filteredIndex}: KeplerTable,
    getPosition: (d: any) => number[]
  ): FlowDatum[] {
    const data: FlowDatum[] = [];
    const datum = {index: 0};
    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      datum.index = index;
      const pos = getPosition(datum);

      if (pos.every(Number.isFinite)) {
        const source = this.getLocationFromPosition(this.getSourcePosition(dataContainer)(datum));
        const target = this.getLocationFromPosition(this.getTargetPosition(dataContainer)(datum));
        if (source && target) {
          data.push({
            index,
            sourceId: source.id,
            targetId: target.id,
            count: this.getMagnitude(dataContainer)(datum.index)
          });
        }
      }
    }

    return data;
  }

  private _oldFilterUpdateTriggers: Record<string, any> | null = null;

  formatLayerData(datasets: Datasets, oldLayerData: Record<string, any>): Record<string, any> {
    const {dataId} = this.config;
    if (!dataId) {
      return {};
    }
    const dataset = datasets[dataId];
    const {gpuFilter, dataContainer} = dataset;

    const {data}: {data?: FlowDatum[]} = this.updateData(datasets, oldLayerData);
    const accessors = this.getAttributeAccessors({dataContainer});
    const {filterRange} = gpuFilter;
    const hasFilter = Object.values(filterRange).some(arr => (arr as number[]).some(v => v !== 0));
    let resultingFlows = data || [];
    if (hasFilter) {
      const filterUpdateTriggers = {
        filterRange: gpuFilter.filterRange,
        ...gpuFilter.filterValueUpdateTriggers
      };
      const filterChanged =
        this._oldFilterUpdateTriggers === null ||
        diffUpdateTriggers(filterUpdateTriggers, this._oldFilterUpdateTriggers);
      if (filterChanged) {
        const indexAccessor = (d: FlowDatum) => d.index;
        const valueAccessor = (
          dc: DataContainerInterface,
          d: {index: number},
          fieldIndex: number
        ) => dc.valueAt(d.index, fieldIndex);
        const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)(
          indexAccessor,
          valueAccessor
        );
        resultingFlows = resultingFlows.filter(getFilterDataFunc(filterRange, getFilterValue));
      }
      this._oldFilterUpdateTriggers = filterUpdateTriggers;
    }

    const layerData: FlowLayerData = {
      locations: this.meta.locations,
      clusterLevels: this.meta.clusterLevels,
      flows: resultingFlows
    };

    return {
      data,
      layerData,
      ...accessors
    };
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
    const {
      layerCallbacks,
      data: {layerData}
    } = opts;

    if (!layerData) {
      return [];
    }

    this._dataProvider.setFlowmapData(layerData);
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    // FlowmapLayer doesn't support GPU filtering
    const {extensions: _extensions, filterRange: _filterRange, onFilteredItemsChange: _onFilteredItemsChange, ...cleanProps} =
      defaultLayerProps as any;

    const {visConfig} = this.config;
    const flowLinesRenderingMode = visConfig.flowCurvedLinesEnabled
      ? 'curved'
      : visConfig.flowAnimationEnabled
        ? 'animated-straight'
        : 'straight';
    return [
      new FlowmapLayer<LocationDatum, FlowDatum>({
        ...cleanProps,
        dataProvider: this._dataProvider,
        ...flowmapDataAccessors,
        pickable: true,
        darkMode: visConfig.darkBaseMapEnabled,
        colorScheme: visConfig.colorRange?.colors,
        fadeAmount: visConfig.flowFadeAmount,
        fadeEnabled: visConfig.flowFadeEnabled,
        fadeOpacityEnabled: false,
        opacity: visConfig.opacity,
        locationTotalsEnabled: visConfig.flowLocationTotalsEnabled,
        flowLinesRenderingMode,
        clusteringEnabled: visConfig.flowClusteringEnabled,
        maxTopFlowsDisplayNum: visConfig.maxTopFlowsDisplayNum,
        clusteringAuto: true,
        adaptiveScalesEnabled: visConfig.flowAdaptiveScalesEnabled,
        onHover: layerCallbacks.onLayerHover,
        parameters: {
          ...(cleanProps.parameters || {}),
          cull: false
        }
      })
    ];
  }

  getHoverData(object: Record<string, any>): {
    object: Record<string, any>;
    fieldValues: Array<{labelMessage: string; value: any}>;
  } | null {
    const fmt = d3Format(TOOLTIP_FORMATS.DECIMAL_COMMA.format);
    switch (object?.type) {
      case PickingType.LOCATION:
        return {
          object,
          fieldValues: [
            {
              labelMessage: 'flow.tooltip.location.name',
              value: object.location.name
            },
            {
              labelMessage: 'flow.tooltip.location.incomingCount',
              value: fmt(object.totals.incomingCount)
            },
            {
              labelMessage: 'flow.tooltip.location.outgoingCount',
              value: fmt(object.totals.outgoingCount)
            },
            {
              labelMessage: 'flow.tooltip.location.internalCount',
              value: fmt(object.totals.internalCount)
            }
          ]
        };
      case PickingType.FLOW:
        return {
          object,
          fieldValues: [
            {
              labelMessage: 'flow.tooltip.flow.sourceName',
              value: object.origin.name
            },
            {
              labelMessage: 'flow.tooltip.flow.targetName',
              value: object.dest.name
            },
            {
              labelMessage: 'flow.tooltip.flow.count',
              value: fmt(object.count)
            }
          ]
        };
      default:
        return null;
    }
  }
}
