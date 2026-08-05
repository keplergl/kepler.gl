// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import KeplerGl from '@kepler.gl/components';

const MAPBOX_TOKEN = process.env.MapboxAccessToken || 'pk.xxx.yyy'; // eslint-disable-line

const StyledWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
`;

const App = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const {width, height} = entries[0].contentRect;
      setDimensions({width, height});
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <StyledWrapper ref={containerRef}>
      <KeplerGl
        mapboxApiAccessToken={MAPBOX_TOKEN}
        id="map1"
        width={dimensions.width}
        height={dimensions.height}
      />
    </StyledWrapper>
  );
};

export default App;
