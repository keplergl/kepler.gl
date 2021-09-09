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

import {LOCALES} from './locales';

export default {
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
      layer: '图层',
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
    delete: '删除',
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
  toolbar: {
    exportImage: '导出图片',
    exportData: '导出数据',
    exportMap: '导出地图',
    shareMapURL: '分享地图网址',
    saveMap: '保存地图',
    select: '选择',
    polygon: 'polygon',
    rectangle: 'rectangle',
    hide: '隐藏',
    show: '显示',
    ...LOCALES
  },
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
      delete: '删除',
      download: '下载',
      export: '出口',
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
      publishTitle:
        '2. 如果在步骤1中输入了 mapbox 样式的 url，需要在 mapbox 上发布样式或提供访问令牌（access token）。（可选）',
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
      shareDisclaimer:
        'kepler.gl 将创建的地图存储在个人云存储中，因此只有知道 URL 的人才能访问地图及其数据。' +
        '可以随时使用个人云存储帐户编辑/删除数据文件。',
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
        tokenMisuseWarning:
          '* 如果您不提供自己的令牌，则在我们更换令牌时，地图可能随时无法显示，以免被滥用。',
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
        configDisclaimer:
          '地图配置将包含在 Json 文件中。如果您在自己的应用程序中使用 kepler.gl。您可以复制此配置并将其传递给',
        selection:
          '将当前地图数据和配置导出到单个 Json 文件中。稍后您可以通过将此文件上传到 kepler.gl 来打开同一张地图。',
        disclaimer:
          '* 地图配置与加载的数据集相结合。 “dataId”用于将图层、过滤器和工具提示绑定到特定数据集。' +
          '将此配置传递给 addDataToMap 时，请确保数据集 ID 与此配置中的 dataId/s 匹配。'
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
      description1:
        '要路径设置动画，geoJSON 数据必须包含 `LineString` 作为要素几何。此外，LineString 的坐标有四个元素',
      code: ' [经度，纬度，高程，时间戳] ',
      description2:
        '最后一个元素是时间戳。有效的时间戳格式包括以秒为单位的 unix，例如`1564184363`或以毫秒为单位的`1564184363000`。',
      example: '例：'
    },
    iconInfo: {
      title: '如何绘制图标',
      description1:
        '在您的 csv 中，创建一列，将您要绘制的图标的名称放入其中。如果不想在某些点上显示图标，可以将单元格留空。当列被命名为',
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
    chromeMessage:
      '*对于 Chrome 用户：文件大小最大为 250mb。如果需要上传更多文件，请尝试使用 Safari。',
    disclaimer:
      '* kepler.gl 在客户端上工作。数据仅保留在您自己的设备/浏览器中。' +
      '没有信息或地图数据被发送到任何服务器。',
    configUploadMessage:
      '上传 {fileFormatNames} 或保存的地图 **Json**。阅读更多关于[**支持的文件格式**]',
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
