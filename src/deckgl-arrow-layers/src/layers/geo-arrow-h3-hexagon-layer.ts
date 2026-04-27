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
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import type {H3HexagonLayerProps} from '@deck.gl/geo-layers';
import * as arrow from 'apache-arrow';

import {
  assignAccessor,
  extractAccessorsFromProps
} from '../utils/utils';
import {GeoArrowExtraPickingProps, computeChunkOffsets, getPickingInfo} from '../utils/picking';
import {ColorAccessor, FloatAccessor, GeoArrowPickingInfo, ExtensionProps} from '../types';
import {validateAccessors} from '../utils/validate';

/** All properties supported by GeoArrowH3HexagonLayer */
export type GeoArrowH3HexagonLayerProps = Omit<
  H3HexagonLayerProps,
  'data' | 'getHexagon' | 'getFillColor' | 'getLineColor' | 'getLineWidth' | 'getElevation'
> &
  _GeoArrowH3HexagonLayerProps &
  CompositeLayerProps;

/** Properties added by GeoArrowH3HexagonLayer */
type _GeoArrowH3HexagonLayerProps = {
  data: arrow.Table;

  /**
   * If `true`, validate the arrays provided (e.g. chunk lengths)
   * @default true
   */
  _validate?: boolean;
  /**
   * Called for each data object to retrieve the hexagon string identifier.
   */
  getHexagon: arrow.Vector<arrow.Utf8>;
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
   * Line width accessor.
   * @default 1
   */
  getLineWidth?: FloatAccessor;
  /**
   * Elevation accessor.
   * @default 1000
   */
  getElevation?: FloatAccessor;
};

const {
  data: _data,
  getHexagon: _getHexagon,
  ..._defaultProps
} = H3HexagonLayer.defaultProps;

const ourDefaultProps = {
  _validate: true
};

// @ts-expect-error
const defaultProps: DefaultProps<GeoArrowH3HexagonLayerProps> = {
  ..._defaultProps,
  ...ourDefaultProps
};

export class GeoArrowH3HexagonLayer<ExtraProps extends object = object> extends CompositeLayer<
  GeoArrowH3HexagonLayerProps & ExtraProps
> {
  static defaultProps = defaultProps;
  static layerName = 'GeoArrowH3HexagonLayer';

  getPickingInfo(
    params: GetPickingInfoParams & {
      sourceLayer: {props: GeoArrowExtraPickingProps};
    }
  ): GeoArrowPickingInfo {
    return getPickingInfo(params, this.props.data);
  }

  renderLayers(): Layer<object> | LayersList | null {
    return this._renderLayers();
  }

  _renderLayers(): Layer<object> | LayersList | null {
    const {data: table, getHexagon: hexColumn} = this.props;

    if (this.props._validate) {
      validateAccessors(this.props, table);
    }

    const [accessors, otherProps] = extractAccessorsFromProps(this.props, ['getHexagon']);
    const tableOffsets = computeChunkOffsets(table.data);

    const layers: H3HexagonLayer<any>[] = [];
    for (let recordBatchIdx = 0; recordBatchIdx < table.batches.length; recordBatchIdx++) {
      const hexData = hexColumn.data[recordBatchIdx];

      // @ts-expect-error how to properly retrieve batch offset?
      const batchOffset = hexColumn._offsets[recordBatchIdx];

      const hexVector = new arrow.Vector([hexData]);

      const props: H3HexagonLayerProps<any> & ExtensionProps = {
        ...ourDefaultProps,
        ...otherProps,

        recordBatchIdx,
        tableOffsets,

        id: `${this.props.id}-geoarrow-h3-${recordBatchIdx}`,
        data: {
          // @ts-expect-error
          data: table.batches[recordBatchIdx],
          length: hexData.length
        },
        getHexagon: (_: any, objectInfo: {index: number}) => {
          const value = hexVector.get(objectInfo.index);
          if (typeof value === 'string') {
            return value;
          }
          return String(value);
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

      const layer = new H3HexagonLayer({
        ...this.getSubLayerProps(props),
        getFiltered: props.getFiltered,
        getFilterValue: props.getFilterValue
      });
      layers.push(layer);
    }

    return layers;
  }
}
