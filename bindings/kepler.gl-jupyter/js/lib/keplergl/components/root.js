// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './app';
import Window from 'global/window';
import {addDataConfigToKeplerGl} from '../kepler.gl';

// Separate component to handle data loading after mount
function DataLoader({store, onRenderComplete}) {
  const hasLoadedData = useRef(false);

  useEffect(() => {
    // This runs AFTER component tree is mounted and Provider is fully subscribed
    // Load data from Window.__keplerglDataConfig (HTML export mode)
    if (!hasLoadedData.current && Window.__keplerglDataConfig) {
      hasLoadedData.current = true;
      const {data, config, options} = Window.__keplerglDataConfig;
      addDataConfigToKeplerGl({data, config, options, store});
    }
    // Signal render complete for callback-based loading (Jupyter widget mode)
    if (onRenderComplete) {
      onRenderComplete();
    }
  }, [store, onRenderComplete]);

  return null;
}

function renderRoot({id, store, ele, onRenderComplete}) {
  // Use React 18 createRoot API
  const root = createRoot(ele);
  root.render(
    <Provider store={store}>
      <DataLoader store={store} onRenderComplete={onRenderComplete} />
      <App />
    </Provider>
  );
}

export default renderRoot;
