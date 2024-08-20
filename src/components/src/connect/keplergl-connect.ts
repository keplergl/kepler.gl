// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {JSXElementConstructor} from 'react';
import {connect as reduxConnect, GetProps, Matching} from 'react-redux';
import withLocalSelector from './with-local-selector';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultMapStateToProps = (state, _, __) => state;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultMapDispatchToProps = () => (dispatch, _, __) => ({dispatch});

export const connect =
  <T extends JSXElementConstructor<Matching<any, GetProps<T>>>>(
    mapStateToProps = defaultMapStateToProps,
    makeMapDispatchToProps = defaultMapDispatchToProps,
    reduxMergeProps?,
    options?
  ) =>
  (BaseComponent: T) => {
    const mapDispatchToProps = makeMapDispatchToProps();
    const reduxMapState = (state, props) => mapStateToProps(props.selector(state), props, state);

    const reduxMapDispatch = (dispatch, props) =>
      mapDispatchToProps(props.dispatch, props, dispatch);

    const ReduxComponent = reduxConnect(
      reduxMapState,
      reduxMapDispatch,
      reduxMergeProps,
      options
    )(BaseComponent);

    // save selector to context so it can be accessed by its children
    return withLocalSelector(ReduxComponent);
  };
