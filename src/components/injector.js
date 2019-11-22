// Copyright (c) 2019 Uber Technologies, Inc.
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

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {console as Console} from 'global/window';
import KeplerGlContext from 'components/context';

const MissingComp = () => <div />;

export const errorMsg = {
  noDep: (fac, parent) =>
    `${fac.name} is required as a dependency of ${parent.name}, ` +
    `but is not provided to injectComponents. It will not be rendered.`,
  notFunc: '`factory and its replacement should be a function`',
  incompatibleDeps: (
    fac,
    given
  ) => `${fac.name} is expecting ${fac.length} arguments, but ${given} is given,
    You are likely forget to declare ${fac.name}.deps = []`
};

export function injector(map = new Map()) {
  const cache = new Map(); // map<factory, factory -> ?>
  const get = (fac, parent) => {
    const factory = map.get(fac);
    // factory is not injected
    if (!factory) {
      Console.error(errorMsg.noDep(fac, parent));
      return MissingComp;
    }

    // check if custom factory deps is declared
    const depsLength = factory.deps ? factory.deps.length : 0;
    let instances;
    if (factory.length !== depsLength) {
      Console.error(errorMsg.incompatibleDeps(factory, depsLength));

      const MissingDeps = () => (
        <div className="factory-missing-deps">{factory.name} is missing dependencies</div>
      );
      instances = MissingDeps;
    } else {
      instances =
        cache.get(factory) ||
        factory(
          ...(factory.deps ? factory.deps.map(dep => get(dep, factory)) : [])
        );
    }

    cache.set(fac, instances);
    return instances;
  };

  // if you have two functions that happen to have the exactly same text
  // it will be override: 2018-02-05
  return {
    provide: (factory, replacement) => {
      if (!typeCheckRecipe([factory, replacement])) {
        return injector(map);
      }
      return injector(new Map(map).set(factory, replacement));
    },
    get
  };
}

export function typeCheckRecipe(recipe) {
  if (!Array.isArray(recipe) || recipe.length < 2) {
    Console.error(errorMsg.wrongPairType);
    return false;
  }

  const [factory, replacement] = recipe;
  if (typeof factory !== 'function') {
    Console.error('Error injecting factory: ', factory);
    Console.error(errorMsg.notFunc);
    return false;
  } else if (typeof replacement !== 'function') {
    Console.error('Error injecting replacement for: ', factory);
    Console.error(errorMsg.notFunc);
    return false;
  }

  return true;
}

const identity = state => state;
// Helper to add reducer state to custom component
export function withState(
  lenses = [],
  mapStateToProps = identity,
  actions = {}
) {
  return Component => {
    const WrappedComponent = ({state, ...props}) => (
      <KeplerGlContext.Consumer>
        {context => (
          <Component
            {...lenses.reduce(
              (totalState, lens) => ({
                ...totalState,
                ...lens(context.selector(state))
              }),
              props
            )}
          />
        )}
      </KeplerGlContext.Consumer>
    );

    return connect(
      state => ({...mapStateToProps(state), state}),
      dispatch =>
        Object.keys(actions).reduce(
          (accu, key) => ({
            ...accu,
            [key]: bindActionCreators(actions[key], dispatch)
          }),
          {}
        )
    )(WrappedComponent);
  };
}
