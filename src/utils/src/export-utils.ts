// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Blob, URL, atob, Uint8Array, ArrayBuffer, document} from 'global/window';
import get from 'es-toolkit/compat/get';

import {
  EXPORT_IMG_RESOLUTION_OPTIONS,
  EXPORT_IMG_RATIO_OPTIONS,
  EXPORT_IMG_RATIOS,
  FourByThreeRatioOption,
  OneXResolutionOption,
  type ExportResolutionOption
} from '@kepler.gl/constants';
import {ExportImage} from '@kepler.gl/types';
import {generateHashId} from '@kepler.gl/common-utils';
import domtoimage from './dom-to-image';
import {set} from './utils';
import {exportMapToHTML} from './export-map-html';
import {getApplicationConfig} from './application-config';

const defaultResolution = OneXResolutionOption;

const defaultRatio = FourByThreeRatioOption;

export function isMSEdge(window: Window): boolean {
  // @ts-ignore msSaveOrOpenBlob was a proprietary addition to the Navigator object, added by Microsoft for Internet Explorer.
  return Boolean(window.navigator && window.navigator.msSaveOrOpenBlob);
}

export function getScaleFromImageSize(imageW = 0, imageH = 0, mapW = 0, mapH = 0) {
  if ([imageW, imageH, mapW, mapH].some(d => d <= 0)) {
    return 1;
  }

  const base = imageW / imageH > 1 ? imageW : imageH;
  const mapBase = imageW / imageH > 1 ? mapW : mapH;
  return base / mapBase;
}

export function calculateExportImageSize({
  mapW,
  mapH,
  ratio,
  resolution
}: {
  mapW: number;
  mapH: number;
  ratio: keyof typeof EXPORT_IMG_RATIOS;
  resolution: ExportResolutionOption;
}) {
  if (mapW <= 0 || mapH <= 0) {
    return null;
  }

  const ratioItem = EXPORT_IMG_RATIO_OPTIONS.find(op => op.id === ratio) || defaultRatio;

  const resolutionItem =
    EXPORT_IMG_RESOLUTION_OPTIONS.find(op => op.id === resolution) || defaultResolution;

  const {width: scaledWidth, height: scaledHeight} = resolutionItem.getSize(mapW, mapH);

  const {width: imageW, height: imageH} = ratioItem.getSize(scaledWidth, scaledHeight);

  const {scale} = ratioItem.id === EXPORT_IMG_RATIOS.CUSTOM ? {scale: undefined} : resolutionItem;
  const resolvedScale = scale ?? 1;

  return {
    zoomOffset: Math.log2(resolvedScale) || 0,
    scale: resolvedScale,
    imageW,
    imageH
  };
}

export function convertToPng(sourceElem: HTMLElement, options) {
  return domtoimage.toPng(sourceElem, options);
}

