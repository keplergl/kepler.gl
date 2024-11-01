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
- [Demo Notebooks](#demo-notebooks)
- [FAQ & Troubleshoot](#faq--troubleshoot)


## Install

### Prerequisites

- Python >= 2
- ipywidgets >= 7.0.0

To install use pip:
```bash
$ pip install keplergl
```

If you're on Mac, used `pip install`, and you're running Notebook 5.3 and above, you don't need to run the following:

```bash
$ jupyter nbextension install --py --sys-prefix keplergl # can be skipped for notebook 5.3 and above
$ jupyter nbextension enable --py --sys-prefix keplergl # can be skipped for notebook 5.3 and above
```

If you are using Jupyter Lab, you will also need to install the JupyterLab extension. This require [node](https://nodejs.org/en/download/package-manager/#macos) `> 10.15.0`

If you use [Homebrew](https://brew.sh/) on Mac:
```bash
$ brew install node@10
```

Then install jupyter labextension.

```bash
$ jupyter labextension install @jupyter-widgets/jupyterlab-manager keplergl-jupyter
```

### Prerequisites for JupyterLab
- Node > 10.15.0
- Python 3
- JupyterLab>=1.0.0

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

      By default, the User Guide URL (<https://docs.kepler.gl/docs/keplergl-jupyter>) will be printed when a map is created. To hide the User Guide URL, set `show_docs=False`.

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

You can export your current map as an interactive html file.

```python
# this will save current map
map_1.save_to_html(file_name='first_map.html')

# this will save map with provided data and config
map_1.save_to_html(data={'data_1': df}, config=config, file_name='first_map.html')

# this will save map with the interaction panel disabled
map_1.save_to_html(file_name='first_map.html', read_only=True)
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

# Demo Notebooks
- [Load kepler.gl](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/Load%20kepler.gl.ipynb): Load kepler.gl widget, add data and config
- [Geometry as String](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/Geometry%20as%20String.ipynb): Embed Polygon geometries as `GeoJson` and `WKT` inside a `CSV`
- [GeoJSON](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/GeoJSON.ipynb): Load GeoJSON to kepler.gl
- [DataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/DataFrame.ipynb): Load DataFrame to kepler.gl
- [GeoDataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/GeoDataFrame.ipynb): Load GeoDataFrame to kepler.gl

# FAQ & Troubleshoot

#### 1. What about Microsoft Windows?
keplergl is currently only published to PyPI, and unfortunately I use a Mac. If you encounter errors installing it on windows, [this issue](https://github.com/keplergl/kepler.gl/issues/557) might shed some light. Follow this issue for [conda](https://github.com/keplergl/kepler.gl/issues/646) support.

#### 2. Install keplergl-jupyter on Jupyter Lab failed?

Make sure you are using node 8.15.0. and you have installed `@jupyter-widgets/jupyterlab-manager`. Depends on your JupyterLab version. You might need to install the specific version of [jupyterlab-manager](https://github.com/jupyter-widgets/ipywidgets/tree/master/packages/jupyterlab-manager). with `jupyter labextension install @jupyter-widgets/jupyterlab-manager@0.31`. When use it in Jupyter lab, keplergl is only supported in JupyterLab > 1.0 and Python 3.

Run `jupyter labextension install keplergl-jupyter --debug` and copy console output before creating an issue.

If you are running `install` and `uninstall` several times. You should run.

```
jupyter lab clean
jupyter lab build
```

#### 2.1 JavaScript heap out of memory when installing lab extension
If you see this error during install labextension

```bash
$ FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

run

```bash
$ export NODE_OPTIONS=--max-old-space-size=4096
```

#### 3. Is my lab extension successfully installed?
Run `jupyter labextension list` You should see below. (Version may vary)

```bash
JupyterLab v1.1.4
Known labextensions:
   app dir: /Users/xxx/jupyter-python3/ENV3/share/jupyter/lab
        @jupyter-widgets/jupyterlab-manager v1.0.2  enabled  OK
        keplergl-jupyter v0.1.0  enabled  OK
```

#### 4. What's your python and node env

Python
```text
python==3.7.4
notebook==6.0.3
jupyterlab==2.1.2
ipywidgets==7.5.1
```

Node (Only for JupyterLab)

```text
node==8.15.0
yarn==1.7.0
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

