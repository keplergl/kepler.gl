// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export type RGBColor = [number, number, number];
export type RGBAColor = [number, number, number, number];
export type HexColor = string; // this is the best typescript can do at the moment
export type Millisecond = number;

/**
 * Deck.gl picking info with relaxed layer generics for compatibility with DeckGL React callbacks.
 * deck.gl 9's DeckGL component infers callback parameter types that are structurally incompatible
 * with `PickingInfo` from `@deck.gl/core` (missing `color`/`pixelRatio`, different `Layer` generic).
 */
export type PickInfo<DataT = any> = {
  layer?: {id: string; state?: Record<string, any>} | null;
  sourceLayer?: {id: string} | null;
  viewport?: {width?: number; height?: number} | null;
  index: number;
  picked?: boolean;
  object?: DataT;
  x: number;
  y: number;
  pixel?: [number, number];
  coordinate?: number[];
  color?: Uint8Array | null;
  pixelRatio?: number;
};

export type ValueOf<T> = T[keyof T];

export type Merge<A, B> = {[K in keyof A]: K extends keyof B ? B[K] : A[K]} & B extends infer O
  ? {[K in keyof O]: O[K]}
  : never;

export type RequireFrom<T, K extends keyof T> = Merge<Required<Pick<T, K>>, Partial<Omit<T, K>>>;

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type NestedPartial<T> = {
  [P in keyof T]?: NestedPartial<T[P]>;
};

export type RowData = {
  [key: string]: string | null;
}[];

export type ProcessorResult = {
  info?: any;
  fields: Field[];
  rows: any[][];
  cols?: any[];
  metadata?: any;
  /** Optional schema for arrow tables with metadata preserved. */
  // TODO: Should we use a loaded arrow.Table in cols instead of an array of arrow.Vectors? Why was an array of arrow.Vectors chosen?
  arrowSchema?: any;
} | null;

export type Json = JsonScalar | JsonArray | JsonObject;
export type JsonObjectOrArray = JsonArray | JsonObject;
export type JsonScalar = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = {
  [key: string]: Json | undefined;
};

/**
 * Types to mock apache-arrow types
 */

export interface ApacheVectorInterface {
  length: number;
}

export interface ArrowTableInterface {
  get numRows(): number;

  getChildAt: (index: number) => Vector;
}
