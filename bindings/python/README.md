# kepler.gl for Jupyter

[![PyPI version](https://img.shields.io/pypi/v/keplergl.svg)](https://pypi.org/project/keplergl/)
[![PyPI prerelease](https://img.shields.io/pypi/v/keplergl.svg?include_prereleases&label=prerelease)](https://pypi.org/project/keplergl/#history)

This is the [kepler.gl](http://kepler.gl) Jupyter widget, an advanced geospatial visualization tool for rendering large-scale interactive maps in Jupyter Notebook and JupyterLab.



## Installation

```shell
pip install keplergl
```

### Prerequisites
- Python >= 3.9
- JupyterLab >= 4.0 or Notebook >= 7.0

## Quick Start

```python
from keplergl import KeplerGl

# Create a map
map = KeplerGl(height=400)

# Add data
map.add_data(data=df, name='my_data')

# Display the map
map
```

## Features

- **Multiple data formats**: Load CSV, GeoJSON, Pandas DataFrame, and GeoPandas GeoDataFrame
- **GeoArrow support**: Use `use_arrow=True` for faster data loading and rendering with large datasets
- **GeoDataFrame datetime support**: GeoDataFrames with `datetime` columns are serialized automatically — no manual conversion needed
- **Empty geometry handling**: GeoDataFrames with empty or all-null geometry columns are handled gracefully
- **Theme customization**: Set the UI theme to `"light"`, `"dark"`, or `"base"` via the `theme` parameter
- **App name customization**: Set a custom application name with `app_name` — displayed in the side panel header and used as the HTML `<title>` when exporting
- **HTML export**: Export maps to standalone HTML files with `save_to_html()`, supporting custom themes, app names, and a configurable JSON encoder for non-native types

## Documentation

For full documentation, visit [https://docs.kepler.gl/docs/keplergl-jupyter](https://docs.kepler.gl/docs/keplergl-jupyter).

## License

MIT
