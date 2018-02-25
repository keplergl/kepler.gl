# Kepler.gl

Kepler.gl is the core package of Voyager. It is a map visualization tool that provides the UI
to visualize any type of geospatial dataset. For what it is capable of. Take a look at [Voyager](voyager.uberinternal.com)

Kepler.gl is a redux component that uses redux reducer to store and manage state transitions.
The package consists of a reducer and the UI component to render and customize the map

##Links

### Node
Use Node v6 and above, older node version has not been tested

### Install
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

### Basic Usage
You can also take a look at `kepler.gl/examples/demo-app` for How to uer kepler.gl in your app
Here are the basic steps:

#### 1. Mount kepler.gl reducer in your app reducer. Kepler.gl is using [react-palm](https://github.com/btford/react-palm) to handle side effects.
You need to add `taskMiddleware` to your store too. We are actively working on a solution where
`react-palm` will not be required. However it is still a very nice side effects management tool that much easy for testing (unlike react-thunk).

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
const store = createStore(reducer, applyMiddleWare(taskMiddleware))

// using enhancers
const initialState = {}
const middlewares = [taskMiddleware]
const enhancers = [
  applyMiddleware(...middlewares)
]

const store = createStore(reducer, initialState, compose(...enhancers))
```

If you mount kepler.gl reducer in another address instead of `keplerGl`, or kepler.gl reducer is not
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
KeplerGl instances in your app. It defines the prop name of this KeplerGl state that
stored in the KeplerGl reducer. For example. the state of the KeplerGl component with id `foo` is
stored in `state.keplerGl.foo`

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

One greatest advantages of using reducer vs. react component state to handle keplerGl state is the flexibility
to customize its behavior. If you only have one `KeplerGl` instance in your app or never intent to dispatch actions to KeplerGl from outside the component itself,
you don’t need to worry about forwarding dispatch and can move on to the next section. But life is full of customizations, and we want to make yours as enjoyable as possible.

There are multiple ways to dispatch actions to a specific `KeplerGl` instance.

- In the root reducer, with reducer updaters.

Each action is mapped to a reducer updater in kepler.gl. You can import the reducer updater correspond to a specific action, and call it with the previous state and action payload to get the updated state.
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

export default composeddReducer;
```

- Using redux `connect`

You can add dispatch function to your component that dispatch action to a specific `keplerGl` component,
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
const dispatchToProps = (dispatch, props) => ({
 dispatch,
 keplerGlDispatch: forwardTo(‘foo’, dispatch)
});

export default  connect(
 mapStateToProps,
 dispatchToProps
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
Take a look at `examples/demo-app/src/app.js` and see how it renders custom side panel header in kepler.gl

```
// import injectComponents helper and original PanelHeaderFactory
import {injectComponents, PanelHeaderFactory} from '@uber/kepler.gl/components';

// define custom header
const CustomHeader = () => (<div>My kepler.gl app</div>);
const myCustomHeaderFactory = () => CustomHeader;

// Inject custom header into Kepler.gl, replacing original one
const KeplerGl = injectComponents([
  [PanelHeaderFactory, myCustomHeaderFactory]
]);

// render KeplerGl, it's going to render your custom header instead
const MapContainer = (}) => (
  <div>
    <KeplerGl
      id="foo"
    />
  </div>
);

```

Using `withState` helper to Add reducer state and actions to customized component as additional props.

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