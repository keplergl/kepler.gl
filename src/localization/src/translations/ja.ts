// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LOCALES} from '../locales';

export default {
  property: {
    weight: '重み',
    label: 'ラベル',
    fillColor: '塗りつぶしの色',
    color: '色',
    coverage: 'カバー率',
    strokeColor: '線の色',
    radius: '半径',
    outline: '輪郭線',
    stroke: '線の太さ',
    density: '密度',
    height: '高さ',
    sum: '合計',
    pointCount: '点の数'
  },
  placeholder: {
    search: '検索',
    selectField: 'フィールドを選択',
    yAxis: 'Y軸',
    selectType: 'タイプを選択',
    selectValue: '値を選択',
    enterValue: '値を入力',
    empty: '未選択',
    selectLayer: 'レイヤを選択'
  },
  misc: {
    by: '',
    valuesIn: '値が以下に含まれる',
    valueEquals: '値が以下に等しい',
    dataSource: 'データソース',
    brushRadius: 'ブラシ半径 (km)',
    empty: ' '
  },
  mapLayers: {
    title: '地図レイヤ',
    label: 'ラベル',
    road: '道路',
    border: '境界線',
    building: '建物',
    water: '水',
    land: '地面',
    '3dBuilding': '3D建物',
    background: '背景'
  },
  panel: {
    text: {
      label: 'ラベル',
      labelWithId: 'ラベル {labelId}',
      fontSize: '文字サイズ',
      fontWeight: 'フォントの太さ',
      fontColor: '文字色',
      textAnchor: '文字左右',
      alignment: '文字上下',
      addMoreLabel: 'ラベルを追加',
      backgroundColor: '背景色',
      outlineWidth: '輪郭線の幅',
      outlineColor: '輪郭線の色'
    }
  },
  sidebar: {
    panels: {
      layer: 'レイヤ',
      filter: 'フィルター',
      interaction: 'インタラクション',
      basemap: 'ベースマップ',
      annotation: 'アノテーション'
    },
    panelViewToggle: {
      list: 'リスト表示',
      byDataset: 'データセット別表示'
    }
  },
  layer: {
    required: '必須*',
    radius: '半径',
    color: '色',
    fillColor: '塗りつぶしの色',
    outline: '輪郭線',
    weight: '重み',
    propertyBasedOn: '{property}の基準',
    coverage: 'カバー率',
    stroke: '線',
    strokeWidth: '線の太さ',
    strokeColor: '線の色',
    basic: '基本設定',
    trailLength: '痕跡の長さ',
    trailLengthDescription: '痕跡が完全に消えるまでの秒数',
    newLayer: '新しいレイヤ',
    elevationByDescription: 'オフの場合、高さは点の数に応じて決まります',
    colorByDescription: 'オフの場合、色は点の数に応じて決まります',
    aggregateBy: '{field}を以下で集計: ',
    '3DModel': '3Dモデル',
    '3DModelOptions': '3Dモデルのオプション',
    columnModesSeparator: 'または',
    service: 'サービス',
    layer: 'レイヤ',
    appearance: '外観',
    uniqueIdField: '一意IDフィールド',
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
      hover: 'Value:'
    },
    layerUpdateError:
      'レイヤ更新中にエラーが発生しました: {errorMessage}。入力データの形式が正しいことを確認してください。',
    interaction: 'インタラクション',
    heatmap: 'Heatmap',
    aggregation: 'Aggregation'
  },
  layerVisConfigs: {
    angle: '角度',
    strokeWidth: '線の太さ (ピクセル)',
    strokeWidthRange: '線の太さの範囲',
    radius: '半径',
    fixedRadius: '半径をメートルで固定',
    fixedRadiusDescription: '半径をメートル単位の絶対半径に変換します（例: 5 → 5メートル）',
    radiusRange: '半径の範囲',
    clusterRadius: 'クラスターの範囲[ピクセル]',
    radiusRangePixels: '半径の範囲[ピクセル]',
    billboard: 'ビルボードモード',
    billboardDescription: 'ジオメトリをカメラに向けます',
    fadeTrail: 'フェージングパス',
    opacity: '不透明度',
    coverage: 'カバー率',
    outline: '輪郭線',
    colorRange: '色の範囲',
    stroke: '線',
    strokeColor: '線の色',
    strokeColorRange: '線の色の範囲',
    targetColor: 'Targetの色',
    colorAggregation: '色の集計',
    heightAggregation: '高さの集計',
    weightAggregation: 'Weight Aggregation',
    resolutionRange: '解像度の範囲',
    sizeScale: 'サイズのスケール',
    worldUnitSize: 'World Unit Size',
    elevationScale: '標高のスケール',
    enableElevationZoomFactor: '標高ズーム係数を使用する',
    enableElevationZoomFactorDescription: '現在のズーム率に基づいて高さ/標高を調整します',
    enableHeightZoomFactor: '高さズーム係数を使用する',
    heightScale: '高さのスケール',
    coverageRange: 'カバー率の範囲',
    highPrecisionRendering: '高精度レンダリング',
    highPrecisionRenderingDescription: '高精度にすると速度は低下します',
    height: '高さ',
    heightDescription: '3Dビューに切り替えるには画面右上のボタンをクリックします',
    fill: '塗りつぶし',
    enablePolygonHeight: 'ポリゴンの高さを有効にする',
    showWireframe: 'ワイヤーフレームを表示',
    weightIntensity: '重みづけの強さ',
    intensity: 'Intensity',
    threshold: 'Threshold',
    zoomScale: 'ズームのスケール',
    heightRange: '高さの範囲',
    heightMultiplier: '高さ乗数',
    fixedHeight: '固定高さ',
    fixedHeightDescription: '高さを変更せずに使用する',
    allowHover: 'ツールチップを表示',
    allowHoverDescription: 'レイヤー要素にホバーしたときにツールチップを表示または非表示にする',
    flow: {
      fade: 'フェード',
      fadeEnabled: 'フェード',
      fadeAmount: 'フェード量',
      display: '表示',
      renderingMode: 'ラインスタイル',
      renderingModes: {
        straight: 'ストレート',
        curved: 'カーブ',
        'animated-straight': 'アニメーション'
      },
      adaptiveScalesEnabled: 'アダプティブスケール',
      clusteringEnabled: 'クラスタリング',
      lineThicknessScale: '線の太さ',
      lineCurviness: '曲がり具合',
      locationTotalsEnabled: 'ロケーション合計',
      maxTopFlowsDisplayNum: '最大表示フロー数'
    },
    showNeighborOnHover: 'ホバー時に隣接要素をハイライト',
    showHighlightColor: 'ハイライトカラーを表示',
    darkModeEnabled: 'ダークベースマップ',
    transparentBackground: '透明な背景',
    pointSize: 'ポイントサイズ'
  },
  layerManager: {
    addData: 'データ追加',
    addLayer: 'レイヤ追加',
    layerBlending: 'レイヤのブレンド',
    overlayBlending: 'オーバーレイブレンド'
  },
  mapManager: {
    mapStyle: 'マップスタイル',
    addMapStyle: 'マップスタイル追加',
    '3dBuildingColor': '3D建物の色',
    backgroundColor: '背景色'
  },
  effectManager: {
    effects: 'エフェクト',
    addEffect: 'エフェクトを追加',
    pickDateTime: '日時を選択',
    currentTime: '現在時刻',
    pickCurrrentTime: '現在時刻を選択',
    date: '日付',
    time: '時刻',
    timezone: 'タイムゾーン'
  },
  annotationManager: {
    title: 'アノテーション',
    addAnnotation: '追加',
    type: 'タイプ',
    lineWidth: '線幅',
    color: '色'
  },
  effectDescription: {
    lightAndShadow:
      '時刻と地理的位置に基づいてリアルな太陽光と影の投影をシミュレートします。影の強さ、太陽光と環境光の色を調整できます。',
    ink: '縁を暗くして手描きの外観を作成する水墨画風のアートスタイルを適用します。強度を調整して効果の程度を制御します。',
    brightnessContrast:
      'マップ全体の明るさとコントラストを調整します。正の値で明るさやコントラストを上げ、負の値で暗くしたり平坦化します。',
    hueSaturation:
      '色相を変更し、マップ全体の彩度を調整します。カラーテーマの作成やビューの彩度を下げるのに便利です。',
    vibrance:
      '既に鮮やかな色を過度に飽和させることなく、くすんだ色の強度を選択的に高めます。彩度よりも自然な色の向上を生み出します。',
    sepia:
      '古い写真を思わせる温かみのある茶色のトーンを適用します。元の色とセピア調の間のブレンド量を制御します。',
    dotScreen:
      '画像をモノクロのドットパターンに変換し、新聞のハーフトーン印刷に似た効果を出します。角度、ドットサイズ、中心位置を調整します。',
    colorHalftone:
      '各カラーチャンネルに個別のドットパターンを使用してCMYKカラーハーフトーン印刷をシミュレートします。角度、ドットサイズ、中心位置を制御します。',
    noise:
      'マップ全体にフィルムグレインスタイルのランダムノイズを追加します。テクスチャのあるアナログ的な美観の作成やカラーバンディングの軽減に便利です。',
    triangleBlur:
      'マップ全体に滑らかなガウシアン風のブラーを均一に適用します。ブラー半径を制御してソフトさのレベルを調整します。',
    zoomBlur:
      '中心点から放射状に広がるモーションブラーを作成し、カメラズームをシミュレートします。強度と中心位置を調整します。',
    tiltShift:
      'フォーカルバンドの外側の領域をぼかすティルトシフトレンズ効果をシミュレートし、ミニチュアモデルのような外観を作成します。開始/終了位置でフォーカルバンドを設定します。',
    edgeWork:
      '芸術的な木炭スケッチスタイルを使用して画像の構造的なエッジをハイライトします。検出半径を調整して線の太さを制御します。',
    vignette:
      'マップの角と縁を暗くし、中心に注目を集めます。暗くする量とクリアエリアの半径を制御します。',
    magnify:
      '設定可能な位置に円形の拡大鏡オーバーレイを作成します。サイズ、ズームレベル、ボーダー幅を調整します。',
    hexagonalPixelate:
      '画像を六角形タイルのグリッドに置き換え、各タイルがカバーする領域の平均色で塗りつぶします。タイルのスケールを調整します。',
    distanceFog:
      'カメラからの深度に基づいて遠くのオブジェクトをフォグカラーにフェードさせ、奥行き感を高めます。密度、開始距離、範囲、フォグカラーを制御します。',
    surfaceFog:
      '地形表面の上の特定の高度にフォグレイヤをレンダリングします。高度、遷移の厚さ、密度、色、オプションのノイズパターンを調整します。'
  },
  layerConfiguration: {
    defaultDescription: '選択されたフィールドに基づいて{property}を計算します',
    howTo: '使い方',
    showColorChart: 'カラーチャートを表示',
    hideColorChart: 'カラーチャートを非表示'
  },
  filterManager: {
    addFilter: 'フィルター追加',
    timeFilterSync: '同期データセット',
    timeLayerSync: 'レイヤタイムラインにリンク',
    timeLayerUnsync: 'レイヤタイムラインのリンクを解除',
    column: '列'
  },
  datasetTitle: {
    showDataTable: 'データ表を表示',
    removeDataset: 'データセットを削除'
  },
  datasetInfo: {
    rowCount: '{rowCount}行',
    vectorTile: 'ベクタータイル',
    rasterTile: 'ラスタータイル',
    wmsTile: 'WMSタイル',
    tile3d: '3Dタイル'
  },
  tooltip: {
    hideLayer: 'レイヤを非表示',
    showLayer: 'レイヤを表示',
    hideFeature: 'フィーチャーを非表示',
    showFeature: 'フィーチャーを表示',
    hide: '非表示にする',
    show: '表示する',
    removeLayer: 'レイヤを削除',
    duplicateLayer: 'レイヤを複製',
    layerSettings: 'レイヤ設定',
    closePanel: 'このパネルを閉じる',
    switchToDualView: 'デュアルビューに切り替え',
    showLegend: '凡例を表示',
    disable3DMap: '3D地図を無効化',
    DrawOnMap: '地図上に図形を描画',
    selectLocale: '言語設定',
    showAiAssistantPanel: 'AI 助手パネルを表示',
    hideAiAssistantPanel: 'AI 助手パネルを非表示',
    hideLayerPanel: 'レイヤパネルを非表示',
    showLayerPanel: 'レイヤパネルを表示',
    moveToTop: 'データレイヤの手前に移動',
    selectBaseMapStyle: 'ベースマップのスタイルを選択',
    delete: '削除',
    timePlayback: '時系列で再生',
    cloudStorage: 'クラウドストレージ',
    '3DMap': '3D地図',
    animationByWindow: '時間枠を移動',
    animationByIncremental: '時間枠を増加',
    speed: '速度',
    play: '再生',
    pause: '一時停止',
    reset: 'リセット',
    export: 'エクスポート',
    resetAfterError: 'エラー後にレイヤを有効にしてみる',
    removeBaseMapStyle: 'ベースマップスタイルを削除',
    timeFilterSync: '別のデータセットの列と同期',
    syncTimelineStart: '現在のフィルタ期間の開始',
    syncTimelineEnd: '現在のフィルタ期間の終了',
    showEffectPanel: 'エフェクトパネルを表示',
    hideEffectPanel: 'エフェクトパネルを非表示',
    showAnnotationPanel: 'アノテーションを表示',
    hideAnnotationPanel: 'アノテーションを非表示',
    removeAnnotation: 'アノテーションを削除',
    duplicateAnnotation: 'アノテーションを複製',
    hideAnnotation: 'アノテーションを隠す',
    showAnnotation: 'アノテーションを表示',
    annotationSettings: 'アノテーション設定',
    removeEffect: 'エフェクトを削除',
    disableEffect: 'エフェクトを無効化',
    effectSettings: 'エフェクト設定',
    timeLayerSync: 'レイヤタイムラインにリンク',
    timeLayerUnsync: 'レイヤタイムラインのリンクを解除'
  },
  toolbar: {
    exportImage: '画像を出力',
    exportData: 'データを出力',
    exportMap: '地図を出力',
    exportVideo: 'ビデオをエクスポート',
    shareMapURL: '地図のURLを共有',
    saveMap: '地図を保存',
    select: '選択',
    polygon: 'ポリゴン',
    rectangle: '長方形',
    hide: '非表示',
    show: '表示',
    ...LOCALES
  },
  editor: {
    filterLayer: 'レイヤをフィルタ',
    filterLayerDisabled: 'ポリゴン以外のジオメトリはフィルタリングに使用できません',
    copyGeometry: 'ジオメトリをコピー',
    noLayersToFilter: 'フィルタするレイヤがありません'
  },
  exportVideoModal: {
    animation: 'アニメーション',
    settings: '設定'
  },
  modal: {
    title: {
      deleteDataset: 'データセットを削除',
      addDataToMap: '地図にデータを追加',
      exportImage: '画像を出力',
      exportData: 'データを出力',
      exportMap: '地図を出力',
      addCustomMapboxStyle: 'カスタムマップスタイルを追加',
      saveMap: '地図を保存',
      shareURL: 'URLを共有',
      exportVideo: 'ビデオをエクスポート'
    },
    button: {
      delete: '削除',
      download: 'ダウンロード',
      export: '出力',
      addStyle: 'スタイル追加',
      save: '保存',
      defaultCancel: 'キャンセル',
      defaultConfirm: '確認'
    },
    exportImage: {
      ratioTitle: '縦横比',
      ratioDescription: '用途に適した縦横比を選択します。',
      ratioOriginalScreen: '元のスクリーンサイズ',
      ratioCustom: 'カスタム',
      ratio4_3: '4:3',
      ratio16_9: '16:9',
      resolutionTitle: '解像度',
      resolutionDescription: '印刷には高解像度が適しています。',
      resolutionPlaceholder: '解像度を選択...',
      mapLegendTitle: '地図の凡例',
      mapLegendAdd: '地図に判例を追加'
    },
    exportVideo: {
      animation: 'アニメーション',
      settings: '設定'
    },
    exportData: {
      datasetTitle: 'データセット',
      datasetSubtitle: 'エクスポートしたいデータセットを選択します',
      allDatasets: '全て',
      dataTypeTitle: 'データ形式',
      dataTypeSubtitle: 'エクスポートしたいデータ形式を選択します',
      filterDataTitle: 'データのフィルタ',
      filterDataSubtitle:
        '元データ（フィルタなし）とフィルタ済データのどちらをエクスポートするか選択します',
      filteredData: 'フィルタ済データ',
      unfilteredData: '元データ',
      fileCount: '{fileCount}個のファイル',
      rowCount: '{rowCount}行',
      tiledDatasetWarning: '* タイルデータセットのデータエクスポートはサポートされていません'
    },
    deleteData: {
      warning: 'このデータセットを削除します。{length}個のレイヤに影響します。'
    },
    addStyle: {
      publishTitle:
        '2. ステップ1でMapboxのスタイルURLを指定した場合、Mapboxでスタイルを公開するか、アクセストークンを以下に入力します（オプション）',
      publishSubtitle1: '独自のスタイルを',
      publishSubtitle2: 'で作成し、',
      publishSubtitle3: '公開',
      publishSubtitle4: 'することができます',
      publishSubtitle5: '非公開のスタイルを使用するには、自身の',
      publishSubtitle6: 'アクセストークン',
      publishSubtitle7:
        'をここに入力します。*kepler.glはクライアント上で動作するため、データは自身のブラウザに保持されます。',
      exampleToken: '例) pk.abcdefg.xxxxxx',
      pasteTitle: '1. スタイルのURLをペースト',
      pasteSubtitle0: 'スタイルのURLはMapboxの',
      pasteSubtitle1: 'What is a',
      pasteSubtitle2: 'スタイルURL',
      pasteSubtitle3: 'を指定するか、Mapbox GLの仕様に沿ったstyle.jsonのURLを指定します：',
      pasteSubtitle4: 'Mapbox GL スタイル仕様',
      namingTitle: '3. スタイルの名称を設定'
    },
    shareMap: {
      title: '地図を共有',
      shareUriTitle: '地図のURLを共有',
      shareUriSubtitle: '共有用に地図のURLを生成',
      cloudTitle: 'クラウドストレージ',
      cloudSubtitle: 'ログインして地図データを個人用クラウドストレージにアップロード',
      shareDisclaimer:
        'kepler.glは作成した地図をあなたのクラウドストレージに保存するため、そのURLを知っている人のみが地図やそのデータにアクセス可能です。' +
        'クラウドストレージのアカウントでいつでもデータファイルを編集/削除することができます。',
      gotoPage: 'Kepler.glの{currentProvider}ページに移動'
    },
    statusPanel: {
      mapUploading: '地図をアップロード中',
      error: 'エラー'
    },
    saveMap: {
      title: 'クラウドストレージ',
      subtitle: '地図を個人用クラウドストレージに保存するためにログインする'
    },
    exportMap: {
      formatTitle: '地図の形式',
      formatSubtitle: '地図の出力形式を選択します',
      html: {
        selection: '地図をインタラクティブなHTMLファイルとして出力します。',
        tokenTitle: 'Mapboxアクセストークン',
        tokenSubtitle: 'HTMLファイルで自分のMapboxアクセストークンを使用します (オプション)',
        tokenPlaceholder: '自分のMapboxアクセストークンをここに貼り付け',
        tokenMisuseWarning:
          '* 自分のトークンを使用しない場合は、デフォルトのトークンが悪用防止のために更新され、地図が表示されなくなる可能性があります。  ',
        tokenSecurityWarning:
          '* 警告：MapboxトークンはエクスポートされたHTMLファイルに埋め込まれます。このファイルにアクセスできる人は誰でもトークンを確認・使用できます。可能な場合はURL制限付きのスコープトークンを使用してください。',
        tokenDisclaimer: 'Mapboxのトークンは下記の方法に従って後から変更することも可能です：',
        tokenUpdate: '既存の地図のトークンを更新する方法',
        modeTitle: '地図のモード',
        modeSubtitle1: '地図のモードを選択します。詳細は',
        modeSubtitle2: 'こちら',
        modeDescription: 'ユーザーに地図の{mode}を許可',
        read: '閲覧',
        edit: '編集'
      },
      json: {
        configTitle: '地図の設定',
        configDisclaimer:
          '地図の設定はjsonファイルに収められます。他のアプリケーションでkepler.glを使用する場合、この設定をコピーペーストすることが可能です：',
        selection:
          '現在の地図データと設定を単一のjsonファイルに出力します。このファイルをkepler.glにアップロードすることで、同じ地図を後から開くことが可能になります。',
        disclaimer:
          '* 地図の設定は読み込まれたデータセットとセットになっています。‘dataId’によってレイヤ、フィルター、ツールチップは特定のデータセットに紐づけられます。 ' +
          'この設定をaddDataToMapに渡す際は、データセットIDがこの設定内のdataIdと一致するようにしてください。'
      }
    },
    loadingDialog: {
      loading: 'ロード中...'
    },
    loadData: {
      upload: 'ファイルをロード',
      tileset: 'タイルセット',
      storage: 'ストレージからロード'
    },
    tripInfo: {
      title: '移動アニメーションを有効にする方法',
      description1:
        '経路をアニメーション化するには、geoJSONデータはfeatureのgeometryとして `LineString` を含む必要があります。また、LineStringの座標は4つの要素を',
      code: ' [経度, 緯度, 標高, timestamp] ',
      description2:
        'という形式（最後にタイムスタンプを含む）で保持する必要があります。タイムスタンプの形式は、 UNIX時間の秒単位（例: `1564184363`）またはミリ秒単位（例: `1564184363000`）が有効です。',
      example: '例：',
      titleTable: 'ポイントリストからトリップを作成',
      descriptionTable1:
        'トリップは緯度と経度のポイントリストを結合し、タイムスタンプで並べ替え、一意のIDでグループ化して作成できます。'
    },
    iconInfo: {
      title: 'アイコンの描画方法',
      description1:
        'CSVファイルに列を作成し、描画したいアイコンの名称を記載します。アイコンの描画が不要な点があれば、セルを空白にすることも可能です。列名が',
      code: 'icon',
      description2: 'の場合、kepler.glは自動的にアイコンレイヤを作成します。',
      example: '例:',
      icons: 'アイコン一覧'
    },
    polygonInfo: {
      title: 'GeoJSON機能からポリゴンレイヤを作成',
      titleTable: 'ポイントからパスを作成',
      descriptionTable: `パスは緯度と経度のポイントリストを結合し、インデックスフィールド（例：タイムスタンプ）で並べ替え、一意のIDでグループ化して作成できます。

  ### レイヤ列：
  - **id**: - *必須*&nbsp;- \`id\` 列はポイントのグループ化に使用されます。同じidを持つポイントは1つのパスに結合されます。
  - **lat**: - *必須*&nbsp;- ポイントの緯度
  - **lon**: - *必須*&nbsp;- ポイントの経度
  - **alt**: - *任意*&nbsp;- ポイントの高度
  - **sort by**: - *任意*&nbsp;- \`sort by\` 列はポイントの並べ替えに使用されます。指定しない場合、ポイントは行インデックス順に並べ替えられます。
`,
      exampleTable: 'Example CSV'
    },
    storageMapViewer: {
      lastModified: '最終編集：{lastUpdated} 前',
      back: '戻る'
    },
    overwriteMap: {
      title: '地図を保存中...',
      alreadyExists: '既に{mapSaved}に存在します。上書きしますか？'
    },
    loadStorageMap: {
      back: '戻る',
      goToPage: 'Kepler.glの{displayName}ページに移動',
      storageMaps: 'ストレージ / 地図',
      noSavedMaps: '保存済の地図はまだありません',
      foursquareStorageMessage:
        'Kepler.gl > 保存 > Foursquareストレージ オプションで保存されたマップのみがここに表示されます'
    }
  },
  header: {
    visibleLayers: '表示中のレイヤ',
    layerLegend: 'レイヤ判例',
    annotations: 'アノテーション'
  },
  interactions: {
    tooltip: 'ツールチップ',
    brush: 'ブラシ',
    coordinate: '座標',
    geocoder: 'ジオコーダー'
  },
  layerBlending: {
    title: 'レイヤのブレンド',
    additive: 'additive',
    normal: 'normal',
    subtractive: 'subtractive'
  },
  overlayBlending: {
    title: 'マップオーバーレイブレンド',
    description: 'レイヤとベースマップをブレンドして両方を表示します。',
    screen: 'ダークベースマップ',
    normal: 'ノーマル',
    darken: 'ライトベースマップ'
  },
  columns: {
    title: '列',
    lat: '緯度',
    lng: '経度',
    altitude: '標高',
    alt: '高度',
    id: 'id',
    timestamp: '時間',
    icon: 'アイコン',
    geojson: 'geojson',
    geoarrow: 'geoarrow',
    geoarrow0: 'geoarrow ソース',
    geoarrow1: 'geoarrow ターゲット',
    token: 'トークン',
    sortBy: '並べ替え',
    neighbors: '隣接',
    arc: {
      lat0: '出発 緯度',
      lng0: '出発 経度',
      lat1: '到着 緯度',
      lng1: '到着 経度'
    },
    line: {
      alt0: '出発 標高',
      alt1: '到着 標高'
    },
    grid: {
      worldUnitSize: 'グリッドサイズ (km)'
    },
    hexagon: {
      worldUnitSize: '六角形の半径 (km)'
    },
    hex_id: 'hex id',
    flow: {
      source: {
        lat: '出発 緯度',
        lng: '出発 経度',
        name: '出発名',
        h3: '出発 H3'
      },
      target: {
        lat: '到着 緯度',
        lng: '到着 経度',
        name: '到着名',
        h3: '到着 H3'
      },
      count: '件数'
    }
  },
  color: {
    customPalette: 'カスタムパレット',
    steps: '段階数',
    type: 'タイプ',
    reversed: '反転',
    colorBlindSafe: '色覚安全',
    disableStepReason:
      'カスタムカラーブレークでは段階数を変更できません。段階を編集するにはカスタムパレットを使用してください',
    preset: 'プリセットカラー',
    picker: 'カラーピッカー'
  },
  scale: {
    colorScale: 'カラースケール',
    sizeScale: 'サイズのスケール',
    strokeScale: '線のスケール',
    strokeColorScale: '線の色のスケール',
    scale: 'スケール'
  },
  fileUploader: {
    message: 'ここにファイルをドロップ（複数可）',
    chromeMessage:
      '*Chromeユーザーの場合: ファイルサイズは250mbまでにしてください。それ以上のファイルをアップロードする必要がある場合、Safariを試してください。',
    disclaimer:
      '*kepler.glはクライアント上で動作します。データは自身の機器・ブラウザにのみ保持されます。' +
      '情報や地図データは、いかなるサーバーにも送信されません。',
    configUploadMessage:
      '{fileFormatNames} または保存済地図の**Json**をアップロードします。詳細は以下を参照してください：[**対応ファイル形式**]',
    browseFiles: 'デバイスのファイルを選択',
    uploading: 'アップロード中',
    fileNotSupported: '{errorFiles} はサポートされていないファイルです。',
    or: 'または'
  },
  geocoder: {
    title: '住所または座標を入力（例： 37.79,-122.40）'
  },
  fieldSelector: {
    clearAll: '全て解除',
    formatting: '値の形式'
  },
  compare: {
    modeLabel: '比較モード',
    typeLabel: '比較方式',
    types: {
      absolute: '絶対',
      relative: '相対'
    }
  },
  mapPopover: {
    primary: 'プライマリ'
  },
  density: '密度',
  'Bug Report': 'バグを報告',
  'User Guide': 'ユーザーガイド',
  Save: '保存',
  Share: '共有',
  flow: {
    tooltip: {
      location: {
        name: '名称',
        incomingCount: '流入',
        outgoingCount: '流出',
        internalCount: '内部'
      },
      flow: {
        sourceName: '出発地',
        targetName: '目的地',
        count: '件数'
      }
    }
  },
  tilesetSetup: {
    header: 'ベクタータイルの設定',
    rasterTileHeader: 'ラスタータイルの設定',
    addTilesetText: 'タイルセットを追加'
  },
  mapLegend: {
    layers: {
      line: {
        singleColor: {
          sourceColor: '始点',
          targetColor: '終点'
        }
      },
      arc: {
        singleColor: {
          sourceColor: '始点',
          targetColor: '終点'
        }
      },
      default: {
        singleColor: {
          color: '塗りつぶしの色',
          strokeColor: '輪郭線'
        }
      }
    }
  }
};
