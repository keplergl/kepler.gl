# Local Development

## Preface

This file describes the keplergl bindings for jupyter, i.e. the python package you can install as `keplergl` (see below).

It makes use of the `kepler.gl` javascript package, which is defined in `../..`, but pulls this dependency from [upstream](https://www.npmjs.com/package/kepler.gl).
Hence to build this binding it is _not_ required to build the parent project.

### Provided entities

The bindings actually provide two things:

- A JupyterLab/Jupyter Notebook extension, which is displayed/interacted with in your browser when using `jupyter`.
- A python package, that can be interacted with via `import keplergl` in python.

The python package bundles all of these together.


### Code organization

The python package is declared by `./pyproject.toml`.
The actual python code is in `./keplergl`.
This provides a jupyter widget (a `ipywidgets.DOMWidget`).

This python package contains and makes use of the javascript package `keplergl-jupyter`, which resides in [`./js`](./js).
It provides a [JupyterLab extension](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html) (see `./js/labplugin.js`) and a [Jupyter Notebook extension](https://nbclassic.readthedocs.io/en/latest/extending/index.html) (see `./js/extension.js`) which share all the 'functional' code to display the kepler.gl-widget.

When building the js code, this will generate javascript files in `./keplergl/static`.
When installing the python package, the code in `./js` is also automatically built (unless the build results are already there, i.e. if you manually built it).

Some example notebooks can be found in `./notebooks`.


### Release

See [`RELEASE.md`](RELEASE.md) for how this package is released.


## Setup

### Environment Setup
You will need to install node, yarn and Jupyter Notebook.

#### 1. Node and Yarn
We recommended to use [`nvm`](https://github.com/nvm-sh/nvm) to install `node` and to use `yarn` via `corepack`:

    cd js
    nvm install  # this will install `node` in the version specified in `.nvmrc`
    corepack enable
    yarn  # this will install yarn in the version specified in `yarn.lock`.

It may work to use other [node](https://nodejs.org/en/download/package-manager) `> 12` and [yarn](https://yarnpkg.com/getting-started/install) installations.

#### Jupyter


- Using conda
```shell
conda install jupyter
conda install notebook 6.0.1
```

- Using pip
  (When working with `pip` you may want to first create a virtual environment via `python -m venv venv && source ./venv/bin/activate` -- on Ubuntu you will need to install `python3-venv` for that)
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
#### 1. Install Js dependencies
```sh
cd bindings/kepler.gl-jupyter
cd js
yarn
```

Rerun `yarn` if any js dependency has changed (usually after pulling new changes from master).

#### 2. Load mapbox token
Add a [Mapbox access token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) to the environment.

```sh
export MapboxAccessTokenJupyter=<your_mapbox_token>
```

#### 3. Build the js module

For development of the js code, it is convenient to start a local server to watch for changes:

```shell
yarn start
```

If you edit a file in the `js` directory, the local server will pick up those changes.

To build without a local server that watches for changes, use

```shell
yarn build
```

### Setup jupyter

#### 1. Install python module and enable extension from local files
This command must be run **AFTER** the `js` setup, and folder `./keplergl/static/` was created. It only needs to be run once.

```sh
# dev install from folder containing setup.py
pip install -e .

# only needed in dev mode, not in normal mode.
jupyter nbextension install --py --symlink --sys-prefix keplergl

# only needed in dev mode, not in normal mode.
jupyter nbextension enable --py --sys-prefix keplergl
```

NOTE:
The above command `jupyter nbextension install -py --symlink --sys-prefix keplergl` is trying to create a symoblic link from the folder `bindings/kepler.gl-jupyter/keplergl/static` into jupyter's folder `nbextensions`.
Please check if there folder `nbextensions/kepler-jupyter` already exists and if so, remove (or rename) it first.

To find the location of `nbextensions` folder, you can use the following command:
```shell
realpath $(dirname $(dirname $(which jupyter)))/share/jupyter/nbextensions
```
For example for
```
$ where jupyter
/Users/test/opt/anaconda3/envs/test37/bin/jupyter
```
the nbextensions should be at:
```
/Users/test/opt/anaconda3/envs/test37/share/jupyter/nbextensions
```


#### 2. Start jupyter notebook

```shell
cd notebooks
jupyter notebook
```


#### Have fun!

You can now start editing the `.js` and `.py` files to see changes reflected in your local notebook. After changing files in the `./js` folder, the local start script will recompile the `.js` files and put them in to `keplergl/static` folder. You need to reload the jupyter notebook page to reload the files.


#### 3. Development for JupyterLab

To target JupyterLab instead of Jupyter Notebook, use

```shell
pip install -e .  # in this folder
cd js && jupyter labextension develop . --overwrite
cd ../notebooks && jupyter lab
```
for development.
This will automatically create the correct symlinks to let `jupyter lab` pick up the extension.

To build and install it use (in `./js`)
```shell
jupyter labextension build .
jupyter labextension install .
```

Alternatively you can build the extension via `jupyter labextension build .` and then manually create a symbolic link from the folder output folder `./kepler-jupyter/labextension` to JupyterLab's folder `labextensions`, e.g. `/Users/test/opt/anaconda3/envs/test37/share/jupyter/labextensions`. You will need to reload the jupyter lab page.

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
