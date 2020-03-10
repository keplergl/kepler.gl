// Copyright (c) 2020 Uber Technologies, Inc.
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
import styled, {ThemeProvider} from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import KeplerGl from 'kepler.gl';
import {Button} from 'kepler.gl/components';
import {generateMapImage} from 'kepler.gl/actions';
import {theme as keplerTheme} from 'kepler.gl/styles';
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const ActionPanel = styled.div.attrs({
  className: 'action-panel'
})`
  position: absolute;
  z-index: 1000;
  bottom: 10px;
  right: 10px;
  background-color: ${keplerTheme.panelBackground};
  padding: 10px;
`;

function App(props) {
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

  const onDownloadImage = () => {
    props.dispatch(generateMapImage());
  };

  return (
    <ThemeProvider theme={keplerTheme}>
      <div>
        <ActionPanel>
          <Button onClick={onDownloadImage}>Download Map Image</Button>
        </ActionPanel>
        <KeplerGl
          mapboxApiAccessToken={MAPBOX_TOKEN}
          id="map"
          /*
           * Specify path to keplerGl state, because it is not mount at the root
           */
          width={windowDimension.width}
          height={windowDimension.height}
        />
      </div>
    </ThemeProvider>
  );
  // }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
