"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _locales = require("./locales");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _default = {
  property: {
    weight: 'weight',
    label: 'label',
    fillColor: 'fill color',
    color: 'color',
    coverage: 'coverage',
    strokeColor: 'stroke color',
    radius: 'radius',
    outline: 'outline',
    stroke: 'stroke',
    density: 'density',
    height: 'height',
    sum: 'sum',
    pointCount: 'Point Count'
  },
  placeholder: {
    search: 'Search',
    selectField: 'Select a field',
    yAxis: 'Y Axis',
    selectType: 'Select A Type',
    selectValue: 'Select A Value',
    enterValue: 'Enter a value',
    empty: 'empty'
  },
  misc: {
    by: '',
    valuesIn: 'Values in',
    valueEquals: 'Value equals',
    dataSource: 'Data Source',
    brushRadius: 'Brush Radius (km)',
    empty: ' '
  },
  mapLayers: {
    title: 'Map Layers',
    label: 'Label',
    road: 'Road',
    border: 'Border',
    building: 'Building',
    water: 'Water',
    land: 'Land',
    '3dBuilding': '3d Building'
  },
  panel: {
    text: {
      label: 'label',
      labelWithId: 'Label {labelId}',
      fontSize: 'Font size',
      fontColor: 'Font color',
      textAnchor: 'Text anchor',
      alignment: 'Alignment',
      addMoreLabel: 'Add More Label'
    }
  },
  sidebar: {
    panels: {
      layer: 'Layers',
      filter: 'Filters',
      interaction: 'Interactions',
      basemap: 'Base map'
    }
  },
  layer: {
    required: 'Required*',
    radius: 'Radius',
    color: 'Color',
    fillColor: 'Fill Color',
    outline: 'Outline',
    weight: 'Weight',
    propertyBasedOn: '{property} based on',
    coverage: 'Coverage',
    stroke: 'Stroke',
    strokeWidth: 'Stroke Width',
    strokeColor: 'Stroke Color',
    basic: 'Basic',
    trailLength: 'Trail Length',
    trailLengthDescription: 'Number of seconds for a path to completely fade out',
    newLayer: 'new layer',
    elevationByDescription: 'When off, height is based on count of points',
    colorByDescription: 'When off, color is based on count of points',
    aggregateBy: 'Aggregate {field} by',
    '3DModel': '3D Model',
    '3DModelOptions': '3D Model Options',
    type: {
      point: 'point',
      arc: 'arc',
      line: 'line',
      grid: 'grid',
      hexbin: 'hexbin',
      polygon: 'polygon',
      geojson: 'geojson',
      cluster: 'cluster',
      icon: 'icon',
      heatmap: 'heatmap',
      hexagon: 'hexagon',
      hexagonid: 'H3',
      trip: 'trip',
      s2: 'S2',
      '3d': '3D'
    }
  },
  layerVisConfigs: {
    angle: 'Angle',
    strokeWidth: 'Stroke Width (Pixels)',
    strokeWidthRange: 'Stroke Width Range',
    radius: 'Radius',
    fixedRadius: 'Fixed Radius to meter',
    fixedRadiusDescription: 'Map radius to absolute radius in meters, e.g. 5 to 5 meters',
    radiusRange: 'Radius Range',
    clusterRadius: 'Cluster Radius in Pixels',
    radiusRangePixels: 'Radius Range in pixels',
    opacity: 'Opacity',
    coverage: 'Coverage',
    outline: 'Outline',
    colorRange: 'Color range',
    stroke: 'Stroke',
    strokeColor: 'Stroke Color',
    strokeColorRange: 'Stroke Color range',
    targetColor: 'Target Color',
    colorAggregation: 'Color Aggregation',
    heightAggregation: 'Height Aggregation',
    resolutionRange: 'Resolution range',
    sizeScale: 'Size Scale',
    worldUnitSize: 'World Unit Size',
    elevationScale: 'Elevation Scale',
    heightScale: 'Height Scale',
    coverageRange: 'Coverage Range',
    highPrecisionRendering: 'High Precision Rendering',
    highPrecisionRenderingDescription: 'High precision will result in slower performance',
    height: 'Height',
    heightDescription: 'Click button at top right of the map to switch to 3d view',
    fill: 'Fill',
    enablePolygonHeight: 'Enable Polygon Height',
    showWireframe: 'Show Wireframe',
    weightIntensity: 'Weight Intensity',
    zoomScale: 'Zoom Scale',
    heightRange: 'Height Range'
  },
  layerManager: {
    addData: 'Add Data',
    addLayer: 'Add Layer',
    layerBlending: 'Layer Blending'
  },
  mapManager: {
    mapStyle: 'Map style',
    addMapStyle: 'Add Map Style',
    '3dBuildingColor': '3D Building Color'
  },
  layerConfiguration: {
    defaultDescription: 'Calculate {property} based on selected field',
    howTo: 'How to'
  },
  filterManager: {
    addFilter: 'Add Filter'
  },
  datasetTitle: {
    showDataTable: 'Show data table',
    removeDataset: 'Remove dataset'
  },
  datasetInfo: {
    rowCount: '{rowCount} rows'
  },
  tooltip: {
    hideLayer: 'hide layer',
    showLayer: 'show layer',
    hideFeature: 'Hide Feature',
    showFeature: 'Show feature',
    hide: 'hide',
    show: 'show',
    removeLayer: 'Remove layer',
    layerSettings: 'Layer settings',
    closePanel: 'Close current panel',
    switchToDualView: 'Switch to dual map view',
    showLegend: 'show legend',
    disable3DMap: 'Disable 3D Map',
    DrawOnMap: 'Draw on map',
    selectLocale: 'Select locale',
    hideLayerPanel: 'Hide layer panel',
    showLayerPanel: 'Show layer panel',
    moveToTop: 'Move to top of data layers',
    selectBaseMapStyle: 'Select Base Map Style',
    "delete": 'Delete',
    timePlayback: 'Time Playback',
    cloudStorage: 'Cloud Storage',
    '3DMap': '3D Map'
  },
  toolbar: _objectSpread({
    exportImage: 'Export Image',
    exportData: 'Export Data',
    exportMap: 'Export Map',
    shareMapURL: 'Share Map URL',
    saveMap: 'Save Map',
    select: 'select',
    polygon: 'polygon',
    rectangle: 'rectangle',
    hide: 'hide',
    show: 'show'
  }, _locales.LOCALES),
  modal: {
    title: {
      deleteDataset: 'Delete Dataset',
      addDataToMap: 'Add Data To Map',
      exportImage: 'Export Image',
      exportData: 'Export Data',
      exportMap: 'Export Map',
      addCustomMapboxStyle: 'Add Custom Mapbox Style',
      saveMap: 'Save Map',
      shareURL: 'Share URL'
    },
    button: {
      "delete": 'Delete',
      download: 'Download',
      "export": 'Export',
      addStyle: 'Add Style',
      save: 'Save',
      defaultCancel: 'Cancel',
      defaultConfirm: 'Confirm'
    },
    exportImage: {
      ratioTitle: 'Ratio',
      ratioDescription: 'Choose the ratio for various usages.',
      ratioOriginalScreen: 'Original Screen',
      ratioCustom: 'Custom',
      ratio4_3: '4:3',
      ratio16_9: '16:9',
      resolutionTitle: 'Resolution',
      resolutionDescription: 'High resolution is better for prints.',
      mapLegendTitle: 'Map Legend',
      mapLegendAdd: 'Add legend on map'
    },
    exportData: {
      datasetTitle: 'Dataset',
      datasetSubtitle: 'Choose the datasets you want to export',
      allDatasets: 'All',
      dataTypeTitle: 'Data Type',
      dataTypeSubtitle: 'Choose the type of data you want to export',
      filterDataTitle: 'Filter Data',
      filterDataSubtitle: 'You can choose exporting original data or filtered data',
      filteredData: 'Filtered data',
      unfilteredData: 'Unfiltered Data',
      fileCount: '{fileCount} Files',
      rowCount: '{rowCount} Rows'
    },
    deleteData: {
      warning: 'you are going to delete this dataset. It will affect {length} layers'
    },
    addStyle: {
      publishTitle: '1. Publish your style at mapbox or provide access token',
      publishSubtitle1: 'You can create your own map style at',
      publishSubtitle2: 'and',
      publishSubtitle3: 'publish',
      publishSubtitle4: 'it.',
      publishSubtitle5: 'To use private style, paste your',
      publishSubtitle6: 'access token',
      publishSubtitle7: 'here. *kepler.gl is a client-side application, data stays in your browser..',
      exampleToken: 'e.g. pk.abcdefg.xxxxxx',
      pasteTitle: '2. Paste style url',
      pasteSubtitle1: 'What is a',
      pasteSubtitle2: 'style URL',
      namingTitle: '3. Name your style'
    },
    shareMap: {
      shareUriTitle: 'Share Map Url',
      shareUriSubtitle: 'Generate a map url to share with others',
      cloudTitle: 'Cloud storage',
      cloudSubtitle: 'Login and upload map data to your personal cloud storage',
      shareDisclaimer: 'kepler.gl will save your map data to your personal cloud storage, only people with the URL can access your map and data. ' + 'You can edit/delete the data file in your cloud account anytime.',
      gotoPage: 'Go to your Kepler.gl {currentProvider} page'
    },
    statusPanel: {
      mapUploading: 'Map Uploading',
      error: 'Error'
    },
    saveMap: {
      title: 'Cloud storage',
      subtitle: 'Login to save map to your personal cloud storage'
    },
    exportMap: {
      formatTitle: 'Map format',
      formatSubtitle: 'Choose the format to export your map to',
      html: {
        selection: 'Export your map into an interactive html file.',
        tokenTitle: 'Mapbox access token',
        tokenSubtitle: 'Use your own Mapbox access token in the html (optional)',
        tokenPlaceholder: 'Paste your Mapbox access token',
        tokenMisuseWarning: '* If you do not provide your own token, the map may fail to display at any time when we replace ours to avoid misuse. ',
        tokenDisclaimer: 'You can change the Mapbox token later using the following instructions: ',
        tokenUpdate: 'How to update an existing map token.',
        modeTitle: 'Map Mode',
        modeSubtitle1: 'Select the app mode. More ',
        modeSubtitle2: 'info',
        modeDescription: 'Allow users to {mode} the map',
        read: 'read',
        edit: 'edit'
      },
      json: {
        configTitle: 'Map Config',
        configDisclaimer: 'Map config will be included in the Json file. If you are using kepler.gl in your own app. You can copy this config and pass it to ',
        selection: 'Export current map data and config into a single Json file. You can later open the same map by uploading this file to kepler.gl.',
        disclaimer: '* Map config is coupled with loaded datasets. ‘dataId’ is used to bind layers, filters, and tooltips to a specific dataset. ' + 'When passing this config to addDataToMap, make sure the dataset id matches the dataId/s in this config.'
      }
    },
    loadingDialog: {
      loading: 'Loading...'
    },
    loadData: {
      upload: 'Load Files',
      storage: 'Load from Storage'
    },
    tripInfo: {
      title: 'How to enable trip animation',
      description1: 'In order to animate the path, the geoJSON data needs to contain `LineString` in its feature geometry, and the coordinates in the LineString need to have 4 elements in the formats of',
      code: ' [longitude, latitude, altitude, timestamp] ',
      description2: 'with the last element being a timestamp. Valid timestamp formats include unix in seconds such as `1564184363` or in milliseconds such as `1564184363000`.',
      example: 'Example:'
    },
    iconInfo: {
      title: 'How to draw icons',
      description1: 'In your csv, create a column, put the name of the icon you want to draw in it. You can leave the cell empty if you do not want the icon to show for some points. When the column is named',
      code: 'icon',
      description2: ' kepler.gl will automatically create a icon layer for you.',
      example: 'Example:',
      icons: 'Icons'
    },
    storageMapViewer: {
      lastModified: 'Last modified {lastUpdated} ago',
      back: 'Back'
    },
    overwriteMap: {
      title: 'Saving map...',
      alreadyExists: 'already exists in your {mapSaved}. Would you like to overwrite it?'
    },
    loadStorageMap: {
      back: 'Back',
      goToPage: 'Go to your Kepler.gl {displayName} page',
      storageMaps: 'Storage / Maps',
      noSavedMaps: 'No saved maps yet'
    }
  },
  header: {
    visibleLayers: 'Visible layers',
    layerLegend: 'Layer Legend'
  },
  interactions: {
    tooltip: 'Tooltip',
    brush: 'Brush',
    coordinate: 'Coordinates',
    geocoder: 'Geocoder'
  },
  layerBlending: {
    title: 'Layer Blending',
    additive: 'additive',
    normal: 'normal',
    subtractive: 'subtractive'
  },
  columns: {
    title: 'Columns',
    lat: 'lat',
    lng: 'lon',
    altitude: 'altitude',
    icon: 'icon',
    geojson: 'geojson',
    arc: {
      lat0: 'source lat',
      lng0: 'source lng',
      lat1: 'target lat',
      lng1: 'target lng'
    },
    grid: {
      worldUnitSize: 'Grid Size (km)'
    },
    hexagon: {
      worldUnitSize: 'Hexagon Radius (km)'
    },
    hex_id: 'hex id'
  },
  color: {
    customPalette: 'Custom Palette',
    steps: 'steps',
    type: 'type',
    reversed: 'reversed'
  },
  scale: {
    colorScale: 'Color Scale',
    sizeScale: 'Size Scale',
    strokeScale: 'Stroke Scale',
    scale: 'Scale'
  },
  fileUploader: {
    message: 'Drag & Drop Your File(s) Here',
    chromeMessage: '*Chrome user: Limit file size to 250mb, if need to upload larger file, try Safari',
    disclaimer: '*kepler.gl is a client-side application with no server backend. Data lives only on your machine/browser. ' + 'No information or map data is sent to any server.',
    configUploadMessage: 'Upload **CSV**, **GeoJson** or saved map **Json**. Read more about [**supported file formats**]',
    browseFiles: 'browse your files',
    uploading: 'Uploading',
    fileNotSupported: 'File {errorFiles} is not supported.',
    or: 'or'
  },
  geocoder: {
    title: 'Geocoder'
  },
  fieldSelector: {
    clearAll: 'Clear All',
    formatting: 'Formatting'
  },
  density: 'density',
  'Bug Report': 'Bug Report',
  'User Guide': 'User Guide',
  Save: 'Save',
  Share: 'Share'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vZW4uanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwiY292ZXJhZ2UiLCJzdHJva2VDb2xvciIsInJhZGl1cyIsIm91dGxpbmUiLCJzdHJva2UiLCJkZW5zaXR5IiwiaGVpZ2h0Iiwic3VtIiwicG9pbnRDb3VudCIsInBsYWNlaG9sZGVyIiwic2VhcmNoIiwic2VsZWN0RmllbGQiLCJ5QXhpcyIsInNlbGVjdFR5cGUiLCJzZWxlY3RWYWx1ZSIsImVudGVyVmFsdWUiLCJlbXB0eSIsIm1pc2MiLCJieSIsInZhbHVlc0luIiwidmFsdWVFcXVhbHMiLCJkYXRhU291cmNlIiwiYnJ1c2hSYWRpdXMiLCJtYXBMYXllcnMiLCJ0aXRsZSIsInJvYWQiLCJib3JkZXIiLCJidWlsZGluZyIsIndhdGVyIiwibGFuZCIsInBhbmVsIiwidGV4dCIsImxhYmVsV2l0aElkIiwiZm9udFNpemUiLCJmb250Q29sb3IiLCJ0ZXh0QW5jaG9yIiwiYWxpZ25tZW50IiwiYWRkTW9yZUxhYmVsIiwic2lkZWJhciIsInBhbmVscyIsImxheWVyIiwiZmlsdGVyIiwiaW50ZXJhY3Rpb24iLCJiYXNlbWFwIiwicmVxdWlyZWQiLCJwcm9wZXJ0eUJhc2VkT24iLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsImFuZ2xlIiwic3Ryb2tlV2lkdGhSYW5nZSIsImZpeGVkUmFkaXVzIiwiZml4ZWRSYWRpdXNEZXNjcmlwdGlvbiIsInJhZGl1c1JhbmdlIiwiY2x1c3RlclJhZGl1cyIsInJhZGl1c1JhbmdlUGl4ZWxzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJzdHJva2VDb2xvclJhbmdlIiwidGFyZ2V0Q29sb3IiLCJjb2xvckFnZ3JlZ2F0aW9uIiwiaGVpZ2h0QWdncmVnYXRpb24iLCJyZXNvbHV0aW9uUmFuZ2UiLCJzaXplU2NhbGUiLCJ3b3JsZFVuaXRTaXplIiwiZWxldmF0aW9uU2NhbGUiLCJoZWlnaHRTY2FsZSIsImNvdmVyYWdlUmFuZ2UiLCJoaWdoUHJlY2lzaW9uUmVuZGVyaW5nIiwiaGlnaFByZWNpc2lvblJlbmRlcmluZ0Rlc2NyaXB0aW9uIiwiaGVpZ2h0RGVzY3JpcHRpb24iLCJmaWxsIiwiZW5hYmxlUG9seWdvbkhlaWdodCIsInNob3dXaXJlZnJhbWUiLCJ3ZWlnaHRJbnRlbnNpdHkiLCJ6b29tU2NhbGUiLCJoZWlnaHRSYW5nZSIsImxheWVyTWFuYWdlciIsImFkZERhdGEiLCJhZGRMYXllciIsImxheWVyQmxlbmRpbmciLCJtYXBNYW5hZ2VyIiwibWFwU3R5bGUiLCJhZGRNYXBTdHlsZSIsImxheWVyQ29uZmlndXJhdGlvbiIsImRlZmF1bHREZXNjcmlwdGlvbiIsImhvd1RvIiwiZmlsdGVyTWFuYWdlciIsImFkZEZpbHRlciIsImRhdGFzZXRUaXRsZSIsInNob3dEYXRhVGFibGUiLCJyZW1vdmVEYXRhc2V0IiwiZGF0YXNldEluZm8iLCJyb3dDb3VudCIsInRvb2x0aXAiLCJoaWRlTGF5ZXIiLCJzaG93TGF5ZXIiLCJoaWRlRmVhdHVyZSIsInNob3dGZWF0dXJlIiwiaGlkZSIsInNob3ciLCJyZW1vdmVMYXllciIsImxheWVyU2V0dGluZ3MiLCJjbG9zZVBhbmVsIiwic3dpdGNoVG9EdWFsVmlldyIsInNob3dMZWdlbmQiLCJkaXNhYmxlM0RNYXAiLCJEcmF3T25NYXAiLCJzZWxlY3RMb2NhbGUiLCJoaWRlTGF5ZXJQYW5lbCIsInNob3dMYXllclBhbmVsIiwibW92ZVRvVG9wIiwic2VsZWN0QmFzZU1hcFN0eWxlIiwidGltZVBsYXliYWNrIiwiY2xvdWRTdG9yYWdlIiwidG9vbGJhciIsImV4cG9ydEltYWdlIiwiZXhwb3J0RGF0YSIsImV4cG9ydE1hcCIsInNoYXJlTWFwVVJMIiwic2F2ZU1hcCIsInNlbGVjdCIsInJlY3RhbmdsZSIsIkxPQ0FMRVMiLCJtb2RhbCIsImRlbGV0ZURhdGFzZXQiLCJhZGREYXRhVG9NYXAiLCJhZGRDdXN0b21NYXBib3hTdHlsZSIsInNoYXJlVVJMIiwiYnV0dG9uIiwiZG93bmxvYWQiLCJhZGRTdHlsZSIsInNhdmUiLCJkZWZhdWx0Q2FuY2VsIiwiZGVmYXVsdENvbmZpcm0iLCJyYXRpb1RpdGxlIiwicmF0aW9EZXNjcmlwdGlvbiIsInJhdGlvT3JpZ2luYWxTY3JlZW4iLCJyYXRpb0N1c3RvbSIsInJhdGlvNF8zIiwicmF0aW8xNl85IiwicmVzb2x1dGlvblRpdGxlIiwicmVzb2x1dGlvbkRlc2NyaXB0aW9uIiwibWFwTGVnZW5kVGl0bGUiLCJtYXBMZWdlbmRBZGQiLCJkYXRhc2V0U3VidGl0bGUiLCJhbGxEYXRhc2V0cyIsImRhdGFUeXBlVGl0bGUiLCJkYXRhVHlwZVN1YnRpdGxlIiwiZmlsdGVyRGF0YVRpdGxlIiwiZmlsdGVyRGF0YVN1YnRpdGxlIiwiZmlsdGVyZWREYXRhIiwidW5maWx0ZXJlZERhdGEiLCJmaWxlQ291bnQiLCJkZWxldGVEYXRhIiwid2FybmluZyIsInB1Ymxpc2hUaXRsZSIsInB1Ymxpc2hTdWJ0aXRsZTEiLCJwdWJsaXNoU3VidGl0bGUyIiwicHVibGlzaFN1YnRpdGxlMyIsInB1Ymxpc2hTdWJ0aXRsZTQiLCJwdWJsaXNoU3VidGl0bGU1IiwicHVibGlzaFN1YnRpdGxlNiIsInB1Ymxpc2hTdWJ0aXRsZTciLCJleGFtcGxlVG9rZW4iLCJwYXN0ZVRpdGxlIiwicGFzdGVTdWJ0aXRsZTEiLCJwYXN0ZVN1YnRpdGxlMiIsIm5hbWluZ1RpdGxlIiwic2hhcmVNYXAiLCJzaGFyZVVyaVRpdGxlIiwic2hhcmVVcmlTdWJ0aXRsZSIsImNsb3VkVGl0bGUiLCJjbG91ZFN1YnRpdGxlIiwic2hhcmVEaXNjbGFpbWVyIiwiZ290b1BhZ2UiLCJzdGF0dXNQYW5lbCIsIm1hcFVwbG9hZGluZyIsImVycm9yIiwic3VidGl0bGUiLCJmb3JtYXRUaXRsZSIsImZvcm1hdFN1YnRpdGxlIiwiaHRtbCIsInNlbGVjdGlvbiIsInRva2VuVGl0bGUiLCJ0b2tlblN1YnRpdGxlIiwidG9rZW5QbGFjZWhvbGRlciIsInRva2VuTWlzdXNlV2FybmluZyIsInRva2VuRGlzY2xhaW1lciIsInRva2VuVXBkYXRlIiwibW9kZVRpdGxlIiwibW9kZVN1YnRpdGxlMSIsIm1vZGVTdWJ0aXRsZTIiLCJtb2RlRGVzY3JpcHRpb24iLCJyZWFkIiwiZWRpdCIsImpzb24iLCJjb25maWdUaXRsZSIsImNvbmZpZ0Rpc2NsYWltZXIiLCJkaXNjbGFpbWVyIiwibG9hZGluZ0RpYWxvZyIsImxvYWRpbmciLCJsb2FkRGF0YSIsInVwbG9hZCIsInN0b3JhZ2UiLCJ0cmlwSW5mbyIsImRlc2NyaXB0aW9uMSIsImNvZGUiLCJkZXNjcmlwdGlvbjIiLCJleGFtcGxlIiwiaWNvbkluZm8iLCJpY29ucyIsInN0b3JhZ2VNYXBWaWV3ZXIiLCJsYXN0TW9kaWZpZWQiLCJiYWNrIiwib3ZlcndyaXRlTWFwIiwiYWxyZWFkeUV4aXN0cyIsImxvYWRTdG9yYWdlTWFwIiwiZ29Ub1BhZ2UiLCJzdG9yYWdlTWFwcyIsIm5vU2F2ZWRNYXBzIiwiaGVhZGVyIiwidmlzaWJsZUxheWVycyIsImxheWVyTGVnZW5kIiwiaW50ZXJhY3Rpb25zIiwiYnJ1c2giLCJjb29yZGluYXRlIiwiZ2VvY29kZXIiLCJhZGRpdGl2ZSIsIm5vcm1hbCIsInN1YnRyYWN0aXZlIiwiY29sdW1ucyIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwibGF0MCIsImxuZzAiLCJsYXQxIiwibG5nMSIsImhleF9pZCIsImN1c3RvbVBhbGV0dGUiLCJzdGVwcyIsInJldmVyc2VkIiwic2NhbGUiLCJjb2xvclNjYWxlIiwic3Ryb2tlU2NhbGUiLCJmaWxlVXBsb2FkZXIiLCJtZXNzYWdlIiwiY2hyb21lTWVzc2FnZSIsImNvbmZpZ1VwbG9hZE1lc3NhZ2UiLCJicm93c2VGaWxlcyIsInVwbG9hZGluZyIsImZpbGVOb3RTdXBwb3J0ZWQiLCJvciIsImZpZWxkU2VsZWN0b3IiLCJjbGVhckFsbCIsImZvcm1hdHRpbmciLCJTYXZlIiwiU2hhcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7ZUFFZTtBQUNiQSxFQUFBQSxRQUFRLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFLFFBREE7QUFFUkMsSUFBQUEsS0FBSyxFQUFFLE9BRkM7QUFHUkMsSUFBQUEsU0FBUyxFQUFFLFlBSEg7QUFJUkMsSUFBQUEsS0FBSyxFQUFFLE9BSkM7QUFLUkMsSUFBQUEsUUFBUSxFQUFFLFVBTEY7QUFNUkMsSUFBQUEsV0FBVyxFQUFFLGNBTkw7QUFPUkMsSUFBQUEsTUFBTSxFQUFFLFFBUEE7QUFRUkMsSUFBQUEsT0FBTyxFQUFFLFNBUkQ7QUFTUkMsSUFBQUEsTUFBTSxFQUFFLFFBVEE7QUFVUkMsSUFBQUEsT0FBTyxFQUFFLFNBVkQ7QUFXUkMsSUFBQUEsTUFBTSxFQUFFLFFBWEE7QUFZUkMsSUFBQUEsR0FBRyxFQUFFLEtBWkc7QUFhUkMsSUFBQUEsVUFBVSxFQUFFO0FBYkosR0FERztBQWdCYkMsRUFBQUEsV0FBVyxFQUFFO0FBQ1hDLElBQUFBLE1BQU0sRUFBRSxRQURHO0FBRVhDLElBQUFBLFdBQVcsRUFBRSxnQkFGRjtBQUdYQyxJQUFBQSxLQUFLLEVBQUUsUUFISTtBQUlYQyxJQUFBQSxVQUFVLEVBQUUsZUFKRDtBQUtYQyxJQUFBQSxXQUFXLEVBQUUsZ0JBTEY7QUFNWEMsSUFBQUEsVUFBVSxFQUFFLGVBTkQ7QUFPWEMsSUFBQUEsS0FBSyxFQUFFO0FBUEksR0FoQkE7QUF5QmJDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxFQUFFLEVBQUUsRUFE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QztBQVdaQyxJQUFBQSxnQkFBZ0IsRUFBRSxxQ0FYTjtBQVlaQyxJQUFBQSxFQUFFLEVBQUU7QUFaUSxHQWhaRDtBQThaYjFCLEVBQUFBLFFBQVEsRUFBRTtBQUNSaE8sSUFBQUEsS0FBSyxFQUFFO0FBREMsR0E5Wkc7QUFpYWIyUCxFQUFBQSxhQUFhLEVBQUU7QUFDYkMsSUFBQUEsUUFBUSxFQUFFLFdBREc7QUFFYkMsSUFBQUEsVUFBVSxFQUFFO0FBRkMsR0FqYUY7QUFxYWJoUixFQUFBQSxPQUFPLEVBQUUsU0FyYUk7QUFzYWIsZ0JBQWMsWUF0YUQ7QUF1YWIsZ0JBQWMsWUF2YUQ7QUF3YWJpUixFQUFBQSxJQUFJLEVBQUUsTUF4YU87QUF5YWJDLEVBQUFBLEtBQUssRUFBRTtBQXphTSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtMT0NBTEVTfSBmcm9tICcuL2xvY2FsZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BlcnR5OiB7XG4gICAgd2VpZ2h0OiAnd2VpZ2h0JyxcbiAgICBsYWJlbDogJ2xhYmVsJyxcbiAgICBmaWxsQ29sb3I6ICdmaWxsIGNvbG9yJyxcbiAgICBjb2xvcjogJ2NvbG9yJyxcbiAgICBjb3ZlcmFnZTogJ2NvdmVyYWdlJyxcbiAgICBzdHJva2VDb2xvcjogJ3N0cm9rZSBjb2xvcicsXG4gICAgcmFkaXVzOiAncmFkaXVzJyxcbiAgICBvdXRsaW5lOiAnb3V0bGluZScsXG4gICAgc3Ryb2tlOiAnc3Ryb2tlJyxcbiAgICBkZW5zaXR5OiAnZGVuc2l0eScsXG4gICAgaGVpZ2h0OiAnaGVpZ2h0JyxcbiAgICBzdW06ICdzdW0nLFxuICAgIHBvaW50Q291bnQ6ICdQb2ludCBDb3VudCdcbiAgfSxcbiAgcGxhY2Vob2xkZXI6IHtcbiAgICBzZWFyY2g6ICdTZWFyY2gnLFxuICAgIHNlbGVjdEZpZWxkOiAnU2VsZWN0IGEgZmllbGQnLFxuICAgIHlBeGlzOiAnWSBBeGlzJyxcbiAgICBzZWxlY3RUeXBlOiAnU2VsZWN0IEEgVHlwZScsXG4gICAgc2VsZWN0VmFsdWU6ICdTZWxlY3QgQSBWYWx1ZScsXG4gICAgZW50ZXJWYWx1ZTogJ0VudGVyIGEgdmFsdWUnLFxuICAgIGVtcHR5OiAnZW1wdHknXG4gIH0sXG4gIG1pc2M6IHtcbiAgICBieTogJycsXG4gICAgdmFsdWVzSW46ICdWYWx1ZXMgaW4nLFxuICAgIHZhbHVlRXF1YWxzOiAnVmFsdWUgZXF1YWxzJyxcbiAgICBkYXRhU291cmNlOiAnRGF0YSBTb3VyY2UnLFxuICAgIGJydXNoUmFkaXVzOiAnQnJ1c2ggUmFkaXVzIChrbSknLFxuICAgIGVtcHR5OiAnICdcbiAgfSxcbiAgbWFwTGF5ZXJzOiB7XG4gICAgdGl0bGU6ICdNYXAgTGF5ZXJzJyxcbiAgICBsYWJlbDogJ0xhYmVsJyxcbiAgICByb2FkOiAnUm9hZCcsXG4gICAgYm9yZGVyOiAnQm9yZGVyJyxcbiAgICBidWlsZGluZzogJ0J1aWxkaW5nJyxcbiAgICB3YXRlcjogJ1dhdGVyJyxcbiAgICBsYW5kOiAnTGFuZCcsXG4gICAgJzNkQnVpbGRpbmcnOiAnM2QgQnVpbGRpbmcnXG4gIH0sXG4gIHBhbmVsOiB7XG4gICAgdGV4dDoge1xuICAgICAgbGFiZWw6ICdsYWJlbCcsXG4gICAgICBsYWJlbFdpdGhJZDogJ0xhYmVsIHtsYWJlbElkfScsXG4gICAgICBmb250U2l6ZTogJ0ZvbnQgc2l6ZScsXG4gICAgICBmb250Q29sb3I6ICdGb250IGNvbG9yJyxcbiAgICAgIHRleHRBbmNob3I6ICdUZXh0IGFuY2hvcicsXG4gICAgICBhbGlnbm1lbnQ6ICdBbGlnbm1lbnQnLFxuICAgICAgYWRkTW9yZUxhYmVsOiAnQWRkIE1vcmUgTGFiZWwnXG4gICAgfVxuICB9LFxuICBzaWRlYmFyOiB7XG4gICAgcGFuZWxzOiB7XG4gICAgICBsYXllcjogJ0xheWVycycsXG4gICAgICBmaWx0ZXI6ICdGaWx0ZXJzJyxcbiAgICAgIGludGVyYWN0aW9uOiAnSW50ZXJhY3Rpb25zJyxcbiAgICAgIGJhc2VtYXA6ICdCYXNlIG1hcCdcbiAgICB9XG4gIH0sXG4gIGxheWVyOiB7XG4gICAgcmVxdWlyZWQ6ICdSZXF1aXJlZConLFxuICAgIHJhZGl1czogJ1JhZGl1cycsXG4gICAgY29sb3I6ICdDb2xvcicsXG4gICAgZmlsbENvbG9yOiAnRmlsbCBDb2xvcicsXG4gICAgb3V0bGluZTogJ091dGxpbmUnLFxuICAgIHdlaWdodDogJ1dlaWdodCcsXG4gICAgcHJvcGVydHlCYXNlZE9uOiAne3Byb3BlcnR5fSBiYXNlZCBvbicsXG4gICAgY292ZXJhZ2U6ICdDb3ZlcmFnZScsXG4gICAgc3Ryb2tlOiAnU3Ryb2tlJyxcbiAgICBzdHJva2VXaWR0aDogJ1N0cm9rZSBXaWR0aCcsXG4gICAgc3Ryb2tlQ29sb3I6ICdTdHJva2UgQ29sb3InLFxuICAgIGJhc2ljOiAnQmFzaWMnLFxuICAgIHRyYWlsTGVuZ3RoOiAnVHJhaWwgTGVuZ3RoJyxcbiAgICB0cmFpbExlbmd0aERlc2NyaXB0aW9uOiAnTnVtYmVyIG9mIHNlY29uZHMgZm9yIGEgcGF0aCB0byBjb21wbGV0ZWx5IGZhZGUgb3V0JyxcbiAgICBuZXdMYXllcjogJ25ldyBsYXllcicsXG4gICAgZWxldmF0aW9uQnlEZXNjcmlwdGlvbjogJ1doZW4gb2ZmLCBoZWlnaHQgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJyxcbiAgICBjb2xvckJ5RGVzY3JpcHRpb246ICdXaGVuIG9mZiwgY29sb3IgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJyxcbiAgICBhZ2dyZWdhdGVCeTogJ0FnZ3JlZ2F0ZSB7ZmllbGR9IGJ5JyxcbiAgICAnM0RNb2RlbCc6ICczRCBNb2RlbCcsXG4gICAgJzNETW9kZWxPcHRpb25zJzogJzNEIE1vZGVsIE9wdGlvbnMnLFxuICAgIHR5cGU6IHtcbiAgICAgIHBvaW50OiAncG9pbnQnLFxuICAgICAgYXJjOiAnYXJjJyxcbiAgICAgIGxpbmU6ICdsaW5lJyxcbiAgICAgIGdyaWQ6ICdncmlkJyxcbiAgICAgIGhleGJpbjogJ2hleGJpbicsXG4gICAgICBwb2x5Z29uOiAncG9seWdvbicsXG4gICAgICBnZW9qc29uOiAnZ2VvanNvbicsXG4gICAgICBjbHVzdGVyOiAnY2x1c3RlcicsXG4gICAgICBpY29uOiAnaWNvbicsXG4gICAgICBoZWF0bWFwOiAnaGVhdG1hcCcsXG4gICAgICBoZXhhZ29uOiAnaGV4YWdvbicsXG4gICAgICBoZXhhZ29uaWQ6ICdIMycsXG4gICAgICB0cmlwOiAndHJpcCcsXG4gICAgICBzMjogJ1MyJyxcbiAgICAgICczZCc6ICczRCdcbiAgICB9XG4gIH0sXG4gIGxheWVyVmlzQ29uZmlnczoge1xuICAgIGFuZ2xlOiAnQW5nbGUnLFxuICAgIHN0cm9rZVdpZHRoOiAnU3Ryb2tlIFdpZHRoIChQaXhlbHMpJyxcbiAgICBzdHJva2VXaWR0aFJhbmdlOiAnU3Ryb2tlIFdpZHRoIFJhbmdlJyxcbiAgICByYWRpdXM6ICdSYWRpdXMnLFxuICAgIGZpeGVkUmFkaXVzOiAnRml4ZWQgUmFkaXVzIHRvIG1ldGVyJyxcbiAgICBmaXhlZFJhZGl1c0Rlc2NyaXB0aW9uOiAnTWFwIHJhZGl1cyB0byBhYnNvbHV0ZSByYWRpdXMgaW4gbWV0ZXJzLCBlLmcuIDUgdG8gNSBtZXRlcnMnLFxuICAgIHJhZGl1c1JhbmdlOiAnUmFkaXVzIFJhbmdlJyxcbiAgICBjbHVzdGVyUmFkaXVzOiAnQ2x1c3RlciBSYWRpdXMgaW4gUGl4ZWxzJyxcbiAgICByYWRpdXNSYW5nZVBpeGVsczogJ1JhZGl1cyBSYW5nZSBpbiBwaXhlbHMnLFxuICAgIG9wYWNpdHk6ICdPcGFjaXR5JyxcbiAgICBjb3ZlcmFnZTogJ0NvdmVyYWdlJyxcbiAgICBvdXRsaW5lOiAnT3V0bGluZScsXG4gICAgY29sb3JSYW5nZTogJ0NvbG9yIHJhbmdlJyxcbiAgICBzdHJva2U6ICdTdHJva2UnLFxuICAgIHN0cm9rZUNvbG9yOiAnU3Ryb2tlIENvbG9yJyxcbiAgICBzdHJva2VDb2xvclJhbmdlOiAnU3Ryb2tlIENvbG9yIHJhbmdlJyxcbiAgICB0YXJnZXRDb2xvcjogJ1RhcmdldCBDb2xvcicsXG4gICAgY29sb3JBZ2dyZWdhdGlvbjogJ0NvbG9yIEFnZ3JlZ2F0aW9uJyxcbiAgICBoZWlnaHRBZ2dyZWdhdGlvbjogJ0hlaWdodCBBZ2dyZWdhdGlvbicsXG4gICAgcmVzb2x1dGlvblJhbmdlOiAnUmVzb2x1dGlvbiByYW5nZScsXG4gICAgc2l6ZVNjYWxlOiAnU2l6ZSBTY2FsZScsXG4gICAgd29ybGRVbml0U2l6ZTogJ1dvcmxkIFVuaXQgU2l6ZScsXG4gICAgZWxldmF0aW9uU2NhbGU6ICdFbGV2YXRpb24gU2NhbGUnLFxuICAgIGhlaWdodFNjYWxlOiAnSGVpZ2h0IFNjYWxlJyxcbiAgICBjb3ZlcmFnZVJhbmdlOiAnQ292ZXJhZ2UgUmFuZ2UnLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmc6ICdIaWdoIFByZWNpc2lvbiBSZW5kZXJpbmcnLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbjogJ0hpZ2ggcHJlY2lzaW9uIHdpbGwgcmVzdWx0IGluIHNsb3dlciBwZXJmb3JtYW5jZScsXG4gICAgaGVpZ2h0OiAnSGVpZ2h0JyxcbiAgICBoZWlnaHREZXNjcmlwdGlvbjogJ0NsaWNrIGJ1dHRvbiBhdCB0b3AgcmlnaHQgb2YgdGhlIG1hcCB0byBzd2l0Y2ggdG8gM2QgdmlldycsXG4gICAgZmlsbDogJ0ZpbGwnLFxuICAgIGVuYWJsZVBvbHlnb25IZWlnaHQ6ICdFbmFibGUgUG9seWdvbiBIZWlnaHQnLFxuICAgIHNob3dXaXJlZnJhbWU6ICdTaG93IFdpcmVmcmFtZScsXG4gICAgd2VpZ2h0SW50ZW5zaXR5OiAnV2VpZ2h0IEludGVuc2l0eScsXG4gICAgem9vbVNjYWxlOiAnWm9vbSBTY2FsZScsXG4gICAgaGVpZ2h0UmFuZ2U6ICdIZWlnaHQgUmFuZ2UnXG4gIH0sXG4gIGxheWVyTWFuYWdlcjoge1xuICAgIGFkZERhdGE6ICdBZGQgRGF0YScsXG4gICAgYWRkTGF5ZXI6ICdBZGQgTGF5ZXInLFxuICAgIGxheWVyQmxlbmRpbmc6ICdMYXllciBCbGVuZGluZydcbiAgfSxcbiAgbWFwTWFuYWdlcjoge1xuICAgIG1hcFN0eWxlOiAnTWFwIHN0eWxlJyxcbiAgICBhZGRNYXBTdHlsZTogJ0FkZCBNYXAgU3R5bGUnLFxuICAgICczZEJ1aWxkaW5nQ29sb3InOiAnM0QgQnVpbGRpbmcgQ29sb3InXG4gIH0sXG4gIGxheWVyQ29uZmlndXJhdGlvbjoge1xuICAgIGRlZmF1bHREZXNjcmlwdGlvbjogJ0NhbGN1bGF0ZSB7cHJvcGVydHl9IGJhc2VkIG9uIHNlbGVjdGVkIGZpZWxkJyxcbiAgICBob3dUbzogJ0hvdyB0bydcbiAgfSxcbiAgZmlsdGVyTWFuYWdlcjoge1xuICAgIGFkZEZpbHRlcjogJ0FkZCBGaWx0ZXInXG4gIH0sXG4gIGRhdGFzZXRUaXRsZToge1xuICAgIHNob3dEYXRhVGFibGU6ICdTaG93IGRhdGEgdGFibGUnLFxuICAgIHJlbW92ZURhdGFzZXQ6ICdSZW1vdmUgZGF0YXNldCdcbiAgfSxcbiAgZGF0YXNldEluZm86IHtcbiAgICByb3dDb3VudDogJ3tyb3dDb3VudH0gcm93cydcbiAgfSxcbiAgdG9vbHRpcDoge1xuICAgIGhpZGVMYXllcjogJ2hpZGUgbGF5ZXInLFxuICAgIHNob3dMYXllcjogJ3Nob3cgbGF5ZXInLFxuICAgIGhpZGVGZWF0dXJlOiAnSGlkZSBGZWF0dXJlJyxcbiAgICBzaG93RmVhdHVyZTogJ1Nob3cgZmVhdHVyZScsXG4gICAgaGlkZTogJ2hpZGUnLFxuICAgIHNob3c6ICdzaG93JyxcbiAgICByZW1vdmVMYXllcjogJ1JlbW92ZSBsYXllcicsXG4gICAgbGF5ZXJTZXR0aW5nczogJ0xheWVyIHNldHRpbmdzJyxcbiAgICBjbG9zZVBhbmVsOiAnQ2xvc2UgY3VycmVudCBwYW5lbCcsXG4gICAgc3dpdGNoVG9EdWFsVmlldzogJ1N3aXRjaCB0byBkdWFsIG1hcCB2aWV3JyxcbiAgICBzaG93TGVnZW5kOiAnc2hvdyBsZWdlbmQnLFxuICAgIGRpc2FibGUzRE1hcDogJ0Rpc2FibGUgM0QgTWFwJyxcbiAgICBEcmF3T25NYXA6ICdEcmF3IG9uIG1hcCcsXG4gICAgc2VsZWN0TG9jYWxlOiAnU2VsZWN0IGxvY2FsZScsXG4gICAgaGlkZUxheWVyUGFuZWw6ICdIaWRlIGxheWVyIHBhbmVsJyxcbiAgICBzaG93TGF5ZXJQYW5lbDogJ1Nob3cgbGF5ZXIgcGFuZWwnLFxuICAgIG1vdmVUb1RvcDogJ01vdmUgdG8gdG9wIG9mIGRhdGEgbGF5ZXJzJyxcbiAgICBzZWxlY3RCYXNlTWFwU3R5bGU6ICdTZWxlY3QgQmFzZSBNYXAgU3R5bGUnLFxuICAgIGRlbGV0ZTogJ0RlbGV0ZScsXG4gICAgdGltZVBsYXliYWNrOiAnVGltZSBQbGF5YmFjaycsXG4gICAgY2xvdWRTdG9yYWdlOiAnQ2xvdWQgU3RvcmFnZScsXG4gICAgJzNETWFwJzogJzNEIE1hcCdcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0IEltYWdlJyxcbiAgICBleHBvcnREYXRhOiAnRXhwb3J0IERhdGEnLFxuICAgIGV4cG9ydE1hcDogJ0V4cG9ydCBNYXAnLFxuICAgIHNoYXJlTWFwVVJMOiAnU2hhcmUgTWFwIFVSTCcsXG4gICAgc2F2ZU1hcDogJ1NhdmUgTWFwJyxcbiAgICBzZWxlY3Q6ICdzZWxlY3QnLFxuICAgIHBvbHlnb246ICdwb2x5Z29uJyxcbiAgICByZWN0YW5nbGU6ICdyZWN0YW5nbGUnLFxuICAgIGhpZGU6ICdoaWRlJyxcbiAgICBzaG93OiAnc2hvdycsXG4gICAgLi4uTE9DQUxFU1xuICB9LFxuICBtb2RhbDoge1xuICAgIHRpdGxlOiB7XG4gICAgICBkZWxldGVEYXRhc2V0OiAnRGVsZXRlIERhdGFzZXQnLFxuICAgICAgYWRkRGF0YVRvTWFwOiAnQWRkIERhdGEgVG8gTWFwJyxcbiAgICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0IEltYWdlJyxcbiAgICAgIGV4cG9ydERhdGE6ICdFeHBvcnQgRGF0YScsXG4gICAgICBleHBvcnRNYXA6ICdFeHBvcnQgTWFwJyxcbiAgICAgIGFkZEN1c3RvbU1hcGJveFN0eWxlOiAnQWRkIEN1c3RvbSBNYXBib3ggU3R5bGUnLFxuICAgICAgc2F2ZU1hcDogJ1NhdmUgTWFwJyxcbiAgICAgIHNoYXJlVVJMOiAnU2hhcmUgVVJMJ1xuICAgIH0sXG4gICAgYnV0dG9uOiB7XG4gICAgICBkZWxldGU6ICdEZWxldGUnLFxuICAgICAgZG93bmxvYWQ6ICdEb3dubG9hZCcsXG4gICAgICBleHBvcnQ6ICdFeHBvcnQnLFxuICAgICAgYWRkU3R5bGU6ICdBZGQgU3R5bGUnLFxuICAgICAgc2F2ZTogJ1NhdmUnLFxuICAgICAgZGVmYXVsdENhbmNlbDogJ0NhbmNlbCcsXG4gICAgICBkZWZhdWx0Q29uZmlybTogJ0NvbmZpcm0nXG4gICAgfSxcbiAgICBleHBvcnRJbWFnZToge1xuICAgICAgcmF0aW9UaXRsZTogJ1JhdGlvJyxcbiAgICAgIHJhdGlvRGVzY3JpcHRpb246ICdDaG9vc2UgdGhlIHJhdGlvIGZvciB2YXJpb3VzIHVzYWdlcy4nLFxuICAgICAgcmF0aW9PcmlnaW5hbFNjcmVlbjogJ09yaWdpbmFsIFNjcmVlbicsXG4gICAgICByYXRpb0N1c3RvbTogJ0N1c3RvbScsXG4gICAgICByYXRpbzRfMzogJzQ6MycsXG4gICAgICByYXRpbzE2Xzk6ICcxNjo5JyxcbiAgICAgIHJlc29sdXRpb25UaXRsZTogJ1Jlc29sdXRpb24nLFxuICAgICAgcmVzb2x1dGlvbkRlc2NyaXB0aW9uOiAnSGlnaCByZXNvbHV0aW9uIGlzIGJldHRlciBmb3IgcHJpbnRzLicsXG4gICAgICBtYXBMZWdlbmRUaXRsZTogJ01hcCBMZWdlbmQnLFxuICAgICAgbWFwTGVnZW5kQWRkOiAnQWRkIGxlZ2VuZCBvbiBtYXAnXG4gICAgfSxcbiAgICBleHBvcnREYXRhOiB7XG4gICAgICBkYXRhc2V0VGl0bGU6ICdEYXRhc2V0JyxcbiAgICAgIGRhdGFzZXRTdWJ0aXRsZTogJ0Nob29zZSB0aGUgZGF0YXNldHMgeW91IHdhbnQgdG8gZXhwb3J0JyxcbiAgICAgIGFsbERhdGFzZXRzOiAnQWxsJyxcbiAgICAgIGRhdGFUeXBlVGl0bGU6ICdEYXRhIFR5cGUnLFxuICAgICAgZGF0YVR5cGVTdWJ0aXRsZTogJ0Nob29zZSB0aGUgdHlwZSBvZiBkYXRhIHlvdSB3YW50IHRvIGV4cG9ydCcsXG4gICAgICBmaWx0ZXJEYXRhVGl0bGU6ICdGaWx0ZXIgRGF0YScsXG4gICAgICBmaWx0ZXJEYXRhU3VidGl0bGU6ICdZb3UgY2FuIGNob29zZSBleHBvcnRpbmcgb3JpZ2luYWwgZGF0YSBvciBmaWx0ZXJlZCBkYXRhJyxcbiAgICAgIGZpbHRlcmVkRGF0YTogJ0ZpbHRlcmVkIGRhdGEnLFxuICAgICAgdW5maWx0ZXJlZERhdGE6ICdVbmZpbHRlcmVkIERhdGEnLFxuICAgICAgZmlsZUNvdW50OiAne2ZpbGVDb3VudH0gRmlsZXMnLFxuICAgICAgcm93Q291bnQ6ICd7cm93Q291bnR9IFJvd3MnXG4gICAgfSxcbiAgICBkZWxldGVEYXRhOiB7XG4gICAgICB3YXJuaW5nOiAneW91IGFyZSBnb2luZyB0byBkZWxldGUgdGhpcyBkYXRhc2V0LiBJdCB3aWxsIGFmZmVjdCB7bGVuZ3RofSBsYXllcnMnXG4gICAgfSxcbiAgICBhZGRTdHlsZToge1xuICAgICAgcHVibGlzaFRpdGxlOiAnMS4gUHVibGlzaCB5b3VyIHN0eWxlIGF0IG1hcGJveCBvciBwcm92aWRlIGFjY2VzcyB0b2tlbicsXG4gICAgICBwdWJsaXNoU3VidGl0bGUxOiAnWW91IGNhbiBjcmVhdGUgeW91ciBvd24gbWFwIHN0eWxlIGF0JyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTI6ICdhbmQnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMzogJ3B1Ymxpc2gnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNDogJ2l0LicsXG4gICAgICBwdWJsaXNoU3VidGl0bGU1OiAnVG8gdXNlIHByaXZhdGUgc3R5bGUsIHBhc3RlIHlvdXInLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNjogJ2FjY2VzcyB0b2tlbicsXG4gICAgICBwdWJsaXNoU3VidGl0bGU3OlxuICAgICAgICAnaGVyZS4gKmtlcGxlci5nbCBpcyBhIGNsaWVudC1zaWRlIGFwcGxpY2F0aW9uLCBkYXRhIHN0YXlzIGluIHlvdXIgYnJvd3Nlci4uJyxcbiAgICAgIGV4YW1wbGVUb2tlbjogJ2UuZy4gcGsuYWJjZGVmZy54eHh4eHgnLFxuICAgICAgcGFzdGVUaXRsZTogJzIuIFBhc3RlIHN0eWxlIHVybCcsXG4gICAgICBwYXN0ZVN1YnRpdGxlMTogJ1doYXQgaXMgYScsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogJ3N0eWxlIFVSTCcsXG4gICAgICBuYW1pbmdUaXRsZTogJzMuIE5hbWUgeW91ciBzdHlsZSdcbiAgICB9LFxuICAgIHNoYXJlTWFwOiB7XG4gICAgICBzaGFyZVVyaVRpdGxlOiAnU2hhcmUgTWFwIFVybCcsXG4gICAgICBzaGFyZVVyaVN1YnRpdGxlOiAnR2VuZXJhdGUgYSBtYXAgdXJsIHRvIHNoYXJlIHdpdGggb3RoZXJzJyxcbiAgICAgIGNsb3VkVGl0bGU6ICdDbG91ZCBzdG9yYWdlJyxcbiAgICAgIGNsb3VkU3VidGl0bGU6ICdMb2dpbiBhbmQgdXBsb2FkIG1hcCBkYXRhIHRvIHlvdXIgcGVyc29uYWwgY2xvdWQgc3RvcmFnZScsXG4gICAgICBzaGFyZURpc2NsYWltZXI6XG4gICAgICAgICdrZXBsZXIuZ2wgd2lsbCBzYXZlIHlvdXIgbWFwIGRhdGEgdG8geW91ciBwZXJzb25hbCBjbG91ZCBzdG9yYWdlLCBvbmx5IHBlb3BsZSB3aXRoIHRoZSBVUkwgY2FuIGFjY2VzcyB5b3VyIG1hcCBhbmQgZGF0YS4gJyArXG4gICAgICAgICdZb3UgY2FuIGVkaXQvZGVsZXRlIHRoZSBkYXRhIGZpbGUgaW4geW91ciBjbG91ZCBhY2NvdW50IGFueXRpbWUuJyxcbiAgICAgIGdvdG9QYWdlOiAnR28gdG8geW91ciBLZXBsZXIuZ2wge2N1cnJlbnRQcm92aWRlcn0gcGFnZSdcbiAgICB9LFxuICAgIHN0YXR1c1BhbmVsOiB7XG4gICAgICBtYXBVcGxvYWRpbmc6ICdNYXAgVXBsb2FkaW5nJyxcbiAgICAgIGVycm9yOiAnRXJyb3InXG4gICAgfSxcbiAgICBzYXZlTWFwOiB7XG4gICAgICB0aXRsZTogJ0Nsb3VkIHN0b3JhZ2UnLFxuICAgICAgc3VidGl0bGU6ICdMb2dpbiB0byBzYXZlIG1hcCB0byB5b3VyIHBlcnNvbmFsIGNsb3VkIHN0b3JhZ2UnXG4gICAgfSxcbiAgICBleHBvcnRNYXA6IHtcbiAgICAgIGZvcm1hdFRpdGxlOiAnTWFwIGZvcm1hdCcsXG4gICAgICBmb3JtYXRTdWJ0aXRsZTogJ0Nob29zZSB0aGUgZm9ybWF0IHRvIGV4cG9ydCB5b3VyIG1hcCB0bycsXG4gICAgICBodG1sOiB7XG4gICAgICAgIHNlbGVjdGlvbjogJ0V4cG9ydCB5b3VyIG1hcCBpbnRvIGFuIGludGVyYWN0aXZlIGh0bWwgZmlsZS4nLFxuICAgICAgICB0b2tlblRpdGxlOiAnTWFwYm94IGFjY2VzcyB0b2tlbicsXG4gICAgICAgIHRva2VuU3VidGl0bGU6ICdVc2UgeW91ciBvd24gTWFwYm94IGFjY2VzcyB0b2tlbiBpbiB0aGUgaHRtbCAob3B0aW9uYWwpJyxcbiAgICAgICAgdG9rZW5QbGFjZWhvbGRlcjogJ1Bhc3RlIHlvdXIgTWFwYm94IGFjY2VzcyB0b2tlbicsXG4gICAgICAgIHRva2VuTWlzdXNlV2FybmluZzpcbiAgICAgICAgICAnKiBJZiB5b3UgZG8gbm90IHByb3ZpZGUgeW91ciBvd24gdG9rZW4sIHRoZSBtYXAgbWF5IGZhaWwgdG8gZGlzcGxheSBhdCBhbnkgdGltZSB3aGVuIHdlIHJlcGxhY2Ugb3VycyB0byBhdm9pZCBtaXN1c2UuICcsXG4gICAgICAgIHRva2VuRGlzY2xhaW1lcjogJ1lvdSBjYW4gY2hhbmdlIHRoZSBNYXBib3ggdG9rZW4gbGF0ZXIgdXNpbmcgdGhlIGZvbGxvd2luZyBpbnN0cnVjdGlvbnM6ICcsXG4gICAgICAgIHRva2VuVXBkYXRlOiAnSG93IHRvIHVwZGF0ZSBhbiBleGlzdGluZyBtYXAgdG9rZW4uJyxcbiAgICAgICAgbW9kZVRpdGxlOiAnTWFwIE1vZGUnLFxuICAgICAgICBtb2RlU3VidGl0bGUxOiAnU2VsZWN0IHRoZSBhcHAgbW9kZS4gTW9yZSAnLFxuICAgICAgICBtb2RlU3VidGl0bGUyOiAnaW5mbycsXG4gICAgICAgIG1vZGVEZXNjcmlwdGlvbjogJ0FsbG93IHVzZXJzIHRvIHttb2RlfSB0aGUgbWFwJyxcbiAgICAgICAgcmVhZDogJ3JlYWQnLFxuICAgICAgICBlZGl0OiAnZWRpdCdcbiAgICAgIH0sXG4gICAgICBqc29uOiB7XG4gICAgICAgIGNvbmZpZ1RpdGxlOiAnTWFwIENvbmZpZycsXG4gICAgICAgIGNvbmZpZ0Rpc2NsYWltZXI6XG4gICAgICAgICAgJ01hcCBjb25maWcgd2lsbCBiZSBpbmNsdWRlZCBpbiB0aGUgSnNvbiBmaWxlLiBJZiB5b3UgYXJlIHVzaW5nIGtlcGxlci5nbCBpbiB5b3VyIG93biBhcHAuIFlvdSBjYW4gY29weSB0aGlzIGNvbmZpZyBhbmQgcGFzcyBpdCB0byAnLFxuICAgICAgICBzZWxlY3Rpb246XG4gICAgICAgICAgJ0V4cG9ydCBjdXJyZW50IG1hcCBkYXRhIGFuZCBjb25maWcgaW50byBhIHNpbmdsZSBKc29uIGZpbGUuIFlvdSBjYW4gbGF0ZXIgb3BlbiB0aGUgc2FtZSBtYXAgYnkgdXBsb2FkaW5nIHRoaXMgZmlsZSB0byBrZXBsZXIuZ2wuJyxcbiAgICAgICAgZGlzY2xhaW1lcjpcbiAgICAgICAgICAnKiBNYXAgY29uZmlnIGlzIGNvdXBsZWQgd2l0aCBsb2FkZWQgZGF0YXNldHMuIOKAmGRhdGFJZOKAmSBpcyB1c2VkIHRvIGJpbmQgbGF5ZXJzLCBmaWx0ZXJzLCBhbmQgdG9vbHRpcHMgdG8gYSBzcGVjaWZpYyBkYXRhc2V0LiAnICtcbiAgICAgICAgICAnV2hlbiBwYXNzaW5nIHRoaXMgY29uZmlnIHRvIGFkZERhdGFUb01hcCwgbWFrZSBzdXJlIHRoZSBkYXRhc2V0IGlkIG1hdGNoZXMgdGhlIGRhdGFJZC9zIGluIHRoaXMgY29uZmlnLidcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRpbmdEaWFsb2c6IHtcbiAgICAgIGxvYWRpbmc6ICdMb2FkaW5nLi4uJ1xuICAgIH0sXG4gICAgbG9hZERhdGE6IHtcbiAgICAgIHVwbG9hZDogJ0xvYWQgRmlsZXMnLFxuICAgICAgc3RvcmFnZTogJ0xvYWQgZnJvbSBTdG9yYWdlJ1xuICAgIH0sXG4gICAgdHJpcEluZm86IHtcbiAgICAgIHRpdGxlOiAnSG93IHRvIGVuYWJsZSB0cmlwIGFuaW1hdGlvbicsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdJbiBvcmRlciB0byBhbmltYXRlIHRoZSBwYXRoLCB0aGUgZ2VvSlNPTiBkYXRhIG5lZWRzIHRvIGNvbnRhaW4gYExpbmVTdHJpbmdgIGluIGl0cyBmZWF0dXJlIGdlb21ldHJ5LCBhbmQgdGhlIGNvb3JkaW5hdGVzIGluIHRoZSBMaW5lU3RyaW5nIG5lZWQgdG8gaGF2ZSA0IGVsZW1lbnRzIGluIHRoZSBmb3JtYXRzIG9mJyxcbiAgICAgIGNvZGU6ICcgW2xvbmdpdHVkZSwgbGF0aXR1ZGUsIGFsdGl0dWRlLCB0aW1lc3RhbXBdICcsXG4gICAgICBkZXNjcmlwdGlvbjI6XG4gICAgICAgICd3aXRoIHRoZSBsYXN0IGVsZW1lbnQgYmVpbmcgYSB0aW1lc3RhbXAuIFZhbGlkIHRpbWVzdGFtcCBmb3JtYXRzIGluY2x1ZGUgdW5peCBpbiBzZWNvbmRzIHN1Y2ggYXMgYDE1NjQxODQzNjNgIG9yIGluIG1pbGxpc2Vjb25kcyBzdWNoIGFzIGAxNTY0MTg0MzYzMDAwYC4nLFxuICAgICAgZXhhbXBsZTogJ0V4YW1wbGU6J1xuICAgIH0sXG4gICAgaWNvbkluZm86IHtcbiAgICAgIHRpdGxlOiAnSG93IHRvIGRyYXcgaWNvbnMnLFxuICAgICAgZGVzY3JpcHRpb24xOlxuICAgICAgICAnSW4geW91ciBjc3YsIGNyZWF0ZSBhIGNvbHVtbiwgcHV0IHRoZSBuYW1lIG9mIHRoZSBpY29uIHlvdSB3YW50IHRvIGRyYXcgaW4gaXQuIFlvdSBjYW4gbGVhdmUgdGhlIGNlbGwgZW1wdHkgaWYgeW91IGRvIG5vdCB3YW50IHRoZSBpY29uIHRvIHNob3cgZm9yIHNvbWUgcG9pbnRzLiBXaGVuIHRoZSBjb2x1bW4gaXMgbmFtZWQnLFxuICAgICAgY29kZTogJ2ljb24nLFxuICAgICAgZGVzY3JpcHRpb24yOiAnIGtlcGxlci5nbCB3aWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGEgaWNvbiBsYXllciBmb3IgeW91LicsXG4gICAgICBleGFtcGxlOiAnRXhhbXBsZTonLFxuICAgICAgaWNvbnM6ICdJY29ucydcbiAgICB9LFxuICAgIHN0b3JhZ2VNYXBWaWV3ZXI6IHtcbiAgICAgIGxhc3RNb2RpZmllZDogJ0xhc3QgbW9kaWZpZWQge2xhc3RVcGRhdGVkfSBhZ28nLFxuICAgICAgYmFjazogJ0JhY2snXG4gICAgfSxcbiAgICBvdmVyd3JpdGVNYXA6IHtcbiAgICAgIHRpdGxlOiAnU2F2aW5nIG1hcC4uLicsXG4gICAgICBhbHJlYWR5RXhpc3RzOiAnYWxyZWFkeSBleGlzdHMgaW4geW91ciB7bWFwU2F2ZWR9LiBXb3VsZCB5b3UgbGlrZSB0byBvdmVyd3JpdGUgaXQ/J1xuICAgIH0sXG4gICAgbG9hZFN0b3JhZ2VNYXA6IHtcbiAgICAgIGJhY2s6ICdCYWNrJyxcbiAgICAgIGdvVG9QYWdlOiAnR28gdG8geW91ciBLZXBsZXIuZ2wge2Rpc3BsYXlOYW1lfSBwYWdlJyxcbiAgICAgIHN0b3JhZ2VNYXBzOiAnU3RvcmFnZSAvIE1hcHMnLFxuICAgICAgbm9TYXZlZE1hcHM6ICdObyBzYXZlZCBtYXBzIHlldCdcbiAgICB9XG4gIH0sXG4gIGhlYWRlcjoge1xuICAgIHZpc2libGVMYXllcnM6ICdWaXNpYmxlIGxheWVycycsXG4gICAgbGF5ZXJMZWdlbmQ6ICdMYXllciBMZWdlbmQnXG4gIH0sXG4gIGludGVyYWN0aW9uczoge1xuICAgIHRvb2x0aXA6ICdUb29sdGlwJyxcbiAgICBicnVzaDogJ0JydXNoJyxcbiAgICBjb29yZGluYXRlOiAnQ29vcmRpbmF0ZXMnLFxuICAgIGdlb2NvZGVyOiAnR2VvY29kZXInXG4gIH0sXG4gIGxheWVyQmxlbmRpbmc6IHtcbiAgICB0aXRsZTogJ0xheWVyIEJsZW5kaW5nJyxcbiAgICBhZGRpdGl2ZTogJ2FkZGl0aXZlJyxcbiAgICBub3JtYWw6ICdub3JtYWwnLFxuICAgIHN1YnRyYWN0aXZlOiAnc3VidHJhY3RpdmUnXG4gIH0sXG4gIGNvbHVtbnM6IHtcbiAgICB0aXRsZTogJ0NvbHVtbnMnLFxuICAgIGxhdDogJ2xhdCcsXG4gICAgbG5nOiAnbG9uJyxcbiAgICBhbHRpdHVkZTogJ2FsdGl0dWRlJyxcbiAgICBpY29uOiAnaWNvbicsXG4gICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgIGFyYzoge1xuICAgICAgbGF0MDogJ3NvdXJjZSBsYXQnLFxuICAgICAgbG5nMDogJ3NvdXJjZSBsbmcnLFxuICAgICAgbGF0MTogJ3RhcmdldCBsYXQnLFxuICAgICAgbG5nMTogJ3RhcmdldCBsbmcnXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiAnR3JpZCBTaXplIChrbSknXG4gICAgfSxcbiAgICBoZXhhZ29uOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiAnSGV4YWdvbiBSYWRpdXMgKGttKSdcbiAgICB9LFxuICAgIGhleF9pZDogJ2hleCBpZCdcbiAgfSxcbiAgY29sb3I6IHtcbiAgICBjdXN0b21QYWxldHRlOiAnQ3VzdG9tIFBhbGV0dGUnLFxuICAgIHN0ZXBzOiAnc3RlcHMnLFxuICAgIHR5cGU6ICd0eXBlJyxcbiAgICByZXZlcnNlZDogJ3JldmVyc2VkJ1xuICB9LFxuICBzY2FsZToge1xuICAgIGNvbG9yU2NhbGU6ICdDb2xvciBTY2FsZScsXG4gICAgc2l6ZVNjYWxlOiAnU2l6ZSBTY2FsZScsXG4gICAgc3Ryb2tlU2NhbGU6ICdTdHJva2UgU2NhbGUnLFxuICAgIHNjYWxlOiAnU2NhbGUnXG4gIH0sXG4gIGZpbGVVcGxvYWRlcjoge1xuICAgIG1lc3NhZ2U6ICdEcmFnICYgRHJvcCBZb3VyIEZpbGUocykgSGVyZScsXG4gICAgY2hyb21lTWVzc2FnZTpcbiAgICAgICcqQ2hyb21lIHVzZXI6IExpbWl0IGZpbGUgc2l6ZSB0byAyNTBtYiwgaWYgbmVlZCB0byB1cGxvYWQgbGFyZ2VyIGZpbGUsIHRyeSBTYWZhcmknLFxuICAgIGRpc2NsYWltZXI6XG4gICAgICAnKmtlcGxlci5nbCBpcyBhIGNsaWVudC1zaWRlIGFwcGxpY2F0aW9uIHdpdGggbm8gc2VydmVyIGJhY2tlbmQuIERhdGEgbGl2ZXMgb25seSBvbiB5b3VyIG1hY2hpbmUvYnJvd3Nlci4gJyArXG4gICAgICAnTm8gaW5mb3JtYXRpb24gb3IgbWFwIGRhdGEgaXMgc2VudCB0byBhbnkgc2VydmVyLicsXG4gICAgY29uZmlnVXBsb2FkTWVzc2FnZTpcbiAgICAgICdVcGxvYWQgKipDU1YqKiwgKipHZW9Kc29uKiogb3Igc2F2ZWQgbWFwICoqSnNvbioqLiBSZWFkIG1vcmUgYWJvdXQgWyoqc3VwcG9ydGVkIGZpbGUgZm9ybWF0cyoqXScsXG4gICAgYnJvd3NlRmlsZXM6ICdicm93c2UgeW91ciBmaWxlcycsXG4gICAgdXBsb2FkaW5nOiAnVXBsb2FkaW5nJyxcbiAgICBmaWxlTm90U3VwcG9ydGVkOiAnRmlsZSB7ZXJyb3JGaWxlc30gaXMgbm90IHN1cHBvcnRlZC4nLFxuICAgIG9yOiAnb3InXG4gIH0sXG4gIGdlb2NvZGVyOiB7XG4gICAgdGl0bGU6ICdHZW9jb2RlcidcbiAgfSxcbiAgZmllbGRTZWxlY3Rvcjoge1xuICAgIGNsZWFyQWxsOiAnQ2xlYXIgQWxsJyxcbiAgICBmb3JtYXR0aW5nOiAnRm9ybWF0dGluZydcbiAgfSxcbiAgZGVuc2l0eTogJ2RlbnNpdHknLFxuICAnQnVnIFJlcG9ydCc6ICdCdWcgUmVwb3J0JyxcbiAgJ1VzZXIgR3VpZGUnOiAnVXNlciBHdWlkZScsXG4gIFNhdmU6ICdTYXZlJyxcbiAgU2hhcmU6ICdTaGFyZSdcbn07XG4iXX0=