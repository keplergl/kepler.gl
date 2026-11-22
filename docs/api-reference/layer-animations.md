# Layer animations

The experimental Animation editor button and floating panel are hidden by default. Enable them through application configuration:

```ts
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableAnimationEditor: true});
```

This flag only controls access to the editor; it does not disable playback or change saved animations.

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

Store blocks in `layer.config.propertyTransitions` or `annotation.propertyTransitions`, keyed by property name. Annotations currently support `opacity`; layers expose their supported properties through `animatableProps`:

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

Playback applies temporary render values without changing authored colors or `visConfig`. Unsupported saved properties remain preserved but inactive. Removing a property from `animatableProps` also makes its track inactive.

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

## Effects

Effects use `effect.animation[parameterName]` as an array of blocks, even for a single block. Every block requires a unique `id`, explicit `startValue` and `endValue`, `easing`, and `startTimeMs` and `endTimeMs` in elapsed milliseconds. Each block keeps its authored timing regardless of playback or export duration. Earlier experimental formats (single objects, implicit start values, untimed blocks, and fog-height animation flags) are not supported; configure explicit blocks in the Animation editor.

## Camera timing in the Animation editor

The camera row shows numbered arrivals and a continuous sequence of **Hold** and **Move** segments. Click a stop marker to seek to its saved camera view. Double-click a segment for its duration and calculated start/end times; **Edit camera stop** opens that stop in the route editor. The popup can switch between the stop's hold and outgoing move, including zero-duration segments.

Drag a segment's right edge to change its duration. Later camera segments shift together without gaps; layer, annotation, and effect times stay fixed. The drag previews locally and saves on release. Escape or pointer cancellation discards it. Arrow keys on the end handle adjust by 0.1 seconds (Shift: 1 second). Use **Zoom out** for more drag space, or enter a longer duration in the popup. Extend the first hold to delay movement.

Zero holds pass through a stop; zero moves are instant cuts. The final stop has only a hold. Timing edits pause coordinated playback at the current frame, clamped if the animation becomes shorter. Camera positions and stop order remain editable in the route editor. These controls use the existing `holdDurationMs` and `travelDurationMs` fields without changing the saved tour format.
