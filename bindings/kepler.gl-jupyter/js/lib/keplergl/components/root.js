// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './app';

function renderRoot({id, store, ele}) {
  const Root = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Use React 18 createRoot API
  const root = createRoot(ele);
  root.render(<Root />);
}

export default renderRoot;
