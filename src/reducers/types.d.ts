export type RGBColor = [number, number, number];
export type RGBAColor = [number, number, number, number];
export type HexColor = string; // this is the best tpescript can do at the moment
export type Millisecond = number;

type ValueOf<T> = T[keyof T];

type Merge<A, B> = {[K in keyof A]: K extends keyof B ? B[K] : A[K]} & B extends infer O
  ? {[K in keyof O]: O[K]}
  : never;
