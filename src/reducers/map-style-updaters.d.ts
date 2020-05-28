import {RGBColor} from './types';
import ActionTypes from 'constants/action-types';
import {ReceiveMapConfigPayload, KeplerGlInitPayload} from '../actions/actions';
import * as MapStyleActions from '../actions/map-style-actions';

export type LayerGroup = {
  slug: string;
  filter(layer: {id: string}): boolean;
  defaultVisibility: boolean;
};

export type VisibleLayerGroups = {
  [key: string]: boolean;
};

export type MapboxStyleUrl = string;

export type BaseMapStyle = {
  id: string;
  label: string;
  url: string;
  icon: string;
  style?: object;
  layerGroups: LayerGroup[];
};

export type MapStyles = {
  [key: string]: BaseMapStyle;
};

export type InputStyle = {
  accessToken: string | null;
  error: boolean;
  isValid: boolean;
  label: string | null;
  style: object | null;
  url: string | null;
  icon: string | null;
  custom: boolean;
};

export type MapStyle = {
  styleType: string;
  visibleLayerGroups: VisibleLayerGroups;
  topLayerGroups: VisibleLayerGroups;
  mapStyles: MapStyles;
  // save mapbox access token
  mapboxApiAccessToken: string | null;
  mapboxApiUrl: string;
  mapStylesReplaceDefault: boolean;
  inputStyle: InputStyle;
  threeDBuildingColor: RGBColor;
  custom3DBuildingColor: boolean;
};

export const INITIAL_MAP_STYLE: MapStyle;

export function addCustomMapStyleUpdater(state: MapStyle, action: MapStyleActions.AddCustomMapStyleUpdaterAction): MapStyle;
export function inputMapStyleUpdater(state: MapStyle, action: MapStyleActions.InputMapStyleUpdaterAction): MapStyle;
export function mapConfigChangeUpdater(state: MapStyle, action: MapStyleActions.MapConfigChangeUpdaterAction): MapStyle;
export function requestMapStylesUpdater(state: MapStyle, action: MapStyleActions.RequestMapStylesUpdaterAction): MapStyle;
export function loadMapStylesUpdater(state: MapStyle, action: MapStyleActions.LoadMapStylesUpdaterAction): MapStyle;
export function loadMapStyleErrUpdater(state: MapStyle, action: MapStyleActions.LoadMapStyleErrUpdaterAction): MapStyle;
export function mapStyleChangeUpdater(state: MapStyle, action: MapStyleActions.MapStyleChangeUpdaterAction): MapStyle;
export function loadCustomMapStyleUpdater(state: MapStyle, action: MapStyleActions.LoadCustomMapStyleUpdaterAction): MapStyle;
export function set3dBuildingColorUpdater(state: MapStyle, action: MapStyleActions.Set3dBuildingColorUpdaterAction): MapStyle;

export function receiveMapConfigUpdater(state: MapStyle, action: {
  type?: ActionTypes.RECEIVE_MAP_CONFIG;
  payload: ReceiveMapConfigPayload;
}): MapStyle;
export function initMapStyleUpdater(state: MapStyle, action: {
  type?: ActionTypes.INIT;
  payload: KeplerGlInitPayload;
}): MapStyle;
export function resetMapConfigMapStyleUpdater(state: MapStyle): MapStyle;