// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MapView, WebMercatorViewport, type MapViewState} from '@deck.gl/core';
import {DEFAULT_MAPBOX_API_URL, FILTER_VIEW_TYPES, FILTER_TYPES} from '@kepler.gl/constants';
import {getLayerBlendingParameters, getBaseMapLibrary} from '@kepler.gl/utils';
import {isMapboxURL, transformMapboxUrl} from 'maplibregl-mapbox-request-transformer';
import {point} from '@turf/helpers';
import transformTranslate from '@turf/transform-translate';
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

// --- Video export utilities (inlined from @hubble.gl internals) ---

export function scaleToVideoExport(
  viewState: MapViewState,
  container: {width: number; height: number}
): MapViewState & {width: number; height: number} {
  const viewport = new WebMercatorViewport(viewState);
  const nw = viewport.unproject([0, 0]) as [number, number];
  const se = viewport.unproject([viewport.width, viewport.height]) as [number, number];
  const videoViewport = new WebMercatorViewport({
    ...viewState,
    width: container.width,
    height: container.height
  }).fitBounds([nw, se]);
  const {height, width, latitude, longitude, zoom, altitude} = videoViewport;
  return {
    height,
    width,
    latitude,
    longitude,
    pitch: viewState.pitch,
    zoom,
    bearing: viewState.bearing,
    altitude
  } as any;
}

export function parseSetCameraType(strCameraType: string, viewState: MapViewState): MapViewState {
  const modifiedViewState: any = {...viewState};
  const match = strCameraType.match(/\b(?!to)\b\S+\w/g);
  if (!match) return modifiedViewState;

  const turfPoint = point([modifiedViewState.longitude, modifiedViewState.latitude]);

  if (match[0] === 'Orbit') {
    modifiedViewState.bearing = modifiedViewState.bearing + parseInt(match[1], 10);
  }

  const directions = new Set(['East', 'South', 'West', 'North']);
  if (directions.has(match[0])) {
    const directionMap: Record<string, number> = {East: 270, South: 0, West: 90, North: 180};
    const translatedPoly = transformTranslate(turfPoint, 10, directionMap[match[0]]);
    if (match[0] === 'East' || match[0] === 'West') {
      modifiedViewState.longitude = translatedPoly.geometry.coordinates[0];
    } else {
      modifiedViewState.latitude = translatedPoly.geometry.coordinates[1];
    }
  }

  if (match[0] === 'Zoom') {
    modifiedViewState.zoom += match[1] === 'In' ? 3 : -3;
  }

  return modifiedViewState;
}

type Resolution = {value: string; label: string; width: number; height: number};

const RESOLUTIONS: Resolution[] = [
  {value: '960x540', label: 'Good (540p)', width: 960, height: 540},
  {value: '1280x720', label: 'High (720p)', width: 1280, height: 720},
  {value: '1920x1080', label: 'Highest (1080p)', width: 1920, height: 1080},
  {value: '640x480', label: 'Good (480p)', width: 640, height: 480},
  {value: '1280x960', label: 'High (960p)', width: 1280, height: 960},
  {value: '1920x1440', label: 'Highest (1440p)', width: 1920, height: 1440}
];

export function getResolutionSetting(value: string): Resolution {
  return RESOLUTIONS.find(r => r.value === value) || RESOLUTIONS[0];
}
