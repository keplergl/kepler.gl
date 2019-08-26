# Trip layer

![Trip layer](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-trip.gif 'Grid layer')
Trip layer can display animated path.

### How to use trip layer to animate path

**Data format**
Currently trip layer support a special `geoJSON` format where the coordinate `linestring` has a 4th element denoting timestamp.

In order to animate the path, the `geoJSON` data needs to contain `LineString` in its features' geometry, and the coordinates in the `LineString` need to have 4 elements in the format of  `[longitude, latitude, altitude, timestamp]`, with the last element being a timestamp. Valid timestamp formats include unix in seconds such as `1564184363` or in milliseconds such as `1564184363000`.

**Sample data**

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "vendor":  "A",
      "vol":20},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-74.20986, 40.81773, 0, 1564184363],
          [-74.20987, 40.81765, 0, 1564184396],
          [-74.20998, 40.81746, 0, 1564184409]
        ]
      }
    }
  ]
}
```

**Note** Support for more data formats such as csv will be added in future releases.

**Layer attributes**

- Color

  The path can be colored by an attribute from the geoJSON properties.
  <img src="https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/k-trip-attribute-colors.png" width="256" title="Color Attribute">

* Trail Length

  Trail length determines how long it takes for a path to completely fade out. This can be adjusted using the slider. Short trail length retains few historical locations while long trail length retain more and show a longer tail.

* Animation speed
  Animation speed can be adjusted using the animation control at the bottom.

**When there are multiple layers**

- Multiple trip layers
  When you add multiple trip layers, the time range from all the layers will be combined and the animation control will span the entire time range of those layers.

- Multiple layers containing trip layer and other layers
  Other static layers can be added besides the trip layers. Upon hiding the trip layer, its animation control will also hide, giving place to the filter control.

**Export**
To export an animated map, you can use a screen recording or gif capture tool.

[Back to table of contents](../a-introduction.md)
