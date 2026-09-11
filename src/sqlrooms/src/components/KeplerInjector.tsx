// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import {
  AddDataButtonFactory,
  ContainerFactory,
  injector as createInjector,
  DndContextFactory,
  Factory,
  FilterPanelHeaderFactory,
  flattenDeps,
  MapControlTooltipFactory,
  MapDrawPanelFactory,
  MapLegendFactory,
  MapLegendPanelFactory,
  PanelTitleFactory,
  SourceDataSelectorFactory,
  typeCheckRecipe,
  type InjectorType
} from '@kepler.gl/components';
import React, {PropsWithChildren} from 'react';
import {CustomDndContextFactory} from './CustomDndContext';
import {CustomFilterPanelHeaderFactory} from './CustomFilterPanelHeader';
import {CustomMapControlTooltipFactory} from './CustomMapControlTooltipFactory';
import {CustomMapDrawPanelFactory} from './CustomMapDrawPanel';
import {CustomMapLegendFactory} from './CustomMapLegend';
import {CustomMapLegendPanelFactory} from './CustomMapLegendPanel';
import {CustomSourceDataSelectorFactory} from './CustomSourceDataSelector';

export const CustomAddDataButtonFactory = () => {
  return () => null;
};

export const CustomPanelTitleFactory = () => {
  const PanelTitle: React.FC<PropsWithChildren> = ({children}) => (
    <div className="flex items-center justify-end">{children}</div>
  );

  return PanelTitle;
};

export type KeplerFactory<TReturn = unknown> = (..._args: any[]) => TReturn;
export type KeplerFactoryRecipe = [KeplerFactory, KeplerFactory];
export type KeplerFactoryRecipeMode = 'append' | 'replace';

const defaultRecipes: KeplerFactoryRecipe[] = [
  [AddDataButtonFactory, CustomAddDataButtonFactory],
  [PanelTitleFactory, CustomPanelTitleFactory],
  [DndContextFactory, CustomDndContextFactory],
  [FilterPanelHeaderFactory, CustomFilterPanelHeaderFactory],
  [MapLegendPanelFactory, CustomMapLegendPanelFactory],
  [MapLegendFactory, CustomMapLegendFactory],
  [MapControlTooltipFactory, CustomMapControlTooltipFactory],
  [MapDrawPanelFactory, CustomMapDrawPanelFactory],
  [SourceDataSelectorFactory, CustomSourceDataSelectorFactory]
];

let customRecipes: KeplerFactoryRecipe[] = [];
let injector = createKeplerInjector();

function createBaseInjector() {
  const allDependencies = flattenDeps([], ContainerFactory as unknown as Factory);
  return allDependencies.reduce(
    (current, factory) => current.provide(factory, factory),
    createInjector()
  );
}

/**
 * Applies factory replacement recipes on top of a fresh Kepler injector while
 * preserving explicit replacement targets.
 *
 * Kepler's default `provideRecipesToInjector` pre-provides all replacement
 * dependencies as identity mappings (`dep -> dep`) before applying each recipe.
 * That can unintentionally override factories that were already replaced by
 * earlier recipes, and emits noisy "already injected" warnings.
 *
 * This helper keeps the same high-level flow (process recipes in order and then
 * eagerly resolve the configured factories), but skips identity-providing any
 * dependency that is itself an explicit replacement target in the current
 * recipe set. As a result:
 * - earlier explicit replacements are not overwritten by later dependency setup
 * - replacement ordering remains deterministic
 * - configured factories are still warmed via `get(factoryToReplace)`
 */
