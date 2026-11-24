# Icon

![Icon layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image33.png "Icon layer")

Icon layers are a type of point layer. They allow you to differentiate between points by assigning icons to points based on a field. For example, you might use icons to differentiate between types of venues and points of interest.

To rotate individual icons, choose a numeric column in the optional **angle (degrees)** selector. Values are used directly as degrees, counter-clockwise around each icon’s center, without rescaling. Negative angles rotate clockwise. Missing or invalid values use zero rotation. With no angle column selected, icons keep their original orientation. Rotation follows the map when billboard is off and the screen when billboard is on.

To see the icon menu, create a new icon layer and click how to draw an icon layer:

![How to Draw Icon Layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image38.png "How to Draw Icon Layer")

## Use custom icons in an embedded app

Register your icons before creating any Icon layers. Import `initApplicationConfig` from `@kepler.gl/utils` and pass an array to `customIcons`:

```js
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({
  customIcons: [
    {
      id: 'custom-triangle',
      mesh: {
        cells: [[0, 1, 2]],
        positions: [[0, 0.8, 0], [-0.7, -0.4, 0], [0.7, -0.4, 0]]
      }
    }
  ]
});
```

Alternatively, serve a JSON file with an `svgIcons` array containing the same icon objects and configure `initApplicationConfig({customIconUrl: '/my-icons.json'})`. The URL must be reachable by the browser and allow CORS if it is on another origin. Each icon needs an ID and a triangulated mesh: `positions` contains `[x, y, z]` vertices, and `cells` contains triples of zero-based vertex indices. A raw SVG file is not accepted. Use IDs that do not overlap existing icons unless you intend to replace them.

### Add a point that uses the icon

Save this as `custom-marker.geojson` and load it into your app:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "icon": "custom-triangle"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-122.4194, 37.7749]
      }
    }
  ]
}
```

The Icon layer reads latitude and longitude from separate fields, so include both in `properties` even though the Point geometry already has coordinates. If the Icon layer is not created automatically, add an **Icon** layer, select the dataset, and choose `latitude`, `longitude`, and `icon` for its fields. The `icon` value must match the registered ID exactly.

[Back to table of contents](../README.md)
