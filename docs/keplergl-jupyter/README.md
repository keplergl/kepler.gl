# kepler.gl for Jupyter

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
