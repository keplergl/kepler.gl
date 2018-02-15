import {connect} from 'react-redux';
import PropTypes from 'prop-types';

export function injector(map = {}) {
  const cache = {}; // map<token, factory -> ?>
  const get = (fac) => {
    const factory = map[fac];
    const instances = cache[factory] ||
      factory(...(factory.deps ? factory.deps.map(get) : []));
    cache[fac] = instances;
    return instances;
  };

  // if you have two functions that happen to have the exactly same text
  // it will be override: 2018-02-05
  return {
    provide: (factory, replacement) => injector({...map, [factory]: replacement}),
    get
  };
}

export const visStateLens = (reduxState) => ({visState: reduxState.visState});
export const mapStateLens = (reduxState) => ({mapState: reduxState.mapState});
export const uiState = (reduxState) => ({uiState: reduxState.uiState});

// Helper to add reducer state to custom component
export function withState(lenses, component) {
  const wrappedComponent = ({state, ...props}, {selector}) =>
    component(lenses.reduce((totalState, lens) => ({
      ...totalState,
      ...lens(selector(state))
    }), props));
  wrappedComponent.contextTypes = {
    selector: PropTypes.func
  };
  return connect(state => ({state}))(wrappedComponent);
}
