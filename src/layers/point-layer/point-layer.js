// Copyright (c) 2018 Uber Technologies, Inc.
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

import Layer from '../base-layer';
import memoize from 'lodash.memoize';
import {TextLayer} from 'deck.gl';
import ScatterplotBrushingLayer from 'deckgl-layers/scatterplot-brushing-layer/scatterplot-brushing-layer';
import {hexToRgb} from 'utils/color-utils';
import PointLayerIcon from './point-layer-icon';
import {DEFAULT_LAYER_COLOR} from 'constants/default-settings';

export const pointPosAccessor = ({lat, lng, altitude}) => d => [
  d.data[lng.fieldIdx],
  d.data[lat.fieldIdx],
  altitude && altitude.fieldIdx > -1 ? d.data[altitude.fieldIdx] : 0
];

export const pointPosResolver = ({lat, lng, altitude}) =>
  `${lat.fieldIdx}-${lng.fieldIdx}-${altitude ? altitude.fieldIdx : 'z'}`;
export const pointRequiredColumns = ['lat', 'lng'];
export const pointOptionalColumns = ['altitude'];

export const pointVisConfigs = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  outline: 'outline',
  thickness: 'thickness',
  colorRange: 'colorRange',
  radiusRange: 'radiusRange',
  'hi-precision': 'hi-precision'
};

export default class PointLayer extends Layer {
  constructor(props) {
    super(props);

    this.registerVisConfig(pointVisConfigs);
    this.getPosition = memoize(pointPosAccessor, pointPosResolver);
  }

  get type() {
    return 'point';
  }

  get isAggregated() {
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
      ...super.visualChannels,
      size: {
        ...super.visualChannels.size,
        range: 'radiusRange',
        property: 'radius',
        channelScaleType: 'radius'
      }
    };
  }

  static findDefaultLayerProps({fieldPairs = []}) {
    const props = [];

    // Make layer for each pair
    fieldPairs.forEach(pair => {
      // find fields for tableFieldIndex
      const latField = pair.pair.lat;
      const lngField = pair.pair.lng;
      const layerName = pair.defaultName;

      const prop = {
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

      // const newLayer = new KeplerGlLayers.PointLayer(prop);
      prop.columns = {
        lat: latField,
        lng: lngField,
        altitude: {value: null, fieldIdx: -1, optional: true}
      };

      props.push(prop);
    });

    return props;
  }

  formatLayerData(_, allData, filteredIndex, oldLayerData, opt = {}) {
    const {
      colorScale,
      colorDomain,
      colorField,
      color,
      columns,
      sizeField,
      sizeScale,
      sizeDomain,
      visConfig: {radiusRange, fixedRadius, colorRange}
    } = this.config;

    // point color
    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(hexToRgb)
      );

    // point radius
    const rScale =
      sizeField &&
      this.getVisChannelScale(sizeScale, sizeDomain, radiusRange, fixedRadius);

    const getPosition = this.getPosition(columns);

    if (!oldLayerData || oldLayerData.getPosition !== getPosition) {
      this.updateLayerMeta(allData, getPosition);
    }

    let data;
    if (
      oldLayerData &&
      oldLayerData.data &&
      opt.sameData &&
      oldLayerData.getPosition === getPosition
    ) {
      data = oldLayerData.data;
    } else {
      data = filteredIndex.reduce((accu, index) => {
        const pos = getPosition({data: allData[index]});

        // if doesn't have point lat or lng, do not add the point
        // deck.gl can't handle position = null
        if (!pos.every(Number.isFinite)) {
          return accu;
        }

        accu.push({
          data: allData[index]
        });

        return accu;
      }, []);
    }

    const getRadius = rScale ? d =>
      this.getEncodedChannelValue(rScale, d.data, sizeField) : 1;

    const getColor = cScale ? d =>
      this.getEncodedChannelValue(cScale, d.data, colorField) : color;

    return {
      data,
      getPosition,
      getColor,
      getRadius
    };
  }

  updateLayerMeta(allData, getPosition) {
    const bounds = this.getPointsBounds(allData, d => getPosition({data: d}));
    this.updateMeta({bounds});
  }

  renderLayer({
    data,
    idx,
    layerInteraction,
    objectHovered,
    mapState,
    interactionConfig
  }) {
    const enableBrushing = interactionConfig.brush.enabled;

    const layerProps = {
      outline: this.config.visConfig.outline,
      radiusMinPixels: 1,
      fp64: this.config.visConfig['hi-precision'],
      strokeWidth: this.config.visConfig.thickness,
      radiusScale: this.getRadiusScaleByZoom(mapState),
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    const interaction = {
      autoHighlight: !enableBrushing,
      enableBrushing,
      brushRadius: interactionConfig.brush.config.size * 1000,
      highlightColor: this.config.highlightColor
    };

    return [
      new ScatterplotBrushingLayer({
        ...layerProps,
        ...layerInteraction,
        ...data,
        ...interaction,
        idx,
        id: this.id,
        opacity: this.config.visConfig.opacity,
        pickable: true,
        parameters: {
          // circles will be flat on the map when the altitude column is not used
          depthTest: this.config.columns.altitude.fieldIdx > -1
        },

        updateTriggers: {
          getRadius: {
            sizeField: this.config.sizeField,
            radiusRange: this.config.visConfig.radiusRange,
            fixedRadius: this.config.visConfig.fixedRadius,
            sizeScale: this.config.sizeScale
          },
          getColor: {
            color: this.config.color,
            colorField: this.config.colorField,
            colorRange: this.config.visConfig.colorRange,
            colorScale: this.config.colorScale
          }
        }
      }),
      // text label layer
      ...(this.config.textLabel.field
        ? [
            new TextLayer({
              id: `${this.id}-label`,
              data: data.data,
              getPosition: data.getPosition,
              getPixelOffset: this.config.textLabel.offset,
              getSize: this.config.textLabel.size,
              getTextAnchor: this.config.textLabel.anchor,
              getText: d => String(d.data[this.config.textLabel.field.tableFieldIndex - 1]),
              getColor: d => this.config.textLabel.color,
              fp64: this.config.visConfig['hi-precision'],
              parameters: {
                // text will always show on top of all layers
                depthTest: false
              },
              updateTriggers: {
                getPosition: data.getPosition,
                getPixelOffset: this.config.textLabel.offset,
                getText: this.config.textLabel.field,
                getTextAnchor: this.config.textLabel.anchor,
                getSize: this.config.textLabel.size,
                getColor: this.config.textLabel.color
              }
            })
          ]
        : [])
    ];
  }
}
