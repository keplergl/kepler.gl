// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Provider, useDispatch, useSelector, useStore} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import 'maplibre-gl/dist/maplibre-gl.css';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl from '@kepler.gl/components';
import {
  addDataToMap,
  addToDataset,
  fitBounds,
  layerConfigChange,
  refreshDataset,
  removeFromDataset,
  updateDatasetProps,
  wrapTo
} from '@kepler.gl/actions';
import {DatasetType} from '@kepler.gl/constants';
import {ArrowDataContainer, initApplicationConfig} from '@kepler.gl/utils';
import {ARROW_DATASET_ID, createArrowDataset} from './arrow-data';

initApplicationConfig({enableAnnotations: false});

const MAP_ID = 'map';
const SIDEBAR_WIDTH = 300;
const DATASET_ID = 'live-vehicles';
const LIVE_DATA_URL = process.env.LIVE_DATA_URL || 'http://localhost:4010/vehicles.csv';
const LIVE_WS_URL = process.env.LIVE_WS_URL || 'ws://localhost:4010/vehicles.ws';
const REFRESH_INTERVAL_MS = 300;
const AUTO_INTERVAL_MS = 800;
const MAX_HOST_ROWS = 20;
const TRACKER_ID = 'track-01';
const POLL_VEHICLE_ID = 'veh-01';

const SF = {lat: 37.7749, lng: -122.4194};
const COS_LAT = Math.cos((SF.lat * Math.PI) / 180);
const KM_PER_DEG_LAT = 111.32;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

type LiveMode = 'poll' | 'host' | 'ws' | 'arrow';
type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

