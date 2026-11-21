# Layer animations

The Animation editor uses elapsed time independently of dataset time filters. Layer classes declare supported numeric properties through `animatableProps`. The base layer exposes opacity; subclasses can extend this list with properties their renderer reads from `config.visConfig`.

```ts
import type {LayerAnimatableProp} from '@kepler.gl/types';

get animatableProps(): readonly LayerAnimatableProp[] {
  return [
    ...super.animatableProps,
    {name: 'radius', label: 'Radius', range: [0, 100], step: 0.1}
  ];
}
```

Only expose a property when the current renderer supports it. For example, a layer may omit a fixed radius when a data field controls point size. The editor uses each descriptor's label, range, and step for its controls.

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
- Values must be finite and within the property's declared range. Easing supports `linear` and `easeInOut`.
- Each property supports multiple blocks with unique IDs. Blocks on the same property cannot overlap; different properties can animate concurrently.
- Playback holds the first start value before the first block, interpolates during a block, and holds its end value until the next block and after the final block. Equal start and end times create an instantaneous change.
- Numeric properties use native `visConfig` units. Opacity uses a multiplier from 0 to 1, combined with configured opacity and fade-on-zoom.

Playback applies temporary render values without changing authored `visConfig`. Unsupported saved properties remain preserved but inactive. Removing a property from `animatableProps` also makes its track inactive.

## Compatibility

Existing layer `opacityTransitions` and older `visibilityTiming` remain readable. A `propertyTransitions.opacity` entry takes precedence, including an empty array. Editing a legacy layer in the Animation editor migrates its opacity blocks to the property map while preserving sibling tracks.

Annotations use the same opacity block fields in `annotation.opacityTransitions`. Effects use `effect.animation[parameterName]` with optional paired `startTimeMs` and `endTimeMs`. Effects without explicit times continue to span the full playback or export duration; standalone preview falls back to 10 seconds when no timed tracks or camera tour define a duration.
