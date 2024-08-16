// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * This file is copied from https://github.com/tsayen/dom-to-image
 * Modified by heshan0131 to allow loading external stylesheets and inline webfonts
 */

import window from 'global/window';
import document from 'global/document';
import Console from 'global/console';
import svgToMiniDataURI from 'mini-svg-data-uri';
import {IMAGE_EXPORT_ERRORS} from '@kepler.gl/constants';

import {
  canvasToBlob,
  escape,
  escapeXhtml,
  delay,
  processClone,
  asArray,
  makeImage,
  mimeType,
  dataAsUrl,
  isDataUrl,
  isSrcAsDataUrl,
  resolveUrl,
  getWidth,
  getHeight,
  getAndEncode,
  setStyleSheetBaseHref,
  toStyleSheet
} from './dom-utils';

const inliner = newInliner();
const fontFaces = newFontFaces();
const images = newImages();
// Default impl options
const defaultOptions = {
  // Default is to fail on error, no placeholder
  imagePlaceholder: undefined,
  // Default cache bust is false, it will use the cache
  cacheBust: false
};

const domtoimage = {
  toSvg,
  toPng,
  toJpeg,
  toBlob,
  toPixelData,
  impl: {
    fontFaces,
    images,
    inliner,
    options: {} as any
  }
};

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * @param {Function} [options.filter] - Should return true if passed node should be included in the output
 *          (excluding node means excluding it's children as well). Not called on the root node.
 * @param {String} [options.bgcolor] - color for the background, any valid CSS color value.
 * @param {Number} [options.width] - width to be applied to node before rendering.
 * @param {Number} [options.height] - height to be applied to node before rendering.
 * @param {Object} [options.style] - an object whose properties to be copied to node's style before rendering.
 * @param {Number} [options.quality] - a Number between 0 and 1 indicating image quality (applicable to JPEG only), defaults to 1.0.
 * @param {boolean} [options.escapeXhtmlForWebpack] - whether to apply fix for uglify error in dom-to-image (should be true for webpack builds), defaults to true.
 * @param {String} [options.imagePlaceholder] - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch
 * @param {Boolean} [options.cacheBust] - set to true to cache bust by appending the time to the request url
 * @return {Promise} - A promise that is fulfilled with a SVG image data URL
 * */
function toSvg(node, options) {
  options = options || {};
  copyOptions(options);
  return Promise.resolve(node)
    .then(nd => cloneNode(nd, options.filter, true))
    .then(embedFonts)
    .then(inlineImages)
    .then(applyOptions)
    .then(clone =>
      makeSvgDataUri(
        clone,
        options.width || getWidth(node),
        options.height || getHeight(node),
        options.escapeXhtmlForWebpack
      )
    );

  function applyOptions(clone) {
    if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;

    if (options.width) clone.style.width = `${options.width}px`;
    if (options.height) clone.style.height = `${options.height}px`;

    if (options.style)
      Object.keys(options.style).forEach(property => {
        clone.style[property] = options.style[property];
      });

    return clone;
  }
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
 * */
function toPixelData(node, options) {
  return draw(node, options || {}).then(
    canvas => canvas.getContext('2d').getImageData(0, 0, getWidth(node), getHeight(node)).data
  );
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * @return {Promise} - A promise that is fulfilled with a PNG image data URL
 * */
function toPng(node, options) {
  return draw(node, options || {}).then(canvas => canvas.toDataURL());
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
 * */
function toJpeg(node, options) {
  options = options || {};
  return draw(node, options).then(canvas => canvas.toDataURL('image/jpeg', options.quality || 1.0));
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * @return {Promise} - A promise that is fulfilled with a PNG image blob
 * */
function toBlob(node, options) {
  return draw(node, options || {}).then(canvasToBlob);
}

function copyOptions(options) {
  // Copy options to impl options for use in impl
  if (typeof options.imagePlaceholder === 'undefined') {
    domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;
  } else {
    domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;
  }

  if (typeof options.cacheBust === 'undefined') {
    domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;
  } else {
    domtoimage.impl.options.cacheBust = options.cacheBust;
  }
}

function draw(domNode, options) {
  return toSvg(domNode, options)
    .then(makeImage)
    .then(delay(100))
    .then(image => {
      const canvas = newCanvas(domNode);
      canvas.getContext('2d').drawImage(image, 0, 0);
      return canvas;
    });

  function newCanvas(dNode) {
    const canvas = document.createElement('canvas');
    canvas.width = options.width || getWidth(dNode);
    canvas.height = options.height || getHeight(dNode);

    if (options.bgcolor) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = options.bgcolor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return canvas;
  }
}

function cloneNode(node, filter, root) {
  if (!root && filter && !filter(node)) {
    return Promise.resolve();
  }

  return Promise.resolve(node)
    .then(makeNodeCopy)
    .then(clone => cloneChildren(node, clone, filter))
    .then(clone => processClone(node, clone));

  function makeNodeCopy(nd) {
    if (nd instanceof window.HTMLCanvasElement) {
      return makeImage(nd.toDataURL());
    }
    return nd.cloneNode(false);
  }

  function cloneChildrenInOrder(parent, arrChildren, flt) {
    let done = Promise.resolve();
    arrChildren.forEach(child => {
      done = done
        .then(() => cloneNode(child, flt, null))
        .then(childClone => {
          if (childClone) {
            parent.appendChild(childClone);
          }
        });
    });
    return done;
  }

  function cloneChildren(original, clone, flt) {
    const children = original.childNodes;
    if (children.length === 0) {
      return Promise.resolve(clone);
    }

    return cloneChildrenInOrder(clone, asArray(children), flt).then(() => clone);
  }
}

function embedFonts(node) {
  return fontFaces.resolveAll().then(cssText => {
    const styleNode = document.createElement('style');
    node.appendChild(styleNode);
    styleNode.appendChild(document.createTextNode(cssText));
    return node;
  });
}

function inlineImages(node) {
  return images.inlineAll(node).then(() => node);
}

function makeSvgDataUri(node, width, height, escapeXhtmlForWebpack = true) {
  return Promise.resolve(node).then(nd => {
    nd.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const serializedString = new window.XMLSerializer().serializeToString(nd);

    const xhtml = escapeXhtmlForWebpack ? escapeXhtml(serializedString) : serializedString;
    const foreignObject = `<foreignObject x="0" y="0" width="100%" height="100%">${xhtml}</foreignObject>`;
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${foreignObject}</svg>`;

    // Optimizing SVGs in data URIs
    // see https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
    // the best way of encoding SVG in a data: URI is data:image/svg+xml,[actual data].
    // We don’t need the ;charset=utf-8 parameter because the given SVG is ASCII.
    return svgToMiniDataURI(svgStr);
  });
}

function newInliner() {
  const URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

  return {
    inlineAll,
    shouldProcess,
    impl: {
      readUrls,
      inline
    }
  };

  function shouldProcess(string) {
    return string.search(URL_REGEX) !== -1;
  }

  function readUrls(string) {
    const result: string[] = [];
    let match: null | RegExpExecArray;
    while ((match = URL_REGEX.exec(string)) !== null) {
      result.push(match[1]);
    }
    return result.filter(url => {
      return !isDataUrl(url);
    });
  }

  function urlAsRegex(url0) {
    return new RegExp(`(url\\(['"]?)(${escape(url0)})(['"]?\\))`, 'g');
  }

  function inline(string, url, baseUrl, get) {
    return Promise.resolve(url)
      .then(ul => (baseUrl ? resolveUrl(ul, baseUrl) : ul))
      .then(ul => (typeof get === 'function' ? get(ul) : getAndEncode(ul, domtoimage.impl.options)))
      .then(data => dataAsUrl(data, mimeType(url)))
      .then(dataUrl => string.replace(urlAsRegex(url), `$1${dataUrl}$3`));
  }

  function inlineAll(string, baseUrl, get) {
    if (!shouldProcess(string) || isSrcAsDataUrl(string)) {
      return Promise.resolve(string);
    }
    return Promise.resolve(string)
      .then(readUrls)
      .then(urls => {
        let done = Promise.resolve(string);
        urls.forEach(url => {
          done = done.then(str => inline(str, url, baseUrl, get));
        });
        return done;
      });
  }
}

function newFontFaces() {
  return {
    resolveAll,
    impl: {readAll}
  };

  function resolveAll() {
    return readAll()
      .then(webFonts => {
        return Promise.all(webFonts.map(webFont => webFont.resolve()));
      })
      .then(cssStrings => cssStrings.join('\n'));
  }

  function readAll() {
    return Promise.resolve(asArray(document.styleSheets))
      .then(loadExternalStyleSheets)
      .then(getCssRules)
      .then(selectWebFontRules)
      .then(rules => rules.map(newWebFont));

    function selectWebFontRules(cssRules) {
      return cssRules
        .filter(rule => rule.type === window.CSSRule.FONT_FACE_RULE)
        .filter(rule => inliner.shouldProcess(rule.style.getPropertyValue('src')));
    }

    function loadExternalStyleSheets(styleSheets) {
      return Promise.all(
        styleSheets.map(sheet => {
          if (sheet.href) {
            // cloudfont doesn't have allow origin header properly set
            // error response will remain in cache
            const cache = sheet.href.includes('uber-fonts') ? 'no-cache' : 'default';
            return window
              .fetch(sheet.href, {credentials: 'omit', cache})
              .then(response => response.text())
              .then(text => {
                const result = setStyleSheetBaseHref(text, sheet.href);
                return toStyleSheet(result);
              })
              .catch(err => {
                // Handle any error that occurred in any of the previous
                // promises in the chain. stylesheet failed to load should not stop
                // the process, hence result in only a warning, instead of reject
                Console.warn(IMAGE_EXPORT_ERRORS.styleSheet, sheet.href);
                Console.log(err);
                return;
              });
          }
          return Promise.resolve(sheet);
        })
      );
    }

    function getCssRules(styleSheets) {
      const cssRules: any[] = [];
      styleSheets.forEach(sheet => {
        // try...catch because browser may not able to enumerate rules for cross-domain sheets
        if (!sheet) {
          return;
        }
        let rules;
        try {
          rules = sheet.rules || sheet.cssRules;
        } catch (e) {
          Console.log(`'Can't read the css rules of: ${sheet.href}`, e);
          return;
        }

        if (rules && typeof rules === 'object') {
          try {
            asArray(rules || []).forEach(cssRules.push.bind(cssRules));
          } catch (e) {
            Console.log(`Error while reading CSS rules from ${sheet.href}`, e);
            return;
          }
        } else {
          Console.log('getCssRules can not find cssRules');
          return;
        }
      });

      return cssRules;
    }

    function newWebFont(webFontRule) {
      return {
        resolve: () => {
          const baseUrl = (webFontRule.parentStyleSheet || {}).href;
          return inliner.inlineAll(webFontRule.cssText, baseUrl, null);
        },
        src: () => webFontRule.style.getPropertyValue('src')
      };
    }
  }
}

function newImages() {
  return {
    inlineAll,
    impl: {
      newImage
    }
  };

  function newImage(element) {
    function inline(get) {
      if (isDataUrl(element.src)) {
        return Promise.resolve();
      }
      return Promise.resolve(element.src)
        .then(ul =>
          typeof get === 'function' ? get(ul) : getAndEncode(ul, domtoimage.impl.options)
        )
        .then(data => dataAsUrl(data, mimeType(element.src)))
        .then(
          dataUrl =>
            new Promise((resolve, reject) => {
              element.onload = resolve;
              element.onerror = reject;
              element.src = dataUrl;
            })
        );
    }

    return {
      inline
    };
  }

  function inlineAll(node) {
    if (!(node instanceof Element)) {
      return Promise.resolve(node);
    }

    return inlineBackground(node).then(() => {
      if (node instanceof HTMLImageElement) {
        return newImage(node).inline(null);
      }
      return Promise.all(asArray(node.childNodes).map(child => inlineAll(child)));
    });

    function inlineBackground(nd) {
      const background = nd.style.getPropertyValue('background');

      if (!background) {
        return Promise.resolve(nd);
      }

      return inliner
        .inlineAll(background, null, null)
        .then(inlined => {
          nd.style.setProperty('background', inlined, nd.style.getPropertyPriority('background'));
        })
        .then(() => nd);
    }
  }
}

export default domtoimage;
