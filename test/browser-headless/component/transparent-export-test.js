// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import test from 'tape';
import {convertToPng} from '@kepler.gl/utils';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

test('convertToPng preserves transparent canvas pixels', t => {
  const size = 4;
  const source = document.createElement('div');
  source.style.position = 'relative';
  source.style.width = `${size}px`;
  source.style.height = `${size}px`;
  source.style.backgroundColor = 'rgba(0, 0, 0, 0)';

  const layer = document.createElement('canvas');
  layer.width = size;
  layer.height = size;
  layer.style.position = 'absolute';
  layer.style.inset = '0';
  layer.style.width = `${size}px`;
  layer.style.height = `${size}px`;

  const layerContext = layer.getContext('2d');
  layerContext.fillStyle = 'rgb(255, 0, 0)';
  layerContext.fillRect(0, 0, 2, 2);

  source.appendChild(layer);
  document.body.appendChild(source);

  convertToPng(source, {width: size, height: size})
    .then(loadImage)
    .then(image => {
      const decoded = document.createElement('canvas');
      decoded.width = size;
      decoded.height = size;

      const decodedContext = decoded.getContext('2d');
      decodedContext.drawImage(image, 0, 0);
      const pixels = decodedContext.getImageData(0, 0, size, size).data;

      t.deepEqual(
        Array.from(pixels.slice(0, 4)),
        [255, 0, 0, 255],
        'opaque canvas content should remain opaque in the exported PNG'
      );

      const transparentPixelOffset = (size * size - 1) * 4;
      t.equal(
        pixels[transparentPixelOffset + 3],
        0,
        'untouched export background should remain fully transparent'
      );
    })
    .catch(error => {
      t.fail(`transparent PNG export should succeed: ${error?.message || error}`);
    })
    .then(() => {
      source.remove();
      t.end();
    });
});
