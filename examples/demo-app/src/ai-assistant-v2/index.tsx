import React, {useEffect} from 'react';
import {RoomStateProvider} from '@sqlrooms/room-store';
import {ThemeProvider, TooltipProvider, Toaster} from '@sqlrooms/ui';
import {roomStore, setReduxStore, setKeplerStateAccessors} from './store';
import {MainView} from './components/MainView';
import type {KeplerStateAccessors} from './types';

export {setReduxStore, setKeplerStateAccessors} from './store';

/**
 * The AI Assistant panel powered by sqlrooms.
 * Mount this where the old AiAssistantPanel was rendered.
 *
 * Pass the Redux store (the generic dispatch bridge) and, optionally, state
 * accessors for the kepler.gl visState and map boundary. Supplying the accessors
 * keeps this module free of any hard-coded redux state shape; any host app can
 * provide accessors matching its own store.
 */
export function AiAssistantPanel({
  reduxStore,
  stateAccessors
}: {
  reduxStore?: any;
  stateAccessors?: KeplerStateAccessors;
}) {
  useEffect(() => {
    if (reduxStore) {
      setReduxStore(reduxStore);
    }
    if (stateAccessors) {
      setKeplerStateAccessors(stateAccessors);
    }
  }, [reduxStore, stateAccessors]);

  useEffect(() => {
    roomStore.getState().room.initialize();
    return () => {
      roomStore.getState().room.destroy();
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="kepler-ai-theme">
      <RoomStateProvider roomStore={roomStore}>
        <TooltipProvider>
          <div className="dark h-full">
            <MainView />
          </div>
          <Toaster />
        </TooltipProvider>
      </RoomStateProvider>
    </ThemeProvider>
  );
}
