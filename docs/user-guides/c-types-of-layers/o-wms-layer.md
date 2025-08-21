# WMS Layer — How to add (experimental)

Use WMS Layer to render imagery from OGC Web Map Service (WMS) endpoints.

1. Open Add Data → Tilesets.
2. Select WMS tileset type.
3. Enter the WMS service URL (GetCapabilities endpoint or base service URL).
4. Click Add. A new WMS layer will appear in the Layers panel.
5. In the Layers panel you can select a named layer from the service.

Notes:

- Feature info on click is supported for queryable layers (`queryable=true`).

Example WMS services:

- https://ows.terrestris.de/osm/service
- https://opengeo.ncep.noaa.gov/geoserver/conus/conus_cref_qcd/ows
- https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi
- https://geo.stadt-muenster.de/mapserv/starkregen_serv

[Back to layer overview](./README.md)
