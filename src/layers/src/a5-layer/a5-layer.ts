// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {A5Layer as DeckA5Layer} from '@deck.gl/geo-layers';
import {GeoJsonLayer} from '@deck.gl/layers';
import type {Feature} from 'geojson';
import {
  HIGHLIGH_COLOR_3D,
  CHANNEL_SCALES,
  LAYER_VIS_CONFIGS,
  DEFAULT_COLOR_UI
} from '@kepler.gl/constants';
import {default as KeplerTable} from '@kepler.gl/table';
import Layer, {
  LayerBaseConfig,
  LayerBaseConfigPartial,
  LayerColorConfig,
  LayerSizeConfig,
  LayerStrokeColorConfig,
  LayerHeightConfig
} from '../base-layer';
import {
  ColorRange,
  Merge,
  RGBColor,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigNumber,
  VisConfigRange,
  LayerColumn
} from '@kepler.gl/types';
import A5LayerIcon from './a5-layer-icon';
import {a5TokenToPolygonGeo, getA5Center, normalizeA5Token, validA5Token} from './a5-utils';
import {DataContainerInterface, createDataContainer} from '@kepler.gl/utils';

export type A5GeometryLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  colorRange: VisConfigColorRange;
  filled: VisConfigBoolean;
  thickness: VisConfigNumber;
  strokeColor: VisConfigColorSelect;
  strokeColorRange: VisConfigColorRange;
  sizeRange: VisConfigRange;
  stroked: VisConfigBoolean;
  enable3d: VisConfigBoolean;
  elevationScale: VisConfigNumber;
  enableElevationZoomFactor: VisConfigBoolean;
  heightRange: VisConfigRange;
  wireframe: VisConfigBoolean;
};

export type A5GeometryLayerColumnsConfig = {
  token: LayerColumn;
};

export type A5GeometryLayerVisConfig = {
  opacity: number;
  colorRange: ColorRange;
  filled: boolean;
  thickness: number;
  strokeColor: RGBColor;
  strokeColorRange: ColorRange;
  sizeRange: [number, number];
  stroked: boolean;
  enable3d: boolean;
  elevationScale: number;
  enableElevationZoomFactor: boolean;
  heightRange: [number, number];
  wireframe: boolean;
};

export type A5GeometryLayerVisualChannelConfig = LayerColorConfig &
  LayerSizeConfig &
  LayerStrokeColorConfig &
  LayerHeightConfig;
export type A5GeometryLayerConfig = Merge<
  LayerBaseConfig,
  {columns: A5GeometryLayerColumnsConfig; visConfig: A5GeometryLayerVisConfig}
> &
  A5GeometryLayerVisualChannelConfig;

export type A5GeometryLayerData = {
  index: number;
  token: string;
};

const zoomFactorValue = 8;
const DEFAULT_LINE_SCALE_VALUE = 8;

export const A5_TOKEN_FIELDS: {
  token: ['a5', 'a5_token', 'a5_id'];
} = {
  token: ['a5', 'a5_token', 'a5_id']
};

export const a5RequiredColumns: ['token'] = ['token'];
export const A5TokenAccessor =
  ({token}: A5GeometryLayerColumnsConfig) =>
  (dc: DataContainerInterface) =>
  d =>
    dc.valueAt(d.index, token.fieldIdx);

export const defaultElevation = 500;
export const defaultLineWidth = 1;

export const A5VisConfigs: {
  // Filled color
  opacity: 'opacity';
  colorRange: 'colorRange';
  filled: VisConfigBoolean;

  // stroke
  thickness: VisConfigNumber;
  strokeColor: 'strokeColor';
  strokeColorRange: 'strokeColorRange';
  sizeRange: 'strokeWidthRange';
  stroked: 'stroked';

  // height
  enable3d: 'enable3d';
  elevationScale: 'elevationScale';
  enableElevationZoomFactor: 'enableElevationZoomFactor';
  fixedHeight: 'fixedHeight';
  heightRange: 'elevationRange';

  // wireframe
  wireframe: 'wireframe';
} = {
  // Filled color
  opacity: 'opacity',
  colorRange: 'colorRange',
  filled: {
    ...LAYER_VIS_CONFIGS.filled,
    type: 'boolean',
    label: 'Fill Color',
    defaultValue: true,
    property: 'filled'
  },

  // stroke
  thickness: {
    ...LAYER_VIS_CONFIGS.thickness,
    defaultValue: 0.5
  },
  strokeColor: 'strokeColor',
  strokeColorRange: 'strokeColorRange',
  sizeRange: 'strokeWidthRange',
  stroked: 'stroked',

  // height
  enable3d: 'enable3d',
  elevationScale: 'elevationScale',
  enableElevationZoomFactor: 'enableElevationZoomFactor',
  fixedHeight: 'fixedHeight',
  heightRange: 'elevationRange',

  // wireframe
  wireframe: 'wireframe'
};

