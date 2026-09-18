// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect, useState} from 'react';

import {
  parseLayerConfig,
  serializeEffect,
  serializeFilter,
  serializeLayer,
  validateLayerWithData
} from '@kepler.gl/reducers';
import KeplerGlSchema, {CURRENT_VERSION, KeplerGLSchemaClass} from '@kepler.gl/schemas';
import {Layer, LayerClassesType} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {AnimationConfig, Effect, Filter, MapState, ParsedLayer} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';

export type JsonEditorStatus = {
  status: 'success' | 'error';
  message?: string;
};

const DEFAULT_SUCCESS_MESSAGE = 'Config applied';

export function areJsonEditorsEnabled(): boolean {
  return Boolean(getApplicationConfig().enableJsonEditors);
}

export function stringifyJson(value: unknown): string {
  return JSON.stringify(value ?? {}, null, 2);
}

export function parseJsonObject(text: string): Record<string, unknown> {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('JSON must be an object');
  }
  return parsed as Record<string, unknown>;
}

export function formatJsonText(text: string): string {
  return stringifyJson(parseJsonObject(text));
}

export function applyStatus(ok: boolean, message?: string): JsonEditorStatus {
  return ok
    ? {status: 'success', message: message ?? DEFAULT_SUCCESS_MESSAGE}
    : {status: 'error', message: message ?? "Couldn't apply config"};
}

export function errorStatus(error: unknown): JsonEditorStatus {
  const message = error instanceof Error ? error.message : String(error);
  return {status: 'error', message: `Couldn't apply config: ${message}`};
}

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}

export function layerToJson(layer: Layer, schema: KeplerGLSchemaClass): string {
  return stringifyJson(serializeLayer(layer, schema) ?? {});
}

export function parseAndValidateLayerConfig(
  text: string,
  datasets: Datasets,
  layerClasses: LayerClassesType,
  schema: KeplerGLSchemaClass
): ParsedLayer {
  const nextConfigJson = parseJsonObject(text) as unknown as ParsedLayer;
  const parsedConfig = parseLayerConfig(schema, nextConfigJson);
  if (!parsedConfig) {
    throw new Error('Invalid layer config');
  }
  const dataId = parsedConfig.config?.dataId ?? nextConfigJson.config?.dataId;
  const dataset = dataId ? datasets[dataId] : undefined;
  if (!dataset) {
    throw new Error(`Dataset "${dataId ?? ''}" not found`);
  }
  validateLayerWithData(dataset, parsedConfig, layerClasses, {throwOnError: true});
  return nextConfigJson;
}

export function filterToJson(filter: Filter, schema: KeplerGLSchemaClass): string {
  return stringifyJson(serializeFilter(filter, schema) ?? {});
}

export function jsonToFilterConfig(text: string, filter: Filter): Filter {
  return {...filter, ...parseJsonObject(text), id: filter.id} as Filter;
}

export function effectToJson(effect: Effect, schema: KeplerGLSchemaClass): string {
  return stringifyJson(
    serializeEffect(effect, schema) ?? {
      id: effect.id,
      type: effect.type,
      isEnabled: effect.isEnabled,
      parameters: effect.parameters
    }
  );
}

export function jsonToEffectProps(text: string): Record<string, unknown> {
  const parsed = parseJsonObject(text);
  // deckEffect is runtime-only and can contain circular references
  delete parsed.deckEffect;
  return parsed;
}

export function mapStateToJson(mapState: MapState): string {
  const saved = KeplerGlSchema.getConfigToSave({mapState});
  return stringifyJson(saved.config?.mapState ?? {});
}

export function jsonToMapState(text: string): Partial<MapState> {
  const parsed = parseJsonObject(text);
  const loaded = KeplerGlSchema.parseSavedConfig({
    version: CURRENT_VERSION,
    config: {mapState: parsed}
  });
  return (loaded?.mapState ?? parsed) as Partial<MapState>;
}

const ANIMATION_CONFIG_KEYS: (keyof AnimationConfig)[] = [
  'domain',
  'currentTime',
  'speed',
  'duration',
  'isAnimating',
  'timeSteps',
  'defaultTimeFormat',
  'timeFormat',
  'timezone',
  'hideControl'
];

function isFilterConfig(config: AnimationConfig | Filter): config is Filter {
  return 'type' in config && 'dataId' in config;
}

export function animationConfigToJson(
  config: AnimationConfig | Filter | undefined,
  schema?: KeplerGLSchemaClass
): string {
  if (!config) {
    return '{}';
  }
  if (isFilterConfig(config)) {
    return schema ? filterToJson(config, schema) : stringifyJson({});
  }
  const picked: Partial<AnimationConfig> = {};
  ANIMATION_CONFIG_KEYS.forEach(key => {
    if (config[key] !== undefined) {
      picked[key] = config[key] as never;
    }
  });
  return stringifyJson(picked);
}

export function jsonToAnimationConfig(text: string): AnimationConfig | Filter {
  return parseJsonObject(text) as unknown as AnimationConfig | Filter;
}
