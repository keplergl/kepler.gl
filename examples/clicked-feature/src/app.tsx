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
import {processGeojson} from '@kepler.gl/processors';
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableAnnotations: false});

const MAP_ID = 'map';
const SIDEBAR_WIDTH = 300;

// Kepler instance state lives at state.keplerGl[id]. The `id` must match the
// KeplerGl `id` prop (and wrapTo) below.
type ClickedPickInfo = {
  picked?: boolean;
  object?: {properties?: Record<string, unknown>};
} | null;

type KeplerRootState = {
  keplerGl: {
    [id: string]: {
      visState: {
        clicked: ClickedPickInfo;
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
      // Hide Kepler's own side panel so the host-app sidebar is the focus.
      readOnly: true,
      currentModal: null
    }
  })
});

const middlewares = enhanceReduxMiddleware([]);
const enhancers = applyMiddleware(...middlewares);
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, {}, composeEnhancers(enhancers));

// Simple non-overlapping polygons so clicks are easy to target.
function rectangle(west: number, south: number, east: number, north: number) {
  return [
    [
      [west, south],
      [east, south],
      [east, north],
      [west, north],
      [west, south]
    ]
  ];
}

const neighborhoods = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {shapeName: 'Mission', areaKm2: 3.9},
      geometry: {type: 'Polygon', coordinates: rectangle(-122.428, 37.748, -122.41, 37.765)}
    },
    {
      type: 'Feature',
      properties: {shapeName: 'SoMa', areaKm2: 2.6},
      geometry: {type: 'Polygon', coordinates: rectangle(-122.41, 37.765, -122.392, 37.782)}
    },
    {
      type: 'Feature',
      properties: {shapeName: 'Financial District', areaKm2: 1.2},
      geometry: {type: 'Polygon', coordinates: rectangle(-122.41, 37.782, -122.392, 37.798)}
    },
    {
      type: 'Feature',
      properties: {shapeName: 'Castro', areaKm2: 1.4},
      geometry: {type: 'Polygon', coordinates: rectangle(-122.444, 37.756, -122.428, 37.77)}
    }
  ]
};

const sampleData = {
  info: {
    label: 'Neighborhoods',
    id: 'neighborhoods'
  },
  data: processGeojson(neighborhoods)
};

const mapConfig = {
  version: 'v1',
  config: {
    visState: {
      layers: [
        {
          id: 'neighborhoods-layer',
          type: 'geojson',
          config: {
            dataId: 'neighborhoods',
            label: 'Neighborhoods',
            color: [18, 147, 154],
            columns: {geojson: '_geojson'},
            isVisible: true,
            visConfig: {
              opacity: 0.65,
              thickness: 1,
              strokeColor: [255, 255, 255],
              filled: true,
              stroked: true,
              enable3d: false,
              // GeoJSON picking (and therefore visState.clicked) requires this
              // plus interactionConfig.tooltip.enabled.
              allowHover: true
            }
          },
          visualChannels: {
            colorField: {name: 'shapeName', type: 'string'},
            colorScale: 'ordinal'
          }
        }
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            neighborhoods: [{name: 'shapeName'}, {name: 'areaKm2'}]
          },
          enabled: true
        }
      }
    },
    mapState: {
      latitude: 37.772,
      longitude: -122.418,
      zoom: 12.4,
      pitch: 0,
      bearing: 0
    },
    mapStyle: {
      styleType: 'dark-matter'
    }
  }
};

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

/**
 * Host-app sidebar that reads the last layer click from Kepler Redux state.
 * `clicked` is a deck.gl PickInfo. For GeoJSON, original feature properties
 * (including shapeName) are on `clicked.object.properties`.
 */
function ClickedFeatureSidebar() {
  const clicked = useSelector(
    (state: KeplerRootState) => state.keplerGl[MAP_ID]?.visState?.clicked
  );

  if (!clicked?.picked) {
    return (
      <aside style={sidebarStyle}>
        <h2 style={{margin: '0 0 8px', fontSize: 16}}>Clicked feature</h2>
        <p style={{margin: 0, color: '#c3c9d5'}}>
          Click a polygon on the map to show its <code>shapeName</code> here, outside Kepler.gl.
        </p>
      </aside>
    );
  }

  const properties = clicked.object?.properties ?? {};
  const shapeName = properties.shapeName;
  const extraEntries = Object.entries(properties).filter(
    ([key]) => key !== 'shapeName' && key !== 'index'
  );

  return (
    <aside style={sidebarStyle}>
      <h2 style={{margin: '0 0 8px', fontSize: 16}}>Clicked feature</h2>
      <p style={{margin: '0 0 16px', fontSize: 20, fontWeight: 600}}>
        {shapeName == null ? 'Untitled' : String(shapeName)}
      </p>
      {extraEntries.map(([key, value]) => (
        <div key={key} style={{display: 'flex', justifyContent: 'space-between', gap: 12}}>
          <span style={{color: '#c3c9d5'}}>{key}</span>
          <span>{String(value)}</span>
        </div>
      ))}
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
          datasets: sampleData,
          config: mapConfig,
          options: {centerMap: false}
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
      <ClickedFeatureSidebar />
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
