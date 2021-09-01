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
    weight: 'вес',
    label: 'ярлык',
    fillColor: 'цвет заливки',
    color: 'цвет',
    coverage: 'покрытие',
    strokeColor: 'цвет обводки',
    radius: 'радиус',
    outline: 'контур',
    stroke: 'обводка',
    density: 'плотность',
    height: 'высота',
    sum: 'сумма',
    pointCount: 'Кол-во точек'
  },
  placeholder: {
    search: 'Поиск',
    selectField: 'Выберите поле',
    yAxis: 'Y Ось',
    selectType: 'Выберите A тип',
    selectValue: 'Выберите A значение',
    enterValue: 'Введите значение',
    empty: 'пустой'
  },
  misc: {
    by: '',
    valuesIn: 'Значение в',
    valueEquals: 'Значение равно',
    dataSource: 'Источник данных',
    brushRadius: 'Радиус кисти (km)',
    empty: ' '
  },
  mapLayers: {
    title: 'Слои карты',
    label: 'Обозначения',
    road: 'Дороги',
    border: 'Границы',
    building: 'Здания',
    water: 'Вода',
    land: 'Земля',
    '3dBuilding': '3d здания'
  },
  panel: {
    text: {
      label: 'Ярлык',
      labelWithId: 'Ярлык {labelId}',
      fontSize: 'Размер шрифта',
      fontColor: 'Цвет шрифта',
      textAnchor: 'Анкор текста',
      alignment: 'Положение',
      addMoreLabel: 'Добавить еще ярлык'
    }
  },
  sidebar: {
    panels: {
      layer: 'Слои',
      filter: 'Фильтры',
      interaction: 'Взаимодействия',
      basemap: 'Базовая карта'
    }
  },
  layer: {
    required: 'Требования*',
    radius: 'Радиус',
    color: 'Цвет',
    fillColor: 'Цвет заливки',
    outline: 'Контур',
    weight: 'Вес',
    propertyBasedOn: '{property} на основе',
    coverage: 'Покрытие',
    stroke: 'Обводка',
    strokeWidth: 'Ширина обводки',
    strokeColor: 'Цвет обводки',
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
      point: 'точки',
      arc: 'дуги',
      line: 'линии',
      grid: 'сетка',
      hexbin: 'hexbin',
      polygon: 'многоугольники',
      geojson: 'geojson',
      cluster: 'кластеры',
      icon: 'значки',
      heatmap: 'тепловая карта',
      hexagon: 'шестиугольник',
      hexagonid: 'H3',
      trip: 'пути',
      s2: 'S2',
      '3d': '3D'
    }
  },
  layerVisConfigs: {
    angle: 'Угол',
    strokeWidth: 'Ширина штриха (в пикселях)',
    strokeWidthRange: 'Диапазон ширины штриха',
    radius: 'Радиус',
    fixedRadius: 'Фиксированный радиус в метрах',
    fixedRadiusDescription:
      'Сопоставьте радиус с абсолютным радиусом в метрах, например От 5 до 5 метров',
    radiusRange: 'Диапазон радиуса',
    clusterRadius: 'Радиус кластера в пикселях',
    radiusRangePixels: 'Диапазон радиуса в пикселях',
    opacity: 'Непрозрачность',
    coverage: 'Покрытие',
    outline: 'Контур',
    colorRange: 'Цветовая гамма',
    stroke: 'Обводка',
    strokeColor: 'Цвет обводки',
    strokeColorRange: 'Обводка Цветовой диапазон',
    targetColor: 'Целевой цвет',
    colorAggregation: 'Цветовая агрегация',
    heightAggregation: 'Агрегация по высоте',
    resolutionRange: 'Диапазон разрешения',
    sizeScale: 'Шкала размеров',
    worldUnitSize: 'Мировые ед.изм.',
    elevationScale: 'Шкала возвышения',
    enableElevationZoomFactor: 'Использовать коэффициент увеличения по высоте',
    enableElevationZoomFactorDescription:
      'Отрегулируйте высоту / возвышение на основе текущего коэффициента масштабирования',
    enableHeightZoomFactor: 'вкл. коэффициент масштабирования по высоте',
    heightScale: 'Масштаб высоты',
    coverageRange: 'Диапазон покрытия',
    highPrecisionRendering: 'Высокая точность рендеринга',
    highPrecisionRenderingDescription: 'Высокая точность приведет к снижению производительности',
    height: 'Высота',
    heightDescription: 'Нажмите кнопку в правом верхнем углу карты, чтобы переключиться в 3D-вид',
    fill: 'Наполнить',
    enablePolygonHeight: 'Включить высоту многоугольника',
    showWireframe: 'Показать каркас',
    weightIntensity: 'Вес Интенсивность',
    zoomScale: 'Масштаб увеличения',
    heightRange: 'Диапазон высоты',
    heightMultiplier: 'Множитель высоты'
  },
  layerManager: {
    addData: 'Добавить данные',
    addLayer: 'Добавить слой',
    layerBlending: 'Смешивание слоев'
  },
  mapManager: {
    mapStyle: 'Стиль карты',
    addMapStyle: 'Добавить стиль карты',
    '3dBuildingColor': '3D Цвет здания'
  },
  layerConfiguration: {
    defaultDescription: 'Рассчитать {property} на основе выбранного поля',
    howTo: 'How to'
  },
  filterManager: {
    addFilter: 'Добавить фильтр'
  },
  datasetTitle: {
    showDataTable: 'Показать таблицу данных ',
    removeDataset: 'Удалить набор данных'
  },
  datasetInfo: {
    rowCount: '{rowCount} строк'
  },
  tooltip: {
    hideLayer: 'скрыть слой',
    showLayer: 'показать слой',
    hideFeature: 'Скрыть функцию',
    showFeature: 'Показать функцию',
    hide: 'скрыть',
    show: 'показать',
    removeLayer: 'Удалить слой',
    duplicateLayer: 'Дублировать слой',
    layerSettings: 'Настройки слоя',
    closePanel: 'Закрыть текущую панель',
    switchToDualView: 'Перейти в режим двойной карты',
    showLegend: 'Показать легенду',
    disable3DMap: 'Отключить 3D Карту',
    DrawOnMap: 'Рисовать на карте',
    selectLocale: 'Выберите регион',
    hideLayerPanel: 'Скрыть панель слоев',
    showLayerPanel: 'Показать панель слоев',
    moveToTop: 'Перейти к верхним слоям данных',
    selectBaseMapStyle: 'Выберите стиль базовой карты',
    delete: 'Удалить',
    timePlayback: 'Воспроизведение времени',
    cloudStorage: 'Облачное хранилище',
    '3DMap': '3D Карта',
    animationByWindow: 'Перемещение временного окна',
    animationByIncremental: 'Дополнительное временное окно',
    speed: 'скорость',
    play: 'проиграть',
    pause: 'пауза',
    reset: 'перезапустить'
  },
  toolbar: {
    exportImage: 'Экспорт изображения',
    exportData: 'Экспорт данных',
    exportMap: 'Экспорт карты',
    shareMapURL: 'Share Map URL',
    saveMap: 'Сохарнить Карту',
    select: 'Выбрать',
    polygon: 'Многоугольник',
    rectangle: 'Квадрат',
    hide: 'Скрыть',
    show: 'Показать',
    ...LOCALES
  },
  editor: {
    filterLayer: 'Слои фильтров',
    copyGeometry: 'Копировать геометрию'
  },

  modal: {
    title: {
      deleteDataset: 'Удалить данные',
      addDataToMap: 'Добавить данные на карту',
      exportImage: 'Экспорт изображения',
      exportData: 'Экспорт данных',
      exportMap: 'Экспорт карты',
      addCustomMapboxStyle: 'Добавить собственный стиль карты',
      saveMap: 'Поделиться Картой',
      shareURL: 'Поделиться URL'
    },
    button: {
      delete: 'Удалить',
      download: 'Скачать',
      export: 'Экспортировать',
      addStyle: 'Добавить стиль',
      save: 'Сохранить',
      defaultCancel: 'Отменить',
      defaultConfirm: 'Подтвердить'
    },
    exportImage: {
      ratioTitle: 'Ratio',
      ratioDescription: 'Выберите соотношение для различного использования',
      ratioOriginalScreen: 'Исходный экран',
      ratioCustom: 'Настройки',
      ratio4_3: '4:3',
      ratio16_9: '16:9',
      resolutionTitle: 'Разрешение',
      resolutionDescription: 'Для печати лучше использовать высокое разрешение',
      mapLegendTitle: 'Легенда карты',
      mapLegendAdd: 'Добавить легенду на карту'
    },
    exportData: {
      datasetTitle: 'Набор данных',
      datasetSubtitle: 'Выберите наборы данных, которые хотите экспортировать',
      allDatasets: 'Все',
      dataTypeTitle: 'Тип данных',
      dataTypeSubtitle: 'Выберите тип данных, которые вы хотите экспортировать',
      filterDataTitle: 'Отфильтрованные данные',
      filterDataSubtitle: 'Вы можете выбрать экспорт исходных данных или отфильтрованных данных',
      filteredData: 'Отфильтрованные данные',
      unfilteredData: 'Нефильтрованные данные',
      fileCount: '{fileCount} Файлов',
      rowCount: '{rowCount} Строк'
    },
    deleteData: {
      warning: 'вы собираетесь удалить этот набор данных. Это повлияет на {length} слой'
    },
    addStyle: {
      publishTitle:
        '2. Если вы указали URL-адрес файла mapbox на шаге 1, опубликуйте свой стиль на mapbox или предоставьте токен доступа. (Необязательно)',
      publishSubtitle1: 'Вы можете создать свой собственный стиль карты',
      publishSubtitle2: 'и',
      publishSubtitle3: 'опубликовать',
      publishSubtitle4: 'его.',
      publishSubtitle5: 'Чтобы использовать частный стиль, вставьте свой',
      publishSubtitle6: 'token доступа',
      publishSubtitle7:
        'прим. kepler.gl - это клиентское приложение, данные остаются в вашем браузере .',
      exampleToken: 'например pk.abcdefg.xxxxxx',
      pasteTitle: '1. Вставить URL стиля',
      pasteSubtitle0: 'URL стиля может быть mapbox',
      pasteSubtitle1: 'Или',
      pasteSubtitle2: 'URL стиля',
      pasteSubtitle3: 'style.json используя',
      pasteSubtitle4: 'Mapbox GL Style Spec',
      namingTitle: '3. Назови свой стиль'
    },
    shareMap: {
      shareUriTitle: 'Поделиться URL карты',
      shareUriSubtitle: 'Создать URL карты, чтобы поделиться с другими',
      cloudTitle: 'Облачное хранилище',
      cloudSubtitle: 'Войдите и загрузите данные карты в свое личное облачное хранилище',
      shareDisclaimer:
        'kepler.gl сохранит данные вашей карты в вашем личном облачном хранилище, только люди с URL-адресом могут получить доступ к вашей карте и данным. ' +
        'Вы можете редактировать / удалить файл данных в своей облачной учетной записи в любое время.',
      gotoPage: 'Перейти на страницу Kepler.gl {currentProvider}'
    },
    statusPanel: {
      mapUploading: 'Загрузка карты',
      error: 'Ошибка'
    },
    saveMap: {
      title: 'Облачное хранилище',
      subtitle: 'Авторизуйтесь, чтобы сохранить карту в вашем личном облачном хранилище'
    },
    exportMap: {
      formatTitle: 'Формат карты',
      formatSubtitle: 'Выберите формат для экспорта карты',
      html: {
        selection: 'Экспорт карты в интерактивный файл HTML.',
        tokenTitle: 'Токен доступа к Mapbox',
        tokenSubtitle: 'Используйте свой токен доступа Mapbox в html(необязательно)',
        tokenPlaceholder: 'Вставьте токен доступа Mapbox',
        tokenMisuseWarning:
          '* If you do not provide your own token, the map may fail to display at any time when we replace ours to avoid misuse. ',
        tokenDisclaimer:
          'Если вы не предоставите свой собственный токен, карта может не отображаться в любое время, когда мы заменяем наш, чтобы избежать неправильного использования.',
        tokenUpdate: 'Как обновить существующий токен карты.',
        modeTitle: 'Режим карты',
        modeSubtitle1: 'Выберите режим приложения. Подробнее',
        modeSubtitle2: 'Информация',
        modeDescription: 'Разрешить пользователям {mode} карту',
        read: 'чтение',
        edit: 'редактирование'
      },
      json: {
        configTitle: 'Конфигурация карты',
        configDisclaimer:
          'Конфигурация карты будет включена в файл Json. Если вы используете kepler.gl в своем собственном приложении. Вы можете скопировать этот конфиг и передать его ',
        selection:
          'Экспорт текущих данных карты и конфигурации в один файл Json. Позже вы сможете открыть ту же карту, загрузив этот файл на kepler.gl.',
        disclaimer:
          '* Конфигурация карты связана с загруженными наборами данных. DataId используется для привязки слоев, фильтров и всплывающих подсказок к определенному набору данных. ' +
          'При передаче этой конфигурации addDataToMap, убедитесь, что идентификатор набора данных совпадает с dataId / s в этой конфигурации.'
      }
    },
    loadingDialog: {
      loading: 'Загрузка...'
    },
    loadData: {
      upload: 'Загрузить файлы',
      storage: 'Загрузить из хранилища'
    },
    tripInfo: {
      title: 'Как включить анимацию поездки',
      description1:
        'Чтобы анимировать путь, данные geoJSON должны содержать LineString в своей геометрии объекта, а координаты в LineString должны иметь 4 элемента в форматах',
      code: ' [longitude, latitude, altitude, timestamp] ',
      description2:
        'с последним элементом, являющимся отметкой времени. Допустимые форматы меток времени включают unix в секундах, например 1564184363, или в миллисекундах, например 1564184363000',
      example: ',Пример:'
    },
    iconInfo: {
      title: 'Как рисовать значки',
      description1:
        'В вашем csv создайте столбец, поместите в него имя значка, который вы хотите нарисовать. Вы можете оставить ячейку пустой, если не хотите, чтобы значок отображался для некоторых точек. Когда столбец назван',
      code: 'значек',
      description2: ' kepler.gl автоматически создаст для вас слой значков.',
      example: 'Пример:',
      icons: 'Значки'
    },
    storageMapViewer: {
      lastModified: 'Последнее изменение {lastUpdated} назад',
      back: 'Назад'
    },
    overwriteMap: {
      title: 'Сохранение карты...',
      alreadyExists: 'уже существует в вашем {mapSaved}. Хотите его перезаписать?'
    },
    loadStorageMap: {
      back: 'Назад',
      goToPage: 'Перейти на страницу Kepler.gl {displayName}',
      storageMaps: 'Хранилище / Карты',
      noSavedMaps: 'Нет сохраненных карт'
    }
  },
  header: {
    visibleLayers: 'Видимые слои',
    layerLegend: 'Легенда слоя'
  },
  interactions: {
    tooltip: 'Подсказка',
    brush: 'Кисть',
    coordinate: 'Координаты',
    geocoder: 'Геокодер'
  },
  layerBlending: {
    title: 'Смешивание слоев',
    additive: 'добавление',
    normal: 'нормальное',
    subtractive: 'вычитание'
  },
  columns: {
    title: 'Столбцы',
    lat: 'lat',
    lng: 'lon',
    altitude: 'высота',
    icon: 'значек',
    geojson: 'geojson',
    token: 'token',
    arc: {
      lat0: 'lat источника',
      lng0: 'lng источника',
      lat1: 'lat цели',
      lng1: 'lng цели'
    },
    line: {
      alt0: 'высота источника',
      alt1: 'высота цели'
    },
    grid: {
      worldUnitSize: 'Размер сетки (km)'
    },
    hexagon: {
      worldUnitSize: 'Hexagon радиус (km)'
    },
    hex_id: 'hex id'
  },
  color: {
    customPalette: 'Ваша палитра',
    steps: 'шагов',
    type: 'тип',
    reversed: 'перевернуть'
  },
  scale: {
    colorScale: 'Цветовая шкала',
    sizeScale: 'Масштаб размера',
    strokeScale: 'Масштаб штриха',
    scale: 'Масштаб'
  },
  fileUploader: {
    message: 'Перетащите сюда ваши файлы',
    chromeMessage:
      '*Пользователь Chrome: ограничьте размер файла до 250 МБ, если нужно загрузить файл большего размера, попробуйте Safari',
    disclaimer:
      '*kepler.gl - это клиентское приложение без серверной части. Данные живут только на вашем компьютере. ' +
      'Никакая информация или данные карты не отправляются ни на один сервер.',
    configUploadMessage:
      'Загрузите {fileFormatNames} или сохраненную карту **Json**. Подробнее [**supported file formats**]',
    browseFiles: 'Просматреть файлы',
    uploading: 'Загрузка',
    fileNotSupported: 'File {errorFiles} is not supported.',
    or: 'or'
  },
  geocoder: {
    title: 'Введите адрес или координаты, например 37.79, -122.40'
  },
  fieldSelector: {
    clearAll: 'Очистить все',
    formatting: 'Форматирование'
  },
  compare: {
    modeLabel: 'Режим сравнения',
    typeLabel: 'Тип сравнения',
    types: {
      absolute: 'Абсолютный',
      relative: 'Относительный'
    }
  },
  mapPopover: {
    primary: 'Первичный'
  },
  density: 'density',
  'Bug Report': 'Отчет об ошибках',
  'User Guide': 'Инструкции',
  Save: 'Сохранить',
  Share: 'Поделиться'
};
