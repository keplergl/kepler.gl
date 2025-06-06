// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// import {IndexRoute, Route} from 'react-router';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import React from 'react';
import Demo from './app';
import {getCloudProvider, DEFAULT_CLOUD_PROVIDER} from './cloud-providers';

export function onAuthEnterCallback(nextState, replace, callback) {
  // TODO: detect auth provider
  const authProvider = getCloudProvider(DEFAULT_CLOUD_PROVIDER);

  // Check if the current tab was opened by our previous tab
  if (window.opener) {
    const {location} = nextState;
    const token = authProvider.getAccessTokenFromLocation(location);
    window.opener.postMessage({token}, location.origin);
  }

  callback();
}

export function buildAppRoutes(Component) {
  return (
    <>
      <Route path="auth" element={<Component />} onEnter={onAuthEnterCallback} />
      <Route path="demo">
        <Route index element={<Component />} />
        <Route path="map" element={<Component />} />
        {/** sample map routes /demo/earthquake */}
        <Route path=":id" element={<Component />} />
        {/** cloud map routes /demo/map/dropbox?path=/kepler%20earthquake%20map.json */}
        <Route path="map/:provider" element={<Component />} />
      </Route>
    </>
  );
}
