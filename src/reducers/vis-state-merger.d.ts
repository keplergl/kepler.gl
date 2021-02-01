import {VisState, Datasets, Dataset} from './vis-state-updaters';
import {ParsedConfig, ParsedLayer} from 'schemas';
import {Layer} from 'layers';

export function mergeAnimationConfig(
  state: VisState,
  animation: ParsedConfig['visState']['animationConfig'],
  fromConfig?: boolean
): VisState;
export function mergeFilters(
  state: VisState,
  filters: ParsedConfig['visState']['filters'],
  fromConfig?: boolean
): VisState;
export function mergeInteractions(
  state: VisState,
  interactionConfig: ParsedConfig['visState']['interactionConfig'],
  fromConfig?: boolean
): VisState;
export function mergeLayerBlending(
  state: VisState,
  layerBlending: ParsedConfig['visState']['layerBlending'],
  fromConfig?: boolean
): VisState;
export function mergeLayers(
  state: VisState,
  layers: ParsedConfig['visState']['layers'],
  fromConfig?: boolean
): VisState;
export function mergeSplitMaps(
  state: VisState,
  splitMaps: ParsedConfig['visState']['splitMaps'],
  fromConfig?: boolean
): VisState;

export function mergeInteractionTooltipConfig(state: VisState);

export function isValidMerger(arg: any): boolean;
export type Merger = {
  merge: (state: VisState, config: any, fromConfig?: boolean) => VisState;
  prop: string;
  toMergeProp?: string;
};

export function validateSavedVisualChannels(
  fields: Dataset['fields'],
  newLayer: Layer,
  savedLayer: ParsedLayer
): null | Layer;

export function validateLayerWithData(
  dataset: Dataset,
  savedLayer: ParsedLayer,
  layerClasses: VisState['layerClasses'],
  option?: {
    allowEmptyColumn?: boolean;
  }
): Layer | null;

export function validateLayersByDatasets(
  datasets: Datasets,
  layerClasses: VisState['layerClasses'],
  layers: ParsedConfig['visState']['layers']
): {validated: Layer[]; failed: ParsedConfig['visState']['layers']};

export function validateColumn(
  // TODO: Better types here
  column: any, 
  columns: any[], 
  allFields: Dataset['fields']
): boolean;

export function createLayerFromConfig(state: VisState, layerConfig: any): Layer;
export function serializeLayer(Layer): ParsedLayer

export type VisStateMergers = Merger[];

export const VIS_STATE_MERGERS: VisStateMergers;
