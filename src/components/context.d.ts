import {createContext, RefType} from 'react';

export const RootContext = createContext<RefType<any> | null>(null);

const KeplerGlContext = createContext({
  selector: state => state,
  id: 'map'
});

export default KeplerGlContext;
