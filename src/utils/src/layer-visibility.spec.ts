// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  getLayerOpacityFactor,
  getAnnotationOpacityDuration,
  DEFAULT_LAYER_ANIMATABLE_PROPS,
  normalizeLayerPropertyTransitions,
  getLayerPropertyTransitions,
  getLayerAnimationTracks,
  getLayerAnimationDuration,
  getLayerAnimationOpacityFactor,
  getLayerAnimatedConfig
} from './layer-visibility';
import type {LayerAnimatableProp, LayerPropertyTransition, RGBColor} from '@kepler.gl/types';

test('annotation duration follows only visible valid tracks, including instantaneous and cleared tracks', () => {
  const opacityTransitions = [
    transition({id: 'later', startTimeMs: 6000, endTimeMs: 8000}),
    transition()
  ];
  const futureProperty = [transition({endTimeMs: 50000, endValue: 100})];
  const annotation = {
    isVisible: true,
    propertyTransitions: {opacity: opacityTransitions, futureProperty}
  };
  expect(getAnnotationOpacityDuration([])).toBe(0);
  expect(getAnnotationOpacityDuration([{isVisible: true}])).toBe(0);
  expect(
    getAnnotationOpacityDuration([{isVisible: true, propertyTransitions: {futureProperty}}])
  ).toBe(0);
  expect(getAnnotationOpacityDuration([annotation])).toBe(8000);
  expect(
    getAnnotationOpacityDuration([
      annotation,
      {isVisible: false, propertyTransitions: {opacity: [transition({endTimeMs: 50000})]}}
    ])
  ).toBe(8000);
  expect(
    getAnnotationOpacityDuration([{isVisible: true, propertyTransitions: {opacity: []}}])
  ).toBe(0);
  expect(
    getAnnotationOpacityDuration([
      {
        isVisible: true,
        propertyTransitions: {opacity: [transition({startTimeMs: 0, endTimeMs: 0})]}
      }
    ])
  ).toBe(0);
  expect(
    getAnnotationOpacityDuration([
      {
        isVisible: true,
        propertyTransitions: {
          opacity: [transition(), transition({id: 'overlap', startTimeMs: 3000})]
        }
      }
    ])
  ).toBe(0);
  expect(opacityTransitions[0].id).toBe('later');
});

const transition = (
  overrides: Partial<Extract<LayerPropertyTransition, {startValue: number}>> = {}
): Extract<LayerPropertyTransition, {startValue: number}> => ({
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
    const result = normalizeLayerPropertyTransitions({opacity: input})!.opacity;
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
    expect(normalizeLayerPropertyTransitions({opacity: input})).toBeUndefined();
  });

  test.each([
    transition({id: 'overlap', startTimeMs: 3000, endTimeMs: 5000}),
    transition({id: 'inside', startTimeMs: 2500, endTimeMs: 3000}),
    transition({id: 'cut-inside', startTimeMs: 3000, endTimeMs: 3000}),
    transition({id: 'same', startTimeMs: 2000, endTimeMs: 4000})
  ])('rejects overlapping intervals and cuts inside an active interval: %p', overlap => {
    expect(normalizeLayerPropertyTransitions({opacity: [overlap, transition()]})).toBeUndefined();
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
    expect(
      normalizeLayerPropertyTransitions({opacity: [last, cutA, first, cutB]})?.opacity
    ).toEqual([first, cutA, cutB, last]);
    const config = {propertyTransitions: {opacity: [first, cutA, cutB]}};
    expect(getLayerOpacityFactor(config, 1999)).toBeCloseTo(0.7997);
    expect(getLayerOpacityFactor(config, 2000)).toBe(0.6);
    expect(getLayerOpacityFactor(config, 5000)).toBe(0.6);
  });

  const config = {
    propertyTransitions: {
      opacity: [
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
    }
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
    expect(normalizeLayerPropertyTransitions({opacity: []})?.opacity).toEqual([]);
    expect(getLayerOpacityFactor({}, 0)).toBe(1);
    expect(getLayerOpacityFactor({propertyTransitions: {opacity: []}}, 0)).toBe(1);
    expect(
      getLayerOpacityFactor({propertyTransitions: {opacity: [transition({startValue: -1})]}}, 0)
    ).toBe(1);
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
    expect(getLayerAnimatedConfig(candidate, 3000).visConfig).toEqual({elevationScale: 10});
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
      expect(getLayerAnimatedConfig(layer, time).visConfig).toEqual({
        radius: radiusValue,
        elevationScale: height
      });
      expect(getLayerAnimationOpacityFactor(layer, time)).toBe(
        getLayerOpacityFactor(layer.config, time)
      );
    }
  );

  test('defaults plain fixtures to opacity and respects an explicit empty whitelist or narrower range', () => {
    expect(getLayerAnimationTracks({config: layer.config}).map(item => item.property.name)).toEqual(
      ['opacity']
    );
    expect(getLayerAnimatedConfig({config: layer.config}, 3000)).toEqual({});
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
    getLayerAnimatedConfig(layer, 7000);
    expect(getLayerAnimatedConfig(layer, 3000).visConfig).toEqual({
      radius: 20,
      elevationScale: 10
    });
    expect(layer.config).toEqual(original);
    for (const time of [undefined, null, NaN, Infinity]) {
      expect(getLayerAnimatedConfig(layer, time)).toEqual({});
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
    expect(getLayerAnimatedConfig(candidate, 1000).visConfig).toEqual({elevationScale: 0});
    expect(getLayerAnimatedConfig(candidate, 2000).visConfig).toEqual({elevationScale: -20});
    expect(getLayerAnimatedConfig(candidate, 3000).visConfig).toEqual({elevationScale: -20});
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
    expect(getLayerAnimatedConfig(extreme, 3000).visConfig).toEqual({elevationScale: 0});
  });
});

