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

import Layer, {
  LayerColumn,
  LayerBaseConfig,
  LayerColorConfig,
  LayerSizeConfig,
  LayerBounds
} from '../base-layer';
import {BrushingExtension} from '@deck.gl/extensions';
import {ArcLayer as DeckArcLayer} from '@deck.gl/layers';

import {hexToRgb} from '../../utils/color-utils';
import ArcLayerIcon from './arc-layer-icon';
import {DEFAULT_LAYER_COLOR} from '../../constants/default-settings';
import {DataContainerInterface} from '../../utils/table-utils/data-container-interface';
import {RGBColor, Merge} from '../../reducers';

import {
  VisConfigColorRange,
  VisConfigColorSelect,
  VisConfigNumber,
  VisConfigRange
} from '../layer-factory';
import {ColorRange} from '../../constants/color-ranges';

export type ArcLayerVisConfigSettings = {
  opacity: VisConfigNumber;
  thickness: VisConfigNumber;
  colorRange: VisConfigColorRange;
  sizeRange: VisConfigRange;
  targetColor: VisConfigColorSelect;
};

export type ArcLayerColumnsConfig = {
  lat0: LayerColumn;
  lat1: LayerColumn;
  lng0: LayerColumn;
  lng1: LayerColumn;
};

export type ArcLayerVisConfig = {
  colorRange: ColorRange;
  opacity: number;
  sizeRange: [number, number];
  targetColor: RGBColor;
  thickness: number;
};

export type ArcLayerVisualChannelConfig = LayerColorConfig & LayerSizeConfig;
export type ArcLayerConfig = Merge<
  LayerBaseConfig,
  {columns: ArcLayerColumnsConfig; visConfig: ArcLayerVisConfig}
> &
  ArcLayerVisualChannelConfig;

export type ArcLayerData = {
  index: number;
  sourcePosition: [number, number, number];
  targetPosition: [number, number, number];
};

export type ArcLayerMeta = {
  bounds: LayerBounds;
};
export const arcPosAccessor = ({lat0, lng0, lat1, lng1}: ArcLayerColumnsConfig) => (
  dc: DataContainerInterface
) => d => [
  dc.valueAt(d.index, lng0.fieldIdx),
  dc.valueAt(d.index, lat0.fieldIdx),
  0,
  dc.valueAt(d.index, lng1.fieldIdx),
  dc.valueAt(d.index, lat1.fieldIdx),
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
  declare visConfigSettings: ArcLayerVisConfigSettings;
  declare config: ArcLayerConfig;
  declare meta: ArcLayerMeta;

  constructor(props) {
    super(props);

    this.registerVisConfig(arcVisConfigs);
    this.getPositionAccessor = dataContainer => arcPosAccessor(this.config.columns)(dataContainer);
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
      sourceColor: {
        ...super.visualChannels.color,
        property: 'color',
        key: 'sourceColor',
        accessor: 'getSourceColor',
        defaultValue: config => config.color
      },
      targetColor: {
        ...super.visualChannels.color,
        property: 'targetColor',
        key: 'targetColor',
        accessor: 'getTargetColor',
        defaultValue: config => config.visConfig.targetColor || config.color
      },
      size: {
        ...super.visualChannels.size,
        accessor: 'getWidth',
        property: 'stroke'
      }
    };
  }

  static findDefaultLayerProps({fieldPairs = []}) {
    if (fieldPairs.length < 2) {
      return {props: []};
    }

    const props: {color: RGBColor; columns: ArcLayerColumnsConfig; label: string} = {
      color: hexToRgb(DEFAULT_LAYER_COLOR.tripArc),
      // connect the first two point layer with arc
      columns: {
        lat0: fieldPairs[0].pair.lat,
        lng0: fieldPairs[0].pair.lng,
        lat1: fieldPairs[1].pair.lat,
        lng1: fieldPairs[1].pair.lng
      },
      label: `${fieldPairs[0].defaultName} -> ${fieldPairs[1].defaultName} arc`
    };

    return {props: [props]};
  }

  calculateDataAttribute({dataContainer, filteredIndex}, getPosition) {
    const data: ArcLayerData[] = [];
    for (let i = 0; i < filteredIndex.length; i++) {
      const index = filteredIndex[i];
      const pos = getPosition({index});

      // if doesn't have point lat or lng, do not add the point
      // deck.gl can't handle position = null
      if (pos.every(Number.isFinite)) {
        data.push({
          index,
          sourcePosition: [pos[0], pos[1], pos[2]],
          targetPosition: [pos[3], pos[4], pos[5]]
        });
      }
    }

    return data;
  }

  formatLayerData(datasets, oldLayerData) {
    const {gpuFilter, dataContainer} = datasets[this.config.dataId];
    const {data} = this.updateData(datasets, oldLayerData);
    const accessors = this.getAttributeAccessors({dataContainer});
    return {
      data,
      getFilterValue: gpuFilter.filterValueAccessor(dataContainer)(),
      ...accessors
    };
  }
  /* eslint-enable complexity */

  updateLayerMeta(dataContainer) {
    // get bounds from arcs
    const getPosition = this.getPositionAccessor(dataContainer);

    const sBounds = this.getPointsBounds(dataContainer, (d, i) => {
      const pos = getPosition(d);
      return [pos[0], pos[1]];
    });
    const tBounds = this.getPointsBounds(dataContainer, (d, i) => {
      const pos = getPosition(d);
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
    const updateTriggers = {
      getPosition: this.config.columns,
      getFilterValue: gpuFilter.filterValueUpdateTriggers,
      ...this.getVisualChannelUpdateTriggers()
    };
    const defaultLayerProps = this.getDefaultDeckLayerProps(opts);
    const hoveredObject = this.hasHoveredObject(objectHovered);
    return [
      new DeckArcLayer({
        ...defaultLayerProps,
        ...this.getBrushingExtensionProps(interactionConfig, 'source_target'),
        ...data,
        widthScale: this.config.visConfig.thickness,
        updateTriggers,
        extensions: [...defaultLayerProps.extensions, new BrushingExtension()]
      }),
      // hover layer
      ...(hoveredObject
        ? [
            new DeckArcLayer({
              ...this.getDefaultHoverLayerProps(),
              data: [hoveredObject],
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
