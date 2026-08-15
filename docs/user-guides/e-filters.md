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
5. Delete a filter anytime by clicking the __trashcan__ to the right of the filter you wish to delete.

__Note__: column filters apply to all layers in the same dataset on your map.

## Filter by polygon or rectangle

Use [Draw on Map](./draw-on-map.md) to sketch a rectangle (applied as a filter when you finish drawing) or a polygon (right-click, then **Filter Layers**). Only features inside the shape stay visible. Points and lines cannot be used as filters.

[Back to table of contents](README.md)
