# GeoHash Layer

To use GeoHash layer, you need to assign a column containing [Geohash](https://en.wikipedia.org/wiki/Geohash) cell identifiers.

### Enable the layer

The GeoHash layer is optional and **disabled by default**. Enable it in your app config:

```js
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableGeohashLayer: true});
```

### Naming Convention

Kepler.gl **auto generates** a GeoHash layer from a column named `geohash`, `geo_hash`, or `geohash_id`.

### Simple Dataset

| geohash |        value        |
| ------- | :-----------------: |
| 9q8yyk  | 0.5979242952642347  |
| 9q8yyw  | 0.5446256069712141  |
| 9q8yy4  | 0.1187171597109975  |
| 9q8zn8  | 0.2859146314037557  |
| 9q8yvc  | 0.19549012367504126 |
| 9q8znf  | 0.3373452974230604  |
| 9q8ytx  | 0.9218176408795662  |
| 9q8zp5  | 0.23470692356446143 |

[Back to table of contents](../README.md)
