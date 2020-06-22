import {Millisecond} from 'reducers/types';
import {Layer} from 'reducers/vis-state-updaters';
import {Bounds} from 'reducers/map-state-updaters';

export function maybeToDate(
  isTime: boolean, 
  fieldIdx: number, 
  format: string, 
  d: any[]
): any;

export function timeToUnixMilli(value: any, format: string): Millisecond | null;
export function notNullorUndefined(d: any): boolean
export function isPlainObject(d: any): boolean
export function numberSort(a: any, b: any): any
export function unique(values: any[]): any[]
export function getSortingFunction(fieldType: string): numberSort | undefined;
export function preciseRound(num: number, decimals: number): string;
export function parseFieldValue(value: any, type: string): string;
export function getSampleData(
  data: any[],
  sampleSize?: number, 
  getValue?: any
): any[];
export function findMapBounds(layers: Layer[]): Bounds | null;