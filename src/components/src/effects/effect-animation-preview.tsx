// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import type {Annotation, CameraSnapshot, CameraTour, Effect} from '@kepler.gl/types';
import type {Layer} from '@kepler.gl/layers';
import type {MapStateActions} from '@kepler.gl/actions';
import {getEffectAnimationEntries} from '@kepler.gl/effects';
import {
  cameraForMap,
  evaluateCameraTour,
  getCameraTourDuration,
  getAnnotationOpacityDuration,
  getLayerAnimationDuration,
  getLayerAnimationTracks,
  getLayerPropertyTransitions
} from '@kepler.gl/utils';
import {RootContext} from '../context';
import {
  applyEffectAnimation,
  getEffectAnimationDuration,
  getEffectAnimationTracks,
  setAnimatedParameters
} from '../modals/effect-animation';

export type AnimationPlayback = {
  elapsed: number;
  duration: number;
  playing: boolean;
  play: () => void;
  pause: () => void;
  seek: (time: number, camera?: CameraSnapshot) => void;
};

export const EffectAnimationPreviewContext = createContext<{
  effects: Effect[] | null;
  animationTimeMs: number | null;
  hasAnimation: boolean;
  running: boolean;
  elapsed: number;
  duration: number;
  run: () => void;
  pause: () => void;
  seek: AnimationPlayback['seek'];
  reset: () => void;
  stop: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  loop: boolean;
  setLoop: (loop: boolean) => void;
  cameraPlayback?: AnimationPlayback;
} | null>(null);

const EMPTY_LAYERS: readonly Layer[] = [];
const EMPTY_ANNOTATIONS: readonly Annotation[] = [];

