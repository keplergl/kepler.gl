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

This package ships with a **[SKILL.md](SKILL.md)** file — an AI-readable reference that teaches coding assistants how to use `keplergl` to create static HTML maps from geospatial data.

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

1. Open your project in **Claude Code** (terminal-based) or **Claude Desktop with Projects**.

2. Add the skill file to Claude's project knowledge:
   - **Claude Code (CLI):** run the slash command below to register the skill:
     ```
     /add-skill https://raw.githubusercontent.com/keplergl/kepler.gl/master/bindings/python/SKILL.md
     ```
   - **Claude Desktop → Projects:** open your Project, click **"Add Content"** in the Project Knowledge section, and paste the raw URL above (or upload the file directly).

3. *(Optional)* For a specific map type, also add the relevant reference file. For example, to give Claude detailed GeoJSON/polygon guidance:
   ```
   /add-skill https://raw.githubusercontent.com/keplergl/kepler.gl/master/bindings/python/skill-references/geojson-polygon-map.md
   ```

4. Start prompting — Claude now knows the `keplergl` API and can generate working code.

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
