import React, {useEffect} from 'react';
import {RoomStateProvider} from '@sqlrooms/room-store';
import {ThemeProvider, TooltipProvider, Toaster} from '@sqlrooms/ui';
import {roomStore, setReduxStore} from './store';
import {MainView} from './components/MainView';

export {setReduxStore} from './store';

/**
 * The AI Assistant panel powered by sqlrooms.
 * Mount this where the old AiAssistantPanel was rendered.
 * Pass the Redux store to bridge with kepler.gl state.
 */
export function AiAssistantPanel({reduxStore}: {reduxStore?: any}) {
  useEffect(() => {
    if (reduxStore) {
      setReduxStore(reduxStore);
    }
  }, [reduxStore]);

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
