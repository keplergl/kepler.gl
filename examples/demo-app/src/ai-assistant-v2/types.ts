import {Datasets} from '@kepler.gl/table';
import {Dispatch} from 'redux';

export type VisState = {
  datasets: Datasets;
  layers: any[];
  layerData: any[];
  loaders: any[];
  loadOptions: Record<string, any>;
  [key: string]: any;
};

/**
 * Accessors to the kepler.gl application state the assistant needs. The host
 * app supplies these (via `setKeplerStateAccessors`) so this module never
 * hard-codes a redux state shape (e.g. `demo.keplerGl.map.visState`). Any
 * app can provide accessors matching its own store.
 */
export type KeplerStateAccessors = {
  getVisState: () => VisState;
  getMapBoundary: () =>
    | {
        nw: [number, number];
        se: [number, number];
      }
    | undefined;
};

/**
 * KeplerContext provides access to kepler.gl state and dispatch.
 * This is passed into tool factories instead of using Redux directly.
 */
export type KeplerContext = {
  getVisState: () => VisState;
  getMapBoundary: () =>
    | {
        nw: [number, number];
        se: [number, number];
      }
    | undefined;
  getMapboxToken: () => string | undefined;
  dispatch: Dispatch;
};
