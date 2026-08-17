// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Editor, Feature, FeatureSelectionContext, PickInfo} from '@kepler.gl/types';
import {EDITOR_DRAW_MODES, EDITOR_LAYER_ID, EDITOR_MODES} from '@kepler.gl/constants';
import {isFilterFeature} from './feature-styles';

/**
 * Returns true if drawing is active.
 * @param editorMenuActive Indicates whether the editor side menu is active.
 * @param mode Current editing mode.
 * @returs Returns true if drawing is active.
 */
export function isDrawingActive(editorMenuActive: boolean, mode: string): boolean {
  return editorMenuActive && EDITOR_DRAW_MODES.includes(mode);
}

/**
 * Handles click event for Editor layer.
 * @param info Information about clicked object.
 * @param event Event object.
 * @param params
 * @param params.editorMenuActive
 * @param params.editor
 * @param params.onLayerClick
 * @param params.setSelectedFeature
 * @param params.mapIndex
 * @returns Returns true is the click is handled.
 */
// eslint-disable-next-line complexity
export function onClick(
  info: PickInfo,
  event: any,
  {
    editorMenuActive,
    editor,
    setSelectedFeature,
    onLayerClick,
    mapIndex = 0
  }: {
    editorMenuActive: boolean;
    editor: Editor;
    onLayerClick: (data, clickEvent) => any;
    setSelectedFeature: (
      feature: Feature | null,
      selectionContext?: FeatureSelectionContext
    ) => any;
    mapIndex?: number;
  }
): boolean {
  const drawingActive = isDrawingActive(editorMenuActive, editor.mode);

  if (info?.layer?.id === EDITOR_LAYER_ID && info?.object) {
    const isEditHandle = Boolean(
      info.object.properties?.editHandleType || info.object.properties?.guideType
    );

    if (drawingActive) {
      if (editor.selectedFeature) {
        setSelectedFeature(null);
      }
    } else {
      let clickContext;
      if (event.rightButton && Array.isArray(event.srcEvent?.point)) {
        const {point} = event.srcEvent;
        clickContext = {
          mapIndex,
          rightClick: true,
          position: {
            x: point[0],
            y: point[1]
          }
        };
      }

      if (!isEditHandle && info.object.geometry) {
        setSelectedFeature(info.object, clickContext);
      } else {
        // Keep the current feature selected when clicking an edit handle
        setSelectedFeature(editor.selectedFeature, clickContext);
      }
    }
    // hide tooltips from regular data layers
    onLayerClick(null, event);
  } else if (drawingActive) {
    // prevent interaction with other layers
    onLayerClick(null, event);
  } else {
    if (editor.selectedFeature) {
      if (event.rightButton) {
        return true;
      }

      // click outside removes selection
      setSelectedFeature(null);
    }

    return false;
  }
  return true;
}

/**
 * Handles hover event for Editor layer.
 * @param info Information about hovered object.
 * @param params
 * @param params.editorMenuActive
 * @param params.editor
 * @param params.hoverInfo
 * @returns Returns true is hover is handled.
 */
export function onHover(
  info: PickInfo,
  {hoverInfo, editor, editorMenuActive}: {editorMenuActive: boolean; editor: Editor; hoverInfo}
): boolean {
  if (isDrawingActive(editorMenuActive, editor.mode)) {
    return true;
  }

  return info?.layer?.id === EDITOR_LAYER_ID && hoverInfo?.layer?.id === EDITOR_LAYER_ID;
}

/**
 * For small tooltips with short messages, e.g. "Drag to move the point",
 * use the values below to decide when to position a tooltip to the left
 * of the cursor or above the cursor, depending on proximity to the edge of
 * the viewport to prevent the tooltip from being cut off.
 */
const MIN_DISTANCE_TO_LEFT_EDGE = 200;
const MIN_DISTANCE_TO_BOTTOM_EDGE = 100;

/**
 * Returns tooltip based on interactions with Editor layer.
 * @param info Information about hovered object.
 * @param params
 * @param params.editorMenuActive
 * @param params.editor
 * @param params.theme
 * @raturns Returns a tooltip object compatible with Deck.getTooltip()
 */
