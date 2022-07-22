export type LayerBaseConfig = {
  dataId: string | null;
  label: string;
  color: RGBColor;

  columns: LayerColumns;
  isVisible: boolean;
  isConfigActive: boolean;
  highlightColor: RGBColor | RGBAColor;
  hidden: boolean;

  visConfig: LayerVisConfig;
  textLabel: LayerTextLabel[];

  colorUI: {
    color: ColorUI;
    colorRange: ColorUI;
  };
  animation: {
    enabled: boolean;
    domain?: null;
  };
};

export type LayerColorConfig = {
  colorField: VisualChannelField;
  colorDomain: VisualChannelDomain;
  colorScale: VisualChannelScale;
};
export type LayerSizeConfig = {
  // color by size, domain is set by filters, field, scale type
  sizeDomain: VisualChannelDomain;
  sizeScale: VisualChannelScale;
  sizeField: VisualChannelField;
};
export type LayerHeightConfig = {
  heightField: VisualChannelField;
  heightDomain: VisualChannelDomain;
  heightScale: VisualChannelScale;
};
export type LayerStrokeColorConfig = {
  strokeColorField: VisualChannelField;
  strokeColorDomain: VisualChannelDomain;
  strokeColorScale: VisualChannelScale;
};
export type LayerCoverageConfig = {
  coverageField: VisualChannelField;
  coverageDomain: VisualChannelDomain;
  coverageScale: VisualChannelScale;
};
export type LayerRadiusConfig = {
  radiusField: VisualChannelField;
  radiusDomain: VisualChannelDomain;
  radiusScale: VisualChannelScale;
};
export type LayerWeightConfig = {
  weightField: VisualChannelField;
};