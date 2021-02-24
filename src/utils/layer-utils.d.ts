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

import {Layer, LayerClassesType} from 'layers';
import {VisState, Dataset, TooltipField, CompareType, SplitMapLayers} from 'reducers/vis-state-updaters';

export function calculateLayerData(
  layer: Layer,
  state: VisState,
  oldLayerData?: any
): {
  layerData: any;
  layer: Layer;
};

export type LayersToRender = {
  [layerId: string]: boolean;
};

export type LayerHoverProp = {
  data: any[];
  fields: Field[];
  fieldsToShow: TooltipField[];
  layer: Layer;
  primaryData?: any[];
  compareType?: CompareType
};

export function findDefaultLayer(dataset: Dataset, layerClasses: LayerClassesType): Layer[];
export function getLayerHoverProp(arg: {
  interactionConfig: VisState['interactionConfig'];
  hoverInfo: VisState['hoverInfo'];
  layers: VisState['layers'];
  layersToRender: LayersToRender;
  datasets: VisState['datasets'];
}): LayerHoverProp | null;

export function renderDeckGlLayer(props: any, layerCallbacks: {[key]: any}, idx: number);

export function prepareLayersToRender(
  layers: Layer, 
  layerData: VisState['layerData'], 
  mapLayers?: SplitMapLayers): {
  [key: string]: boolean;
}

export function prepareLayersForDeck(
  layers: Layer, 
  layerData: VisState['layerData'], 
): {
  [key: string]: boolean;
}