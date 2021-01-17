// Copyright (c) 2021 Uber Technologies, Inc.
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

import console from 'global/console';
import window from 'global/window';
import document from 'global/document';
import {IMAGE_EXPORT_ERRORS} from 'constants/user-feedbacks';

export function processClone(original, clone) {
  if (!(clone instanceof window.Element)) {
    return clone;
  }

  function copyProperties(sourceStyle, targetStyle) {
    const propertyKeys = asArray(sourceStyle);
    propertyKeys.forEach(name => {
      targetStyle.setProperty(
        name,
        sourceStyle.getPropertyValue(name),
        sourceStyle.getPropertyPriority(name)
      );
    });
  }

  function copyStyle(source, target) {
    if (source.cssText) {
      target.cssText = source.cssText;
      // add additional copy of composite styles
      if (source.font) {
        target.font = source.font;
      }
    } else {
      copyProperties(source, target);
    }
  }

  function cloneStyle(og, cln) {
    const originalStyle = window.getComputedStyle(og);
    copyStyle(originalStyle, cln.style);
  }

  function formatPseudoElementStyle(cln, elm, stl) {
    const formatCssText = stl1 => {
      const cnt = stl1.getPropertyValue('content');
      return `${stl.cssText} content: ${cnt};`;
    };

    const formatProperty = name => {
      return `${name}:${stl.getPropertyValue(name)}${
        stl.getPropertyPriority(name) ? ' !important' : ''
      }`;
    };

    const formatCssProperties = stl2 => {
      return `${asArray(stl2)
        .map(formatProperty)
        .join('; ')};`;
    };

    const selector = `.${cln}:${elm}`;
    const cssText = stl.cssText ? formatCssText(stl) : formatCssProperties(stl);

    return document.createTextNode(`${selector}{${cssText}}`);
  }

  function clonePseudoElement(org, cln, element) {
    const style = window.getComputedStyle(org, element);
    const content = style.getPropertyValue('content');

    if (content === '' || content === 'none') {
      return;
    }

    const className = uid();
    cln.className = `${cln.className} ${className}`;
    const styleElement = document.createElement('style');
    styleElement.appendChild(formatPseudoElementStyle(className, element, style));
    cln.appendChild(styleElement);
  }

  function clonePseudoElements([og, cln]) {
    [':before', ':after'].forEach(element => clonePseudoElement(og, cln, element));
  }

  function copyUserInput([og, cln]) {
    if (og instanceof window.HTMLTextAreaElement) cln.innerHTML = og.value;
    if (og instanceof window.HTMLInputElement) cln.setAttribute('value', og.value);
  }

  function fixSvg(cln) {
    if (!(cln instanceof window.SVGElement)) return;
    cln.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    if (!(cln instanceof window.SVGRectElement)) return;
    ['width', 'height'].forEach(attribute => {
      const value = cln.getAttribute(attribute);
      if (!value) return;

      cln.style.setProperty(attribute, value);
    });
  }

  return Promise.resolve([original, clone])
    .then(([og, cln]) => {
      cloneStyle(og, cln);
      return [og, cln];
    })
    .then(([og, cln]) => {
      clonePseudoElements([og, cln]);
      return [og, cln];
    })
    .then(([og, cln]) => {
      copyUserInput([og, cln]);
      return [og, cln];
    })
    .then(([og, cln]) => {
      fixSvg(cln);
      return [og, cln];
    })
    .then(([og, cln]) => cln);
}

/****
 * UTILS
 ****/
export function asArray(arrayLike) {
  const array = [];
  const length = arrayLike.length;
  for (let i = 0; i < length; i++) array.push(arrayLike[i]);
  return array;
}

export function fourRandomChars() {
  /* see http://stackoverflow.com/a/6248722/2519373 */
  return `0000${((Math.random() * Math.pow(36, 4)) << 0).toString(36)}`.slice(-4);
}

export function uid() {
  let index = 0;

  return `u${fourRandomChars()}${index++}`;
}

export function makeImage(uri) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = err => {
      const message = IMAGE_EXPORT_ERRORS.dataUri;
      console.log(uri);
      // error is an Event Object
      // https://www.w3schools.com/jsref/obj_event.asp
      reject({event: err, message});
    };
    image.src = uri;
  });
}

