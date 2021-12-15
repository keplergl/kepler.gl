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
    enableElevationZoomFactor: 'Use elevation zoom factor',
    enableElevationZoomFactorDescription: 'Adjust height/elevation based on current zoom factor',
    enableHeightZoomFactor: 'Use height zoom factor',
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
    heightRange: 'Height Range',
    heightMultiplier: 'Height Multiplier'
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
    duplicateLayer: 'Duplicate layer',
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
    '3DMap': '3D Map',
    animationByWindow: 'Moving Time Window',
    animationByIncremental: 'Incremental Time Window',
    speed: 'speed',
    play: 'play',
    pause: 'pause',
    reset: 'reset'
  },
  toolbar: _objectSpread({
    exportImage: 'Export Image',
    exportData: 'Export Data',
    exportMap: 'Export Map',
    shareMapURL: 'Share Map URL',
    saveMap: 'Save Map',
    select: 'Select',
    polygon: 'Polygon',
    rectangle: 'Rectangle',
    hide: 'Hide',
    show: 'Show'
  }, _locales.LOCALES),
  editor: {
    filterLayer: 'Filter Layers',
    copyGeometry: 'Copy Geometry'
  },
  modal: {
    title: {
      deleteDataset: 'Delete Dataset',
      addDataToMap: 'Add Data To Map',
      exportImage: 'Export Image',
      exportData: 'Export Data',
      exportMap: 'Export Map',
      addCustomMapboxStyle: 'Add Custom Map Style',
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
      publishTitle: '2. If entered mapbox stule url in step.1, publish your style at mapbox or provide access token. (Optional)',
      publishSubtitle1: 'You can create your own map style at',
      publishSubtitle2: 'and',
      publishSubtitle3: 'publish',
      publishSubtitle4: 'it.',
      publishSubtitle5: 'To use private style, paste your',
      publishSubtitle6: 'access token',
      publishSubtitle7: 'here. *kepler.gl is a client-side application, data stays in your browser..',
      exampleToken: 'e.g. pk.abcdefg.xxxxxx',
      pasteTitle: '1. Paste style url',
      pasteSubtitle0: 'Style url can be a mapbox',
      pasteSubtitle1: 'What is a',
      pasteSubtitle2: 'style URL',
      pasteSubtitle3: 'or a style.json using the',
      pasteSubtitle4: 'Mapbox GL Style Spec',
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
    token: 'token',
    arc: {
      lat0: 'source lat',
      lng0: 'source lng',
      lat1: 'target lat',
      lng1: 'target lng'
    },
    line: {
      alt0: 'source altitude',
      alt1: 'target altitude'
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
    configUploadMessage: 'Upload {fileFormatNames} or saved map **Json**. Read more about [**supported file formats**]',
    browseFiles: 'browse your files',
    uploading: 'Uploading',
    fileNotSupported: 'File {errorFiles} is not supported.',
    or: 'or'
  },
  geocoder: {
    title: 'Enter an address or coordinates, ex 37.79,-122.40'
  },
  fieldSelector: {
    clearAll: 'Clear All',
    formatting: 'Formatting'
  },
  compare: {
    modeLabel: 'Comparison Mode',
    typeLabel: 'Comparison Type',
    types: {
      absolute: 'Absolute',
      relative: 'Relative'
    }
  },
  mapPopover: {
    primary: 'Primary'
  },
  density: 'density',
  'Bug Report': 'Bug Report',
  'User Guide': 'User Guide',
  Save: 'Save',
  Share: 'Share'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vZW4uanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwiY292ZXJhZ2UiLCJzdHJva2VDb2xvciIsInJhZGl1cyIsIm91dGxpbmUiLCJzdHJva2UiLCJkZW5zaXR5IiwiaGVpZ2h0Iiwic3VtIiwicG9pbnRDb3VudCIsInBsYWNlaG9sZGVyIiwic2VhcmNoIiwic2VsZWN0RmllbGQiLCJ5QXhpcyIsInNlbGVjdFR5cGUiLCJzZWxlY3RWYWx1ZSIsImVudGVyVmFsdWUiLCJlbXB0eSIsIm1pc2MiLCJieSIsInZhbHVlc0luIiwidmFsdWVFcXVhbHMiLCJkYXRhU291cmNlIiwiYnJ1c2hSYWRpdXMiLCJtYXBMYXllcnMiLCJ0aXRsZSIsInJvYWQiLCJib3JkZXIiLCJidWlsZGluZyIsIndhdGVyIiwibGFuZCIsInBhbmVsIiwidGV4dCIsImxhYmVsV2l0aElkIiwiZm9udFNpemUiLCJmb250Q29sb3IiLCJ0ZXh0QW5jaG9yIiwiYWxpZ25tZW50IiwiYWRkTW9yZUxhYmVsIiwic2lkZWJhciIsInBhbmVscyIsImxheWVyIiwiZmlsdGVyIiwiaW50ZXJhY3Rpb24iLCJiYXNlbWFwIiwicmVxdWlyZWQiLCJwcm9wZXJ0eUJhc2VkT24iLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsImFuZ2xlIiwic3Ryb2tlV2lkdGhSYW5nZSIsImZpeGVkUmFkaXVzIiwiZml4ZWRSYWRpdXNEZXNjcmlwdGlvbiIsInJhZGl1c1JhbmdlIiwiY2x1c3RlclJhZGl1cyIsInJhZGl1c1JhbmdlUGl4ZWxzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJzdHJva2VDb2xvclJhbmdlIiwidGFyZ2V0Q29sb3IiLCJjb2xvckFnZ3JlZ2F0aW9uIiwiaGVpZ2h0QWdncmVnYXRpb24iLCJyZXNvbHV0aW9uUmFuZ2UiLCJzaXplU2NhbGUiLCJ3b3JsZFVuaXRTaXplIiwiZWxldmF0aW9uU2NhbGUiLCJlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yIiwiZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvckRlc2NyaXB0aW9uIiwiZW5hYmxlSGVpZ2h0Wm9vbUZhY3RvciIsImhlaWdodFNjYWxlIiwiY292ZXJhZ2VSYW5nZSIsImhpZ2hQcmVjaXNpb25SZW5kZXJpbmciLCJoaWdoUHJlY2lzaW9uUmVuZGVyaW5nRGVzY3JpcHRpb24iLCJoZWlnaHREZXNjcmlwdGlvbiIsImZpbGwiLCJlbmFibGVQb2x5Z29uSGVpZ2h0Iiwic2hvd1dpcmVmcmFtZSIsIndlaWdodEludGVuc2l0eSIsInpvb21TY2FsZSIsImhlaWdodFJhbmdlIiwiaGVpZ2h0TXVsdGlwbGllciIsImxheWVyTWFuYWdlciIsImFkZERhdGEiLCJhZGRMYXllciIsImxheWVyQmxlbmRpbmciLCJtYXBNYW5hZ2VyIiwibWFwU3R5bGUiLCJhZGRNYXBTdHlsZSIsImxheWVyQ29uZmlndXJhdGlvbiIsImRlZmF1bHREZXNjcmlwdGlvbiIsImhvd1RvIiwiZmlsdGVyTWFuYWdlciIsImFkZEZpbHRlciIsImRhdGFzZXRUaXRsZSIsInNob3dEYXRhVGFibGUiLCJyZW1vdmVEYXRhc2V0IiwiZGF0YXNldEluZm8iLCJyb3dDb3VudCIsInRvb2x0aXAiLCJoaWRlTGF5ZXIiLCJzaG93TGF5ZXIiLCJoaWRlRmVhdHVyZSIsInNob3dGZWF0dXJlIiwiaGlkZSIsInNob3ciLCJyZW1vdmVMYXllciIsImR1cGxpY2F0ZUxheWVyIiwibGF5ZXJTZXR0aW5ncyIsImNsb3NlUGFuZWwiLCJzd2l0Y2hUb0R1YWxWaWV3Iiwic2hvd0xlZ2VuZCIsImRpc2FibGUzRE1hcCIsIkRyYXdPbk1hcCIsInNlbGVjdExvY2FsZSIsImhpZGVMYXllclBhbmVsIiwic2hvd0xheWVyUGFuZWwiLCJtb3ZlVG9Ub3AiLCJzZWxlY3RCYXNlTWFwU3R5bGUiLCJ0aW1lUGxheWJhY2siLCJjbG91ZFN0b3JhZ2UiLCJhbmltYXRpb25CeVdpbmRvdyIsImFuaW1hdGlvbkJ5SW5jcmVtZW50YWwiLCJzcGVlZCIsInBsYXkiLCJwYXVzZSIsInJlc2V0IiwidG9vbGJhciIsImV4cG9ydEltYWdlIiwiZXhwb3J0RGF0YSIsImV4cG9ydE1hcCIsInNoYXJlTWFwVVJMIiwic2F2ZU1hcCIsInNlbGVjdCIsInJlY3RhbmdsZSIsIkxPQ0FMRVMiLCJlZGl0b3IiLCJmaWx0ZXJMYXllciIsImNvcHlHZW9tZXRyeSIsIm1vZGFsIiwiZGVsZXRlRGF0YXNldCIsImFkZERhdGFUb01hcCIsImFkZEN1c3RvbU1hcGJveFN0eWxlIiwic2hhcmVVUkwiLCJidXR0b24iLCJkb3dubG9hZCIsImFkZFN0eWxlIiwic2F2ZSIsImRlZmF1bHRDYW5jZWwiLCJkZWZhdWx0Q29uZmlybSIsInJhdGlvVGl0bGUiLCJyYXRpb0Rlc2NyaXB0aW9uIiwicmF0aW9PcmlnaW5hbFNjcmVlbiIsInJhdGlvQ3VzdG9tIiwicmF0aW80XzMiLCJyYXRpbzE2XzkiLCJyZXNvbHV0aW9uVGl0bGUiLCJyZXNvbHV0aW9uRGVzY3JpcHRpb24iLCJtYXBMZWdlbmRUaXRsZSIsIm1hcExlZ2VuZEFkZCIsImRhdGFzZXRTdWJ0aXRsZSIsImFsbERhdGFzZXRzIiwiZGF0YVR5cGVUaXRsZSIsImRhdGFUeXBlU3VidGl0bGUiLCJmaWx0ZXJEYXRhVGl0bGUiLCJmaWx0ZXJEYXRhU3VidGl0bGUiLCJmaWx0ZXJlZERhdGEiLCJ1bmZpbHRlcmVkRGF0YSIsImZpbGVDb3VudCIsImRlbGV0ZURhdGEiLCJ3YXJuaW5nIiwicHVibGlzaFRpdGxlIiwicHVibGlzaFN1YnRpdGxlMSIsInB1Ymxpc2hTdWJ0aXRsZTIiLCJwdWJsaXNoU3VidGl0bGUzIiwicHVibGlzaFN1YnRpdGxlNCIsInB1Ymxpc2hTdWJ0aXRsZTUiLCJwdWJsaXNoU3VidGl0bGU2IiwicHVibGlzaFN1YnRpdGxlNyIsImV4YW1wbGVUb2tlbiIsInBhc3RlVGl0bGUiLCJwYXN0ZVN1YnRpdGxlMCIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJwYXN0ZVN1YnRpdGxlMyIsInBhc3RlU3VidGl0bGU0IiwibmFtaW5nVGl0bGUiLCJzaGFyZU1hcCIsInNoYXJlVXJpVGl0bGUiLCJzaGFyZVVyaVN1YnRpdGxlIiwiY2xvdWRUaXRsZSIsImNsb3VkU3VidGl0bGUiLCJzaGFyZURpc2NsYWltZXIiLCJnb3RvUGFnZSIsInN0YXR1c1BhbmVsIiwibWFwVXBsb2FkaW5nIiwiZXJyb3IiLCJzdWJ0aXRsZSIsImZvcm1hdFRpdGxlIiwiZm9ybWF0U3VidGl0bGUiLCJodG1sIiwic2VsZWN0aW9uIiwidG9rZW5UaXRsZSIsInRva2VuU3VidGl0bGUiLCJ0b2tlblBsYWNlaG9sZGVyIiwidG9rZW5NaXN1c2VXYXJuaW5nIiwidG9rZW5EaXNjbGFpbWVyIiwidG9rZW5VcGRhdGUiLCJtb2RlVGl0bGUiLCJtb2RlU3VidGl0bGUxIiwibW9kZVN1YnRpdGxlMiIsIm1vZGVEZXNjcmlwdGlvbiIsInJlYWQiLCJlZGl0IiwianNvbiIsImNvbmZpZ1RpdGxlIiwiY29uZmlnRGlzY2xhaW1lciIsImRpc2NsYWltZXIiLCJsb2FkaW5nRGlhbG9nIiwibG9hZGluZyIsImxvYWREYXRhIiwidXBsb2FkIiwic3RvcmFnZSIsInRyaXBJbmZvIiwiZGVzY3JpcHRpb24xIiwiY29kZSIsImRlc2NyaXB0aW9uMiIsImV4YW1wbGUiLCJpY29uSW5mbyIsImljb25zIiwic3RvcmFnZU1hcFZpZXdlciIsImxhc3RNb2RpZmllZCIsImJhY2siLCJvdmVyd3JpdGVNYXAiLCJhbHJlYWR5RXhpc3RzIiwibG9hZFN0b3JhZ2VNYXAiLCJnb1RvUGFnZSIsInN0b3JhZ2VNYXBzIiwibm9TYXZlZE1hcHMiLCJoZWFkZXIiLCJ2aXNpYmxlTGF5ZXJzIiwibGF5ZXJMZWdlbmQiLCJpbnRlcmFjdGlvbnMiLCJicnVzaCIsImNvb3JkaW5hdGUiLCJnZW9jb2RlciIsImFkZGl0aXZlIiwibm9ybWFsIiwic3VidHJhY3RpdmUiLCJjb2x1bW5zIiwibGF0IiwibG5nIiwiYWx0aXR1ZGUiLCJ0b2tlbiIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJhbHQwIiwiYWx0MSIsImhleF9pZCIsImN1c3RvbVBhbGV0dGUiLCJzdGVwcyIsInJldmVyc2VkIiwic2NhbGUiLCJjb2xvclNjYWxlIiwic3Ryb2tlU2NhbGUiLCJmaWxlVXBsb2FkZXIiLCJtZXNzYWdlIiwiY2hyb21lTWVzc2FnZSIsImNvbmZpZ1VwbG9hZE1lc3NhZ2UiLCJicm93c2VGaWxlcyIsInVwbG9hZGluZyIsImZpbGVOb3RTdXBwb3J0ZWQiLCJvciIsImZpZWxkU2VsZWN0b3IiLCJjbGVhckFsbCIsImZvcm1hdHRpbmciLCJjb21wYXJlIiwibW9kZUxhYmVsIiwidHlwZUxhYmVsIiwidHlwZXMiLCJhYnNvbHV0ZSIsInJlbGF0aXZlIiwibWFwUG9wb3ZlciIsInByaW1hcnkiLCJTYXZlIiwiU2hhcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7ZUFFZTtBQUNiQSxFQUFBQSxRQUFRLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFLFFBREE7QUFFUkMsSUFBQUEsS0FBSyxFQUFFLE9BRkM7QUFHUkMsSUFBQUEsU0FBUyxFQUFFLFlBSEg7QUFJUkMsSUFBQUEsS0FBSyxFQUFFLE9BSkM7QUFLUkMsSUFBQUEsUUFBUSxFQUFFLFVBTEY7QUFNUkMsSUFBQUEsV0FBVyxFQUFFLGNBTkw7QUFPUkMsSUFBQUEsTUFBTSxFQUFFLFFBUEE7QUFRUkMsSUFBQUEsT0FBTyxFQUFFLFNBUkQ7QUFTUkMs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Q1gsbUZBSFU7QUFJWnBELElBQUFBLFVBQVUsRUFDUiw4R0FDQSxtREFOVTtBQU9acUQsSUFBQUEsbUJBQW1CLEVBQ2pCLDhGQVJVO0FBU1pDLElBQUFBLFdBQVcsRUFBRSxtQkFURDtBQVVaQyxJQUFBQSxTQUFTLEVBQUUsV0FWQztBQVdaQyxJQUFBQSxnQkFBZ0IsRUFBRSxxQ0FYTjtBQVlaQyxJQUFBQSxFQUFFLEVBQUU7QUFaUSxHQXphRDtBQXViYjdCLEVBQUFBLFFBQVEsRUFBRTtBQUNSalAsSUFBQUEsS0FBSyxFQUFFO0FBREMsR0F2Ykc7QUEwYmIrUSxFQUFBQSxhQUFhLEVBQUU7QUFDYkMsSUFBQUEsUUFBUSxFQUFFLFdBREc7QUFFYkMsSUFBQUEsVUFBVSxFQUFFO0FBRkMsR0ExYkY7QUE4YmJDLEVBQUFBLE9BQU8sRUFBRTtBQUNQQyxJQUFBQSxTQUFTLEVBQUUsaUJBREo7QUFFUEMsSUFBQUEsU0FBUyxFQUFFLGlCQUZKO0FBR1BDLElBQUFBLEtBQUssRUFBRTtBQUNMQyxNQUFBQSxRQUFRLEVBQUUsVUFETDtBQUVMQyxNQUFBQSxRQUFRLEVBQUU7QUFGTDtBQUhBLEdBOWJJO0FBc2NiQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsT0FBTyxFQUFFO0FBREMsR0F0Y0M7QUF5Y2I1UyxFQUFBQSxPQUFPLEVBQUUsU0F6Y0k7QUEwY2IsZ0JBQWMsWUExY0Q7QUEyY2IsZ0JBQWMsWUEzY0Q7QUE0Y2I2UyxFQUFBQSxJQUFJLEVBQUUsTUE1Y087QUE2Y2JDLEVBQUFBLEtBQUssRUFBRTtBQTdjTSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtMT0NBTEVTfSBmcm9tICcuL2xvY2FsZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BlcnR5OiB7XG4gICAgd2VpZ2h0OiAnd2VpZ2h0JyxcbiAgICBsYWJlbDogJ2xhYmVsJyxcbiAgICBmaWxsQ29sb3I6ICdmaWxsIGNvbG9yJyxcbiAgICBjb2xvcjogJ2NvbG9yJyxcbiAgICBjb3ZlcmFnZTogJ2NvdmVyYWdlJyxcbiAgICBzdHJva2VDb2xvcjogJ3N0cm9rZSBjb2xvcicsXG4gICAgcmFkaXVzOiAncmFkaXVzJyxcbiAgICBvdXRsaW5lOiAnb3V0bGluZScsXG4gICAgc3Ryb2tlOiAnc3Ryb2tlJyxcbiAgICBkZW5zaXR5OiAnZGVuc2l0eScsXG4gICAgaGVpZ2h0OiAnaGVpZ2h0JyxcbiAgICBzdW06ICdzdW0nLFxuICAgIHBvaW50Q291bnQ6ICdQb2ludCBDb3VudCdcbiAgfSxcbiAgcGxhY2Vob2xkZXI6IHtcbiAgICBzZWFyY2g6ICdTZWFyY2gnLFxuICAgIHNlbGVjdEZpZWxkOiAnU2VsZWN0IGEgZmllbGQnLFxuICAgIHlBeGlzOiAnWSBBeGlzJyxcbiAgICBzZWxlY3RUeXBlOiAnU2VsZWN0IEEgVHlwZScsXG4gICAgc2VsZWN0VmFsdWU6ICdTZWxlY3QgQSBWYWx1ZScsXG4gICAgZW50ZXJWYWx1ZTogJ0VudGVyIGEgdmFsdWUnLFxuICAgIGVtcHR5OiAnZW1wdHknXG4gIH0sXG4gIG1pc2M6IHtcbiAgICBieTogJycsXG4gICAgdmFsdWVzSW46ICdWYWx1ZXMgaW4nLFxuICAgIHZhbHVlRXF1YWxzOiAnVmFsdWUgZXF1YWxzJyxcbiAgICBkYXRhU291cmNlOiAnRGF0YSBTb3VyY2UnLFxuICAgIGJydXNoUmFkaXVzOiAnQnJ1c2ggUmFkaXVzIChrbSknLFxuICAgIGVtcHR5OiAnICdcbiAgfSxcbiAgbWFwTGF5ZXJzOiB7XG4gICAgdGl0bGU6ICdNYXAgTGF5ZXJzJyxcbiAgICBsYWJlbDogJ0xhYmVsJyxcbiAgICByb2FkOiAnUm9hZCcsXG4gICAgYm9yZGVyOiAnQm9yZGVyJyxcbiAgICBidWlsZGluZzogJ0J1aWxkaW5nJyxcbiAgICB3YXRlcjogJ1dhdGVyJyxcbiAgICBsYW5kOiAnTGFuZCcsXG4gICAgJzNkQnVpbGRpbmcnOiAnM2QgQnVpbGRpbmcnXG4gIH0sXG4gIHBhbmVsOiB7XG4gICAgdGV4dDoge1xuICAgICAgbGFiZWw6ICdsYWJlbCcsXG4gICAgICBsYWJlbFdpdGhJZDogJ0xhYmVsIHtsYWJlbElkfScsXG4gICAgICBmb250U2l6ZTogJ0ZvbnQgc2l6ZScsXG4gICAgICBmb250Q29sb3I6ICdGb250IGNvbG9yJyxcbiAgICAgIHRleHRBbmNob3I6ICdUZXh0IGFuY2hvcicsXG4gICAgICBhbGlnbm1lbnQ6ICdBbGlnbm1lbnQnLFxuICAgICAgYWRkTW9yZUxhYmVsOiAnQWRkIE1vcmUgTGFiZWwnXG4gICAgfVxuICB9LFxuICBzaWRlYmFyOiB7XG4gICAgcGFuZWxzOiB7XG4gICAgICBsYXllcjogJ0xheWVycycsXG4gICAgICBmaWx0ZXI6ICdGaWx0ZXJzJyxcbiAgICAgIGludGVyYWN0aW9uOiAnSW50ZXJhY3Rpb25zJyxcbiAgICAgIGJhc2VtYXA6ICdCYXNlIG1hcCdcbiAgICB9XG4gIH0sXG4gIGxheWVyOiB7XG4gICAgcmVxdWlyZWQ6ICdSZXF1aXJlZConLFxuICAgIHJhZGl1czogJ1JhZGl1cycsXG4gICAgY29sb3I6ICdDb2xvcicsXG4gICAgZmlsbENvbG9yOiAnRmlsbCBDb2xvcicsXG4gICAgb3V0bGluZTogJ091dGxpbmUnLFxuICAgIHdlaWdodDogJ1dlaWdodCcsXG4gICAgcHJvcGVydHlCYXNlZE9uOiAne3Byb3BlcnR5fSBiYXNlZCBvbicsXG4gICAgY292ZXJhZ2U6ICdDb3ZlcmFnZScsXG4gICAgc3Ryb2tlOiAnU3Ryb2tlJyxcbiAgICBzdHJva2VXaWR0aDogJ1N0cm9rZSBXaWR0aCcsXG4gICAgc3Ryb2tlQ29sb3I6ICdTdHJva2UgQ29sb3InLFxuICAgIGJhc2ljOiAnQmFzaWMnLFxuICAgIHRyYWlsTGVuZ3RoOiAnVHJhaWwgTGVuZ3RoJyxcbiAgICB0cmFpbExlbmd0aERlc2NyaXB0aW9uOiAnTnVtYmVyIG9mIHNlY29uZHMgZm9yIGEgcGF0aCB0byBjb21wbGV0ZWx5IGZhZGUgb3V0JyxcbiAgICBuZXdMYXllcjogJ25ldyBsYXllcicsXG4gICAgZWxldmF0aW9uQnlEZXNjcmlwdGlvbjogJ1doZW4gb2ZmLCBoZWlnaHQgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJyxcbiAgICBjb2xvckJ5RGVzY3JpcHRpb246ICdXaGVuIG9mZiwgY29sb3IgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJyxcbiAgICBhZ2dyZWdhdGVCeTogJ0FnZ3JlZ2F0ZSB7ZmllbGR9IGJ5JyxcbiAgICAnM0RNb2RlbCc6ICczRCBNb2RlbCcsXG4gICAgJzNETW9kZWxPcHRpb25zJzogJzNEIE1vZGVsIE9wdGlvbnMnLFxuICAgIHR5cGU6IHtcbiAgICAgIHBvaW50OiAncG9pbnQnLFxuICAgICAgYXJjOiAnYXJjJyxcbiAgICAgIGxpbmU6ICdsaW5lJyxcbiAgICAgIGdyaWQ6ICdncmlkJyxcbiAgICAgIGhleGJpbjogJ2hleGJpbicsXG4gICAgICBwb2x5Z29uOiAncG9seWdvbicsXG4gICAgICBnZW9qc29uOiAnZ2VvanNvbicsXG4gICAgICBjbHVzdGVyOiAnY2x1c3RlcicsXG4gICAgICBpY29uOiAnaWNvbicsXG4gICAgICBoZWF0bWFwOiAnaGVhdG1hcCcsXG4gICAgICBoZXhhZ29uOiAnaGV4YWdvbicsXG4gICAgICBoZXhhZ29uaWQ6ICdIMycsXG4gICAgICB0cmlwOiAndHJpcCcsXG4gICAgICBzMjogJ1MyJyxcbiAgICAgICczZCc6ICczRCdcbiAgICB9XG4gIH0sXG4gIGxheWVyVmlzQ29uZmlnczoge1xuICAgIGFuZ2xlOiAnQW5nbGUnLFxuICAgIHN0cm9rZVdpZHRoOiAnU3Ryb2tlIFdpZHRoIChQaXhlbHMpJyxcbiAgICBzdHJva2VXaWR0aFJhbmdlOiAnU3Ryb2tlIFdpZHRoIFJhbmdlJyxcbiAgICByYWRpdXM6ICdSYWRpdXMnLFxuICAgIGZpeGVkUmFkaXVzOiAnRml4ZWQgUmFkaXVzIHRvIG1ldGVyJyxcbiAgICBmaXhlZFJhZGl1c0Rlc2NyaXB0aW9uOiAnTWFwIHJhZGl1cyB0byBhYnNvbHV0ZSByYWRpdXMgaW4gbWV0ZXJzLCBlLmcuIDUgdG8gNSBtZXRlcnMnLFxuICAgIHJhZGl1c1JhbmdlOiAnUmFkaXVzIFJhbmdlJyxcbiAgICBjbHVzdGVyUmFkaXVzOiAnQ2x1c3RlciBSYWRpdXMgaW4gUGl4ZWxzJyxcbiAgICByYWRpdXNSYW5nZVBpeGVsczogJ1JhZGl1cyBSYW5nZSBpbiBwaXhlbHMnLFxuICAgIG9wYWNpdHk6ICdPcGFjaXR5JyxcbiAgICBjb3ZlcmFnZTogJ0NvdmVyYWdlJyxcbiAgICBvdXRsaW5lOiAnT3V0bGluZScsXG4gICAgY29sb3JSYW5nZTogJ0NvbG9yIHJhbmdlJyxcbiAgICBzdHJva2U6ICdTdHJva2UnLFxuICAgIHN0cm9rZUNvbG9yOiAnU3Ryb2tlIENvbG9yJyxcbiAgICBzdHJva2VDb2xvclJhbmdlOiAnU3Ryb2tlIENvbG9yIHJhbmdlJyxcbiAgICB0YXJnZXRDb2xvcjogJ1RhcmdldCBDb2xvcicsXG4gICAgY29sb3JBZ2dyZWdhdGlvbjogJ0NvbG9yIEFnZ3JlZ2F0aW9uJyxcbiAgICBoZWlnaHRBZ2dyZWdhdGlvbjogJ0hlaWdodCBBZ2dyZWdhdGlvbicsXG4gICAgcmVzb2x1dGlvblJhbmdlOiAnUmVzb2x1dGlvbiByYW5nZScsXG4gICAgc2l6ZVNjYWxlOiAnU2l6ZSBTY2FsZScsXG4gICAgd29ybGRVbml0U2l6ZTogJ1dvcmxkIFVuaXQgU2l6ZScsXG4gICAgZWxldmF0aW9uU2NhbGU6ICdFbGV2YXRpb24gU2NhbGUnLFxuICAgIGVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3I6ICdVc2UgZWxldmF0aW9uIHpvb20gZmFjdG9yJyxcbiAgICBlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yRGVzY3JpcHRpb246ICdBZGp1c3QgaGVpZ2h0L2VsZXZhdGlvbiBiYXNlZCBvbiBjdXJyZW50IHpvb20gZmFjdG9yJyxcbiAgICBlbmFibGVIZWlnaHRab29tRmFjdG9yOiAnVXNlIGhlaWdodCB6b29tIGZhY3RvcicsXG4gICAgaGVpZ2h0U2NhbGU6ICdIZWlnaHQgU2NhbGUnLFxuICAgIGNvdmVyYWdlUmFuZ2U6ICdDb3ZlcmFnZSBSYW5nZScsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZzogJ0hpZ2ggUHJlY2lzaW9uIFJlbmRlcmluZycsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZ0Rlc2NyaXB0aW9uOiAnSGlnaCBwcmVjaXNpb24gd2lsbCByZXN1bHQgaW4gc2xvd2VyIHBlcmZvcm1hbmNlJyxcbiAgICBoZWlnaHQ6ICdIZWlnaHQnLFxuICAgIGhlaWdodERlc2NyaXB0aW9uOiAnQ2xpY2sgYnV0dG9uIGF0IHRvcCByaWdodCBvZiB0aGUgbWFwIHRvIHN3aXRjaCB0byAzZCB2aWV3JyxcbiAgICBmaWxsOiAnRmlsbCcsXG4gICAgZW5hYmxlUG9seWdvbkhlaWdodDogJ0VuYWJsZSBQb2x5Z29uIEhlaWdodCcsXG4gICAgc2hvd1dpcmVmcmFtZTogJ1Nob3cgV2lyZWZyYW1lJyxcbiAgICB3ZWlnaHRJbnRlbnNpdHk6ICdXZWlnaHQgSW50ZW5zaXR5JyxcbiAgICB6b29tU2NhbGU6ICdab29tIFNjYWxlJyxcbiAgICBoZWlnaHRSYW5nZTogJ0hlaWdodCBSYW5nZScsXG4gICAgaGVpZ2h0TXVsdGlwbGllcjogJ0hlaWdodCBNdWx0aXBsaWVyJ1xuICB9LFxuICBsYXllck1hbmFnZXI6IHtcbiAgICBhZGREYXRhOiAnQWRkIERhdGEnLFxuICAgIGFkZExheWVyOiAnQWRkIExheWVyJyxcbiAgICBsYXllckJsZW5kaW5nOiAnTGF5ZXIgQmxlbmRpbmcnXG4gIH0sXG4gIG1hcE1hbmFnZXI6IHtcbiAgICBtYXBTdHlsZTogJ01hcCBzdHlsZScsXG4gICAgYWRkTWFwU3R5bGU6ICdBZGQgTWFwIFN0eWxlJyxcbiAgICAnM2RCdWlsZGluZ0NvbG9yJzogJzNEIEJ1aWxkaW5nIENvbG9yJ1xuICB9LFxuICBsYXllckNvbmZpZ3VyYXRpb246IHtcbiAgICBkZWZhdWx0RGVzY3JpcHRpb246ICdDYWxjdWxhdGUge3Byb3BlcnR5fSBiYXNlZCBvbiBzZWxlY3RlZCBmaWVsZCcsXG4gICAgaG93VG86ICdIb3cgdG8nXG4gIH0sXG4gIGZpbHRlck1hbmFnZXI6IHtcbiAgICBhZGRGaWx0ZXI6ICdBZGQgRmlsdGVyJ1xuICB9LFxuICBkYXRhc2V0VGl0bGU6IHtcbiAgICBzaG93RGF0YVRhYmxlOiAnU2hvdyBkYXRhIHRhYmxlJyxcbiAgICByZW1vdmVEYXRhc2V0OiAnUmVtb3ZlIGRhdGFzZXQnXG4gIH0sXG4gIGRhdGFzZXRJbmZvOiB7XG4gICAgcm93Q291bnQ6ICd7cm93Q291bnR9IHJvd3MnXG4gIH0sXG4gIHRvb2x0aXA6IHtcbiAgICBoaWRlTGF5ZXI6ICdoaWRlIGxheWVyJyxcbiAgICBzaG93TGF5ZXI6ICdzaG93IGxheWVyJyxcbiAgICBoaWRlRmVhdHVyZTogJ0hpZGUgRmVhdHVyZScsXG4gICAgc2hvd0ZlYXR1cmU6ICdTaG93IGZlYXR1cmUnLFxuICAgIGhpZGU6ICdoaWRlJyxcbiAgICBzaG93OiAnc2hvdycsXG4gICAgcmVtb3ZlTGF5ZXI6ICdSZW1vdmUgbGF5ZXInLFxuICAgIGR1cGxpY2F0ZUxheWVyOiAnRHVwbGljYXRlIGxheWVyJyxcbiAgICBsYXllclNldHRpbmdzOiAnTGF5ZXIgc2V0dGluZ3MnLFxuICAgIGNsb3NlUGFuZWw6ICdDbG9zZSBjdXJyZW50IHBhbmVsJyxcbiAgICBzd2l0Y2hUb0R1YWxWaWV3OiAnU3dpdGNoIHRvIGR1YWwgbWFwIHZpZXcnLFxuICAgIHNob3dMZWdlbmQ6ICdzaG93IGxlZ2VuZCcsXG4gICAgZGlzYWJsZTNETWFwOiAnRGlzYWJsZSAzRCBNYXAnLFxuICAgIERyYXdPbk1hcDogJ0RyYXcgb24gbWFwJyxcbiAgICBzZWxlY3RMb2NhbGU6ICdTZWxlY3QgbG9jYWxlJyxcbiAgICBoaWRlTGF5ZXJQYW5lbDogJ0hpZGUgbGF5ZXIgcGFuZWwnLFxuICAgIHNob3dMYXllclBhbmVsOiAnU2hvdyBsYXllciBwYW5lbCcsXG4gICAgbW92ZVRvVG9wOiAnTW92ZSB0byB0b3Agb2YgZGF0YSBsYXllcnMnLFxuICAgIHNlbGVjdEJhc2VNYXBTdHlsZTogJ1NlbGVjdCBCYXNlIE1hcCBTdHlsZScsXG4gICAgZGVsZXRlOiAnRGVsZXRlJyxcbiAgICB0aW1lUGxheWJhY2s6ICdUaW1lIFBsYXliYWNrJyxcbiAgICBjbG91ZFN0b3JhZ2U6ICdDbG91ZCBTdG9yYWdlJyxcbiAgICAnM0RNYXAnOiAnM0QgTWFwJyxcbiAgICBhbmltYXRpb25CeVdpbmRvdzogJ01vdmluZyBUaW1lIFdpbmRvdycsXG4gICAgYW5pbWF0aW9uQnlJbmNyZW1lbnRhbDogJ0luY3JlbWVudGFsIFRpbWUgV2luZG93JyxcbiAgICBzcGVlZDogJ3NwZWVkJyxcbiAgICBwbGF5OiAncGxheScsXG4gICAgcGF1c2U6ICdwYXVzZScsXG4gICAgcmVzZXQ6ICdyZXNldCdcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0IEltYWdlJyxcbiAgICBleHBvcnREYXRhOiAnRXhwb3J0IERhdGEnLFxuICAgIGV4cG9ydE1hcDogJ0V4cG9ydCBNYXAnLFxuICAgIHNoYXJlTWFwVVJMOiAnU2hhcmUgTWFwIFVSTCcsXG4gICAgc2F2ZU1hcDogJ1NhdmUgTWFwJyxcbiAgICBzZWxlY3Q6ICdTZWxlY3QnLFxuICAgIHBvbHlnb246ICdQb2x5Z29uJyxcbiAgICByZWN0YW5nbGU6ICdSZWN0YW5nbGUnLFxuICAgIGhpZGU6ICdIaWRlJyxcbiAgICBzaG93OiAnU2hvdycsXG4gICAgLi4uTE9DQUxFU1xuICB9LFxuICBlZGl0b3I6IHtcbiAgICBmaWx0ZXJMYXllcjogJ0ZpbHRlciBMYXllcnMnLFxuICAgIGNvcHlHZW9tZXRyeTogJ0NvcHkgR2VvbWV0cnknXG4gIH0sXG5cbiAgbW9kYWw6IHtcbiAgICB0aXRsZToge1xuICAgICAgZGVsZXRlRGF0YXNldDogJ0RlbGV0ZSBEYXRhc2V0JyxcbiAgICAgIGFkZERhdGFUb01hcDogJ0FkZCBEYXRhIFRvIE1hcCcsXG4gICAgICBleHBvcnRJbWFnZTogJ0V4cG9ydCBJbWFnZScsXG4gICAgICBleHBvcnREYXRhOiAnRXhwb3J0IERhdGEnLFxuICAgICAgZXhwb3J0TWFwOiAnRXhwb3J0IE1hcCcsXG4gICAgICBhZGRDdXN0b21NYXBib3hTdHlsZTogJ0FkZCBDdXN0b20gTWFwIFN0eWxlJyxcbiAgICAgIHNhdmVNYXA6ICdTYXZlIE1hcCcsXG4gICAgICBzaGFyZVVSTDogJ1NoYXJlIFVSTCdcbiAgICB9LFxuICAgIGJ1dHRvbjoge1xuICAgICAgZGVsZXRlOiAnRGVsZXRlJyxcbiAgICAgIGRvd25sb2FkOiAnRG93bmxvYWQnLFxuICAgICAgZXhwb3J0OiAnRXhwb3J0JyxcbiAgICAgIGFkZFN0eWxlOiAnQWRkIFN0eWxlJyxcbiAgICAgIHNhdmU6ICdTYXZlJyxcbiAgICAgIGRlZmF1bHRDYW5jZWw6ICdDYW5jZWwnLFxuICAgICAgZGVmYXVsdENvbmZpcm06ICdDb25maXJtJ1xuICAgIH0sXG4gICAgZXhwb3J0SW1hZ2U6IHtcbiAgICAgIHJhdGlvVGl0bGU6ICdSYXRpbycsXG4gICAgICByYXRpb0Rlc2NyaXB0aW9uOiAnQ2hvb3NlIHRoZSByYXRpbyBmb3IgdmFyaW91cyB1c2FnZXMuJyxcbiAgICAgIHJhdGlvT3JpZ2luYWxTY3JlZW46ICdPcmlnaW5hbCBTY3JlZW4nLFxuICAgICAgcmF0aW9DdXN0b206ICdDdXN0b20nLFxuICAgICAgcmF0aW80XzM6ICc0OjMnLFxuICAgICAgcmF0aW8xNl85OiAnMTY6OScsXG4gICAgICByZXNvbHV0aW9uVGl0bGU6ICdSZXNvbHV0aW9uJyxcbiAgICAgIHJlc29sdXRpb25EZXNjcmlwdGlvbjogJ0hpZ2ggcmVzb2x1dGlvbiBpcyBiZXR0ZXIgZm9yIHByaW50cy4nLFxuICAgICAgbWFwTGVnZW5kVGl0bGU6ICdNYXAgTGVnZW5kJyxcbiAgICAgIG1hcExlZ2VuZEFkZDogJ0FkZCBsZWdlbmQgb24gbWFwJ1xuICAgIH0sXG4gICAgZXhwb3J0RGF0YToge1xuICAgICAgZGF0YXNldFRpdGxlOiAnRGF0YXNldCcsXG4gICAgICBkYXRhc2V0U3VidGl0bGU6ICdDaG9vc2UgdGhlIGRhdGFzZXRzIHlvdSB3YW50IHRvIGV4cG9ydCcsXG4gICAgICBhbGxEYXRhc2V0czogJ0FsbCcsXG4gICAgICBkYXRhVHlwZVRpdGxlOiAnRGF0YSBUeXBlJyxcbiAgICAgIGRhdGFUeXBlU3VidGl0bGU6ICdDaG9vc2UgdGhlIHR5cGUgb2YgZGF0YSB5b3Ugd2FudCB0byBleHBvcnQnLFxuICAgICAgZmlsdGVyRGF0YVRpdGxlOiAnRmlsdGVyIERhdGEnLFxuICAgICAgZmlsdGVyRGF0YVN1YnRpdGxlOiAnWW91IGNhbiBjaG9vc2UgZXhwb3J0aW5nIG9yaWdpbmFsIGRhdGEgb3IgZmlsdGVyZWQgZGF0YScsXG4gICAgICBmaWx0ZXJlZERhdGE6ICdGaWx0ZXJlZCBkYXRhJyxcbiAgICAgIHVuZmlsdGVyZWREYXRhOiAnVW5maWx0ZXJlZCBEYXRhJyxcbiAgICAgIGZpbGVDb3VudDogJ3tmaWxlQ291bnR9IEZpbGVzJyxcbiAgICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSBSb3dzJ1xuICAgIH0sXG4gICAgZGVsZXRlRGF0YToge1xuICAgICAgd2FybmluZzogJ3lvdSBhcmUgZ29pbmcgdG8gZGVsZXRlIHRoaXMgZGF0YXNldC4gSXQgd2lsbCBhZmZlY3Qge2xlbmd0aH0gbGF5ZXJzJ1xuICAgIH0sXG4gICAgYWRkU3R5bGU6IHtcbiAgICAgIHB1Ymxpc2hUaXRsZTpcbiAgICAgICAgJzIuIElmIGVudGVyZWQgbWFwYm94IHN0dWxlIHVybCBpbiBzdGVwLjEsIHB1Ymxpc2ggeW91ciBzdHlsZSBhdCBtYXBib3ggb3IgcHJvdmlkZSBhY2Nlc3MgdG9rZW4uIChPcHRpb25hbCknLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMTogJ1lvdSBjYW4gY3JlYXRlIHlvdXIgb3duIG1hcCBzdHlsZSBhdCcsXG4gICAgICBwdWJsaXNoU3VidGl0bGUyOiAnYW5kJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTM6ICdwdWJsaXNoJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTQ6ICdpdC4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNTogJ1RvIHVzZSBwcml2YXRlIHN0eWxlLCBwYXN0ZSB5b3VyJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTY6ICdhY2Nlc3MgdG9rZW4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNzpcbiAgICAgICAgJ2hlcmUuICprZXBsZXIuZ2wgaXMgYSBjbGllbnQtc2lkZSBhcHBsaWNhdGlvbiwgZGF0YSBzdGF5cyBpbiB5b3VyIGJyb3dzZXIuLicsXG4gICAgICBleGFtcGxlVG9rZW46ICdlLmcuIHBrLmFiY2RlZmcueHh4eHh4JyxcbiAgICAgIHBhc3RlVGl0bGU6ICcxLiBQYXN0ZSBzdHlsZSB1cmwnLFxuICAgICAgcGFzdGVTdWJ0aXRsZTA6ICdTdHlsZSB1cmwgY2FuIGJlIGEgbWFwYm94JyxcbiAgICAgIHBhc3RlU3VidGl0bGUxOiAnV2hhdCBpcyBhJyxcbiAgICAgIHBhc3RlU3VidGl0bGUyOiAnc3R5bGUgVVJMJyxcbiAgICAgIHBhc3RlU3VidGl0bGUzOiAnb3IgYSBzdHlsZS5qc29uIHVzaW5nIHRoZScsXG4gICAgICBwYXN0ZVN1YnRpdGxlNDogJ01hcGJveCBHTCBTdHlsZSBTcGVjJyxcbiAgICAgIG5hbWluZ1RpdGxlOiAnMy4gTmFtZSB5b3VyIHN0eWxlJ1xuICAgIH0sXG4gICAgc2hhcmVNYXA6IHtcbiAgICAgIHNoYXJlVXJpVGl0bGU6ICdTaGFyZSBNYXAgVXJsJyxcbiAgICAgIHNoYXJlVXJpU3VidGl0bGU6ICdHZW5lcmF0ZSBhIG1hcCB1cmwgdG8gc2hhcmUgd2l0aCBvdGhlcnMnLFxuICAgICAgY2xvdWRUaXRsZTogJ0Nsb3VkIHN0b3JhZ2UnLFxuICAgICAgY2xvdWRTdWJ0aXRsZTogJ0xvZ2luIGFuZCB1cGxvYWQgbWFwIGRhdGEgdG8geW91ciBwZXJzb25hbCBjbG91ZCBzdG9yYWdlJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCB3aWxsIHNhdmUgeW91ciBtYXAgZGF0YSB0byB5b3VyIHBlcnNvbmFsIGNsb3VkIHN0b3JhZ2UsIG9ubHkgcGVvcGxlIHdpdGggdGhlIFVSTCBjYW4gYWNjZXNzIHlvdXIgbWFwIGFuZCBkYXRhLiAnICtcbiAgICAgICAgJ1lvdSBjYW4gZWRpdC9kZWxldGUgdGhlIGRhdGEgZmlsZSBpbiB5b3VyIGNsb3VkIGFjY291bnQgYW55dGltZS4nLFxuICAgICAgZ290b1BhZ2U6ICdHbyB0byB5b3VyIEtlcGxlci5nbCB7Y3VycmVudFByb3ZpZGVyfSBwYWdlJ1xuICAgIH0sXG4gICAgc3RhdHVzUGFuZWw6IHtcbiAgICAgIG1hcFVwbG9hZGluZzogJ01hcCBVcGxvYWRpbmcnLFxuICAgICAgZXJyb3I6ICdFcnJvcidcbiAgICB9LFxuICAgIHNhdmVNYXA6IHtcbiAgICAgIHRpdGxlOiAnQ2xvdWQgc3RvcmFnZScsXG4gICAgICBzdWJ0aXRsZTogJ0xvZ2luIHRvIHNhdmUgbWFwIHRvIHlvdXIgcGVyc29uYWwgY2xvdWQgc3RvcmFnZSdcbiAgICB9LFxuICAgIGV4cG9ydE1hcDoge1xuICAgICAgZm9ybWF0VGl0bGU6ICdNYXAgZm9ybWF0JyxcbiAgICAgIGZvcm1hdFN1YnRpdGxlOiAnQ2hvb3NlIHRoZSBmb3JtYXQgdG8gZXhwb3J0IHlvdXIgbWFwIHRvJyxcbiAgICAgIGh0bWw6IHtcbiAgICAgICAgc2VsZWN0aW9uOiAnRXhwb3J0IHlvdXIgbWFwIGludG8gYW4gaW50ZXJhY3RpdmUgaHRtbCBmaWxlLicsXG4gICAgICAgIHRva2VuVGl0bGU6ICdNYXBib3ggYWNjZXNzIHRva2VuJyxcbiAgICAgICAgdG9rZW5TdWJ0aXRsZTogJ1VzZSB5b3VyIG93biBNYXBib3ggYWNjZXNzIHRva2VuIGluIHRoZSBodG1sIChvcHRpb25hbCknLFxuICAgICAgICB0b2tlblBsYWNlaG9sZGVyOiAnUGFzdGUgeW91ciBNYXBib3ggYWNjZXNzIHRva2VuJyxcbiAgICAgICAgdG9rZW5NaXN1c2VXYXJuaW5nOlxuICAgICAgICAgICcqIElmIHlvdSBkbyBub3QgcHJvdmlkZSB5b3VyIG93biB0b2tlbiwgdGhlIG1hcCBtYXkgZmFpbCB0byBkaXNwbGF5IGF0IGFueSB0aW1lIHdoZW4gd2UgcmVwbGFjZSBvdXJzIHRvIGF2b2lkIG1pc3VzZS4gJyxcbiAgICAgICAgdG9rZW5EaXNjbGFpbWVyOiAnWW91IGNhbiBjaGFuZ2UgdGhlIE1hcGJveCB0b2tlbiBsYXRlciB1c2luZyB0aGUgZm9sbG93aW5nIGluc3RydWN0aW9uczogJyxcbiAgICAgICAgdG9rZW5VcGRhdGU6ICdIb3cgdG8gdXBkYXRlIGFuIGV4aXN0aW5nIG1hcCB0b2tlbi4nLFxuICAgICAgICBtb2RlVGl0bGU6ICdNYXAgTW9kZScsXG4gICAgICAgIG1vZGVTdWJ0aXRsZTE6ICdTZWxlY3QgdGhlIGFwcCBtb2RlLiBNb3JlICcsXG4gICAgICAgIG1vZGVTdWJ0aXRsZTI6ICdpbmZvJyxcbiAgICAgICAgbW9kZURlc2NyaXB0aW9uOiAnQWxsb3cgdXNlcnMgdG8ge21vZGV9IHRoZSBtYXAnLFxuICAgICAgICByZWFkOiAncmVhZCcsXG4gICAgICAgIGVkaXQ6ICdlZGl0J1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgY29uZmlnVGl0bGU6ICdNYXAgQ29uZmlnJyxcbiAgICAgICAgY29uZmlnRGlzY2xhaW1lcjpcbiAgICAgICAgICAnTWFwIGNvbmZpZyB3aWxsIGJlIGluY2x1ZGVkIGluIHRoZSBKc29uIGZpbGUuIElmIHlvdSBhcmUgdXNpbmcga2VwbGVyLmdsIGluIHlvdXIgb3duIGFwcC4gWW91IGNhbiBjb3B5IHRoaXMgY29uZmlnIGFuZCBwYXNzIGl0IHRvICcsXG4gICAgICAgIHNlbGVjdGlvbjpcbiAgICAgICAgICAnRXhwb3J0IGN1cnJlbnQgbWFwIGRhdGEgYW5kIGNvbmZpZyBpbnRvIGEgc2luZ2xlIEpzb24gZmlsZS4gWW91IGNhbiBsYXRlciBvcGVuIHRoZSBzYW1lIG1hcCBieSB1cGxvYWRpbmcgdGhpcyBmaWxlIHRvIGtlcGxlci5nbC4nLFxuICAgICAgICBkaXNjbGFpbWVyOlxuICAgICAgICAgICcqIE1hcCBjb25maWcgaXMgY291cGxlZCB3aXRoIGxvYWRlZCBkYXRhc2V0cy4g4oCYZGF0YUlk4oCZIGlzIHVzZWQgdG8gYmluZCBsYXllcnMsIGZpbHRlcnMsIGFuZCB0b29sdGlwcyB0byBhIHNwZWNpZmljIGRhdGFzZXQuICcgK1xuICAgICAgICAgICdXaGVuIHBhc3NpbmcgdGhpcyBjb25maWcgdG8gYWRkRGF0YVRvTWFwLCBtYWtlIHN1cmUgdGhlIGRhdGFzZXQgaWQgbWF0Y2hlcyB0aGUgZGF0YUlkL3MgaW4gdGhpcyBjb25maWcuJ1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9hZGluZ0RpYWxvZzoge1xuICAgICAgbG9hZGluZzogJ0xvYWRpbmcuLi4nXG4gICAgfSxcbiAgICBsb2FkRGF0YToge1xuICAgICAgdXBsb2FkOiAnTG9hZCBGaWxlcycsXG4gICAgICBzdG9yYWdlOiAnTG9hZCBmcm9tIFN0b3JhZ2UnXG4gICAgfSxcbiAgICB0cmlwSW5mbzoge1xuICAgICAgdGl0bGU6ICdIb3cgdG8gZW5hYmxlIHRyaXAgYW5pbWF0aW9uJyxcbiAgICAgIGRlc2NyaXB0aW9uMTpcbiAgICAgICAgJ0luIG9yZGVyIHRvIGFuaW1hdGUgdGhlIHBhdGgsIHRoZSBnZW9KU09OIGRhdGEgbmVlZHMgdG8gY29udGFpbiBgTGluZVN0cmluZ2AgaW4gaXRzIGZlYXR1cmUgZ2VvbWV0cnksIGFuZCB0aGUgY29vcmRpbmF0ZXMgaW4gdGhlIExpbmVTdHJpbmcgbmVlZCB0byBoYXZlIDQgZWxlbWVudHMgaW4gdGhlIGZvcm1hdHMgb2YnLFxuICAgICAgY29kZTogJyBbbG9uZ2l0dWRlLCBsYXRpdHVkZSwgYWx0aXR1ZGUsIHRpbWVzdGFtcF0gJyxcbiAgICAgIGRlc2NyaXB0aW9uMjpcbiAgICAgICAgJ3dpdGggdGhlIGxhc3QgZWxlbWVudCBiZWluZyBhIHRpbWVzdGFtcC4gVmFsaWQgdGltZXN0YW1wIGZvcm1hdHMgaW5jbHVkZSB1bml4IGluIHNlY29uZHMgc3VjaCBhcyBgMTU2NDE4NDM2M2Agb3IgaW4gbWlsbGlzZWNvbmRzIHN1Y2ggYXMgYDE1NjQxODQzNjMwMDBgLicsXG4gICAgICBleGFtcGxlOiAnRXhhbXBsZTonXG4gICAgfSxcbiAgICBpY29uSW5mbzoge1xuICAgICAgdGl0bGU6ICdIb3cgdG8gZHJhdyBpY29ucycsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdJbiB5b3VyIGNzdiwgY3JlYXRlIGEgY29sdW1uLCBwdXQgdGhlIG5hbWUgb2YgdGhlIGljb24geW91IHdhbnQgdG8gZHJhdyBpbiBpdC4gWW91IGNhbiBsZWF2ZSB0aGUgY2VsbCBlbXB0eSBpZiB5b3UgZG8gbm90IHdhbnQgdGhlIGljb24gdG8gc2hvdyBmb3Igc29tZSBwb2ludHMuIFdoZW4gdGhlIGNvbHVtbiBpcyBuYW1lZCcsXG4gICAgICBjb2RlOiAnaWNvbicsXG4gICAgICBkZXNjcmlwdGlvbjI6ICcga2VwbGVyLmdsIHdpbGwgYXV0b21hdGljYWxseSBjcmVhdGUgYSBpY29uIGxheWVyIGZvciB5b3UuJyxcbiAgICAgIGV4YW1wbGU6ICdFeGFtcGxlOicsXG4gICAgICBpY29uczogJ0ljb25zJ1xuICAgIH0sXG4gICAgc3RvcmFnZU1hcFZpZXdlcjoge1xuICAgICAgbGFzdE1vZGlmaWVkOiAnTGFzdCBtb2RpZmllZCB7bGFzdFVwZGF0ZWR9IGFnbycsXG4gICAgICBiYWNrOiAnQmFjaydcbiAgICB9LFxuICAgIG92ZXJ3cml0ZU1hcDoge1xuICAgICAgdGl0bGU6ICdTYXZpbmcgbWFwLi4uJyxcbiAgICAgIGFscmVhZHlFeGlzdHM6ICdhbHJlYWR5IGV4aXN0cyBpbiB5b3VyIHttYXBTYXZlZH0uIFdvdWxkIHlvdSBsaWtlIHRvIG92ZXJ3cml0ZSBpdD8nXG4gICAgfSxcbiAgICBsb2FkU3RvcmFnZU1hcDoge1xuICAgICAgYmFjazogJ0JhY2snLFxuICAgICAgZ29Ub1BhZ2U6ICdHbyB0byB5b3VyIEtlcGxlci5nbCB7ZGlzcGxheU5hbWV9IHBhZ2UnLFxuICAgICAgc3RvcmFnZU1hcHM6ICdTdG9yYWdlIC8gTWFwcycsXG4gICAgICBub1NhdmVkTWFwczogJ05vIHNhdmVkIG1hcHMgeWV0J1xuICAgIH1cbiAgfSxcbiAgaGVhZGVyOiB7XG4gICAgdmlzaWJsZUxheWVyczogJ1Zpc2libGUgbGF5ZXJzJyxcbiAgICBsYXllckxlZ2VuZDogJ0xheWVyIExlZ2VuZCdcbiAgfSxcbiAgaW50ZXJhY3Rpb25zOiB7XG4gICAgdG9vbHRpcDogJ1Rvb2x0aXAnLFxuICAgIGJydXNoOiAnQnJ1c2gnLFxuICAgIGNvb3JkaW5hdGU6ICdDb29yZGluYXRlcycsXG4gICAgZ2VvY29kZXI6ICdHZW9jb2RlcidcbiAgfSxcbiAgbGF5ZXJCbGVuZGluZzoge1xuICAgIHRpdGxlOiAnTGF5ZXIgQmxlbmRpbmcnLFxuICAgIGFkZGl0aXZlOiAnYWRkaXRpdmUnLFxuICAgIG5vcm1hbDogJ25vcm1hbCcsXG4gICAgc3VidHJhY3RpdmU6ICdzdWJ0cmFjdGl2ZSdcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAnQ29sdW1ucycsXG4gICAgbGF0OiAnbGF0JyxcbiAgICBsbmc6ICdsb24nLFxuICAgIGFsdGl0dWRlOiAnYWx0aXR1ZGUnLFxuICAgIGljb246ICdpY29uJyxcbiAgICBnZW9qc29uOiAnZ2VvanNvbicsXG4gICAgdG9rZW46ICd0b2tlbicsXG4gICAgYXJjOiB7XG4gICAgICBsYXQwOiAnc291cmNlIGxhdCcsXG4gICAgICBsbmcwOiAnc291cmNlIGxuZycsXG4gICAgICBsYXQxOiAndGFyZ2V0IGxhdCcsXG4gICAgICBsbmcxOiAndGFyZ2V0IGxuZydcbiAgICB9LFxuICAgIGxpbmU6IHtcbiAgICAgIGFsdDA6ICdzb3VyY2UgYWx0aXR1ZGUnLFxuICAgICAgYWx0MTogJ3RhcmdldCBhbHRpdHVkZSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIHdvcmxkVW5pdFNpemU6ICdHcmlkIFNpemUgKGttKSdcbiAgICB9LFxuICAgIGhleGFnb246IHtcbiAgICAgIHdvcmxkVW5pdFNpemU6ICdIZXhhZ29uIFJhZGl1cyAoa20pJ1xuICAgIH0sXG4gICAgaGV4X2lkOiAnaGV4IGlkJ1xuICB9LFxuICBjb2xvcjoge1xuICAgIGN1c3RvbVBhbGV0dGU6ICdDdXN0b20gUGFsZXR0ZScsXG4gICAgc3RlcHM6ICdzdGVwcycsXG4gICAgdHlwZTogJ3R5cGUnLFxuICAgIHJldmVyc2VkOiAncmV2ZXJzZWQnXG4gIH0sXG4gIHNjYWxlOiB7XG4gICAgY29sb3JTY2FsZTogJ0NvbG9yIFNjYWxlJyxcbiAgICBzaXplU2NhbGU6ICdTaXplIFNjYWxlJyxcbiAgICBzdHJva2VTY2FsZTogJ1N0cm9rZSBTY2FsZScsXG4gICAgc2NhbGU6ICdTY2FsZSdcbiAgfSxcbiAgZmlsZVVwbG9hZGVyOiB7XG4gICAgbWVzc2FnZTogJ0RyYWcgJiBEcm9wIFlvdXIgRmlsZShzKSBIZXJlJyxcbiAgICBjaHJvbWVNZXNzYWdlOlxuICAgICAgJypDaHJvbWUgdXNlcjogTGltaXQgZmlsZSBzaXplIHRvIDI1MG1iLCBpZiBuZWVkIHRvIHVwbG9hZCBsYXJnZXIgZmlsZSwgdHJ5IFNhZmFyaScsXG4gICAgZGlzY2xhaW1lcjpcbiAgICAgICcqa2VwbGVyLmdsIGlzIGEgY2xpZW50LXNpZGUgYXBwbGljYXRpb24gd2l0aCBubyBzZXJ2ZXIgYmFja2VuZC4gRGF0YSBsaXZlcyBvbmx5IG9uIHlvdXIgbWFjaGluZS9icm93c2VyLiAnICtcbiAgICAgICdObyBpbmZvcm1hdGlvbiBvciBtYXAgZGF0YSBpcyBzZW50IHRvIGFueSBzZXJ2ZXIuJyxcbiAgICBjb25maWdVcGxvYWRNZXNzYWdlOlxuICAgICAgJ1VwbG9hZCB7ZmlsZUZvcm1hdE5hbWVzfSBvciBzYXZlZCBtYXAgKipKc29uKiouIFJlYWQgbW9yZSBhYm91dCBbKipzdXBwb3J0ZWQgZmlsZSBmb3JtYXRzKipdJyxcbiAgICBicm93c2VGaWxlczogJ2Jyb3dzZSB5b3VyIGZpbGVzJyxcbiAgICB1cGxvYWRpbmc6ICdVcGxvYWRpbmcnLFxuICAgIGZpbGVOb3RTdXBwb3J0ZWQ6ICdGaWxlIHtlcnJvckZpbGVzfSBpcyBub3Qgc3VwcG9ydGVkLicsXG4gICAgb3I6ICdvcidcbiAgfSxcbiAgZ2VvY29kZXI6IHtcbiAgICB0aXRsZTogJ0VudGVyIGFuIGFkZHJlc3Mgb3IgY29vcmRpbmF0ZXMsIGV4IDM3Ljc5LC0xMjIuNDAnXG4gIH0sXG4gIGZpZWxkU2VsZWN0b3I6IHtcbiAgICBjbGVhckFsbDogJ0NsZWFyIEFsbCcsXG4gICAgZm9ybWF0dGluZzogJ0Zvcm1hdHRpbmcnXG4gIH0sXG4gIGNvbXBhcmU6IHtcbiAgICBtb2RlTGFiZWw6ICdDb21wYXJpc29uIE1vZGUnLFxuICAgIHR5cGVMYWJlbDogJ0NvbXBhcmlzb24gVHlwZScsXG4gICAgdHlwZXM6IHtcbiAgICAgIGFic29sdXRlOiAnQWJzb2x1dGUnLFxuICAgICAgcmVsYXRpdmU6ICdSZWxhdGl2ZSdcbiAgICB9XG4gIH0sXG4gIG1hcFBvcG92ZXI6IHtcbiAgICBwcmltYXJ5OiAnUHJpbWFyeSdcbiAgfSxcbiAgZGVuc2l0eTogJ2RlbnNpdHknLFxuICAnQnVnIFJlcG9ydCc6ICdCdWcgUmVwb3J0JyxcbiAgJ1VzZXIgR3VpZGUnOiAnVXNlciBHdWlkZScsXG4gIFNhdmU6ICdTYXZlJyxcbiAgU2hhcmU6ICdTaGFyZSdcbn07XG4iXX0=