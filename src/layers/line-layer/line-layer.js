// Copyright (c) 2021 Uber Technologies, Inc.
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

import LineLayerIcon from './line-layer-icon';
import ArcLayer from '../arc-layer/arc-layer';
import EnhancedLineLayer from 'deckgl-layers/line-layer/line-layer';

export default class LineLayer extends ArcLayer {
  get type() {
    return 'line';
  }

  get layerIcon() {
    return LineLayerIcon;
  }

  get visualChannels() {
    const visualChannels = super.visualChannels;
    return {
      ...visualChannels,
      sourceColor: {
        ...visualChannels.sourceColor,
        accessor: 'getColor'
      }
    };
  }

  static findDefaultLayerProps({fieldPairs = []}) {
    if (fieldPairs.length < 2) {
      return {props: []};
    }
    const props = {};

    // connect the first two point layer with arc
    props.columns = {
      lat0: fieldPairs[0].pair.lat,
      lng0: fieldPairs[0].pair.lng,
      lat1: fieldPairs[1].pair.lat,
      lng1: fieldPairs[1].pair.lng
    };
    props.label = `${fieldPairs[0].defaultName} -> ${fieldPairs[1].defaultName} line`;

    return {props: [props]};
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, interactionConfig} = opts;

    const layerProps = {
      widthScale: this.config.visConfig.thickness
    };

    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      ...this.getVisualChannelUpdateTriggers()
    };
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const hoveredObject = this.hasHoveredObject(objectHovered);

    return [
      // base layer
      new EnhancedLineLayer({
        ...defaultLayerProps,
        ...this.getBrushingExtensionProps(interactionConfig, 'source_target'),
        ...data,
        ...layerProps,
        updateTriggers,
        extensions: [...defaultLayerProps.extensions, new BrushingExtension()]
      }),
      // hover layer
      ...(hoveredObject
        ? [
            new EnhancedLineLayer({
              ...this.getDefaultHoverLayerProps(),
              ...layerProps,
              data: [hoveredObject],
              getColor: this.config.highlightColor,
              getTargetColor: this.config.highlightColor,
              getWidth: data.getWidth
            })
          ]
        : [])
    ];
  }
}
