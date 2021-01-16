// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import KeplerGl from 'kepler.gl';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

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
  panelActiveBg: '#f7f7F7'
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

function App(props) {
  const [customTheme, setTheme] = useState(false);
  const [windowDimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimension({width: window.innerWidth, height: window.innerHeight});
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        mapboxApiAccessToken={MAPBOX_TOKEN}
        id="map"
        /*
         * Specify path to keplerGl state, because it is not mount at the root
         */
        getState={state => state.demo.keplerGl}
        width={windowDimension.width}
        height={windowDimension.height}
        theme={customTheme ? theme : emptyTheme}
      />
    </div>
  );
  // }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
