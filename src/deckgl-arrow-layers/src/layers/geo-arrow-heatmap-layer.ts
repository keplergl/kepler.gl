// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Adapted from @geoarrow/deck.gl-geoarrow (https://github.com/geoarrow/deck.gl-geoarrow)
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {
  CompositeLayer,
  CompositeLayerProps,
  DefaultProps,
  Layer,
  LayersList
} from '@deck.gl/core';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import type {HeatmapLayerProps} from '@deck.gl/aggregation-layers';
import * as arrow from 'apache-arrow';
import * as ga from '@geoarrow/geoarrow-js';

import {GEOARROW_EXTENSIONS} from '@kepler.gl/constants';

import {
  assignAccessor,
  extractAccessorsFromProps,
  getGeometryVector
} from '../utils/utils';
import {computeChunkOffsets} from '../utils/picking';
import {FloatAccessor, ExtensionProps} from '../types';
import {assert} from '../utils/utils';
import {validateAccessors} from '../utils/validate';

/** All properties supported by GeoArrowHeatmapLayer */
export type GeoArrowHeatmapLayerProps = Omit<
  HeatmapLayerProps<arrow.Table>,
  'data' | 'getPosition' | 'getWeight'
> &
  _GeoArrowHeatmapLayerProps &
  CompositeLayerProps;

/** Properties added by GeoArrowHeatmapLayer */
type _GeoArrowHeatmapLayerProps = {
  data: arrow.Table;

  /**
   * If `true`, validate the arrays provided (e.g. chunk lengths)
   * @default true
   */
  _validate?: boolean;
  /**
   * Center position accessor.
   */
  getPosition?: ga.vector.PointVector;
  /**
   * Weight accessor.
   * @default 1
   */
  getWeight?: FloatAccessor;
};

// Remove data and getPosition from the upstream default props
const {
  data: _data,
  getPosition: _getPosition,
  ..._defaultProps
} = HeatmapLayer.defaultProps;

// Default props added by us
const ourDefaultProps = {
  _validate: true
};

// @ts-expect-error
const defaultProps: DefaultProps<GeoArrowHeatmapLayerProps> = {
  ..._defaultProps,
  ...ourDefaultProps
};

export class GeoArrowHeatmapLayer<ExtraProps extends object = object> extends CompositeLayer<
  GeoArrowHeatmapLayerProps & ExtraProps
> {
  static defaultProps = defaultProps;
  static layerName = 'GeoArrowHeatmapLayer';

  renderLayers(): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props.getPosition !== undefined) {
      const geometryColumn = this.props.getPosition;
      if (geometryColumn !== undefined && ga.vector.isPointVector(geometryColumn)) {
        return this._renderLayersPoint(geometryColumn);
      }

      throw new Error('getPosition should pass in an arrow Vector of Point type');
    } else {
      const pointVector = getGeometryVector(table, GEOARROW_EXTENSIONS.POINT);
      if (pointVector !== null) {
        return this._renderLayersPoint(pointVector);
      }
    }

    throw new Error('getPosition not GeoArrow point');
  }

  _renderLayersPoint(geometryColumn: ga.vector.PointVector): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props._validate) {
      assert(ga.vector.isPointVector(geometryColumn));
      validateAccessors(this.props, table);
    }

    const [accessors, otherProps] = extractAccessorsFromProps(this.props, ['getPosition']);
    const tableOffsets = computeChunkOffsets(table.data);

    const layers: HeatmapLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const geometryData = geometryColumn.data[recordBatchIdx];
      const flatCoordsData = ga.child.getPointChild(geometryData);
      const flatCoordinateArray = flatCoordsData.values;

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = geometryColumn._offsets[recordBatchIdx];

      const props: HeatmapLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-heatmap-${recordBatchIdx}`,
        data: {
          // @ts-expect-error
          data: table.batches[recordBatchIdx],
          length: geometryData.length,
          attributes: {
            getPosition: {
              value: flatCoordinateArray,
              size: geometryData.type.listSize
            }
          }
        }
      };

      for (const [propName, propInput] of Object.entries(accessors)) {
        assignAccessor({
          props,
          propName,
          propInput,
          chunkIdx: recordBatchIdx,
          batchOffset
        });
      }

      const layer = new HeatmapLayer({
        ...this.getSubLayerProps(props),
        getFiltered: props.getFiltered,
        getFilterValue: props.getFilterValue
      });
      layers.push(layer);
    }

    return layers;
  }
}
