# Annotations and Rulers

Annotations add text, points, arrows, circles, and rulers to your map. You can keep multiple annotations and measurements on the same map, each with its own text, color, and visibility settings.

<!-- TOC -->

- [Open the annotations panel](#open-the-annotations-panel)
- [Create a ruler](#create-a-ruler)
- [Edit ruler labels](#edit-ruler-labels)
- [3D placement and distance](#3d-placement-and-distance)
- [Dateline and globe views](#dateline-and-globe-views)
- [Manage annotations](#manage-annotations)
- [Save and export](#save-and-export)
- [Point elevation callouts](#point-elevation-callouts)
<!-- /TOC -->

## Open the annotations panel

Click the **Annotations** button in the map controls. Its tooltip reads **Show annotations** when the panel is closed.

Keep the panel open to edit annotations. Closing it hides editing handles while leaving visible annotations on the map.

Each annotation's settings start with five type icons: **Text**, **Point**, **Arrow**, **Circle**, and **Ruler**. Click an icon to switch the annotation's type. The active type is highlighted; hover over an icon to see its name.

## Create a ruler

1. Click **Add** in the Annotations panel. A point annotation appears at the map center.
2. In the annotation's settings, click the **Ruler** icon, the last of the five type icons. If the settings are collapsed, click its entry in the panel to expand them.
3. Drag the circular handle at either end of the line to set the measured span. Each handle moves its own endpoint.
4. Drag the **Line Width** slider to choose a width from 1 to 10 pixels, and use **Color** to style the ruler. You can also focus the slider and use the arrow keys to adjust the width, or **Home** and **End** to select the minimum and maximum.

You can also right-click a map location and choose **Add Annotation**, then click the **Ruler** icon in its settings.

Repeat these steps to add more rulers. For very short rulers or coincident endpoints, the handles are spaced apart so you can reach both endpoints.

## Edit ruler labels

The **Custom Text** and **Distance** switches control the two parts of a ruler's label independently. Both are on by default.

| Custom Text | Distance | Label shown |
| --- | --- | --- |
| On | On | Your text and the calculated distance |
| On | Off | Your text |
| Off | On | The calculated distance |
| Off | Off | No label; the ruler line remains visible |

With **Custom Text** on, click the text on the map to edit it and use the formatting toolbar. The distance updates automatically as you move either endpoint.

The label stays at the midpoint between the projected endpoints. Move the endpoints to reposition a ruler; its midpoint label stays attached to the line.

## 3D placement and distance

When dragging an endpoint over a pickable 3D surface, kepler.gl uses the surface position and elevation. If no 3D surface is picked, the endpoint uses the ground plane at elevation zero.

The distance label reports **geodesic ground distance in kilometres**, rounded to two decimal places. Elevation affects where the endpoints are drawn; the reported length uses their longitude and latitude. For example, endpoints at the same longitude and latitude but different elevations have a ground distance of zero. Rulers with zero ground distance have no automatic distance label.

## Dateline and globe views

Rulers crossing the dateline use the shortest longitude span between their endpoints.

In [globe view](./m-map-settings.md#globe-view), a ruler is visible only while both endpoints are on the visible hemisphere. Rotate the globe to bring both endpoints into view if a ruler disappears.

## Manage annotations

Select an annotation in the panel to change its settings. Use its eye icon to hide or show it, the copy icon to duplicate it, or the trash icon to remove it. Duplicated rulers retain their endpoints and settings and can be edited independently.

Point, arrow, and circle annotations also have **Text Side** and **Placement** selectors for positioning their labels. Text annotations use these selectors to position text around their anchor. Rulers use a midpoint label and the two label switches instead.

Rulers follow the same visibility and fade-on-zoom settings as other annotations.

## Save and export

Use [Export Map](./k-save-and-export.md#export-map) to save or share your annotations:

- **JSON** preserves annotation types, endpoints (including elevation), rich text, styling, and label switches in the map configuration.
- **HTML** includes the ruler configuration. Editable exports support annotation editing; view-only exports display rulers with editing controls hidden.

Use a kepler.gl version that supports ruler annotations when loading or sharing saved maps.

## Point elevation callouts

Select a **Point** annotation and enable **Show elevation**. New callouts show **Map height**: the picked marker height in metres above the map's zero plane. Drag the anchor to update the height. A two-coordinate anchor is at map zero. This is a drawing height, not an automatically measured altitude or height above terrain; shifted or exaggerated layers also shift this value.

The main controls are **Value to display**, **Label units**, and a live **Label preview**. An optional caption shares its typography and background with the elevation label.

- **Map height** follows the anchor and draws its vertical guide to map zero. It needs no source value, datum, or ground elevation.
- **Manual value** lets you enter a measured elevation and its units. The measurement stays independent of the marker's drawing height; switching from Map height never invents a measurement from it.
- **Data field** lets you select a dataset, numeric field, and measurement units. Drag the anchor onto a feature to capture the field value independently of its drawing position. Data/filter changes do not refresh the captured value; dragging the anchor does. A missed pick or missing/non-numeric value clears it. Aggregated bins cannot supply a measurement.
- **Compare with ground**, available for measured values, reveals the known ground elevation, its units, and whether to show the elevation, height above ground, or both. Ground is not detected automatically. Use matching, known height references in **Advanced** before comparing.
- **Advanced** contains **Marker height (m)**, plus height references (**Measured from** and **Ground measured from**) and an optional ground drawing height for measured callouts. `MSL` means sea level; leave the reference `unknown` if it is not known. Ground drawing height defaults to the ground elevation converted to metres.
- **Elevation appearance** contains decimal precision, vertical-guide style, and marker style. The separate **Appearance** group controls the caption background and remains available with elevation disabled.

For the lightning example, choose Manual value, enter `7448.36 m`, enable Compare with ground, and enter `990 m`. In Advanced set both height references to `MSL`. With **Both**, kilometres, and two decimals, the labels read **7.45 km above sea level** and **6.46 km above reference**. The marker can have a separate drawing height, such as `9000 m`; choosing Map height instead would label **9.00 km above map zero**.

Missing measurements and unknown/mismatched height references remain explicit. Negative values keep their sign, and differences are calculated before rounding. Guides stay at the anchor's longitude and latitude as the camera moves; globe-occluded reference points are hidden.

Saved maps retain their selected source mode, measurements, reference, and styling. Existing callouts without a source mode retain measured-value behavior. Map-height mode leaves saved measurement settings intact but ignores them until a measured source is selected. Both modes use the shared renderer for HTML export, native previews, and recordings. MCP supports `elevation.source: "map"` for anchor height and `"measurement"` for captured values; omission preserves existing behavior, partial updates retain other settings, and `elevation: null` removes the callout. Automatic terrain lookup remains unsupported.

[Back to table of contents](README.md)
