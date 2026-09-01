// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl from '@kepler.gl/components';
import {
  addDataToMap,
  addToDataset,
  refreshDataset,
  removeFromDataset,
  updateDatasetProps,
  wrapTo
} from '@kepler.gl/actions';
import {DatasetType} from '@kepler.gl/constants';
import {processArrowBatches, processGeojson} from '@kepler.gl/processors';
import {initApplicationConfig} from '@kepler.gl/utils';
import * as arrow from 'apache-arrow';

initApplicationConfig({enableAnnotations: false});

const MAP_ID = 'map';
const SIDEBAR_WIDTH = 300;
const DATASET_ID = 'live-vehicles';
const POINT_LAYER_ID = 'live-orbit-point';
const GEOJSON_LAYER_ID = 'live-orbit-geojson';
const LIVE_DATA_URL = process.env.LIVE_DATA_URL || 'http://localhost:4010/vehicles.csv';
const REFRESH_INTERVAL_MS = 300;
const AUTO_INTERVAL_MS = 800;
const MAX_HOST_ROWS = 20;
const TRACKER_ID = 'track-01';
const POLL_VEHICLE_ID = 'veh-01';
const GEOJSON_SEED_COUNT = 8;
const BUILDINGS_URL =
  'https://raw.githubusercontent.com/keplergl/kepler.gl-data/refs/heads/master/datasets/buildings-australia.geojson';
const MONASH = {lat: -37.8949, lng: 145.1443};

const SF = {lat: 37.7749, lng: -122.4194};
const COS_LAT = Math.cos((SF.lat * Math.PI) / 180);
const KM_PER_DEG_LAT = 111.32;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

type LiveMode = 'poll' | 'host';
type TableFormat = 'csv' | 'arrow' | 'geojson';

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
              getTable?: () => unknown;
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

function fieldValue(dataset: LiveDataset | undefined, name: string) {
  const col = dataset?.fields?.findIndex(field => field.name === name) ?? -1;
  if (col < 0 || !dataset?.dataContainer?.numRows()) {
    return undefined;
  }
  return dataset.dataContainer.valueAt(0, col);
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

function isArrowTable(dataset: LiveDataset | undefined): boolean {
  return typeof dataset?.dataContainer?.getTable === 'function';
}

function isGeojsonTable(dataset: LiveDataset | undefined): boolean {
  return (dataset?.fields || []).some(field => field.name === '_geojson');
}

function makeHostVehicle(seq: number, options?: {id?: string; ring?: number}) {
  const angle = seq * GOLDEN_ANGLE;
  const radiusKm = 5.2 + (seq % 8) * 0.35;
  const lat = SF.lat + (radiusKm / KM_PER_DEG_LAT) * Math.sin(angle);
  const lng = SF.lng + (radiusKm / (KM_PER_DEG_LAT * COS_LAT)) * Math.cos(angle);
  return {
    id: options?.id ?? `host-${String(seq).padStart(3, '0')}`,
    lat,
    lng,
    heading: ((angle * 180) / Math.PI + 360) % 360,
    speed: 0,
    ring: options?.ring ?? 4 + (seq % 3),
    progress: 0,
    orbit_s: 0,
    updated_at: new Date().toISOString()
  };
}

function seedVehicles() {
  return [0, 1, 2].map(index =>
    makeHostVehicle(index + 1, {
      id: `veh-${String(index + 1).padStart(2, '0')}`,
      ring: index + 1
    })
  );
}

function vehiclesToRowData(vehicles: Record<string, unknown>[]) {
  const names = Object.keys(vehicles[0]);
  return {
    fields: names.map(name => ({name})),
    rows: vehicles.map(row => names.map(name => row[name]))
  };
}

type BuildingFeature = {
  type?: string;
  properties?: Record<string, unknown> | null;
  geometry?: {type: string; coordinates: unknown} | null;
};

let buildingsCache: BuildingFeature[] | null = null;
let buildingsLoad: Promise<BuildingFeature[]> | null = null;

function loadBuildings(): Promise<BuildingFeature[]> {
  if (buildingsCache) {
    return Promise.resolve(buildingsCache);
  }
  if (!buildingsLoad) {
    buildingsLoad = fetch(BUILDINGS_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Buildings GeoJSON HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json: {features?: BuildingFeature[]}) => {
        const features = (json.features || []).filter(feature => feature?.geometry);
        if (!features.length) {
          throw new Error('Buildings GeoJSON had no features');
        }
        buildingsCache = features;
        return features;
      })
      .catch(error => {
        buildingsLoad = null;
        throw error;
      });
  }
  return buildingsLoad;
}

