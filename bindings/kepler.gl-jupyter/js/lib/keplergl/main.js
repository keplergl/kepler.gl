// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// NOTE: this is only used for exporting html template
import createAppStore from './store';
import renderRoot from './components/root';
import document from 'global/document';

const map = (function initKeplerGl() {
  const id = 'keplergl-0';
  const store = createAppStore();

  const divElmt = document.createElement('div');
  divElmt.setAttribute('style', 'width: 100vw; height: 100vh; position: absolute');
  document.body.appendChild(divElmt);

  return {
    render: () => {
      // Data loading is now handled inside renderRoot via useEffect
      // This ensures Redux Provider subscriptions are active before dispatching
      renderRoot({id, store, ele: divElmt});
    },
    store
  };
})();

map.render();
