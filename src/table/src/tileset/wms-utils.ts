// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

const WMS_PARAM_KEYS_TO_REPLACE = new Set([
  'service',
  'request',
  'version',
  'layers',
  'layer',
  'styles',
  'style',
  'format',
  'crs',
  'srs',
  'bbox',
  'width',
  'height',
  'transparent',
  'bgcolor',
  'exceptions',
  'sld',
  'sld_version',
  'legend_options'
]);

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function decodeXmlEntities(value: string): string {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
}

/**
 * LegendURL may be a relative URI. Resolve it against the WMS service URL so
 * `<img src>` does not load it from the Kepler app origin.
 */
export function resolveWmsLegendUrl(href: string, serviceUrl?: string): string | null {
  if (!href) {
    return null;
  }
  try {
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)) {
      return href;
    }
    if (!serviceUrl) {
      return href;
    }
    return new URL(href, serviceUrl).toString();
  } catch {
    return href;
  }
}

function getHref(node: unknown): string | null {
  if (!node) {
    return null;
  }
  if (typeof node === 'string') {
    return decodeXmlEntities(node) || null;
  }
  if (typeof node !== 'object') {
    return null;
  }
  const obj = node as Record<string, unknown>;
  const candidates = [obj['xlink:href'], obj.href, obj.Href, obj['@_xlink:href'], obj['@_href']];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate) {
      return decodeXmlEntities(candidate);
    }
  }
  return null;
}

function extractLegendUrlFromLayerNode(layerNode: Record<string, unknown>): string | null {
  const styles = asArray(layerNode.Style ?? layerNode.style);
  for (const style of styles) {
    if (!style || typeof style !== 'object') {
      continue;
    }
    const legendUrls = asArray(
      (style as Record<string, unknown>).LegendURL ?? (style as Record<string, unknown>).LegendUrl
    );
    for (const legend of legendUrls) {
      if (!legend || typeof legend !== 'object') {
        continue;
      }
      const legendObj = legend as Record<string, unknown>;
      const href = getHref(legendObj) ?? getHref(legendObj.OnlineResource);
      if (href) {
        return href;
      }
    }
  }
  return null;
}

/**
 * Walk raw GetCapabilities JSON (from loaders.gl `includeRawJSON`) and collect
 * Style/LegendURL OnlineResource hrefs keyed by layer name.
 */
export function collectWmsLegendUrlsFromRawJson(json: unknown): Record<string, string> {
  const urls: Record<string, string> = {};

  const visit = (node: unknown) => {
    if (!node) {
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node !== 'object') {
      return;
    }
    const obj = node as Record<string, unknown>;
    const name = obj.Name ?? obj.name;
    const legendUrl = extractLegendUrlFromLayerNode(obj);
    if (typeof name === 'string' && name && legendUrl) {
      urls[name] = legendUrl;
    }
    if ('Layer' in obj) {
      visit(obj.Layer);
    }
    if ('layer' in obj) {
      visit(obj.layer);
    }
    if ('Capability' in obj) {
      visit(obj.Capability);
    }
  };

  const root =
    json && typeof json === 'object' && !Array.isArray(json)
      ? (json as Record<string, unknown>).WMS_Capabilities ||
        (json as Record<string, unknown>).WMT_MS_Capabilities ||
        json
      : json;

  visit(root);
  return urls;
}

/**
 * Replace WMS request parameters on a service URL while keeping vendor query params.
 */
export function buildWmsRequestUrl(
  serviceUrl: string,
  params: Record<string, string | undefined>
): string | null {
  if (!serviceUrl) {
    return null;
  }
  try {
    const url = new URL(serviceUrl);
    for (const key of [...url.searchParams.keys()]) {
      if (WMS_PARAM_KEYS_TO_REPLACE.has(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function buildWmsGetCapabilitiesUrl(serviceUrl: string): string | null {
  return buildWmsRequestUrl(serviceUrl, {
    SERVICE: 'WMS',
    REQUEST: 'GetCapabilities'
  });
}

export function buildWmsGetLegendGraphicUrl(
  serviceUrl: string,
  layerName: string,
  options?: {version?: string; format?: string; style?: string}
): string | null {
  if (!serviceUrl || !layerName) {
    return null;
  }
  return buildWmsRequestUrl(serviceUrl, {
    SERVICE: 'WMS',
    REQUEST: 'GetLegendGraphic',
    VERSION: options?.version || '1.3.0',
    LAYER: layerName,
    FORMAT: options?.format || 'image/png',
    STYLE: options?.style,
    TRANSPARENT: 'TRUE',
    SLD_VERSION: '1.1.0'
  });
}

export function wmsCapabilitiesToDatasetMetadata(
  capabilities: {
    layers?: Array<{
      name?: string;
      title?: string;
      geographicBoundingBox?: unknown;
      queryable?: boolean;
      layers?: any[];
    }>;
    json?: unknown;
    version?: string;
  },
  serviceUrl?: string
): {
  layers: Array<{
    name: string;
    title: string;
    boundingBox: number[] | null;
    queryable?: boolean;
    legendUrl?: string | null;
  }>;
  version: string;
} {
  const layers = (capabilities.layers || []).flatMap(layer => {
    if (layer.layers && layer.layers.length > 0) {
      return layer.layers;
    }
    return layer;
  });

  const legendUrlsFromCapabilities = collectWmsLegendUrlsFromRawJson(capabilities.json);
  const version = capabilities.version || '1.3.0';

  const availableLayers = layers.map((layer: any) => {
    const bb = layer.geographicBoundingBox;

    let boundingBox: number[] | null = null;
    if (Array.isArray(bb) && Array.isArray(bb[0]) && Array.isArray(bb[1])) {
      boundingBox = [bb[0][0], bb[0][1], bb[1][0], bb[1][1]];
    }

    const layerName = layer.name;
    const advertisedLegendUrl =
      typeof layerName === 'string' ? legendUrlsFromCapabilities[layerName] : undefined;
    const legendUrl =
      (advertisedLegendUrl && resolveWmsLegendUrl(advertisedLegendUrl, serviceUrl)) ||
      (typeof layerName === 'string' && serviceUrl
        ? buildWmsGetLegendGraphicUrl(serviceUrl, layerName, {version})
        : null);

    return {
      name: layerName,
      title: layer.title || layer.name,
      boundingBox,
      queryable: layer.queryable,
      legendUrl: legendUrl || null
    };
  });

  return {
    layers: availableLayers,
    version
  };
}
