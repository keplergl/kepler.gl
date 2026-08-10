# US boundaries

Fetch US state, county, or zipcode boundary polygons and visualize them on the map.

## When to use

Use this skill when the user wants to load US administrative boundaries (states, counties, zipcodes) onto the map — e.g. "show the boundary of California", "get the counties of Texas", "map these NYC zipcodes".

## Workflow

1. Call `executeApi` with `commandId: "geo.us-boundary"` and `input: { type, ids, outputDatasetName? }`:
   - `type: "state"` — `ids` are lowercase state names (e.g. `["california", "texas"]`).
   - `type: "county"` — `ids` are 5-digit county FIPS codes (e.g. `["06037"]` for Los Angeles County, CA).
   - `type: "zipcode"` — `ids` are 5-digit zipcodes (e.g. `["10001", "10002"]`). Enumerate the zipcodes from your own knowledge — do not ask the user for a list.
2. The command fetches the boundaries from public GitHub datasets and saves them as a new dataset.
3. Visualize the boundaries on the map using `executeApi` with `commandId: "map.add-layer"` and `input: { datasetName, layerType: "geojson", geometryColumn: "_geojson", colorBy?, colorType?, colorMap? }`.

## Rules

- For zipcodes, enumerate the zipcodes yourself (e.g. "10001, 10002, 10003" for NYC) — do not ask the user to provide them.
- County FIPS codes are 5 digits; the first 2 digits are the state code.
- State names must be lowercase (e.g. "california", not "California").
- After fetching, always add a layer so the boundaries are visible on the map.
