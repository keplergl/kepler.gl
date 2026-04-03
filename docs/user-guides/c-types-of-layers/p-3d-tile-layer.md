# 3D Tile Layer — How to add (experimental)

Use the 3D Tile layer to render photogrammetry meshes, buildings, terrain and other 3D content served as [OGC 3D Tiles](https://www.ogc.org/standard/3dtiles/) or [I3S](https://www.ogc.org/standard/i3s/) tilesets.

1. Open Add Data → Tilesets.
2. Select the **3D Tile** tileset type.
3. Enter a **name** for the layer.
4. Paste the **Tileset URL** — this should point to a `tileset.json` (3D Tiles) or an I3S service endpoint.
5. If the provider requires authentication (Google or Cesium Ion), enter the **Access Token**.
6. Click **Add**. A new 3D Tile layer will appear in the Layers panel.

## Supported providers

| Provider                           | URL pattern                      | Authentication          |
| ---------------------------------- | -------------------------------- | ----------------------- |
| **OGC 3D Tiles 1.0 / 1.1**         | Any URL ending in `tileset.json` | None                    |
| **Google Photorealistic 3D Tiles** | URL containing `google`          | Google Maps API key     |
| **Cesium Ion**                     | URL containing `ion.cesium`      | Cesium Ion access token |
| **ArcGIS I3S**                     | URL containing `arcgis`          | None                    |

The provider is auto-detected from the URL. When a Google or Cesium Ion tileset is detected, an additional **Access Token** field will appear in the form.

## Layer settings

- **Opacity** — controls the transparency of the 3D tiles (0 – fully transparent, 1 – fully opaque).
- **Point Size** — adjusts the size of point-cloud content within the tileset.

## Notes

- The layer supports the **Light and Shadow** effect. For I3S tilesets that lack explicit PBR material parameters, the layer automatically patches material defaults to prevent black surfaces.
- **Zoom to layer** is supported — the layer extracts bounding volume information from the tileset and enables the zoom-to-bounds action in the layer panel.
- 3D Tile layers are **not pickable** (no tooltip on hover).

## Example tilesets

Google Photorealistic 3D Tiles (requires API key):

- `https://tile.googleapis.com/v1/3dtiles/root.json`

Cesium Ion (requires access token):

- Washington DC — `https://assets.ion.cesium.com/57588/tileset.json`
- Melbourne point cloud — `https://assets.ion.cesium.com/43978/tileset.json`
- Mount St. Helens — `https://assets.cesium.com/33301/tileset.json`

Generic OGC 3D Tiles:

- Royal Exhibition Building (point cloud) — `https://raw.githubusercontent.com/visgl/deck.gl-data/master/3d-tiles/RoyalExhibitionBuilding/tileset.json`

ArcGIS I3S:

- San Francisco Buildings — `https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0`

[Back to layer overview](./README.md)
