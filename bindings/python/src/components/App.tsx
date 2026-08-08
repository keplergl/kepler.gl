// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useState, useRef} from 'react';
import {injectComponents} from '@kepler.gl/components';
import {KEPLER_ID} from '../store';
import {theme as basicTheme, themeLT, themeBS} from '@kepler.gl/styles';
import type {WidgetModel} from '../types';

const KeplerGl = injectComponents();

interface AppProps {
  model: WidgetModel;
}

function resolveTheme(themeValue: string): object | undefined {
  switch (themeValue) {
    case 'light':
      return themeLT;
    case 'base':
      return themeBS;
    case 'dark':
      return basicTheme;
    default:
      return undefined;
  }
}

export function App({model}: AppProps) {
  const [height, setHeight] = useState(model.get('height'));
  const [width, setWidth] = useState(800);
  const [mapboxToken, setMapboxToken] = useState(model.get('mapbox_token') || '');
  const [theme, setTheme] = useState(model.get('theme') || '');
  const [appName, setAppName] = useState(model.get('app_name') || 'kepler.gl');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHeightChange = () => setHeight(model.get('height'));
    model.on('change:height', handleHeightChange);
    return () => model.off('change:height', handleHeightChange);
  }, [model]);

  useEffect(() => {
    const handleTokenChange = () => setMapboxToken(model.get('mapbox_token') || '');
    model.on('change:mapbox_token', handleTokenChange);
    return () => model.off('change:mapbox_token', handleTokenChange);
  }, [model]);

  useEffect(() => {
    const handleThemeChange = () => setTheme(model.get('theme') || '');
    model.on('change:theme', handleThemeChange);
    return () => model.off('change:theme', handleThemeChange);
  }, [model]);

  useEffect(() => {
    const handleAppNameChange = () => setAppName(model.get('app_name') || 'kepler.gl');
    model.on('change:app_name', handleAppNameChange);
    return () => model.off('change:app_name', handleAppNameChange);
  }, [model]);

  // Observe container width changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const resolvedTheme = resolveTheme(theme);

  return (
    <div ref={containerRef} style={{width: '100%', height}}>
      <KeplerGl
        id={KEPLER_ID}
        width={width}
        height={height}
        mapboxApiAccessToken={mapboxToken}
        appName={appName}
        {...(resolvedTheme ? {theme: resolvedTheme} : {})}
      />
    </div>
  );
}
