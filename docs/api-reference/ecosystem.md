## Ecosystem

The diagram below represents the data flow. Note that in most cases, you don't have to worry about action creators, forward dispatcher and state updaters, as they are handled under-the-hood by kepler.gl

![Data flow][data-flow]

## Component
The Kepler.gl component will call redux connect under the hood, and dispatch to the corresponding reducer instance.

To allow mounting of multiple instance of kepler.gl components in the same app, we implemented a local selector with forward dispatch system. The local selector will pass down the knowledge where the state of this instance lives, and the forward dispatch system will pass down a dispatch function that knows to dispatch action to the correct reducer instance. __Each kepler.gl component instance needs to have an unique id__.

Read more about [Component][components].


## Reducer and Forward Dispatcher

![Forward Dispatcher][forward-dispatcher]

The kepler.gl root reducer that user mounted in their app is in fact a wrapper reducer that stored the child state and update them based on forwarded actions. If An action is not a forwarded action, it pass down to all child reducers.

When a KeplerGl component instance is mounted with the id `foo`, the wrapper reducer will  add a kepler.gl local state in the root state at key `foo`.

One of the biggest challenge of using local state is to dispatch actions that only modify a specific local state. For instance, if we have 2 kepler.gl components in our app, one with id `foo` other with id `bar`. Our keplerGl reducer is going to be `keplerGl: {foo: …, bar …}`. When foo dispatches an action, it only needs to update the state of foo, we need a way to decorate the action that the root reducer only pass it down to subreducer `foo`.

To solve this, kepler.gl has a forward dispatching system. It consists of a set of forward functions including `wrapTo`, `forwardTo` and `unwrap`.   `wrapTo` wraps an action payload into an forward action by adding an address `_addr_` and a `_forward_` signature to its meta.

Each kepler.gl component receives a forward dispatcher as a prop, which dispatches a forwarded action to the root reducer. The root reducer will check if the given action has that address and if so, unwrap the action and pass it to the child reducer.

Read more about [Reducers][reducers].


## Actions and Updaters
Actions in reducers are mapped to state transition functions. `UPDATE_MAP` is mapped to `updateMapUpdater`. An updater is the backbone of the redux reducer. It is a pure function that takes the previous state and an action, and returns the next state. `(oldState, action) => newState`. It describes how the state should transition upon receiving that action.

here is a snippet of the map state reducer in kepler.gl.

```js
/* Action Handlers */
const actionHandler = {
 [ActionTypes.FIT_BOUNDS]: fitBoundsUpdater,
 [ActionTypes.TOGGLE_PERSPECTIVE]: togglePerspectiveUpdater
};

/* Reducer */
export default handleActions(actionHandler, INITIAL_MAP_STATE);
```

This pattern allows a user to import a specific action updater in the app's root reducer and use it to directly modify kepler.gl’s state without dispatching the action. This will give user a lot of freedom to control over kepler.gl's state transition.

Read more about [Actions and Updaters][actions-updaters].


## Processors and Schema Manager

![Processor and Schema][processor-schema]

Processors and schema manager are useful helpers to get data in and out of kepler.gl. You can use `processCsvData(csv)` and `processGeojson(geojson)` to parse csv or geoJson file and pass it to `addDataToMap()` action.

To save and reload the current map, you can call `KeplerGlSchema.save()` and pass it the instant state. It will return a json output containing map data and config. Pass this json file to `processKeplerglJSON()` and then `addDataToMap()` will reproduce the same map.

Read more about [Processors][processors] and [Schema Manager][schemas].


<!--  -->

[basic-usage]: ./basic-usage.md
[advanced-usage]: ./advanced-usage.md
[components]: components/README.md
[reducers]: reducers/README.md
[actions-updaters]: actions/README.md
[processors]: processors/README.md
[schemas]: schemas/README.md
[data-flow]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/api_data-flow.png
[forward-dispatcher]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/api_forward-dispatch.png
[processor-schema]: https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/documentation/api_load-save.png
