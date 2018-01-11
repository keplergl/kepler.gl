import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import store from './store';

const Root = () => (
  <Provider store={store}>
    <div>
      <Container/>
    </div>
  </Provider>
);

render(<Root />, document.body.appendChild(document.createElement('div')));