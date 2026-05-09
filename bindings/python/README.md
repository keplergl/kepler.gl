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

### Setting up with Claude Code

Claude Code skills are stored as directories containing a `SKILL.md` file. You can install this skill at the **personal** level (available across all projects) or the **project** level (shared with your team via git).

**Option A — Personal skill** (available in all your projects):

```bash
BASE=https://raw.githubusercontent.com/keplergl/kepler.gl/main/bindings/python
mkdir -p ~/.claude/skills/keplergl-map/skill-references

curl -o ~/.claude/skills/keplergl-map/SKILL.md $BASE/SKILL.md
curl -o ~/.claude/skills/keplergl-map/skill-references/point-map.md              $BASE/skill-references/point-map.md
curl -o ~/.claude/skills/keplergl-map/skill-references/geojson-polygon-map.md    $BASE/skill-references/geojson-polygon-map.md
curl -o ~/.claude/skills/keplergl-map/skill-references/h3-hexagon-map.md         $BASE/skill-references/h3-hexagon-map.md
curl -o ~/.claude/skills/keplergl-map/skill-references/arc-line-map.md           $BASE/skill-references/arc-line-map.md
curl -o ~/.claude/skills/keplergl-map/skill-references/heatmap.md                $BASE/skill-references/heatmap.md
curl -o ~/.claude/skills/keplergl-map/skill-references/hexbin-aggregation-map.md $BASE/skill-references/hexbin-aggregation-map.md
curl -o ~/.claude/skills/keplergl-map/skill-references/trip-animation-map.md     $BASE/skill-references/trip-animation-map.md
```

**Option B — Project skill** (shared with your team via git):

```bash
BASE=https://raw.githubusercontent.com/keplergl/kepler.gl/main/bindings/python
mkdir -p .claude/skills/keplergl-map/skill-references

curl -o .claude/skills/keplergl-map/SKILL.md $BASE/SKILL.md
curl -o .claude/skills/keplergl-map/skill-references/point-map.md              $BASE/skill-references/point-map.md
curl -o .claude/skills/keplergl-map/skill-references/geojson-polygon-map.md    $BASE/skill-references/geojson-polygon-map.md
curl -o .claude/skills/keplergl-map/skill-references/h3-hexagon-map.md         $BASE/skill-references/h3-hexagon-map.md
curl -o .claude/skills/keplergl-map/skill-references/arc-line-map.md           $BASE/skill-references/arc-line-map.md
curl -o .claude/skills/keplergl-map/skill-references/heatmap.md                $BASE/skill-references/heatmap.md
curl -o .claude/skills/keplergl-map/skill-references/hexbin-aggregation-map.md $BASE/skill-references/hexbin-aggregation-map.md
curl -o .claude/skills/keplergl-map/skill-references/trip-animation-map.md     $BASE/skill-references/trip-animation-map.md

git add .claude/skills/keplergl-map
git commit -m "Add keplergl map skill for Claude Code"
```

Once installed, Claude Code automatically discovers the skill — no restart needed. Claude will use it whenever you ask about creating maps or visualizing geospatial data, or you can invoke it directly with `/keplergl-map`.

### Setting up with Codex

Codex skills are stored as directories containing a `SKILL.md` file.

**Option A — Personal skill** (available in all your projects):

```bash
BASE=https://raw.githubusercontent.com/keplergl/kepler.gl/main/bindings/python
mkdir -p ~/.agents/skills/keplergl-map/skill-references

curl -o ~/.agents/skills/keplergl-map/SKILL.md $BASE/SKILL.md
curl -o ~/.agents/skills/keplergl-map/skill-references/point-map.md              $BASE/skill-references/point-map.md
curl -o ~/.agents/skills/keplergl-map/skill-references/geojson-polygon-map.md    $BASE/skill-references/geojson-polygon-map.md
curl -o ~/.agents/skills/keplergl-map/skill-references/h3-hexagon-map.md         $BASE/skill-references/h3-hexagon-map.md
curl -o ~/.agents/skills/keplergl-map/skill-references/arc-line-map.md           $BASE/skill-references/arc-line-map.md
curl -o ~/.agents/skills/keplergl-map/skill-references/heatmap.md                $BASE/skill-references/heatmap.md
curl -o ~/.agents/skills/keplergl-map/skill-references/hexbin-aggregation-map.md $BASE/skill-references/hexbin-aggregation-map.md
curl -o ~/.agents/skills/keplergl-map/skill-references/trip-animation-map.md     $BASE/skill-references/trip-animation-map.md
```

