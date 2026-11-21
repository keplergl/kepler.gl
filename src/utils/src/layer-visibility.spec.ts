// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  normalizeLayerVisibilityTiming,
  getLayerVisibilityFactor,
  getLayerVisibilityDuration,
  normalizeLayerOpacityTransitions,
  getLayerOpacityTransitions,
  getLayerOpacityFactor,
  getLayerOpacityDuration,
  getAnnotationOpacityDuration,
  DEFAULT_LAYER_ANIMATABLE_PROPS,
  normalizeLayerPropertyTransitions,
  getLayerPropertyTransitions,
  getLayerAnimationTracks,
  getLayerAnimationDuration,
  getLayerAnimationOpacityFactor,
  getLayerAnimatedVisConfig
} from './layer-visibility';
import type {LayerAnimatableProp, LayerOpacityTransition} from '@kepler.gl/types';

const timing = {startTimeMs: 3000, endTimeMs: 10000, fadeInMs: 2000, fadeOutMs: 2000};

test.each([
  [0, 0],
  [3000, 0],
  [4000, 0.5],
  [5000, 1],
  [8000, 1],
  [9000, 0.5],
  [10000, 0],
  [12000, 0]
])('visibility at %i ms is %f', (time, expected) => {
  expect(getLayerVisibilityFactor(timing, time)).toBe(expected);
});

test('annotation duration follows only visible valid tracks, including instantaneous and cleared tracks', () => {
  const opacityTransitions = [
    transition({id: 'later', startTimeMs: 6000, endTimeMs: 8000}),
    transition()
  ];
  const annotation = {isVisible: true, opacityTransitions};
  expect(getAnnotationOpacityDuration([])).toBe(0);
  expect(getAnnotationOpacityDuration([{isVisible: true}])).toBe(0);
  expect(getAnnotationOpacityDuration([annotation])).toBe(8000);
  expect(
    getAnnotationOpacityDuration([
      annotation,
      {isVisible: false, opacityTransitions: [transition({endTimeMs: 50000})]}
    ])
  ).toBe(8000);
  expect(getAnnotationOpacityDuration([{isVisible: true, opacityTransitions: []}])).toBe(0);
  expect(
    getAnnotationOpacityDuration([
      {
        isVisible: true,
        opacityTransitions: [transition({startTimeMs: 0, endTimeMs: 0})]
      }
    ])
  ).toBe(0);
  expect(
    getAnnotationOpacityDuration([
      {
        isVisible: true,
        opacityTransitions: [transition(), transition({id: 'overlap', startTimeMs: 3000})]
      }
    ])
  ).toBe(0);
  expect(opacityTransitions[0].id).toBe('later');
});

test('seeks deterministically without mutating the authored schedule', () => {
  const original = {...timing};
  expect(getLayerVisibilityFactor(timing, 9000)).toBe(0.5);
  expect(getLayerVisibilityFactor(timing, 2000)).toBe(0);
  expect(getLayerVisibilityFactor(timing, 6000)).toBe(1);
  expect(timing).toEqual(original);
});

test('holds visible without an end and supports instantaneous cuts', () => {
  const ongoing = {startTimeMs: 1000, fadeInMs: 0, fadeOutMs: 0};
  expect(getLayerVisibilityFactor(ongoing, 999)).toBe(0);
  expect(getLayerVisibilityFactor(ongoing, 1000)).toBe(1);
  expect(getLayerVisibilityFactor(ongoing, 100000)).toBe(1);
  expect(getLayerVisibilityFactor({...ongoing, endTimeMs: 2000}, 1999)).toBe(1);
  expect(getLayerVisibilityFactor({...ongoing, endTimeMs: 2000}, 2000)).toBe(0);
  expect(getLayerVisibilityFactor({...ongoing, endTimeMs: 1000}, 1000)).toBe(0);
});

