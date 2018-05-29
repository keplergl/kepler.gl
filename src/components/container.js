// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
    // default id and address if not provided
    static defaultProps = {
      id: 'map',
      getState: state => state.keplerGl,
      mint: true
    };

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
      const {id, mint, mapboxApiAccessToken} = this.props;
      // add a new entry to reducer
      this.props.dispatch(registerEntry({id, mint, mapboxApiAccessToken}));
    }

    componentWillReceiveProps(nextProps) {
      // check if id has changed, if true, copy state over
      if (nextProps.id !== this.props.id) {
        this.props.dispatch(renameEntry(this.props.id, nextProps));
      }
    }

    componentWillUnmount() {
      if (this.props.mint !== false) {
        // delete entry in reducer
        this.props.dispatch(deleteEntry(this.props.id));
      }
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
