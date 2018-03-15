// import 'babel-polyfill';
// import 'babel-register';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './reducers';
import Routes from './routes';
import document from 'global/document';

require('./static/favicon.png');

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  el
);
