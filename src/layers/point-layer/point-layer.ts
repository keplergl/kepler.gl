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

import {BrushingExtension} from '@deck.gl/extensions';
import {ScatterplotLayer} from '@deck.gl/layers';

import Layer, {
  LayerBaseConfig,
  LayerColorConfig,
  LayerColumn,
  LayerSizeConfig,
  LayerStrokeColorConfig
} from '../base-layer';
import {hexToRgb} from 'utils/color-utils';
import {findDefaultColorField} from 'utils/dataset-utils';
import PointLayerIcon from './point-layer-icon';
import {DEFAULT_LAYER_COLOR, CHANNEL_SCALES, ColorRange} from '@kepler.gl/constants';

import {getTextOffsetByRadius, formatTextLabelData} from '../layer-text-label';
import {
  Merge, 
  RGBColor,
  VisConfigBoolean,
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigNumber,
  VisConfigRange
} from '@kepler.gl/types';
import {LAYER_VIS_CONFIGS} from '@kepler.gl/constants';
import {KeplerTable} from '../../utils';

export type PointLayerVisConfigSettings = {
  radius: VisConfigNumber;
  fixedRadius: VisConfigBoolean;
  opacity: VisConfigNumber;
  outline: VisConfigBoolean;
  thickness: VisConfigNumber;
  strokeColor: VisConfigColorSelect;
  colorRange: VisConfigColorRange;
  strokeColorRange: VisConfigColorRange;
  radiusRange: VisConfigRange;
  filled: VisConfigBoolean;
};

export type PointLayerColumnsConfig = {
  lat: LayerColumn;
  lng: LayerColumn;
  altitude: LayerColumn;
};

export type PointLayerVisConfig = {
  radius: number;
  fixedRadius: boolean;
  opacity: number;
  outline: boolean;
  thickness: number;
  strokeColor: RGBColor;
  colorRange: ColorRange;
  strokeColorRange: ColorRange;
  radiusRange: [number, number];
  filled: boolean;
};
export type PointLayerVisualChannelConfig = LayerColorConfig &
  LayerSizeConfig &
  LayerStrokeColorConfig;
export type PointLayerConfig = Merge<
  LayerBaseConfig,
  {columns: PointLayerColumnsConfig; visConfig: PointLayerVisConfig}
> &
  PointLayerVisualChannelConfig;

export type PointLayerData = {
  position: number[];
  index: number;
};

export const pointPosAccessor = ({lat, lng, altitude}: PointLayerColumnsConfig) => dc => d => [
  dc.valueAt(d.index, lng.fieldIdx),
  dc.valueAt(d.index, lat.fieldIdx),
  altitude && altitude.fieldIdx > -1 ? dc.valueAt(d.index, altitude.fieldIdx) : 0
];

export const pointRequiredColumns: ['lat', 'lng'] = ['lat', 'lng'];
export const pointOptionalColumns: ['altitude'] = ['altitude'];

const brushingExtension = new BrushingExtension();

export const pointVisConfigs: {
  radius: 'radius';
  fixedRadius: 'fixedRadius';
  opacity: 'opacity';
  outline: 'outline';
  thickness: 'thickness';
  strokeColor: 'strokeColor';
  colorRange: 'colorRange';
  strokeColorRange: 'strokeColorRange';
  radiusRange: 'radiusRange';
  filled: VisConfigBoolean;
} = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  outline: 'outline',
  thickness: 'thickness',
  strokeColor: 'strokeColor',
  colorRange: 'colorRange',
  strokeColorRange: 'strokeColorRange',
  radiusRange: 'radiusRange',
  filled: {
    ...LAYER_VIS_CONFIGS.filled,
    type: 'boolean',
    label: 'layer.fillColor',
    defaultValue: true,
    property: 'filled'
  }
};

export default class PointLayer extends Layer {
  declare config: PointLayerConfig;
  declare visConfigSettings: PointLayerVisConfigSettings;
  constructor(props) {
    super(props);

    this.registerVisConfig(pointVisConfigs);
    this.getPositionAccessor = dataContainer =>
      pointPosAccessor(this.config.columns)(dataContainer);
  }

  get type(): 'point' {
    return 'point';
  }

  get isAggregated(): false {
    return false;
  }

  get layerIcon() {
    return PointLayerIcon;
  }
  get requiredLayerColumns() {
    return pointRequiredColumns;
  }

  get optionalColumns() {
    return pointOptionalColumns;
  }

  get columnPairs() {
    return this.defaultPointColumnPairs;
  }

  get noneLayerDataAffectingProps() {
    return [...super.noneLayerDataAffectingProps, 'radius'];
  }

