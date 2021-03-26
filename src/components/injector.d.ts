import {Component, FunctionComponent, FC} from 'react';

export const ERROR_MSG: {
  wrongRecipeType: string;
  noDep: (fac: any, parent: any) => string;
  noFunc: string;
};

export type FactoryElement = (...args) => Component;
export type Factory = FactoryElement & {
  deps: FactoryElement[];
}
export type InjectorType = {
  provide: (factory: any, replacement: any) => InjectorType;
  get: (fac: any, parent?: any) => any;
}

export const injector: (map?: Map) => InjectorType;

export type ProvideRecipesToInjectorType = (factories: Factory[], appInjector: InjectorType) => InjectorType;

export const provideRecipesToInjector: ProvideRecipesToInjectorType;

export const flattenDeps: (deps: Factory[], replacement: any) => Factory[];

export const withState: (lenses: any, mapStateToProps: (state: object) => object, actions: object) => (Component: Component<any> | FunctionComponent<any> | FC<any>) => Component;
