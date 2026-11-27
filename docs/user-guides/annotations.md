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

Select a **Point** annotation and enable **Show elevation**. The elevation label uses the same rich-text font, color, alignment, and optional background as the annotation caption. You can leave the caption empty.

- **Manual** source: enter the source altitude, its units (`m`, `km`, or `ft`), and a named vertical datum such as `MSL`.
- **Numeric field** source: choose the dataset and field, then drag the annotation anchor onto a pickable feature from that dataset. This captures the field value and the feature's drawing position separately. The value stays fixed when data or filters change; drag the anchor again to refresh it. Missing/non-numeric values and aggregated bins cannot supply an altitude.
- **Anchor height (m)** controls where the marker is drawn. Changing the source value does not move the marker. This distinction preserves signed measurements when a layer uses shifted or exaggerated display heights.
- **Known elevation** supplies the reference altitude, units, and datum. Both datums must match and be known before a relative height or guide is shown. A reference at zero must be entered explicitly. Automatic terrain lookup is not supported yet.
- **Reference draw height (m)** defaults to the reference altitude converted to metres. Set it separately when the map uses a shifted display floor. An explicit draw height remains fixed when the measured reference changes.
- Choose source altitude, height above the reference, or both; choose label units and decimal precision. The vertical guide can be hidden, solid, or dashed, and its endpoint marker can be hidden, a dot, or a ring.

For the lightning example, set the anchor to `[-101.830429, 33.518337, 7448.36]`, source altitude to `7448.36 m MSL`, and reference to `990 m MSL`. With **Both**, kilometres, and two decimals, the labels read **7.45 km above sea level** and **6.46 km above reference**. The guide joins the two heights at the same longitude and latitude as the camera tilts or rotates.

Unavailable references are reported explicitly; they are never treated as zero. Negative measurements retain their sign. Source and reference heights are subtracted before rounding. On a globe, a guide whose reference is hidden behind the planet is omitted while an elevated marker can remain visible.

The captured value, source field, units, datum, reference, formatting, and guide settings survive JSON save/load and HTML export and use the shared annotation renderer in native video previews and recordings. Older versions ignore the optional elevation settings and retain the ordinary Point annotation. MCP's `map.add-annotation`, `map.update-annotation`, and `map.get-annotations` expose an `elevation` object with these settings. MCP values are captured values, not live dataset lookups; an update can change individual elevation settings, and `elevation: null` removes the callout.

[Back to table of contents](README.md)
