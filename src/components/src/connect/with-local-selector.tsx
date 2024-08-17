// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {createSelector} from 'reselect';
import KeplerGlContext from '../context';
import {KeplerGlState} from '@kepler.gl/reducers';

const identity = state => state;

const mergeSelectors = (parentSelector, childSelector) => state =>
  childSelector(parentSelector(state));

// store the parent selector in the parent context
// and return the parent component
// when a selector is passed to a container component,
// it will be stored in the context and passed down to child components,
// as well as prop to the given component

const withLocalSelector = <P extends object>(
  ParentComponent: React.ComponentType<P>
): React.ComponentType<P & {selector: (...args: any[]) => KeplerGlState}> => {
  class WithConnectSelector extends Component<P & {selector: (...args: any[]) => KeplerGlState}> {
    static contextType = KeplerGlContext;

    selectorFromContext = (_, ctx) => (ctx.selector ? ctx.selector : identity);
    selectorFromProps = props => (props.selector ? props.selector : identity);
    idFromProps = props => props.id;
    computedSelector = createSelector(
      this.selectorFromContext,
      this.selectorFromProps,
      (ctx, props) => mergeSelectors(ctx, props)
    );

    contextSelector = createSelector(this.computedSelector, this.idFromProps, (selector, id) => ({
      selector,
      id
    }));

    render() {
      // @ts-ignore Argument of type 'Readonly<P & { selector: (...args: any[]) => KeplerGlState; }>' is not assignable to parameter of type 'never'
      const computedContext = this.contextSelector(this.props, this.context);
      return (
        <KeplerGlContext.Provider value={computedContext}>
          <ParentComponent {...this.props} selector={computedContext.selector} />
        </KeplerGlContext.Provider>
      );
    }
  }

  return WithConnectSelector;
};

export default withLocalSelector;
