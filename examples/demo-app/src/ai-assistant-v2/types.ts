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
