# Zarr Layer

Use saved layer `type: 'zarr'` with a compatible JavaScript renderer.

1. Open **Add Data → Tilesets → Zarr** and enter a public store URL.
2. Wait for metadata, then choose **Add Tileset**.
3. Select the variable and pinned dimensions in the layer panel; adjust its
   color range and opacity.
4. Select a timeline axis to step through a dimension. Numeric/categorical
   coordinates work; recognized time coordinates can use the shared timeline.
   Forecast reference time and lead time can combine into valid time.

Use the Zarr axis controls rather than `map.add-time-filter` on an invented
table column. `map.load-data` is not the Zarr tileset-import workflow. The
store must allow browser requests through CORS. Metadata loading in Add Data
times out after 30 seconds; changing the URL or closing the modal cancels it.

JSON/HTML exports retain the store URL, default variable, attribution, and
layer settings (selected variable, axis, frame, pinned dimensions, colors).
They do not embed the remote raster data; metadata is fetched again on load.
Preserve an exported tileset descriptor instead of fabricating CSV rows or
full variable metadata in a Python DataFrame. `enableZarrLayer` defaults to
true and controls the adding UI, not rendering saved layers.

Before exporting, check that the JavaScript bundle supports this layer; see
the export-version guidance in [the Python skill](../SKILL.md).