  get visualChannels() {
    return {
      color: {
        ...super.visualChannels.color,
        accessor: 'getFillColor',
        condition: config => config.visConfig.filled,
        defaultValue: config => config.color
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
        ...super.visualChannels.size,
        property: 'radius',
        range: 'radiusRange',
        fixed: 'fixedRadius',
        channelScaleType: 'radius',
        accessor: 'getRadius',
        defaultValue: 1
      }
    };
  }

  setInitialLayerConfig(dataset) {
    const defaultColorField = findDefaultColorField(dataset);

    if (defaultColorField) {
      this.updateLayerConfig({
        // @ts-expect-error Remove this after updateLayerConfig converted into generic function
        colorField: defaultColorField
      });
      this.updateLayerVisualChannel(dataset, 'color');
    }

    return this;
  }

  static findDefaultLayerProps({fieldPairs = []}: KeplerTable) {
    const props: {
      label: string;
      color?: RGBColor;
      isVisible?: boolean;
      columns?: PointLayerColumnsConfig;
    }[] = [];

    // Make layer for each pair
    fieldPairs.forEach(pair => {
      const latField = pair.pair.lat;
      const lngField = pair.pair.lng;
      const layerName = pair.defaultName;

      const prop: {
        label: string;
        color?: RGBColor;
        isVisible?: boolean;
        columns?: PointLayerColumnsConfig;
      } = {
        label: layerName.length ? layerName : 'Point'
      };

      // default layer color for begintrip and dropoff point
      if (latField.value in DEFAULT_LAYER_COLOR) {
        prop.color = hexToRgb(DEFAULT_LAYER_COLOR[latField.value]);
      }

      // set the first layer to be visible
      if (props.length === 0) {
        prop.isVisible = true;
      }

      prop.columns = {
        lat: latField,
        lng: lngField,
        altitude: {value: null, fieldIdx: -1, optional: true}
      };

      props.push(prop);
    });

    return {props};
  }

  getDefaultLayerConfig(props = {}) {
    return {
      ...super.getDefaultLayerConfig(props),

      // add stroke color visual channel
      strokeColorField: null,
      strokeColorDomain: [0, 1],
      strokeColorScale: 'quantile'
    };
  }

  calculateDataAttribute({filteredIndex}: KeplerTable, getPosition) {
    const data: PointLayerData[] = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos = getPosition({index});

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite)) {
        data.push({
          position: pos,
          index
        });
      }
    }
    return data;
  }

  formatLayerData(datasets, oldLayerData) {
    if (this.config.dataId === null) {
      return {};
    }
    const {textLabel} = this.config;
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const {data, triggerChanged} = this.updateData(datasets, oldLayerData);
    const getPosition = this.getPositionAccessor(dataContainer);

    // get all distinct characters in the text labels
    const textLabels = formatTextLabelData({
      textLabel,
      triggerChanged,
      oldLayerData,
      data,
      dataContainer
    });

    const accessors = this.getAttributeAccessors({dataContainer});

    return {
      data,
      getPosition,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      textLabels,
      ...accessors
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(dataContainer) {
    const getPosition = this.getPositionAccessor(dataContainer);
    const bounds = this.getPointsBounds(dataContainer, getPosition);
    this.updateMeta({bounds});
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, mapState, interactionConfig} = opts;

    // if no field size is defined we need to pass fixed radius = false
    const fixedRadius = this.config.visConfig.fixedRadius && Boolean(this.config.sizeField);
    const radiusScale = this.getRadiusScaleByZoom(mapState, fixedRadius);

    const layerProps = {
      stroked: this.config.visConfig.outline,
      filled: this.config.visConfig.filled,
      lineWidthScale: this.config.visConfig.thickness,
      radiusScale,
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      ...this.getVisualChannelUpdateTriggers()
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const brushingProps = this.getBrushingExtensionProps(interactionConfig);
    const getPixelOffset = getTextOffsetByRadius(radiusScale, data.getRadius, mapState);
    const extensions = [...defaultLayerProps.extensions, brushingExtension];

    const sharedProps = {
      getFilterValue: data.getFilterValue,
      extensions,
      filterRange: defaultLayerProps.filterRange,
      visible: defaultLayerProps.visible,
      ...brushingProps
    };
    const hoveredObject = this.hasHoveredObject(objectHovered);

    return [
      new ScatterplotLayer({
        ...defaultLayerProps,
        ...brushingProps,
        ...layerProps,
        ...data,
        parameters: {
          // circles will be flat on the map when the altitude column is not used
          depthTest: this.config.columns.altitude?.fieldIdx > -1
        },
        lineWidthUnits: 'pixels',
        updateTriggers,
        extensions
      }),
      // hover layer
      ...(hoveredObject
        ? [
            new ScatterplotLayer({
              ...this.getDefaultHoverLayerProps(),
              ...layerProps,
              data: [hoveredObject],
              getLineColor: this.config.highlightColor,
              getFillColor: this.config.highlightColor,
              getRadius: data.getRadius,
              getPosition: data.getPosition
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
