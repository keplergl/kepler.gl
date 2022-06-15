export type RGBColor = [number, number, number];
export type RGBAColor = [number, number, number, number];
export type HexColor = string; // this is the best typescript can do at the moment
export type Millisecond = number;

export type Bounds = [number, number, number, number];

export type Datasets = {
  [key: string]: KeplerTable;
};

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

/**
 * Input dataest parsed to addDataToMap
 */
export type ProtoDataset = {
  info: {
    id?: string;
    label?: string;
    format?: string;
    color?: RGBColor;
  };
  data: {
    fields: {
      name: string;
      type?: string;
      format?: string;
      displayName?: string;
      id?: string;
    }[];
    rows: any[][];
  };

  // table-injected metadata
  metadata?: any;
  supportedFilterTypes?: string[];
};
