// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// import 'babel-polyfill';
// import 'babel-register';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import store from './reducers';
import Routes from './routes';
import document from 'global/document';

require('./static/favicon.png');

const el = document.createElement('div');
document.body.appendChild(el);

const root = ReactDOM.createRoot(el);
root.render(
  <Provider store={store}>
    <Routes />
  </Provider>
);
