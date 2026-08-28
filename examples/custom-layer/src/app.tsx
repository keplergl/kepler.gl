// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl, {injectComponents, LayerConfiguratorFactory} from '@kepler.gl/components';
import {addDataToMap} from '@kepler.gl/actions';
import {LayerClasses} from '@kepler.gl/layers';
import {initApplicationConfig} from '@kepler.gl/utils';

import ContourKeplerLayer from './custom-contour-layer';

initApplicationConfig({enableAnnotations: false});

// ── Custom layer configurator ─────────────────────────────────────────────────
// kepler.gl dispatches to `_render${Type}LayerConfig` by convention.
// We wrap the built-in LayerConfiguratorFactory to add the `contour` handler.

function CustomLayerConfiguratorFactory(
  SourceDataSelector,
  VisConfigSlider,
  TextLabelPanel,
  LayerConfigGroup,
  ...rest
) {
  // Build the original configurator using all the same deps.
  const OriginalConfigurator = LayerConfiguratorFactory(
    SourceDataSelector,
    VisConfigSlider,
    TextLabelPanel,
    LayerConfigGroup,
    ...rest
  );

  // Subclass so we can add _renderContourLayerConfig while keeping everything else.
  class ContourAwareLayerConfigurator extends (OriginalConfigurator as any) {
    _renderContourLayerConfig({layer, visConfiguratorProps}) {
      return (
        <LayerConfigGroup label="Contour Settings" collapsible>
          <VisConfigSlider
            {...layer.visConfigSettings.cellRadius}
            focusRange={[0.1, 3]}
            focusWeight={0.2}
            {...visConfiguratorProps}
          />
          <VisConfigSlider
            {...layer.visConfigSettings.lowerThreshold}
            focusRange={[1, 20]}
            focusWeight={0.6}
            {...visConfiguratorProps}
          />
          <VisConfigSlider
            {...layer.visConfigSettings.higherThreshold}
            focusRange={[1, 20]}
            focusWeight={0.6}
            {...visConfiguratorProps}
          />
          <VisConfigSlider
            {...layer.visConfigSettings.opacity}
            {...visConfiguratorProps}
          />
        </LayerConfigGroup>
      );
    }
  }

  return ContourAwareLayerConfigurator;
}

// Mirror the deps list so kepler.gl can resolve them via its DI container.
CustomLayerConfiguratorFactory.deps = LayerConfiguratorFactory.deps;

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
    return ((s >>> 0) / 0xffffffff);
  };
}

function generateSampleRows(n: number): {lat: number; lng: number}[] {
  const rand = seedRandom(42);
  const centres = [
    {lat: 37.78, lng: -122.42, spread: 0.06}, // San Francisco downtown
    {lat: 37.87, lng: -122.27, spread: 0.04}, // Berkeley
    {lat: 37.68, lng: -122.08, spread: 0.05}  // Hayward
  ];
  const rows: {lat: number; lng: number}[] = [];
  for (let i = 0; i < n; i++) {
    const c = centres[Math.floor(rand() * centres.length)];
    rows.push({
      lat: c.lat + (rand() - 0.5) * c.spread * 2,
      lng: c.lng + (rand() - 0.5) * c.spread * 2
    });
  }
  return rows;
}

const sampleRows = generateSampleRows(500);

const sampleData = {
  info: {
    label: 'Bay Area Points',
    id: 'bay_area_points'
  },
  data: {
    fields: [
      {name: 'lat', format: '', type: 'real'},
      {name: 'lng', format: '', type: 'real'}
    ],
    rows: sampleRows.map(r => [r.lat, r.lng])
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
            label: 'Density Contours',
            color: [253, 141, 60],
            columns: {
              lat: 'lat',
              lng: 'lng'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              cellRadius: 2,
              lowerThreshold: 2,
              higherThreshold: 8
            }
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {bay_area_points: [{name: 'lat'}, {name: 'lng'}]},
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
      dragRotate: false,
      latitude: 37.78,
      longitude: -122.3,
      pitch: 0,
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
    dispatch(
      addDataToMap({
        datasets: sampleData,
        config: mapConfig,
        options: {centerMap: true}
      })
    );
  }, [dispatch]);

  return (
    <KeplerGlWithContour
      mapboxApiAccessToken="pk.xxx.yyy"
      id="map"
      width={width}
      height={height}
    />
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
