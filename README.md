# Kepler.gl

Kepler.gl is the core package of Voyager, a map visualization tool that provides the UI
to visualize any type of geospatial dataset.

For what it is capable of, take a look at [Voyager](voyager.uberinternal.com).

Kepler.gl is a redux component that uses a redux reducer to store and manage state transitions.
This package consists of a reducer and the UI components to render and customize the map.

## Links

### Env
Use Node v6 and above, older node versions have not been tested

### Install
Install node (`> 6`), yarn, and project dependencies

```
npm install --save @uber/kepler.gl
```

### Local dev
```
npm install
```
or
```
yarn --ignore-engines
```
then
```
npm start
```
An Example app will be served at
http://localhost:8080/

### Website

Make sure to export mapbox token in the same terminal before start the server.
```sh
    export MapboxAccessToken=<insert_your_token> && npm start
```

In order to start
```
    yarn web
```

To checkout the build
```
    cd website && yarn build
```

Publish on github pages.

<b>important Before publish. Copy the mapbox token at [this link](https://code.uberinternal.com/P101549). Deploy will fail if token is missing<b>
```
    export MapboxAccessToken=<insert_your_token>
    yarn deploy
```

### Basic Usage
You can also take a look at `kepler.gl/examples/demo-app` for how to use kepler.gl in your app
Here are the basic steps:

#### 1. Mount kepler.gl reducer in your app reducer. Kepler.gl uses [react-palm](https://github.com/btford/react-palm) to handle side effects.
You need to add `taskMiddleware` to your store too. We are actively working on a solution where
`react-palm` will not be required, however it is still a very nice side effects management tool that works easier for testing than react-thunk.

```
import keplerGlReducer from '@uber/kepler.gl/reducers';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {taskMiddleware} from 'react-palm';

const reducers = combineReducers({
  // <-- mount kepler.gl reducer in your app
  keplerGl: keplerGlReducer,

  // Your other reducers here
  app: appReducer
});

// using createStore
const store = createStore(reducer, applyMiddleware(taskMiddleware))

// using enhancers
const initialState = {}
const middlewares = [taskMiddleware]
const enhancers = [
  applyMiddleware(...middlewares)
]

const store = createStore(reducer, initialState, compose(...enhancers))
```

If you mount kepler.gl reducer in another address instead of `keplerGl`, or the kepler.gl reducer is not
mounted at root of your state, you will need to specify the path to it when you mount the component
with the `getState` prop.

#### 2. Mount kepler.gl Component

```
import KeplerGl from '@uber/kepler.gl';

const Map = props => (
  <KeplerGl
      id="foo"
      width={width}
      height={height}/>
);
```

##### Component Props

##### `id` (String, required)

- Default: `map`

The id of this KeplerGl instance. `id` is required if you have multiple
KeplerGl instances in your app. It defines the prop name of the KeplerGl state that is
stored in the KeplerGl reducer. For example, the state of the KeplerGl component with id `foo` is
stored in `state.keplerGl.foo`.

In case you create multiple kepler.gl instances using the same id, the kepler.gl state defined by the entry will be
overridden by the latest instance and reset to a blank state.


##### `mapboxApiAccessToken` (String, required)

- Default: `undefined`

You can create a free account at [www.mapbox.com](www.mapbox.com) and create a token at [www.mapbox.com/account/access-tokens](www.mapbox.com/account/access-tokens)

##### `getState` (Function, optional)

- Default: `state => state.keplerGl`

The path to the root keplerGl state in your reducer.

##### `width` (Number, optional)

- Default: `800`

Width of the KeplerGl UI.

##### `height` (Number, optional)

- Default: `800`

##### `appName` (String, optional)

- Default: `Kepler.Gl`

App name displayed in side panel header

##### `version` (String, optional)

- Default: `v1.0`

version displayed in side panel header

##### `onSaveMap` (Function, optional)

- Default: `() => {}`

Action called when click Save Map Url in side panel header.

##### `actions` (Object, optional)

- Default: `{}`

Actions payload creator to replace default kepler.gl action. Only use custom action when you want to modify action payload.

#### 3. Dispatch custom actions to `keplerGl` reducer.

One advantage of using the reducer over React component state to handle keplerGl state is the flexibility
to customize its behavior. If you only have one `KeplerGl` instance in your app or never intend to dispatch actions to KeplerGl from outside the component itself,
you don’t need to worry about forwarding dispatch and can move on to the next section. But life is full of customizations, and we want to make yours as enjoyable as possible.

There are multiple ways to dispatch actions to a specific `KeplerGl` instance.

- In the root reducer, with reducer updaters.

Each action is mapped to a reducer updater in kepler.gl. You can import the reducer updater corresponding to a specific action, and call it with the previous state and action payload to get the updated state.
e.g. `updateVisDataUpdater` is the updater for `ActionTypes.UPDATE_VIS_DATA` (take a look at each reducer `reducers/vis-state.js` for action to updater mapping).
Here is an example how you can listen to an app action `QUERY_SUCCESS` and call `updateVisDataUpdater` to load data into Kepler.Gl.
```
import keplerGlReducer, {visStateUpdaters} from '@uber/kepler.gl/reducers';

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
              state.keplerGl.map.visState, {datasets: action.payload})
         }
       }
     };
 }
 return reducers(state, action);
};

export default composedReducer;
```

- Using redux `connect`

You can add a dispatch function to your component that dispatches actions to a specific `keplerGl` component,
using connect.


```
// component
import KeplerGl from '@uber/kepler.gl';

// action and forward dispatcher
import {toggleFullScreen, forwardTo} from '@uber/kepler.gl/actions';
import {connect} from 'react-redux';

Const MapContainer = props => (
  <div>
    <button onClick=() => props.keplerGlDispatch(toggleFullScreen())/>
    <KeplerGl
      id="foo"
    />
  </div>
)

const mapStateToProps = state => state
const mapDispatchToProps = (dispatch, props) => ({
 dispatch,
 keplerGlDispatch: forwardTo(‘foo’, dispatch)
});

export default connect(
 mapStateToProps,
 mapDispatchToProps
)(MapContainer);
```

- Wrap action payload

You can also simply wrap an action into a forward action with the `wrapTo` helper

```
// component
import KeplerGl from '@uber/kepler.gl';

// action and forward dispatcher
import {toggleFullScreen, wrapTo} from '@uber/kepler.gl/actions';

// create a function to wrapper action payload to 'foo'
const wrapToMap = wrapTo('foo');
const MapContainer = ({dispatch}) => (
  <div>
    <button onClick=() => dispatch(wrapToMap(toggleFullScreen())/>
    <KeplerGl
      id="foo"
    />
  </div>
);

```

#### 4. Replace default components.
Everyone wants the flexibility to render custom kepler.gl componenents. Kepler.gl has a dependency injection system that allow you to inject
components to KeplerGl replacing existing ones. All you need to do is to create a component factory for the one you want to replace, import the original component factory
and call `injectComponents` at the root component of your app where `KeplerGl` is mounted.
Take a look at `examples/demo-app/src/app.js` and see how it renders a custom side panel header in kepler.gl

```
import {injectComponents, PanelHeaderFactory} from '@uber/kepler.gl/components';

// define custom header
const CustomHeader = () => (<div>My kepler.gl app</div>);
const myCustomHeaderFactory = () => CustomHeader;

// Inject custom header into Kepler.gl, replacing default
const KeplerGl = injectComponents([
  [PanelHeaderFactory, myCustomHeaderFactory]
]);

// render KeplerGl, it will render your custom header instead of the default
const MapContainer = () => (
  <div>
    <KeplerGl
      id="foo"
    />
  </div>
);

```

Using `withState` helper to add reducer state and actions to customized component as additional props.

```
import {withState, injectComponents, PanelHeaderFactory} from '@uber/kepler.gl/components';
import {visStateLens} from '@uber/kepler.gl/reducers';

// custom action wrap to mounted instance
const addTodo = (text) => wrapTo('map', {
    type: 'ADD_TODO',
    text
});

// define custom header
const CustomHeader = ({visState, addTodo}) => (
  <div onClick={() => addTodo('hello')}>{`${Object.keys(visState.datasets).length} dataset loaded`}</div>
);

// now CustomHeader will receive `visState` and `addTodo` as additional props.
const myCustomHeaderFactory = () => withState(
  // keplerGl state lenses
  [visStateLens],
  // customMapStateToProps
  headerStateToProps,
  // actions
  {addTodo}
)(CustomHeader);

```
#### 5. How to add data to map
In order to interact with a kepler.gl instance and add new data to it the following methods are available:
- updateVisData
- addDataToMap
It is also important to remember that Kepler.gl provides an easy API (```KeplerGlSchema.getConfigToSave```) to generate a dump of the current kepler instance configuration.


##### UpdateVisData
This action will upload a new dataset and update the visState according to input parameters.
The method takes 3 parameters as input:
- ```datasets | object```: new data to be added to the current kepler.gl instance
- ```options | object ``` - ```{centerMap: true, readOnly: false}```:
    - if centerMap is set to true kepler.gl will place the map view within the data points boundaries
    - if readOnly is set to true the left setting panel will not be visible
- ```config | object```: this is the new visState configuration that will be loaded into the kepler.gl instance.
Properties defined in this object will override the current ones in the redux state.


##### addDataToMap
This method is similar to UpdateVisData but it is able to update the full kepler.gl configuration (mapState, mapStyle, visState).
This action takes an object as input with the following properties:
```javascript
{
    datasets | object: same as UpdateVisData
    options | object: same as UpdateVisData
    config | object: this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}.
}
```
It is important to notice that the config object value will always have higher precedence than the options properties.
For instance, if you provide ```{centerMap: true}``` as part of the options object and in your config object you pass
the mapState configuration with latitude and longitude define as it follows:
```javascript
config: {
  mapState: {
    latitude: 33.88608913680742,
    longitude: -84.43459130456425
  }
}
```
the latter will be applied and the map view will be moved the defined coordinates.
