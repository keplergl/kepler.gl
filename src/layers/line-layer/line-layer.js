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

import {LAYER_VIS_CONFIGS} from 'layers/layer-factory';
import LineLayerIcon from './line-layer-icon';
import ArcLayer from '../arc-layer/arc-layer';
import EnhancedLineLayer from 'deckgl-layers/line-layer/line-layer';

export const linePosAccessor = ({lat0, lng0, lat1, lng1, alt0, alt1}) => dc => d => [
  dc.valueAt(d.index, lng0.fieldIdx),
  dc.valueAt(d.index, lat0.fieldIdx),
  alt0?.fieldIdx > -1 ? dc.valueAt(d.index, alt0.fieldIdx) : 0,
  dc.valueAt(d.index, lng1.fieldIdx),
  dc.valueAt(d.index, lat1.fieldIdx),
  alt1?.fieldIdx > -1 ? dc.valueAt(d.index, alt1.fieldIdx) : 0
];

export const lineRequiredColumns = ['lat0', 'lng0', 'lat1', 'lng1'];
export const lineOptionalColumns = ['alt0', 'alt1'];

export const lineColumnLabels = {
  lat0: 'arc.lat0',
  lng0: 'arc.lng0',
  lat1: 'arc.lat1',
  lng1: 'arc.lng1',
  alt0: 'line.alt0',
  alt1: 'line.alt1'
};

export const lineVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor',
  elevationScale: {
    ...LAYER_VIS_CONFIGS.elevationScale,
    defaultValue: 1
  }
};

export default class LineLayer extends ArcLayer {
  constructor(props) {
    super(props);

    this.registerVisConfig(lineVisConfigs);
    this.getPositionAccessor = dataContainer => linePosAccessor(this.config.columns)(dataContainer);
  }

  get type() {
    return 'line';
  }

  get layerIcon() {
    return LineLayerIcon;
  }

  get requiredLayerColumns() {
    return lineRequiredColumns;
  }

  get optionalColumns() {
    return lineOptionalColumns;
  }

  get columnLabels() {
    return lineColumnLabels;
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

    // connect the first two point layer with line
    props.columns = {
      lat0: fieldPairs[0].pair.lat,
      lng0: fieldPairs[0].pair.lng,
      alt0: {value: null, fieldIdx: -1, optional: true},
      lat1: fieldPairs[1].pair.lat,
      lng1: fieldPairs[1].pair.lng,
      alt1: {value: null, fieldIdx: -1, optional: true}
    };
    props.label = `${fieldPairs[0].defaultName} -> ${fieldPairs[1].defaultName} line`;

    return {props: [props]};
  }

  renderLayer(opts) {
    const {data, gpuFilter, objectHovered, interactionConfig} = opts;

    const layerProps = {
      widthScale: this.config.visConfig.thickness,
      elevationScale: this.config.visConfig.elevationScale
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
