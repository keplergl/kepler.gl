# Effects

Kepler.gl provides a collection of visual effects that can be applied to your map as post-processing passes. Effects range from lighting and atmospheric simulation to artistic color grading and blur filters. Each effect is configurable through its own set of parameters.

You can add an effect from the **Effects** panel in the side bar. Multiple effects can be stacked and reordered; they are applied in order from top to bottom.

> **Limitation:** Only one Light & Shadow effect and one fog effect (either Distance Fog or Surface Fog) can be active at a time.

---

## Table of contents

- [Light & Shadow](#light--shadow)
- [Ink](#ink)
- [Brightness & Contrast](#brightness--contrast)
- [Hue & Saturation](#hue--saturation)
- [Vibrance](#vibrance)
- [Sepia](#sepia)
- [Dot Screen](#dot-screen)
- [Color Halftone](#color-halftone)
- [Noise](#noise)
- [Blur (Triangle)](#blur-triangle)
- [Blur (Zoom)](#blur-zoom)
- [Blur (Tilt Shift)](#blur-tilt-shift)
- [Edge Work](#edge-work)
- [Vignette](#vignette)
- [Magnify](#magnify)
- [Hexagonal Pixelate](#hexagonal-pixelate)
- [Distance Fog](#distance-fog)
- [Surface Fog](#surface-fog)

---

## Light & Shadow

Simulates realistic sun lighting and shadow casting based on time of day and geographic location. Useful for visualizing how sunlight and shadows interact with 3D buildings or extruded layers throughout the day.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| timestamp | number | 0 – MAX | — | The point in time used to compute sun position. Controlled via the date/time picker and timezone selector in the UI. |
| shadowIntensity | number | 0 – 1 | 0.5 | Opacity of cast shadows. `0` means invisible shadows, `1` means fully opaque black shadows. |
| sunLightIntensity | number | 0 – 1 | 1 | Brightness of the directional sun light. Higher values produce stronger highlights on illuminated surfaces. |
| ambientLightIntensity | number | 0 – 1 | 1 | Brightness of the non-directional ambient fill light. Raising this reduces the overall contrast between lit and shadowed areas. |
| shadowColor | color | 0 – 255 per channel | `[0, 0, 0]` (black) | The RGB color tint applied to shadow regions. |
| sunLightColor | color | 0 – 255 per channel | `[255, 255, 255]` (white) | The RGB color of the directional sun light. Use warm tones (e.g. orange) to simulate sunrise/sunset. |
| ambientLightColor | color | 0 – 255 per channel | `[255, 255, 255]` (white) | The RGB color of the ambient fill light. |

---

## Ink

Applies an ink-wash artistic style that darkens edges and creates a hand-drawn, pen-and-ink appearance. Works well for stylized or illustrative map presentations.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| strength | number | 0 – 1 | 0 | Intensity of the ink effect. `0` leaves the image unchanged; `1` applies the strongest ink wash. |

---

## Brightness & Contrast

Adjusts the overall brightness and contrast of the map. A simple but powerful way to correct exposure or create high-contrast or washed-out looks.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| brightness | number | -1 – 1 | 0 | Shifts the luminance of every pixel. Negative values darken the image; positive values brighten it. |
| contrast | number | -1 – 1 | 0 | Adjusts the tonal range. Negative values flatten the image toward mid-gray; positive values push darks darker and lights lighter. |

---

## Hue & Saturation

Shifts the color hue and adjusts saturation across the entire map. Useful for creating color themes, correcting white balance, or completely desaturating the view.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| hue | number | -1 – 1 | 0 | Rotates all colors around the color wheel. `-1` and `1` both represent a full 180° rotation; `0` is unchanged. |
| saturation | number | -1 – 1 | 0.25 | Controls color intensity. `-1` produces a fully grayscale image; positive values make colors more vivid. |

---

## Vibrance

Selectively boosts the intensity of muted colors without oversaturating already vivid ones. Produces a more natural-looking color enhancement compared to uniform saturation.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| amount | number | -1 – 1 | 0.5 | Strength of the vibrance adjustment. Positive values boost muted colors; negative values desaturate them. |

---

## Sepia

Applies a warm brownish tone reminiscent of aged photographs. Useful for giving the map a vintage or historical aesthetic.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| amount | number | 0 – 1 | 0 | Blend factor between the original image and the sepia-toned version. `0` is unchanged; `1` is fully sepia. |

---

## Dot Screen

Converts the image into a pattern of monochrome dots, resembling classic newspaper halftone printing. Creates a pop-art or retro printed look.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| angle | number | 0 – π/2 | 0 | Rotation angle of the dot grid in radians. |
| size | number | 1 – 20 | 1 | Diameter of each dot in pixels. Larger values produce coarser patterns. |
| center | array [x, y] | 0 – 1 each | `[0.5, 0.5]` | Normalized screen position of the pattern origin. `[0, 0]` is the top-left corner; `[1, 1]` is the bottom-right. |

---

## Color Halftone

Simulates CMYK color halftone printing with separate dot patterns for each color channel. Each channel is rendered at a slightly different angle, mimicking the look of commercial print media.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| angle | number | 0 – π/2 | 0 | Base rotation angle for the halftone dot grids. |
| size | number | 1 – 20 | 1 | Diameter of each color dot in pixels. |
| center | array [x, y] | 0 – 1 each | `[0.5, 0.5]` | Normalized screen position of the pattern origin. |

---

## Noise

Adds random film-grain style noise uniformly across the map. Useful for a textured analog aesthetic, adding visual warmth, or reducing visible color banding in gradients.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| amount | number | 0 – 1 | 0 | Intensity of the noise. `0` adds no noise; `1` applies heavy grain. |

---

## Blur (Triangle)

Applies a smooth Gaussian-like blur uniformly across the entire map. The triangle filter is a fast approximation of a Gaussian blur.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| radius | number | 0 – 100 | 0 | Blur radius in pixels. Higher values produce a stronger, softer blur. |

---

## Blur (Zoom)

Creates a radial motion blur that emanates outward from a center point, simulating a camera zoom or dolly effect. Focuses attention on the center while blurring the periphery.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| strength | number | 0 – 1 | 0.05 | Intensity of the zoom blur. Higher values stretch pixels more along radial lines. |
| center | array [x, y] | 0 – 1 each | `[0.5, 0.5]` | Normalized screen position of the zoom origin. |

---

## Blur (Tilt Shift)

Simulates a tilt-shift lens effect that keeps a focal band in sharp focus while progressively blurring areas outside it. Creates an appealing miniature-model or diorama look, especially effective with overhead city views.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| blurRadius | number | 0 – 50 | 0 | Maximum blur radius in pixels applied to out-of-focus areas. |
| gradientRadius | number | 0 – 400 | 0 | Size of the transition zone between sharp and blurred regions, in pixels. |
| start | array [x, y] | 0 – 1 each | `[0.0, 0.0]` | Normalized screen position marking one end of the focal band. |
| end | array [x, y] | 0 – 1 each | `[1.0, 1.0]` | Normalized screen position marking the other end of the focal band. |

---

## Edge Work

Highlights structural edges in the image using an artistic charcoal-sketch style. Renders the map as white edges on a black background, useful for creating line-art representations or emphasizing structural patterns.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| radius | number | 1 – 50 | 1 | Detection radius for edge extraction. Larger values produce thicker, bolder edges while capturing more coarse detail. |

---

## Vignette

Darkens the corners and edges of the map, drawing the viewer's focus toward the center. A classic photographic technique for framing content.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| amount | number | 0 – 1 | 0 | Strength of the darkening at the edges. `0` is no vignette; `1` is maximum darkening. |
| radius | number | 0 – 1 | 0 | Size of the clear (unaffected) area at the center, as a fraction of the viewport. `0` starts darkening from the very center; `1` produces almost no visible vignette. |

---

## Magnify

Creates a circular magnifying-glass overlay at a configurable screen position. Everything inside the circle is rendered at a higher zoom level, allowing detailed inspection of a specific area without losing the surrounding context.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| screenXY | array [x, y] | 0 – 1 each | `[0.5, 0.5]` | Normalized screen position of the magnifying glass center. |
| radiusPixels | number | 10 – 500 | 10 | Radius of the magnifying lens in pixels. |
| zoom | number | 0.5 – 50 | 0.5 | Magnification factor inside the lens. Values above 1 zoom in; values below 1 zoom out. |
| borderWidthPixels | number | 0 – 50 | 3 | Width of the circular border around the lens, in pixels. Set to 0 for no border. |

---

## Hexagonal Pixelate

Replaces the image with a grid of hexagonal tiles, each filled with the average color of the area it covers. Creates a mosaic or stained-glass-window aesthetic.

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| scale | number | 1 – 50 | 20 | Size of each hexagonal tile in pixels. Larger values produce coarser, more abstract mosaics. |

---

## Distance Fog

Fades distant objects into a fog color based on their depth from the camera. Enhances the perception of depth and distance, and can be used to de-emphasize background layers or create atmospheric haze. Requires a 3D view (pitch > 0).

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| density | number | 0 – 1 | 0.5 | Overall opacity of the fog. `0` is invisible; `1` is fully opaque at maximum distance. |
| fogStart | number | 0 – 1 | 0.3 | Normalized depth at which the fog begins to appear. `0` starts the fog at the camera; `1` pushes it to the far plane. |
| fogRange | number | 0.01 – 1 | 0.5 | Normalized depth range over which the fog ramps from transparent to fully dense. Smaller values create a sharper transition. |
| fogColor | color | 0 – 255 per channel | `[217, 222, 230]` (light blue-gray) | The RGB color of the fog. |

---

## Surface Fog

Renders a fog layer at a specific elevation above the terrain surface. Unlike distance fog, surface fog stays at a fixed altitude and is visible from all camera angles. Useful for simulating low-lying clouds, ground mist, or valley fog. Requires a 3D view (pitch > 0).

| Parameter | Type | Range | Default | Description |
| --- | --- | --- | --- | --- |
| density | number | 0 – 1 | 0.6 | Overall opacity of the fog. `0` is fully transparent; `1` is fully opaque. |
| height | number | -200 – 3000 | 50 | Elevation in meters at which the center of the fog band sits above the terrain surface. Negative values place the fog below sea level. |
| thickness | number | 0 – 1000 | 50 | Vertical transition distance in meters. Controls how quickly the fog fades above and below the center elevation. Larger values produce a softer, thicker fog band. |
| fogColor | color | 0 – 255 per channel | `[230, 235, 242]` (light gray-blue) | The RGB color of the fog. |
| pattern | checkbox | on / off | off | When enabled, applies a procedural noise pattern to the fog density, creating a more natural, cloud-like appearance instead of a uniform flat layer. |

---

[Back to table of contents](README.md)
