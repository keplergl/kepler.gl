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

## Annotation backgrounds

Text, Point, Arrow, Circle, and Ruler annotations all have a collapsible **Background** group. Its inline header switch enables the label background; color, opacity, and padding controls appear inside. Enabling the background and expanding the group are independent actions. When switched off, an expanded group keeps its controls visible but greyed out and disabled.

## Point elevation callouts

Select a **Point** annotation and enable the inline switch in the **Elevation** group header. Expand the group to configure the callout. New callouts show **Map height**: the picked marker height in metres above the map's zero plane. Drag the anchor to update the height. A two-coordinate anchor is at map zero. This is a drawing height, not an automatically measured altitude or height above terrain; shifted or exaggerated layers also shift this value.

The **Elevation** group keeps the map-height setup to five controls:

- **Map height (m)** edits the marker height to at most three decimal places. Its vertical guide ends at map zero.
- **Label units** selects metres, kilometres, or feet.
- **Decimals** offers zero to three decimal places.
- **Vertical guide** selects no guide, a solid line, or a dashed line.
- **Marker style** selects no marker, a dot, or a ring.

Switching elevation off leaves these controls visible but greyed out and disabled while the group is expanded. An optional caption shares its typography and background with the elevation label. The separate **Background** group above **Elevation** remains available with elevation disabled.

**Manual value** and **Data field** setup is available through MCP/AI. Existing measured callouts keep their configuration and expose only label units, decimals, guide, and marker controls. The map-height editor is hidden for measured callouts so the drawing height cannot be confused with the measurement.

Through MCP/AI, you can configure:

- A manual measured value, its units, and height reference (`elevation.value`, `unit`, and `datum`). `MSL` means sea level; leave `datum` as `unknown` if it is not known.
- A dataset and numeric field (`elevation.field`). Drag the anchor onto a feature to capture the field value independently of its drawing position. Data/filter changes do not refresh the captured value; dragging the anchor does. A missed pick or missing/non-numeric value clears it. Aggregated bins cannot supply a measurement.
- A known ground elevation and height reference (`elevation.reference`), and whether to show elevation, height above the reference, or both (`elevation.display`). Ground is not detected automatically. Comparisons require matching, known height references. An optional `reference.displayZ` sets the ground drawing height; otherwise it defaults to the reference elevation converted to metres.

For the lightning example, ask the AI to configure a measured elevation of `7448.36 m`, a ground reference of `990 m`, both relative to `MSL`, and to display both values in kilometres with two decimals. The labels read **7.45 km above sea level** and **6.46 km above reference**. The marker can have a separate drawing height, such as `9000 m`; map-height mode would instead label **9.00 km above map zero**.

Missing measurements and unknown/mismatched height references remain explicit. Negative values keep their sign, and differences are calculated before rounding. Guides stay at the anchor's longitude and latitude as the camera moves; globe-occluded reference points are hidden.

Saved maps retain their selected source mode, measurements, reference, and styling. Existing callouts without a source mode retain measured-value behavior. Map-height mode leaves saved measurement settings intact but ignores them until a measured source is selected through MCP/AI. Both modes use the shared renderer for HTML export, native previews, and recordings. MCP supports `elevation.source: "map"` for anchor height and `"measurement"` for captured values; omission preserves existing behavior, partial updates retain other settings, and `elevation: null` removes the callout. Terrain sampling uses a loaded basemap DEM when requested through MCP/AI.

### Terrain references

Through MCP/AI, set `elevation.source` to `measurement` and `elevation.reference` to `{"source":"terrain","datum":"MSL"}` (substitute the actual DEM datum, or `unknown` when it is not established). Set `display` to `relative` or `both` for height above terrain. This samples the loaded basemap DEM at the anchor; it does not enable terrain or download a new elevation dataset.

The sample stores the unexaggerated height in metres, the terrain's exaggerated drawing height, its geographic footprint, and DEM source ID. Camera changes and save/reopen retain that snapshot. Moving the anchor horizontally invalidates it and captures at the new position when tiles are available. Reapplying the terrain reference through MCP explicitly refreshes it. Changing only the anchor's drawing height or label styling preserves the sample.

Missing tiles, unsupported terrain APIs, or a missing DEM leave **Ground reference unavailable**, with no relative measurement or guide. Unknown or incompatible datums also prevent relative measurements. An annotation assigned to a split-map pane samples that pane; an unassigned annotation samples the primary pane. Native exports use saved samples and do not query terrain again.

MapLibre sampling checks for a real covering DEM tile before reading its raw elevation, avoiding the synthetic zero returned for missing tiles and the camera-relative query used by MapLibre 4. This guarded adapter depends on the installed terrain API; unsupported versions fail as unavailable. Mapbox hosts with terrain-query support are sampled with exaggeration disabled; older Mapbox versions without that API remain unavailable.

## Vertical scales (MCP/AI)

Use a Point annotation's `verticalScale` to draw a geographic vertical axis with signed labels. Setup is available through MCP/AI; the settings panel keeps its existing controls. Scales use the annotation's line color/width, typography, label background, visibility, and zoom fades. A caption and elevation callout are optional.

For example, `map.add-annotation` can create a scale for values from −1 to +1 km, drawn from 0 to 6000 metres to match a shifted, exaggerated layer:

```json
{
  "id": "height-scale",
  "kind": "point",
  "anchorPoint": [-101.830429, 33.518337],
  "verticalScale": {
    "min": -1,
    "max": 1,
    "tickSpacing": 1,
    "unit": "km",
    "precision": 2,
    "displayMin": 0,
    "displayMax": 6000
  },
  "fontSize": 18
}
```

The labels are **−1.00 km**, **0.00 km**, and **1.00 km**, drawn at 0, 3000, and 6000 metres. Without `displayMin` and `displayMax`, drawing heights are the labelled values converted to metres. Supply both drawing bounds together, with the upper bound greater than the lower. The anchor's longitude/latitude positions the scale; its Z does not offset the configured range. This axis does not change layer heights or infer a vertical datum.

`unit` supports `m`, `km`, and `ft`; `precision` supports zero to six decimal places. The range must increase and spacing must be positive, with at most 101 ticks. Both endpoints are included even when spacing does not divide the range exactly. Labels stay screen-aligned and crowded labels are hidden at low pitch/zoom. Globe-occluded ticks and segments are hidden.

Partial `map.update-annotation` patches preserve other scale settings. Set `verticalScale` to `null` to remove it; retain a caption, readout, or elevation callout if keeping the Point annotation. Changing annotation type removes the scale. Duplication, saved maps, HTML export, native previews, and recordings preserve its configuration and use the shared renderer. Use a kepler.gl version with vertical-scale support when reopening exports.

[Back to table of contents](README.md)
