// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {EditableGeoJsonLayer} from '@nebula.gl/layers';
import {Layer as DeckLayer, LayerProps as DeckLayerProps} from '@deck.gl/core/typed';
import {
  DrawPolygonMode,
  TranslateMode,
  CompositeMode,
  DrawRectangleMode
} from '@nebula.gl/edit-modes';
import {PathStyleExtension} from '@deck.gl/extensions';

import {EDITOR_LAYER_ID, EDITOR_MODES, EDITOR_LAYER_PICKING_RADIUS} from '@kepler.gl/constants';
import {Viewport, Editor, Feature, FeatureSelectionContext} from '@kepler.gl/types';
import {generateHashId} from '@kepler.gl/utils';

import {EDIT_TYPES} from './constants';
import {LINE_STYLE, FEATURE_STYLE, EDIT_HANDLE_STYLE} from './feature-styles';
import {ModifyModeExtended} from './modify-mode-extended';
import {isDrawingActive} from './editor-layer-utils';

const DEFAULT_COMPOSITE_MODE = new CompositeMode([new TranslateMode(), new ModifyModeExtended()]);

export type GetEditorLayerProps = {
  editorMenuActive: boolean;
  editor: Editor;
  onSetFeatures: (features: Feature[]) => any;
  setSelectedFeature: (feature: Feature | null, selectionContext?: FeatureSelectionContext) => any;
  viewport: Viewport;
  featureCollection: {
    type: string;
    features: Feature[];
  };
  selectedFeatureIndexes: number[];
};

/**
 * Returns editable layer to edit polygon filters.
 * @param params
 * @param params.editorMenuActive Indicates whether the editor side menu is active.
 * @param params.editor
 * @param params.onSetFeatures A callback to set features.
 * @param params.setSelectedFeature A callback to set selected feature and selection context.
 * @param params.viewport Current viewport.
 * @param params.featureCollection Feature collection with an array of features
 * @param params.selectedFeatureIndexes An array with index of currently selected feature.
 */
export function getEditorLayer({
  editorMenuActive,
  editor,
  onSetFeatures,
  setSelectedFeature,
  featureCollection,
  selectedFeatureIndexes,
  viewport
}: GetEditorLayerProps): DeckLayer<DeckLayerProps> {
  const {mode: editorMode} = editor;

  let mode = DEFAULT_COMPOSITE_MODE;
  if (editorMenuActive) {
    // @ts-ignore
    if (editorMode === EDITOR_MODES.DRAW_POLYGON) mode = DrawPolygonMode;
    // @ts-ignore
    else if (editorMode === EDITOR_MODES.DRAW_RECTANGLE) mode = DrawRectangleMode;
  }

  // @ts-ignore
  return new EditableGeoJsonLayer({
    id: EDITOR_LAYER_ID,
    mode,
    // @ts-ignore
    data: featureCollection,
    selectedFeatureIndexes,
    visible: editor.visible,
    pickable: true,
    pickingRadius: EDITOR_LAYER_PICKING_RADIUS,
    modeConfig: {
      viewport,
      screenSpace: true,
      lockRectangles: true
    },

    pickingLineWidthExtraPixels: 5,

    // Only show fill when polygons are selected,
    // there is no way atm to enable fill for only one feature
    filled: selectedFeatureIndexes.length > 0,

    onEdit: ({updatedData, editType}) => {
      switch (editType) {
        case EDIT_TYPES.ADD_FEATURE: {
          const {features: _features} = updatedData;
          if (_features.length) {
            const lastFeature = _features[_features.length - 1];
            lastFeature.properties.isClosed = true;
            lastFeature.id = generateHashId(6);
            onSetFeatures(updatedData.features);
            setSelectedFeature(lastFeature);
          }
          break;
        }
        case EDIT_TYPES.ADD_POSITION:
        case EDIT_TYPES.MOVE_POSITION:
        case EDIT_TYPES.TRANSLATING:
          onSetFeatures(updatedData.features);
          break;
        default:
          break;
      }
    },

    // prevent self-highlights with tentative features
    autoHighlight: !isDrawingActive(editorMenuActive, editorMode),
    // @ts-ignore
    highlightColor: info => {
      // Note: lines are reported as parent polygon
      const {object} = info;
      if (object) {
        if (object.id === editor.selectedFeature?.id) {
          return FEATURE_STYLE.highlightMultiplierNone;
        }

        const type = object.properties.editHandleType;
        if (type === 'intermediate') return EDIT_HANDLE_STYLE.highlightMultiplierNone;
        else if (type === 'existing') return EDIT_HANDLE_STYLE.highlightMultiplier;
      }

      // Note: highlight color affects even transparent filled polygons
      return selectedFeatureIndexes.length
        ? FEATURE_STYLE.highlightMultiplier
        : LINE_STYLE.highlightMultiplier;
    },

    extensions: [new PathStyleExtension({dash: true})],
    dashGapPickable: true,
    getDashArray: feature => {
      if (feature?.properties?.guideType === 'tentative') {
        return LINE_STYLE.dashArray;
      }

      if (feature?.id === editor.selectedFeature?.id) return LINE_STYLE.solidArray;

      return LINE_STYLE.dashArray;
    },

    getLineColor: LINE_STYLE.getColor,
    getFillColor: FEATURE_STYLE.getColor,

    getRadius: EDIT_HANDLE_STYLE.getRadius,
    // @ts-ignore
    getLineWidth: LINE_STYLE.getWidth,

    getEditHandlePointRadius: EDIT_HANDLE_STYLE.getRadius,
    getEditHandlePointColor: EDIT_HANDLE_STYLE.getFillColor,
    getEditHandlePointOutlineColor: EDIT_HANDLE_STYLE.getOutlineColor,

    getTentativeLineColor: LINE_STYLE.getTentativeLineColor,
    // @ts-ignore
    getTentativeLineWidth: LINE_STYLE.getTentativeLineWidth,
    getTentativeFillColor: LINE_STYLE.getTentativeFillColor,

    parameters: {}
  });
}
