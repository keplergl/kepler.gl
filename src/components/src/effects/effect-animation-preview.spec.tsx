// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext} from 'react';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {Provider, useSelector} from 'react-redux';
import {createStore} from 'redux';
import {IntlProvider, useIntl} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {createEffect} from '@kepler.gl/effects';
import {INITIAL_MAP_STATE} from '@kepler.gl/reducers';
import {theme} from '@kepler.gl/styles';
import {getLayerAnimatedVisConfig, getLayerOpacityFactor} from '@kepler.gl/utils';
import type {Annotation, Effect} from '@kepler.gl/types';
import type {Layer} from '@kepler.gl/layers';
import CameraTourPlaybackProvider, {
  CameraTourPlaybackContext
} from '../side-panel/interaction-panel/camera-tour-playback-provider';
import CameraTourPlaybackControls from '../side-panel/interaction-panel/camera-tour-playback-controls';
import EffectManagerFactory from './effect-manager';
import EffectAnimationPreviewProvider, {
  EffectAnimationPreviewContext
} from './effect-animation-preview';

const Manager = EffectManagerFactory(
  (() => null) as Parameters<typeof EffectManagerFactory>[0],
  (({children}) => <div>{children}</div>) as Parameters<typeof EffectManagerFactory>[1],
  (() => null) as Parameters<typeof EffectManagerFactory>[2]
);

let now: number;
let frames: Map<number, FrameRequestCallback>;

beforeEach(() => {
  now = 0;
  frames = new Map();
  let nextFrame = 0;
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
    frames.delete(id);
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

function advanceFrame(time: number) {
  now = time;
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach(callback => callback(time)));
}

function animatedBrightness() {
  return createEffect({
    id: 'brightness',
    type: 'brightnessContrast',
    parameters: {brightness: 0, contrast: 0.3},
    animation: {brightness: {endValue: 1, easing: 'linear'}}
  });
}

function setup(
  effects: Effect[],
  enabled = true,
  {
    cameraDuration,
    managerOpen = true,
    layers = [],
    annotations = []
  }: {
    cameraDuration?: number;
    managerOpen?: boolean;
    layers?: Layer[];
    annotations?: Annotation[];
  } = {}
) {
  const updateMap = jest.fn();
  const tour = {
    stops: [
      {
        id: 'start',
        name: 'Start',
        camera: {longitude: 10, latitude: 20, zoom: 6, bearing: 0, pitch: 0},
        holdDurationMs: cameraDuration ?? 0,
        travelDurationMs: 0
      }
    ]
  };
  const initialState = {visState: {effects, effectOrder: effects.map(effect => effect.id)}};
  const store = createStore((state = initialState, action: {type: string; effects?: Effect[]}) =>
    action.type === 'replaceEffects' && action.effects
      ? {visState: {effects: action.effects, effectOrder: action.effects.map(effect => effect.id)}}
      : state
  );
  let previewEffects: Effect[] | null = null;
  let controls: React.ContextType<typeof EffectAnimationPreviewContext> = null;
  function MapPreview() {
    const playback = useContext(EffectAnimationPreviewContext);
    controls = playback;
    const saved = useSelector((state: typeof initialState) => state.visState.effects);
    previewEffects = playback?.effects ?? null;
    return (
      <>
        <output aria-label="Rendered effects">
          {JSON.stringify((previewEffects ?? saved).map(effect => effect.parameters))}
        </output>
        <output aria-label="Rendered layer opacity">
          {JSON.stringify(
            layers.map(
              layer =>
                (layer.config.visConfig?.opacity ?? 1) *
                getLayerOpacityFactor(layer.config, playback?.animationTimeMs)
            )
          )}
        </output>
        <output aria-label="Rendered annotation opacity">
          {JSON.stringify(
            annotations.map(annotation =>
              getLayerOpacityFactor(annotation, playback?.animationTimeMs)
            )
          )}
        </output>
        <output aria-label="Rendered layer properties">
          {JSON.stringify(
            layers.map(layer => getLayerAnimatedVisConfig(layer, playback?.animationTimeMs))
          )}
        </output>
      </>
    );
  }
  function CameraControls() {
    const playback = useContext(CameraTourPlaybackContext);
    return playback && cameraDuration !== undefined ? (
      <CameraTourPlaybackControls playback={playback} />
    ) : null;
  }
  function Content({active, showManager}: {active: boolean; showManager: boolean}) {
    const intl = useIntl();
    const saved = useSelector((state: typeof initialState) => state.visState.effects);
    return (
      <EffectAnimationPreviewProvider
        effects={saved}
        enabled={active}
        cameraTour={tour}
        cameraEnabled={cameraDuration !== undefined}
        updateMap={updateMap}
        layers={layers}
        annotations={annotations}
      >
        <CameraTourPlaybackProvider
          tour={tour}
          mapState={INITIAL_MAP_STATE}
          updateMap={updateMap}
          enabled
        >
          {showManager && <Manager intl={intl} />}
          <CameraControls />
          <MapPreview />
        </CameraTourPlaybackProvider>
      </EffectAnimationPreviewProvider>
    );
  }
  const tree = () => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntlProvider locale="en" messages={{'effectManager.effects': 'Effects'}}>
          <Content active={enabled} showManager={managerOpen} />
        </IntlProvider>
      </ThemeProvider>
    </Provider>
  );
  const view = render(tree());
  return {
    ...view,
    store,
    updateMap,
    getPreviewEffects: () => previewEffects,
    playback: () => controls!,
    replaceLayers: (next: Layer[]) => {
      layers = next;
      view.rerender(tree());
    },
    replaceAnnotations: (next: Annotation[]) => {
      annotations = next;
      view.rerender(tree());
    },
    parameters: () => JSON.parse(screen.getByLabelText('Rendered effects').textContent || '[]'),
    opacities: () =>
      JSON.parse(screen.getByLabelText('Rendered layer opacity').textContent || '[]'),
    annotationOpacities: () =>
      JSON.parse(screen.getByLabelText('Rendered annotation opacity').textContent || '[]'),
    layerProperties: () =>
      JSON.parse(screen.getByLabelText('Rendered layer properties').textContent || '[]'),
    setEnabled: (active: boolean) => {
      enabled = active;
      view.rerender(tree());
    },
    setManagerOpen: (open: boolean) => {
      managerOpen = open;
      view.rerender(tree());
    },
    replaceEffects: (next: Effect[]) => {
      act(() => store.dispatch({type: 'replaceEffects', effects: next}));
    }
  };
}

