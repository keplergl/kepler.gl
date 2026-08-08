# kepler.gl for Jupyter

> **Upgrading from v0.3.x?**
> `keplergl` v0.4 switched to [anywidget](https://anywidget.dev/) — no JupyterLab extension install is needed anymore. Just `pip install keplergl` and go.
>
> If you are pinned to **v0.3.x**, the old setup was:
> ```bash
> pip install "keplergl<0.4"
> jupyter labextension install @jupyter-widgets/jupyterlab-manager keplergl-jupyter
> ```
> JupyterLab 1–3 with Node > 10 was required. The old docs are preserved in [git history](https://github.com/keplergl/kepler.gl/blob/a54aef56/docs/keplergl-jupyter/README.md).

kepler.gl for Jupyter is an advanced geospatial visualization widget for rendering large-scale interactive maps in Jupyter Notebook and JupyterLab.

## Documentation

- [Installation](install.md) – Prerequisites and install instructions
- [Widget API](widget-api.md) – `KeplerGl()`, `.add_data()`, `.data`
- [Data Formats](data-formats.md) – CSV, GeoJSON, DataFrame, GeoDataFrame, WKT
- [Map Customization](map-customization.md) – Theme, app name, and interactive customization
- [Save and Load Config](config.md) – `.config`, match config with data
- [Save and Export Map](save-and-export.md) – `.save_to_html()`
- [FAQ & Troubleshoot](faq.md) – Common issues and demo notebooks

## Quick Start

```python
from keplergl import KeplerGl

# Create a map with some data
import pandas as pd
df = pd.DataFrame({
    'City': ['Buenos Aires', 'Brasilia', 'Santiago'],
    'Latitude': [-34.58, -15.78, -33.45],
    'Longitude': [-58.66, -47.91, -70.66]
})

map_1 = KeplerGl(height=400, data={'cities': df})

# Display the map
map_1
```
