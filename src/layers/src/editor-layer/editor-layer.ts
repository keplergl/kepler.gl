// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {EditableGeoJsonLayer} from '@deck.gl-community/editable-layers';
import {Layer as DeckLayer, LayerProps as DeckLayerProps} from '@deck.gl/core';
import {
  DrawPolygonMode,
  DrawLineStringMode,
  DrawPointMode,
  TranslateMode,
  CompositeMode,
  GeoJsonEditMode,
  getPickedEditHandle
} from '@deck.gl-community/editable-layers';
import {PathStyleExtension} from '@deck.gl/extensions';

import {EDITOR_LAYER_ID, EDITOR_MODES, EDITOR_LAYER_PICKING_RADIUS} from '@kepler.gl/constants';
import {Viewport, Editor, Feature, FeatureSelectionContext} from '@kepler.gl/types';
import {generateHashId} from '@kepler.gl/common-utils';
import {getApplicationConfig} from '@kepler.gl/utils';

import {EDIT_TYPES} from './constants';
import {LINE_STYLE, FEATURE_STYLE, EDIT_HANDLE_STYLE, getFeatureDashArray} from './feature-styles';
import {ModifyModeExtended} from './modify-mode-extended';
import {DrawRectangleModeExtended} from './draw-rectangle-mode-extended';
import {DrawCircleModeExtended} from './draw-circle-mode-extended';
import {DrawLineStringModeExtended} from './draw-line-string-mode-extended';
import {isDrawingActive} from './editor-layer-utils';

const DEFAULT_COMPOSITE_MODE = new CompositeMode([
  new TranslateMode() as unknown as GeoJsonEditMode,
  new ModifyModeExtended() as unknown as GeoJsonEditMode
]);

class EditorLayer extends EditableGeoJsonLayer {
  static layerName = 'EditorLayer';

  _addEventHandlers() {
    super._addEventHandlers();
    // An active dblclick listener makes deck.gl defer every click by 300 ms.
    // Let the map controller enable that recognizer only when it needs zoom.
    // The inherited cleanup also removes this passive listener.
    // @ts-expect-error eventManager is protected in deck.gl
    const {eventManager} = this.context.deck;
    const {eventHandler} = this.state._editableLayerState;
    eventManager.off('dblclick', eventHandler);
    eventManager.watch('dblclick', eventHandler, {priority: 100});
  }

  _onclick(event: Parameters<EditableGeoJsonLayer['_onclick']>[0]) {
    const mode = this.getActiveMode();
    if (
      event.tapCount &&
      event.tapCount % 2 === 0 &&
      (mode instanceof DrawPolygonMode || mode instanceof DrawLineStringMode)
    ) {
      // Immediate clicks still carry a tap count. Finish on the second tap,
      // even if the first tap's edit handle has not rendered for picking yet.
      // Its vertex is already committed; do not add a duplicate position.
      const minimumVertices = mode instanceof DrawPolygonMode ? 3 : 2;
      if (mode.getClickSequence().length >= minimumVertices) {
        this._ondblclick(event);
      }
      return;
    }
    super._onclick(event);
  }

  onLayerClick(event: Parameters<EditableGeoJsonLayer['onLayerClick']>[0]) {
    const mode = this.getActiveMode();
    const isPoint = mode instanceof DrawPointMode;
    const isNewLineVertex = mode instanceof DrawLineStringMode && !getPickedEditHandle(event.picks);
    if (isPoint || isNewLineVertex) {
      const position = this.props.modeConfig?.pickWorldPosition?.(event.screenCoords);
      if (
        Array.isArray(position) &&
        position.length >= 3 &&
        Number.isFinite(position[0]) &&
        Number.isFinite(position[1]) &&
        Number.isFinite(position[2]) &&
        position[2] !== 0
      ) {
        super.onLayerClick({...event, mapCoords: [position[0], position[1], position[2]]});
        return;
      }
    }
    super.onLayerClick(event);
  }
}

