# Custom reducer initial state

For advanced users who wish to modify the initial state of kepler.gl reducer, kepler.gl provides a reducer `initialState` function. `Reducer.initialState` will take the custom state and return a new reducer function. `initialState` is only meant to be called where the store is initialized. The custom state passed in will be shallow merged with the default `initialState`.

Here is an example modify `uiState` `initialState` to hide side panel, and selectively display map control button.

```js
import {combineReducers} from 'redux';
import {keplerGlReducer} from '@kepler.gl/reducers';

const customizedKeplerGlReducer = keplerGlReducer
  .initialState({
    uiState: {
      // hide side panel to disallow user customize the map
      readOnly: true,

      // customize which map control button to show
      mapControls: {
        visibleLayers: {
          show: false
        },
        mapLegend: {
          show: true,
          active: true
        },
        toggle3d: {
          show: false
        },
        splitMap: {
          show: false
        }
      }
    }
  });

const reducers = combineReducers({
 keplerGl: customizedKeplerGlReducer,
 app: appReducer
});
```

For full implementation, take a look at the [custom reducer example][custom-reducer-example]

[custom-reducer-example]: https://github.com/keplergl/kepler.gl/tree/master/examples/custom-reducer

