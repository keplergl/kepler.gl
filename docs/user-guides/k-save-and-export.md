# Save and export

![activate interactions](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-1.png)

kepler.gl is a client-side only application. In the demo app, the data you uploaded stays in your browser. Uber does not send or store any user data to any backends. This rule poses an limitation on how you can save and share your maps.

However, in the demo app, you can:

* [Export map as an image](k-save-and-export.md#export-image).
* [Export filtered or unfiltered data as a csv](k-save-and-export.md#export-data).
* [Export Map](k-save-and-export.md#export-map)
* [Share Public URL \(Dropbox\)](k-save-and-export.md#export-dropbox)

## [Export Image](k-save-and-export.md#export-image)

![activate interactions](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-2.png)

You can export the current map as an image. The export window will use the current map viewport, and the preview will show the entire exported map area. To adjust the viewport, you will have to close the export dialog. You can choose different export ratios or resolutions, and also to add a map legend.

## [Export Data](k-save-and-export.md#export-data)

![activate interactions](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-3.png)

You can export map data as a csv file, with the option to export ONLY the filtered data or the entire dataset.

## [Export Map](k-save-and-export.md#export-map)

You can export the current map using two different formats. The **Export Map** window provides two options:

* HTML: create a single html file loads and renders your current map.
* JSON: create a json file with your current map config and data.

### [Export Map as HTML](k-save-and-export.md#export-html-map)

![activate interactions](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-4.png)

To save and export your current map as HTML file, click on **Export Map** and subsequently on **Export**. When prompted provide your own mapbox token to be used in the newly generated file. If you don't provide a Mapbox Token, Kepler.gl will use a default one which can expire at anytime without any communication and therefore break your your existing map.

#### How to update an exported map token

In order to edit the mapbox token in your html file you simply need to perform the following steps: 1. [Create a new mapbox token](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) or use your existing one. 2. Open the kepler.gl.map file with your favorite text editor. 3. Locate the following line in the exported file **kepler.gl.html**:

```javascript
  /**
   * Provide your MapBox Token
   **/
  const MAPBOX_TOKEN = 'CURRENT_TOKEN';
```

1. Replace the current value a new valid token. The code should now look like the following:

   ```javascript
   /**
   * Provide your MapBox Token
   **/
   const MAPBOX_TOKEN = 'pk.eyJ1IjoidWJlcmRh...';
   ```

### [Export Map as JSON](k-save-and-export.md#export-json-map)

![activate interactions](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-5.png)

You can export the current map as a `json` file. This is useful when you are running your own kepler.gl application and want to load your map programmatticaly. The JSON file includes:

* dataset: processed data to create used to render your map
* config: layer, filter, map style and interaction settings.

  The map config includes the current layer, filter, map style and interaction settings.

**Note:** kepler.gl map config is coupled with loaded datasets. The **`dataId`** key is used to bind layers, filters and tooltip settings to a specific dataset. If you try to upload a configuration with a dataset in your own kepler.gl app, you also need to make sure your dataset **`id`** matches the **`dataId`** in the config.

## [Share Public URL \(Dropbox\)](k-save-and-export.md#export-dropbox)

![activate interactions](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-save-and-export-5.png)

To export the current map into your Dropbox account, click on **Share Public Url** and select Dropbox as your cloud storage. Perform the authentication against Dropbox using your credentials. Once the authentication process is completed, click on **Upload** and Kepler.gl will push your current map onto your account.

At the end of the process Kepler.gl will automatically generate a permalink for your work you can share with other users.

[Back to table of contents](a-introduction.md)

