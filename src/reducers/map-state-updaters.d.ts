import * as MapStateActions from 'actions/map-state-actions';
import {ReceiveMapConfigPayload} from '../actions/actions';
import ActionTypes from 'constants/action-types';

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
};

export type Bounds = [number, number, number, number];
/** Width of viewport */
export type Viewport = {
  /**  Width of viewport */
  width?: number;
  /**  Height of viewport */
  height?: number;
  /**  Zoom of viewport */
  zoom?: number;
  /**  Camera angle in degrees (0 is straight down) */
  pitch?: number;
  /**  Map rotation in degrees (0 means north is up) */
  bearing?: number;
  /**  Latitude center of viewport on map in mercator projection */
  latitude?: number;
  /**  Longitude Center of viewport on map in mercator projection */
  longitude?: number;
  /**  Whether to enable drag and rotate map into perspective viewport */
  dragRotate?: boolean;
};

export const INITIAL_MAP_STATE: MapState;

export function updateMapUpdater(
  state: MapState,
  action: MapStateActions.UpdateMapUpdaterAction
): MapState;
export function fitBoundsUpdater(
  state: MapState,
  action: MapStateActions.FitBoundsUpdaterAction
): MapState;
export function togglePerspectiveUpdater(
  state: MapState,
  action: MapStateActions.TogglePerspectiveUpdaterAction
): MapState;
export function resetMapConfigUpdater(state: MapState): MapState;
export function receiveMapConfigUpdater(
  state: MapState,
  action: {
    type?: ActionTypes.RECEIVE_MAP_CONFIG;
    payload: ReceiveMapConfigPayload;
  }
): MapState;
export function toggleSplitMapUpdater(
  state: MapState,
  action: MapStateActions.ToggleSplitMapUpdaterAction
): MapState;
