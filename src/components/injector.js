// Copyright (c) 2021 Uber Technologies, Inc.
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

export const ERROR_MSG = {
  wrongRecipeType:
    `injectComponents takes an array of factories replacement pairs as input, ` +
    `each pair be a array as [originalFactory, replacement].`,

  noDep: (fac, parent) =>
    `${fac.name} is required as a dependency of ${parent.name}, ` +
    `but is not provided to injectComponents. It will not be rendered.`,

  notFunc: 'factory and its replacement should be a function'
};

export function injector(map = new Map()) {
  const cache = new Map(); // map<factory, factory -> ?>
  const get = (fac, parent) => {
    const factory = map.get(fac);
    // factory is not injected
    if (!factory) {
      Console.error(ERROR_MSG.noDep(fac, parent));
      return MissingComp;
    }

    // check if custom factory deps is declared
    const instances =
      cache.get(factory) ||
      factory(...(factory.deps ? factory.deps.map(dep => get(dep, factory)) : []));

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

// entryPoint
export function flattenDeps(allDeps, factory) {
  const addToDeps = allDeps.concat([factory]);
  return Array.isArray(factory.deps) && factory.deps.length
    ? factory.deps.reduce((accu, dep) => flattenDeps(accu, dep), addToDeps)
    : addToDeps;
}

export function provideRecipesToInjector(recipes, appInjector) {
  const provided = new Map();

  return recipes.reduce((inj, recipe) => {
    if (!typeCheckRecipe(recipe)) {
      return inj;
    }

    // collect dependencies of custom factories, if there is any.
    // Add them to the appInjector
    const customDependencies = flattenDeps([], recipe[1]);
    inj = customDependencies.reduce((ij, factory) => {
      if (provided.get(factory)) {
        Console.warn(
          `${factory.name} already injected from ${provided.get(factory).name}, injecting ${
            recipe[0].name
          } after ${provided.get(factory).name} will override it`
        );
      }
      return ij.provide(factory, factory);
    }, inj);

    provided.set(recipe[0], recipe[1]);
    return inj.provide(...recipe);
  }, appInjector);
}

export function typeCheckRecipe(recipe) {
  if (!Array.isArray(recipe) || recipe.length < 2) {
    Console.error('Error injecting [factory, replacement]', recipe);
    Console.error(ERROR_MSG.wrongRecipeType);
    return false;
  }

  const [factory, replacement] = recipe;
  if (typeof factory !== 'function') {
    Console.error('Error injecting factory: ', factory);
    Console.error(ERROR_MSG.notFunc);
    return false;
  } else if (typeof replacement !== 'function') {
    Console.error('Error injecting replacement for: ', factory);
    Console.error(ERROR_MSG.notFunc);
    return false;
  }

  return true;
}

const identity = state => state;
// Helper to add reducer state to custom component
export function withState(lenses = [], mapStateToProps = identity, actions = {}) {
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
