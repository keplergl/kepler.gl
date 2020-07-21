import React, {Component} from 'react';
import styled, {withTheme} from 'styled-components';
import {connect as keplerGlConnect} from 'connect/keplergl-connect';

function mapStateToProps(state = {}, props) {
    return {
      ...props,
      visState: state.visState,
      mapStyle: state.mapStyle,
      mapState: state.mapState,
      uiState: state.uiState,
      providerState: state.providerState
    };
}

function makeMapDispatchToProps() {
    // const getActionCreators = makeGetActionCreators();
    const mapDispatchToProps = (dispatch, ownProps) => {
    //   const groupedActionCreators = getActionCreators(dispatch, ownProps);
  
      return {
        // ...groupedActionCreators,
        dispatch
      };
    };
  
    return mapDispatchToProps;
}

class HubbleExport extends Component {
  // To be used to store all modal components & functions 
//   this.states = [ // React props
//       keyframes: abstraction of keyframes,
//       dlsjkas,
//   ]
    render() {
        console.log(this.props)
        return (<div>REACHED</div>)
        // console.log(this.props) // might need to return div
    }
};

// States we need:
// 
// 
// 
export default keplerGlConnect(mapStateToProps, makeMapDispatchToProps)(withTheme(HubbleExport));

