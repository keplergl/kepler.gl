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

import React, {Component} from 'react';

// Modal aesthetics
import {ThemeProvider, withTheme} from 'styled-components';
import RenderSettingsModal from './render-settings-modal';
import {Button} from 'components/common/styled-components';

// Redux stores/actions
import {connect as keplerGlConnect} from 'connect/keplergl-connect';
import {toggleHubbleExportModal} from 'kepler.gl/actions';

function mapStateToProps(state = {}, props) {
    return { // TODO unsure if other redux stores are needed atm
    //   ...props,
    //   visState: state.visState,
    //   mapStyle: state.mapStyle,
    //   mapState: state.mapState,
      uiState: state.uiState,
    //   providerState: state.providerState,
    };
}

// noResultDispatch returns nothing in this case. Undefined if console.log
// because we're using Kepler's connect (wrapper of Redux connect) it has 2 dispatches
// the code can be found from ../connect/keplergl-connect
const mapDispatchToProps = () => (noResultDispatch, ownProps, dispatch) => {	
    return {
        toggleHubbleExportModal: (isOpen) => dispatch(toggleHubbleExportModal(isOpen)), // NOTE gives dispatch error
    }
}	

class HubbleExport extends Component {
    handleClose() {this.props.toggleHubbleExportModal(false)} // X button in Modal UI was clicked
    handleExport() {this.props.toggleHubbleExportModal(true)} // Export button in Kepler UI was clicked

    render() {
        return (
            <div>
                <RenderSettingsModal isOpen={this.props.uiState.hubbleExportModalOpen} handleClose={this.handleClose.bind(this)} />
                <ThemeProvider theme={RenderSettingsModal}></ThemeProvider>
                <Button onClick={() => this.handleExport()}>Export</Button> {/* anonymous function to bind state onclick  */}
            </div>
        )
    }
};

// keplerGlConnect is a wrapper of Redux's standard connect except with access to Kepler's Redux store
export default keplerGlConnect(mapStateToProps, mapDispatchToProps)(withTheme(HubbleExport));