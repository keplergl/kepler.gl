// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {PolygonLayer} from '@deck.gl/layers';
import type {DataFilterExtensionProps} from '@deck.gl/extensions';
import {Datasets, KeplerTable} from '@kepler.gl/table';
import {GEOARROW_METADATA_KEY, GEOJSON_FIELDS, LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {DataContainerInterface} from '@kepler.gl/utils';
import {DATA_TYPES} from 'type-analyzer';
import Layer from '../base-layer';
import {getFilterDataFunc} from '../aggregation-layer';
import {getCentroidFromGeometry, parseGeoJsonRawFeature} from '../geojson-layer/geojson-utils';
import {applyDefaultColorField} from '../layer-color-utils';
import {assignPointPairToLayerColumn} from '../layer-utils';
import VoronoiLayerIcon from './voronoi-layer-icon';
import {buildVoronoiMosaic, VoronoiCell, VoronoiMosaic, VoronoiSite} from './voronoi-utils';

type VoronoiLayerData = {
  data: VoronoiCell[];
  mosaic?: VoronoiMosaic;
} & Record<string, any>;

const SUPPORTED_COLUMN_MODES = [
  {key: 'points', label: 'Point Columns', requiredColumns: ['lat', 'lng']},
  {key: 'geojson', label: 'GeoJSON Centroids', requiredColumns: ['geojson']}
];

export const voronoiVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  filled: {...LAYER_VIS_CONFIGS.filled, defaultValue: true},
  stroked: {...LAYER_VIS_CONFIGS.stroked, defaultValue: true},
  strokeColor: {...LAYER_VIS_CONFIGS.strokeColor, defaultValue: [30, 35, 45]},
  thickness: {...LAYER_VIS_CONFIGS.thickness, defaultValue: 0.8, range: [0, 5], step: 0.1},
  boundsPadding: {
    type: 'number',
    property: 'boundsPadding',
    defaultValue: 10,
    range: [0, 100],
    step: 1,
    isRanged: false,
    label: 'layerVisConfigs.voronoi.boundsPadding',
    description: 'layerVisConfigs.voronoi.boundsPaddingDescription'
  }
};

export default class VoronoiLayer extends Layer {
  private mosaic?: VoronoiMosaic;
  private geometryTriggers?: {
    dataContainer: DataContainerInterface;
    dataRevision: number;
    columns: Layer['config']['columns'];
    columnMode: Layer['config']['columnMode'];
    padding: number;
    filteredIndex: number[];
    gpuFilter: KeplerTable['gpuFilter'];
  };

  constructor(props) {
    super(props);
    this.registerVisConfig(voronoiVisConfigs);
  }

  get type() {
    return 'voronoi';
  }

  get name() {
    return 'Voronoi Mosaic';
  }

  get layerIcon() {
    return VoronoiLayerIcon;
  }

  get supportedColumnModes() {
    return SUPPORTED_COLUMN_MODES;
  }

  get columnPairs() {
    return {lat: {pair: 'lng', fieldPairKey: 'lat'}, lng: {pair: 'lat', fieldPairKey: 'lng'}};
  }

  get visualChannels() {
    return {color: {...super.visualChannels.color, accessor: 'getFillColor'}};
  }

  static findDefaultLayerProps(dataset: KeplerTable) {
    const geometryColumns = dataset.fields
      .filter(
        field =>
          (field.type === 'geojson' || field.type === 'geoarrow') &&
          [
            DATA_TYPES.GEOMETRY,
            DATA_TYPES.GEOMETRY_FROM_STRING,
            DATA_TYPES.PAIR_GEOMETRY_FROM_STRING
          ].includes(field.analyzerType)
      )
      .map(field => field.name);
    const geojsonColumns =
      this.findDefaultColumnField(
        {geojson: [...GEOJSON_FIELDS.geojson, ...geometryColumns]},
        dataset.fields
      ) || [];
    // Offer column defaults when changing layer type, without creating extra layers on import.
    return {
      props: [],
      altProps: [
        ...(dataset.fieldPairs || []).map(pair => ({
          label: 'Voronoi Mosaic',
          columns: assignPointPairToLayerColumn(pair, false),
          columnMode: 'points'
        })),
        ...geojsonColumns.map(columns => ({
          label: 'Voronoi Mosaic',
          columns,
          columnMode: 'geojson'
        }))
      ]
    };
  }

