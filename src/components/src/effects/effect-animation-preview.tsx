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
import {SURFACE_FOG_TYPE} from '@kepler.gl/constants';
import {
  cameraForMap,
  evaluateCameraTour,
  getCameraTourDuration,
  normalizeCameraTour,
  getLayerAnimationTracks,
  getLayerPropertyTransitions
} from '@kepler.gl/utils';
import {RootContext} from '../context';
import {
  applyEffectAnimation,
  getEffectAnimationTracks,
  setAnimatedParameters,
  setSurfaceWaterAnimationTime
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
  const {
    tracks: effectTracks,
    duration: effectDuration,
    timingKey: effectTimingKey
  } = useMemo(() => {
    const tracks = getEffectAnimationTracks(effects);
    return {
      tracks,
      duration: tracks.reduce(
        (latest, track) =>
          track.parameters.reduce((end, parameter) => Math.max(end, parameter.endTimeMs), latest),
        0
      ),
      timingKey: JSON.stringify(
        tracks.map(({effect, parameters}) => [
          effect.id,
          parameters.map(block => [block.name, block.id, block.startTimeMs, block.endTimeMs])
        ])
      )
    };
  }, [effects]);
  const cameraDuration = useMemo(
    () => (cameraEnabled ? getCameraTourDuration(cameraTour) : 0),
    [cameraEnabled, cameraTour]
  );
  // Static objects and equivalent replacements do not change animation timing.
  const {
    duration: layerDuration,
    hasAnimation: hasLayerTiming,
    timingKey: layerTimingKey
  } = useMemo(() => {
    const tracks = layers
      .map(layer => ({
        id: layer.id,
        visible: layer.config.isVisible,
        tracks: getLayerAnimationTracks(layer)
      }))
      .filter(layer => layer.tracks.length);
    return {
      duration: tracks.reduce(
        (latest, layer) =>
          layer.visible
            ? layer.tracks.reduce(
                (end, {transitions}) =>
                  Math.max(end, transitions[transitions.length - 1].endTimeMs),
                latest
              )
            : latest,
        0
      ),
      hasAnimation: tracks.some(layer => layer.visible),
      timingKey: JSON.stringify(tracks.map(layer => [layer.id, layer.visible, layer.tracks]))
    };
  }, [layers]);
  const {
    duration: annotationDuration,
    hasAnimation: hasAnnotationTiming,
    timingKey: annotationTimingKey
  } = useMemo(() => {
    const tracks = annotations
      .map(annotation => ({
        id: annotation.id,
        visible: annotation.isVisible,
        transitions: getLayerPropertyTransitions(annotation, 'opacity')
      }))
      .filter(annotation => annotation.transitions.length);
    return {
      duration: tracks.reduce(
        (latest, annotation) =>
          annotation.visible
            ? Math.max(latest, annotation.transitions[annotation.transitions.length - 1].endTimeMs)
            : latest,
        0
      ),
      hasAnimation: tracks.some(annotation => annotation.visible),
      timingKey: JSON.stringify(
        tracks.map(annotation => [annotation.id, annotation.visible, annotation.transitions])
      )
    };
  }, [annotations]);
  const hasAnimation = Boolean(
    effectTracks.length || cameraDuration || hasLayerTiming || hasAnnotationTiming
  );
  const duration =
    Math.max(cameraDuration, effectDuration, layerDuration, annotationDuration) ||
    (hasAnimation ? 10000 : 0);
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
    if (session.current) setSurfaceWaterAnimationTime(session.current.originals, 0);
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
      applyEffectAnimation(current.tracks, time);
      setSurfaceWaterAnimationTime(current.effects, time);
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
    const previousStops = normalizeCameraTour(previous.cameraTour)?.stops;
    const nextStops = normalizeCameraTour(cameraTour)?.stops;
    const cameraTimingEdit = Boolean(
      previousStops?.length &&
        nextStops &&
        previousStops.length === nextStops.length &&
        previousStops.every(
          (stop, index) =>
            stop.id === nextStops[index].id &&
            (['longitude', 'latitude', 'zoom', 'bearing', 'pitch'] as const).every(
              key => stop.camera[key] === nextStops[index].camera[key]
            )
        ) &&
        previousStops.some(
          (stop, index) =>
            stop.holdDurationMs !== nextStops[index].holdDurationMs ||
            stop.travelDurationMs !== nextStops[index].travelDurationMs
        )
    );
    const timingEdit =
      cameraTimingEdit ||
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
      (hasAnimation || (cameraTimingEdit && cameraEnabled)) &&
      (previous.cameraTour === cameraTour || cameraTimingEdit) &&
      previous.cameraEnabled === cameraEnabled &&
      previous.enabled === enabled &&
      previous.globe === globe
    ) {
      // Static effects do not affect the clock; refresh their copies without losing playback.
      // Timing edits keep the inspected frame paused while dragging bounds.
      const time = Math.min(elapsedRef.current, duration);
      const resume = staticEffectEdit && !cameraTimingEdit && runningRef.current;
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
    const hasAnimatedEffects =
      effectTracks.length > 0 ||
      effects.some(
        effect => effect.isEnabled && effect.type === SURFACE_FOG_TYPE && effect.parameters.pattern
      );
    return {
      effects: current && hasAnimatedEffects ? current.effects : null,
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
