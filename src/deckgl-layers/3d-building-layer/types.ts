import {RGBColor} from '../../reducers';

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
