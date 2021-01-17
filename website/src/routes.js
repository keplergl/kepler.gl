// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
