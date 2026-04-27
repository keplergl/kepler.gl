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
import {PointCloudLayer} from '@deck.gl/layers';
import type {PointCloudLayerProps} from '@deck.gl/layers';
import * as arrow from 'apache-arrow';
import * as ga from '@geoarrow/geoarrow-js';

import {GEOARROW_EXTENSIONS} from '@kepler.gl/constants';

import {
  assignAccessor,
  extractAccessorsFromProps,
  getGeometryVector
} from '../utils/utils';
import {GeoArrowExtraPickingProps, computeChunkOffsets, getPickingInfo} from '../utils/picking';
import {ColorAccessor, NormalAccessor, GeoArrowPickingInfo, ExtensionProps} from '../types';
import {assert} from '../utils/utils';
import {validateAccessors} from '../utils/validate';

/** All properties supported by GeoArrowPointCloudLayer */
export type GeoArrowPointCloudLayerProps = Omit<
  PointCloudLayerProps<arrow.Table>,
  'data' | 'getPosition' | 'getNormal' | 'getColor'
> &
  _GeoArrowPointCloudLayerProps &
  CompositeLayerProps;

/** Properties added by GeoArrowPointCloudLayer */
type _GeoArrowPointCloudLayerProps = {
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
   * The normal of each object, in `[nx, ny, nz]`.
   * @default [0, 0, 1]
   */
  getNormal?: NormalAccessor;
  /**
   * The rgba color is in the format of `[r, g, b, [a]]`.
   * @default [0, 0, 0, 255]
   */
  getColor?: ColorAccessor;
};

const {
  data: _data,
  getPosition: _getPosition,
  ..._upstreamDefaultProps
} = PointCloudLayer.defaultProps;

const ourDefaultProps = {
  _validate: true
};

// @ts-expect-error
const defaultProps: DefaultProps<GeoArrowPointCloudLayerProps> = {
  ..._upstreamDefaultProps,
  ...ourDefaultProps
};

export class GeoArrowPointCloudLayer<ExtraProps extends object = object> extends CompositeLayer<
  GeoArrowPointCloudLayerProps & ExtraProps
> {
  static defaultProps = defaultProps;
  static layerName = 'GeoArrowPointCloudLayer';

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

    const layers: PointCloudLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const geometryData = geometryColumn.data[recordBatchIdx];
      const flatCoordsData = ga.child.getPointChild(geometryData);
      const flatCoordinateArray = flatCoordsData.values;

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = geometryColumn._offsets[recordBatchIdx];

      const props: PointCloudLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-pointcloud-${recordBatchIdx}`,
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

      const layer = new PointCloudLayer({
        ...this.getSubLayerProps(props),
        getFiltered: props.getFiltered,
        getFilterValue: props.getFilterValue
      });
      layers.push(layer);
    }

    return layers;
  }
}
