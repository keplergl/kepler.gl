// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, render, fireEvent} from '@testing-library/react';
import {createStore} from 'redux';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {VisStateActions} from '@kepler.gl/actions';
import {visStateReducer} from '@kepler.gl/reducers';
import test from 'tape';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import {
  EffectManagerFactory,
  EffectListFactory,
  SidePanelTitleFactory,
  EffectTypeSelectorFactory,
  appInjector
} from '@kepler.gl/components';

import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';
import {StateWEffects} from 'test/helpers/mock-state';

const EffectManager = appInjector.get(EffectManagerFactory);
const EffectList = appInjector.get(EffectListFactory);
const SidePanelTitle = appInjector.get(SidePanelTitleFactory);
const EffectTypeSelector = appInjector.get(EffectTypeSelectorFactory);

const mockStore = configureStore();
const initialState = {
  visState: {
    effects: StateWEffects.visState.effects,
    effectOrder: StateWEffects.visState.effectOrder
  },
  mapState: {latitude: 0, longitude: 0}
};

test('Components -> EffectManager -> render', t => {
  const store = mockStore(initialState);

  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Provider store={store}>
          <EffectManager />
        </Provider>
      </IntlWrapper>
    );
  }, 'EffectManager should not fail');

  t.equal(wrapper.find(EffectList).length, 1, 'should render EffectList');
  t.equal(wrapper.find(SidePanelTitle).length, 1, 'should render SidePanelTitle');
  t.equal(wrapper.find(EffectTypeSelector).length, 1, 'should render EffectTypeSelector');
  t.equal(wrapper.find('EffectPanel').length, 4, 'should render 3 EffectPanels');

  t.end();
});

test('Components -> EffectManager -> isolates pointer updates and preserves effect changes', t => {
  const fixtureFlags = StateWEffects.visState.effects.map(({isEnabled, isConfigActive}) => ({
    isEnabled,
    isConfigActive
  }));
  let renders = 0;
  const List = ({effects, effectOrder, visStateActions}) => {
    renders++;
    return (
      <div>
        <output>{effectOrder.join(',')}</output>
        {effects.map(effect => (
          <button
            key={effect.id}
            onClick={() => visStateActions.updateEffect(effect.id, {isEnabled: false})}
          >
            {effect.id}:{String(effect.isEnabled)}
          </button>
        ))}
      </div>
    );
  };
  const Manager = EffectManagerFactory(
    List,
    ({children}) => <div>{children}</div>,
    () => null
  );
  const storeVisState = {
    ...StateWEffects.visState,
    effects: StateWEffects.visState.effects.map(effect => effect.clone())
  };
  const store = createStore((state = {visState: storeVisState}, action) => ({
    visState: action.type === 'replace' ? action.visState : visStateReducer(state.visState, action)
  }));
  const tree = (props = {}) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntlWrapper>
          <Manager {...props} />
        </IntlWrapper>
      </ThemeProvider>
    </Provider>
  );
  const view = render(tree(), {baseElement: document.createElement('div')});
  t.equal(renders, 1, 'renders effects once');
  view.rerender(tree());
  act(() => store.dispatch(VisStateActions.onMouseMove({point: [10, 20], lngLat: [1, 2]})));
  t.equal(renders, 1, 'ignores parent and unrelated visualization updates');
  const first = store.getState().visState.effects[0];
  fireEvent.click(view.getByText(`${first.id}:${String(first.isEnabled)}`));
  t.ok(view.getByText(`${first.id}:false`), 'updates an effect through the current callback');
  const [lighting, ...sortable] = store.getState().visState.effectOrder;
  const order = [lighting, ...sortable.reverse()];
  act(() => store.dispatch(VisStateActions.reorderEffect(order)));
  t.equal(
    view.container.querySelector('output').textContent,
    order.join(','),
    'updates order independently of effect objects'
  );
  act(() => store.dispatch(VisStateActions.removeEffect(first.id)));
  t.equal(view.queryByText(`${first.id}:false`), null, 'removes an effect');

  const visState = {...StateWEffects.visState, effects: [], effectOrder: []};
  view.rerender(tree({visState}));
  const beforeOverride = renders;
  act(() => store.dispatch(VisStateActions.addEffect({type: 'brightnessContrast'})));
  t.equal(renders, beforeOverride, 'explicit state is independent of store effects');
  t.equal(view.queryByRole('button'), null, 'renders explicit empty state');
  view.rerender(tree({visState: StateWEffects.visState}));
  t.equal(
    view.getAllByRole('button').length,
    StateWEffects.visState.effects.length,
    'replaces explicit effects'
  );
  view.rerender(tree());
  act(() => store.dispatch({type: 'replace', visState: {}}));
  t.equal(view.queryByRole('button'), null, 'handles missing effects');
  act(() => store.dispatch({type: 'replace', visState: StateWEffects.visState}));
  t.equal(
    view.getAllByRole('button').length,
    StateWEffects.visState.effects.length,
    'hydrates missing state'
  );
  view.unmount();
  t.deepEqual(
    StateWEffects.visState.effects.map(({isEnabled, isConfigActive}) => ({
      isEnabled,
      isConfigActive
    })),
    fixtureFlags,
    'effect actions preserve the shared fixture flags'
  );
  t.end();
});
