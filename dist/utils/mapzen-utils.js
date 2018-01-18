'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TilesCollection = exports.TilesCache = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.getQueryURL = getQueryURL;
exports.normalizeZ = normalizeZ;
exports.getTileCoordinates = getTileCoordinates;
exports.getBounds = getBounds;

var _defaultSettings = require('../constants/default-settings');

var _deck = require('deck.gl');

var _d3Array = require('d3-array');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// only use tiles from this zoom level to maximize caching
var MAX_ZOOM = 16;
// only load tiles above this zoom level
/*
 * Query, manage and format OpenStreetMap data
 */

var MIN_ZOOM = 12;

function mercatorY(latitude) {
  return Math.asinh(Math.tan(latitude / 180 * Math.PI));
}

/*
 * Construct an URL to retreive vector tile from Mapzen API
 * https://mapzen.com/documentation/vector-tiles/use-service/
 */
function getQueryURL(x, y, z) {
  return 'https://vector.mapzen.com/osm/buildings/' + (z + '/' + x + '/' + y + '.json?api_key=' + _defaultSettings.MAPZEN_API_KEY);
}

/*
 * get z value from zoom
 */
function normalizeZ(zoom) {
  return Math.min(Math.floor(zoom), MAX_ZOOM);
}

/*
 * Calculate OpenStreetMap tile names from lng, lat and zoom
 * http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#X_and_Y
 */
function getTileCoordinates(longitude, latitude, zoom) {
  var z = normalizeZ(zoom);
  longitude = Math.min(180, Math.max(-180, longitude));
  latitude = Math.min(85.0511, Math.max(-85.0511, latitude));

  var scale = Math.pow(2, z);
  var x = Math.floor((longitude / 360 + 1 / 2) * scale);
  var y = Math.floor((1 - mercatorY(latitude) / Math.PI) / 2 * scale);

  return { x: x, y: y, z: z };
}

function getBounds(mapState) {
  var viewport = new _deck.WebMercatorViewport(mapState);

  // project 4 corners of perspective viewport
  var topLeft = viewport.unproject([0, 0]);
  var bottomRight = viewport.unproject([mapState.width, mapState.height]);
  var topRight = viewport.unproject([mapState.width, 0]);
  var bottomLeft = viewport.unproject([0, mapState.height]);

  // normalize bearing, always return [[lngMin, latMax], [lngMax. latMin]]

  var _extent = (0, _d3Array.extent)([topLeft, bottomRight, topRight, bottomLeft], function (d) {
    return d[0];
  }),
      lngMin = _extent[0],
      lngMax = _extent[1];

  var _extent2 = (0, _d3Array.extent)([topLeft, bottomRight, topRight, bottomLeft], function (d) {
    return d[1];
  }),
      latMin = _extent2[0],
      latMax = _extent2[1];

  return [[lngMin, latMax], [lngMax, latMin]];
}

/*
 * Simple manager that caches and looks up tiles data
 */

var TilesCache = exports.TilesCache = function () {
  function TilesCache() {
    (0, _classCallCheck3.default)(this, TilesCache);

    this.cache = {};
  }

  TilesCache.prototype.set = function set(x, y, z, value) {
    this.cache[x + '-' + y + '-' + z] = value;
    return this;
  };

  TilesCache.prototype.get = function get(x, y, z) {
    return this.cache[x + '-' + y + '-' + z];
  };

  TilesCache.prototype.has = function has(x, y, z) {
    return x + '-' + y + '-' + z in this.cache;
  };

  return TilesCache;
}();

/*
 * Calculates the set of tiles that need to be loaded to fill a given viewport.
 */
/* eslint-disable max-statements */


