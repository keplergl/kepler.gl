# kperlgl-jupyter

This is a simple jupyter widget for kepler.gl, an advanced geospatial visualization tool, to render large-scale interactive maps.

## Package Install

---

**Prerequisites**

- [node](http://nodejs.org/) >=8.15.0
- [yarn](https://yarnpkg.com/en/docs/install#mac-stable) >=1.6.0

**More links**

- [Jupyter Widget](https://ipywidgets.readthedocs.io/en/stable/examples/Widget%20Custom.html)
- [Widget Cookiecutter](https://github.com/jupyter-widgets/widget-cookiecutter)

## Local Dev

---

### Local Dev Installation for Classic Notebook

To develop this package against the classic notebook, run:

- `pip install -e .` (installs python package for development, runs `npm install` and `npm run build`)
- `jupyter nbextension install --py --symlink --sys-prefix keplergl`\
  (symlinks `static/` directory into `<jupyter path>/nbextensions/keplergl/`). Now the notebook has access to the frontend code.
- `jupyter nbextension enable --py --sys-prefix keplergl`\
  (copies `<npm_package_name>.json` into `<environment path>/etc/jupyter/nbconfig/notebook.d/` directory). Now the notebook will load your frontend code on page load.

Now make some changes to your source code. Then:

- After making Python code changes, restarting the notebook kernel will be enough to reflect changes
- After making JavaScript code changes:
  - `cd js`
  - `npm run build`
  - Refresh browser to reflect changes

### Local Dev Installation for JupyterLab

To develop this package against JupyterLab, run:

- `pip install -e .` (installs python package for development, runs `npm install` and `npm run build`)
- `jupyter labextension install @jupyter-widgets/jupyterlab-manager`: this install lab widgets manager.
- `jupyter labextension install js`: this installs the current labextension into JupyterLab and enables it.
- `jupyter lab --watch` starts JupyterLab, but in `--watch` mode: it will rebuild itself incrementally if it detects changes.

Now make some changes to your source code. Then:

- After making Python code changes, restarting the notebook kernel will be enough to reflect changes
- After making JavaScript code changes:

  - `cd js`
  - `npm run build:lab`
  - Refresh browser to reflect changes

- By default, the application will load from the JupyterLab staging directory (default is <sys-prefix>/share/jupyter/lab/staging. Check the correct version of `@jupyter-widgets/jupyterlab-manager` and `@jupyter-widgets/base` is install in `yarn.lock`

#### JupyterLab widget Dependencies

Install correct version of jupyterlab-manager based on your Jupyter Lab version. Make sure `@jupyter-widgets/base` version in the widget does not conflict with requirements in `jupyterlab-manager`.

- [@jupyter-widgets/jupyterlab-manager](https://github.com/jupyter-widgets/ipywidgets/tree/master/packages/jupyterlab-manager)
- [@jupyter-widgets/base](https://github.com/jupyter-widgets/ipywidgets/tree/master/packages/base)
- [@jupyter-widgets/base-manager](https://github.com/jupyter-widgets/ipywidgets/tree/master/packages/base-manager)
