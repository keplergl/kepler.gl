// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect, useMemo, useRef} from 'react';
import {SURFACE_FOG_TYPE} from '@kepler.gl/constants';
import {Effect} from '@kepler.gl/types';

type FogAnimState = {
  active: boolean;
  range: [number, number];
  originalHeight: number;
  linear: boolean;
};

/**
 * Drives the surface fog elevation animation during Hubble video export.
 *
 * Patches DeckSurfaceFogEffect.postRender to interpolate height per-frame
 * using the Hubble adapter's videoCapture.timeMs for precise sync.
 */
export function useFogHeightAnimation(
  videoEffects: Effect[],
  hubbleContainerRef: React.RefObject<any>
): void {
  const surfaceFogEffect = useMemo(
    () => videoEffects.find((e: Effect) => e.type === SURFACE_FOG_TYPE && e.isEnabled),
    [videoEffects]
  );

  const fogHeightAnim = useMemo(() => {
    if (!surfaceFogEffect?.parameters?.animateHeight) return null;
    const params = surfaceFogEffect.parameters;
    return {
      start: params.height as number,
      end: params.heightEnd as number,
      linear: Boolean(params.linearEasing)
    };
  }, [surfaceFogEffect]);

  const fogAnimRef = useRef<FogAnimState>({
    active: false,
    range: [0, 100],
    originalHeight: 50,
    linear: false
  });

  // Sync fogAnimRef config with effect parameters (don't start playing yet)
  useEffect(() => {
    if (fogHeightAnim) {
      fogAnimRef.current.active = true;
      fogAnimRef.current.range = [fogHeightAnim.start, fogHeightAnim.end];
      fogAnimRef.current.originalHeight = fogHeightAnim.start;
      fogAnimRef.current.linear = fogHeightAnim.linear;
    } else {
      if (fogAnimRef.current.active && surfaceFogEffect?.deckEffect) {
        surfaceFogEffect.deckEffect.setProps?.({height: fogAnimRef.current.originalHeight});
      }
      fogAnimRef.current.active = false;
    }
  }, [fogHeightAnim, surfaceFogEffect]);

  // Patch DeckSurfaceFogEffect.postRender to drive height animation per-frame.
  // Reads the Hubble adapter's videoCapture.timeMs to derive progress,
  // so our animation stays perfectly in sync with Hubble's own timeline.
  useEffect(() => {
    const de = surfaceFogEffect?.deckEffect;
    if (!de) return;
    const originalPostRender = de.postRender.bind(de);
    de.postRender = function (this: any, params: any) {
      const ref = fogAnimRef.current;
      if (ref.active) {
        const hubbleState = hubbleContainerRef.current?.state;
        const isPlaying = hubbleState?.previewing || hubbleState?.rendering;

        if (isPlaying) {
          const adapter = hubbleState?.adapter;
          const vc = adapter?.videoCapture;
          const tc = vc?.timecode;
          if (
            vc &&
            tc &&
            tc.duration > 0 &&
            Number.isFinite(vc.timeMs) &&
            Number.isFinite(tc.start)
          ) {
            const progress = Math.min(Math.max((vc.timeMs - tc.start) / tc.duration, 0), 1);
            const t = ref.linear ? progress : progress * progress * (3 - 2 * progress);
            const [s, e] = ref.range;
            this.props.height = s + (e - s) * t;
          }
        } else {
          this.props.height = ref.originalHeight;
        }
      }
      return originalPostRender(params);
    };
    return () => {
      de.postRender = originalPostRender;
    };
  }, [surfaceFogEffect, hubbleContainerRef]);
}
