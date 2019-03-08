// Copyright (c) 2019 Uber Technologies, Inc.
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

import React from 'react';
import test from 'tape';
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import sinon from 'sinon';
import {console as Console} from 'global/window';

import {withState, injectComponents, PanelHeaderFactory} from 'components';
import coreReducer from 'reducers/core';
import {keplerGlInit} from 'actions/actions';
import {errorMsg} from 'components/injector';
import {visStateLens, uiStateLens, mapStateLens, mapStyleLens} from 'reducers';

const mockStore = configureStore();
const initialCoreState = coreReducer(undefined, keplerGlInit({}));

test('Components -> injector -> injectComponents', t => {
  const CustomHeader = () => <div className="my-test-header">smoothie</div>;
  const myCustomHeaderFactory = () => CustomHeader;

  const KeplerGl = injectComponents([
    [PanelHeaderFactory, myCustomHeaderFactory]
  ]);

  // assume instance reducer is already mounted
  const store = mockStore({
    keplerGl: {
      foo: initialCoreState
    }
  });

  const wrapper = mount(
    <Provider store={store}>
      <KeplerGl id="foo" />
    </Provider>
  );

  // test if custom header is rendered
  t.ok(wrapper.find('.my-test-header').length, 'should render custome header');
  t.end();
});

test('Components -> injector -> missing deps', t => {
  const spy = sinon.spy(Console, 'error');

  const myCustomNameFactory = () => () => <div className="my-test-header-name">name</div>;
  const myCustomHeaderFactory = Name => () => (
    <div className="my-test-header-1">
      <Name />smoothie
    </div>
  );
  myCustomHeaderFactory.deps = [myCustomNameFactory];

  const KeplerGl = injectComponents([
    [PanelHeaderFactory, myCustomHeaderFactory]
  ]);

  // assume instance reducer is already mounted
  const store = mockStore({
    keplerGl: {
      foo: initialCoreState
    }
  });

  const wrapper = mount(
    <Provider store={store}>
      <KeplerGl id="foo" mapboxApiAccessToken="smoothie_and_milkshake"/>
    </Provider>
  );

  t.ok(spy.notCalled, 'Should automatically add custom deps and not call console.error');

  t.ok(
    wrapper.find('.my-test-header-name').length,
    'should still render custom header name'
  );

  spy.restore();
  t.end();
});

test('Components -> injector -> wrong factory type', t => {
  const spy = sinon.spy(Console, 'error');
  // const spy = sinon.spy(Console, 'error');
  const myCustomHeaderFactory = Name => () => (
    <div className="my-test-header-2">
      <Name />smoothie
    </div>
  );

  const KeplerGl = injectComponents([
    [undefined, myCustomHeaderFactory]
  ]);

  // assume instance reducer is already mounted
  const store = mockStore({
    keplerGl: {
      foo: initialCoreState
    }
  });

  const wrapper = mount(
    <Provider store={store}>
      <KeplerGl id="foo" mapboxApiAccessToken="smoothie_and_milkshake"/>
    </Provider>
  );

  t.ok(spy.calledTwice, 'should call console.error twice');
  t.equal(
    spy.getCall(0).args[0],
    'Error injecting factory: ',
    'should warn when cannot find kepler.gl state'
  );

  // test if custom header is rendered
  t.ok(wrapper.find('.side-panel__panel-header').length, 'should render default header');

  spy.restore();
  t.end();
});

test('Components -> injector -> withState', t => {
  const CustomHeader = ({visState}) => (
    <div className="my-test-header-3">smoothie</div>
  );
  const myCustomHeaderFactory = () =>
    withState(
      [visStateLens, mapStateLens, uiStateLens, mapStyleLens]
    )(CustomHeader);

  const KeplerGl = injectComponents([
    [PanelHeaderFactory, myCustomHeaderFactory]
  ]);

  // assume instance reducer is already mounted
  const store = mockStore({
    keplerGl: {
      foo: initialCoreState
    }
  });

  const wrapper = mount(
    <Provider store={store}>
      <KeplerGl id="foo" mapboxApiAccessToken="smoothie_and_milkshake"/>
    </Provider>
  );

  // test if custom header is rendered
  t.ok(
    wrapper
      .find(CustomHeader)
      .at(0)
      .props().visState,
    'should add visState to props'
  );
  t.ok(
    wrapper
      .find(CustomHeader)
      .at(0)
      .props().mapState,
    'should add mapState to props'
  );
  t.ok(
    wrapper
      .find(CustomHeader)
      .at(0)
      .props().mapStyle,
    'should add mapStyle to props'
  );
  t.ok(
    wrapper
      .find(CustomHeader)
      .at(0)
      .props().uiState,
    'should add uiState to props'
  );

  t.end();
});
