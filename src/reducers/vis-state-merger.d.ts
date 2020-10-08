import {VisState} from './vis-state-updaters';
import {ParsedConfig} from 'schemas';

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
export function mergeLayers(state: VisState, layers: ParsedConfig['visState']['layers'], fromConfig?: boolean): VisState;
export function mergeSplitMaps(
  state: VisState,
  splitMaps: ParsedConfig['visState']['splitMaps'],
  fromConfig?: boolean
): VisState;

export function mergeInteractionTooltipConfig(state: VisState);

export function isValidMerger(arg: any): boolean;
export type Merger = {
  merge: (state: VisState, config: any, fromConfig?: boolean) => VisState, 
  prop: string, 
  toMergeProp?: string 
};

export function validateSavedVisualChannels(fields, newLayer, savedLayer);
export function validateLayerWithData(
  dataset: {fields, id: dataId}, 
  savedLayer: savedLayer, 
  layerClasses: {
    [key: string]: LayerClass
  },
  option?: {
    allowEmptyColumn?: boolean;
  }
): Layer | null;

export type VisStateMergers = Merger[];

export const VIS_STATE_MERGERS: VisStateMergers;
