# Recent map features

Read the sections needed for the requested feature. These instructions describe
the current kepler.gl source; availability depends on the running JavaScript
bundle and the host's tools, not just on installing this skill.

## Runtime and tool support

- Inspect the connected host's tools and schemas before issuing commands.
  `map.add-layer` currently accepts point, flow, flowField, arc, line, grid,
  hexagon, geojson, cluster, heatmap, h3, trip, and s2. It does not accept the
  newer layer types below or arbitrary `visConfig` settings.
- Bookmarks, camera tours, Fade on Zoom, and the layer-panel options below have
  no dedicated built-in MCP commands. Use a host's available UI or config
  editing capability within the user's request. With only the standard MCP
  commands, explain the remaining UI steps; do not invent commands or report
  an unsupported edit as completed.
- When editing saved config, merge into the existing `config.visState` and
  preserve unrelated layers, filters, and interactions. Layer definitions use
  `{id, type, config, visualChannels}`; `type` is not MCP's `layerType`.
  Use real dataset and layer IDs from the map.
- `3.3.0-alpha.19` contains Bookmarks, camera tours, Fade on Zoom, and the initial
  experimental Zarr layer. Contour, Voronoi Mosaic, point Glow/Pulse/Ripple,
  and the heatmap 3D Surface were added afterward. Use a build containing those
  changes; do not assume the published version has every feature on master.
- The Python export implementation currently pins the JavaScript CDN bundle to
  `3.3.0-alpha.18`. Check the installed exporter and the exported HTML's script
  URL before promising newer features. A Python config can describe a layer
  that its renderer does not support. `KeplerGl.save_to_html()` has no public
  `kepler_gl_version` argument. Use a compatible exporter/runtime or explain
  the release requirement; installing this skill does not upgrade that bundle.

## Bookmarks: saved camera views

1. In **Interactions → Bookmarks**, compose a view and choose **Add Bookmark**.
2. Rename or reorder bookmarks; **Update view** replaces the saved camera.
3. Enable the **Bookmarks** switch for **Go to** and the floating panel.
   Disabling the switch hides the panel without deleting the saved views.

Bookmarks store longitude, latitude, zoom, bearing, and pitch, independently
of datasets. They do not restore layers or filters. Editing/navigation require
a single Mercator map (2D or tilted 3D), not globe or split-map mode.

Saved config stores an array at `config.visState.cameraBookmarks`:

```json
[
  {
    "id": "view-downtown",
    "name": "Downtown",
    "camera": {"longitude": -122.4, "latitude": 37.78, "zoom": 12, "bearing": 0, "pitch": 45}
  }
]
```

The switch is a separate UI preference; importing bookmarks does not turn it
on. When exporting a deliberately composed initial camera from Python, use
`center_map=False` so automatic fitting does not replace that initial view.

## Fade on Zoom

In **Interactions → Fade on zoom**, add a controller, select its layers and/or
annotations, set the four zoom handles, and enable the switch. Each target can
belong to only one controller. The fade multiplies normal opacity and does not
make a hidden layer visible.

The handles are **Appear**, **Full start**, **Full end**, and **Disappear**,
corresponding to saved keys `appear`, `full`, `fade`, and `gone`. Keep them
ordered within zoom 0–24. For `[2, 4, 8, 10]`, opacity is zero at/below 2,
half at 3, full from 4 through 8, half at 9, and zero at/above 10. Coincident
inner/outer handles make an immediate transition; all four equal means always
invisible.

Example value of `config.visState.interactionConfig.zoomOpacity` (replace
`observations-layer` with an existing layer ID):

```json
{
  "id": "zoomOpacity",
  "enabled": true,
  "config": {
    "controllers": [
      {
        "id": "fade-observations",
        "layerIds": ["observations-layer"],
        "stops": {"appear": 2, "full": 4, "fade": 8, "gone": 10}
      }
    ]
  }
}
```

For annotations, select targets in the UI or preserve their exported target
IDs; do not substitute annotation names for IDs. Disabling the effect preserves
controllers. Controllers and enabled state are saved with the map.

## Location animation: camera tours versus moving data

For a fly-through between places, use **Interactions → Camera animation**.
**Add stop** captures the current view, or offers a saved bookmark when one
exists. Rename and reorder stops, use **Pick current location** to update a
stop, set hold/travel durations, then enable playback and use Play/Pause or the
time scrubber. Stops copied from bookmarks own their camera snapshots; later
bookmark edits do not update them.

