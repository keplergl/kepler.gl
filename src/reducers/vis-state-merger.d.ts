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
export function mergeColumns(
  state: VisState,
  columnsConfig: ParsedConfig['visState']['columnsConfig']
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
