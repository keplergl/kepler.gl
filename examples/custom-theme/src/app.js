// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import KeplerGl from '@kepler.gl/components';

const theme = {
  sidePanelBg: '#ffffff',
  titleTextColor: '#000000',
  sidePanelHeaderBg: '#f7f7F7',
  subtextColorActive: '#2473bd',
  tooltipBg: '#1869b5',
  tooltipColor: '#ffffff',
  dropdownListBgd: '#ffffff',
  textColorHl: '#2473bd',
  inputBgd: '#f7f7f7',
  inputBgdHover: '#ffffff',
  inputBgdActive: '#ffffff',
  dropdownListHighlightBg: '#f0f0f0',
  panelBackground: '#f7f7F7',
  panelBackgroundHover: '#f7f7F7',
  secondaryInputBgd: '#f7f7F7',
  secondaryInputBgdActive: '#f7f7F7',
  secondaryInputBgdHover: '#ffffff',
  panelActiveBg: '#f7f7F7',
  // Map control buttons (top-right) use floatingBtn* tokens
  floatingBtnBgd: '#F7F7F7',
  floatingBtnActBgd: '#F7F7F7',
  floatingBtnBgdHover: '#F7F7F7',
  floatingBtnColor: '#6A7485',
  floatingBtnActColor: '#2473bd',
  mapPanelBackgroundColor: '#FFFFFF',
  mapPanelHeaderBackgroundColor: '#F7F7F7',
  toolbarItemBgdHover: '#F7F7F7',
  toolbarItemIconHover: '#2473bd'
};

const emptyTheme = {};

const StyleSwitch = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  background-color: whitesmoke;
  padding: 4px;
  z-index: 1000;
  border-radius: 3px;
  border: 1px solid mediumseagreen;
`;

function useWindowSize() {
  const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight});
  useEffect(() => {
    const onResize = () => setSize({width: window.innerWidth, height: window.innerHeight});
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

function App() {
  const [customTheme, setTheme] = useState(false);
  const {width, height} = useWindowSize();

  return (
    <div>
      <StyleSwitch>
        <label htmlFor="custom-theme">Custom theme</label>
        <input
          type="checkbox"
          checked={customTheme}
          id="custom-theme"
          onChange={e => setTheme(e.target.checked)}
        />
      </StyleSwitch>
      <KeplerGl
        mapboxApiAccessToken="pk.xxx.yyy"
        id="map"
        getState={state => state.demo.keplerGl}
        width={width}
        height={height}
        theme={customTheme ? theme : emptyTheme}
      />
    </div>
  );
}

export default App;
