import {VisState} from './vis-state-updaters';
import {MapState} from './map-state-updaters';
import {UiState} from './ui-state-updaters';
import {MapStyle} from './map-style-updaters';
import {ProviderState} from './provider-state-updaters';
import {AddDataToMaoPayload} from 'actions/actions';
import {FileCacheItem} from 'processors/file-handler';
import {LoadFileSuccessUpdaterAction} from 'actions/vis-state-actions';

export type KeplerGlState = {
  visState: VisState;
  mapState: MapState;
  mapStyle: MapStyle;
  uiState: UiState;
  providerState: ProviderState;
};

export function addDataToMapUpdater(
  state: KeplerGlState,
  action: {payload: AddDataToMaoPayload}
): KeplerGlState;

export function loadFileSuccessUpdater(
  state: KeplerGlState,
  action: LoadFileSuccessUpdaterAction
): KeplerGlState;