## Get Started

### Installation

Use <b>Node v18</b> and above, older node versions have not been tested

```sh
npm install --save kepler.gl @kepler.gl/components @kepler.gl/reducers
```

### Get Mapbox Token

Kepler.gl is built on top of [Mapbox GL](https://www.mapbox.com). A mapbox account and an access token are needed to use kepler.gl in your app. Get a [Mapbox Access Token](https://www.mapbox.com/help/define-access-token/) at mapbox.com.

### Basic Usage

![Basic Usage][basic-usage]

#### 0. Working Template

```js
import * as React from "react";
import ReactDOM from "react-dom/client";
import document from "global/document";

import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { connect, Provider } from "react-redux";

import keplerGlReducer, { enhanceReduxMiddleware } from "@kepler.gl/reducers";
import KeplerGl from "@kepler.gl/components";

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

const App2 = () => (
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
const ConnectedApp = connect(mapStateToProps, dispatchToProps)(App2);
const Root = () => (
  <Provider store={store}>
    <App2 />
  </Provider>
);

export default Root;
```




#### 1. Mount reducer

Kepler.gl uses [Redux](https://redux.js.org/) to manage its internal state, along with [react-palm](https://github.com/btford/react-palm) middleware to handle side effects. Mount kepler.gl reducer in your store, apply  `taskMiddleware`.

```js
import keplerGlReducer from '@kepler.gl/reducers';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {taskMiddleware} from 'react-palm/tasks';

const reducer = combineReducers({
  // <-- mount kepler.gl reducer in your app
  keplerGl: keplerGlReducer,

  // Your other reducers here
  app: appReducer
});

// create store
const store = createStore(reducer, {}, applyMiddleware(taskMiddleware));
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

#### 3. Add data to map

In order to interact with a kepler.gl instance and add new data to it, you can dispatch the __`addDataToMap`__ action from anywhere inside your app. It adds dataset(s) to a kepler.gl instance and updates the full configuration (mapState, mapStyle, visState).

Read more about [addDataToMap](./actions/actions.md#adddatatomap)


```js
import {addDataToMap} from '@kepler.gl/actions';

this.props.dispatch(
  addDataToMap({
    // datasets
    datasets: {
      info: {
        label: 'Sample Taxi Trips in New York City',
        id: 'test_trip_data'
      },
      data: sampleTripData
    },
    // option
    option: {
      centerMap: true,
      readOnly: false
    },
    // config
    config: {
      mapStyle: {styleType: 'light'}
    }
  })
);
```

[basic-usage]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/api_basic-usage.png
