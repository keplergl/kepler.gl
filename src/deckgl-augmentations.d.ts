// Type augmentations for deck.gl 9.x
// These types are exported by @deck.gl/core but not resolvable with moduleResolution: "node"
// because deck.gl 9.x uses .js extensions in its type declarations.

declare module '@deck.gl/core' {
  export type PickingInfo<DataT = any, ExtraInfo = Record<string, unknown>> = ExtraInfo & {
    color: Uint8Array | null;
    layer: any;
    sourceLayer?: any;
    viewport?: any;
    index: number;
    picked: boolean;
    object?: DataT;
    x: number;
    y: number;
    pixel?: [number, number];
    coordinate?: number[];
    devicePixel?: [number, number];
    pixelRatio: number;
  };

  // Alias for backward compatibility
  export type PickInfo<DataT = any> = PickingInfo<DataT>;

  export type MapViewState = {
    latitude: number;
    longitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
    transitionDuration?: number;
    transitionInterpolator?: any;
  };

  export type LayerProps<DataT = any> = Record<string, any> & {
    id?: string;
    data?: DataT;
    visible?: boolean;
    opacity?: number;
  };

  export type LayersList = any[];

  export type Color = [number, number, number] | [number, number, number, number];
  export type RGBAColor = [number, number, number, number];
  export type RGBColor = [number, number, number];

  export class DeckRenderer {
    device: any;
    renderBuffers: any[];
    lastPostProcessEffect: string | null;
    constructor(device: any);
    renderLayers(opts: any): void;
    needsRedraw(opts?: any): string | false;
    finalize(): void;
  }
}

declare module '@deck.gl/geo-layers' {
  export type _Tile2DHeader<T = any> = {
    id: string;
    index: {x: number; y: number; z: number};
    boundingBox?: [number[], number[]];
    content?: T;
    isLoaded?: boolean;
    isVisible?: boolean;
  };

  export type GeoBoundingBox = {
    west: number;
    north: number;
    east: number;
    south: number;
  };
}

declare module '@luma.gl/core' {
  export type TextureProps = Record<string, any>;
}