function buildingAt(seq: number): BuildingFeature {
  const features = buildingsCache;
  if (!features?.length) {
    throw new Error('Buildings GeoJSON is not loaded');
  }
  return features[seq % features.length];
}

function buildingRow(feature: BuildingFeature, id: string) {
  const properties = {
    id,
    land_use: String(feature.properties?.LAND_USE_T ?? ''),
    height: Number(feature.properties?.HEIGHT_AVE ?? 0),
    lga: String(feature.properties?.LGA_NAME ?? '')
  };
  const wrapped = {
    type: 'Feature' as const,
    properties,
    geometry: feature.geometry
  };
  return {_geojson: wrapped, ...properties};
}

function seedBuildingRows(features: BuildingFeature[]) {
  return features
    .slice(0, GEOJSON_SEED_COUNT)
    .map(feature =>
      buildingRow(feature, `bldg-${feature.properties?.TARGET_FID ?? feature.properties?.BF_FID}`)
    );
}

function nextHostBuildingRow(seq: number) {
  return buildingRow(
    buildingAt(GEOJSON_SEED_COUNT + seq - 1),
    `host-${String(seq).padStart(3, '0')}`
  );
}

function nextTrackerBuildingRow(seq: number) {
  return buildingRow(buildingAt(seq), TRACKER_ID);
}

const MAP_VIEW = {
  latitude: 37.7749,
  longitude: -122.4194,
  zoom: 12.2,
  pitch: 0,
  bearing: 0
};

const GEOJSON_MAP_VIEW = {
  latitude: MONASH.lat,
  longitude: MONASH.lng,
  zoom: 16,
  pitch: 0,
  bearing: 0
};

const POINT_LAYER_CONFIG = {
  id: POINT_LAYER_ID,
  type: 'point',
  config: {
    dataId: DATASET_ID,
    label: 'Live orbit',
    columns: {lat: 'lat', lng: 'lng', altitude: null},
    isVisible: true,
    visConfig: {radius: 24, filled: true, opacity: 0.85}
  },
  visualChannels: {
    colorField: {name: 'ring', type: 'integer'},
    colorScale: 'quantize'
  }
};

const GEOJSON_LAYER_CONFIG = {
  id: GEOJSON_LAYER_ID,
  type: 'geojson',
  config: {
    dataId: DATASET_ID,
    label: 'Monash buildings',
    columns: {geojson: '_geojson'},
    isVisible: true,
    visConfig: {filled: true, stroked: true, thickness: 0.6, radius: 16, opacity: 0.8}
  },
  visualChannels: {
    colorField: {name: 'land_use', type: 'string'},
    colorScale: 'ordinal'
  }
};

function mapConfig(layers: object[], mapState = MAP_VIEW) {
  return {
    version: 'v1' as const,
    config: {
      visState: {layers},
      mapState,
      mapStyle: {styleType: 'dark-matter'}
    }
  };
}