export function dataURItoBlob(dataURI: string): Blob {
  const binary = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(binary.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  for (let i = 0; i < binary.length; i++) {
    ia[i] = binary.charCodeAt(i);
  }

  return new Blob([ab], {type: mimeString});
}

const ILLEGAL_FILENAME_CHARS = /[/\\?%*:|"<>]/g;
const KNOWN_EXPORT_EXTENSION = /\.(json|html|png|csv|jpe?g|webp)$/i;

/**
 * Turn a user-entered export name into a safe basename.
 * Empty input falls back to `fallback`. Known extensions are stripped so the
 * caller can add the format-specific suffix.
 */
export function getExportFileNameBase(name: string | undefined, fallback: string): string {
  const fallbackBase = fallback.replace(KNOWN_EXPORT_EXTENSION, '').trim() || fallback;
  const raw = (name || '').trim() || fallbackBase;
  const stripped = raw.replace(KNOWN_EXPORT_EXTENSION, '').replace(ILLEGAL_FILENAME_CHARS, '-');
  const cleaned = stripped.replace(/\.+$/, '').trim();
  return cleaned || fallbackBase;
}

/**
 * Resolve a download filename with the given extension.
 */
export function getExportFileName(
  name: string | undefined,
  fallback: string,
  extension: string
): string {
  const cleanExt = extension.replace(/^\./, '');
  return `${getExportFileNameBase(name, fallback)}.${cleanExt}`;
}

export function downloadFile(fileBlob: Blob, fileName: string) {
  if (isMSEdge(window)) {
    (window.navigator as any).msSaveOrOpenBlob(fileBlob, fileName);
  } else {
    const url = URL.createObjectURL(fileBlob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    // in some cases where maps are embedded, e.g. need to
    // create and dispatch an event so that the browser downloads
    // the file instead of navigating to the url
    const evt = new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    });
    link.dispatchEvent(evt);
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Whether color is rgb
 * @returns
 */
export function exportImage(uiStateExportImage: ExportImage, filename?: string) {
  const {imageDataUri} = uiStateExportImage;
  if (imageDataUri) {
    const file = dataURItoBlob(imageDataUri);
    downloadFile(
      file,
      getExportFileName(
        filename ?? uiStateExportImage.fileName,
        getApplicationConfig().defaultImageName,
        'png'
      )
    );
  }
}

export function exportToJsonString(data) {
  try {
    return JSON.stringify(data);
  } catch (e) {
    if (e instanceof TypeError) return e.message;
    // Non-Standard Error Object Property
    return (e as any).description;
  }
}

/** Dataset metadata fields that hold a private layer API key. */
const LAYER_API_KEY_METADATA_FIELDS = ['tile3dAccessToken'];

/**
 * Remove access tokens stored on layer datasets. The tileset URL and the rest
 * of the metadata stay so the map can be reopened and a new key entered.
 */
export function omitLayerApiKeys<T>(mapToSave: T): T {
  const saved = mapToSave as {datasets?: Array<{data?: {metadata?: Record<string, unknown>}}>};
  if (!saved || !Array.isArray(saved.datasets)) {
    return mapToSave;
  }

  let changed = false;
  const datasets = saved.datasets.map(dataset => {
    const metadata = dataset?.data?.metadata;
    if (!metadata || typeof metadata !== 'object') {
      return dataset;
    }
    const nextMetadata = {...metadata};
    let metadataChanged = false;
    for (const field of LAYER_API_KEY_METADATA_FIELDS) {
      if (field in nextMetadata) {
        delete nextMetadata[field];
        metadataChanged = true;
      }
    }
    if (!metadataChanged) {
      return dataset;
    }
    changed = true;
    return {
      ...dataset,
      data: {
        ...dataset.data,
        metadata: nextMetadata
      }
    };
  });

  if (!changed) {
    return mapToSave;
  }
  return {...saved, datasets} as T;
}

type MapJsonOptions = {
  hasData?: boolean;
  /** When false, access tokens stored on layer datasets are removed. */
  includeLayerApiKeys?: boolean;
};

export function getMapJSON(
  state,
  options: MapJsonOptions = getApplicationConfig().defaultExportJsonSettings
) {
  const {hasData, includeLayerApiKeys} = options;
  const schema = state.visState.schema;

  if (!hasData) {
    return schema.getConfigToSave(state);
  }

  let mapToSave = schema.save(state);
  // add file name if title is not provided
  const title = get(mapToSave, ['info', 'title']);
  if (!title || !title.length) {
    mapToSave = set(['info', 'title'], `keplergl_${generateHashId(6)}`, mapToSave);
  }
  if (includeLayerApiKeys === false) {
    mapToSave = omitLayerApiKeys(mapToSave);
  }
  return mapToSave;
}

export function exportJson(state, options: any = {}) {
  const map = getMapJSON(state, options);
  map.info.source = 'kepler.gl';
  const fileBlob = new Blob([exportToJsonString(map)], {type: 'application/json'});
  const fileName = getExportFileName(
    options.fileName,
    state.appName ? `${state.appName}.json` : getApplicationConfig().defaultJsonName,
    'json'
  );
  downloadFile(fileBlob, fileName);
}

export function exportHtml(state, options) {
  const {userMapboxToken, exportMapboxAccessToken, mode, includeLayerApiKeys} = options;

  const data = {
    ...getMapJSON(state, {hasData: true, includeLayerApiKeys}),
    mapboxApiAccessToken:
      (userMapboxToken || '') !== '' ? userMapboxToken : exportMapboxAccessToken,
    mode
  };

  const fileBlob = new Blob([exportMapToHTML(data)], {type: 'text/html'});
  downloadFile(
    fileBlob,
    getExportFileName(
      options.fileName,
      state.appName ? `${state.appName}.html` : getApplicationConfig().defaultHtmlName,
      'html'
    )
  );
}

export function exportMap(state, options = getApplicationConfig().defaultExportJsonSettings) {
  const {imageDataUri} = state.uiState.exportImage;
  const thumbnail: Blob | null = imageDataUri ? dataURItoBlob(imageDataUri) : null;
  const mapToSave = getMapJSON(state, options);

  return {
    map: mapToSave,
    thumbnail
  };
}

const exporters = {
  exportImage,
  exportJson,
  exportHtml
};

export default exporters;
