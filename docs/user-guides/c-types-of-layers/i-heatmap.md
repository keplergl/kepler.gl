# Heatmap

![Heatmap layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-heat-map.png "Heatmap layer")

Heatmap layers describe the intensity of data at geographical points through a colored overlap. The intensity can be weighted by a numerical field.

## 3D Surface

Turn on the toggle in the heatmap's separate **3D Surface** group, then tilt the map to see density as a continuous raised surface. The toggle is off by default, keeping the map in 2D. All surface options are in the collapsible group; click its header to expand or collapse them.

The surface uses the same data, weights, aggregation, radius, color range, intensity, and filters as the flat heatmap. Height represents density, not terrain elevation. The surface grid matches the allocated density texture resolution: normally 512 × 512 cells (513 × 513 vertices).

- **Height scale (m)** controls meters per unit of displayed density. Increasing intensity also increases surface height.
- **Surface shading** adds directional shading to make slopes easier to see.
- **Surface contours** overlays lines at regular density intervals.

Surface settings are saved with the map and retained when switching back to Flat. Surface mode works on both the flat map and globe.

[Back to table of contents](../README.md)
