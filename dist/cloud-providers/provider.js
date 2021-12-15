"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.FILE_CONFLICT_MSG = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _icons = require("../components/common/icons");

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
var NAME = 'cloud-provider';
var DISPLAY_NAME = 'Cloud Provider';
var THUMBNAIL = {
  width: 300,
  height: 200
};
var ICON = _icons.Upload;
var FILE_CONFLICT_MSG = 'file_conflict';
/**
 * The default provider class
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.displayName
 * @param {React.Component} props.icon - React element
 * @param {object} props.thumbnail - thumbnail size object
 * @param {number} props.thumbnail.width - thumbnail width in pixels
 * @param {number} props.thumbnail.height - thumbnail height in pixels
 * @public
 * @example
 *
 * const myProvider = new Provider({
 *  name: 'foo',
 *  displayName: 'Foo Storage'
 *  icon: Icon,
 *  thumbnail: {width: 300, height: 200}
 * })
 */

exports.FILE_CONFLICT_MSG = FILE_CONFLICT_MSG;

var Provider = /*#__PURE__*/function () {
  function Provider(props) {
    (0, _classCallCheck2["default"])(this, Provider);
    this.name = props.name || NAME;
    this.displayName = props.displayName || DISPLAY_NAME;
    this.icon = props.icon || ICON;
    this.thumbnail = props.thumbnail || THUMBNAIL;
  }
  /**
   * Whether this provider support upload map to a private storage. If truthy, user will be displayed with the storage save icon on the top right of the side bar.
   * @returns {boolean}
   * @public
   */


  (0, _createClass2["default"])(Provider, [{
    key: "hasPrivateStorage",
    value: function hasPrivateStorage() {
      return true;
    }
    /**
     * Whether this provider support share map via a public url, if truthy, user will be displayed with a share map via url under the export map option on the top right of the side bar
     * @returns {boolean}
     * @public
     */

  }, {
    key: "hasSharingUrl",
    value: function hasSharingUrl() {
      return true;
    }
    /**
     * This method is called after user share a map, to display the share url.
     * @param {boolean} fullUrl - Whether to return the full url with domain, or just the location
     * @returns {string} shareUrl
     * @public
     */

  }, {
    key: "getShareUrl",
    value: function getShareUrl() {
      var fullUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return '';
    }
    /**
     * This method is called by kepler.gl demo app to pushes a new location to history, becoming the current location.
     * @param {boolean} fullURL - Whether to return the full url with domain, or just the location
     * @returns {string} mapUrl
     * @public
     */

  }, {
    key: "getMapUrl",
    value: function getMapUrl() {
      var fullURL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return '';
    }
    /**
     * This method is called to determine whether user already logged in to this provider
     * @public
     * @returns {boolean} true if a user already logged in
     */

  }, {
    key: "getAccessToken",
    value: function getAccessToken() {
      return true;
    }
    /**
     * This method is called to get the user name of the current user. It will be displayed in the cloud provider tile.
     * @public
     * @returns {string} true if a user already logged in
     */

  }, {
    key: "getUserName",
    value: function getUserName() {
      return '';
    }
    /**
     * This return a standard error that will trigger the overwrite map modal
     */

  }, {
    key: "getFileConflictError",
    value: function getFileConflictError() {
      return new Error(FILE_CONFLICT_MSG);
    }
    /**
     * This method will be called when user click the login button in the cloud provider tile.
     * Upon login success, `onCloudLoginSuccess` has to be called to notify kepler.gl UI
     * @param {function} onCloudLoginSuccess - callbacks to be called after login success
     * @public
     */

  }, {
    key: "login",
    value: function () {
      var _login = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(onCloudLoginSuccess) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                onCloudLoginSuccess();
                return _context.abrupt("return");

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function login(_x) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
    /**
     * This method will be called when user click the logout button under the cloud provider tile.
     * Upon login success, `onCloudLoginSuccess` has to be called to notify kepler.gl UI
     * @param {function} onCloudLogoutSuccess - callbacks to be called after logout success
     * @public
     */

  }, {
    key: "logout",
    value: function () {
      var _logout = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(onCloudLogoutSuccess) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                onCloudLogoutSuccess();
                return _context2.abrupt("return");

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function logout(_x2) {
        return _logout.apply(this, arguments);
      }

      return logout;
    }()
    /**
     * This method will be called to upload map for saving and sharing. Kepler.gl will package map data, config, title, description and thumbnail for upload to storage.
     * With the option to overwrite already saved map, and upload as private or public map.
     *
     * @param {Object} param
     * @param {Object} param.mapData - the map object
     * @param {Object} param.mapData.map - {datasets. config, info: {title, description}}
     * @param {Blob} param.mapData.thumbnail - A thumbnail of current map. thumbnail size can be defined by provider by this.thumbnail
     * @param {object} [param.options]
     * @param {boolean} [param.options.overwrite] - whether user choose to overwrite already saved map under the same name
     * @param {boolean} [param.options.isPublic] - whether user wish to share the map with others. if isPublic is truthy, kepler will call this.getShareUrl() to display an URL they can share with others
     * @public
     */

  }, {
    key: "uploadMap",
    value: function () {
      var _uploadMap = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref) {
        var mapData, _ref$options, options;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                mapData = _ref.mapData, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options;
                return _context3.abrupt("return");

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function uploadMap(_x3) {
        return _uploadMap.apply(this, arguments);
      }

      return uploadMap;
    }()
    /**
     * This method is called to get a list of maps saved by the current logged in user.
     * @returns visualizations an array of Viz objects
     * @public
     * @example
     *  async listMaps() {
     *    return [
     *      {
     *        id: 'a',
     *        title: 'My map',
     *        description: 'My first kepler map',
     *        imageUrl: 'http://',
     *        lastModification: 1582677787000,
     *        privateMap: false,
     *        loadParams: {}
     *      }
     *    ];
     *  }
     */

  }, {
    key: "listMaps",
    value: function () {
      var _listMaps = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", []);

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function listMaps() {
        return _listMaps.apply(this, arguments);
      }

      return listMaps;
    }()
    /**
     * This method will be called when user select a map to load from the storage map viewer
     * @param {*} loadParams - the loadParams property of each visualization object
     * @returns mapResponse - the map object containing dataset config info and format option
     * @public
     * @example
     * async downloadMap(loadParams) {
     *  const mockResponse = {
     *    map: {
     *      datasets: [],
     *      config: {},
     *      info: {
     *        app: 'kepler.gl',
     *        created_at: ''
     *        title: 'test map',
     *        description: 'Hello this is my test dropbox map'
     *      }
     *    },
     *    // pass csv here if your provider currently only support save / load file as csv
     *    format: 'keplergl'
     *  };
     *
     *  return downloadMap;
     * }
     */

  }, {
    key: "downloadMap",
    value: function () {
      var _downloadMap = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(loadParams) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return");

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function downloadMap(_x4) {
        return _downloadMap.apply(this, arguments);
      }

      return downloadMap;
    }()
    /**
     * @typedef {Object} Viz
     * @property {string} id - An unique id
     * @property {string} title - The title of the map
     * @property {string} description - The description of the map
     * @property {string} imageUrl - The imageUrl of the map
     * @property {number} lastModification - An epoch timestamp in milliseconds
     * @property {boolean} privateMap - Optional, whether if this map is private to the user, or can be accessed by others via URL
     * @property {*} loadParams - A property to be passed to `downloadMap`
     * @public
     */

    /**
     * The returned object of `downloadMap`. The response object should contain: datasets: [], config: {}, and info: {}
     * each dataset object should be {info: {id, label}, data: {...}}
     * to inform how kepler should process your data object, pass in `format`
     * @typedef {Object} MapResponse
     * @property {Object} map
     * @property {Array<Object>} map.datasets
     * @property {Object} map.config
     * @property {Object} map.info
     * @property {string} format - one of 'csv': csv file string, 'geojson': geojson object, 'row': row object, 'keplergl': datasets array saved using KeplerGlSchema.save
     * @public
     */

  }]);
  return Provider;
}();

exports["default"] = Provider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbG91ZC1wcm92aWRlcnMvcHJvdmlkZXIuanMiXSwibmFtZXMiOlsiTkFNRSIsIkRJU1BMQVlfTkFNRSIsIlRIVU1CTkFJTCIsIndpZHRoIiwiaGVpZ2h0IiwiSUNPTiIsIlVwbG9hZCIsIkZJTEVfQ09ORkxJQ1RfTVNHIiwiUHJvdmlkZXIiLCJwcm9wcyIsIm5hbWUiLCJkaXNwbGF5TmFtZSIsImljb24iLCJ0aHVtYm5haWwiLCJmdWxsVXJsIiwiZnVsbFVSTCIsIkVycm9yIiwib25DbG91ZExvZ2luU3VjY2VzcyIsIm9uQ2xvdWRMb2dvdXRTdWNjZXNzIiwibWFwRGF0YSIsIm9wdGlvbnMiLCJsb2FkUGFyYW1zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQSxJQUFNQSxJQUFJLEdBQUcsZ0JBQWI7QUFDQSxJQUFNQyxZQUFZLEdBQUcsZ0JBQXJCO0FBQ0EsSUFBTUMsU0FBUyxHQUFHO0FBQUNDLEVBQUFBLEtBQUssRUFBRSxHQUFSO0FBQWFDLEVBQUFBLE1BQU0sRUFBRTtBQUFyQixDQUFsQjtBQUNBLElBQU1DLElBQUksR0FBR0MsYUFBYjtBQUNPLElBQU1DLGlCQUFpQixHQUFHLGVBQTFCO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7SUFDcUJDLFE7QUFDbkIsb0JBQVlDLEtBQVosRUFBbUI7QUFBQTtBQUNqQixTQUFLQyxJQUFMLEdBQVlELEtBQUssQ0FBQ0MsSUFBTixJQUFjVixJQUExQjtBQUNBLFNBQUtXLFdBQUwsR0FBbUJGLEtBQUssQ0FBQ0UsV0FBTixJQUFxQlYsWUFBeEM7QUFDQSxTQUFLVyxJQUFMLEdBQVlILEtBQUssQ0FBQ0csSUFBTixJQUFjUCxJQUExQjtBQUNBLFNBQUtRLFNBQUwsR0FBaUJKLEtBQUssQ0FBQ0ksU0FBTixJQUFtQlgsU0FBcEM7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7Ozs7O1dBQ0UsNkJBQW9CO0FBQ2xCLGFBQU8sSUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7OztXQUNFLHlCQUFnQjtBQUNkLGFBQU8sSUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0UsdUJBQTZCO0FBQUEsVUFBakJZLE9BQWlCLHVFQUFQLEtBQU87QUFDM0IsYUFBTyxFQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSxxQkFBMEI7QUFBQSxVQUFoQkMsT0FBZ0IsdUVBQU4sSUFBTTtBQUN4QixhQUFPLEVBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSwwQkFBaUI7QUFDZixhQUFPLElBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSx1QkFBYztBQUNaLGFBQU8sRUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBOzs7O1dBQ0UsZ0NBQXVCO0FBQ3JCLGFBQU8sSUFBSUMsS0FBSixDQUFVVCxpQkFBVixDQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O2lHQUNFLGlCQUFZVSxtQkFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0VBLGdCQUFBQSxtQkFBbUI7QUFEckI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTzs7Ozs7Ozs7QUFLQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O2tHQUNFLGtCQUFhQyxvQkFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0VBLGdCQUFBQSxvQkFBb0I7QUFEdEI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTzs7Ozs7Ozs7QUFLQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7cUdBQ0U7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFpQkMsZ0JBQUFBLE9BQWpCLFFBQWlCQSxPQUFqQixzQkFBMEJDLE9BQTFCLEVBQTBCQSxPQUExQiw2QkFBb0MsRUFBcEM7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPOzs7Ozs7OztBQUlBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztvR0FDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsa0RBQ1MsRUFEVDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPOzs7Ozs7OztBQUlBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozt1R0FDRSxrQkFBa0JDLFVBQWxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPOzs7Ozs7OztBQUlBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtVcGxvYWR9IGZyb20gJ2NvbXBvbmVudHMvY29tbW9uL2ljb25zJztcblxuY29uc3QgTkFNRSA9ICdjbG91ZC1wcm92aWRlcic7XG5jb25zdCBESVNQTEFZX05BTUUgPSAnQ2xvdWQgUHJvdmlkZXInO1xuY29uc3QgVEhVTUJOQUlMID0ge3dpZHRoOiAzMDAsIGhlaWdodDogMjAwfTtcbmNvbnN0IElDT04gPSBVcGxvYWQ7XG5leHBvcnQgY29uc3QgRklMRV9DT05GTElDVF9NU0cgPSAnZmlsZV9jb25mbGljdCc7XG4vKipcbiAqIFRoZSBkZWZhdWx0IHByb3ZpZGVyIGNsYXNzXG4gKiBAcGFyYW0ge29iamVjdH0gcHJvcHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wcy5uYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvcHMuZGlzcGxheU5hbWVcbiAqIEBwYXJhbSB7UmVhY3QuQ29tcG9uZW50fSBwcm9wcy5pY29uIC0gUmVhY3QgZWxlbWVudFxuICogQHBhcmFtIHtvYmplY3R9IHByb3BzLnRodW1ibmFpbCAtIHRodW1ibmFpbCBzaXplIG9iamVjdFxuICogQHBhcmFtIHtudW1iZXJ9IHByb3BzLnRodW1ibmFpbC53aWR0aCAtIHRodW1ibmFpbCB3aWR0aCBpbiBwaXhlbHNcbiAqIEBwYXJhbSB7bnVtYmVyfSBwcm9wcy50aHVtYm5haWwuaGVpZ2h0IC0gdGh1bWJuYWlsIGhlaWdodCBpbiBwaXhlbHNcbiAqIEBwdWJsaWNcbiAqIEBleGFtcGxlXG4gKlxuICogY29uc3QgbXlQcm92aWRlciA9IG5ldyBQcm92aWRlcih7XG4gKiAgbmFtZTogJ2ZvbycsXG4gKiAgZGlzcGxheU5hbWU6ICdGb28gU3RvcmFnZSdcbiAqICBpY29uOiBJY29uLFxuICogIHRodW1ibmFpbDoge3dpZHRoOiAzMDAsIGhlaWdodDogMjAwfVxuICogfSlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvdmlkZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWUgfHwgTkFNRTtcbiAgICB0aGlzLmRpc3BsYXlOYW1lID0gcHJvcHMuZGlzcGxheU5hbWUgfHwgRElTUExBWV9OQU1FO1xuICAgIHRoaXMuaWNvbiA9IHByb3BzLmljb24gfHwgSUNPTjtcbiAgICB0aGlzLnRodW1ibmFpbCA9IHByb3BzLnRodW1ibmFpbCB8fCBUSFVNQk5BSUw7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHByb3ZpZGVyIHN1cHBvcnQgdXBsb2FkIG1hcCB0byBhIHByaXZhdGUgc3RvcmFnZS4gSWYgdHJ1dGh5LCB1c2VyIHdpbGwgYmUgZGlzcGxheWVkIHdpdGggdGhlIHN0b3JhZ2Ugc2F2ZSBpY29uIG9uIHRoZSB0b3AgcmlnaHQgb2YgdGhlIHNpZGUgYmFyLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgaGFzUHJpdmF0ZVN0b3JhZ2UoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHByb3ZpZGVyIHN1cHBvcnQgc2hhcmUgbWFwIHZpYSBhIHB1YmxpYyB1cmwsIGlmIHRydXRoeSwgdXNlciB3aWxsIGJlIGRpc3BsYXllZCB3aXRoIGEgc2hhcmUgbWFwIHZpYSB1cmwgdW5kZXIgdGhlIGV4cG9ydCBtYXAgb3B0aW9uIG9uIHRoZSB0b3AgcmlnaHQgb2YgdGhlIHNpZGUgYmFyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKiBAcHVibGljXG4gICAqL1xuICBoYXNTaGFyaW5nVXJsKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBhZnRlciB1c2VyIHNoYXJlIGEgbWFwLCB0byBkaXNwbGF5IHRoZSBzaGFyZSB1cmwuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZnVsbFVybCAtIFdoZXRoZXIgdG8gcmV0dXJuIHRoZSBmdWxsIHVybCB3aXRoIGRvbWFpbiwgb3IganVzdCB0aGUgbG9jYXRpb25cbiAgICogQHJldHVybnMge3N0cmluZ30gc2hhcmVVcmxcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgZ2V0U2hhcmVVcmwoZnVsbFVybCA9IGZhbHNlKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSBrZXBsZXIuZ2wgZGVtbyBhcHAgdG8gcHVzaGVzIGEgbmV3IGxvY2F0aW9uIHRvIGhpc3RvcnksIGJlY29taW5nIHRoZSBjdXJyZW50IGxvY2F0aW9uLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZ1bGxVUkwgLSBXaGV0aGVyIHRvIHJldHVybiB0aGUgZnVsbCB1cmwgd2l0aCBkb21haW4sIG9yIGp1c3QgdGhlIGxvY2F0aW9uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IG1hcFVybFxuICAgKiBAcHVibGljXG4gICAqL1xuICBnZXRNYXBVcmwoZnVsbFVSTCA9IHRydWUpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHRvIGRldGVybWluZSB3aGV0aGVyIHVzZXIgYWxyZWFkeSBsb2dnZWQgaW4gdG8gdGhpcyBwcm92aWRlclxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGEgdXNlciBhbHJlYWR5IGxvZ2dlZCBpblxuICAgKi9cbiAgZ2V0QWNjZXNzVG9rZW4oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHRvIGdldCB0aGUgdXNlciBuYW1lIG9mIHRoZSBjdXJyZW50IHVzZXIuIEl0IHdpbGwgYmUgZGlzcGxheWVkIGluIHRoZSBjbG91ZCBwcm92aWRlciB0aWxlLlxuICAgKiBAcHVibGljXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRydWUgaWYgYSB1c2VyIGFscmVhZHkgbG9nZ2VkIGluXG4gICAqL1xuICBnZXRVc2VyTmFtZSgpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyByZXR1cm4gYSBzdGFuZGFyZCBlcnJvciB0aGF0IHdpbGwgdHJpZ2dlciB0aGUgb3ZlcndyaXRlIG1hcCBtb2RhbFxuICAgKi9cbiAgZ2V0RmlsZUNvbmZsaWN0RXJyb3IoKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcihGSUxFX0NPTkZMSUNUX01TRyk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgd2hlbiB1c2VyIGNsaWNrIHRoZSBsb2dpbiBidXR0b24gaW4gdGhlIGNsb3VkIHByb3ZpZGVyIHRpbGUuXG4gICAqIFVwb24gbG9naW4gc3VjY2VzcywgYG9uQ2xvdWRMb2dpblN1Y2Nlc3NgIGhhcyB0byBiZSBjYWxsZWQgdG8gbm90aWZ5IGtlcGxlci5nbCBVSVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkNsb3VkTG9naW5TdWNjZXNzIC0gY2FsbGJhY2tzIHRvIGJlIGNhbGxlZCBhZnRlciBsb2dpbiBzdWNjZXNzXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGFzeW5jIGxvZ2luKG9uQ2xvdWRMb2dpblN1Y2Nlc3MpIHtcbiAgICBvbkNsb3VkTG9naW5TdWNjZXNzKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHdoZW4gdXNlciBjbGljayB0aGUgbG9nb3V0IGJ1dHRvbiB1bmRlciB0aGUgY2xvdWQgcHJvdmlkZXIgdGlsZS5cbiAgICogVXBvbiBsb2dpbiBzdWNjZXNzLCBgb25DbG91ZExvZ2luU3VjY2Vzc2AgaGFzIHRvIGJlIGNhbGxlZCB0byBub3RpZnkga2VwbGVyLmdsIFVJXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uQ2xvdWRMb2dvdXRTdWNjZXNzIC0gY2FsbGJhY2tzIHRvIGJlIGNhbGxlZCBhZnRlciBsb2dvdXQgc3VjY2Vzc1xuICAgKiBAcHVibGljXG4gICAqL1xuICBhc3luYyBsb2dvdXQob25DbG91ZExvZ291dFN1Y2Nlc3MpIHtcbiAgICBvbkNsb3VkTG9nb3V0U3VjY2VzcygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCB0byB1cGxvYWQgbWFwIGZvciBzYXZpbmcgYW5kIHNoYXJpbmcuIEtlcGxlci5nbCB3aWxsIHBhY2thZ2UgbWFwIGRhdGEsIGNvbmZpZywgdGl0bGUsIGRlc2NyaXB0aW9uIGFuZCB0aHVtYm5haWwgZm9yIHVwbG9hZCB0byBzdG9yYWdlLlxuICAgKiBXaXRoIHRoZSBvcHRpb24gdG8gb3ZlcndyaXRlIGFscmVhZHkgc2F2ZWQgbWFwLCBhbmQgdXBsb2FkIGFzIHByaXZhdGUgb3IgcHVibGljIG1hcC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbS5tYXBEYXRhIC0gdGhlIG1hcCBvYmplY3RcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtLm1hcERhdGEubWFwIC0ge2RhdGFzZXRzLiBjb25maWcsIGluZm86IHt0aXRsZSwgZGVzY3JpcHRpb259fVxuICAgKiBAcGFyYW0ge0Jsb2J9IHBhcmFtLm1hcERhdGEudGh1bWJuYWlsIC0gQSB0aHVtYm5haWwgb2YgY3VycmVudCBtYXAuIHRodW1ibmFpbCBzaXplIGNhbiBiZSBkZWZpbmVkIGJ5IHByb3ZpZGVyIGJ5IHRoaXMudGh1bWJuYWlsXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW0ub3B0aW9uc11cbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFyYW0ub3B0aW9ucy5vdmVyd3JpdGVdIC0gd2hldGhlciB1c2VyIGNob29zZSB0byBvdmVyd3JpdGUgYWxyZWFkeSBzYXZlZCBtYXAgdW5kZXIgdGhlIHNhbWUgbmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwYXJhbS5vcHRpb25zLmlzUHVibGljXSAtIHdoZXRoZXIgdXNlciB3aXNoIHRvIHNoYXJlIHRoZSBtYXAgd2l0aCBvdGhlcnMuIGlmIGlzUHVibGljIGlzIHRydXRoeSwga2VwbGVyIHdpbGwgY2FsbCB0aGlzLmdldFNoYXJlVXJsKCkgdG8gZGlzcGxheSBhbiBVUkwgdGhleSBjYW4gc2hhcmUgd2l0aCBvdGhlcnNcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgYXN5bmMgdXBsb2FkTWFwKHttYXBEYXRhLCBvcHRpb25zID0ge319KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBnZXQgYSBsaXN0IG9mIG1hcHMgc2F2ZWQgYnkgdGhlIGN1cnJlbnQgbG9nZ2VkIGluIHVzZXIuXG4gICAqIEByZXR1cm5zIHZpc3VhbGl6YXRpb25zIGFuIGFycmF5IG9mIFZpeiBvYmplY3RzXG4gICAqIEBwdWJsaWNcbiAgICogQGV4YW1wbGVcbiAgICogIGFzeW5jIGxpc3RNYXBzKCkge1xuICAgKiAgICByZXR1cm4gW1xuICAgKiAgICAgIHtcbiAgICogICAgICAgIGlkOiAnYScsXG4gICAqICAgICAgICB0aXRsZTogJ015IG1hcCcsXG4gICAqICAgICAgICBkZXNjcmlwdGlvbjogJ015IGZpcnN0IGtlcGxlciBtYXAnLFxuICAgKiAgICAgICAgaW1hZ2VVcmw6ICdodHRwOi8vJyxcbiAgICogICAgICAgIGxhc3RNb2RpZmljYXRpb246IDE1ODI2Nzc3ODcwMDAsXG4gICAqICAgICAgICBwcml2YXRlTWFwOiBmYWxzZSxcbiAgICogICAgICAgIGxvYWRQYXJhbXM6IHt9XG4gICAqICAgICAgfVxuICAgKiAgICBdO1xuICAgKiAgfVxuICAgKi9cbiAgYXN5bmMgbGlzdE1hcHMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHdoZW4gdXNlciBzZWxlY3QgYSBtYXAgdG8gbG9hZCBmcm9tIHRoZSBzdG9yYWdlIG1hcCB2aWV3ZXJcbiAgICogQHBhcmFtIHsqfSBsb2FkUGFyYW1zIC0gdGhlIGxvYWRQYXJhbXMgcHJvcGVydHkgb2YgZWFjaCB2aXN1YWxpemF0aW9uIG9iamVjdFxuICAgKiBAcmV0dXJucyBtYXBSZXNwb25zZSAtIHRoZSBtYXAgb2JqZWN0IGNvbnRhaW5pbmcgZGF0YXNldCBjb25maWcgaW5mbyBhbmQgZm9ybWF0IG9wdGlvblxuICAgKiBAcHVibGljXG4gICAqIEBleGFtcGxlXG4gICAqIGFzeW5jIGRvd25sb2FkTWFwKGxvYWRQYXJhbXMpIHtcbiAgICogIGNvbnN0IG1vY2tSZXNwb25zZSA9IHtcbiAgICogICAgbWFwOiB7XG4gICAqICAgICAgZGF0YXNldHM6IFtdLFxuICAgKiAgICAgIGNvbmZpZzoge30sXG4gICAqICAgICAgaW5mbzoge1xuICAgKiAgICAgICAgYXBwOiAna2VwbGVyLmdsJyxcbiAgICogICAgICAgIGNyZWF0ZWRfYXQ6ICcnXG4gICAqICAgICAgICB0aXRsZTogJ3Rlc3QgbWFwJyxcbiAgICogICAgICAgIGRlc2NyaXB0aW9uOiAnSGVsbG8gdGhpcyBpcyBteSB0ZXN0IGRyb3Bib3ggbWFwJ1xuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgLy8gcGFzcyBjc3YgaGVyZSBpZiB5b3VyIHByb3ZpZGVyIGN1cnJlbnRseSBvbmx5IHN1cHBvcnQgc2F2ZSAvIGxvYWQgZmlsZSBhcyBjc3ZcbiAgICogICAgZm9ybWF0OiAna2VwbGVyZ2wnXG4gICAqICB9O1xuICAgKlxuICAgKiAgcmV0dXJuIGRvd25sb2FkTWFwO1xuICAgKiB9XG4gICAqL1xuICBhc3luYyBkb3dubG9hZE1hcChsb2FkUGFyYW1zKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IFZpelxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gaWQgLSBBbiB1bmlxdWUgaWRcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IHRpdGxlIC0gVGhlIHRpdGxlIG9mIHRoZSBtYXBcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uIC0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBtYXBcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGltYWdlVXJsIC0gVGhlIGltYWdlVXJsIG9mIHRoZSBtYXBcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxhc3RNb2RpZmljYXRpb24gLSBBbiBlcG9jaCB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gcHJpdmF0ZU1hcCAtIE9wdGlvbmFsLCB3aGV0aGVyIGlmIHRoaXMgbWFwIGlzIHByaXZhdGUgdG8gdGhlIHVzZXIsIG9yIGNhbiBiZSBhY2Nlc3NlZCBieSBvdGhlcnMgdmlhIFVSTFxuICAgKiBAcHJvcGVydHkgeyp9IGxvYWRQYXJhbXMgLSBBIHByb3BlcnR5IHRvIGJlIHBhc3NlZCB0byBgZG93bmxvYWRNYXBgXG4gICAqIEBwdWJsaWNcbiAgICovXG5cbiAgLyoqXG4gICAqIFRoZSByZXR1cm5lZCBvYmplY3Qgb2YgYGRvd25sb2FkTWFwYC4gVGhlIHJlc3BvbnNlIG9iamVjdCBzaG91bGQgY29udGFpbjogZGF0YXNldHM6IFtdLCBjb25maWc6IHt9LCBhbmQgaW5mbzoge31cbiAgICogZWFjaCBkYXRhc2V0IG9iamVjdCBzaG91bGQgYmUge2luZm86IHtpZCwgbGFiZWx9LCBkYXRhOiB7Li4ufX1cbiAgICogdG8gaW5mb3JtIGhvdyBrZXBsZXIgc2hvdWxkIHByb2Nlc3MgeW91ciBkYXRhIG9iamVjdCwgcGFzcyBpbiBgZm9ybWF0YFxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBNYXBSZXNwb25zZVxuICAgKiBAcHJvcGVydHkge09iamVjdH0gbWFwXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXk8T2JqZWN0Pn0gbWFwLmRhdGFzZXRzXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtYXAuY29uZmlnXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtYXAuaW5mb1xuICAgKiBAcHJvcGVydHkge3N0cmluZ30gZm9ybWF0IC0gb25lIG9mICdjc3YnOiBjc3YgZmlsZSBzdHJpbmcsICdnZW9qc29uJzogZ2VvanNvbiBvYmplY3QsICdyb3cnOiByb3cgb2JqZWN0LCAna2VwbGVyZ2wnOiBkYXRhc2V0cyBhcnJheSBzYXZlZCB1c2luZyBLZXBsZXJHbFNjaGVtYS5zYXZlXG4gICAqIEBwdWJsaWNcbiAgICovXG59XG4iXX0=