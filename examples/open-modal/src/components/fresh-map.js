// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import KeplerGl from '@kepler.gl/components';

import sampleData from '../data/sample-data';
import config from '../configurations/config';

const FreshMap = ({mapboxApiAccessToken, id}) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  useEffect(() => {
    dispatch(
      wrapTo(
        id,
        addDataToMap({
          datasets: sampleData,
          options: {centerMap: true},
          config
        })
      )
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      />
    </div>
  );
};

export default FreshMap;
