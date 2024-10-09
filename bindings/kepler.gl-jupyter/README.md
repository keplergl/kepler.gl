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

[![Anaconda-Server Badge](https://anaconda.org/conda-forge/keplergl/badges/version.svg)](https://anaconda.org/conda-forge/keplergl) [![PyPI version](https://badge.fury.io/py/keplergl.svg)](https://badge.fury.io/py/keplergl)

### 1. For Jupyter Notebook

#### Using conda:

```shell
conda install -c conda-forge keplergl
```

##### Prerequisites
  - Python >= 3.7

#### Using pip:

```shell
pip install keplergl
```

##### Prerequisites
  - For kelplergl <= 0.3.0
    - Python >= 2
    - ipywidgets >= 7.0.0

If you're on Mac, used `pip install`, and you're running Notebook 5.3 and above, you don't need to run the following:

```shell
jupyter nbextension install --py --sys-prefix keplergl # can be skipped for notebook 5.3 and above
jupyter nbextension enable --py --sys-prefix keplergl # can be skipped for notebook 5.3 and above
```

NOTE: For No Module named 'keplergl' error, please make sure your virtual environment is activated and has been added to the Jupyter kernel.

Use the following command to check the kernel list:
```shell
jupyter kernelspec list
```

Use the following command to add the virtual environment to the Jupyter kernel:
```shell
python -m ipykernel install --user --name=myenv
```

The `--name` parameter is your preferred name to identify the virtual environment


### 2. For Google Colab:

`keplergl` (>0.3.0) works with Google Colab. You can install it using pip.

```python
# Install keplergl (>0.3.0)
!pip install keplergl
```

### 3. For JupyterLab

#### JupyterLab 3

NOTE: `keplergl` <=0.3.0 doesn't work with JupyterLab 3. You need to make sure the python package `keplergl` > 0.3.0 is installed.

Installation using pip:
```shell
pip install keplergl
```
Installation using conda:
```shell
conda install keplergl
```

There is no need to use `jupyter labextension install` for `keplergl` > 0.3.0 with JupyterLab3.

#### JupyterLab 1

For JupyterLab1, you need to install `keplergl-jupyter` labextension from NPM registery. There is no need to install `keplergl` python package.

First, install `jupyterlab-manager` for JupyterLab1:
```shell
jupyter labextension install @jupyter-widgets/jupyterlab-manager@1.1
```

Then, install `keplergl-jupyter` labextension from NPM registry:
```shell
jupyter labextension install keplergl-jupyter
```

##### Prerequisites:
  - Node >= 12
  - Python 3

#### JupyterLab 2

For JupyterLab2, you need to install `keplergl-jupyter` labextension from NPM registery. There is no need to install `keplergl` python package.

First, install `jupyterlab-manager` for JupyterLab2:
```shell
jupyter labextension install @jupyter-widgets/jupyterlab-manager@2
```

To install `keplergl-jupyter` from NPM registry, JupyterLab2 has following requirements of dependencies:
```
JupyterLab             Extension      Package
>=16.9.0 <16.10.0   >=17.0.0 <18.0.0  react
>=16.9.0 <16.10.0   >=17.0.0 <18.0.0  react-dom
```

However, `keplergl-jupyter`<=0.3.0 depends on `react` >= 17.0.2. Therefore, the latest `keplergl-jupyter` can’t be installed with JupyterLab2: if you use `jupyter labextension install keplergl-jupyter`, the version 0.2.2 as a fallback will be installed. Unfortunately, version 0.2.2 does NOT work with JupyterLab2.

A workaround is to modify the file `lib/python3.x/site-packages/jupyterlab/staging/package.json` and remove “react” and “react-dom” from “singletonPackages” object. Then, install keplergl-jupyter using this command:
```
jupyter labextension install keplergl-jupyter
```

##### Prerequisites:
  - Node >= 12
  - Python 3

## Quick Start

### For Jupyter Notebook and JupyterLab:

NOTE: please make sure the python kernel is correctly specified in the notebook.

```python
# Load kepler.gl with an empty map
from keplergl import KeplerGl
map_1 = KeplerGl(height=400)
map_1

# Load kepler.gl with map data and config
# Since keplergl 0.3.4, you can pass `use_arrow=True` to load and render data faster using GeoArrow, e.g. `KeplerGl(data={'data_1': df}, config=config, use_arrow=True)`
map_2 = KeplerGl(height=400, data={'data_1': df}, config=config)
map_2

# Add data to map
# Since keplergl 0.3.4, you can pass `use_arrow=True` to load and render data faster using GeoArrow, e.g. `map_1.add_data(df, 'data_1', use_arrow=True)`
map_1.add_data(df, 'data_1')

# Apply config
map_1.config(config)

# print data and config
map_1.data
map_1.config

# save map to html
map_1.save_to_html(file_name='keplergl_map.html')
```

### For Google Colab:

Keplergl (>0.3.0) works with Google Colab. You can install it using pip.

```python
# Install keplergl (>0.3.0)
!pip install keplergl

# Load Kepler.gl with an empty map
from keplergl import KeplerGl
map_1 = KeplerGl()

# Display map
map_1.show()
```

The function `show()` is newly introduced for displaying map in Google Colab. The function is defined as:
```python
def show(self, data=None, config=None, read_only=False, center_map=False)
```
with input parameters:
- data: a data dictionary {"name": data}, if not provided, will use current map data
- config: map config dictionary, if not provided, will use current map config
- read_only: if read_only is True, hide side panel to disable map customization
- center_map: if center_map is True, the bound of the map will be updated acoording to the current map data

Please note that the map is not interactive due to the limitation of Google Colab. For example, when applying config to the map in Colab, the map won't be updated and one needs to call `show()` again to render a new map in a new cell.

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
Install [node](https://nodejs.org/en/download/package-manager/#macos) `> 12`, and [yarn](https://yarnpkg.com/en/docs/install#mac-stable). Use [nvm](https://github.com/creationix/nvm) for better node version management e.g. `nvm install 12`.


#### 2. Install Jupyter

- Using conda
```shell
conda install jupyter
conda install notebook 6.0.1
```

- Using pip

```shell
pip install jupyter
pip install notebook==6.0.1
```

#### 3. Install GeoPandas

- Using conda
```shell
conda install geopandas
```

- Using pip

```shell
pip install geopandas
```

### Download and run keplergl in your local Jupyter Notebook

#### Clone Repo
```shell
git clone https://github.com/keplergl/kepler.gl.git
```

### Setup JS
#### 1. Install Js module
```sh
cd bindings/kepler.gl-jupyter
cd js
yarn
```

#### 2. Load mapbox token
Add [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) to Node env.

```sh
export MapboxAccessTokenJupyter=<your_mapbox_token>
```

#### 3. Build js module, start a local server to watch for changes

```shell
npm start
```

You need to run step 2 and 3 to restart the js program. And step 1-3 if any js dependency has changed (Usually after pulling new changes from master).

### Setup jupyter

#### 1. Install python module and enable extension from local files
This command must be run **AFTER** the `js` setup, and folder `static/` was created. It only needs to be run once.

```sh
# dev install from folder containing setup.py
pip install -e .

# only needed in dev mode, not in normal mode.
jupyter nbextension install --py --symlink --sys-prefix keplergl

# only needed in dev mode, not in normal mode.
jupyter nbextension enable --py --sys-prefix keplergl
```

NOTE: The above command `jupyter nbextension install -py --symlink --sys-prefix keplergl` is trying to create a symoblic link of the folder `bindings/kepler.gl-jupyter/keplergl/static` under the jupyter's folder `nbextensions`. Please check if there is already a folder "nbextensions/kepler-jupyter" existed, and you might need to remove it first.

To find the location of `nbextensions` folder, you can use the following command:
```shell
$ where jupyter
/Users/test/opt/anaconda3/envs/test37/bin/jupyter

# the nbextensions should be at: /Users/test/opt/anaconda3/envs/test37/share/jupyter/nbextensions
```


#### 2. Start jupyter notebook

```shell
cd notebooks
jupyter notebook
```


#### Have fun!

You can now start editing the .js and .py files to see changes reflected in your local notebook. After changing files in the js folder, the local start script will recompile the js files and put them in to `keplergl/static` folder. You need to reload the jupyter notebook page to reload the files.


#### 3. Development for JupyterLab

To test the development work in previous 2 steps for JupyterLab. You can build the `keplergl labextension` under the `js` directory:

```shell
jupyter labextension build .
```

The output of the jupyter labextension is defined in the file `js/package.json`:
```javascript
...
"jupyterlab": {
  "extension": "babel/labplugin",
  "outputDir": "../keplergl-jupyter/labextension",
  "sharedPackages": {
    "@jupyter-widgets/base": {
      "bundled": false,
      "singleton": true
    }
  }
}
```

Then, you can either install this labextension to test it:
```shell
jupyter labextension install .
```
or, you can manually create a symbolic link for the folder `bindings/kepler.gl-jupyter/kepler-jupyter/labextension` under the jupyter's folder `labextensions`, e.g. `/Users/test/opt/anaconda3/envs/test37/share/jupyter/labextensions`. You will need to reload the jupyter lab page.

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
