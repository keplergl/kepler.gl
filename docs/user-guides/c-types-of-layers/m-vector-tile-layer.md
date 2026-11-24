# Vector Tile Layer — How to add

Follow these steps to add a Vector Tile layer (MVT or pmtiles):

1. Open Add Data → Tilesets.
2. Select Vector Tile tileset type.
3. Enter a tileset URL:
   - Mapbox Vector Tiles (MVT) template, e.g.
     `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.mvt?access_token=YOUR_TOKEN`
   - pmtiles URL, e.g. `https://your-cdn/filename.pmtiles`
4. Click Add. A new Vector Tile layer will appear in the Layers panel.
5. Style the layer (color, stroke, height, dynamic color) in the Layers panel.

Notes:

- Use Vector Tile layer for vector data in MVT/pmtiles formats. For raster pmtiles or COG/STAC imagery, use Raster Tile layer.

Example Vector Tile sources:

- US population — https://4sq-studio-public.s3.us-west-2.amazonaws.com/vector-tile/cb_v2/{z}/{x}/{y}.pbf
- New Zealand buildings — https://r2-public.protomaps.com/protomaps-sample-datasets/nz-buildings-v3.pmtiles
- US Zip Codes - https://r2-public.protomaps.com/protomaps-sample-datasets/cb_2018_us_zcta510_500k.pmtiles
- Railways — https://4sq-studio-public.s3.us-west-2.amazonaws.com/pmtiles-test/161727fe-7952-4e57-aa05-850b3086b0b2.pmtiles

## Metadata for hosted MVT tiles

For a set of Mapbox Vector Tiles (MVT), enter the `{z}/{x}/{y}.pbf` or `{z}/{x}/{y}.mvt` URL template as **Tileset URL**. Kepler.gl looks for `metadata.json` next to the zoom directories for a typical MVT URL. If your metadata is hosted elsewhere, enter its URL in **Tileset metadata URL**. Both URLs must be accessible to the browser; configure CORS if they are served from a different origin. A vector PMTiles archive carries its metadata inside the archive.

Here is a TileJSON template for a tileset with an `events` source layer. Replace the URL and use the actual source-layer name, attribute names, bounds, zoom levels, and statistics from your tiles.

```json
{
  "tilejson": "3.0.0",
  "name": "Events",
  "tiles": ["https://tiles.example.com/events/{z}/{x}/{y}.pbf"],
  "bounds": [-123, 37, -122, 38],
  "minzoom": 0,
  "maxzoom": 12,
  "vector_layers": [
    {
      "id": "events",
      "fields": {"timestamp": "Number", "category": "String", "verified": "Boolean"}
    }
  ],
  "tilestats": {
    "layers": [
      {
        "layer": "events",
        "geometry": "Point",
        "attributes": [
          {"attribute": "timestamp", "type": "number", "min": 1704067200, "max": 1704153600},
          {"attribute": "category", "type": "string", "values": ["arrival", "departure"]},
          {"attribute": "verified", "type": "boolean"}
        ]
      }
    ]
  }
}
```

`vector_layers` declares the fields. The matching Tippecanoe-style `tilestats` layer supplies the fields and their statistics when present, so include the fields you want to expose in both places. Give numeric fields finite `min` and `max` values for range filters, and provide representative `values` for categorical choices. Metadata describes the actual properties in the tiles; it does not rewrite them.

| Metadata type | Kepler.gl filter |
| --- | --- |
| `Number` (also `number`, `numeric`, `float`) | Numeric range |
| `int` or `int4` (Kepler.gl accepts these additional type hints) | Integer range |
| `String` | Categorical multiselect |
| `Boolean` (also `bool`) | Range from 0 (false) to 1 (true) |

MVT has no native date/time property type. An ordinary ISO 8601 property is a string, not a time-range field, and `date`, `time`, and `datetime` are not recognized types here. To filter raw timestamps numerically, store a numeric Unix timestamp in the tiles and declare it as `Number`, as above. Use the clock icon to expand the numeric range filter and play through its values. The slider displays numbers in your chosen unit (seconds in this example) rather than calendar dates, and it does not offer a date/time picker or time-zone controls.

[Back to layer overview](./README.md)
