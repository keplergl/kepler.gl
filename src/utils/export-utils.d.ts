import {ExportImage} from 'reducers/ui-state-updaters';

export const downloadFile: (fileBlob: Blob, fileName: string) => void;
export const exportJson: (state: any, options: object) => void;
export const exportHtml: (state: any, options: object) => void;
export const exportData: (state: any, options: object) => void;
export const exportMap: (state: any, options?: object) => void;
export const exportImage: (uiStateExportImage: ExportImage, fileName?: string) => void;
export const convertToPng: (sourceElem: HTMLElement, options: object) => Promise;
export const getScaleFromImageSize: (
  imageW: number,
  imageH: number,
  mapW: number,
  mapH: number
) => number;
export const dataURItoBlob: (dataURI: string) => Blob;
