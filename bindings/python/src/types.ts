import type {AnyModel} from '@anywidget/types';

export interface KeplerGlWidgetModel {
  data: Record<string, DatasetPayload>;
  config: KeplerGlConfig;
  height: number;
}

export interface DatasetPayload {
  id: string;
  data: unknown;
  format: 'csv' | 'json' | 'df' | 'arrow' | 'geojson' | 'geoarrow';
}

export interface KeplerGlConfig {
  version?: string;
  config?: {
    visState?: Record<string, unknown>;
    mapState?: Record<string, unknown>;
    mapStyle?: Record<string, unknown>;
  };
}

export type WidgetModel = AnyModel<KeplerGlWidgetModel>;
