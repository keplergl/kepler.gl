// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import ReactDOM from 'react-dom/client';
import document from 'global/document';
import {Provider} from 'react-redux';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import store from './store';
import App from './app';

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
