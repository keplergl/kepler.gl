// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// deck.gl-community
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {BinaryAttribute, Color, PickingInfo} from '@deck.gl/core/typed';
import {TypedArray} from '@math.gl/types';
import * as arrow from 'apache-arrow';

/**
 * An individual layer's data
 */
export type GeoArrowLayerData<T> = {
  data: T;
  length: number;
  attributes?: Record<string, TypedArray | Buffer | BinaryAttribute>;
};

/**
 * Internal type for layer data handling, used in `wrapAccessorFunction`.
 */
export type _GeoArrowInternalLayerData<T> = GeoArrowLayerData<T> & {
  /**
   * A lookup table from expanded multi-geometry index to original index.
   *
   * This is omitted from the user-facing type because in `wrapAccessorFunction`
   * in `utils.ts` we apply the lookup from "exploded" row to "original" row.
   */
  invertedGeomOffsets?: Uint8Array | Uint16Array | Uint32Array;
};

export type AccessorContext<T> = {
  /** The current row index of the current iteration */
  index: number;
  /** The value of the `data` prop */
  data: GeoArrowLayerData<T>;
  /** A pre-allocated array. The accessor function can optionally fill data into this array and return it,
   * instead of creating a new array for every object. In some browsers this improves performance significantly
   * by reducing garbage collection. */
  target: number[];
};

/**
 * Internal type for layer data handling, used in `wrapAccessorFunction`.
 */
export type _InternalAccessorContext<T> = AccessorContext<T> & {
  /** The value of the `data` prop */
  data: _GeoArrowInternalLayerData<T>;
};

/** Function that returns a value for each object. */
export type AccessorFunction<In, Out> = (
  /** Contextual information of the current element. */
  objectInfo: AccessorContext<In>
) => Out;

/** Either a uniform value for all objects, or a function that returns a value for each object. */
export type Accessor<In, Out> = Out | AccessorFunction<In, Out>;

export type GeoArrowPickingInfo = PickingInfo & {
  object?: arrow.StructRowProxy;
};

export type FloatAccessor = arrow.Vector<arrow.Float> | Accessor<arrow.RecordBatch, number>;
export type TimestampAccessor = arrow.Vector<arrow.List<arrow.Float>>;
export type ColorAccessor =
  | arrow.Vector<arrow.FixedSizeList<arrow.Uint8>>
  | Accessor<arrow.RecordBatch, Color | Color[]>;
export type NormalAccessor =
  | arrow.Vector<arrow.FixedSizeList<arrow.Float32>>
  | Accessor<arrow.Table, arrow.Vector<arrow.FixedSizeList<arrow.Float32>>>;

export type ExtensionProps = {
  getFiltered?: ({index: number}) => number;
  getFilterValue?: (d: any, objectInfo?: {index: number}) => (number | number[])[];
};
