export type TimeLabelFormat = {
  id: string;
  format: string | null;
  type: string;
  label: string;
};

type TooltipFields = {
  format?: string;
  id?: string;
  name?: string;
  fieldIdx?: number;
  type?: string;
};

export type ColMetaProps = {
  colIdx: number;
  name: string;
  displayName: string;
  type: string;
  format?: string;
  columnStats?: any;
  displayFormat?: string;
};

export type ColMeta = {
  [key: string]: ColMetaProps;
};