test.each([
  undefined,
  null,
  [],
  {},
  {...timing, startTimeMs: -1},
  {...timing, startTimeMs: '3'},
  {...timing, endTimeMs: NaN},
  {...timing, endTimeMs: 2000},
  {...timing, fadeInMs: Infinity},
  {...timing, fadeInMs: -1},
  {...timing, fadeInMs: 6000},
  {...timing, endTimeMs: undefined},
  {startTimeMs: Number.MAX_VALUE, fadeInMs: Number.MAX_VALUE}
])('rejects invalid or overlapping schedules: %p', value => {
  expect(normalizeLayerVisibilityTiming(value)).toBeUndefined();
});

test('normalizes defaults and strips unknown fields', () => {
  expect(normalizeLayerVisibilityTiming({startTimeMs: 1000, extra: true})).toEqual({
    startTimeMs: 1000,
    fadeInMs: 0,
    fadeOutMs: 0
  });
  expect(normalizeLayerVisibilityTiming(timing)).not.toBe(timing);
});

test('leaves the static map unchanged outside preview and for invalid timing', () => {
  for (const time of [undefined, null, NaN, Infinity]) {
    expect(getLayerVisibilityFactor(timing, time)).toBe(1);
  }
  expect(getLayerVisibilityFactor(undefined, 0)).toBe(1);
  expect(getLayerVisibilityFactor({...timing, fadeOutMs: -1}, 0)).toBe(1);
});

test('duration follows visible schedules and supports a final fade with no disappearance', () => {
  const layer = (visibilityTiming, isVisible = true) => ({config: {visibilityTiming, isVisible}});
  expect(getLayerVisibilityDuration([])).toBe(0);
  expect(getLayerVisibilityDuration([layer(timing)])).toBe(10000);
  expect(
    getLayerVisibilityDuration([
      layer(timing),
      layer({...timing, endTimeMs: 50000}, false),
      layer({startTimeMs: 10000, fadeInMs: 3000, fadeOutMs: 0})
    ])
  ).toBe(13000);
});

const transition = (overrides: Partial<LayerOpacityTransition> = {}): LayerOpacityTransition => ({
  id: 'in',
  startTimeMs: 2000,
  endTimeMs: 4000,
  startValue: 0.2,
  endValue: 0.8,
  easing: 'linear',
  ...overrides
});

