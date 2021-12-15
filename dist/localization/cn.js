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
    weight: '权重',
    label: '标签',
    fillColor: '填充色',
    color: '颜色',
    coverage: '覆盖范围',
    strokeColor: '线条颜色',
    radius: '半径',
    outline: '轮廓线',
    stroke: '线条粗细',
    density: '密度',
    height: '高度',
    sum: '总和',
    pointCount: '点数'
  },
  placeholder: {
    search: '搜索',
    selectField: '选择区域',
    yAxis: 'Y轴',
    selectType: '选择类型',
    selectValue: '选择值',
    enterValue: '输入值',
    empty: '未选择'
  },
  misc: {
    by: '',
    valuesIn: '值包含',
    valueEquals: '值等于',
    dataSource: '数据源',
    brushRadius: '画笔半径 (km)',
    empty: ' '
  },
  mapLayers: {
    title: '图层',
    label: '标签',
    road: '道路',
    border: '边界线',
    building: '建筑物',
    water: '水',
    land: '地面',
    '3dBuilding': '3D建筑'
  },
  panel: {
    text: {
      label: '标签',
      labelWithId: '标签 {labelId}',
      fontSize: '字体大小',
      fontColor: '字体颜色',
      textAnchor: '文本锚',
      alignment: '对齐方式',
      addMoreLabel: '添加更多标签'
    }
  },
  sidebar: {
    panels: {
      layer: '层',
      filter: '过滤器',
      interaction: '交互',
      basemap: '底图'
    }
  },
  layer: {
    required: '必填*',
    radius: '半径',
    color: '颜色',
    fillColor: '填充色',
    outline: '轮廓线',
    weight: '权重',
    propertyBasedOn: '{property}的基准',
    coverage: '覆盖范围',
    stroke: '线条粗细',
    strokeWidth: '线条宽度',
    strokeColor: '线条颜色',
    basic: '基础设置',
    trailLength: '轨迹长度',
    trailLengthDescription: '轨迹淡出的秒数',
    newLayer: '新建图层',
    elevationByDescription: '关闭时，高度取决于点数',
    colorByDescription: '关闭时，颜色取决于点数',
    aggregateBy: '{field}聚合如下: ',
    '3DModel': '3D模型',
    '3DModelOptions': '3D模型选项',
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
    angle: '角度',
    strokeWidth: '线条宽度',
    strokeWidthRange: '线条宽度范围',
    radius: '半径',
    fixedRadius: '以米为单位固定半径',
    fixedRadiusDescription: '将半径映射到以米为单位的绝对半径（例: 5 → 5米）',
    radiusRange: '半径范围',
    clusterRadius: '聚类半径',
    radiusRangePixels: '半径范围[像素]',
    opacity: '透明度',
    coverage: '覆盖范围',
    outline: '轮廓',
    colorRange: '色彩范围',
    stroke: '线',
    strokeColor: '线条颜色',
    strokeColorRange: '线条色彩范围',
    targetColor: '目标颜色',
    colorAggregation: '颜色聚合',
    heightAggregation: '高度聚合',
    resolutionRange: '分辨率范围',
    sizeScale: '大小比例',
    worldUnitSize: '世界单位大小',
    elevationScale: '海拔比例',
    enableElevationZoomFactor: '使用高程缩放系数',
    enableElevationZoomFactorDescription: '根据当前缩放系数调整海拔',
    heightScale: '高度比例',
    coverageRange: '覆盖范围',
    highPrecisionRendering: '高精度渲染',
    highPrecisionRenderingDescription: '高精度渲染会导致性能下降',
    height: '高度',
    heightDescription: '点击屏幕右上角的按钮切换到3D视图',
    fill: '填充',
    enablePolygonHeight: '启用多边形高度',
    showWireframe: '显示线框',
    weightIntensity: '加权强度',
    zoomScale: '缩放比例',
    heightRange: '高度范围'
  },
  layerManager: {
    addData: '添加数据',
    addLayer: '添加图层',
    layerBlending: '混合图层'
  },
  mapManager: {
    mapStyle: '地图样式',
    addMapStyle: '添加地图样式',
    '3dBuildingColor': '3D 建筑颜色'
  },
  layerConfiguration: {
    defaultDescription: '根据所选字段计算 {property}',
    howTo: '使用方法'
  },
  filterManager: {
    addFilter: '添加过滤器'
  },
  datasetTitle: {
    showDataTable: '显示数据表',
    removeDataset: '删除数据集'
  },
  datasetInfo: {
    rowCount: '{rowCount}行'
  },
  tooltip: {
    hideLayer: '隐藏图层',
    showLayer: '显示图层',
    hideFeature: '隐藏特征',
    showFeature: '显示特征',
    hide: '隐藏',
    show: '显示',
    removeLayer: '删除图层',
    duplicateLayer: '复制图层',
    layerSettings: '图层设置',
    closePanel: '关闭当前面板',
    switchToDualView: '切换到双地图视图',
    showLegend: '显示图例',
    disable3DMap: '禁用 3D 地图',
    DrawOnMap: '在地图上绘制',
    selectLocale: '选择语言',
    hideLayerPanel: '隐藏图层面板',
    showLayerPanel: '显示图层面板',
    moveToTop: '移至图层顶部',
    selectBaseMapStyle: '选择底图样式',
    "delete": '删除',
    timePlayback: '时空回放',
    cloudStorage: '云存储',
    '3DMap': '3D 地图',
    animationByWindow: '移动时间窗口',
    animationByIncremental: '增量时间窗口',
    speed: '速度',
    play: '播放',
    pause: '暂停',
    reset: '重置'
  },
  toolbar: _objectSpread({
    exportImage: '导出图片',
    exportData: '导出数据',
    exportMap: '导出地图',
    shareMapURL: '分享地图网址',
    saveMap: '保存地图',
    select: '选择',
    polygon: 'polygon',
    rectangle: 'rectangle',
    hide: '隐藏',
    show: '显示'
  }, _locales.LOCALES),
  editor: {
    filterLayer: '过滤图层',
    copyGeometry: '复制几何图形'
  },
  modal: {
    title: {
      deleteDataset: '删除数据集',
      addDataToMap: '添加数据到地图',
      exportImage: '导出图片',
      exportData: '导出数据',
      exportMap: '导出地图',
      addCustomMapboxStyle: '添加自定义地图',
      saveMap: '保存地图',
      shareURL: '分享网址'
    },
    button: {
      "delete": '删除',
      download: '下载',
      "export": '出口',
      addStyle: '添加样式',
      save: '保存',
      defaultCancel: '取消',
      defaultConfirm: '确认'
    },
    exportImage: {
      ratioTitle: '比率',
      ratioDescription: '选择不同用途的比例。',
      ratioOriginalScreen: '原始屏幕',
      ratioCustom: '自定义',
      ratio4_3: '4:3',
      ratio16_9: '16:9',
      resolutionTitle: '分辨率',
      resolutionDescription: '高分辨率更适合打印。',
      mapLegendTitle: '地图图例',
      mapLegendAdd: '在地图上添加图例'
    },
    exportData: {
      datasetTitle: '数据集',
      datasetSubtitle: '选择要导出的数据集',
      allDatasets: '全部',
      dataTypeTitle: '数据类型',
      dataTypeSubtitle: '选择要导出的数据类型',
      filterDataTitle: '过滤数据',
      filterDataSubtitle: '可以选择导出原始数据或过滤后的数据',
      filteredData: '过滤数据',
      unfilteredData: '元数据',
      fileCount: '{fileCount} 个文件',
      rowCount: '{rowCount} 行'
    },
    deleteData: {
      warning: '确认要删除这个数据集。它会影响 {length} 个层'
    },
    addStyle: {
      publishTitle: '2. 如果在步骤1中输入了 mapbox 样式的 url，需要在 mapbox 上发布样式或提供访问令牌（access token）。（可选）',
      publishSubtitle1: '可以在以下位置创建自己的地图样式',
      publishSubtitle2: '并',
      publishSubtitle3: '发布',
      publishSubtitle4: '。',
      publishSubtitle5: '使用私有样式，需粘贴',
      publishSubtitle6: '访问令牌（access token）',
      publishSubtitle7: '。* Kepler.gl 是一个客户端应用程序，数据保留在您的浏览器中。',
      exampleToken: '例) pk.abcdefg.xxxxxx',
      pasteTitle: '1. 粘贴样式 url',
      pasteSubtitle0: '样式 url 可以是 Mapbox 的',
      pasteSubtitle1: '什么是',
      pasteSubtitle2: '样式 URL，',
      pasteSubtitle3: '还可以使用遵从Mapbox GL样式的style.json的url：',
      pasteSubtitle4: 'Mapbox GL 样式规范',
      namingTitle: '3. 命名你的样式'
    },
    shareMap: {
      shareUriTitle: '分享地图网址',
      shareUriSubtitle: '生成分享地图的链接',
      cloudTitle: '云存储',
      cloudSubtitle: '登录并将地图数据上传到个人云存储',
      shareDisclaimer: 'kepler.gl 将创建的地图存储在个人云存储中，因此只有知道 URL 的人才能访问地图及其数据。' + '可以随时使用个人云存储帐户编辑/删除数据文件。',
      gotoPage: '跳转到Kepler.gl的{currentProvider}页面'
    },
    statusPanel: {
      mapUploading: '地图上传中',
      error: '错误'
    },
    saveMap: {
      title: '云存储',
      subtitle: '登录以将地图保存到个人云存储'
    },
    exportMap: {
      formatTitle: '地图的格式',
      formatSubtitle: '选择导出地图的格式',
      html: {
        selection: '将地图导出至交互式的html文件中。',
        tokenTitle: 'Mapbox的访问令牌（access token）',
        tokenSubtitle: '在 html 中使用自己的 Mapbox 访问令牌（access token）（可选）',
        tokenPlaceholder: '粘贴个人的 Mapbox 访问令牌access token）',
        tokenMisuseWarning: '* 如果您不提供自己的令牌，则在我们更换令牌时，地图可能随时无法显示，以免被滥用。',
        tokenDisclaimer: '可以稍后使用以下说明更改 Mapbox 令牌：',
        tokenUpdate: '如何更新现有的地图令牌。',
        modeTitle: '地图模式',
        modeSubtitle1: '选择地图模式。更多的',
        modeSubtitle2: '信息',
        modeDescription: '允许用户{mode}地图',
        read: '阅读',
        edit: '编辑'
      },
      json: {
        configTitle: '地图配置',
        configDisclaimer: '地图配置将包含在 Json 文件中。如果您在自己的应用程序中使用 kepler.gl。您可以复制此配置并将其传递给',
        selection: '将当前地图数据和配置导出到单个 Json 文件中。稍后您可以通过将此文件上传到 kepler.gl 来打开同一张地图。',
        disclaimer: '* 地图配置与加载的数据集相结合。 “dataId”用于将图层、过滤器和工具提示绑定到特定数据集。' + '将此配置传递给 addDataToMap 时，请确保数据集 ID 与此配置中的 dataId/s 匹配。'
      }
    },
    loadingDialog: {
      loading: '加载中...'
    },
    loadData: {
      upload: '上传文件',
      storage: '从存储中加载'
    },
    tripInfo: {
      title: '如何启用移动动画',
      description1: '要路径设置动画，geoJSON 数据必须包含 `LineString` 作为要素几何。此外，LineString 的坐标有四个元素',
      code: ' [经度，纬度，高程，时间戳] ',
      description2: '最后一个元素是时间戳。有效的时间戳格式包括以秒为单位的 unix，例如`1564184363`或以毫秒为单位的`1564184363000`。',
      example: '例：'
    },
    iconInfo: {
      title: '如何绘制图标',
      description1: '在您的 csv 中，创建一列，将您要绘制的图标的名称放入其中。如果不想在某些点上显示图标，可以将单元格留空。当列被命名为',
      code: '图标',
      description2: '时，kepler.gl 会自动为你创建一个图标层。',
      example: '例:',
      icons: '图标一览'
    },
    storageMapViewer: {
      lastModified: '上次修改 {lastUpdated} 前',
      back: '返回'
    },
    overwriteMap: {
      title: '正在保存地图...',
      alreadyExists: '已经存在于 {mapSaved} 中。你想覆盖吗？'
    },
    loadStorageMap: {
      back: '返回',
      goToPage: '跳转到 Kepler.gl 的 {displayName} 页面',
      storageMaps: '存储 / 地図',
      noSavedMaps: '还没有保存的地图'
    }
  },
  header: {
    visibleLayers: '可见图层',
    layerLegend: '图层图例'
  },
  interactions: {
    tooltip: '工具提示',
    brush: '刷',
    coordinate: '坐标',
    geocoder: '地理编码器'
  },
  layerBlending: {
    title: '图层混合',
    additive: 'additive',
    normal: 'normal',
    subtractive: 'subtractive'
  },
  columns: {
    title: '列',
    lat: '纬度',
    lng: '经度',
    altitude: '海拔',
    icon: '图标',
    geojson: 'geojson',
    token: '令牌',
    arc: {
      lat0: '起点 纬度',
      lng0: '起点 经度',
      lat1: '终点 纬度',
      lng1: '终点 经度'
    },
    grid: {
      worldUnitSize: '网格大小 (km)'
    },
    hexagon: {
      worldUnitSize: '六边形半径 (km)'
    },
    hex_id: 'hex id'
  },
  color: {
    customPalette: '自定义调色板',
    steps: '步骤',
    type: '类型',
    reversed: '反转'
  },
  scale: {
    colorScale: '色阶',
    sizeScale: '大小比例',
    strokeScale: '描边比例',
    scale: '规模'
  },
  fileUploader: {
    message: '将您的文件拖放到此处（可多个）',
    chromeMessage: '*对于 Chrome 用户：文件大小最大为 250mb。如果需要上传更多文件，请尝试使用 Safari。',
    disclaimer: '* kepler.gl 在客户端上工作。数据仅保留在您自己的设备/浏览器中。' + '没有信息或地图数据被发送到任何服务器。',
    configUploadMessage: '上传 {fileFormatNames} 或保存的地图 **Json**。阅读更多关于[**支持的文件格式**]',
    browseFiles: '浏览你的文件',
    uploading: '上传',
    fileNotSupported: '不支持文件 {errorFiles}。',
    or: '或'
  },
  geocoder: {
    title: '输入地址或坐标（例： 37.79,-122.40）'
  },
  fieldSelector: {
    clearAll: '清除所有',
    formatting: '格式化'
  },
  compare: {
    modeLabel: '比较模式',
    typeLabel: '比较类型',
    types: {
      absolute: '绝对',
      relative: '相对'
    }
  },
  mapPopover: {
    primary: '主要'
  },
  density: '密度',
  'Bug Report': '错误报告',
  'User Guide': '用户指南',
  Save: '保存',
  Share: '分享'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vY24uanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwiY292ZXJhZ2UiLCJzdHJva2VDb2xvciIsInJhZGl1cyIsIm91dGxpbmUiLCJzdHJva2UiLCJkZW5zaXR5IiwiaGVpZ2h0Iiwic3VtIiwicG9pbnRDb3VudCIsInBsYWNlaG9sZGVyIiwic2VhcmNoIiwic2VsZWN0RmllbGQiLCJ5QXhpcyIsInNlbGVjdFR5cGUiLCJzZWxlY3RWYWx1ZSIsImVudGVyVmFsdWUiLCJlbXB0eSIsIm1pc2MiLCJieSIsInZhbHVlc0luIiwidmFsdWVFcXVhbHMiLCJkYXRhU291cmNlIiwiYnJ1c2hSYWRpdXMiLCJtYXBMYXllcnMiLCJ0aXRsZSIsInJvYWQiLCJib3JkZXIiLCJidWlsZGluZyIsIndhdGVyIiwibGFuZCIsInBhbmVsIiwidGV4dCIsImxhYmVsV2l0aElkIiwiZm9udFNpemUiLCJmb250Q29sb3IiLCJ0ZXh0QW5jaG9yIiwiYWxpZ25tZW50IiwiYWRkTW9yZUxhYmVsIiwic2lkZWJhciIsInBhbmVscyIsImxheWVyIiwiZmlsdGVyIiwiaW50ZXJhY3Rpb24iLCJiYXNlbWFwIiwicmVxdWlyZWQiLCJwcm9wZXJ0eUJhc2VkT24iLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsImFuZ2xlIiwic3Ryb2tlV2lkdGhSYW5nZSIsImZpeGVkUmFkaXVzIiwiZml4ZWRSYWRpdXNEZXNjcmlwdGlvbiIsInJhZGl1c1JhbmdlIiwiY2x1c3RlclJhZGl1cyIsInJhZGl1c1JhbmdlUGl4ZWxzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJzdHJva2VDb2xvclJhbmdlIiwidGFyZ2V0Q29sb3IiLCJjb2xvckFnZ3JlZ2F0aW9uIiwiaGVpZ2h0QWdncmVnYXRpb24iLCJyZXNvbHV0aW9uUmFuZ2UiLCJzaXplU2NhbGUiLCJ3b3JsZFVuaXRTaXplIiwiZWxldmF0aW9uU2NhbGUiLCJlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yIiwiZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvckRlc2NyaXB0aW9uIiwiaGVpZ2h0U2NhbGUiLCJjb3ZlcmFnZVJhbmdlIiwiaGlnaFByZWNpc2lvblJlbmRlcmluZyIsImhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbiIsImhlaWdodERlc2NyaXB0aW9uIiwiZmlsbCIsImVuYWJsZVBvbHlnb25IZWlnaHQiLCJzaG93V2lyZWZyYW1lIiwid2VpZ2h0SW50ZW5zaXR5Iiwiem9vbVNjYWxlIiwiaGVpZ2h0UmFuZ2UiLCJsYXllck1hbmFnZXIiLCJhZGREYXRhIiwiYWRkTGF5ZXIiLCJsYXllckJsZW5kaW5nIiwibWFwTWFuYWdlciIsIm1hcFN0eWxlIiwiYWRkTWFwU3R5bGUiLCJsYXllckNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJob3dUbyIsImZpbHRlck1hbmFnZXIiLCJhZGRGaWx0ZXIiLCJkYXRhc2V0VGl0bGUiLCJzaG93RGF0YVRhYmxlIiwicmVtb3ZlRGF0YXNldCIsImRhdGFzZXRJbmZvIiwicm93Q291bnQiLCJ0b29sdGlwIiwiaGlkZUxheWVyIiwic2hvd0xheWVyIiwiaGlkZUZlYXR1cmUiLCJzaG93RmVhdHVyZSIsImhpZGUiLCJzaG93IiwicmVtb3ZlTGF5ZXIiLCJkdXBsaWNhdGVMYXllciIsImxheWVyU2V0dGluZ3MiLCJjbG9zZVBhbmVsIiwic3dpdGNoVG9EdWFsVmlldyIsInNob3dMZWdlbmQiLCJkaXNhYmxlM0RNYXAiLCJEcmF3T25NYXAiLCJzZWxlY3RMb2NhbGUiLCJoaWRlTGF5ZXJQYW5lbCIsInNob3dMYXllclBhbmVsIiwibW92ZVRvVG9wIiwic2VsZWN0QmFzZU1hcFN0eWxlIiwidGltZVBsYXliYWNrIiwiY2xvdWRTdG9yYWdlIiwiYW5pbWF0aW9uQnlXaW5kb3ciLCJhbmltYXRpb25CeUluY3JlbWVudGFsIiwic3BlZWQiLCJwbGF5IiwicGF1c2UiLCJyZXNldCIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwiZWRpdG9yIiwiZmlsdGVyTGF5ZXIiLCJjb3B5R2VvbWV0cnkiLCJtb2RhbCIsImRlbGV0ZURhdGFzZXQiLCJhZGREYXRhVG9NYXAiLCJhZGRDdXN0b21NYXBib3hTdHlsZSIsInNoYXJlVVJMIiwiYnV0dG9uIiwiZG93bmxvYWQiLCJhZGRTdHlsZSIsInNhdmUiLCJkZWZhdWx0Q2FuY2VsIiwiZGVmYXVsdENvbmZpcm0iLCJyYXRpb1RpdGxlIiwicmF0aW9EZXNjcmlwdGlvbiIsInJhdGlvT3JpZ2luYWxTY3JlZW4iLCJyYXRpb0N1c3RvbSIsInJhdGlvNF8zIiwicmF0aW8xNl85IiwicmVzb2x1dGlvblRpdGxlIiwicmVzb2x1dGlvbkRlc2NyaXB0aW9uIiwibWFwTGVnZW5kVGl0bGUiLCJtYXBMZWdlbmRBZGQiLCJkYXRhc2V0U3VidGl0bGUiLCJhbGxEYXRhc2V0cyIsImRhdGFUeXBlVGl0bGUiLCJkYXRhVHlwZVN1YnRpdGxlIiwiZmlsdGVyRGF0YVRpdGxlIiwiZmlsdGVyRGF0YVN1YnRpdGxlIiwiZmlsdGVyZWREYXRhIiwidW5maWx0ZXJlZERhdGEiLCJmaWxlQ291bnQiLCJkZWxldGVEYXRhIiwid2FybmluZyIsInB1Ymxpc2hUaXRsZSIsInB1Ymxpc2hTdWJ0aXRsZTEiLCJwdWJsaXNoU3VidGl0bGUyIiwicHVibGlzaFN1YnRpdGxlMyIsInB1Ymxpc2hTdWJ0aXRsZTQiLCJwdWJsaXNoU3VidGl0bGU1IiwicHVibGlzaFN1YnRpdGxlNiIsInB1Ymxpc2hTdWJ0aXRsZTciLCJleGFtcGxlVG9rZW4iLCJwYXN0ZVRpdGxlIiwicGFzdGVTdWJ0aXRsZTAiLCJwYXN0ZVN1YnRpdGxlMSIsInBhc3RlU3VidGl0bGUyIiwicGFzdGVTdWJ0aXRsZTMiLCJwYXN0ZVN1YnRpdGxlNCIsIm5hbWluZ1RpdGxlIiwic2hhcmVNYXAiLCJzaGFyZVVyaVRpdGxlIiwic2hhcmVVcmlTdWJ0aXRsZSIsImNsb3VkVGl0bGUiLCJjbG91ZFN1YnRpdGxlIiwic2hhcmVEaXNjbGFpbWVyIiwiZ290b1BhZ2UiLCJzdGF0dXNQYW5lbCIsIm1hcFVwbG9hZGluZyIsImVycm9yIiwic3VidGl0bGUiLCJmb3JtYXRUaXRsZSIsImZvcm1hdFN1YnRpdGxlIiwiaHRtbCIsInNlbGVjdGlvbiIsInRva2VuVGl0bGUiLCJ0b2tlblN1YnRpdGxlIiwidG9rZW5QbGFjZWhvbGRlciIsInRva2VuTWlzdXNlV2FybmluZyIsInRva2VuRGlzY2xhaW1lciIsInRva2VuVXBkYXRlIiwibW9kZVRpdGxlIiwibW9kZVN1YnRpdGxlMSIsIm1vZGVTdWJ0aXRsZTIiLCJtb2RlRGVzY3JpcHRpb24iLCJyZWFkIiwiZWRpdCIsImpzb24iLCJjb25maWdUaXRsZSIsImNvbmZpZ0Rpc2NsYWltZXIiLCJkaXNjbGFpbWVyIiwibG9hZGluZ0RpYWxvZyIsImxvYWRpbmciLCJsb2FkRGF0YSIsInVwbG9hZCIsInN0b3JhZ2UiLCJ0cmlwSW5mbyIsImRlc2NyaXB0aW9uMSIsImNvZGUiLCJkZXNjcmlwdGlvbjIiLCJleGFtcGxlIiwiaWNvbkluZm8iLCJpY29ucyIsInN0b3JhZ2VNYXBWaWV3ZXIiLCJsYXN0TW9kaWZpZWQiLCJiYWNrIiwib3ZlcndyaXRlTWFwIiwiYWxyZWFkeUV4aXN0cyIsImxvYWRTdG9yYWdlTWFwIiwiZ29Ub1BhZ2UiLCJzdG9yYWdlTWFwcyIsIm5vU2F2ZWRNYXBzIiwiaGVhZGVyIiwidmlzaWJsZUxheWVycyIsImxheWVyTGVnZW5kIiwiaW50ZXJhY3Rpb25zIiwiYnJ1c2giLCJjb29yZGluYXRlIiwiZ2VvY29kZXIiLCJhZGRpdGl2ZSIsIm5vcm1hbCIsInN1YnRyYWN0aXZlIiwiY29sdW1ucyIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwidG9rZW4iLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiaGV4X2lkIiwiY3VzdG9tUGFsZXR0ZSIsInN0ZXBzIiwicmV2ZXJzZWQiLCJzY2FsZSIsImNvbG9yU2NhbGUiLCJzdHJva2VTY2FsZSIsImZpbGVVcGxvYWRlciIsIm1lc3NhZ2UiLCJjaHJvbWVNZXNzYWdlIiwiY29uZmlnVXBsb2FkTWVzc2FnZSIsImJyb3dzZUZpbGVzIiwidXBsb2FkaW5nIiwiZmlsZU5vdFN1cHBvcnRlZCIsIm9yIiwiZmllbGRTZWxlY3RvciIsImNsZWFyQWxsIiwiZm9ybWF0dGluZyIsImNvbXBhcmUiLCJtb2RlTGFiZWwiLCJ0eXBlTGFiZWwiLCJ0eXBlcyIsImFic29sdXRlIiwicmVsYXRpdmUiLCJtYXBQb3BvdmVyIiwicHJpbWFyeSIsIlNhdmUiLCJTaGFyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7OztlQUVlO0FBQ2JBLEVBQUFBLFFBQVEsRUFBRTtBQUNSQyxJQUFBQSxNQUFNLEVBQUUsSUFEQTtBQUVSQyxJQUFBQSxLQUFLLEVBQUUsSUFGQztBQUdSQyxJQUFBQSxTQUFTLEVBQUUsS0FISDtBQUlSQyxJQUFBQSxLQUFLLEVBQUUsSUFKQztBQUtSQyxJQUFBQSxRQUFRLEVBQUUsTUFMRjtBQU1SQyxJQUFBQSxXQUFXLEVBQUUsTUFOTDtBQU9SQyxJQUFBQSxNQUFNLEVBQUUsSUFQQTtBQVFSQyxJQUFBQSxPQUFPLEVBQUUsS0FSRDtBQVNSQyxJQUFBQSxNQUFNLEVBQUUsTUFUQTtBQVVSQyxJQUFBQSxPQUFPLEVBQUUsSUFWRDtBQVdSQyxJQUFB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QUFFO0FBQ2JDLElBQUFBLFFBQVEsRUFBRSxNQURHO0FBRWJDLElBQUFBLFVBQVUsRUFBRTtBQUZDLEdBbGJGO0FBc2JiQyxFQUFBQSxPQUFPLEVBQUU7QUFDUEMsSUFBQUEsU0FBUyxFQUFFLE1BREo7QUFFUEMsSUFBQUEsU0FBUyxFQUFFLE1BRko7QUFHUEMsSUFBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLFFBQVEsRUFBRSxJQURMO0FBRUxDLE1BQUFBLFFBQVEsRUFBRTtBQUZMO0FBSEEsR0F0Ykk7QUE4YmJDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxPQUFPLEVBQUU7QUFEQyxHQTliQztBQWljYnhTLEVBQUFBLE9BQU8sRUFBRSxJQWpjSTtBQWtjYixnQkFBYyxNQWxjRDtBQW1jYixnQkFBYyxNQW5jRDtBQW9jYnlTLEVBQUFBLElBQUksRUFBRSxJQXBjTztBQXFjYkMsRUFBQUEsS0FBSyxFQUFFO0FBcmNNLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0xPQ0FMRVN9IGZyb20gJy4vbG9jYWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcGVydHk6IHtcbiAgICB3ZWlnaHQ6ICfmnYPph40nLFxuICAgIGxhYmVsOiAn5qCH562+JyxcbiAgICBmaWxsQ29sb3I6ICfloavlhYXoibInLFxuICAgIGNvbG9yOiAn6aKc6ImyJyxcbiAgICBjb3ZlcmFnZTogJ+imhuebluiMg+WbtCcsXG4gICAgc3Ryb2tlQ29sb3I6ICfnur/mnaHpopzoibInLFxuICAgIHJhZGl1czogJ+WNiuW+hCcsXG4gICAgb3V0bGluZTogJ+i9ruW7k+e6vycsXG4gICAgc3Ryb2tlOiAn57q/5p2h57KX57uGJyxcbiAgICBkZW5zaXR5OiAn5a+G5bqmJyxcbiAgICBoZWlnaHQ6ICfpq5jluqYnLFxuICAgIHN1bTogJ+aAu+WSjCcsXG4gICAgcG9pbnRDb3VudDogJ+eCueaVsCdcbiAgfSxcbiAgcGxhY2Vob2xkZXI6IHtcbiAgICBzZWFyY2g6ICfmkJzntKInLFxuICAgIHNlbGVjdEZpZWxkOiAn6YCJ5oup5Yy65Z+fJyxcbiAgICB5QXhpczogJ1novbQnLFxuICAgIHNlbGVjdFR5cGU6ICfpgInmi6nnsbvlnosnLFxuICAgIHNlbGVjdFZhbHVlOiAn6YCJ5oup5YC8JyxcbiAgICBlbnRlclZhbHVlOiAn6L6T5YWl5YC8JyxcbiAgICBlbXB0eTogJ+acqumAieaLqSdcbiAgfSxcbiAgbWlzYzoge1xuICAgIGJ5OiAnJyxcbiAgICB2YWx1ZXNJbjogJ+WAvOWMheWQqycsXG4gICAgdmFsdWVFcXVhbHM6ICflgLznrYnkuo4nLFxuICAgIGRhdGFTb3VyY2U6ICfmlbDmja7mupAnLFxuICAgIGJydXNoUmFkaXVzOiAn55S756yU5Y2K5b6EIChrbSknLFxuICAgIGVtcHR5OiAnICdcbiAgfSxcbiAgbWFwTGF5ZXJzOiB7XG4gICAgdGl0bGU6ICflm77lsYInLFxuICAgIGxhYmVsOiAn5qCH562+JyxcbiAgICByb2FkOiAn6YGT6LevJyxcbiAgICBib3JkZXI6ICfovrnnlYznur8nLFxuICAgIGJ1aWxkaW5nOiAn5bu6562R54mpJyxcbiAgICB3YXRlcjogJ+awtCcsXG4gICAgbGFuZDogJ+WcsOmdoicsXG4gICAgJzNkQnVpbGRpbmcnOiAnM0Tlu7rnrZEnXG4gIH0sXG4gIHBhbmVsOiB7XG4gICAgdGV4dDoge1xuICAgICAgbGFiZWw6ICfmoIfnrb4nLFxuICAgICAgbGFiZWxXaXRoSWQ6ICfmoIfnrb4ge2xhYmVsSWR9JyxcbiAgICAgIGZvbnRTaXplOiAn5a2X5L2T5aSn5bCPJyxcbiAgICAgIGZvbnRDb2xvcjogJ+Wtl+S9k+minOiJsicsXG4gICAgICB0ZXh0QW5jaG9yOiAn5paH5pys6ZSaJyxcbiAgICAgIGFsaWdubWVudDogJ+Wvuem9kOaWueW8jycsXG4gICAgICBhZGRNb3JlTGFiZWw6ICfmt7vliqDmm7TlpJrmoIfnrb4nXG4gICAgfVxuICB9LFxuICBzaWRlYmFyOiB7XG4gICAgcGFuZWxzOiB7XG4gICAgICBsYXllcjogJ+WxgicsXG4gICAgICBmaWx0ZXI6ICfov4fmu6TlmagnLFxuICAgICAgaW50ZXJhY3Rpb246ICfkuqTkupInLFxuICAgICAgYmFzZW1hcDogJ+W6leWbvidcbiAgICB9XG4gIH0sXG4gIGxheWVyOiB7XG4gICAgcmVxdWlyZWQ6ICflv4XloasqJyxcbiAgICByYWRpdXM6ICfljYrlvoQnLFxuICAgIGNvbG9yOiAn6aKc6ImyJyxcbiAgICBmaWxsQ29sb3I6ICfloavlhYXoibInLFxuICAgIG91dGxpbmU6ICfova7lu5Pnur8nLFxuICAgIHdlaWdodDogJ+adg+mHjScsXG4gICAgcHJvcGVydHlCYXNlZE9uOiAne3Byb3BlcnR5feeahOWfuuWHhicsXG4gICAgY292ZXJhZ2U6ICfopobnm5bojIPlm7QnLFxuICAgIHN0cm9rZTogJ+e6v+adoeeyl+e7hicsXG4gICAgc3Ryb2tlV2lkdGg6ICfnur/mnaHlrr3luqYnLFxuICAgIHN0cm9rZUNvbG9yOiAn57q/5p2h6aKc6ImyJyxcbiAgICBiYXNpYzogJ+WfuuehgOiuvue9ricsXG4gICAgdHJhaWxMZW5ndGg6ICfovajov7nplb/luqYnLFxuICAgIHRyYWlsTGVuZ3RoRGVzY3JpcHRpb246ICfovajov7nmt6Hlh7rnmoTnp5LmlbAnLFxuICAgIG5ld0xheWVyOiAn5paw5bu65Zu+5bGCJyxcbiAgICBlbGV2YXRpb25CeURlc2NyaXB0aW9uOiAn5YWz6Zet5pe277yM6auY5bqm5Y+W5Yaz5LqO54K55pWwJyxcbiAgICBjb2xvckJ5RGVzY3JpcHRpb246ICflhbPpl63ml7bvvIzpopzoibLlj5blhrPkuo7ngrnmlbAnLFxuICAgIGFnZ3JlZ2F0ZUJ5OiAne2ZpZWxkfeiBmuWQiOWmguS4izogJyxcbiAgICAnM0RNb2RlbCc6ICczROaooeWeiycsXG4gICAgJzNETW9kZWxPcHRpb25zJzogJzNE5qih5Z6L6YCJ6aG5JyxcbiAgICB0eXBlOiB7XG4gICAgICBwb2ludDogJ3BvaW50JyxcbiAgICAgIGFyYzogJ2FyYycsXG4gICAgICBsaW5lOiAnbGluZScsXG4gICAgICBncmlkOiAnZ3JpZCcsXG4gICAgICBoZXhiaW46ICdoZXhiaW4nLFxuICAgICAgcG9seWdvbjogJ3BvbHlnb24nLFxuICAgICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgICAgY2x1c3RlcjogJ2NsdXN0ZXInLFxuICAgICAgaWNvbjogJ2ljb24nLFxuICAgICAgaGVhdG1hcDogJ2hlYXRtYXAnLFxuICAgICAgaGV4YWdvbjogJ2hleGFnb24nLFxuICAgICAgaGV4YWdvbmlkOiAnSDMnLFxuICAgICAgdHJpcDogJ3RyaXAnLFxuICAgICAgczI6ICdTMicsXG4gICAgICAnM2QnOiAnM0QnXG4gICAgfVxuICB9LFxuICBsYXllclZpc0NvbmZpZ3M6IHtcbiAgICBhbmdsZTogJ+inkuW6picsXG4gICAgc3Ryb2tlV2lkdGg6ICfnur/mnaHlrr3luqYnLFxuICAgIHN0cm9rZVdpZHRoUmFuZ2U6ICfnur/mnaHlrr3luqbojIPlm7QnLFxuICAgIHJhZGl1czogJ+WNiuW+hCcsXG4gICAgZml4ZWRSYWRpdXM6ICfku6XnsbPkuLrljZXkvY3lm7rlrprljYrlvoQnLFxuICAgIGZpeGVkUmFkaXVzRGVzY3JpcHRpb246ICflsIbljYrlvoTmmKDlsITliLDku6XnsbPkuLrljZXkvY3nmoTnu53lr7nljYrlvoTvvIjkvos6IDUg4oaSIDXnsbPvvIknLFxuICAgIHJhZGl1c1JhbmdlOiAn5Y2K5b6E6IyD5Zu0JyxcbiAgICBjbHVzdGVyUmFkaXVzOiAn6IGa57G75Y2K5b6EJyxcbiAgICByYWRpdXNSYW5nZVBpeGVsczogJ+WNiuW+hOiMg+WbtFvlg4/ntKBdJyxcbiAgICBvcGFjaXR5OiAn6YCP5piO5bqmJyxcbiAgICBjb3ZlcmFnZTogJ+imhuebluiMg+WbtCcsXG4gICAgb3V0bGluZTogJ+i9ruW7kycsXG4gICAgY29sb3JSYW5nZTogJ+iJsuW9qeiMg+WbtCcsXG4gICAgc3Ryb2tlOiAn57q/JyxcbiAgICBzdHJva2VDb2xvcjogJ+e6v+adoeminOiJsicsXG4gICAgc3Ryb2tlQ29sb3JSYW5nZTogJ+e6v+adoeiJsuW9qeiMg+WbtCcsXG4gICAgdGFyZ2V0Q29sb3I6ICfnm67moIfpopzoibInLFxuICAgIGNvbG9yQWdncmVnYXRpb246ICfpopzoibLogZrlkIgnLFxuICAgIGhlaWdodEFnZ3JlZ2F0aW9uOiAn6auY5bqm6IGa5ZCIJyxcbiAgICByZXNvbHV0aW9uUmFuZ2U6ICfliIbovqjnjofojIPlm7QnLFxuICAgIHNpemVTY2FsZTogJ+Wkp+Wwj+avlOS+iycsXG4gICAgd29ybGRVbml0U2l6ZTogJ+S4lueVjOWNleS9jeWkp+WwjycsXG4gICAgZWxldmF0aW9uU2NhbGU6ICfmtbfmi5Tmr5TkvosnLFxuICAgIGVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3I6ICfkvb/nlKjpq5jnqIvnvKnmlL7ns7vmlbAnLFxuICAgIGVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3JEZXNjcmlwdGlvbjogJ+agueaNruW9k+WJjee8qeaUvuezu+aVsOiwg+aVtOa1t+aLlCcsXG4gICAgaGVpZ2h0U2NhbGU6ICfpq5jluqbmr5TkvosnLFxuICAgIGNvdmVyYWdlUmFuZ2U6ICfopobnm5bojIPlm7QnLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmc6ICfpq5jnsr7luqbmuLLmn5MnLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbjogJ+mrmOeyvuW6pua4suafk+S8muWvvOiHtOaAp+iDveS4i+mZjScsXG4gICAgaGVpZ2h0OiAn6auY5bqmJyxcbiAgICBoZWlnaHREZXNjcmlwdGlvbjogJ+eCueWHu+Wxj+W5leWPs+S4iuinkueahOaMiemSruWIh+aNouWIsDNE6KeG5Zu+JyxcbiAgICBmaWxsOiAn5aGr5YWFJyxcbiAgICBlbmFibGVQb2x5Z29uSGVpZ2h0OiAn5ZCv55So5aSa6L655b2i6auY5bqmJyxcbiAgICBzaG93V2lyZWZyYW1lOiAn5pi+56S657q/5qGGJyxcbiAgICB3ZWlnaHRJbnRlbnNpdHk6ICfliqDmnYPlvLrluqYnLFxuICAgIHpvb21TY2FsZTogJ+e8qeaUvuavlOS+iycsXG4gICAgaGVpZ2h0UmFuZ2U6ICfpq5jluqbojIPlm7QnXG4gIH0sXG4gIGxheWVyTWFuYWdlcjoge1xuICAgIGFkZERhdGE6ICfmt7vliqDmlbDmja4nLFxuICAgIGFkZExheWVyOiAn5re75Yqg5Zu+5bGCJyxcbiAgICBsYXllckJsZW5kaW5nOiAn5re35ZCI5Zu+5bGCJ1xuICB9LFxuICBtYXBNYW5hZ2VyOiB7XG4gICAgbWFwU3R5bGU6ICflnLDlm77moLflvI8nLFxuICAgIGFkZE1hcFN0eWxlOiAn5re75Yqg5Zyw5Zu+5qC35byPJyxcbiAgICAnM2RCdWlsZGluZ0NvbG9yJzogJzNEIOW7uuetkeminOiJsidcbiAgfSxcbiAgbGF5ZXJDb25maWd1cmF0aW9uOiB7XG4gICAgZGVmYXVsdERlc2NyaXB0aW9uOiAn5qC55o2u5omA6YCJ5a2X5q616K6h566XIHtwcm9wZXJ0eX0nLFxuICAgIGhvd1RvOiAn5L2/55So5pa55rOVJ1xuICB9LFxuICBmaWx0ZXJNYW5hZ2VyOiB7XG4gICAgYWRkRmlsdGVyOiAn5re75Yqg6L+H5ruk5ZmoJ1xuICB9LFxuICBkYXRhc2V0VGl0bGU6IHtcbiAgICBzaG93RGF0YVRhYmxlOiAn5pi+56S65pWw5o2u6KGoJyxcbiAgICByZW1vdmVEYXRhc2V0OiAn5Yig6Zmk5pWw5o2u6ZuGJ1xuICB9LFxuICBkYXRhc2V0SW5mbzoge1xuICAgIHJvd0NvdW50OiAne3Jvd0NvdW50feihjCdcbiAgfSxcbiAgdG9vbHRpcDoge1xuICAgIGhpZGVMYXllcjogJ+makOiXj+WbvuWxgicsXG4gICAgc2hvd0xheWVyOiAn5pi+56S65Zu+5bGCJyxcbiAgICBoaWRlRmVhdHVyZTogJ+makOiXj+eJueW+gScsXG4gICAgc2hvd0ZlYXR1cmU6ICfmmL7npLrnibnlvoEnLFxuICAgIGhpZGU6ICfpmpDol48nLFxuICAgIHNob3c6ICfmmL7npLonLFxuICAgIHJlbW92ZUxheWVyOiAn5Yig6Zmk5Zu+5bGCJyxcbiAgICBkdXBsaWNhdGVMYXllcjogJ+WkjeWItuWbvuWxgicsXG4gICAgbGF5ZXJTZXR0aW5nczogJ+WbvuWxguiuvue9ricsXG4gICAgY2xvc2VQYW5lbDogJ+WFs+mXreW9k+WJjemdouadvycsXG4gICAgc3dpdGNoVG9EdWFsVmlldzogJ+WIh+aNouWIsOWPjOWcsOWbvuinhuWbvicsXG4gICAgc2hvd0xlZ2VuZDogJ+aYvuekuuWbvuS+iycsXG4gICAgZGlzYWJsZTNETWFwOiAn56aB55SoIDNEIOWcsOWbvicsXG4gICAgRHJhd09uTWFwOiAn5Zyo5Zyw5Zu+5LiK57uY5Yi2JyxcbiAgICBzZWxlY3RMb2NhbGU6ICfpgInmi6nor63oqIAnLFxuICAgIGhpZGVMYXllclBhbmVsOiAn6ZqQ6JeP5Zu+5bGC6Z2i5p2/JyxcbiAgICBzaG93TGF5ZXJQYW5lbDogJ+aYvuekuuWbvuWxgumdouadvycsXG4gICAgbW92ZVRvVG9wOiAn56e76Iez5Zu+5bGC6aG26YOoJyxcbiAgICBzZWxlY3RCYXNlTWFwU3R5bGU6ICfpgInmi6nlupXlm77moLflvI8nLFxuICAgIGRlbGV0ZTogJ+WIoOmZpCcsXG4gICAgdGltZVBsYXliYWNrOiAn5pe256m65Zue5pS+JyxcbiAgICBjbG91ZFN0b3JhZ2U6ICfkupHlrZjlgqgnLFxuICAgICczRE1hcCc6ICczRCDlnLDlm74nLFxuICAgIGFuaW1hdGlvbkJ5V2luZG93OiAn56e75Yqo5pe26Ze056qX5Y+jJyxcbiAgICBhbmltYXRpb25CeUluY3JlbWVudGFsOiAn5aKe6YeP5pe26Ze056qX5Y+jJyxcbiAgICBzcGVlZDogJ+mAn+W6picsXG4gICAgcGxheTogJ+aSreaUvicsXG4gICAgcGF1c2U6ICfmmoLlgZwnLFxuICAgIHJlc2V0OiAn6YeN572uJ1xuICB9LFxuICB0b29sYmFyOiB7XG4gICAgZXhwb3J0SW1hZ2U6ICflr7zlh7rlm77niYcnLFxuICAgIGV4cG9ydERhdGE6ICflr7zlh7rmlbDmja4nLFxuICAgIGV4cG9ydE1hcDogJ+WvvOWHuuWcsOWbvicsXG4gICAgc2hhcmVNYXBVUkw6ICfliIbkuqvlnLDlm77nvZHlnYAnLFxuICAgIHNhdmVNYXA6ICfkv53lrZjlnLDlm74nLFxuICAgIHNlbGVjdDogJ+mAieaLqScsXG4gICAgcG9seWdvbjogJ3BvbHlnb24nLFxuICAgIHJlY3RhbmdsZTogJ3JlY3RhbmdsZScsXG4gICAgaGlkZTogJ+makOiXjycsXG4gICAgc2hvdzogJ+aYvuekuicsXG4gICAgLi4uTE9DQUxFU1xuICB9LFxuICBlZGl0b3I6IHtcbiAgICBmaWx0ZXJMYXllcjogJ+i/h+a7pOWbvuWxgicsXG4gICAgY29weUdlb21ldHJ5OiAn5aSN5Yi25Yeg5L2V5Zu+5b2iJ1xuICB9LFxuICBtb2RhbDoge1xuICAgIHRpdGxlOiB7XG4gICAgICBkZWxldGVEYXRhc2V0OiAn5Yig6Zmk5pWw5o2u6ZuGJyxcbiAgICAgIGFkZERhdGFUb01hcDogJ+a3u+WKoOaVsOaNruWIsOWcsOWbvicsXG4gICAgICBleHBvcnRJbWFnZTogJ+WvvOWHuuWbvueJhycsXG4gICAgICBleHBvcnREYXRhOiAn5a+85Ye65pWw5o2uJyxcbiAgICAgIGV4cG9ydE1hcDogJ+WvvOWHuuWcsOWbvicsXG4gICAgICBhZGRDdXN0b21NYXBib3hTdHlsZTogJ+a3u+WKoOiHquWumuS5ieWcsOWbvicsXG4gICAgICBzYXZlTWFwOiAn5L+d5a2Y5Zyw5Zu+JyxcbiAgICAgIHNoYXJlVVJMOiAn5YiG5Lqr572R5Z2AJ1xuICAgIH0sXG4gICAgYnV0dG9uOiB7XG4gICAgICBkZWxldGU6ICfliKDpmaQnLFxuICAgICAgZG93bmxvYWQ6ICfkuIvovb0nLFxuICAgICAgZXhwb3J0OiAn5Ye65Y+jJyxcbiAgICAgIGFkZFN0eWxlOiAn5re75Yqg5qC35byPJyxcbiAgICAgIHNhdmU6ICfkv53lrZgnLFxuICAgICAgZGVmYXVsdENhbmNlbDogJ+WPlua2iCcsXG4gICAgICBkZWZhdWx0Q29uZmlybTogJ+ehruiupCdcbiAgICB9LFxuICAgIGV4cG9ydEltYWdlOiB7XG4gICAgICByYXRpb1RpdGxlOiAn5q+U546HJyxcbiAgICAgIHJhdGlvRGVzY3JpcHRpb246ICfpgInmi6nkuI3lkIznlKjpgJTnmoTmr5TkvovjgIInLFxuICAgICAgcmF0aW9PcmlnaW5hbFNjcmVlbjogJ+WOn+Wni+Wxj+W5lScsXG4gICAgICByYXRpb0N1c3RvbTogJ+iHquWumuS5iScsXG4gICAgICByYXRpbzRfMzogJzQ6MycsXG4gICAgICByYXRpbzE2Xzk6ICcxNjo5JyxcbiAgICAgIHJlc29sdXRpb25UaXRsZTogJ+WIhui+qOeOhycsXG4gICAgICByZXNvbHV0aW9uRGVzY3JpcHRpb246ICfpq5jliIbovqjnjofmm7TpgILlkIjmiZPljbDjgIInLFxuICAgICAgbWFwTGVnZW5kVGl0bGU6ICflnLDlm77lm77kvosnLFxuICAgICAgbWFwTGVnZW5kQWRkOiAn5Zyo5Zyw5Zu+5LiK5re75Yqg5Zu+5L6LJ1xuICAgIH0sXG4gICAgZXhwb3J0RGF0YToge1xuICAgICAgZGF0YXNldFRpdGxlOiAn5pWw5o2u6ZuGJyxcbiAgICAgIGRhdGFzZXRTdWJ0aXRsZTogJ+mAieaLqeimgeWvvOWHuueahOaVsOaNrumbhicsXG4gICAgICBhbGxEYXRhc2V0czogJ+WFqOmDqCcsXG4gICAgICBkYXRhVHlwZVRpdGxlOiAn5pWw5o2u57G75Z6LJyxcbiAgICAgIGRhdGFUeXBlU3VidGl0bGU6ICfpgInmi6nopoHlr7zlh7rnmoTmlbDmja7nsbvlnosnLFxuICAgICAgZmlsdGVyRGF0YVRpdGxlOiAn6L+H5ruk5pWw5o2uJyxcbiAgICAgIGZpbHRlckRhdGFTdWJ0aXRsZTogJ+WPr+S7pemAieaLqeWvvOWHuuWOn+Wni+aVsOaNruaIlui/h+a7pOWQjueahOaVsOaNricsXG4gICAgICBmaWx0ZXJlZERhdGE6ICfov4fmu6TmlbDmja4nLFxuICAgICAgdW5maWx0ZXJlZERhdGE6ICflhYPmlbDmja4nLFxuICAgICAgZmlsZUNvdW50OiAne2ZpbGVDb3VudH0g5Liq5paH5Lu2JyxcbiAgICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSDooYwnXG4gICAgfSxcbiAgICBkZWxldGVEYXRhOiB7XG4gICAgICB3YXJuaW5nOiAn56Gu6K6k6KaB5Yig6Zmk6L+Z5Liq5pWw5o2u6ZuG44CC5a6D5Lya5b2x5ZONIHtsZW5ndGh9IOS4quWxgidcbiAgICB9LFxuICAgIGFkZFN0eWxlOiB7XG4gICAgICBwdWJsaXNoVGl0bGU6XG4gICAgICAgICcyLiDlpoLmnpzlnKjmraXpqqQx5Lit6L6T5YWl5LqGIG1hcGJveCDmoLflvI/nmoQgdXJs77yM6ZyA6KaB5ZyoIG1hcGJveCDkuIrlj5HluIPmoLflvI/miJbmj5Dkvpvorr/pl67ku6TniYzvvIhhY2Nlc3MgdG9rZW7vvInjgILvvIjlj6/pgInvvIknLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMTogJ+WPr+S7peWcqOS7peS4i+S9jee9ruWIm+W7uuiHquW3seeahOWcsOWbvuagt+W8jycsXG4gICAgICBwdWJsaXNoU3VidGl0bGUyOiAn5bm2JyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTM6ICflj5HluIMnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNDogJ+OAgicsXG4gICAgICBwdWJsaXNoU3VidGl0bGU1OiAn5L2/55So56eB5pyJ5qC35byP77yM6ZyA57KY6LS0JyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTY6ICforr/pl67ku6TniYzvvIhhY2Nlc3MgdG9rZW7vvIknLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNzogJ+OAgiogS2VwbGVyLmdsIOaYr+S4gOS4quWuouaIt+err+W6lOeUqOeoi+W6j++8jOaVsOaNruS/neeVmeWcqOaCqOeahOa1j+iniOWZqOS4reOAgicsXG4gICAgICBleGFtcGxlVG9rZW46ICfkvospIHBrLmFiY2RlZmcueHh4eHh4JyxcbiAgICAgIHBhc3RlVGl0bGU6ICcxLiDnspjotLTmoLflvI8gdXJsJyxcbiAgICAgIHBhc3RlU3VidGl0bGUwOiAn5qC35byPIHVybCDlj6/ku6XmmK8gTWFwYm94IOeahCcsXG4gICAgICBwYXN0ZVN1YnRpdGxlMTogJ+S7gOS5iOaYrycsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogJ+agt+W8jyBVUkzvvIwnLFxuICAgICAgcGFzdGVTdWJ0aXRsZTM6ICfov5jlj6/ku6Xkvb/nlKjpgbXku45NYXBib3ggR0zmoLflvI/nmoRzdHlsZS5qc29u55qEdXJs77yaJyxcbiAgICAgIHBhc3RlU3VidGl0bGU0OiAnTWFwYm94IEdMIOagt+W8j+inhOiMgycsXG4gICAgICBuYW1pbmdUaXRsZTogJzMuIOWRveWQjeS9oOeahOagt+W8jydcbiAgICB9LFxuICAgIHNoYXJlTWFwOiB7XG4gICAgICBzaGFyZVVyaVRpdGxlOiAn5YiG5Lqr5Zyw5Zu+572R5Z2AJyxcbiAgICAgIHNoYXJlVXJpU3VidGl0bGU6ICfnlJ/miJDliIbkuqvlnLDlm77nmoTpk77mjqUnLFxuICAgICAgY2xvdWRUaXRsZTogJ+S6keWtmOWCqCcsXG4gICAgICBjbG91ZFN1YnRpdGxlOiAn55m75b2V5bm25bCG5Zyw5Zu+5pWw5o2u5LiK5Lyg5Yiw5Liq5Lq65LqR5a2Y5YKoJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCDlsIbliJvlu7rnmoTlnLDlm77lrZjlgqjlnKjkuKrkurrkupHlrZjlgqjkuK3vvIzlm6DmraTlj6rmnInnn6XpgZMgVVJMIOeahOS6uuaJjeiDveiuv+mXruWcsOWbvuWPiuWFtuaVsOaNruOAgicgK1xuICAgICAgICAn5Y+v5Lul6ZqP5pe25L2/55So5Liq5Lq65LqR5a2Y5YKo5biQ5oi357yW6L6RL+WIoOmZpOaVsOaNruaWh+S7tuOAgicsXG4gICAgICBnb3RvUGFnZTogJ+i3s+i9rOWIsEtlcGxlci5nbOeahHtjdXJyZW50UHJvdmlkZXJ96aG16Z2iJ1xuICAgIH0sXG4gICAgc3RhdHVzUGFuZWw6IHtcbiAgICAgIG1hcFVwbG9hZGluZzogJ+WcsOWbvuS4iuS8oOS4rScsXG4gICAgICBlcnJvcjogJ+mUmeivrydcbiAgICB9LFxuICAgIHNhdmVNYXA6IHtcbiAgICAgIHRpdGxlOiAn5LqR5a2Y5YKoJyxcbiAgICAgIHN1YnRpdGxlOiAn55m75b2V5Lul5bCG5Zyw5Zu+5L+d5a2Y5Yiw5Liq5Lq65LqR5a2Y5YKoJ1xuICAgIH0sXG4gICAgZXhwb3J0TWFwOiB7XG4gICAgICBmb3JtYXRUaXRsZTogJ+WcsOWbvueahOagvOW8jycsXG4gICAgICBmb3JtYXRTdWJ0aXRsZTogJ+mAieaLqeWvvOWHuuWcsOWbvueahOagvOW8jycsXG4gICAgICBodG1sOiB7XG4gICAgICAgIHNlbGVjdGlvbjogJ+WwhuWcsOWbvuWvvOWHuuiHs+S6pOS6kuW8j+eahGh0bWzmlofku7bkuK3jgIInLFxuICAgICAgICB0b2tlblRpdGxlOiAnTWFwYm9455qE6K6/6Zeu5Luk54mM77yIYWNjZXNzIHRva2Vu77yJJyxcbiAgICAgICAgdG9rZW5TdWJ0aXRsZTogJ+WcqCBodG1sIOS4reS9v+eUqOiHquW3seeahCBNYXBib3gg6K6/6Zeu5Luk54mM77yIYWNjZXNzIHRva2Vu77yJ77yI5Y+v6YCJ77yJJyxcbiAgICAgICAgdG9rZW5QbGFjZWhvbGRlcjogJ+eymOi0tOS4quS6uueahCBNYXBib3gg6K6/6Zeu5Luk54mMYWNjZXNzIHRva2Vu77yJJyxcbiAgICAgICAgdG9rZW5NaXN1c2VXYXJuaW5nOlxuICAgICAgICAgICcqIOWmguaenOaCqOS4jeaPkOS+m+iHquW3seeahOS7pOeJjO+8jOWImeWcqOaIkeS7rOabtOaNouS7pOeJjOaXtu+8jOWcsOWbvuWPr+iDvemaj+aXtuaXoOazleaYvuekuu+8jOS7peWFjeiiq+a7peeUqOOAgicsXG4gICAgICAgIHRva2VuRGlzY2xhaW1lcjogJ+WPr+S7peeojeWQjuS9v+eUqOS7peS4i+ivtOaYjuabtOaUuSBNYXBib3gg5Luk54mM77yaJyxcbiAgICAgICAgdG9rZW5VcGRhdGU6ICflpoLkvZXmm7TmlrDnjrDmnInnmoTlnLDlm77ku6TniYzjgIInLFxuICAgICAgICBtb2RlVGl0bGU6ICflnLDlm77mqKHlvI8nLFxuICAgICAgICBtb2RlU3VidGl0bGUxOiAn6YCJ5oup5Zyw5Zu+5qih5byP44CC5pu05aSa55qEJyxcbiAgICAgICAgbW9kZVN1YnRpdGxlMjogJ+S/oeaBrycsXG4gICAgICAgIG1vZGVEZXNjcmlwdGlvbjogJ+WFgeiuuOeUqOaIt3ttb2RlfeWcsOWbvicsXG4gICAgICAgIHJlYWQ6ICfpmIXor7snLFxuICAgICAgICBlZGl0OiAn57yW6L6RJ1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgY29uZmlnVGl0bGU6ICflnLDlm77phY3nva4nLFxuICAgICAgICBjb25maWdEaXNjbGFpbWVyOlxuICAgICAgICAgICflnLDlm77phY3nva7lsIbljIXlkKvlnKggSnNvbiDmlofku7bkuK3jgILlpoLmnpzmgqjlnKjoh6rlt7HnmoTlupTnlKjnqIvluo/kuK3kvb/nlKgga2VwbGVyLmds44CC5oKo5Y+v5Lul5aSN5Yi25q2k6YWN572u5bm25bCG5YW25Lyg6YCS57uZJyxcbiAgICAgICAgc2VsZWN0aW9uOlxuICAgICAgICAgICflsIblvZPliY3lnLDlm77mlbDmja7lkozphY3nva7lr7zlh7rliLDljZXkuKogSnNvbiDmlofku7bkuK3jgILnqI3lkI7mgqjlj6/ku6XpgJrov4flsIbmraTmlofku7bkuIrkvKDliLAga2VwbGVyLmdsIOadpeaJk+W8gOWQjOS4gOW8oOWcsOWbvuOAgicsXG4gICAgICAgIGRpc2NsYWltZXI6XG4gICAgICAgICAgJyog5Zyw5Zu+6YWN572u5LiO5Yqg6L2955qE5pWw5o2u6ZuG55u457uT5ZCI44CCIOKAnGRhdGFJZOKAneeUqOS6juWwhuWbvuWxguOAgei/h+a7pOWZqOWSjOW3peWFt+aPkOekuue7keWumuWIsOeJueWumuaVsOaNrumbhuOAgicgK1xuICAgICAgICAgICflsIbmraTphY3nva7kvKDpgJLnu5kgYWRkRGF0YVRvTWFwIOaXtu+8jOivt+ehruS/neaVsOaNrumbhiBJRCDkuI7mraTphY3nva7kuK3nmoQgZGF0YUlkL3Mg5Yy56YWN44CCJ1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9hZGluZ0RpYWxvZzoge1xuICAgICAgbG9hZGluZzogJ+WKoOi9veS4rS4uLidcbiAgICB9LFxuICAgIGxvYWREYXRhOiB7XG4gICAgICB1cGxvYWQ6ICfkuIrkvKDmlofku7YnLFxuICAgICAgc3RvcmFnZTogJ+S7juWtmOWCqOS4reWKoOi9vSdcbiAgICB9LFxuICAgIHRyaXBJbmZvOiB7XG4gICAgICB0aXRsZTogJ+WmguS9leWQr+eUqOenu+WKqOWKqOeUuycsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICfopoHot6/lvoTorr7nva7liqjnlLvvvIxnZW9KU09OIOaVsOaNruW/hemhu+WMheWQqyBgTGluZVN0cmluZ2Ag5L2c5Li66KaB57Sg5Yeg5L2V44CC5q2k5aSW77yMTGluZVN0cmluZyDnmoTlnZDmoIfmnInlm5vkuKrlhYPntKAnLFxuICAgICAgY29kZTogJyBb57uP5bqm77yM57qs5bqm77yM6auY56iL77yM5pe26Ze05oizXSAnLFxuICAgICAgZGVzY3JpcHRpb24yOlxuICAgICAgICAn5pyA5ZCO5LiA5Liq5YWD57Sg5piv5pe26Ze05oiz44CC5pyJ5pWI55qE5pe26Ze05oiz5qC85byP5YyF5ous5Lul56eS5Li65Y2V5L2N55qEIHVuaXjvvIzkvovlpoJgMTU2NDE4NDM2M2DmiJbku6Xmr6vnp5LkuLrljZXkvY3nmoRgMTU2NDE4NDM2MzAwMGDjgIInLFxuICAgICAgZXhhbXBsZTogJ+S+i++8midcbiAgICB9LFxuICAgIGljb25JbmZvOiB7XG4gICAgICB0aXRsZTogJ+WmguS9lee7mOWItuWbvuaghycsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICflnKjmgqjnmoQgY3N2IOS4re+8jOWIm+W7uuS4gOWIl++8jOWwhuaCqOimgee7mOWItueahOWbvuagh+eahOWQjeensOaUvuWFpeWFtuS4reOAguWmguaenOS4jeaDs+WcqOafkOS6m+eCueS4iuaYvuekuuWbvuagh++8jOWPr+S7peWwhuWNleWFg+agvOeVmeepuuOAguW9k+WIl+iiq+WRveWQjeS4uicsXG4gICAgICBjb2RlOiAn5Zu+5qCHJyxcbiAgICAgIGRlc2NyaXB0aW9uMjogJ+aXtu+8jGtlcGxlci5nbCDkvJroh6rliqjkuLrkvaDliJvlu7rkuIDkuKrlm77moIflsYLjgIInLFxuICAgICAgZXhhbXBsZTogJ+S+izonLFxuICAgICAgaWNvbnM6ICflm77moIfkuIDop4gnXG4gICAgfSxcbiAgICBzdG9yYWdlTWFwVmlld2VyOiB7XG4gICAgICBsYXN0TW9kaWZpZWQ6ICfkuIrmrKHkv67mlLkge2xhc3RVcGRhdGVkfSDliY0nLFxuICAgICAgYmFjazogJ+i/lOWbnidcbiAgICB9LFxuICAgIG92ZXJ3cml0ZU1hcDoge1xuICAgICAgdGl0bGU6ICfmraPlnKjkv53lrZjlnLDlm74uLi4nLFxuICAgICAgYWxyZWFkeUV4aXN0czogJ+W3sue7j+WtmOWcqOS6jiB7bWFwU2F2ZWR9IOS4reOAguS9oOaDs+imhuebluWQl++8nydcbiAgICB9LFxuICAgIGxvYWRTdG9yYWdlTWFwOiB7XG4gICAgICBiYWNrOiAn6L+U5ZueJyxcbiAgICAgIGdvVG9QYWdlOiAn6Lez6L2s5YiwIEtlcGxlci5nbCDnmoQge2Rpc3BsYXlOYW1lfSDpobXpnaInLFxuICAgICAgc3RvcmFnZU1hcHM6ICflrZjlgqggLyDlnLDlm7MnLFxuICAgICAgbm9TYXZlZE1hcHM6ICfov5jmsqHmnInkv53lrZjnmoTlnLDlm74nXG4gICAgfVxuICB9LFxuICBoZWFkZXI6IHtcbiAgICB2aXNpYmxlTGF5ZXJzOiAn5Y+v6KeB5Zu+5bGCJyxcbiAgICBsYXllckxlZ2VuZDogJ+WbvuWxguWbvuS+iydcbiAgfSxcbiAgaW50ZXJhY3Rpb25zOiB7XG4gICAgdG9vbHRpcDogJ+W3peWFt+aPkOekuicsXG4gICAgYnJ1c2g6ICfliLcnLFxuICAgIGNvb3JkaW5hdGU6ICflnZDmoIcnLFxuICAgIGdlb2NvZGVyOiAn5Zyw55CG57yW56CB5ZmoJ1xuICB9LFxuICBsYXllckJsZW5kaW5nOiB7XG4gICAgdGl0bGU6ICflm77lsYLmt7flkIgnLFxuICAgIGFkZGl0aXZlOiAnYWRkaXRpdmUnLFxuICAgIG5vcm1hbDogJ25vcm1hbCcsXG4gICAgc3VidHJhY3RpdmU6ICdzdWJ0cmFjdGl2ZSdcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAn5YiXJyxcbiAgICBsYXQ6ICfnuqzluqYnLFxuICAgIGxuZzogJ+e7j+W6picsXG4gICAgYWx0aXR1ZGU6ICfmtbfmi5QnLFxuICAgIGljb246ICflm77moIcnLFxuICAgIGdlb2pzb246ICdnZW9qc29uJyxcbiAgICB0b2tlbjogJ+S7pOeJjCcsXG4gICAgYXJjOiB7XG4gICAgICBsYXQwOiAn6LW354K5IOe6rOW6picsXG4gICAgICBsbmcwOiAn6LW354K5IOe7j+W6picsXG4gICAgICBsYXQxOiAn57uI54K5IOe6rOW6picsXG4gICAgICBsbmcxOiAn57uI54K5IOe7j+W6pidcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIHdvcmxkVW5pdFNpemU6ICfnvZHmoLzlpKflsI8gKGttKSdcbiAgICB9LFxuICAgIGhleGFnb246IHtcbiAgICAgIHdvcmxkVW5pdFNpemU6ICflha3ovrnlvaLljYrlvoQgKGttKSdcbiAgICB9LFxuICAgIGhleF9pZDogJ2hleCBpZCdcbiAgfSxcbiAgY29sb3I6IHtcbiAgICBjdXN0b21QYWxldHRlOiAn6Ieq5a6a5LmJ6LCD6Imy5p2/JyxcbiAgICBzdGVwczogJ+atpemqpCcsXG4gICAgdHlwZTogJ+exu+WeiycsXG4gICAgcmV2ZXJzZWQ6ICflj43ovawnXG4gIH0sXG4gIHNjYWxlOiB7XG4gICAgY29sb3JTY2FsZTogJ+iJsumYticsXG4gICAgc2l6ZVNjYWxlOiAn5aSn5bCP5q+U5L6LJyxcbiAgICBzdHJva2VTY2FsZTogJ+aPj+i+ueavlOS+iycsXG4gICAgc2NhbGU6ICfop4TmqKEnXG4gIH0sXG4gIGZpbGVVcGxvYWRlcjoge1xuICAgIG1lc3NhZ2U6ICflsIbmgqjnmoTmlofku7bmi5bmlL7liLDmraTlpITvvIjlj6/lpJrkuKrvvIknLFxuICAgIGNocm9tZU1lc3NhZ2U6XG4gICAgICAnKuWvueS6jiBDaHJvbWUg55So5oi377ya5paH5Lu25aSn5bCP5pyA5aSn5Li6IDI1MG1i44CC5aaC5p6c6ZyA6KaB5LiK5Lyg5pu05aSa5paH5Lu277yM6K+35bCd6K+V5L2/55SoIFNhZmFyaeOAgicsXG4gICAgZGlzY2xhaW1lcjpcbiAgICAgICcqIGtlcGxlci5nbCDlnKjlrqLmiLfnq6/kuIrlt6XkvZzjgILmlbDmja7ku4Xkv53nlZnlnKjmgqjoh6rlt7HnmoTorr7lpIcv5rWP6KeI5Zmo5Lit44CCJyArXG4gICAgICAn5rKh5pyJ5L+h5oGv5oiW5Zyw5Zu+5pWw5o2u6KKr5Y+R6YCB5Yiw5Lu75L2V5pyN5Yqh5Zmo44CCJyxcbiAgICBjb25maWdVcGxvYWRNZXNzYWdlOlxuICAgICAgJ+S4iuS8oCB7ZmlsZUZvcm1hdE5hbWVzfSDmiJbkv53lrZjnmoTlnLDlm74gKipKc29uKirjgILpmIXor7vmm7TlpJrlhbPkuo5bKirmlK/mjIHnmoTmlofku7bmoLzlvI8qKl0nLFxuICAgIGJyb3dzZUZpbGVzOiAn5rWP6KeI5L2g55qE5paH5Lu2JyxcbiAgICB1cGxvYWRpbmc6ICfkuIrkvKAnLFxuICAgIGZpbGVOb3RTdXBwb3J0ZWQ6ICfkuI3mlK/mjIHmlofku7Yge2Vycm9yRmlsZXN944CCJyxcbiAgICBvcjogJ+aIlidcbiAgfSxcbiAgZ2VvY29kZXI6IHtcbiAgICB0aXRsZTogJ+i+k+WFpeWcsOWdgOaIluWdkOagh++8iOS+i++8miAzNy43OSwtMTIyLjQw77yJJ1xuICB9LFxuICBmaWVsZFNlbGVjdG9yOiB7XG4gICAgY2xlYXJBbGw6ICfmuIXpmaTmiYDmnIknLFxuICAgIGZvcm1hdHRpbmc6ICfmoLzlvI/ljJYnXG4gIH0sXG4gIGNvbXBhcmU6IHtcbiAgICBtb2RlTGFiZWw6ICfmr5TovoPmqKHlvI8nLFxuICAgIHR5cGVMYWJlbDogJ+avlOi+g+exu+WeiycsXG4gICAgdHlwZXM6IHtcbiAgICAgIGFic29sdXRlOiAn57ud5a+5JyxcbiAgICAgIHJlbGF0aXZlOiAn55u45a+5J1xuICAgIH1cbiAgfSxcbiAgbWFwUG9wb3Zlcjoge1xuICAgIHByaW1hcnk6ICfkuLvopoEnXG4gIH0sXG4gIGRlbnNpdHk6ICflr4bluqYnLFxuICAnQnVnIFJlcG9ydCc6ICfplJnor6/miqXlkYonLFxuICAnVXNlciBHdWlkZSc6ICfnlKjmiLfmjIfljZcnLFxuICBTYXZlOiAn5L+d5a2YJyxcbiAgU2hhcmU6ICfliIbkuqsnXG59O1xuIl19