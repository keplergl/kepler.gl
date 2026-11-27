# Filters

Add filters to your map to limit the data that is displayed. You can filter by a column in your dataset, or spatially with a polygon or rectangle drawn on the map.

## Filter by column

To add a column filter:

1. Select Filters from the right navigation bar.
![select filters](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image1.png "select filters")

2. The Filters panel displays the list of existing filters, color-coded by dataset. To create a new filter, Click __Add Filter__.

3. Choose a dataset, and then a field on which to filter your data. Filter values are defined by field data type (number, string, timestamp, etc.). 
![choose a dataset](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image29.png "choose a dataset")

4. Your filter is applied to your map as soon as you specify the field and value.
5. For timestamp fields, you can optionally choose an **End time** field so features stay visible for the whole `[start, end]` span during playback. End time is hidden while the filter is synced across datasets. See [Playback](./h-playback.md).
6. Delete a filter anytime by clicking the __trashcan__ to the right of the filter you wish to delete.

__Note__: column filters apply to all layers in the same dataset on your map.

## Filter by polygon or rectangle

Use [Draw on Map](./draw-on-map.md) to sketch a rectangle (applied as a filter when you finish drawing) or a polygon (right-click, then **Filter Layers**). Only features inside the shape stay visible. Points and lines cannot be used as filters.

### Filter only one layer from a shared dataset

For example, use one Point layer to show all stops and a second Point layer to highlight stops in a neighborhood. Both layers can use the same dataset.

1. Load this CSV as one dataset:

   ```csv
   name,latitude,longitude
   Civic Center,37.779,-122.419
   Ferry Building,37.795,-122.393
   ```

2. In **Layers**, rename the Point layer **All stops**. Open its layer menu, choose **Duplicate layer**, and rename the copy **Neighborhood stops**. Give the copy a different color so you can distinguish the two layers.
3. In **Draw on Map**, draw a polygon around Civic Center, leaving the Ferry Building outside. Right-click the shape, open **Filter Layers**, and select **Neighborhood stops** only.
4. **Neighborhood stops** now shows only Civic Center. **All stops** still shows both stops. You can change which layers the polygon targets in the filter’s **Layers** picker in the **Filters** panel.

This applies to spatial filters. Column filters still affect every layer that uses the filtered dataset.

[Back to table of contents](README.md)
