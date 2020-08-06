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

/* eslint-disable no-invalid-this */
import React, {Component, createRef} from 'react';
import styled, {withTheme} from 'styled-components';
import {createSelector} from 'reselect';
import RenderSettingsPanel from './render-settings-panel';
import Modal from 'react-modal';
import {DIMENSIONS} from 'kepler.gl/constants/default-settings';

import {connect} from 'react-redux';


const ModalContainer = styled.div`
  position: relative;
`;

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({dispatch});

class RenderSettingsModal extends Component {
  static defaultProps = {
    defaultSettingsPos: {top: '320px', left: '320px'},
    bottomBuffer: 212
  };

  root = createRef();

  // derive settings position based on root component
  showSettingsSelector(props) {
    return props.showSettings;
  }
  themeSelector(props) {
    return props.theme;
  }
  settingsPosSelector = createSelector(this.showSettingsSelector, (showSettings, theme = {}) => {
    const {defaultSettingsPos, bottomBuffer, settingsHeight} = this.props;
    if (showSettings === false || !this.root || !this.root.current) return defaultSettingsPos;
    const {sidePanelInnerPadding = 16, sidePanel = {}, sidePanelScrollBarWidth = 10} = theme;
    const sidePanelLeft = (sidePanel.margin || {}).left || 20;
    const offsetX = sidePanelInnerPadding + sidePanelLeft + sidePanelScrollBarWidth;
    // find component Root position
    const bounding = this.root.current.getBoundingClientRect();
    const {x, y, width} = bounding;

    // set the top so it won't collide with bottom widget
    const top =
      y + settingsHeight <= window.innerHeight - bottomBuffer
        ? y
        : window.innerHeight - bottomBuffer - settingsHeight;

    return {top: `${top}px`, left: `${x + width + offsetX}px`};
  });

  modalStylesSelector = createSelector(
    this.themeSelector,
    this.settingsPosSelector,
    (theme, settingsPos) => ({
      content: {
        top: 'auto',
        left: 'auto',
        right: `calc(50% - ${DIMENSIONS.sidePanel.width / 2}px)`,
        bottom: '50%',
        transform: 'translate(50%, 50%)',
        padding: '0px 0px 0px 0px',
        border: 0,
        backgroundColor: theme.sidePanelBg,
        borderRadius: theme.panelBorderRadius || '2px'
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0)'
      }
      // content: {
      //   top: 0,
      //   left: 0,
      //   border: 0,
      //   right: 'auto',
      //   bottom: 'auto',
      //   padding: '0px 0px 0px 0px',
      //   borderRadius: theme.panelBorderRadius || '2px'
      // },
      // overlay: {
      //   ...settingsPos,
      //   right: 'auto',
      //   bottom: 'auto',
      //   backgroundColor: 'rgba(0, 0, 0, 0)'
      // }
    })
  );

  render() {
    const {isOpen, handleClose} = this.props;

    const modalStyles = this.modalStylesSelector(this.props);
    return (
      <ModalContainer className="render-settings-modal" ref={this.root}>
        {this.root.current ? (
          <Modal
            isOpen={isOpen}
            style={modalStyles}
            ariaHideApp={false}
            parentSelector={() => {
              // React modal issue: https://github.com/reactjs/react-modal/issues/769
              // failed to execute removeChild on parent node when it is already unmounted
              return (
                this.root.current || {
                  removeChild: () => {},
                  appendChild: () => {}
                }
              );
            }}
          >
            <RenderSettingsPanel handleClose={() => {handleClose()}}/>
          </Modal>
        ) : null}
      </ModalContainer>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RenderSettingsModal));
// export default withTheme(RenderSettingsModal);