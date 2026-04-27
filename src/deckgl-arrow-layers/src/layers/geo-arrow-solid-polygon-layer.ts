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
import {SolidPolygonLayer} from '@deck.gl/layers';
import type {SolidPolygonLayerProps} from '@deck.gl/layers';
import * as arrow from 'apache-arrow';
import * as ga from '@geoarrow/geoarrow-js';

import {GEOARROW_EXTENSIONS} from '@kepler.gl/constants';

import {
  assignAccessor,
  extractAccessorsFromProps,
  getGeometryVector,
  getPolygonResolvedOffsets,
  getMultiPolygonResolvedOffsets,
  invertOffsets
} from '../utils/utils';
import {GeoArrowExtraPickingProps, computeChunkOffsets, getPickingInfo} from '../utils/picking';
import {ColorAccessor, FloatAccessor, GeoArrowPickingInfo, ExtensionProps} from '../types';
import {assert} from '../utils/utils';
import {validateAccessors} from '../utils/validate';

/** All properties supported by GeoArrowSolidPolygonLayer */
export type GeoArrowSolidPolygonLayerProps = Omit<
  SolidPolygonLayerProps<arrow.Table>,
  'data' | 'getPolygon' | 'getElevation' | 'getFillColor' | 'getLineColor'
> &
  _GeoArrowSolidPolygonLayerProps &
  CompositeLayerProps;

type _GeoArrowSolidPolygonLayerProps = {
  data: arrow.Table;

  /**
   * If `true`, validate the arrays provided (e.g. chunk lengths)
   * @default true
   */
  _validate?: boolean;

  /**
   * Polygon geometry accessor.
   * If not provided, will be inferred by finding a column with extension type
   * `"geoarrow.polygon"` or `"geoarrow.multipolygon"`.
   */
  getPolygon?: ga.vector.PolygonVector | ga.vector.MultiPolygonVector;

  /**
   * Elevation accessor.
   * @default 1000
   */
  getElevation?: FloatAccessor;

  /**
   * Fill color accessor.
   * @default [0, 0, 0, 255]
   */
  getFillColor?: ColorAccessor;

  /**
   * Line color accessor.
   * @default [0, 0, 0, 255]
   */
  getLineColor?: ColorAccessor;
};

// Remove data and getPolygon from the upstream default props
const {
  data: _data,
  getPolygon: _getPolygon,
  ..._upstreamDefaultProps
} = SolidPolygonLayer.defaultProps;

const ourDefaultProps = {
  _validate: true,
  _normalize: false,
  _windingOrder: 'CCW' as const
};

// @ts-expect-error
const defaultProps: DefaultProps<GeoArrowSolidPolygonLayerProps> = {
  ..._upstreamDefaultProps,
  ...ourDefaultProps
};

export class GeoArrowSolidPolygonLayer<ExtraProps extends object = object> extends CompositeLayer<
  GeoArrowSolidPolygonLayerProps & ExtraProps
