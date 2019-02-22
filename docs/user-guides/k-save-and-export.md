# Save and Export

![Save and Export](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-1.png "activate interactions")

kepler.gl is a client-side only application. In the demo app, the data you uploaded stays in your browser. Uber doesn't send or store any user data to any backends. This rule poses an limitation on how you can save and share your maps.

However, in the demo app, you can:

- [Export map as an image](#export-image).
- [Export filtered or unfiltered data as a csv](#export-data).
- [Export current map configuration as a `json` file](#export-config), this file does not contain any map data.
- [Export current map configuration __AND__ map data as a `json` file](#export-config), which can be loaded back to kepler.gl to reproduce the current map.

## <a href="#export-image">Export Image</a>

![Export Image](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-2.png "activate interactions")

You can export the current map as an image. The export window will use the current map viewport, and the preview will show the entire exported map area. To adjust the viewport, you will have to close the export dialog. You can choose different export ratios or resolutions, and also to add a map legend.

## <a href="#export-data">Export Data</a>

![Export Data](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-3.png "activate interactions")

You can export map data as a csv file, with the option to export ONLY the filtered data or the entire dataset.

## <a href="#export-config">Export Map Configuration</a>

![Export Map Configuration](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-4.png "activate interactions")

#### 1.Export Current Config

You can export the current map configuration as a `json` file. This is useful when you are running your own kepler.gl application and want to load data with a specific preset configuration. The map config includes the current layer, filter, map style and interaction settings.

**Note:** kepler.gl map config is coupled with loaded datasets. The __`dataId`__ key is used to bind layers, filters and tooltip settings to a specific dataset. If you try to upload a configuration with a dataset in your own kepler.gl app, you also need to make sure your dataset __`id`__ matches the __`dataId`__ in the config.

#### 2.Save and Export Current Map

To save and share your current map, click the __Export Current Map__ check box to export current configuration __AND__ uploaded data in a single `json` file.  **You can load this json file back to kepler.gl by simply drag and drop it in the __Add Data to Map__ dialog.**

### 2.Export current Map as HTML

![Export Map as HTML](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-5.png "activate interactions")

To save and export your current map as HTML file, click on __Export Map__ and subsequently on __Export__. Your browser will download a new kepler.gl.html that contains both data and configuration. Simply click on the file to visualize your map.


