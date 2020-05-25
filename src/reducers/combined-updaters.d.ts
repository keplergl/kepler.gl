import {VisState} from './vis-state-updaters';
import {MapState} from './map-state-updaters';
import {ProviderState} from './provider-state-updaters';
import {AddDataToMaoPayload} from 'actions/actions';
import {FileCacheItem} from 'processors/file-handler';
import {LoadFileSuccessUpdaterAction} from 'actions/vis-state-actions';

export type KeplerGlState = {
  visState: VisState;
  mapState: MapState;
  mapStyle: any;
  uiState: any;
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