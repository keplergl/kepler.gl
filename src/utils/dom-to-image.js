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

/**
 * This file is copied from https://github.com/tsayen/dom-to-image
 * Modified by heshan0131 to allow loading external stylesheets and inline webfonts
 */

import window, {
  Blob,
  Image,
  XMLHttpRequest,
  FileReader,
  setTimeout,
  HTMLInputElement,
  HTMLTextAreaElement,
  HTMLCanvasElement,
  SVGElement,
  Element,
  HTMLImageElement,
  SVGRectElement,
  document,
  XMLSerializer,
  console,
  CSSRule,
  fetch
} from 'global/window';

const util = newUtil();
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
    util,
    inliner,
    options: {}
  }
};

/**
   * @param {Node} node - The DOM Node object to render
   * @param {Object} options - Rendering options
   * @param {Function} options.filter - Should return true if passed node should be included in the output
   *          (excluding node means excluding it's children as well). Not called on the root node.
   * @param {String} options.bgcolor - color for the background, any valid CSS color value.
   * @param {Number} options.width - width to be applied to node before rendering.
   * @param {Number} options.height - height to be applied to node before rendering.
   * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.
   * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
              defaults to 1.0.
    * @param {String} options.imagePlaceholder - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch
    * @param {Boolean} options.cacheBust - set to true to cache bust by appending the time to the request url
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
        options.width || util.width(node),
        options.height || util.height(node)
      )
    );

  function applyOptions(clone) {
    if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;

    if (options.width) clone.style.width = `${options.width}px`;
    if (options.height) clone.style.height = `${options.height}px`;

    if (options.style)
      Object.keys(options.style).forEach((property) => {
        clone.style[property] = options.style[property];
      });

    return clone;
  }
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
 * */
