import {Field, Millisecond} from './types';

export type MapState = {
  pitch: number;
  bearing: number;
  latitude: number;
  longitude: number;
  zoom: number;
  dragRotate: boolean;
  width: number;
  height: number;
  isSplit: boolean;
  initialState?: any;
  scale?: number;
};

export type Bounds = [number, number, number, number];

export type HistogramBin = {
  x0: number | undefined;
  x1: number | undefined;
  count: number;
};

export type RangeFieldDomain = {
  domain: [number, number];
  step: number;
  histogram: HistogramBin[];
  enlargedHistogram: HistogramBin[];
};

export type SelectFieldDomain = {
  domain: [true, false];
};
export type MultiSelectFieldDomain = {
  domain: string[];
};

export type TimeRangeFieldDomain = {
  domain: [number, number];
  step: number;
  histogram: HistogramBin[];
  enlargedHistogram: HistogramBin[];
  mappedValue: (Millisecond | null)[];
  // auto generated based on time domain
  defaultTimeFormat?: string | null;
  // custom ui input
  timeFormat?: string | null;
  // custom ui input
  timezone?: string | null;
};
export type FieldDomain =
  | RangeFieldDomain
  | TimeRangeFieldDomain
  | SelectFieldDomain
  | MultiSelectFieldDomain;

export type LineChart = {
  series: {x: number; y: number}[];
  yDomain: [number, number];
  xDomain: [number, number];
};

export type FilterBase<L extends LineChart> = {
  dataId: string[];
  id: string;

  freeze: boolean;

  // time range filter specific
  fixedDomain: boolean;
  enlarged: boolean;
  isAnimating: boolean;
  speed: number;
  showTimeDisplay?: boolean;

  // field specific
  name: string[]; // string
  type: string | null;
  fieldIdx: number[]; // [integer]
  domain: any[] | null;
  value: any;
  mappedValue?: number[];

  // plot
  yAxis: Field | null;
  plotType: string;
  lineChart?: L;
  // gpu filter
  gpu: boolean;
  gpuChannel?: number[];
  fieldType?: string;

  // polygon
  layerId?: string[];
};

export type RangeFilter = FilterBase<LineChart> &
  RangeFieldDomain & {
    type: 'range';
    fieldType: 'real' | 'integer';
    value: [number, number];
    fixedDomain: true;
    typeOptions: ['range'];
  };

export type SelectFilter = FilterBase<LineChart> &
  SelectFieldDomain & {
    type: 'select';
    fieldType: 'boolean';
    value: boolean;
  };

export type MultiSelectFilter = FilterBase<LineChart> &
  MultiSelectFieldDomain & {
    type: 'range';
    fieldType: 'string' | 'date';
    value: string[];
  };
export type TimeRangeFilter = FilterBase<LineChart> &
  TimeRangeFieldDomain & {
    type: 'timeRange';
    fieldType: 'timestamp';
    fixedDomain: true;
    value: [number, number];
    bins?: Object;
    plotType: {
      [key: string]: any;
    };
    animationWindow: string;
  };

export type PolygonFilter = FilterBase<LineChart> & {
  layerId: string[];
  type: 'polygon';
  fixedDomain: true;
  value: Feature;
};

export type Filter =
  | FilterBase<LineChart>
  | RangeFilter
  | TimeRangeFilter
  | SelectFilter
  | MultiSelectFilter
  | PolygonFilter;