function animatedAnnotation(): Annotation {
  return {
    id: 'callout',
    label: 'Place',
    isVisible: true,
    opacityTransitions: [
      {
        id: 'in',
        startTimeMs: 1000,
        endTimeMs: 3000,
        startValue: 0,
        endValue: 0.5,
        easing: 'linear'
      },
      {
        id: 'later',
        startTimeMs: 12000,
        endTimeMs: 16000,
        startValue: 0.5,
        endValue: 1,
        easing: 'linear'
      }
    ]
  } as unknown as Annotation;
}

describe('annotation opacity playback', () => {
  test('plays annotation-only tracks and holds values between blocks without changing saved annotations', () => {
    const annotation = animatedAnnotation();
    const saved = JSON.stringify(annotation);
    const view = setup([], true, {annotations: [annotation], managerOpen: false});
    expect(view.playback().hasAnimation).toBe(true);
    expect(view.playback().duration).toBe(16000);
    act(() => view.playback().run());
    expect(view.annotationOpacities()).toEqual([0]);
    advanceFrame(2000);
    expect(view.annotationOpacities()).toEqual([0.25]);
    advanceFrame(8000);
    expect(view.annotationOpacities()).toEqual([0.5]);
    act(() => view.playback().seek(14000));
    expect(view.annotationOpacities()).toEqual([0.75]);
    act(() => view.playback().seek(16000));
    expect(view.annotationOpacities()).toEqual([1]);
    act(() => view.playback().seek(8000));
    expect(view.annotationOpacities()).toEqual([0.5]);
    act(() => view.playback().stop());
    expect(view.playback().animationTimeMs).toBeNull();
    expect(view.annotationOpacities()).toEqual([1]);
    expect(JSON.stringify(annotation)).toBe(saved);
    expect(view.updateMap).not.toHaveBeenCalled();
  });

  test('keeps equivalent annotation replacements running and pauses edits at the current frame', () => {
    const annotation = animatedAnnotation();
    const view = setup([], true, {
      annotations: [annotation],
      managerOpen: false,
      cameraDuration: 5000
    });
    act(() => view.playback().run());
    advanceFrame(2000);
    view.replaceAnnotations([JSON.parse(JSON.stringify(annotation))]);
    expect(view.playback().running).toBe(true);
    const changed = {
      ...annotation,
      opacityTransitions: annotation.opacityTransitions!.map((transition, index) =>
        index === 0 ? {...transition, endValue: 1} : {...transition, endTimeMs: 20000}
      )
    };
    view.replaceAnnotations([changed]);
    expect(view.playback().running).toBe(false);
    expect(view.playback().elapsed).toBe(2000);
    expect(view.playback().duration).toBe(20000);
    expect(view.annotationOpacities()).toEqual([0.5]);
    view.replaceAnnotations([{...changed, opacityTransitions: []}]);
    expect(view.playback().duration).toBe(5000);
    expect(view.annotationOpacities()).toEqual([1]);
  });

  test('ignores hidden and invalid annotation tracks and supports an instantaneous first cut', () => {
    const annotation = animatedAnnotation();
    const view = setup([], true, {
      annotations: [{...annotation, isVisible: false}],
      managerOpen: false
    });
    expect(view.playback().hasAnimation).toBe(false);
    expect(view.playback().duration).toBe(0);
    view.replaceAnnotations([
      {...annotation, opacityTransitions: [{...annotation.opacityTransitions![0], endValue: 2}]}
    ]);
    expect(view.playback().hasAnimation).toBe(false);
    view.replaceAnnotations([
      {
        ...annotation,
        opacityTransitions: [
          {id: 'cut', startTimeMs: 0, endTimeMs: 0, startValue: 1, endValue: 0, easing: 'linear'}
        ]
      }
    ]);
    expect(view.playback().duration).toBe(10000);
    act(() => view.playback().run());
    expect(view.annotationOpacities()).toEqual([0]);
    view.replaceAnnotations([{...annotation, opacityTransitions: []}]);
    expect(view.playback().hasAnimation).toBe(false);
    expect(view.playback().animationTimeMs).toBeNull();
    expect(view.annotationOpacities()).toEqual([1]);
  });
});

