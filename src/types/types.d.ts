export * from './layers';
export * from './reducers';

export type RGBColor = [number, number, number];
export type RGBAColor = [number, number, number, number];
export type HexColor = string; // this is the best typescript can do at the moment
export type Millisecond = number;

export type ValueOf<T> = T[keyof T];

export type Merge<A, B> = {[K in keyof A]: K extends keyof B ? B[K] : A[K]} & B extends infer O
  ? {[K in keyof O]: O[K]}
  : never;

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type NestedPartial<T> = {
  [P in keyof T]?: NestedPartial<T[P]>;
};

export type RowData = {
  [key: string]: string | null;
}[];

export type ProcessorResult = {fields: Field[]; rows: any[][]} | null;