function toPixelData(node, options) {
  return draw(node, options || {}).then(canvas =>
    canvas
      .getContext('2d')
      .getImageData(0, 0, util.width(node), util.height(node)).data
  );
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a PNG image data URL
 * */
function toPng(node, options) {
  return draw(node, options || {}).then(canvas => canvas.toDataURL());
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
 * */
function toJpeg(node, options) {
  options = options || {};
  return draw(node, options).then(canvas => canvas.toDataURL('image/jpeg', options.quality || 1.0));
}

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a PNG image blob
 * */
function toBlob(node, options) {
  return draw(node, options || {}).then(util.canvasToBlob);
}

function copyOptions(options) {
  // Copy options to impl options for use in impl
  if (typeof options.imagePlaceholder === 'undefined') {
    domtoimage.impl.options.imagePlaceholder =
      defaultOptions.imagePlaceholder;
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
    .then(util.makeImage)
    .then(util.delay(100))
    .then(image => {
      const canvas = newCanvas(domNode);
      canvas.getContext('2d').drawImage(image, 0, 0);
      return canvas;
    });

  function newCanvas(dNode) {
    const canvas = document.createElement('canvas');
    canvas.width = options.width || util.width(dNode);
    canvas.height = options.height || util.height(dNode);

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
    if (nd instanceof HTMLCanvasElement) {
      return util.makeImage(nd.toDataURL());
    }
    return nd.cloneNode(false);
  }

  function cloneChildren(original, clone, flt) {
    const children = original.childNodes;
    if (children.length === 0) {
      return Promise.resolve(clone);
    }

    return cloneChildrenInOrder(clone, util.asArray(children))
    .then(() => clone);

    function cloneChildrenInOrder(parent, arrChildren) {
      let done = Promise.resolve();
      arrChildren.forEach(child => {
        done = done
          .then(() => cloneNode(child, flt))
          .then(childClone => {
            if (childClone) parent.appendChild(childClone);
          });
      });
      return done;
    }
  }

  function processClone(original, clone) {
    if (!(clone instanceof Element)) {
      return clone
    };

    return Promise.resolve()
      .then(cloneStyle)
      .then(clonePseudoElements)
      .then(copyUserInput)
      .then(fixSvg)
      .then(() => clone);

    function cloneStyle() {
      const originalStyle = window.getComputedStyle(original);
      copyStyle(originalStyle, clone.style);
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
        function copyProperties(sourceStyle, targetStyle) {
          const propertyKeys = util.asArray(sourceStyle);
          propertyKeys.forEach(name => {
            targetStyle.setProperty(
              name,
              sourceStyle.getPropertyValue(name),
              sourceStyle.getPropertyPriority(name)
            );
          });
        }
      }
    }

    function clonePseudoElements() {
      [':before', ':after'].forEach(element => clonePseudoElement(element));

      function clonePseudoElement(element) {
        const style = window.getComputedStyle(original, element);
        const content = style.getPropertyValue('content');

        if (content === '' || content === 'none') {
          return;
        }

        const className = util.uid();
        clone.className = `${clone.className} ${className}`;
        const styleElement = document.createElement('style');
        styleElement.appendChild(
          formatPseudoElementStyle(className, element, style)
        );
        clone.appendChild(styleElement);

        function formatPseudoElementStyle(cln, elm, stl) {
          const selector = `.${cln}:${elm}`;
          const cssText = stl.cssText
            ? formatCssText(stl)
            : formatCssProperties(stl);
          return document.createTextNode(`${selector}{${cssText}}`);

          function formatCssText(stl1) {
            const cnt = stl1.getPropertyValue('content');
            return `${stl.cssText} content: ${cnt};`;
          }

          function formatCssProperties(stl2) {
            return `${util.asArray(stl2).map(formatProperty).join('; ')};`;

            function formatProperty(name) {
              return (
                `${name}:${stl.getPropertyValue(name)}${stl.getPropertyPriority(name) ? ' !important' : ''}`
              );
            }
          }
        }
      }
    }

    function copyUserInput() {
      if (original instanceof HTMLTextAreaElement)
        clone.innerHTML = original.value;
      if (original instanceof HTMLInputElement)
        clone.setAttribute('value', original.value);
    }

    function fixSvg() {
      if (!(clone instanceof SVGElement)) return;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      if (!(clone instanceof SVGRectElement)) return;
      ['width', 'height'].forEach(attribute => {
        const value = clone.getAttribute(attribute);
        if (!value) return;

        clone.style.setProperty(attribute, value);
      });
    }
  }
}

function embedFonts(node) {
  return fontFaces.resolveAll().then((cssText) => {
    const styleNode = document.createElement('style');
    node.appendChild(styleNode);
    styleNode.appendChild(document.createTextNode(cssText));
    return node;
  });
}

function inlineImages(node) {
  return images.inlineAll(node).then(() => node);
}

function makeSvgDataUri(node, width, height) {
  return Promise.resolve(node)
    .then(nd => {
      nd.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      return new XMLSerializer().serializeToString(nd);
    })
    .then(util.escapeXhtml)
    .then(xhtml =>
      `<foreignObject x="0" y="0" width="100%" height="100%">${xhtml}</foreignObject>`
    )
    .then(foreignObject =>
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${foreignObject}</svg>`
    )
    .then(svg => `data:image/svg+xml;charset=utf-8,${svg}`);
}

function newUtil() {
  return {
    escape,
    parseExtension,
    mimeType,
    dataAsUrl,
    isDataUrl,
    isSrcAsDataUrl,
    canvasToBlob,
    resolveUrl,
    getAndEncode,
    uid: uid(),
    delay,
    asArray,
    escapeXhtml,
    makeImage,
    width,
    height
  };

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

  function parseExtension(url) {
    const match = /\.([^\.\/]*?)$/g.exec(url);
    if (match) {
      return match[1];
    }
    return '';
  }

  function mimeType(url) {
    const extension = parseExtension(url).toLowerCase();
    return mimes()[extension] || '';
  }

  function isDataUrl(url) {
    return url.search(/^(data:)/) !== -1;
  }

  function isSrcAsDataUrl(text) {
    const DATA_URL_REGEX = /url\(['"]?(data:)([^'"]+?)['"]?\)/;

    return text.search(DATA_URL_REGEX) !== -1;
  }
  function cvToBlob(canvas) {
    return new Promise(resolve => {
      const binaryString = window.atob(canvas.toDataURL().split(',')[1]);
      const length = binaryString.length;
      const binaryArray = new Uint8Array(length);

      for (let i = 0; i < length; i++)
        binaryArray[i] = binaryString.charCodeAt(i);

      resolve(
        new Blob([binaryArray], {type: 'image/png'})
      );
    });
  }

  function canvasToBlob(canvas) {
    if (canvas.toBlob)
      return new Promise(resolve => {
        canvas.toBlob(resolve);
      });

    return cvToBlob(canvas);
  }

  function resolveUrl(url, baseUrl) {
    const doc = document.implementation.createHTMLDocument();
    const base = doc.createElement('base');
    doc.head.appendChild(base);
    const a = doc.createElement('a');
    doc.body.appendChild(a);
    base.href = baseUrl;
    a.href = url;
    return a.href;
  }

  function fourRandomChars() {
    /* see http://stackoverflow.com/a/6248722/2519373 */
    return `0000${((Math.random() * Math.pow(36, 4)) << 0).toString(36)}`.slice(-4);
  }

  function uid() {
    let index = 0;

    return () => `u${fourRandomChars()}${index++}`;
  }

  function makeImage(uri) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = reject;
      image.src = uri;
    });
  }

  function getAndEncode(url) {
    const TIMEOUT = 30000;
    if (domtoimage.impl.options.cacheBust) {
      // Cache bypass so we dont have CORS issues with cached images
      // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
      url += (/\?/.test(url) ? '&' : '?') + new Date().getTime();
    }

    return new Promise(resolve => {
      const request = new XMLHttpRequest();

      request.onreadystatechange = done;
      request.ontimeout = timeout;
      request.responseType = 'blob';
      request.timeout = TIMEOUT;
      request.open('GET', url, true);
      request.send();

      let placeholder;
      if (domtoimage.impl.options.imagePlaceholder) {
        const split = domtoimage.impl.options.imagePlaceholder.split(/,/);
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

        const encoder = new FileReader();
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
          fail(
            `timeout of ${TIMEOUT}ms occured while fetching resource: ${url}`
          );
        }
      }

      function fail(message) {
        console.error(message);
        resolve('');
      }
    });
  }

  function dataAsUrl(content, type) {
    return `data:${type};base64,${content}`;
  }

  function escape(string) {
    return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
  }

  function delay(ms) {
    return arg => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(arg);
        }, ms);
      });
    };
  }

  function asArray(arrayLike) {
    const array = [];
    const length = arrayLike.length;
    for (let i = 0; i < length; i++) array.push(arrayLike[i]);
    return array;
  }

  function escapeXhtml(string) {
    return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
  }

  function width(node) {
    const leftBorder = px(node, 'border-left-width');
    const rightBorder = px(node, 'border-right-width');
    return node.scrollWidth + leftBorder + rightBorder;
  }

  function height(node) {
    const topBorder = px(node, 'border-top-width');
    const bottomBorder = px(node, 'border-bottom-width');
    return node.scrollHeight + topBorder + bottomBorder;
  }

  function px(node, styleProperty) {
    const value = window.getComputedStyle(node).getPropertyValue(styleProperty);
    return parseFloat(value.replace('px', ''));
  }
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
    const result = [];
    let match;
    while ((match = URL_REGEX.exec(string)) !== null) {
      result.push(match[1]);
    }
    return result.filter((url) => {
      return !util.isDataUrl(url);
    });
  }

  function inline(string, url, baseUrl, get) {
    return Promise.resolve(url)
      .then(ul => baseUrl ? util.resolveUrl(ul, baseUrl) : ul)
      .then(get || util.getAndEncode)
      .then(data => util.dataAsUrl(data, util.mimeType(url)))
      .then(dataUrl => string.replace(urlAsRegex(url), `$1${dataUrl}$3`));

    function urlAsRegex(url0) {
      return new RegExp(
        `(url\\([\'"]?)(${util.escape(url0)})([\'"]?\\))`,
        'g'
      );
    }
  }

  function inlineAll(string, baseUrl, get) {
    if (nothingToInline() || util.isSrcAsDataUrl(string)) {
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

    function nothingToInline() {
      return !shouldProcess(string);
    }
  }
}

function newFontFaces() {
  return {
    resolveAll,
    impl: {readAll}
  };

  function resolveAll() {
    return readAll(document)
      .then(webFonts => {
        return Promise.all(
          webFonts.map(webFont => webFont.resolve())
        );
      })
      .then(cssStrings => cssStrings.join('\n'));
  }

  function readAll() {
    return Promise.resolve(util.asArray(document.styleSheets))
      .then(loadExternalStyleSheets)
      .then(getCssRules)
      .then(selectWebFontRules)
      .then(rules => rules.map(newWebFont));

    function selectWebFontRules(cssRules) {
      return cssRules
        .filter(rule => rule.type === CSSRule.FONT_FACE_RULE)
        .filter(rule => inliner.shouldProcess(rule.style.getPropertyValue('src')));
    }

    function loadExternalStyleSheets(styleSheets) {
      return Promise.all(
        styleSheets.map(sheet => {
          if (sheet.href) {
            return fetch(sheet.href, {credentials: 'omit'})
              .then(toText)
              .then(setBaseHref(sheet.href))
              .then(toStyleSheet)
              .catch(err => {
                // Handle any error that occurred in any of the previous
                // promises in the chain.
                console.log(err)
                return sheet;
              });
          }
          return Promise.resolve(sheet);
        })
      );

      function toText(response) {
        return response.text();
      }

      function setBaseHref(base) {
        base = base.split('/');
        base.pop();
        base = base.join('/');

        return text => {
          return util.isSrcAsDataUrl(text)
            ? text
            : text.replace(/url\(['"]?([^'"]+?)['"]?\)/g, addBaseHrefToUrl);
        };

        function addBaseHrefToUrl(match, p1) {
          const url = /^http/i.test(p1) ? p1 : concatAndResolveUrl(base, p1);
          return `url('${url}')`;
        }

        // Source: http://stackoverflow.com/a/2676231/3786856
        function concatAndResolveUrl(url, concat) {
          const url1 = url.split('/');
          const url2 = concat.split('/');
          const url3 = [];
          for (let i = 0, l = url1.length; i < l; i++) {
            if (url1[i] === '..') {
              url3.pop();
            } else if (url1[i] !== '.') {
              url3.push(url1[i]);
            }
          }
          for (let i = 0, l = url2.length; i < l; i++) {
            if (url2[i] === '..') {
              url3.pop();
            } else if (url2[i] !== '.') {
              url3.push(url2[i]);
            }
          }
          return url3.join('/');
        }
      }

      function toStyleSheet(text) {
        const doc = document.implementation.createHTMLDocument('');
        const styleElement = document.createElement('style');

        styleElement.textContent = text;
        doc.body.appendChild(styleElement);

        return styleElement.sheet;
      }
    }

    function getCssRules(styleSheets) {
      const cssRules = [];
      styleSheets.forEach((sheet) => {
        if (sheet.cssRules && typeof sheet.cssRules === 'object') {
          try {
            util
              .asArray(sheet.cssRules || [])
              .forEach(cssRules.push.bind(cssRules));
          } catch (e) {
            console.log(
              `Error while reading CSS rules from ${sheet.href}`,
              e.toString()
            );
          }
        } else {
          console.log('getCssRules can not fint cssRules')
        }
      });
      return cssRules;
    }

    function newWebFont(webFontRule) {
      return {
        resolve: () => {
          const baseUrl = (webFontRule.parentStyleSheet || {}).href;
          return inliner.inlineAll(webFontRule.cssText, baseUrl);
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
    return {
      inline
    };

    function inline(get) {
      if (util.isDataUrl(element.src)) {
        return Promise.resolve();
      }
      return Promise.resolve(element.src)
        .then(get || util.getAndEncode)
        .then(data => util.dataAsUrl(data, util.mimeType(element.src)))
        .then(dataUrl =>
          new Promise((resolve, reject) => {
            element.onload = resolve;
            element.onerror = reject;
            element.src = dataUrl;
          })
        );
    }
  }

  function inlineAll(node) {
    if (!(node instanceof Element)) {
      return Promise.resolve(node);
    }

    return inlineBackground(node).then(() => {
      if (node instanceof HTMLImageElement) {
        return newImage(node).inline();
      }
      return Promise.all(
        util.asArray(node.childNodes).map(child => inlineAll(child))
      );
    });

    function inlineBackground(nd) {
      const background = nd.style.getPropertyValue('background');

      if (!background) {
        return Promise.resolve(nd);
      }

      return inliner
        .inlineAll(background)
        .then(inlined => {
          nd.style.setProperty(
            'background',
            inlined,
            nd.style.getPropertyPriority('background')
          );
        })
        .then(() => nd);
    }
  }
}

export default domtoimage;
