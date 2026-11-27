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
  - Fill opacity based on (optional numeric field)
  - Opacity scale and range
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

## Fill opacity based on a field

In **Fill**, select a numeric field under **Fill opacity based on**. New selections use a **Linear** scale: the column's minimum and maximum map to the **Opacity range**, which defaults to 0–100%. For example, values of 10, 30, and 50 produce 0%, 50%, and 100% fill opacity. Adjust the range to 20–80% to keep every point partly visible. Domain filtering follows the same rules as Color by. If all valid values are equal, they use the midpoint of the opacity range.

Choose **Raw (0–1)** for prepared opacity values: 0 makes the fill transparent, 1 keeps its existing opacity, and 0.5 uses half. Values outside 0–1 are clamped. Saved maps that used raw values retain this mode until you change the scale.

Both modes multiply the fill's existing alpha and layer opacity. Missing or nonfinite values leave the fill opacity unchanged. Outlines and labels are unaffected. Clear the field to use the same fill opacity for all points.

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

Event effects use the timeline of an enabled time filter on the same dataset and event
timestamp field. Selecting an event timestamp does not create a separate layer timeline.
Add the time filter yourself; the first enabled filter matching that dataset and timestamp
column drives the effect automatically. The help tooltip beside **Event timestamp** explains
this requirement. Removing or disabling the filter uses the next enabled match, if available.
Without a matching filter, ordinary points remain visible but the event effect is inactive.

The end of the filter window is the current time. Pause freezes the effect, scrubbing shows
its phase at the selected time, and replay plays events again. Duration is measured in data
time: faster playback shortens the visible effect, and coarse timeline steps can skip short
events. Filters still determine visibility and can cut an effect short; their window and
domain are not automatically widened, including at the last event. Existing layer-timeline
synchronization is not required. **Continuous** remains the default trigger.

[Back to table of contents](../README.md)
