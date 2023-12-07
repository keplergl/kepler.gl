// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import keplerGlReducer, {enhanceReduxMiddleware} from '@kepler.gl/reducers';

const mapStyles = {
  voyager: {
    id: 'voyager',
    label: 'Voyager',
    url: 'https://api.maptiler.com/maps/voyager/style.json?key=ySQ0fIYn7eSl3ppOeEJd',
    icon: 'https://api.maptiler.com/maps/voyager/256/0/0/0.png?key=ySQ0fIYn7eSl3ppOeEJd'
  },
  terrain: {
    id: 'terrain',
    label: 'Outdoor',
    url: 'https://api.maptiler.com/maps/outdoor/style.json?key=ySQ0fIYn7eSl3ppOeEJd',
    icon: 'https://openmaptiles.org/img/styles/terrain.jpg',
    layerGroups: [
      {
        slug: 'label',
        filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
        defaultVisibility: true
      },
      {
        slug: 'road',
        filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
        defaultVisibility: true
      },
      {
        slug: 'terrain',
        filter: ({id}) => id.match(/(?=(hillshade))/),
        defaultVisibility: true
      },
      {
        slug: 'building',
        filter: ({id}) => id.match(/building/),
        defaultVisibility: true
      }
    ]
  }
};
const customizedKeplerGlReducer = keplerGlReducer.initialState({
  mapStyle: {
    mapStyles,
    styleType: 'voyager'
  }
});

const reducers = combineReducers({
  keplerGl: customizedKeplerGlReducer
});

const middlewares = enhanceReduxMiddleware([]);
const enhancers = [applyMiddleware(...middlewares)];

export default createStore(reducers, {}, compose(...enhancers));