Then verify `~/.agents/skills/keplergl-map/SKILL.md` frontmatter includes both:

- `name: keplergl-map`
- `description: ...`

**Option B — Project skill** (shared with your team via git):

```bash
BASE=https://raw.githubusercontent.com/keplergl/kepler.gl/main/bindings/python
mkdir -p .agents/skills/keplergl-map/skill-references

curl -o .agents/skills/keplergl-map/SKILL.md $BASE/SKILL.md
curl -o .agents/skills/keplergl-map/skill-references/point-map.md              $BASE/skill-references/point-map.md
curl -o .agents/skills/keplergl-map/skill-references/geojson-polygon-map.md    $BASE/skill-references/geojson-polygon-map.md
curl -o .agents/skills/keplergl-map/skill-references/h3-hexagon-map.md         $BASE/skill-references/h3-hexagon-map.md
curl -o .agents/skills/keplergl-map/skill-references/arc-line-map.md           $BASE/skill-references/arc-line-map.md
curl -o .agents/skills/keplergl-map/skill-references/heatmap.md                $BASE/skill-references/heatmap.md
curl -o .agents/skills/keplergl-map/skill-references/hexbin-aggregation-map.md $BASE/skill-references/hexbin-aggregation-map.md
curl -o .agents/skills/keplergl-map/skill-references/trip-animation-map.md     $BASE/skill-references/trip-animation-map.md

git add .agents/skills/keplergl-map
git commit -m "Add keplergl map skill for Codex"
```

Then verify `.agents/skills/keplergl-map/SKILL.md` frontmatter includes both:

- `name: keplergl-map`
- `description: ...`

#### Optional Codex app metadata and icon assets

Inside each Codex skill folder, add metadata at `agents/openai.yaml` and assets under `agents/assets/`.
That means:

- Personal install: `~/.agents/skills/keplergl-map/agents/openai.yaml`
- Project install: `.agents/skills/keplergl-map/agents/openai.yaml`

Example asset setup:

```bash
# Project-level
mkdir -p .agents/skills/keplergl-map/agents/assets
curl -o .agents/skills/keplergl-map/agents/assets/kepler-gl-icon.png \
  https://raw.githubusercontent.com/keplergl/kepler.gl/main/website/src/static/favicon.png

# Personal-level
mkdir -p ~/.agents/skills/keplergl-map/agents/assets
curl -o ~/.agents/skills/keplergl-map/agents/assets/kepler-gl-icon.png \
  https://raw.githubusercontent.com/keplergl/kepler.gl/main/website/src/static/favicon.png
```

```yaml
interface:
  display_name: "keplergl map"
  short_description: "Create interactive keplergl HTML maps from tabular and geospatial data"
  icon_small: "./assets/kepler-gl-icon.png"
  icon_large: "./assets/kepler-gl-icon.png"
  brand_color: "#2FA7F4"
```

#### Easiest distribution for Codex users

For easy installation across teams, package this skill as a **Codex plugin** (recommended). Plugins can bundle skills, metadata (`agents/openai.yaml`), assets, and optional integrations in one installable package.  
For local experimentation only, Codex users can install curated skills with the built-in `$skill-installer` command (see https://developers.openai.com/codex/skills).

### Example prompt

> Create a polygon map from a GeoDataFrame. I have a shapefile at `./data/sf_neighborhoods.shp`
> with columns `name` and `population`. Color the polygons by population, use a light theme,
> and save it as a static HTML file I can open in my browser.

### Example output

Claude will generate a Python script and run it, producing output like:

```
Map saved to sf_neighborhoods.html!
```

The generated script will look similar to:

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
print("Map saved to sf_neighborhoods.html!")
```

Open `sf_neighborhoods.html` in any browser to see the interactive map — no server required.

## Documentation

For full documentation, visit [https://docs.kepler.gl/docs/keplergl-jupyter](https://docs.kepler.gl/docs/keplergl-jupyter).

## License

MIT
