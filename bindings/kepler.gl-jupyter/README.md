<h1>kepler.gl-jupyter</h1>

This is the [kepler.gl](http://kepler.gl) jupyter widget, an advanced geospatial visualization tool, to render large-scale interactive maps in Jupyter Notebook.

![Kepler.gl for Jupyter][jupyter_widget]

<!-- TOC -->
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [1. Load kepler.gl](#1-load-keplergl)
    - [`keplergl.KeplerGl()`](#keplerglkeplergl)
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
- [Local Development Setup](#local-development-setup)
  - [Environment Setup](#environment-setup)
    - [1. Node and Yarn](#1-node-and-yarn)
    - [2. Install Jupyter with pip](#2-install-jupyter-with-pip)
  - [Download and run kepler.gl-jupyter in your local Jupyter Notebook](#download-and-run-keplergl-jupyter-in-your-local-jupyter-notebook)
    - [Clone Repo](#clone-repo)
    - [Setup JS](#setup-js)
      - [1. Install Js module](#1-install-js-module)
      - [2. Load mapbox token](#2-load-mapbox-token)
      - [3. Build js module, start a local server to watch for changes](#3-build-js-module-start-a-local-server-to-watch-for-changes)
    - [Setup jupyter](#setup-jupyter)
      - [1. Install python module and enable extension from local files](#1-install-python-module-and-enable-extension-from-local-files)
      - [2. Start jupyter notebook](#2-start-jupyter-notebook)
    - [Have fun!](#have-fun)
<!-- /TOC -->


<br></br>
# Installation
------------

To install use pip:

    $ pip install keplergl_jupyter

<br></br>
# Quick Start

```python
# Load kepler.gl with an empty map
import keplergl_jupyter as keplergl
map_1 = keplergl.KeplerGl(height=400)
map_1

# Load kepler.gl with map data and config
map_2 = keplergl.KeplerGl(height=400, data={'data_1': df}, config=config)
map_2

# Add data to map
map_1.add_data(df, 'data_1')

# Apply config
map_1.config(config)

# print data and config
map_1.data
map_1.config

# save map to html
map_1.save_to_html(file_name='keplergl_map.html')
```
<br></br>
# Demo Notebooks
- [Load kepler.gl](https://github.com/keplergl/kepler.gl/blob/master/packages/kepler.gl-jupyter/notebooks/Load%20kepler.gl.ipynb): Load kepler.gl widget, add data and config
- [Geometry as String](https://github.com/keplergl/kepler.gl/blob/master/packages/kepler.gl-jupyter/notebooks/Geometry%20as%20String.ipynb): Embed Polygon geometries as `GeoJson` and `WKT` inside a `CSV`
- [GeoJSON](https://github.com/keplergl/kepler.gl/blob/master/packages/kepler.gl-jupyter/notebooks/GeoJSON.ipynb): Load GeoJSON to kepler.gl
- [DataFrame](https://github.com/keplergl/kepler.gl/blob/master/packages/kepler.gl-jupyter/notebooks/DataFrame.ipynb): Load DataFrame to kepler.gl
- [GeoDataFrame](https://github.com/keplergl/kepler.gl/blob/master/packages/kepler.gl-jupyter/notebooks/GeoDataFrame.ipynb): Load GeoDataFrame to kepler.gl

<br></br>
# Usage

<br></br>
## 1. Load kepler.gl
### `keplergl.KeplerGl()`

- Input:
    - __`height`__  _optional_ default: `400`

        Height of the map display

    - __`data`__ `dict` _optional_

        Datasets as a dictionary, key is the name of the dataset. Read more on [Accepted data format][data_format]

    - __`config`__ `dict` _optional_
        Map config as a dictionary. The `dataId` in the layer and filter settings should match the `name` of the dataset they are created under

The following command will load kepler.gl widget below a cell.
**The map object created here is `map_1` it will be used throughout the code example in this doc.**


```python
# Load an empty map
import keplergl_jupyter as keplergl
map_1 = keplergl.KeplerGl()
map_1
```

![empty map][empty_map]

You can also create the map and pass in the data or data and config at the same time. Follow the instruction to [match config with data](match-config-w-data)

```python
# Load a map with data and config and height
map_2 = keplergl.KeplerGl(height=400, data={"data_1": my_df}, config=config)
map_2
```

![Load map with data and config][load_map_w_data]

<br></br>

## 2. Add Data
### `.add_data()`
- Inputs
    - __`data`__ _required_ CSV, GeoJSON or DataFrame. Read more on [Accepted data format][data_format]
    - __`name`__ _required_ Name of the data entry.

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

<br></br>

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
kepler.gl accepts [geopandas.GeoDataFrame][geo_data_frame], it automatically converts the current `geometry` column from shapely to wkt string.
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


<br></br>

## 4. Customize the map

Interact with kepler.gl and customize layers and filters. Map data and config will be stored locally to the widget state. To make sure the map state is saved, select `Widgets > Save Notebook Widget State`, before shutting down the kernel.

![Map interaction][map_interaction]

<br></br>

## 5. Save and load config

### `.config`
you can print your current map configuration at any time.
```python
map_1.config
## {u'config': {u'mapState': {u'bearing': 2.6192893401015205,
#  u'dragRotate': True,
#   u'isSplit': False,
#   u'latitude': 37.76209132041332,
#   u'longitude': -122.42590232651203,
```

When the map is final, you can copy this config and load it later to reproduce the same map. Follow the instruction to [match config with data](match-config-w-data).
There are 2 ways to apply config to a map:

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
map_1 = keplergl.KeplerGl(height=400, data={'data_1': my_df}, config=config)
```

If want to load the map next time with this saved config, the easiest way to do is to save the it to a file and use the magic command **%run** to load it w/o cluttering up your notebook.
```python
# Save map_1 config to a file
with open('hex_config.py', 'w') as f:
   f.write('config = {}'.format(map_1.config))

# load the config
%run hex_config.py
```

<br></br>
## 6. Match config with data
All layers, filters and tooltips are associated with a specific dataset. Therefore the `data` and `config` in the map has to be able to match each other. The `name` of the dataset is assigned to:

  - `dataId` of `layer.config`,
  - `dataId` of `filter`
  - key in `interactionConfig.tooltip.fieldToShow`.

![Connect data and config][connect_data_config]

You can use the same config on another dataset with the same name and schema.

<br></br>
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
map_1.save_to_html(file_name='first_map.html' read_only=True)
```

<br><br>

# Local Development Setup

<br><br>
## Environment Setup
You will need to install node, yarn and Jupyter Notebook.

### 1. Node and Yarn
Install [node](https://nodejs.org/en/download/package-manager/#macos) (`> 8`), and [yarn](https://yarnpkg.com/en/docs/install#mac-stable)

### 2. Install Jupyter with pip

Python 3

    $ python3 -m pip install --upgrade pip
    $ python3 -m pip install jupyter

Python 2

    $ python -m pip install --upgrade pip
    $ python -m pip install jupyter

<br><br>
## Download and run kepler.gl-jupyter in your local Jupyter Notebook

### Clone Repo
    $ git clone https://github.com/uber/kepler.gl-jupyter.git

### Setup JS
#### 1. Install Js module
```sh
    $ cd kepler.gl-jupyter
    $ cd js
    # install js dependencies
    $ yarn --ignore-engines
```

#### 2. Load mapbox token
Add [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) to Node env.

```sh
export MapboxAccessToken=<your_mapbox_token>
```

#### 3. Build js module, start a local server to watch for changes
    $ npm start

You need to run step 2 and 3 to restart the js program. And step 1-3 if any js dependency has changed (Usually after pulling new changes from master).

### Setup jupyter

#### 1. Install python module and enable extension from local files
This command must be run **AFTER** the `js` setup, and folder `static/` was created. It only needs to be run once.

```sh
    # dev install from folder containing setup.py
    $ pip install -e .

    # only needed in dev mode, not in normal mode.
    $ jupyter nbextension install --py --symlink --sys-prefix keplergl_jupyter

    # only needed in dev mode, not in normal mode.
    $ jupyter nbextension enable --py --sys-prefix keplergl_jupyter
```

#### 2. Start jupyter notebook
    $ cd notebooks
    $ jupyter notebook

<br></br>
### Have fun!

You can now start editing the .js and .py files to see changes reflected in your local notebook. After changing files in the js folder, the local start script will recompile the js files and put them in to `keplergl_jupyter/static` folder. You need to reload the jupyter notebook page to reload the files.


[jupyter_widget]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_widget.png
[empty_map]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_empty_map.png
[geodataframe_map]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_geodataframe.png
[map_interaction]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_custom_map.gif
[load_map_w_data]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_load_map_w_data.gif
[map_add_data]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_add_data.png
[connect_data_config]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_connect_data_w_config.png
[save_widget_state]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_save_state.png

[wkt]: https://dev.mysql.com/doc/refman/5.7/en/gis-data-formats.html#gis-wkt-format
[geojson]: https://tools.ietf.org/html/rfc7946
[feature_collection]: https://tools.ietf.org/html/rfc7946#section-3.3
[features]: https://tools.ietf.org/html/rfc7946#section-3.2
[data_frame]: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html
[geo_data_frame]: https://geopandas.readthedocs.io/en/latest/data_structures.html#geodataframe

[match-config-w-data]: #match-config-with-data
[data_format]: #3-data-format
