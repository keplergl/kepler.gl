// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import 'maplibre-gl/dist/maplibre-gl.css';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl, {injectComponents, LayerConfiguratorFactory} from '@kepler.gl/components';
import {addDataToMap, loadFiles, setMapViewMode} from '@kepler.gl/actions';
import {LayerClasses} from '@kepler.gl/layers';
import {initApplicationConfig} from '@kepler.gl/utils';

import ContourKeplerLayer from './custom-contour-layer';
import {CustomLayerConfiguratorFactory} from './contour-layer-configurator';

initApplicationConfig({enableAnnotations: false});

// ── Custom layer configurator ─────────────────────────────────────────────────
// The factory lives in a shared module so the demo app can register the same
// custom layer and configurator.

const KeplerGlWithContour = injectComponents([
  [LayerConfiguratorFactory, CustomLayerConfiguratorFactory]
]);

// ── Store ─────────────────────────────────────────────────────────────────────

const customizedKeplerGlReducer = keplerGlReducer.initialState({
  mapStyle: {
    styleType: 'dark-matter'
  },
  visState: {
    layerClasses: {
      ...LayerClasses,
      contour: ContourKeplerLayer
    }
  }
});

const reducers = combineReducers({
  keplerGl: customizedKeplerGlReducer
});

const middlewares = enhanceReduxMiddleware([]);
const enhancers = applyMiddleware(...middlewares);
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, {}, composeEnhancers(enhancers));

// ── Sample data ──────────────────────────────────────────────────────────────

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

type SampleRow = {lat: number; lng: number; elevation: number};

// Smooth synthetic terrain so the surface and its elevation coloring are
// immediately visible without an external DEM.
function terrainElevation(lat: number, lng: number): number {
  const hills = [
    {lat: 37.78, lng: -122.42, height: 420, spread: 0.045}, // San Francisco
    {lat: 37.87, lng: -122.27, height: 300, spread: 0.035}, // Berkeley
    {lat: 37.68, lng: -122.08, height: 520, spread: 0.04}, // Hayward
    {lat: 37.75, lng: -122.15, height: -90, spread: 0.05} // bay / valley
  ];
  const elevation = hills.reduce((height, hill) => {
    const dLat = lat - hill.lat;
    const dLng = (lng - hill.lng) * Math.cos((lat * Math.PI) / 180);
    const distanceSq = dLat * dLat + dLng * dLng;
    return height + hill.height * Math.exp(-distanceSq / (2 * hill.spread * hill.spread));
  }, 20);
  return Math.max(0, elevation);
}

function generateSampleRows(n: number): SampleRow[] {
  const rand = seedRandom(42);
  const centres = [
    {lat: 37.78, lng: -122.42, spread: 0.06}, // San Francisco downtown
    {lat: 37.87, lng: -122.27, spread: 0.04}, // Berkeley
    {lat: 37.68, lng: -122.08, spread: 0.05} // Hayward
  ];
  const rows: SampleRow[] = [];
  for (let i = 0; i < n; i++) {
    const c = centres[Math.floor(rand() * centres.length)];
    const lat = c.lat + (rand() - 0.5) * c.spread * 2;
    const lng = c.lng + (rand() - 0.5) * c.spread * 2;
    rows.push({lat, lng, elevation: terrainElevation(lat, lng)});
  }
  return rows;
}

const sampleRows = generateSampleRows(500);

const sampleData = {
  info: {
    label: 'Bay Area Elevation Points',
    id: 'bay_area_points'
  },
  data: {
    fields: [
      {name: 'lat', format: '', type: 'real'},
      {name: 'lng', format: '', type: 'real'},
      {name: 'elevation', format: '', type: 'real'}
    ],
    rows: sampleRows.map(r => [r.lat, r.lng, r.elevation])
  }
};

const mapConfig = {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: 'contour-demo',
          type: 'contour',
          config: {
            dataId: 'bay_area_points',
            label: 'Elevation Surface',
            color: [253, 141, 60],
            columns: {
              lat: 'lat',
              lng: 'lng'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.9,
              cellRadius: 2,
              lowerThreshold: 2,
              higherThreshold: 8,
              renderMode: 'surface',
              elevationScale: 3000,
              smoothing: 1,
              weightColumn: 'elevation',
              showContours: true,
              contourCount: 8
            }
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            bay_area_points: [{name: 'lat'}, {name: 'lng'}, {name: 'elevation'}]
          },
          compareMode: false,
          compareType: 'absolute',
          enabled: true
        }
      },
      layerBlending: 'normal',
      splitMaps: []
    },
    mapState: {
      bearing: 0,
      dragRotate: true,
      latitude: 37.78,
      longitude: -122.3,
      pitch: 45,
      zoom: 9,
      isSplit: false
    },
    mapStyle: {
      styleType: 'dark-matter',
      topLayerGroups: {},
      visibleLayerGroups: {}
    }
  }
};

// ── Window size hook ─────────────────────────────────────────────────────────

function useWindowSize() {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  useEffect(() => {
    const onResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

// ── App component ────────────────────────────────────────────────────────────

const App = () => {
  const dispatch = useDispatch();
  const {width, height} = useWindowSize();

  useEffect(() => {
    const loadSample = () => {
      dispatch(
        addDataToMap({
          datasets: sampleData,
          config: mapConfig,
          options: {centerMap: false}
        })
      );
      // The saved map state may not carry the newer view-mode field; set it
      // explicitly so the demo opens with the surface in perspective.
      dispatch(setMapViewMode('MODE_3D'));
    };

    const mapUrl = new URLSearchParams(window.location.search).get('mapUrl');
    if (!mapUrl) {
      loadSample();
      return;
    }

    fetch(mapUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${mapUrl}: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => dispatch(loadFiles([new File([blob], 'map.json')])))
      .catch(error => {
        console.error(error);
        loadSample();
      });
  }, [dispatch]);

  return (
    <KeplerGlWithContour mapboxApiAccessToken="pk.xxx.yyy" id="map" width={width} height={height} />
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
