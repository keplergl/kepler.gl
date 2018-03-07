import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import store from './reducers';

import Home from './components/home';
import App from './components/app';

// eslint-disable-next-line react/display-name
export default () => (
  <Router history={syncHistoryWithStore(browserHistory, store)}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
    </Route>
  </Router>
);
