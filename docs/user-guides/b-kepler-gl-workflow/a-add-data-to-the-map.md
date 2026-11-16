# Add Data to the Map

## Ways to Add Data
- Open kepler.gl/demo. You should see the following prompt:

![Add data to the map pop up](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image42.png "Add data to the map pop up")

**kepler.gl is a pure client side app. Data lives only in your machine/browser.  No information or maps is sent back up to our server.**

- Choose one of three ways to add data to your map

|   |   |
|---|---|
| **Local files**  | <span style="font-weight:normal">Upload CSV, GeoJSON, GeoJSONL, KML, GPX, TCX, Shapefile, Excel, FlatGeobuf, Arrow, or Parquet files, or a zip of those files. Files are parsed in your browser, so available memory limits how large a file you can load. For data that does not fit in memory, use a tileset instead.<span>  |
| **From URL**  | Directly load data or map json by pasting a remote URL. Supported extensions include `csv`, `geojson`, `json`, `geojsonl`, `kml`, `gpx`, `tcx`, `shp`, `xlsx`, `fgb`, `arrow`, and `parquet`. Make sure the url contains the file extension. CORS policy must be defined on your custom url domain. |
| **Sample data**  | Load one of kepler.gl’s sample datasets. The sample map data and config are directly loaded from  [kepler.gl-data github][kepler.gl-data-github] repo  |


