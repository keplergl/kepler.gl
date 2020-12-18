import {Component} from 'react';
import KeplerGlContext from 'components/context';

interface ContextSelector {
  (state: any, context: any): KeplerGlContext;
}

export default function withLocalSelector<P, S>(component: Component<P, S>): Component<P, S>;
