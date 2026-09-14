// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import store from './store';
import App from './app';
import {DEMO_BASE_PATH} from './constants/default-settings';

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<App />} />
        <Route path={DEMO_BASE_PATH} element={<App />} />
        <Route path={`${DEMO_BASE_PATH}/map`} element={<App />} />
        <Route path={`${DEMO_BASE_PATH}/map/:provider`} element={<App />} />
        <Route path={`${DEMO_BASE_PATH}/:id`} element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Root />);
