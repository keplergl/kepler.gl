// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import ReactDOM from 'react-dom/client';
import {connect, Provider} from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import document from 'global/document';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl from '@kepler.gl/components';

const reducers = combineReducers({
  keplerGl: keplerGlReducer.initialState({
    uiState: {
      readOnly: false,
      currentModal: null
    }
  })
});

const middleWares = enhanceReduxMiddleware([
  // Add other middlewares here
]);

const enhancers = applyMiddleware(...middleWares);

const initialState = {};
const store = createStore(reducers, initialState, compose(enhancers));

const App = () => (
  <div
    style={{
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%'
    }}
  >
    <AutoSizer>
      {({height, width}) => (
        <KeplerGl
          mapboxApiAccessToken="pk.xxx.yyy" // Replace with your mapbox token
          id="map"
          width={width}
          height={height}
        />
      )}
    </AutoSizer>
  </div>
);

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});
const ConnectedApp = connect(mapStateToProps, dispatchToProps)(App);
const Root = () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Root />);
