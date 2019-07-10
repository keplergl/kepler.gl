// Copyright (c) 2019 Uber Technologies, Inc.
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

import memoize from 'lodash.memoize';

import Layer from '../base-layer';
import ArcBrushingLayer from 'deckgl-layers/arc-brushing-layer/arc-brushing-layer';
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

export const arcPosResolver = ({lat0, lng0, lat1, lng1}) =>
  `${lat0.fieldIdx}-${lng0.fieldIdx}-${lat1.fieldIdx}-${lat1.fieldIdx}}`;

export const arcRequiredColumns = ['lat0', 'lng0', 'lat1', 'lng1'];

export const arctVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor'
};

export default class ArcLayer extends Layer {
  constructor(props) {
    super(props);
    this.registerVisConfig(arctVisConfigs);
    this.getPosition = memoize(arcPosAccessor, arcPosResolver);
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

  static findDefaultLayerProps({fieldPairs = []}, foundLayers) {
    if (fieldPairs.length < 2) {
      return [];
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

    return {props, foundLayers};
  }

  // TODO: fix complexity
  /* eslint-disable complexity */
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
      visConfig: {sizeRange, colorRange, targetColor}
    } = this.config;

    // arc color
    const cScale =
      colorField &&
      this.getVisChannelScale(
        colorScale,
        colorDomain,
        colorRange.colors.map(hexToRgb)
      );

    // arc thickness
    const sScale =
      sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

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

        // if doesn't have point lat or lng, do not add the arc
        // deck.gl can't handle position == null
        if (!pos.every(Number.isFinite)) {
          return accu;
        }

        accu.push({
          index,
          sourcePosition: [pos[0], pos[1], pos[2]],
          targetPosition: [pos[3], pos[4], pos[5]],
          data: allData[index]
        });

        return accu;
      }, []);
    }

    const getStrokeWidth = sScale
      ? d => this.getEncodedChannelValue(sScale, d.data, sizeField, 0)
      : 1;

    const getColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : color;

    const getTargetColor = cScale
      ? d => this.getEncodedChannelValue(cScale, d.data, colorField)
      : targetColor || color;

    return {
      data,
      getColor,
      getSourceColor: getColor,
      getTargetColor,
      getWidth: getStrokeWidth
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(allData, getPosition) {
    // get bounds from arcs
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

  renderLayer({
    data,
    idx,
    objectHovered,
    layerInteraction,
    mapState,
    interactionConfig
  }) {
    const {brush} = interactionConfig;

    const colorUpdateTriggers = {
      color: this.config.color,
      colorField: this.config.colorField,
      colorRange: this.config.visConfig.colorRange,
      colorScale: this.config.colorScale,
      targetColor: this.config.visConfig.targetColor
    };

    const interaction = {
      // auto highlighting
      pickable: true,
      autoHighlight: !brush.enabled,
      highlightColor: this.config.highlightColor,

      // brushing
      brushRadius: brush.config.size * 1000,
      brushSource: true,
      brushTarget: true,
      enableBrushing: brush.enabled
    };

    return [
      new ArcBrushingLayer({
        ...data,
        ...interaction,
        ...layerInteraction,
        id: this.id,
        idx,
        opacity: this.config.visConfig.opacity,
        pickedColor: this.config.highlightColor,
        strokeScale: this.config.visConfig.thickness,

        // parameters
        parameters: {depthTest: mapState.dragRotate},

        updateTriggers: {
          getWidth: {
            sizeField: this.config.sizeField,
            sizeRange: this.config.visConfig.sizeRange
          },
          getSourceColor: colorUpdateTriggers,
          getTargetColor: colorUpdateTriggers
        }
      }),
      // hover layer
      ...(this.isLayerHovered(objectHovered)
        ? [
            new ArcBrushingLayer({
              id: `${this.id}-hovered`,
              data: [objectHovered.object],
              strokeScale: this.config.visConfig.thickness,
              getSourceColor: this.config.highlightColor,
              getTargetColor: this.config.highlightColor,
              getWidth: data.getWidth,
              pickable: false
            })
          ]
        : [])
    ];
  }
}
