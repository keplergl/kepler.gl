// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';

import Modal from 'react-modal';
import {showModal} from './app-reducer';
import sampleData from './data/sample-data';

import FreshMap from './components/fresh-map';
import SavedMap from './components/saved-map';

const MAPBOX_TOKEN = process.env.MapboxAccessToken || 'pk.xxx.yyy'; // eslint-disable-line

const App = () => {
  const dispatch = useDispatch();
  const modal = useSelector(state => state.app.modal);
  const barMap = useSelector(state => state.keplerGl.bar);

  useEffect(() => {
    if (barMap) {
      dispatch(
        wrapTo(
          'bar',
          addDataToMap({
            datasets: sampleData,
            options: {centerMap: true},
            config: {mapStyle: {styleType: 'dark-matter'}}
          })
        )
      );
    }
  }, [!!barMap]); // eslint-disable-line react-hooks/exhaustive-deps

  const _closeModal = () => dispatch(showModal(null));
  const _openModal = id => dispatch(showModal(id));

  return (
    <div style={{position: 'absolute', width: '100%', height: '100%'}}>
      <button onClick={() => _openModal('foo')}>Show Kepler.gl id: foo</button>
      <button onClick={() => _openModal('bar')}>Show Kepler.gl id: bar</button>

      <Modal isOpen={modal === 'foo'}>
        <div>
          This Kepler.gl component will always load a fresh state when re mounted, state inside this
          component will be destroyed once its unmounted.
        </div>
        <button onClick={_closeModal}>Close</button>
        <FreshMap mapboxApiAccessToken={MAPBOX_TOKEN} id="foo" />
      </Modal>

      <Modal isOpen={modal === 'bar'}>
        By passing in mint: false, This Kepler.gl instance will keep the state of "bar" even when it
        is unmounted.
        <button onClick={_closeModal}>Close</button>
        <SavedMap mapboxApiAccessToken={MAPBOX_TOKEN} id="bar" />
      </Modal>
    </div>
  );
};

export default App;
