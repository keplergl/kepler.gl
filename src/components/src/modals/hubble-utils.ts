// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MapView} from '@deck.gl/core';
import {DEFAULT_MAPBOX_API_URL, FILTER_VIEW_TYPES, FILTER_TYPES} from '@kepler.gl/constants';
import {getLayerBlendingParameters, getBaseMapLibrary} from '@kepler.gl/utils';
import {isMapboxURL, transformMapboxUrl} from 'maplibregl-mapbox-request-transformer';
import {TimeRangeFilter} from '@kepler.gl/types';

type KeplerState = {
  visState: any;
  mapState: any;
  mapStyle: any;
};

type MapboxLayerRef = {
  id: string;
} & Record<string, any>;

const linear: (p: number) => number = p => p;
const hold: (p: number) => number = p => (p === 1 ? 1 : 0);

type TimeRangeFilterKeyframes = {
  keyframes: {value: number | [number, number]}[];
  easings: (p: number) => number;
  timings?: number[];
};

function getKeyFramesFree(filter: TimeRangeFilter): TimeRangeFilterKeyframes {
  const delta = filter.value[1] - filter.value[0];
  return {
    keyframes: [
      {value: [filter.domain[0], filter.domain[0] + delta]},
      {value: [filter.domain[1] - delta, filter.domain[1]]}
    ],
    easings: linear
  };
}

export function getTimeRangeFilterKeyframes({
  filter,
  timings
}: {
  filter: TimeRangeFilter;
  timings: number[];
}): TimeRangeFilterKeyframes {
  if (filter.type !== FILTER_TYPES.timeRange) {
    throw new Error("filter type must be 'timeRange'.");
  }

  const duration = timings[1] - timings[0];

  switch (filter.animationWindow) {
    default:
    case 'free': {
      return getKeyFramesFree(filter);
    }
    case 'incremental': {
      return {
        keyframes: [
          {value: [filter.value[0], filter.value[0] + 1]},
          {value: [filter.value[0], filter.domain[1]]}
        ],
        easings: linear
      };
    }
    case 'point': {
      return {
        keyframes: [{value: filter.domain[0]}, {value: filter.domain[1]}],
        easings: linear
      };
    }
    case 'interval': {
      const {plotType, timeBins, dataId} = filter;
      const {interval} = plotType;

      const bins = timeBins?.[dataId[0]]?.[interval];

      if (!interval || !bins || bins.length === 0) {
        return getKeyFramesFree(filter);
      }

      const delta = Math.round(duration / bins.length);

      return {
        timings: bins.map((_, idx) => timings[0] + delta * idx),
        keyframes: bins.map(bin => ({value: [bin.x0, bin.x1]})),
        easings: hold
      };
    }
  }
}

export function getBeforeLayerId(topMapStyle: any, bottomMapStyle: any): MapboxLayerRef | null {
  if (topMapStyle?.layers?.length && bottomMapStyle?.layers?.length) {
    const firstTopLayer = topMapStyle.layers[0];
    const firstTopLayerIdx = bottomMapStyle.layers.findIndex(
      (layer: MapboxLayerRef) => layer.id === firstTopLayer.id
    );
    const beforeIdx = firstTopLayerIdx - 1;
    return beforeIdx > -1 ? bottomMapStyle.layers[beforeIdx] : null;
  }
  return null;
}

export function getStaticMapProps(
  keplerState: KeplerState,
  onViewChange: (viewState: Record<string, any>) => void,
  mapboxApiAccessToken: string,
  mapboxApiUrl: string = DEFAULT_MAPBOX_API_URL
): Record<string, any> {
  const currentStyle = keplerState.mapStyle?.mapStyles?.[keplerState.mapStyle.styleType];
  const accessToken = currentStyle?.accessToken || mapboxApiAccessToken;
  const isMapbox = getBaseMapLibrary(currentStyle) === 'mapbox';

  const mapboxTransformRequest = (url: string, resourceType: string) => {
    if (isMapboxURL(url)) {
      return transformMapboxUrl(url, resourceType, accessToken);
    }
    return {url};
  };

  return {
    ...keplerState.mapState,
    preserveDrawingBuffer: true,
    mapboxApiAccessToken: accessToken,
    mapboxApiUrl,
    transformRequest: mapboxTransformRequest,
    mapStyle: isMapbox
      ? convertMapboxStyleUrls(keplerState.mapStyle?.bottomMapStyle, accessToken)
      : keplerState.mapStyle?.bottomMapStyle,
    onViewportChange: onViewChange,
    mapLib: import('maplibre-gl')
  };
}

/**
 * Convert mapbox:// URLs inside a Mapbox style object to HTTPS API URLs
 * so that maplibre-gl can fetch them directly.
 */
function convertMapboxStyleUrls(style: any, accessToken: string): any {
  if (!style || typeof style !== 'object') return style;

  const converted = {...style};

  if (typeof converted.sprite === 'string' && isMapboxURL(converted.sprite)) {
    converted.sprite = transformMapboxUrl(converted.sprite, 'Sprite', accessToken)?.url;
  }

  if (typeof converted.glyphs === 'string' && isMapboxURL(converted.glyphs)) {
    converted.glyphs = transformMapboxUrl(converted.glyphs, 'Glyphs', accessToken)?.url;
  }

  if (converted.sources) {
    const newSources: Record<string, any> = {};
    for (const [key, source] of Object.entries<any>(converted.sources)) {
      if (source?.url && isMapboxURL(source.url)) {
        newSources[key] = {
          ...source,
          url: transformMapboxUrl(source.url, 'Source', accessToken)?.url
        };
      } else {
        newSources[key] = source;
      }
    }
    converted.sources = newSources;
  }

  return converted;
}

function getHubbleParameters(keplerState: KeplerState): Record<string, any> {
  return getLayerBlendingParameters(keplerState.visState.layerBlending);
}

export function getHubbleDeckGlProps(
  keplerState: KeplerState,
  _mapboxApiAccessToken: string,
  _mapboxApiUrl: string = DEFAULT_MAPBOX_API_URL
): Record<string, any> {
  return {
    parameters: getHubbleParameters(keplerState),
    controller: true,
    views: new MapView({
      id: 'mapbox',
      farZMultiplier: 1.2
    })
  };
}

export function getAnimatableFilters(keplerState: KeplerState): TimeRangeFilter[] {
  const filters = keplerState.visState?.filters || [];
  return filters.filter(
    (f: any) =>
      f.type === FILTER_TYPES.timeRange &&
      (f.view === FILTER_VIEW_TYPES.enlarged || f.syncedWithLayerTimeline)
  );
}
