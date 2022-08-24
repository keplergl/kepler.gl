// Copyright (c) 2022 Uber Technologies, Inc.
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

import React, {Component, CSSProperties, KeyboardEvent} from 'react';
import styled from 'styled-components';
import {Editor as Draw} from 'react-map-gl-draw';
import window from 'global/window';
import classnames from 'classnames';
import get from 'lodash.get';
import {createSelector} from 'reselect';

import FeatureActionPanelFactory, {FeatureActionPanelProps} from './feature-action-panel';
import {FILTER_TYPES, EDITOR_MODES, KeyEvent} from '@kepler.gl/constants';
import {EDITOR_AVAILABLE_LAYERS, Layer} from '@kepler.gl/layers';

import {DEFAULT_RADIUS, getStyle as getFeatureStyle} from './feature-styles';
import {getStyle as getEditHandleStyle, getEditHandleShape} from './handle-style';
import {Filter} from '@kepler.gl/types';
import {Feature} from '@nebula.gl/edit-modes';
import {MjolnirEvent} from 'mjolnir.js';
import {Datasets} from 'reducers/table-utils/kepler-table';

const StyledWrapper = styled.div`
  cursor: ${(props: {editor: {mode: string}}) =>
    props.editor.mode === EDITOR_MODES.EDIT ? 'pointer' : 'crosshair'};
  position: relative;
`;

const editorLayerFilter = (layer: Layer) => EDITOR_AVAILABLE_LAYERS.includes(layer.type!);

EditorFactory.deps = [FeatureActionPanelFactory];

interface EditorProps {
  filters: Filter[];
  layers: Layer[];
  datasets: Datasets;
  editor: {selectedFeature: Feature; mode: string};
  layersToRender: Record<string, Layer>;
  index: number;
  className: string;
  clickRadius: number;
  style: CSSProperties;
  isEnabled: boolean;
  onSelect: (f: Feature | null) => void;
  onUpdate: (f: Feature[]) => void;
  onDeleteFeature: (f: Feature) => void;
  onTogglePolygonFilter: (l: Layer, f: Feature) => void;
}

export default function EditorFactory(
  FeatureActionPanel: React.FC<FeatureActionPanelProps>
): React.ComponentClass<EditorProps> {
  class Editor extends Component<EditorProps> {
    static defaultProps = {
      clickRadius: DEFAULT_RADIUS
    };

    static displayName = 'Editor';

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

    layerSelector = (props: EditorProps) => props.layers;
    layersToRenderSelector = (props: EditorProps) => props.layersToRender;
    filterSelector = (props: EditorProps) => props.filters;
    selectedFeatureIdSelector = (props: EditorProps) =>
      get(props, ['editor', 'selectedFeature', 'id']);
    editorFeatureSelector = (props: EditorProps) => get(props, ['editor', 'features']);

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

    _onKeyPressed = (event: KeyboardEvent) => {
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

    _onSelect = ({
      selectedFeatureId,
      sourceEvent
    }: {
      selectedFeatureId: string | number;
      sourceEvent: MjolnirEvent;
    }) => {
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

    _onToggleLayer = (layer: Layer) => {
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

  return Editor;
}
