import {VisState} from './vis-state-updaters';
import { ParsedConfig } from 'schemas';

export function mergeAnimationConfig(state: VisState, animation: ParsedConfig['visState']['animationConfig']): VisState;
export function mergeFilters(state: VisState): VisState;
export function mergeInteractions(state: VisState): VisState;
export function mergeLayerBlending(state: VisState): VisState;
export function mergeLayers(state: VisState): VisState;
export function mergeSplitMaps(state: VisState): VisState;

export function mergeInteractionTooltipConfig(state: VisState)