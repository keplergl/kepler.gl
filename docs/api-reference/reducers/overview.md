## Reducers

Kepler.gl is a redux-connected component that utilizes redux to manage its state. The basic implementation of kepler.gl reducer is simple. However, to make the most of it, it's recommended to have basic knowledge on:

- [Redux][redux] state container
- [React][react]
- [React Redux connect][react-redux]


![Compose-reducer][diagram-1]

It is immportant to understand the relationship between __kepler.gl reducer__, __instance reducer__ and __subreducer__. Kepler.gl reducer is the root reducer that combines multiple instance reducer, which manages the state of each individual kepler.gl component. The instance reducer is consists of 4 subreducers, each manages an independent part of the state.

## KeplerGl Reducer

To connect kepler.gl components to your Redux app you'll need the following pieces from the kepler.gl package:
- Redux Reducer: `keplerGlReducer` imported from `kepler.gl/reducers`
- React Component: `KeplerGl` imported from `kepler.gl`

These are the only 2 pieces you need to get kepler.gl up and running in your app. When you mount kepler.gl reducer in your app reducer (with `combineReducers`), it will then managers __ALL__ KeplerGl component instances that you add to your app. Each kepler.gl instance state is stored in a instance reduccer.

For instance, if you have 2 kepler.gl components in your App:
```js
import KeplerGl from 'kepler.gl';

const MapApp = () => (
  <div>
    <KeplerGl id="foo"/>
    <KeplerGl id="bar"/>
  </div>
);
```

Your redux state will be:
```js
state = {
  keplerGl: {
    foo: {},
    bar: {}
  },
  // ... other app state
  app: {}
}
```

## Instance Reducer

Each kepler.gl component state is stored in a instance reduccer. A instance reducer has 4 subreducers. __`visState`__, __`mapState`__, __`mapStyle`__ and __`uiState`__. Each of them managers a piece of state that is mostly self contained.
- __visState__ - Manages all data and visualization related state, including datasets, layers, filters and interaction configs. Some of the key updaters are `updateVisDataUpdater`,  `layerConfigChangeUpdater`, `setFilterUpdater`, `interactionConfigChangeUpdater`.

- __mapState__ - Manages base map behavior including the viewport, drag rotate and toggle split maps. Key updates are `updateMapUpdater`, `toggleSplitMapUpdater` and `togglePerspectiveUpdater`.

- __mapStyle__ - Managers base map style, including setting base map style, toggling base map layers and adding custom base map style.

- __uiState__ - Managers all UI component transition state, including open / close side panel, current displayed panel etc. Note, ui state reducer is the only reducer that’s not saved in kepler.gl schema.


## Subreducer

The subreducers - __`visState`__, __`mapState`__, __`mapStyle`__ and __`uiState`__ - are assembled by a list of action handlers, each handler mapped to a state transition function named xxUpdater. For instance, here is a snippet of the map state reducer in kepler.gl:

```js
/* Action Handlers */
const actionHandler = {
 [ActionTypes.UPDATE_MAP]: updateMapUpdater,
 [ActionTypes.FIT_BOUNDS]: fitBoundsUpdater,
 [ActionTypes.TOGGLE_PERSPECTIVE]: togglePerspectiveUpdater
};
```

User can import a specific action handler in their root reducer and use it to directly modify kepler.gl’s state (without dispathcing a kepler.gl action). This will give user the full control over kepler.gl’s component state.

Here is an example how you can listen to an app action `QUERY_SUCCESS` and call `updateVisDataUpdater` to load data into kepler.gl.

```js
import keplerGlReducer, {visStateUpdaters} from 'kepler.gl/reducers';

// Root Reducer
const reducers = combineReducers({
 keplerGl: keplerGlReducer,

 app: appReducer
});

const composedReducer = (state, action) => {
 switch (action.type) {
   case 'QUERY_SUCCESS':
     return {
       ...state,
       keplerGl: {
         ...state.keplerGl,

         // 'map' is the id of the keplerGl instance
         map: {
            ...state.keplerGl.map,
            visState: visStateUpdaters.updateVisDataUpdater(
              // you have to pass the subreducer state that the updater is associated with
              state.keplerGl.map.visState,
              {datasets: action.payload}
            )
         }
       }
     };
 }
 return reducers(state, action);
};

export default composedReducer;
```
[redux]: https://redux.js.org/
[react]: https://reactjs.org/
[react-redux]: https://react-redux.js.org/
[diagram-1]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/api_reducers_compose-reducers.png
