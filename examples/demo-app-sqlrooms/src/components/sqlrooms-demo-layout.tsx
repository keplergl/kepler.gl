// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {
  createBaseRoomSlice,
  createRoomStore,
  RoomStateProvider,
  type BaseRoomStoreState
} from '@sqlrooms/room-store';
import {createLayoutSlice, LayoutRenderer, type LayoutSliceState} from '@sqlrooms/layout';
import {useStore} from 'zustand';

type DemoPanels = {map: ReactNode; sql: ReactNode; assistant: ReactNode};
const PanelContent = createContext<DemoPanels>({map: null, sql: null, assistant: null});
const MapPanel = () => <>{useContext(PanelContent).map}</>;
const SqlPanel = () => <>{useContext(PanelContent).sql}</>;
const AssistantPanel = () => <>{useContext(PanelContent).assistant}</>;

type DemoRoomState = BaseRoomStoreState & LayoutSliceState;

// The room owns panel composition and sizes. Kepler's existing Redux store
// remains the owner of maps, loading, exports, providers, and the assistant.
// Extensions register panels with roomStore.getState().layout.registerPanel().
export function createDemoRoomStore(sqlEnabled = true) {
  return createRoomStore<DemoRoomState>((set, get, store) => ({
    ...createBaseRoomSlice()(set, get, store),
    ...createLayoutSlice({
      config: {
        id: 'workspace',
        type: 'split',
        direction: 'row',
        children: [
          {
            id: 'map-and-sql',
            type: 'split',
            direction: 'column',
            defaultSize: '70%',
            children: [
              {
                id: 'map',
                type: 'tabs',
                panel: 'map',
                children: [],
                activeTabIndex: 0,
                hideTabStrip: true,
                defaultSize: '60%'
              },
              ...(sqlEnabled
                ? [
                    {
                      id: 'sql',
                      type: 'tabs' as const,
                      panel: 'sql',
                      children: [],
                      activeTabIndex: 0,
                      hideTabStrip: true,
                      defaultSize: '40%',
                      minSize: '20%',
                      collapsible: true,
                      collapsed: true,
                      collapsedSize: 0
                    }
                  ]
                : [])
            ]
          },
          {
            id: 'assistant',
            type: 'tabs',
            panel: 'assistant',
            children: [],
            activeTabIndex: 0,
            hideTabStrip: true,
            defaultSize: '30%',
            minSize: '20%',
            collapsible: true,
            collapsed: true,
            collapsedSize: 0
          }
        ]
      },
      panels: {
        map: {title: 'Map', component: MapPanel},
        sql: {title: 'SQL', component: SqlPanel},
        assistant: {title: 'AI Assistant', component: AssistantPanel}
      }
    })(set, get, store)
  })).roomStore;
}

export function SqlroomsDemoLayout({
  map,
  sql,
  assistant,
  sqlOpen,
  sqlEnabled,
  assistantOpen,
  onPanelOpenChange
}: DemoPanels & {
  sqlOpen: boolean;
  sqlEnabled: boolean;
  assistantOpen: boolean;
  onPanelOpenChange: (panelId: string, open: boolean) => void;
}) {
  const [roomStore] = useState(() => createDemoRoomStore(sqlEnabled));
  const layout = useStore(roomStore, state => state.layout);
  useEffect(() => {
    roomStore.getState().layout.setCollapsed('sql', !sqlOpen);
    roomStore.getState().layout.setCollapsed('assistant', !assistantOpen);
  }, [roomStore, sqlOpen, assistantOpen]);
  if (!layout.config) return null;
  return (
    <RoomStateProvider roomStore={roomStore}>
      <PanelContent.Provider
        value={{map, sql: sqlOpen ? sql : null, assistant: assistantOpen ? assistant : null}}
      >
        <LayoutRenderer
          className="h-full"
          rootLayout={layout.config}
          onLayoutChange={next => next && layout.setConfig(next)}
          onCollapse={panelId => onPanelOpenChange(panelId, false)}
          onExpand={panelId => onPanelOpenChange(panelId, true)}
        />
      </PanelContent.Provider>
    </RoomStateProvider>
  );
}
