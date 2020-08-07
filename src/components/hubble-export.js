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
import {theme} from '../styles';

// Redux stores/actions
import {connect as keplerGlConnect} from 'connect/keplergl-connect';
import {toggleHubbleExportModal} from 'kepler.gl/actions';
import {connect} from 'react-redux';

// TODO this isn't DRY. Comes from https://github.com/keplergl/kepler.gl/blob/995024e86880fefb0624af4ed1e98d3879558336/src/components/kepler-gl.js
function mapStateToProps(state = {}, props) {
    return {
    //   ...props,
    //   visState: state.visState,
    //   mapStyle: state.mapStyle,
    //   mapState: state.mapState,
      uiState: state.uiState,
    //   providerState: state.providerState,
    };
}

// noResultDispatch returns nothing in this case. Undefined if console.log
// Because we're using Kepler's connect (wrapper of Redux connect) this argument format comes from ../connect/keplergl-connect
const mapDispatchToProps = () => (noResultDispatch, ownProps, dispatch) => {	
    return {
        toggleHubbleExportModal: (isOpen) => dispatch(toggleHubbleExportModal(isOpen)), // NOTE gives dispatch error
    }
}	

class HubbleExport extends Component {
    handleClose() {this.setState({isOpen: false})} // X button in Modal UI was clicked

    handleExport() { // Export button in Kepler UI was clicked
        console.log("handleExport this.props", this.props)
        this.props.toggleHubbleExportModal(true)
        // this.props.toggleHubbleExportModal({hubbleExportModalOpen: true})
        // this.setState(state => ({
        //     isOpen: true
        //   }));
        // stop rendering in bg
        // setState
        // pop up modal if isOpen. If false, closes modal TODO put function into render
        // all the data is passed through and can use in deck/hubble components
    }

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

export default keplerGlConnect(mapStateToProps, mapDispatchToProps)(withTheme(HubbleExport));
// export default connect(mapStateToProps, makeMapDispatchToProps)(withTheme(HubbleExport));
// export default connect(mapStateToProps, makeMapDispatchToProps)(HubbleExport);