describe('declared layer property playback', () => {
  const propertyLayer = () =>
    ({
      id: 'sized',
      animatableProps: [{name: 'radius', label: 'Radius', range: [0, 100], step: 0.1}],
      config: {
        isVisible: true,
        visConfig: {radius: 8},
        propertyTransitions: {
          radius: [
            {
              id: 'grow',
              startTimeMs: 1000,
              endTimeMs: 3000,
              startValue: 2,
              endValue: 6,
              easing: 'linear'
            },
            {
              id: 'shrink',
              startTimeMs: 8000,
              endTimeMs: 12000,
              startValue: 6,
              endValue: 4,
              easing: 'linear'
            }
          ],
          unsupported: [
            {
              id: 'ignored',
              startTimeMs: 0,
              endTimeMs: 60000,
              startValue: 0,
              endValue: 1,
              easing: 'linear'
            }
          ]
        }
      }
    } as unknown as Layer);

  test('uses declared property tracks for the clock and holds native values without changing authored config', () => {
    const layer = propertyLayer();
    const saved = JSON.stringify(layer.config);
    const view = setup([], true, {layers: [layer], managerOpen: false});
    expect(view.playback().hasAnimation).toBe(true);
    expect(view.playback().duration).toBe(12000);
    expect(view.layerProperties()).toEqual([{}]);
    act(() => view.playback().run());
    expect(view.layerProperties()).toEqual([{radius: 2}]);
    advanceFrame(2000);
    expect(view.layerProperties()).toEqual([{radius: 4}]);
    advanceFrame(6000);
    expect(view.layerProperties()).toEqual([{radius: 6}]);
    act(() => view.playback().seek(10000));
    expect(view.layerProperties()).toEqual([{radius: 5}]);
    act(() => view.playback().seek(12000));
    expect(view.layerProperties()).toEqual([{radius: 4}]);
    act(() => view.playback().stop());
    expect(view.layerProperties()).toEqual([{}]);
    expect(JSON.stringify(layer.config)).toBe(saved);
    expect(view.updateMap).not.toHaveBeenCalled();
  });

  test('keeps equivalent replacements running and pauses a property edit at the inspected frame', () => {
    const layer = propertyLayer();
    const view = setup([], true, {layers: [layer], managerOpen: false});
    act(() => view.playback().run());
    advanceFrame(2000);
    view.replaceLayers([{...layer} as Layer]);
    expect(view.playback().running).toBe(true);
    const changed = {
      ...layer,
      config: {
        ...layer.config,
        propertyTransitions: {
          ...layer.config.propertyTransitions,
          radius: layer.config.propertyTransitions!.radius.map((transition, index) =>
            index === 0 ? {...transition, endValue: 10} : transition
          )
        }
      }
    } as unknown as Layer;
    view.replaceLayers([changed]);
    expect(view.playback().running).toBe(false);
    expect(view.playback().elapsed).toBe(2000);
    expect(view.layerProperties()).toEqual([{radius: 6}]);
    view.replaceLayers([
      {
        ...changed,
        config: {
          ...changed.config,
          propertyTransitions: {...changed.config.propertyTransitions, radius: []}
        }
      } as unknown as Layer
    ]);
    expect(view.playback().hasAnimation).toBe(false);
    expect(view.playback().duration).toBe(0);
    expect(view.layerProperties()).toEqual([{}]);
  });
});