## Supported Projection Coordinate System
kepler.gl only supports **[Web Mercator](https://en.wikipedia.org/wiki/Web_Mercator_projection) EPSG:3857 -- WGS84**.

Geometry coordinates should be presented with a geographic coordinate reference system, using the WGS84 datum, and with longitude and latitude units of decimal degrees.

## Supported File Formats
 - [CSV](#csv)
 - [GeoJSON](#geojson)
 - [GeoJSONL / NDJSON](#geojsonl--ndjson)
 - [KML](#kml)
 - [GPX](#gpx)
 - [TCX](#tcx)
 - [Shapefile](#shapefile)
 - [Zip](#zip)
 - [Excel](#excel)
 - [FlatGeobuf](#flatgeobuf)
 - [GeoArrow](#geoarrow)
 - [kepler.gl Json](#keplergl-json)


### CSV

CSV file should contain header row and multiple columns. Each row should be 1 feature. Each column should contain only 1 data type, based on which kepler.gl will use to create layers and filters.

| id | point_latitude | point_longitude | value | start_time
|---|---|---|---|---
| a | 31.2384 | -127.30948 | 5 | 2019-08-01 12:00
| b | 31.2311 | -127.30231 | 11 | 2019-08-01 12:05
| c | 31.2334 | -127.30238 | 9 | 2019-08-01 11:55


#### 1. Data type detection

Because CSV file content is uploaded as strings, kepler.gl will attempt to detect column data type by parsing a sample of data in each column. kepler.gl can detect

| type | data
|---|---
|**_`boolean`_** | `True`, `False`|
|**_`date`_** | `2019-01-01`|
|**_`geojson`_** | **WKT string:** `POLYGON ((-74.158 40.835, -74.148 40.830, -74.151 40.832, -74.158 40.835))`, **or GeoJson String** `{"type":"Polygon","coordinates":[[[-74.158,40.835],[-74.157,40.839],[-74.148,40.830],[-74.150,40.833],[-74.151,40.832],[-74.158,40.835]]]}` |
|**_`integer`_** | `1`, `2`, `3`|
|**_`real`_** | `-74.158`, `40.832`|
|**_`string`_** | `hello`, `world` |
|**_`timestamp`_** | `2018-09-01 00:00`, `1570306147`, `1570306147000`|

**Note:** Make sure to clean up values such as `N/A`, `Null`, `\N`. If your column contains mixed type, kepler.gl will treat it as **_`string`_** to be safe.

#### 2. Layer detection based on column names

kepler.gl will auto detect layer, if the column names follows certain naming convention. kepler.gl creates a point layer if  your CSV has columns that are named `<name>_lat` and `<name>_lng` or `<name>_latitude` and `<name>_longitude`, or `<name>_lat` and `<name>_lon`. Uncheck **Auto create layers**, then click **Add Data** to load a file or tileset without creating layers.

| layer | auto create layer from column names
|---|---
|**Point** | Point layer names have to be in pairs, and **ends with** `<foo>lat, <foo>lng`; `<foo>latitude, <foo>longitude`; `<foo>lat, <foo>lon`|
|**Arc**| If two points layers are detected, one arc layer will be created |
|**Icon**| A column named `icon` is present|
|**H3**| A column named `h3_id` or `hexagon_id` is present |
|**Polygon**| A column content contains `geojson` data types. Acceptable formats include [Well-Known Text](http://www.postgis.net/docs/ST_AsText.html) e.g. `POLYGON ((-74.158 40.835, -74.148 40.830, -74.151 40.832, -74.158 40.835))` and [GeoJSON Geometry](https://tools.ietf.org/html/rfc7946#appendix-A). e.g. `{"type":"LineString","coordinates":[[100.0, 0.0],[101.0, 1.0]]}`

#### 3. Embed Geometries in CSV
Geometries (Polygons, Points, LineStrings etc) can be embedded into CSV as a `GeoJSON` or `WKT` formatted string.

##### `GeoJSON` String
Use the geometry of a Feature, which includes type and coordinates. It should be a JSON formatted string, with the `"` corrected escaped. More info on [String escape in csv](https://gpdb.docs.pivotal.io/43250/admin_guide/load/topics/g-escaping-in-csv-formatted-files.html)

Example data.csv with GeoJSON
```txt
id,geometry
1,"{""type"":""Polygon"",""coordinates"":[[[-74.158491,40.835947],[-74.157914,40.83902]]]}"
```

##### `WKT`String
[The Well-Known Text (WKT)](https://dev.mysql.com/doc/refman/5.7/en/gis-data-formats.html#gis-wkt-format) representation of geometry values is designed for exchanging geometry data in ASCII form.

Example data.csv with WKT
```txt
id,geometry
1,"POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))"
```

### GeoJSON

#### Coordinate order and legacy arrays

Use explicit GeoJSON geometry objects for new integrations and data exchange. [GeoJSON positions](https://datatracker.ietf.org/doc/html/rfc7946#section-3.1.1) use `[longitude, latitude]`, with optional altitude as the third value. This order applies to points, lines and polygons.

kepler.gl also accepts bare coordinate arrays as values in a dataset field treated as `geojson`. These are a legacy shorthand, not complete GeoJSON objects, and points and lines have different conventions:

| Dataset cell | Input order | Geometry coordinates after parsing |
| --- | --- | --- |
| Bare point `[-74, 40]` | `[longitude, latitude]` | `[-74, 40]` |
| Bare line `[[40, -74], [41, -73]]` | `[[latitude, longitude], ...]` | `[[-74, 40], [-73, 41]]` |
| GeoJSON `LineString` with `coordinates: [[-74, 40], [-73, 41]]` | `[[longitude, latitude], ...]` | `[[-74, 40], [-73, 41]]` |

The bare-line parser always reverses the first two values of each vertex; it does not infer the order from their values. It also retains only those two values, discarding altitude and any additional components. Use an explicit GeoJSON geometry when those components matter; animated trips follow the [Trip layer format](../c-types-of-layers/k-trip.md).

For example, the legacy bare line `[[40, -74], [41, -73]]` represents the same locations as this geometry object in a dataset cell:

```json
{
  "type": "LineString",
  "coordinates": [[-74, 40], [-73, 41]]
}
```

For a standalone `.geojson` file, wrap the geometry in a Feature or FeatureCollection as shown below. For CSV, use a complete GeoJSON geometry string as described in [Embed Geometries in CSV](#3-embed-geometries-in-csv); an array-looking string is not the bare-array input described here. A generic array field is not automatically a geometry, although legacy names such as `_geojson`, `geojson` and `all_points` can cause geometry detection. Explicitly typed `geojson` fields and saved maps can also contain bare arrays.

##### Why the legacy line convention is retained

Coordinate order depends on the input format. [Leaflet polylines](https://leafletjs.com/reference.html#polyline) and [`@mapbox/polyline.decode()`](https://github.com/mapbox/polyline#readme) use latitude-first coordinates, while GeoJSON uses longitude first. Public data varies too: [Porto taxi trajectories](https://archive.ics.uci.edu/dataset/339/taxi%2Bservice%2Btrajectory%2B) store longitude-first pairs inside a string. Check the source format before converting it; neither reversing every array nor preserving every array is a universal conversion rule. For encoded polylines, `@mapbox/polyline.toGeoJSON()` provides an explicit GeoJSON LineString.

The swap was already present in the [initial 2018 source](https://github.com/keplergl/kepler.gl/blob/10655c7b141fc8dbe561526eefa040f11b106697/src/layers/geojson-layer/geojson-utils.js#L52-L62). Its original motivation is undocumented in the inspected history; the examples above do not establish its origin. The array branch became unreachable in the 2019 [Trip layer refactor](https://github.com/keplergl/kepler.gl/pull/699), because arrays were handled as objects first. [PR #3642](https://github.com/keplergl/kepler.gl/pull/3642) restored that branch in August 2026 while adding longitude-first bare points.

[PR #4009](https://github.com/keplergl/kepler.gl/pull/4009) considered making bare lines longitude-first as well. That convention change is not being adopted: it would silently relocate existing latitude-first lines, including data whose coordinates were deliberately reversed to work with the current parser. Explicit GeoJSON already supports longitude-first lines without changing existing inputs. Keeping established data and saved maps in the same location takes precedence over making the two shorthand forms uniform.

This decision also retains the current handling of additional vertex components. Preserving them would be a separate behavior change: a fourth component can affect Trip layer detection. No coordinate-order inference, migration or new option is introduced here. Values alone cannot safely determine the intended order when both numbers are valid latitudes and longitudes.

##### Saved maps and export/import

**Export Map as JSON with data saves the original dataset cells, not the geometries produced by the layer parser.** A bare line stored as `[[40, -74], [41, -73]]` stays in that form in the saved file. On import, the parser converts it to `[[-74, 40], [-73, 41]]` again. Export/import does not repeatedly reverse the stored data. Changing the parser's convention would reinterpret that same saved file and move its line; retaining the convention avoids this compatibility break.

The export format matters:

- **Map JSON with data:** retains bare arrays and their dependence on the parser's convention. There is no per-cell coordinate-order marker.
- **Config-only JSON:** contains no coordinates; interpretation depends on the dataset supplied with it.
- **Map HTML:** embeds data and normally pins a kepler.gl version. An existing export keeps its behavior while using that same runtime.
- **Data exported as GeoJSON:** writes explicit geometries. Where this export option is available, exporting a legacy bare line converts it to longitude-first GeoJSON at its currently interpreted location, suitable for interchange.

These bare-line rules do not change the dedicated parsing of GeoJSON objects or strings, WKT, WKB or native GeoArrow, nor the use of separately named latitude and longitude columns. For new data, use explicit geometry types and the coordinate order required by that format instead of relying on bare-array shorthand.

#### 1. Feature types

- kepler.gl accepts GeoJSON formatted JSON that contains a single [Feature](https://tools.ietf.org/html/rfc7946#section-3.2) object or a [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) object. kepler.gl creates one **`Polygon`** layer per GeoJSON file.

  - A single GeoJSON Feature:

  ```json
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-10.0, -10.0],
            [10.0, -10.0],
            [10.0, 10.0],
            [-10.0, -10.0]
          ]
        ]
      },
      "properties": {
        "name": "foo"
      }
    }
  ```

  - GeoJSON Feature Collection.
  ```json
  {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [102.0, 0.5]
        },
        "properties": {
            "prop0": "value0"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [102.0, 0.0],
                [103.0, 1.0],
                [104.0, 0.0],
                [105.0, 1.0]
            ]
        },
        "properties": {
          "prop0": "value0"
        }
    }]
  }
  ```

  kepler.gl will render all features in one `Polygon` layer even though they have different geometry types. Acceptable geometry types are

  - [Point](https://tools.ietf.org/html/rfc7946#section-3.1.2)
  - [MultiPoint](https://tools.ietf.org/html/rfc7946#section-3.1.3)
  - [LineString](https://tools.ietf.org/html/rfc7946#section-3.1.4)
  - [MultiLineString](https://tools.ietf.org/html/rfc7946#section-3.1.5)
  - [Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6)
  - [MultiPolygon](https://tools.ietf.org/html/rfc7946#section-3.1.7).

  Feature properties will be parsed as columns. You can apply color, filters based on them.

#### 2. Auto styling
kepler.gl will read styles from GeoJSON files. If you are a GeoJSON expert, you can add style declarations to feature properties. kepler.gl will use the declarations to automatically style your feature. The acceptable style properties are:
  ```json
  "properties": {
    "lineColor": [130, 154, 227],
    "lineWidth": 0.5,
    "fillColor": [255, 0, 0],
    "radius": 1 // Point
  }
  ```

- See an example below:
```json
{
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-105.1547889, 39.9862516],
          [-105.1547167, 39.9862691]
        ]
      },
      "properties": {
        "id": "a1398a11-d1ce-421c-bf66-a456ff525de9",
        "lineColor": [130, 154, 227],
        "lineWidth": 0.1
      }
  }]
}
```

### GeoJSONL / NDJSON

kepler.gl accepts newline-delimited GeoJSON: one [Feature](https://tools.ietf.org/html/rfc7946#section-3.2) per line. Common extensions are `.geojsonl`, `.ndgeojson`, `.ldgeojson`, `.jsonl`, and `.ndjson`. Features are combined into a FeatureCollection and visualized like a GeoJSON file.

Generic NDJSON (one JSON object per line, without GeoJSON `geometry`) is loaded as a table, the same way as CSV.

Example `places.geojsonl`:

```json
{"type":"Feature","properties":{"name":"alpha"},"geometry":{"type":"Point","coordinates":[-122.4,37.8]}}
{"type":"Feature","properties":{"name":"beta"},"geometry":{"type":"Point","coordinates":[-122.5,37.9]}}
```

### KML

kepler.gl accepts `.kml` files. Placemarks are converted to GeoJSON features and visualized with a **Polygon** layer. `.kmz` (zipped KML) is not supported; unzip the archive and upload the `.kml` file. KML styles, overlays, and network links are not preserved.

### GPX

kepler.gl accepts `.gpx` files. Waypoints, tracks, and routes are converted to GeoJSON features. NMEA log files are not supported.

### TCX

kepler.gl accepts Garmin `.tcx` activity files. Track points are converted to GeoJSON features.

### Shapefile

kepler.gl accepts ESRI Shapefiles. Drop a `.shp` together with its sidecars (`.dbf`, `.shx`, and optionally `.prj` / `.cpg`), or a `.zip` that contains one shapefile and those sidecars at the top level. A zip of a single shapefile loads as one dataset named after the zip. Features are converted to GeoJSON and visualized with a **Polygon** layer. If a `.prj` file is present, geometries are reprojected to WGS84. Nested folders inside the zip are ignored.

### Zip

A `.zip` can hold more than one dataset. Each supported file at the top level becomes its own dataset, named with the file name inside the archive. CSV, GeoJSON, GeoJSONL, KML, GPX, TCX, Excel, FlatGeobuf, Arrow, Parquet, and Shapefile are recognized. Shapefile sidecars stay with the `.shp` they belong to, and a zip of several shapefiles loads each one. Nested folders are ignored. Files kepler.gl cannot load are skipped. A zip with nothing supported reports an error.

A zip that contains a single shapefile and its sidecars stays one dataset named after the zip.

### Excel

kepler.gl accepts `.xlsx` and `.xls` workbooks. The first sheet is loaded as a table, the same way as CSV. Additional sheets are not imported.

### FlatGeobuf

kepler.gl accepts `.fgb` files. Features are converted to GeoJSON and visualized with a **Polygon** layer.

### GeoArrow

[GeoArrow](https://geoarrow.org/) file, a binary data format which can be visualized with the [PolygonLayer](https://docs.kepler.gl/docs/user-guides/c-types-of-layers/e-polygon).

### kepler.gl JSON

JSON file exported from kepler.gl. See "[Export Map as JSON](https://docs.kepler.gl/docs/user-guides/k-save-and-export#export-map-as-json)".

### Load Map Using URL

You load data or map through custom URL. It currently supports URLs with file extension of `csv`, `json`, `geojson`, `geojsonl`, `kml`, `gpx`, `tcx`, `shp`, `xlsx`, `fgb`, `arrow`, `parquet`, and `kepler.gl.json`.

A remote URL still loads the full file into memory. For datasets that do not fit in memory, use a tileset (vector tiles, COG, or PMTiles).

![Load Map Using URL](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/a-load-map-using-url.gif "Load Map Using URL")

### Use Kepler.gl’s Sample Maps

The sample maps are a great option for new users to explore Kepler.gl and get a feel for how it works.

1. At the initial load prompt select “Try sample data” in the top right corner.

![Try sample data pop up](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image2.png "Try sample data pop up")

2. Choose from the options to load the sample map and explore the configurations applied.

![Choose sample data pop up](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image5.png "Choose sample data pop up")

### Add multiple datasets

To add additional datasets to your map:

1. Click __Add More Data__ in the top right corner.

![Add more data](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image22.png "Add more data")

2. Choose one of the options above: upload a supported file, paste a URL, or use Kepler.gl’s sample data.

3. Repeat as needed. There is no limit on the number of datasets you can add. However, adding too many might cause its performance to suffer.

[Back to table of contents](../README.md)


[kepler.gl-data-github]: https://github.com/keplergl/kepler.gl-data
