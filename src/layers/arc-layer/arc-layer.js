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

import Layer from '../base-layer';
import {BrushingExtension} from '@deck.gl/extensions';
import {ArcLayer as DeckArcLayer} from '@deck.gl/layers';

import {hexToRgb} from 'utils/color-utils';
import ArcLayerIcon from './arc-layer-icon';
import {DEFAULT_LAYER_COLOR} from 'constants/default-settings';

export const arcPosAccessor = ({lat0, lng0, lat1, lng1}) => d => [
  d.data[lng0.fieldIdx],
  d.data[lat0.fieldIdx],
  0,
  d.data[lng1.fieldIdx],
  d.data[lat1.fieldIdx],
  0
];

export const arcRequiredColumns = ['lat0', 'lng0', 'lat1', 'lng1'];
export const arcColumnLabels = {
  lat0: 'arc.lat0',
  lng0: 'arc.lng0',
  lat1: 'arc.lat1',
  lng1: 'arc.lng1'
};

export const arcVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor'
};

export default class ArcLayer extends Layer {
  constructor(props) {
    super(props);

    this.registerVisConfig(arcVisConfigs);
    this.getPositionAccessor = () => arcPosAccessor(this.config.columns);
  }

  get type() {
    return 'arc';
  }

  get isAggregated() {
    return false;
  }

  get layerIcon() {
    return ArcLayerIcon;
  }

  get requiredLayerColumns() {
    return arcRequiredColumns;
  }

  get columnLabels() {
    return arcColumnLabels;
  }
  get columnPairs() {
    return this.defaultLinkColumnPairs;
  }

  get visualChannels() {
    return {
      ...super.visualChannels,
      size: {
        ...super.visualChannels.size,
        property: 'stroke'
      }
    };
  }

  static findDefaultLayerProps({fieldPairs = []}) {
    if (fieldPairs.length < 2) {
      return {props: []};
    }

    const props = {
      color: hexToRgb(DEFAULT_LAYER_COLOR.tripArc)
    };

    // connect the first two point layer with arc
    props.columns = {
      lat0: fieldPairs[0].pair.lat,
      lng0: fieldPairs[0].pair.lng,
      lat1: fieldPairs[1].pair.lat,
      lng1: fieldPairs[1].pair.lng
    };
    props.label = `${fieldPairs[0].defaultName} -> ${fieldPairs[1].defaultName} arc`;

    return {props: [props]};
  }

  calculateDataAttribute({allData, filteredIndex}, getPosition) {
    const data = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      // data = filteredIndex.reduce((accu, index) => {
      const index = filteredIndex[i];
      const pos = getPosition({data: allData[index]});

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite)) {
        data.push({
          index,
          sourcePosition: [pos[0], pos[1], pos[2]],
          targetPosition: [pos[3], pos[4], pos[5]],
          data: allData[index]
        });
      }
    }

    return data;
  }

  // TODO: fix complexity
  /* eslint-disable complexity */
  formatLayerData(datasets, oldLayerData, opt = {}) {
    const {
      colorScale,
      colorDomain,
      colorField,
      color,
      sizeField,
      sizeScale,
      sizeDomain,
      visConfig: {sizeRange, colorRange, targetColor}
    } = this.config;

    const {gpuFilter} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);

    // arc color
    const cScale =
      colorField &&
      this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(hexToRgb));

    // arc thickness
    const sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

    const getStrokeWidth = sScale
      ? d => this.getEncodedChannelValue(sScale, d.data, sizeField, 0)
      : 1;

    const getSourceColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : color;

    const getTargetColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : targetColor || color;

    return {
      data,
      getSourceColor,
      getTargetColor,
      getWidth: getStrokeWidth,
      getFilterValue: gpuFilter.filterValueAccessor()
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(allData) {
    // get bounds from arcs
    const getPosition = this.getPositionAccessor();

    const sBounds = this.getPointsBounds(allData, d => {
      const pos = getPosition({data: d});
      return [pos[0], pos[1]];
    });
    const tBounds = this.getPointsBounds(allData, d => {
      const pos = getPosition({data: d});
      return [pos[3], pos[4]];
    });

    const bounds =
      tBounds && sBounds
        ? [
            Math.min(sBounds[0], tBounds[0]),
            Math.min(sBounds[1], tBounds[1]),
            Math.max(sBounds[2], tBounds[2]),
            Math.max(sBounds[3], tBounds[3])
          ]
        : sBounds || tBounds;

    this.updateMeta({bounds});
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, interactionConfig} = opts;

    const colorUpdateTriggers = {
      color: this.config.color,
      colorField: this.config.colorField,
      colorRange: this.config.visConfig.colorRange,
      colorScale: this.config.colorScale,
      targetColor: this.config.visConfig.targetColor
    };

    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);

    return [
      new DeckArcLayer({
        ...defaultLayerProps,
        ...this.getBrushingExtensionProps(interactionConfig, 'source_target'),
        ...data,
        widthScale: this.config.visConfig.thickness,
        updateTriggers: {
          getFilterValue: gpuFilter.filterValueUpdateTriggers,
          getWidth: {
            sizeField: this.config.sizeField,
            sizeScale: this.config.sizeScale,
            sizeRange: this.config.visConfig.sizeRange
          },
          getSourceColor: colorUpdateTriggers,
          getTargetColor: colorUpdateTriggers
        },
        extensions: [...defaultLayerProps.extensions, new BrushingExtension()]
      }),
      // hover layer
      ...(this.isLayerHovered(objectHovered)
        ? [
            new DeckArcLayer({
              ...this.getDefaultHoverLayerProps(),
              data: [objectHovered.object],
              widthScale: this.config.visConfig.thickness,
              getSourceColor: this.config.highlightColor,
              getTargetColor: this.config.highlightColor,
              getWidth: data.getWidth
            })
          ]
        : [])
    ];
  }
}
