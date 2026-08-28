// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useRef, useState} from 'react';
import KeplerGl from '@kepler.gl/components';

const SavedMap = ({mapboxApiAccessToken, id}) => {
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
    <div ref={containerRef} style={{width: '100%', height: '100%'}}>
      <KeplerGl
        mapboxApiAccessToken={mapboxApiAccessToken}
        id={id}
        width={dimensions.width}
        height={dimensions.height}
        mint={false}
      />
    </div>
  );
};

export default SavedMap;
