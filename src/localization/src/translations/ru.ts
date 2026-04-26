// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LOCALES} from '../locales';

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
    empty: 'пустой',
    selectLayer: 'Выберите слой'
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
    '3dBuilding': '3d здания',
    background: 'Фон'
  },
  panel: {
    text: {
      label: 'Ярлык',
      labelWithId: 'Ярлык {labelId}',
      fontSize: 'Размер шрифта',
      fontColor: 'Цвет шрифта',
      backgroundColor: 'Цвет фона',
      textAnchor: 'Анкор текста',
      alignment: 'Положение',
      addMoreLabel: 'Добавить еще ярлык',
      outlineWidth: 'Ширина контура',
      outlineColor: 'Цвет контура'
    }
  },
  sidebar: {
    panels: {
      layer: 'Слои',
      filter: 'Фильтры',
      interaction: 'Взаимодействия',
      basemap: 'Базовая карта'
    },
    panelViewToggle: {
      list: 'Просмотр списком',
      byDataset: 'Просмотр по набору данных'
    }
  },
  layer: {
    required: 'Требования*',
    columnModesSeparator: 'Или',
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
    basic: 'Базовый',
    trailLength: 'Длина следа',
    trailLengthDescription: 'Количество секунд для полного затухания пути',
    newLayer: 'новый слой',
    elevationByDescription: 'При выключении высота основана на количестве точек',
    colorByDescription: 'При выключении цвет основан на количестве точек',
    aggregateBy: 'Агрегировать {field} по',
    '3DModel': '3D Модель',
    '3DModelOptions': 'Настройки 3D модели',
    service: 'Сервис',
    layer: 'Слой',
    appearance: 'Внешний вид',
    uniqueIdField: 'Поле уникального ID',
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
      '3d': '3D',
      vectortile: 'векторный тайл',
      rastertile: 'растровый тайл',
      wms: 'WMS',
      tile3d: '3D тайл'
    },
    wms: {
      hover: 'Значение:'
    },
    layerUpdateError:
      'Произошла ошибка при обновлении слоя: {errorMessage}. Убедитесь, что формат входных данных корректен.',
    interaction: 'Взаимодействие',
    heatmap: 'Heatmap',
    aggregation: 'Aggregation'
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
    billboard: 'Режим билборда',
    billboardDescription: 'Ориентировать геометрию на камеру',
    fadeTrail: 'Затухающий след',
    opacity: 'Непрозрачность',
    pointSize: 'Размер точки',
    coverage: 'Покрытие',
    outline: 'Контур',
    colorRange: 'Цветовая гамма',
    stroke: 'Обводка',
    strokeColor: 'Цвет обводки',
    strokeColorRange: 'Обводка Цветовой диапазон',
    targetColor: 'Целевой цвет',
    colorAggregation: 'Цветовая агрегация',
    heightAggregation: 'Агрегация по высоте',
    weightAggregation: 'Weight Aggregation',
    resolutionRange: 'Диапазон разрешения',
    sizeScale: 'Шкала размеров',
    worldUnitSize: 'Мировые ед.изм.',
    elevationScale: 'Шкала возвышения',
    enableElevationZoomFactor: 'Использовать коэффициент увеличения по высоте',
    enableElevationZoomFactorDescription:
      'Отрегулируйте высоту / возвышение на основе текущего коэффициента масштабирования',
    enableHeightZoomFactor: 'Использовать коэффициент масштабирования по высоте',
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
    intensity: 'Intensity',
    threshold: 'Threshold',
    zoomScale: 'Масштаб увеличения',
    heightRange: 'Диапазон высоты',
    heightMultiplier: 'Множитель высоты',
    fixedHeight: 'Фиксированная высота',
    fixedHeightDescription: 'Использовать высоту без изменений',
    allowHover: 'Показать подсказку',
    allowHoverDescription: 'Показать или скрыть подсказку при наведении на элементы слоя',
    showNeighborOnHover: 'Выделять соседей при наведении',
    showHighlightColor: 'Показать цвет выделения',
    darkModeEnabled: 'Темная базовая карта',
    transparentBackground: 'Прозрачный фон'
  },
  layerManager: {
    addData: 'Добавить данные',
    addLayer: 'Добавить слой',
    layerBlending: 'Смешивание слоев',
    overlayBlending: 'Наложение слоев'
  },
  mapManager: {
    mapStyle: 'Стиль карты',
    addMapStyle: 'Добавить стиль карты',
    '3dBuildingColor': '3D Цвет здания',
    backgroundColor: 'Цвет фона'
  },
  effectManager: {
    effects: 'Эффекты',
    addEffect: 'Добавить эффект',
    pickDateTime: 'Выбрать дату/время',
    currentTime: 'Текущее время',
    pickCurrrentTime: 'Выбрать текущее время',
    date: 'Дата',
    time: 'Время',
    timezone: 'Часовой пояс'
  },
  effectDescription: {
    lightAndShadow:
      'Имитирует реалистичное солнечное освещение и отбрасывание теней на основе времени суток и географического положения. Регулируемая интенсивность теней, цвета солнечного и рассеянного света.',
    ink: 'Применяет художественный стиль тушевой заливки, затемняющий края и создающий рукописный вид. Регулируйте силу для управления интенсивностью эффекта.',
    brightnessContrast:
      'Регулирует общую яркость и контрастность карты. Используйте положительные значения для увеличения яркости или контраста, отрицательные — для затемнения или выравнивания изображения.',
    hueSaturation:
      'Сдвигает цветовой тон и регулирует насыщенность по всей карте. Полезно для создания цветовых тем или обесцвечивания вида.',
    vibrance:
      'Избирательно усиливает интенсивность приглушённых цветов, не перенасыщая уже яркие. Создаёт более естественное улучшение цвета, чем насыщенность.',
    sepia:
      'Применяет тёплый коричневатый тон, напоминающий старые фотографии. Регулируйте степень смешивания между исходными цветами и эффектом сепии.',
    dotScreen:
      'Преобразует изображение в узор из монохромных точек, напоминающий газетную полутоновую печать. Регулируйте угол, размер точек и положение центра.',
    colorHalftone:
      'Имитирует цветную полутоновую печать CMYK с отдельными точечными узорами для каждого цветового канала. Управляйте углом, размером точек и положением центра.',
    noise:
      'Добавляет случайный шум в стиле плёночного зерна по всей карте. Полезно для текстурированной аналоговой эстетики или уменьшения цветовых полос.',
    triangleBlur:
      'Равномерно применяет плавное размытие по Гауссу по всей карте. Управляйте радиусом размытия для настройки уровня мягкости.',
    zoomBlur:
      'Создаёт радиальное размытие движения из центральной точки, имитируя зум камеры. Регулируйте силу и положение центра.',
    tiltShift:
      'Имитирует эффект объектива тилт-шифт, размывающий области за пределами фокусной полосы и создающий вид миниатюрной модели. Задайте фокусную полосу начальной и конечной позициями.',
    edgeWork:
      'Выделяет структурные края изображения в художественном стиле угольного эскиза. Регулируйте радиус обнаружения для управления толщиной линий.',
    vignette:
      'Затемняет углы и края карты, направляя внимание к центру. Управляйте степенью затемнения и радиусом чистой области.',
    magnify:
      'Создаёт круглое наложение увеличительного стекла в настраиваемом положении. Регулируйте размер, уровень масштабирования и ширину рамки.',
    hexagonalPixelate:
      'Заменяет изображение сеткой шестиугольных плиток, каждая из которых заполнена средним цветом покрываемой области. Регулируйте масштаб плиток.',
    distanceFog:
      'Затуманивает удалённые объекты на основе их глубины от камеры, усиливая ощущение глубины. Управляйте плотностью, начальным расстоянием, диапазоном и цветом тумана.',
    surfaceFog:
      'Отрисовывает слой тумана на определённой высоте над поверхностью рельефа. Настройте высоту, толщину перехода, плотность, цвет и необязательный шумовой паттерн.'
  },
  layerConfiguration: {
    defaultDescription: 'Рассчитать {property} на основе выбранного поля',
    howTo: 'Как использовать',
    showColorChart: 'Показать цветовую диаграмму',
    hideColorChart: 'Скрыть цветовую диаграмму'
  },
  filterManager: {
    addFilter: 'Добавить фильтр',
    timeFilterSync: 'Синхронизированные наборы данных',
    timeLayerSync: 'Привязать к временной шкале слоя',
    timeLayerUnsync: 'Отвязать от временной шкалы слоя',
    column: 'Столбец'
  },
  datasetTitle: {
    showDataTable: 'Показать таблицу данных ',
    removeDataset: 'Удалить набор данных'
  },
  datasetInfo: {
    rowCount: '{rowCount} строк',
    vectorTile: 'Векторный тайл',
    rasterTile: 'Растровый тайл',
    wmsTile: 'WMS тайл',
    tile3d: '3D тайл'
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
    showAiAssistantPanel: 'Показать панель AI Assistant',
    hideAiAssistantPanel: 'Скрыть панель AI Assistant',
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
    reset: 'перезапустить',
    export: 'экспорт',
    resetAfterError: 'Попытаться включить слой после ошибки',
    zoomToLayer: 'Приблизить к слою',
    removeBaseMapStyle: 'Удалить стиль базовой карты',
    timeFilterSync: 'Синхронизировать со столбцом из другого набора данных',
    syncTimelineStart: 'Начало текущего периода фильтра',
    syncTimelineEnd: 'Конец текущего периода фильтра',
    showEffectPanel: 'Показать панель эффектов',
    hideEffectPanel: 'Скрыть панель эффектов',
    removeEffect: 'Удалить эффект',
    disableEffect: 'Отключить эффект',
    effectSettings: 'Настройки эффекта',
    timeLayerSync: 'Привязать к временной шкале слоя',
    timeLayerUnsync: 'Отвязать от временной шкалы слоя'
  },
  toolbar: {
    exportImage: 'Экспорт изображения',
    exportData: 'Экспорт данных',
    exportMap: 'Экспорт карты',
    shareMapURL: 'Поделиться URL карты',
    exportVideo: 'Экспорт видео',
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
    filterLayerDisabled: 'Неполигональные геометрии нельзя использовать для фильтрации',
    copyGeometry: 'Копировать геометрию',
    noLayersToFilter: 'Нет слоев для фильтрации'
  },
  exportVideoModal: {
    animation: 'Анимация',
    settings: 'Настройки'
  },

  modal: {
    title: {
      deleteDataset: 'Удалить данные',
      addDataToMap: 'Добавить данные на карту',
      exportImage: 'Экспорт изображения',
      exportData: 'Экспорт данных',
      exportMap: 'Экспорт карты',
      exportVideo: 'Экспорт видео',
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
      resolutionPlaceholder: 'Выберите разрешение...',
      mapLegendTitle: 'Легенда карты',
      mapLegendAdd: 'Добавить легенду на карту'
    },
    exportVideo: {
      animation: 'Анимация',
      settings: 'Настройки'
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
      rowCount: '{rowCount} Строк',
      tiledDatasetWarning: "* Экспорт данных для тайловых наборов данных не поддерживается"
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
      title: 'Поделиться картой',
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
        tokenSecurityWarning:
          '* Предупреждение: ваш токен Mapbox будет встроен в экспортированный HTML-файл. Любой, кто имеет доступ к этому файлу, сможет увидеть и использовать ваш токен. По возможности используйте токен с ограничением по URL. ',
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
      tileset: 'Набор тайлов',
      storage: 'Загрузить из хранилища'
    },
    tripInfo: {
      title: 'Как включить анимацию поездки',
      titleTable: 'Создать поездки из списка точек',
      description1:
        'Чтобы анимировать путь, данные geoJSON должны содержать LineString в своей геометрии объекта, а координаты в LineString должны иметь 4 элемента в форматах',
      code: ' [longitude, latitude, altitude, timestamp] ',
      description2:
        'с последним элементом, являющимся отметкой времени. Допустимые форматы меток времени включают unix в секундах, например 1564184363, или в миллисекундах, например 1564184363000',
      descriptionTable1:
        'Поездки можно создать, соединив список точек по широте и долготе, отсортировав по временным меткам и сгруппировав по уникальным идентификаторам.',
      example: ',Пример:',
      exampleTable: 'Example Csv'
    },
    polygonInfo: {
      title: 'Создать слой полигонов из объекта GeoJSON',
      titleTable: 'Создать путь из точек',
      descriptionTable: `Пути можно создать, соединив список точек по широте и долготе, отсортировав по индексному полю (например, временная метка) и сгруппировав по уникальным идентификаторам.

  ### Столбцы слоя:
  - **id**: - *обязательный*&nbsp;- Столбец \`id\` используется для группировки точек. Точки с одинаковым id будут объединены в один путь.
  - **lat**: - *обязательный*&nbsp;- Широта точки
  - **lon**: - *обязательный*&nbsp;- Долгота точки
  - **alt**: - *необязательный*&nbsp;- Высота точки
  - **sort by**: - *необязательный*&nbsp;- Столбец \`sort by\` используется для сортировки точек; если не указан, точки будут отсортированы по индексу строки.
`,
      exampleTable: 'Example CSV'
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
      noSavedMaps: 'Нет сохраненных карт',
      foursquareStorageMessage:
        'Здесь отображаются только карты, сохраненные с помощью опции Kepler.gl > Сохранить > Хранилище Foursquare'
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
  overlayBlending: {
    title: 'Наложение слоев карты',
    description: 'Смешивание слоев с базовой картой, чтобы оба были видны.',
    screen: 'темная базовая карта',
    normal: 'обычный',
    darken: 'светлая базовая карта'
  },
  columns: {
    title: 'Столбцы',
    lat: 'lat',
    lng: 'lon',
    altitude: 'высота',
    alt: 'высота',
    id: 'id',
    timestamp: 'время',
    icon: 'значек',
    geojson: 'geojson',
    geoarrow: 'geoarrow',
    geoarrow0: 'geoarrow источник',
    geoarrow1: 'geoarrow назначение',
    token: 'token',
    sortBy: 'сортировать по',
    neighbors: 'соседи',
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
    colorBlindSafe: 'Для дальтоников',
    reversed: 'перевернуть',
    disableStepReason: "Невозможно изменить количество шагов с пользовательскими цветовыми переходами, используйте пользовательскую палитру для редактирования шагов",
    preset: 'Предустановленные цвета',
    picker: 'Выбор цвета'
  },
  scale: {
    colorScale: 'Цветовая шкала',
    sizeScale: 'Масштаб размера',
    strokeScale: 'Масштаб штриха',
    strokeColorScale: 'Шкала цвета обводки',
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
    fileNotSupported: 'Файл {errorFiles} не поддерживается.',
    or: 'или'
  },
  tilesetSetup: {
    header: 'Настройка векторных тайлов',
    rasterTileHeader: 'Настройка растровых тайлов',
    addTilesetText: 'Добавить набор тайлов'
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
  density: 'плотность',
  'Bug Report': 'Отчет об ошибках',
  'User Guide': 'Инструкции',
  Save: 'Сохранить',
  Share: 'Поделиться',
  mapLegend: {
    layers: {
      line: {
        singleColor: {
          sourceColor: 'Source',
          targetColor: 'Target'
        }
      },
      arc: {
        singleColor: {
          sourceColor: 'Source',
          targetColor: 'Target'
        }
      },
      default: {
        singleColor: {
          color: 'Fill color',
          strokeColor: 'Outline'
        }
      }
    }
  }
};
