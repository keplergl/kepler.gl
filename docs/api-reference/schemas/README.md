# Schemas

## Saved filters (v1)

In an exported map, filters live at `config.config.visState.filters`: the outer `config` property is the versioned configuration object (`{ "version": "v1", "config": … }`). The examples below are entries in that array, not complete map configurations.

| Field                                                                                      | Saved value                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                                                                       | Unique filter ID within the map. This is not the array index used by `setFilter`.                                                                                                     |
| `dataId`                                                                                   | Array of IDs of the datasets the filter applies to. Use the dataset IDs from the map, not their display names.                                                                        |
| `name`                                                                                     | For column filters, an array of field names in the same order as `dataId`. For polygon filters, this holds the targeted layer labels; `layerId` determines which layers are filtered. |
| `type`, `value`                                                                            | Filter type and selected values. See examples below. The schema also supports `select` with a boolean value and `input` with a text value.                                            |
| `layerId`                                                                                  | Array of target layer IDs for a polygon filter. Those layers must exist and use the referenced datasets.                                                                              |
| `enabled`, `inverted`                                                                      | Optional booleans that control whether the filter is active and whether its match is reversed.                                                                                        |
| `view`                                                                                     | Optional display mode: `side`, `enlarged`, or `minified`. Use this instead of the legacy `enlarged` boolean.                                                                          |
| `timezone`, `endName`                                                                      | Optional time-filter settings: display timezone (for example, `Etc/UTC`) and end-time field names for duration-based filtering, in dataset order.                                     |
| `animationWindow`, `animationLoop`, `speed`, `syncedWithLayerTimeline`, `syncTimelineMode` | Optional playback and layer-timeline synchronization settings.                                                                                                                        |
| `plotType`, `yAxis`, `invertTrendColor`                                                    | Optional plot settings. `yAxis`, if set, stores the field's `name` and `type`, not a runtime field object.                                                                            |

The examples assume a dataset with ID `observations` and a point layer with ID `observation-points` and label **Observations**. Use field names that exist in your data.

### Numeric range

Store the selected minimum and maximum as numbers, in that order.

```json
{
  "id": "amount-range",
  "dataId": ["observations"],
  "name": ["amount"],
  "type": "range",
  "value": [10, 50]
}
```

### Categorical selection

Use `multiSelect` for a categorical filter. Keep the selected values in the same type and spelling as the source field.

```json
{
  "id": "category-selection",
  "dataId": ["observations"],
  "name": ["category"],
  "type": "multiSelect",
  "value": ["park", "school"]
}
```

### Time range

Store the two endpoints as Unix epoch **milliseconds**. The display timezone does not change those instants. The field in this example is typed as a timestamp in the dataset.

```json
{
  "id": "observed-at-range",
  "dataId": ["observations"],
  "name": ["observed_at"],
  "type": "timeRange",
  "value": [1704067200000, 1704153600000],
  "timezone": "Etc/UTC",
  "view": "enlarged"
}
```

### Polygon

Use a GeoJSON polygon feature with a feature ID and a closed ring of longitude/latitude positions. Set `value.properties.filterId` to the filter ID to associate the drawn feature with its filter.

```json
{
  "id": "observation-area",
  "dataId": ["observations"],
  "name": ["Observations"],
  "type": "polygon",
  "layerId": ["observation-points"],
  "value": {
    "type": "Feature",
    "id": "observation-area-feature",
    "properties": {"filterId": "observation-area", "isVisible": true},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-74.1, 40.6],
          [-73.9, 40.6],
          [-73.9, 40.8],
          [-74.1, 40.8],
          [-74.1, 40.6]
        ]
      ]
    }
  }
}
```

### Runtime state

Do not copy runtime fields such as `domain`, `fieldIdx`, `step`, `gpu`, or `isAnimating` into saved filters. Kepler.gl initializes or derives these when it applies the configuration to the map's datasets and layers. The saved `value` is the selected range or set, not the full field domain. A filter cannot be restored if its dataset, field, or target layer is missing or incompatible.

[The v1 filter schema](../../../src/schemas/src/vis-state-schema.ts) defines the persisted fields. To update an existing filter in a running map, see [`setFilterUpdater`](../reducers/vis-state.md#setfilterupdater).
