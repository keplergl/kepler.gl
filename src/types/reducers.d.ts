export type MapState = {
    pitch: number;
    bearing: number;
    latitude: number;
    longitude: number;
    zoom: number;
    dragRotate: boolean;
    width: number;
    height: number;
    isSplit: boolean;
    initialState?: any;
    scale?: number;
  };