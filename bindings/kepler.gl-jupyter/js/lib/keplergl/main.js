// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// NOTE: this is only used for exporting html template
import createAppStore from './store';
import renderRoot from './components/root';
import document from 'global/document';
import window from 'global/window';
import {addDataConfigToKeplerGl} from './kepler.gl';

const map = (function initKeplerGl() {
  const id = 'keplergl-0';
  const store = createAppStore();

  const divElmt = document.createElement('div');
  divElmt.setAttribute(
    'style',
    'width: 100vw; height: 100vh; position: absolute'
  );
  document.body.appendChild(divElmt);

  return {
    render: () => {
      renderRoot({id, store, ele: divElmt});
    },
    store
  };
})();

map.render();

(function loadDataConfig(keplerGlMap) {
  const {data, config, options} = window.__keplerglDataConfig || {};
  addDataConfigToKeplerGl({data, config, options, store: keplerGlMap.store});
})(map);
