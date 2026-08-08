// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addDataToMap, wrapTo} from '@kepler.gl/actions';
import styled from 'styled-components';
import {theme} from '@kepler.gl/styles';

import sampleData, {config} from './data/sample-data';

const MAPBOX_TOKEN = process.env.MapboxAccessToken || 'pk.xxx.yyy'; // eslint-disable-line

import {
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  CustomPanelsFactory,
  MapPopoverFactory,
  injectComponents
} from '@kepler.gl/components';

import CustomPanelHeaderFactory from './components/panel-header';
import CustomSidebarFactory from './components/side-bar';
import CustomPanelToggleFactory from './components/panel-toggle';
import CustomSidePanelFactory from './components/custom-panel';
import CustomMapPopoverFactory from './components/custom-map-popover';

const StyledMapConfigDisplay = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 10px;
  right: 10px;
  background-color: ${theme.sidePanelBg};
  font-size: 11px;
  width: 300px;
  color: ${theme.textColor};
  word-wrap: break-word;
  min-height: 60px;
  padding: 10px;
`;

// Inject custom components
const KeplerGl = injectComponents([
  [SidebarFactory, CustomSidebarFactory],
  [PanelHeaderFactory, CustomPanelHeaderFactory],
  [PanelToggleFactory, CustomPanelToggleFactory],
  [CustomPanelsFactory, CustomSidePanelFactory],
  [MapPopoverFactory, CustomMapPopoverFactory]
]);

const App = () => {
  const dispatch = useDispatch();
  const mapConfig = useSelector(state => state.app.mapConfig);

  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  useEffect(() => {
    dispatch(wrapTo('map1', addDataToMap({datasets: sampleData, config})));
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
    <div ref={containerRef} style={{position: 'absolute', width: '100%', height: '100%'}}>
      <KeplerGl
        mapboxApiAccessToken={MAPBOX_TOKEN}
        id="map1"
        width={dimensions.width}
        height={dimensions.height}
      />
      <StyledMapConfigDisplay>
        {mapConfig ? JSON.stringify(mapConfig) : 'Click Save Config to Display Config Here'}
      </StyledMapConfigDisplay>
    </div>
  );
};

export default App;
