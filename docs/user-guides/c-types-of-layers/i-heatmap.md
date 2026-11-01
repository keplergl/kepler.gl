# Heatmap

![Heatmap layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-heat-map.png "Heatmap layer")

Heatmap layers describe the intensity of data at geographical points through a colored overlap. The intensity can be weighted by a numerical field.

## 3D Surface

Turn on the toggle in the **3D Surface** group at the end of the heatmap settings, then tilt the map to see density as a continuous raised surface. The toggle is off by default, keeping the map in 2D. All surface options are in the collapsible group; click its header to expand or collapse them.

The surface uses the same data, weights, aggregation, radius, color range, intensity, and filters as the flat heatmap. Height represents density, not terrain elevation. The surface grid matches the allocated density texture resolution: normally 512 × 512 cells (513 × 513 vertices).

- **Height scale (m)** controls meters per unit of displayed density. Increasing intensity also increases surface height.
- **Surface shading** uses scene lighting to make slopes easier to see. With **Light & Shadow** enabled, the surface responds to the sun and ambient-light settings and casts and receives shadows.
- **Surface contours** overlays lines at regular density intervals.
- **Contour step** appears when contours are enabled and controls the density interval between lines, from 0.01 to 100 (default 0.1). Smaller steps show more lines; larger steps reduce clutter when zoomed out. The slider keeps fine control over intervals from 0.01 to 1.

Surface settings are saved with the map and retained when switching back to Flat. Surface mode works on both the flat map and globe.

[Back to table of contents](../README.md)
