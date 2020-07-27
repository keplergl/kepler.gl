# Map Styles

<!-- TOC -->

  - [Base Map Styles](#base-map-styles)
  - [Toggle Map Layers](#toggle-map-layers)
      - [Map Layers](#map-layers)
      - [Layer Order](#layer-order)
  - [Custom Map Styles](#custom-map-styles)

<!-- /TOC -->

![map styles](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/f-map-styles-0.png "Map panel")

kepler.gl provide a set of [Mapbox](https://www.mapbox.com) basemap styles as background map, including 3D buildings! You can also add your own custom map sytle using the Mapbox style link.

## Base Map Styles

Open the __Base Map panel__ to select from a list of default map styles.

![base map panel](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/f-map-styles-1.png "base map panel")

Open the __base map style__ drop down menu to change map color scheme and imagery. Options include:
- __Dark__: dark base map with light-colored text.
- __Light__: light base map with dark-colored text.

## Toggle Map Layers

![map layers](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/f-map-styles-2.png "map layers")

#### Map Layers
Hide and show water, buildings, roads, and more. Options include:
- __Labels__: shows labels for cities, neighborhoods, and so on.
- __Roads__: displays a translucent layer of road lines.
- __Borders__: shows state and continent borders.
- __Buildings__: shows building footprints.
- __Water__: displays bodies of water.
- __Land__: Shows parks, mountains, and other landscape features.
- __3d Building__: Shows 3D buildings on the map. 3D buildings are only visible in the 3D map view. Resolution automatically updates based on current map zoom level. Use the input below to edit 3D bulding color.

![3d building](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/f-map-styles-3.png "3d buldings")


#### Layer Order
To control the order in which map imagery layers are displayed, toggle the move to top icon:

![move to top icon](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/f-map-styles-4.png "move to top icon").

__TIP__: Move labels to the top on maps with colored layers to keep the labels from being concealed.

![Examales of ordered layers](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/f-map-styles-5.png "examples of ordered layers")


## Custom Map Styles
![Add Custom Mapbox Styles button](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image45.png "Add Custom Mapbox Styles button")

To add a custom base map style, click the add map style button to open the custom map style modal, paste in the mapbox [style Url](https://www.mapbox.com/help/studio-manual-publish/#style-url). Note that you need to paste in your [mapbox access token](https://www.mapbox.com/account/) if your style is not [published](https://www.mapbox.com/help/studio-manual-publish/#style-url).


![Add Custom Mapbox Styles popup](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image13.png "Add Custom Mapbox Styles popup")

[Back to table of contents](README.md)
