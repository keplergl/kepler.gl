# Map Customization

## Interact with the map

Interact with kepler.gl and customize layers and filters. Map data and config will be stored locally to the widget state. To make sure the map state is saved, select `Widgets > Save Notebook Widget State`, before shutting down the kernel.

![Map interaction][map_interaction]

## Theme

The `theme` parameter controls the visual appearance of the map UI. Accepted values:

- `"dark"` – Dark theme
- `"light"` – Light theme
- `"base"` – Base theme
- `""` (empty string) – Uses the default dark theme

```python
# Create a map with light theme
map_1 = KeplerGl(height=400, data={'data_1': df}, theme='light')
map_1
```

## App Name

The `app_name` parameter sets the application name displayed in the side panel header. It is also used as the HTML `<title>` when exporting.

```python
# Create a map with a custom app name
map_1 = KeplerGl(height=400, data={'data_1': df}, app_name='My Geospatial App')
map_1
```

Both `theme` and `app_name` can also be passed to [`save_to_html()`](save-and-export.md#save_to_html) to override the widget-level settings for the exported file:

```python
map_1.save_to_html(file_name='my_map.html', theme='light', app_name='My Map Export')
```

[map_interaction]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_custom_map.gif