export default class A5GeometryLayer extends Layer {
  dataToFeature: any;
  declare visConfigSettings: A5GeometryLayerVisConfigSettings;
  declare config: A5GeometryLayerConfig;
  constructor(props) {
    super(props);
    this.registerVisConfig(A5VisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      A5TokenAccessor(this.config.columns)(dataContainer);
  }

  get type(): 'a5' {
    return 'a5';
  }

  get name(): 'A5' {
    return 'A5';
  }

  get requiredLayerColumns() {
    return a5RequiredColumns;
  }

  get layerIcon() {
    return A5LayerIcon;
  }

  get visualChannels() {
    const visualChannels = super.visualChannels;
    return {
      color: {
        ...visualChannels.color,
        accessor: 'getFillColor'
      },
      size: {
        ...visualChannels.size,
        property: 'stroke',
        accessor: 'getLineWidth',
        condition: config => config.visConfig.stroked,
        defaultValue: defaultLineWidth
      },
      strokeColor: {
        property: 'strokeColor',
        field: 'strokeColorField',
        scale: 'strokeColorScale',
        domain: 'strokeColorDomain',
        range: 'strokeColorRange',
        key: 'strokeColor',
        channelScaleType: CHANNEL_SCALES.color,
        accessor: 'getLineColor',
        condition: config => config.visConfig.stroked,
        nullValue: visualChannels.color.nullValue,
        defaultValue: config => config.visConfig.strokeColor || config.color
      },
      height: {
        property: 'height',
        field: 'heightField',
        scale: 'heightScale',
        domain: 'heightDomain',
        range: 'heightRange',
        key: 'height',
        channelScaleType: CHANNEL_SCALES.size,
        accessor: 'getElevation',
        condition: config => config.visConfig.enable3d,
        nullValue: 0,
        defaultValue: defaultElevation
      }
    };
  }

  getDefaultLayerConfig(props: LayerBaseConfigPartial) {
    const defaultLayerConfig = super.getDefaultLayerConfig(props ?? {});
    return {
      ...defaultLayerConfig,

      // add height visual channel
      heightField: null,
      heightDomain: [0, 1],
      heightScale: 'linear',

      // add stroke color visual channel
      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: 'quantile',
      colorUI: {
        ...defaultLayerConfig.colorUI,
        strokeColorRange: DEFAULT_COLOR_UI
      }
    };
  }

  static findDefaultLayerProps({fields = []}: KeplerTable) {
    const foundColumns = this.findDefaultColumnField(A5_TOKEN_FIELDS, fields);
    if (!foundColumns || !foundColumns.length) {
      return {props: []};
    }

    return {
      props: foundColumns.map(columns => ({
        isVisible: true,
        label: 'A5',
        columns
      }))
    };
  }

  calculateDataAttribute({filteredIndex}: KeplerTable, getA5Token) {
    const data: A5GeometryLayerData[] = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const token = getA5Token({index});
      const normalized = normalizeA5Token(token);
      if (normalized) {
        data.push({
          index,
          token: normalized
        });
      }
    }
    return data;
  }

  updateLayerMeta(dataset: KeplerTable, getA5Token) {
    const {dataContainer} = dataset;
    const centroids = dataContainer.reduce(
      (acc, entry, index) => {
        const a5Token = getA5Token({index});
        if (validA5Token(a5Token)) {
          const center = getA5Center(a5Token);
          if (center) {
            acc.push(center);
          }
        }

        return acc;
      },
      [],
      true
    );

    const centroidsDataContainer = createDataContainer(centroids);
    const bounds = this.getPointsBounds(centroidsDataContainer, (d, dc) => [
      dc.valueAt(d.index, 0),
      dc.valueAt(d.index, 1)
    ]);
    this.dataToFeature = {centroids};
    this.updateMeta({bounds});
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const getA5Token = this.getPositionAccessor(dataContainer);
    const {data} = this.updateData(datasets, oldLayerData);

    const accessors = this.getAttributeAccessors({dataContainer});

    return {
      data,
      getA5Token,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      ...accessors
    };
  }

  /**
   * Composite deck.gl layers report sublayer ids (e.g. `${id}-cell-fill`).
   * Treat those as belonging to this layer so hover outlines can render.
   */
  isLayerHovered(objectInfo): boolean {
    const layerId = objectInfo?.layer?.id ?? objectInfo?.layer?.props?.id;
    return Boolean(
      objectInfo?.picked &&
        typeof layerId === 'string' &&
        (layerId === this.id || layerId.startsWith(`${this.id}-`))
    );
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, interactionConfig, mapState} = opts;

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    const eleZoomFactor = this.getElevationZoomFactor(mapState);
    const zoomFactor = this.getZoomFactor(mapState);
    const {config} = this;
    const {visConfig} = config;
    const hoveredObject = this.hasHoveredObject(objectHovered);

    const updateTriggers = {
      ...this.getVisualChannelUpdateTriggers(),
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    return [
      new DeckA5Layer({
        ...defaultLayerProps,
        ...interactionConfig,
        ...data,
        getPentagon: (d: any) => d.token,

        autoHighlight: visConfig.enable3d,
        highlightColor: HIGHLIGH_COLOR_3D,

        // stroke
        lineWidthScale: visConfig.thickness * zoomFactor * zoomFactorValue,
        stroked: visConfig.stroked,
        lineMiterLimit: 2,

        // Filled color
        filled: visConfig.filled,
        opacity: visConfig.opacity,
        wrapLongitude: false,

        // Elevation
        elevationScale: visConfig.elevationScale * eleZoomFactor,
        extruded: visConfig.enable3d,

        wireframe: visConfig.wireframe,

        pickable: true,

        updateTriggers
      }),
      // hover outline (2D); 3D uses autoHighlight
      ...(hoveredObject && !visConfig.enable3d
        ? [
            new GeoJsonLayer({
              ...this.getDefaultHoverLayerProps(),
              visible: defaultLayerProps.visible,
              data: [a5TokenToPolygonGeo(hoveredObject)].filter(Boolean) as Feature[],
              getLineColor: config.highlightColor,
              lineWidthScale: DEFAULT_LINE_SCALE_VALUE * zoomFactor,
              wrapLongitude: false
            })
          ]
        : [])
    ];
  }
}
