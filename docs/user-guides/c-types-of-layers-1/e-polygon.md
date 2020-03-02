# Polygon

Polygon layer can display [GeoJSON](https://tools.ietf.org/html/rfc7946) features. GeoJSON supports the following geometry types: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`.

kepler.gl supports all the GeoJSON types above. You can pass in either a single [`Feature`](https://tools.ietf.org/html/rfc7946#section-3.2) or a [`FeatureCollection`](https://tools.ietf.org/html/rfc7946#section-3.3)

![GeoJSON layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image20.png)

![Polygon layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-polygon-contour.png)

![Polygon geoJSON layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image7.png)

![Grid layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-polygon-buildings.png)

A path GeoJSON layer can display data like trip routes or contours. Stroke color can be set with a numerical field.

A polygon GeoJSON layer is essentially a [choropleth](https://en.wikipedia.org/wiki/Choropleth_map) layer and works best for rendering geofences. Fill color or height can be set with a numerical field. For example, it can display population by census tracts.

To add a polygon layer, your dataset must contain geometry data.

[Back to table of contents](../a-introduction.md)

