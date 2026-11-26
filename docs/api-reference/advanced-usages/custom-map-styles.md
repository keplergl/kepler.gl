# Using kepler.gl with basemap services other than Mapbox

Kepler.gl renders its default basemaps with MapLibre GL JS. The initial style, CARTO Dark Matter (`dark-matter`), does not require a Mapbox token or a custom style.

## Embed the default basemap

After installing the [embedding dependencies](../get-started.md#installation), use the built-in style in your React app:

```jsx
import * as React from 'react';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import KeplerGl from '@kepler.gl/components';
import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import 'maplibre-gl/dist/maplibre-gl.css';

const store = createStore(
  combineReducers({
    keplerGl: keplerGlReducer.initialState({mapStyle: {styleType: 'dark-matter'}})
  }),
  applyMiddleware(...enhanceReduxMiddleware([]))
);

export default function App() {
  return (
    <Provider store={store}>
      <KeplerGl id="map" width={800} height={500} mapboxApiAccessToken="" />
    </Provider>
  );
}
```

The empty token is intentional. Leave `mapStylesReplaceDefault` unset so the built-in style stays available. Self-hosting the app does not self-host the basemap: the browser still needs access to CARTO's style, tiles, and other assets. If a saved map uses a Mapbox style, switch it to Dark Matter or provide a token for that style.

![base map panel](https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/f-map-styles-1.png "base map panel")

## Use a custom basemap

You can use another basemap service by passing in a style JSON compatible with the [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/). The style's sources determine where the tiles come from and whether another provider's key is needed.

For instance. there is an example [style.json](https://raw.githubusercontent.com/heshan0131/kepler.gl-data/master/style/basic.json).  It points to the tile server described in the `sources` field.

```json
  "sources": {
    "openmaptiles": {
      "url": "https://api.maptiler.com/tiles/v3/tiles.json?key=xxxx",
      "type": "vector"
    }
  }
```

### 1. The `mapStyle` object.
Your custom map style should be an object as below
```js
// custom map style
{
  id: 'voyager',
  label: 'Voyager',
  url: 'https://api.maptiler.com/maps/voyager/style.json?key=xxxx',
  icon: 'https://api.maptiler.com/maps/voyager/256/0/0/0.png?key=xxx',
  layerGroups: [
    {
      slug: 'label',
      filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
      defaultVisibility: true
    },
    {
      slug: 'road',
      filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
      defaultVisibility: true
    }
  ]
}
```

__style properties__

- `id` (String, required) unique string.
- `label` (String, required) name to be displayed in map style selection panel
- `url` (String, required) a url pointing to the map style json object written in [Mapbox GL Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/). 
- `icon` (String, optional) image icon of the style, it can be a url, or an [image data url](https://flaviocopes.com/data-urls/#how-does-a-data-url-look)
- `layerGroups` (Array, optional) Supply your own `layerGroups` to override default for more accurate layer grouping. When `undefined` kepler.gl will attempt to group layers of your style based on its `id` naming convention and use it to allow toggle visibility of [base map layers](https://github.com/keplergl/kepler.gl/blob/master/docs/user-guides/f-map-styles/2-map-layers.md). 

### 2. Two Ways to supply kepler.gl with custom base map styles


#### Option 1. `mapStyles` prop
Pass `mapStyles` and `mapStylesReplaceDefault` prop to `KeplerGl` component.

```js
const mapStyles = [{
  id: 'voyager',
  label: 'Voyager',
  url: 'https://api.maptiler.com/maps/voyager/style.json?key=xxxx',
  icon: 'https://api.maptiler.com/maps/voyager/256/0/0/0.png?key=xxx'
}];

const App = () => (
  <KeplerGl 
    mapboxApiAccessToken="" 
    mapStyles={mapStyles}
    mapStylesReplaceDefault={true} 
    id="map"
  />
)
```

- `mapStyles` (Array) array of custom map styles.
- `mapStylesReplaceDefault` (Boolean) pass `true` if you want to replace all default kepler.gl base map options.
- `mapboxApiAccessToken`. Use an empty string if the styles and other features you use do not access Mapbox services.

#### Option 2. Reducer `initialState`
Pass custom `mapStyles` to kepler.gl `mapStyle` reducer using the `initialState` plugin. And set default style by passing `styleType`.

This method is demoed in the example app [Custom Map Style](https://github.com/keplergl/kepler.gl/tree/master/examples/custom-map-style)

```js
const customizedKeplerGlReducer = keplerGlReducer.initialState({
  mapStyle: {
    mapStyles: {
      voyager: {
        id: 'voyager',
        label: 'Voyager',
        url: 'https://api.maptiler.com/maps/voyager/style.json?key=xxxx',
        icon: 'https://api.maptiler.com/maps/voyager/256/0/0/0.png?key=xxx'
      },
      terrain: {
        id: 'terrain',
        label: 'Outdoor',
        url: 'https://api.maptiler.com/maps/outdoor/style.json?key=xxx',
        icon: 'https://openmaptiles.org/img/styles/terrain.jpg',
        layerGroups: [
          {
            slug: 'label',
            filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
            defaultVisibility: true
          },
          {
            slug: 'road',
            filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
            defaultVisibility: true
          }
        ]
      }
    },
    // Set initial map style 
    styleType: 'voyager'
  }
});

```
- `mapStyles` (Object) - `id` as key, and `style` as value. 
- `styleType` (string) - Initial map style. 

__Which option is for me?__ If you want to replace all basemap styles, we recommends __Option 2__. So you can also set the initial style with `styleType`. If you are adding more options as basemaps, __Option 1__ is ideal.

#### Disable incremental basemap style updates

By default, the Mapbox and MapLibre adapters apply style changes incrementally. To replace the style instead, pass `styleDiffing: false` to the bottom basemap container. Use the same option on the top container if your map renders basemap layers above the data:

```jsx
<KeplerGl
  id="map"
  bottomMapContainerProps={{styleDiffing: false}}
  topMapContainerProps={{styleDiffing: false}}
/>
```

This passes `diff: false` to the corresponding map's `setStyle` call when the style changes. A full reload can take longer than an incremental update. Leave diffing enabled unless your integration needs a full reload, for example when it relies on Mapbox's `style.load` event after switching styles.

### 3. `mapboxApiAccessToken`
Supply a public Mapbox access token for Mapbox-hosted styles or sources (for example, a `mapbox://` URL) or when using Mapbox geocoding. You do not need to create a style in Mapbox to use one your token already has access to. Non-Mapbox styles such as Dark Matter do not require a Mapbox token, even when the default style list is retained. A different tile provider may still require its own key.


#### 4. `DEFAULT_LAYER_GROUPS`

If `layerGroups` is not supplied, kepler.gl uses the default layer groups below. 


```js
export const DEFAULT_LAYER_GROUPS = [
  {
    slug: 'label',
    filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
    defaultVisibility: true
  },
  {
    slug: 'road',
    filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
    defaultVisibility: true
  },
  {
    slug: 'border',
    filter: ({id}) => id.match(/border|boundaries/),
    defaultVisibility: false
  },
  {
    slug: 'building',
    filter: ({id}) => id.match(/building/),
    defaultVisibility: true
  },
  {
    slug: 'water',
    filter: ({id}) => id.match(/(?=(water|stream|ferry))/),
    defaultVisibility: true
  },
  {
    slug: 'land',
    filter: ({id}) => id.match(/(?=(parks|landcover|industrial|sand|hillshade))/),
    defaultVisibility: true
  },
  {
    slug: '3d building',
    filter: () => false,
    defaultVisibility: false
  }
];
```


#### 5. Geocoder


#### 