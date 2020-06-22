# kepler.gl for Jupyter

This is the [kepler.gl](http://kepler.gl) jupyter widget, an advanced geospatial visualization tool, to render large-scale interactive maps in Jupyter Notebook.

![Kepler.gl for Jupyter][jupyter_widget]

Table of contacts
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Demo Notebooks](#demo-notebooks)
- [Usage](#usage)
- [Local Development Setup](#local-development-setup)
- [FAQ & Troubleshoot](#faq--troubleshoot)

## Installation

### Prerequisites
- Python >= 2
- ipywidgets >= 7.0.0


To install use pip:

    $ pip install keplergl


If you on Mac used `pip install` and running Notebook 5.3 and above, you don't need to run the following

    $ jupyter nbextension install --py --sys-prefix keplergl # can be skipped for notebook 5.3 and above

    $ jupyter nbextension enable --py --sys-prefix keplergl # can be skipped for notebook 5.3 and above

If you are in JupyterLab, you will also need to install the JupyterLab extension. This require [node](https://nodejs.org/en/download/package-manager/#macos) `> 8.15.0`

If you use [Homebrew](https://brew.sh/) on Mac:

    $ brew install node@8

Then install jupyter labextension.

    $ jupyter labextension install @jupyter-widgets/jupyterlab-manager keplergl-jupyter

**Prerequisites for JupyterLab:**
- Node > 8.15.0
- Python 3
- JupyterLab >=1.0.0 || >=2.0.0


## Quick Start

```python
# Load kepler.gl with an empty map
from keplergl import KeplerGl
map_1 = KeplerGl(height=400)
map_1

# Load kepler.gl with map data and config
map_2 = KeplerGl(height=400, data={'data_1': df}, config=config)
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


## Demo Notebooks
- [Load kepler.gl](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/Load%20kepler.gl.ipynb): Load kepler.gl widget, add data and config
- [Geometry as String](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/Geometry%20as%20String.ipynb): Embed Polygon geometries as `GeoJson` and `WKT` inside a `CSV`
- [GeoJSON](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/GeoJSON.ipynb): Load GeoJSON to kepler.gl
- [DataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/DataFrame.ipynb): Load DataFrame to kepler.gl
- [GeoDataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/kepler.gl-jupyter/notebooks/GeoDataFrame.ipynb): Load GeoDataFrame to kepler.gl


https://docs.kepler.gl/docs/keplergl-jupyter#1-load-keplergl-map
## Usage
  - [1. Load kepler.gl](https://docs.kepler.gl/docs/keplergl-jupyter#1-load-keplergl-map)
    - [`keplergl.KeplerGl()`](https://docs.kepler.gl/docs/keplergl-jupyter#keplergl)
  - [2. Add Data](https://docs.kepler.gl/docs/keplergl-jupyter#2-add-data)
    - [`.add_data()`](https://docs.kepler.gl/docs/keplergl-jupyter#add_data)
    - [`.data`](https://docs.kepler.gl/docs/keplergl-jupyter#data)
  - [3. Data Format](https://docs.kepler.gl/docs/keplergl-jupyter#3-data-format)
    - [`CSV`](https://docs.kepler.gl/docs/keplergl-jupyter#csv)
    - [`GeoJSON`](https://docs.kepler.gl/docs/keplergl-jupyter#geojson)
    - [`DataFrame`](https://docs.kepler.gl/docs/keplergl-jupyter#dataframe)
    - [`GeoDataFrame`](https://docs.kepler.gl/docs/keplergl-jupyter#geodataframe)
    - [`WKT`](https://docs.kepler.gl/docs/keplergl-jupyter#wkt)
  - [4. Customize the map](https://docs.kepler.gl/docs/keplergl-jupyter#4-customize-the-map)
  - [5. Save and load config](https://docs.kepler.gl/docs/keplergl-jupyter#5-save-and-load-config)
    - [`.config`](https://docs.kepler.gl/docs/keplergl-jupyter#config)
  - [6. Match config with data](https://docs.kepler.gl/docs/keplergl-jupyter#6-match-config-with-data)
  - [7. Save Map](https://docs.kepler.gl/docs/keplergl-jupyter#7-save-map)
    - [`.save_to_html()`](https://docs.kepler.gl/docs/keplergl-jupyter#save_to_html)

## Local Development Setup

### Environment Setup
You will need to install node, yarn and Jupyter Notebook.

#### 1. Node and Yarn
Install [node](https://nodejs.org/en/download/package-manager/#macos) `> 10.15.0`, and [yarn](https://yarnpkg.com/en/docs/install#mac-stable). Use [nvm](https://github.com/creationix/nvm) for better node version management e.g. `nvm install 10`.


#### 2. Install Jupyter with pip

Python 3
```bash
$ python3 -m pip install --upgrade pip
$ python3 -m pip install jupyter
```

Python 2
```bash
$ python -m pip install --upgrade pip
$ python -m pip install jupyter
```

### Download and run keplergl in your local Jupyter Notebook

#### Clone Repo
    $ git clone https://github.com/keplergl/kepler.gl.git

### Setup JS
#### 1. Install Js module
```sh
    $ cd bindings/kepler.gl-jupyter
    $ cd js
    $ yarn
```

#### 2. Load mapbox token
Add [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) to Node env.

```sh
export MapboxAccessTokenJupyter=<your_mapbox_token>
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
    $ jupyter nbextension install --py --symlink --sys-prefix keplergl

    # only needed in dev mode, not in normal mode.
    $ jupyter nbextension enable --py --sys-prefix keplergl
```

#### 2. Start jupyter notebook
    $ cd notebooks
    $ jupyter notebook



### Have fun!

You can now start editing the .js and .py files to see changes reflected in your local notebook. After changing files in the js folder, the local start script will recompile the js files and put them in to `keplergl/static` folder. You need to reload the jupyter notebook page to reload the files.


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
