// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createContext, useEffect, useRef} from 'react';
import type {CameraTour, MapState, UiState} from '@kepler.gl/types';
import type {MapStateActions} from '@kepler.gl/actions';
import useCameraTourPlayback from './use-camera-tour-playback';

export const CameraTourPlaybackContext = createContext<ReturnType<
  typeof useCameraTourPlayback
> | null>(null);

/** One clock per map, shared by programmatic controls and the interactions panel. */
export default function CameraTourPlaybackProvider({
  tour,
  mapState,
  updateMap,
  enabled,
  request,
  children
}: {
  tour?: CameraTour | null;
  mapState: MapState;
  updateMap: typeof MapStateActions.updateMap;
  enabled: boolean;
  request?: UiState['cameraTourPlaybackRequest'];
  children: React.ReactNode;
}) {
  const supported = !mapState.isSplit && !mapState.globe?.enabled;
  const playback = useCameraTourPlayback(tour, updateMap, supported && enabled);
  const consumed = useRef<typeof request>(undefined);
  useEffect(() => {
    if (!request || consumed.current === request) return;
    consumed.current = request;
    if (request.action === 'play') playback.play();
    else if (request.action === 'seek') playback.seek(request.elapsedMs);
    else playback.pause();
  }, [request, playback]);
  return (
    <CameraTourPlaybackContext.Provider value={playback}>
      {children}
    </CameraTourPlaybackContext.Provider>
  );
}
