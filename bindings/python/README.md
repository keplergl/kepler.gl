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

This package ships with a **[SKILL.md](SKILL.md)** file for AI assistants to generate `keplergl` map scripts and exports consistently.

- [Claude Code](https://code.claude.com/docs/en/skills): install under `~/.claude/skills` or `.claude/skills`
- [Codex](https://developers.openai.com/codex/): install under `~/.agents/skills` or `.agents/skills`

Detailed per-map-type references (supporting files loaded by Claude only when needed):

| Reference | Description |
|-----------|-------------|
| [point-map.md](skill-references/point-map.md) | Scatter plot from lat/lng |
| [geojson-polygon-map.md](skill-references/geojson-polygon-map.md) | Polygons & lines from GeoJSON / GeoDataFrame |
| [h3-hexagon-map.md](skill-references/h3-hexagon-map.md) | H3 spatial index hexagons |
| [arc-line-map.md](skill-references/arc-line-map.md) | Origin–destination arcs & lines |
| [heatmap.md](skill-references/heatmap.md) | Density heatmap from points |
| [hexbin-aggregation-map.md](skill-references/hexbin-aggregation-map.md) | Spatial binning into hexagons |
| [trip-animation-map.md](skill-references/trip-animation-map.md) | Animated trips along paths |
| [summary-panel.md](skill-references/summary-panel.md) | SampleMapPanel-style info overlay in exported HTML |

### Setting up with Claude Code or Codex

The easiest way to get started is to simply prompt your AI agent:

> Help me installing keplergl-map skill from github kepler.gl repo

The agent will locate the skill file and set it up for you automatically.

### Example prompt

> create a dark theme map showing distribution of  HR60 from the natregimes.geojson . I have a shapefile at `./data/natregimes.shp`
> with columns `name` and `population`. Color the polygons by population, use a light theme,

### Example output

Claude will generate a Python script and run it, producing output like:

```
Map saved to sf_neighborhoods.html!
```

You can ask claude or codex to open the html in any browser to see the interactive map — no server required.

## Documentation

For full documentation, visit [https://docs.kepler.gl/docs/keplergl-jupyter](https://docs.kepler.gl/docs/keplergl-jupyter).

## License

MIT
