// Copyright (c) 2018 Uber Technologies, Inc.
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

import domtoimage from 'utils/dom-to-image';
import {
  Blob,
  URL,
  atob,
  Uint8Array,
  ArrayBuffer,
  document
} from 'global/window';
import {RESOLUTION_OPTIONS, RATIO_OPTIONS} from 'constants/default-settings';

export function calculateExportImageSize({width, height, ratio, resolution}) {
  const resolutionItem = RESOLUTION_OPTIONS.find(op => op.id === resolution);
  const {width: scaledWidth, height: scaledHeight} = resolutionItem.getSize(
    width,
    height
  );
  const {zoomOffset, scale} = resolutionItem;

  return {
    zoomOffset,
    scale,
    ...RATIO_OPTIONS.find(op => op.id === ratio).getSize(
      scaledWidth,
      scaledHeight
    )
  };
}

export function convertToPng(sourceElem) {
  return domtoimage.toPng(sourceElem);
}

export function dataURItoBlob(dataURI) {
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

export function downloadFile(fileBlob, filename) {
  const url = URL.createObjectURL(fileBlob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
