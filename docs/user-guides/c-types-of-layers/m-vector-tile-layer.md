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

[Back to layer overview](./README.md)
