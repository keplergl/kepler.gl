// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import {injectComponents} from '@kepler.gl/components';

import {replaceMapControl} from './map-control';

// The annotations map control button ships with the default map controls, but the
// panel it opens has to be mounted by the app.
// The cast works around injectComponents being typed as accepting `never[]`.
const KeplerGl = injectComponents([replaceMapControl()] as never[]);

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

const App = () => {
  const dispatch = useDispatch();
  const {width, height} = useWindowSize();

  return (
    <KeplerGl
      mapboxApiAccessToken="pk.xxx.yyy" // Replace with your mapbox token
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
