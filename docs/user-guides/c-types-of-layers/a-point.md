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

## Visual

Expand **Visual** at the end of the Point layer settings to configure **Glow** and **Pulse / Ripple**. Both effects are off by default and can be enabled independently. Collapsing Visual keeps the current effects active.

### Glow

Enable **Glow** to add a soft halo around each point.

- **Extent** sets the halo radius, from 1 to 5 times the point's displayed radius. At 1, there is no halo.
- **Strength** sets the halo opacity, from 0 to 1. The halo fades smoothly toward its outer edge.

The halo uses the point's fill color, or its outline color for unfilled points, and follows its radius mapping, opacity, filters, and map or billboard orientation. The ordinary point and its picking area stay unchanged. With **Pulse / Ripple** enabled, the point continues to animate over a static halo. Labels stay still. Glow settings are saved with the map and retained when turned off.

### Pulse / Ripple

Enable **Pulse / Ripple** to animate the points.

- **Pulse** smoothly grows and shrinks dots, fading them as they expand.
- **Ripple** draws expanding rings that fade out and repeat.
- **Speed (cycles/s)** controls the repetition rate, from 0.1 to 3 cycles per second.
- **Expansion** controls the maximum radius, from 1 to 5 times the point radius.

The effect loops continuously while the layer is visible; it does not require a timestamp field or timeline playback. It uses the point layer's colors, sizes, opacity, filters, and map or billboard orientation. Text labels stay still. Settings are saved with the map and retained when the effect is turned off.

Choose **Trigger → At event time** to play one effect for each recorded event. Select an
**Event timestamp** field and a **Duration (timeline seconds)**. The ordinary point remains
visible according to the existing filters; a temporary Pulse or Ripple plays from the event
timestamp until the duration expires. Missing or invalid timestamps produce no effect.

The layer adds its event range, including the final effect's duration, to Kepler's timeline.
Pause freezes the effect, scrubbing shows the phase at the selected time, and replay plays
events again. Duration is measured in data time: faster playback shortens the visible effect,
and seeking or coarse timeline steps can skip short events. To drive it from an animated time
filter, enable the existing timeline synchronization. Filters still determine visibility and
can cut an effect short; they are not automatically widened. This mode uses recorded
timestamps, not the time at which rows arrive. **Continuous** remains the default trigger.

[Back to table of contents](../README.md)