describe('layer opacity transitions', () => {
  test('clones and sorts a track while defaulting easing and leaving authored values unchanged', () => {
    const first = Object.freeze({...transition(), easing: undefined, unknown: true});
    const later = Object.freeze(transition({id: 'out', startTimeMs: 6000, endTimeMs: 8000}));
    const input = Object.freeze([later, first]);
    const result = normalizeLayerOpacityTransitions(input)!;
    expect(result).toEqual([transition({easing: 'easeInOut'}), later]);
    expect(result).not.toBe(input);
    expect(result[0]).not.toBe(first);
    expect(result[1]).not.toBe(later);
    expect(input).toEqual([later, first]);
    expect(first.easing).toBeUndefined();
  });

  test.each([
    undefined,
    null,
    {},
    [null],
    [[]],
    [{...transition(), id: undefined}],
    [{...transition(), id: ''}],
    [{...transition(), id: '  '}],
    [{...transition(), startTimeMs: undefined}],
    [{...transition(), endTimeMs: undefined}],
    [{...transition(), startTimeMs: -1}],
    [{...transition(), startTimeMs: '2000'}],
    [{...transition(), startTimeMs: NaN}],
    [{...transition(), endTimeMs: Infinity}],
    [{...transition(), endTimeMs: 1000}],
    [{...transition(), startValue: undefined}],
    [{...transition(), endValue: undefined}],
    [{...transition(), startValue: -0.1}],
    [{...transition(), endValue: 1.1}],
    [{...transition(), startValue: NaN}],
    [{...transition(), endValue: Infinity}],
    [{...transition(), endValue: '1'}],
    [{...transition(), easing: null}],
    [{...transition(), easing: 'bounce'}],
    [transition(), transition({startTimeMs: 6000, endTimeMs: 8000})]
  ])('rejects an invalid track atomically: %p', input => {
    expect(normalizeLayerOpacityTransitions(input)).toBeUndefined();
  });

  test.each([
    transition({id: 'overlap', startTimeMs: 3000, endTimeMs: 5000}),
    transition({id: 'inside', startTimeMs: 2500, endTimeMs: 3000}),
    transition({id: 'cut-inside', startTimeMs: 3000, endTimeMs: 3000}),
    transition({id: 'same', startTimeMs: 2000, endTimeMs: 4000})
  ])('rejects overlapping intervals and cuts inside an active interval: %p', overlap => {
    expect(normalizeLayerOpacityTransitions([overlap, transition()])).toBeUndefined();
  });

  test('allows touching intervals and preserves equal-time cuts in authored order', () => {
    const first = transition({startTimeMs: 0, endTimeMs: 2000});
    const cutA = transition({
      id: 'cut-a',
      startTimeMs: 2000,
      endTimeMs: 2000,
      startValue: 0.8,
      endValue: 0.3
    });
    const cutB = transition({
      id: 'cut-b',
      startTimeMs: 2000,
      endTimeMs: 2000,
      startValue: 0.3,
      endValue: 0.6
    });
    const last = transition({
      id: 'last',
      startTimeMs: 2000,
      endTimeMs: 3000,
      startValue: 0.6,
      endValue: 1
    });
    expect(normalizeLayerOpacityTransitions([last, cutA, first, cutB])).toEqual([
      first,
      cutA,
      cutB,
      last
    ]);
    const config = {opacityTransitions: [first, cutA, cutB]};
    expect(getLayerOpacityFactor(config, 1999)).toBeCloseTo(0.7997);
    expect(getLayerOpacityFactor(config, 2000)).toBe(0.6);
    expect(getLayerOpacityFactor(config, 5000)).toBe(0.6);
  });

  const config = {
    opacityTransitions: [
      transition(),
      transition({
        id: 'out',
        startTimeMs: 6000,
        endTimeMs: 10000,
        startValue: 0.4,
        endValue: 0,
        easing: 'easeInOut'
      })
    ]
  };
  test.each([
    [-1000, 0.2],
    [0, 0.2],
    [2000, 0.2],
    [3000, 0.5],
    [4000, 0.8],
    [5000, 0.8],
    [6000, 0.4],
    [7000, 0.3375],
    [8000, 0.2],
    [10000, 0],
    [50000, 0]
  ])('evaluates boundaries, gaps and independent easing at %i ms', (timeMs, expected) => {
    expect(getLayerOpacityFactor(config, timeMs)).toBeCloseTo(expected);
  });

  test('seeking backwards remains deterministic and leaves saved transitions untouched', () => {
    const original = JSON.parse(JSON.stringify(config));
    expect(getLayerOpacityFactor(config, 7000)).toBeCloseTo(0.3375);
    expect(getLayerOpacityFactor(config, 1000)).toBe(0.2);
    expect(getLayerOpacityFactor(config, 3000)).toBeCloseTo(0.5);
    expect(config).toEqual(original);
  });

  test('keeps the static map unchanged without time or a playable track', () => {
    for (const time of [undefined, null, NaN, Infinity]) {
      expect(getLayerOpacityFactor(config, time)).toBe(1);
    }
    expect(normalizeLayerOpacityTransitions([])).toEqual([]);
    expect(getLayerOpacityFactor({}, 0)).toBe(1);
    expect(getLayerOpacityFactor({opacityTransitions: []}, 0)).toBe(1);
    expect(getLayerOpacityFactor({opacityTransitions: [transition({startValue: -1})]}, 0)).toBe(1);
  });

  test('valid new tracks, including an empty track, take precedence over legacy visibility', () => {
    expect(getLayerOpacityTransitions({...config, visibilityTiming: timing})).toEqual(
      config.opacityTransitions
    );
    expect(getLayerOpacityTransitions({opacityTransitions: [], visibilityTiming: timing})).toEqual(
      []
    );
    expect(getLayerOpacityFactor({opacityTransitions: [], visibilityTiming: timing}, 0)).toBe(1);
    expect(
      getLayerOpacityTransitions({
        opacityTransitions: [transition({startValue: -1})],
        visibilityTiming: timing
      })
    ).toEqual(getLayerOpacityTransitions({visibilityTiming: timing}));
  });

  test.each([
    timing,
    {startTimeMs: 0, endTimeMs: 0, fadeInMs: 0, fadeOutMs: 0},
    {startTimeMs: 2000, endTimeMs: 2000, fadeInMs: 0, fadeOutMs: 0},
    {startTimeMs: 2000, endTimeMs: 6000, fadeInMs: 0, fadeOutMs: 0},
    {startTimeMs: 2000, endTimeMs: 6000, fadeInMs: 2000, fadeOutMs: 2000},
    {startTimeMs: 2000, fadeInMs: 1000, fadeOutMs: 0},
    {startTimeMs: 0, fadeInMs: 0, fadeOutMs: 0}
  ])(
    'converts legacy visibility with equivalent boundary and cut behavior: %p',
    visibilityTiming => {
      const original = {...visibilityTiming};
      const converted = getLayerOpacityTransitions({visibilityTiming});
      expect(normalizeLayerOpacityTransitions(converted)).toEqual(converted);
      expect(getLayerOpacityTransitions({visibilityTiming})).toEqual(converted);
      const times = new Set([-1, 0, 1000, 2000, 3000, 4000, 5000, 6000, 9000, 10000, 12000]);
      for (const block of converted) {
        times.add(block.startTimeMs - 1);
        times.add(block.startTimeMs);
        times.add(block.endTimeMs - 1);
        times.add(block.endTimeMs);
        times.add(block.endTimeMs + 1);
      }
      for (const timeMs of times) {
        expect(getLayerOpacityFactor({opacityTransitions: converted}, timeMs)).toBeCloseTo(
          getLayerVisibilityFactor(visibilityTiming, timeMs)
        );
      }
      expect(visibilityTiming).toEqual(original);
    }
  );

  test('duration uses the final transition on visible layers, including converted legacy tracks', () => {
    const layer = (config, isVisible = true) => ({config: {...config, isVisible}});
    expect(getLayerOpacityDuration([])).toBe(0);
    expect(getLayerOpacityDuration([layer(config)])).toBe(10000);
    expect(
      getLayerOpacityDuration([
        layer(config),
        layer({opacityTransitions: [transition({endTimeMs: 50000})]}, false),
        layer({visibilityTiming: {startTimeMs: 12000, fadeInMs: 1000, fadeOutMs: 0}})
      ])
    ).toBe(13000);
    expect(
      getLayerOpacityDuration([layer({opacityTransitions: [], visibilityTiming: timing})])
    ).toBe(0);
  });
});

