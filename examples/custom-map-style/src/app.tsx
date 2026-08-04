// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import * as React from 'react';
import {useState, useEffect} from 'react';
import KeplerGl from '@kepler.gl/components';

const localeMessages = {
  en: {
    mapLayers: {
      terrain: 'Terrain'
    }
  }
};

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
  const {width, height} = useWindowSize();
  return (
    <KeplerGl
      mapboxApiAccessToken=""
      id="map"
      width={width}
      height={height}
      localeMessages={localeMessages}
    />
  );
};

export default App;
