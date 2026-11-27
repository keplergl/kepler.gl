# Arc

![Arc layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image37.png "Arc layer")

Arc layers draw an arc between two points. They’re useful for visualizing the distance between two points as well as comparing distances in 3D. Note that arc layers don’t show routes between points, but simply the distance between the two points. The tallest arc represents the greatest distance.

To draw arcs, your dataset must contain the latitude and longitude of two different points for each arc.

## Crossing the antimeridian

On a flat map centered over the Pacific, an arc that crosses the antimeridian (180° longitude) can appear cut off at the edge of a world copy. If you embed kepler.gl and need the adjacent world copy, set `enableMapRepeat: true` in [your application configuration](../../upgrade-guide-v3.3.md#flat-map-world-repetition-is-now-opt-in) before mounting the map. This repeats the flat map view; it does not change how an arc is drawn or affect globe mode.

[Back to table of contents](../README.md)
