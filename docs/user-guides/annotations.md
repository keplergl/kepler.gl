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
<!-- /TOC -->

## Open the annotations panel

Click the **Annotations** button in the map controls. Its tooltip reads **Show annotations** when the panel is closed.

Keep the panel open to edit annotations. Closing it hides editing handles while leaving visible annotations on the map.

Each annotation's settings start with five type icons: **Text**, **Point**, **Arrow**, **Circle**, and **Ruler**. Click an icon to switch the annotation's type. The active type is highlighted; hover over an icon to see its name.

## Create a ruler

1. Click **Add** in the Annotations panel. A point annotation appears at the map center.
2. In the annotation's settings, click the **Ruler** icon, the last of the five type icons. If the settings are collapsed, click its entry in the panel to expand them.
3. Drag the circular handle at either end of the line to set the measured span. Each handle moves its own endpoint.
4. Use **Line Width** and **Color** to style the ruler.

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

[Back to table of contents](README.md)
