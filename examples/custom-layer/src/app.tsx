// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import 'maplibre-gl/dist/maplibre-gl.css';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl, {
  injectComponents,
  ItemSelector,
  LayerColorRangeSelector,
  LayerColorSelector,
  LayerConfiguratorFactory,
  VisConfigSwitch
} from '@kepler.gl/components';
import {addDataToMap, setMapViewMode} from '@kepler.gl/actions';
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
    _renderContourLayerConfig({layer, visConfiguratorProps, layerChannelConfigProps}) {
      const modeOptions = (
        layer.visConfigSettings.renderMode?.options || ['contour', 'surface']
      ).map(mode => ({
        id: mode,
        label: mode === 'surface' ? '3D surface' : 'Contour lines'
      }));
      const selectedMode =
        modeOptions.find(({id}) => id === layer.config.visConfig.renderMode) || modeOptions[0];
      const isSurface = layer.config.visConfig.renderMode === 'surface';

      const COUNT_WEIGHT_ID = '__count__';
      const weightOptions = [
        {id: COUNT_WEIGHT_ID, label: 'Point count (density)'},
        ...(layerChannelConfigProps?.fields || [])
          .filter(field => field.type === 'real' || field.type === 'integer')
          .map(field => ({id: field.name, label: field.name}))
      ];
      const selectedWeight =
        weightOptions.find(
          option => option.id === (layer.config.visConfig.weightColumn || COUNT_WEIGHT_ID)
        ) || weightOptions[0];

      return (
        <>
          <LayerConfigGroup label="Render mode">
            <ItemSelector
              selectedItems={selectedMode}
              options={modeOptions}
              displayOption="label"
              getOptionValue="id"
              multiSelect={false}
              searchable={false}
              onChange={value => visConfiguratorProps.onChange({renderMode: value})}
            />
          </LayerConfigGroup>
          {isSurface ? (
            <>
              <LayerConfigGroup label="3D surface" collapsible>
                <VisConfigSlider
                  {...layer.visConfigSettings.cellRadius}
                  focusRange={[0.1, 3]}
                  focusWeight={0.2}
                  {...visConfiguratorProps}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.elevationScale}
                  {...visConfiguratorProps}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.smoothing}
                  allowCustomValue
                  customInputLabel="Custom passes"
                  {...visConfiguratorProps}
                />
              </LayerConfigGroup>
              <LayerConfigGroup label="Contours" collapsible>
                <VisConfigSwitch
                  {...layer.visConfigSettings.showContours}
                  {...visConfiguratorProps}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.contourCount}
                  disabled={!layer.config.visConfig.showContours}
                  {...visConfiguratorProps}
                />
              </LayerConfigGroup>
              <LayerConfigGroup label="Contour color">
                <LayerColorSelector
                  {...visConfiguratorProps}
                  property="contourColor"
                  selectedColor={layer.config.visConfig.contourColor}
                />
              </LayerConfigGroup>
              <LayerConfigGroup label="Color">
                <LayerColorRangeSelector {...visConfiguratorProps} />
              </LayerConfigGroup>
              <LayerConfigGroup label="Weight">
                <ItemSelector
                  selectedItems={selectedWeight}
                  options={weightOptions}
                  displayOption="label"
                  getOptionValue="id"
                  multiSelect={false}
                  searchable={false}
                  onChange={value =>
                    visConfiguratorProps.onChange({
                      weightColumn: value === COUNT_WEIGHT_ID ? null : value
                    })
                  }
                />
              </LayerConfigGroup>
            </>
          ) : (
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
            </LayerConfigGroup>
          )}
          <LayerConfigGroup label="Display" collapsible>
            <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
          </LayerConfigGroup>
        </>
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
