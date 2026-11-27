# Line

![Line layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image3.png "Line layer")

Line layers are the 2D version of arc layers. Both draw a line between two points to represent distance, but in a line layer, the drawing lies flat on the map.

## Crossing the antimeridian

On a flat map centered over the Pacific, a line that crosses the antimeridian (180° longitude) can appear cut off at the edge of a world copy. If you embed kepler.gl and need the adjacent world copy, set `enableMapRepeat: true` in [your application configuration](../../upgrade-guide-v3.3.md#flat-map-world-repetition-is-now-opt-in) before mounting the map. This repeats the flat map view; it does not change how a line is drawn or affect globe mode.

[Back to table of contents](../README.md)
