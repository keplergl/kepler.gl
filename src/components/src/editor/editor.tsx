// Copyright (c) 2023 Uber Technologies, Inc.
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
import {createPortal} from 'react-dom';
import styled from 'styled-components';
import window from 'global/window';
import classnames from 'classnames';
import get from 'lodash.get';
import {createSelector} from 'reselect';
import FeatureActionPanelFactory, {FeatureActionPanelProps} from './feature-action-panel';
import {
  EDITOR_AVAILABLE_LAYERS,
  FILTER_TYPES,
  EDITOR_MODES,
  GEOCODER_LAYER_ID,
  KeyEvent
} from '@kepler.gl/constants';
import {Layer, EditorLayerUtils} from '@kepler.gl/layers';
import {Filter, FeatureSelectionContext, Feature} from '@kepler.gl/types';
import {FeatureOf, Polygon} from '@nebula.gl/edit-modes';
import {Datasets} from '@kepler.gl/table';
import {RootContext} from '../';

const DECKGL_RENDER_LAYER = 'default-deckgl-overlay-wrapper';

const StyledWrapper = styled.div`
  position: relative;
`;

const editorLayerFilter = (layer: Layer) => EDITOR_AVAILABLE_LAYERS.includes(layer.type!);

EditorFactory.deps = [FeatureActionPanelFactory];

interface EditorProps {
  filters: Filter[];
  layers: Layer[];
  datasets: Datasets;
  editor: {selectedFeature: Feature; mode: string; selectionContext?: FeatureSelectionContext};
  index: number;
  className?: string;
  style: CSSProperties;
  onSelect: (f: Feature | null) => any;
  onSetEditorMode: (m: any) => void;
  onDeleteFeature: (f: Feature) => any;
  onTogglePolygonFilter: (l: Layer, f: Feature) => any;
}

export default function EditorFactory(
  FeatureActionPanel: React.FC<FeatureActionPanelProps>
): React.ComponentClass<EditorProps> {
  class EditorUnmemoized extends Component<EditorProps> {
    static defaultProps = {};

    static displayName = 'Editor';

    state = {};

    componentDidMount() {
      window.addEventListener('keydown', this._onKeyPressed);
    }

    componentWillUnmount() {
      window.removeEventListener('keydown', this._onKeyPressed);
    }

    layerSelector = (props: EditorProps) => props.layers;
    filterSelector = (props: EditorProps) => props.filters;
    selectedFeatureIdSelector = (props: EditorProps) =>
      get(props, ['editor', 'selectedFeature', 'id']);
    editorFeatureSelector = (props: EditorProps) => get(props, ['editor', 'features']);

    currentFilterSelector = createSelector(
      this.filterSelector,
      this.selectedFeatureIdSelector,
      (filters, selectedFeatureId) => filters.find(f => f.value && f.value.id === selectedFeatureId)
    );

    availableLayersSelector = createSelector(this.layerSelector, layers =>
      layers
        .filter(editorLayerFilter)
        .filter(layer => layer.config?.isVisible && layer.id !== GEOCODER_LAYER_ID)
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

    isInFocus = () => document.activeElement?.id === DECKGL_RENDER_LAYER;

    _onKeyPressed = (event: KeyboardEvent) => {
      if (this.isInFocus()) {
        switch (event.keyCode) {
          case KeyEvent.DOM_VK_DELETE:
          case KeyEvent.DOM_VK_BACK_SPACE:
            this._onDeleteSelectedFeature();
            break;
          case KeyEvent.DOM_VK_ESCAPE:
            // reset active drawing
            if (EditorLayerUtils.isDrawingActive(true, this.props.editor.mode)) {
              this.props.onSetEditorMode(EDITOR_MODES.EDIT);
            }

            this.props.onSelect(null);
            break;
          default:
            break;
        }
      }
    };

    _onDeleteSelectedFeature = () => {
      const {editor} = this.props;
      const {selectedFeature} = editor;
      if (selectedFeature) {
        this.props.onDeleteFeature(selectedFeature);
      }
    };

    _closeFeatureAction = () => {
      // reset selection context
      const {selectedFeature} = this.props.editor;
      this.props.onSelect(selectedFeature);
    };

    _togglePolygonFilter = (layer: Layer) => {
      const {selectedFeature} = this.props.editor;
      if (selectedFeature) {
        this.props.onTogglePolygonFilter(layer, selectedFeature);
      }
    };

    render() {
      const {className, datasets, editor, style, index} = this.props;
      const {selectedFeature, selectionContext} = editor;
      const currentFilter = this.currentFilterSelector(this.props);
      const availableLayers = this.availableLayersSelector(this.props);

      const {rightClick, position, mapIndex} = selectionContext || {};

      return (
        <RootContext.Consumer>
          {context =>
            createPortal(
              <StyledWrapper className={classnames('editor', className)} style={style}>
                {Boolean(rightClick) && selectedFeature && index === mapIndex ? (
                  <FeatureActionPanel
                    selectedFeature={selectedFeature as FeatureOf<Polygon>}
                    datasets={datasets}
                    layers={availableLayers}
                    currentFilter={currentFilter}
                    onClose={this._closeFeatureAction}
                    onDeleteFeature={this._onDeleteSelectedFeature}
                    onToggleLayer={this._togglePolygonFilter}
                    position={position || null}
                  />
                ) : null}
              </StyledWrapper>,
              context?.current ?? document.body
            )
          }
        </RootContext.Consumer>
      );
    }
  }

  const Editor = (React.memo(EditorUnmemoized) as unknown) as typeof EditorUnmemoized;
  Editor.displayName = 'Editor';
  return Editor;
}
