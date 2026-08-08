// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useSelector} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import styled, {ThemeProvider} from 'styled-components';
import {Panel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels';

import {injectComponents} from '@kepler.gl/components';
import {SqlPanel} from '@kepler.gl/duckdb/components';
import keplerGlDuckdbPlugin, {KeplerGlDuckDbTable, DuckDBWasmAdapter} from '@kepler.gl/duckdb';
import keplerGlReducer, {enhanceReduxMiddleware, uiStateUpdaters} from '@kepler.gl/reducers';
import {panelBorderColor, theme} from '@kepler.gl/styles';
import {initApplicationConfig} from '@kepler.gl/utils';

import {replaceMapControl} from './map-control';

initApplicationConfig({
  plugins: [keplerGlDuckdbPlugin],
  table: KeplerGlDuckDbTable,
  database: new DuckDBWasmAdapter({
    config: {
      query: {
        castBigIntToDouble: true
      }
    }
  }),
  useArrowProgressiveLoading: false,
  enableAnnotations: false
});

const {DEFAULT_MAP_CONTROLS} = uiStateUpdaters;

const localeMessages = {
  en: {
    'tooltip.hideSQLPanel': 'Hide SQL Panel',
    'tooltip.showSQLPanel': 'Show SQL Panel'
  }
};

const reducers = combineReducers({
  keplerGl: keplerGlReducer.initialState({
    uiState: {
      readOnly: false,
      currentModal: 'addData',
      mapControls: {
        ...DEFAULT_MAP_CONTROLS,
        sqlPanel: {
          active: false,
          activeMapIndex: 0,
          disableClose: false,
          show: true
        }
      }
    }
  })
});

const middleWares = enhanceReduxMiddleware([]);
const enhancers = applyMiddleware(...middleWares);
const store = createStore(reducers, {}, compose(enhancers));

const KeplerGl = injectComponents([replaceMapControl()]);

const StyledResizeHandle = styled(PanelResizeHandle)`
  background-color: ${panelBorderColor};
  height: 5px;
  cursor: row-resize;

  &:hover {
    background-color: #555;
  }
`;

const AppShell = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background-color: #333;
`;

// luma.gl defaults `debug` to true whenever NODE_ENV !== 'production', which Vite
// sets during `vite dev`. That wraps the WebGL context in the Khronos debug layer
// and starts a GPU timer query per render pass. Globe mode issues several passes
// per frame and overlapping TIME_ELAPSED_EXT queries are illegal in WebGL2, so the
// debug layer throws and takes the app down.
const DECK_GL_PROPS = {deviceProps: {debug: false}};

const App = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({width: 0, height: 0});

  const isSqlPanelOpen = useSelector(
    (state: any) => Boolean(state?.keplerGl?.map?.uiState?.mapControls?.sqlPanel?.active)
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const {width, height} = entries[0].contentRect;
      setMapDimensions({width, height});
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <PanelGroup direction="vertical">
          <Panel defaultSize={isSqlPanelOpen ? 60 : 100} minSize={30}>
            <div ref={mapContainerRef} style={{width: '100%', height: '100%'}}>
              <KeplerGl
                mapboxApiAccessToken="pk.xxx.yyy"
                id="map"
                width={mapDimensions.width}
                height={mapDimensions.height}
                deckGlProps={DECK_GL_PROPS}
                localeMessages={localeMessages}
              />
            </div>
          </Panel>

          {isSqlPanelOpen && (
            <>
              <StyledResizeHandle />
              <Panel defaultSize={40} minSize={20}>
                <SqlPanel initialSql="" />
              </Panel>
            </>
          )}
        </PanelGroup>
      </AppShell>
    </ThemeProvider>
  );
};

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);
root.render(<Root />);
