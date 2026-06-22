# FAQ & Troubleshoot

## 1. Widget not rendering in JupyterLab or Notebook?

Make sure you are using JupyterLab >= 4.0 or Notebook >= 7.0 with Python >= 3.9. The widget is built on [anywidget](https://anywidget.dev/) which is supported out of the box in modern Jupyter environments — no extra `nbextension` or `labextension` install steps are needed.

If the widget still does not render, try restarting the kernel and re-running the cell.

## 2. What's your recommended Python environment?

```text
python>=3.9
jupyterlab>=4.0
notebook>=7.0
```

## Demo Notebooks

- [Load kepler.gl](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/Load%20kepler.gl.ipynb): Load kepler.gl widget, add data and config
- [GeoJSON](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/GeoJSON.ipynb): Load GeoJSON to kepler.gl
- [DataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/DataFrame.ipynb): Load DataFrame to kepler.gl
- [GeoDataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/GeoDataFrame.ipynb): Load GeoDataFrame to kepler.gl
- [GeoDataFrame with Datetime](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/GeoDataFrame%20with%20Datetime.ipynb): Load GeoDataFrame with datetime columns
- [Empty GeoDataFrame](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/Empty%20GeoDataFrame.ipynb): Handle empty or all-null geometries
- [Theme and App Name](https://github.com/keplergl/kepler.gl/blob/master/bindings/python/notebooks/Theme%20and%20App%20Name.ipynb): Customize theme and app name