type KeplerRootState = {
  keplerGl: {
    [id: string]: {
      visState: {
        layers: Parameters<typeof layerConfigChange>[0][];
        datasets: Record<
          string,
          {
            fields?: {name: string}[];
            dataRevision?: number;
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

type LiveDataset = KeplerRootState['keplerGl'][string]['visState']['datasets'][string];

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

function fieldValue(dataset: LiveDataset | undefined, name: string, row = 0) {
  const col = dataset?.fields?.findIndex(field => field.name === name) ?? -1;
  if (col < 0 || !dataset?.dataContainer?.numRows()) {
    return undefined;
  }
  return dataset.dataContainer.valueAt(row, col);
}

function columnIndex(dataset: LiveDataset | undefined, name: string) {
  return dataset?.fields?.findIndex(field => field.name === name) ?? -1;
}

function rowIds(dataset: LiveDataset | undefined): string[] {
  const idCol = columnIndex(dataset, 'id');
  const rows = dataset?.dataContainer?.numRows?.() ?? 0;
  if (idCol < 0 || !rows) {
    return [];
  }
  const ids: string[] = [];
  for (let i = 0; i < rows; i++) {
    ids.push(String(dataset?.dataContainer?.valueAt(i, idCol) ?? ''));
  }
  return ids;
}

function hostRowIndexes(dataset: LiveDataset | undefined): number[] {
  return rowIds(dataset).reduce<number[]>((indexes, id, index) => {
    if (id.startsWith('host-')) {
      indexes.push(index);
    }
    return indexes;
  }, []);
}

function makeHostVehicle(seq: number, options?: {id?: string; ring?: number; speed?: number}) {
  const angle = seq * GOLDEN_ANGLE;
  const radiusKm = 5.2 + (seq % 8) * 0.35;
  const lat = SF.lat + (radiusKm / KM_PER_DEG_LAT) * Math.sin(angle);
  const lng = SF.lng + (radiusKm / (KM_PER_DEG_LAT * COS_LAT)) * Math.cos(angle);
  return {
    id: options?.id ?? `host-${String(seq).padStart(3, '0')}`,
    lat,
    lng,
    heading: ((angle * 180) / Math.PI + 360) % 360,
    speed: options?.speed ?? 0,
    ring: options?.ring ?? 4 + (seq % 3),
    progress: 0,
    orbit_s: 0,
    updated_at: new Date().toISOString()
  };
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

const buttonStyle: React.CSSProperties = {
  padding: '7px 10px',
  border: '1px solid #4a5160',
  borderRadius: 4,
  background: '#3a3f4b',
  color: '#f7f7f7',
  cursor: 'pointer',
  fontSize: 13
};

function ModeToggle({
  mode,
  hostEnabled,
  onChange
}: {
  mode: LiveMode;
  hostEnabled: boolean;
  onChange: (next: LiveMode) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        marginBottom: 14,
        border: '1px solid #4a5160',
        borderRadius: 6,
        overflow: 'hidden'
      }}
    >
      {(
        [
          ['poll', 'Poll URL', true],
          ['host', 'Host rows', hostEnabled],
          ['ws', 'WebSocket', hostEnabled],
          ['arrow', 'Arrow rows', true]
        ] as const
      ).map(([value, label, enabled]) => (
        <button
          key={value}
          type="button"
          disabled={!enabled}
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 0,
            cursor: enabled ? 'pointer' : 'default',
            background: mode === value ? '#6a7485' : 'transparent',
            color: enabled ? '#f7f7f7' : '#6a7485',
            fontWeight: mode === value ? 600 : 400,
            fontSize: 12
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function PollSidebar({dataset}: {dataset: LiveDataset | undefined}) {
  const progressAlongOrbit = fieldValue(dataset, 'progress');
  const orbitS = fieldValue(dataset, 'orbit_s');
  const updatedAt = fieldValue(dataset, 'updated_at');
  const lastFetchedAt = dataset?.metadata?.lastFetchedAt;
  const status = dataset?.metadata?.refreshStatus || (dataset ? 'idle' : 'loading');
  const progress = dataset?.metadata?.refreshProgress;

  return (
    <>
      <p style={{margin: '0 0 12px', color: '#c3c9d5'}}>
        CSV at <code>{LIVE_DATA_URL}</code> returns 3 points circling San Francisco (one loop every
        2 min). Kepler polls that URL and <strong>replaces the whole table</strong> without tearing
        down the point layer.
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
          <span style={{color: '#c3c9d5'}}>orbit</span>
          <span style={{fontSize: 20, fontWeight: 600}}>
            {progressAlongOrbit == null
              ? '—'
              : `${Math.round(Number(progressAlongOrbit) * 100)}% (${
                  orbitS == null ? '—' : `${Number(orbitS).toFixed(1)}s`
                } / 120s)`}
          </span>
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
        Layers panel: dataset refresh is 300ms. Click reload to sample the orbit immediately.
        Switching to <strong>Host rows</strong> or <strong>WebSocket</strong> pauses the poll so the
        next snapshot does not wipe injected rows.
      </p>
    </>
  );
}

function HostSidebar({
  dataset,
  arrowMode,
  autoTrail,
  keyedNote,
  onAutoTrail,
  onAdd,
  onRemoveLast,
  onRemoveRandom,
  onUpsertTracker,
  onRemoveTracker,
  onRemovePollVehicle,
  onRemoveLastHostById
}: {
  dataset: LiveDataset | undefined;
  arrowMode: boolean;
  autoTrail: boolean;
  keyedNote: string;
  onAutoTrail: (next: boolean) => void;
  onAdd: (count: number) => void;
  onRemoveLast: () => void;
  onRemoveRandom: () => void;
  onUpsertTracker: () => void;
  onRemoveTracker: () => void;
  onRemovePollVehicle: () => void;
  onRemoveLastHostById: () => void;
}) {
  const rows = dataset?.dataContainer?.numRows?.() ?? 0;
  const ids = rowIds(dataset);
  const hostCount = hostRowIndexes(dataset).length;
  const hasTracker = ids.includes(TRACKER_ID);
  const hasPollVehicle = ids.includes(POLL_VEHICLE_ID);
  const hostIds = ids.filter(id => id.startsWith('host-'));
  const lastHostId = hostIds[hostIds.length - 1];
  const trackerIndex = ids.indexOf(TRACKER_ID);
  const container = dataset?.dataContainer;

  return (
    <>
      <p style={{margin: '0 0 12px', color: '#c3c9d5'}}>
        Polling is off. The host app dispatches <code>addToDataset</code> /{' '}
        <code>removeFromDataset</code> so rows change in place — same layer id and style. Host
        points land on outer rings (4–6) and color by <code>ring</code>.
      </p>
      <p style={{margin: '0 0 12px', color: '#c3c9d5'}}>
        Storage:{' '}
        <output aria-label="Data storage">
          {container instanceof ArrowDataContainer
            ? `ArrowDataContainer · ${container.numChunks()} batch(es)`
            : container
            ? 'RowDataContainer'
            : 'loading'}
        </output>
        {' · Revision '}
        <output aria-label="Dataset revision">{dataset?.dataRevision ?? 0}</output>
      </p>
      <div style={{display: 'grid', gap: 8, marginBottom: 12}}>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>rows</span>
          <span>
            {rows} <span style={{color: '#c3c9d5'}}>({hostCount} host)</span>
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'flex-start'
          }}
        >
          <span style={{color: '#c3c9d5', flexShrink: 0}}>ids</span>
          <span style={{textAlign: 'right', wordBreak: 'break-word'}}>
            {ids.length ? ids.join(', ') : '—'}
          </span>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
        <button type="button" style={buttonStyle} onClick={() => onAdd(1)} disabled={!dataset}>
          Add 1
        </button>
        <button type="button" style={buttonStyle} onClick={() => onAdd(5)} disabled={!dataset}>
          Add 5
        </button>
        <button type="button" style={buttonStyle} onClick={onRemoveLast} disabled={rows < 1}>
          Remove last
        </button>
        <button type="button" style={buttonStyle} onClick={onRemoveRandom} disabled={rows < 1}>
          Remove random
        </button>
      </div>
      <p style={{margin: '16px 0 8px', fontWeight: 600}}>Keyed by id</p>
      <p style={{margin: '0 0 8px', color: '#c3c9d5'}}>
        <code>upsertBy: &apos;id&apos;</code> keeps the same row. First click inserts{' '}
        <code>{TRACKER_ID}</code> (ring 7); later clicks move it and the row count stays put.
        Removes use <code>{'{field, values}'}</code>, not a row index.
      </p>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
        <button type="button" style={buttonStyle} onClick={onUpsertTracker} disabled={!dataset}>
          {hasTracker ? 'Move tracker' : 'Insert tracker'}
        </button>
        <button type="button" style={buttonStyle} onClick={onRemoveTracker} disabled={!hasTracker}>
          Remove tracker
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={onRemovePollVehicle}
          disabled={!hasPollVehicle}
        >
          Remove {POLL_VEHICLE_ID}
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={onRemoveLastHostById}
          disabled={!lastHostId}
        >
          Remove last host
        </button>
      </div>
      <p style={{margin: '8px 0 0', color: hasTracker ? '#9ad0a8' : '#c3c9d5'}}>
        {TRACKER_ID}: {hasTracker ? 'on map' : 'missing'}
        {lastHostId ? ` · last host ${lastHostId}` : ''}
      </p>
      {keyedNote ? <p style={{margin: '6px 0 0', color: '#9ad0a8'}}>{keyedNote}</p> : null}
      {hasTracker ? (
        <p style={{margin: '6px 0 0', color: '#c3c9d5'}}>
          <output aria-label="Tracker position and speed">
            {Number(fieldValue(dataset, 'lat', trackerIndex)).toFixed(5)},{' '}
            {Number(fieldValue(dataset, 'lng', trackerIndex)).toFixed(5)}
            {' · speed '}
            {String(fieldValue(dataset, 'speed', trackerIndex))}
          </output>
        </p>
      ) : null}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 14,
          cursor: 'pointer',
          color: '#c3c9d5'
        }}
      >
        <input
          type="checkbox"
          checked={autoTrail}
          onChange={event => onAutoTrail(event.target.checked)}
          disabled={!dataset}
        />
        Auto trail (add every 800ms, keep {MAX_HOST_ROWS} host rows)
      </label>
      <p style={{margin: '16px 0 0', color: '#c3c9d5'}}>
        {arrowMode ? (
          <>
            This local Arrow dataset keeps its edits when you switch modes. Change its point radius
            or add a speed filter, then repeat edits to check the settings stay put.
          </>
        ) : (
          <>
            Switch back to <strong>Poll URL</strong> to resume HTTP snapshot replace — injected rows
            disappear on the next fetch.
          </>
        )}
      </p>
    </>
  );
}

function WsSidebar({
  dataset,
  status,
  lastAt,
  messageCount,
  error
}: {
  dataset: LiveDataset | undefined;
  status: WsStatus;
  lastAt: number | null;
  messageCount: number;
  error: string | null;
}) {
  const rows = dataset?.dataContainer?.numRows?.() ?? 0;
  const ids = rowIds(dataset);
  const wsIds = ids.filter(id => id.startsWith('ws-'));

  return (
    <>
      <p style={{margin: '0 0 12px', color: '#c3c9d5'}}>
        Kepler.gl has no websocket client. This host opens <code>{LIVE_WS_URL}</code> and maps each
        JSON message to <code>{"addToDataset(..., {upsertBy: 'id'})"}</code>. Three{' '}
        <code>ws-*</code> points (rings 8–10) move on a 20s loop. Layer id and style stay put;
        Kepler still rebuilds layer data on every message.
      </p>
      <div style={{display: 'grid', gap: 8, marginBottom: 12}}>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>socket</span>
          <span>{status}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>messages</span>
          <span>{messageCount}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>last upsert</span>
          <span>{lastAt ? new Date(lastAt).toLocaleTimeString() : '—'}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>rows</span>
          <span>
            {rows} <span style={{color: '#c3c9d5'}}>({wsIds.length} ws)</span>
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'flex-start'
          }}
        >
          <span style={{color: '#c3c9d5', flexShrink: 0}}>ws ids</span>
          <span style={{textAlign: 'right', wordBreak: 'break-word'}}>
            {wsIds.length ? wsIds.join(', ') : '—'}
          </span>
        </div>
      </div>
      {error ? <p style={{margin: '0 0 12px', color: '#f19c99'}}>{error}</p> : null}
      <p style={{margin: 0, color: '#c3c9d5'}}>
        Switch back to <strong>Poll URL</strong> to close the socket and restore the 3 CSV vehicles.
      </p>
    </>
  );
}

export function LiveDataSidebar() {
  const dispatch = useDispatch();
  const reduxStore = useStore<KeplerRootState>();
  const datasets = useSelector(
    (state: KeplerRootState) => state.keplerGl[MAP_ID]?.visState?.datasets
  );
  const [mode, setMode] = useState<LiveMode>('poll');
  const datasetId = mode === 'arrow' ? ARROW_DATASET_ID : DATASET_ID;
  const dataset = datasets?.[datasetId];
  const datasetReady = Boolean(dataset);
  const hasRowDataset = Boolean(datasets?.[DATASET_ID]);
  const hasArrowDataset = Boolean(datasets?.[ARROW_DATASET_ID]);
  const [autoTrail, setAutoTrail] = useState(false);
  const [keyedNote, setKeyedNote] = useState('');
  const [wsStatus, setWsStatus] = useState<WsStatus>('idle');
  const [wsLastAt, setWsLastAt] = useState<number | null>(null);
  const [wsCount, setWsCount] = useState(0);
  const [wsError, setWsError] = useState<string | null>(null);
  const hostSeq = useRef(1);
  const trackSeq = useRef(1);
  const arrowViewInitialized = useRef(false);
  const datasetRef = useRef(dataset);
  datasetRef.current = dataset;

  const toKepler = useCallback(
    (action: Parameters<ReturnType<typeof wrapTo>>[0]) => dispatch(wrapTo(MAP_ID, action)),
    [dispatch]
  );

  const setLiveMode = useCallback(
    (next: LiveMode) => {
      setMode(next);
      setKeyedNote('');
      if (next === 'arrow' && !arrowViewInitialized.current) {
        toKepler(
          fitBounds([SF.lng - 0.1, SF.lat - 0.08, SF.lng + 0.1, SF.lat + 0.08], {
            left: 320,
            right: 24,
            top: 24,
            bottom: 24
          })
        );
        arrowViewInitialized.current = true;
      }
      if (next === 'poll') {
        setAutoTrail(false);
        setKeyedNote('');
        setWsStatus('idle');
        setWsError(null);
        toKepler(
          updateDatasetProps(DATASET_ID, {metadata: {refreshIntervalMs: REFRESH_INTERVAL_MS}})
        );
        toKepler(refreshDataset(DATASET_ID));
        return;
      }
      setAutoTrail(false);
      if (next === 'ws') {
        setWsCount(0);
        setWsLastAt(null);
        setWsError(null);
      }
      toKepler(updateDatasetProps(DATASET_ID, {metadata: {refreshIntervalMs: 0}}));
    },
    [toKepler]
  );

  useEffect(() => {
    // Only switch visibility on mode/load transitions, so user styling and
    // visibility choices stay untouched during edits.
    const layers = reduxStore.getState().keplerGl[MAP_ID]?.visState.layers || [];
    layers.forEach(layer => {
      if (layer.config.dataId !== DATASET_ID && layer.config.dataId !== ARROW_DATASET_ID) return;
      const isVisible = layer.config.dataId === datasetId;
      if (layer.config.isVisible !== isVisible) {
        toKepler(layerConfigChange(layer, {isVisible}));
      }
    });
  }, [datasetId, hasRowDataset, hasArrowDataset, reduxStore, toKepler]);

  const addHostRows = useCallback(
    (count: number) => {
      const rows = Array.from({length: count}, () =>
        makeHostVehicle(hostSeq.current++, {
          speed: mode === 'arrow' ? 20 + (hostSeq.current % 8) * 5 : undefined
        })
      );
      toKepler(addToDataset(datasetId, rows));
    },
    [datasetId, mode, toKepler]
  );

  const removeLast = useCallback(() => {
    const rows = dataset?.dataContainer?.numRows?.() ?? 0;
    if (rows < 1) {
      return;
    }
    toKepler(removeFromDataset(datasetId, rows - 1));
  }, [dataset, datasetId, toKepler]);

  const removeRandom = useCallback(() => {
    const rows = dataset?.dataContainer?.numRows?.() ?? 0;
    if (rows < 1) {
      return;
    }
    toKepler(removeFromDataset(datasetId, Math.floor(Math.random() * rows)));
  }, [dataset, datasetId, toKepler]);

  const upsertTracker = useCallback(() => {
    const ids = rowIds(datasetRef.current);
    const existed = ids.includes(TRACKER_ID);
    const row = makeHostVehicle(trackSeq.current++, {
      id: TRACKER_ID,
      ring: 7,
      speed: mode === 'arrow' ? 20 + ((trackSeq.current * 7) % 60) : undefined
    });
    toKepler(addToDataset(datasetId, row, {upsertBy: 'id'}));
    setKeyedNote(
      existed
        ? `upsert ${TRACKER_ID} (replaced — row count should stay ${ids.length})`
        : `upsert ${TRACKER_ID} (inserted — row count ${ids.length + 1})`
    );
  }, [datasetId, mode, toKepler]);

  const removeByFieldId = useCallback(
    (id: string) => {
      if (!rowIds(datasetRef.current).includes(id)) {
        return;
      }
      toKepler(removeFromDataset(datasetId, {field: 'id', values: id}));
      setKeyedNote(`removeFromDataset({field: 'id', values: '${id}'})`);
    },
    [datasetId, toKepler]
  );

  const removeLastHostById = useCallback(() => {
    const hostIds = rowIds(datasetRef.current).filter(id => id.startsWith('host-'));
    const lastHostId = hostIds[hostIds.length - 1];
    if (!lastHostId) {
      return;
    }
    removeByFieldId(lastHostId);
  }, [removeByFieldId]);

  useEffect(() => {
    if ((mode !== 'host' && mode !== 'arrow') || !autoTrail || !datasetReady) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      const extras = hostRowIndexes(datasetRef.current);
      if (extras.length >= MAX_HOST_ROWS) {
        toKepler(removeFromDataset(datasetId, extras[0]));
      }
      addHostRows(1);
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoTrail, mode, datasetId, datasetReady, addHostRows, toKepler]);

  useEffect(() => {
    if (mode !== 'ws') {
      setWsStatus(current => (current === 'idle' ? current : 'idle'));
      return undefined;
    }

    let cancelled = false;
    let retryTimer: number | undefined;
    let socket: WebSocket | null = null;

    const connect = () => {
      if (cancelled) {
        return;
      }
      setWsStatus('connecting');
      setWsError(null);
      socket = new WebSocket(LIVE_WS_URL);
      socket.onopen = () => {
        if (!cancelled) {
          setWsStatus('open');
        }
      };
      socket.onmessage = event => {
        let message: {op?: string; rows?: Parameters<typeof addToDataset>[1]; upsertBy?: string};
        try {
          message = JSON.parse(String(event.data));
        } catch {
          return;
        }
        if (cancelled || message.op !== 'upsert' || !message.rows) {
          return;
        }
        toKepler(addToDataset(DATASET_ID, message.rows, {upsertBy: message.upsertBy || 'id'}));
        setWsCount(count => count + 1);
        setWsLastAt(Date.now());
      };
      socket.onerror = () => {
        if (!cancelled) {
          setWsStatus('error');
          setWsError(`Could not open ${LIVE_WS_URL}`);
        }
      };
      socket.onclose = () => {
        if (cancelled) {
          return;
        }
        setWsStatus('closed');
        retryTimer = window.setTimeout(connect, 1000);
      };
    };

    connect();
    return () => {
      cancelled = true;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
      socket?.close();
    };
  }, [mode, toKepler]);

  return (
    <aside style={sidebarStyle}>
      <h2 style={{margin: '0 0 8px', fontSize: 16}}>Live data</h2>
      <ModeToggle
        mode={mode}
        hostEnabled={(datasets?.[DATASET_ID]?.dataContainer?.numRows?.() ?? 0) > 0}
        onChange={setLiveMode}
      />
      {mode === 'poll' ? (
        <PollSidebar dataset={dataset} />
      ) : mode === 'ws' ? (
        <WsSidebar
          dataset={dataset}
          status={wsStatus}
          lastAt={wsLastAt}
          messageCount={wsCount}
          error={wsError}
        />
      ) : (
        <HostSidebar
          dataset={dataset}
          arrowMode={mode === 'arrow'}
          autoTrail={autoTrail}
          keyedNote={keyedNote}
          onAutoTrail={setAutoTrail}
          onAdd={addHostRows}
          onRemoveLast={removeLast}
          onRemoveRandom={removeRandom}
          onUpsertTracker={upsertTracker}
          onRemoveTracker={() => removeByFieldId(TRACKER_ID)}
          onRemovePollVehicle={() => removeByFieldId(POLL_VEHICLE_ID)}
          onRemoveLastHostById={removeLastHostById}
        />
      )}
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
          datasets: [
            {
              info: {
                id: DATASET_ID,
                label: 'Live orbit',
                type: DatasetType.EXTERNALLY_HOSTED
              },
              data: {fields: [], rows: []},
              metadata: {
                source: LIVE_DATA_URL,
                sourceFormat: 'csv',
                refreshIntervalMs: REFRESH_INTERVAL_MS
              }
            },
            createArrowDataset()
          ],
          options: {
            centerMap: true,
            autoCreateLayers: false,
            layerVisConfig: {radius: 24, filled: true, opacity: 0.85}
          },
          config: {
            version: 'v1',
            config: {
              visState: {
                layers: [
                  {
                    id: 'live-orbit-point',
                    type: 'point',
                    config: {
                      dataId: DATASET_ID,
                      label: 'Live orbit',
                      columns: {lat: 'lat', lng: 'lng'},
                      isVisible: true,
                      visConfig: {radius: 24, filled: true, opacity: 0.85}
                    },
                    visualChannels: {
                      colorField: {name: 'ring', type: 'integer'},
                      colorScale: 'quantize'
                    }
                  },
                  {
                    id: 'live-arrow-point',
                    type: 'point',
                    config: {
                      dataId: ARROW_DATASET_ID,
                      label: 'Live Arrow',
                      columns: {lat: 'lat', lng: 'lng'},
                      isVisible: false,
                      visConfig: {radius: 24, filled: true, opacity: 0.85}
                    },
                    visualChannels: {
                      colorField: {name: 'ring', type: 'integer'},
                      colorScale: 'quantize'
                    }
                  }
                ]
              },
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

export default Root;
