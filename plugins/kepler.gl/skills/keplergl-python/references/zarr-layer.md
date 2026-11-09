# Zarr Layer

Import a store through **Add Data → Tilesets → Zarr**, then reuse its exported
dataset descriptor with layer `type: 'zarr'`. Preserve metadata instead of
fabricating raster rows or full variable metadata in a Python DataFrame.

Select the variable, pinned dimensions, and timeline axis in the layer panel.
Numeric/categorical dimensions are playable; forecast reference and lead time
can combine into valid time. Use Zarr axis controls instead of a table time
filter. Saved `visConfig` keys include `zarrVariable`, `dimensionIndexes`,
`zarrAxis`, `zarrFrame`, and `rescale` (in the variable's units).

Exports retain the store URL and settings, not the remote raster data.
Metadata is fetched again on load, so the store must remain accessible and
allow browser requests through CORS.
