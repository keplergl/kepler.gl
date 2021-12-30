import {Component} from 'react';
import {InjectorType, ProvideRecipesToInjectorType} from './injector';

export const appInjector: InjectorType;

export const injectComponents: (recipes: any[]) => ProvideRecipesToInjectorType;

export const ContainerFactory: (KeplerGl: Component) => Component;
