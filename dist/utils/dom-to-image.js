"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _window = _interopRequireDefault(require("global/window"));

var _document = _interopRequireDefault(require("global/document"));

var _console = _interopRequireDefault(require("global/console"));

var _miniSvgDataUri = _interopRequireDefault(require("mini-svg-data-uri"));

var _userFeedbacks = require("../constants/user-feedbacks");

var _domUtils = require("./dom-utils");

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

/**
 * This file is copied from https://github.com/tsayen/dom-to-image
 * Modified by heshan0131 to allow loading external stylesheets and inline webfonts
 */
var inliner = newInliner();
var fontFaces = newFontFaces();
var images = newImages(); // Default impl options

var defaultOptions = {
  // Default is to fail on error, no placeholder
  imagePlaceholder: undefined,
  // Default cache bust is false, it will use the cache
  cacheBust: false
};
var domtoimage = {
  toSvg: toSvg,
  toPng: toPng,
  toJpeg: toJpeg,
  toBlob: toBlob,
  toPixelData: toPixelData,
  impl: {
    fontFaces: fontFaces,
    images: images,
    inliner: inliner,
    options: {}
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
   * @param {Number} [options.quality] - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
              defaults to 1.0.
    * @param {String} [options.imagePlaceholder] - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch
    * @param {Boolean} [options.cacheBust] - set to true to cache bust by appending the time to the request url
    * @return {Promise} - A promise that is fulfilled with a SVG image data URL
    * */

function toSvg(node, options) {
  options = options || {};
  copyOptions(options);
  return Promise.resolve(node).then(function (nd) {
    return cloneNode(nd, options.filter, true);
  }).then(embedFonts).then(inlineImages).then(applyOptions).then(function (clone) {
    return makeSvgDataUri(clone, options.width || (0, _domUtils.getWidth)(node), options.height || (0, _domUtils.getHeight)(node));
  });

  function applyOptions(clone) {
    if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;
    if (options.width) clone.style.width = "".concat(options.width, "px");
    if (options.height) clone.style.height = "".concat(options.height, "px");
    if (options.style) Object.keys(options.style).forEach(function (property) {
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
  return draw(node, options || {}).then(function (canvas) {
    return canvas.getContext('2d').getImageData(0, 0, (0, _domUtils.getWidth)(node), (0, _domUtils.getHeight)(node)).data;
  });
}
/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * @return {Promise} - A promise that is fulfilled with a PNG image data URL
 * */


function toPng(node, options) {
  return draw(node, options || {}).then(function (canvas) {
    return canvas.toDataURL();
  });
}
/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
 * */


function toJpeg(node, options) {
  options = options || {};
  return draw(node, options).then(function (canvas) {
    return canvas.toDataURL('image/jpeg', options.quality || 1.0);
  });
}
/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * @return {Promise} - A promise that is fulfilled with a PNG image blob
 * */


function toBlob(node, options) {
  return draw(node, options || {}).then(_domUtils.canvasToBlob);
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
  return toSvg(domNode, options).then(_domUtils.makeImage).then((0, _domUtils.delay)(100)).then(function (image) {
    var canvas = newCanvas(domNode);
    canvas.getContext('2d').drawImage(image, 0, 0);
    return canvas;
  });

  function newCanvas(dNode) {
    var canvas = _document["default"].createElement('canvas');

    canvas.width = options.width || (0, _domUtils.getWidth)(dNode);
    canvas.height = options.height || (0, _domUtils.getHeight)(dNode);

    if (options.bgcolor) {
      var ctx = canvas.getContext('2d');
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

  return Promise.resolve(node).then(makeNodeCopy).then(function (clone) {
    return cloneChildren(node, clone, filter);
  }).then(function (clone) {
    return (0, _domUtils.processClone)(node, clone);
  });

  function makeNodeCopy(nd) {
    if (nd instanceof _window["default"].HTMLCanvasElement) {
      return (0, _domUtils.makeImage)(nd.toDataURL());
    }

    return nd.cloneNode(false);
  }

  function cloneChildrenInOrder(parent, arrChildren, flt) {
    var done = Promise.resolve();
    arrChildren.forEach(function (child) {
      done = done.then(function () {
        return cloneNode(child, flt);
      }).then(function (childClone) {
        if (childClone) {
          parent.appendChild(childClone);
        }
      });
    });
    return done;
  }

  function cloneChildren(original, clone, flt) {
    var children = original.childNodes;

    if (children.length === 0) {
      return Promise.resolve(clone);
    }

    return cloneChildrenInOrder(clone, (0, _domUtils.asArray)(children), flt).then(function () {
      return clone;
    });
  }
}

function embedFonts(node) {
  return fontFaces.resolveAll().then(function (cssText) {
    var styleNode = _document["default"].createElement('style');

    node.appendChild(styleNode);
    styleNode.appendChild(_document["default"].createTextNode(cssText));
    return node;
  });
}

function inlineImages(node) {
  return images.inlineAll(node).then(function () {
    return node;
  });
}

function makeSvgDataUri(node, width, height) {
  return Promise.resolve(node).then(function (nd) {
    nd.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    var serializedString = new _window["default"].XMLSerializer().serializeToString(nd);
    var xhtml = (0, _domUtils.escapeXhtml)(serializedString);
    var foreignObject = "<foreignObject x=\"0\" y=\"0\" width=\"100%\" height=\"100%\">".concat(xhtml, "</foreignObject>");
    var svgStr = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(width, "\" height=\"").concat(height, "\">").concat(foreignObject, "</svg>"); // Optimizing SVGs in data URIs
    // see https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
    // the best way of encoding SVG in a data: URI is data:image/svg+xml,[actual data].
    // We don’t need the ;charset=utf-8 parameter because the given SVG is ASCII.

    return (0, _miniSvgDataUri["default"])(svgStr);
  });
}

function newInliner() {
  var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;
  return {
    inlineAll: inlineAll,
    shouldProcess: shouldProcess,
    impl: {
      readUrls: readUrls,
      inline: inline
    }
  };

  function shouldProcess(string) {
    return string.search(URL_REGEX) !== -1;
  }

  function readUrls(string) {
    var result = [];
    var match;

    while ((match = URL_REGEX.exec(string)) !== null) {
      result.push(match[1]);
    }

    return result.filter(function (url) {
      return !(0, _domUtils.isDataUrl)(url);
    });
  }

  function urlAsRegex(url0) {
    return new RegExp("(url\\(['\"]?)(".concat((0, _domUtils.escape)(url0), ")(['\"]?\\))"), 'g');
  }

  function inline(string, url, baseUrl, get) {
    return Promise.resolve(url).then(function (ul) {
      return baseUrl ? (0, _domUtils.resolveUrl)(ul, baseUrl) : ul;
    }).then(function (ul) {
      return typeof get === 'function' ? get(ul) : (0, _domUtils.getAndEncode)(ul, domtoimage.impl.options);
    }).then(function (data) {
      return (0, _domUtils.dataAsUrl)(data, (0, _domUtils.mimeType)(url));
    }).then(function (dataUrl) {
      return string.replace(urlAsRegex(url), "$1".concat(dataUrl, "$3"));
    });
  }

  function inlineAll(string, baseUrl, get) {
    if (!shouldProcess(string) || (0, _domUtils.isSrcAsDataUrl)(string)) {
      return Promise.resolve(string);
    }

    return Promise.resolve(string).then(readUrls).then(function (urls) {
      var done = Promise.resolve(string);
      urls.forEach(function (url) {
        done = done.then(function (str) {
          return inline(str, url, baseUrl, get);
        });
      });
      return done;
    });
  }
}

function newFontFaces() {
  return {
    resolveAll: resolveAll,
    impl: {
      readAll: readAll
    }
  };

  function resolveAll() {
    return readAll().then(function (webFonts) {
      return Promise.all(webFonts.map(function (webFont) {
        return webFont.resolve();
      }));
    }).then(function (cssStrings) {
      return cssStrings.join('\n');
    });
  }

  function readAll() {
    return Promise.resolve((0, _domUtils.asArray)(_document["default"].styleSheets)).then(loadExternalStyleSheets).then(getCssRules).then(selectWebFontRules).then(function (rules) {
      return rules.map(newWebFont);
    });

    function selectWebFontRules(cssRules) {
      return cssRules.filter(function (rule) {
        return rule.type === _window["default"].CSSRule.FONT_FACE_RULE;
      }).filter(function (rule) {
        return inliner.shouldProcess(rule.style.getPropertyValue('src'));
      });
    }

    function loadExternalStyleSheets(styleSheets) {
      return Promise.all(styleSheets.map(function (sheet) {
        if (sheet.href) {
          // cloudfont doesn't have allow origin header properly set
          // error response will remain in cache
          var cache = sheet.href.includes('uber-fonts') ? 'no-cache' : 'default';
          return _window["default"].fetch(sheet.href, {
            credentials: 'omit',
            cache: cache
          }).then(function (response) {
            return response.text();
          }).then(setBaseHref(sheet.href)).then(toStyleSheet)["catch"](function (err) {
            // Handle any error that occurred in any of the previous
            // promises in the chain. stylesheet failed to load should not stop
            // the process, hence result in only a warning, instead of reject
            _console["default"].warn(_userFeedbacks.IMAGE_EXPORT_ERRORS.styleSheet, sheet.href);

            _console["default"].log(err);

            return;
          });
        }

        return Promise.resolve(sheet);
      }));

      function setBaseHref(base) {
        base = base.split('/');
        base.pop();
        base = base.join('/');

        function addBaseHrefToUrl(match, p1) {
          var url = /^http/i.test(p1) ? p1 : concatAndResolveUrl(base, p1);
          return "url('".concat(url, "')");
        } // Source: http://stackoverflow.com/a/2676231/3786856


        function concatAndResolveUrl(url, concat) {
          var url1 = url.split('/');
          var url2 = concat.split('/');
          var url3 = [];

          for (var i = 0, l = url1.length; i < l; i++) {
            if (url1[i] === '..') {
              url3.pop();
            } else if (url1[i] !== '.') {
              url3.push(url1[i]);
            }
          }

          for (var _i = 0, _l = url2.length; _i < _l; _i++) {
            if (url2[_i] === '..') {
              url3.pop();
            } else if (url2[_i] !== '.') {
              url3.push(url2[_i]);
            }
          }

          return url3.join('/');
        }

        return function (text) {
          return (0, _domUtils.isSrcAsDataUrl)(text) ? text : text.replace(/url\(['"]?([^'"]+?)['"]?\)/g, addBaseHrefToUrl);
        };
      }

      function toStyleSheet(text) {
        var doc = _document["default"].implementation.createHTMLDocument('');

        var styleElement = _document["default"].createElement('style');

        styleElement.textContent = text;
        doc.body.appendChild(styleElement);
        return styleElement.sheet;
      }
    }

    function getCssRules(styleSheets) {
      var cssRules = [];
      styleSheets.forEach(function (sheet) {
        // try...catch because browser may not able to enumerate rules for cross-domain sheets
        if (!sheet) {
          return;
        }

        var rules;

        try {
          rules = sheet.rules || sheet.cssRules;
        } catch (e) {
          _console["default"].log("'Can't read the css rules of: ".concat(sheet.href), e);

          return;
        }

        if (rules && (0, _typeof2["default"])(rules) === 'object') {
          try {
            (0, _domUtils.asArray)(rules || []).forEach(cssRules.push.bind(cssRules));
          } catch (e) {
            _console["default"].log("Error while reading CSS rules from ".concat(sheet.href), e);

            return;
          }
        } else {
          _console["default"].log('getCssRules can not find cssRules');

          return;
        }
      });
      return cssRules;
    }

    function newWebFont(webFontRule) {
      return {
        resolve: function resolve() {
          var baseUrl = (webFontRule.parentStyleSheet || {}).href;
          return inliner.inlineAll(webFontRule.cssText, baseUrl);
        },
        src: function src() {
          return webFontRule.style.getPropertyValue('src');
        }
      };
    }
  }
}

function newImages() {
  return {
    inlineAll: inlineAll,
    impl: {
      newImage: newImage
    }
  };

  function newImage(element) {
    function inline(get) {
      if ((0, _domUtils.isDataUrl)(element.src)) {
        return Promise.resolve();
      }

      return Promise.resolve(element.src).then(function (ul) {
        return typeof get === 'function' ? get(ul) : (0, _domUtils.getAndEncode)(ul, domtoimage.impl.options);
      }).then(function (data) {
        return (0, _domUtils.dataAsUrl)(data, (0, _domUtils.mimeType)(element.src));
      }).then(function (dataUrl) {
        return new Promise(function (resolve, reject) {
          element.onload = resolve;
          element.onerror = reject;
          element.src = dataUrl;
        });
      });
    }

    return {
      inline: inline
    };
  }

  function inlineAll(node) {
    if (!(node instanceof Element)) {
      return Promise.resolve(node);
    }

    return inlineBackground(node).then(function () {
      if (node instanceof HTMLImageElement) {
        return newImage(node).inline();
      }

      return Promise.all((0, _domUtils.asArray)(node.childNodes).map(function (child) {
        return inlineAll(child);
      }));
    });

    function inlineBackground(nd) {
      var background = nd.style.getPropertyValue('background');

      if (!background) {
        return Promise.resolve(nd);
      }

      return inliner.inlineAll(background).then(function (inlined) {
        nd.style.setProperty('background', inlined, nd.style.getPropertyPriority('background'));
      }).then(function () {
        return nd;
      });
    }
  }
}

var _default = domtoimage;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kb20tdG8taW1hZ2UuanMiXSwibmFtZXMiOlsiaW5saW5lciIsIm5ld0lubGluZXIiLCJmb250RmFjZXMiLCJuZXdGb250RmFjZXMiLCJpbWFnZXMiLCJuZXdJbWFnZXMiLCJkZWZhdWx0T3B0aW9ucyIsImltYWdlUGxhY2Vob2xkZXIiLCJ1bmRlZmluZWQiLCJjYWNoZUJ1c3QiLCJkb210b2ltYWdlIiwidG9TdmciLCJ0b1BuZyIsInRvSnBlZyIsInRvQmxvYiIsInRvUGl4ZWxEYXRhIiwiaW1wbCIsIm9wdGlvbnMiLCJub2RlIiwiY29weU9wdGlvbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJuZCIsImNsb25lTm9kZSIsImZpbHRlciIsImVtYmVkRm9udHMiLCJpbmxpbmVJbWFnZXMiLCJhcHBseU9wdGlvbnMiLCJjbG9uZSIsIm1ha2VTdmdEYXRhVXJpIiwid2lkdGgiLCJoZWlnaHQiLCJiZ2NvbG9yIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInByb3BlcnR5IiwiZHJhdyIsImNhbnZhcyIsImdldENvbnRleHQiLCJnZXRJbWFnZURhdGEiLCJkYXRhIiwidG9EYXRhVVJMIiwicXVhbGl0eSIsImNhbnZhc1RvQmxvYiIsImRvbU5vZGUiLCJtYWtlSW1hZ2UiLCJpbWFnZSIsIm5ld0NhbnZhcyIsImRyYXdJbWFnZSIsImROb2RlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY3R4IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJyb290IiwibWFrZU5vZGVDb3B5IiwiY2xvbmVDaGlsZHJlbiIsIndpbmRvdyIsIkhUTUxDYW52YXNFbGVtZW50IiwiY2xvbmVDaGlsZHJlbkluT3JkZXIiLCJwYXJlbnQiLCJhcnJDaGlsZHJlbiIsImZsdCIsImRvbmUiLCJjaGlsZCIsImNoaWxkQ2xvbmUiLCJhcHBlbmRDaGlsZCIsIm9yaWdpbmFsIiwiY2hpbGRyZW4iLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwicmVzb2x2ZUFsbCIsImNzc1RleHQiLCJzdHlsZU5vZGUiLCJjcmVhdGVUZXh0Tm9kZSIsImlubGluZUFsbCIsInNldEF0dHJpYnV0ZSIsInNlcmlhbGl6ZWRTdHJpbmciLCJYTUxTZXJpYWxpemVyIiwic2VyaWFsaXplVG9TdHJpbmciLCJ4aHRtbCIsImZvcmVpZ25PYmplY3QiLCJzdmdTdHIiLCJVUkxfUkVHRVgiLCJzaG91bGRQcm9jZXNzIiwicmVhZFVybHMiLCJpbmxpbmUiLCJzdHJpbmciLCJzZWFyY2giLCJyZXN1bHQiLCJtYXRjaCIsImV4ZWMiLCJwdXNoIiwidXJsIiwidXJsQXNSZWdleCIsInVybDAiLCJSZWdFeHAiLCJiYXNlVXJsIiwiZ2V0IiwidWwiLCJkYXRhVXJsIiwicmVwbGFjZSIsInVybHMiLCJzdHIiLCJyZWFkQWxsIiwid2ViRm9udHMiLCJhbGwiLCJtYXAiLCJ3ZWJGb250IiwiY3NzU3RyaW5ncyIsImpvaW4iLCJzdHlsZVNoZWV0cyIsImxvYWRFeHRlcm5hbFN0eWxlU2hlZXRzIiwiZ2V0Q3NzUnVsZXMiLCJzZWxlY3RXZWJGb250UnVsZXMiLCJydWxlcyIsIm5ld1dlYkZvbnQiLCJjc3NSdWxlcyIsInJ1bGUiLCJ0eXBlIiwiQ1NTUnVsZSIsIkZPTlRfRkFDRV9SVUxFIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNoZWV0IiwiaHJlZiIsImNhY2hlIiwiaW5jbHVkZXMiLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwicmVzcG9uc2UiLCJ0ZXh0Iiwic2V0QmFzZUhyZWYiLCJ0b1N0eWxlU2hlZXQiLCJlcnIiLCJjb25zb2xlIiwid2FybiIsIklNQUdFX0VYUE9SVF9FUlJPUlMiLCJzdHlsZVNoZWV0IiwibG9nIiwiYmFzZSIsInNwbGl0IiwicG9wIiwiYWRkQmFzZUhyZWZUb1VybCIsInAxIiwidGVzdCIsImNvbmNhdEFuZFJlc29sdmVVcmwiLCJjb25jYXQiLCJ1cmwxIiwidXJsMiIsInVybDMiLCJpIiwibCIsImRvYyIsImltcGxlbWVudGF0aW9uIiwiY3JlYXRlSFRNTERvY3VtZW50Iiwic3R5bGVFbGVtZW50IiwidGV4dENvbnRlbnQiLCJib2R5IiwiZSIsImJpbmQiLCJ3ZWJGb250UnVsZSIsInBhcmVudFN0eWxlU2hlZXQiLCJzcmMiLCJuZXdJbWFnZSIsImVsZW1lbnQiLCJyZWplY3QiLCJvbmxvYWQiLCJvbmVycm9yIiwiRWxlbWVudCIsImlubGluZUJhY2tncm91bmQiLCJIVE1MSW1hZ2VFbGVtZW50IiwiYmFja2dyb3VuZCIsImlubGluZWQiLCJzZXRQcm9wZXJ0eSIsImdldFByb3BlcnR5UHJpb3JpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQTlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQXlCQSxJQUFNQSxPQUFPLEdBQUdDLFVBQVUsRUFBMUI7QUFDQSxJQUFNQyxTQUFTLEdBQUdDLFlBQVksRUFBOUI7QUFDQSxJQUFNQyxNQUFNLEdBQUdDLFNBQVMsRUFBeEIsQyxDQUNBOztBQUNBLElBQU1DLGNBQWMsR0FBRztBQUNyQjtBQUNBQyxFQUFBQSxnQkFBZ0IsRUFBRUMsU0FGRztBQUdyQjtBQUNBQyxFQUFBQSxTQUFTLEVBQUU7QUFKVSxDQUF2QjtBQU9BLElBQU1DLFVBQVUsR0FBRztBQUNqQkMsRUFBQUEsS0FBSyxFQUFMQSxLQURpQjtBQUVqQkMsRUFBQUEsS0FBSyxFQUFMQSxLQUZpQjtBQUdqQkMsRUFBQUEsTUFBTSxFQUFOQSxNQUhpQjtBQUlqQkMsRUFBQUEsTUFBTSxFQUFOQSxNQUppQjtBQUtqQkMsRUFBQUEsV0FBVyxFQUFYQSxXQUxpQjtBQU1qQkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pkLElBQUFBLFNBQVMsRUFBVEEsU0FESTtBQUVKRSxJQUFBQSxNQUFNLEVBQU5BLE1BRkk7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UDs7QUFPQSxhQUFTeUcsZ0JBQVQsQ0FBMEJ2SixFQUExQixFQUE4QjtBQUM1QixVQUFNeUosVUFBVSxHQUFHekosRUFBRSxDQUFDVyxLQUFILENBQVM2RixnQkFBVCxDQUEwQixZQUExQixDQUFuQjs7QUFFQSxVQUFJLENBQUNpRCxVQUFMLEVBQWlCO0FBQ2YsZUFBTzVKLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQkUsRUFBaEIsQ0FBUDtBQUNEOztBQUVELGFBQU92QixPQUFPLENBQ1hnRixTQURJLENBQ01nRyxVQUROLEVBRUoxSixJQUZJLENBRUMsVUFBQTJKLE9BQU8sRUFBSTtBQUNmMUosUUFBQUEsRUFBRSxDQUFDVyxLQUFILENBQVNnSixXQUFULENBQXFCLFlBQXJCLEVBQW1DRCxPQUFuQyxFQUE0QzFKLEVBQUUsQ0FBQ1csS0FBSCxDQUFTaUosbUJBQVQsQ0FBNkIsWUFBN0IsQ0FBNUM7QUFDRCxPQUpJLEVBS0o3SixJQUxJLENBS0M7QUFBQSxlQUFNQyxFQUFOO0FBQUEsT0FMRCxDQUFQO0FBTUQ7QUFDRjtBQUNGOztlQUVjYixVIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLyoqXG4gKiBUaGlzIGZpbGUgaXMgY29waWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3RzYXllbi9kb20tdG8taW1hZ2VcbiAqIE1vZGlmaWVkIGJ5IGhlc2hhbjAxMzEgdG8gYWxsb3cgbG9hZGluZyBleHRlcm5hbCBzdHlsZXNoZWV0cyBhbmQgaW5saW5lIHdlYmZvbnRzXG4gKi9cblxuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IGNvbnNvbGUgZnJvbSAnZ2xvYmFsL2NvbnNvbGUnO1xuaW1wb3J0IHN2Z1RvTWluaURhdGFVUkkgZnJvbSAnbWluaS1zdmctZGF0YS11cmknO1xuaW1wb3J0IHtJTUFHRV9FWFBPUlRfRVJST1JTfSBmcm9tICdjb25zdGFudHMvdXNlci1mZWVkYmFja3MnO1xuaW1wb3J0IHtcbiAgY2FudmFzVG9CbG9iLFxuICBlc2NhcGUsXG4gIGVzY2FwZVhodG1sLFxuICBkZWxheSxcbiAgcHJvY2Vzc0Nsb25lLFxuICBhc0FycmF5LFxuICBtYWtlSW1hZ2UsXG4gIG1pbWVUeXBlLFxuICBkYXRhQXNVcmwsXG4gIGlzRGF0YVVybCxcbiAgaXNTcmNBc0RhdGFVcmwsXG4gIHJlc29sdmVVcmwsXG4gIGdldFdpZHRoLFxuICBnZXRIZWlnaHQsXG4gIGdldEFuZEVuY29kZVxufSBmcm9tICcuL2RvbS11dGlscyc7XG5cbmNvbnN0IGlubGluZXIgPSBuZXdJbmxpbmVyKCk7XG5jb25zdCBmb250RmFjZXMgPSBuZXdGb250RmFjZXMoKTtcbmNvbnN0IGltYWdlcyA9IG5ld0ltYWdlcygpO1xuLy8gRGVmYXVsdCBpbXBsIG9wdGlvbnNcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAvLyBEZWZhdWx0IGlzIHRvIGZhaWwgb24gZXJyb3IsIG5vIHBsYWNlaG9sZGVyXG4gIGltYWdlUGxhY2Vob2xkZXI6IHVuZGVmaW5lZCxcbiAgLy8gRGVmYXVsdCBjYWNoZSBidXN0IGlzIGZhbHNlLCBpdCB3aWxsIHVzZSB0aGUgY2FjaGVcbiAgY2FjaGVCdXN0OiBmYWxzZVxufTtcblxuY29uc3QgZG9tdG9pbWFnZSA9IHtcbiAgdG9TdmcsXG4gIHRvUG5nLFxuICB0b0pwZWcsXG4gIHRvQmxvYixcbiAgdG9QaXhlbERhdGEsXG4gIGltcGw6IHtcbiAgICBmb250RmFjZXMsXG4gICAgaW1hZ2VzLFxuICAgIGlubGluZXIsXG4gICAgb3B0aW9uczoge31cbiAgfVxufTtcblxuLyoqXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAtIFRoZSBET00gTm9kZSBvYmplY3QgdG8gcmVuZGVyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUmVuZGVyaW5nIG9wdGlvbnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZmlsdGVyXSAtIFNob3VsZCByZXR1cm4gdHJ1ZSBpZiBwYXNzZWQgbm9kZSBzaG91bGQgYmUgaW5jbHVkZWQgaW4gdGhlIG91dHB1dFxuICAgKiAgICAgICAgICAoZXhjbHVkaW5nIG5vZGUgbWVhbnMgZXhjbHVkaW5nIGl0J3MgY2hpbGRyZW4gYXMgd2VsbCkuIE5vdCBjYWxsZWQgb24gdGhlIHJvb3Qgbm9kZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmJnY29sb3JdIC0gY29sb3IgZm9yIHRoZSBiYWNrZ3JvdW5kLCBhbnkgdmFsaWQgQ1NTIGNvbG9yIHZhbHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGhdIC0gd2lkdGggdG8gYmUgYXBwbGllZCB0byBub2RlIGJlZm9yZSByZW5kZXJpbmcuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHRdIC0gaGVpZ2h0IHRvIGJlIGFwcGxpZWQgdG8gbm9kZSBiZWZvcmUgcmVuZGVyaW5nLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc3R5bGVdIC0gYW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgdG8gYmUgY29waWVkIHRvIG5vZGUncyBzdHlsZSBiZWZvcmUgcmVuZGVyaW5nLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucXVhbGl0eV0gLSBhIE51bWJlciBiZXR3ZWVuIDAgYW5kIDEgaW5kaWNhdGluZyBpbWFnZSBxdWFsaXR5IChhcHBsaWNhYmxlIHRvIEpQRUcgb25seSksXG4gICAgICAgICAgICAgIGRlZmF1bHRzIHRvIDEuMC5cbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5pbWFnZVBsYWNlaG9sZGVyXSAtIGRhdGFVUkwgdG8gdXNlIGFzIGEgcGxhY2Vob2xkZXIgZm9yIGZhaWxlZCBpbWFnZXMsIGRlZmF1bHQgYmVoYXZpb3VyIGlzIHRvIGZhaWwgZmFzdCBvbiBpbWFnZXMgd2UgY2FuJ3QgZmV0Y2hcbiAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY2FjaGVCdXN0XSAtIHNldCB0byB0cnVlIHRvIGNhY2hlIGJ1c3QgYnkgYXBwZW5kaW5nIHRoZSB0aW1lIHRvIHRoZSByZXF1ZXN0IHVybFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCBhIFNWRyBpbWFnZSBkYXRhIFVSTFxuICAgICogKi9cbmZ1bmN0aW9uIHRvU3ZnKG5vZGUsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGNvcHlPcHRpb25zKG9wdGlvbnMpO1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5vZGUpXG4gICAgLnRoZW4obmQgPT4gY2xvbmVOb2RlKG5kLCBvcHRpb25zLmZpbHRlciwgdHJ1ZSkpXG4gICAgLnRoZW4oZW1iZWRGb250cylcbiAgICAudGhlbihpbmxpbmVJbWFnZXMpXG4gICAgLnRoZW4oYXBwbHlPcHRpb25zKVxuICAgIC50aGVuKGNsb25lID0+XG4gICAgICBtYWtlU3ZnRGF0YVVyaShjbG9uZSwgb3B0aW9ucy53aWR0aCB8fCBnZXRXaWR0aChub2RlKSwgb3B0aW9ucy5oZWlnaHQgfHwgZ2V0SGVpZ2h0KG5vZGUpKVxuICAgICk7XG5cbiAgZnVuY3Rpb24gYXBwbHlPcHRpb25zKGNsb25lKSB7XG4gICAgaWYgKG9wdGlvbnMuYmdjb2xvcikgY2xvbmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5iZ2NvbG9yO1xuXG4gICAgaWYgKG9wdGlvbnMud2lkdGgpIGNsb25lLnN0eWxlLndpZHRoID0gYCR7b3B0aW9ucy53aWR0aH1weGA7XG4gICAgaWYgKG9wdGlvbnMuaGVpZ2h0KSBjbG9uZS5zdHlsZS5oZWlnaHQgPSBgJHtvcHRpb25zLmhlaWdodH1weGA7XG5cbiAgICBpZiAob3B0aW9ucy5zdHlsZSlcbiAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMuc3R5bGUpLmZvckVhY2gocHJvcGVydHkgPT4ge1xuICAgICAgICBjbG9uZS5zdHlsZVtwcm9wZXJ0eV0gPSBvcHRpb25zLnN0eWxlW3Byb3BlcnR5XTtcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIC0gVGhlIERPTSBOb2RlIG9iamVjdCB0byByZW5kZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUmVuZGVyaW5nIG9wdGlvbnNcbiAqIEByZXR1cm4ge1Byb21pc2V9IC0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdpdGggYSBVaW50OEFycmF5IGNvbnRhaW5pbmcgUkdCQSBwaXhlbCBkYXRhLlxuICogKi9cbmZ1bmN0aW9uIHRvUGl4ZWxEYXRhKG5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGRyYXcobm9kZSwgb3B0aW9ucyB8fCB7fSkudGhlbihcbiAgICBjYW52YXMgPT4gY2FudmFzLmdldENvbnRleHQoJzJkJykuZ2V0SW1hZ2VEYXRhKDAsIDAsIGdldFdpZHRoKG5vZGUpLCBnZXRIZWlnaHQobm9kZSkpLmRhdGFcbiAgKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgRE9NIE5vZGUgb2JqZWN0IHRvIHJlbmRlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBSZW5kZXJpbmcgb3B0aW9uc1xuICogQHJldHVybiB7UHJvbWlzZX0gLSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCBhIFBORyBpbWFnZSBkYXRhIFVSTFxuICogKi9cbmZ1bmN0aW9uIHRvUG5nKG5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGRyYXcobm9kZSwgb3B0aW9ucyB8fCB7fSkudGhlbihjYW52YXMgPT4gY2FudmFzLnRvRGF0YVVSTCgpKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgRE9NIE5vZGUgb2JqZWN0IHRvIHJlbmRlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBSZW5kZXJpbmcgb3B0aW9uc1xuICogQHJldHVybiB7UHJvbWlzZX0gLSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCBhIEpQRUcgaW1hZ2UgZGF0YSBVUkxcbiAqICovXG5mdW5jdGlvbiB0b0pwZWcobm9kZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgcmV0dXJuIGRyYXcobm9kZSwgb3B0aW9ucykudGhlbihjYW52YXMgPT4gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvanBlZycsIG9wdGlvbnMucXVhbGl0eSB8fCAxLjApKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgRE9NIE5vZGUgb2JqZWN0IHRvIHJlbmRlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBSZW5kZXJpbmcgb3B0aW9uc1xuICogQHJldHVybiB7UHJvbWlzZX0gLSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCBhIFBORyBpbWFnZSBibG9iXG4gKiAqL1xuZnVuY3Rpb24gdG9CbG9iKG5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGRyYXcobm9kZSwgb3B0aW9ucyB8fCB7fSkudGhlbihjYW52YXNUb0Jsb2IpO1xufVxuXG5mdW5jdGlvbiBjb3B5T3B0aW9ucyhvcHRpb25zKSB7XG4gIC8vIENvcHkgb3B0aW9ucyB0byBpbXBsIG9wdGlvbnMgZm9yIHVzZSBpbiBpbXBsXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5pbWFnZVBsYWNlaG9sZGVyID09PSAndW5kZWZpbmVkJykge1xuICAgIGRvbXRvaW1hZ2UuaW1wbC5vcHRpb25zLmltYWdlUGxhY2Vob2xkZXIgPSBkZWZhdWx0T3B0aW9ucy5pbWFnZVBsYWNlaG9sZGVyO1xuICB9IGVsc2Uge1xuICAgIGRvbXRvaW1hZ2UuaW1wbC5vcHRpb25zLmltYWdlUGxhY2Vob2xkZXIgPSBvcHRpb25zLmltYWdlUGxhY2Vob2xkZXI7XG4gIH1cblxuICBpZiAodHlwZW9mIG9wdGlvbnMuY2FjaGVCdXN0ID09PSAndW5kZWZpbmVkJykge1xuICAgIGRvbXRvaW1hZ2UuaW1wbC5vcHRpb25zLmNhY2hlQnVzdCA9IGRlZmF1bHRPcHRpb25zLmNhY2hlQnVzdDtcbiAgfSBlbHNlIHtcbiAgICBkb210b2ltYWdlLmltcGwub3B0aW9ucy5jYWNoZUJ1c3QgPSBvcHRpb25zLmNhY2hlQnVzdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3KGRvbU5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHRvU3ZnKGRvbU5vZGUsIG9wdGlvbnMpXG4gICAgLnRoZW4obWFrZUltYWdlKVxuICAgIC50aGVuKGRlbGF5KDEwMCkpXG4gICAgLnRoZW4oaW1hZ2UgPT4ge1xuICAgICAgY29uc3QgY2FudmFzID0gbmV3Q2FudmFzKGRvbU5vZGUpO1xuICAgICAgY2FudmFzLmdldENvbnRleHQoJzJkJykuZHJhd0ltYWdlKGltYWdlLCAwLCAwKTtcbiAgICAgIHJldHVybiBjYW52YXM7XG4gICAgfSk7XG5cbiAgZnVuY3Rpb24gbmV3Q2FudmFzKGROb2RlKSB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gb3B0aW9ucy53aWR0aCB8fCBnZXRXaWR0aChkTm9kZSk7XG4gICAgY2FudmFzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IGdldEhlaWdodChkTm9kZSk7XG5cbiAgICBpZiAob3B0aW9ucy5iZ2NvbG9yKSB7XG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBvcHRpb25zLmJnY29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsb25lTm9kZShub2RlLCBmaWx0ZXIsIHJvb3QpIHtcbiAgaWYgKCFyb290ICYmIGZpbHRlciAmJiAhZmlsdGVyKG5vZGUpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShub2RlKVxuICAgIC50aGVuKG1ha2VOb2RlQ29weSlcbiAgICAudGhlbihjbG9uZSA9PiBjbG9uZUNoaWxkcmVuKG5vZGUsIGNsb25lLCBmaWx0ZXIpKVxuICAgIC50aGVuKGNsb25lID0+IHByb2Nlc3NDbG9uZShub2RlLCBjbG9uZSkpO1xuXG4gIGZ1bmN0aW9uIG1ha2VOb2RlQ29weShuZCkge1xuICAgIGlmIChuZCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgcmV0dXJuIG1ha2VJbWFnZShuZC50b0RhdGFVUkwoKSk7XG4gICAgfVxuICAgIHJldHVybiBuZC5jbG9uZU5vZGUoZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmVDaGlsZHJlbkluT3JkZXIocGFyZW50LCBhcnJDaGlsZHJlbiwgZmx0KSB7XG4gICAgbGV0IGRvbmUgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBhcnJDaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgIGRvbmUgPSBkb25lXG4gICAgICAgIC50aGVuKCgpID0+IGNsb25lTm9kZShjaGlsZCwgZmx0KSlcbiAgICAgICAgLnRoZW4oY2hpbGRDbG9uZSA9PiB7XG4gICAgICAgICAgaWYgKGNoaWxkQ2xvbmUpIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZENsb25lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBkb25lO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmVDaGlsZHJlbihvcmlnaW5hbCwgY2xvbmUsIGZsdCkge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gb3JpZ2luYWwuY2hpbGROb2RlcztcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNsb25lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xvbmVDaGlsZHJlbkluT3JkZXIoY2xvbmUsIGFzQXJyYXkoY2hpbGRyZW4pLCBmbHQpLnRoZW4oKCkgPT4gY2xvbmUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVtYmVkRm9udHMobm9kZSkge1xuICByZXR1cm4gZm9udEZhY2VzLnJlc29sdmVBbGwoKS50aGVuKGNzc1RleHQgPT4ge1xuICAgIGNvbnN0IHN0eWxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgbm9kZS5hcHBlbmRDaGlsZChzdHlsZU5vZGUpO1xuICAgIHN0eWxlTm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3NUZXh0KSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbmxpbmVJbWFnZXMobm9kZSkge1xuICByZXR1cm4gaW1hZ2VzLmlubGluZUFsbChub2RlKS50aGVuKCgpID0+IG5vZGUpO1xufVxuXG5mdW5jdGlvbiBtYWtlU3ZnRGF0YVVyaShub2RlLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUobm9kZSkudGhlbihuZCA9PiB7XG4gICAgbmQuc2V0QXR0cmlidXRlKCd4bWxucycsICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyk7XG4gICAgY29uc3Qgc2VyaWFsaXplZFN0cmluZyA9IG5ldyB3aW5kb3cuWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKG5kKTtcblxuICAgIGNvbnN0IHhodG1sID0gZXNjYXBlWGh0bWwoc2VyaWFsaXplZFN0cmluZyk7XG4gICAgY29uc3QgZm9yZWlnbk9iamVjdCA9IGA8Zm9yZWlnbk9iamVjdCB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPiR7eGh0bWx9PC9mb3JlaWduT2JqZWN0PmA7XG4gICAgY29uc3Qgc3ZnU3RyID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiJHt3aWR0aH1cIiBoZWlnaHQ9XCIke2hlaWdodH1cIj4ke2ZvcmVpZ25PYmplY3R9PC9zdmc+YDtcblxuICAgIC8vIE9wdGltaXppbmcgU1ZHcyBpbiBkYXRhIFVSSXNcbiAgICAvLyBzZWUgaHR0cHM6Ly9jb2RlcGVuLmlvL3RpZ3QvcG9zdC9vcHRpbWl6aW5nLXN2Z3MtaW4tZGF0YS11cmlzXG4gICAgLy8gdGhlIGJlc3Qgd2F5IG9mIGVuY29kaW5nIFNWRyBpbiBhIGRhdGE6IFVSSSBpcyBkYXRhOmltYWdlL3N2Zyt4bWwsW2FjdHVhbCBkYXRhXS5cbiAgICAvLyBXZSBkb27igJl0IG5lZWQgdGhlIDtjaGFyc2V0PXV0Zi04IHBhcmFtZXRlciBiZWNhdXNlIHRoZSBnaXZlbiBTVkcgaXMgQVNDSUkuXG4gICAgcmV0dXJuIHN2Z1RvTWluaURhdGFVUkkoc3ZnU3RyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG5ld0lubGluZXIoKSB7XG4gIGNvbnN0IFVSTF9SRUdFWCA9IC91cmxcXChbJ1wiXT8oW14nXCJdKz8pWydcIl0/XFwpL2c7XG5cbiAgcmV0dXJuIHtcbiAgICBpbmxpbmVBbGwsXG4gICAgc2hvdWxkUHJvY2VzcyxcbiAgICBpbXBsOiB7XG4gICAgICByZWFkVXJscyxcbiAgICAgIGlubGluZVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBzaG91bGRQcm9jZXNzKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc2VhcmNoKFVSTF9SRUdFWCkgIT09IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFVybHMoc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgbGV0IG1hdGNoO1xuICAgIHdoaWxlICgobWF0Y2ggPSBVUkxfUkVHRVguZXhlYyhzdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgICAgcmVzdWx0LnB1c2gobWF0Y2hbMV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0LmZpbHRlcih1cmwgPT4ge1xuICAgICAgcmV0dXJuICFpc0RhdGFVcmwodXJsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVybEFzUmVnZXgodXJsMCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGAodXJsXFxcXChbXFwnXCJdPykoJHtlc2NhcGUodXJsMCl9KShbXFwnXCJdP1xcXFwpKWAsICdnJyk7XG4gIH1cblxuICBmdW5jdGlvbiBpbmxpbmUoc3RyaW5nLCB1cmwsIGJhc2VVcmwsIGdldCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodXJsKVxuICAgICAgLnRoZW4odWwgPT4gKGJhc2VVcmwgPyByZXNvbHZlVXJsKHVsLCBiYXNlVXJsKSA6IHVsKSlcbiAgICAgIC50aGVuKHVsID0+ICh0eXBlb2YgZ2V0ID09PSAnZnVuY3Rpb24nID8gZ2V0KHVsKSA6IGdldEFuZEVuY29kZSh1bCwgZG9tdG9pbWFnZS5pbXBsLm9wdGlvbnMpKSlcbiAgICAgIC50aGVuKGRhdGEgPT4gZGF0YUFzVXJsKGRhdGEsIG1pbWVUeXBlKHVybCkpKVxuICAgICAgLnRoZW4oZGF0YVVybCA9PiBzdHJpbmcucmVwbGFjZSh1cmxBc1JlZ2V4KHVybCksIGAkMSR7ZGF0YVVybH0kM2ApKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlubGluZUFsbChzdHJpbmcsIGJhc2VVcmwsIGdldCkge1xuICAgIGlmICghc2hvdWxkUHJvY2VzcyhzdHJpbmcpIHx8IGlzU3JjQXNEYXRhVXJsKHN0cmluZykpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc3RyaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzdHJpbmcpXG4gICAgICAudGhlbihyZWFkVXJscylcbiAgICAgIC50aGVuKHVybHMgPT4ge1xuICAgICAgICBsZXQgZG9uZSA9IFByb21pc2UucmVzb2x2ZShzdHJpbmcpO1xuICAgICAgICB1cmxzLmZvckVhY2godXJsID0+IHtcbiAgICAgICAgICBkb25lID0gZG9uZS50aGVuKHN0ciA9PiBpbmxpbmUoc3RyLCB1cmwsIGJhc2VVcmwsIGdldCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRvbmU7XG4gICAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBuZXdGb250RmFjZXMoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzb2x2ZUFsbCxcbiAgICBpbXBsOiB7cmVhZEFsbH1cbiAgfTtcblxuICBmdW5jdGlvbiByZXNvbHZlQWxsKCkge1xuICAgIHJldHVybiByZWFkQWxsKClcbiAgICAgIC50aGVuKHdlYkZvbnRzID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHdlYkZvbnRzLm1hcCh3ZWJGb250ID0+IHdlYkZvbnQucmVzb2x2ZSgpKSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oY3NzU3RyaW5ncyA9PiBjc3NTdHJpbmdzLmpvaW4oJ1xcbicpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRBbGwoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShhc0FycmF5KGRvY3VtZW50LnN0eWxlU2hlZXRzKSlcbiAgICAgIC50aGVuKGxvYWRFeHRlcm5hbFN0eWxlU2hlZXRzKVxuICAgICAgLnRoZW4oZ2V0Q3NzUnVsZXMpXG4gICAgICAudGhlbihzZWxlY3RXZWJGb250UnVsZXMpXG4gICAgICAudGhlbihydWxlcyA9PiBydWxlcy5tYXAobmV3V2ViRm9udCkpO1xuXG4gICAgZnVuY3Rpb24gc2VsZWN0V2ViRm9udFJ1bGVzKGNzc1J1bGVzKSB7XG4gICAgICByZXR1cm4gY3NzUnVsZXNcbiAgICAgICAgLmZpbHRlcihydWxlID0+IHJ1bGUudHlwZSA9PT0gd2luZG93LkNTU1J1bGUuRk9OVF9GQUNFX1JVTEUpXG4gICAgICAgIC5maWx0ZXIocnVsZSA9PiBpbmxpbmVyLnNob3VsZFByb2Nlc3MocnVsZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdzcmMnKSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRFeHRlcm5hbFN0eWxlU2hlZXRzKHN0eWxlU2hlZXRzKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIHN0eWxlU2hlZXRzLm1hcChzaGVldCA9PiB7XG4gICAgICAgICAgaWYgKHNoZWV0LmhyZWYpIHtcbiAgICAgICAgICAgIC8vIGNsb3VkZm9udCBkb2Vzbid0IGhhdmUgYWxsb3cgb3JpZ2luIGhlYWRlciBwcm9wZXJseSBzZXRcbiAgICAgICAgICAgIC8vIGVycm9yIHJlc3BvbnNlIHdpbGwgcmVtYWluIGluIGNhY2hlXG4gICAgICAgICAgICBjb25zdCBjYWNoZSA9IHNoZWV0LmhyZWYuaW5jbHVkZXMoJ3ViZXItZm9udHMnKSA/ICduby1jYWNoZScgOiAnZGVmYXVsdCc7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93XG4gICAgICAgICAgICAgIC5mZXRjaChzaGVldC5ocmVmLCB7Y3JlZGVudGlhbHM6ICdvbWl0JywgY2FjaGV9KVxuICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXG4gICAgICAgICAgICAgIC50aGVuKHNldEJhc2VIcmVmKHNoZWV0LmhyZWYpKVxuICAgICAgICAgICAgICAudGhlbih0b1N0eWxlU2hlZXQpXG4gICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBhbnkgZXJyb3IgdGhhdCBvY2N1cnJlZCBpbiBhbnkgb2YgdGhlIHByZXZpb3VzXG4gICAgICAgICAgICAgICAgLy8gcHJvbWlzZXMgaW4gdGhlIGNoYWluLiBzdHlsZXNoZWV0IGZhaWxlZCB0byBsb2FkIHNob3VsZCBub3Qgc3RvcFxuICAgICAgICAgICAgICAgIC8vIHRoZSBwcm9jZXNzLCBoZW5jZSByZXN1bHQgaW4gb25seSBhIHdhcm5pbmcsIGluc3RlYWQgb2YgcmVqZWN0XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKElNQUdFX0VYUE9SVF9FUlJPUlMuc3R5bGVTaGVldCwgc2hlZXQuaHJlZik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHNoZWV0KTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIGZ1bmN0aW9uIHNldEJhc2VIcmVmKGJhc2UpIHtcbiAgICAgICAgYmFzZSA9IGJhc2Uuc3BsaXQoJy8nKTtcbiAgICAgICAgYmFzZS5wb3AoKTtcbiAgICAgICAgYmFzZSA9IGJhc2Uuam9pbignLycpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFkZEJhc2VIcmVmVG9VcmwobWF0Y2gsIHAxKSB7XG4gICAgICAgICAgY29uc3QgdXJsID0gL15odHRwL2kudGVzdChwMSkgPyBwMSA6IGNvbmNhdEFuZFJlc29sdmVVcmwoYmFzZSwgcDEpO1xuICAgICAgICAgIHJldHVybiBgdXJsKCcke3VybH0nKWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb3VyY2U6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NzYyMzEvMzc4Njg1NlxuICAgICAgICBmdW5jdGlvbiBjb25jYXRBbmRSZXNvbHZlVXJsKHVybCwgY29uY2F0KSB7XG4gICAgICAgICAgY29uc3QgdXJsMSA9IHVybC5zcGxpdCgnLycpO1xuICAgICAgICAgIGNvbnN0IHVybDIgPSBjb25jYXQuc3BsaXQoJy8nKTtcbiAgICAgICAgICBjb25zdCB1cmwzID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB1cmwxLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHVybDFbaV0gPT09ICcuLicpIHtcbiAgICAgICAgICAgICAgdXJsMy5wb3AoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXJsMVtpXSAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgIHVybDMucHVzaCh1cmwxW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB1cmwyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHVybDJbaV0gPT09ICcuLicpIHtcbiAgICAgICAgICAgICAgdXJsMy5wb3AoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodXJsMltpXSAhPT0gJy4nKSB7XG4gICAgICAgICAgICAgIHVybDMucHVzaCh1cmwyW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHVybDMuam9pbignLycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHQgPT4ge1xuICAgICAgICAgIHJldHVybiBpc1NyY0FzRGF0YVVybCh0ZXh0KVxuICAgICAgICAgICAgPyB0ZXh0XG4gICAgICAgICAgICA6IHRleHQucmVwbGFjZSgvdXJsXFwoWydcIl0/KFteJ1wiXSs/KVsnXCJdP1xcKS9nLCBhZGRCYXNlSHJlZlRvVXJsKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdG9TdHlsZVNoZWV0KHRleHQpIHtcbiAgICAgICAgY29uc3QgZG9jID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCcnKTtcbiAgICAgICAgY29uc3Qgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgICAgICBzdHlsZUVsZW1lbnQudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgICBkb2MuYm9keS5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiBzdHlsZUVsZW1lbnQuc2hlZXQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q3NzUnVsZXMoc3R5bGVTaGVldHMpIHtcbiAgICAgIGNvbnN0IGNzc1J1bGVzID0gW107XG4gICAgICBzdHlsZVNoZWV0cy5mb3JFYWNoKHNoZWV0ID0+IHtcbiAgICAgICAgLy8gdHJ5Li4uY2F0Y2ggYmVjYXVzZSBicm93c2VyIG1heSBub3QgYWJsZSB0byBlbnVtZXJhdGUgcnVsZXMgZm9yIGNyb3NzLWRvbWFpbiBzaGVldHNcbiAgICAgICAgaWYgKCFzaGVldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcnVsZXM7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcnVsZXMgPSBzaGVldC5ydWxlcyB8fCBzaGVldC5jc3NSdWxlcztcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGAnQ2FuJ3QgcmVhZCB0aGUgY3NzIHJ1bGVzIG9mOiAke3NoZWV0LmhyZWZ9YCwgZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJ1bGVzICYmIHR5cGVvZiBydWxlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXNBcnJheShydWxlcyB8fCBbXSkuZm9yRWFjaChjc3NSdWxlcy5wdXNoLmJpbmQoY3NzUnVsZXMpKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3Igd2hpbGUgcmVhZGluZyBDU1MgcnVsZXMgZnJvbSAke3NoZWV0LmhyZWZ9YCwgZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdnZXRDc3NSdWxlcyBjYW4gbm90IGZpbmQgY3NzUnVsZXMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY3NzUnVsZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3V2ViRm9udCh3ZWJGb250UnVsZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzb2x2ZTogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJhc2VVcmwgPSAod2ViRm9udFJ1bGUucGFyZW50U3R5bGVTaGVldCB8fCB7fSkuaHJlZjtcbiAgICAgICAgICByZXR1cm4gaW5saW5lci5pbmxpbmVBbGwod2ViRm9udFJ1bGUuY3NzVGV4dCwgYmFzZVVybCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNyYzogKCkgPT4gd2ViRm9udFJ1bGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnc3JjJylcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG5ld0ltYWdlcygpIHtcbiAgcmV0dXJuIHtcbiAgICBpbmxpbmVBbGwsXG4gICAgaW1wbDoge1xuICAgICAgbmV3SW1hZ2VcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gbmV3SW1hZ2UoZWxlbWVudCkge1xuICAgIGZ1bmN0aW9uIGlubGluZShnZXQpIHtcbiAgICAgIGlmIChpc0RhdGFVcmwoZWxlbWVudC5zcmMpKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZWxlbWVudC5zcmMpXG4gICAgICAgIC50aGVuKHVsID0+XG4gICAgICAgICAgdHlwZW9mIGdldCA9PT0gJ2Z1bmN0aW9uJyA/IGdldCh1bCkgOiBnZXRBbmRFbmNvZGUodWwsIGRvbXRvaW1hZ2UuaW1wbC5vcHRpb25zKVxuICAgICAgICApXG4gICAgICAgIC50aGVuKGRhdGEgPT4gZGF0YUFzVXJsKGRhdGEsIG1pbWVUeXBlKGVsZW1lbnQuc3JjKSkpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgIGRhdGFVcmwgPT5cbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgZWxlbWVudC5vbmxvYWQgPSByZXNvbHZlO1xuICAgICAgICAgICAgICBlbGVtZW50Lm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3JjID0gZGF0YVVybDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlubGluZVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbmxpbmVBbGwobm9kZSkge1xuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShub2RlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5saW5lQmFja2dyb3VuZChub2RlKS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gbmV3SW1hZ2Uobm9kZSkuaW5saW5lKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoYXNBcnJheShub2RlLmNoaWxkTm9kZXMpLm1hcChjaGlsZCA9PiBpbmxpbmVBbGwoY2hpbGQpKSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBpbmxpbmVCYWNrZ3JvdW5kKG5kKSB7XG4gICAgICBjb25zdCBiYWNrZ3JvdW5kID0gbmQuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnYmFja2dyb3VuZCcpO1xuXG4gICAgICBpZiAoIWJhY2tncm91bmQpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbmxpbmVyXG4gICAgICAgIC5pbmxpbmVBbGwoYmFja2dyb3VuZClcbiAgICAgICAgLnRoZW4oaW5saW5lZCA9PiB7XG4gICAgICAgICAgbmQuc3R5bGUuc2V0UHJvcGVydHkoJ2JhY2tncm91bmQnLCBpbmxpbmVkLCBuZC5zdHlsZS5nZXRQcm9wZXJ0eVByaW9yaXR5KCdiYWNrZ3JvdW5kJykpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiBuZCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRvbXRvaW1hZ2U7XG4iXX0=