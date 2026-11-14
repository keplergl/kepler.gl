// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, render, fireEvent} from '@testing-library/react';
import {combineReducers, createStore} from 'redux';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {MapStateActions, VisStateActions} from '@kepler.gl/actions';
import {INITIAL_MAP_STATE, mapStateReducer, visStateReducer} from '@kepler.gl/reducers';
import {LIGHT_AND_SHADOW_EFFECT, LIGHT_AND_SHADOW_EFFECT_TIME_MODES} from '@kepler.gl/constants';
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

test('Components -> EffectManager -> Light & Shadow follows camera changes through memoization', t => {
  const effect = StateWEffects.visState.effects
    .find(item => item.type === LIGHT_AND_SHADOW_EFFECT.type)
    .clone();
  effect.setProps({
    isEnabled: true,
    isConfigActive: true,
    parameters: {
      timestamp: Date.UTC(2026, 5, 21, 12),
      timezone: 'UTC',
      timeMode: LIGHT_AND_SHADOW_EFFECT_TIME_MODES.pick
    }
  });
  const effects = [effect];
  const store = createStore(
    combineReducers({visState: visStateReducer, mapState: mapStateReducer}),
    {
      visState: {...StateWEffects.visState, effects, effectOrder: [effect.id]},
      mapState: {...INITIAL_MAP_STATE, latitude: 0, longitude: 0}
    }
  );
  let listRenders = 0;
  const List = props => {
    listRenders++;
    return <EffectList {...props} />;
  };
  const Manager = EffectManagerFactory(List, SidePanelTitle, EffectTypeSelector);
  const view = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IntlWrapper>
          <Manager />
        </IntlWrapper>
      </ThemeProvider>
    </Provider>,
    {baseElement: document.createElement('div')}
  );
  const readTimes = () =>
    Array.from(
      view.container.querySelectorAll('.bottom_icon__sunrise, .bottom_icon__sunset'),
      node => node.textContent
    );
  const initialTimes = readTimes();
  const initialRenders = listRenders;
  t.equal(initialTimes.length, 2, 'shows sunrise and sunset times');

  act(() => store.dispatch(MapStateActions.updateMap({longitude: 30})));
  const longitudeTimes = readTimes();
  t.notDeepEqual(longitudeTimes, initialTimes, 'longitude changes update the day/night indicator');
  act(() => store.dispatch(MapStateActions.updateMap({latitude: 50})));
  t.notDeepEqual(readTimes(), longitudeTimes, 'latitude changes update the day/night indicator');
  act(() => store.dispatch(MapStateActions.updateMap({latitude: 0, longitude: 0})));
  t.deepEqual(readTimes(), initialTimes, 'returning to the original location restores its times');
  t.equal(store.getState().visState.effects, effects, 'camera updates preserve the effects input');
  t.equal(
    listRenders,
    initialRenders,
    'the subscribed indicator updates without rerendering the list'
  );
  view.unmount();
  t.end();
});
