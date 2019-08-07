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

import ArcLayer from '../arc-layer/arc-layer';
import DeckGLLineLayer from 'deckgl-layers/line-layer/line-layer';
import LineLayerIcon from './line-layer-icon';

export default class LineLayer extends ArcLayer {
  get type() {
    return 'line';
  }

  get layerIcon() {
    return LineLayerIcon;
  }

  static findDefaultLayerProps({fieldPairs}, foundLayers) {
    if (fieldPairs.length < 2) {
      return [];
    }
    const props = {};

    // connect the first two point layer with arc
    props.columns = {
      lat0: fieldPairs[0].pair.lat,
      lng0: fieldPairs[0].pair.lng,
      lat1: fieldPairs[1].pair.lat,
      lng1: fieldPairs[1].pair.lng
    };
    props.label = `${fieldPairs[0].defaultName} -> ${
      fieldPairs[1].defaultName
    } line`;

    return {props, foundLayers};
  }

  renderLayer({
    data,
    idx,
    layerInteraction,
    objectHovered,
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
      // base layer
      new DeckGLLineLayer({
        ...layerInteraction,
        ...data,
        ...interaction,
        getColor: data.getSourceColor,
        id: this.id,
        idx,
        opacity: this.config.visConfig.opacity,
        strokeScale: this.config.visConfig.thickness,
        // parameters
        parameters: {depthTest: mapState.dragRotate},
        updateTriggers: {
          getWidth: {
            sizeField: this.config.sizeField,
            sizeRange: this.config.visConfig.sizeRange
          },
          getColor: colorUpdateTriggers,
          getTargetColor: colorUpdateTriggers
        }
      }),
      // hover layer
      ...(this.isLayerHovered(objectHovered)
        ? [
            new DeckGLLineLayer({
              id: `${this.id}-hovered`,
              data: [objectHovered.object],
              strokeScale: this.config.visConfig.thickness,
              getColor: this.config.highlightColor,
              getTargetColor: this.config.highlightColor,
              getWidth: data.getWidth,
              pickable: false
            })
          ]
        : [])
    ];
  }
}
