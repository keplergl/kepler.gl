# A5 Layer

To use A5 layer, you need to assign a column containing [A5](https://a5geo.org) cell identifiers (hexadecimal tokens).

### Enable the layer

The A5 layer is optional and **disabled by default**. Enable it in your app config:

```js
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableA5Layer: true});
```

### Naming Convention

Kepler.gl **auto generates** an A5 layer from a column named `a5`, `a5_token`, or `a5_id`.

### Simple Dataset

| token            |        value        |
| ---------------- | :-----------------: |
| 1ae2958000000000 | 0.5979242952642347  |
| 1ae2968000000000 | 0.5446256069712141  |
| 1adebc8000000000 | 0.1187171597109975  |
| 1ae2978000000000 | 0.2859146314037557  |
| 1ae2918000000000 | 0.19549012367504126 |
| 1ae2998000000000 | 0.3373452974230604  |
| 1ae29a8000000000 | 0.9218176408795662  |
| 1ae2988000000000 | 0.23470692356446143 |

[Back to table of contents](../README.md)
