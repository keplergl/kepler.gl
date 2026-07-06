// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import Window from 'global/window';
import Home from './components/home';
import App from './components/app';
import Demo from '../../examples/demo-app/src/app';
import Policy from './components/policy';

const trackPageChange = location => {
  const links = location.split('/');

  if (links.length === 3) {
    const sampleId = links[2];
    Window.gtag('event', 'load_sample', {
      event_label: sampleId,
      value: sampleId
    });
  }
};

function LocationTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageChange(location.pathname);
  }, [location.pathname]);

  return null;
}

// eslint-disable-next-line react/display-name
export default () => (
  <BrowserRouter>
    <LocationTracker />
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="policy" element={<Policy />} />
        <Route path="demo" element={<Demo />} />
        <Route path="demo/:id" element={<Demo />} />
        <Route path="demo/map/:provider" element={<Demo />} />
        <Route path="auth" element={<Demo />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
