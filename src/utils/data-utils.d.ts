import {Millisecond} from 'reducers/types';
import {Layer, Field} from 'reducers/vis-state-updaters';
import {Bounds} from 'reducers/map-state-updaters';

export function maybeToDate(isTime: boolean, fieldIdx: number, format: string, d: any[]): any;

export function timeToUnixMilli(value: any, format: string): Millisecond | null;
export function notNullorUndefined(d: any): boolean;
export function isNumber(d: any): boolean;
export function isPlainObject(d: any): boolean;
export function numberSort(a: any, b: any): any;
export function unique(values: any[]): any[];
export function getSortingFunction(fieldType: string): numberSort | undefined;
export function preciseRound(num: number, decimals: number): string;
export function parseFieldValue(value: any, type: string): string;
export function getSampleData(data: any[], sampleSize?: number, getValue?: any): any[];
export function findMapBounds(layers: Layer[]): Bounds | null;
function formatter(v: any): any;
export function getFormatter(format: any, field?: Field): formatter;
export function defaultFormatter(v: any): string;
export function snapToMarks(value: number, marks: number[]): number;
export function normalizeSliderValue(
  val: number,
  minValue: number,
  step: number,
  marks?: number[]
): number;
export function roundValToStep(minValue: number, step: number, val: number): number;

export type FieldFormatter = (value: any) => string;
export declare const FIELD_DISPLAY_FORMAT: {
  [key: string]: FieldFormatter;
};
