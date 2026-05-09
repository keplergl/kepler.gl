# Widget API

## `KeplerGl()`

Create a kepler.gl map widget.

### Parameters

- __`height`__ `int` _optional_ default: `400`

    Height of the map display in pixels.

- __`data`__ `dict` _optional_

    Datasets as a dictionary, key is the name of the dataset. Read more on [Accepted data formats](data-formats.md).

- __`use_arrow`__ `bool` _optional_ default: `False`

    Allow load and render data faster using GeoArrow.

- __`config`__ `dict` _optional_

    Map config as a dictionary. The `dataId` in the layer and filter settings should match the `name` of the dataset they are created under.

- __`show_docs`__ `bool` _optional_

    Deprecated, kept for backward compatibility.

- __`theme`__ `str` _optional_ default: `""`

    UI theme for the map. Accepted values are `"light"`, `"dark"`, `"base"`, or `""` (default dark theme). See [Map Customization](map-customization.md) for details.

- __`app_name`__ `str` _optional_ default: `"kepler.gl"`

    Application name shown in the side panel header and used as the HTML `<title>` when exporting. See [Map Customization](map-customization.md) for details.

### Examples

```python
# Load an empty map
from keplergl import KeplerGl
map_1 = KeplerGl()
map_1
```

![empty map][empty_map]

You can also create the map and pass in the data or data and config at the same time. Follow the instruction to [match config with data](config.md#match-config-with-data).

```python
# Load a map with data and config and height
from keplergl import KeplerGl
map_2 = KeplerGl(height=400, data={"data_1": my_df}, config=config)
map_2
```

![Load map with data and config][load_map_w_data]

---

## `.add_data()`

Add data to an existing map.

### Parameters

- __`data`__ _required_ CSV, GeoJSON or DataFrame. Read more on [Accepted data formats](data-formats.md).
- __`name`__ _required_ Name of the data entry.
- __`use_arrow`__ _optional_ Allow load and render data faster using GeoArrow.

`name` of the dataset will be saved to the `dataId` property of each `layer`, `filter` and `interactionConfig` in the config.

kepler.gl expects the data to be **CSV**, **GeoJSON**, **DataFrame** or **GeoDataFrame**. You can call `add_data` multiple times to add multiple datasets to kepler.gl.

```python
# DataFrame
df = pd.read_csv('hex-data.csv')
map_1.add_data(data=df, name='data_1')

# CSV
with open('csv-data.csv', 'r') as f:
    csvData = f.read()
map_1.add_data(data=csvData, name='data_2')

# GeoJSON as string
with open('sf_zip_geo.json', 'r') as f:
    geojson = f.read()

map_1.add_data(data=geojson, name='geojson')
```

![Add data to map][map_add_data]

---

## `.data`

Print the current data added to the map. Returns a `dict`.

```python
map_1.data
# {'data_1': 'hex_id,value\n89283082c2fffff,64\n8928308288fffff,73\n89283082c07ffff,65\n89283082817ffff,74\n89283082c3bffff,66\n8...`,
#  'data_2': 'location, lat, lng, name\n..',
#  'data_3': '{"type": "FeatureCollection...'}
```

[empty_map]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_empty_map.png
[load_map_w_data]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_widget.png
[map_add_data]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_add_data.png
