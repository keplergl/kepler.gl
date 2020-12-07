import {Reducer} from 'redux';
import {ReduxCompatibleReducer} from 'redux-actions';
import {VisState} from './vis-state-updaters';
import {MapState} from './map-state-updaters';
import {MapStyle} from './map-style-updaters';
import {ProviderState} from './provider-state-updaters';
import {UiState} from './ui-state-updaters';

export type KeplerGlState = {
  visState: VisState;
  mapState: MapState;
  mapStyle: MapStyle;
  uiState: UiState;
  providerState: ProviderState;
};

export function combineReducers_(r: {[key: string]: ReduxCompatibleReducer<any>}): Reducer<any>;

export function mapStateLens(st: KeplerGlState): {mapState: MapState};
export function mapStyleLens(st: KeplerGlState): {mapStyle: MapStyle};
export function visStateLens(st: KeplerGlState): {visState: VisState};
export function uiStateLens(st: KeplerGlState): {uiState: UiState};
export function providerStateLens(st: KeplerGlState): {providerState: ProviderState};

export function coreReducerFactory(initialState: any): (state: any, action: any) => any;
