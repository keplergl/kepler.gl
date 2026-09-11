// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {
  MapStateActions,
  MapStyleActions,
  ProviderActions,
  UIStateActions,
  VisStateActions
} from '@kepler.gl/actions';
import {makeGetActionCreators} from '@kepler.gl/components';
import {KeplerGlState} from '@kepler.gl/reducers';
import {useMemo} from 'react';
import {KeplerAction, useStoreWithKepler} from '../KeplerSlice';

const keplerActionSelector = makeGetActionCreators();
export type KeplerActions = {
  uiStateActions: typeof UIStateActions;
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
  mapStyleActions: typeof MapStyleActions;
  providerActions: typeof ProviderActions;
  dispatch: (action: KeplerAction) => void;
};
export function useKeplerStateActions({mapId}: {mapId: string}): {
  keplerActions: KeplerActions;
  keplerState: KeplerGlState | undefined;
} {
  const dispatchAction = useStoreWithKepler(state => state.kepler.dispatchAction);

  const forwardToDispatch = useMemo(
    () => (action: KeplerAction) => dispatchAction(mapId, action),
    [mapId, dispatchAction]
  );

  const keplerState = useStoreWithKepler(state => {
    return state.kepler.map[mapId];
  });

  const keplerActions = useMemo(
    () => keplerActionSelector(forwardToDispatch, {}),
    [forwardToDispatch]
  );

  return {keplerActions, keplerState};
}
