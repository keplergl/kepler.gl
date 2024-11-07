// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

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
import {EnhancedColumnLayer} from '@kepler.gl/deckgl-layers';
import {
  getCentroid,
  idToPolygonGeo,
  h3IsValid,
  getHexFields,
  Centroid,
  findDefaultColorField,
  DataContainerInterface,
  createDataContainer
} from '@kepler.gl/utils';
import H3HexagonLayerIcon from './h3-hexagon-layer-icon';
import {
  CHANNEL_SCALES,
  HIGHLIGH_COLOR_3D,
  DEFAULT_COLOR_UI,
  DEFAULT_TEXT_LABEL,
  LAYER_VIS_CONFIGS,
  ColorRange
} from '@kepler.gl/constants';

import {
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigNumber,
  VisConfigRange,
  Merge,
  LayerColumn
} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';

import {getTextOffsetByRadius, formatTextLabelData} from '../layer-text-label';

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
  enableElevationZoomFactor: 'enableElevationZoomFactor'
};

const brushingExtension = new BrushingExtension();
export default class HexagonIdLayer extends Layer {
  dataToFeature: {centroids: Centroid[]};

  declare config: HexagonIdLayerConfig;
  declare visConfigSettings: HexagonIdLayerVisConfigSettings;
  constructor(props) {
    super(props);
    this.dataToFeature = {centroids: []};
    this.registerVisConfig(HexagonIdVisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      hexIdAccessor(this.config.columns)(dataContainer);
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

  calculateDataAttribute({filteredIndex}: KeplerTable, getHexId) {
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
  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const getHexId = this.getPositionAccessor(dataContainer);
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

    return {
      data,
      getHexId,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      textLabels,
      getPosition: d => d.centroid,
      ...accessors
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(dataContainer, getHexId) {
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
    const {data, gpuFilter, objectHovered, mapState, interactionConfig} = opts;

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
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    const columnLayerTriggers = {
      getCoverage: updateTriggers.getCoverage
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const hoveredObject = this.hasHoveredObject(objectHovered);

    // getPixelOffset with no radius
    const radiusScale = 1.0;
    const getRaidus = null;
    const getPixelOffset = getTextOffsetByRadius(radiusScale, getRaidus, mapState);

    const brushingProps = this.getBrushingExtensionProps(interactionConfig);
    const extensions = [...defaultLayerProps.extensions, brushingExtension];
    const sharedProps = {
      getFilterValue: data.getFilterValue,
      extensions,
      filterRange: defaultLayerProps.filterRange,
      visible: defaultLayerProps.visible,
      ...brushingProps
    };

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

        // coverage
        coverage: config.coverageField ? 1 : visConfig.coverage,

        // highlight
        autoHighlight: visConfig.enable3d,
        highlightColor: HIGHLIGH_COLOR_3D,

        // elevation
        extruded: visConfig.enable3d,
        elevationScale: visConfig.elevationScale * eleZoomFactor,

        // render
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
      // hover layer
      ...(hoveredObject && !config.sizeField
        ? [
            new GeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              visible: defaultLayerProps.visible,
              data: [idToPolygonGeo(hoveredObject)],
              getLineColor: config.highlightColor,
              lineWidthScale: DEFAULT_LINE_SCALE_VALUE * zoomFactor,
              wrapLongitude: false
            })
          ]
        : []),
      // text label layer
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
}
