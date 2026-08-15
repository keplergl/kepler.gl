# Draw on Map

<!-- TOC -->
  - [Open the drawing tools](#open-the-drawing-tools)
  - [Drawing tools](#drawing-tools)
  - [Select, move, and edit](#select-move-and-edit)
  - [Edit properties](#edit-properties)
  - [Filter layers](#filter-layers)
  - [Copy and convert to a layer](#copy-and-convert-to-a-layer)
<!-- /TOC -->

Draw on Map lets you sketch points, lines, polygons, and rectangles on the map. Sketches stay on the map until you delete them, convert them to a layer, or use a polygon or rectangle as a spatial filter.

## Open the drawing tools

Click the **Draw on Map** button in the map controls (top right of the map). A menu of drawing tools appears.

Press **Escape** while a draw tool is active to return to **Select**.

## Drawing tools

| Tool | How to draw | Notes |
| --- | --- | --- |
| **Select** | Click a sketch to select it | Move and edit existing sketches |
| **Point** | Click the map | Stays in point mode so you can add several points |
| **Line** | Click to add vertices, double-click or press **Enter** to finish | Stays in line mode so you can draw several lines |
| **Polygon** | Click to add vertices, click the first vertex (or double-click) to close | Sketch only until you apply it as a filter |
| **Rectangle** | Click and drag, or click two opposite corners | Applied as a polygon filter when you finish drawing |

## Select, move, and edit

1. Choose **Select**, then click a sketch.
2. Drag a **point** to move it.
3. Drag the **body of a line** to move the whole line. Drag a vertex to reshape it. Click the line to insert a vertex.
4. Drag the **interior of a polygon or rectangle** to move it. Drag a vertex to reshape it.

Right-click a selected sketch for **Edit Properties**, **Copy Geometry**, and **Delete**. **Filter Layers** appears only for polygons and rectangles.

## Edit properties

Right-click a sketch and choose **Edit Properties** to add, change, or remove name/value pairs. These are stored as GeoJSON properties and become columns when you convert sketches to a layer.

## Filter layers

Polygons and rectangles can filter other layers so that only features inside the shape remain visible.

- **Rectangle** becomes a filter as soon as you finish drawing it.
- **Polygon** stays a sketch until you right-click it and choose **Filter Layers**, then pick the layers to filter.

Filtered shapes use a dashed outline. A filter icon appears on the shape; click it to select the filter.

Points and lines cannot be used as filters.

If you turn off every filtered layer, the polygon returns to a sketch.

## Copy and convert to a layer

The drawing menu also includes:

- **Copy all** — copies every sketch as a GeoJSON FeatureCollection.
- **Convert to Layer** — turns the sketches into a GeoJSON dataset and layer named `Drawn Geometry` plus a number, then clears the sketches.

[Back to table of contents](README.md)
