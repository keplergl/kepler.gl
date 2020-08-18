import {VisState} from './vis-state-updaters';
import {ParsedConfig} from 'schemas';

export function mergeAnimationConfig(
  state: VisState,
  animation: ParsedConfig['visState']['animationConfig']
): VisState;
export function mergeFilters(
  state: VisState,
  filters: ParsedConfig['visState']['filters']
): VisState;
export function mergeInteractions(
  state: VisState,
  interactionConfig: ParsedConfig['visState']['interactionConfig']
): VisState;
export function mergeLayerBlending(
  state: VisState,
  layerBlending: ParsedConfig['visState']['layerBlending']
): VisState;
export function mergeLayers(state: VisState, layers: ParsedConfig['visState']['layers']): VisState;
export function mergeSplitMaps(
  state: VisState,
  splitMaps: ParsedConfig['visState']['splitMaps']
): VisState;

export function mergeInteractionTooltipConfig(state: VisState);

export function isValidMerger(arg: any): boolean;
export type Merger = {
  merge: (state: VisState, config: any) => VisState, 
  prop: string, 
  toMergeProp?: string 
};

export type VisStateMergers = Merger[];

export const VIS_STATE_MERGERS: VisStateMergers;
