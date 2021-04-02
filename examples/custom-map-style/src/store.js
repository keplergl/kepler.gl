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

import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import keplerGlReducer from 'kepler.gl/reducers';
import {enhanceReduxMiddleware} from 'kepler.gl/middleware';

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
