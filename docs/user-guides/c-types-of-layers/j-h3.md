# H3

![H3 layer - contour](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-h3.png "H3 layer")

H3 layers visualize spatial data using [H3 Hexagonal Hierarchical Spatial Index](https://eng.uber.com/h3/).

To use H3 layer, you need a `hex_id` or `hexagon_id` in your dataset, which can be generated using [h3-js](https://github.com/uber/h3-js) from latitude, longitude and resolution.

### Paste H3 cell IDs

Select **Add Data → Paste** to import H3 cell IDs without creating a file. Separate IDs with commas, spaces, or new lines. Kepler.gl reports invalid IDs before importing and creates an H3 layer from the valid list.

The tab is enabled by default. Embedding apps can hide it before mounting Kepler.gl:

```ts
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enablePasteH3: false});
```

This only hides the paste tab. H3 layers and file imports remain available.

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

[Back to table of contents](../README.md)
