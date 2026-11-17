// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {createContext, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {Effect} from '@kepler.gl/types';
import {
  applyEffectAnimation,
  getEffectAnimationTracks,
  setAnimatedParameters
} from '../modals/effect-animation';

const DURATION_MS = 10000;

export const EffectAnimationPreviewContext = createContext<{
  effects: Effect[] | null;
  hasAnimation: boolean;
  running: boolean;
  run: () => void;
} | null>(null);

/** Share one preview clock across the effects panel and live map views. */
export default function EffectAnimationPreviewProvider({
  effects,
  enabled,
  children
}: {
  effects: Effect[];
  enabled: boolean;
  children: React.ReactNode;
}) {
  const hasAnimation = useMemo(() => getEffectAnimationTracks(effects).length > 0, [effects]);
  const [preview, setPreview] = useState<{
    source: Effect[];
    effects: Effect[];
    running: boolean;
  } | null>(null);
  const frame = useRef<number | null>(null);
  const originals = useRef<Effect[] | null>(null);

  const cancel = useCallback(() => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
    // Deck may copy preview uniforms into its retained original effect instance.
    // Read current saved values here so an edit during playback is preserved.
    originals.current?.forEach(effect => setAnimatedParameters(effect, effect.parameters));
    originals.current = null;
  }, []);

  useEffect(() => {
    setPreview(null);
    return cancel;
  }, [effects, enabled, cancel]);

  const run = useCallback(() => {
    if (!enabled || !hasAnimation) return;
    cancel();
    originals.current = effects;
    const clones = effects.map(effect => effect.clone());
    const tracks = getEffectAnimationTracks(clones);
    const start = performance.now();
    const draw = (progress: number) => {
      applyEffectAnimation(tracks, progress);
      // New render props also redraw an otherwise stationary map.
      setPreview({source: effects, effects: [...clones], running: progress < 1});
    };
    draw(0);
    const tick = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - start) / DURATION_MS));
      draw(progress);
      frame.current = progress < 1 ? window.requestAnimationFrame(tick) : null;
    };
    frame.current = window.requestAnimationFrame(tick);
  }, [effects, enabled, hasAnimation, cancel]);

  const value = useMemo(() => {
    // Discard stale frames immediately, then redraw once cleanup restores runtime uniforms.
    const current = enabled && preview?.source === effects ? preview : null;
    return {
      effects: current?.effects ?? null,
      running: current?.running ?? false,
      hasAnimation,
      run
    };
  }, [enabled, preview, effects, hasAnimation, run]);
  return (
    <EffectAnimationPreviewContext.Provider value={value}>
      {children}
    </EffectAnimationPreviewContext.Provider>
  );
}
