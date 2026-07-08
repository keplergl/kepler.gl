// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route, useLocation, useNavigate} from 'react-router-dom';
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

/**
 * Handles legacy hash URLs (e.g. /#/demo/earthquakes) by redirecting
 * to the equivalent path-based URL (/demo/earthquakes).
 */
function LegacyHashRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/' && location.hash && location.hash.startsWith('#/demo')) {
      navigate(location.hash.substring(1), {replace: true});
    }
  }, [location, navigate]);

  return null;
}

/**
 * Tracks page views via Google Analytics on route changes.
 * Replaces the old react-router-redux LOCATION_CHANGE action tracking.
 */
function LocationTracker() {
  const location = useLocation();

  useEffect(() => {
    if (Window.gtag) {
      Window.gtag('event', 'page_view', {
        page_path: location.pathname
      });
    }
    trackPageChange(location.pathname);
  }, [location.pathname]);

  return null;
}

// eslint-disable-next-line react/display-name
export default () => (
  <BrowserRouter>
    <LegacyHashRedirect />
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
