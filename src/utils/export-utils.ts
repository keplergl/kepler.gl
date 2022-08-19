// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {Blob, URL, atob, Uint8Array, ArrayBuffer, document} from 'global/window';
import get from 'lodash.get';
import {csvFormatRows} from 'd3-dsv';

import {
  EXPORT_IMG_RESOLUTION_OPTIONS,
  EXPORT_IMG_RATIO_OPTIONS,
  RESOLUTIONS,
  EXPORT_IMG_RATIOS,
  EXPORT_DATA_TYPE,
  FourByThreeRatioOption,
  OneXResolutionOption
} from '@kepler.gl/constants';
import {exportMapToHTML} from 'templates/export-map-html';
import {formatCsv} from '@kepler.gl/processors';

import {set, generateHashId} from './utils';
import domtoimage from './dom-to-image';
import {createIndexedDataContainer} from './table-utils/data-container-utils';
import {VisState} from 'reducers';
import {parseFieldValue} from './data-utils';
import {DataContainerInterface} from './table-utils/data-container-interface';

/**
 * Default file names
 */
export const DEFAULT_IMAGE_NAME = 'kepler.gl.png';
export const DEFAULT_HTML_NAME = 'kepler.gl.html';
export const DEFAULT_JSON_NAME = 'kepler.gl.json';
export const DEFAULT_DATA_NAME = 'kepler.gl';

/**
 * Default json export settings
 */
export const DEFAULT_EXPORT_JSON_SETTINGS = {
  hasData: true
};

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
  resolution: keyof typeof RESOLUTIONS;
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

  return {
    scale,
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
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(binary.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  for (let i = 0; i < binary.length; i++) {
    ia[i] = binary.charCodeAt(i);
  }

  return new Blob([ab], {type: mimeString});
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
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Whether color is rgb
 * @returns
 */
export function exportImage(uiStateExportImage: ExportImage, filename = DEFAULT_IMAGE_NAME) {
  const {imageDataUri} = uiStateExportImage;
  if (imageDataUri) {
    const file = dataURItoBlob(imageDataUri);
    downloadFile(file, filename);
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

export function getMapJSON(state, options = DEFAULT_EXPORT_JSON_SETTINGS) {
  const {hasData} = options;
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
  return mapToSave;
}

export function exportJson(state, options: any = {}) {
  const map = getMapJSON(state, options);

  const fileBlob = new Blob([exportToJsonString(map)], {type: 'application/json'});
  const fileName = state.appName ? `${state.appName}.json` : DEFAULT_JSON_NAME;
  downloadFile(fileBlob, fileName);
}

export function exportHtml(state, options) {
  const {userMapboxToken, exportMapboxAccessToken, mode} = options;

  const data = {
    ...getMapJSON(state),
    mapboxApiAccessToken:
      (userMapboxToken || '') !== '' ? userMapboxToken : exportMapboxAccessToken,
    mode
  };

  const fileBlob = new Blob([exportMapToHTML(data)], {type: 'text/html'});
  downloadFile(fileBlob, state.appName ? `${state.appName}.html` : DEFAULT_HTML_NAME);
}

interface StateType {
  visState: VisState;
  appName?: string;
}

export function exportData(state: StateType, options) {
  const {visState, appName} = state;
  const {datasets} = visState;
  const {selectedDataset, dataType, filtered} = options;
  // get the selected data
  const filename = appName ? appName : DEFAULT_DATA_NAME;
  const selectedDatasets = datasets[selectedDataset]
    ? [datasets[selectedDataset]]
    : Object.values(datasets);
  if (!selectedDatasets.length) {
    // error: selected dataset not found.
    return;
  }

  selectedDatasets.forEach(selectedData => {
    const {dataContainer, fields, label, filteredIdxCPU = []} = selectedData;
    const toExport = filtered
      ? createIndexedDataContainer(dataContainer, filteredIdxCPU)
      : dataContainer;

    // start to export data according to selected data type
    switch (dataType) {
      case EXPORT_DATA_TYPE.CSV: {
        const csv = formatCsv(toExport, fields);

        const fileBlob = new Blob([csv], {type: 'text/csv'});
        downloadFile(fileBlob, `${filename}_${label}.csv`);
        break;
      }
      // TODO: support more file types.
      default:
        break;
    }
  });
}

export function exportMap(state, options = DEFAULT_EXPORT_JSON_SETTINGS) {
  const {imageDataUri} = state.uiState.exportImage;
  const thumbnail: Blob | null = imageDataUri ? dataURItoBlob(imageDataUri) : null;
  const mapToSave = getMapJSON(state, options);

  return {
    map: mapToSave,
    thumbnail
  };
}

/**
 * On export data to csv
 * @param dataContainer
 * @param fields `dataset.fields`
 * @returns csv string
 */
export function formatCsv(data: DataContainerInterface, fields: Field[]): string {
  const columns = fields.map(f => f.displayName || f.name);
  const formattedData = [columns];

  // parse geojson object as string
  for (const row of data.rows(true)) {
    formattedData.push(row.map((d, i) => parseFieldValue(d, fields[i].type)));
  }

  return csvFormatRows(formattedData);
}

const exporters = {
  exportImage,
  exportJson,
  exportHtml,
  exportData
};

export default exporters;
