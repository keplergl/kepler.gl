# Replace UI Component with Component Dependency Injection

To allow customize a child component, the library author usually has to pass the child component down as a prop from top of the component tree. This approach will work for component that are relatively small, but it won’t scale for kepler.gl because it has hundreds of child components. To give user the flexibility to render certain component differently. Kepler.gl has a dependency injection system that allows user to inject custom components to kepler.gl UI replacing the default ones at bootstrap time.

All you need to do is to create a component factory for the one you wish to replace, import the original component factory and call `injectComponents` at where `KeplerGl` is mounted. `injectComponents` will return a new `KeplerGl` component instance that renders the custom child component. This way we don’t have to keep track of hundreds of component as props and pass them all the way down. Dependency injection only happens once when `keplerGl` component is imported.

## Factory
For each high level component in kepler.gl, we export a `factory`. A `factory` is a function that takes a set of `dependencies` and return a component instance. In this example below, the `MapContainerFactory` takes `MapPopover` and `MapControl` as dependencies and returns the `MapContainer` component instance. Not all components are exported as factories in kepler.gl at the moment, we are still testing this feature.

```js
import MapPopoverFactory from 'components/map/map-popover';
import MapControlFactory from 'components/map/map-control';

function MapContainerFactory(MapPopover, MapControl) {
 return class MapContainer extends Component {
   render() {
     return (
       <div>
         <MapPopover {...popoverProps} />
         <MapControl {...controlProps} />
       </div>
      );
   }
 }
}

MapContainerFactory.deps = [MapPopoverFactory, MapControlFactory];
```

## Recipes

A recipe is an array of default factory, and the one to replace it. `[defaultFactory, customFactory]`. To replace default component, user can import the existing component factory, call `injectComponents` and pass in the new recipe to get a new `KeplerGl` instance.


### Inject Components

In kepler.gl, we create the app injector by calling provide with an array of default recipes. We then export a `injectComponents` function that user can call to inject a different recipe and returns a new kepler.gl instance.

Here is an example of how to use `injectComponents` to replace default `PanelHeader`.

```js
import {injectComponents, PanelHeaderFactory} from 'kepler.gl/components';

// define custom header
const CustomHeader = () => (<div>My kepler.gl app</div>);

// create a factory
const myCustomHeaderFactory = () => CustomHeader;

// Inject custom header into Kepler.gl,
const KeplerGl = injectComponents([
  [PanelHeaderFactory, myCustomHeaderFactory]
]);

// render KeplerGl, it will render your custom header
const MapContainer = () => <KeplerGl id="foo"/>;
```

##  Pass custom component props
`injectComponents` allows user to render custom component, however, they usually also want to pass additional props to the customized component which current component injector doesn’t support. To enable passing additional props, we implemented a `withState`helper that passes additional props to the customized component. `withState` takes 3 arguments: `lenses`, `mapStateToProps` and `actionCreators`,  They allows user to pass in kepler.gl instance state, state from other part of the app, and custom actions.

- `lense` - A getter function to get a piece of kepler.gl subreducer state. Kepler.gl exports lenses for all its sub-reducers. For instance when pass `mapStateLens` to `withState`, the component will receive `mapState` of current kepler.gl instance as a prop.

- `mapStateToProps` - A wild card to play. You can pass a `mapStateToProps` function to get the state from any part of the app. If the lenses aren’t enough, use `mapStateToProps`.

- `actions` - action creators that will be passed to `bindActionCreators`.

Here is an example of using `withState` helper to add reducer state and actions to customized component as additional props.

```js
import {withState, injectComponents, PanelHeaderFactory} from 'kepler.gl/components';
import {visStateLens} from 'kepler.gl/reducers';

// custom action wrap to mounted instance
const addTodo = (text) => ({
    type: 'ADD_TODO',
    text
});

// define custom header
const CustomHeader = ({visState, todos, addTodo}) => (
  <div onClick={() => addTodo('say hello')}>{`${Object.keys(visState.datasets).length} dataset loaded`}</div>
);

// now CustomHeader will receive `visState` `todos` and `addTodo` as additional props.
const myCustomHeaderFactory = () => withState(
  // subreducer lenses
  [visStateLens],

  // mapStateToProps
  state => ({
     todos: state.todos
  }),

  // actions
  {addTodo}
)(CustomHeader);
```

