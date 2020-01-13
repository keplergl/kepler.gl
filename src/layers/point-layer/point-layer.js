// Copyright (c) 2020 Uber Technologies, Inc.
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

import uniq from 'lodash.uniq';
import {BrushingExtension} from 'extensions/brushing';
import {ScatterplotLayer, TextLayer} from '@deck.gl/layers';
import {getDistanceScales} from 'viewport-mercator-project';

import Layer from '../base-layer';
import {hexToRgb} from 'utils/color-utils';
import PointLayerIcon from './point-layer-icon';
import {DEFAULT_LAYER_COLOR, CHANNEL_SCALES} from 'constants/default-settings';
import {notNullorUndefined} from 'utils/data-utils';

export const pointPosAccessor = ({lat, lng, altitude}) => d => [
  // lng
  d.data[lng.fieldIdx],
  // lat
  d.data[lat.fieldIdx],
  altitude && altitude.fieldIdx > -1 ? d.data[altitude.fieldIdx] : 0
];

export const pointLabelAccessor = textLabel => d => {
  const val = d.data[textLabel.field.tableFieldIndex - 1];
  return notNullorUndefined(val) ? String(val) : '';
};

export const pointRequiredColumns = ['lat', 'lng'];
export const pointOptionalColumns = ['altitude'];

const brushingExtension = new BrushingExtension();

export const pointVisConfigs = {
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
    type: 'boolean',
    label: 'Fill Color',
    defaultValue: true,
    property: 'filled'
  }
};

