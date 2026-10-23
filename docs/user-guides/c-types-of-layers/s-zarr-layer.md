# Zarr Layer (experimental)

Zarr layers display raster slices from remote Zarr stores, including weather forecasts and climate datasets. The layer loads chunks for the current viewport and selected dimensions.

## Application flag

Zarr is enabled by default. The demo app also explicitly enables it in its startup defaults. To hide Zarr from **Add Data → Tilesets** and both layer type pickers, configure your application before mounting kepler.gl:

```js
import {initApplicationConfig} from '@kepler.gl/utils';

initApplicationConfig({enableZarrLayer: false});
```

Set `enableZarrLayer: true` to enable these controls. The flag controls the UI for adding layers; it does not prevent saved or programmatically supplied Zarr layers from rendering, and it does not remove Zarr code from a bundle.

For the demo app, put `{"applicationConfig": {"enableZarrLayer": false}}` in its runtime `config.json`. This overrides the demo default. See [demo runtime configuration](../../../examples/demo-app/README.md#optional-runtime-configjson).

## Add and configure a layer

1. Open **Add Data → Tilesets → Zarr**.
2. Enter a public Zarr store URL or choose the CMIP6, ECMWF IFS, or NOAA HRRR example.
3. Wait for the metadata summary, then click **Add Tileset**.
4. Choose the variable in the layer configurator. Adjust its color range, opacity, and pinned dimensions.
5. Choose a timeline axis to step through a dimension. Numeric and categorical coordinates are supported; recognized time coordinates can also use the shared timeline. Forecast coordinates can combine reference time and lead time into valid time.

The store must allow browser requests through CORS. Metadata loading in Add Data times out after 30 seconds. Closing the modal, changing the URL, or switching tileset tabs cancels the pending request.

## Saved maps

JSON and HTML exports save the store URL, default variable, and attribution instead of embedding the full variable metadata and coordinate lists. Layer settings retain the selected variable, timeline axis, frame, pinned dimensions, and color range.

Opening an export fetches the metadata again, so the store must remain accessible. This keeps exports small but does not reduce the metadata download required on reload. Older maps with embedded Zarr metadata remain supported.
