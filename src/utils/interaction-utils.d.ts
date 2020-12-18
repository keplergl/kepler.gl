import {InteractionConfig, Field, TooltipField, CompareType} from '../reducers/vis-state-updaters';

/**
 * Minus sign used in tooltip formatting.
 */
export const TOOLTIP_MINUS_SIGN: string;

export const BRUSH_CONFIG: {
  range: [number, number]
};

export function getDefaultInteraction(): InteractionConfig;
export function findFieldsToShow(p: {
  fields: Field[];
  id: string;
}): {
  [key: string]: string[];
};

export function getTooltipDisplayDeltaValue(args: {
  item: TooltipField;
  field: Field;
  data: any[];
  fieldIdx: number;
  primaryData: any[];
  compareType: CompareType;
}): string | null;
export function getTooltipDisplayValue(args: {
  item: TooltipField;
  field: Field;
  data: any[];
  fieldIdx: string;
}): string;
