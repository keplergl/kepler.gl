// Copyright (c) 2018 Uber Technologies, Inc.
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
import {connect} from 'react-redux';
import styled from 'styled-components';
import window from 'global/window';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {receivePostMessage} from './actions';

import {AddDataButtonFactory, ExportConfigModalFactory, PanelHeaderFactory} from 'kepler.gl/components';

import ExportConfigButtonFactory from './components/export-config-button';
import CustomExportConfigModalFactory from './components/export-config-modal';
import CustomPanelHeaderFactory from './components/panel-header';

const KeplerGl = require('kepler.gl/components').injectComponents([
  [AddDataButtonFactory, ExportConfigButtonFactory],
  [ExportConfigModalFactory, CustomExportConfigModalFactory],
  [PanelHeaderFactory, CustomPanelHeaderFactory]
]);

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Sample data
import sampleData from './data/sample-data';
import sampleConfig from './configurations/config.json';

/* eslint-disable no-unused-vars */
import keplerglJson from './data/keplergl.json';
import {addDataToMap, resetMapConfig} from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const GlobalStyleDiv = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
`;

class App extends Component {

  componentDidMount() {
    // load sample msg for testing
    // this._testReceiveJupyterMsg();
    // this._receiveKeplerglJson(keplerglJson);
    // window.setTimeout(this._testClearJupyterMsg, 2000);
    window.addEventListener('message', this._msgHandler);
  }

  _receiveKeplerglJson(keplerJson) {
    const data = Processors.processKeplerglJSON(keplerJson);
    this.props.dispatch(addDataToMap(data));
  }

  _testReceiveJupyterMsg = () => {
    const jupyterData = {
      data: [{
        id: 'hex_data',
        data: sampleData
      }],

      // config is optional
      config: sampleConfig
    };

    this.props.dispatch(receivePostMessage(jupyterData));
  }

  _testClearJupyterMsg = () => {
    this._msgHandler({
      data: {clear: true}
    })
  }

  _msgHandler = (e) => {
    // if jupyter is suppose to send a config or a data
    if (e.data.clear) {
      this.props.dispatch(resetMapConfig());
    }

    if (e.data.config || e.data.data) {
      this.props.dispatch(receivePostMessage(e.data));
    } else if (e.data.map) {
      this._receiveKeplerglJson(e.data.map);
    }
  }

  componentWillUnMount() {
    // for workbench integration
    window.removeEventListener('message', this._msgHandler);
  }

  render() {
    return (
      <GlobalStyleDiv>
        <div style={{position: 'absolute', width: '100%', height: '100%'}}>
          <AutoSizer>
            {({height, width}) => (
              <KeplerGl
                mapboxApiAccessToken={MAPBOX_TOKEN}
                width={width}
                height={height}
                appName="Jupyter Voyager"
                version="1.0.4"
              />
            )}
          </AutoSizer>
        </div>
      </GlobalStyleDiv>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
