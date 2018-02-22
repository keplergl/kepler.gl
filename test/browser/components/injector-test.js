import React, {Component} from 'react';
import test from 'tape';
import {mount, shallow} from 'enzyme';
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
const initialCoreState = coreReducer(undefined, keplerGlInit());

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

  const myCutomNameFactory = () => () => <div>name</div>;
  const myCustomHeaderFactory = Name => () => (
    <div className="my-test-header-1">
      <Name />smoothie
    </div>
  );
  myCustomHeaderFactory.deps = [myCutomNameFactory];

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

  t.ok(spy.calledOnce, 'should call console.error once');
  t.equal(
    spy.getCall(0).args[0],
    errorMsg.noDep(myCutomNameFactory, myCustomHeaderFactory),
    'should warn when missing dependencies'
  );

  // test if custom header is still rendered
  t.ok(
    wrapper.find('.my-test-header-1').length,
    'should still render custom header'
  );

  spy.restore();
  t.end();
});

test('Components -> injector -> wrong factory type', t => {
  const spy = sinon.spy(Console, 'error');
  const myCustomHeaderFactory = () => () => (
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
      <KeplerGl id="foo" />
    </Provider>
  );

  t.ok(spy.calledOnce, 'should call console.error once');
  t.equal(
    spy.getCall(0).args[0],
    errorMsg.notFunc,
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
      <KeplerGl id="foo" />
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