var TilesCollection = exports.TilesCollection = function () {
  function TilesCollection(mapState) {
    (0, _classCallCheck3.default)(this, TilesCollection);

    if (mapState && mapState.zoom >= MIN_ZOOM) {

      // approx. bounds of the viewport
      var queryZoom = normalizeZ(mapState.zoom);
      var bounds = getBounds(mapState);

      var topLeft = getTileCoordinates.apply(undefined, bounds[0].concat([queryZoom]));
      var bottomRight = getTileCoordinates.apply(undefined, bounds[1].concat([queryZoom]));

      this.left = topLeft.x;
      this.right = bottomRight.x;
      this.zoom = queryZoom;
      this.top = topLeft.y;
      this.bottom = bottomRight.y;
      this.size = (bottomRight.x - topLeft.x + 1) * (bottomRight.y - topLeft.y + 1);
    } else {
      this.size = 0;
    }

    this.tiles = this.getTiles();
  }

  // returns an array of tiles as {x, y} coordinates


  TilesCollection.prototype.getTiles = function getTiles() {

    if (this.tiles) {
      return this.tiles;
    }

    var tiles = null;

    if (this.size > 0) {
      tiles = [];
      for (var x0 = this.left; x0 <= this.right; x0++) {
        for (var y0 = this.top; y0 <= this.bottom; y0++) {
          tiles.push({ x: x0, y: y0, z: this.zoom });
        }
      }
    }

    return tiles;
  };

  // supplying 2 parameters x, y:
  // [returns] true if the given tile is inside this collection
  // supplying 1 parameter tilesCollection:
  // [returns] true if given collection is a subset of this one
  TilesCollection.prototype.contains = function contains(x, y, z) {
    if (y === undefined) {
      var that = x;
      return this.zoom === that.zoom && this.left <= that.left && this.right >= that.right && this.top <= that.top && this.bottom >= that.bottom;
    }

    return z === this.zoom && x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
  };

  return TilesCollection;
}();
/* eslint-enable max-statements */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9tYXB6ZW4tdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0UXVlcnlVUkwiLCJub3JtYWxpemVaIiwiZ2V0VGlsZUNvb3JkaW5hdGVzIiwiZ2V0Qm91bmRzIiwiTUFYX1pPT00iLCJNSU5fWk9PTSIsIm1lcmNhdG9yWSIsImxhdGl0dWRlIiwiTWF0aCIsImFzaW5oIiwidGFuIiwiUEkiLCJ4IiwieSIsInoiLCJ6b29tIiwibWluIiwiZmxvb3IiLCJsb25naXR1ZGUiLCJtYXgiLCJzY2FsZSIsInBvdyIsIm1hcFN0YXRlIiwidmlld3BvcnQiLCJ0b3BMZWZ0IiwidW5wcm9qZWN0IiwiYm90dG9tUmlnaHQiLCJ3aWR0aCIsImhlaWdodCIsInRvcFJpZ2h0IiwiYm90dG9tTGVmdCIsImQiLCJsbmdNaW4iLCJsbmdNYXgiLCJsYXRNaW4iLCJsYXRNYXgiLCJUaWxlc0NhY2hlIiwiY2FjaGUiLCJzZXQiLCJ2YWx1ZSIsImdldCIsImhhcyIsIlRpbGVzQ29sbGVjdGlvbiIsInF1ZXJ5Wm9vbSIsImJvdW5kcyIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInNpemUiLCJ0aWxlcyIsImdldFRpbGVzIiwieDAiLCJ5MCIsInB1c2giLCJjb250YWlucyIsInVuZGVmaW5lZCIsInRoYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1FBcUJnQkEsVyxHQUFBQSxXO1FBUUFDLFUsR0FBQUEsVTtRQVFBQyxrQixHQUFBQSxrQjtRQVlBQyxTLEdBQUFBLFM7O0FBN0NoQjs7QUFDQTs7QUFDQTs7OztBQUVBO0FBQ0EsSUFBTUMsV0FBVyxFQUFqQjtBQUNBO0FBVkE7Ozs7QUFXQSxJQUFNQyxXQUFXLEVBQWpCOztBQUVBLFNBQVNDLFNBQVQsQ0FBbUJDLFFBQW5CLEVBQTZCO0FBQzNCLFNBQU9DLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsR0FBTCxDQUFTSCxXQUFXLEdBQVgsR0FBaUJDLEtBQUtHLEVBQS9CLENBQVgsQ0FBUDtBQUNEOztBQUVE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bEMsS0FBSyxLQUFLbUMsTUFEN0I7QUFFRCxHOzs7O0FBRUgiLCJmaWxlIjoibWFwemVuLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFF1ZXJ5LCBtYW5hZ2UgYW5kIGZvcm1hdCBPcGVuU3RyZWV0TWFwIGRhdGFcbiAqL1xuXG5pbXBvcnQge01BUFpFTl9BUElfS0VZfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge1dlYk1lcmNhdG9yVmlld3BvcnR9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IHtleHRlbnR9IGZyb20gJ2QzLWFycmF5JztcblxuLy8gb25seSB1c2UgdGlsZXMgZnJvbSB0aGlzIHpvb20gbGV2ZWwgdG8gbWF4aW1pemUgY2FjaGluZ1xuY29uc3QgTUFYX1pPT00gPSAxNjtcbi8vIG9ubHkgbG9hZCB0aWxlcyBhYm92ZSB0aGlzIHpvb20gbGV2ZWxcbmNvbnN0IE1JTl9aT09NID0gMTI7XG5cbmZ1bmN0aW9uIG1lcmNhdG9yWShsYXRpdHVkZSkge1xuICByZXR1cm4gTWF0aC5hc2luaChNYXRoLnRhbihsYXRpdHVkZSAvIDE4MCAqIE1hdGguUEkpKTtcbn1cblxuLypcbiAqIENvbnN0cnVjdCBhbiBVUkwgdG8gcmV0cmVpdmUgdmVjdG9yIHRpbGUgZnJvbSBNYXB6ZW4gQVBJXG4gKiBodHRwczovL21hcHplbi5jb20vZG9jdW1lbnRhdGlvbi92ZWN0b3ItdGlsZXMvdXNlLXNlcnZpY2UvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRRdWVyeVVSTCh4LCB5LCB6KSB7XG4gIHJldHVybiAnaHR0cHM6Ly92ZWN0b3IubWFwemVuLmNvbS9vc20vYnVpbGRpbmdzLycgK1xuICAgIGAke3p9LyR7eH0vJHt5fS5qc29uP2FwaV9rZXk9JHtNQVBaRU5fQVBJX0tFWX1gO1xufVxuXG4vKlxuICogZ2V0IHogdmFsdWUgZnJvbSB6b29tXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVaKHpvb20pIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGguZmxvb3Ioem9vbSksIE1BWF9aT09NKTtcbn1cblxuLypcbiAqIENhbGN1bGF0ZSBPcGVuU3RyZWV0TWFwIHRpbGUgbmFtZXMgZnJvbSBsbmcsIGxhdCBhbmQgem9vbVxuICogaHR0cDovL3dpa2kub3BlbnN0cmVldG1hcC5vcmcvd2lraS9TbGlwcHlfbWFwX3RpbGVuYW1lcyNYX2FuZF9ZXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaWxlQ29vcmRpbmF0ZXMobG9uZ2l0dWRlLCBsYXRpdHVkZSwgem9vbSkge1xuICBjb25zdCB6ID0gbm9ybWFsaXplWih6b29tKTtcbiAgbG9uZ2l0dWRlID0gTWF0aC5taW4oMTgwLCBNYXRoLm1heCgtMTgwLCBsb25naXR1ZGUpKTtcbiAgbGF0aXR1ZGUgPSBNYXRoLm1pbig4NS4wNTExLCBNYXRoLm1heCgtODUuMDUxMSwgbGF0aXR1ZGUpKTtcblxuICBjb25zdCBzY2FsZSA9IE1hdGgucG93KDIsIHopO1xuICBjb25zdCB4ID0gTWF0aC5mbG9vcigobG9uZ2l0dWRlIC8gMzYwICsgMSAvIDIpICogc2NhbGUpO1xuICBjb25zdCB5ID0gTWF0aC5mbG9vcigoMSAtIG1lcmNhdG9yWShsYXRpdHVkZSkgLyBNYXRoLlBJKSAvIDIgKiBzY2FsZSk7XG5cbiAgcmV0dXJuIHt4LCB5LCB6fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvdW5kcyhtYXBTdGF0ZSkge1xuICBjb25zdCB2aWV3cG9ydCA9IG5ldyBXZWJNZXJjYXRvclZpZXdwb3J0KG1hcFN0YXRlKTtcblxuICAvLyBwcm9qZWN0IDQgY29ybmVycyBvZiBwZXJzcGVjdGl2ZSB2aWV3cG9ydFxuICBjb25zdCB0b3BMZWZ0ID0gdmlld3BvcnQudW5wcm9qZWN0KFswLCAwXSk7XG4gIGNvbnN0IGJvdHRvbVJpZ2h0ID0gdmlld3BvcnQudW5wcm9qZWN0KFttYXBTdGF0ZS53aWR0aCwgbWFwU3RhdGUuaGVpZ2h0XSk7XG4gIGNvbnN0IHRvcFJpZ2h0ID0gdmlld3BvcnQudW5wcm9qZWN0KFttYXBTdGF0ZS53aWR0aCwgMF0pO1xuICBjb25zdCBib3R0b21MZWZ0ID0gdmlld3BvcnQudW5wcm9qZWN0KFswLCBtYXBTdGF0ZS5oZWlnaHRdKTtcblxuICAvLyBub3JtYWxpemUgYmVhcmluZywgYWx3YXlzIHJldHVybiBbW2xuZ01pbiwgbGF0TWF4XSwgW2xuZ01heC4gbGF0TWluXV1cbiAgY29uc3QgW2xuZ01pbiwgbG5nTWF4XSA9IGV4dGVudChcbiAgICBbdG9wTGVmdCwgYm90dG9tUmlnaHQsIHRvcFJpZ2h0LCBib3R0b21MZWZ0XSwgZCA9PiBkWzBdKTtcblxuICBjb25zdCBbbGF0TWluLCBsYXRNYXhdID0gZXh0ZW50KFxuICAgIFt0b3BMZWZ0LCBib3R0b21SaWdodCwgdG9wUmlnaHQsIGJvdHRvbUxlZnRdLCAgZCA9PiBkWzFdKTtcblxuICByZXR1cm4gW1tsbmdNaW4sIGxhdE1heF0sIFtsbmdNYXgsIGxhdE1pbl1dO1xufVxuXG4vKlxuICogU2ltcGxlIG1hbmFnZXIgdGhhdCBjYWNoZXMgYW5kIGxvb2tzIHVwIHRpbGVzIGRhdGFcbiAqL1xuZXhwb3J0IGNsYXNzIFRpbGVzQ2FjaGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNhY2hlID0ge31cbiAgfVxuXG4gIHNldCh4LCB5LCB6LCB2YWx1ZSkge1xuICAgIHRoaXMuY2FjaGVbYCR7eH0tJHt5fS0ke3p9YF0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBnZXQoeCwgeSwgeikge1xuICAgIHJldHVybiB0aGlzLmNhY2hlW2Ake3h9LSR7eX0tJHt6fWBdO1xuICB9O1xuXG4gIGhhcyh4LCB5LCB6KSB7XG4gICAgcmV0dXJuIChgJHt4fS0ke3l9LSR7en1gIGluIHRoaXMuY2FjaGUpO1xuICB9O1xufVxuXG4vKlxuICogQ2FsY3VsYXRlcyB0aGUgc2V0IG9mIHRpbGVzIHRoYXQgbmVlZCB0byBiZSBsb2FkZWQgdG8gZmlsbCBhIGdpdmVuIHZpZXdwb3J0LlxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cyAqL1xuZXhwb3J0IGNsYXNzIFRpbGVzQ29sbGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1hcFN0YXRlKSB7XG4gICAgaWYgKG1hcFN0YXRlICYmIG1hcFN0YXRlLnpvb20gPj0gTUlOX1pPT00pIHtcblxuICAgICAgLy8gYXBwcm94LiBib3VuZHMgb2YgdGhlIHZpZXdwb3J0XG4gICAgICBjb25zdCBxdWVyeVpvb20gPSBub3JtYWxpemVaKG1hcFN0YXRlLnpvb20pO1xuICAgICAgY29uc3QgYm91bmRzID0gZ2V0Qm91bmRzKG1hcFN0YXRlKTtcblxuICAgICAgY29uc3QgdG9wTGVmdCA9IGdldFRpbGVDb29yZGluYXRlcyguLi5ib3VuZHNbMF0sIHF1ZXJ5Wm9vbSk7XG4gICAgICBjb25zdCBib3R0b21SaWdodCA9IGdldFRpbGVDb29yZGluYXRlcyguLi5ib3VuZHNbMV0sIHF1ZXJ5Wm9vbSk7XG5cbiAgICAgIHRoaXMubGVmdCA9IHRvcExlZnQueDtcbiAgICAgIHRoaXMucmlnaHQgPSBib3R0b21SaWdodC54O1xuICAgICAgdGhpcy56b29tID0gcXVlcnlab29tO1xuICAgICAgdGhpcy50b3AgPSB0b3BMZWZ0Lnk7XG4gICAgICB0aGlzLmJvdHRvbSA9IGJvdHRvbVJpZ2h0Lnk7XG4gICAgICB0aGlzLnNpemUgPSAoYm90dG9tUmlnaHQueCAtIHRvcExlZnQueCArIDEpICpcbiAgICAgICAgKGJvdHRvbVJpZ2h0LnkgLSB0b3BMZWZ0LnkgKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaXplID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLnRpbGVzID0gdGhpcy5nZXRUaWxlcygpO1xuICB9XG5cbiAgLy8gcmV0dXJucyBhbiBhcnJheSBvZiB0aWxlcyBhcyB7eCwgeX0gY29vcmRpbmF0ZXNcbiAgZ2V0VGlsZXMoKSB7XG5cbiAgICBpZiAodGhpcy50aWxlcykge1xuICAgICAgcmV0dXJuIHRoaXMudGlsZXM7XG4gICAgfVxuXG4gICAgbGV0IHRpbGVzID0gbnVsbDtcblxuICAgIGlmICh0aGlzLnNpemUgPiAwKSB7XG4gICAgICB0aWxlcyA9IFtdO1xuICAgICAgZm9yIChsZXQgeDAgPSB0aGlzLmxlZnQ7IHgwIDw9IHRoaXMucmlnaHQ7IHgwKyspIHtcbiAgICAgICAgZm9yIChsZXQgeTAgPSB0aGlzLnRvcDsgeTAgPD0gdGhpcy5ib3R0b207IHkwKyspIHtcbiAgICAgICAgICB0aWxlcy5wdXNoKHt4OiB4MCwgeTogeTAsIHo6IHRoaXMuem9vbX0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpbGVzO1xuICB9O1xuXG4gIC8vIHN1cHBseWluZyAyIHBhcmFtZXRlcnMgeCwgeTpcbiAgLy8gW3JldHVybnNdIHRydWUgaWYgdGhlIGdpdmVuIHRpbGUgaXMgaW5zaWRlIHRoaXMgY29sbGVjdGlvblxuICAvLyBzdXBwbHlpbmcgMSBwYXJhbWV0ZXIgdGlsZXNDb2xsZWN0aW9uOlxuICAvLyBbcmV0dXJuc10gdHJ1ZSBpZiBnaXZlbiBjb2xsZWN0aW9uIGlzIGEgc3Vic2V0IG9mIHRoaXMgb25lXG4gIGNvbnRhaW5zKHgsIHksIHopIHtcbiAgICBpZiAoeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCB0aGF0ID0geDtcbiAgICAgIHJldHVybiAodGhpcy56b29tID09PSB0aGF0Lnpvb20gJiYgdGhpcy5sZWZ0IDw9IHRoYXQubGVmdCAmJiB0aGlzLnJpZ2h0ID49IHRoYXQucmlnaHQgJiZcbiAgICAgICAgdGhpcy50b3AgPD0gdGhhdC50b3AgJiYgdGhpcy5ib3R0b20gPj0gdGhhdC5ib3R0b20pO1xuICAgIH1cblxuICAgIHJldHVybiAoeiA9PT0gdGhpcy56b29tICYmIHggPj0gdGhpcy5sZWZ0ICYmIHggPD0gdGhpcy5yaWdodCAmJlxuICAgICAgeSA+PSB0aGlzLnRvcCAmJiB5IDw9IHRoaXMuYm90dG9tKTtcbiAgfTtcbn1cbi8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMgKi9cbiJdfQ==