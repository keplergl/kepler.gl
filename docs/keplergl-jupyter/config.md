# Save and Load Config

## `.config`

You can print your current map configuration at any time in the notebook.

```python
map_1.config
## {'config': {'mapState': {'bearing': 2.6192893401015205,
#   'dragRotate': True,
#   'isSplit': False,
#   'latitude': 37.76209132041332,
#   'longitude': -122.42590232651203,
```

When the map is final, you can copy this config and load it later to reproduce the same map. Follow the instruction to [match config with data](#match-config-with-data).

### Apply config to a map

1. Directly apply config to the map.

```python
config = {
    'version': 'v1',
    'config': {
        'mapState': {
            'latitude': 37.76209132041332,
            'longitude': -122.42590232651203,
            'zoom': 12.32053899007826
        },
        # ...other config options
    }
}
map_1.add_data(data=df, name='data_1')
map_1.config = config
```

2. Load it when creating the map.

```python
map_1 = KeplerGl(height=400, data={'data_1': my_df}, config=config)
```

If you want to load the map next time with this saved config, the easiest way is to save it to a file and use the magic command **%run** to load it without cluttering up your notebook.

```python
# Save map_1 config to a file
with open('hex_config.py', 'w') as f:
   f.write('config = {}'.format(map_1.config))

# load the config
%run hex_config.py
```

## Match config with data

All layers, filters and tooltips are associated with a specific dataset. Therefore the `data` and `config` in the map have to be able to match each other. The `name` of the dataset is assigned to:

- `dataId` of `layer.config`,
- `dataId` of `filter`
- key in `interactionConfig.tooltip.fieldToShow`.

![Connect data and config][connect_data_config]

You can use the same config on another dataset with the same name and schema.

[connect_data_config]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/jupyter_connect_data_w_config.png
