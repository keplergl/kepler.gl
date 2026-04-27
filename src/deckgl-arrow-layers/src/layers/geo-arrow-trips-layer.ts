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
import {TripsLayer} from '@deck.gl/geo-layers';
import type {TripsLayerProps} from '@deck.gl/geo-layers';
import * as arrow from 'apache-arrow';
import * as ga from '@geoarrow/geoarrow-js';

import {GEOARROW_EXTENSIONS} from '@kepler.gl/constants';

import {
  assignAccessor,
  extractAccessorsFromProps,
  getGeometryVector
} from '../utils/utils';
import {GeoArrowExtraPickingProps, computeChunkOffsets, getPickingInfo} from '../utils/picking';
import {ColorAccessor, FloatAccessor, TimestampAccessor, GeoArrowPickingInfo, ExtensionProps} from '../types';
import {assert} from '../utils/utils';
import {validateAccessors} from '../utils/validate';

/** All properties supported by GeoArrowTripsLayer */
export type GeoArrowTripsLayerProps = Omit<
  TripsLayerProps<arrow.Table>,
  'data' | 'getPath' | 'getColor' | 'getWidth' | 'getTimestamps'
> &
  _GeoArrowTripsLayerProps &
  CompositeLayerProps;

/** Properties added by GeoArrowTripsLayer */
type _GeoArrowTripsLayerProps = {
  data: arrow.Table;

  /**
   * If `true`, validate the arrays provided (e.g. chunk lengths)
   * @default true
   */
  _validate?: boolean;
  /**
   * Path geometry accessor.
   */
  getPath?: ga.vector.LineStringVector;
  /**
   * Path color accessor.
   * @default [0, 0, 0, 255]
   */
  getColor?: ColorAccessor;
  /**
   * Path width accessor.
   * @default 1
   */
  getWidth?: FloatAccessor;
  /**
   * Timestamp accessor.
   */
  getTimestamps: TimestampAccessor;
};

const {
  data: _data,
  getPath: _getPath,
  ..._defaultProps
} = TripsLayer.defaultProps;

const ourDefaultProps = {
  _pathType: 'open' as const,
  _validate: true
};

// @ts-expect-error
const defaultProps: DefaultProps<GeoArrowTripsLayerProps> = {
  ..._defaultProps,
  ...ourDefaultProps
};

export class GeoArrowTripsLayer<ExtraProps extends object = object> extends CompositeLayer<
  GeoArrowTripsLayerProps & ExtraProps
> {
  static defaultProps = defaultProps;
  static layerName = 'GeoArrowTripsLayer';

  getPickingInfo(
    params: GetPickingInfoParams & {
      sourceLayer: {props: GeoArrowExtraPickingProps};
    }
  ): GeoArrowPickingInfo {
    return getPickingInfo(params, this.props.data);
  }

  renderLayers(): Layer<object> | LayersList | null {
    const {data: table, getTimestamps} = this.props;

    if (this.props.getPath !== undefined) {
      const geometryColumn = this.props.getPath;
      if (geometryColumn !== undefined && ga.vector.isLineStringVector(geometryColumn)) {
        return this._renderLayersLineString(geometryColumn, getTimestamps);
      }

      throw new Error('getPath should pass in an arrow Vector of LineString type');
    } else {
      const lineStringVector = getGeometryVector(table, GEOARROW_EXTENSIONS.LINESTRING);
      if (lineStringVector !== null) {
        return this._renderLayersLineString(
          lineStringVector as ga.vector.LineStringVector,
          getTimestamps
        );
      }
    }

    throw new Error('getPath not GeoArrow LineString');
  }

  _renderLayersLineString(
    geometryColumn: ga.vector.LineStringVector,
    timestampsColumn: TimestampAccessor
  ): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props._validate) {
      assert(ga.vector.isLineStringVector(geometryColumn));
      validateAccessors(this.props, table);
    }

    const [accessors, otherProps] = extractAccessorsFromProps(this.props, [
      'getPath',
      'getTimestamps'
    ]);
    const tableOffsets = computeChunkOffsets(table.data);

    const layers: TripsLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const lineStringData = geometryColumn.data[recordBatchIdx];
      const geomOffsets = lineStringData.valueOffsets;
      const pointData = ga.child.getLineStringChild(lineStringData);
      const nDim = pointData.type.listSize;
      const coordData = ga.child.getPointChild(pointData);
      const flatCoordinateArray = coordData.values;

      const timestampData = timestampsColumn.data[recordBatchIdx];
      const timestampValues = timestampData.children[0].values;

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = geometryColumn._offsets[recordBatchIdx];

      const props: TripsLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-trips-${recordBatchIdx}`,
        data: {
          // @ts-expect-error
          data: table.batches[recordBatchIdx],
          length: lineStringData.length,
          startIndices: geomOffsets,
          attributes: {
            getPath: {value: flatCoordinateArray, size: nDim},
            getTimestamps: {value: timestampValues, size: 1}
          }
        }
      };

      for (const [propName, propInput] of Object.entries(accessors)) {
        assignAccessor({
          props,
          propName,
          propInput,
          chunkIdx: recordBatchIdx,
          geomCoordOffsets: geomOffsets,
          batchOffset
        });
      }

      const layer = new TripsLayer({
        ...this.getSubLayerProps(props),
        getFiltered: props.getFiltered,
        getFilterValue: props.getFilterValue
      });
      layers.push(layer);
    }

    return layers;
  }
}
