## Get Started

### Installation

Use <b>Node v20</b> and above, older node versions have not been tested

```sh
npm install --save kepler.gl @kepler.gl/components @kepler.gl/reducers maplibre-gl
```

The default basemaps use MapLibre, so load its stylesheet once in your application entry point:

```js
import 'maplibre-gl/dist/maplibre-gl.css';
```

Mapbox-only applications should load `mapbox-gl/dist/mapbox-gl.css` instead.
Applications that allow both MapLibre and Mapbox styles should load both stylesheets.

For a Mapbox-only application, replace `maplibre-gl` in the installation command:

```sh
npm install --save kepler.gl @kepler.gl/components @kepler.gl/reducers mapbox-gl
```

```js
import 'mapbox-gl/dist/mapbox-gl.css';
```

### Get a Mapbox Token (Mapbox styles only)

The default MapLibre-backed basemaps do not require a Mapbox token. If your application uses
Mapbox-hosted styles, create a Mapbox account and get a [Mapbox Access Token](https://www.mapbox.com/help/define-access-token/).

### Basic Usage

![Basic Usage][basic-usage]

#### 0. Working Template

Check full example on [Github](https://github.com/keplergl/kepler.gl/tree/master/examples/get-started).

```js
import * as React from "react";
import ReactDOM from "react-dom/client";
import document from "global/document";

import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { connect, Provider } from "react-redux";

import keplerGlReducer, { enhanceReduxMiddleware } from "@kepler.gl/reducers";
import KeplerGl from "@kepler.gl/components";
import "maplibre-gl/dist/maplibre-gl.css";

import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

const reducers = combineReducers({
  keplerGl: keplerGlReducer.initialState({
    uiState: {
      readOnly: false,
      currentModal: null,
    },
  }),
});

const middleWares = enhanceReduxMiddleware([
  // Add other middlewares here
]);

const enhancers = applyMiddleware(...middleWares);

const initialState = {};
const store = createStore(reducers, initialState, compose(enhancers));

const App = () => (
  <div
    style={{
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
    }}
  >
    <AutoSizer>
      {({ height, width }) => (
        <KeplerGl
          mapboxApiAccessToken="xxx" // Replace with your mapbox token
          id="map"
          width={width}
          height={height}
        />
      )}
    </AutoSizer>
  </div>
);

const mapStateToProps = (state) => state;
const dispatchToProps = (dispatch) => ({ dispatch });
const ConnectedApp = connect(mapStateToProps, dispatchToProps)(App);
const Root = () => (
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
);

export default Root;
```




#### 1. Mount reducer

Kepler.gl uses [Redux](https://redux.js.org/) to manage its internal state, along with a built-in task middleware to handle async side effects. Mount kepler.gl reducer in your store and apply the middleware using `enhanceReduxMiddleware`:

```js
import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';
import {createStore, combineReducers, applyMiddleware} from 'redux';

const reducer = combineReducers({
  // <-- mount kepler.gl reducer in your app
  keplerGl: keplerGlReducer,

  // Your other reducers here
  app: appReducer
});

const middlewares = enhanceReduxMiddleware([
  // Add other middlewares here
]);

// create store
const store = createStore(reducer, {}, applyMiddleware(...middlewares));
```

If you mount `keplerGlReducer` in another address instead of `keplerGl`, or it is not
mounted at root of your reducer, you will need to specify the path to it when you mount the component with the `getState` prop.

#### 2. Mount component

```js
import KeplerGl from '@kepler.gl/components';

const Map = props => (
  <KeplerGl
      id="foo"
      mapboxApiAccessToken={token}
      width={width}
      height={height}/>
);
```

To supply your own deck.gl layers, see [Add a custom deck.gl layer](./components/README.md#add-a-custom-deckgl-layer).

#### 3. Add data to map

In order to interact with a kepler.gl instance and add new data to it, you can dispatch the __`addDataToMap`__ action from anywhere inside your app. It adds dataset(s) to a kepler.gl instance and updates the full configuration (mapState, mapStyle, visState).

Give each new dataset a distinct `info.id`. If a follow-up call also supplies `config.visState`,
set `options.keepExistingConfig: true` to merge that configuration without clearing the existing
datasets and layers. Use the plural key `options`; `option` is ignored.

```js
import {addDataToMap} from '@kepler.gl/actions';

const fields = [
  {name: 'latitude', type: 'real'},
  {name: 'longitude', type: 'real'}
];

// After mounting KeplerGl, add the first dataset.
store.dispatch(
  addDataToMap({
    datasets: {
      info: {id: 'pickup_locations', label: 'Pickup locations'},
      data: {fields, rows: [[40.7501, -73.9939]]}
    },
    options: {centerMap: true}
  })
);

// Add a second dataset along with its visualization configuration.
store.dispatch(
  addDataToMap({
    datasets: {
      info: {id: 'dropoff_locations', label: 'Drop-off locations'},
      data: {fields, rows: [[40.756, -73.987]]}
    },
    options: {keepExistingConfig: true, centerMap: false},
    config: {visState: {layers: [], filters: []}}
  })
);
```

The map now contains both **Pickup locations** and **Drop-off locations**. Replace the empty
layer and filter lists with your own visualization settings, or omit `config` if you only need to
add the data. See the [`addDataToMap` action reference](./actions/actions.md#adddatatomap) for more options.

[basic-usage]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/api_basic-usage.png
