# Point

![Point layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image34.png "Point layer")

Point layers draw points for a given event or object.

__Layer Attributes__
- Basic
  - Columns:
    - Latitude
    - Longitude
    - Altitude (optional)
- Fill
  - Enable fill - enabled by default
  - Single color / color based on
  - Color scale
  - Opacity
- Outline
  - Enable outline
  - Single color / color based on
  - Color scale
  - Stroke width
- Radius
  - Single radius / radius based on
  - Fixed radius to meter
- Text,
 - Font Size
 - Font Color
 - Text Anchor

## Pulse / Ripple

Enable **Pulse / Ripple** at the end of the Point layer settings to animate the points. The effect is off by default, with its controls in a collapsed group.

- **Pulse** smoothly grows and shrinks dots, fading them as they expand.
- **Ripple** draws expanding rings that fade out and repeat.
- **Speed (cycles/s)** controls the repetition rate, from 0.1 to 3 cycles per second.
- **Expansion** controls the maximum radius, from 1 to 5 times the point radius.

The effect loops continuously while the layer is visible; it does not require a timestamp field or timeline playback. It uses the point layer's colors, sizes, opacity, filters, and map or billboard orientation. Text labels stay still. Settings are saved with the map and retained when the effect is turned off.

[Back to table of contents](../README.md)
