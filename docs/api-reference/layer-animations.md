# Layer animations

The Animation editor uses elapsed time independently of dataset time filters. Layer classes declare supported numeric and RGB color properties through `animatableProps`. The base layer exposes opacity; subclasses can extend this list with properties their renderer supports.

```ts
import type {LayerAnimatableProp} from '@kepler.gl/types';

get animatableProps(): readonly LayerAnimatableProp[] {
  return [
    ...super.animatableProps,
    {name: 'radius', label: 'Radius', range: [0, 100], step: 0.1},
    {name: 'color', label: 'Fill color', type: 'color'}
  ];
}
```

Only expose a property when the current renderer supports it. For example, a layer may omit a fixed radius or color when a data field controls that channel. Numeric descriptors retain their range and step; color descriptors use `type: 'color'` and show start/end color pickers. A color descriptor named `color` targets `config.color`; other supported properties target `config.visConfig`.

## Saved transitions

Store blocks in `layer.config.propertyTransitions`, keyed by property name:

```json
{
  "propertyTransitions": {
    "radius": [
      {
        "id": "grow",
        "startTimeMs": 2000,
        "endTimeMs": 5000,
        "startValue": 10,
        "endValue": 30,
        "easing": "easeInOut"
      }
    ]
  }
}
```

- Times are nonnegative milliseconds from animation start. The editor displays seconds.
- Numeric values must be finite and within the property's declared range. Color values are RGB triples such as `[255, 128, 0]`, with finite channels from 0 to 255. Both endpoints and every block on a property must use the same value type. Easing supports `linear` and `easeInOut`.
- Each property supports multiple blocks with unique IDs. Blocks on the same property cannot overlap; different properties can animate concurrently.
- Playback holds the first start value before the first block, interpolates during a block, and holds its end value until the next block and after the final block. Equal start and end times create an instantaneous change.
- Numeric properties use native `visConfig` units. Opacity uses a multiplier from 0 to 1, combined with configured opacity and fade-on-zoom.
- Color channels interpolate independently in RGB using the selected easing. Alpha stays controlled by opacity. Existing data-field colors and GeoJSON feature colors retain precedence over fixed-color animation.

Playback applies temporary render values without changing authored colors or `visConfig`. Unsupported saved properties remain preserved but inactive. Removing a property from `animatableProps` also makes its track inactive. Existing numeric transitions require no migration.

For custom rendering, `getLayerAnimatedConfig(layer, timeMs)` from `@kepler.gl/utils` returns the frame's `{color?, visConfig?}` overrides. `getLayerAnimatedVisConfig` returns only the `visConfig` portion. Both return empty objects outside playback; opacity remains available separately through `getLayerAnimationOpacityFactor`.

## Custom renderers

`renderLayer` receives an optional `frameConfig` containing the full layer configuration with the current numeric and color animation values applied. Built-in renderers use it automatically. Custom renderers that expose these properties must read `frameConfig` for their rendered values, falling back to `this.config` for static rendering:

```ts
renderLayer({frameConfig = this.config, ...opts}) {
  return [
    new MyDeckLayer({
      ...this.getDefaultDeckLayerProps({...opts, frameConfig}),
      radiusScale: frameConfig.visConfig.radius,
      getFillColor: () => frameConfig.color
    })
  ];
}
```

Rendering keeps the original layer instance as `this`, so private fields, instance caches, and callbacks work normally. Authored `this.config` remains unchanged. Treat `frameConfig` as read-only and capture it in deferred accessors, as above, so an earlier frame retains its values after later frames render. Custom subclasses delegating to a built-in `super.renderLayer(opts)` should pass the options through unchanged. Opacity-only animation continues to work without adopting `frameConfig`.

## Compatibility

Existing layer `opacityTransitions` and older `visibilityTiming` remain readable. A `propertyTransitions.opacity` entry takes precedence, including an empty array. Editing a legacy layer in the Animation editor migrates its opacity blocks to the property map while preserving sibling tracks.

Annotations use the same opacity block fields in `annotation.opacityTransitions`. Effects use `effect.animation[parameterName]` with optional paired `startTimeMs` and `endTimeMs`. Effects without explicit times continue to span the full playback or export duration; standalone preview falls back to 10 seconds when no timed tracks or camera tour define a duration.