describe('layer color property transitions', () => {
  type ColorTransition = Extract<LayerPropertyTransition, {startValue: RGBColor}>;
  const colorTransition = (overrides: Partial<ColorTransition> = {}): ColorTransition => ({
    ...transition(),
    startValue: [0, 20, 40],
    endValue: [100, 120, 200],
    ...overrides
  });
  const color: LayerAnimatableProp = {name: 'color', label: 'Color', type: 'color'};
  const stroke: LayerAnimatableProp = {name: 'strokeColor', label: 'Stroke color', type: 'color'};
  const radius: LayerAnimatableProp = {name: 'radius', label: 'Radius', range: [0, 100], step: 1};
  const layer = {
    config: {
      isVisible: true,
      propertyTransitions: {
        color: [
          colorTransition(),
          colorTransition({
            id: 'later',
            startTimeMs: 6000,
            endTimeMs: 10000,
            startValue: [100, 120, 200],
            endValue: [20, 40, 0],
            easing: 'easeInOut'
          }),
          colorTransition({
            id: 'cut',
            startTimeMs: 10000,
            endTimeMs: 10000,
            startValue: [20, 40, 0],
            endValue: [255, 255, 255]
          })
        ],
        strokeColor: [colorTransition()],
        radius: [transition({startValue: 10, endValue: 30})],
        opacity: [transition()]
      }
    },
    animatableProps: [...DEFAULT_LAYER_ANIMATABLE_PROPS, color, stroke, radius]
  };

  test('deep-clones color endpoints, sorts blocks and preserves existing numeric configs', () => {
    const source = {
      ...layer.config.propertyTransitions,
      color: [...layer.config.propertyTransitions.color].reverse()
    };
    const normalized = normalizeLayerPropertyTransitions(source)!;
    expect(normalized.color.map(block => block.id)).toEqual(['in', 'later', 'cut']);
    expect(normalized.color[0].startValue).not.toBe(source.color[2].startValue);
    expect(normalized.color[0].endValue).not.toBe(source.color[2].endValue);
    expect(normalized.radius).toEqual(source.radius);
    expect(source.color.map(block => block.id)).toEqual(['cut', 'later', 'in']);
    expect(normalizeLayerPropertyTransitions({futureColor: [colorTransition()]})).toEqual({
      futureColor: [colorTransition()]
    });
  });

  test.each([
    {startValue: 1},
    {endValue: 1},
    {startValue: []},
    {startValue: [0, 10]},
    {endValue: [0, 10, 20, 30]},
    {startValue: [0, -1, 20]},
    {endValue: [0, 10, 256]},
    {startValue: [0, NaN, 20]},
    {endValue: [0, Infinity, 20]},
    {startValue: ['0', 10, 20]},
    {endValue: new Array(3)}
  ])('rejects malformed RGB or mixed endpoint types: %p', overrides => {
    expect(
      normalizeLayerPropertyTransitions({color: [{...colorTransition(), ...overrides}]})
    ).toBeUndefined();
  });

  test('rejects changing endpoint kinds within one track, but supports concurrent property kinds', () => {
    expect(
      normalizeLayerPropertyTransitions({
        color: [colorTransition(), transition({id: 'numeric', startTimeMs: 6000, endTimeMs: 8000})]
      })
    ).toBeUndefined();
    expect(normalizeLayerPropertyTransitions(layer.config.propertyTransitions)).toEqual(
      layer.config.propertyTransitions
    );
  });

  test.each([
    [0, [0, 20, 40]],
    [2000, [0, 20, 40]],
    [3000, [50, 70, 120]],
    [4000, [100, 120, 200]],
    [5000, [100, 120, 200]],
    [6000, [100, 120, 200]],
    [7000, [87.5, 107.5, 168.75]],
    [8000, [60, 80, 100]],
    [10000, [255, 255, 255]],
    [20000, [255, 255, 255]]
  ])('interpolates channels and holds boundaries, gaps and cuts at %i ms', (timeMs, expected) => {
    expect(getLayerAnimatedConfig(layer, timeMs).color).toEqual(expected);
  });

  test('routes base color separately while mixing numeric and color visConfig values', () => {
    expect(getLayerAnimatedConfig(layer, 3000)).toEqual({
      color: [50, 70, 120],
      visConfig: {strokeColor: [50, 70, 120], radius: 20}
    });
    expect(getLayerAnimatedConfig(layer, 3000).visConfig).toEqual({
      strokeColor: [50, 70, 120],
      radius: 20
    });
    expect(getLayerAnimationOpacityFactor(layer, 3000)).toBe(0.5);
    expect(getLayerAnimationDuration([layer])).toBe(10000);
  });

  test('preserves numeric custom properties named color in visConfig', () => {
    const numericLayer = {
      config: {
        isVisible: true,
        propertyTransitions: {color: [transition({startValue: 10, endValue: 30})]}
      },
      animatableProps: [{...radius, name: 'color'}]
    };
    expect(getLayerAnimatedConfig(numericLayer, 3000)).toEqual({visConfig: {color: 20}});
    expect(getLayerAnimatedConfig(numericLayer, 3000).visConfig).toEqual({color: 20});
    expect(getLayerAnimatedConfig({...layer, animatableProps: [color]}, 3000)).toEqual({
      color: [50, 70, 120]
    });
  });

  test('ignores unsupported colors and rejects tracks that do not match property metadata', () => {
    expect(getLayerAnimatedConfig({...layer, animatableProps: [radius]}, 3000)).toEqual({
      visConfig: {radius: 20}
    });
    expect(getLayerAnimationDuration([{...layer, animatableProps: [radius]}])).toBe(4000);
    const config = {
      isVisible: true,
      propertyTransitions: {
        color: [transition()],
        radius: [colorTransition()],
        opacity: [colorTransition()]
      }
    };
    expect(getLayerAnimationTracks({...layer, config})).toEqual([]);
    expect(getLayerOpacityFactor(config, 3000)).toBe(1);
    expect(getLayerPropertyTransitions(config, 'opacity')).toEqual([]);
    expect(normalizeLayerPropertyTransitions({opacity: [colorTransition()]})).toBeUndefined();
    expect(
      getLayerPropertyTransitions(layer.config, 'opacity', {...color, name: 'opacity'})
    ).toEqual([]);
    expect(
      getLayerAnimatedConfig(
        {...layer, config: {isVisible: true, propertyTransitions: {color: []}}},
        3000
      )
    ).toEqual({});
  });

  test('seeking and editing evaluated colors never mutate the saved track or static config', () => {
    const original = JSON.parse(JSON.stringify(layer.config));
    getLayerAnimatedConfig(layer, 7000).color![0] = 1;
    getLayerAnimatedConfig(layer, 0).color![0] = 2;
    (getLayerAnimatedConfig(layer, 20000).visConfig!.strokeColor as RGBColor)[0] = 3;
    expect(getLayerAnimatedConfig(layer, 3000).color).toEqual([50, 70, 120]);
    expect(layer.config).toEqual(original);
    for (const time of [undefined, null, NaN, Infinity]) {
      expect(getLayerAnimatedConfig(layer, time)).toEqual({});
    }
  });
});