> {
  static defaultProps = defaultProps;
  static layerName = 'GeoArrowSolidPolygonLayer';

  getPickingInfo(
    params: GetPickingInfoParams & {
      sourceLayer: {props: GeoArrowExtraPickingProps};
    }
  ): GeoArrowPickingInfo {
    return getPickingInfo(params, this.props.data);
  }

  renderLayers(): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props.getPolygon !== undefined) {
      const geometryColumn = this.props.getPolygon;
      if (geometryColumn !== undefined && ga.vector.isPolygonVector(geometryColumn)) {
        return this._renderLayersPolygon(geometryColumn);
      }

      if (geometryColumn !== undefined && ga.vector.isMultiPolygonVector(geometryColumn)) {
        return this._renderLayersMultiPolygon(geometryColumn);
      }

      throw new Error('getPolygon should pass in an arrow Vector of Polygon or MultiPolygon type');
    } else {
      const polygonVector = getGeometryVector(table, GEOARROW_EXTENSIONS.POLYGON);
      if (polygonVector !== null) {
        return this._renderLayersPolygon(polygonVector);
      }

      const multiPolygonVector = getGeometryVector(table, GEOARROW_EXTENSIONS.MULTIPOLYGON);
      if (multiPolygonVector !== null) {
        return this._renderLayersMultiPolygon(multiPolygonVector);
      }
    }

    throw new Error('getPolygon not GeoArrow polygon or multipolygon');
  }

  _renderLayersPolygon(
    geometryColumn: ga.vector.PolygonVector
  ): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props._validate) {
      assert(ga.vector.isPolygonVector(geometryColumn));
      validateAccessors(this.props, table);
    }

    const [accessors, otherProps] = extractAccessorsFromProps(this.props, ['getPolygon']);
    const tableOffsets = computeChunkOffsets(table.data);

    const layers: SolidPolygonLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const polygonData = geometryColumn.data[recordBatchIdx];
      const ringData = ga.child.getPolygonChild(polygonData);
      const pointData = ga.child.getLineStringChild(ringData);
      const flatCoordsData = ga.child.getPointChild(pointData);
      const flatCoordinateArray = flatCoordsData.values;
      const nDim = pointData.type.listSize;

      const resolvedRingOffsets = getPolygonResolvedOffsets(polygonData);
      const earcutTriangles = ga.algorithm.earcut(polygonData);

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = geometryColumn._offsets[recordBatchIdx];

      const props: SolidPolygonLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-solid-polygon-${recordBatchIdx}`,
        data: {
          // @ts-expect-error passed through to enable use by function accessors
          data: table.batches[recordBatchIdx],
          length: polygonData.length,
          startIndices: resolvedRingOffsets,
          attributes: {
            getPolygon: {
              value: flatCoordinateArray,
              size: nDim
            },
            indices: {
              value: earcutTriangles,
              size: 1
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
          geomCoordOffsets: resolvedRingOffsets,
          batchOffset
        });
      }

      const SubLayerClass = this.getSubLayerClass(
        'geo-arrow-solid-polygon-layer',
        SolidPolygonLayer
      );
      const layer = new SubLayerClass({
        ...this.getSubLayerProps(props),
        getFiltered: props.getFiltered,
        getFilterValue: props.getFilterValue
      });
      layers.push(layer);
    }

    return layers;
  }

  _renderLayersMultiPolygon(
    geometryColumn: ga.vector.MultiPolygonVector
  ): Layer<object> | LayersList | null {
    const {data: table} = this.props;

    if (this.props._validate) {
      assert(ga.vector.isMultiPolygonVector(geometryColumn));
      validateAccessors(this.props, table);
    }

    const [accessors, otherProps] = extractAccessorsFromProps(this.props, ['getPolygon']);
    const tableOffsets = computeChunkOffsets(table.data);

    const layers: SolidPolygonLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const multiPolygonData = geometryColumn.data[recordBatchIdx];
      const polygonData = ga.child.getMultiPolygonChild(multiPolygonData);
      const ringData = ga.child.getPolygonChild(polygonData);
      const pointData = ga.child.getLineStringChild(ringData);
      const flatCoordsData = ga.child.getPointChild(pointData);
      const flatCoordinateArray = flatCoordsData.values;
      const nDim = pointData.type.listSize;

      const geomOffsets = multiPolygonData.valueOffsets;
      const resolvedPolygonToCoordOffsets = getPolygonResolvedOffsets(polygonData);
      const resolvedMultiPolygonToCoordOffsets = getMultiPolygonResolvedOffsets(multiPolygonData);
      const earcutTriangles = ga.algorithm.earcut(polygonData);

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = geometryColumn._offsets[recordBatchIdx];

      const props: SolidPolygonLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-solid-polygon-${recordBatchIdx}`,
        data: {
          // @ts-expect-error passed through to enable use by function accessors
          data: table.batches[recordBatchIdx],
          invertedGeomOffsets: invertOffsets(geomOffsets),
          length: polygonData.length,
          startIndices: resolvedPolygonToCoordOffsets,
          attributes: {
            getPolygon: {
              value: flatCoordinateArray,
              size: nDim
            },
            indices: {
              value: earcutTriangles,
              size: 1
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
          geomCoordOffsets: resolvedMultiPolygonToCoordOffsets,
          batchOffset
        });
      }

      const SubLayerClass = this.getSubLayerClass(
        'geo-arrow-solid-polygon-layer',
        SolidPolygonLayer
      );
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
