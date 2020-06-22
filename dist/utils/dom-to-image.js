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

// Copyright (c) 2020 Uber Technologies, Inc.
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
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
 * */


function toPixelData(node, options) {
  return draw(node, options || {}).then(function (canvas) {
    return canvas.getContext('2d').getImageData(0, 0, (0, _domUtils.getWidth)(node), (0, _domUtils.getHeight)(node)).data;
  });
}
/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
 * @return {Promise} - A promise that is fulfilled with a PNG image data URL
 * */


function toPng(node, options) {
  return draw(node, options || {}).then(function (canvas) {
    return canvas.toDataURL();
  });
}
/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options, @see {@link toSvg}
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
 * @param {Object} options - Rendering options, @see {@link toSvg}
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
      if (element.src) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9kb20tdG8taW1hZ2UuanMiXSwibmFtZXMiOlsiaW5saW5lciIsIm5ld0lubGluZXIiLCJmb250RmFjZXMiLCJuZXdGb250RmFjZXMiLCJpbWFnZXMiLCJuZXdJbWFnZXMiLCJkZWZhdWx0T3B0aW9ucyIsImltYWdlUGxhY2Vob2xkZXIiLCJ1bmRlZmluZWQiLCJjYWNoZUJ1c3QiLCJkb210b2ltYWdlIiwidG9TdmciLCJ0b1BuZyIsInRvSnBlZyIsInRvQmxvYiIsInRvUGl4ZWxEYXRhIiwiaW1wbCIsIm9wdGlvbnMiLCJub2RlIiwiY29weU9wdGlvbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJuZCIsImNsb25lTm9kZSIsImZpbHRlciIsImVtYmVkRm9udHMiLCJpbmxpbmVJbWFnZXMiLCJhcHBseU9wdGlvbnMiLCJjbG9uZSIsIm1ha2VTdmdEYXRhVXJpIiwid2lkdGgiLCJoZWlnaHQiLCJiZ2NvbG9yIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInByb3BlcnR5IiwiZHJhdyIsImNhbnZhcyIsImdldENvbnRleHQiLCJnZXRJbWFnZURhdGEiLCJkYXRhIiwidG9EYXRhVVJMIiwicXVhbGl0eSIsImNhbnZhc1RvQmxvYiIsImRvbU5vZGUiLCJtYWtlSW1hZ2UiLCJpbWFnZSIsIm5ld0NhbnZhcyIsImRyYXdJbWFnZSIsImROb2RlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY3R4IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJyb290IiwibWFrZU5vZGVDb3B5IiwiY2xvbmVDaGlsZHJlbiIsIndpbmRvdyIsIkhUTUxDYW52YXNFbGVtZW50IiwiY2xvbmVDaGlsZHJlbkluT3JkZXIiLCJwYXJlbnQiLCJhcnJDaGlsZHJlbiIsImZsdCIsImRvbmUiLCJjaGlsZCIsImNoaWxkQ2xvbmUiLCJhcHBlbmRDaGlsZCIsIm9yaWdpbmFsIiwiY2hpbGRyZW4iLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwicmVzb2x2ZUFsbCIsImNzc1RleHQiLCJzdHlsZU5vZGUiLCJjcmVhdGVUZXh0Tm9kZSIsImlubGluZUFsbCIsInNldEF0dHJpYnV0ZSIsInNlcmlhbGl6ZWRTdHJpbmciLCJYTUxTZXJpYWxpemVyIiwic2VyaWFsaXplVG9TdHJpbmciLCJ4aHRtbCIsImZvcmVpZ25PYmplY3QiLCJzdmdTdHIiLCJVUkxfUkVHRVgiLCJzaG91bGRQcm9jZXNzIiwicmVhZFVybHMiLCJpbmxpbmUiLCJzdHJpbmciLCJzZWFyY2giLCJyZXN1bHQiLCJtYXRjaCIsImV4ZWMiLCJwdXNoIiwidXJsIiwidXJsQXNSZWdleCIsInVybDAiLCJSZWdFeHAiLCJiYXNlVXJsIiwiZ2V0IiwidWwiLCJkYXRhVXJsIiwicmVwbGFjZSIsInVybHMiLCJzdHIiLCJyZWFkQWxsIiwid2ViRm9udHMiLCJhbGwiLCJtYXAiLCJ3ZWJGb250IiwiY3NzU3RyaW5ncyIsImpvaW4iLCJzdHlsZVNoZWV0cyIsImxvYWRFeHRlcm5hbFN0eWxlU2hlZXRzIiwiZ2V0Q3NzUnVsZXMiLCJzZWxlY3RXZWJGb250UnVsZXMiLCJydWxlcyIsIm5ld1dlYkZvbnQiLCJjc3NSdWxlcyIsInJ1bGUiLCJ0eXBlIiwiQ1NTUnVsZSIsIkZPTlRfRkFDRV9SVUxFIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNoZWV0IiwiaHJlZiIsImNhY2hlIiwiaW5jbHVkZXMiLCJmZXRjaCIsImNyZWRlbnRpYWxzIiwicmVzcG9uc2UiLCJ0ZXh0Iiwic2V0QmFzZUhyZWYiLCJ0b1N0eWxlU2hlZXQiLCJlcnIiLCJjb25zb2xlIiwid2FybiIsIklNQUdFX0VYUE9SVF9FUlJPUlMiLCJzdHlsZVNoZWV0IiwibG9nIiwiYmFzZSIsInNwbGl0IiwicG9wIiwiYWRkQmFzZUhyZWZUb1VybCIsInAxIiwidGVzdCIsImNvbmNhdEFuZFJlc29sdmVVcmwiLCJjb25jYXQiLCJ1cmwxIiwidXJsMiIsInVybDMiLCJpIiwibCIsImRvYyIsImltcGxlbWVudGF0aW9uIiwiY3JlYXRlSFRNTERvY3VtZW50Iiwic3R5bGVFbGVtZW50IiwidGV4dENvbnRlbnQiLCJib2R5IiwiZSIsImJpbmQiLCJ3ZWJGb250UnVsZSIsInBhcmVudFN0eWxlU2hlZXQiLCJzcmMiLCJuZXdJbWFnZSIsImVsZW1lbnQiLCJyZWplY3QiLCJvbmxvYWQiLCJvbmVycm9yIiwiRWxlbWVudCIsImlubGluZUJhY2tncm91bmQiLCJIVE1MSW1hZ2VFbGVtZW50IiwiYmFja2dyb3VuZCIsImlubGluZWQiLCJzZXRQcm9wZXJ0eSIsImdldFByb3BlcnR5UHJpb3JpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQTlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQTRCQSxJQUFNQSxPQUFPLEdBQUdDLFVBQVUsRUFBMUI7QUFDQSxJQUFNQyxTQUFTLEdBQUdDLFlBQVksRUFBOUI7QUFDQSxJQUFNQyxNQUFNLEdBQUdDLFNBQVMsRUFBeEIsQyxDQUNBOztBQUNBLElBQU1DLGNBQWMsR0FBRztBQUNyQjtBQUNBQyxFQUFBQSxnQkFBZ0IsRUFBRUMsU0FGRztBQUdyQjtBQUNBQyxFQUFBQSxTQUFTLEVBQUU7QUFKVSxDQUF2QjtBQU9BLElBQU1DLFVBQVUsR0FBRztBQUNqQkMsRUFBQUEsS0FBSyxFQUFMQSxLQURpQjtBQUVqQkMsRUFBQUEsS0FBSyxFQUFMQSxLQUZpQjtBQUdqQkMsRUFBQUEsTUFBTSxFQUFOQSxNQUhpQjtBQUlqQkMsRUFBQUEsTUFBTSxFQUFOQSxNQUppQjtBQUtqQkMsRUFBQUEsV0FBVyxFQUFYQSxXQUxpQjtBQU1qQkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pkLElBQUFBLFNBQVMsRUFBVEEsU0FESTtBQUVKRSxJQUFBQSxNQUFNLEVBQU5BLE1BRkk7QUFHSkosSUFBQUEs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ZixlQUFPNUosT0FBTyxDQUFDQyxPQUFSLENBQWdCRSxFQUFoQixDQUFQO0FBQ0Q7O0FBRUQsYUFBT3ZCLE9BQU8sQ0FDWGdGLFNBREksQ0FDTWdHLFVBRE4sRUFFSjFKLElBRkksQ0FFQyxVQUFBMkosT0FBTyxFQUFJO0FBQ2YxSixRQUFBQSxFQUFFLENBQUNXLEtBQUgsQ0FBU2dKLFdBQVQsQ0FBcUIsWUFBckIsRUFBbUNELE9BQW5DLEVBQTRDMUosRUFBRSxDQUFDVyxLQUFILENBQVNpSixtQkFBVCxDQUE2QixZQUE3QixDQUE1QztBQUNELE9BSkksRUFLSjdKLElBTEksQ0FLQztBQUFBLGVBQU1DLEVBQU47QUFBQSxPQUxELENBQVA7QUFNRDtBQUNGO0FBQ0Y7O2VBRWNiLFUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vKipcbiAqIFRoaXMgZmlsZSBpcyBjb3BpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdHNheWVuL2RvbS10by1pbWFnZVxuICogTW9kaWZpZWQgYnkgaGVzaGFuMDEzMSB0byBhbGxvdyBsb2FkaW5nIGV4dGVybmFsIHN0eWxlc2hlZXRzIGFuZCBpbmxpbmUgd2ViZm9udHNcbiAqL1xuXG5pbXBvcnQgd2luZG93IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IGRvY3VtZW50IGZyb20gJ2dsb2JhbC9kb2N1bWVudCc7XG5pbXBvcnQgY29uc29sZSBmcm9tICdnbG9iYWwvY29uc29sZSc7XG5pbXBvcnQgc3ZnVG9NaW5pRGF0YVVSSSBmcm9tICdtaW5pLXN2Zy1kYXRhLXVyaSc7XG5pbXBvcnQge0lNQUdFX0VYUE9SVF9FUlJPUlN9IGZyb20gJ2NvbnN0YW50cy91c2VyLWZlZWRiYWNrcyc7XG5pbXBvcnQge1xuICBjYW52YXNUb0Jsb2IsXG4gIGVzY2FwZSxcbiAgZXNjYXBlWGh0bWwsXG4gIGRlbGF5LFxuICBwcm9jZXNzQ2xvbmUsXG4gIGFzQXJyYXksXG4gIG1ha2VJbWFnZSxcbiAgbWltZVR5cGUsXG4gIGRhdGFBc1VybCxcbiAgaXNEYXRhVXJsLFxuICBpc1NyY0FzRGF0YVVybCxcbiAgcmVzb2x2ZVVybCxcbiAgZ2V0V2lkdGgsXG4gIGdldEhlaWdodCxcbiAgZ2V0QW5kRW5jb2RlXG59IGZyb20gJy4vZG9tLXV0aWxzJztcblxuY29uc3QgaW5saW5lciA9IG5ld0lubGluZXIoKTtcbmNvbnN0IGZvbnRGYWNlcyA9IG5ld0ZvbnRGYWNlcygpO1xuY29uc3QgaW1hZ2VzID0gbmV3SW1hZ2VzKCk7XG4vLyBEZWZhdWx0IGltcGwgb3B0aW9uc1xuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIC8vIERlZmF1bHQgaXMgdG8gZmFpbCBvbiBlcnJvciwgbm8gcGxhY2Vob2xkZXJcbiAgaW1hZ2VQbGFjZWhvbGRlcjogdW5kZWZpbmVkLFxuICAvLyBEZWZhdWx0IGNhY2hlIGJ1c3QgaXMgZmFsc2UsIGl0IHdpbGwgdXNlIHRoZSBjYWNoZVxuICBjYWNoZUJ1c3Q6IGZhbHNlXG59O1xuXG5jb25zdCBkb210b2ltYWdlID0ge1xuICB0b1N2ZyxcbiAgdG9QbmcsXG4gIHRvSnBlZyxcbiAgdG9CbG9iLFxuICB0b1BpeGVsRGF0YSxcbiAgaW1wbDoge1xuICAgIGZvbnRGYWNlcyxcbiAgICBpbWFnZXMsXG4gICAgaW5saW5lcixcbiAgICBvcHRpb25zOiB7fVxuICB9XG59O1xuXG4vKipcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlIC0gVGhlIERPTSBOb2RlIG9iamVjdCB0byByZW5kZXJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBSZW5kZXJpbmcgb3B0aW9uc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5maWx0ZXJdIC0gU2hvdWxkIHJldHVybiB0cnVlIGlmIHBhc3NlZCBub2RlIHNob3VsZCBiZSBpbmNsdWRlZCBpbiB0aGUgb3V0cHV0XG4gICAqICAgICAgICAgIChleGNsdWRpbmcgbm9kZSBtZWFucyBleGNsdWRpbmcgaXQncyBjaGlsZHJlbiBhcyB3ZWxsKS4gTm90IGNhbGxlZCBvbiB0aGUgcm9vdCBub2RlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuYmdjb2xvcl0gLSBjb2xvciBmb3IgdGhlIGJhY2tncm91bmQsIGFueSB2YWxpZCBDU1MgY29sb3IgdmFsdWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aF0gLSB3aWR0aCB0byBiZSBhcHBsaWVkIHRvIG5vZGUgYmVmb3JlIHJlbmRlcmluZy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodF0gLSBoZWlnaHQgdG8gYmUgYXBwbGllZCB0byBub2RlIGJlZm9yZSByZW5kZXJpbmcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zdHlsZV0gLSBhbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyB0byBiZSBjb3BpZWQgdG8gbm9kZSdzIHN0eWxlIGJlZm9yZSByZW5kZXJpbmcuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5xdWFsaXR5XSAtIGEgTnVtYmVyIGJldHdlZW4gMCBhbmQgMSBpbmRpY2F0aW5nIGltYWdlIHF1YWxpdHkgKGFwcGxpY2FibGUgdG8gSlBFRyBvbmx5KSxcbiAgICAgICAgICAgICAgZGVmYXVsdHMgdG8gMS4wLlxuICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmltYWdlUGxhY2Vob2xkZXJdIC0gZGF0YVVSTCB0byB1c2UgYXMgYSBwbGFjZWhvbGRlciBmb3IgZmFpbGVkIGltYWdlcywgZGVmYXVsdCBiZWhhdmlvdXIgaXMgdG8gZmFpbCBmYXN0IG9uIGltYWdlcyB3ZSBjYW4ndCBmZXRjaFxuICAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5jYWNoZUJ1c3RdIC0gc2V0IHRvIHRydWUgdG8gY2FjaGUgYnVzdCBieSBhcHBlbmRpbmcgdGhlIHRpbWUgdG8gdGhlIHJlcXVlc3QgdXJsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aXRoIGEgU1ZHIGltYWdlIGRhdGEgVVJMXG4gICAgKiAqL1xuZnVuY3Rpb24gdG9Tdmcobm9kZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgY29weU9wdGlvbnMob3B0aW9ucyk7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUobm9kZSlcbiAgICAudGhlbihuZCA9PiBjbG9uZU5vZGUobmQsIG9wdGlvbnMuZmlsdGVyLCB0cnVlKSlcbiAgICAudGhlbihlbWJlZEZvbnRzKVxuICAgIC50aGVuKGlubGluZUltYWdlcylcbiAgICAudGhlbihhcHBseU9wdGlvbnMpXG4gICAgLnRoZW4oY2xvbmUgPT5cbiAgICAgIG1ha2VTdmdEYXRhVXJpKGNsb25lLCBvcHRpb25zLndpZHRoIHx8IGdldFdpZHRoKG5vZGUpLCBvcHRpb25zLmhlaWdodCB8fCBnZXRIZWlnaHQobm9kZSkpXG4gICAgKTtcblxuICBmdW5jdGlvbiBhcHBseU9wdGlvbnMoY2xvbmUpIHtcbiAgICBpZiAob3B0aW9ucy5iZ2NvbG9yKSBjbG9uZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBvcHRpb25zLmJnY29sb3I7XG5cbiAgICBpZiAob3B0aW9ucy53aWR0aCkgY2xvbmUuc3R5bGUud2lkdGggPSBgJHtvcHRpb25zLndpZHRofXB4YDtcbiAgICBpZiAob3B0aW9ucy5oZWlnaHQpIGNsb25lLnN0eWxlLmhlaWdodCA9IGAke29wdGlvbnMuaGVpZ2h0fXB4YDtcblxuICAgIGlmIChvcHRpb25zLnN0eWxlKVxuICAgICAgT2JqZWN0LmtleXMob3B0aW9ucy5zdHlsZSkuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG4gICAgICAgIGNsb25lLnN0eWxlW3Byb3BlcnR5XSA9IG9wdGlvbnMuc3R5bGVbcHJvcGVydHldO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgRE9NIE5vZGUgb2JqZWN0IHRvIHJlbmRlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBSZW5kZXJpbmcgb3B0aW9ucywgQHNlZSB7QGxpbmsgdG9Tdmd9XG4gKiBAcmV0dXJuIHtQcm9taXNlfSAtIEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aXRoIGEgVWludDhBcnJheSBjb250YWluaW5nIFJHQkEgcGl4ZWwgZGF0YS5cbiAqICovXG5mdW5jdGlvbiB0b1BpeGVsRGF0YShub2RlLCBvcHRpb25zKSB7XG4gIHJldHVybiBkcmF3KG5vZGUsIG9wdGlvbnMgfHwge30pLnRoZW4oXG4gICAgY2FudmFzID0+IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLmdldEltYWdlRGF0YSgwLCAwLCBnZXRXaWR0aChub2RlKSwgZ2V0SGVpZ2h0KG5vZGUpKS5kYXRhXG4gICk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIC0gVGhlIERPTSBOb2RlIG9iamVjdCB0byByZW5kZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUmVuZGVyaW5nIG9wdGlvbnMsIEBzZWUge0BsaW5rIHRvU3ZnfVxuICogQHJldHVybiB7UHJvbWlzZX0gLSBBIHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2l0aCBhIFBORyBpbWFnZSBkYXRhIFVSTFxuICogKi9cbmZ1bmN0aW9uIHRvUG5nKG5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGRyYXcobm9kZSwgb3B0aW9ucyB8fCB7fSkudGhlbihjYW52YXMgPT4gY2FudmFzLnRvRGF0YVVSTCgpKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgRE9NIE5vZGUgb2JqZWN0IHRvIHJlbmRlclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBSZW5kZXJpbmcgb3B0aW9ucywgQHNlZSB7QGxpbmsgdG9Tdmd9XG4gKiBAcmV0dXJuIHtQcm9taXNlfSAtIEEgcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aXRoIGEgSlBFRyBpbWFnZSBkYXRhIFVSTFxuICogKi9cbmZ1bmN0aW9uIHRvSnBlZyhub2RlLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICByZXR1cm4gZHJhdyhub2RlLCBvcHRpb25zKS50aGVuKGNhbnZhcyA9PiBjYW52YXMudG9EYXRhVVJMKCdpbWFnZS9qcGVnJywgb3B0aW9ucy5xdWFsaXR5IHx8IDEuMCkpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAtIFRoZSBET00gTm9kZSBvYmplY3QgdG8gcmVuZGVyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFJlbmRlcmluZyBvcHRpb25zLCBAc2VlIHtAbGluayB0b1N2Z31cbiAqIEByZXR1cm4ge1Byb21pc2V9IC0gQSBwcm9taXNlIHRoYXQgaXMgZnVsZmlsbGVkIHdpdGggYSBQTkcgaW1hZ2UgYmxvYlxuICogKi9cbmZ1bmN0aW9uIHRvQmxvYihub2RlLCBvcHRpb25zKSB7XG4gIHJldHVybiBkcmF3KG5vZGUsIG9wdGlvbnMgfHwge30pLnRoZW4oY2FudmFzVG9CbG9iKTtcbn1cblxuZnVuY3Rpb24gY29weU9wdGlvbnMob3B0aW9ucykge1xuICAvLyBDb3B5IG9wdGlvbnMgdG8gaW1wbCBvcHRpb25zIGZvciB1c2UgaW4gaW1wbFxuICBpZiAodHlwZW9mIG9wdGlvbnMuaW1hZ2VQbGFjZWhvbGRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkb210b2ltYWdlLmltcGwub3B0aW9ucy5pbWFnZVBsYWNlaG9sZGVyID0gZGVmYXVsdE9wdGlvbnMuaW1hZ2VQbGFjZWhvbGRlcjtcbiAgfSBlbHNlIHtcbiAgICBkb210b2ltYWdlLmltcGwub3B0aW9ucy5pbWFnZVBsYWNlaG9sZGVyID0gb3B0aW9ucy5pbWFnZVBsYWNlaG9sZGVyO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmNhY2hlQnVzdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkb210b2ltYWdlLmltcGwub3B0aW9ucy5jYWNoZUJ1c3QgPSBkZWZhdWx0T3B0aW9ucy5jYWNoZUJ1c3Q7XG4gIH0gZWxzZSB7XG4gICAgZG9tdG9pbWFnZS5pbXBsLm9wdGlvbnMuY2FjaGVCdXN0ID0gb3B0aW9ucy5jYWNoZUJ1c3Q7XG4gIH1cbn1cblxuZnVuY3Rpb24gZHJhdyhkb21Ob2RlLCBvcHRpb25zKSB7XG4gIHJldHVybiB0b1N2Zyhkb21Ob2RlLCBvcHRpb25zKVxuICAgIC50aGVuKG1ha2VJbWFnZSlcbiAgICAudGhlbihkZWxheSgxMDApKVxuICAgIC50aGVuKGltYWdlID0+IHtcbiAgICAgIGNvbnN0IGNhbnZhcyA9IG5ld0NhbnZhcyhkb21Ob2RlKTtcbiAgICAgIGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLmRyYXdJbWFnZShpbWFnZSwgMCwgMCk7XG4gICAgICByZXR1cm4gY2FudmFzO1xuICAgIH0pO1xuXG4gIGZ1bmN0aW9uIG5ld0NhbnZhcyhkTm9kZSkge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggfHwgZ2V0V2lkdGgoZE5vZGUpO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCBnZXRIZWlnaHQoZE5vZGUpO1xuXG4gICAgaWYgKG9wdGlvbnMuYmdjb2xvcikge1xuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjdHguZmlsbFN0eWxlID0gb3B0aW9ucy5iZ2NvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxufVxuXG5mdW5jdGlvbiBjbG9uZU5vZGUobm9kZSwgZmlsdGVyLCByb290KSB7XG4gIGlmICghcm9vdCAmJiBmaWx0ZXIgJiYgIWZpbHRlcihub2RlKSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUobm9kZSlcbiAgICAudGhlbihtYWtlTm9kZUNvcHkpXG4gICAgLnRoZW4oY2xvbmUgPT4gY2xvbmVDaGlsZHJlbihub2RlLCBjbG9uZSwgZmlsdGVyKSlcbiAgICAudGhlbihjbG9uZSA9PiBwcm9jZXNzQ2xvbmUobm9kZSwgY2xvbmUpKTtcblxuICBmdW5jdGlvbiBtYWtlTm9kZUNvcHkobmQpIHtcbiAgICBpZiAobmQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgIHJldHVybiBtYWtlSW1hZ2UobmQudG9EYXRhVVJMKCkpO1xuICAgIH1cbiAgICByZXR1cm4gbmQuY2xvbmVOb2RlKGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lQ2hpbGRyZW5Jbk9yZGVyKHBhcmVudCwgYXJyQ2hpbGRyZW4sIGZsdCkge1xuICAgIGxldCBkb25lID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgYXJyQ2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICBkb25lID0gZG9uZVxuICAgICAgICAudGhlbigoKSA9PiBjbG9uZU5vZGUoY2hpbGQsIGZsdCkpXG4gICAgICAgIC50aGVuKGNoaWxkQ2xvbmUgPT4ge1xuICAgICAgICAgIGlmIChjaGlsZENsb25lKSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGRDbG9uZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZG9uZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb25lQ2hpbGRyZW4ob3JpZ2luYWwsIGNsb25lLCBmbHQpIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IG9yaWdpbmFsLmNoaWxkTm9kZXM7XG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjbG9uZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsb25lQ2hpbGRyZW5Jbk9yZGVyKGNsb25lLCBhc0FycmF5KGNoaWxkcmVuKSwgZmx0KS50aGVuKCgpID0+IGNsb25lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbWJlZEZvbnRzKG5vZGUpIHtcbiAgcmV0dXJuIGZvbnRGYWNlcy5yZXNvbHZlQWxsKCkudGhlbihjc3NUZXh0ID0+IHtcbiAgICBjb25zdCBzdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIG5vZGUuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICBzdHlsZU5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzVGV4dCkpO1xuICAgIHJldHVybiBub2RlO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5saW5lSW1hZ2VzKG5vZGUpIHtcbiAgcmV0dXJuIGltYWdlcy5pbmxpbmVBbGwobm9kZSkudGhlbigoKSA9PiBub2RlKTtcbn1cblxuZnVuY3Rpb24gbWFrZVN2Z0RhdGFVcmkobm9kZSwgd2lkdGgsIGhlaWdodCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5vZGUpLnRoZW4obmQgPT4ge1xuICAgIG5kLnNldEF0dHJpYnV0ZSgneG1sbnMnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRTdHJpbmcgPSBuZXcgd2luZG93LlhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyhuZCk7XG5cbiAgICBjb25zdCB4aHRtbCA9IGVzY2FwZVhodG1sKHNlcmlhbGl6ZWRTdHJpbmcpO1xuICAgIGNvbnN0IGZvcmVpZ25PYmplY3QgPSBgPGZvcmVpZ25PYmplY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj4ke3hodG1sfTwvZm9yZWlnbk9iamVjdD5gO1xuICAgIGNvbnN0IHN2Z1N0ciA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIiR7d2lkdGh9XCIgaGVpZ2h0PVwiJHtoZWlnaHR9XCI+JHtmb3JlaWduT2JqZWN0fTwvc3ZnPmA7XG5cbiAgICAvLyBPcHRpbWl6aW5nIFNWR3MgaW4gZGF0YSBVUklzXG4gICAgLy8gc2VlIGh0dHBzOi8vY29kZXBlbi5pby90aWd0L3Bvc3Qvb3B0aW1pemluZy1zdmdzLWluLWRhdGEtdXJpc1xuICAgIC8vIHRoZSBiZXN0IHdheSBvZiBlbmNvZGluZyBTVkcgaW4gYSBkYXRhOiBVUkkgaXMgZGF0YTppbWFnZS9zdmcreG1sLFthY3R1YWwgZGF0YV0uXG4gICAgLy8gV2UgZG9u4oCZdCBuZWVkIHRoZSA7Y2hhcnNldD11dGYtOCBwYXJhbWV0ZXIgYmVjYXVzZSB0aGUgZ2l2ZW4gU1ZHIGlzIEFTQ0lJLlxuICAgIHJldHVybiBzdmdUb01pbmlEYXRhVVJJKHN2Z1N0cik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBuZXdJbmxpbmVyKCkge1xuICBjb25zdCBVUkxfUkVHRVggPSAvdXJsXFwoWydcIl0/KFteJ1wiXSs/KVsnXCJdP1xcKS9nO1xuXG4gIHJldHVybiB7XG4gICAgaW5saW5lQWxsLFxuICAgIHNob3VsZFByb2Nlc3MsXG4gICAgaW1wbDoge1xuICAgICAgcmVhZFVybHMsXG4gICAgICBpbmxpbmVcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gc2hvdWxkUHJvY2VzcyhzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnNlYXJjaChVUkxfUkVHRVgpICE9PSAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRVcmxzKHN0cmluZykge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGxldCBtYXRjaDtcbiAgICB3aGlsZSAoKG1hdGNoID0gVVJMX1JFR0VYLmV4ZWMoc3RyaW5nKSkgIT09IG51bGwpIHtcbiAgICAgIHJlc3VsdC5wdXNoKG1hdGNoWzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC5maWx0ZXIodXJsID0+IHtcbiAgICAgIHJldHVybiAhaXNEYXRhVXJsKHVybCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cmxBc1JlZ2V4KHVybDApIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgKHVybFxcXFwoW1xcJ1wiXT8pKCR7ZXNjYXBlKHVybDApfSkoW1xcJ1wiXT9cXFxcKSlgLCAnZycpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5saW5lKHN0cmluZywgdXJsLCBiYXNlVXJsLCBnZXQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVybClcbiAgICAgIC50aGVuKHVsID0+IChiYXNlVXJsID8gcmVzb2x2ZVVybCh1bCwgYmFzZVVybCkgOiB1bCkpXG4gICAgICAudGhlbih1bCA9PiAodHlwZW9mIGdldCA9PT0gJ2Z1bmN0aW9uJyA/IGdldCh1bCkgOiBnZXRBbmRFbmNvZGUodWwsIGRvbXRvaW1hZ2UuaW1wbC5vcHRpb25zKSkpXG4gICAgICAudGhlbihkYXRhID0+IGRhdGFBc1VybChkYXRhLCBtaW1lVHlwZSh1cmwpKSlcbiAgICAgIC50aGVuKGRhdGFVcmwgPT4gc3RyaW5nLnJlcGxhY2UodXJsQXNSZWdleCh1cmwpLCBgJDEke2RhdGFVcmx9JDNgKSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbmxpbmVBbGwoc3RyaW5nLCBiYXNlVXJsLCBnZXQpIHtcbiAgICBpZiAoIXNob3VsZFByb2Nlc3Moc3RyaW5nKSB8fCBpc1NyY0FzRGF0YVVybChzdHJpbmcpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHN0cmluZyk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc3RyaW5nKVxuICAgICAgLnRoZW4ocmVhZFVybHMpXG4gICAgICAudGhlbih1cmxzID0+IHtcbiAgICAgICAgbGV0IGRvbmUgPSBQcm9taXNlLnJlc29sdmUoc3RyaW5nKTtcbiAgICAgICAgdXJscy5mb3JFYWNoKHVybCA9PiB7XG4gICAgICAgICAgZG9uZSA9IGRvbmUudGhlbihzdHIgPT4gaW5saW5lKHN0ciwgdXJsLCBiYXNlVXJsLCBnZXQpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkb25lO1xuICAgICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbmV3Rm9udEZhY2VzKCkge1xuICByZXR1cm4ge1xuICAgIHJlc29sdmVBbGwsXG4gICAgaW1wbDoge3JlYWRBbGx9XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUFsbCgpIHtcbiAgICByZXR1cm4gcmVhZEFsbCgpXG4gICAgICAudGhlbih3ZWJGb250cyA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCh3ZWJGb250cy5tYXAod2ViRm9udCA9PiB3ZWJGb250LnJlc29sdmUoKSkpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGNzc1N0cmluZ3MgPT4gY3NzU3RyaW5ncy5qb2luKCdcXG4nKSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWFkQWxsKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYXNBcnJheShkb2N1bWVudC5zdHlsZVNoZWV0cykpXG4gICAgICAudGhlbihsb2FkRXh0ZXJuYWxTdHlsZVNoZWV0cylcbiAgICAgIC50aGVuKGdldENzc1J1bGVzKVxuICAgICAgLnRoZW4oc2VsZWN0V2ViRm9udFJ1bGVzKVxuICAgICAgLnRoZW4ocnVsZXMgPT4gcnVsZXMubWFwKG5ld1dlYkZvbnQpKTtcblxuICAgIGZ1bmN0aW9uIHNlbGVjdFdlYkZvbnRSdWxlcyhjc3NSdWxlcykge1xuICAgICAgcmV0dXJuIGNzc1J1bGVzXG4gICAgICAgIC5maWx0ZXIocnVsZSA9PiBydWxlLnR5cGUgPT09IHdpbmRvdy5DU1NSdWxlLkZPTlRfRkFDRV9SVUxFKVxuICAgICAgICAuZmlsdGVyKHJ1bGUgPT4gaW5saW5lci5zaG91bGRQcm9jZXNzKHJ1bGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnc3JjJykpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkRXh0ZXJuYWxTdHlsZVNoZWV0cyhzdHlsZVNoZWV0cykge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBzdHlsZVNoZWV0cy5tYXAoc2hlZXQgPT4ge1xuICAgICAgICAgIGlmIChzaGVldC5ocmVmKSB7XG4gICAgICAgICAgICAvLyBjbG91ZGZvbnQgZG9lc24ndCBoYXZlIGFsbG93IG9yaWdpbiBoZWFkZXIgcHJvcGVybHkgc2V0XG4gICAgICAgICAgICAvLyBlcnJvciByZXNwb25zZSB3aWxsIHJlbWFpbiBpbiBjYWNoZVxuICAgICAgICAgICAgY29uc3QgY2FjaGUgPSBzaGVldC5ocmVmLmluY2x1ZGVzKCd1YmVyLWZvbnRzJykgPyAnbm8tY2FjaGUnIDogJ2RlZmF1bHQnO1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvd1xuICAgICAgICAgICAgICAuZmV0Y2goc2hlZXQuaHJlZiwge2NyZWRlbnRpYWxzOiAnb21pdCcsIGNhY2hlfSlcbiAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKVxuICAgICAgICAgICAgICAudGhlbihzZXRCYXNlSHJlZihzaGVldC5ocmVmKSlcbiAgICAgICAgICAgICAgLnRoZW4odG9TdHlsZVNoZWV0KVxuICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgYW55IGVycm9yIHRoYXQgb2NjdXJyZWQgaW4gYW55IG9mIHRoZSBwcmV2aW91c1xuICAgICAgICAgICAgICAgIC8vIHByb21pc2VzIGluIHRoZSBjaGFpbi4gc3R5bGVzaGVldCBmYWlsZWQgdG8gbG9hZCBzaG91bGQgbm90IHN0b3BcbiAgICAgICAgICAgICAgICAvLyB0aGUgcHJvY2VzcywgaGVuY2UgcmVzdWx0IGluIG9ubHkgYSB3YXJuaW5nLCBpbnN0ZWFkIG9mIHJlamVjdFxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihJTUFHRV9FWFBPUlRfRVJST1JTLnN0eWxlU2hlZXQsIHNoZWV0LmhyZWYpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzaGVldCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuXG4gICAgICBmdW5jdGlvbiBzZXRCYXNlSHJlZihiYXNlKSB7XG4gICAgICAgIGJhc2UgPSBiYXNlLnNwbGl0KCcvJyk7XG4gICAgICAgIGJhc2UucG9wKCk7XG4gICAgICAgIGJhc2UgPSBiYXNlLmpvaW4oJy8nKTtcblxuICAgICAgICBmdW5jdGlvbiBhZGRCYXNlSHJlZlRvVXJsKG1hdGNoLCBwMSkge1xuICAgICAgICAgIGNvbnN0IHVybCA9IC9eaHR0cC9pLnRlc3QocDEpID8gcDEgOiBjb25jYXRBbmRSZXNvbHZlVXJsKGJhc2UsIHAxKTtcbiAgICAgICAgICByZXR1cm4gYHVybCgnJHt1cmx9JylgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU291cmNlOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjc2MjMxLzM3ODY4NTZcbiAgICAgICAgZnVuY3Rpb24gY29uY2F0QW5kUmVzb2x2ZVVybCh1cmwsIGNvbmNhdCkge1xuICAgICAgICAgIGNvbnN0IHVybDEgPSB1cmwuc3BsaXQoJy8nKTtcbiAgICAgICAgICBjb25zdCB1cmwyID0gY29uY2F0LnNwbGl0KCcvJyk7XG4gICAgICAgICAgY29uc3QgdXJsMyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdXJsMS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh1cmwxW2ldID09PSAnLi4nKSB7XG4gICAgICAgICAgICAgIHVybDMucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVybDFbaV0gIT09ICcuJykge1xuICAgICAgICAgICAgICB1cmwzLnB1c2godXJsMVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdXJsMi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh1cmwyW2ldID09PSAnLi4nKSB7XG4gICAgICAgICAgICAgIHVybDMucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVybDJbaV0gIT09ICcuJykge1xuICAgICAgICAgICAgICB1cmwzLnB1c2godXJsMltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1cmwzLmpvaW4oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0ID0+IHtcbiAgICAgICAgICByZXR1cm4gaXNTcmNBc0RhdGFVcmwodGV4dClcbiAgICAgICAgICAgID8gdGV4dFxuICAgICAgICAgICAgOiB0ZXh0LnJlcGxhY2UoL3VybFxcKFsnXCJdPyhbXidcIl0rPylbJ1wiXT9cXCkvZywgYWRkQmFzZUhyZWZUb1VybCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHRvU3R5bGVTaGVldCh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGRvYyA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgnJyk7XG4gICAgICAgIGNvbnN0IHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cbiAgICAgICAgc3R5bGVFbGVtZW50LnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgICAgZG9jLmJvZHkuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gc3R5bGVFbGVtZW50LnNoZWV0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENzc1J1bGVzKHN0eWxlU2hlZXRzKSB7XG4gICAgICBjb25zdCBjc3NSdWxlcyA9IFtdO1xuICAgICAgc3R5bGVTaGVldHMuZm9yRWFjaChzaGVldCA9PiB7XG4gICAgICAgIC8vIHRyeS4uLmNhdGNoIGJlY2F1c2UgYnJvd3NlciBtYXkgbm90IGFibGUgdG8gZW51bWVyYXRlIHJ1bGVzIGZvciBjcm9zcy1kb21haW4gc2hlZXRzXG4gICAgICAgIGlmICghc2hlZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJ1bGVzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJ1bGVzID0gc2hlZXQucnVsZXMgfHwgc2hlZXQuY3NzUnVsZXM7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJ0Nhbid0IHJlYWQgdGhlIGNzcyBydWxlcyBvZjogJHtzaGVldC5ocmVmfWAsIGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChydWxlcyAmJiB0eXBlb2YgcnVsZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGFzQXJyYXkocnVsZXMgfHwgW10pLmZvckVhY2goY3NzUnVsZXMucHVzaC5iaW5kKGNzc1J1bGVzKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHdoaWxlIHJlYWRpbmcgQ1NTIHJ1bGVzIGZyb20gJHtzaGVldC5ocmVmfWAsIGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZ2V0Q3NzUnVsZXMgY2FuIG5vdCBmaW5kIGNzc1J1bGVzJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGNzc1J1bGVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5ld1dlYkZvbnQod2ViRm9udFJ1bGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc29sdmU6ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBiYXNlVXJsID0gKHdlYkZvbnRSdWxlLnBhcmVudFN0eWxlU2hlZXQgfHwge30pLmhyZWY7XG4gICAgICAgICAgcmV0dXJuIGlubGluZXIuaW5saW5lQWxsKHdlYkZvbnRSdWxlLmNzc1RleHQsIGJhc2VVcmwpO1xuICAgICAgICB9LFxuICAgICAgICBzcmM6ICgpID0+IHdlYkZvbnRSdWxlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3NyYycpXG4gICAgICB9O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBuZXdJbWFnZXMoKSB7XG4gIHJldHVybiB7XG4gICAgaW5saW5lQWxsLFxuICAgIGltcGw6IHtcbiAgICAgIG5ld0ltYWdlXG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIG5ld0ltYWdlKGVsZW1lbnQpIHtcbiAgICBmdW5jdGlvbiBpbmxpbmUoZ2V0KSB7XG4gICAgICBpZiAoZWxlbWVudC5zcmMpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShlbGVtZW50LnNyYylcbiAgICAgICAgLnRoZW4odWwgPT5cbiAgICAgICAgICB0eXBlb2YgZ2V0ID09PSAnZnVuY3Rpb24nID8gZ2V0KHVsKSA6IGdldEFuZEVuY29kZSh1bCwgZG9tdG9pbWFnZS5pbXBsLm9wdGlvbnMpXG4gICAgICAgIClcbiAgICAgICAgLnRoZW4oZGF0YSA9PiBkYXRhQXNVcmwoZGF0YSwgbWltZVR5cGUoZWxlbWVudC5zcmMpKSlcbiAgICAgICAgLnRoZW4oXG4gICAgICAgICAgZGF0YVVybCA9PlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICBlbGVtZW50Lm9ubG9hZCA9IHJlc29sdmU7XG4gICAgICAgICAgICAgIGVsZW1lbnQub25lcnJvciA9IHJlamVjdDtcbiAgICAgICAgICAgICAgZWxlbWVudC5zcmMgPSBkYXRhVXJsO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW5saW5lXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlubGluZUFsbChub2RlKSB7XG4gICAgaWYgKCEobm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5vZGUpO1xuICAgIH1cblxuICAgIHJldHVybiBpbmxpbmVCYWNrZ3JvdW5kKG5vZGUpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXdJbWFnZShub2RlKS5pbmxpbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChhc0FycmF5KG5vZGUuY2hpbGROb2RlcykubWFwKGNoaWxkID0+IGlubGluZUFsbChjaGlsZCkpKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGlubGluZUJhY2tncm91bmQobmQpIHtcbiAgICAgIGNvbnN0IGJhY2tncm91bmQgPSBuZC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdiYWNrZ3JvdW5kJyk7XG5cbiAgICAgIGlmICghYmFja2dyb3VuZCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5kKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlubGluZXJcbiAgICAgICAgLmlubGluZUFsbChiYWNrZ3JvdW5kKVxuICAgICAgICAudGhlbihpbmxpbmVkID0+IHtcbiAgICAgICAgICBuZC5zdHlsZS5zZXRQcm9wZXJ0eSgnYmFja2dyb3VuZCcsIGlubGluZWQsIG5kLnN0eWxlLmdldFByb3BlcnR5UHJpb3JpdHkoJ2JhY2tncm91bmQnKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCgpID0+IG5kKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZG9tdG9pbWFnZTtcbiJdfQ==