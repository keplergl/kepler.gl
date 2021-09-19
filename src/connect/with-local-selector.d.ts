import {ComponentType} from 'react';
import KeplerGlContext from 'components/context';

interface ContextSelector {
  (state: any, context: any): KeplerGlContext;
}

export default function withLocalSelector(ParentComponent: ComponentType): ComponentType;
