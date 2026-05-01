// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LOCALES} from '../locales';

export default {
  property: {
    weight: 'peso',
    label: 'etiqueta',
    fillColor: 'color de relleno',
    color: 'color',
    coverage: 'cobertura',
    strokeColor: 'color de trazo',
    radius: 'radio',
    outline: 'contorno',
    stroke: 'trazo',
    density: 'densidad',
    height: 'altura',
    sum: 'suma',
    pointCount: 'Recuento de puntos'
  },
  placeholder: {
    search: 'Busqueda',
    selectField: 'Selecciona un campo',
    yAxis: 'Eje Y',
    selectType: 'Selecciona un Tipo',
    selectValue: 'Selecciona un Valor',
    enterValue: 'Entra un valor',
    empty: 'vacio',
    selectLayer: 'Selecciona una capa'
  },
  misc: {
    by: '',
    valuesIn: 'Valores en',
    valueEquals: 'Valor igual a',
    dataSource: 'Fuente de datos',
    brushRadius: 'Radio del pincel (km)',
    empty: ' '
  },
  mapLayers: {
    title: 'Capas del mapa',
    label: 'Etiqueta',
    road: 'Carretera',
    border: 'Frontera',
    building: 'Edificio',
    water: 'Agua',
    land: 'Tierra',
    '3dBuilding': 'Edificio 3D',
    background: 'Fondo'
  },
  panel: {
    text: {
      label: 'etiqueta',
      labelWithId: 'Etiqueta {labelId}',
      fontSize: 'Tamaño de fuente',
      fontColor: 'Color de fuente',
      backgroundColor: 'Color de fondo',
      textAnchor: 'Anclaje del texto',
      alignment: 'Alineación',
      addMoreLabel: 'Añadir más etiquetas',
      outlineWidth: 'Ancho del contorno',
      outlineColor: 'Color del contorno'
    }
  },
  sidebar: {
    panels: {
      layer: 'Capas',
      filter: 'Filtros',
      interaction: 'Interacciones',
      basemap: 'Mapa base'
    },
    panelViewToggle: {
      list: 'Ver Lista',
      byDataset: 'Ver por Conjunto de datos'
    }
  },
  layer: {
    required: 'Requerido*',
    columnModesSeparator: 'O',
    radius: 'Radio',
    color: 'Color',
    fillColor: 'Color de relleno',
    outline: 'Contorno',
    weight: 'Grueso',
    propertyBasedOn: '{property} basado en',
    coverage: 'Cobertura',
    stroke: 'Trazo',
    strokeWidth: 'Grosor de trazo',
    strokeColor: 'Color de trazo',
    basic: 'Básico',
    trailLength: 'Longitud de pista',
    trailLengthDescription: 'Numero de segundos hasta que desaparezca el camino',
    newLayer: 'nueva capa',
    elevationByDescription: 'Si desactivado, la altura se basa en el recuento de puntos',
    colorByDescription: 'Si desactivado, el color se basa en el recuento de puntos',
    aggregateBy: '{field} agregado por',
    '3DModel': 'Modelo 3D',
    '3DModelOptions': 'Opciones del modelo 3D',
    service: 'Servicio',
    layer: 'Capa',
    appearance: 'Apariencia',
    uniqueIdField: 'Campo ID único',
    type: {
      point: 'punto',
      arc: 'arco',
      line: 'línea',
      grid: 'malla',
      hexbin: 'hexbin',
      polygon: 'polígono',
      geojson: 'geojson',
      cluster: 'cluster',
      icon: 'icono',
      heatmap: 'concentración',
      hexagon: 'hexágono',
      hexagonid: 'H3',
      trip: 'viaje',
      s2: 'S2',
      '3d': '3D',
      flow: 'flow',
      vectortile: 'mosaico vectorial',
      rastertile: 'mosaico ráster',
      wms: 'WMS',
      tile3d: 'mosaico 3D'
    },
    wms: {
      hover: 'Valor:'
    },
    layerUpdateError:
      'Se produjo un error durante la actualización de la capa: {errorMessage}. Asegúrese de que el formato de los datos de entrada sea válido.',
    interaction: 'Interacción',
    heatmap: 'Heatmap',
    aggregation: 'Aggregation'
  },
  layerVisConfigs: {
    angle: 'Ángulo',
    strokeWidth: 'Ancho del trazo',
    strokeWidthRange: 'Rango del ancho del trazo',
    radius: 'Radio',
    fixedRadius: 'Radio fijo a medir',
    fixedRadiusDescription: 'Ajustar el radio al radio absoluto en metros, p.e. 5 a 5 metros',
    radiusRange: 'Rango de radio',
    clusterRadius: 'Radio del cluster en píxeles',
    radiusRangePixels: 'Rango del radio en píxeles',
    billboard: 'Modo cartelera',
    billboardDescription: 'Oriente la geometría hacia la cámara',
    fadeTrail: 'Sendero de desvanecimiento',
    opacity: 'Opacidad',
    pointSize: 'Tamaño del punto',
    coverage: 'Cobertura',
    outline: 'Contorno',
    colorRange: 'Rango de color',
    stroke: 'Trazo',
    strokeColor: 'Color de trazo',
    strokeColorRange: 'Rango de color de trazo',
    targetColor: 'Color destino',
    colorAggregation: 'Agregación de color',
    heightAggregation: 'Agregación de la altura',
    weightAggregation: 'Weight Aggregation',
    resolutionRange: 'Rango de resolución',
    sizeScale: 'Medida de escala',
    worldUnitSize: 'Medida de la unidad mundial',
    elevationScale: 'Escala de elevación',
    enableElevationZoomFactor: 'Usar factor de zoom de elevación',
    enableElevationZoomFactorDescription:
      'Ajuste la altura / elevación según el factor de zoom actual',
    enableHeightZoomFactor: 'Usar factor de zoom de altura',
    heightScale: 'Escala de altura',
    coverageRange: 'Rango de cobertura',
    highPrecisionRendering: 'Representación de alta precisión',
    highPrecisionRenderingDescription: 'La precisión alta tendrá un rendimiento más bajo',
    height: 'Altura',
    heightDescription:
      'Haz clic en el botón de arriba a la derecha del mapa per cambiar a vista 3D',
    fill: 'Rellenar',
    enablePolygonHeight: 'Activar la altura del polígono',
    showWireframe: 'Muestra esquemàtico',
    weightIntensity: 'Intensidad de peso',
    intensity: 'Intensity',
    threshold: 'Threshold',
    zoomScale: 'Escala de zoom',
    heightRange: 'Rango de alturas',
    heightMultiplier: 'Multiplicador de altura',
    fixedHeight: 'Altura fija',
    fixedHeightDescription: 'Usar altura sin modificaciones',
    allowHover: 'Mostrar descripción emergente',
    allowHoverDescription:
      'Mostrar u ocultar información emergente al pasar el cursor sobre las características de la capa',
    flow: {
      fade: 'Desvanecimiento',
      fadeEnabled: 'Desvanecimiento',
      fadeAmount: 'Cantidad de desvanecimiento',
      display: 'Visualización',
      renderingMode: 'Estilo de línea',
      renderingModes: {
        straight: 'Recta',
        curved: 'Curva',
        'animated-straight': 'Animada'
      },
      adaptiveScalesEnabled: 'Escalas adaptativas',
      clusteringEnabled: 'Agrupación',
      lineThicknessScale: 'Grosor de línea',
      lineCurviness: 'Curvatura',
      locationTotalsEnabled: 'Totales de ubicación',
      maxTopFlowsDisplayNum: 'Máx. flujos principales'
    },
    showNeighborOnHover: 'Resaltar vecinos al pasar el cursor',
    showHighlightColor: 'Mostrar color de resaltado',
    darkModeEnabled: 'Mapa base oscuro',
    transparentBackground: 'Fondo transparente'
  },
  layerManager: {
    addData: 'Añadir datos',
    addLayer: 'Añadir capa',
    layerBlending: 'Combinar capas',
    overlayBlending: 'Combinación de superposición'
  },
  mapManager: {
    mapStyle: 'Estilo de mapa',
    addMapStyle: 'Añadir estilo de mapa',
    '3dBuildingColor': 'Color edificios 3D',
    backgroundColor: 'Color de fondo'
  },
  effectManager: {
    effects: 'Efectos',
    addEffect: 'Añadir efecto',
    pickDateTime: 'Seleccionar fecha/hora',
    currentTime: 'Hora actual',
    pickCurrrentTime: 'Seleccionar hora actual',
    date: 'Fecha',
    time: 'Hora',
    timezone: 'Zona horaria'
  },
  effectDescription: {
    lightAndShadow:
      'Simula iluminación solar realista y proyección de sombras basada en la hora del día y la ubicación geográfica. Intensidad de sombra, colores de luz solar y ambiental ajustables.',
    ink: 'Aplica un estilo artístico de tinta que oscurece los bordes y crea una apariencia dibujada a mano. Ajusta la intensidad para controlar el efecto.',
    brightnessContrast:
      'Ajusta el brillo y contraste generales del mapa. Usa valores positivos para aumentar el brillo o el contraste, valores negativos para oscurecer o aplanar la imagen.',
    hueSaturation:
      'Cambia el tono de color y ajusta la saturación en todo el mapa. Útil para crear temas de color o desaturar la vista.',
    vibrance:
      'Aumenta selectivamente la intensidad de los colores apagados sin sobresaturar los ya vivos. Produce una mejora de color más natural que la saturación.',
    sepia:
      'Aplica un tono marrón cálido reminiscente de fotografías antiguas. Controla la cantidad para mezclar entre los colores originales y el aspecto sepia.',
    dotScreen:
      'Convierte la imagen en un patrón de puntos monocromos, similar a la impresión de semitonos de periódico. Ajusta el ángulo, el tamaño de los puntos y la posición central.',
    colorHalftone:
      'Simula la impresión de semitonos de color CMYK con patrones de puntos separados para cada canal de color. Controla el ángulo, el tamaño de los puntos y la posición central.',
    noise:
      'Añade ruido aleatorio estilo grano de película al mapa. Útil para una estética texturizada y analógica o para reducir el banding de color.',
    triangleBlur:
      'Aplica un desenfoque suave de tipo gaussiano uniformemente en el mapa. Controla el radio de desenfoque para ajustar el nivel de suavidad.',
    zoomBlur:
      'Crea un desenfoque de movimiento radial que emana de un punto central, simulando un zoom de cámara. Ajusta la intensidad y la posición central.',
    tiltShift:
      'Simula un efecto de lente tilt-shift que desenfoca las áreas fuera de una banda focal, creando un aspecto de maqueta en miniatura. Establece la banda focal con posiciones de inicio/fin.',
    edgeWork:
      'Resalta los bordes estructurales de la imagen usando un estilo artístico de dibujo al carbón. Ajusta el radio de detección para controlar el grosor de la línea.',
    vignette:
      'Oscurece las esquinas y bordes del mapa, dirigiendo la atención hacia el centro. Controla la cantidad de oscurecimiento y el radio del área clara.',
    magnify:
      'Crea una superposición de lupa circular en una posición configurable. Ajusta el tamaño, el nivel de zoom y el ancho del borde.',
    hexagonalPixelate:
      'Reemplaza la imagen con una cuadrícula de mosaicos hexagonales, cada uno relleno con el color promedio del área que cubre. Ajusta la escala del mosaico.',
    distanceFog:
      'Desvanece los objetos distantes en un color de niebla basado en su profundidad desde la cámara, mejorando la sensación de profundidad. Controla la densidad, la distancia de inicio, el rango y el color de la niebla.',
    surfaceFog:
      'Renderiza una capa de niebla a una elevación específica sobre la superficie del terreno. Ajusta la elevación, el grosor de transición, la densidad, el color y un patrón de ruido opcional.'
  },
  layerConfiguration: {
    defaultDescription: 'Calcular {property} según el campo seleccionado',
    howTo: 'Cómo funciona',
    showColorChart: 'Mostrar gráfico de colores',
    hideColorChart: 'Ocultar gráfico de colores'
  },
  filterManager: {
    addFilter: 'Añadir filtro',
    timeFilterSync: 'Conjuntos sincronizados',
    timeLayerSync: 'Vincular con la línea de tiempo de la capa',
    timeLayerUnsync: 'Desvincular de la línea de tiempo de la capa',
    column: 'Columna'
  },
  datasetTitle: {
    showDataTable: 'Mostar la tabla de datos',
    removeDataset: 'Eliminar conjunto de datos'
  },
  datasetInfo: {
    rowCount: '{rowCount} filas',
    vectorTile: 'Mosaico vectorial',
    rasterTile: 'Mosaico ráster',
    wmsTile: 'Mosaico WMS',
    tile3d: 'Mosaico 3D'
  },
  tooltip: {
    hideLayer: 'Ocultar la capa',
    showLayer: 'Mostrar la capa',
    hideFeature: 'Ocultar el objeto',
    showFeature: 'Mostrar el objeto',
    hide: 'Ocultar',
    show: 'Mostrar',
    removeLayer: 'Eliminar capa',
    duplicateLayer: 'Duplicar capa',
    zoomToLayer: 'Zoom a la capa',
    resetAfterError: 'Intente habilitar la capa después de un error',
    layerSettings: 'Configuración de capa',
    closePanel: 'Cerrar el panel actual',
    switchToDualView: 'Cambiar a la vista de mapa dual',
    showLegend: 'Mostrar leyenda',
    disable3DMap: 'Desactivar mapa 3D',
    DrawOnMap: 'Dibujar en el mapa',
    selectLocale: 'Seleccionar configuración regional',
    showAiAssistantPanel: 'Mostrar el panel de AI Assistant',
    hideAiAssistantPanel: 'Ocultar el panel de AI Assistant',
    hideLayerPanel: 'Ocultar la tabla de capas',
    showLayerPanel: 'Mostrar la tabla  de capas',
    moveToTop: 'Desplazar arriba de las capas de datos',
    selectBaseMapStyle: 'Seleccionar estilo de mapa base',
    removeBaseMapStyle: 'Eliminar estilo de mapa base',
    delete: 'Borrar',
    timePlayback: 'Reproducción de tiempo',
    timeFilterSync: 'Sincronizar con una columna de otro conjunto de datos',
    cloudStorage: 'Almacenaje en la nube',
    '3DMap': 'Mapa 3D',
    animationByWindow: 'Ventana Temporal Móvil',
    animationByIncremental: 'Ventana Temporal Incremental',
    speed: 'velocidad',
    play: 'iniciar',
    pause: 'pausar',
    reset: 'reiniciar',
    export: 'exportar',
    timeLayerSync: 'Vincular con la línea de tiempo de la capa',
    timeLayerUnsync: 'Desvincular de la línea de tiempo de la capa',
    syncTimelineStart: 'Inicio del período de tiempo del filtro actual',
    syncTimelineEnd: 'Fin del período de tiempo del filtro actual',
    showEffectPanel: 'Mostrar panel de efectos',
    hideEffectPanel: 'Ocultar panel de efectos',
    removeEffect: 'Eliminar efecto',
    disableEffect: 'Desactivar efecto',
    effectSettings: 'Configuración de efecto'
  },
  toolbar: {
    exportImage: 'Exportar imagen',
    exportData: 'Exportar datos',
    exportMap: 'Exportar mapa',
    exportVideo: 'Exportar Vídeo',
    shareMapURL: 'Compartir el enlace del mapa',
    saveMap: 'Guardar mapa',
    select: 'selecciona',
    polygon: 'polígono',
    rectangle: 'rectángulo',
    hide: 'esconder',
    show: 'mostrar',
    ...LOCALES
  },
  editor: {
    filterLayer: 'Filtrar capas',
    filterLayerDisabled: 'Las geometrías no poligonales no se pueden usar para filtrar',
    copyGeometry: 'Copiar geometría',
    noLayersToFilter: 'No hay capas para filtrar'
  },
  exportVideoModal: {
    animation: 'Animación',
    settings: 'Configuración'
  },
  modal: {
    title: {
      deleteDataset: 'Borrar conjunto de datos',
      addDataToMap: 'Añadir datos al mapa',
      exportImage: 'Exportar imagen',
      exportData: 'Exportar datos',
      exportMap: 'Exportar mapa',
      exportVideo: 'Exportar Vídeo',
      addCustomMapboxStyle: 'Añadir estilo de Mapbox propio',
      saveMap: 'Guardar mapa',
      shareURL: 'Compartir enlace'
    },
    button: {
      delete: 'Borrar',
      download: 'Descargar',
      export: 'Exportar',
      addStyle: 'Añadir estilo',
      save: 'Guardar',
      defaultCancel: 'Cancelar',
      defaultConfirm: 'Confirmar'
    },
    exportImage: {
      ratioTitle: 'Ratio',
      ratioDescription: 'Esoger ratio por diversos usos.',
      ratioOriginalScreen: 'Pantalla original',
      ratioCustom: 'Personalizado',
      ratio4_3: '4:3',
      ratio16_9: '16:9',
      resolutionTitle: 'Resolución',
      resolutionDescription: 'Una alta resolución es mejor para las impresiones.',
      resolutionPlaceholder: 'Seleccionar resolución...',
      mapLegendTitle: 'Leyenda del mapa',
      mapLegendAdd: 'Añadir leyenda al mapa'
    },
    exportVideo: {
      animation: 'Animación',
      settings: 'Configuración'
    },
    exportData: {
      datasetTitle: 'Conjunto de datos',
      datasetSubtitle: 'Escoger los conjuntos de datos a exportar',
      allDatasets: 'Todos',
      dataTypeTitle: 'Tipo de datos',
      dataTypeSubtitle: 'Escoger el tipo de datos a exportar',
      filterDataTitle: 'Filtrar datos',
      filterDataSubtitle: 'Se puede escoger exportar los datos originales o filtrados',
      filteredData: 'Datos filtrados',
      unfilteredData: 'Datos sin filtrar',
      fileCount: '{fileCount} Archivos',
      rowCount: '{rowCount} Filas',
      tiledDatasetWarning:
        '* La exportación de datos para conjuntos de datos en mosaico no es compatible'
    },
    deleteData: {
      warning: 'estás a punto de borrar este conjunto de datos. Afectará a {length} capas'
    },
    addStyle: {
      publishTitle: '1. Publicar tu estilo en Mapbox o proporcionar el token de acceso',
      publishSubtitle1: 'Puedes crear el tu propio estilo de mapa en',
      publishSubtitle2: 'y',
      publishSubtitle3: 'publicar',
      publishSubtitle4: 'lo.',
      publishSubtitle5: 'Para utilizar un estilo privado, engancha tu',
      publishSubtitle6: 'token de acceso',
      publishSubtitle7:
        'aquí. *kepler.gl es una aplicación cliente, los datos quedan en tu navegador..',
      exampleToken: 'p.e. pk.abcdefg.xxxxxx',
      pasteTitle: '2. Engancha el enlace del estilo',
      pasteSubtitle0: 'La URL del estilo puede ser de Mapbox',
      pasteSubtitle1: 'Qué es un',
      pasteSubtitle2: 'enlace del estilo',
      pasteSubtitle3: 'o un style.json que use la',
      pasteSubtitle4: 'especificación de estilos de Mapbox GL',
      namingTitle: '3. Poner nombre a tu estilo'
    },
    shareMap: {
      title: 'Compartir mapa',
      shareUriTitle: 'Compartir el enlace del mapa',
      shareUriSubtitle: 'Generar un enlace del mapa para compartir con otros',
      cloudTitle: 'Almacenage en la nube',
      cloudSubtitle: 'Acceder y cargar datos del mapa a tu almacenage a la nube personal',
      shareDisclaimer:
        'kepler.gl guardará los datos del mapa en el almacenage de tu nube personal, sólo quien tenga el enlace podra acceder al mapa y a los datos . ' +
        'Puedes editar/borrar el archivo de datos en tu cuenta en la nube en cualquier momento.',
      gotoPage: 'Ves a la página de {currentProvider} de Kepler.gl'
    },
    statusPanel: {
      mapUploading: 'Cargar un mapa',
      error: 'Error'
    },
    saveMap: {
      title: 'Almacentage en la nube',
      subtitle: 'Acceder para guardar el mapa en teu almacenage en la nube'
    },
    exportMap: {
      formatTitle: 'Formato de mapa',
      formatSubtitle: 'Escoger el formato al que se desea exportar el mapa',
      html: {
        selection: 'Exportar tu mapa como un archivo HTML interactivo.',
        tokenTitle: 'Token de acceso de Mapbox',
        tokenSubtitle: 'Utilizar tu token de acceso a Mapbox al archivo HTML (opcional)',
        tokenPlaceholder: 'Enganchar tu token de acceso a Mapbox',
        tokenMisuseWarning:
          '* Si no proporcionas tu propio token, el mapa podría fallar en cualquier momento cuando reemplacemos nuestro token para evitar abusos. ',
        tokenSecurityWarning:
          '* Advertencia: su token de Mapbox se incrustará en el archivo HTML exportado. Cualquier persona con acceso a este archivo podrá ver y usar su token. Utilice un token con restricciones de URL cuando sea posible. ',
        tokenDisclaimer:
          'Puedes cambiar el token de Mapbox posteriormente utilizando estas instrucciones: ',
        tokenUpdate: 'Como actualitzar un token preexistente.',
        modeTitle: 'Modo mapa',
        modeSubtitle1: 'Seleccionar modo app. Más ',
        modeSubtitle2: 'información',
        modeDescription: 'Permmite a los usuarios {modo} el mapa',
        read: 'leer',
        edit: 'editar'
      },
      json: {
        configTitle: 'Configuración del mapa',
        configDisclaimer:
          'La configuración del mapa será incluida en el archivo Json. Si utilitzas kepler.gl en tu propia app puedes copiar esta configuración y pasarla a  ',
        selection:
          'Exportar los datos del mapa y la configuración en un solo archivo Json. Posteriormente puedes abrir este mismo mapa cargando este mismo archivo a kepler.gl.',
        disclaimer:
          '* La configuración del mapa se combina con los conjuntos de datos cargados. ‘dataId’ se utiliza para vincular capas, filtros y sugerencias a un conjunto de datos específico. ' +
          'Cuando pases esta configuración a addDataToMap, asegura que el identificador del conjunto de datos coincida con los ‘dataId’ de esta configuración.'
      }
    },
    loadingDialog: {
      loading: 'Cargando...'
    },
    loadData: {
      upload: 'Cargar archivos',
      tileset: 'Conjunto de mosaico',
      storage: 'Cargar desde almacenage'
    },
    tripInfo: {
      title: 'Como habilitar la animación de viaje',
      titleTable: 'Crear viajes a partir de una lista de puntos',
      description1:
        'Para animar la ruta, los datos geoJSON han de contener `LineString` en su geometría y las coordenadas de LineString deben tener 4 elementos en los formats de ',
      code: ' [longitude, latitude, altitude, timestamp] ',
      description2:
        'y el último elemento debe ser la marca del tiempo. Los formatos válidos para la marca de tiempo incluyen Unix en segundos como `1564184363` o en milisegundos como `1564184363000`.',
      descriptionTable1:
        'Los viajes se pueden crear uniendo una lista de puntos de latitud y longitud, ordenando por marcas de tiempo y agrupando por identificadores únicos.',
      example: 'Ejemplo:'
    },
    iconInfo: {
      title: 'Como dibujar íconos',
      description1:
        'En tu CSV crea una columna y pon el nombre del ícono que quieres dibujar. Puedes dejar la celda vacía cuando no quieras que se muestre para ciertos puntos. Cuando la columna se llama',
      code: 'ícono',
      description2: ' kepler.gl automáticamente creará una capa de ícono.',
      example: 'Ejemplo:',
      icons: 'Iconos'
    },
    polygonInfo: {
      title: 'Crear capa de polígonos a partir de características GeoJSON',
      titleTable: 'Crear ruta a partir de puntos',
      descriptionTable: `Las rutas se pueden crear uniendo una lista de puntos de latitud y longitud, ordenando por un campo de índice (p.ej. marca de tiempo) y agrupando por identificadores únicos.

  ### Columnas de la capa:
  - **id**: - *obligatorio*&nbsp;- Una columna \`id\` se usa para agrupar puntos. Los puntos con el mismo id se unirán en una sola ruta.
  - **lat**: - *obligatorio*&nbsp;- La latitud del punto
  - **lon**: - *obligatorio*&nbsp;- La longitud del punto
  - **alt**: - *opcional*&nbsp;- La altitud del punto
  - **sort by**: - *opcional*&nbsp;- Una columna \`sort by\` se usa para ordenar los puntos; si no se especifica, los puntos se ordenarán por índice de fila.
`,
      exampleTable: 'Example CSV'
    },
    storageMapViewer: {
      lastModified: 'Última modificación hace {lastUpdated}',
      back: 'Atrás'
    },
    overwriteMap: {
      title: 'Guardando el mapa...',
      alreadyExists: 'ja existe en {mapSaved}. Lo quieres sobreescrivir?'
    },
    loadStorageMap: {
      back: 'Atrás',
      goToPage: 'Ves a la página {displayName} de Kepler.gl',
      storageMaps: 'Almancenage / Mapas',
      noSavedMaps: 'No hay ningún mapa guardado todavía',
      foursquareStorageMessage:
        'Solo se muestran aquí los mapas guardados con la opción Kepler.gl > Guardar > Almacenamiento de Foursquare'
    }
  },
  header: {
    visibleLayers: 'Capas visibles',
    layerLegend: 'Capa de leyenda'
  },
  interactions: {
    tooltip: 'Sugerencias',
    brush: 'Pincel',
    coordinate: 'Coordenadas',
    geocoder: 'Geocodificador'
  },
  layerBlending: {
    title: 'Combinación de capas',
    additive: 'aditiva',
    normal: 'normal',
    subtractive: 'substractiva'
  },
  overlayBlending: {
    title: 'Combinación de superposición del mapa',
    description: 'Combinar capas con el mapa base para que ambos sean visibles.',
    screen: 'mapa base oscuro',
    normal: 'normal',
    darken: 'mapa base claro'
  },
  columns: {
    title: 'Columnas',
    lat: 'lat',
    lng: 'lon',
    altitude: 'altura',
    alt: 'altitud',
    id: 'id',
    timestamp: 'tiempo',
    icon: 'ícono',
    geojson: 'geojson',
    geoarrow: 'geoarrow',
    geoarrow0: 'geoarrow origen',
    geoarrow1: 'geoarrow destino',
    token: 'token',
    sortBy: 'ordenar por',
    neighbors: 'vecinos',
    arc: {
      lat0: 'lat origen',
      lng0: 'lng origen ',
      lat1: 'lat destino',
      lng1: 'lng destino'
    },
    line: {
      alt0: 'altura origen',
      alt1: 'altura destino'
    },
    grid: {
      worldUnitSize: 'Tamaño de la malla (km)'
    },
    hexagon: {
      worldUnitSize: 'Radio de hexágono (km)'
    },
    hex_id: 'id hex',
    flow: {
      source: {
        lat: 'lat origen',
        lng: 'lng origen',
        name: 'nombre origen',
        h3: 'H3 origen'
      },
      target: {
        lat: 'lat destino',
        lng: 'lng destino',
        name: 'nombre destino',
        h3: 'H3 destino'
      },
      count: 'cantidad'
    }
  },
  color: {
    customPalette: 'Paleta personalizada',
    steps: 'pasos',
    type: 'tipo',
    colorBlindSafe: 'Seguro para daltónicos',
    reversed: 'invertida',
    disableStepReason:
      'No se puede cambiar el número de pasos con cortes de color personalizados, use la paleta personalizada para editar los pasos',
    preset: 'Colores predefinidos',
    picker: 'Selector de color'
  },
  scale: {
    colorScale: 'Escala de color',
    sizeScale: 'Escala de medidas',
    strokeScale: 'Escala de trazo',
    strokeColorScale: 'Escala de color de trazo',
    scale: 'Escala'
  },
  fileUploader: {
    message: 'Arrastra y suelta el archivo aquí',
    chromeMessage:
      '*usuario de Chrome: la medida máxima son 250mb, si debes cargar un archivo más grande utiliza Safari',
    disclaimer:
      '*kepler.gl es una aplicación al lado cliente que no utiliza ningún servidor. Los datos sólo existen en tu máquina/navegador. ' +
      'No se envian datos ni mapas a ningún servidor.',
    configUploadMessage:
      'Cargar {fileFormatNames} o un mapa guardado en **Json**. Más información sobre [**supported file formats**]',
    browseFiles: 'navega por tus archivos',
    uploading: 'Cargando',
    fileNotSupported: 'El archivo {errorFiles} no es compatible.',
    or: 'o'
  },
  tilesetSetup: {
    header: 'Configurar mosaicos vectoriales',
    rasterTileHeader: 'Configurar mosaicos ráster',
    addTilesetText: 'Añadir conjunto de mosaico'
  },
  geocoder: {
    title: 'Introduce una dirección'
  },
  fieldSelector: {
    clearAll: 'Quitar todos',
    formatting: 'Formato'
  },
  compare: {
    modeLabel: 'Modo Comparación',
    typeLabel: 'Tipo de Comparación',
    types: {
      absolute: 'Absoluta',
      relative: 'Relativa'
    }
  },
  mapPopover: {
    primary: 'Principal'
  },
  density: 'densidad',
  'Bug Report': 'Informe de errores',
  'User Guide': 'Guía de usuario',
  Save: 'Guadar',
  Share: 'Compartir',
  flow: {
    tooltip: {
      location: {
        name: 'Nombre',
        incomingCount: 'Entrantes',
        outgoingCount: 'Salientes',
        internalCount: 'Internos'
      },
      flow: {
        sourceName: 'Origen',
        targetName: 'Destino',
        count: 'Cantidad'
      }
    }
  },
  mapLegend: {
    layers: {
      line: {
        singleColor: {
          sourceColor: 'Origen',
          targetColor: 'Destino'
        }
      },
      arc: {
        singleColor: {
          sourceColor: 'Origen',
          targetColor: 'Destino'
        }
      },
      default: {
        singleColor: {
          color: 'Color de relleno',
          strokeColor: 'Contorno'
        }
      }
    }
  }
};
