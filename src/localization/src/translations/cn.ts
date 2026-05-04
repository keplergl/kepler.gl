// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LOCALES} from '../locales';

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
    empty: '未选择',
    selectLayer: '选择图层'
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
    '3dBuilding': '3D建筑',
    background: '背景'
  },
  panel: {
    text: {
      label: '标签',
      labelWithId: '标签 {labelId}',
      fontSize: '字体大小',
      fontWeight: '字体粗细',
      fontColor: '字体颜色',
      backgroundColor: '背景色',
      textAnchor: '文本锚',
      alignment: '对齐方式',
      addMoreLabel: '添加更多标签',
      outlineWidth: '轮廓宽度',
      outlineColor: '轮廓颜色'
    }
  },
  sidebar: {
    panels: {
      layer: '图层',
      filter: '过滤器',
      interaction: '交互',
      basemap: '底图'
    },
    panelViewToggle: {
      list: '查看列表',
      byDataset: '按数据集查看'
    }
  },
  layer: {
    required: '必填*',
    columnModesSeparator: '或',
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
    service: '服务',
    layer: '图层',
    appearance: '外观',
    uniqueIdField: '唯一ID字段',
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
      '3d': '3D',
      flow: 'flow',
      vectortile: 'vector tile',
      rastertile: 'raster tile',
      wms: 'WMS',
      tile3d: '3D tile'
    },
    wms: {
      hover: '值:'
    },
    layerUpdateError: '图层更新时发生错误：{errorMessage}。请确保输入数据的格式有效。',
    interaction: '交互',
    heatmap: 'Heatmap',
    aggregation: 'Aggregation'
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
    billboard: '公告板模式',
    billboardDescription: '将几何体朝向相机',
    fadeTrail: '渐隐轨迹',
    opacity: '透明度',
    pointSize: '点大小',
    coverage: '覆盖范围',
    outline: '轮廓',
    colorRange: '色彩范围',
    stroke: '线',
    strokeColor: '线条颜色',
    strokeColorRange: '线条色彩范围',
    targetColor: '目标颜色',
    colorAggregation: '颜色聚合',
    heightAggregation: '高度聚合',
    weightAggregation: 'Weight Aggregation',
    resolutionRange: '分辨率范围',
    sizeScale: '大小比例',
    worldUnitSize: '世界单位大小',
    elevationScale: '海拔比例',
    enableElevationZoomFactor: '使用高程缩放系数',
    enableElevationZoomFactorDescription: '根据当前缩放系数调整海拔',
    enableHeightZoomFactor: '使用高度缩放因子',
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
    intensity: 'Intensity',
    threshold: 'Threshold',
    zoomScale: '缩放比例',
    heightRange: '高度范围',
    heightMultiplier: '高度倍增器',
    fixedHeight: '固定高度',
    fixedHeightDescription: '使用未修改的高度',
    allowHover: '显示工具提示',
    allowHoverDescription: '悬停在图层要素上时显示或隐藏工具提示',
    flow: {
      fade: '渐隐',
      fadeEnabled: '渐隐',
      fadeAmount: '渐隐量',
      display: '显示',
      renderingMode: '线条样式',
      renderingModes: {
        straight: '直线',
        curved: '曲线',
        'animated-straight': '动画'
      },
      adaptiveScalesEnabled: '自适应比例',
      clusteringEnabled: '聚类',
      lineThicknessScale: '线条粗细',
      lineCurviness: '弯曲度',
      locationTotalsEnabled: '位置总量',
      maxTopFlowsDisplayNum: '最大显示流量数'
    },
    showNeighborOnHover: '悬停时高亮邻居',
    showHighlightColor: '显示高亮颜色',
    darkModeEnabled: '深色底图',
    transparentBackground: '透明背景'
  },
  layerManager: {
    addData: '添加数据',
    addLayer: '添加图层',
    layerBlending: '混合图层',
    overlayBlending: '叠加混合'
  },
  mapManager: {
    mapStyle: '地图样式',
    addMapStyle: '添加地图样式',
    '3dBuildingColor': '3D 建筑颜色',
    backgroundColor: '背景色'
  },
  effectManager: {
    effects: '效果',
    addEffect: '添加效果',
    pickDateTime: '选择日期/时间',
    currentTime: '当前时间',
    pickCurrrentTime: '选择当前时间',
    date: '日期',
    time: '时间',
    timezone: '时区'
  },
  effectDescription: {
    lightAndShadow:
      '根据一天中的时间和地理位置模拟逼真的阳光照射和阴影投射。可调节阴影强度、阳光和环境光颜色。',
    ink: '应用水墨艺术风格，使边缘变暗并创建手绘外观。调整强度以控制效果的程度。',
    brightnessContrast:
      '调整地图的整体亮度和对比度。使用正值来增加亮度或对比度，负值来变暗或平坦化图像。',
    hueSaturation: '改变色调并调整整个地图的饱和度。适用于创建颜色主题或降低视图饱和度。',
    vibrance:
      '选择性地增强暗淡颜色的强度，而不会使已经鲜艳的颜色过度饱和。比饱和度产生更自然的颜色增强效果。',
    sepia: '应用一种温暖的棕色调，让人联想到老照片。控制混合量以在原始颜色和怀旧色调之间切换。',
    dotScreen: '将图像转换为单色点图案，类似于报纸半色调印刷。调整角度、点大小和中心位置。',
    colorHalftone:
      '模拟CMYK彩色半色调印刷，每个颜色通道使用单独的点图案。控制角度、点大小和中心位置。',
    noise: '在地图上添加随机的胶片颗粒风格噪点。适用于创建纹理化、模拟美学效果或减少颜色条带。',
    triangleBlur: '在地图上均匀应用平滑的高斯模糊。控制模糊半径以调整柔化程度。',
    zoomBlur: '创建从中心点向外辐射的径向运动模糊，模拟相机变焦效果。调整强度和中心位置。',
    tiltShift:
      '模拟移轴镜头效果，模糊焦点带之外的区域，创造微缩模型的外观。通过起始/结束位置设置焦点带。',
    edgeWork: '使用艺术炭笔素描风格突出图像中的结构边缘。调整检测半径以控制线条粗细。',
    vignette: '使地图的角落和边缘变暗，将注意力引导向中心。控制变暗程度和清晰区域的半径。',
    magnify: '在可配置位置创建圆形放大镜叠加层。调整大小、缩放级别和边框宽度。',
    hexagonalPixelate:
      '将图像替换为六边形瓦片网格，每个瓦片填充其覆盖区域的平均颜色。调整瓦片缩放比例。',
    distanceFog:
      '根据物体到相机的深度将远处物体淡入雾色，增强纵深感。控制密度、起始距离、范围和雾色。',
    surfaceFog: '在地形表面上方的特定高度渲染雾层。调整高度、过渡厚度、密度、颜色和可选的噪声图案。'
  },
  layerConfiguration: {
    defaultDescription: '根据所选字段计算 {property}',
    howTo: '使用方法',
    showColorChart: '显示颜色图表',
    hideColorChart: '隐藏颜色图表'
  },
  filterManager: {
    addFilter: '添加过滤器',
    timeFilterSync: '同步数据集',
    timeLayerSync: '与图层时间线联动',
    timeLayerUnsync: '取消与图层时间线联动',
    column: '列'
  },
  datasetTitle: {
    showDataTable: '显示数据表',
    removeDataset: '删除数据集'
  },
  datasetInfo: {
    rowCount: '{rowCount}行',
    vectorTile: '矢量瓦片',
    rasterTile: '栅格瓦片',
    wmsTile: 'WMS瓦片',
    tile3d: '3D瓦片'
  },
  tooltip: {
    hideLayer: '隐藏图层',
    showLayer: '显示图层',
    hideFeature: '隐藏特征',
    showFeature: '显示特征',
    hide: '隐藏',
    show: '显示',
    removeLayer: '删除图层',
    zoomToLayer: '缩放☞图层',
    duplicateLayer: '复制图层',
    resetAfterError: '尝试在错误后启用图层',
    layerSettings: '图层设置',
    closePanel: '关闭当前面板',
    switchToDualView: '切换到双地图视图',
    showLegend: '显示图例',
    disable3DMap: '禁用 3D 地图',
    DrawOnMap: '在地图上绘制',
    selectLocale: '选择语言',
    showAiAssistantPanel: '显示 AI 助手面板',
    hideAiAssistantPanel: '隐藏 AI 助手面板',
    hideLayerPanel: '隐藏图层面板',
    showLayerPanel: '显示图层面板',
    moveToTop: '移至图层顶部',
    selectBaseMapStyle: '选择底图样式',
    removeBaseMapStyle: '移除底图样式',
    delete: '删除',
    timePlayback: '时空回放',
    timeFilterSync: '与另一个数据集中的列同步',
    cloudStorage: '云存储',
    '3DMap': '3D 地图',
    animationByWindow: '移动时间窗口',
    animationByIncremental: '增量时间窗口',
    speed: '速度',
    play: '播放',
    pause: '暂停',
    reset: '重置',
    export: '导出',
    timeLayerSync: '与图层时间线联动',
    timeLayerUnsync: '取消与图层时间线联动',
    syncTimelineStart: '当前过滤时间段的起始',
    syncTimelineEnd: '当前过滤时间段的结束',
    showEffectPanel: '显示效果面板',
    hideEffectPanel: '隐藏效果面板',
    removeEffect: '移除效果',
    disableEffect: '禁用效果',
    effectSettings: '效果设置'
  },
  toolbar: {
    exportImage: '导出图片',
    exportData: '导出数据',
    exportMap: '导出地图',
    exportVideo: '导出视频',
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
    filterLayerDisabled: '非多边形几何图形不能用于过滤',
    copyGeometry: '复制几何图形',
    noLayersToFilter: '没有可过滤的图层'
  },
  exportVideoModal: {
    animation: '动画',
    settings: '设置'
  },
  modal: {
    title: {
      deleteDataset: '删除数据集',
      addDataToMap: '添加数据到地图',
      exportImage: '导出图片',
      exportData: '导出数据',
      exportMap: '导出地图',
      exportVideo: '导出视频',
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
      resolutionPlaceholder: '选择分辨率...',
      mapLegendTitle: '地图图例',
      mapLegendAdd: '在地图上添加图例'
    },
    exportVideo: {
      animation: '动画',
      settings: '设置'
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
      rowCount: '{rowCount} 行',
      tiledDatasetWarning: '* 不支持导出瓦片数据集的数据'
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
      title: '分享地图',
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
        tokenSecurityWarning:
          '* 警告：您的Mapbox令牌将嵌入导出的HTML文件中。任何有权访问此文件的人都可以看到并使用您的令牌。请尽可能使用带有URL限制的范围令牌。',
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
      tileset: '瓦片集',
      storage: '从存储中加载'
    },
    tripInfo: {
      title: '如何启用移动动画',
      titleTable: '从点列表创建行程',
      description1:
        '要路径设置动画，geoJSON 数据必须包含 `LineString` 作为要素几何。此外，LineString 的坐标有四个元素',
      descriptionTable1: '行程可以通过连接经纬度点列表、按时间戳排序并按唯一标识符分组来创建。',
      code: ' [经度，纬度，高程，时间戳] ',
      description2:
        '最后一个元素是时间戳。有效的时间戳格式包括以秒为单位的 unix，例如`1564184363`或以毫秒为单位的`1564184363000`。',
      example: '例：',
      exampleTable: 'Example Csv'
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
    polygonInfo: {
      title: '从GeoJSON要素创建多边形图层',
      titleTable: '从点创建路径',
      descriptionTable: `路径可以通过连接经纬度点列表、按索引字段（如时间戳）排序并按唯一标识符分组来创建。

  ### 图层列：
  - **id**: - *必填*&nbsp;- \`id\` 列用于按点分组。具有相同id的点将合并为单条路径。
  - **lat**: - *必填*&nbsp;- 点的纬度
  - **lon**: - *必填*&nbsp;- 点的经度
  - **alt**: - *可选*&nbsp;- 点的高度
  - **sort by**: - *可选*&nbsp;- \`sort by\` 列用于对点进行排序；如果未指定，点将按行索引排序。
`,
      exampleTable: 'Example CSV'
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
      noSavedMaps: '还没有保存的地图',
      foursquareStorageMessage: '仅显示使用 Kepler.gl > 保存 > Foursquare存储 选项保存的地图'
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
  overlayBlending: {
    title: '地图叠加混合',
    description: '将图层与底图混合，使两者都可见。',
    screen: '深色底图',
    normal: '正常',
    darken: '浅色底图'
  },
  columns: {
    title: '列',
    lat: '纬度',
    lng: '经度',
    altitude: '海拔',
    alt: '高度',
    id: 'id',
    timestamp: '时间',
    icon: '图标',
    geojson: 'geojson',
    geoarrow: 'geoarrow',
    geoarrow0: 'geoarrow 起点',
    geoarrow1: 'geoarrow 终点',
    token: '令牌',
    sortBy: '排序依据',
    neighbors: '邻居',
    arc: {
      lat0: '起点 纬度',
      lng0: '起点 经度',
      lat1: '终点 纬度',
      lng1: '终点 经度'
    },
    line: {
      alt0: '起点海拔',
      alt1: '终点海拔'
    },
    grid: {
      worldUnitSize: '网格大小 (km)'
    },
    hexagon: {
      worldUnitSize: '六边形半径 (km)'
    },
    hex_id: 'hex id',
    flow: {
      source: {
        lat: '起点纬度',
        lng: '起点经度',
        name: '起点名称',
        h3: '起点 H3'
      },
      target: {
        lat: '终点纬度',
        lng: '终点经度',
        name: '终点名称',
        h3: '终点 H3'
      },
      count: '数量'
    }
  },
  color: {
    customPalette: '自定义调色板',
    steps: '步骤',
    type: '类型',
    colorBlindSafe: '色盲安全',
    reversed: '反转',
    disableStepReason: '使用自定义颜色断点时无法更改步数，请使用自定义调色板编辑步数',
    preset: '预设颜色',
    picker: '颜色选择器'
  },
  scale: {
    colorScale: '色阶',
    sizeScale: '大小比例',
    strokeScale: '描边比例',
    strokeColorScale: '线条颜色比例',
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
  tilesetSetup: {
    header: '设置矢量瓦片',
    rasterTileHeader: '设置栅格瓦片',
    addTilesetText: '添加瓦片集'
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
  Share: '分享',
  flow: {
    tooltip: {
      location: {
        name: '名称',
        incomingCount: '流入',
        outgoingCount: '流出',
        internalCount: '内部'
      },
      flow: {
        sourceName: '起点',
        targetName: '终点',
        count: '数量'
      }
    }
  },
  mapLegend: {
    layers: {
      line: {
        singleColor: {
          sourceColor: '源',
          targetColor: '目标'
        }
      },
      arc: {
        singleColor: {
          sourceColor: '源',
          targetColor: '目标'
        }
      },
      default: {
        singleColor: {
          color: '填充色',
          strokeColor: '轮廓线'
        }
      }
    }
  }
};
