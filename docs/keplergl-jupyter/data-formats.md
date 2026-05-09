# Data Formats

kepler.gl supports **CSV**, **GeoJSON**, Pandas **DataFrame** or GeoPandas **GeoDataFrame**.

## CSV

You can create a `CSV` string by reading from a CSV file.

```python
with open('csv-data.csv', 'r') as f:
    csvData = f.read()
# csvData = "hex_id,value\n89283082c2fffff,64\n8928308288fffff,73\n89283082c07ffff,65\n89283082817ffff,74\n89283082c3bffff,66\n8..."
map_1.add_data(data=csvData, name='data_2')
```

## GeoJSON

According to [GeoJSON Specification (RFC 7946)][geojson]: GeoJSON is a format for encoding a variety of geographic data structures. A GeoJSON object may represent a region of space (a `Geometry`), a spatially bounded entity (a Feature), or a list of Features (a `FeatureCollection`). GeoJSON supports the following geometry types: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, and `GeometryCollection`. Features in GeoJSON contain a Geometry object and additional properties, and a FeatureCollection contains a list of Features.

kepler.gl supports all the GeoJSON types above except `GeometryCollection`. You can pass in either a single [`Feature`][features] or a [`FeatureCollection`][feature_collection]. You can format the `GeoJSON` either as a `string` or a `dict` type.

```python
feature = {
    "type": "Feature",
    "properties": {"name": "Coors Field"},
    "geometry": {"type": "Point", "coordinates": [-104.99404, 39.75621]}
}

featureCollection = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
        "properties": {"prop0": "value0"}
    }]
}

map_1.add_data(data=feature, name="feature")
map_1.add_data(data=featureCollection, name="feature_collection")
```

Geometries (Polygons, LineStrings) can be embedded into CSV or DataFrame with a [`GeoJSON`][geojson] JSON string. Use the `geometry` property of a [`Feature`][features], which includes `type` and `coordinates`.

```python
# GeoJson Feature geometry
geometryString = {
    'type': 'Polygon',
    'coordinates': [[[-74.158491,40.835947],[-74.148473,40.834522],[-74.142598,40.833128],[-74.151923,40.832074],[-74.158491,40.835947]]]
}

# create json string
json_str = json.dumps(geometryString)

# create data frame
df_with_geometry = pd.DataFrame({
    'id': [1],
    'geometry_string': [json_str]
})

# add to map
map_1.add_data(df_with_geometry, "df_with_geometry")
```

## DataFrame

kepler.gl accepts [pandas.DataFrame][data_frame].

```python
df = pd.DataFrame(
    {'City': ['Buenos Aires', 'Brasilia', 'Santiago', 'Bogota', 'Caracas'],
     'Latitude': [-34.58, -15.78, -33.45, 4.60, 10.48],
     'Longitude': [-58.66, -47.91, -70.66, -74.08, -66.86]})

map_1.add_data(data=df, name='cities')
```

## GeoDataFrame

kepler.gl accepts [geopandas.GeoDataFrame][geo_data_frame]. It automatically converts the current `geometry` column from shapely to wkt string and re-projects geometries to latitude and longitude (EPSG:4326) if the active `geometry` column is in a different projection.

```python
url = 'http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_500k.json'
country_gdf = geopandas.read_file(url)
map_1.add_data(data=country_gdf, name="state")
```

![US state][geodataframe_map]

### GeoDataFrame with datetime columns

GeoDataFrames that contain `datetime` columns (or other non-JSON-native types) are supported out of the box. During serialization these values are automatically converted to strings, so no manual pre-processing is needed.

```python
import geopandas as gpd
from shapely.geometry import Point
import pandas as pd

gdf = gpd.GeoDataFrame({
    'name': ['A', 'B'],
    'timestamp': pd.to_datetime(['2024-01-01', '2024-06-15']),
    'geometry': [Point(-73.99, 40.73), Point(-118.24, 34.05)]
})

map_1.add_data(data=gdf, name='events')
```

### Empty or all-null geometries

GeoDataFrames with empty or all-null geometry columns are handled gracefully. The widget will not raise an error when adding such data.

```python
gdf_empty = gpd.GeoDataFrame({
    'id': [1, 2],
    'geometry': [None, None]
})

map_1.add_data(data=gdf_empty, name='empty_geom')
```

## WKT

You can embed geometries (Polygon, LineStrings etc) into CSV or DataFrame using [`WKT`][wkt].

```python
# WKT
wkt_str = 'POLYGON ((-74.158491 40.835947, -74.130031 40.819962, -74.148818 40.830916, -74.151923 40.832074, -74.158491 40.835947))'

df_w_wkt = pd.DataFrame({
    'id': [1],
    'wkt_string': [wkt_str]
})

map_1.add_data(df_w_wkt, "df_w_wkt")
```

[geodataframe_map]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_geodataframe.png
[wkt]: https://dev.mysql.com/doc/refman/5.7/en/gis-data-formats.html#gis-wkt-format
[geojson]: https://tools.ietf.org/html/rfc7946
[feature_collection]: https://tools.ietf.org/html/rfc7946#section-3.3
[features]: https://tools.ietf.org/html/rfc7946#section-3.2
[data_frame]: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html
[geo_data_frame]: https://geopandas.readthedocs.io/en/latest/data_structures.html#geodataframe