// eslint-disable-next-line complexity
export function getTooltip(
  // TODO PickingInfo type in deck typings doesn't include viewport and pixel
  info: PickInfo & {viewport: {width?: number; height?: number}; pixel: number[]},
  {editor, theme, editorMenuActive}: {editorMenuActive: boolean; editor: Editor; theme: any}
): object | null {
  const {object, layer, viewport = {}, pixel = []} = info;
  const closeToLeftEdge = (viewport?.width ?? 0) - (pixel?.[0] ?? 0) < MIN_DISTANCE_TO_LEFT_EDGE;
  const closeToBottomEdge =
    (viewport?.height ?? 0) - (pixel?.[1] ?? 0) < MIN_DISTANCE_TO_BOTTOM_EDGE;

  // don't show the tooltip when the menu is visible
  if (editor.selectionContext?.rightClick) {
    return null;
  }

  if (isDrawingActive(editorMenuActive, editor.mode)) {
    // TODO save interaction state in editor object
    if (
      (layer?.state as {mode?: {_clickSequence?: unknown[]}} | undefined)?.mode?._clickSequence
        ?.length
    ) {
      return null;
    }

    const tooltipText =
      editor.mode === EDITOR_MODES.DRAW_RECTANGLE
        ? 'Click or drag to draw rectangle'
        : editor.mode === EDITOR_MODES.DRAW_POINT
        ? 'Click to add a point'
        : editor.mode === EDITOR_MODES.DRAW_LINESTRING
        ? 'Click to start a line. Double-click to finish'
        : 'Click to start new feature';

    return getTooltipObject(tooltipText, theme, {
      leftOfCursor: closeToLeftEdge,
      aboveCursor: closeToBottomEdge
    });
  }

  if (layer?.id === EDITOR_LAYER_ID) {
    const {selectedFeature} = editor;

    if (selectedFeature) {
      if (!object || (object.id && object.id === selectedFeature.id)) {
        const tooltipText = isFilterFeature(selectedFeature)
          ? 'Filter region\nRight click to view options\nDrag to move the feature'
          : 'Right click to view options\nDrag to move the feature';
        return getTooltipObject(tooltipText, theme, {
          leftOfCursor: closeToLeftEdge,
          aboveCursor: closeToBottomEdge
        });
      }
    }

    if (object?.properties?.editHandleType === 'intermediate') {
      const isLine =
        selectedFeature?.geometry?.type === 'LineString' ||
        selectedFeature?.geometry?.type === 'MultiLineString';
      return getTooltipObject(
        isLine ? 'Drag to move the line\nClick to insert a point' : 'Click to insert a point',
        theme,
        {
          leftOfCursor: closeToLeftEdge,
          aboveCursor: closeToBottomEdge
        }
      );
    }

    if (object?.geometry?.type === 'Point' || object?.properties?.guideType === 'tentative') {
      return getTooltipObject('Drag to move the point', theme, {
        leftOfCursor: closeToLeftEdge,
        aboveCursor: closeToBottomEdge
      });
    }

    return getTooltipObject(
      isFilterFeature(object)
        ? 'Click to select the filter\nRight click to view options'
        : 'Click to select the feature\nRight click to view options',
      theme,
      {
        leftOfCursor: closeToLeftEdge,
        aboveCursor: closeToBottomEdge
      }
    );
  }

  return null;
}

/**
 * Returns cursor type based on interactions with Editor layer.
 * @param params
 * @param params.editorMenuActive
 * @param params.editor
 * @param params.hoverInfo
 * @returns Returns cursor type.
 */
export function getCursor({
  editorMenuActive,
  editor,
  hoverInfo
}: {
  editorMenuActive: boolean;
  editor: Editor;
  hoverInfo: any;
}): string | null {
  if (isDrawingActive(editorMenuActive, editor.mode)) {
    return 'crosshair';
  }

  if (hoverInfo?.layer?.id === EDITOR_LAYER_ID && editor.selectedFeature) {
    return 'move';
  }

  return null;
}

/**
 * Returns a tooltip object that can be used as a Deck tooltip.
 * Positioning can be modified if the cursor is close to the bottom or left edge of the viewport.
 * @param text Text to show.
 * @param theme Current theme.
 * @param position.leftOfCursor Tooltip should display to the left of the cursor.
 * @param position.aboveCursor Tooltip should display above cursor.
 */
function getTooltipObject(
  text: string,
  theme: any,
  position: {leftOfCursor: boolean; aboveCursor: boolean}
): {text: string; style: object} {
  const {leftOfCursor, aboveCursor} = position;
  const marginTop = aboveCursor ? '-70px' : '15px';
  const marginLeft = leftOfCursor ? '-200px' : '15px';
  return {
    text,
    style: {
      'margin-top': marginTop,
      'margin-left': marginLeft,
      'font-family': theme.fontFamily,
      'font-size': theme.tooltipFontSize,
      'font-weight': 400,
      padding: '7px 18px',
      'box-shadow': theme.tooltipBoxShadow,
      'background-color': theme.tooltipBg,
      color: theme.tooltipColor,
      'border-radius': theme.primaryBtnRadius
    }
  };
}
