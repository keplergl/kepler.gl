// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import { Provider } from 'react-redux';
import { createStore as reduxCreateStore } from 'redux';
import rootReducer from '.';

const createStore = () => reduxCreateStore(rootReducer);

// Wraps the root-component in Gatsby
export default ({ element }) => (
  <Provider store={createStore()}>{element}</Provider>
);
