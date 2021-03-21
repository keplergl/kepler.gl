# Replacing components

Showing how to use kepler.gl without Mapbox, using other basemap services

By default, kepler.gl uses mapbox-gl.js to render its base maps, that's why a mapbox api token is required input. 

You can custom kepler.gl to use kepler.gl other base map services, by passing in  map style.json that is written in [Mapbox GL Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/).

Your Style.json should points to the tile server described in the `sources` field.

For example. there is a example [style.json]`https://raw.githubusercontent.com/heshan0131/kepler.gl-data/master/style/basic.json` 

With custom style.json kepler.gl can render the base map independent of mapbox vector tile service.

#### 
```js
{
    id: 'my_map',
    label: 'Basic',
    url: 'https://raw.githubusercontent.com/heshan0131/kepler.gl-data/master/style/basic.json',
    icon: ``,
    layerGroups: []
  }
```
#### 1. Install

```sh
npm install
```

or

```sh
yarn
```

#### 2. Start the app

```sh
npm start
```

