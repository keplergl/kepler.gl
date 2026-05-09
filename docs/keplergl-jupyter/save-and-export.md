# Save and Export Map

When you click in the map and change settings, config is saved to widget state. Closing the notebook and reopening it will reload the current map. However, you need to manually select `Widgets > Save Notebook Widget State` before shutting down the kernel to make sure it will be reloaded.

![Save Widget State][save_widget_state]

## `.save_to_html()`

Export the map to a standalone HTML file.

### Parameters

- **`data`**: _optional_ A data dictionary `{"name": data}`. If not provided, will use current map data.
- **`config`**: _optional_ Map config dictionary. If not provided, will use current map config.
- **`file_name`**: _optional_ The HTML file name, default is `keplergl_map.html`.
- **`read_only`**: _optional_ If `True`, hide side panel to disable map customization.
- **`center_map`**: _optional_ If `True`, fit map bounds to the data (default: `True`).
- **`mapbox_token`**: _optional_ Mapbox access token. Required for Mapbox basemap styles (e.g. "Dark", "Muted Light"). Leave empty for free MapLibre styles.
- **`json_encoder`**: _optional_ Fallback function passed as `default` when JSON-serializing GeoDataFrame data. Defaults to `str` so that `datetime` and other non-native JSON types are converted automatically. Pass `None` to disable (will raise on non-serializable types).
- **`app_name`**: _optional_ Application name shown in the side panel header and used as HTML `<title>`. If `None`, uses the value set at widget creation (default `"kepler.gl"`).
- **`theme`**: _optional_ UI theme for the kepler.gl component (`"light"`, `"dark"`, `"base"`, or `""`). If `None`, uses the value set at widget creation.

### Examples

```python
# this will save current map
map_1.save_to_html(file_name='first_map.html')

# this will save map with provided data and config
map_1.save_to_html(data={'data_1': df}, config=config, file_name='first_map.html')

# this will save map with the interaction panel disabled
map_1.save_to_html(file_name='first_map.html', read_only=True)

# this will save map with a custom theme and app name
map_1.save_to_html(file_name='first_map.html', theme='light', app_name='My Map App')
```

## `._repr_html_()`

Generate an HTML representation of the map for embedding.

### Parameters

- **`data`**: _optional_ A data dictionary `{"name": data}`. If not provided, will use current map data.
- **`config`**: _optional_ Map config dictionary. If not provided, will use current map config.
- **`read_only`**: _optional_ If `True`, hide side panel to disable map customization.

You can directly serve the current map via a Flask app. To do that, return kepler's map HTML representation. Here is an example:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return map_1._repr_html_()

if __name__ == '__main__':
    app.run(debug=True)
```

[save_widget_state]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_save_state.png
