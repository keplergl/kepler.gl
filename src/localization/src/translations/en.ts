// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LOCALES} from '../locales';

export default {
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
    empty: 'empty',
    selectLayer: 'Select a layer'
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
    '3dBuilding': '3d Building',
    background: 'Background'
  },
  panel: {
    text: {
      label: 'label',
      labelWithId: 'Label {labelId}',
      fontSize: 'Font size',
      fontColor: 'Font color',
      backgroundColor: 'Background color',
      textAnchor: 'Text anchor',
      alignment: 'Alignment',
      addMoreLabel: 'Add More Label',
      outlineWidth: 'Outline width',
      outlineColor: 'Outline color'
    }
  },
  sidebar: {
    panels: {
      layer: 'Layers',
      filter: 'Filters',
      interaction: 'Interactions',
      basemap: 'Base map'
    },
    panelViewToggle: {
      list: 'View List',
      byDataset: 'View by Dataset'
    }
  },
  layer: {
    required: 'Required*',
    columnModesSeparator: 'Or',
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
    },
    layerUpdateError:
      'An error occurred during layer update: {errorMessage}. Make sure the format of the input data is valid.',
    interaction: 'Interaction'
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
    billboard: 'Billboard',
    billboardDescription: 'Orient geometry towards the camera',
    fadeTrail: 'Fade trail',
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
    fixedHeight: 'Fixed height',
    fixedHeightDescription: 'Use height without modifications',
    allowHover: 'Allow Hover',
    showNeighborOnHover: 'Highlight Neighbors On Hover',
    showHighlightColor: 'Show highlight Color',
    heightMultiplier: 'Height Multiplier',
    darkModeEnabled: 'Dark base map'
  },
  layerManager: {
    addData: 'Add Data',
    addLayer: 'Add Layer',
    layerBlending: 'Layer Blending',
    overlayBlending: 'Overlay Blending'
  },
  mapManager: {
    mapStyle: 'Map style',
    addMapStyle: 'Add Map Style',
    '3dBuildingColor': '3D Building Color',
    backgroundColor: 'Background Color'
  },
  effectManager: {
    effects: 'Effects',
    addEffect: 'Add effect',
    pickDateTime: 'Pick date/time',
    currentTime: 'Current time',
    pickCurrrentTime: 'Pick current time',
    date: 'Date',
    time: 'Time',
    timezone: 'Timezone'
  },
  layerConfiguration: {
    defaultDescription: 'Calculate {property} based on selected field',
    howTo: 'How to',
    showColorChart: 'Show Color Chart',
    hideColorChart: 'Hide Color Chart'
  },
  filterManager: {
    addFilter: 'Add Filter',
    timeFilterSync: 'Synced datasets',
    timeLayerSync: 'Link with the layer timeline',
    timeLayerUnsync: 'Unlink with the layer timeline',
    column: 'Column'
  },
  datasetTitle: {
    showDataTable: 'Show data table',
    removeDataset: 'Remove dataset'
  },
  datasetInfo: {
    rowCount: '{rowCount} rows'
  },
  tooltip: {
    hideLayer: 'Hide layer',
    showLayer: 'Show layer',
    hideFeature: 'Hide feature',
    showFeature: 'Show feature',
    hide: 'hide',
    show: 'show',
    removeLayer: 'Remove layer',
    duplicateLayer: 'Duplicate layer',
    zoomToLayer: 'Zoom to layer',
    resetAfterError: 'Try to enable the layer after an error',
    layerSettings: 'Layer settings',
    closePanel: 'Close current panel',
    switchToDualView: 'Switch to dual map view',
    showLegend: 'Show legend',
    disable3DMap: 'Disable 3D Map',
    DrawOnMap: 'Draw on map',
    selectLocale: 'Select locale',
    hideLayerPanel: 'Hide layer panel',
    showLayerPanel: 'Show layer panel',
    moveToTop: 'Move to top of data layers',
    selectBaseMapStyle: 'Select base map style',
    removeBaseMapStyle: 'Remove base map style',
    delete: 'Delete',
    timePlayback: 'Time Playback',
    timeFilterSync: 'Sync with a column from another dataset',
    cloudStorage: 'Cloud Storage',
    '3DMap': '3D Map',
    animationByWindow: 'Moving Time Window',
    animationByIncremental: 'Incremental Time Window',
    speed: 'speed',
    play: 'play',
    pause: 'pause',
    reset: 'reset',
    export: 'export',
    timeLayerSync: 'Link with the layer timeline',
    timeLayerUnsync: 'Unlink with the layer timeline',
    syncTimelineStart: 'Start of current filter timeframe',
    syncTimelineEnd: 'End of current filter timeframe',
    showEffectPanel: 'Show effect panel',
    hideEffectPanel: 'Hide effect panel',
    removeEffect: 'Remove effect',
    disableEffect: 'Disable effect',
    effectSettings: 'Effect settings'
  },
  toolbar: {
    exportImage: 'Export Image',
    exportData: 'Export Data',
    exportMap: 'Export Map',
    shareMapURL: 'Share Map URL',
    saveMap: 'Save Map',
    select: 'Select',
    polygon: 'Polygon',
    rectangle: 'Rectangle',
    hide: 'Hide',
    show: 'Show',
    ...LOCALES
  },
  editor: {
    filterLayer: 'Filter Layers',
    filterLayerDisabled: 'Non-polygon geometries cannot be used for filtering',
    copyGeometry: 'Copy Geometry',
    noLayersToFilter: 'No layers to filter'
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
      delete: 'Delete',
      download: 'Download',
      export: 'Export',
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
      publishTitle:
        '2. If entered mapbox style url in step.1, publish your style at mapbox or provide access token. (Optional)',
      publishSubtitle1: 'You can create your own map style at',
      publishSubtitle2: 'and',
      publishSubtitle3: 'publish',
      publishSubtitle4: 'it.',
      publishSubtitle5: 'To use private style, paste your',
      publishSubtitle6: 'access token',
      publishSubtitle7:
        'here. *kepler.gl is a client-side application, data stays in your browser..',
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
      title: 'Share Map',
      shareUriTitle: 'Share Map Url',
      shareUriSubtitle: 'Generate a map url to share with others',
      cloudTitle: 'Cloud storage',
      cloudSubtitle: 'Login and upload map data to your personal cloud storage',
      shareDisclaimer:
        'kepler.gl will save your map data to your personal cloud storage, only people with the URL can access your map and data. ' +
        'You can edit/delete the data file in your cloud account anytime.',
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
        tokenMisuseWarning:
          '* If you do not provide your own token, the map may fail to display at any time when we replace ours to avoid misuse. ',
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
        configDisclaimer:
          'Map config will be included in the Json file. If you are using kepler.gl in your own app. You can copy this config and pass it to ',
        selection:
          'Export current map data and config into a single Json file. You can later open the same map by uploading this file to kepler.gl.',
        disclaimer:
          '* Map config is coupled with loaded datasets. ‘dataId’ is used to bind layers, filters, and tooltips to a specific dataset. ' +
          'When passing this config to addDataToMap, make sure the dataset id matches the dataId/s in this config.'
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
      title: 'Create trips from GeoJson',
      titleTable: 'Create trips from a list of points',
      description1: `To animate the path, the GeoJSON data needs to contain \`LineString\` in its feature geometry, and the coordinates in the LineString need to have 4 elements in the formats of
${'```json'}
[longitude, latitude, altitude, timestamp]
${'```'}
The 3rd element is a timestamp. Valid timestamp formats include unix in seconds such as \`1564184363\` or in milliseconds such as \`1564184363000\`.`,
      descriptionTable1:
        'Trips can be created by joining a list of points from latitude and longitude, sort by timestamps and group by uniq ids.',
      example: 'Example GeoJSON',
      exampleTable: 'Example Csv'
    },
    polygonInfo: {
      title: 'Create polygon layer from GeoJSON feature',
      titleTable: 'Create path from points',
      description: `Polygon can be created from
__1 .A GeoJSON Feature Collection__
__2. A Csv contains geometry column__

### 1. Create polygon from GeoJSON file

When upload a GeoJSON file contains FeatureCollection, a polygon layer will be auto-created

Example GeoJSON
${'```json'}
{
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
          "type": "Point",
          "coordinates": [102.0, 0.5]
      },
      "properties": {
          "prop0": "value0"
      }
  }, {
      "type": "Feature",
      "geometry": {
          "type": "LineString",
          "coordinates": [
              [102.0, 0.0],
              [103.0, 1.0],
              [104.0, 0.0],
              [105.0, 1.0]
          ]
      },
      "properties": {
        "prop0": "value0"
      }
  }]
}
${'```'}

