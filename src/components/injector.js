import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {console as Console} from 'global/window';

const MissingComp = () => <div />;
export const errorMsg = {
  noDep: (fac, parent) =>
    `${fac.name} is required as a dependency of ${parent.name}, ` +
    `but is not provided to injectComponents. It will not be rendered`,
  notFunc: '`factory and its replacment should be a function`'
};

export function injector(map = {}) {
  const cache = {}; // map<factory, factory -> ?>
  const get = (fac, parent) => {
    const factory = map[fac];
    // factory is not injected
    if (!factory) {
      Console.error(errorMsg.noDep(fac, parent));
      return MissingComp;
    }

    const instances =
      cache[factory] ||
      factory(
        ...(factory.deps ? factory.deps.map(dep => get(dep, factory)) : [])
      );

    cache[fac] = instances;
    return instances;
  };

  // if you have two functions that happen to have the exactly same text
  // it will be override: 2018-02-05
  return {
    provide: (factory, replacement) => {
      if (typeof factory !== 'function' || typeof replacement !== 'function') {
        Console.error(errorMsg.notFunc);
        return injector(map);
      }
      return injector({...map, [factory]: replacement});
    },
    get
  };
}

const identity = state => (state);
// Helper to add reducer state to custom component
export function withState(lenses, mapStateToProps = identity, actions = {}) {
  return (Component) => {
    const WrappedComponent = ({state, ...props}, {selector, id}) => (
      <Component
        {...lenses.reduce(
          (totalState, lens) => ({
            ...totalState,
            ...lens(selector(state))
          }),
          props
        )}
      />
    );
    WrappedComponent.contextTypes = {
      selector: PropTypes.func,
      id: PropTypes.string
    };
    return connect(
      state => ({...mapStateToProps(state), state}),
      dispatch => Object.keys(actions).reduce((accu, key) => ({
        ...accu,
        [key]: bindActionCreators(actions[key], dispatch)
      }), {})
    )(WrappedComponent);
  }
}

// Helpter to add actionCreator to custom component