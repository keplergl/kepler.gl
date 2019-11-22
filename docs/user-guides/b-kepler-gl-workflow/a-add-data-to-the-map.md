# Add Data to the Map

## Ways to Add Data
- Open kepler.gl/demo. You should see the following prompt:

![Add data to the map pop up](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image42.png "Add data to the map pop up")

**kepler.gl is a pure client side app. Data lives only in your machine/browser.  No information or maps is sent back up to our server.**

- Choose one of three ways to add data to your map

|   |   |
|---|---|
| **Local files**  | <span style="font-weight:normal">Upload CSV / GeoJSON files. Because data is only stored in your browser, there is a **250mb** limit on how much data Chrome allows you to upload into a browser. For datasets larger than **250mb** you should directly load them from a remote URL. See below.<span>  |
| **From URL**  | Directly load data or map json by pasting a remote URL. You can link it to CSV | JSON | Kepler.gl config json. Make sure the url contains the file extension. CORS policy must be defined on your custom url domain. |
| **Sample data**  | Load one of kepler.gl’s sample datasets. The sample map data and config are directly loaded from  [kepler.gl-data github][kepler.gl-data-github] repo  |


## Supported Projection Coordinate System
kepler.gl only supports **[Web Mercator]([https://en.wikipedia.org/wiki/Web_Mercator_projection) EPSG:3857 -- WGS84**.

Geometry coordinates should be presented with a geographic coordinate reference system, using the WGS84 datum, and with longitude and latitude units of decimal degrees.

## Supported File Formats
 - [CSV](#csv)
 - [GeoJSON](#geojson)
 - [kepler.gl Json](#kepler-gl-json): exported from kepler.gl. See [export map](https://github.com/keplergl/kepler.gl/blob/master/docs/user-guides/k-save-and-export.md#export-map-as-json)


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
|**_`geojson`_** | **WKT string:** `POLYGON ((-74.158 40.835, -74.148 40.830, -74.151 40.832, -74.158 40.835))`, **or GeoJson String** `{"type":"Polygon","coordinates":[[[-74.158,40.835],[-74.157,40.839,[-74.148,40.830],[-74.150,40.833],[-74.151,40.832],[-74.158,40.835]]]}` |
|**_`integer`_** | `1`, `2`, `3`|
|**_`real`_** | `-74.158`, `40.832`|
|**_`string`_** | `hello`, `world` |
|**_`timestamp`_** | `2018-09-01 00:00`, `1570306147`, `1570306147000`|

**Note:** Make sure to clean up values such as `N/A`, `Null`, `\N`. If your column contains mixed type, kepler.gl will treat it as **_`string`_** to be safe.

#### 2. Layer detection based on column names

kepler.gl will auto detect layer, if the column names follows certain naming convention. kepler.gl creates a point layer if  your CSV has columns that are named `<name>_lat` and `<name>_lng` or `<name>_latitude` and `<name>_longitude`, or `<name>_lat` and `<name>_lon`.

| layer | auto create layer from column names
|---|---
|**Point** | Point layer names have to be in pairs, and **ends with** `<foo>lat, <foo>lng`; `<foo>latitude, <foo>longitude`; `<foo>lat, <foo>lon`|
|**Arc**| If two points layers are detected, one arc layer will be created |
|**Icon**| A column named `icon` is present|
|**H3**| A column named `h3_id` or `hexagon_id` is present |
|**Polygon**| A column content contains `geojson` data types. Acceptable formats include [Well-Known Text](http://www.postgis.net/docs/ST_AsText.html) e.g. `POLYGON ((-74.158 40.835, -74.148 40.830, -74.151 40.832, -74.158 40.835))` and [GeoJSON Geometry](https://tools.ietf.org/html/rfc7946#appendix-A). e.g. `{"type":"LineString","coordinates":[[100.0, 0.0],[101.0, 1.0]]}`

#### 3. Embed Geometries in CSV
Geometries (Polygons, Points, LindStrings etc) can be embedded into CSV as a `GeoJSON` or `WKT` formatted string. 

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
          "prop0": "value0",
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


### Load Map Using URL

You load data or map through custom URL. It currently supports URLs with file extension of `csv`, `json` and `kepler.gl.json`

In addition, this also by-passes 250mb file upload size limit which allows you to upload larger file to Kepler.

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

2. Choose one of the options above: upload a JSON/CSV file, or use Kepler.gl’s sample data.

3. Repeat as needed. There is no limit on the number of datasets you can add. However, adding too many might cause its performance to suffer.

[Back to table of contents](../a-introduction.md)


[kepler.gl-data-github]: https://github.com/uber-web/kepler.gl-data
