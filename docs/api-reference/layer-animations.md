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

During coordinated playback or export, `renderLayer` reads the current animation values through `this.config`. The renderer temporarily substitutes a shallow configuration copy with the animated color and `visConfig` overrides, then restores the authored configuration in `finally`, before returning or reporting a rendering error. The original layer instance remains the receiver, so private fields, caches, and redraw callbacks work normally. Static rendering uses the authored configuration directly.

Capture the configuration or individual values when creating accessors that execute after `renderLayer` returns. This keeps each frame's values available after restoration, subsequent frames, or another map renders:

```ts
renderLayer(opts) {
  const {config} = this;
  return [
    new MyDeckLayer({
      ...this.getDefaultDeckLayerProps(opts),
      radiusScale: config.visConfig.radius,
      getFillColor: () => config.color
    })
  ];
}
```

Treat the render configuration as read-only. Deferred accessors should read their captured values rather than looking up `this.config` later, when it contains the authored settings again. Callbacks that edit saved settings run outside the synchronous rendering scope. Subclasses can delegate to `super.renderLayer(opts)` normally.

## Compatibility

Existing layer `opacityTransitions` and older `visibilityTiming` remain readable. A `propertyTransitions.opacity` entry takes precedence, including an empty array. Editing a legacy layer in the Animation editor migrates its opacity blocks to the property map while preserving sibling tracks.

Annotations use the same opacity block fields in `annotation.opacityTransitions`. Effects use `effect.animation[parameterName]` with optional paired `startTimeMs` and `endTimeMs`. Effects without explicit times continue to span the full playback or export duration; standalone preview falls back to 10 seconds when no timed tracks or camera tour define a duration.