  setInitialLayerConfig(dataset: KeplerTable) {
    applyDefaultColorField(this, dataset);
    return this;
  }

  getPositionAccessor(dataContainer?: DataContainerInterface) {
    if (!dataContainer || !this.hasAllColumns()) return () => [NaN, NaN];
    if (this.config.columnMode === 'geojson') {
      const {fieldIdx} = this.config.columns.geojson;
      const encoding = dataContainer.getField?.(fieldIdx)?.metadata?.get(GEOARROW_METADATA_KEY);
      return ({index}: {index: number}) => {
        const feature = parseGeoJsonRawFeature(dataContainer.valueAt(index, fieldIdx), encoding);
        return getCentroidFromGeometry(feature?.geometry) || [NaN, NaN];
      };
    }
    const {lng, lat} = this.config.columns;
    return ({index}: {index: number}) =>
      [lng, lat].map(({fieldIdx}) => {
        const value = dataContainer.valueAt(index, fieldIdx);
        return typeof value === 'bigint' ? Number(value) : value;
      });
  }

  formatLayerData(datasets: Datasets, oldLayerData?: VoronoiLayerData): VoronoiLayerData {
    const dataset = this.config.dataId ? datasets[this.config.dataId] : undefined;
    if (!dataset || !this.hasAllColumns()) {
      this.mosaic = undefined;
      this.geometryTriggers = undefined;
      this.updateMeta({bounds: null});
      return {data: []};
    }
    const {dataContainer, dataRevision, gpuFilter} = dataset;
    const filteredIndex = dataset.filteredIndexByLayer?.[this.id] ?? dataset.filteredIndex;
    const getFilterValue = gpuFilter.filterValueAccessor(dataContainer)();
    const {columns, columnMode, visConfig} = this.config;
    const previous = this.geometryTriggers;
    if (
      !this.mosaic ||
      previous?.dataContainer !== dataContainer ||
      previous.dataRevision !== dataRevision ||
      previous.columns !== columns ||
      previous.columnMode !== columnMode ||
      previous.padding !== visConfig.boundsPadding ||
      previous.filteredIndex !== filteredIndex ||
      previous.gpuFilter !== gpuFilter
    ) {
      const getPosition = this.getPositionAccessor(dataContainer);
      const sites: VoronoiSite[] = [];
      for (let index = 0; index < dataContainer.numRows(); index++) {
        sites.push({index, position: getPosition({index}) as [number, number]});
      }
      const visible = new Set(filteredIndex);
      const hasGpuFilter = Object.values(gpuFilter.filterValueUpdateTriggers).some(
        trigger => trigger !== null
      );
      const matchesGpuFilter = hasGpuFilter
        ? getFilterDataFunc(gpuFilter.filterRange, getFilterValue)
        : null;
      this.mosaic = buildVoronoiMosaic(
        sites,
        visConfig.boundsPadding,
        site => visible.has(site.index) && (!matchesGpuFilter || matchesGpuFilter(site))
      );
      this.geometryTriggers = {
        dataContainer,
        dataRevision,
        columns,
        columnMode,
        padding: visConfig.boundsPadding,
        filteredIndex,
        gpuFilter
      };
      this.updateMeta({bounds: this.mosaic.bounds});
    }
    const data = oldLayerData?.mosaic === this.mosaic ? oldLayerData.data : this.mosaic.cells;
    return {
      data,
      mosaic: this.mosaic,
      getFilterValue,
      ...this.getAttributeAccessors({dataContainer})
    };
  }

  renderLayer(opts) {
    const {data, gpuFilter} = opts;
    const {visConfig} = this.config;
    return [
      new PolygonLayer<VoronoiCell, DataFilterExtensionProps<VoronoiCell>>({
        ...this.getDefaultDeckLayerProps(opts),
        filterRange: gpuFilter?.filterRange as [number, number][] | undefined,
        data: data.data,
        getPolygon: cell => cell.polygon,
        getFillColor: data.getFillColor,
        getFilterValue: data.getFilterValue,
        getLineColor: visConfig.strokeColor || this.config.color,
        getLineWidth: visConfig.thickness,
        lineWidthUnits: 'pixels',
        filled: visConfig.filled,
        stroked: visConfig.stroked,
        extruded: false,
        autoHighlight: true,
        updateTriggers: {
          ...this.getVisualChannelUpdateTriggers(),
          getFilterValue: gpuFilter.filterValueUpdateTriggers
        }
      })
    ];
  }
}
