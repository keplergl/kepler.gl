# user-guide

## kepler.gl for Jupyter User Guide

* [Install](user-guide.md#install)
* [1. Load kepler.gl Map](user-guide.md#1-load-keplergl-map)
  * [`KeplerGl()`](user-guide.md#keplergl)
* [2. Add Data](user-guide.md#2-add-data)
  * [`.add_data()`](user-guide.md#add_data)
  * [`.data`](user-guide.md#data)
* [3. Data Format](user-guide.md#3-data-format)
  * [`CSV`](user-guide.md#csv)
  * [`GeoJSON`](user-guide.md#geojson)
  * [`DataFrame`](user-guide.md#dataframe)
  * [`GeoDataFrame`](user-guide.md#geodataframe)
  * [`WKT`](user-guide.md#wkt)
* [4. Customize the map](user-guide.md#4-customize-the-map)
* [5. Save and load config](user-guide.md#5-save-and-load-config)
  * [`.config`](user-guide.md#config)
* [6. Match config with data](user-guide.md#6-match-config-with-data)
* [7. Save Map](user-guide.md#7-save-map)
  * [`.save_to_html()`](user-guide.md#save_to_html)
* [Demo Notebooks](user-guide.md#demo-notebooks)

### Install

#### Prerequisites

* Python &gt;= 2
* ipywidgets &gt;= 7.0.0

To install use pip:

```text
$ pip install keplergl
```

If you on Mac used `pip install` and running Notebook 5.3 and above, you don't need to run the following

```text
$ jupyter nbextension install --py --sys-prefix keplergl # can be skipped for notebook 5.3 and above

$ jupyter nbextension enable --py --sys-prefix keplergl # can be skipped for notebook 5.3 and above
```

If you are using Jupyter Lab, you will also need to install the JupyterLab extension. This require [node](https://nodejs.org/en/download/package-manager/#macos) `> 8.15.0`

If you use [Homebrew](https://brew.sh/) on Mac:

```text
$ brew install node@8
```

Then install jupyter labextension.

```text
$ jupyter labextension install @jupyter-widgets/jupyterlab-manager keplergl-jupyter
```

**Prerequisites for JupyterLab:**

* Node &gt; 8.15.0
* Python 3
* JupyterLab&gt;=1.0.0

### 1. Load keplergl map

#### `KeplerGl()`

* Input:
  * **`height`** _optional_ default: `400`

    Height of the map display

  * **`data`** `dict` _optional_

    Datasets as a dictionary, key is the name of the dataset. Read more on [Accepted data format](user-guide.md#3-data-format)

  * **`config`** `dict` _optional_ Map config as a dictionary. The `dataId` in the layer and filter settings should match the `name` of the dataset they are created under

The following command will load kepler.gl widget below a cell. **The map object created here is `map_1` it will be used throughout the code example in this doc.**

```python
# Load an empty map
from keplergl import KeplerGl
map_1 = KeplerGl()
map_1
```

![](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_empty_map.png)

You can also create the map and pass in the data or data and config at the same time. Follow the instruction to [match config with data](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/keplergl-jupyter/match-config-w-data/README.md)

```python
# Load a map with data and config and height
from keplergl import KeplerGl
map_2 = KeplerGl(height=400, data={"data_1": my_df}, config=config)
map_2
```

![](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_widget.png)

### 2. Add Data

#### `.add_data()`

* Inputs
  * **`data`** _required_ CSV, GeoJSON or DataFrame. Read more on [Accepted data format](user-guide.md#3-data-format)
  * **`name`** _required_ Name of the data entry.

`name` of the dataset will be the saved to the `dataId` property of each `layer`, `filter` and `interactionConfig` in the config.

kepler.gl expected the data to be **CSV**, **GeoJSON**, **DataFrame** or **GeoDataFrame**. You can call **`add_data`** multiple times to add multiple datasets to kepler.gl

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

![](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_add_data.png)

#### `.data`

Print the current data added to the map. As a `Dict`

```python
map_1.data
# {'data_1': 'hex_id,value\n89283082c2fffff,64\n8928308288fffff,73\n89283082c07ffff,65\n89283082817ffff,74\n89283082c3bffff,66\n8...`,
#  'data_3': 'location, lat, lng, name\n..',
#  'data_3': '{"type": "FeatureCollecti...'}
```

### 3. Data Format

kepler.gl supports **CSV**, **GeoJSON**, Pandas **DataFrame** or GeoPandas **GeoDataFrame**.

#### `CSV`

You can create a `CSV` string by reading from a CSV file.

```python
with open('csv-data.csv', 'r') as f:
    csvData = f.read()
# csvData = "hex_id,value\n89283082c2fffff,64\n8928308288fffff,73\n89283082c07ffff,65\n89283082817ffff,74\n89283082c3bffff,66\n8..."
map_1.add_data(data=csvData, name='data_2')
```

#### `GeoJSON`

According to [GeoJSON Specification \(RFC 7946\)](https://tools.ietf.org/html/rfc7946): GeoJSON is a format for encoding a variety of geographic data structures. A GeoJSON object may represent a region of space \(a `Geometry`\), a spatially bounded entity \(a Feature\), or a list of Features \(a `FeatureCollection`\). GeoJSON supports the following geometry types: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, and `GeometryCollection`. Features in GeoJSON contain a Geometry object and additional properties, and a FeatureCollection contains a list of Features.

kepler.gl supports all the GeoJSON types above excepts `GeometryCollection`. You can pass in either a single [`Feature`](https://tools.ietf.org/html/rfc7946#section-3.2) or a [`FeatureCollection`](https://tools.ietf.org/html/rfc7946#section-3.3). You can format the `GeoJSON` either as a `string` or a `dict` type

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

Geometries \(Polygons, LindStrings\) can be embedded into CSV or DataFrame with a [`GeoJSON`](https://tools.ietf.org/html/rfc7946) Json string. Use the `geometry` property of a [`Feature`](https://tools.ietf.org/html/rfc7946#section-3.2), which includes `type` and `coordinates`.

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

#### `DataFrame`

kepler.gl accepts [pandas.DataFrame](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html)

```python
df = pd.DataFrame(
    {'City': ['Buenos Aires', 'Brasilia', 'Santiago', 'Bogota', 'Caracas'],
     'Latitude': [-34.58, -15.78, -33.45, 4.60, 10.48],
     'Longitude': [-58.66, -47.91, -70.66, -74.08, -66.86]})

w1.add_data(data=df, name='cities')
```

#### `GeoDataFrame`

kepler.gl accepts [geopandas.GeoDataFrame](https://geopandas.readthedocs.io/en/latest/data_structures.html#geodataframe), it automatically converts the current `geometry` column from shapely to wkt string.

```python
url = 'http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_500k.json'
country_gdf = geopandas.read_file(url)
w1.add_data(data=country_gdf, name="state")
```

![](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_geodataframe.png)

#### `WKT`

You can embed geometries \(Polygon, LineStrings etc\) into CSV or DataFrame using [`WKT`](https://dev.mysql.com/doc/refman/5.7/en/gis-data-formats.html#gis-wkt-format)

```python
# WKT
wkt_str = 'POLYGON ((-74.158491 40.835947, -74.130031 40.819962, -74.148818 40.830916, -74.151923 40.832074, -74.158491 40.835947))'

df_w_wkt = pd.DataFrame({
    'id': [1],
    'wkt_string': [wkt_str]
})

map_1.add_data(df_w_wkt, "df_w_wkt")
```

### 4. Customize the map

Interact with kepler.gl and customize layers and filters. Map data and config will be stored locally to the widget state. To make sure the map state is saved, select `Widgets > Save Notebook Widget State`, before shutting down the kernel.

![](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_custom_map.gif)

### 5. Save and load config

#### `.config`

you can print your current map configuration at any time.

```python
map_1.config
## {u'config': {u'mapState': {u'bearing': 2.6192893401015205,
#  u'dragRotate': True,
#   u'isSplit': False,
#   u'latitude': 37.76209132041332,
#   u'longitude': -122.42590232651203,
```

When the map is final, you can copy this config and load it later to reproduce the same map. Follow the instruction to [match config with data](https://github.com/keplergl/kepler.gl/tree/f6f52361683304ed9d62029fbf268582543aebae/docs/keplergl-jupyter/match-config-w-data/README.md). There are 2 ways to apply config to a map:

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

### 6. Match config with data

All layers, filters and tooltips are associated with a specific dataset. Therefore the `data` and `config` in the map has to be able to match each other. The `name` of the dataset is assigned to:

* `dataId` of `layer.config`,
* `dataId` of `filter`
* key in `interactionConfig.tooltip.fieldToShow`.

![](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_connect_data_w_config.png)

You can use the same config on another dataset with the same name and schema.

### 7. Save Map

When you click in the map and change settings, config is saved to widget state. Closing the notebook and reopen it will reload current map. However, you need to manually select `Widget > Save Notebook Widget State` before shut downing the kernel to make sure it will be reloaded.

![](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_save_state.png)

#### `.save_to_html()`

* input
  * **`data`**: _optional_  A data dictionary {"name": data}, if not provided, will use current map data
  * **`config`**: _optional_ map config dictionary, if not provided, will use current map config
  * **`file_name`**: _optional_ the html file name, default is `keplergl_map.html`
  * **`read_only`**: _optional_ if `read_only` is `True`, hide side panel to disable map customization

You can export your current map as an interactive html file.

```python
# this will save current map
map_1.save_to_html(file_name='first_map.html')

# this will save map with provided data and config
map_1.save_to_html(data={'data_1': df}, config=config, file_name='first_map.html')

# this will save map with the interaction panel disabled
map_1.save_to_html(file_name='first_map.html' read_only=True)
```

## Demo Notebooks

* [Load kepler.gl](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/Load%20kepler.gl.ipynb): Load kepler.gl widget, add data and config
* [Geometry as String](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/Geometry%20as%20String.ipynb): Embed Polygon geometries as `GeoJson` and `WKT` inside a `CSV`
* [GeoJSON](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/GeoJSON.ipynb): Load GeoJSON to kepler.gl
* [DataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/DataFrame.ipynb): Load DataFrame to kepler.gl
* [GeoDataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/GeoDataFrame.ipynb): Load GeoDataFrame to kepler.gl

