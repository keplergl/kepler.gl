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

import ArcLayer from '../arc-layer/arc-layer';
import DeckGLLineLayer from '../../deckgl-layers/line-layer/line-layer';

export default class LineLayer extends ArcLayer {
  get type() {
    return 'line';
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
      colorScale: this.config.colorScale
    };

    return [
      // base layer
      new DeckGLLineLayer({
        ...layerInteraction,
        ...data,
        getColor: data.getSourceColor,
        id: this.id,
        idx,
        brushRadius: brush.config.size * 1000,
        brushSource: true,
        brushTarget: true,
        enableBrushing: brush.enabled,
        fp64: this.config.visConfig['hi-precision'],
        opacity: this.config.visConfig.opacity,
        pickable: true,
        pickedColor: this.config.highlightColor,
        strokeScale: this.config.visConfig.thickness,
        updateTriggers: {
          getStrokeWidth: {
            sizeField: this.config.sizeField,
            sizeRange: this.config.visConfig.sizeRange
          },
          getColor: colorUpdateTriggers
        }
      })
    ];
  }
}
