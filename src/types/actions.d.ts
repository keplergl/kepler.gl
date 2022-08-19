export type ProtoDataset = {
  info: {
    id?: string;
    label?: string;
    format?: string;
    color?: RGBColor;
    type?: string;
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
  supportedFilterTypes?: string[] | null;
  disableDataOperation?: boolean;
};
