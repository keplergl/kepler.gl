# Hexbin

![Hexbin layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/layers-hexbin.png "Hexbin layer")

Hexbin layers are similar to grid layers. They display distributions of aggregate metrics such as point count within each hexbin, average/max/min/median/sum of a numerical field, or mode/unique count of a string field. Both the color and height dimensions can encode data. Users can adjust the hexagon radius and the space between hexbins.

To compare heights by point count, expand the **Height** settings and turn on **Start count heights at zero**. This makes a hexagon with two points twice as tall as one with one point. The option is available for linear point-count heights when the minimum **Height Range** value and the lower height percentile are both zero. It is off by default, so existing maps keep their current scale.

[Back to table of contents](../README.md)
