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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Editor} from 'react-map-gl-draw';
import window from 'global/window';
import classnames from 'classnames';
import get from 'lodash.get';

import {EDITOR_AVAILABLE_LAYERS} from 'constants/default-settings';
import FeatureActionPanel from './feature-action-panel';
import {FILTER_TYPES} from 'utils/filter-utils';

import {
  DEFAULT_RADIUS,
  getStyle as getFeatureStyle
} from './feature-styles';
import {
  getStyle as getEditHandleStyle,
  getEditHandleShape
} from './handle-style';
import {EDITOR_MODES} from 'constants';

const DELETE_KEY_EVENT_CODE = 46;
const BACKSPACE_KEY_EVENT_CODE = 8;
const ESCAPE_KEY_EVENT_CODE = 27;

const StyledWrapper = styled.div`
  cursor: ${props => props.editor.mode === EDITOR_MODES.EDIT ? 'pointer' : 'crosshair'};
`;

const editorLayerFilter = layer => EDITOR_AVAILABLE_LAYERS.includes(layer.type);

class Draw extends Component {
  static propTypes = {
    classnames: PropTypes.string,
    clickRadius: PropTypes.number,
    datasets: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
    isEnabled: PropTypes.bool,
    layers: PropTypes.arrayOf(PropTypes.object).isRequired,
    layersToRender: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDeleteFeature: PropTypes.func.isRequired,
    onTogglePolygonFilter: PropTypes.func.isRequired
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
    const {isEnabled} = this.props;

    if (!isEnabled) {
      return;
    }

    switch (event.which) {
      case DELETE_KEY_EVENT_CODE:
      case BACKSPACE_KEY_EVENT_CODE:
        this._onDeleteSelectedFeature();
        break;
      case ESCAPE_KEY_EVENT_CODE:
        this.props.onSelect(null);
        break;
      default: break;
    }
  };

  _onSelect = (allFeatures, {selectedFeatureId, sourceEvent}) => {
    this.setState({
      ...(sourceEvent.rightButton ? {
        showActions: true,
        lastPosition: {
          x: sourceEvent.changedPointers[0].clientX,
          y: sourceEvent.changedPointers[0].clientY
        }
      } : null)
    }, () => {
      this.props.onSelect(
        allFeatures.find(f => f.id === selectedFeatureId)
      );
    });
  };

  _onDeleteSelectedFeature = () => {
    if (this.state.showActions) {
      this.setState({showActions: false});
    }

    const {editor} = this.props;
    const {selectedFeature = {}} = editor;
    this.props.onDeleteFeature(selectedFeature);
  };

  _closeFeatureAction = () => {
    this.setState({showActions: false});
  };

  _onToggleLayer = layer => {
    const {selectedFeature} = this.props.editor;
    if (!selectedFeature) {
      return;
    }

    this.props.onTogglePolygonFilter(layer, selectedFeature);
  };

  render() {
    const {
      className,
      clickRadius,
      datasets,
      editor,
      layers,
      layersToRender,
      filters,
      onUpdate,
      style
    } = this.props;

    const {lastPosition, showActions} = this.state;
    const selectedFeatureId = get(editor, ['selectedFeature', 'id']);
    const currentFilter = filters.find(f =>
      f.value && f.value.id === selectedFeatureId
    );

    const availableLayers = layers
      .filter(editorLayerFilter)
      .filter(layer => layersToRender[layer.id]);

    const featureFromFilters = filters.filter(f => f.type === FILTER_TYPES.polygon).map(f => f.value);
    const allFeatures = featureFromFilters.concat(editor.features);

    return (
      <StyledWrapper
        editor={editor}
        className={classnames('editor', className)}
        style={style}
      >
        <Editor
          clickRadius={clickRadius}
          mode={editor.mode}
          features={allFeatures}
          selectedFeatureId={selectedFeatureId}
          onSelect={this._onSelect.bind(this, allFeatures)}
          onUpdate={onUpdate}
          getEditHandleShape={getEditHandleShape}
          getFeatureStyle={getFeatureStyle}
          getEditHandleStyle={getEditHandleStyle}
        />
        {showActions && Boolean(selectedFeatureId) ? (
          <FeatureActionPanel
            datasets={datasets}
            layers={availableLayers}
            currentFilter={currentFilter}
            onClose={this._closeFeatureAction}
            onDeleteFeature={this._onDeleteSelectedFeature}
            onToggleLayer={this._onToggleLayer}
            position={lastPosition}
          />
        ) : null}
      </StyledWrapper>
    );
  }
}

export default Draw;