test('toggle cuts hold boolean states at exact times without changing the saved format', () => {
  const fill: LayerAnimatableProp = {name: 'filled', label: 'Fill', type: 'toggle'};
  const off = transition({
    id: 'off',
    startTimeMs: 2000,
    endTimeMs: 2000,
    startValue: 1,
    endValue: 0
  });
  const on = {...off, id: 'on', startTimeMs: 4000, endTimeMs: 4000, startValue: 0, endValue: 1};
  const propertyTransitions = normalizeLayerPropertyTransitions({filled: [on, off]});
  expect(propertyTransitions).toEqual({filled: [off, on]});
  const layer = {
    config: {isVisible: true, propertyTransitions},
    animatableProps: [fill]
  };
  expect(getLayerAnimatedConfig(layer, 1999).visConfig).toEqual({filled: true});
  expect(getLayerAnimatedConfig(layer, 4000).visConfig).toEqual({filled: true});
  expect(getLayerAnimatedConfig(layer, 2000).visConfig).toEqual({filled: false});
  expect(getLayerAnimatedConfig(layer, 3999).visConfig).toEqual({filled: false});
  expect(getLayerAnimatedConfig(layer, null)).toEqual({});
  expect(getLayerAnimationDuration([layer])).toBe(5000);
  expect(getLayerAnimationDuration([{...layer, config: {...layer.config, isVisible: false}}])).toBe(
    0
  );
  for (const invalid of [
    [{...off, endTimeMs: 2500}],
    [{...off, endValue: 0.5}],
    [off, {...on, startTimeMs: 2000, endTimeMs: 2000}]
  ]) {
    expect(
      getLayerPropertyTransitions({propertyTransitions: {filled: invalid}}, 'filled', fill)
    ).toEqual([]);
  }
});
