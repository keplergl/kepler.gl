// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import KeplerGl from '@kepler.gl/components';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';

import sampleData from './data/sample-data';
import config from './configurations/config';

// Extra action handled by the custom kepler.gl reducer plugin (see store.js)
const hideAndShowSidePanel = () => ({type: 'HIDE_AND_SHOW_SIDE_PANEL'});

function useWindowSize() {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  useEffect(() => {
    const onResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

const App = () => {
  const dispatch = useDispatch();
  const {width, height} = useWindowSize();

  useEffect(() => {
    dispatch(wrapTo('map1', addDataToMap({datasets: sampleData, config})));
  }, [dispatch]);

  return (
    <div style={{position: 'absolute', width: '100%', height: '100%'}}>
      <button onClick={() => dispatch(wrapTo('map1', hideAndShowSidePanel()))}>
        Hide / Show Side Panel
      </button>
      <KeplerGl mapboxApiAccessToken="pk.xxx.yyy" id="map1" width={width} height={height - 30} />
    </div>
  );
};

export default App;
