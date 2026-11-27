# Interactions

<!-- TOC -->
  - [Tooltips](#tooltips)
    - [Charts in feature tooltips](#charts-in-feature-tooltips)
  - [Brushing](#brushing)
  - [Display Coordinates](#display-coordinates)
  - [Bookmarks](#bookmarks)
  - [Fade on Zoom](#fade-on-zoom)
<!-- /TOC -->

You can toggle customization options on your map, including tooltips, brush highlighting, map imagery (water, parks, etc.), and more.

![Interaction menu](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/g-interactions-0.png "Interaction menu")

To toggle customization options on your map:

1. Open the Interactions menu by clicking the Interactions icon:


2. Click the switch next to the options you wish to activate/deactivate.

Alongside **Tooltip**, **Brushing**, and **Coordinate**, use **Bookmarks** to return to saved map views and **Fade on Zoom** to control visibility by zoom level. Only one of tooltip and brushing can be on at a time.

## Tooltips
tooltip displays metrics when hovering over a data point. You can choose which fields are displayed from the tooltip config menu.

If two layers use the same dataset, expand a layer’s **Tooltip fields** settings and turn on **Use layer-specific fields** to pick and reorder fields for that layer. Turn it off to use the dataset’s settings again. An empty layer-specific list hides dataset fields; any built-in summary still appears. Layers with specialized tooltips, such as Contour and Donut, do not offer this setting.

Embedding applications can hide these controls with `initApplicationConfig({enableLayerTooltipFields: false})` from `@kepler.gl/utils`. The setting defaults to `true`; saved layer tooltip field overrides still apply when the controls are hidden.

![tooltips](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image25.png "tooltips")

  - __Image__ Image can be added to tooltip. If field name contains `<img>` and the field content contains `http` url

  |id| `<img>-tooltip` |
  |---|---|
  |1|`http://my-image.com/my-image-0.png`|
  |2|`http://my-image.com/my-image-1.png`|


  - __Web link__
Tooltip can be a clickable weblink. To add a web link as tooltip, add a url that starts with `http://` to the field content.

![tooltips](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/g-interactions-1.png "tooltips")


Tip: click a point to pin the tooltip info to the map. To unpin the tooltip, press the blue pin icon.

![pin/unpin tooltip](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image15.png "pin/unpin tooltip")


### Charts in feature tooltips

Use a tooltip chart to show the history or category breakdown of one map feature, such as readings from a monitoring station. Unlike dataset charts, tooltip charts are tied to a layer and appear below the fields in that layer's tooltip.

1. Turn on **Tooltip** in **Interactions**.
2. Open **Charts** from the map controls (**Show charts**), then click **Add** and choose **Tooltip: Time Series** or **Tooltip: Category**.
3. In the chart settings, choose the **Layer**. For a time series, set **X axis** to a timestamp and **Y axis** to the measure you want to plot, then choose an aggregation. For a category chart, choose the category under **Field**.
4. Under **Feature id field**, choose a column whose value is the same on every row for a given feature, such as a station ID. Leave it unset to chart just the picked row.
5. Hover over a feature in that layer to see its chart, or click to pin the tooltip.

For example, load this CSV as a Point layer:

```csv
station_id,lat,lng,recorded_at,temperature
north,37.79,-122.42,2026-01-01T12:00:00Z,12
south,37.73,-122.41,2026-01-01T12:00:00Z,17
north,37.79,-122.42,2026-01-02T12:00:00Z,14
```

For **Tooltip: Time Series**, set **Feature id field** to `station_id`, **X axis** to `recorded_at` with a daily **Period**, and **Y axis** to `temperature` with **Average** aggregation. Hovering over the north station charts 12 and 14 on separate days, without including the south station's reading. Matching readings come from the full layer dataset, even when map filters hide some of those readings.

## Brushing
- __Brush__: Brush allows you to highlight areas with the cursor. When brush is turned on, all layers darken. Only the portion you hover over with the cursor is illuminated. Brush works well with arc layers in particular.

Under **Brushing**, expand the settings and choose **Arc and line endpoints**. **Both** highlights the connection when either endpoint is in the brush radius. **Start** or **End** matches only that endpoint. This also applies to arrowheads and does not change brushing on point layers.

![brush](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image12.png "brush")

[Back to table of contents](README.md)


## Display Coordinates

![coordinate](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/g-interactions-2.png "coordinate")

Coordinates are hidden in tooltips by default. Turn on **Coordinates** in the Interactions panel to show the latitude and longitude as you move the pointer. Right-click an empty spot to open the context menu and choose **Copy coordinates**. This option is available whether the **Coordinates** switch is on or off, including when annotation actions are unavailable.

[Back to table of contents](README.md)


## Bookmarks

Bookmarks save the map center, zoom, bearing (rotation), and pitch (tilt). They change the camera view without restoring a separate set of layers, filters, or data. You can create bookmarks even before adding a dataset.

### Capture and manage views

1. Open **Interactions → Bookmarks** by clicking its header.
2. Pan, zoom, rotate, and tilt the map to compose a view, then click **+ Add Bookmark**.
3. Edit the name directly in the bookmark's header.

Hover over a bookmark header to reveal its controls, or use **Tab** to reach them with the keyboard:

| Control | Action |
| --- | --- |
| **Go to** | Smoothly move the map to the saved view. Bookmarks must be enabled. |
| **Copy coordinates** | Copy the saved center as `latitude, longitude` in decimal degrees, rounded to six decimal places. Copying does not move the map. Successful copying is silent; a failure displays a message. |
| **Update view** | Replace this bookmark's camera with the current map view, keeping its name and position in the list. |
| **Delete** | Remove this bookmark. |

Drag the handle at the left of a bookmark header to reorder it. The handle appears on header hover or keyboard focus. To reorder with the keyboard, focus the handle, press **Space**, use **Up/Down**, then press **Space** again to drop it. **Escape** cancels the reorder.

### Use the floating panel

Bookmarks are off by default, including when opening older configurations. Enable the **Bookmarks** switch to show saved bookmarks on the map. The panel appears once there is at least one bookmark and stays usable when the sidebar is closed. Click a bookmark row to visit its view. Its overlaid **Copy coordinates** button appears when that row is hovered or a control in the row has keyboard focus.

Click the floating panel's **×** to hide it and turn off the **Bookmarks** switch. Turn the switch on again to reopen it. Closing or disabling the panel does not delete bookmarks; you can still edit them in the sidebar. Collapsing the sidebar section is independent of this switch.

On desktop, drag the title bar labeled **Bookmarks** to move the panel. Drag either the top or bottom edge handle to resize its height. The minimum height fits the title and one bookmark; additional bookmarks remain available by scrolling. With the keyboard, focus the title bar or a resize handle, press **Space**, use the arrow keys, and press **Space** again to finish. The copy and close controls work independently of dragging.

### Saved views and supported modes

Saved map configurations retain bookmark names, order, and camera views when loaded in a version that supports Bookmarks. Configurations without bookmarks still load normally. The Bookmarks switch is a UI preference, separate from these saved views; loading views does not turn it on automatically or reset an explicitly enabled UI preference.

Bookmark editing and navigation support a single 2D or 3D Mercator map. In globe or split-map mode, the floating panel is hidden and bookmark editing is unavailable. Return to a single Mercator map to use the saved views again.

[Back to table of contents](README.md)

## Fade on Zoom

Fade on Zoom changes the opacity of selected layers and annotations as you zoom. Each controller applies one fade range to its selected targets.

1. Open **Interactions → Fade on zoom** by clicking its header or settings icon.
2. Click **+ Add controller**.
3. In **Layers and annotations**, select one or more targets. A target can belong to only one controller; remove it from its current controller before assigning it to another.
4. Adjust the four handles on the controller's graph, then turn on the **Fade on zoom** switch to apply the effect. Adding or editing a controller does not turn the switch on automatically.

### Set the zoom range

The graph runs from zoom **0** to **24**. Drag a handle horizontally to change its zoom level. The four handles stay in order; moving one past a neighbor moves that neighbor too.

| Handle | Meaning as you zoom in | Initial value |
| --- | --- | --- |
| **Appear** | The target is invisible at and below this zoom, then starts fading in. | 1 |
| **Full start** | The fade-in ends and the target reaches its normal opacity. | 3 |
| **Full end** | The target starts fading out from its normal opacity. | 8 |
| **Disappear** | The target is invisible at and above this zoom. | 12 |

Opacity changes linearly between **Appear** and **Full start**, stays at the normal value through **Full end**, then falls to zero at **Disappear**. For example, with values **2, 4, 8, 10**, zoom 3 applies half the normal opacity, zooms 4–8 use the normal opacity, and zoom 9 applies half again. Zooming out follows the same range in reverse.

When the two fade-in handles coincide, the target switches on immediately above **Appear**, provided **Disappear** is higher. When the two fade-out handles coincide, it switches off at **Disappear**. The target remains invisible at the outer boundaries. If **Appear** and **Disappear** coincide, all four handles coincide and the target stays invisible at every zoom.

Focus a handle and use the arrow keys to adjust it by **0.1** zoom levels, or hold **Shift** for steps of **1**. The vertical marker shows the current map zoom.

### Manage controllers

Use multiple controllers for groups that need different zoom ranges. Remove a target from the selector to stop applying that controller to it, or use the controller's trash icon to delete the controller. Deleting a controller leaves its layers and annotations on the map.

Turning off **Fade on zoom** keeps the controllers but stops applying their fades. Unassigned targets retain their normal appearance. For layers, the fade multiplies the existing opacity setting; it does not replace it or turn a hidden layer on. Controller targets, ranges, and the enabled state are retained in saved map configurations.

[Back to table of contents](README.md)
