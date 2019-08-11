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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Editor} from 'react-map-gl-draw';
import window from 'global/window';

import {
  DEFAULT_RADIUS,
  getStyle as getFeatureStyle
} from './feature-styles';
import {
  getStyle as getEditHandleStyle
} from './handle-style';

const DEFAULT_EDIT_HANDLE_SHAPE = 'circle';

const DELETE_KEY_EVENT_CODE = 8;
const ESCAPE_KEY_EVENT_CODE = 27;

const StyledActionsLayer = styled.div`
  position: absolute;
  top: ${props => props.position.y}px;
  left: ${props => props.position.x}px;
`;

class Draw extends Component {
  static propTypes = {
    clickRadius: PropTypes.number,
    editor: PropTypes.object.isRequired,
    features: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelect: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDeleteFeature: PropTypes.func
  };

  static defaultProps = {
    clickRadius: DEFAULT_RADIUS
  };

  state = {
    showActions: false,
    lastPosition: null
  };

  componentDidMount() {
    window.addEventListener('keydown', this._onKeyPressed);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._onKeyPressed);
  }

  _onKeyPressed = event => {
    const {editor, isEnabled} = this.props;
    const {selectedFeature = {}} = editor;

    if (!isEnabled) {
      return;
    }

    switch (event.which) {
      case DELETE_KEY_EVENT_CODE:
        this.props.onDeleteFeature((selectedFeature || {}).id);
        break;
      case ESCAPE_KEY_EVENT_CODE:
        // TODO: handle escape button for operations
        break;
      default: break;
    }
  };

  _getEditHandleShape = () => {
    return DEFAULT_EDIT_HANDLE_SHAPE;
  };

  _onSelect = ({selectedFeatureId, sourceEvent}) => {
    // we don't need to mouse position in redux state
    this.setState({
      ...(sourceEvent.rightButton ? {
        showActions: true,
        lastPosition: {
          x: sourceEvent.changedPointers[0].clientX,
          y: sourceEvent.changedPointers[0].clientY
        }
      } : null)
    }, () => {
      this.props.onSelect({selectedFeatureId});
    });
  };

  render() {
    const {clickRadius, editor, features} = this.props;
    const {selectedFeature = {}} = editor;

    return (
      <div className="editor">
        <Editor
          clickRadius={clickRadius}
          mode={editor.mode}
          features={features}
          selectedFeatureId={(selectedFeature || {}).id}
          onSelect={this._onSelect}
          onUpdate={this.props.onUpdate}
          getEditHandleShape={this._getEditHandleShape}
          getFeatureStyle={getFeatureStyle}
          getEditHandleStyle={getEditHandleStyle}
          style={{zIndex: 1}}
        />
        {this.state.showActions ? (
          <StyledActionsLayer position={this.state.lastPosition}>
            <h2>layers</h2>
          </StyledActionsLayer>
        ) : null}
      </div>
    );
  }
}

export default Draw;
