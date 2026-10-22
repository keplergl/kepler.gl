// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {CameraSnapshot, CameraTour} from '@kepler.gl/types';
import {MapStateActions} from '@kepler.gl/actions';
import {evaluateCameraTour, getCameraTourDuration} from '@kepler.gl/utils';
import {RootContext} from '../../context';

/** Local playback state, separate from the saved tour and data/filter animation. */
export default function useCameraTourPlayback(
  tour: CameraTour | null | undefined,
  updateMap: typeof MapStateActions.updateMap | undefined,
  enabled: boolean
) {
  const root = useContext(RootContext);
  const duration = useMemo(() => getCameraTourDuration(tour), [tour]);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<number | null>(null);
  const running = useRef(false);

  const pause = useCallback(() => {
    running.current = false;
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
    setPlaying(false);
  }, []);

  const apply = useCallback(
    (time: number, camera = evaluateCameraTour(tour, time)) => {
      if (camera && updateMap) updateMap({...camera, transitionDuration: 0});
      setElapsed(time);
    },
    [tour, updateMap]
  );

  const seek = useCallback(
    (time: number, camera?: CameraSnapshot) => {
      pause();
      if (enabled && Number.isFinite(time)) apply(Math.max(0, Math.min(duration, time)), camera);
    },
    [pause, enabled, apply, duration]
  );

  const play = useCallback(() => {
    if (!enabled || !updateMap || duration <= 0) return;
    pause();
    const start = elapsed >= duration ? 0 : elapsed;
    const origin = performance.now() - start;
    running.current = true;
    setPlaying(true);
    apply(start);
    const tick = (now: number) => {
      if (!running.current) return;
      const time = Math.max(0, Math.min(duration, now - origin));
      apply(time);
      if (time >= duration) pause();
      else if (running.current) frame.current = window.requestAnimationFrame(tick);
    };
    frame.current = window.requestAnimationFrame(tick);
  }, [enabled, updateMap, duration, pause, elapsed, apply]);

  useEffect(() => {
    pause();
    setElapsed(0);
  }, [tour, pause]);

  useEffect(() => {
    if (!enabled) pause();
  }, [enabled, pause]);

  useEffect(
    () => () => {
      running.current = false;
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    },
    []
  );

  useEffect(() => {
    if (!playing) return;
    const element = root?.current;
    const interrupt = (event: Event) => {
      // Capture phase pauses before a map gesture or navigation button changes the camera.
      if (
        event.target instanceof Element &&
        event.target.closest(
          '.maps, .geocoder-panel, .interaction-camera-bookmarks, .camera-bookmark-panel'
        )
      )
        pause();
    };
    const onVisibility = () => {
      if (document.hidden) pause();
    };
    for (const event of ['pointerdown', 'wheel', 'keydown', 'click'])
      element?.addEventListener(event, interrupt, true);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      for (const event of ['pointerdown', 'wheel', 'keydown', 'click'])
        element?.removeEventListener(event, interrupt, true);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [playing, pause, root]);

  return {elapsed, duration, playing, play, pause, seek};
}