function buildAddDataToMap(format: TableFormat, mode: LiveMode, buildings?: BuildingFeature[]) {
  const options = {
    centerMap: false,
    autoCreateLayers: false,
    keepExistingConfig: false,
    layerVisConfig: {radius: 24, filled: true, opacity: 0.85}
  };

  if (format === 'geojson') {
    const rows = seedBuildingRows(buildings || buildingsCache || []);
    return {
      datasets: {
        info: {id: DATASET_ID, label: 'Monash buildings'},
        data: processGeojson({
          type: 'FeatureCollection',
          features: rows.map(row => row._geojson)
        })
      },
      options: {
        ...options,
        centerMap: true
      },
      config: mapConfig([GEOJSON_LAYER_CONFIG], GEOJSON_MAP_VIEW)
    };
  }

  if (format === 'arrow') {
    const table = arrow.tableFromJSON(seedVehicles());
    return {
      datasets: {
        info: {id: DATASET_ID, label: 'Live orbit'},
        data: processArrowBatches(table.batches)
      },
      options,
      config: mapConfig([POINT_LAYER_CONFIG])
    };
  }

  if (mode === 'host') {
    return {
      datasets: {
        info: {id: DATASET_ID, label: 'Live orbit'},
        data: vehiclesToRowData(seedVehicles())
      },
      options,
      config: mapConfig([POINT_LAYER_CONFIG])
    };
  }

  return {
    datasets: {
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
    options: {
      ...options,
      centerMap: true
    },
    config: mapConfig([POINT_LAYER_CONFIG])
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
        display: 'flex',
        marginBottom: 8,
        border: '1px solid #4a5160',
        borderRadius: 6,
        overflow: 'hidden'
      }}
    >
      {(
        [
          ['poll', 'Poll URL', true],
          ['host', 'Host rows', hostEnabled]
        ] as const
      ).map(([value, label, enabled]) => (
        <button
          key={value}
          type="button"
          disabled={!enabled}
          onClick={() => onChange(value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 0,
            cursor: enabled ? 'pointer' : 'default',
            background: mode === value ? '#6a7485' : 'transparent',
            color: enabled ? '#f7f7f7' : '#6a7485',
            fontWeight: mode === value ? 600 : 400,
            fontSize: 13
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function FormatToggle({
  format,
  onChange
}: {
  format: TableFormat;
  onChange: (next: TableFormat) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        marginBottom: 14,
        border: '1px solid #4a5160',
        borderRadius: 6,
        overflow: 'hidden'
      }}
    >
      {(
        [
          ['csv', 'CSV'],
          ['arrow', 'Arrow'],
          ['geojson', 'GeoJSON']
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          style={{
            flex: 1,
            padding: '7px 10px',
            border: 0,
            cursor: 'pointer',
            background: format === value ? '#4a6a4e' : 'transparent',
            color: '#f7f7f7',
            fontWeight: format === value ? 600 : 400,
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
        Switching to <strong>Host rows</strong> pauses the poll so you can append or delete without
        the next snapshot wiping your edits. <strong>Arrow</strong> / <strong>GeoJSON</strong> drop
        this Kepler instance and load a fresh table of that type — they do not convert this CSV.
      </p>
    </>
  );
}

function HostSidebar({
  dataset,
  autoTrail,
  keyedNote,
  geojsonLoading,
  geojsonError,
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
  autoTrail: boolean;
  keyedNote: string;
  geojsonLoading?: boolean;
  geojsonError?: string;
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
  const arrow = isArrowTable(dataset);
  const geojson = isGeojsonTable(dataset);

  const geojsonBusy = Boolean(geojsonLoading || geojsonError);

  return (
    <>
      {geojsonLoading ? (
        <p style={{margin: '0 0 12px', color: '#9ad0a8'}}>Fetching buildings GeoJSON…</p>
      ) : null}
      {geojsonError ? <p style={{margin: '0 0 12px', color: '#f19c99'}}>{geojsonError}</p> : null}
      <p style={{margin: '0 0 12px', color: '#c3c9d5'}}>
        Polling is off. The host app dispatches <code>addToDataset</code> /{' '}
        <code>removeFromDataset</code> so rows change in place — same layer id and style. Host
        points land on outer rings (4–6) and color by <code>ring</code>.
        {geojson || geojsonLoading || geojsonError
          ? ' This instance fetches Monash building footprints at runtime. Add pulls the next building from that file; Move tracker replaces one footprint in place.'
          : arrow
          ? ' This instance is an Arrow table: append/upsert concat batches; Move tracker replaces the matching id.'
          : ' Arrow and GeoJSON each remount Kepler with their own table — they do not convert these CSV rows.'}
      </p>
      <div style={{display: 'grid', gap: 8, marginBottom: 12}}>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>table</span>
          <span>
            {geojson ? 'GeoJSON features' : arrow ? 'ArrowDataContainer' : 'RowDataContainer'}
          </span>
        </div>
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
          <span
            style={{
              minWidth: 0,
              maxHeight: 52,
              overflowY: 'auto',
              textAlign: 'right',
              wordBreak: 'break-word'
            }}
          >
            {ids.length ? ids.join(', ') : '—'}
          </span>
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => onAdd(1)}
          disabled={!dataset || geojsonBusy}
        >
          Add 1
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => onAdd(5)}
          disabled={!dataset || geojsonBusy}
        >
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
        <code>{TRACKER_ID}</code> (ring 7); later clicks <strong>replace</strong> it
        {geojson ? ' with another building from the file' : arrow ? ' via Arrow concat' : ''} and
        the row count stays put. Removes use <code>{'{field, values}'}</code>, not a row index.
      </p>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
        <button
          type="button"
          style={buttonStyle}
          onClick={onUpsertTracker}
          disabled={!dataset || geojsonBusy}
        >
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
          disabled={!dataset || geojsonBusy}
        />
        Auto trail (add every 800ms, keep {MAX_HOST_ROWS} host rows)
      </label>
      <p style={{margin: '16px 0 0', color: '#c3c9d5'}}>
        <strong>Poll URL</strong> remounts the CSV poll instance — injected rows disappear.
      </p>
    </>
  );
}

function LiveDataSidebar({
  mode,
  tableFormat,
  geojsonLoading,
  geojsonError,
  onMode,
  onFormat
}: {
  mode: LiveMode;
  tableFormat: TableFormat;
  geojsonLoading: boolean;
  geojsonError: string;
  onMode: (next: LiveMode) => void;
  onFormat: (next: TableFormat) => void;
}) {
  const dispatch = useDispatch();
  const dataset = useSelector(
    (state: KeplerRootState) => state.keplerGl[MAP_ID]?.visState?.datasets?.[DATASET_ID]
  );
  const [autoTrail, setAutoTrail] = useState(false);
  const [keyedNote, setKeyedNote] = useState('');
  const hostSeq = useRef(1);
  const trackSeq = useRef(1);
  const datasetRef = useRef(dataset);
  datasetRef.current = dataset;

  const toKepler = useCallback(
    (action: unknown) => dispatch(wrapTo(MAP_ID, action as never)),
    [dispatch]
  );

  useEffect(() => {
    setAutoTrail(false);
    setKeyedNote('');
    hostSeq.current = 1;
    trackSeq.current = 1;
  }, [tableFormat, mode]);

  const addHostRows = useCallback(
    (count: number) => {
      if (isGeojsonTable(datasetRef.current)) {
        if (!buildingsCache?.length) {
          return;
        }
        const rows = Array.from({length: count}, () => nextHostBuildingRow(hostSeq.current++));
        toKepler(addToDataset(DATASET_ID, rows));
        return;
      }
      const rows = Array.from({length: count}, () => makeHostVehicle(hostSeq.current++));
      toKepler(addToDataset(DATASET_ID, rows));
    },
    [toKepler]
  );

  const removeLast = useCallback(() => {
    const rows = dataset?.dataContainer?.numRows?.() ?? 0;
    if (rows < 1) {
      return;
    }
    toKepler(removeFromDataset(DATASET_ID, rows - 1));
  }, [dataset, toKepler]);

  const removeRandom = useCallback(() => {
    const rows = dataset?.dataContainer?.numRows?.() ?? 0;
    if (rows < 1) {
      return;
    }
    toKepler(removeFromDataset(DATASET_ID, Math.floor(Math.random() * rows)));
  }, [dataset, toKepler]);

  const upsertTracker = useCallback(() => {
    const ids = rowIds(datasetRef.current);
    const existed = ids.includes(TRACKER_ID);
    const row = isGeojsonTable(datasetRef.current)
      ? buildingsCache?.length
        ? nextTrackerBuildingRow(trackSeq.current++)
        : null
      : makeHostVehicle(trackSeq.current++, {id: TRACKER_ID, ring: 7});
    if (!row) {
      return;
    }
    toKepler(addToDataset(DATASET_ID, row, {upsertBy: 'id'}));
    setKeyedNote(
      existed
        ? `upsert ${TRACKER_ID} (replaced — row count should stay ${ids.length})`
        : `upsert ${TRACKER_ID} (inserted — row count ${ids.length + 1})`
    );
  }, [toKepler]);

  const removeByFieldId = useCallback(
    (id: string) => {
      if (!rowIds(datasetRef.current).includes(id)) {
        return;
      }
      toKepler(removeFromDataset(DATASET_ID, {field: 'id', values: id}));
      setKeyedNote(`removeFromDataset({field: 'id', values: '${id}'})`);
    },
    [toKepler]
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
    if (mode !== 'host' || !autoTrail) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      const extras = hostRowIndexes(datasetRef.current);
      if (extras.length >= MAX_HOST_ROWS) {
        toKepler(removeFromDataset(DATASET_ID, extras[0]));
      }
      if (isGeojsonTable(datasetRef.current)) {
        if (!buildingsCache?.length) {
          return;
        }
        toKepler(addToDataset(DATASET_ID, nextHostBuildingRow(hostSeq.current++)));
      } else {
        toKepler(addToDataset(DATASET_ID, makeHostVehicle(hostSeq.current++)));
      }
    }, AUTO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoTrail, mode, toKepler]);

  return (
    <aside style={sidebarStyle}>
      <h2 style={{margin: '0 0 8px', fontSize: 16}}>Live data</h2>
      <ModeToggle
        mode={mode}
        hostEnabled={tableFormat !== 'csv' || (dataset?.dataContainer?.numRows?.() ?? 0) > 0}
        onChange={onMode}
      />
      <FormatToggle format={tableFormat} onChange={onFormat} />
      {mode === 'poll' ? (
        <PollSidebar dataset={dataset} />
      ) : (
        <HostSidebar
          dataset={dataset}
          autoTrail={autoTrail}
          keyedNote={keyedNote}
          geojsonLoading={tableFormat === 'geojson' ? geojsonLoading : false}
          geojsonError={tableFormat === 'geojson' ? geojsonError : ''}
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
  const [mode, setMode] = useState<LiveMode>('poll');
  const [tableFormat, setTableFormat] = useState<TableFormat>('csv');
  const [session, setSession] = useState(0);
  const [geojsonLoading, setGeojsonLoading] = useState(false);
  const [geojsonError, setGeojsonError] = useState('');
  const pollInstanceRef = useRef(true);

  const toKepler = useCallback(
    (action: unknown) => dispatch(wrapTo(MAP_ID, action as never)),
    [dispatch]
  );

  useEffect(() => {
    let cancelled = false;
    pollInstanceRef.current = tableFormat === 'csv' && mode === 'poll';

    async function loadMap() {
      if (tableFormat === 'geojson') {
        setGeojsonLoading(true);
        setGeojsonError('');
        try {
          const buildings = await loadBuildings();
          if (cancelled) {
            return;
          }
          toKepler(addDataToMap(buildAddDataToMap('geojson', mode, buildings) as never));
        } catch (error) {
          if (!cancelled) {
            setGeojsonError(error instanceof Error ? error.message : String(error));
          }
        } finally {
          if (!cancelled) {
            setGeojsonLoading(false);
          }
        }
        return;
      }
      setGeojsonLoading(false);
      setGeojsonError('');
      toKepler(addDataToMap(buildAddDataToMap(tableFormat, mode) as never));
    }

    loadMap();
    return () => {
      cancelled = true;
    };
    // session is the remount signal; format/mode are applied in the same React batch as session++
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, toKepler]);

  const remount = useCallback((nextFormat: TableFormat, nextMode: LiveMode) => {
    setTableFormat(nextFormat);
    setMode(nextMode);
    setSession(value => value + 1);
  }, []);

  const setLiveMode = useCallback(
    (next: LiveMode) => {
      if (next === 'poll') {
        if (tableFormat === 'csv' && pollInstanceRef.current) {
          setMode('poll');
          toKepler(
            updateDatasetProps(DATASET_ID, {metadata: {refreshIntervalMs: REFRESH_INTERVAL_MS}})
          );
          toKepler(refreshDataset(DATASET_ID));
          return;
        }
        remount('csv', 'poll');
        return;
      }
      if (tableFormat === 'csv' && pollInstanceRef.current) {
        setMode('host');
        toKepler(updateDatasetProps(DATASET_ID, {metadata: {refreshIntervalMs: 0}}));
        return;
      }
      if (tableFormat !== 'csv') {
        return;
      }
      remount('csv', 'host');
    },
    [remount, tableFormat, toKepler]
  );

  const setLiveTableFormat = useCallback(
    (next: TableFormat) => {
      if (next === tableFormat) {
        return;
      }
      remount(next, next === 'csv' ? 'poll' : 'host');
    },
    [remount, tableFormat]
  );

  return (
    <div style={{display: 'flex', width: '100%', height: '100%'}}>
      <div style={{position: 'relative', flex: 1, minWidth: 0}}>
        <KeplerGl
          key={session}
          mapboxApiAccessToken="pk.xxx.yyy"
          id={MAP_ID}
          width={Math.max(width - SIDEBAR_WIDTH, 0)}
          height={height}
        />
      </div>
      <LiveDataSidebar
        mode={mode}
        tableFormat={tableFormat}
        geojsonLoading={geojsonLoading}
        geojsonError={geojsonError}
        onMode={setLiveMode}
        onFormat={setLiveTableFormat}
      />
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
