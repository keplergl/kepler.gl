// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';

import KeplerGl from '@kepler.gl/components';
import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import {initApplicationConfig} from '@kepler.gl/utils';

// Annotations require a custom MapControl that mounts AnnotationManager.
// Disable them here so the default get-started example stays minimal.
initApplicationConfig({
  enableAnnotations: false
});

const reducers = combineReducers({
  keplerGl: keplerGlReducer.initialState({
    uiState: {
      readOnly: false,
      currentModal: null
    }
  })
});

const middleWares = enhanceReduxMiddleware([]);
const enhancers = applyMiddleware(...middleWares);
const store = createStore(reducers, {}, compose(enhancers));

function useWindowSize() {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  useEffect(() => {
    const onResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

// luma.gl defaults `debug` to true whenever NODE_ENV !== 'production', which Vite
// sets during `vite dev`. That wraps the WebGL context in the Khronos debug layer
// and starts a GPU timer query per render pass. Globe mode issues several passes
// per frame and overlapping TIME_ELAPSED_EXT queries are illegal in WebGL2, so the
// debug layer throws and takes the app down.
const DECK_GL_PROPS = {deviceProps: {debug: false}};

const App = () => {
  const dispatch = useDispatch();
  const {width, height} = useWindowSize();

  return (
    <KeplerGl
      mapboxApiAccessToken="pk.xxx.yyy" // Replace with your mapbox token
      id="map"
      width={width}
      height={height}
      deckGlProps={DECK_GL_PROPS}
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
