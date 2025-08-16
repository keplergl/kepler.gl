# Raster Tile Layer — How to add (experimental)

Use Raster Tile layer to visualize satellite/aerial imagery from raster pmtiles or COGs via STAC metadata.

1. Open Add Data → Tilesets.
2. Select Raster Tile tileset type.
3. Paste URL to the tileset:
   - pmtiles (raster format): provide a direct HTTPS URL to a .pmtiles file containing raster imagery. Raster pmtiles don't require dedicated raster tile servers, unless you want to use elevation meshes.
   - STAC Item/Collection (COGs): provide a HTTPS URL to a STAC Item or Collection (v1.0.0+ with EO + Raster extensions). For this option you need to provide a [compatible raster tile server](https://github.com/igorDykhta/kepler-raster-server).
4. Click Add.
5. Style band selection and opacity as needed in Layers panel.

Important notes for COGs via STAC:

- The STAC Item/Collection must include EO and Raster extensions with `eo:bands` and `raster:bands` .
- COG assets must be publicly accessible over HTTPS.
- You must run your own raster tile server (e.g., TiTiler). Example implementation that supports collections and elevations: [kepler-raster-server](https://github.com/igorDykhta/kepler-raster-server).

# Elevation

To enable elevation rendering, you must provide one or more compatible raster tile servers when adding the tileset. Enter them in the "Raster tile servers" field of the Add Tileset form.

- For STAC Items/Collections: compatible raster tile servers are required.
- For raster .pmtiles: raster tile servers are optional for imagery, but required if you plan to use elevation.
- The server must expose COGs as XYZ tiles and support elevation/DEM tiles. Example implementation: [kepler-raster-server](https://github.com/igorDykhta/kepler-raster-server) (TiTiler-based).

Example Raster .pmtiles:

- Mount Whitney - https://pmtiles.io/usgs-mt-whitney-8-15-webp-512.pmtiles
- Swiss historical - https://public-bucket-for-tests.s3.us-east-1.amazonaws.com/historic-swis-18xx.pmtiles

Example STAC Items:

- Bangladesh rivers — https://4sq-studio-public.s3.us-west-2.amazonaws.com/sdk/examples/sample-data/raster/planet-skysat-opendata.json
- Antarctica ice — https://4sq-studio-public.s3.us-west-2.amazonaws.com/sdk/examples/sample-data/raster/sentinel-2-l2a.json
- Kiribati island — https://4sq-studio-public.s3.us-west-2.amazonaws.com/sdk/examples/sample-data/raster/stac-example.json

Example STAC Collections:

- sentinel-2-l1c — https://earth-search.aws.element84.com/v1/collections/sentinel-2-l1c
- modis-09A1-061 — https://planetarycomputer.microsoft.com/api/stac/v1/collections/modis-09A1-061
- landsat-c2-l1 — https://planetarycomputer.microsoft.com/api/stac/v1/collections/landsat-c2-l1

[Back to layer overview](./README.md)
