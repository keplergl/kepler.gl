// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {Component, ComponentType, Dispatch} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import memoize from 'lodash.memoize';
import {console as Console} from 'global/window';
import {injector, provideRecipesToInjector, flattenDeps} from './injector';
import KeplerGlFactory from './kepler-gl';
import {forwardTo} from 'actions/action-wrapper';

import {registerEntry, deleteEntry, renameEntry} from 'actions/identity-actions';
import {notNullorUndefined} from '@kepler.gl/layers';
import {KeplerGlState} from 'reducers/core';

export const ERROR_MSG = {
  noState:
    `kepler.gl state does not exist. ` +
    `You might forget to mount keplerGlReducer in your root reducer.` +
    `If it is not mounted as state.keplerGl by default, you need to provide getState as a prop`
};

const mapStateToProps = (state: any, props: ContainerProps) => ({state, ...props});
const dispatchToProps = (dispatch: Dispatch<any>) => ({dispatch});
const connector = connect(mapStateToProps, dispatchToProps);

type ContainerProps = {
  id: string;
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  mapStylesReplaceDefault?: boolean;
  initialUiState?: object;
  width: number;
  mint?: boolean;
  getState: (state: any) => KeplerGlState;
};

type PropsFromRedux = ConnectedProps<typeof connector> & ContainerProps;

ContainerFactory.deps = [KeplerGlFactory];

export function ContainerFactory(
  KeplerGl: ReturnType<typeof KeplerGlFactory>
): ComponentType<PropsFromRedux> {
  /** @lends KeplerGl */
  /**
    * Main Kepler.gl Component
    * @param {Object} props
    *
    * @param {string} props.id - _required_
    *
    * - Default: `map`
    * The id of this KeplerGl instance. `id` is required if you have multiple
    * KeplerGl instances in your app. It defines the prop name of the KeplerGl state that is
    * stored in the KeplerGl reducer. For example, the state of the KeplerGl component with id `foo` is
    * stored in `state.keplerGl.foo`.
    *
    * In case you create multiple kepler.gl instances using the same id, the kepler.gl state defined by the entry will be
    * overridden by the latest instance and reset to a blank state.
    * @param {string} props.mapboxApiAccessToken - _required_
    * @param {string} props.mapboxApiUrl - _optional_
    * @param {Boolean} props.mapStylesReplaceDefault - _optional_
    * @param {object} props.initialUiState - _optional_

    * You can create a free account at [www.mapbox.com](www.mapbox.com) and create a token at
    * [www.mapbox.com/account/access-tokens](www.mapbox.com/account/access-tokens)
    *
    *
    * @param {Number} props.width - _required_ Width of the KeplerGl UI.
    * @public
   */

  class Container extends Component<PropsFromRedux> {
    // default id and address if not provided
    static defaultProps = {
      id: 'map',
      getState: state => state.keplerGl,
      mint: true
    };

    componentDidMount() {
      const {
        id,
        mint,
        mapboxApiAccessToken,
        mapboxApiUrl,
        mapStylesReplaceDefault,
        initialUiState
      } = this.props;

      // add a new entry to reducer
      this.props.dispatch(
        registerEntry({
          id,
          mint,
          mapboxApiAccessToken,
          mapboxApiUrl,
          mapStylesReplaceDefault,
          initialUiState
        })
      );
    }

    componentDidUpdate(prevProps) {
      // check if id has changed, if true, copy state over
      if (
        notNullorUndefined(prevProps.id) &&
        notNullorUndefined(this.props.id) &&
        prevProps.id !== this.props.id
      ) {
        this.props.dispatch(renameEntry(prevProps.id, this.props.id));
      }
    }

    componentWillUnmount() {
      if (this.props.mint !== false) {
        // delete entry in reducer
        this.props.dispatch(deleteEntry(this.props.id));
      }
    }

    getSelector = memoize((id, getState) => state => {
      if (!getState(state)) {
        // log error
        Console.error(ERROR_MSG.noState);

        return null;
      }
      return getState(state)[id];
    });
    getDispatch = memoize((id, dispatch) => forwardTo(id, dispatch));

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

  return connector(Container);
}

const allDependencies = flattenDeps([], ContainerFactory);

// provide all dependencies to appInjector
export const appInjector = allDependencies.reduce(
  (inj, factory) => inj.provide(factory, factory),
  injector()
);

// Helper to inject custom components and return kepler.gl container
export function injectComponents(recipes = []) {
  return provideRecipesToInjector(recipes, appInjector).get(ContainerFactory);
}

const InjectedContainer = appInjector.get(ContainerFactory);

export default InjectedContainer;
