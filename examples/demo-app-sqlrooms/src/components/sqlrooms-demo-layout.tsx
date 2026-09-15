// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {
  createBaseRoomSlice,
  createCommandSlice,
  persistSliceConfigs,
  registerCommandsForOwner,
  createRoomStore,
  RoomStateProvider,
  type CommandSliceState,
  type BaseRoomStoreState
} from '@sqlrooms/room-store';
import {createLayoutSlice, LayoutRenderer, type LayoutSliceState} from '@sqlrooms/layout';
import {Toaster, TooltipProvider} from '@sqlrooms/ui';
import {useStore} from 'zustand';
import {createDuckDbSlice, type DuckDbSliceState} from '@sqlrooms/duckdb';
import {borrowSqlConnector, getSqlConnector} from './sql-connector';
import {
  getAllCommands,
  getKeplerContext,
  KEPLER_COMMAND_OWNER,
  setStoreConnectorProvider
} from '@openassistant/kepler-assistant/integration';
import type {AiSliceState, AiSettingsSliceState} from '@sqlrooms/ai';
import {
  assistantPersistence,
  createAssistantSlice,
  connectAssistantToMap,
  type AssistantHost
} from './assistant';

type DemoPanels = {map: ReactNode; sql: ReactNode; assistant: ReactNode};
const PanelContent = createContext<DemoPanels>({map: null, sql: null, assistant: null});
const MapPanel = () => <>{useContext(PanelContent).map}</>;
const SqlPanel = () => <>{useContext(PanelContent).sql}</>;
const AssistantPanel = () => <>{useContext(PanelContent).assistant}</>;

export type DemoRoomState = BaseRoomStoreState &
  LayoutSliceState &
  DuckDbSliceState &
  CommandSliceState &
  AiSliceState &
  AiSettingsSliceState;

// One room owns layout, AI, settings, commands, and shared database access.
// Kepler's Redux store owns maps, loading, exports, and cloud providers.
// Extensions register panels with roomStore.getState().layout.registerPanel().
export function createDemoRoomStore(sqlEnabled = true) {
  setStoreConnectorProvider(getSqlConnector);
  const {roomStore} = createRoomStore<DemoRoomState>(
    persistSliceConfigs<DemoRoomState>(assistantPersistence, (set, get, store) => ({
      ...createBaseRoomSlice()(set, get, store),
      ...createCommandSlice({
        middleware: [
          async (command, _input, _context, next) => {
            const result = await next();
            if (!command.metadata?.readOnly) {
              await get().db.refreshTableSchemas().catch(get().room.captureException);
            }
            return result;
          }
        ]
      })(set, get, store),
      ...createAssistantSlice(set, get, store),
      ...createDuckDbSlice({connector: borrowSqlConnector()})(set, get, store),
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
    }))
  );
  registerCommandsForOwner(
    roomStore,
    KEPLER_COMMAND_OWNER,
    Object.values(getAllCommands(getKeplerContext()))
  );
  return roomStore;
}

export function SqlroomsDemoLayout({
  map,
  sql,
  assistant,
  sqlOpen,
  sqlEnabled,
  assistantOpen,
  assistantHost,
  onPanelOpenChange
}: DemoPanels & {
  sqlOpen: boolean;
  sqlEnabled: boolean;
  assistantOpen: boolean;
  assistantHost: AssistantHost;
  onPanelOpenChange: (panelId: string, open: boolean) => void;
}) {
  const [roomStore] = useState(() => createDemoRoomStore(sqlEnabled));
  const layout = useStore(roomStore, state => state.layout);
  useEffect(() => connectAssistantToMap(roomStore, assistantHost), [roomStore, assistantHost]);
  useEffect(
    () => () => {
      const {room} = roomStore.getState();
      void room.destroy().catch(room.captureException);
    },
    [roomStore]
  );
  useEffect(() => {
    roomStore.getState().layout.setCollapsed('sql', !sqlOpen);
    roomStore.getState().layout.setCollapsed('assistant', !assistantOpen);
  }, [roomStore, sqlOpen, assistantOpen]);
  if (!layout.config) return null;
  return (
    <RoomStateProvider roomStore={roomStore}>
      <TooltipProvider>
        <PanelContent.Provider
          value={{map, sql: sqlOpen ? sql : null, assistant: assistantOpen ? assistant : null}}
        >
          <LayoutRenderer
            className="sqlrooms-demo-layout h-full"
            rootLayout={layout.config}
            onLayoutChange={next => next && layout.setConfig(next)}
            onCollapse={panelId => onPanelOpenChange(panelId, false)}
            onExpand={panelId => onPanelOpenChange(panelId, true)}
          />
        </PanelContent.Provider>
        <Toaster />
      </TooltipProvider>
    </RoomStateProvider>
  );
}
