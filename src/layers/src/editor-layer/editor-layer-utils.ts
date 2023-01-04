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

import {PickInfo} from '@deck.gl/core/lib/deck';
import {Editor, Feature, FeatureSelectionContext} from '@kepler.gl/types';
import {EDITOR_LAYER_ID, EDITOR_MODES} from '@kepler.gl/constants';

/**
 * Returns true if drawing is active.
 * @param editorMenuActive Indicates whether the editor side menu is active.
 * @param mode Current editing mode.
 * @returs Returns true if drawing is active.
 */
export function isDrawingActive(editorMenuActive: boolean, mode: string): boolean {
  return (
    editorMenuActive && (mode === EDITOR_MODES.DRAW_POLYGON || mode === EDITOR_MODES.DRAW_RECTANGLE)
  );
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
  info: PickInfo<any>,
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
    const objectType = info.object.geometry?.type;

    if (drawingActive) {
      if (editor.selectedFeature) {
        setSelectedFeature(null);
      }
    } else if (objectType === 'Polygon' || objectType === 'Point') {
      let clickContext;
      if (event.rightButton) {
        clickContext = {
          mapIndex,
          rightClick: true,
          position: {
            x: event.changedPointers[0].offsetX,
            y: event.changedPointers[0].offsetY
          }
        };
      }

      if (objectType === 'Polygon') {
        setSelectedFeature(info.object, clickContext);
      } else {
        // don't select points
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
  info: PickInfo<any>,
  {hoverInfo, editor, editorMenuActive}: {editorMenuActive: boolean; editor: Editor; hoverInfo}
): boolean {
  if (isDrawingActive(editorMenuActive, editor.mode)) {
    return true;
  }

  return info?.layer?.id === EDITOR_LAYER_ID && hoverInfo?.layer?.id === EDITOR_LAYER_ID;
}

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
  info: PickInfo<any>,
  {editor, theme, editorMenuActive}: {editorMenuActive: boolean; editor: Editor; theme: any}
): object | null {
  const {object, layer} = info;

  // don't show the tooltip when the menu is visible
  if (editor.selectionContext?.rightClick) {
    return null;
  }

  if (isDrawingActive(editorMenuActive, editor.mode)) {
    // TODO save interaction state in editor object
    if (layer?.state?.mode?._clickSequence?.length) {
      return null;
    }

    return getTooltipObject('Click to start new feature', theme);
  }

  if (layer?.id === EDITOR_LAYER_ID) {
    const {selectedFeature} = editor;

    if (selectedFeature) {
      if (!object || (object.id && object.id === selectedFeature.id)) {
        return getTooltipObject('Right click to view options\nDrag to move the feature', theme);
      }
    }

    if (object?.properties?.editHandleType === 'intermediate') {
      return getTooltipObject('Click to insert a point', theme);
    }

    if (object?.geometry?.type === 'Point' || object?.properties?.guideType === 'tentative') {
      return getTooltipObject('Drag to move the point', theme);
    }

    return getTooltipObject('Click to select the feature\nRight click to view options', theme);
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
 * @param text Text to show.
 * @param theme Current theme.
 */
function getTooltipObject(text: string, theme: any): {text: string; style: object} {
  return {
    text,
    style: {
      'margin-top': '15px',
      'margin-left': '15px',
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