function provideRecipesToInjectorSafely(
  recipes: KeplerFactoryRecipe[],
  baseInjector: InjectorType
) {
  const replacementTargets = new Set(
    recipes
      .filter(recipe => typeCheckRecipe(recipe as unknown as [Factory, Factory]))
      .map(recipe => recipe[0])
  );

  const provided = new Map();

  const injectorWithRecipes = recipes.reduce((currentInjector, recipe) => {
    if (!typeCheckRecipe(recipe as unknown as [Factory, Factory])) {
      return currentInjector;
    }

    const [factoryToReplace, replacementFactory] = recipe;
    const customDependencies = flattenDeps([], replacementFactory as unknown as Factory);

    const injectorWithDependencies = customDependencies.reduce(
      (dependencyInjector, dependencyFactory) => {
        // If a dependency has an explicit replacement recipe, skip self-injecting it.
        // This avoids overriding previous replacements and warning noise.
        if (replacementTargets.has(dependencyFactory as unknown as KeplerFactory)) {
          return dependencyInjector;
        }
        return dependencyInjector.provide(dependencyFactory, dependencyFactory);
      },
      currentInjector
    );

    provided.set(factoryToReplace, replacementFactory);
    return injectorWithDependencies.provide(factoryToReplace, replacementFactory);
  }, baseInjector);

  provided.forEach((_, factoryToReplace) => {
    injectorWithRecipes.get(factoryToReplace);
  });

  return injectorWithRecipes;
}

function createKeplerInjector(recipes: KeplerFactoryRecipe[] = []) {
  return provideRecipesToInjectorSafely([...defaultRecipes, ...recipes], createBaseInjector());
}

export function configureKeplerInjector(
  recipes: KeplerFactoryRecipe[],
  options: {mode?: KeplerFactoryRecipeMode} = {}
) {
  const mode = options.mode ?? 'append';
  customRecipes = mode === 'replace' ? [...recipes] : [...customRecipes, ...recipes];
  injector = createKeplerInjector(customRecipes);
}

export function resetKeplerInjectorRecipes() {
  customRecipes = [];
  injector = createKeplerInjector();
}

export function getKeplerInjector() {
  return injector;
}

// Cache resolved components per injector so we keep a stable component
// reference across re-renders. Invalidated when injector is replaced (configure/reset).
const injectorToFactoryCache = new WeakMap<
  object,
  Map<KeplerFactory, React.ComponentType<Record<string, unknown>>>
>();

// Cache wrapper components per factory so callers always get a stable component type.
const factoryToWrapperCache = new Map<
  KeplerFactory,
  React.ComponentType<Record<string, unknown>>
>();

export function getKeplerFactory<TFactory extends KeplerFactory>(
  factory: TFactory
): ReturnType<TFactory> {
  let Wrapped = factoryToWrapperCache.get(factory);
  if (Wrapped === undefined) {
    const WrappedComponent = function KeplerFactoryWrapper(props: Record<string, unknown>) {
      // Resolve at top level of render (not inside useMemo) so injector.get()
      // running the factory chain does not run hooks inside a hook.
      const injectorInstance = getKeplerInjector();
      let byFactory = injectorToFactoryCache.get(injectorInstance as object);
      if (byFactory === undefined) {
        byFactory = new Map();
        injectorToFactoryCache.set(injectorInstance as object, byFactory);
      }
      let Component = byFactory.get(factory);
      if (Component === undefined) {
        Component = injectorInstance.get(factory as unknown as Factory) as React.ComponentType<
          Record<string, unknown>
        >;
        byFactory.set(factory, Component);
      }
      return <Component {...props} />;
    };

    const factoryName = factory.name || 'Anonymous';
    WrappedComponent.displayName = `KeplerFactory(${factoryName})`;
    Wrapped = WrappedComponent;
    factoryToWrapperCache.set(factory, WrappedComponent);
  }
  return Wrapped as unknown as ReturnType<TFactory>;
}

/**
 * Stable access to Kepler factories. Prefer calling `get()` at module scope
 * (or in a constant initializer) so the returned component type is reused.
 */
export const KeplerInjector = {
  get<TFactory extends KeplerFactory>(factory: TFactory) {
    return getKeplerFactory(factory);
  }
};