describe('numeric layer property transitions', () => {
  const radius: LayerAnimatableProp = {name: 'radius', label: 'Radius', range: [0, 100], step: 1};
  const elevation: LayerAnimatableProp = {
    name: 'elevationScale',
    label: 'Elevation',
    range: [-100, 100],
    step: 0.1
  };
  const radiusTrack = [
    transition({id: 'later', startTimeMs: 6000, endTimeMs: 8000, startValue: 40, endValue: 20}),
    transition({startValue: 10, endValue: 30})
  ];
  const layer = {
    config: {
      isVisible: true,
      propertyTransitions: {
        opacity: [transition()],
        radius: radiusTrack,
        elevationScale: [transition({startValue: -40, endValue: 60, easing: 'easeInOut'})]
      }
    },
    animatableProps: [...DEFAULT_LAYER_ANIMATABLE_PROPS, radius, elevation]
  };

  test('normalizes independent concurrent tracks and clones each transition without changing input', () => {
    const source = layer.config.propertyTransitions;
    const normalized = normalizeLayerPropertyTransitions(source)!;
    expect(normalized.radius.map(item => item.id)).toEqual(['in', 'later']);
    expect(normalized.elevationScale[0].startValue).toBe(-40);
    expect(normalized.opacity[0].id).toBe(normalized.radius[0].id);
    expect(normalized).not.toBe(source);
    expect(normalized.radius).not.toBe(source.radius);
    expect(normalized.radius[0]).not.toBe(source.radius[1]);
    expect(source.radius.map(item => item.id)).toEqual(['later', 'in']);
    expect(normalizeLayerPropertyTransitions({})).toEqual({});
    expect(normalizeLayerPropertyTransitions({futureProperty: []})).toEqual({futureProperty: []});
  });

  test.each([
    undefined,
    null,
    [],
    0,
    new Date(),
    new Map(),
    {radius: null},
    {radius: {}},
    {radius: [transition({endValue: Infinity})]},
    {radius: [transition({startValue: NaN})]},
    {radius: [transition({startTimeMs: -1})]},
    {radius: [transition({endTimeMs: 1000})]},
    {radius: [transition(), transition({startTimeMs: 6000, endTimeMs: 8000})]},
    {radius: [transition(), transition({id: 'overlap', startTimeMs: 3000})]},
    {'': []},
    {'  ': []},
    {constructor: []},
    {prototype: []},
    JSON.parse('{"__proto__":[]}')
  ])('rejects malformed maps or tracks: %p', value => {
    expect(normalizeLayerPropertyTransitions(value)).toBeUndefined();
  });

  test('keeps unknown names when saving but only evaluates whitelisted properties within range', () => {
    const propertyTransitions = {
      ...layer.config.propertyTransitions,
      futureProperty: [transition({endTimeMs: 90000, startValue: 500, endValue: 1000})],
      radius: [transition({startValue: -1, endValue: 100})]
    };
    expect(normalizeLayerPropertyTransitions(propertyTransitions)?.futureProperty).toEqual(
      propertyTransitions.futureProperty
    );
    const candidate = {...layer, config: {...layer.config, propertyTransitions}};
    expect(getLayerAnimationTracks(candidate).map(item => item.property.name)).toEqual([
      'opacity',
      'elevationScale'
    ]);
    expect(getLayerAnimatedVisConfig(candidate, 3000)).toEqual({elevationScale: 10});
    expect(getLayerAnimationDuration([candidate])).toBe(4000);
    expect(getLayerPropertyTransitions(candidate.config, 'radius', radius)).toEqual([]);
    expect(getLayerPropertyTransitions(candidate.config, 'constructor')).toEqual([]);
  });

  test.each([
    [0, 10, -40],
    [2000, 10, -40],
    [2500, 15, -24.375],
    [3000, 20, 10],
    [4000, 30, 60],
    [5000, 30, 60],
    [6000, 40, 60],
    [7000, 30, 60],
    [9000, 20, 60]
  ])(
    'evaluates concurrent values, eased values and held gaps at %i ms',
    (time, radiusValue, height) => {
      expect(getLayerAnimatedVisConfig(layer, time)).toEqual({
        radius: radiusValue,
        elevationScale: height
      });
      expect(getLayerAnimationOpacityFactor(layer, time)).toBe(
        getLayerOpacityFactor(layer.config, time)
      );
    }
  );

  test('cleared properties suppress legacy opacity while absent keys preserve legacy behavior', () => {
    const legacy = {isVisible: true, opacityTransitions: [transition()], visibilityTiming: timing};
    expect(getLayerPropertyTransitions(legacy, 'opacity')).toEqual([transition()]);
    expect(getLayerOpacityTransitions({...legacy, propertyTransitions: {radius: []}})).toEqual([
      transition()
    ]);
    for (const opacity of [[], [transition({endValue: 2})]]) {
      const config = {...legacy, propertyTransitions: {opacity}};
      expect(getLayerOpacityTransitions(config)).toEqual([]);
      expect(getLayerOpacityFactor(config, 3000)).toBe(1);
      expect(getLayerAnimationDuration([{config}])).toBe(0);
    }
    expect(getLayerOpacityDuration([{config: layer.config}])).toBe(4000);
  });

  test('defaults plain fixtures to opacity and respects an explicit empty whitelist or narrower range', () => {
    expect(getLayerAnimationTracks({config: layer.config}).map(item => item.property.name)).toEqual(
      ['opacity']
    );
    expect(getLayerAnimatedVisConfig({config: layer.config}, 3000)).toEqual({});
    expect(getLayerAnimationTracks({...layer, animatableProps: []})).toEqual([]);
    expect(getLayerAnimationOpacityFactor({...layer, animatableProps: []}, 3000)).toBe(1);
    expect(
      getLayerAnimationOpacityFactor(
        {
          ...layer,
          animatableProps: [{...DEFAULT_LAYER_ANIMATABLE_PROPS[0], range: [0.4, 0.6]}]
        },
        3000
      )
    ).toBe(1);
    expect(
      getLayerPropertyTransitions(layer.config, 'radius', {...radius, range: [20, 10]})
    ).toEqual([]);
  });

  test('duration ignores hidden layers, unsupported tracks and cleared tracks', () => {
    expect(getLayerAnimationDuration([])).toBe(0);
    expect(getLayerAnimationDuration([layer])).toBe(8000);
    expect(
      getLayerAnimationDuration([{...layer, config: {...layer.config, isVisible: false}}])
    ).toBe(0);
    expect(
      getLayerAnimationDuration([
        {...layer, config: {isVisible: true, propertyTransitions: {radius: []}}}
      ])
    ).toBe(0);
  });

  test('preserves authored config while seeking and leaves static maps untouched', () => {
    const original = JSON.parse(JSON.stringify(layer.config));
    getLayerAnimatedVisConfig(layer, 7000);
    expect(getLayerAnimatedVisConfig(layer, 3000)).toEqual({radius: 20, elevationScale: 10});
    expect(layer.config).toEqual(original);
    for (const time of [undefined, null, NaN, Infinity]) {
      expect(getLayerAnimatedVisConfig(layer, time)).toEqual({});
      expect(getLayerAnimationOpacityFactor(layer, time)).toBe(1);
    }
  });

  test('supports touching blocks and instantaneous numeric cuts without interpolation overflow', () => {
    const candidate = {
      config: {
        isVisible: true,
        propertyTransitions: {
          elevationScale: [
            transition({
              id: 'first',
              startTimeMs: 0,
              endTimeMs: 2000,
              startValue: -100,
              endValue: 100
            }),
            transition({
              id: 'cut',
              startTimeMs: 2000,
              endTimeMs: 2000,
              startValue: 100,
              endValue: -20
            })
          ]
        }
      },
      animatableProps: [elevation]
    };
    expect(getLayerAnimatedVisConfig(candidate, 1000)).toEqual({elevationScale: 0});
    expect(getLayerAnimatedVisConfig(candidate, 2000)).toEqual({elevationScale: -20});
    expect(getLayerAnimatedVisConfig(candidate, 3000)).toEqual({elevationScale: -20});
    const extreme = {
      config: {
        isVisible: true,
        propertyTransitions: {
          elevationScale: [transition({startValue: -Number.MAX_VALUE, endValue: Number.MAX_VALUE})]
        }
      },
      animatableProps: [
        {...elevation, range: [-Number.MAX_VALUE, Number.MAX_VALUE] as [number, number]}
      ]
    };
    expect(getLayerAnimatedVisConfig(extreme, 3000)).toEqual({elevationScale: 0});
  });
});
