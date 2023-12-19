// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {RGBColor} from '@kepler.gl/types';

export type TileIndex = {x: number; y: number; z: number};

export type TileLoadProps = {
  id: string;
  index: TileIndex;
  bbox: any;
  url?: string | null;
  signal?: AbortSignal;
  userData?: Record<string, any>;
  zoom?: number;
};

export type ThreeDBuildingLayerProps = {
  id: string;
  mapboxApiAccessToken: string;
  mapboxApiUrl: string;
  threeDBuildingColor: RGBColor;
  updateTriggers: {
    getFillColor: RGBColor;
  };
};
export type Coordinates = {x: number; y: number; z: number};
// TODO rename
export type FlatFigure = ([number, number] | [number, number, number])[];
export type TileDataItem = {coordinates: FlatFigure[]; properties: VectorTileFeatureProperties};
export type VectorTileFeatureProperties = {layer: string; height?: number};
export type VectorTileFeature = {
  extent: number;
  properties: VectorTileFeatureProperties;
  _pbf: {
    buf: ArrayBuffer;
    pos: number;
    type: number;
    length: number;
    readVarint: (b?: boolean) => number;
    readSVarint: () => number;
  };
  _geometry: number;
};
