# Jupyter Notebook

## kepler.gl for Jupyter User Guide

### Table of contents
- [Install](#install)
- [1. Load kepler.gl Map](#1-load-keplergl-map)
  - [`KeplerGl()`](#keplergl)
- [2. Add Data](#2-add-data)
  - [`.add_data()`](#add_data)
  - [`.data`](#data)
- [3. Data Format](#3-data-format)
  - [`CSV`](#csv)
  - [`GeoJSON`](#geojson)
  - [`DataFrame`](#dataframe)
  - [`GeoDataFrame`](#geodataframe)
  - [`WKT`](#wkt)
- [4. Customize the map](#4-customize-the-map)
- [5. Save and load config](#5-save-and-load-config)
  - [`.config`](#config)
- [6. Match config with data](#6-match-config-with-data)
- [7. Save Map](#7-save-map)
  - [`.save_to_html()`](#save_to_html)
  - [`._repr_html_()`](#_repr_html_)
- [8. Customize Theme and App Name](#8-customize-theme-and-app-name)
- [Demo Notebooks](#demo-notebooks)
- [FAQ & Troubleshoot](#faq--troubleshoot)


## Install

### Prerequisites

- Python >= 3.9
- JupyterLab >= 4.0 or Notebook >= 7.0

To install use pip:
```bash
$ pip install keplergl
```

## 1. Load keplergl map
### `KeplerGl()`

- Input:
  - __`height`__  _optional_ default: `400`

      Height of the map display

  - __`data`__ `dict` _optional_

      Datasets as a dictionary, key is the name of the dataset. Read more on [Accepted data format][data_format]

  - __`use_arrow`__ `bool` _optional_ default: `False`

      Allow load and render data faster using GeoArrow

  - __`config`__ `dict` _optional_

      Map config as a dictionary. The `dataId` in the layer and filter settings should match the `name` of the dataset they are created under

  - __`show_docs`__ `bool` _optional_

      Deprecated, kept for backward compatibility.

  - __`theme`__ `str` _optional_ default: `""`

      UI theme for the map. Accepted values are `"light"`, `"dark"`, `"base"`, or `""` (default dark theme).

  - __`app_name`__ `str` _optional_ default: `"kepler.gl"`

      Application name shown in the side panel header and used as the HTML `<title>` when exporting.

The following command will load kepler.gl widget below a cell.
**The map object created here is `map_1` it will be used throughout the code example in this doc.**


```python
# Load an empty map
from keplergl import KeplerGl
map_1 = KeplerGl()
map_1
```

![empty map][empty_map]


You can also create the map and pass in the data or data and config at the same time. Follow the instruction to [match config with data][match-config-w-data]

```python
# Load a map with data and config and height
from keplergl import KeplerGl
map_2 = KeplerGl(height=400, data={"data_1": my_df}, config=config)
map_2
```

![Load map with data and config][load_map_w_data]

## 2. Add Data
### `.add_data()`
- Inputs
    - __`data`__ _required_ CSV, GeoJSON or DataFrame. Read more on [Accepted data format][data_format]
    - __`name`__ _required_ Name of the data entry.
    - __`use_arrow`__ _optional_ Allow load and render data faster using GeoArrow.

`name` of the dataset will be the saved to the `dataId` property of each `layer`, `filter` and `interactionConfig` in the config.

kepler.gl expected the data to be **CSV**,  **GeoJSON**, **DataFrame** or **GeoDataFrame**. You can call __`add_data`__ multiple times to add multiple datasets to kepler.gl

```python
# DataFrame
df = pd.read_csv('hex-data.csv')
map_1.add_data(data=df, name='data_1')

# CSV
with open('csv-data.csv', 'r') as f:
    csvData = f.read()
map_1.add_data(data=csvData, name='data_2')

# GeoJSON as string
with open('sf_zip_geo.json', 'r') as f:
    geojson = f.read()

map_1.add_data(data=geojson, name='geojson')
```

![Add data to map][map_add_data]

### `.data`
Print the current data added to the map. As a `Dict`

```python
map_1.data
# {'data_1': 'hex_id,value\n89283082c2fffff,64\n8928308288fffff,73\n89283082c07ffff,65\n89283082817ffff,74\n89283082c3bffff,66\n8...`,
#  'data_3': 'location, lat, lng, name\n..',
#  'data_3': '{"type": "FeatureCollecti...'}
```

## 3. Data Format
kepler.gl supports **CSV**,  **GeoJSON**, Pandas **DataFrame** or GeoPandas **GeoDataFrame**.

### `CSV`
You can create a `CSV` string by reading from a CSV file.
```python
with open('csv-data.csv', 'r') as f:
    csvData = f.read()
# csvData = "hex_id,value\n89283082c2fffff,64\n8928308288fffff,73\n89283082c07ffff,65\n89283082817ffff,74\n89283082c3bffff,66\n8..."
map_1.add_data(data=csvData, name='data_2')
```

### `GeoJSON`
According to [GeoJSON Specification (RFC 7946)][geojson]: GeoJSON is a format for encoding a variety of geographic data structures. A GeoJSON object may represent a region of space (a `Geometry`), a spatially bounded entity (a Feature), or a list of Features (a `FeatureCollection`). GeoJSON supports the following geometry types: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, and `GeometryCollection`. Features in GeoJSON contain a Geometry object and additional properties, and a FeatureCollection contains a list of Features.

kepler.gl supports all the GeoJSON types above excepts `GeometryCollection`. You can pass in either a single [`Feature`][features] or a [`FeatureCollection`][feature_collection]. You can format the  `GeoJSON` either as a `string` or a `dict` type


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

Geometries (Polygons, LindStrings) can be embedded into CSV or DataFrame with a [`GeoJSON`][geojson] Json string. Use the `geometry` property of a [`Feature`][features], which includes `type` and `coordinates`.

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

### `DataFrame`
kepler.gl accepts [pandas.DataFrame][data_frame]
```python
df = pd.DataFrame(
    {'City': ['Buenos Aires', 'Brasilia', 'Santiago', 'Bogota', 'Caracas'],
     'Latitude': [-34.58, -15.78, -33.45, 4.60, 10.48],
     'Longitude': [-58.66, -47.91, -70.66, -74.08, -66.86]})

w1.add_data(data=df, name='cities')
```

### `GeoDataFrame`
kepler.gl accepts [geopandas.GeoDataFrame][geo_data_frame], it automatically converts the current `geometry` column from shapely to wkt string and re-projects geometries to latitude and longitude (EPSG:4326) if the active `geometry` column is in a different projection.
```python
url = 'http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_500k.json'
country_gdf = geopandas.read_file(url)
w1.add_data(data=country_gdf, name="state")
```

![US state][geodataframe_map]

#### GeoDataFrame with datetime columns

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

#### Empty or all-null geometries

GeoDataFrames with empty or all-null geometry columns are handled gracefully. The widget will not raise an error when adding such data.

```python
gdf_empty = gpd.GeoDataFrame({
    'id': [1, 2],
    'geometry': [None, None]
})

map_1.add_data(data=gdf_empty, name='empty_geom')
```

### `WKT`

You can embed geometries (Polygon, LineStrings etc) into CSV or DataFrame using [`WKT`][wkt]

```python
# WKT
wkt_str = 'POLYGON ((-74.158491 40.835947, -74.130031 40.819962, -74.148818 40.830916, -74.151923 40.832074, -74.158491 40.835947))'

df_w_wkt = pd.DataFrame({
    'id': [1],
    'wkt_string': [wkt_str]
})

map_1.add_data(df_w_wkt, "df_w_wkt")
```

## 4. Customize the map

Interact with kepler.gl and customize layers and filters. Map data and config will be stored locally to the widget state. To make sure the map state is saved, select `Widgets > Save Notebook Widget State`, before shutting down the kernel.

![Map interaction][map_interaction]

## 5. Save and load config

### `.config`
you can print your current map configuration at any time in the notebook
```python
map_1.config
## {u'config': {u'mapState': {u'bearing': 2.6192893401015205,
#  u'dragRotate': True,
#   u'isSplit': False,
#   u'latitude': 37.76209132041332,
#   u'longitude': -122.42590232651203,
```

When the map is final, you can copy this config and load it later to reproduce the same map. Follow the instruction to [match config with data][match-config-w-data].

#### Apply config to a map:

 1. Directly apply config to the map.
```python
config = {
    'version': 'v1',
    'config': {
        'mapState': {
            'latitude': 37.76209132041332,
            'longitude': -122.42590232651203,
            'zoom': 12.32053899007826
        }
        ...
    }
},
map_1.add_data(data=df, name='data_1')
map_1.config = config
```
 2. Load it when creating the map
```python
map_1 = KeplerGl(height=400, data={'data_1': my_df}, config=config)
```

If want to load the map next time with this saved config, the easiest way to do is to save the it to a file and use the magic command **%run** to load it w/o cluttering up your notebook.
```python
# Save map_1 config to a file
with open('hex_config.py', 'w') as f:
   f.write('config = {}'.format(map_1.config))

# load the config
%run hex_config.py
```

## 6. Match config with data
All layers, filters and tooltips are associated with a specific dataset. Therefore the `data` and `config` in the map has to be able to match each other. The `name` of the dataset is assigned to:

  - `dataId` of `layer.config`,
  - `dataId` of `filter`
  - key in `interactionConfig.tooltip.fieldToShow`.

![Connect data and config][connect_data_config]

You can use the same config on another dataset with the same name and schema.

## 7. Save Map

When you click in the map and change settings, config is saved to widget state. Closing the notebook and reopen it will reload current map. However, you need to manually select `Widget > Save Notebook Widget State` before shut downing the kernel to make sure it will be reloaded.

![Save Widget State][save_widget_state]

### `.save_to_html()`

- input
  - **`data`**: _optional_  A data dictionary {"name": data}, if not provided, will use current map data
  - **`config`**: _optional_ map config dictionary, if not provided, will use current map config
  - **`file_name`**: _optional_ the html file name, default is `keplergl_map.html`
  - **`read_only`**: _optional_ if `read_only` is `True`, hide side panel to disable map customization
  - **`center_map`**: _optional_ if `True`, fit map bounds to the data (default: `True`)
  - **`mapbox_token`**: _optional_ Mapbox access token. Required for Mapbox basemap styles (e.g. "Dark", "Muted Light"). Leave empty for free MapLibre styles.
  - **`json_encoder`**: _optional_ Fallback function passed as `default` when JSON-serializing GeoDataFrame data. Defaults to `str` so that `datetime` and other non-native JSON types are converted automatically. Pass `None` to disable (will raise on non-serializable types).
  - **`app_name`**: _optional_ Application name shown in the side panel header and used as HTML `<title>`. If `None`, uses the value set at widget creation (default `"kepler.gl"`).
  - **`theme`**: _optional_ UI theme for the kepler.gl component (`"light"`, `"dark"`, `"base"`, or `""`). If `None`, uses the value set at widget creation.

You can export your current map as an interactive html file.

```python
# this will save current map
map_1.save_to_html(file_name='first_map.html')

# this will save map with provided data and config
map_1.save_to_html(data={'data_1': df}, config=config, file_name='first_map.html')

# this will save map with the interaction panel disabled
map_1.save_to_html(file_name='first_map.html', read_only=True)

# this will save map with a custom theme and app name
map_1.save_to_html(file_name='first_map.html', theme='light', app_name='My Map App')
```

### `._repr_html_()`

- input
  - **`data`**: _optional_  A data dictionary {"name": data}, if not provided, will use current map data
  - **`config`**: _optional_ map config dictionary, if not provided, will use current map config
  - **`read_only`**: _optional_ if `read_only` is `True`, hide side panel to disable map customization

You can also directly serve the current map via a flask app. To do that return kepler’s map HTML representation. Here is an example on how to do that:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return map_1._repr_html_()

if __name__ == '__main__':
    app.run(debug=True)
```

## 8. Customize Theme and App Name

You can customize the UI theme and application name both when creating the widget and when exporting to HTML.

### Theme

The `theme` parameter controls the visual appearance of the map UI. Accepted values:
- `"dark"` – Dark theme
- `"light"` – Light theme
- `"base"` – Base theme
- `""` (empty string) – Uses the default dark theme

```python
# Create a map with light theme
map_1 = KeplerGl(height=400, data={'data_1': df}, theme='light')
map_1
```

### App Name

The `app_name` parameter sets the application name displayed in the side panel header. It is also used as the HTML `<title>` when exporting.

```python
# Create a map with a custom app name
map_1 = KeplerGl(height=400, data={'data_1': df}, app_name='My Geospatial App')
map_1
```

Both `theme` and `app_name` can also be passed to `save_to_html()` to override the widget-level settings for the exported file:

```python
map_1.save_to_html(file_name='my_map.html', theme='light', app_name='My Map Export')
```

# Demo Notebooks
- [Load kepler.gl](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/Load%20kepler.gl.ipynb): Load kepler.gl widget, add data and config
- [GeoJSON](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/GeoJSON.ipynb): Load GeoJSON to kepler.gl
- [DataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/DataFrame.ipynb): Load DataFrame to kepler.gl
- [GeoDataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/GeoDataFrame.ipynb): Load GeoDataFrame to kepler.gl
- [GeoDataFrame with Datetime](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/GeoDataFrame%20with%20Datetime.ipynb): Load GeoDataFrame with datetime columns
- [Empty GeoDataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/Empty%20GeoDataFrame.ipynb): Handle empty or all-null geometries
- [Theme and App Name](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/Theme%20and%20App%20Name.ipynb): Customize theme and app name

# FAQ & Troubleshoot

#### 1. What about Microsoft Windows?
keplergl is currently only published to PyPI. If you encounter errors installing it on Windows, [this issue](https://github.com/keplergl/kepler.gl/issues/557) might shed some light.

#### 2. Widget not rendering in JupyterLab or Notebook?

Make sure you are using JupyterLab >= 4.0 or Notebook >= 7.0 with Python >= 3.9. The widget is built on [anywidget](https://anywidget.dev/) which is supported out of the box in modern Jupyter environments — no extra `nbextension` or `labextension` install steps are needed.

If the widget still does not render, try restarting the kernel and re-running the cell.

#### 3. What's your recommended Python environment?

```text
python>=3.9
jupyterlab>=4.0
notebook>=7.0
```

[jupyter_widget]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_widget.png
[empty_map]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_empty_map.png
[geodataframe_map]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_geodataframe.png
[map_interaction]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_custom_map.gif
[load_map_w_data]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_widget.png
[map_add_data]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_add_data.png
[connect_data_config]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_connect_data_w_config.png
[save_widget_state]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_save_state.png

[wkt]: https://dev.mysql.com/doc/refman/5.7/en/gis-data-formats.html#gis-wkt-format
[geojson]: https://tools.ietf.org/html/rfc7946
[feature_collection]: https://tools.ietf.org/html/rfc7946#section-3.3
[features]: https://tools.ietf.org/html/rfc7946#section-3.2
[data_frame]: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html
[geo_data_frame]: https://geopandas.readthedocs.io/en/latest/data_structures.html#geodataframe

[match-config-w-data]: #6-match-config-with-data
[data_format]: #3-data-format

