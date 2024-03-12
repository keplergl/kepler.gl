# Polygon

Polygon layer can display all geometry types defined by [RFC 7946 (GeoJSON)](https://tools.ietf.org/html/rfc7946): `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`. 

You can load a GeoJSON file (with a single [`Feature`](https://tools.ietf.org/html/rfc7946#section-3.2) or a [`FeatureCollection`](https://tools.ietf.org/html/rfc7946#section-3.3)) or a GeoArrow file.


![GeoJSON layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image20.png "GeoJSON layer")

![Polygon layer - contour](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-polygon-contour.png "Polygon layer")

![Polygon geoJSON layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image7.png "Polygon geoJSON layer")

![Polygon layer - buildings](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-polygon-buildings.png "Grid layer")

A path GeoJSON layer can display data like trip routes or contours. Stroke color can be set with a numerical field.

A polygon GeoJSON layer is essentially a [choropleth](https://en.wikipedia.org/wiki/Choropleth_map) layer and works best for rendering geofences. Fill color or height can be set with a numerical field. For example, it can display population by census tracts.

To add a polygon layer, your dataset must contain geometry data.


[Back to table of contents](../README.md)
