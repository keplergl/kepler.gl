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

import {CLOUD_PROVIDERS} from './cloud-providers';
import {IndexRoute, Route} from 'react-router';
import React from 'react';
import Demo from '../app';
import {DEFAULT_CLOUD_PROVIDER} from '../constants/default-settings';

export function onAuthEnterCallback(nextState, replace, callback) {
  // TODO: detect auth provider
  const authProvider = CLOUD_PROVIDERS[DEFAULT_CLOUD_PROVIDER];

  // Check if the current tab was opened by our previous tab
  if (window.opener) {
    const {location} = nextState;
    const token = authProvider.getAccessTokenFromLocation(location);
    window.opener.postMessage({token}, location.origin);
  }

  callback();
}

export function buildAppRoutes(Component) {
  return [
    (<Route key="auth" path="auth" component={Demo} onEnter={onAuthEnterCallback} />),
    (
      <Route key="demo" path="demo">
        <IndexRoute component={Component} />
        <Route path="map" component={Component} />
        <Route path="(:id)" component={Component} />
      </Route>
    )
  ];
}
