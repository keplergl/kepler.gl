import React, {Component} from 'react';
import {connect} from 'react-redux';
import memoize from 'lodash.memoize';
import {injector} from './injector';
import {keplerGlChildDeps, keplerGlFactory} from './kepler-gl';
import {forwardTo} from 'actions/action-wrapper';

import {registerEntry, deleteEntry} from 'actions/identity-actions';

// default id and address if not provided
const defaultProps = {
  id: 'map',
  getState: state => state.keplerGl
};

containerFactory.deps = [keplerGlFactory];

// provide all recipes to injector
export const appInjector = [
  containerFactory,
  ...containerFactory.deps,
  ...keplerGlFactory.deps,
  ...keplerGlChildDeps
].reduce((inj, factory) => inj.provide(factory, factory), injector());

// Helper to inject custom components and return kepler.gl container
export function injectComponents(recipes) {
  return recipes
    .reduce((inj, recipe) => inj.provide(...recipe), appInjector)
    .get(containerFactory);
}

export function containerFactory(KeplerGl) {
  class Container extends Component {
    constructor(props, ctx) {
      super(props, ctx);

      this.getSelector = memoize((id, getState) => state =>
        getState(state)[id]
      );
      this.getDispatch = memoize((id, dispatch) => forwardTo(id, dispatch));
    }

    componentWillMount() {
      // add a new entry to reducer
      this.props.dispatch(registerEntry(this.props.id));
    }

    componentWillReceiveProps(nextProps) {
      // TODO: need to check if id has changed
    }

    componentWillUnmount() {
      // delete entry in reducer
      this.props.dispatch(deleteEntry(this.props.id));
    }

    render() {
      const {id, getState, dispatch} = this.props;

      return (
        <KeplerGl
          {...this.props}
          id={id}
          selector={this.getSelector(id, getState)}
          dispatch={this.getDispatch(id, dispatch)}
        />
      );
    }
  }

  Container.defaultProps = defaultProps;
  const mapStateToProps = (state, props) => props;
  const dispatchToProps = dispatch => ({dispatch});
  return connect(mapStateToProps, dispatchToProps)(Container);
}

const Container = appInjector.get(containerFactory);

export default Container;