`config.visState.cameraTour` contains a `stops` array. Each stop has `id`,
`name`, `camera` (the same five fields as a bookmark), `holdDurationMs`, and
`travelDurationMs`. The UI shows seconds; saved durations are milliseconds.
Travel is to the next stop and the final stop's travel duration is ignored.
Use finite, nonnegative durations. Playback ends at the last stop; Play at the
end restarts it. Manual map navigation pauses playback. Tour stops persist,
but playback position/state is transient. Tours require a single Mercator map.

A camera tour moves the view, not dataset features. For vehicles moving along
timestamped paths use a Trip layer. For events appearing over time use a time
filter; for points pulsing in place use the Point effects below. Do not create
a time filter merely to move the camera.

## Contour (`type: "contour"`, prototype)

Select **Contour** in the layer picker. Choose numeric latitude/longitude
columns, or GeoJSON representative points, then optionally select **Weight**.
With a weight, occupied cells contain the mean of finite values; without it,
they contain point counts. Null/nonfinite weights are skipped; zero and
negative weights are valid. Empty cells contain zero and affect smoothing.

For saved config, point columns are `config.columns.lat`, `lng`, and optional
`value` (the Weight field). In GeoJSON mode use `geojson`. Layer appearance
lives in `config.visConfig`: `gridResolution` (32–256, default 64), `smoothing`
(default 3 grid cells), `levels` (2–20), `colorByLevel`, `filled`, `stroked`,
and `fillOpacity`. A custom threshold range uses `customRange`, `minimum`, and
`maximum`. Use thresholds in the data's units; smoothing changes values as
well as outlines.

Contours show scalar levels or point density, not travel-time isochrones.
Filters select samples before aggregation; polygons do not clip contour
boundaries. Use regional 2D data: globe and antimeridian-crossing data are not
supported. `enableContourLayer` controls picker visibility and defaults to
true. It does not disable rendering saved contour layers.

## Zarr (`type: "zarr"`, experimental)

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

## Voronoi Mosaic (`type: "voronoi"`)

Choose **Voronoi Mosaic**, then **Point Columns** (latitude/longitude) or
**GeoJSON Centroids** (geometry). Color by a source attribute and adjust
**Cell Bounds → Bounds Padding (%)**. Each cell belongs to the nearest input
site in Web Mercator, not the nearest site by road travel time. Use the flat
map for regional exploration.

Filters rebuild cells from the retained sites, while the outer bounds remain
tied to the full dataset and padding. Coincident sites share a cell assigned
to the first retained row; invalid coordinates are skipped. In saved configs,
use `lat`/`lng` or `geojson` columns and `visConfig.boundsPadding`.
`enableVoronoiLayer` defaults to true and controls picker visibility.

## Point effects and 3D heatmaps

- **Point → Visual → Glow** adds a static halo. **Pulse / Ripple** animates
  points in place; continuous mode needs no timestamp or time filter. Both
  are off by default and can be enabled independently.
- For **Trigger → At event time**, select an **Event timestamp** and a
  **Duration (timeline seconds)**, and add/enable a time filter for the same
  dataset and timestamp field. The first matching enabled filter drives the
  effect. Without it, ordinary points remain but the event effect is inactive.
  Missing timestamps produce no effect. The filter window's end is the current
  time; pausing freezes effects and scrubbing/replay updates them. Filters can
  cut effects short; coarse time steps can skip short events.
- **Heatmap → 3D Surface** raises density into a continuous surface. Enable
  it and tilt the map; **Maximum height (m)** controls height, while shading
  and surface contours are optional. Height represents density, not terrain.
  It uses the existing weights/filters and works on the map and globe.
  Surface contours are a heatmap option, distinct from the Contour layer.

Standard MCP can create the base Point/Heatmap and the event time filter,
but these visual options require the layer panel or a supported config editor.

## Other layer choices outside the current MCP enum

Use the layer picker/config for A5 (`a5`), Geohash (`geohash`), icons (`icon`),
3D models (`3D`), and image overlays (`bitmap`). Use **Add Data → Tilesets** for
vector tiles (`vectorTile`), raster tiles (`rasterTile`), WMS (`wms`), and
3D tiles (`tile3d`). Keep exported source descriptors and their remote URLs;
do not treat these sources as ordinary point tables. A 3D model layer (`3D`)
is different from a 3D tileset (`tile3d`).
