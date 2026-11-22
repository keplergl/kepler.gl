// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import PostProcessingEffect, {getDefaultValueForParameter} from './post-processing-effect';
import {getAnimatableEffectParameters, validateEffectAnimation} from './animation-utils';
import {LIGHT_AND_SHADOW_EFFECT, POSTPROCESSING_EFFECTS} from '@kepler.gl/constants';
import {DeckRenderer, WebMercatorViewport} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';

describe('post-processing effect parameters', () => {
  test.each(['brightnessContrast', 'triangleBlur'])(
    'renders both %s effects when a second instance is added',
    type => {
      const effects = [new PostProcessingEffect({type}), new PostProcessingEffect({type})];
      const renderer = new DeckRenderer(device);
      const drawLayers = jest.spyOn(renderer.drawLayersPass, 'render').mockReturnValue([]);
      const render = (activeEffects: PostProcessingEffect[]) =>
        renderer.renderLayers({
          pass: 'test',
          layers: [],
          viewports: [new WebMercatorViewport({width: 1, height: 1})],
          views: {},
          onViewportActive: jest.fn(),
          effects: activeEffects.map(effect => effect.deckEffect),
          target: null
        });
      try {
        effects.forEach(effect => effect.deckEffect.setup({device}));
        render([effects[0]]);
        // Exercise the real postprocessing chain with the canvas as its final target.
        expect(() => render(effects)).not.toThrow();
        expect(() => render([...effects].reverse())).not.toThrow();
      } finally {
        effects.forEach(effect => effect.deckEffect.cleanup());
        renderer.finalize();
        drawLayers.mockRestore();
      }
    }
  );

  test('resolves defaults in UI, uniform value, raw uniform, then minimum order', () => {
    expect(
      getDefaultValueForParameter('amount', [{name: 'amount', min: -1, max: 1, defaultValue: 0}], {
        amount: {value: 0.5}
      })
    ).toBe(0);
    expect(
      getDefaultValueForParameter('amount', [{name: 'amount', min: -1, max: 1}], {
        amount: {value: 0}
      })
    ).toBe(0);
    expect(
      getDefaultValueForParameter('amount', [{name: 'amount', min: -1, max: 1}], {amount: 0.5})
    ).toBe(0.5);
    expect(getDefaultValueForParameter('amount', [{name: 'amount', min: -1, max: 1}], {})).toBe(-1);
  });

  test('initializes real deck effect uniforms from shader and UI defaults', () => {
    const effect = new PostProcessingEffect({type: 'hueSaturation'});
    expect(effect.parameters).toMatchObject({hue: 0, saturation: 0.25});
    expect(effect.deckEffect.props).toEqual(effect.parameters);
    expect(effect.isValidToSave()).toBe(true);
  });

  test('explicit zero parameters override defaults and input is not mutated', () => {
    const parameters = Object.freeze({saturation: 0});
    const effect = new PostProcessingEffect({type: 'hueSaturation', parameters});
    expect(effect.parameters).toMatchObject({hue: 0, saturation: 0});
    expect(effect.deckEffect.props).toEqual(effect.parameters);
    expect(parameters).toEqual({saturation: 0});
  });

  test('validates initial and updated values before synchronizing uniforms', () => {
    const effect = new PostProcessingEffect({
      type: 'brightnessContrast',
      parameters: {brightness: 4, contrast: -4}
    });
    expect(effect.deckEffect.props).toMatchObject({brightness: 1, contrast: -1});
    effect.setProps({parameters: {brightness: -4}});
    expect(effect.parameters).toMatchObject({brightness: -1, contrast: -1});
    expect(effect.deckEffect.props).toEqual(effect.parameters);
    effect.setProps({parameters: {contrast: 0}});
    expect(effect.deckEffect.props).toMatchObject({brightness: -1, contrast: 0});
  });

  test('flag-only edits preserve uniforms and honor explicit false values', () => {
    const effect = new PostProcessingEffect({type: 'vibrance', parameters: {amount: 0.75}});
    effect.setProps({isEnabled: false, isConfigActive: false, isJsonEditorActive: true});
    expect(effect.isEnabled).toBe(false);
    expect(effect.isConfigActive).toBe(false);
    expect(effect.isJsonEditorActive).toBe(true);
    expect(effect.deckEffect.props).toEqual({amount: 0.75});
    effect.setProps({isJsonEditorActive: false});
    expect(effect.isJsonEditorActive).toBe(false);
    expect(effect.parameters).toEqual({amount: 0.75});
  });

  test('clones preserve configuration but have independent uniforms and deck instances', () => {
    const effect = new PostProcessingEffect({
      id: 'saved-effect',
      type: 'dotScreen',
      isEnabled: false,
      isConfigActive: false,
      isJsonEditorActive: true,
      parameters: {center: [0.2, 0.8], size: 4}
    });
    const clone = effect.clone();
    expect(clone).toBeInstanceOf(PostProcessingEffect);
    expect(clone.id).toBe('saved-effect');
    expect(clone.type).toBe(effect.type);
    expect(clone.isEnabled).toBe(false);
    expect(clone.isConfigActive).toBe(false);
    expect(clone.isJsonEditorActive).toBe(true);
    expect(clone.parameters).toEqual(effect.parameters);
    expect(clone.deckEffect).not.toBe(effect.deckEffect);
    expect(clone.deckEffect.id).toBe(effect.deckEffect.id);
    expect(clone.parameters.center).not.toBe(effect.parameters.center);
    clone.setProps({parameters: {center: [0.9, 0.1], size: 8}});
    expect(clone.deckEffect.props).toMatchObject({center: [0.9, 0.1], size: 8});
    expect(effect.deckEffect.props).toMatchObject({center: [0.2, 0.8], size: 4});
  });

  test('unknown effect types do not create a saveable deck effect', () => {
    const effect = new PostProcessingEffect({type: 'unknown-effect'});
    expect(effect.deckEffect).toBeNull();
    expect(effect.isValidToSave()).toBe(false);
    expect(effect.getParameterDescriptions()).toEqual([]);
  });

  test('optional animation preserves static parameters and never reaches shader uniforms', () => {
    const effect = new PostProcessingEffect({type: 'brightnessContrast'});
    expect(effect).not.toHaveProperty('animation');
    const parameters = {...effect.parameters};
    effect.setProps({
      animation: {
        brightness: [
          {
            id: 'brightness-1',
            startValue: 0,
            startTimeMs: 0,
            endTimeMs: 10000,
            endValue: 0,
            easing: 'linear'
          }
        ]
      }
    });
    expect(effect.animation).toEqual({
      brightness: [
        {
          id: 'brightness-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ]
    });
    expect(effect.parameters).toEqual(parameters);
    expect(effect.deckEffect.props).toEqual(parameters);
    effect.setProps({parameters: {contrast: 0.5}});
    expect(effect.animation).toEqual({
      brightness: [
        {
          id: 'brightness-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ]
    });
    effect.setProps({
      animation: {
        contrast: [
          {
            id: 'contrast-1',
            startValue: 0,
            startTimeMs: 0,
            endTimeMs: 10000,
            endValue: 1,
            easing: 'easeInOut'
          }
        ]
      }
    });
    expect(effect.animation).toEqual({
      contrast: [
        {
          id: 'contrast-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 1,
          easing: 'easeInOut'
        }
      ]
    });
    effect.setProps({animation: {}});
    expect(effect).not.toHaveProperty('animation');
    expect(effect.parameters.contrast).toBe(0.5);
  });

  test.each([
    {startTimeMs: 0, endTimeMs: 0},
    {startTimeMs: 2000, endTimeMs: 5000}
  ])('preserves valid explicit timing through updates and clones: %j', timing => {
    const animation = {
      brightness: [
        {id: 'brightness-1', startValue: 0, endValue: 1, easing: 'linear' as const, ...timing}
      ]
    };
    const effect = new PostProcessingEffect({type: 'brightnessContrast', animation});
    effect.setProps({parameters: {brightness: 0.5}});
    expect(effect.animation).toEqual(animation);
    expect(effect.clone().animation).toEqual(animation);
    expect(effect.deckEffect.props.brightness).toBe(0.5);
    expect(effect.deckEffect.props).not.toHaveProperty('startTimeMs');
  });

  test.each([
    {},
    {startTimeMs: 0},
    {endTimeMs: 1000},
    {startTimeMs: undefined, endTimeMs: 1000},
    {startTimeMs: -1, endTimeMs: 1000},
    {startTimeMs: 1000, endTimeMs: 999},
    {startTimeMs: NaN, endTimeMs: 1000},
    {startTimeMs: 0, endTimeMs: Infinity},
    {startTimeMs: '0', endTimeMs: 1000},
    {startTimeMs: null, endTimeMs: 1000}
  ])('rejects missing, invalid or incomplete time bounds: %j', timing => {
    const effect = new PostProcessingEffect({
      type: 'brightnessContrast',
      animation: {
        brightness: [{id: 'brightness-1', startValue: 0, endValue: 1, easing: 'linear', ...timing}]
      } as any
    });
    expect(effect).not.toHaveProperty('animation');
    expect(effect.parameters.brightness).toBe(0);
  });

  test('animation endpoints are bounded, independently cloned, and never mutate input', () => {
    const animation = {
      center: [
        {
          id: 'center-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: Object.freeze([2, -1]),
          endValue: Object.freeze([-1, 2]),
          easing: 'linear' as const
        }
      ],
      size: [
        {
          id: 'size-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: -2,
          endValue: 50,
          easing: 'easeInOut' as const
        }
      ]
    };
    const effect = new PostProcessingEffect({type: 'dotScreen', animation: animation as any});
    expect(effect.animation).toEqual({
      center: [
        {
          id: 'center-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: [1, 0],
          endValue: [0, 1],
          easing: 'linear'
        }
      ],
      size: [
        {
          id: 'size-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: 1,
          endValue: 20,
          easing: 'easeInOut'
        }
      ]
    });
    expect(animation.center[0].startValue).toEqual([2, -1]);
    expect(animation.center[0].endValue).toEqual([-1, 2]);
    const clone = effect.clone();
    expect(clone.animation).toEqual(effect.animation);
    expect(clone.animation).not.toBe(effect.animation);
    expect(clone.animation?.center).not.toBe(effect.animation?.center);
    expect((clone.animation?.center ?? [])[0].startValue).not.toBe(
      (effect.animation?.center ?? [])[0].startValue
    );
    expect((clone.animation?.center ?? [])[0].endValue).not.toBe(
      (effect.animation?.center ?? [])[0].endValue
    );
    ((clone.animation?.center ?? [])[0].startValue as number[])[0] = 0.25;
    ((clone.animation?.center ?? [])[0].endValue as number[])[0] = 0.75;
    expect((effect.animation?.center ?? [])[0].startValue).toEqual([1, 0]);
    expect((effect.animation?.center ?? [])[0].endValue).toEqual([0, 1]);
  });

  test('saved zero starts remain independent of static parameter edits', () => {
    const effect = new PostProcessingEffect({
      type: 'brightnessContrast',
      parameters: {brightness: 0.5},
      animation: {
        brightness: [
          {
            id: 'brightness-1',
            startTimeMs: 0,
            endTimeMs: 10000,
            startValue: 0,
            endValue: 1,
            easing: 'linear'
          }
        ]
      }
    });
    effect.setProps({parameters: {brightness: 0.75}});
    expect(effect.parameters.brightness).toBe(0.75);
    expect(effect.deckEffect.props.brightness).toBe(0.75);
    expect(effect.animation?.brightness).toEqual([
      {
        id: 'brightness-1',
        startTimeMs: 0,
        endTimeMs: 10000,
        startValue: 0,
        endValue: 1,
        easing: 'linear'
      }
    ]);
  });

  test('validates and copies color starts independently of end colors', () => {
    const startValue = Object.freeze([-20, 0, 300]);
    const endValue = Object.freeze([255, 80, 10]);
    const animation = validateEffectAnimation(
      {
        fogColor: [
          {
            id: 'fogColor-1',
            startTimeMs: 0,
            endTimeMs: 10000,
            startValue,
            endValue,
            easing: 'easeInOut'
          }
        ]
      },
      POSTPROCESSING_EFFECTS.surfaceFog.parameters
    );
    expect(animation).toEqual({
      fogColor: [
        {
          id: 'fogColor-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: [0, 0, 255],
          endValue: [255, 80, 10],
          easing: 'easeInOut'
        }
      ]
    });
    expect((animation?.fogColor ?? [])[0].startValue).not.toBe(startValue);
    expect((animation?.fogColor ?? [])[0].endValue).not.toBe(endValue);
    expect(startValue).toEqual([-20, 0, 300]);
  });

  test.each([
    {
      size: [
        {
          id: 'size-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: undefined,
          endValue: 2,
          easing: 'linear'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: null,
          endValue: 2,
          easing: 'linear'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: NaN,
          endValue: 2,
          easing: 'linear'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: Infinity,
          endValue: 2,
          easing: 'linear'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: '1',
          endValue: 2,
          easing: 'linear'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: [1],
          endValue: 2,
          easing: 'linear'
        }
      ]
    },
    {
      center: [
        {
          id: 'center-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: [0.2],
          endValue: [0.2, 0.8],
          easing: 'linear'
        }
      ]
    },
    {
      center: [
        {
          id: 'center-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: [0.2, NaN],
          endValue: [0.2, 0.8],
          easing: 'linear'
        }
      ]
    },
    {
      center: [
        {
          id: 'center-1',
          startTimeMs: 0,
          endTimeMs: 10000,
          startValue: 0,
          endValue: [0.2, 0.8],
          easing: 'linear'
        }
      ]
    }
  ])('rejects explicit invalid starts instead of using the current value: %j', animation => {
    expect(validateEffectAnimation(animation, POSTPROCESSING_EFFECTS.dotScreen.parameters)).toBe(
      undefined
    );
  });

  test.each([
    undefined,
    null,
    [],
    {},
    {size: null},
    {
      size: [
        {
          id: 'size-1',
          startValue: 1,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: null,
          easing: 'linear'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startValue: 1,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: NaN,
          easing: 'linear'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startValue: 1,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: Infinity,
          easing: 'linear'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startValue: 1,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 2,
          easing: 'invalid'
        }
      ]
    },
    {
      size: [
        {
          id: 'size-1',
          startValue: 1,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: '2',
          easing: 'linear'
        }
      ]
    },
    {
      center: [
        {
          id: 'center-1',
          startValue: [0, 0],
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: [0.2],
          easing: 'linear'
        }
      ]
    },
    {
      center: [
        {
          id: 'center-1',
          startValue: [0, 0],
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: [0.2, NaN],
          easing: 'linear'
        }
      ]
    },
    {
      center: [
        {
          id: 'center-1',
          startValue: [0, 0],
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: null,
          easing: 'linear'
        }
      ]
    },
    {
      unknown: [
        {
          id: 'unknown-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 2,
          easing: 'linear'
        }
      ]
    }
  ])('invalid or absent animation stays static: %j', animation => {
    const effect = new PostProcessingEffect({type: 'dotScreen', animation} as any);
    expect(effect).not.toHaveProperty('animation');
    expect(effect.deckEffect.props).toEqual(effect.parameters);
  });

  test.each([
    [0, Date.UTC(2024, 0, 1)],
    [Date.UTC(2024, 0, 1), 0],
    [0, 8.64e15],
    [8.64e15, 0]
  ])(
    'accepts timestamp endpoints from %s to %s, including reverse ranges',
    (startValue, endValue) => {
      const animation = {
        timestamp: [
          {
            id: 'timestamp-1',
            startTimeMs: 0,
            endTimeMs: 10000,
            startValue,
            endValue,
            easing: 'linear'
          }
        ]
      };
      expect(validateEffectAnimation(animation, LIGHT_AND_SHADOW_EFFECT.parameters)).toEqual(
        animation
      );
    }
  );

  test.each([8.64e15 + 1, -8.64e15 - 1, Number.MAX_SAFE_INTEGER, Infinity, NaN, null, '0', [0]])(
    'rejects invalid timestamp endpoint %j instead of clamping it into a valid date',
    value => {
      for (const endpoint of ['startValue', 'endValue']) {
        expect(
          validateEffectAnimation(
            {
              timestamp: [
                {
                  id: 'timestamp-1',
                  startTimeMs: 0,
                  endTimeMs: 10000,
                  startValue: 0,
                  endValue: 1,
                  [endpoint]: value,
                  easing: 'linear'
                }
              ]
            },
            LIGHT_AND_SHADOW_EFFECT.parameters
          )
        ).toBeUndefined();
      }
    }
  );

  test('only continuous effect descriptors accept animation endpoints', () => {
    const descriptions = [
      ...POSTPROCESSING_EFFECTS.surfaceFog.parameters,
      ...LIGHT_AND_SHADOW_EFFECT.parameters,
      {name: '_private', min: 0, max: 1}
    ];
    const animation = Object.fromEntries(
      descriptions.map(description => [
        description.name,
        [
          {
            id: `${description.name}-1`,
            startValue: 0,
            startTimeMs: 0,
            endTimeMs: 10000,
            endValue: 0,
            easing: 'linear'
          }
        ]
      ])
    );
    animation.fogColor[0].startValue = [0, 0, 0] as any;
    animation.fogColor[0].endValue = [0, 100, 300] as any;
    expect(validateEffectAnimation(animation, descriptions)).toEqual({
      density: [
        {
          id: 'density-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ],
      height: [
        {
          id: 'height-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ],
      thickness: [
        {
          id: 'thickness-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ],
      fogColor: [
        {
          id: 'fogColor-1',
          startValue: [0, 0, 0],
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: [0, 100, 255],
          easing: 'linear'
        }
      ],
      timestamp: [
        {
          id: 'timestamp-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ],
      shadowIntensity: [
        {
          id: 'shadowIntensity-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ],
      sunLightIntensity: [
        {
          id: 'sunLightIntensity-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ],
      ambientLightIntensity: [
        {
          id: 'ambientLightIntensity-1',
          startValue: 0,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 0,
          easing: 'linear'
        }
      ]
    });
    expect(
      getAnimatableEffectParameters({getParameterDescriptions: () => descriptions}).map(
        description => description.name
      )
    ).toEqual([
      'density',
      'height',
      'thickness',
      'fogColor',
      'timestamp',
      'shadowIntensity',
      'sunLightIntensity',
      'ambientLightIntensity',
      'shadowColor',
      'sunLightColor',
      'ambientLightColor'
    ]);
  });
});

describe('effect animation sequences', () => {
  test.each(
    [
      {id: 'one', startValue: 0, endValue: 1, easing: 'linear', startTimeMs: 0, endTimeMs: 1000},
      [{id: 'one', endValue: 1, easing: 'linear', startTimeMs: 0, endTimeMs: 1000}],
      [{startValue: 0, endValue: 1, easing: 'linear', startTimeMs: 0, endTimeMs: 1000}]
    ].map(blocks => ({blocks}))
  )(
    'rejects experimental single objects and blocks missing explicit starts or IDs: %j',
    ({blocks}) => {
      const effect = new PostProcessingEffect({
        type: 'brightnessContrast',
        animation: {brightness: blocks} as any
      });
      expect(effect.animation).toBeUndefined();
      expect(effect.parameters.brightness).toBe(0);
      expect(effect.deckEffect.props.brightness).toBe(0);
    }
  );

  const first = {
    id: 'first',
    startTimeMs: 1000,
    endTimeMs: 3000,
    startValue: [0.2, 0.8],
    endValue: [0.8, 0.2],
    easing: 'linear' as const
  };
  const second = {
    id: 'second',
    startTimeMs: 5000,
    endTimeMs: 7000,
    startValue: [0.8, 0.2],
    endValue: [0.4, 0.6],
    easing: 'easeInOut' as const
  };
  test('sorts timed blocks and clones endpoints without changing static parameters', () => {
    const effect = new PostProcessingEffect({
      type: 'dotScreen',
      animation: {center: [second, first]}
    });
    expect(effect.animation?.center).toEqual([first, second]);
    const clone = effect.clone();
    expect(clone.animation).toEqual(effect.animation);
    const copied = clone.animation?.center ?? [];
    expect(copied[0].startValue).not.toBe(first.startValue);
    expect(copied[0].startValue).not.toBe((effect.animation?.center ?? [])[0].startValue);
    effect.setProps({parameters: {center: [0.1, 0.9]}});
    expect(effect.animation?.center).toEqual([first, second]);
    expect(effect.deckEffect.props.center).toEqual([0.1, 0.9]);
  });
  test.each(
    [
      [],
      [first, {...second, id: 'first'}],
      [{...first, id: ''}],
      [{...first, id: undefined}],
      [{...first, startValue: undefined}],
      [{...first, startTimeMs: undefined}],
      [{...first, endTimeMs: undefined}],
      [{...first, endTimeMs: NaN}],
      [first, {...second, startTimeMs: 2000}],
      [first, {...second, startValue: [0, NaN]}],
      [[first]]
    ].map(blocks => ({blocks}))
  )('rejects invalid sequences without removing valid sibling parameters: %j', ({blocks}) => {
    expect(
      validateEffectAnimation(
        {
          center: blocks,
          size: [
            {
              id: 'size-1',
              startValue: 1,
              startTimeMs: 0,
              endTimeMs: 10000,
              endValue: 2,
              easing: 'linear'
            }
          ]
        },
        POSTPROCESSING_EFFECTS.dotScreen.parameters
      )
    ).toEqual({
      size: [
        {
          id: 'size-1',
          startValue: 1,
          startTimeMs: 0,
          endTimeMs: 10000,
          endValue: 2,
          easing: 'linear'
        }
      ]
    });
  });
  test('allows adjacent transitions and ordered instantaneous cuts', () => {
    const cut = {...second, startTimeMs: 3000, endTimeMs: 3000};
    expect(
      validateEffectAnimation({center: [first, cut]}, POSTPROCESSING_EFFECTS.dotScreen.parameters)
        ?.center
    ).toEqual([first, cut]);
  });
});
