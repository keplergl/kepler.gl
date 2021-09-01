import {DataContainerInterface} from './table-utils/data-container-interface';

function dataValueAccessor(any): any;
function sort(a: any, b: any): any;
function dataContainerValueAccessor(d: {index: number}, dc: DataContainerInterface): any;

export function getQuantileDomain(
  data: any[],
  valueAccessor?: typeof dataValueAccessor,
  sortFunc?: typeof sort
): number[];

export function getOrdinalDomain(
  dataContainer: DataContainerInterface,
  valueAccessor: typeof dataContainerValueAccessor
): string[];

export function getLinearDomain(
  data: any[],
  valueAccessor?: typeof dataValueAccessor
): [number, number];

export function getLogDomain(
  data: any[],
  valueAccessor?: typeof dataValueAccessor
): [number, number];
