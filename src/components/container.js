import React, {Component} from 'react';
import {connect} from 'react-redux';
import memoize from 'lodash.memoize';
import {console as Console} from 'global/window';
import {injector} from './injector';
import KeplerGlFactory, {keplerGlChildDeps} from './kepler-gl';
import {forwardTo} from 'actions/action-wrapper';

import {
  registerEntry,
  deleteEntry,
  renameEntry
} from 'actions/identity-actions';

// default id and address if not provided
const defaultProps = {
  id: 'map',
  getState: state => state.keplerGl
};

export const errorMsg = {
  noState:
    `kepler.gl state doesnt exist. ` +
    `You might forget to mount keplerGlReducer in your root reducer.` +
    `If it is not mounted as state.keplerGl by default, you need to provide getState as a prop`,

  wrongType: type => `injectComponents takes an array of factories replacement pairs as input, ` +
    `${type} is provided`,

  wrongPairType: `injectComponents takes an array of factories replacement pairs as input, ` +
  `each pair be a array as [originalFactory, replacement]`
};

ContainerFactory.deps = [KeplerGlFactory];

export function ContainerFactory(KeplerGl) {
  class Container extends Component {
    constructor(props, ctx) {
      super(props, ctx);

      this.getSelector = memoize((id, getState) => state => {
        if (!getState(state)) {
          // log error
          Console.error(errorMsg.noState);

          return null;
        }
        return getState(state)[id];
      });
      this.getDispatch = memoize((id, dispatch) => forwardTo(id, dispatch));
    }

    componentWillMount() {
      // add a new entry to reducer
      this.props.dispatch(registerEntry(this.props.id));
    }

    componentWillReceiveProps(nextProps) {
      // check if id has changed, if true, copy state over
      if (nextProps.id !== this.props.id) {
        this.props.dispatch(renameEntry(this.props.id, nextProps));
      }
    }

    componentWillUnmount() {
      // delete entry in reducer
      this.props.dispatch(deleteEntry(this.props.id));
    }

    render() {
      const {id, getState, dispatch, state} = this.props;
      const selector = this.getSelector(id, getState);

      if (!selector || !selector(state)) {
        // instance state hasn't been mounted yet
        return <div />;
      }

      return (
        <KeplerGl
          {...this.props}
          id={id}
          selector={selector}
          dispatch={this.getDispatch(id, dispatch)}
        />
      );
    }
  }

  Container.defaultProps = defaultProps;
  const mapStateToProps = (state, props) => ({state, ...props});
  const dispatchToProps = dispatch => ({dispatch});
  return connect(mapStateToProps, dispatchToProps)(Container);
}

// provide all recipes to injector
export const appInjector = [
  ContainerFactory,
  ...ContainerFactory.deps,
  ...KeplerGlFactory.deps,
  ...keplerGlChildDeps
].reduce((inj, factory) => inj.provide(factory, factory), injector());

// Helper to inject custom components and return kepler.gl container
export function injectComponents(recipes) {
  if (!Array.isArray(recipes)) {
    Console.error(errorMsg.wrongType(typeof(recipes)));
    return appInjector.get(ContainerFactory);
  }

  return recipes
    .reduce((inj, recipe) => {
      if (!Array.isArray(recipes)) {
        Console.error(errorMsg.wrongPairType);
        return inj;
      }
      return inj.provide(...recipe);
    }, appInjector)
    .get(ContainerFactory);
}

const InjectedContainer = appInjector.get(ContainerFactory);

export default InjectedContainer;
