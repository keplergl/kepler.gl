// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './app';

function renderRoot({id, store, ele, onMounted}) {
  const Root = () => {
    useEffect(() => {
      // Call onMounted callback after component is mounted
      if (onMounted && typeof onMounted === 'function') {
        onMounted();
      }
    }, []);

    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

  ReactDOM.render(<Root />, ele);
}

export default renderRoot;
