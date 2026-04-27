// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as arrow from 'apache-arrow';

import Layer, {
  LayerBaseConfig,
  LayerBaseConfigPartial,
  LayerColorConfig,
  LayerCoverageConfig,
  LayerSizeConfig
} from '../base-layer';
import {BrushingExtension} from '@deck.gl/extensions';
import {GeoJsonLayer} from '@deck.gl/layers';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import type {Feature} from 'geojson';
import {EnhancedColumnLayer, FilterArrowExtension} from '@kepler.gl/deckgl-layers';
import {GeoArrowH3HexagonLayer} from '@kepler.gl/deckgl-arrow-layers';
import {
  getCentroid,
  idToPolygonGeo,
  h3IsValid,
  getHexFields,
  Centroid
} from '@kepler.gl/common-utils';
import {findDefaultColorField, DataContainerInterface, ArrowDataContainer, createDataContainer} from '@kepler.gl/utils';
import H3HexagonLayerIcon from './h3-hexagon-layer-icon';
import {
  ALL_FIELD_TYPES,
  CHANNEL_SCALES,
  HIGHLIGH_COLOR_3D,
  DEFAULT_COLOR_UI,
  DEFAULT_TEXT_LABEL,
  LAYER_VIS_CONFIGS
} from '@kepler.gl/constants';

import {
  ColorRange,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  Merge,
  LayerColumn
} from '@kepler.gl/types';
import {Datasets, KeplerTable} from '@kepler.gl/table';

import {getTextOffsetByRadius, formatTextLabelData} from '../layer-text-label';
import {getFilteredIndex, isLayerHoveredFromArrow} from '../layer-utils';

export type HexagonIdLayerColumnsConfig = {
  hex_id: LayerColumn;
};

export type HexagonIdLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  strokeOpacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  coverage: VisConfigNumber;
  enable3d: VisConfigBoolean;
  sizeRange: VisConfigRange;
  coverageRange: VisConfigRange;
  elevationScale: VisConfigNumber;
  enableElevationZoomFactor: VisConfigBoolean;
  filled: VisConfigBoolean;
  outline: VisConfigBoolean;
  thickness: VisConfigNumber;
};

export type HexagonIdLayerVisConfig = {
  opacity: number;
  strokeOpacity: number;
  colorRange: ColorRange;
  coverage: number;
  enable3d: boolean;
  sizeRange: [number, number];
  coverageRange: [number, number];
  elevationScale: number;
  enableElevationZoomFactor: boolean;
  filled: boolean;
  outline: boolean;
  thickness: number;
};

export type HexagonIdLayerVisualChannelConfig = LayerColorConfig &
  LayerSizeConfig &
  LayerCoverageConfig;
export type HexagonIdLayerConfig = Merge<
  LayerBaseConfig,
  {columns: HexagonIdLayerColumnsConfig; visConfig: HexagonIdLayerVisConfig}
> &
  HexagonIdLayerVisualChannelConfig;

export type HexagonIdLayerData = {index: number; id; centroid: Centroid};

const DEFAULT_LINE_SCALE_VALUE = 8;

