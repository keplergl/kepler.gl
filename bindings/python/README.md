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

## Documentation

For full documentation, visit [https://docs.kepler.gl/docs/keplergl-jupyter](https://docs.kepler.gl/docs/keplergl-jupyter).

## License

MIT
