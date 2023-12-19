// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import window from 'global/window';
import store from './reducers';
import Home from './components/home';
import App from './components/app';
import Demo from '../../examples/demo-app/src/app';
import Policy from './components/policy';

import {buildAppRoutes} from '../../examples/demo-app/src/utils/routes';

const appRoute = buildAppRoutes(Demo);

const trackPageChange = location => {
  const links = location.split('/');

  if (links.length === 3) {
    const sampleId = links[2];
    window.gtag('event', 'load_sample', {
      event_label: sampleId,
      value: sampleId
    });
  }
};

const history = syncHistoryWithStore(browserHistory, store);
history.listen(location => {
  if (location.action === 'POP') {
    trackPageChange(location.pathname);
  }
});

function isOldUrl(location) {
  return Boolean(location.pathname === '/' && location.hash && location.hash.startsWith('#/demo'));
}

function onEnter(nextState, replace, callback) {
  /**
   * For backward compatibility, when we see a url path starting with '#/demo/...'
   * we redirect to '/demo/.../
   **/
  if (isOldUrl(nextState.location)) {
    replace(location.hash.substring(1));
  }
  callback();
}

// eslint-disable-next-line react/display-name
export default () => (
  <Router history={history}>
    <Route path="/" component={App} onEnter={onEnter}>
      <IndexRoute component={Home} onEnter={onEnter} />
      <Route path="/policy" component={Policy} onEnter={onEnter} />
      {appRoute}
    </Route>
  </Router>
);