export const hexIdRequiredColumns: ['hex_id'] = ['hex_id'];
export const hexIdAccessor =
  ({hex_id}: HexagonIdLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d =>
    dc.valueAt(d.index, hex_id.fieldIdx);

/** Accessor that tries to convert h3 indicies in decimal form to hex form */
export const hexIdExAccessor =
  ({hex_id}: HexagonIdLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d => {
    const value = dc.valueAt(d.index, hex_id.fieldIdx);
    if (h3IsValid(value)) {
      return value;
    }
    try {
      return BigInt(value).toString(16);
    } catch {
      return null;
    }
  };

export const defaultElevation = 500;
export const defaultCoverage = 1;

export const HexagonIdVisConfigs: {
  opacity: VisConfigNumber;
  strokeOpacity: VisConfigNumber;
  colorRange: 'colorRange';
  filled: VisConfigBoolean;
  outline: 'outline';
  strokeColor: 'strokeColor';
  strokeColorRange: 'strokeColorRange';
  thickness: 'thickness';
  coverage: 'coverage';
  enable3d: 'enable3d';
  sizeRange: 'elevationRange';
  coverageRange: 'coverageRange';
  elevationScale: 'elevationScale';
  enableElevationZoomFactor: 'enableElevationZoomFactor';
  fixedHeight: 'fixedHeight';
} = {
  colorRange: 'colorRange',
  filled: {
    ...LAYER_VIS_CONFIGS.filled,
    defaultValue: true
  },
  opacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    label: 'Fill Opacity',
    range: [0, 1],
    property: 'opacity'
  },
  outline: 'outline',
  strokeColor: 'strokeColor',
  strokeColorRange: 'strokeColorRange',
  strokeOpacity: {
    ...LAYER_VIS_CONFIGS.opacity,
    label: 'Stroke Opacity',
    range: [0, 1],
    property: 'strokeOpacity'
  },
  thickness: 'thickness',
  coverage: 'coverage',
  enable3d: 'enable3d',
  sizeRange: 'elevationRange',
  coverageRange: 'coverageRange',
  elevationScale: 'elevationScale',
  enableElevationZoomFactor: 'enableElevationZoomFactor',
  fixedHeight: 'fixedHeight'
};

const brushingExtension = new BrushingExtension();
const arrowCPUFilterExtension = new FilterArrowExtension();

export default class HexagonIdLayer extends Layer {
  dataToFeature: {centroids: Centroid[]};

  declare config: HexagonIdLayerConfig;
  declare visConfigSettings: HexagonIdLayerVisConfigSettings;

  dataContainer: DataContainerInterface | null = null;
  geoArrowHexVector: arrow.Vector | undefined = undefined;
  filteredIndex: Uint8ClampedArray | null = null;
  filteredIndexTrigger: number[] | null = null;
  constructor(props) {
    super(props);
    this.dataToFeature = {centroids: []};
    this.registerVisConfig(HexagonIdVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface, dataset?: KeplerTable) => {
      const fieldType = dataset?.fields[this.config.columns.hex_id.fieldIdx].type;
      return fieldType === ALL_FIELD_TYPES.h3
        ? hexIdAccessor(this.config.columns)(dataContainer)
        : hexIdExAccessor(this.config.columns)(dataContainer);
    };
  }

  get type(): 'hexagonId' {
    return 'hexagonId';
  }

  get name(): 'H3' {
    return 'H3';
  }

  get requiredLayerColumns() {
    return hexIdRequiredColumns;
  }

  get layerIcon() {
    // use hexagon layer icon for now
    return H3HexagonLayerIcon;
  }

  get visualChannels() {
    const visualChannels = super.visualChannels;
    return {
      color: {
        ...visualChannels.color,
        accessor: 'getFillColor',
        condition: config => config.visConfig.filled
      },
      strokeColor: {
        property: 'strokeColor',
        key: 'strokeColor',
        field: 'strokeColorField',
        scale: 'strokeColorScale',
        domain: 'strokeColorDomain',
        range: 'strokeColorRange',
        channelScaleType: CHANNEL_SCALES.color,
        accessor: 'getLineColor',
        condition: config => config.visConfig.outline,
        defaultValue: config => config.visConfig.strokeColor || config.color
      },
      size: {
        ...visualChannels.size,
        property: 'height',
        accessor: 'getElevation',
        nullValue: 0,
        condition: config => config.visConfig.enable3d,
        defaultValue: defaultElevation
      },
      coverage: {
        property: 'coverage',
        field: 'coverageField',
        scale: 'coverageScale',
        domain: 'coverageDomain',
        range: 'coverageRange',
        key: 'coverage',
        channelScaleType: CHANNEL_SCALES.radius,
        accessor: 'getCoverage',
        nullValue: 0,
        defaultValue: defaultCoverage
      }
    };
  }

  setInitialLayerConfig(dataset) {
    if (!dataset.dataContainer.numRows()) {
      return this;
    }
    const defaultColorField = findDefaultColorField(dataset);

    if (defaultColorField) {
      this.updateLayerConfig<HexagonIdLayerConfig>({
        colorField: defaultColorField
      });
      this.updateLayerVisualChannel(dataset, 'color');
    }

    return this;
  }

  static findDefaultLayerProps({fields = [], dataContainer, label}: KeplerTable) {
    const hexFields = getHexFields(fields, dataContainer);
    if (!hexFields.length) {
      return {props: []};
    }

    return {
      props: hexFields.map(f => ({
        isVisible: true,
        // default layer name should be dataset name
        label,
        columns: {
          hex_id: {
            value: f.name,
            fieldIdx: fields.findIndex(fid => fid.name === f.name)
          }
        }
      }))
    };
  }

  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    const defaultLayerConfig = super.getDefaultLayerConfig(props);

    return {
      ...defaultLayerConfig,

      // add stroke color visual channel
      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: 'quantile',
      colorUI: {
        ...defaultLayerConfig.colorUI,
        strokeColorRange: DEFAULT_COLOR_UI
      },

      // add radius visual channel
      coverageField: null,
      coverageDomain: [0, 1],
      coverageScale: 'linear',

      // modify default textLabel anchor position to be appropriate for a hexagon shape
      textLabel: [
        {
          ...DEFAULT_TEXT_LABEL,
          anchor: 'middle'
        }
      ]
    };
  }

  calculateDataAttribute({filteredIndex, dataContainer}: KeplerTable, getHexId) {
    if (dataContainer instanceof ArrowDataContainer) {
      this.filteredIndex = getFilteredIndex(
        dataContainer.numRows(),
        filteredIndex,
        this.filteredIndex
      );
      this.filteredIndexTrigger = filteredIndex;
      this.geoArrowHexVector = dataContainer.getColumn(this.config.columns.hex_id.fieldIdx);

      return dataContainer.getTable();
    }

    this.geoArrowHexVector = undefined;
    this.filteredIndex = null;

    const data: HexagonIdLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const id = getHexId({index});
      const centroid = this.dataToFeature.centroids[index];

      if (centroid) {
        data.push({
          index,
          id,
          centroid
        });
      }
    }
    return data;
  }

  // TODO: fix complexity
  /* eslint-disable complexity */
  formatLayerData(datasets: Datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }

    const dataset = datasets[this.config.dataId];
    const {gpuFilter, dataContainer} = dataset;
    const getHexId = this.getPositionAccessor(dataContainer, dataset);
    const {data, triggerChanged} = this.updateData(datasets, oldLayerData);
    const accessors = this.getAttributeAccessors({dataContainer});
    const {textLabel} = this.config;

    // get all distinct characters in the text labels
    const textLabels = formatTextLabelData({
      textLabel,
      triggerChanged,
      oldLayerData,
      data,
      dataContainer
    });

    const isFilteredAccessor = (data: {index: number}) => {
      return this.filteredIndex ? this.filteredIndex[data.index] : 1;
    };

    return {
      data,
      getHexId,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      getFiltered: isFilteredAccessor,
      textLabels,
      getPosition: d => d.centroid,
      ...accessors
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(dataset: KeplerTable, getHexId) {
    const {dataContainer} = dataset;

    const centroids = dataContainer.map((d, index) => {
      const id = getHexId({index});
      if (!h3IsValid(id)) {
        return null;
      }
      // save a reference of centroids to dataToFeature
      // so we don't have to re calculate it again
      return getCentroid({id});
    }, true);

    const centroidsDataContainer = createDataContainer(centroids);

    const bounds = this.getPointsBounds(
      centroidsDataContainer,
      (d: any, dc: DataContainerInterface) => {
        return [dc.valueAt(d.index, 0), dc.valueAt(d.index, 1)];
      }
    );
    this.dataToFeature = {centroids};
    this.updateMeta({bounds});
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState, interactionConfig, dataset} = opts;

    const zoomFactor = this.getZoomFactor(mapState);
    const eleZoomFactor = this.getElevationZoomFactor(mapState);
    const {config} = this;
    const {visConfig} = config;
    const updateTriggers = this.getVisualChannelUpdateTriggers();

    const h3HexagonLayerTriggers = {
      getHexagon: this.config.columns,
      getFillColor: updateTriggers.getFillColor,
      getLineColor: updateTriggers.getLineColor,
      getElevation: updateTriggers.getElevation,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      getFiltered: this.filteredIndexTrigger
    };

    const columnLayerTriggers = {
      getCoverage: updateTriggers.getCoverage
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const hoveredObject = this.hasHoveredObject(objectHovered);

    const radiusScale = 1.0;
    const getRaidus = null;
    const getPixelOffset = getTextOffsetByRadius(radiusScale, getRaidus, mapState);

    const useArrowLayer = Boolean(this.geoArrowHexVector);

    const brushingProps = this.getBrushingExtensionProps(interactionConfig);
    const extensions = [
      ...defaultLayerProps.extensions,
      brushingExtension,
      ...(useArrowLayer ? [arrowCPUFilterExtension] : [])
    ];
    const sharedProps = {
      getFilterValue: data.getFilterValue,
      extensions,
      filterRange: defaultLayerProps.filterRange,
      visible: defaultLayerProps.visible,
      ...brushingProps
    };

    if (useArrowLayer) {
      return [
        new GeoArrowH3HexagonLayer({
          ...defaultLayerProps,
          ...data,
          ...brushingProps,
          extensions,
          data: dataset.dataContainer.getTable(),
          getHexagon: this.geoArrowHexVector,
          wrapLongitude: false,

          filled: visConfig.filled,
          stroked: visConfig.outline,
          lineWidthScale: visConfig.thickness,

          coverage: config.coverageField ? 1 : visConfig.coverage,

          autoHighlight: visConfig.enable3d,
          highlightColor: HIGHLIGH_COLOR_3D,

          extruded: visConfig.enable3d,
          elevationScale: visConfig.elevationScale * eleZoomFactor,

          updateTriggers: h3HexagonLayerTriggers,
          _subLayerProps: {
            'hexagon-cell': {
              type: EnhancedColumnLayer,
              getCoverage: data.getCoverage,
              updateTriggers: columnLayerTriggers,
              strokeOpacity: visConfig.strokeOpacity
            }
          }
        }),
        ...(hoveredObject && !config.sizeField
          ? [
              new GeoJsonLayer({
                ...this.getDefaultHoverLayerProps(),
                visible: defaultLayerProps.visible,
                data: [idToPolygonGeo(hoveredObject)].filter(Boolean) as Feature[],
                getLineColor: config.highlightColor,
                lineWidthScale: DEFAULT_LINE_SCALE_VALUE * zoomFactor,
                wrapLongitude: false
              })
            ]
          : []),
        ...this.renderTextLabelLayer(
          {
            getPosition: data.getPosition,
            sharedProps,
            getPixelOffset,
            updateTriggers
          },
          opts
        )
      ];
    }

    return [
      new H3HexagonLayer({
        ...defaultLayerProps,
        ...data,
        ...brushingProps,
        extensions,
        wrapLongitude: false,

        filled: visConfig.filled,
        stroked: visConfig.outline,
        lineWidthScale: visConfig.thickness,

        getHexagon: (x: any) => x.id,

        coverage: config.coverageField ? 1 : visConfig.coverage,

        autoHighlight: visConfig.enable3d,
        highlightColor: HIGHLIGH_COLOR_3D,

        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,

        updateTriggers: h3HexagonLayerTriggers,
        _subLayerProps: {
          'hexagon-cell': {
            type: EnhancedColumnLayer,
            getCoverage: data.getCoverage,
            updateTriggers: columnLayerTriggers,
            strokeOpacity: visConfig.strokeOpacity
          }
        }
      }),
      ...(hoveredObject && !config.sizeField
        ? [
            new GeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              visible: defaultLayerProps.visible,
              data: [idToPolygonGeo(hoveredObject)].filter(Boolean) as Feature[],
              getLineColor: config.highlightColor,
              lineWidthScale: DEFAULT_LINE_SCALE_VALUE * zoomFactor,
              wrapLongitude: false
            })
          ]
        : []),
      ...this.renderTextLabelLayer(
        {
          getPosition: data.getPosition,
          sharedProps,
          getPixelOffset,
          updateTriggers
        },
        opts
      )
    ];
  }

  hasHoveredObject(objectInfo: {index: number}) {
    if (
      isLayerHoveredFromArrow(objectInfo, this.id) &&
      objectInfo.index >= 0 &&
      this.dataContainer
    ) {
      return super.hasHoveredObject(objectInfo);
    }
    return super.hasHoveredObject(objectInfo);
  }

  getHoverData(
    object: {index: number} | arrow.StructRow | undefined,
    dataContainer: DataContainerInterface,
    fields,
    animationConfig,
    hoverInfo: {index: number}
  ) {
    const index = this.geoArrowHexVector ? hoverInfo?.index : (object as {index: number})?.index;
    if (index >= 0) {
      return dataContainer.row(index);
    }
    return null;
  }
}
