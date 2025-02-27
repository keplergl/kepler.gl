# Forward Dispatch Actions

One of the biggest challenge of using local state is to dispatch actions that only modify a specific instance of the state. For instance, if we have 2 kepler.gl components in our app, one with id `foo` other with id `bar`. Our keplerGl reducer is going to be `keplerGl: {foo: …, bar …}`. When `foo` dispatches an action, it only needs to update the state of `foo`, hence we need a way to decorate the action that the root reducer only pass it down to instance reducer `foo`.  To solve this, we provide a set of forward functions called `wrapTo`, `forwardTo` and `unwrap`. `wrapTo` wraps an action payload into an forward action by adding an address `_addr_` and a `_forward_` signature to its `meta`. The root reducer will check if the given action has that address and if so, `unwrap` the action and pass it to the correct instance reducer.

**Here are the different options to dispatch forwarded actions to kepler.gl reducer.**

### 1. Use `forwardTo` to add a dispatch function to your component

You can add a dispatch function to your component that dispatches actions to a specific kepler.gl instance using connect.

```js
// component
import {KeplerGl} from '@kepler.gl/components';
import {connect} from 'react-redux';

// import action and forward dispatcher
import {toggleFullScreen, forwardTo} from '@kepler.gl/actions';


const MapContainer = props => (
  <div>
    <button onClick={() => props.keplerGlDispatch(toggleFullScreen())}/>
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

- 2. Use `wrapTo`  to wrap action creator

You can also simply wrap an action into a forward action with the `wrapTo` helper

```js
// component
import {KeplerGl} from '@kepler.gl/components';

// action and wrapper
import {toggleFullScreen, wrapTo} from '@kepler.gl/actions';

// create a function to wrapper action payload to 'foo'
const wrapToMap = wrapTo('foo');
const MapContainer = ({dispatch}) => (
  <div>
    <button onClick={() => dispatch(wrapToMap(toggleFullScreen())} />
    <KeplerGl id="foo"/>
  </div>
);

```
