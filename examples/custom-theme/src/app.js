// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, {Component} from 'react';
import {ThemeProvider}  from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';

import KeplerGl from 'kepler.gl';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const customTheme = {
  panelBackground: '#f48f42',
  tooltipBg: '#f48f42',
  notificationColors: {
    info: '#D3D8E0',
    error: '#f25138',
    success: '#47b275',
    warning: '#ffc043'
  }
};

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentWillMount() {
    // event listeners
    window.addEventListener('resize', this._onResize);

    this._onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  render() {
    const {width, height} = this.state;
    return (
      <ThemeProvider theme={customTheme}>
        <KeplerGl
          mapboxApiAccessToken={MAPBOX_TOKEN}
          id="map"
          /*
           * Specify path to keplerGl state, because it is not mount at the root
           */
          getState={state => state.demo.keplerGl}
          width={width}
          height={height}
        />
      </ThemeProvider>

    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  dispatchToProps
)(App);
