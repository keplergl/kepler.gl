// Copyright (c) 2021 Uber Technologies, Inc.
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
import {Editor as Draw} from 'react-map-gl-draw';
import window from 'global/window';
import classnames from 'classnames';
import get from 'lodash.get';
import {createSelector} from 'reselect';

import FeatureActionPanelFactory from './feature-action-panel';
import {FILTER_TYPES, EDITOR_MODES, EDITOR_AVAILABLE_LAYERS} from 'constants/default-settings';

import {DEFAULT_RADIUS, getStyle as getFeatureStyle} from './feature-styles';
import {getStyle as getEditHandleStyle, getEditHandleShape} from './handle-style';
import KeyEvent from 'constants/keyevent';

const StyledWrapper = styled.div`
  cursor: ${props => (props.editor.mode === EDITOR_MODES.EDIT ? 'pointer' : 'crosshair')};
  position: relative;
`;

const editorLayerFilter = layer => EDITOR_AVAILABLE_LAYERS.includes(layer.type);

EditorFactory.deps = [FeatureActionPanelFactory];

export default function EditorFactory(FeatureActionPanel) {
  class Editor extends Component {
    static propTypes = {
      filters: PropTypes.arrayOf(PropTypes.object).isRequired,
      layers: PropTypes.arrayOf(PropTypes.object).isRequired,
      datasets: PropTypes.object.isRequired,
      editor: PropTypes.object.isRequired,
      layersToRender: PropTypes.object.isRequired,
      onSelect: PropTypes.func.isRequired,
      onUpdate: PropTypes.func.isRequired,
      onDeleteFeature: PropTypes.func.isRequired,
      onTogglePolygonFilter: PropTypes.func.isRequired,

      index: PropTypes.number,
      classnames: PropTypes.string,
      clickRadius: PropTypes.number,
      isEnabled: PropTypes.bool
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

    layerSelector = props => props.layers;
    layersToRenderSelector = props => props.layersToRender;
    filterSelector = props => props.filters;
    selectedFeatureIdSelector = props => get(props, ['editor', 'selectedFeature', 'id']);
    editorFeatureSelector = props => get(props, ['editor', 'features']);

    currentFilterSelector = createSelector(
      this.filterSelector,
      this.selectedFeatureIdSelector,
      (filters, selectedFeatureId) => filters.find(f => f.value && f.value.id === selectedFeatureId)
    );

    availableLayersSeletor = createSelector(
      this.layerSelector,
      this.layersToRenderSelector,
      (layers, layersToRender) =>
        layers.filter(editorLayerFilter).filter(layer => {
          return layersToRender[layer.id];
        })
    );

    allFeaturesSelector = createSelector(
      this.filterSelector,
      this.editorFeatureSelector,
      (filters, editorFeatures) =>
        filters
          .filter(f => f.type === FILTER_TYPES.polygon)
          .map(f => f.value)
          .concat(editorFeatures)
    );

    _onKeyPressed = event => {
      const {isEnabled} = this.props;

      if (!isEnabled) {
        return;
      }

      switch (event.keyCode) {
        case KeyEvent.DOM_VK_DELETE:
        case KeyEvent.DOM_VK_BACK_SPACE:
          this._onDeleteSelectedFeature();
          break;
        case KeyEvent.DOM_VK_ESCAPE:
          this.props.onSelect(null);
          break;
        default:
          break;
      }
    };

    _onSelect = ({selectedFeatureId, sourceEvent}) => {
      const allFeatures = this.allFeaturesSelector(this.props);
      this.setState(
        {
          ...(sourceEvent.rightButton
            ? {
                showActions: true,
                lastPosition: {
                  x: sourceEvent.changedPointers[0].offsetX,
                  y: sourceEvent.changedPointers[0].offsetY
                }
              }
            : null)
        },
        () => {
          this.props.onSelect(allFeatures.find(f => f.id === selectedFeatureId));
        }
      );
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
      const {className, clickRadius, datasets, editor, onUpdate, style} = this.props;

      const {lastPosition, showActions} = this.state;
      const selectedFeatureId = get(editor, ['selectedFeature', 'id']);
      const currentFilter = this.currentFilterSelector(this.props);
      const availableLayers = this.availableLayersSeletor(this.props);
      const allFeatures = this.allFeaturesSelector(this.props);

      return (
        <StyledWrapper editor={editor} className={classnames('editor', className)} style={style}>
          <Draw
            clickRadius={clickRadius}
            mode={editor.mode}
            features={allFeatures}
            selectedFeatureId={selectedFeatureId}
            onSelect={this._onSelect}
            onUpdate={onUpdate}
            getEditHandleShape={getEditHandleShape}
            getFeatureStyle={getFeatureStyle}
            getEditHandleStyle={getEditHandleStyle}
          />
          {showActions && Boolean(selectedFeatureId) ? (
            <FeatureActionPanel
              selectedFeature={get(editor, ['selectedFeature'])}
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

  Editor.displayName = 'Editor';

  return Editor;
}
