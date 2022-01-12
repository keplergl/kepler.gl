import {Component} from 'react';

export const ALL_FIELD_TYPES: {
  boolean: 'boolean';
  date: 'date';
  geojson: 'geojson';
  integer: 'integer';
  real: 'real';
  string: 'string';
  timestamp: 'timestamp';
  point: 'point';
};

export const ANIMATION_WINDOW: {
  free: 'free';
  incremental: 'incremental';
  point: 'point';
  interval: 'interval';
};

export const FILTER_TYPES: {
  range: 'range';
  select: 'select';
  input: 'input';
  timeRange: 'timeRange';
  multiSelect: 'multiSelect';
  polygon: 'polygon';
};

export const DEFAULT_TIME_FORMAT: string;

export const BASE_SPEED: number;
export const FPS: number;
export const SPEED_CONTROL_RANGE: [number, number];
export const SPEED_CONTROL_STEP: number;

export type SCALE_TYPES_DEF = {
  ordinal: 'ordinal';
  quantile: 'quantile';
  quantize: 'quantize';
  linear: 'linear';
  sqrt: 'sqrt',
  log: 'log';
  point: 'point';
}

export const SCALE_TYPES: SCALE_TYPES_DEF;

export type SCALE_FUNC_TYPE = {
  [key: keyof SCALE_TYPES_DEF]: () => number
}

export const SCALE_FUNC: SCALE_FUNC_TYPE;

export const SORT_ORDER: {
  ASCENDING: 'ASCENDING';
  DESCENDING: 'DESCENDING';
  UNSORT: 'UNSORT';
};

export type TABLE_OPTION_TYPE = {
  SORT_ASC: 'SORT_ASC';
  SORT_DES: 'SORT_DES';
  UNSORT: 'UNSORT';
  PIN: 'PIN';
  UNPIN: 'UNPIN';
  COPY: 'COPY';
};

export const TABLE_OPTION: TABLE_OPTION_TYPE;

export type TABLE_OPTION = {
  value: keyof TABLE_OPTION_TYPE;
  display: string;
  icon: Component;
  condition: (props: any) => boolean;
};

export const TABLE_OPTION_LIST: TABLE_OPTION[];

export type FILED_TYPE_DISPLAY_TYPE = {
  label: string;
  color: string;
}
export const FILED_TYPE_DISPLAY: {[key: keyof ALL_FIELD_TYPES_DEF]: FILED_TYPE_DISPLAY_TYPE};

export const FIELD_COLORS: {default: string};

export const KEPLER_GL_NAME: string;
export const KEPLER_GL_VERSION: string;
export const KEPLER_GL_WEBSITE: string;

export const EDITOR_MODES: {
  READ_ONLY: 'READ_ONLY';
  DRAW_POLYGON: 'DRAW_POLYGON';
  DRAW_RECTANGLE: 'DRAW_RECTANGLE';
  EDIT: 'EDIT';
};

export type LAYER_TYPES = {
  point: 'point';
  arc: 'arc';
  line: 'line';
  grid: 'grid';
  hexagon: 'hexagon';
  geojson: 'geojson';
  cluster: 'cluster';
  icon: 'icon';
  heatmap: 'heatmap';
  hexagonId: 'hexagonId';
  '3D': '3D';
  trip: 'trip';
  s2: 's2';
}

export type EDITOR_AVAILABLE_LAYERS_DEF = {
  point: 'point';
  arc: 'arc';
  line: 'line';
  hexagon: 'hexagon';
  hexagonId: 'hexagonId';
}

export const EDITOR_AVAILABLE_LAYERS: (keyof EDITOR_AVAILABLE_LAYERS_DEF)[];

export const GEOCODER_DATASET_NAME: string;
export const GEOCODER_LAYER_ID: string;
export const GEOCODER_GEO_OFFSET: number;
export const GEOCODER_ICON_COLOR: [number, number, number];
export const GEOCODER_ICON_SIZE: number;

export const DIMENSIONS: {
  sidePanel: {
    width: number;
    margin: {
      top: number;
      left: number;
      bottom: number;
      right: number;
    },
    headerHeight: number;
  };
  mapControl: {
    width: number;
    padding: number;
    mapLegend: {
      pinned: {
        bottom: number;
        right: number;
      }
    }
  }
};

export const THEME: {
  light: 'light';
  dark: 'dark';
  base: 'base';
};

export const DEFAULT_MAPBOX_API_URL: string;

export const THROTTLE_NOTIFICATION_TIME: number;

export const CHANNEL_SCALES: {
  color: 'color';
  radius: 'radius';
  size: 'size';
  colorAggr: 'colorAggr';
  sizeAggr: 'sizeAggr';
};

export const EXPORT_DATA_TYPE: {
  CSV: string;
};

export type EXPORT_DATA_TYPE_OPTION = {
  id: keyof EXPORT_DATA_TYPE_DEF;
  label: string;
  available: boolean
}
export const EXPORT_DATA_TYPE_OPTIONS: EXPORT_DATA_TYPE_OPTION[];

export const EXPORT_MAP_FORMATS: {
  HTML: 'HTML';
  JSON: 'JSON';
};

export const EXPORT_IMG_RATIOS: {
  SCREEN: 'SCREEN';
  FOUR_BY_THREE: 'FOUR_BY_THREE';
  SIXTEEN_BY_NINE: 'SIXTEEN_BY_NINE';
  CUSTOM: 'CUSTOM';
};

export type EXPORT_IMG_RATIO_OPTION = {
  id: keyof EXPORT_IMG_RATIOS_TYPE;
  label: string;
  getSize: (screenW: number, screenH: number) => {width: number, height: number};
  hidden?: boolean;
}

export const EXPORT_IMG_RATIO_OPTIONS: EXPORT_IMG_RATIO_OPTION[];

