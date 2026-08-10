// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';

import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import KeplerGl from '@kepler.gl/components';
import {initApplicationConfig} from '@kepler.gl/utils';

import {createCloudProviders} from './cloud-providers';

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

const store = createStore(reducers, {}, compose(applyMiddleware(...enhanceReduxMiddleware([]))));

function useWindowSize() {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  useEffect(() => {
    const onResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

const cloudProviders = createCloudProviders();

const App = () => {
  const {width, height} = useWindowSize();
  const mapboxToken = process.env.MapboxAccessToken || '';

  useEffect(() => {
    // Cognito Hosted UI redirects the popup to /auth#id_token=...
    if (window.location.pathname === '/auth') {
      const awsProvider = cloudProviders.find(p => p.name === 'aws-s3');
      if (awsProvider?.handleAuthRedirect?.()) {
        return;
      }
    }
  }, []);

  const banner = useMemo(() => {
    if (cloudProviders.length) {
      return null;
    }
    return (
      <div
        style={{
          position: 'absolute',
          zIndex: 1000,
          left: 12,
          top: 12,
          maxWidth: 420,
          padding: '12px 14px',
          background: '#1f2937',
          color: '#f9fafb',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 13,
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.35)'
        }}
      >
        AWS S3 provider is not configured. Copy <code>.env.template</code> to <code>.env</code>, set
        Cognito + S3 values, and restart. See README.
      </div>
    );
  }, []);

  return (
    <>
      {banner}
      <KeplerGl
        mapboxApiAccessToken={mapboxToken}
        id="map"
        width={width}
        height={height}
        cloudProviders={cloudProviders}
      />
    </>
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
