# Zarr Layer

On a connected MCP map, import a store with `map.load-zarr` and create its
layer with `map.add-layer` (`layerType: "zarr"`). Python configs use layer
`type: 'zarr'` and need the remote dataset descriptor as well; a DataFrame
cannot represent the store. Preserve source metadata when reusing exports.

Set the variable, pinned dimensions, and timeline axis in `visConfig`:
`zarrVariable: "temperature"`, `dimensionIndexes: {"level": 0}`,
`zarrAxis: {"kind": "dimension", "dimension": "time"}`, and `zarrFrame: 0`.
Use names from the store's metadata.
Numeric/categorical dimensions are playable; forecast reference and lead time
can combine into valid time. Use Zarr axis controls instead of a table time
filter. Saved `visConfig` keys include `zarrVariable`, `dimensionIndexes`,
`zarrAxis`, `zarrFrame`, and `rescale` (in the variable's units).

Exports retain the store URL and settings, not the remote raster data.
Metadata is fetched again on load, so the store must remain accessible and
allow browser requests through CORS.