/** One elapsed-time clock for camera, opacity and effects. Data playback is independent. */
export default function EffectAnimationPreviewProvider({
  effects,
  enabled,
  cameraTour,
  cameraEnabled = false,
  updateMap,
  globe = false,
  layers = EMPTY_LAYERS,
  annotations = EMPTY_ANNOTATIONS,
  children
}: {
  effects: Effect[];
  enabled: boolean;
  cameraTour?: CameraTour | null;
  cameraEnabled?: boolean;
  updateMap?: typeof MapStateActions.updateMap;
  globe?: boolean;
  layers?: readonly Layer[];
  annotations?: readonly Annotation[];
  children: React.ReactNode;
}) {
  const root = useContext(RootContext);
  const effectTracks = useMemo(() => getEffectAnimationTracks(effects), [effects]);
  const cameraDuration = cameraEnabled ? getCameraTourDuration(cameraTour) : 0;
  const layerDuration = getLayerAnimationDuration(layers);
  const annotationDuration = getAnnotationOpacityDuration(annotations);
  // Static objects and replacement layer instances do not change animation timing.
  const layerTimingKey = JSON.stringify(
    layers.flatMap(layer => {
      const tracks = getLayerAnimationTracks(layer);
      return tracks.length ? [[layer.id, layer.config.isVisible, tracks]] : [];
    })
  );
  const annotationTimingKey = JSON.stringify(
    annotations.flatMap(annotation => {
      const tracks = getLayerPropertyTransitions(annotation, 'opacity');
      return tracks.length ? [[annotation.id, annotation.isVisible, tracks]] : [];
    })
  );
  const effectTimingKey = JSON.stringify(
    effects.map(effect => [
      effect.id,
      effect.isEnabled,
      Object.entries(effect.animation ?? {}).map(([name, animation]) => [
        name,
        getEffectAnimationEntries(animation).map(block => [
          block.id,
          block.startTimeMs,
          block.endTimeMs
        ])
      ])
    ])
  );
  const hasLayerTiming = layers.some(
    layer => layer.config.isVisible && getLayerAnimationTracks(layer).length > 0
  );
  const hasAnnotationTiming = annotations.some(
    annotation =>
      annotation.isVisible && getLayerPropertyTransitions(annotation, 'opacity').length > 0
  );
  const hasAnimation = Boolean(
    effectTracks.length || cameraDuration || hasLayerTiming || hasAnnotationTiming
  );
  const duration =
    Math.max(
      cameraDuration,
      getEffectAnimationDuration(effects),
      layerDuration,
      annotationDuration
    ) || (hasAnimation ? 10000 : 0);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const [speed, setSpeedState] = useState(1);
  const speedRef = useRef(1);
  const [loop, setLoopState] = useState(false);
  const loopRef = useRef(false);
  const [preview, setPreview] = useState<{source: Effect[]; effects: Effect[]} | null>(null);
  const frame = useRef<number | null>(null);
  const session = useRef<{
    originals: Effect[];
    effects: Effect[];
    tracks: ReturnType<typeof getEffectAnimationTracks>;
  } | null>(null);

  const pause = useCallback(() => {
    runningRef.current = false;
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
    setRunning(false);
  }, []);

  const restore = useCallback(() => {
    // Deck may retain an original effect instance while copying preview uniforms into it.
    session.current?.originals.forEach(effect => setAnimatedParameters(effect, effect.parameters));
    session.current = null;
  }, []);

  const stop = useCallback(() => {
    pause();
    restore();
    setPreview(null);
    elapsedRef.current = 0;
    setElapsed(0);
  }, [pause, restore]);

  const draw = useCallback(
    (time: number, camera?: CameraSnapshot) => {
      if (!session.current) {
        const clones = effects.map(effect => effect.clone());
        session.current = {
          originals: effects,
          effects: clones,
          tracks: getEffectAnimationTracks(clones)
        };
      }
      const current = session.current;
      applyEffectAnimation(current.tracks, duration > 0 ? time / duration : 1, time);
      if (cameraEnabled && updateMap) {
        const position = camera ?? evaluateCameraTour(cameraTour, Math.min(time, cameraDuration));
        if (position) updateMap({...cameraForMap(position, globe), transitionDuration: 0});
      }
      elapsedRef.current = time;
      setElapsed(time);
      setPreview({source: effects, effects: [...current.effects]});
    },
    [effects, duration, cameraEnabled, updateMap, cameraTour, cameraDuration, globe]
  );

  const seek = useCallback(
    (time: number, camera?: CameraSnapshot) => {
      if (!enabled || (!hasAnimation && !cameraEnabled) || !Number.isFinite(time)) return;
      pause();
      draw(Math.max(0, Math.min(duration, time)), camera);
    },
    [enabled, hasAnimation, cameraEnabled, pause, draw, duration]
  );

  const run = useCallback(() => {
    if (!enabled || !hasAnimation || duration <= 0) return;
    pause();
    const start = elapsedRef.current >= duration ? 0 : elapsedRef.current;
    draw(start);
    runningRef.current = true;
    setRunning(true);
    let previous = performance.now();
    const tick = (now: number) => {
      if (!runningRef.current) return;
      const next = elapsedRef.current + Math.max(0, now - previous) * speedRef.current;
      previous = now;
      const complete = next >= duration;
      draw(complete && loopRef.current ? next % duration : Math.min(next, duration));
      if (complete && !loopRef.current) pause();
      else if (runningRef.current) frame.current = window.requestAnimationFrame(tick);
    };
    frame.current = window.requestAnimationFrame(tick);
  }, [enabled, hasAnimation, duration, pause, draw]);

  const reset = useCallback(() => seek(0), [seek]);
  const setSpeed = useCallback((value: number) => {
    if (!Number.isFinite(value) || value <= 0) return;
    speedRef.current = value;
    setSpeedState(value);
  }, []);
  const setLoop = useCallback((value: boolean) => {
    loopRef.current = value;
    setLoopState(value);
  }, []);

  const configuration = useRef({
    effects,
    cameraTour,
    cameraEnabled,
    enabled,
    globe,
    layerTimingKey,
    annotationTimingKey,
    effectTimingKey
  });
  useLayoutEffect(() => {
    const previous = configuration.current;
    configuration.current = {
      effects,
      cameraTour,
      cameraEnabled,
      enabled,
      globe,
      layerTimingKey,
      annotationTimingKey,
      effectTimingKey
    };
    const changed =
      previous.effects !== effects ||
      previous.cameraTour !== cameraTour ||
      previous.cameraEnabled !== cameraEnabled ||
      previous.enabled !== enabled ||
      previous.globe !== globe ||
      previous.layerTimingKey !== layerTimingKey ||
      previous.annotationTimingKey !== annotationTimingKey ||
      previous.effectTimingKey !== effectTimingKey;
    if (!changed) return;
    const timingEdit =
      previous.layerTimingKey !== layerTimingKey ||
      previous.annotationTimingKey !== annotationTimingKey ||
      previous.effectTimingKey !== effectTimingKey;
    const staticEffectEdit =
      previous.effects !== effects &&
      !session.current?.tracks.length &&
      !effectTracks.length &&
      previous.layerTimingKey === layerTimingKey &&
      previous.annotationTimingKey === annotationTimingKey;
    if (
      (timingEdit || staticEffectEdit) &&
      session.current &&
      enabled &&
      hasAnimation &&
      previous.cameraTour === cameraTour &&
      previous.cameraEnabled === cameraEnabled &&
      previous.enabled === enabled &&
      previous.globe === globe
    ) {
      // Static effects do not affect the clock; refresh their copies without losing playback.
      // Timing edits keep the inspected frame paused while dragging bounds.
      const time = Math.min(elapsedRef.current, duration);
      const resume = staticEffectEdit && runningRef.current;
      pause();
      restore();
      if (resume) run();
      else draw(time);
    } else stop();
  }, [
    effects,
    effectTracks.length,
    cameraTour,
    cameraEnabled,
    enabled,
    globe,
    layerTimingKey,
    annotationTimingKey,
    effectTimingKey,
    hasAnimation,
    duration,
    pause,
    restore,
    draw,
    run,
    stop
  ]);

  useEffect(
    () => () => {
      runningRef.current = false;
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      frame.current = null;
      restore();
    },
    [restore]
  );

  useEffect(() => {
    if (!running) return;
    const element = root?.current;
    const interrupt = (event: Event) => {
      if (
        cameraEnabled &&
        event.target instanceof Element &&
        !event.target.closest(
          '.camera-tour-playback-controls, .animation-editor, .animation-controls'
        ) &&
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
  }, [running, root, cameraEnabled, pause]);

  const value = useMemo(() => {
    const current = enabled && preview?.source === effects ? preview : null;
    const playback = {elapsed, duration, playing: running, play: run, pause, seek};
    return {
      effects: current && effectTracks.length ? current.effects : null,
      animationTimeMs: current ? elapsed : null,
      hasAnimation,
      running,
      elapsed,
      duration,
      run,
      pause,
      seek,
      reset,
      stop,
      speed,
      setSpeed,
      loop,
      setLoop,
      cameraPlayback: updateMap ? playback : undefined
    };
  }, [
    enabled,
    preview,
    effects,
    effectTracks.length,
    elapsed,
    duration,
    running,
    run,
    pause,
    seek,
    hasAnimation,
    reset,
    stop,
    speed,
    setSpeed,
    loop,
    setLoop,
    updateMap
  ]);

  return (
    <EffectAnimationPreviewContext.Provider value={value}>
      {children}
    </EffectAnimationPreviewContext.Provider>
  );
}
