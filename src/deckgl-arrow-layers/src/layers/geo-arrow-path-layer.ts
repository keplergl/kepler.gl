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
import {PathLayer} from '@deck.gl/layers';
import type {PathLayerProps} from '@deck.gl/layers';
import * as arrow from 'apache-arrow';
import * as ga from '@geoarrow/geoarrow-js';

import {GEOARROW_EXTENSIONS} from '@kepler.gl/constants';

import {
  assignAccessor,
  extractAccessorsFromProps,
  getGeometryVector,
  getMultiLineStringResolvedOffsets,
  invertOffsets
} from '../utils/utils';
import {GeoArrowExtraPickingProps, computeChunkOffsets, getPickingInfo} from '../utils/picking';
import {ColorAccessor, FloatAccessor, GeoArrowPickingInfo, ExtensionProps} from '../types';
import {assert} from '../utils/utils';
import {validateAccessors} from '../utils/validate';

/** All properties supported by GeoArrowPathLayer */
export type GeoArrowPathLayerProps = Omit<
  PathLayerProps<arrow.Table>,
  'data' | 'getPath' | 'getColor' | 'getWidth'
> &
  _GeoArrowPathLayerProps &
  CompositeLayerProps;

/** Properties added by GeoArrowPathLayer */
type _GeoArrowPathLayerProps = {
  data: arrow.Table;

  /**
   * If `true`, validate the arrays provided (e.g. chunk lengths)
   * @default true
   */
  _validate?: boolean;

  /**
   * Path geometry accessor.
   * If not provided, will be inferred by finding a column with extension type
   * `"geoarrow.linestring"` or `"geoarrow.multilinestring"`.
   */
  getPath?: ga.vector.LineStringVector | ga.vector.MultiLineStringVector;

  /**
   * The rgba color of each path.
   * @default [0, 0, 0, 255]
   */
  getColor?: ColorAccessor;

  /**
   * The width of each path, in units specified by `widthUnits`.
   * @default 1
   */
  getWidth?: FloatAccessor;
};

// Remove data and getPath from the upstream default props
const {
  data: _data,
  getPath: _getPath,
  ..._upstreamDefaultProps
} = PathLayer.defaultProps;

const ourDefaultProps = {
  _validate: true,
  _pathType: 'open' as const
};

// @ts-expect-error
const defaultProps: DefaultProps<GeoArrowPathLayerProps> = {
  ..._upstreamDefaultProps,
  ...ourDefaultProps
};

export class GeoArrowPathLayer<ExtraProps extends object = object> extends CompositeLayer<
  GeoArrowPathLayerProps & ExtraProps
> {
  static defaultProps = defaultProps;
  static layerName = 'GeoArrowPathLayer';

  getPickingInfo(
    params: GetPickingInfoParams & {
      sourceLayer: {props: GeoArrowExtraPickingProps};
    }
  ): GeoArrowPickingInfo {
    return getPickingInfo(params, this.props.data);
  }

  renderLayers(): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props.getPath !== undefined) {
      const geometryColumn = this.props.getPath;
      if (geometryColumn !== undefined && ga.vector.isLineStringVector(geometryColumn)) {
        return this._renderLayersLineString(geometryColumn);
      }

      if (geometryColumn !== undefined && ga.vector.isMultiLineStringVector(geometryColumn)) {
        return this._renderLayersMultiLineString(geometryColumn);
      }

      throw new Error('getPath should pass in an arrow Vector of LineString or MultiLineString type');
    } else {
      const lineStringVector = getGeometryVector(table, GEOARROW_EXTENSIONS.LINESTRING);
      if (lineStringVector !== null) {
        return this._renderLayersLineString(lineStringVector);
      }

      const multiLineStringVector = getGeometryVector(
        table,
        GEOARROW_EXTENSIONS.MULTILINESTRING
      );
      if (multiLineStringVector !== null) {
        return this._renderLayersMultiLineString(multiLineStringVector);
      }
    }

    throw new Error('getPath not GeoArrow linestring or multilinestring');
  }

  _renderLayersLineString(
    geometryColumn: ga.vector.LineStringVector
  ): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props._validate) {
      assert(ga.vector.isLineStringVector(geometryColumn));
      validateAccessors(this.props, table);
    }

    const [accessors, otherProps] = extractAccessorsFromProps(this.props, ['getPath']);
    const tableOffsets = computeChunkOffsets(table.data);

    const layers: PathLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const lineStringData = geometryColumn.data[recordBatchIdx];
      const geomOffsets = lineStringData.valueOffsets;
      const pointData = ga.child.getLineStringChild(lineStringData);
      const flatCoordsData = ga.child.getPointChild(pointData);
      const flatCoordinateArray = flatCoordsData.values;

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = geometryColumn._offsets[recordBatchIdx];

      const props: PathLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-path-${recordBatchIdx}`,
        data: {
          // @ts-expect-error passed through to enable use by function accessors
          data: table.batches[recordBatchIdx],
          length: lineStringData.length,
          startIndices: geomOffsets,
          attributes: {
            getPath: {
              value: flatCoordinateArray,
              size: pointData.type.listSize
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

      const SubLayerClass = this.getSubLayerClass('geo-arrow-path-layer', PathLayer);
      const layer = new SubLayerClass({
        ...this.getSubLayerProps(props),
        getFiltered: props.getFiltered,
        getFilterValue: props.getFilterValue
      });
      layers.push(layer);
    }

    return layers;
  }

  _renderLayersMultiLineString(
    geometryColumn: ga.vector.MultiLineStringVector
  ): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props._validate) {
      assert(ga.vector.isMultiLineStringVector(geometryColumn));
      validateAccessors(this.props, table);
    }

    const [accessors, otherProps] = extractAccessorsFromProps(this.props, ['getPath']);
    const tableOffsets = computeChunkOffsets(table.data);

    const layers: PathLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const multiLineStringData = geometryColumn.data[recordBatchIdx];
      const geomOffsets = multiLineStringData.valueOffsets;
      const lineStringData = ga.child.getMultiLineStringChild(multiLineStringData);
      const ringOffsets = lineStringData.valueOffsets;
      const pointData = ga.child.getLineStringChild(lineStringData);
      const flatCoordsData = ga.child.getPointChild(pointData);
      const flatCoordinateArray = flatCoordsData.values;

      const resolvedOffsets = getMultiLineStringResolvedOffsets(multiLineStringData);

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = geometryColumn._offsets[recordBatchIdx];

      const props: PathLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-path-${recordBatchIdx}`,
        data: {
          // @ts-expect-error passed through to enable use by function accessors
          data: table.batches[recordBatchIdx],
          invertedGeomOffsets: invertOffsets(geomOffsets),
          length: lineStringData.length,
          startIndices: ringOffsets,
          attributes: {
            getPath: {
              value: flatCoordinateArray,
              size: pointData.type.listSize
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
          geomCoordOffsets: resolvedOffsets,
          batchOffset
        });
      }

      const SubLayerClass = this.getSubLayerClass('geo-arrow-path-layer', PathLayer);
      const layer = new SubLayerClass({
        ...this.getSubLayerProps(props),
        getFiltered: props.getFiltered,
        getFilterValue: props.getFilterValue
      });
      layers.push(layer);
    }

    return layers;
  }
}