export type GetEditorLayerProps = {
  editorMenuActive: boolean;
  editor: Editor;
  onSetFeatures: (features: Feature[]) => any;
  pickWorldPosition?: (xy: [number, number]) => number[] | null;
  setSelectedFeature: (feature: Feature | null, selectionContext?: FeatureSelectionContext) => any;
  onApplyPolygonFilterAll?: (feature: Feature) => any;
  viewport: Viewport;
  featureCollection: {
    type: string;
    features: Feature[];
  };
  selectedFeatureIndexes: number[];
  mapState?: {globe?: {enabled: boolean}; layerParameters?: Record<string, string | boolean>};
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
  pickWorldPosition,
  setSelectedFeature,
  onApplyPolygonFilterAll,
  featureCollection,
  selectedFeatureIndexes,
  viewport,
  mapState
}: GetEditorLayerProps): DeckLayer<DeckLayerProps> {
  const {mode: editorMode} = editor;
  const sketchesEnabled = getApplicationConfig().enableDrawOnMapSketches;

  let mode = DEFAULT_COMPOSITE_MODE;
  if (editorMenuActive) {
    // @ts-ignore
    if (editorMode === EDITOR_MODES.DRAW_POLYGON) mode = DrawPolygonMode;
    // @ts-ignore
    else if (editorMode === EDITOR_MODES.DRAW_RECTANGLE) mode = DrawRectangleModeExtended;
    // @ts-ignore
    else if (editorMode === EDITOR_MODES.DRAW_CIRCLE) mode = DrawCircleModeExtended;
    // @ts-ignore
    else if (sketchesEnabled && editorMode === EDITOR_MODES.DRAW_LINESTRING)
      // @ts-ignore
      mode = DrawLineStringModeExtended;
    // @ts-ignore
    else if (sketchesEnabled && editorMode === EDITOR_MODES.DRAW_POINT) mode = DrawPointMode;
  }

  const hasPointFeatures = featureCollection.features.some(
    feature => feature.geometry?.type === 'Point' || feature.geometry?.type === 'MultiPoint'
  );
  // Point sketches need fill to be visible, including the tentative point while drawing.
  const filled =
    selectedFeatureIndexes.length > 0 ||
    hasPointFeatures ||
    (sketchesEnabled && editorMode === EDITOR_MODES.DRAW_POINT);

  // @ts-ignore
  return new EditorLayer({
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
      pickWorldPosition,
      screenSpace: true,
      lockRectangles: true,
      // Turf circle() default; 64 vertices is a smooth tessellated polygon.
      steps: 64
    },

    pickingLineWidthExtraPixels: 5,
    filled,

    onEdit: ({updatedData, editType}) => {
      switch (editType) {
        case EDIT_TYPES.ADD_FEATURE: {
          const {features: _features} = updatedData;
          if (_features.length) {
            const lastFeature = _features[_features.length - 1];
            const geometryType = lastFeature.geometry?.type;
            if (
              lastFeature.properties &&
              (geometryType === 'Polygon' || geometryType === 'MultiPolygon')
            ) {
              lastFeature.properties.isClosed = true;
            }
            if (!lastFeature.type) lastFeature.type = 'Feature';
            lastFeature.id = generateHashId(6);
            onSetFeatures(updatedData.features as unknown as Feature[]);

            const isRectangle = lastFeature.properties?.shape === 'Rectangle';
            if (isRectangle && onApplyPolygonFilterAll) {
              onApplyPolygonFilterAll(lastFeature as unknown as Feature);
            } else if (geometryType === 'Point' || geometryType === 'LineString') {
              // Stay in draw mode so multiple sketches can be added in a row.
            } else {
              setSelectedFeature(lastFeature as unknown as Feature);
            }
          }
          break;
        }
        case EDIT_TYPES.ADD_POSITION:
        case EDIT_TYPES.MOVE_POSITION:
        case EDIT_TYPES.TRANSLATING:
          onSetFeatures(updatedData.features as unknown as Feature[]);
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

      // Polygons get a mostly transparent fill highlight. Using the opaque
      // stroke color here paints a solid yellow background because GeoJsonLayer
      // applies highlightColor to fill when the layer is filled (e.g. points).
      const geomType = object?.geometry?.type;
      if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        return FEATURE_STYLE.highlightMultiplier;
      }
      if (geomType === 'LineString' || geomType === 'MultiLineString') {
        return LINE_STYLE.highlightMultiplier;
      }

      return filled ? FEATURE_STYLE.highlightMultiplier : LINE_STYLE.highlightMultiplier;
    },

    extensions: [new PathStyleExtension({dash: true})],
    dashGapPickable: true,
    getDashArray: getFeatureDashArray,

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
    getTentativeLineWidth:
      sketchesEnabled && editorMode === EDITOR_MODES.DRAW_LINESTRING
        ? LINE_STYLE.lineStringWidth
        : LINE_STYLE.getTentativeLineWidth,
    getTentativeFillColor: LINE_STYLE.getTentativeFillColor,

    // Globe mode needs explicit depth testing so the editor overlay is occluded
    // by the sphere; in flat 2D/3D keep deck.gl's default (empty parameters) so
    // this matches the pre-globe behavior exactly.
    parameters: mapState?.globe?.enabled
      ? {depthTest: true, ...(mapState?.layerParameters ?? {})}
      : {},
    shadowEnabled: false,
    _subLayerProps: {
      geojson: {shadowEnabled: false},
      guides: {shadowEnabled: false},
      tooltips: {
        shadowEnabled: false,
        getSize: 14,
        getColor: [255, 255, 255, 255],
        background: true,
        getBackgroundColor: [0, 0, 0, 200],
        backgroundPadding: [6, 4],
        getPixelOffset: [12, 0],
        getTextAnchor: 'start',
        getAlignmentBaseline: 'center',
        fontFamily: 'sans-serif',
        fontWeight: '600',
        pickable: false,
        _subLayerProps: {
          characters: {shadowEnabled: false},
          background: {shadowEnabled: false}
        }
      }
    }
  });
}
