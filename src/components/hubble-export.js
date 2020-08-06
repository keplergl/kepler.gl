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
import { bindActionCreators } from 'redux';

const boundtoggleHubbleExportModal = bindActionCreators(toggleHubbleExportModal)


// TODO this isn't DRY. Comes from https://github.com/keplergl/kepler.gl/blob/995024e86880fefb0624af4ed1e98d3879558336/src/components/kepler-gl.js
function mapStateToProps(state = {}, props) {
    return {
      ...props,
      visState: state.visState,
      mapStyle: state.mapStyle,
      mapState: state.mapState,
      uiState: state.uiState,
      providerState: state.providerState,
      toggleHubbleExportModal: state.uiState // NOTE is this the proper import? Imports state rather than fn
    };
}
// const mapStateToProps = (state, props) => ({state,  ...props});


function makeMapDispatchToProps() {
    // const getActionCreators = makeGetActionCreators();
    const mapDispatchToProps = (dispatch, ownProps) => {
    //   const groupedActionCreators = getActionCreators(dispatch, ownProps);
      
      return {
        toggleHubbleExportModal: (isOpen) => dispatch(toggleHubbleExportModal(isOpen)), // NOTE gives dispatch error
        // toggleHubbleExportModal: (isOpen) => toggleHubbleExportModal(isOpen),
        // toggleHubbleExportModal: (isOpen) => {dispatch({type: 'TOGGLE_HUBBLE_EXPORT_MODAL', hubbleExportModalOpen: isOpen})},
        // bindActionCreators({toggleHubbleExportModal}, dispatch){}, // NOTE possibly wrong but doesn't give dispatch error
        //   TODO Put action creator and return here
        // ...groupedActionCreators,
        dispatch
      };
    };
  
    return mapDispatchToProps;
}

// const mapStateToProps = (state, props) => ({state, ...props});
// const mapDispatchToProps = (dispatch) => {
//     return {
//         dispatch,
//         toggleHubbleExportModal: (isOpen) => {dispatch({type: 'TOGGLE_HUBBLE_EXPORT_MODAL', hubbleExportModalOpen: isOpen})}
//     }
// };

class HubbleExport extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         isOpen: false
    //     };
    // }
    handleClose() {this.setState({isOpen: false})} // X button in Modal UI was clicked

    handleExport() { // Export button in Kepler UI was clicked
        console.log("handleExport this.props", this.props)
        this.props.toggleHubbleExportModal({isOpen: true})
        // this.props.toggleHubbleExportModal({hubbleExportModalOpen: true})
        // this.setState(state => ({
        //     isOpen: true
        //   }));
        // stop rendering in bg
        // setState
        // pop up modal if isOpen. If false, closes modal TODO put function into render
        // all the data is passed through and can use in deck/hubble components
        return <h1>REACHED</h1>
    }

    render() {
        // const {uiState} = this.props
        // console.log("reached")
        // console.log("this", this)
        console.log("render this.props", this.props)
        // console.log("this.state", this.state)

        return (
            <div>
                <RenderSettingsModal isOpen={this.props.isOpen} handleClose={this.handleClose.bind(this)} />
                <ThemeProvider theme={RenderSettingsModal}></ThemeProvider>
                <Button onClick={() => this.handleExport()}>Export</Button> {/* anonymous function to bind state onclick  */}
            </div>
        )
    }
};

export default keplerGlConnect(mapStateToProps, makeMapDispatchToProps)(withTheme(HubbleExport));
// export default connect(mapStateToProps, makeMapDispatchToProps)(withTheme(HubbleExport));
// export default connect(mapStateToProps, makeMapDispatchToProps)(HubbleExport);

