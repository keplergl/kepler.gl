# Interactions

<!-- TOC -->
  - [Tooltips](#tooltips)
  - [Brushing](#brushing)
  - [Display Coordinates](#display-coordinates)
<!-- /TOC -->

You can toggle customization options on your map, including tooltips, brush highlighting, map imagery (water, parks, etc.), and more.

![Interaction menu](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/g-interactions-0.png "Interaction menu")

To toggle customization options on your map:

1. Open the Interactions menu by clicking the Interactions icon:


2. Click the switch next to the options you wish to activate/deactivate.

There are three types of interactions to choose from: __Tooltip__, __Brushing__ and __Coordinate__. Note that only one of tooltip and brushing can be on at a time.

## Tooltips
tooltip displays metrics when hovering over a data point. You can choose which fields are displayed from the tooltip config menu.

![tooltips](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image25.png "tooltips")

  - __Image__ Image can be added to tooltip. If field name contains `<img>` and the field content contains `http` url

  |id| `<img>-tooltip` |
  |---|---|
  |1|`http://my-image.com/my-image-0.png`|
  |2|`http://my-image.com/my-image-1.png`|


  - __Web link__
Tooltip can be a clicable weblink. To add a web link as tooltip, add  url starts with `http://` to the field content.

![tooltips](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/g-interactions-1.png "tooltips")


Tip: click a point to pin the tooltip info to the map. To unpin the tooltip, press the blue pin icon.

![pin/unpin tooltip](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image15.png "pin/unpin tooltip")


## Brushing
- __Brush__: Brush allows you to highlight areas with the cursor. When brush is turned on, all layers darken. Only the portion you hover over with the cursor is illuminated. Brush works well with arc layers in particular.

![brush](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image12.png "brush")

[Back to table of contents](README.md)


## Display Coordinates

![coordinate](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/g-interactions-2.png "coordinate")

When then on coordinate, a  panel contains latitude and longitude will follow your mouse

[Back to table of contents](README.md)
