# Vector Layer

Vector layers use the three basic GIS features – lines, points, and polygons – to represent real-world features in digital format.

![Vector layer](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-vector.gif 'Vector layer')

# Settings

The following tables describe every setting in the Vector Tile layer.

## Basic

Core settings for the Vector layer.

| Setting    | Description                                  |
| ---------- | -------------------------------------------- |
| Layer Type | Must be Vector Tile to use the Vector layer. |

## Fill Color

Settings related to the fill color of the vector data.

| Setting        | Description                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Color Based On | The field to base the fill color on.                                                                                                           |
| Color Scale    | The color scale and palette for the fill color.                                                                                                |
| Dynamic Color  | Enable to estimate color range and scale based on tiles selected for rendering. When panning the map, the color scale will update dynamically. |
| Opacity        | The opacity of the fill color. 100 = fully opaque, 0 = fully transparent.                                                                      |

## Stroke Color

Settings related to the stroke/outline color of the Vector layer.

| Setting               | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| Stroke Color          | Toggle to enable stroke.                                                           |
| Stroke Color Based On | A column to base the stroke color on. When enabled, a color scale can be selected. |
| Color                 | The color or color scale to use for the stroke.                                    |
| Opacity               | The opacity of the stroke.                                                         |

## Stroke Width

Settings related to the stroke/outline width of the Vector layer.

| Setting             | Description                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Stroke Width        | Toggle to enable stroke.                                                                                                               |
| Stroke Width Slider | Slide or enter a number to select the width of the stroke/outline in pixels. When "Stroke Based On" is selected, this becomes a range. |
| Stroke Based On     | A column to base the stroke width on.                                                                                                  |
| Stroke Scale        | The method by which to scale the stroke/outline size. Choose between Linear, Sqrt, and Log.                                            |

## Height

> Note: Height only affects polygons on your map, not points.

Height settings for the Vector layer. Height is best viewed with the 3D viewing mode.

| Setting         | Description                                        |
| --------------- | -------------------------------------------------- |
| Height Slider   | Increase to raise the height of the layer objects. |
| Height Based On | A column to base the height on.                    |
| Height Scale    | Choose from linear, sqrt, and log.                 |
| Fixed Height    | Applies height without additional modifications.   |

[Back to table of contents](../README.md)
