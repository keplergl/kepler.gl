import React, {useEffect, useState, useRef} from 'react';
import {injectComponents} from '@kepler.gl/components';
import {KEPLER_ID} from '../store';
import type {WidgetModel} from '../types';

// Get the KeplerGl container component via dependency injection
const KeplerGl = injectComponents();

interface AppProps {
  model: WidgetModel;
}

export function App({model}: AppProps) {
  const [height, setHeight] = useState(model.get('height'));
  const [width, setWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHeightChange = () => setHeight(model.get('height'));
    model.on('change:height', handleHeightChange);
    return () => model.off('change:height', handleHeightChange);
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

  return (
    <div ref={containerRef} style={{width: '100%', height}}>
      <KeplerGl id={KEPLER_ID} width={width} height={height} mapboxApiAccessToken="" />
    </div>
  );
}
