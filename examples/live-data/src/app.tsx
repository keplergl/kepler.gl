// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl from '@kepler.gl/components';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import {DatasetType} from '@kepler.gl/constants';
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableAnnotations: false});

const MAP_ID = 'map';
const SIDEBAR_WIDTH = 280;
const DATASET_ID = 'live-vehicles';
const LIVE_DATA_URL = process.env.LIVE_DATA_URL || 'http://localhost:4010/vehicles.csv';
const REFRESH_INTERVAL_MS = 10_000;

type KeplerRootState = {
  keplerGl: {
    [id: string]: {
      visState: {
        datasets: Record<
          string,
          {
            fields?: {name: string}[];
            dataContainer?: {
              numRows: () => number;
              valueAt: (row: number, col: number) => unknown;
            };
            metadata?: {
              refreshStatus?: string;
              refreshError?: string;
              refreshProgress?: number;
              lastFetchedAt?: number;
              refreshIntervalMs?: number;
            };
          }
        >;
      };
    };
  };
};

const reducers = combineReducers({
  keplerGl: keplerGlReducer.initialState({
    mapStyle: {
      styleType: 'dark-matter'
    },
    uiState: {
      readOnly: false,
      currentModal: null
    }
  })
});

const middlewares = enhanceReduxMiddleware([]);
const enhancers = applyMiddleware(...middlewares);
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, {}, composeEnhancers(enhancers));

function fieldValue(
  dataset: KeplerRootState['keplerGl'][string]['visState']['datasets'][string] | undefined,
  name: string
) {
  const col = dataset?.fields?.findIndex(field => field.name === name) ?? -1;
  if (col < 0 || !dataset?.dataContainer?.numRows()) {
    return undefined;
  }
  return dataset.dataContainer.valueAt(0, col);
}

function useWindowSize() {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  useEffect(() => {
    const onResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

const sidebarStyle: React.CSSProperties = {
  width: SIDEBAR_WIDTH,
  height: '100%',
  padding: 16,
  overflow: 'auto',
  background: '#242730',
  color: '#f7f7f7',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: 13,
  lineHeight: 1.45,
  flexShrink: 0
};

function LiveDataSidebar() {
  const dataset = useSelector(
    (state: KeplerRootState) => state.keplerGl[MAP_ID]?.visState?.datasets?.[DATASET_ID]
  );
  const snapshot = fieldValue(dataset, 'snapshot');
  const updatedAt = fieldValue(dataset, 'updated_at');
  const lastFetchedAt = dataset?.metadata?.lastFetchedAt;
  const status = dataset?.metadata?.refreshStatus || (dataset ? 'idle' : 'loading');
  const progress = dataset?.metadata?.refreshProgress;

  return (
    <aside style={sidebarStyle}>
      <h2 style={{margin: '0 0 8px', fontSize: 16}}>Live vehicles</h2>
      <p style={{margin: '0 0 12px', color: '#c3c9d5'}}>
        CSV at <code>{LIVE_DATA_URL}</code> is rewritten every 10s. Kepler polls it and replaces the
        table without tearing down the point layer.
      </p>
      <div style={{display: 'grid', gap: 8}}>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>status</span>
          <span>
            {status}
            {status === 'loading' && typeof progress === 'number' ? ` ${progress}%` : ''}
          </span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>snapshot</span>
          <span style={{fontSize: 20, fontWeight: 600}}>{snapshot ?? '—'}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>updated_at</span>
          <span>{updatedAt == null ? '—' : String(updatedAt)}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>last fetch</span>
          <span>{lastFetchedAt ? new Date(lastFetchedAt).toLocaleTimeString() : '—'}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>rows</span>
          <span>{dataset?.dataContainer?.numRows?.() ?? 0}</span>
        </div>
      </div>
      {dataset?.metadata?.refreshError ? (
        <p style={{margin: '12px 0 0', color: '#f19c99'}}>{dataset.metadata.refreshError}</p>
      ) : null}
      <p style={{margin: '16px 0 0', color: '#c3c9d5'}}>
        In the Layers panel, the dataset refresh control should show 10s. Click the reload icon, or
        open <code>?fresh=1</code> on the CSV URL, to fetch immediately.
      </p>
    </aside>
  );
}

const App = () => {
  const dispatch = useDispatch();
  const {width, height} = useWindowSize();

  useEffect(() => {
    dispatch(
      wrapTo(
        MAP_ID,
        addDataToMap({
          datasets: {
            info: {
              id: DATASET_ID,
              label: 'Live vehicles',
              type: DatasetType.EXTERNALLY_HOSTED
            },
            data: {fields: [], rows: []},
            metadata: {
              source: LIVE_DATA_URL,
              sourceFormat: 'csv',
              refreshIntervalMs: REFRESH_INTERVAL_MS
            }
          },
          options: {
            centerMap: true,
            autoCreateLayers: true,
            layerVisConfig: {radius: 24, filled: true, opacity: 0.85}
          },
          config: {
            version: 'v1',
            config: {
              mapState: {
                latitude: 37.7749,
                longitude: -122.4194,
                zoom: 12.2,
                pitch: 0,
                bearing: 0
              },
              mapStyle: {
                styleType: 'dark-matter'
              }
            }
          }
        })
      )
    );
  }, [dispatch]);

  return (
    <div style={{display: 'flex', width: '100%', height: '100%'}}>
      <div style={{position: 'relative', flex: 1, minWidth: 0}}>
        <KeplerGl
          mapboxApiAccessToken="pk.xxx.yyy"
          id={MAP_ID}
          width={Math.max(width - SIDEBAR_WIDTH, 0)}
          height={height}
        />
      </div>
      <LiveDataSidebar />
    </div>
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
