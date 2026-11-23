# H3

![H3 layer - contour](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-h3.png "H3 layer")

H3 layers visualize spatial data using [H3 Hexagonal Hierarchical Spatial Index](https://eng.uber.com/h3/).

To use H3 layer, you need a `hex_id` or `hexagon_id` in your dataset, which can be generated using [h3-js](https://github.com/uber/h3-js) from latitude, longitude and resolution.

### Naming Convention
kepler.gl __auto generates__ H3 layer from column: `hex_id`, `hexagon_id`

### Sample dataset:
hex_id | value |
|----------|:------:|
89283082c2fffff | 64 |
8928308288fffff | 73 |
89283082c07ffff | 65 |
89283082817ffff | 74 |
89283082c3bffff | 66 |
89283082883ffff | 76 |

### Signed elevations and bathymetry

To render elevations above and below sea level, select the signed elevation field
under **Height**, enable **Fixed height**, and set **Height Multiplier** to `1`.
Expand the height options and set **Display floor (m)** below the lowest elevation,
for example `-5900`. The floor is independent of the elevation field: values of
`-1000`, `0`, and `1000` still produce tops at those elevations in metres. Changing
the floor changes the column bases without shifting their tops. Tops below the
chosen floor are clipped to it; missing elevations do not create relief columns.

Surface Fog uses the same sea-level datum. Set its elevation to `0` for sea level
or `-5000` for a 5,000-metre drawdown. Both its elevation and animation end elevation
support `-12000` to `12000` metres. The map's basemap or terrain can occlude relief
below sea level; hide it when inspecting underwater geometry.

The original signed values remain available in tooltips, filters, and exported
datasets. Saved maps retain the display floor and height settings. Existing maps
default to a floor of `0`, preserving their ordinary column-height behavior.

MCP clients can discover the setting through `map.get-layer-options` and apply it
with `map.set-layer-options` after selecting the height field:

```json
{
  "layerId": "my-h3-layer",
  "options": {
    "enable3d": true,
    "fixedHeight": true,
    "elevationScale": 1,
    "elevationBase": -5900
  }
}
```

[Back to table of contents](../README.md)