describe('effects panel animation preview', () => {
  test('pause, resume and seeking coordinate camera and timed effects without changing data state', () => {
    const effect = animatedBrightness();
    effect.setProps({
      animation: {
        brightness: {
          startValue: 0,
          endValue: 1,
          easing: 'linear',
          startTimeMs: 3000,
          endTimeMs: 7000
        }
      }
    });
    const view = setup([effect], true, {cameraDuration: 20000, managerOpen: false});
    const savedState = view.store.getState();
    fireEvent.click(screen.getByRole('button', {name: 'Play'}));
    advanceFrame(2000);
    expect(view.parameters()[0].brightness).toBe(0);
    advanceFrame(5000);
    expect(view.parameters()[0].brightness).toBe(0.5);
    fireEvent.click(screen.getByRole('button', {name: 'Pause'}));
    expect(frames.size).toBe(0);
    advanceFrame(9000);
    expect(view.playback().elapsed).toBe(5000);
    fireEvent.click(screen.getByRole('button', {name: 'Play'}));
    advanceFrame(11000);
    expect(view.playback().elapsed).toBe(7000);
    expect(view.parameters()[0].brightness).toBe(1);
    act(() => view.playback().seek(4000));
    expect(view.parameters()[0].brightness).toBe(0.25);
    expect(frames.size).toBe(0);
    act(() => view.playback().seek(15000));
    expect(view.parameters()[0].brightness).toBe(1);
    act(() => view.playback().reset());
    expect(view.parameters()[0].brightness).toBe(0);
    expect(view.store.getState()).toBe(savedState);
    expect(effect.parameters.brightness).toBe(0);
  });

  test('longer effects continue after the camera ends and exit restores static values', () => {
    const effect = animatedBrightness();
    effect.setProps({
      parameters: {brightness: 0.7},
      animation: {
        brightness: {
          startValue: 0,
          endValue: 1,
          easing: 'linear',
          startTimeMs: 2000,
          endTimeMs: 12000
        }
      }
    });
    const view = setup([effect], true, {cameraDuration: 4000, managerOpen: false});
    expect(view.playback().duration).toBe(12000);
    act(() => view.playback().run());
    advanceFrame(7000);
    expect(view.parameters()[0].brightness).toBe(0.5);
    expect(view.updateMap).toHaveBeenLastCalledWith(
      expect.objectContaining({longitude: 10, transitionDuration: 0})
    );
    advanceFrame(12000);
    expect(view.parameters()[0].brightness).toBe(1);
    expect(frames.size).toBe(0);
    act(() => view.playback().stop());
    expect(view.playback().animationTimeMs).toBeNull();
    expect(view.parameters()[0].brightness).toBe(0.7);
  });

  test('effects and scheduled layers can play without a camera or data timeline', () => {
    const layer = {
      id: 'scheduled',
      config: {
        isVisible: true,
        visibilityTiming: {startTimeMs: 3000, endTimeMs: 15000, fadeInMs: 1000, fadeOutMs: 1000}
      }
    } as Layer;
    const view = setup([animatedBrightness()], true, {layers: [layer], managerOpen: false});
    expect(view.playback().duration).toBe(15000);
    act(() => view.playback().run());
    advanceFrame(7500);
    expect(view.playback().animationTimeMs).toBe(7500);
    expect(view.parameters()[0].brightness).toBe(0.5);
    expect(view.updateMap).not.toHaveBeenCalled();
    // Filtering can rebuild layer objects; it must not reset presentation playback.
    view.replaceLayers([{...layer} as Layer]);
    expect(view.playback().running).toBe(true);
    advanceFrame(10000);
    expect(view.playback().animationTimeMs).toBe(10000);
    act(() => view.playback().stop());
    expect(view.playback().animationTimeMs).toBeNull();
  });

  const opacityLayer = () =>
    ({
      id: 'opacity-layer',
      config: {
        isVisible: true,
        visConfig: {opacity: 0.8},
        opacityTransitions: [
          {
            id: 'first',
            startTimeMs: 1000,
            endTimeMs: 3000,
            startValue: 0,
            endValue: 0.5,
            easing: 'linear'
          },
          {
            id: 'second',
            startTimeMs: 12000,
            endTimeMs: 16000,
            startValue: 0.5,
            endValue: 1,
            easing: 'linear'
          }
        ]
      }
    } as unknown as Layer);

  test('multiple layer opacity blocks set playback duration and hold their endpoints through gaps', () => {
    const layer = opacityLayer();
    const saved = JSON.stringify(layer.config);
    const view = setup([], true, {layers: [layer], managerOpen: false});
    expect(view.playback().hasAnimation).toBe(true);
    expect(view.playback().duration).toBe(16000);
    act(() => view.playback().run());
    expect(view.opacities()).toEqual([0]);
    advanceFrame(2000);
    expect(view.opacities()).toEqual([0.2]);
    advanceFrame(5000);
    expect(view.opacities()).toEqual([0.4]);
    advanceFrame(14000);
    expect(view.opacities()[0]).toBeCloseTo(0.6);
    advanceFrame(16000);
    expect(view.opacities()).toEqual([0.8]);
    expect(view.playback().running).toBe(false);
    expect(view.updateMap).not.toHaveBeenCalled();
    act(() => view.playback().seek(5000));
    expect(view.opacities()).toEqual([0.4]);
    act(() => view.playback().stop());
    expect(view.playback().animationTimeMs).toBeNull();
    expect(view.opacities()).toEqual([0.8]);
    expect(JSON.stringify(layer.config)).toBe(saved);
  });

  test('replacement layers with identical opacity blocks keep playback running', () => {
    const layer = opacityLayer();
    const view = setup([], true, {layers: [layer], managerOpen: false});
    act(() => view.playback().run());
    advanceFrame(4000);
    view.replaceLayers([
      {
        ...layer,
        config: {
          ...layer.config,
          opacityTransitions: layer.config.opacityTransitions!.map(block => ({...block}))
        }
      } as Layer
    ]);
    expect(view.playback().running).toBe(true);
    expect(view.playback().elapsed).toBe(4000);
    advanceFrame(5000);
    expect(view.playback().elapsed).toBe(5000);
    expect(view.opacities()).toEqual([0.4]);
  });

  test('editing opacity values pauses and evaluates the same playhead without changing static opacity', () => {
    const layer = opacityLayer();
    const view = setup([], true, {layers: [layer], managerOpen: false});
    act(() => view.playback().run());
    advanceFrame(5000);
    const edited = {
      ...layer,
      config: {
        ...layer.config,
        opacityTransitions: layer.config.opacityTransitions!.map((block, index) =>
          index === 0 ? {...block, endValue: 0.75} : {...block, startValue: 0.75}
        )
      }
    } as Layer;
    view.replaceLayers([edited]);
    expect(view.playback().running).toBe(false);
    expect(view.playback().animationTimeMs).toBe(5000);
    expect(view.opacities()[0]).toBeCloseTo(0.6);
    expect(frames.size).toBe(0);
    expect(edited.config.visConfig.opacity).toBe(0.8);
    act(() => view.playback().stop());
    expect(view.opacities()).toEqual([0.8]);
  });

  test('explicitly empty opacity blocks disable a legacy visibility schedule', () => {
    const layer = opacityLayer();
    layer.config.opacityTransitions = [];
    layer.config.visibilityTiming = {startTimeMs: 0, endTimeMs: 20000, fadeInMs: 0, fadeOutMs: 0};
    const view = setup([], true, {layers: [layer], managerOpen: false});
    expect(view.playback().hasAnimation).toBe(false);
    expect(view.playback().duration).toBe(0);
    act(() => view.playback().run());
    expect(view.playback().animationTimeMs).toBeNull();
    expect(frames.size).toBe(0);
    expect(view.opacities()).toEqual([0.8]);
  });

  test('speed and looping use one clock and invalid seek/speed values are ignored', () => {
    const view = setup([animatedBrightness()], true, {managerOpen: false});
    act(() => {
      view.playback().setSpeed(2);
      view.playback().setLoop(true);
      view.playback().run();
    });
    advanceFrame(3000);
    expect(view.parameters()[0].brightness).toBe(0.6);
    advanceFrame(6000);
    expect(view.parameters()[0].brightness).toBe(0.2);
    expect(frames.size).toBe(1);
    act(() => {
      view.playback().seek(NaN);
      view.playback().setSpeed(-1);
    });
    expect(view.playback().running).toBe(true);
    expect(view.playback().speed).toBe(2);
    act(() => view.playback().seek(-100));
    expect(view.playback().elapsed).toBe(0);
    expect(frames.size).toBe(0);
  });

  test('editing timing keeps the playhead and evaluates the edited frame while paused', () => {
    const effect = animatedBrightness();
    effect.setProps({
      animation: {
        brightness: {
          startValue: 0,
          endValue: 1,
          easing: 'linear',
          startTimeMs: 3000,
          endTimeMs: 7000
        }
      }
    });
    const view = setup([effect], true, {cameraDuration: 20000, managerOpen: false});
    act(() => view.playback().seek(8000));
    expect(view.parameters()[0].brightness).toBe(1);
    effect.setProps({
      animation: {
        brightness: {
          startValue: 0,
          endValue: 1,
          easing: 'linear',
          startTimeMs: 3000,
          endTimeMs: 13000
        }
      }
    });
    view.replaceEffects([effect]);
    expect(view.playback().elapsed).toBe(8000);
    expect(view.parameters()[0].brightness).toBe(0.5);
    expect(view.playback().running).toBe(false);
    const layer = {
      id: 'scheduled',
      config: {
        isVisible: true,
        visibilityTiming: {startTimeMs: 1000, endTimeMs: 15000, fadeInMs: 0, fadeOutMs: 0}
      }
    } as Layer;
    view.replaceLayers([layer]);
    expect(view.playback().animationTimeMs).toBe(8000);
    expect(frames.size).toBe(0);
  });

  test.each([
    {cameraDuration: 4000, managerOpen: false},
    {cameraDuration: 20000, managerOpen: false},
    {cameraDuration: 20000, managerOpen: true}
  ])(
    'camera and legacy effects share playback duration (camera=$cameraDuration ms, manager open=$managerOpen)',
    options => {
      const effect = animatedBrightness();
      const view = setup([effect], true, options);
      fireEvent.click(screen.getByRole('button', {name: 'Play'}));
      expect(view.getPreviewEffects()).not.toBeNull();
      expect(view.parameters()[0].brightness).toBe(0);
      advanceFrame(options.cameraDuration / 4);
      expect(view.parameters()[0].brightness).toBe(0.25);
      view.setManagerOpen(!options.managerOpen);
      advanceFrame(options.cameraDuration / 2);
      expect(view.parameters()[0].brightness).toBe(0.5);
      expect(view.playback().elapsed).toBe(options.cameraDuration / 2);
      expect(frames.size).toBe(1);
      advanceFrame(options.cameraDuration);
      expect(view.parameters()[0].brightness).toBe(1);
      expect(effect.parameters.brightness).toBe(0);
      expect(frames.size).toBe(0);
      fireEvent.click(screen.getByRole('button', {name: 'Play'}));
      expect(view.parameters()[0].brightness).toBe(0);
      advanceFrame(options.cameraDuration * 1.25);
      expect(view.parameters()[0].brightness).toBe(0.25);
    }
  );

  test('camera playback still runs without animated effects', () => {
    const view = setup([], true, {cameraDuration: 4000, managerOpen: false});
    fireEvent.click(screen.getByRole('button', {name: 'Play'}));
    advanceFrame(2000);
    expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('2 s');
    expect(view.updateMap).toHaveBeenCalled();
    expect(view.getPreviewEffects()).toBeNull();
    expect(frames.size).toBe(1);
  });

  test('disabling coordinated preview prevents camera and effect playback', () => {
    const view = setup([animatedBrightness()], false, {
      cameraDuration: 4000,
      managerOpen: false
    });
    fireEvent.click(screen.getByRole('button', {name: 'Play'}));
    advanceFrame(2000);
    expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('0 s');
    expect(view.getPreviewEffects()).toBeNull();
    expect(frames.size).toBe(0);
  });

  test.each<[string, () => Effect[]]>([
    ['empty effects', () => []],
    ['missing animation', () => [createEffect({type: 'brightnessContrast'})]],
    [
      'invalid endpoint',
      () => [
        createEffect({
          type: 'brightnessContrast',
          animation: {brightness: {endValue: NaN, easing: 'linear'}}
        })
      ]
    ],
    [
      'invalid start',
      () => {
        const effect = animatedBrightness();
        effect.parameters.brightness = Infinity;
        return [effect];
      }
    ],
    [
      'disabled effect',
      () => {
        const effect = animatedBrightness();
        effect.setProps({isEnabled: false});
        return [effect];
      }
    ]
  ])('hides Run for %s', (_name, createEffects) => {
    setup(createEffects());
    expect(screen.queryByRole('button', {name: 'Run'})).toBeNull();
    expect(frames.size).toBe(0);
  });

  test('previews all configured values over ten seconds without changing saved starts', () => {
    const effects = [
      animatedBrightness(),
      createEffect({
        id: 'fog',
        type: 'surfaceFog',
        parameters: {
          height: 0,
          animateHeight: true,
          heightEnd: 100,
          linearEasing: false,
          fogColor: [0, 40, 80]
        },
        animation: {fogColor: {endValue: [80, 0, 40], easing: 'linear'}}
      })
    ];
    const saved = effects.map(effect => ({
      parameters: structuredClone(effect.parameters),
      animation: structuredClone(effect.animation)
    }));
    const view = setup(effects);
    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(screen.getByRole('button', {name: 'Running'})).toBeDisabled();
    expect(view.getPreviewEffects()?.[0]).not.toBe(effects[0]);
    expect(view.parameters()[0]).toMatchObject({brightness: 0, contrast: 0.3});

    advanceFrame(0);
    advanceFrame(2500);
    expect(view.parameters()[0]).toMatchObject({brightness: 0.25, contrast: 0.3});
    expect(view.parameters()[1]).toMatchObject({height: 15.625, fogColor: [20, 30, 70]});
    advanceFrame(5000);
    expect(view.parameters()[0].brightness).toBe(0.5);
    expect(view.parameters()[1]).toMatchObject({height: 50, fogColor: [40, 20, 60]});
    expect(screen.getByRole('button', {name: 'Running'})).toBeDisabled();
    advanceFrame(10000);
    expect(view.parameters()[0].brightness).toBe(1);
    expect(view.parameters()[1]).toMatchObject({height: 100, fogColor: [80, 0, 40]});
    expect(screen.getByRole('button', {name: 'Run'})).toBeEnabled();
    expect(frames.size).toBe(0);
    expect(effects.map(({parameters, animation}) => ({parameters, animation}))).toEqual(saved);

    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(view.parameters()[0].brightness).toBe(0);
    expect(view.parameters()[1]).toMatchObject({height: 0, fogColor: [0, 40, 80]});
    advanceFrame(12500);
    expect(view.parameters()[0].brightness).toBe(0.25);
    expect(effects.map(({parameters, animation}) => ({parameters, animation}))).toEqual(saved);
  });

  test('uses the configured Start after static edits and restores the current static value', () => {
    const effect = animatedBrightness();
    const animation = {brightness: {startValue: 0, endValue: 1, easing: 'linear' as const}};
    effect.setProps({animation});
    const view = setup([effect]);
    effect.setProps({parameters: {brightness: 0.7}});
    view.replaceEffects([effect]);
    expect(view.parameters()[0].brightness).toBe(0.7);

    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(view.parameters()[0].brightness).toBe(0);
    advanceFrame(5000);
    expect(view.parameters()[0].brightness).toBe(0.5);
    expect(effect.parameters.brightness).toBe(0.7);
    advanceFrame(10000);
    expect(view.parameters()[0].brightness).toBe(1);
    expect(effect.parameters.brightness).toBe(0.7);
    expect(effect.animation).toEqual(animation);

    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(view.parameters()[0].brightness).toBe(0);
    // Mirror deck.gl retaining the original effect while accepting preview uniforms.
    effect.deckEffect.setProps(view.getPreviewEffects()?.[0].deckEffect.props);
    expect(effect.deckEffect.props.brightness).toBe(0);
    view.setEnabled(false);
    expect(view.getPreviewEffects()).toBeNull();
    expect(view.parameters()[0].brightness).toBe(0.7);
    expect(effect.parameters.brightness).toBe(0.7);
    expect(effect.deckEffect.props.brightness).toBe(0.7);
    expect(effect.animation).toEqual(animation);
    expect(frames.size).toBe(0);
  });

  test('runs explicit sunlight dates without changing the saved time mode', () => {
    const start = Date.UTC(2024, 5, 21);
    const end = start + 24 * 60 * 60 * 1000;
    const effect = createEffect({
      type: 'lightAndShadow',
      parameters: {timeMode: 'animation', timestamp: 0},
      animation: {timestamp: {startValue: start, endValue: end, easing: 'linear'}}
    });
    const view = setup([effect]);
    fireEvent.click(screen.getByRole('button', {name: 'Run'}));
    expect(view.parameters()[0]).toMatchObject({timeMode: 'pick', timestamp: start});
    advanceFrame(5000);
    expect(view.parameters()[0].timestamp).toBe(start + (end - start) / 2);
    advanceFrame(10000);
    expect(view.parameters()[0].timestamp).toBe(end);
    expect(effect.parameters).toMatchObject({timeMode: 'animation', timestamp: 0});
    view.setEnabled(false);
    expect(view.parameters()[0]).toMatchObject({timeMode: 'animation', timestamp: 0});
  });

  test('shows Run when an animation is configured and removes it when cleared', () => {
    const effect = createEffect({type: 'brightnessContrast'});
    const view = setup([effect]);
    expect(screen.queryByRole('button', {name: 'Run'})).toBeNull();
    effect.setProps({animation: {brightness: {endValue: 1, easing: 'linear'}}});
    view.replaceEffects([effect]);
    expect(screen.getByRole('button', {name: 'Run'})).toBeEnabled();
    effect.setProps({animation: {}});
    view.replaceEffects([effect]);
    expect(screen.queryByRole('button', {name: 'Run'})).toBeNull();
  });

  test.each(['edit', 'disable', 'unmount'] as const)(
    'cancels playback and restores current saved runtime values on %s',
    cause => {
      const effect = animatedBrightness();
      const view = setup([effect]);
      fireEvent.click(screen.getByRole('button', {name: 'Run'}));
      advanceFrame(5000);
      const preview = view.getPreviewEffects()?.[0];
      expect(preview?.parameters.brightness).toBe(0.5);
      if (cause === 'edit') effect.setProps({parameters: {brightness: 0.2}});
      // deck.gl reuses the original runtime effect by ID, copying preview props into it.
      effect.deckEffect.setProps(preview?.deckEffect.props);
      expect(effect.deckEffect.props.brightness).toBe(0.5);
      expect(effect.parameters.brightness).toBe(cause === 'edit' ? 0.2 : 0);

      if (cause === 'edit') view.replaceEffects([effect]);
      else if (cause === 'disable') view.setEnabled(false);
      else view.unmount();

      expect(frames.size).toBe(0);
      expect(effect.deckEffect.props.brightness).toBe(cause === 'edit' ? 0.2 : 0);
      if (cause !== 'unmount') {
        expect(view.getPreviewEffects()).toBeNull();
        expect(view.parameters()[0].brightness).toBe(cause === 'edit' ? 0.2 : 0);
        if (cause === 'disable') {
          fireEvent.click(screen.getByRole('button', {name: 'Run'}));
          expect(view.getPreviewEffects()).toBeNull();
          expect(frames.size).toBe(0);
          view.setEnabled(true);
        }
        fireEvent.click(screen.getByRole('button', {name: 'Run'}));
        expect(view.parameters()[0].brightness).toBe(0);
        expect(effect.parameters.brightness).toBe(cause === 'edit' ? 0.2 : 0);
        expect(frames.size).toBe(1);
      }
    }
  );
});
