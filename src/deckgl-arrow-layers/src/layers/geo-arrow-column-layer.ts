// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Adapted from @geoarrow/deck.gl-geoarrow (https://github.com/geoarrow/deck.gl-geoarrow)
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {
  CompositeLayer,
  CompositeLayerProps,
  DefaultProps,
  GetPickingInfoParams,
  Layer,
  LayersList
} from '@deck.gl/core';
import {ColumnLayer} from '@deck.gl/layers';
import type {ColumnLayerProps} from '@deck.gl/layers';
import * as arrow from 'apache-arrow';
import * as ga from '@geoarrow/geoarrow-js';

import {GEOARROW_EXTENSIONS} from '@kepler.gl/constants';

import {
  assignAccessor,
  extractAccessorsFromProps,
  getGeometryVector
} from '../utils/utils';
import {GeoArrowExtraPickingProps, computeChunkOffsets, getPickingInfo} from '../utils/picking';
import {ColorAccessor, FloatAccessor, GeoArrowPickingInfo, ExtensionProps} from '../types';
import {assert} from '../utils/utils';
import {validateAccessors} from '../utils/validate';

/** All properties supported by GeoArrowColumnLayer */
export type GeoArrowColumnLayerProps = Omit<
  ColumnLayerProps<arrow.Table>,
  'data' | 'getPosition' | 'getFillColor' | 'getLineColor' | 'getElevation' | 'getLineWidth'
> &
  _GeoArrowColumnLayerProps &
  CompositeLayerProps;

/** Properties added by GeoArrowColumnLayer */
type _GeoArrowColumnLayerProps = {
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
   * Fill color accessor.
   * @default [0, 0, 0, 255]
   */
  getFillColor?: ColorAccessor;
  /**
   * Stroke color accessor.
   * @default [0, 0, 0, 255]
   */
  getLineColor?: ColorAccessor;
  /**
   * The elevation of each cell in meters.
   * @default 1000
   */
  getElevation?: FloatAccessor;
  /**
   * The width of the outline of the column.
   * @default 1
   */
  getLineWidth?: FloatAccessor;
};

// Remove data and getPosition from the upstream default props
const {
  data: _data,
  getPosition: _getPosition,
  ..._upstreamDefaultProps
} = ColumnLayer.defaultProps;

// Default props added by us
const ourDefaultProps = {
  _validate: true
};

// @ts-expect-error
const defaultProps: DefaultProps<GeoArrowColumnLayerProps> = {
  ..._upstreamDefaultProps,
  ...ourDefaultProps
};

export class GeoArrowColumnLayer<ExtraProps extends object = object> extends CompositeLayer<
  GeoArrowColumnLayerProps & ExtraProps
> {
  static defaultProps = defaultProps;
  static layerName = 'GeoArrowColumnLayer';

  getPickingInfo(
    params: GetPickingInfoParams & {
      sourceLayer: {props: GeoArrowExtraPickingProps};
    }
  ): GeoArrowPickingInfo {
    return getPickingInfo(params, this.props.data);
  }

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

    const layers: ColumnLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const geometryData = geometryColumn.data[recordBatchIdx];
      const flatCoordsData = ga.child.getPointChild(geometryData);
      const flatCoordinateArray = flatCoordsData.values;

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = geometryColumn._offsets[recordBatchIdx];

      const props: ColumnLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-column-${recordBatchIdx}`,
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

      const layer = new ColumnLayer({
        ...this.getSubLayerProps(props),
        getFiltered: props.getFiltered,
        getFilterValue: props.getFilterValue
      });
      layers.push(layer);
    }

    return layers;
  }
}
