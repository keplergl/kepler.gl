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

## Use with AI Coding Assistants

This package ships with a **[CLAUDE.md](CLAUDE.md)** file — a project instructions file following the [Claude Code CLAUDE.md convention](https://docs.anthropic.com/en/docs/claude-code/memory). Claude Code automatically loads this file when operating in the `bindings/python/` directory, giving it full knowledge of the `keplergl` API.

Detailed per-map-type references live in **[skill-references/](skill-references/)**:

| Reference | Description |
|-----------|-------------|
| [point-map.md](skill-references/point-map.md) | Scatter plot from lat/lng |
| [geojson-polygon-map.md](skill-references/geojson-polygon-map.md) | Polygons & lines from GeoJSON / GeoDataFrame |
| [h3-hexagon-map.md](skill-references/h3-hexagon-map.md) | H3 spatial index hexagons |
| [arc-line-map.md](skill-references/arc-line-map.md) | Origin–destination arcs & lines |
| [heatmap.md](skill-references/heatmap.md) | Density heatmap from points |
| [hexbin-aggregation-map.md](skill-references/hexbin-aggregation-map.md) | Spatial binning into hexagons |
| [trip-animation-map.md](skill-references/trip-animation-map.md) | Animated trips along paths |

### Setting up with Claude Code

1. **Clone or download** the `CLAUDE.md` file (and optionally the `skill-references/` folder) into your project directory:

   ```bash
   # Copy CLAUDE.md into your project root
   curl -o CLAUDE.md https://raw.githubusercontent.com/keplergl/kepler.gl/master/bindings/python/CLAUDE.md
   ```

   Claude Code automatically discovers and loads any `CLAUDE.md` file in the working directory or its parent directories — no manual registration is needed.

2. *(Optional)* For detailed map-type guidance, also copy the reference files:

   ```bash
   mkdir -p skill-references
   curl -o skill-references/geojson-polygon-map.md https://raw.githubusercontent.com/keplergl/kepler.gl/master/bindings/python/skill-references/geojson-polygon-map.md
   ```

3. **Start Claude Code** in your project directory and begin prompting — Claude now knows the `keplergl` API and can generate working map code.

### Example prompt

> Create a polygon map from a GeoDataFrame. I have a shapefile at `./data/sf_neighborhoods.shp`
> with columns `name` and `population`. Color the polygons by population, use a light theme,
> and save it as a static HTML file I can open in my browser.

### Example output

Claude will generate a Python script similar to:

```python
from keplergl import KeplerGl
import geopandas as gpd

gdf = gpd.read_file('./data/sf_neighborhoods.shp')

config = {
    'version': 'v1',
    'config': {
        'visState': {
            'layers': [{
                'type': 'geojson',
                'config': {
                    'dataId': 'neighborhoods',
                    'label': 'SF Neighborhoods',
                    'isVisible': True,
                    'columns': {'geojson': '_geojson'},
                    'visConfig': {
                        'opacity': 0.8,
                        'filled': True,
                        'stroked': True,
                        'colorRange': {
                            'name': 'Global Warming',
                            'type': 'sequential',
                            'category': 'Uber',
                            'colors': ['#5A1846','#900C3F','#C70039','#E3611C','#F1920E','#FFC300']
                        }
                    }
                },
                'visualChannels': {
                    'colorField': {'name': 'population', 'type': 'integer'},
                    'colorScale': 'quantile'
                }
            }]
        },
        'mapStyle': {'styleType': 'positron'}
    }
}

map_1 = KeplerGl(data={'neighborhoods': gdf}, config=config, theme='light')
map_1.save_to_html(file_name='sf_neighborhoods.html', center_map=True, read_only=True)
print("Map saved to sf_neighborhoods.html")
```

Open `sf_neighborhoods.html` in any browser to see the interactive map — no server required.

## Documentation

For full documentation, visit [https://docs.kepler.gl/docs/keplergl-jupyter](https://docs.kepler.gl/docs/keplergl-jupyter).

## License

MIT
