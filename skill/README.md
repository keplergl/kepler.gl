# kepler.gl Skill for AI Coding Assistants

This directory contains the **kepler.gl** agent skill — a set of instructions and references that help AI coding assistants (Claude Code, Codex, Cursor, etc.) generate `keplergl` map scripts and exports consistently.

## Skill References

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

## Quick Setup via AI Agent

The easiest way to get started is to prompt your AI agent:

> Help me install the kepler.gl skill from the kepler.gl GitHub repo

The agent will locate the skill file and set it up for you automatically.

## Example Prompt

> Create a map showing distribution of HR60 from natregimes.geojson.
> Color the polygons by population, use a light theme.

The agent will generate a Python script and run it, producing a standalone HTML map file you can open in any browser.

## Versioning

The skill version is tracked in [`plugin.json`](plugin.json). Releases use the tag pattern `skill-v*` (e.g. `skill-v1.0.0`).