export function isDataUrl(url) {
  return url.search(/^(data:)/) !== -1;
}

function parseExtension(url) {
  const match = /\.([^\.\/]*?)$/g.exec(url);
  if (match) {
    return match[1];
  }
  return '';
}

function mimes() {
  /*
   * Only WOFF and EOT mime types for fonts are 'real'
   * see http://www.iana.org/assignments/media-types/media-types.xhtml
   */
  const WOFF = 'application/font-woff';
  const JPEG = 'image/jpeg';

  return {
    woff: WOFF,
    woff2: WOFF,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: JPEG,
    jpeg: JPEG,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml'
  };
}

export function mimeType(url) {
  const extension = parseExtension(url).toLowerCase();
  return mimes()[extension] || '';
}

export function dataAsUrl(content, type) {
  return `data:${type};base64,${content}`;
}

export function escape(string) {
  return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
}

export function delay(ms) {
  return arg => {
    return new Promise(resolve => {
      window.setTimeout(() => {
        resolve(arg);
      }, ms);
    });
  };
}

export function isSrcAsDataUrl(text) {
  const DATA_URL_REGEX = /url\(['"]?(data:)([^'"]+?)['"]?\)/;

  return text.search(DATA_URL_REGEX) !== -1;
}

function cvToBlob(canvas) {
  return new Promise(resolve => {
    const binaryString = window.atob(canvas.toDataURL().split(',')[1]);
    const length = binaryString.length;
    const binaryArray = new Uint8Array(length);

    for (let i = 0; i < length; i++) binaryArray[i] = binaryString.charCodeAt(i);

    resolve(new window.Blob([binaryArray], {type: 'image/png'}));
  });
}

export function canvasToBlob(canvas) {
  if (canvas.toBlob)
    return new Promise(resolve => {
      canvas.toBlob(resolve);
    });

  return cvToBlob(canvas);
}

export function escapeXhtml(string) {
  return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
}

export function getWidth(node) {
  const leftBorder = px(node, 'border-left-width');
  const rightBorder = px(node, 'border-right-width');
  return node.scrollWidth + leftBorder + rightBorder;
}

export function getHeight(node) {
  const topBorder = px(node, 'border-top-width');
  const bottomBorder = px(node, 'border-bottom-width');
  return node.scrollHeight + topBorder + bottomBorder;
}

function px(node, styleProperty) {
  const value = window.getComputedStyle(node).getPropertyValue(styleProperty);
  return parseFloat(value.replace('px', ''));
}

export function resolveUrl(url, baseUrl) {
  const doc = document.implementation.createHTMLDocument();
  const base = doc.createElement('base');
  doc.head.appendChild(base);
  const a = doc.createElement('a');
  doc.body.appendChild(a);
  base.href = baseUrl;
  a.href = url;
  return a.href;
}

export function getAndEncode(url, options) {
  const TIMEOUT = 30000;
  if (options.cacheBust) {
    // Cache bypass so we dont have CORS issues with cached images
    // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
    url += (/\?/.test(url) ? '&' : '?') + new Date().getTime();
  }

  return new Promise(resolve => {
    const request = new window.XMLHttpRequest();

    request.onreadystatechange = done;
    request.ontimeout = timeout;
    request.responseType = 'blob';
    request.timeout = TIMEOUT;
    request.open('GET', url, true);
    request.send();

    let placeholder;
    if (options.imagePlaceholder) {
      const split = options.imagePlaceholder.split(/,/);
      if (split && split[1]) {
        placeholder = split[1];
      }
    }

    function done() {
      if (request.readyState !== 4) return;

      if (request.status !== 200) {
        if (placeholder) {
          resolve(placeholder);
        } else {
          fail(`cannot fetch resource: ${url}, status: ${request.status}`);
        }

        return;
      }

      const encoder = new window.FileReader();
      encoder.onloadend = () => {
        const content = encoder.result.split(/,/)[1];
        resolve(content);
      };
      encoder.readAsDataURL(request.response);
    }

    function timeout() {
      if (placeholder) {
        resolve(placeholder);
      } else {
        fail(`timeout of ${TIMEOUT}ms occurred while fetching resource: ${url}`);
      }
    }

    function fail(message) {
      console.error(message);
      resolve('');
    }
  });
}
