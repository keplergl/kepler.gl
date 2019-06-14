# Add Data to the Map

## Add Data to your Map
1. Open Kepler.gl. You should see the following prompt:

![Add data to the map pop up](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image42.png "Add data to the map pop up")

2. Choose one of two ways to add data to your map: upload a CSV/GeoJSON file or use one of Kepler.gl’s sample datasets. The sample datasets include California earthquakes, New York City taxi rides, and San Francisco elevation contour lines.

3. Kepler.gl is a pure client side app. Data lives only on your machine/browser.  No information or maps is sent back up to our server.

## Upload CSV or GEOJSON Files

Drag as many files as you wish into the upload box. Note that Kepler.gl looks for conventions in your spreadsheets to auto-populate layers and its settings onto your map.
Check out some [sample datasets](https://github.com/uber-web/kepler.gl-data) for Kepler.gl.

### For CSV files:

- Kepler.gl creates a point layer if  your CSV has columns named `<name>_lat` and `<name>_lng` or `<name>_latitude` and `<name>_longitude`, or `<name>_lat` and `<name>_lon`. Only lower case names are recognized.

- Kepler.gl creates an arc layer if your CSV has 2 column point pairs.

- Kepler.gl draws an icon layer if your csv has a column named `icon`.

- Kepler.gl attempts to parse geometry from your CSV file if the column content contains geometry data types. Acceptable formats include [Well-Known Text](http://www.postgis.net/docs/ST_AsText.html) and [GeoJSON feature](http://geojson.org/) strings.

### For GeoJSON files:

- Kepler.gl accepts GeoJSON formatted JSON that contains a single [Feature](https://tools.ietf.org/html/rfc7946#section-3.2) object or a [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) object. Kepler.gl creates one layer per file.

- If a FeatureCollection contains different type of Features, Kepler.gl will render all features in one layer. Acceptable Feature types are [Point](https://tools.ietf.org/html/rfc7946#section-3.1.2), [MultiPoint](https://tools.ietf.org/html/rfc7946#section-3.1.3), [LineString](https://tools.ietf.org/html/rfc7946#section-3.1.4), [MultiLineString](https://tools.ietf.org/html/rfc7946#section-3.1.5), [Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6) and [MultiPolygon]((https://tools.ietf.org/html/rfc7946#section-3.1.7).

- Kepler.gl will read styles from GeoJSON files. If you are a GeoJSON expert, you can add style declarations to feature properties. Kepler.gl will use the declarations to automatically style your feature. The acceptable style properties are: `lineColor: [130, 154, 227]`, `lineWidth: 0.5`, `fillColor: [255, 0, 0]`, `radius: 1`, `hi-precision: true`.

- See an example below:
```
{
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [[[-105.1547889, 39.9862516], [-105.15471672508885,
         39.98626910199207]]
        ]},
      "properties": {
        "id": "a1398a11-d1ce-421c-bf66-a456ff525de9",
        "lineColor": [130, 154, 227],
	  "hi-precision": true,
        "lineWidth": 0.1
       }
  }]
}
```
### Load Map Using URL

Based on the feedback that we have received, we make importing data easier by allowing users to load your map through custom URL. It currently supports URLs with file extension of `csv`, `json` and `kepler.gl.json`

In addition, this also by-passes 250mb file upload size limit which allows you to upload larger file to Kepler.

![Load Map Using URL](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/a-load-map-using-url.gif "Load Map Using URL")

### Use Kepler.gl’s Sample Maps

The sample maps are a great option for new users to explore Kepler.gl and get a feel for how it works.

1. At the initial load prompt select “Try sample data” in the top right corner.

![Try sample data pop up](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image2.png "Try sample data pop up")

2. Choose from the options to load the sample map and explore the configurations applied.

![Choose sample data pop up](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image5.png "Choose sample data pop up")

### Add multiple datasets

To add additional datasets to your map:

1. Click __Add More Data__ in the top right corner.

![Add more data](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/image22.png "Add more data")

2. Choose one of the options above: upload a JSON/CSV file, or use Kepler.gl’s sample data.

3. Repeat as needed. There is no limit on the number of datasets you can add. However, adding too many might cause its performance to suffer.

[Back to table of contents](../a-introduction.md)
