# kepler.gl-jupyter

This is a simple jupyter widget for kepler.gl, an advanced geospatial visualization tool, to render large-scale interactive maps.

<!-- TOC -->
#### [Table of Content](#table-of-content)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [1. Load kepler.gl](#1-load-keplergl)
    - [2. Add Data](#2-add-data)
      - [`.add_data()`](#add_data)
      - [`.data`](#data)
    - [3. Interact with the map](#3-interact-with-the-map)
    - [4. Save and load config](#4-save-and-load-config)
      - [`.config`](#config)
    - [5. Save map to html](#5-save-map-to-html)
      - [`.save_to_html()`](#save_to_html)
    - [6. Reload data and config.](#6-reload-data-and-config)
  - [Local development setup](#local-development-setup)
    - [Environment Setup](#environment-setup)
    - [Download and run kepler.gl-jupyter in your local Jupyter Notebook](#download-and-run-keplergl-jupyter-in-your-local-jupyter-notebook)
<!-- /TOC -->

## Installation
------------

To install use pip:

    $ pip install keplergl_jupyter
    $ jupyter nbextension enable --py --sys-prefix keplergl_jupyter

To install in jupyter-notebook:

    # python 2
    $ !install_package_python2.sh keplergl_jupyter

    # python 3
    $ !install_package_python3.sh keplergl_jupyter


## Quick Start

```python
# Load kepler.gl
import keplergl_jupyter as keplergl
map_1 = keplergl.KeplerGl()
map_1

# Add data
map_1.add_data(df, 'data_1')

# Add config
map_1.config(config)

# print data and config
map_1.data
map1.config

# save map to html
map_1.save_to_html(file_name='keplergl_map.html')
```
## Usage

### 1. Load kepler.gl
The following command will load the kepler.gl widget in a cell.
**The map object created here is `map_1` it will be used throughout the code example in this doc.**

```python
# Load an empty map
import keplergl_jupyter as keplergl
map_1 = keplergl.KeplerGl()
map_1

# Load a map with data and config
map_2 = keplergl.KeplerGl(height=400, data={'data_1': df}, config=config)
map_2
```

- Input:
    - `height`


All interaction with the map will be store locally. You can use `map_1.data` and `map_1.config` to print the current data and configuration of the map. However, if you shutdown the kernel, the map data and config will be lost. See the [Reload data and config](#reloaddataandconfig) section for how to persist map data and config when restarting the kernel.


### 2. Add Data
#### `.add_data()`
kepler.gl expects the data to be **stringified** **CSV** and  **GeoJSON**  or a pandas **Dataframe**. The following command will add a dataframe entry to the map. You can all this command multiple times to add multiple datasets to kepler.gl

```python
# for Dataframe
df = pd.read_csv('hex-data.csv')
map_1.add_data(data=df, name='data_1')

# for CSV
with open('csv-data.csv', 'r') as f:
    csvData = f.read()
map_1.add_data(data=csvData, name='data_2')

# for GeoJSON
with open('sf_zip_geo.json', 'r') as f:
    geojson = f.read()
map_1.add_data(data=geojson, name='data_3')
```
- Inputs
    - `data` The data object
    - `name` Name of the data entry.

`name` will be the identifier to associate `layer`, `filter` and `interactionConfig` in the config. It is saved to the property `dataId`

#### `.data`
Print the current data added to the map. As a `Dict`
```python
map_1.data
# {'data_1': 'hex_id,value\n89283082c2fffff,64\n8928308288fffff,73\n89283082c07ffff,65\n89283082817ffff,74\n89283082c3bffff,66\n8...`,
#  'data_3': 'location, lat, lng, name\n..',
#  'data_3': '{"type": "FeatureCollecti...'}
```
You can directly apply data to map as a `Dict`, the data object has to be `string`, so you will need to manually convert **GeoJSON**  or a pandas **Dataframe** to a `String`. Directly assign data will also override the previous data.
```python
map_1.data = {'data_1': 'hex_id,value\n89283082c2fffff,64\n8928308288fffff,73\n89283082c07ffff,65\n89283082817ffff,74\n89283082c3bffff,66\n8...`}
```

### 3. Interact with the map

You can interact with voyager in the iframe and config layer and filters.

### 4. Save and load config

#### `.config`
you can print your current map configuration at any time. When the customization is final, copy this configuration out to load it later.
```python
map_1.config
## {u'config': {u'mapState': {u'bearing': 2.6192893401015205,
#  u'dragRotate': True,
#   u'isSplit': False,
#   u'latitude': 37.76209132041332,
#   u'longitude': -122.42590232651203,
```

Directly apply config `Dict` to the map
```python
config = {u'config': {u'mapState': {u'bearing': 2.6192893401015205,u'dragRotate': True,u'isSplit': False,
   u'latitude': 37.76209132041332,u'longitude': -122.42590232651203,u'pitch': 37.374216241015446,u'zoom': 12.32053899007826
   ...
},
map_1.config = config
```

If want to load the map next time with this saved configuration, the easiest way to do is to save the `Dict` in a file relative to your notebook and use the magic command **%run** to load it w/o cluttering up your notebook.
```python
%run icon_config.py
```
### 5. Save map to html
#### `.save_to_html()`
You can export your current map as an interactive html file.
```python
map_1.save_to_html(file_name="map_1.html")
```
- input
    - **`data`**: _optional_  A data dictionary {"name": data}, if not provided, will use current map data
    - **`config`**: _optional_ map config dictionary, if not provided, will use current map config
    - **`file_name`**: _optional_ the html file name, default is `keplergl_map.html`
    - **`read_only`**: _optional_ if `read_only` is `True`, hide side panel to disable map customization

```python
# this will save current map
map_1.save_to_html(file_name='first_map.html')

# this will save map with provided data and config
map_1.save_to_html(data={"data_1": df}, config=config, file_name='first_map.html')

# this will save map with the interaction panel disabled
map_1.save_to_html(file_name='first_map.html' read_only=True)
```

### 6. Reload data and config.
When you call `map_1.data` and `map_1.config` kepler.gl will print out current data and config of the map. This makes it easy for you to update them later. Note, the `name` of the data needs to be consistent, otherwise, kepler.gl will think it is a new data entry.

```python
# load data
map_1.add_data(iconData, "icon_data")

# Interact with the map to get the final look then save config
with open('icon_config.py', 'w') as f:
    f.write('icon_config = {}'.format(map_1.config))

# restart the kernel reload data and config to map
%run icon_config.py
map_1.add_data(iconData, "icon_data")
map_1.config = icon_config
```
<br><br>

## Local development setup

### Environment Setup
You will need to install node, yarn and Jupyter Notebook.

#### 1. Install [node](https://nodejs.org/en/download/package-manager/#macos) (`> 6`), [yarn](https://yarnpkg.com/en/docs/install#mac-stable)

#### 2.Install Jupyter with pip

Python 3

    $ python3 -m pip install --upgrade pip
    $ python3 -m pip install jupyter

Python 2

    $ python -m pip install --upgrade pip
    $ python -m pip install jupyter

### Download and run kepler.gl-jupyter in your local Jupyter Notebook

#### Clone Repo
    $ git clone https://github.com/uber/kepler.gl-jupyter.git

#### Setup JS
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

#### Setup jupyter

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

#### Have fun!

You can now start editing the .js and .py files to see changes reflected in your local notebook. After changing files in the js folder, the local start script will recompile the js files and put them in to `keplergl_jupyter/static` folder. You need to reload the jupyter notebook page to reload the files.


