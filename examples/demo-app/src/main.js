// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import {loadAndApplyRuntimeConfig} from './utils/runtime-config';

async function bootstrap() {
  // Credentials / applicationConfig / mapStyle must be applied before the store
  // (and cloud providers) are imported — those modules read config at load time.
  await loadAndApplyRuntimeConfig();

  const [{default: store}, {default: App}] = await Promise.all([
    import('./store'),
    import('./app')
  ]);

  const Root = () => (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth" element={<App />} />
          <Route path="/demo" element={<App />} />
          <Route path="/demo/map" element={<App />} />
          <Route path="/demo/map/:provider" element={<App />} />
          <Route path="/demo/:id" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Root />);
}

bootstrap().catch(err => {
  // eslint-disable-next-line no-console
  console.error('Failed to start kepler.gl demo app', err);
});