### 2. Create polygon from a Geometry column in Csv table
Geometries (Polygons, Points, LindStrings etc) can be embedded into CSV as a \`GeoJSON\` or \`WKT\` formatted string. 

#### 2.1 \`GeoJSON\` string
Example data.csv with \`GeoJSON\` string
${'```txt'}
id,_geojson
1,"{""type"":""Polygon"",""coordinates"":[[[-74.158491,40.835947],[-74.157914,40.83902]]]}"
${'```'}

#### 2.2 \`WKT\` string
Example data.csv with \`WKT\` string
[The Well-Known Text (WKT)](https://dev.mysql.com/doc/refman/5.7/en/gis-data-formats.html#gis-wkt-format) representation of geometry values is designed for exchanging geometry data in ASCII form. 

Example data.csv with WKT
${'```txt'}
id,_geojson
1,"POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))"
${'```'}
`,
      descriptionTable: `Paths can be created by joining a list of points from latitude and longitude, sort by an index field (e.g. timestamp) and group by uniq ids.

  ### Layer columns:
  - **id**: - *required* - A \`id\` column is used to group by points. Points with the same id will be joined into a single path.
  - **lat**: - *required* - The latitude of the point
  - **lon**: - *required* - The longitude of the point
  - **alt**: - *optional* - The altitude of the point
  - **sort by**: - *optional* - A \`sort by\` column is used to sort the points, if not specified, points will be sorted by row index.
`,
      exampleTable: 'Example CSV'
    },
    iconInfo: {
      title: 'How to draw icons',
      description1:
        'In your csv, create a column, put the name of the icon you want to draw in it. You can leave the cell empty if you do not want the icon to show for some points. When the column is named',
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
    layerLegend: 'Legend'
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
  overlayBlending: {
    title: 'Map overlay blending',
    description: 'Blend layers with the base map so that both are visible.',
    screen: 'dark base map',
    normal: 'normal',
    darken: 'light base map'
  },
  columns: {
    title: 'Columns',
    lat: 'lat',
    lng: 'lng',
    altitude: 'altitude',
    alt: 'altitude',
    id: 'id',
    timestamp: 'time',
    icon: 'icon',
    geojson: 'geojson',
    geoarrow: 'geoarrow',
    geoarrow0: 'geoarrow source',
    geoarrow1: 'geoarrow target',
    token: 'token',
    sortBy: 'sort by',
    neighbors: 'neighbors',
    arc: {
      lat0: 'source lat or hex id',
      lng0: 'source lng or hex id',
      lat1: 'target lat or hex id',
      lng1: 'target lng or hex id'
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
    reversed: 'reversed',
    opacity: 'Opacity',
    disableStepReason: `Can't change number of steps with custom color breaks, use custom palette to edit steps`,
    preset: 'Preset Colors',
    picker: 'Color Picker'
  },
  scale: {
    colorScale: 'Color Scale',
    sizeScale: 'Size Scale',
    strokeScale: 'Stroke Scale',
    strokeColorScale: 'Stroke Color Scale',
    scale: 'Scale'
  },
  fileUploader: {
    message: 'Drag & Drop Your File(s) Here',
    chromeMessage:
      '*Chrome user: Limit file size to 250mb, if need to upload larger file, try Safari',
    disclaimer:
      '*kepler.gl is a client-side application with no server backend. Data lives only on your machine/browser. ' +
      'No information or map data is sent to any server.',
    configUploadMessage:
      'Upload {fileFormatNames} or saved map **Json**. Read more about [**supported file formats**]',
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