export type Feature = {
  id: string;
  properties: any;
  geometry: {
    type: string;
    coordinates: any;
  };
};
export type FeatureValue = {
  id: string;
  properties: {
    filterId: string;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
};
export type Editor = {
  mode: string;
  features: Feature[];
  selectedFeature: any;
  visible: boolean;
};

export type SplitMapLayers = {[key: string]: boolean};
export type SplitMap = {
  layers: SplitMapLayers;
};
export type AnimationConfig = {
  domain: number[] | null;
  currentTime: number | null;
  speed: number;
  isAnimating?: boolean;
  // auto generated based on time domain
  defaultTimeFormat?: string | null;
  // custom ui input
  timeFormat?: string | null;
  // custom ui input
  timezone?: string | null;
  // hide or show control
  hideControl?: boolean;
};

export type BaseInteraction = {
  id: string;
  label: string;
  enabled: boolean;
};
export type TooltipField = {
  name: string;
  format: string | null;
};
export type CompareType = string | null;
export type TooltipInfo = BaseInteraction & {
  config: {
    fieldsToShow: {
      [key: string]: TooltipField[];
    };
    compareMode: boolean;
    compareType: CompareType;
  };
};
export type Geocoder = BaseInteraction & {
  position: number[] | null;
};
export type Brush = BaseInteraction & {
  config: {
    size: number;
  };
};
export type Coordinate = BaseInteraction & {
  position: number[] | null;
};
export type InteractionConfig = {
  tooltip: TooltipInfo;
  geocoder: Geocoder;
  brush: Brush;
  coordinate: Coordinate;
};
export type MapInfo = {
  title: string;
  description: string;
};
export type FileLoading = {
  filesToLoad: FileList;
  onFinish: (payload: any) => any;
  fileCache: any[];
};
export type FileLoadingProgress = {
  [key: string]: {
    percent: number;
    message: string;
    fileName: string;
    error: any;
  };
};

export type LayerGroup = {
  slug: string;
  filter(layer: {id: string}): boolean;
  defaultVisibility: boolean;
};

export type BaseMapStyle = {
  id: string;
  label: string;
  url: string;
  icon: string;
  style?: Object;
  layerGroups: LayerGroup[];
  accessToken?: string;
  custom?: boolean;
};

export declare type ExportImage = {
  ratio: 'SCREEN' | 'FOUR_BY_THREE' | 'SIXTEEN_BY_NINE' | 'CUSTOM';
  resolution: 'ONE_X' | 'TWO_X';
  legend: boolean;
  mapH: number;
  mapW: number;
  imageSize: {
    zoomOffset: number;
    scale: number;
    imageW: number;
    imageH: number;
  };
  imageDataUri: string;
  exporting: boolean;
  processing: boolean;
  error: Error | false;
  center: boolean;
};

export type ExportData = {
  selectedDataset: string;
  dataType: string;
  filtered: boolean;
};

export type ExportHtml = {
  exportMapboxAccessToken: null | string;
  userMapboxToken: string;
  mode: string;
};
export type ExportJson = {
  hasData: boolean;
};
export type ExportMap = {
  HTML: ExportHtml;
  JSON: ExportJson;
  format: 'HTML' | 'JSON';
};

export type MapControl = {
  show: boolean;
  active: boolean;
  disableClose?: boolean;
  activeMapIndex?: number;
};
export type MapControls = {
  visibleLayers?: MapControl;
  mapLegend?: MapControl;
  toggle3d?: MapControl;
  splitMap?: MapControl;
  mapDraw?: MapControl;
  mapLocale?: MapControl;
};

export type LoadFiles = {
  fileLoading: boolean;
};

export type Notifications = {
  message: string;
  type: string;
  topic: string;
  id: string;
  count: number;
  isExpanded?: boolean;
};

export type Locale = string;

export type LayerPanelListView = 'list' | 'sortByDataset';

export type UiState = {
  readOnly: boolean;
  activeSidePanel: string;
  currentModal: string | null;
  datasetKeyToRemove: string | null;
  visibleDropdown: string | null;
  // export image modal ui
  exportImage: ExportImage;
  // export data modal ui
  exportData: ExportData;
  // html export
  exportMap: ExportMap;
  // map control panels
  mapControls: MapControls;
  // ui notifications
  notifications: Notifications[];
  // load files
  loadFiles: LoadFiles;
  // Locale of the UI
  locale: Locale;
  layerPanelListView: LayerPanelListView;
};

/** Width of viewport */
export type Viewport = {
  /**  Width of viewport */
  width?: number;
  /**  Height of viewport */
  height?: number;
  /**  Zoom of viewport */
  zoom?: number;
  /**  Camera angle in degrees (0 is straight down) */
  pitch?: number;
  /**  Map rotation in degrees (0 means north is up) */
  bearing?: number;
  /**  Latitude center of viewport on map in mercator projection */
  latitude?: number;
  /**  Longitude Center of viewport on map in mercator projection */
  longitude?: number;
  /**  Whether to enable drag and rotate map into perspective viewport */
  dragRotate?: boolean;
};

export type MapStyles = {
  [key: string]: BaseMapStyle;
};

export type VisibleLayerGroups = {
  [key: string]: boolean;
};

export type InputStyle = {
  accessToken: string | null;
  error: boolean;
  isValid: boolean;
  label: string | null;
  style: any | null;
  url: string | null;
  icon: string | null;
  custom: boolean;
};