export const RESOLUTIONS: {
  ONE_X: 'ONE_X';
  TWO_X: 'TWO_X';
};

export type EXPORT_IMG_RESOLUTION_OPTION = EXPORT_IMG_RATIO_OPTION & {
  available: boolean;
  scale: number;
}
export const EXPORT_IMG_RESOLUTION_OPTIONS: EXPORT_IMG_RESOLUTION_OPTION[];

export const EXPORT_HTML_MAP_MODES: {
  READ: 'READ';
  EDIT: 'EDIT';
};

export type EXPORT_HTML_MAP_MODE_OPTION = {
  id: keyof EXPORT_HTML_MAP_MODES_TYPE;
  label: string;
  available: boolean;
  url: string;
};
export const EXPORT_HTML_MAP_MODE_OPTIONS: EXPORT_HTML_MAP_MODE_OPTION[];

export type EXPORT_MAP_FORMAT_OPTION = {
  id: keyof EXPORT_MAP_FORMATS_TYPE,
  label: string;
  available: string;
};
export const EXPORT_MAP_FORMAT_OPTIONS: EXPORT_MAP_FORMAT_OPTION[];

export type MAP_THUMBNAIL_DIMENSION_TYPE = {
  width: number;
  height: number;
};
export const MAP_THUMBNAIL_DIMENSION: MAP_THUMBNAIL_DIMENSION_TYPE;

export const LOADING_METHODS: {
  upload: 'upload';
  storage: 'storage';
};

export type MAP_INFO_CHARACTER_TYPE = {
  title: number;
  description: number;
}
export const MAP_INFO_CHARACTER: MAP_INFO_CHARACTER_TYPE;

export type FIELD_OPT = {
  type: string;
  scale: object;
  format: object;
};
export const FIELD_OPTS: {
  string: FIELD_OPT,
  real: FIELD_OPT,
  timestamp: FIELD_OPT,
  integer: FIELD_OPT,
  boolean: FIELD_OPT,
  date: FIELD_OPT,
  geojson: FIELD_OPT
}

export type DEFAULT_NOTIFICATION_TOPICS_TYPE = {
  global: string;
  field: string;
};
export const DEFAULT_NOTIFICATION_TOPICS: DEFAULT_NOTIFICATION_TOPICS_TYPE;
export type SIDEBAR_PANELS_TYPE = {
  id: string;
  label: string;
  iconComponent: Component;
  onClick: () => void;
};
export const SIDEBAR_PANELS: SIDEBAR_PANELS_TYPE[];
export const PANELS: SIDEBAR_PANELS_TYPE[];

export type DEFAULT_LAYER_GROUP = {
  slug: string;
  filter: (value) => boolean;
  defaultVisibility: boolean;
};
export const DEFAULT_LAYER_GROUPS: DEFAULT_LAYER_GROUP[];

export const AGGREGATION_TYPES: {
  count: string;
  average: string;
  maximum: string;
  minimum: string;
  median: string;
  stdev: string;
  sum: string;
  variance: string;
  mode: string;
  countUnique: string;
};

export const DATASET_FORMATS: {
  row: string;
  geojson: string;
  csv: string;
  keplergl: string;
};

export const DEFAULT_MAP_STYLES: {
  id: string;
  label: string;
  url: string;
  icon: string;
  layerGroup: DEFAULT_LAYER_GROUPS;
}[];

export type LAYER_BLENDING_TYPE = {
  label: string;
  blendFunc: string[];
  blendEquation: string | string[];
}
export const LAYER_BLENDINGS: {
  additive: LAYER_BLENDING_TYPE;
  normal: LAYER_BLENDING_TYPE;
  subtractive: LAYER_BLENDING_TYPE;
};

export type DEFAULT_NOTIFICATION_TYPES_DEF = {
  info: string;
  error: string;
  warning: string;
  success: string;
};
export const DEFAULT_NOTIFICATION_TYPES: DEFAULT_NOTIFICATION_TYPES_DEF;

export const TRIP_ARC_FIELDS: {
  lat0: string;
  lng0: string;
  lat1: string;
  lng1: string;
}

export const TRIP_POINT_FIELDS: [string, string][];

export const GEOJSON_FIELDS: {
  geojson: string[];
}

export const ICON_FIELDS: {
  icon: string[];
}

export const MAP_CONTROLS: {
  visibleLayers: 'visibleLayers';
  mapLegend: 'mapLegend';
  toggle3d: 'toggle3d';
  toggleGlobe: 'toggleGlobe';
  splitMap: 'splitMap';
  mapDraw: 'mapDraw';
  mapLocale: 'mapLocale';
}

export const DEFAULT_LAYER_COLOR: {
  tripArc: string;
  begintrip_lat: string;
  dropoff_lat: string;
  request_lat: string;
};

export const CHANNEL_SCALE_SUPPORTED_FIELDS: object;
export const CLOUDFRONT: string;
export const MAX_DEFAULT_TOOLTIPS: number;
export const NO_VALUE_COLOR: [number, number, number, number];
export const MAX_GPU_FILTERS: number;
export const DEFAULT_TOOLTIP_FIELDS: {name: string}[];
export const DEFAULT_NOTIFICATION_MESSAGE: string;
export const DEFAULT_UUID_COUNT: number;

// modals
export const DATA_TABLE_ID: string;
export const ADD_DATA_ID: string;
export const DELETE_DATA_ID: string;
export const EXPORT_IMAGE_ID: string;
export const EXPORT_DATA_ID: string;
export const ADD_MAP_STYLE_ID: string;
export const EXPORT_MAP_ID: string;
export const SAVE_MAP_ID: string;
export const OVERWRITE_MAP_ID: string;
export const SHARE_MAP_ID: string;