export default class PointLayer extends Layer {
  constructor(props) {
    super(props);

    this.registerVisConfig(pointVisConfigs);
    this.getPositionAccessor = () => pointPosAccessor(this.config.columns);
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
      color: {
        ...super.visualChannels.color,
        condition: config => config.visConfig.filled
      },
      strokeColor: {
        property: 'strokeColor',
        field: 'strokeColorField',
        scale: 'strokeColorScale',
        domain: 'strokeColorDomain',
        range: 'strokeColorRange',
        key: 'strokeColor',
        channelScaleType: CHANNEL_SCALES.color,
        condition: config => config.visConfig.outline
      },
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

  calculateDataAttribute({allData, filteredIndex}, getPosition) {
    const data = [];

    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos = getPosition({data: allData[index]});

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite)) {
        data.push({
          data: allData[index],
          position: pos,
          // index is important for filter
          index
        });
      }
    }
    return data;
  }

  getDataUpdateTriggers({filteredIndex}) {
    return {
      ...super.getDataUpdateTriggers({filteredIndex}),
      ...this.config.textLabel.reduce(
        (accu, tl, i) => ({
          ...accu,
          [`getLabelCharacterSet-${i}`]: tl.field ? tl.field.name : null
        }),
        {}
      )
    };
  }

  formatLayerData(datasets, oldLayerData) {
    const {
      colorScale,
      colorDomain,
      colorField,
      strokeColorField,
      strokeColorScale,
      strokeColorDomain,
      color,
      sizeField,
      sizeScale,
      sizeDomain,
      textLabel,
      visConfig: {
        radiusRange,
        fixedRadius,
        colorRange,
        strokeColorRange,
        strokeColor
      }
    } = this.config;

    const {gpuFilter} = datasets[this.config.dataId];
    const {data, triggerChanged} = this.updateData(
      datasets,
      oldLayerData
    );
    const getPosition = this.getPositionAccessor();
    // point color
    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(hexToRgb)
      );

    // stroke color
    const scScale =
      strokeColorField &&
      this.getVisChannelScale(
        strokeColorScale,
        strokeColorDomain,
        strokeColorRange.colors.map(hexToRgb)
      );

    // point radius
    const rScale =
      sizeField &&
      this.getVisChannelScale(sizeScale, sizeDomain, radiusRange, fixedRadius);

    const getRadius = rScale
      ? d => this.getEncodedChannelValue(rScale, d.data, sizeField, 0)
      : 1;

    const getFillColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : color;

    const getLineColor = scScale
      ? d => this.getEncodedChannelValue(scScale, d.data, strokeColorField)
      : strokeColor || color;

    // get all distinct characters in the text labels
    const textLabels = textLabel.map((tl, i) => {
      if (!tl.field) {
        // if no field selected,
        return {
          getText: null,
          characterSet: []
        };
      }

      const getText = pointLabelAccessor(tl);
      let characterSet;

      if (!triggerChanged[`getLabelCharacterSet-${i}`]) {
        characterSet = oldLayerData.textLabels[i].characterSet;
      } else {
        const allLabels = tl.field ? data.map(getText) : [];
        characterSet = uniq(allLabels.join(''));
      }

      return {
        characterSet,
        getText
      };
    });

    return {
      data,
      getPosition,
      getFillColor,
      getLineColor,
      getFilterValue: gpuFilter.filterValueAccessor(),
      getRadius,
      textLabels
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(allData) {
    const getPosition = this.getPositionAccessor();
    const bounds = this.getPointsBounds(allData, d => getPosition({data: d}));
    this.updateMeta({bounds});
  }

  getTextOffset(config, radiusScale, getRadius, mapState) {
    const distanceScale = getDistanceScales(mapState);
    const xMult =
      config.anchor === 'middle' ? 0 : config.anchor === 'start' ? 1 : -1;
    const yMult =
      config.alignment === 'center' ? 0 : config.alignment === 'bottom' ? 1 : -1;

    const sizeOffset =
      config.alignment === 'center'
        ? 0
        : config.alignment === 'bottom'
        ? config.size
        : config.size;

    const pixelRadius = radiusScale * distanceScale.pixelsPerMeter[0];
    const padding = 20;

    return typeof getRadius === 'function'
      ? d => [
          xMult * (getRadius(d) * pixelRadius + padding),
          yMult * (getRadius(d) * pixelRadius + padding + sizeOffset)
        ]
      : [
          xMult * (getRadius * pixelRadius + padding),
          yMult * (getRadius * pixelRadius + padding + sizeOffset)
        ];
  }

  renderLayer(opts) {
    const {
      data,
      gpuFilter,
      objectHovered,
      mapState,
      interactionConfig
    } = opts;

    const radiusScale = this.getRadiusScaleByZoom(mapState);

    const layerProps = {
      stroked: this.config.visConfig.outline,
      filled: this.config.visConfig.filled,
      // filterRange: gpuFilter.filterRange,
      lineWidthScale: this.config.visConfig.thickness,
      radiusScale,
      ...(this.config.visConfig.fixedRadius ? {} : {radiusMaxPixels: 500})
    };

    const {textLabel} = this.config;
    const updateTriggers = {
      getPosition: this.config.columns,
      getRadius: {
        sizeField: this.config.sizeField,
        radiusRange: this.config.visConfig.radiusRange,
        fixedRadius: this.config.visConfig.fixedRadius,
        sizeScale: this.config.sizeScale
      },
      getFillColor: {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: this.config.visConfig.colorRange,
        colorScale: this.config.colorScale
      },
      getLineColor: {
        color: this.config.visConfig.strokeColor,
        colorField: this.config.strokeColorField,
        colorRange: this.config.visConfig.strokeColorRange,
        colorScale: this.config.strokeColorScale
      },
      getFilterValue: gpuFilter.filterValueUpdateTriggers
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const brushingProps = this.getBrushingExtensionProps(interactionConfig);

    return [
      new ScatterplotLayer({
        ...defaultLayerProps,
        ...brushingProps,
        ...layerProps,
        ...data,
        parameters: {
          // circles will be flat on the map when the altitude column is not used
          depthTest: this.config.columns.altitude.fieldIdx > -1
        },
        updateTriggers,
        extensions: [...defaultLayerProps.extensions, brushingExtension]
      }),
      // hover layer
      ...(this.isLayerHovered(objectHovered)
        ? [
            new ScatterplotLayer({
              ...this.getDefaultHoverLayerProps(),
              ...layerProps,
              data: [objectHovered.object],
              getLineColor: this.config.highlightColor,
              getFillColor: this.config.highlightColor,
              getRadius: data.getRadius,
              getPosition: data.getPosition
            })
          ]
        : []),
      // text label layer
      ...data.textLabels.reduce((accu, d, i) => {
        if (d.getText) {
          accu.push(
            new TextLayer({
              ...brushingProps,
              id: `${this.id}-label-${textLabel[i].field.name}`,
              data: data.data,
              getPosition: data.getPosition,
              getText: d.getText,
              characterSet: d.characterSet,
              getPixelOffset: this.getTextOffset(
                textLabel[i],
                radiusScale,
                data.getRadius,
                mapState
              ),
              getSize: 1,
              sizeScale: textLabel[i].size,
              getTextAnchor: textLabel[i].anchor,
              getAlignmentBaseline: textLabel[i].alignment,
              getColor: textLabel[i].color,
              parameters: {
                // text will always show on top of all layers
                depthTest: false
              },

              getFilterValue: data.getFilterValue,
              extensions: [...defaultLayerProps.extensions, brushingExtension],
              filterRange: defaultLayerProps.filterRange,
              updateTriggers: {
                getPosition: this.config.columns,
                getText: textLabel[i].field.name,
                getPixelOffset: {
                  ...updateTriggers.getRadius,
                  mapState,
                  anchor: textLabel[i].anchor,
                  alignment: textLabel[i].alignment
                },
                getTextAnchor: textLabel[i].anchor,
                getAlignmentBaseline: textLabel[i].alignment,
                getColor: textLabel[i].color,
                getFilterValue: gpuFilter.filterValueUpdateTriggers
              }
            })
          );
        }
        return accu;
      }, [])
    ];
  }
}
