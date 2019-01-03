// Copyright (c) 2019 Uber Technologies, Inc.
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
import document from 'global/document';
import {Provider} from 'react-redux';
import {browserHistory, Router, Route} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {render} from 'react-dom';
import store from './store';
import App from './app';
import { AUTH_HANDLERS } from "./utils/sharing/authentication";

const history = syncHistoryWithStore(browserHistory, store);

const onEnterCallback = (nextState, transition, callback) => {
  // TODO: detect auth provider
  const defaultProvider = 'dropbox';
  const authProvider = AUTH_HANDLERS[defaultProvider];

  // Check if the current tab was opened by our previous tab
  if (window.opener) {
    const { location } = nextState;
    const token = authProvider.getAccessTokenFromLocation(location);
    window.opener.postMessage({token}, location.origin);
  }

  callback();
};

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/auth" component={App} onEnter={onEnterCallback} />
      <Route path="/demo/(:id)" component={App} />
      <Route path="/map" component={App} />
      <Route path="/" component={App} />
      <Route path="*" component={App} />
    </Router>
  </Provider>
);

render(<Root />, document.body.appendChild(document.createElement('div')));
