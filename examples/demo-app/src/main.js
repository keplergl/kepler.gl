// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import ReactDOM from 'react-dom/client';
import document from 'global/document';
import {Provider} from 'react-redux';
import {browserHistory, Router, Route} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {IntlProvider} from 'react-intl';
import {messages} from '@kepler.gl/localization';
import store from './store';
import App from './app';
import {buildAppRoutes} from './utils/routes';

const history = syncHistoryWithStore(browserHistory, store);

const appRoute = buildAppRoutes(App);

const Root = () => (
  <Provider store={store}>
    <IntlProvider locale="en" messages={messages}>
      <Router history={history}>
        <Route path="/" component={App}>
          {appRoute}
        </Route>
      </Router>
    </IntlProvider>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Root />);
