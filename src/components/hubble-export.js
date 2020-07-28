import React, {Component} from 'react';
import {ThemeProvider, withTheme} from 'styled-components';

import {connect as keplerGlConnect} from 'connect/keplergl-connect';
import RenderSettingsModal from './render-settings-modal';
import {Button} from 'components/common/styled-components';
import {theme} from '../styles';


// TODO this isn't DRY. Comes from https://github.com/keplergl/kepler.gl/blob/995024e86880fefb0624af4ed1e98d3879558336/src/components/kepler-gl.js
function mapStateToProps(state = {}, props) {
    return {
      ...props,
      visState: state.visState,
      mapStyle: state.mapStyle,
      mapState: state.mapState,
      uiState: state.uiState,
      providerState: state.providerState
    //   isOpen: state.isOpen TODO
    };
}

function makeMapDispatchToProps() {
    // const getActionCreators = makeGetActionCreators();
    const mapDispatchToProps = (dispatch, ownProps) => {
    //   const groupedActionCreators = getActionCreators(dispatch, ownProps);
  
      return {
        //   TODO Put action creator and return here
        // ...groupedActionCreators,
        dispatch
      };
    };
  
    return mapDispatchToProps;
}

class HubbleExport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }
    handleClose() {this.setState({isOpen: false})} // X button in Modal UI was clicked

    handleExport() { // Export button in Kepler UI was clicked
        this.setState(state => ({
            isOpen: true
          }));
        // stop rendering in bg
        // setState
        // pop up modal if isOpen. If false, closes modal TODO put function into render
        // all the data is passed through and can use in deck/hubble components
        return <h1>REACHED</h1>
    }

    render() {
        // console.log(this.props)
        console.log(this.state)
        return (
            <div>
                <RenderSettingsModal isOpen={this.state.isOpen} handleClose={this.handleClose.bind(this)} />
                <ThemeProvider theme={RenderSettingsModal}></ThemeProvider>
                <Button onClick={() => this.handleExport()}>Export</Button> {/* anonymous function to bind state onclick  */}
            </div>
        )
    }
};

export default keplerGlConnect(mapStateToProps, makeMapDispatchToProps)(withTheme(HubbleExport));

