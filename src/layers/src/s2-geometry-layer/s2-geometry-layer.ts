// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {S2Layer} from '@deck.gl/geo-layers';
import {
  HIGHLIGH_COLOR_3D,
  CHANNEL_SCALES,
  ColorRange,
  LAYER_VIS_CONFIGS
} from '@kepler.gl/constants';
import {default as KeplerTable} from 'reducers/table-utils/kepler-table';
import {DataContainerInterface} from 'reducers/table-utils/data-container-interface';
import {createDataContainer} from 'reducers/table-utils/data-container-utils';
import Layer, {
  LayerBaseConfig,
  LayerColorConfig,
  LayerColumn,
  LayerSizeConfig,
  LayerStrokeColorConfig,
  LayerHeightConfig
} from '../base-layer';
import {
  Merge,
  RGBColor,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigNumber,
  VisConfigRange
} from '@kepler.gl/types';
import S2LayerIcon from './s2-layer-icon';
import {getS2Center, validS2Token} from './s2-utils';

export type S2GeometryLayerVisConfigSettings = {
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

export type S2GeometryLayerColumnsConfig = {
  token: LayerColumn;
};

export type S2GeometryLayerVisConfig = {
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

export type S2GeometryLayerVisualChannelConfig = LayerColorConfig &
  LayerSizeConfig &
  LayerStrokeColorConfig &
  LayerHeightConfig;
export type S2GeometryLayerConfig = Merge<
  LayerBaseConfig,
  {columns: S2GeometryLayerColumnsConfig; visConfig: S2GeometryLayerVisConfig}
> &
  S2GeometryLayerVisualChannelConfig;

export type S2GeometryLayerData = {
  index: number;
  token: any;
};

const zoomFactorValue = 8;

export const S2_TOKEN_FIELDS: {
  token: ['s2', 's2_token'];
} = {
  token: ['s2', 's2_token']
};

export const s2RequiredColumns: ['token'] = ['token'];
export const S2TokenAccessor = ({token}: S2GeometryLayerColumnsConfig) => (
  dc: DataContainerInterface
) => d => dc.valueAt(d.index, token.fieldIdx);

export const defaultElevation = 500;
export const defaultLineWidth = 1;

export const S2VisConfigs: {
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
  heightRange: 'elevationRange',

  // wireframe
  wireframe: 'wireframe'
};

export default class S2GeometryLayer extends Layer {
  dataToFeature: any;
  declare visConfigSettings: S2GeometryLayerVisConfigSettings;
  declare config: S2GeometryLayerConfig;
  constructor(props) {
    super(props);
    this.registerVisConfig(S2VisConfigs);
    this.getPositionAccessor = (dataContainer: DataContainerInterface) =>
      S2TokenAccessor(this.config.columns)(dataContainer);
  }

  get type(): 's2' {
    return 's2';
  }

  get name(): 'S2' {
    return 'S2';
  }

  get requiredLayerColumns() {
    return s2RequiredColumns;
  }

  get layerIcon() {
    return S2LayerIcon;
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

  getDefaultLayerConfig(props = {}) {
    return {
      ...super.getDefaultLayerConfig(props),

      // add height visual channel
      heightField: null,
      heightDomain: [0, 1],
      heightScale: 'linear',

      // add stroke color visual channel
      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: 'quantile'
    };
  }

  static findDefaultLayerProps({fields = []}: KeplerTable) {
    const foundColumns = this.findDefaultColumnField(S2_TOKEN_FIELDS, fields);
    if (!foundColumns || !foundColumns.length) {
      return {props: []};
    }

    return {
      props: foundColumns.map(columns => ({
        isVisible: true,
        label: 'S2',
        columns
      }))
    };
  }

  calculateDataAttribute({dataContainer, filteredIndex}: KeplerTable, getS2Token) {
    const data: S2GeometryLayerData[] = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const token = getS2Token({index});
      if (validS2Token(token)) {
        data.push({
          index,
          token
        });
      }
    }
    return data;
  }

  updateLayerMeta(dataContainer, getS2Token) {
    // add safe row flag
    const centroids = dataContainer.reduce(
      (acc, entry, index) => {
        const s2Token = getS2Token({index});
        if (validS2Token(s2Token)) {
          acc.push(getS2Center(s2Token));
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

  formatLayerData(datasets, oldLayerData, opt = {}) {
    if (this.config.dataId === null) {
      return {};
    }
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const getS2Token = this.getPositionAccessor(dataContainer);
    const {data} = this.updateData(datasets, oldLayerData);

    const accessors = this.getAttributeAccessors({dataContainer});

    return {
      data,
      getS2Token,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      ...accessors
    };
  }

  renderLayer(opts) {
    const {data, gpuFilter, interactionConfig, mapState} = opts;

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    const eleZoomFactor = this.getElevationZoomFactor(mapState);
    const zoomFactor = this.getZoomFactor(mapState);
    const {config} = this;
    const {visConfig} = config;

    const updateTriggers = {
      ...this.getVisualChannelUpdateTriggers(),
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    return [
      new S2Layer({
        ...defaultLayerProps,
        ...interactionConfig,
        ...data,
        getS2Token: (d: any) => d.token,

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
      })
    ];
  }
}
