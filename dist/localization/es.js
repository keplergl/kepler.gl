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
    empty: 'vacio'
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
    '3dBuilding': 'Edificio 3D'
  },
  panel: {
    text: {
      label: 'etiqueta',
      labelWithId: 'Etiqueta {labelId}',
      fontSize: 'Tamaño de fuente',
      fontColor: 'Color de fuente',
      textAnchor: 'Anclaje del texto',
      alignment: 'Alineación',
      addMoreLabel: 'Añadir más etiquetas'
    }
  },
  sidebar: {
    panels: {
      layer: 'Capas',
      filter: 'Filtros',
      interaction: 'Interacciones',
      basemap: 'Mapa base'
    }
  },
  layer: {
    required: 'Requerido*',
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
      '3d': '3D'
    }
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
    opacity: 'Opacidad',
    coverage: 'Cobertura',
    outline: 'Contorno',
    colorRange: 'Rango de color',
    stroke: 'Trazo',
    strokeColor: 'Color de trazo',
    strokeColorRange: 'Rango de color de trazo',
    targetColor: 'Color destino',
    colorAggregation: 'Agregación de color',
    heightAggregation: 'Agregación de la altura',
    resolutionRange: 'Rango de resolución',
    sizeScale: 'Medida de escala',
    worldUnitSize: 'Medida de la unidad mundial',
    elevationScale: 'Escala de elevación',
    enableElevationZoomFactor: 'Usar factor de zoom de elevación',
    enableElevationZoomFactorDescription: 'Ajuste la altura / elevación según el factor de zoom actual',
    enableHeightZoomFactor: 'Usar factor de zoom de altura',
    heightScale: 'Escala de altura',
    coverageRange: 'Rango de cobertura',
    highPrecisionRendering: 'Representación de alta precisión',
    highPrecisionRenderingDescription: 'La precisión alta tendrá un rendimiento más bajo',
    height: 'Altura',
    heightDescription: 'Haz clic en el botón de arriba a la derecha del mapa per cambiar a vista 3D',
    fill: 'Rellenar',
    enablePolygonHeight: 'Activar la altura del polígono',
    showWireframe: 'Muestra esquemàtico',
    weightIntensity: 'Intensidad de peso',
    zoomScale: 'Escala de zoom',
    heightRange: 'Rango de alturas',
    heightMultiplier: 'Multiplicador de altura'
  },
  layerManager: {
    addData: 'Añadir datos',
    addLayer: 'Añadir capa',
    layerBlending: 'Combinar capas'
  },
  mapManager: {
    mapStyle: 'Estilo de mapa',
    addMapStyle: 'Añadir estilo de mapa',
    '3dBuildingColor': 'Color edificios 3D'
  },
  layerConfiguration: {
    defaultDescription: 'Calcular {property} según el campo seleccionado',
    howTo: 'How to'
  },
  filterManager: {
    addFilter: 'Añadir filtro'
  },
  datasetTitle: {
    showDataTable: 'Mostar la tabla de datos',
    removeDataset: 'Eliminar conjunto de datos'
  },
  datasetInfo: {
    rowCount: '{rowCount} files'
  },
  tooltip: {
    hideLayer: 'Ocultar la capa',
    showLayer: 'Mostrar la capa',
    hideFeature: 'Ocultar el objeto',
    showFeature: 'Mostrar el objeto',
    hide: 'Ocultar',
    show: 'Mostrar',
    removeLayer: 'Eliminar capa',
    layerSettings: 'Configuración de capa',
    closePanel: 'Cerrar el panel actual',
    switchToDualView: 'Cambiar a la vista de mapa dual',
    showLegend: 'Mostrar leyenda',
    disable3DMap: 'Desactivar mapa 3D',
    DrawOnMap: 'Dibujar en el mapa',
    selectLocale: 'Seleccionar configuración regional',
    hideLayerPanel: 'Ocultar la tabla de capas',
    showLayerPanel: 'Mostrar la tabla  de capas',
    moveToTop: 'Desplazar arriba de las capas de datos',
    selectBaseMapStyle: 'Seleccionar estilo de mapa base',
    "delete": 'Borrar',
    timePlayback: 'Reproducción de tiempo',
    cloudStorage: 'Almacenaje en la nube',
    '3DMap': 'Mapa 3D',
    animationByWindow: 'Ventana Temporal Móvil',
    animationByIncremental: 'Ventana Temporal Incremental',
    speed: 'velocidad',
    play: 'iniciar',
    pause: 'pausar',
    reset: 'reiniciar'
  },
  toolbar: _objectSpread({
    exportImage: 'Exportar imagen',
    exportData: 'Exportar datos',
    exportMap: 'Exportar mapa',
    shareMapURL: 'Compartir el enlace del mapa',
    saveMap: 'Guardar mapa',
    select: 'selecciona',
    polygon: 'polígono',
    rectangle: 'rectángulo',
    hide: 'esconder',
    show: 'mostrar'
  }, _locales.LOCALES),
  modal: {
    title: {
      deleteDataset: 'Borrar conjunto de datos',
      addDataToMap: 'Añadir datos al mapa',
      exportImage: 'Exportar imagen',
      exportData: 'Exportar datos',
      exportMap: 'Exportar mapa',
      addCustomMapboxStyle: 'Añadir estilo de Mapbox propio',
      saveMap: 'Guardar mapa',
      shareURL: 'Compartir enlace'
    },
    button: {
      "delete": 'Borrar',
      download: 'Descargar',
      "export": 'Exportar',
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
      mapLegendTitle: 'Leyenda del mapa',
      mapLegendAdd: 'Añadir leyenda al mapa'
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
      rowCount: '{rowCount} Files'
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
      publishSubtitle7: 'aquí. *kepler.gl es una aplicación cliente, los datos quedan en tu navegador..',
      exampleToken: 'p.e. pk.abcdefg.xxxxxx',
      pasteTitle: '2. Engancha el enlace del estilo',
      pasteSubtitle1: 'Qué es un',
      pasteSubtitle2: 'enlace del estilo',
      namingTitle: '3. Poner nombre a tu estilo'
    },
    shareMap: {
      shareUriTitle: 'Compartir el enlace del mapa',
      shareUriSubtitle: 'Generar un enlace del mapa para compartir con otros',
      cloudTitle: 'Almacenage en la nube',
      cloudSubtitle: 'Acceder y cargar datos del mapa a tu almacenage a la nube personal',
      shareDisclaimer: 'kepler.gl guardará los datos del mapa en el almacenage de tu nube personal, sólo quien tenga el enlace podra acceder al mapa y a los datos . ' + 'Puedes editar/borrar el archivo de datos en tu cuenta en la nube en cualquier momento.',
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
        tokenMisuseWarning: '* Si no proporcionas tu propio token, el mapa podría fallar en cualquier momento cuando reemplacemos nuestro token para evitar abusos. ',
        tokenDisclaimer: 'Puedes cambiar el token de Mapbox posteriormente utilizando estas instrucciones: ',
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
        configDisclaimer: 'La configuración del mapa será incluida en el archivo Json. Si utilitzas kepler.gl en tu propia app puedes copiar esta configuración y pasarla a  ',
        selection: 'Exportar los datos del mapa y la configuración en un solo archivo Json. Posteriormente puedes abrir este mismo mapa cargando este mismo archivo a kepler.gl.',
        disclaimer: '* La configuración del mapa se combina con los conjuntos de datos cargados. ‘dataId’ se utiliza para vincular capas, filtros y sugerencias a un conjunto de datos específico. ' + 'Cuando pases esta configuración a addDataToMap, asegura que el identificador del conjunto de datos coincida con los ‘dataId’ de esta configuración.'
      }
    },
    loadingDialog: {
      loading: 'Cargando...'
    },
    loadData: {
      upload: 'Cargar archivos',
      storage: 'Cargar desde almacenage'
    },
    tripInfo: {
      title: 'Como habilitar la animación de viaje',
      description1: 'Para animar la ruta, los datos geoJSON han de contener `LineString` en su geometría y las coordenadas de LineString deben tener 4 elementos en los formats de ',
      code: ' [longitude, latitude, altitude, timestamp] ',
      description2: 'y el último elemento debe ser la marca del tiempo. Los formatos válidos para la marca de tiempo incluyen Unix en segundos como `1564184363` o en milisegundos como `1564184363000`.',
      example: 'Ejemplo:'
    },
    iconInfo: {
      title: 'Como dibujar íconos',
      description1: 'En tu CSV crea una columna y pon el nombre del ícono que quieres dibujar. Puedes dejar la celda vacía cuando no quieras que se muestre para ciertos puntos. Cuando la columna se llama',
      code: 'ícono',
      description2: ' kepler.gl automáticamente creará una capa de ícono.',
      example: 'Ejemplo:',
      icons: 'Iconos'
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
      noSavedMaps: 'No hay ningún mapa guardado todavía'
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
  columns: {
    title: 'Columnas',
    lat: 'lat',
    lng: 'lon',
    altitude: 'altura',
    icon: 'ícono',
    geojson: 'geojson',
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
    hex_id: 'id hex'
  },
  color: {
    customPalette: 'Paleta personalizada',
    steps: 'pasos',
    type: 'tipo',
    reversed: 'invertida'
  },
  scale: {
    colorScale: 'Escala de color',
    sizeScale: 'Escala de medidas',
    strokeScale: 'Escala de trazo',
    scale: 'Escala'
  },
  fileUploader: {
    message: 'Arrastra y suelta el archivo aquí',
    chromeMessage: '*usuario de Chrome: la medida máxima son 250mb, si debes cargar un archivo más grande utiliza Safari',
    disclaimer: '*kepler.gl es una aplicación al lado cliente que no utiliza ningún servidor. Los datos sólo existen en tu máquina/navegador. ' + 'No se envian datos ni mapas a ningún servidor.',
    configUploadMessage: 'Cargar {fileFormatNames} o un mapa guardado en **Json**. Más información sobre [**supported file formats**]',
    browseFiles: 'navega por tus archivos',
    uploading: 'Cargando',
    fileNotSupported: 'El archivo {errorFiles} no es compatible.',
    or: 'o'
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
  Share: 'Compartir'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vZXMuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwiY292ZXJhZ2UiLCJzdHJva2VDb2xvciIsInJhZGl1cyIsIm91dGxpbmUiLCJzdHJva2UiLCJkZW5zaXR5IiwiaGVpZ2h0Iiwic3VtIiwicG9pbnRDb3VudCIsInBsYWNlaG9sZGVyIiwic2VhcmNoIiwic2VsZWN0RmllbGQiLCJ5QXhpcyIsInNlbGVjdFR5cGUiLCJzZWxlY3RWYWx1ZSIsImVudGVyVmFsdWUiLCJlbXB0eSIsIm1pc2MiLCJieSIsInZhbHVlc0luIiwidmFsdWVFcXVhbHMiLCJkYXRhU291cmNlIiwiYnJ1c2hSYWRpdXMiLCJtYXBMYXllcnMiLCJ0aXRsZSIsInJvYWQiLCJib3JkZXIiLCJidWlsZGluZyIsIndhdGVyIiwibGFuZCIsInBhbmVsIiwidGV4dCIsImxhYmVsV2l0aElkIiwiZm9udFNpemUiLCJmb250Q29sb3IiLCJ0ZXh0QW5jaG9yIiwiYWxpZ25tZW50IiwiYWRkTW9yZUxhYmVsIiwic2lkZWJhciIsInBhbmVscyIsImxheWVyIiwiZmlsdGVyIiwiaW50ZXJhY3Rpb24iLCJiYXNlbWFwIiwicmVxdWlyZWQiLCJwcm9wZXJ0eUJhc2VkT24iLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsImFuZ2xlIiwic3Ryb2tlV2lkdGhSYW5nZSIsImZpeGVkUmFkaXVzIiwiZml4ZWRSYWRpdXNEZXNjcmlwdGlvbiIsInJhZGl1c1JhbmdlIiwiY2x1c3RlclJhZGl1cyIsInJhZGl1c1JhbmdlUGl4ZWxzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJzdHJva2VDb2xvclJhbmdlIiwidGFyZ2V0Q29sb3IiLCJjb2xvckFnZ3JlZ2F0aW9uIiwiaGVpZ2h0QWdncmVnYXRpb24iLCJyZXNvbHV0aW9uUmFuZ2UiLCJzaXplU2NhbGUiLCJ3b3JsZFVuaXRTaXplIiwiZWxldmF0aW9uU2NhbGUiLCJlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yIiwiZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvckRlc2NyaXB0aW9uIiwiZW5hYmxlSGVpZ2h0Wm9vbUZhY3RvciIsImhlaWdodFNjYWxlIiwiY292ZXJhZ2VSYW5nZSIsImhpZ2hQcmVjaXNpb25SZW5kZXJpbmciLCJoaWdoUHJlY2lzaW9uUmVuZGVyaW5nRGVzY3JpcHRpb24iLCJoZWlnaHREZXNjcmlwdGlvbiIsImZpbGwiLCJlbmFibGVQb2x5Z29uSGVpZ2h0Iiwic2hvd1dpcmVmcmFtZSIsIndlaWdodEludGVuc2l0eSIsInpvb21TY2FsZSIsImhlaWdodFJhbmdlIiwiaGVpZ2h0TXVsdGlwbGllciIsImxheWVyTWFuYWdlciIsImFkZERhdGEiLCJhZGRMYXllciIsImxheWVyQmxlbmRpbmciLCJtYXBNYW5hZ2VyIiwibWFwU3R5bGUiLCJhZGRNYXBTdHlsZSIsImxheWVyQ29uZmlndXJhdGlvbiIsImRlZmF1bHREZXNjcmlwdGlvbiIsImhvd1RvIiwiZmlsdGVyTWFuYWdlciIsImFkZEZpbHRlciIsImRhdGFzZXRUaXRsZSIsInNob3dEYXRhVGFibGUiLCJyZW1vdmVEYXRhc2V0IiwiZGF0YXNldEluZm8iLCJyb3dDb3VudCIsInRvb2x0aXAiLCJoaWRlTGF5ZXIiLCJzaG93TGF5ZXIiLCJoaWRlRmVhdHVyZSIsInNob3dGZWF0dXJlIiwiaGlkZSIsInNob3ciLCJyZW1vdmVMYXllciIsImxheWVyU2V0dGluZ3MiLCJjbG9zZVBhbmVsIiwic3dpdGNoVG9EdWFsVmlldyIsInNob3dMZWdlbmQiLCJkaXNhYmxlM0RNYXAiLCJEcmF3T25NYXAiLCJzZWxlY3RMb2NhbGUiLCJoaWRlTGF5ZXJQYW5lbCIsInNob3dMYXllclBhbmVsIiwibW92ZVRvVG9wIiwic2VsZWN0QmFzZU1hcFN0eWxlIiwidGltZVBsYXliYWNrIiwiY2xvdWRTdG9yYWdlIiwiYW5pbWF0aW9uQnlXaW5kb3ciLCJhbmltYXRpb25CeUluY3JlbWVudGFsIiwic3BlZWQiLCJwbGF5IiwicGF1c2UiLCJyZXNldCIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwibW9kYWwiLCJkZWxldGVEYXRhc2V0IiwiYWRkRGF0YVRvTWFwIiwiYWRkQ3VzdG9tTWFwYm94U3R5bGUiLCJzaGFyZVVSTCIsImJ1dHRvbiIsImRvd25sb2FkIiwiYWRkU3R5bGUiLCJzYXZlIiwiZGVmYXVsdENhbmNlbCIsImRlZmF1bHRDb25maXJtIiwicmF0aW9UaXRsZSIsInJhdGlvRGVzY3JpcHRpb24iLCJyYXRpb09yaWdpbmFsU2NyZWVuIiwicmF0aW9DdXN0b20iLCJyYXRpbzRfMyIsInJhdGlvMTZfOSIsInJlc29sdXRpb25UaXRsZSIsInJlc29sdXRpb25EZXNjcmlwdGlvbiIsIm1hcExlZ2VuZFRpdGxlIiwibWFwTGVnZW5kQWRkIiwiZGF0YXNldFN1YnRpdGxlIiwiYWxsRGF0YXNldHMiLCJkYXRhVHlwZVRpdGxlIiwiZGF0YVR5cGVTdWJ0aXRsZSIsImZpbHRlckRhdGFUaXRsZSIsImZpbHRlckRhdGFTdWJ0aXRsZSIsImZpbHRlcmVkRGF0YSIsInVuZmlsdGVyZWREYXRhIiwiZmlsZUNvdW50IiwiZGVsZXRlRGF0YSIsIndhcm5pbmciLCJwdWJsaXNoVGl0bGUiLCJwdWJsaXNoU3VidGl0bGUxIiwicHVibGlzaFN1YnRpdGxlMiIsInB1Ymxpc2hTdWJ0aXRsZTMiLCJwdWJsaXNoU3VidGl0bGU0IiwicHVibGlzaFN1YnRpdGxlNSIsInB1Ymxpc2hTdWJ0aXRsZTYiLCJwdWJsaXNoU3VidGl0bGU3IiwiZXhhbXBsZVRva2VuIiwicGFzdGVUaXRsZSIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJuYW1pbmdUaXRsZSIsInNoYXJlTWFwIiwic2hhcmVVcmlUaXRsZSIsInNoYXJlVXJpU3VidGl0bGUiLCJjbG91ZFRpdGxlIiwiY2xvdWRTdWJ0aXRsZSIsInNoYXJlRGlzY2xhaW1lciIsImdvdG9QYWdlIiwic3RhdHVzUGFuZWwiLCJtYXBVcGxvYWRpbmciLCJlcnJvciIsInN1YnRpdGxlIiwiZm9ybWF0VGl0bGUiLCJmb3JtYXRTdWJ0aXRsZSIsImh0bWwiLCJzZWxlY3Rpb24iLCJ0b2tlblRpdGxlIiwidG9rZW5TdWJ0aXRsZSIsInRva2VuUGxhY2Vob2xkZXIiLCJ0b2tlbk1pc3VzZVdhcm5pbmciLCJ0b2tlbkRpc2NsYWltZXIiLCJ0b2tlblVwZGF0ZSIsIm1vZGVUaXRsZSIsIm1vZGVTdWJ0aXRsZTEiLCJtb2RlU3VidGl0bGUyIiwibW9kZURlc2NyaXB0aW9uIiwicmVhZCIsImVkaXQiLCJqc29uIiwiY29uZmlnVGl0bGUiLCJjb25maWdEaXNjbGFpbWVyIiwiZGlzY2xhaW1lciIsImxvYWRpbmdEaWFsb2ciLCJsb2FkaW5nIiwibG9hZERhdGEiLCJ1cGxvYWQiLCJzdG9yYWdlIiwidHJpcEluZm8iLCJkZXNjcmlwdGlvbjEiLCJjb2RlIiwiZGVzY3JpcHRpb24yIiwiZXhhbXBsZSIsImljb25JbmZvIiwiaWNvbnMiLCJzdG9yYWdlTWFwVmlld2VyIiwibGFzdE1vZGlmaWVkIiwiYmFjayIsIm92ZXJ3cml0ZU1hcCIsImFscmVhZHlFeGlzdHMiLCJsb2FkU3RvcmFnZU1hcCIsImdvVG9QYWdlIiwic3RvcmFnZU1hcHMiLCJub1NhdmVkTWFwcyIsImhlYWRlciIsInZpc2libGVMYXllcnMiLCJsYXllckxlZ2VuZCIsImludGVyYWN0aW9ucyIsImJydXNoIiwiY29vcmRpbmF0ZSIsImdlb2NvZGVyIiwiYWRkaXRpdmUiLCJub3JtYWwiLCJzdWJ0cmFjdGl2ZSIsImNvbHVtbnMiLCJsYXQiLCJsbmciLCJhbHRpdHVkZSIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJhbHQwIiwiYWx0MSIsImhleF9pZCIsImN1c3RvbVBhbGV0dGUiLCJzdGVwcyIsInJldmVyc2VkIiwic2NhbGUiLCJjb2xvclNjYWxlIiwic3Ryb2tlU2NhbGUiLCJmaWxlVXBsb2FkZXIiLCJtZXNzYWdlIiwiY2hyb21lTWVzc2FnZSIsImNvbmZpZ1VwbG9hZE1lc3NhZ2UiLCJicm93c2VGaWxlcyIsInVwbG9hZGluZyIsImZpbGVOb3RTdXBwb3J0ZWQiLCJvciIsImZpZWxkU2VsZWN0b3IiLCJjbGVhckFsbCIsImZvcm1hdHRpbmciLCJjb21wYXJlIiwibW9kZUxhYmVsIiwidHlwZUxhYmVsIiwidHlwZXMiLCJhYnNvbHV0ZSIsInJlbGF0aXZlIiwibWFwUG9wb3ZlciIsInByaW1hcnkiLCJTYXZlIiwiU2hhcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7ZUFFZTtBQUNiQSxFQUFBQSxRQUFRLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFLE1BREE7QUFFUkMsSUFBQUEsS0FBSyxFQUFFLFVBRkM7QUFHUkMsSUFBQUEsU0FBUyxFQUFFLGtCQUhIO0FBSVJDLElBQUFBLEtBQUssRUFBRSxPQUpDO0FBS1JDLElBQUFBLFFBQVEsRUFBRSxXQUxGO0FBTVJDLElBQUFBLFdBQVcsRUFBRSxnQkFOTDtBQU9SQyxJQUFBQSxNQUFNLEVBQUUsT0FQQTtBQVFSQyxJQUFBQSxPQUFPLEVBQUUsVUFSRDtBQVNSQyxJQUFBQSxNQUFNLEVBQUUsT0FUQTtBQVVSQyxJQUFBQSxPQUFPLEVBQUUsVUFWRDtBQVdSQyxJQUFBQSxNQUFNLEVBQUUsUUFYQTtBQVlSQyxJQUFBQSxHQUFHLEVBQUUsTUFaRztBQWFSQyxJQUFB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QUUsY0FERztBQUViQyxJQUFBQSxVQUFVLEVBQUU7QUFGQyxHQWxiRjtBQXNiYkMsRUFBQUEsT0FBTyxFQUFFO0FBQ1BDLElBQUFBLFNBQVMsRUFBRSxrQkFESjtBQUVQQyxJQUFBQSxTQUFTLEVBQUUscUJBRko7QUFHUEMsSUFBQUEsS0FBSyxFQUFFO0FBQ0xDLE1BQUFBLFFBQVEsRUFBRSxVQURMO0FBRUxDLE1BQUFBLFFBQVEsRUFBRTtBQUZMO0FBSEEsR0F0Ykk7QUE4YmJDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxPQUFPLEVBQUU7QUFEQyxHQTliQztBQWljYnBTLEVBQUFBLE9BQU8sRUFBRSxVQWpjSTtBQWtjYixnQkFBYyxvQkFsY0Q7QUFtY2IsZ0JBQWMsaUJBbmNEO0FBb2NicVMsRUFBQUEsSUFBSSxFQUFFLFFBcGNPO0FBcWNiQyxFQUFBQSxLQUFLLEVBQUU7QUFyY00sQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7TE9DQUxFU30gZnJvbSAnLi9sb2NhbGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBwcm9wZXJ0eToge1xuICAgIHdlaWdodDogJ3Blc28nLFxuICAgIGxhYmVsOiAnZXRpcXVldGEnLFxuICAgIGZpbGxDb2xvcjogJ2NvbG9yIGRlIHJlbGxlbm8nLFxuICAgIGNvbG9yOiAnY29sb3InLFxuICAgIGNvdmVyYWdlOiAnY29iZXJ0dXJhJyxcbiAgICBzdHJva2VDb2xvcjogJ2NvbG9yIGRlIHRyYXpvJyxcbiAgICByYWRpdXM6ICdyYWRpbycsXG4gICAgb3V0bGluZTogJ2NvbnRvcm5vJyxcbiAgICBzdHJva2U6ICd0cmF6bycsXG4gICAgZGVuc2l0eTogJ2RlbnNpZGFkJyxcbiAgICBoZWlnaHQ6ICdhbHR1cmEnLFxuICAgIHN1bTogJ3N1bWEnLFxuICAgIHBvaW50Q291bnQ6ICdSZWN1ZW50byBkZSBwdW50b3MnXG4gIH0sXG4gIHBsYWNlaG9sZGVyOiB7XG4gICAgc2VhcmNoOiAnQnVzcXVlZGEnLFxuICAgIHNlbGVjdEZpZWxkOiAnU2VsZWNjaW9uYSB1biBjYW1wbycsXG4gICAgeUF4aXM6ICdFamUgWScsXG4gICAgc2VsZWN0VHlwZTogJ1NlbGVjY2lvbmEgdW4gVGlwbycsXG4gICAgc2VsZWN0VmFsdWU6ICdTZWxlY2Npb25hIHVuIFZhbG9yJyxcbiAgICBlbnRlclZhbHVlOiAnRW50cmEgdW4gdmFsb3InLFxuICAgIGVtcHR5OiAndmFjaW8nXG4gIH0sXG4gIG1pc2M6IHtcbiAgICBieTogJycsXG4gICAgdmFsdWVzSW46ICdWYWxvcmVzIGVuJyxcbiAgICB2YWx1ZUVxdWFsczogJ1ZhbG9yIGlndWFsIGEnLFxuICAgIGRhdGFTb3VyY2U6ICdGdWVudGUgZGUgZGF0b3MnLFxuICAgIGJydXNoUmFkaXVzOiAnUmFkaW8gZGVsIHBpbmNlbCAoa20pJyxcbiAgICBlbXB0eTogJyAnXG4gIH0sXG4gIG1hcExheWVyczoge1xuICAgIHRpdGxlOiAnQ2FwYXMgZGVsIG1hcGEnLFxuICAgIGxhYmVsOiAnRXRpcXVldGEnLFxuICAgIHJvYWQ6ICdDYXJyZXRlcmEnLFxuICAgIGJvcmRlcjogJ0Zyb250ZXJhJyxcbiAgICBidWlsZGluZzogJ0VkaWZpY2lvJyxcbiAgICB3YXRlcjogJ0FndWEnLFxuICAgIGxhbmQ6ICdUaWVycmEnLFxuICAgICczZEJ1aWxkaW5nJzogJ0VkaWZpY2lvIDNEJ1xuICB9LFxuICBwYW5lbDoge1xuICAgIHRleHQ6IHtcbiAgICAgIGxhYmVsOiAnZXRpcXVldGEnLFxuICAgICAgbGFiZWxXaXRoSWQ6ICdFdGlxdWV0YSB7bGFiZWxJZH0nLFxuICAgICAgZm9udFNpemU6ICdUYW1hw7FvIGRlIGZ1ZW50ZScsXG4gICAgICBmb250Q29sb3I6ICdDb2xvciBkZSBmdWVudGUnLFxuICAgICAgdGV4dEFuY2hvcjogJ0FuY2xhamUgZGVsIHRleHRvJyxcbiAgICAgIGFsaWdubWVudDogJ0FsaW5lYWNpw7NuJyxcbiAgICAgIGFkZE1vcmVMYWJlbDogJ0HDsWFkaXIgbcOhcyBldGlxdWV0YXMnXG4gICAgfVxuICB9LFxuICBzaWRlYmFyOiB7XG4gICAgcGFuZWxzOiB7XG4gICAgICBsYXllcjogJ0NhcGFzJyxcbiAgICAgIGZpbHRlcjogJ0ZpbHRyb3MnLFxuICAgICAgaW50ZXJhY3Rpb246ICdJbnRlcmFjY2lvbmVzJyxcbiAgICAgIGJhc2VtYXA6ICdNYXBhIGJhc2UnXG4gICAgfVxuICB9LFxuICBsYXllcjoge1xuICAgIHJlcXVpcmVkOiAnUmVxdWVyaWRvKicsXG4gICAgcmFkaXVzOiAnUmFkaW8nLFxuICAgIGNvbG9yOiAnQ29sb3InLFxuICAgIGZpbGxDb2xvcjogJ0NvbG9yIGRlIHJlbGxlbm8nLFxuICAgIG91dGxpbmU6ICdDb250b3JubycsXG4gICAgd2VpZ2h0OiAnR3J1ZXNvJyxcbiAgICBwcm9wZXJ0eUJhc2VkT246ICd7cHJvcGVydHl9IGJhc2FkbyBlbicsXG4gICAgY292ZXJhZ2U6ICdDb2JlcnR1cmEnLFxuICAgIHN0cm9rZTogJ1RyYXpvJyxcbiAgICBzdHJva2VXaWR0aDogJ0dyb3NvciBkZSB0cmF6bycsXG4gICAgc3Ryb2tlQ29sb3I6ICdDb2xvciBkZSB0cmF6bycsXG4gICAgYmFzaWM6ICdCw6FzaWNvJyxcbiAgICB0cmFpbExlbmd0aDogJ0xvbmdpdHVkIGRlIHBpc3RhJyxcbiAgICB0cmFpbExlbmd0aERlc2NyaXB0aW9uOiAnTnVtZXJvIGRlIHNlZ3VuZG9zIGhhc3RhIHF1ZSBkZXNhcGFyZXpjYSBlbCBjYW1pbm8nLFxuICAgIG5ld0xheWVyOiAnbnVldmEgY2FwYScsXG4gICAgZWxldmF0aW9uQnlEZXNjcmlwdGlvbjogJ1NpIGRlc2FjdGl2YWRvLCBsYSBhbHR1cmEgc2UgYmFzYSBlbiBlbCByZWN1ZW50byBkZSBwdW50b3MnLFxuICAgIGNvbG9yQnlEZXNjcmlwdGlvbjogJ1NpIGRlc2FjdGl2YWRvLCBlbCBjb2xvciBzZSBiYXNhIGVuIGVsIHJlY3VlbnRvIGRlIHB1bnRvcycsXG4gICAgYWdncmVnYXRlQnk6ICd7ZmllbGR9IGFncmVnYWRvIHBvcicsXG4gICAgJzNETW9kZWwnOiAnTW9kZWxvIDNEJyxcbiAgICAnM0RNb2RlbE9wdGlvbnMnOiAnT3BjaW9uZXMgZGVsIG1vZGVsbyAzRCcsXG4gICAgdHlwZToge1xuICAgICAgcG9pbnQ6ICdwdW50bycsXG4gICAgICBhcmM6ICdhcmNvJyxcbiAgICAgIGxpbmU6ICdsw61uZWEnLFxuICAgICAgZ3JpZDogJ21hbGxhJyxcbiAgICAgIGhleGJpbjogJ2hleGJpbicsXG4gICAgICBwb2x5Z29uOiAncG9sw61nb25vJyxcbiAgICAgIGdlb2pzb246ICdnZW9qc29uJyxcbiAgICAgIGNsdXN0ZXI6ICdjbHVzdGVyJyxcbiAgICAgIGljb246ICdpY29ubycsXG4gICAgICBoZWF0bWFwOiAnY29uY2VudHJhY2nDs24nLFxuICAgICAgaGV4YWdvbjogJ2hleMOhZ29ubycsXG4gICAgICBoZXhhZ29uaWQ6ICdIMycsXG4gICAgICB0cmlwOiAndmlhamUnLFxuICAgICAgczI6ICdTMicsXG4gICAgICAnM2QnOiAnM0QnXG4gICAgfVxuICB9LFxuICBsYXllclZpc0NvbmZpZ3M6IHtcbiAgICBhbmdsZTogJ8OBbmd1bG8nLFxuICAgIHN0cm9rZVdpZHRoOiAnQW5jaG8gZGVsIHRyYXpvJyxcbiAgICBzdHJva2VXaWR0aFJhbmdlOiAnUmFuZ28gZGVsIGFuY2hvIGRlbCB0cmF6bycsXG4gICAgcmFkaXVzOiAnUmFkaW8nLFxuICAgIGZpeGVkUmFkaXVzOiAnUmFkaW8gZmlqbyBhIG1lZGlyJyxcbiAgICBmaXhlZFJhZGl1c0Rlc2NyaXB0aW9uOiAnQWp1c3RhciBlbCByYWRpbyBhbCByYWRpbyBhYnNvbHV0byBlbiBtZXRyb3MsIHAuZS4gNSBhIDUgbWV0cm9zJyxcbiAgICByYWRpdXNSYW5nZTogJ1JhbmdvIGRlIHJhZGlvJyxcbiAgICBjbHVzdGVyUmFkaXVzOiAnUmFkaW8gZGVsIGNsdXN0ZXIgZW4gcMOteGVsZXMnLFxuICAgIHJhZGl1c1JhbmdlUGl4ZWxzOiAnUmFuZ28gZGVsIHJhZGlvIGVuIHDDrXhlbGVzJyxcbiAgICBvcGFjaXR5OiAnT3BhY2lkYWQnLFxuICAgIGNvdmVyYWdlOiAnQ29iZXJ0dXJhJyxcbiAgICBvdXRsaW5lOiAnQ29udG9ybm8nLFxuICAgIGNvbG9yUmFuZ2U6ICdSYW5nbyBkZSBjb2xvcicsXG4gICAgc3Ryb2tlOiAnVHJhem8nLFxuICAgIHN0cm9rZUNvbG9yOiAnQ29sb3IgZGUgdHJhem8nLFxuICAgIHN0cm9rZUNvbG9yUmFuZ2U6ICdSYW5nbyBkZSBjb2xvciBkZSB0cmF6bycsXG4gICAgdGFyZ2V0Q29sb3I6ICdDb2xvciBkZXN0aW5vJyxcbiAgICBjb2xvckFnZ3JlZ2F0aW9uOiAnQWdyZWdhY2nDs24gZGUgY29sb3InLFxuICAgIGhlaWdodEFnZ3JlZ2F0aW9uOiAnQWdyZWdhY2nDs24gZGUgbGEgYWx0dXJhJyxcbiAgICByZXNvbHV0aW9uUmFuZ2U6ICdSYW5nbyBkZSByZXNvbHVjacOzbicsXG4gICAgc2l6ZVNjYWxlOiAnTWVkaWRhIGRlIGVzY2FsYScsXG4gICAgd29ybGRVbml0U2l6ZTogJ01lZGlkYSBkZSBsYSB1bmlkYWQgbXVuZGlhbCcsXG4gICAgZWxldmF0aW9uU2NhbGU6ICdFc2NhbGEgZGUgZWxldmFjacOzbicsXG4gICAgZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvcjogJ1VzYXIgZmFjdG9yIGRlIHpvb20gZGUgZWxldmFjacOzbicsXG4gICAgZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvckRlc2NyaXB0aW9uOlxuICAgICAgJ0FqdXN0ZSBsYSBhbHR1cmEgLyBlbGV2YWNpw7NuIHNlZ8O6biBlbCBmYWN0b3IgZGUgem9vbSBhY3R1YWwnLFxuICAgIGVuYWJsZUhlaWdodFpvb21GYWN0b3I6ICdVc2FyIGZhY3RvciBkZSB6b29tIGRlIGFsdHVyYScsXG4gICAgaGVpZ2h0U2NhbGU6ICdFc2NhbGEgZGUgYWx0dXJhJyxcbiAgICBjb3ZlcmFnZVJhbmdlOiAnUmFuZ28gZGUgY29iZXJ0dXJhJyxcbiAgICBoaWdoUHJlY2lzaW9uUmVuZGVyaW5nOiAnUmVwcmVzZW50YWNpw7NuIGRlIGFsdGEgcHJlY2lzacOzbicsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZ0Rlc2NyaXB0aW9uOiAnTGEgcHJlY2lzacOzbiBhbHRhIHRlbmRyw6EgdW4gcmVuZGltaWVudG8gbcOhcyBiYWpvJyxcbiAgICBoZWlnaHQ6ICdBbHR1cmEnLFxuICAgIGhlaWdodERlc2NyaXB0aW9uOlxuICAgICAgJ0hheiBjbGljIGVuIGVsIGJvdMOzbiBkZSBhcnJpYmEgYSBsYSBkZXJlY2hhIGRlbCBtYXBhIHBlciBjYW1iaWFyIGEgdmlzdGEgM0QnLFxuICAgIGZpbGw6ICdSZWxsZW5hcicsXG4gICAgZW5hYmxlUG9seWdvbkhlaWdodDogJ0FjdGl2YXIgbGEgYWx0dXJhIGRlbCBwb2zDrWdvbm8nLFxuICAgIHNob3dXaXJlZnJhbWU6ICdNdWVzdHJhIGVzcXVlbcOgdGljbycsXG4gICAgd2VpZ2h0SW50ZW5zaXR5OiAnSW50ZW5zaWRhZCBkZSBwZXNvJyxcbiAgICB6b29tU2NhbGU6ICdFc2NhbGEgZGUgem9vbScsXG4gICAgaGVpZ2h0UmFuZ2U6ICdSYW5nbyBkZSBhbHR1cmFzJyxcbiAgICBoZWlnaHRNdWx0aXBsaWVyOiAnTXVsdGlwbGljYWRvciBkZSBhbHR1cmEnXG4gIH0sXG4gIGxheWVyTWFuYWdlcjoge1xuICAgIGFkZERhdGE6ICdBw7FhZGlyIGRhdG9zJyxcbiAgICBhZGRMYXllcjogJ0HDsWFkaXIgY2FwYScsXG4gICAgbGF5ZXJCbGVuZGluZzogJ0NvbWJpbmFyIGNhcGFzJ1xuICB9LFxuICBtYXBNYW5hZ2VyOiB7XG4gICAgbWFwU3R5bGU6ICdFc3RpbG8gZGUgbWFwYScsXG4gICAgYWRkTWFwU3R5bGU6ICdBw7FhZGlyIGVzdGlsbyBkZSBtYXBhJyxcbiAgICAnM2RCdWlsZGluZ0NvbG9yJzogJ0NvbG9yIGVkaWZpY2lvcyAzRCdcbiAgfSxcbiAgbGF5ZXJDb25maWd1cmF0aW9uOiB7XG4gICAgZGVmYXVsdERlc2NyaXB0aW9uOiAnQ2FsY3VsYXIge3Byb3BlcnR5fSBzZWfDum4gZWwgY2FtcG8gc2VsZWNjaW9uYWRvJyxcbiAgICBob3dUbzogJ0hvdyB0bydcbiAgfSxcbiAgZmlsdGVyTWFuYWdlcjoge1xuICAgIGFkZEZpbHRlcjogJ0HDsWFkaXIgZmlsdHJvJ1xuICB9LFxuICBkYXRhc2V0VGl0bGU6IHtcbiAgICBzaG93RGF0YVRhYmxlOiAnTW9zdGFyIGxhIHRhYmxhIGRlIGRhdG9zJyxcbiAgICByZW1vdmVEYXRhc2V0OiAnRWxpbWluYXIgY29uanVudG8gZGUgZGF0b3MnXG4gIH0sXG4gIGRhdGFzZXRJbmZvOiB7XG4gICAgcm93Q291bnQ6ICd7cm93Q291bnR9IGZpbGVzJ1xuICB9LFxuICB0b29sdGlwOiB7XG4gICAgaGlkZUxheWVyOiAnT2N1bHRhciBsYSBjYXBhJyxcbiAgICBzaG93TGF5ZXI6ICdNb3N0cmFyIGxhIGNhcGEnLFxuICAgIGhpZGVGZWF0dXJlOiAnT2N1bHRhciBlbCBvYmpldG8nLFxuICAgIHNob3dGZWF0dXJlOiAnTW9zdHJhciBlbCBvYmpldG8nLFxuICAgIGhpZGU6ICdPY3VsdGFyJyxcbiAgICBzaG93OiAnTW9zdHJhcicsXG4gICAgcmVtb3ZlTGF5ZXI6ICdFbGltaW5hciBjYXBhJyxcbiAgICBsYXllclNldHRpbmdzOiAnQ29uZmlndXJhY2nDs24gZGUgY2FwYScsXG4gICAgY2xvc2VQYW5lbDogJ0NlcnJhciBlbCBwYW5lbCBhY3R1YWwnLFxuICAgIHN3aXRjaFRvRHVhbFZpZXc6ICdDYW1iaWFyIGEgbGEgdmlzdGEgZGUgbWFwYSBkdWFsJyxcbiAgICBzaG93TGVnZW5kOiAnTW9zdHJhciBsZXllbmRhJyxcbiAgICBkaXNhYmxlM0RNYXA6ICdEZXNhY3RpdmFyIG1hcGEgM0QnLFxuICAgIERyYXdPbk1hcDogJ0RpYnVqYXIgZW4gZWwgbWFwYScsXG4gICAgc2VsZWN0TG9jYWxlOiAnU2VsZWNjaW9uYXIgY29uZmlndXJhY2nDs24gcmVnaW9uYWwnLFxuICAgIGhpZGVMYXllclBhbmVsOiAnT2N1bHRhciBsYSB0YWJsYSBkZSBjYXBhcycsXG4gICAgc2hvd0xheWVyUGFuZWw6ICdNb3N0cmFyIGxhIHRhYmxhICBkZSBjYXBhcycsXG4gICAgbW92ZVRvVG9wOiAnRGVzcGxhemFyIGFycmliYSBkZSBsYXMgY2FwYXMgZGUgZGF0b3MnLFxuICAgIHNlbGVjdEJhc2VNYXBTdHlsZTogJ1NlbGVjY2lvbmFyIGVzdGlsbyBkZSBtYXBhIGJhc2UnLFxuICAgIGRlbGV0ZTogJ0JvcnJhcicsXG4gICAgdGltZVBsYXliYWNrOiAnUmVwcm9kdWNjacOzbiBkZSB0aWVtcG8nLFxuICAgIGNsb3VkU3RvcmFnZTogJ0FsbWFjZW5hamUgZW4gbGEgbnViZScsXG4gICAgJzNETWFwJzogJ01hcGEgM0QnLFxuICAgIGFuaW1hdGlvbkJ5V2luZG93OiAnVmVudGFuYSBUZW1wb3JhbCBNw7N2aWwnLFxuICAgIGFuaW1hdGlvbkJ5SW5jcmVtZW50YWw6ICdWZW50YW5hIFRlbXBvcmFsIEluY3JlbWVudGFsJyxcbiAgICBzcGVlZDogJ3ZlbG9jaWRhZCcsXG4gICAgcGxheTogJ2luaWNpYXInLFxuICAgIHBhdXNlOiAncGF1c2FyJyxcbiAgICByZXNldDogJ3JlaW5pY2lhcidcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0YXIgaW1hZ2VuJyxcbiAgICBleHBvcnREYXRhOiAnRXhwb3J0YXIgZGF0b3MnLFxuICAgIGV4cG9ydE1hcDogJ0V4cG9ydGFyIG1hcGEnLFxuICAgIHNoYXJlTWFwVVJMOiAnQ29tcGFydGlyIGVsIGVubGFjZSBkZWwgbWFwYScsXG4gICAgc2F2ZU1hcDogJ0d1YXJkYXIgbWFwYScsXG4gICAgc2VsZWN0OiAnc2VsZWNjaW9uYScsXG4gICAgcG9seWdvbjogJ3BvbMOtZ29ubycsXG4gICAgcmVjdGFuZ2xlOiAncmVjdMOhbmd1bG8nLFxuICAgIGhpZGU6ICdlc2NvbmRlcicsXG4gICAgc2hvdzogJ21vc3RyYXInLFxuICAgIC4uLkxPQ0FMRVNcbiAgfSxcbiAgbW9kYWw6IHtcbiAgICB0aXRsZToge1xuICAgICAgZGVsZXRlRGF0YXNldDogJ0JvcnJhciBjb25qdW50byBkZSBkYXRvcycsXG4gICAgICBhZGREYXRhVG9NYXA6ICdBw7FhZGlyIGRhdG9zIGFsIG1hcGEnLFxuICAgICAgZXhwb3J0SW1hZ2U6ICdFeHBvcnRhciBpbWFnZW4nLFxuICAgICAgZXhwb3J0RGF0YTogJ0V4cG9ydGFyIGRhdG9zJyxcbiAgICAgIGV4cG9ydE1hcDogJ0V4cG9ydGFyIG1hcGEnLFxuICAgICAgYWRkQ3VzdG9tTWFwYm94U3R5bGU6ICdBw7FhZGlyIGVzdGlsbyBkZSBNYXBib3ggcHJvcGlvJyxcbiAgICAgIHNhdmVNYXA6ICdHdWFyZGFyIG1hcGEnLFxuICAgICAgc2hhcmVVUkw6ICdDb21wYXJ0aXIgZW5sYWNlJ1xuICAgIH0sXG4gICAgYnV0dG9uOiB7XG4gICAgICBkZWxldGU6ICdCb3JyYXInLFxuICAgICAgZG93bmxvYWQ6ICdEZXNjYXJnYXInLFxuICAgICAgZXhwb3J0OiAnRXhwb3J0YXInLFxuICAgICAgYWRkU3R5bGU6ICdBw7FhZGlyIGVzdGlsbycsXG4gICAgICBzYXZlOiAnR3VhcmRhcicsXG4gICAgICBkZWZhdWx0Q2FuY2VsOiAnQ2FuY2VsYXInLFxuICAgICAgZGVmYXVsdENvbmZpcm06ICdDb25maXJtYXInXG4gICAgfSxcbiAgICBleHBvcnRJbWFnZToge1xuICAgICAgcmF0aW9UaXRsZTogJ1JhdGlvJyxcbiAgICAgIHJhdGlvRGVzY3JpcHRpb246ICdFc29nZXIgcmF0aW8gcG9yIGRpdmVyc29zIHVzb3MuJyxcbiAgICAgIHJhdGlvT3JpZ2luYWxTY3JlZW46ICdQYW50YWxsYSBvcmlnaW5hbCcsXG4gICAgICByYXRpb0N1c3RvbTogJ1BlcnNvbmFsaXphZG8nLFxuICAgICAgcmF0aW80XzM6ICc0OjMnLFxuICAgICAgcmF0aW8xNl85OiAnMTY6OScsXG4gICAgICByZXNvbHV0aW9uVGl0bGU6ICdSZXNvbHVjacOzbicsXG4gICAgICByZXNvbHV0aW9uRGVzY3JpcHRpb246ICdVbmEgYWx0YSByZXNvbHVjacOzbiBlcyBtZWpvciBwYXJhIGxhcyBpbXByZXNpb25lcy4nLFxuICAgICAgbWFwTGVnZW5kVGl0bGU6ICdMZXllbmRhIGRlbCBtYXBhJyxcbiAgICAgIG1hcExlZ2VuZEFkZDogJ0HDsWFkaXIgbGV5ZW5kYSBhbCBtYXBhJ1xuICAgIH0sXG4gICAgZXhwb3J0RGF0YToge1xuICAgICAgZGF0YXNldFRpdGxlOiAnQ29uanVudG8gZGUgZGF0b3MnLFxuICAgICAgZGF0YXNldFN1YnRpdGxlOiAnRXNjb2dlciBsb3MgY29uanVudG9zIGRlIGRhdG9zIGEgZXhwb3J0YXInLFxuICAgICAgYWxsRGF0YXNldHM6ICdUb2RvcycsXG4gICAgICBkYXRhVHlwZVRpdGxlOiAnVGlwbyBkZSBkYXRvcycsXG4gICAgICBkYXRhVHlwZVN1YnRpdGxlOiAnRXNjb2dlciBlbCB0aXBvIGRlIGRhdG9zIGEgZXhwb3J0YXInLFxuICAgICAgZmlsdGVyRGF0YVRpdGxlOiAnRmlsdHJhciBkYXRvcycsXG4gICAgICBmaWx0ZXJEYXRhU3VidGl0bGU6ICdTZSBwdWVkZSBlc2NvZ2VyIGV4cG9ydGFyIGxvcyBkYXRvcyBvcmlnaW5hbGVzIG8gZmlsdHJhZG9zJyxcbiAgICAgIGZpbHRlcmVkRGF0YTogJ0RhdG9zIGZpbHRyYWRvcycsXG4gICAgICB1bmZpbHRlcmVkRGF0YTogJ0RhdG9zIHNpbiBmaWx0cmFyJyxcbiAgICAgIGZpbGVDb3VudDogJ3tmaWxlQ291bnR9IEFyY2hpdm9zJyxcbiAgICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSBGaWxlcydcbiAgICB9LFxuICAgIGRlbGV0ZURhdGE6IHtcbiAgICAgIHdhcm5pbmc6ICdlc3TDoXMgYSBwdW50byBkZSBib3JyYXIgZXN0ZSBjb25qdW50byBkZSBkYXRvcy4gQWZlY3RhcsOhIGEge2xlbmd0aH0gY2FwYXMnXG4gICAgfSxcbiAgICBhZGRTdHlsZToge1xuICAgICAgcHVibGlzaFRpdGxlOiAnMS4gUHVibGljYXIgdHUgZXN0aWxvIGVuIE1hcGJveCBvIHByb3BvcmNpb25hciBlbCB0b2tlbiBkZSBhY2Nlc28nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMTogJ1B1ZWRlcyBjcmVhciBlbCB0dSBwcm9waW8gZXN0aWxvIGRlIG1hcGEgZW4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMjogJ3knLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMzogJ3B1YmxpY2FyJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTQ6ICdsby4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNTogJ1BhcmEgdXRpbGl6YXIgdW4gZXN0aWxvIHByaXZhZG8sIGVuZ2FuY2hhIHR1JyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTY6ICd0b2tlbiBkZSBhY2Nlc28nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNzpcbiAgICAgICAgJ2FxdcOtLiAqa2VwbGVyLmdsIGVzIHVuYSBhcGxpY2FjacOzbiBjbGllbnRlLCBsb3MgZGF0b3MgcXVlZGFuIGVuIHR1IG5hdmVnYWRvci4uJyxcbiAgICAgIGV4YW1wbGVUb2tlbjogJ3AuZS4gcGsuYWJjZGVmZy54eHh4eHgnLFxuICAgICAgcGFzdGVUaXRsZTogJzIuIEVuZ2FuY2hhIGVsIGVubGFjZSBkZWwgZXN0aWxvJyxcbiAgICAgIHBhc3RlU3VidGl0bGUxOiAnUXXDqSBlcyB1bicsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogJ2VubGFjZSBkZWwgZXN0aWxvJyxcbiAgICAgIG5hbWluZ1RpdGxlOiAnMy4gUG9uZXIgbm9tYnJlIGEgdHUgZXN0aWxvJ1xuICAgIH0sXG4gICAgc2hhcmVNYXA6IHtcbiAgICAgIHNoYXJlVXJpVGl0bGU6ICdDb21wYXJ0aXIgZWwgZW5sYWNlIGRlbCBtYXBhJyxcbiAgICAgIHNoYXJlVXJpU3VidGl0bGU6ICdHZW5lcmFyIHVuIGVubGFjZSBkZWwgbWFwYSBwYXJhIGNvbXBhcnRpciBjb24gb3Ryb3MnLFxuICAgICAgY2xvdWRUaXRsZTogJ0FsbWFjZW5hZ2UgZW4gbGEgbnViZScsXG4gICAgICBjbG91ZFN1YnRpdGxlOiAnQWNjZWRlciB5IGNhcmdhciBkYXRvcyBkZWwgbWFwYSBhIHR1IGFsbWFjZW5hZ2UgYSBsYSBudWJlIHBlcnNvbmFsJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCBndWFyZGFyw6EgbG9zIGRhdG9zIGRlbCBtYXBhIGVuIGVsIGFsbWFjZW5hZ2UgZGUgdHUgbnViZSBwZXJzb25hbCwgc8OzbG8gcXVpZW4gdGVuZ2EgZWwgZW5sYWNlIHBvZHJhIGFjY2VkZXIgYWwgbWFwYSB5IGEgbG9zIGRhdG9zIC4gJyArXG4gICAgICAgICdQdWVkZXMgZWRpdGFyL2JvcnJhciBlbCBhcmNoaXZvIGRlIGRhdG9zIGVuIHR1IGN1ZW50YSBlbiBsYSBudWJlIGVuIGN1YWxxdWllciBtb21lbnRvLicsXG4gICAgICBnb3RvUGFnZTogJ1ZlcyBhIGxhIHDDoWdpbmEgZGUge2N1cnJlbnRQcm92aWRlcn0gZGUgS2VwbGVyLmdsJ1xuICAgIH0sXG4gICAgc3RhdHVzUGFuZWw6IHtcbiAgICAgIG1hcFVwbG9hZGluZzogJ0NhcmdhciB1biBtYXBhJyxcbiAgICAgIGVycm9yOiAnRXJyb3InXG4gICAgfSxcbiAgICBzYXZlTWFwOiB7XG4gICAgICB0aXRsZTogJ0FsbWFjZW50YWdlIGVuIGxhIG51YmUnLFxuICAgICAgc3VidGl0bGU6ICdBY2NlZGVyIHBhcmEgZ3VhcmRhciBlbCBtYXBhIGVuIHRldSBhbG1hY2VuYWdlIGVuIGxhIG51YmUnXG4gICAgfSxcbiAgICBleHBvcnRNYXA6IHtcbiAgICAgIGZvcm1hdFRpdGxlOiAnRm9ybWF0byBkZSBtYXBhJyxcbiAgICAgIGZvcm1hdFN1YnRpdGxlOiAnRXNjb2dlciBlbCBmb3JtYXRvIGFsIHF1ZSBzZSBkZXNlYSBleHBvcnRhciBlbCBtYXBhJyxcbiAgICAgIGh0bWw6IHtcbiAgICAgICAgc2VsZWN0aW9uOiAnRXhwb3J0YXIgdHUgbWFwYSBjb21vIHVuIGFyY2hpdm8gSFRNTCBpbnRlcmFjdGl2by4nLFxuICAgICAgICB0b2tlblRpdGxlOiAnVG9rZW4gZGUgYWNjZXNvIGRlIE1hcGJveCcsXG4gICAgICAgIHRva2VuU3VidGl0bGU6ICdVdGlsaXphciB0dSB0b2tlbiBkZSBhY2Nlc28gYSBNYXBib3ggYWwgYXJjaGl2byBIVE1MIChvcGNpb25hbCknLFxuICAgICAgICB0b2tlblBsYWNlaG9sZGVyOiAnRW5nYW5jaGFyIHR1IHRva2VuIGRlIGFjY2VzbyBhIE1hcGJveCcsXG4gICAgICAgIHRva2VuTWlzdXNlV2FybmluZzpcbiAgICAgICAgICAnKiBTaSBubyBwcm9wb3JjaW9uYXMgdHUgcHJvcGlvIHRva2VuLCBlbCBtYXBhIHBvZHLDrWEgZmFsbGFyIGVuIGN1YWxxdWllciBtb21lbnRvIGN1YW5kbyByZWVtcGxhY2Vtb3MgbnVlc3RybyB0b2tlbiBwYXJhIGV2aXRhciBhYnVzb3MuICcsXG4gICAgICAgIHRva2VuRGlzY2xhaW1lcjpcbiAgICAgICAgICAnUHVlZGVzIGNhbWJpYXIgZWwgdG9rZW4gZGUgTWFwYm94IHBvc3Rlcmlvcm1lbnRlIHV0aWxpemFuZG8gZXN0YXMgaW5zdHJ1Y2Npb25lczogJyxcbiAgICAgICAgdG9rZW5VcGRhdGU6ICdDb21vIGFjdHVhbGl0emFyIHVuIHRva2VuIHByZWV4aXN0ZW50ZS4nLFxuICAgICAgICBtb2RlVGl0bGU6ICdNb2RvIG1hcGEnLFxuICAgICAgICBtb2RlU3VidGl0bGUxOiAnU2VsZWNjaW9uYXIgbW9kbyBhcHAuIE3DoXMgJyxcbiAgICAgICAgbW9kZVN1YnRpdGxlMjogJ2luZm9ybWFjacOzbicsXG4gICAgICAgIG1vZGVEZXNjcmlwdGlvbjogJ1Blcm1taXRlIGEgbG9zIHVzdWFyaW9zIHttb2RvfSBlbCBtYXBhJyxcbiAgICAgICAgcmVhZDogJ2xlZXInLFxuICAgICAgICBlZGl0OiAnZWRpdGFyJ1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgY29uZmlnVGl0bGU6ICdDb25maWd1cmFjacOzbiBkZWwgbWFwYScsXG4gICAgICAgIGNvbmZpZ0Rpc2NsYWltZXI6XG4gICAgICAgICAgJ0xhIGNvbmZpZ3VyYWNpw7NuIGRlbCBtYXBhIHNlcsOhIGluY2x1aWRhIGVuIGVsIGFyY2hpdm8gSnNvbi4gU2kgdXRpbGl0emFzIGtlcGxlci5nbCBlbiB0dSBwcm9waWEgYXBwIHB1ZWRlcyBjb3BpYXIgZXN0YSBjb25maWd1cmFjacOzbiB5IHBhc2FybGEgYSAgJyxcbiAgICAgICAgc2VsZWN0aW9uOlxuICAgICAgICAgICdFeHBvcnRhciBsb3MgZGF0b3MgZGVsIG1hcGEgeSBsYSBjb25maWd1cmFjacOzbiBlbiB1biBzb2xvIGFyY2hpdm8gSnNvbi4gUG9zdGVyaW9ybWVudGUgcHVlZGVzIGFicmlyIGVzdGUgbWlzbW8gbWFwYSBjYXJnYW5kbyBlc3RlIG1pc21vIGFyY2hpdm8gYSBrZXBsZXIuZ2wuJyxcbiAgICAgICAgZGlzY2xhaW1lcjpcbiAgICAgICAgICAnKiBMYSBjb25maWd1cmFjacOzbiBkZWwgbWFwYSBzZSBjb21iaW5hIGNvbiBsb3MgY29uanVudG9zIGRlIGRhdG9zIGNhcmdhZG9zLiDigJhkYXRhSWTigJkgc2UgdXRpbGl6YSBwYXJhIHZpbmN1bGFyIGNhcGFzLCBmaWx0cm9zIHkgc3VnZXJlbmNpYXMgYSB1biBjb25qdW50byBkZSBkYXRvcyBlc3BlY8OtZmljby4gJyArXG4gICAgICAgICAgJ0N1YW5kbyBwYXNlcyBlc3RhIGNvbmZpZ3VyYWNpw7NuIGEgYWRkRGF0YVRvTWFwLCBhc2VndXJhIHF1ZSBlbCBpZGVudGlmaWNhZG9yIGRlbCBjb25qdW50byBkZSBkYXRvcyBjb2luY2lkYSBjb24gbG9zIOKAmGRhdGFJZOKAmSBkZSBlc3RhIGNvbmZpZ3VyYWNpw7NuLidcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRpbmdEaWFsb2c6IHtcbiAgICAgIGxvYWRpbmc6ICdDYXJnYW5kby4uLidcbiAgICB9LFxuICAgIGxvYWREYXRhOiB7XG4gICAgICB1cGxvYWQ6ICdDYXJnYXIgYXJjaGl2b3MnLFxuICAgICAgc3RvcmFnZTogJ0NhcmdhciBkZXNkZSBhbG1hY2VuYWdlJ1xuICAgIH0sXG4gICAgdHJpcEluZm86IHtcbiAgICAgIHRpdGxlOiAnQ29tbyBoYWJpbGl0YXIgbGEgYW5pbWFjacOzbiBkZSB2aWFqZScsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdQYXJhIGFuaW1hciBsYSBydXRhLCBsb3MgZGF0b3MgZ2VvSlNPTiBoYW4gZGUgY29udGVuZXIgYExpbmVTdHJpbmdgIGVuIHN1IGdlb21ldHLDrWEgeSBsYXMgY29vcmRlbmFkYXMgZGUgTGluZVN0cmluZyBkZWJlbiB0ZW5lciA0IGVsZW1lbnRvcyBlbiBsb3MgZm9ybWF0cyBkZSAnLFxuICAgICAgY29kZTogJyBbbG9uZ2l0dWRlLCBsYXRpdHVkZSwgYWx0aXR1ZGUsIHRpbWVzdGFtcF0gJyxcbiAgICAgIGRlc2NyaXB0aW9uMjpcbiAgICAgICAgJ3kgZWwgw7psdGltbyBlbGVtZW50byBkZWJlIHNlciBsYSBtYXJjYSBkZWwgdGllbXBvLiBMb3MgZm9ybWF0b3MgdsOhbGlkb3MgcGFyYSBsYSBtYXJjYSBkZSB0aWVtcG8gaW5jbHV5ZW4gVW5peCBlbiBzZWd1bmRvcyBjb21vIGAxNTY0MTg0MzYzYCBvIGVuIG1pbGlzZWd1bmRvcyBjb21vIGAxNTY0MTg0MzYzMDAwYC4nLFxuICAgICAgZXhhbXBsZTogJ0VqZW1wbG86J1xuICAgIH0sXG4gICAgaWNvbkluZm86IHtcbiAgICAgIHRpdGxlOiAnQ29tbyBkaWJ1amFyIMOtY29ub3MnLFxuICAgICAgZGVzY3JpcHRpb24xOlxuICAgICAgICAnRW4gdHUgQ1NWIGNyZWEgdW5hIGNvbHVtbmEgeSBwb24gZWwgbm9tYnJlIGRlbCDDrWNvbm8gcXVlIHF1aWVyZXMgZGlidWphci4gUHVlZGVzIGRlamFyIGxhIGNlbGRhIHZhY8OtYSBjdWFuZG8gbm8gcXVpZXJhcyBxdWUgc2UgbXVlc3RyZSBwYXJhIGNpZXJ0b3MgcHVudG9zLiBDdWFuZG8gbGEgY29sdW1uYSBzZSBsbGFtYScsXG4gICAgICBjb2RlOiAnw61jb25vJyxcbiAgICAgIGRlc2NyaXB0aW9uMjogJyBrZXBsZXIuZ2wgYXV0b23DoXRpY2FtZW50ZSBjcmVhcsOhIHVuYSBjYXBhIGRlIMOtY29uby4nLFxuICAgICAgZXhhbXBsZTogJ0VqZW1wbG86JyxcbiAgICAgIGljb25zOiAnSWNvbm9zJ1xuICAgIH0sXG4gICAgc3RvcmFnZU1hcFZpZXdlcjoge1xuICAgICAgbGFzdE1vZGlmaWVkOiAnw5psdGltYSBtb2RpZmljYWNpw7NuIGhhY2Uge2xhc3RVcGRhdGVkfScsXG4gICAgICBiYWNrOiAnQXRyw6FzJ1xuICAgIH0sXG4gICAgb3ZlcndyaXRlTWFwOiB7XG4gICAgICB0aXRsZTogJ0d1YXJkYW5kbyBlbCBtYXBhLi4uJyxcbiAgICAgIGFscmVhZHlFeGlzdHM6ICdqYSBleGlzdGUgZW4ge21hcFNhdmVkfS4gTG8gcXVpZXJlcyBzb2JyZWVzY3JpdmlyPydcbiAgICB9LFxuICAgIGxvYWRTdG9yYWdlTWFwOiB7XG4gICAgICBiYWNrOiAnQXRyw6FzJyxcbiAgICAgIGdvVG9QYWdlOiAnVmVzIGEgbGEgcMOhZ2luYSB7ZGlzcGxheU5hbWV9IGRlIEtlcGxlci5nbCcsXG4gICAgICBzdG9yYWdlTWFwczogJ0FsbWFuY2VuYWdlIC8gTWFwYXMnLFxuICAgICAgbm9TYXZlZE1hcHM6ICdObyBoYXkgbmluZ8O6biBtYXBhIGd1YXJkYWRvIHRvZGF2w61hJ1xuICAgIH1cbiAgfSxcbiAgaGVhZGVyOiB7XG4gICAgdmlzaWJsZUxheWVyczogJ0NhcGFzIHZpc2libGVzJyxcbiAgICBsYXllckxlZ2VuZDogJ0NhcGEgZGUgbGV5ZW5kYSdcbiAgfSxcbiAgaW50ZXJhY3Rpb25zOiB7XG4gICAgdG9vbHRpcDogJ1N1Z2VyZW5jaWFzJyxcbiAgICBicnVzaDogJ1BpbmNlbCcsXG4gICAgY29vcmRpbmF0ZTogJ0Nvb3JkZW5hZGFzJyxcbiAgICBnZW9jb2RlcjogJ0dlb2NvZGlmaWNhZG9yJ1xuICB9LFxuICBsYXllckJsZW5kaW5nOiB7XG4gICAgdGl0bGU6ICdDb21iaW5hY2nDs24gZGUgY2FwYXMnLFxuICAgIGFkZGl0aXZlOiAnYWRpdGl2YScsXG4gICAgbm9ybWFsOiAnbm9ybWFsJyxcbiAgICBzdWJ0cmFjdGl2ZTogJ3N1YnN0cmFjdGl2YSdcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAnQ29sdW1uYXMnLFxuICAgIGxhdDogJ2xhdCcsXG4gICAgbG5nOiAnbG9uJyxcbiAgICBhbHRpdHVkZTogJ2FsdHVyYScsXG4gICAgaWNvbjogJ8OtY29ubycsXG4gICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgIGFyYzoge1xuICAgICAgbGF0MDogJ2xhdCBvcmlnZW4nLFxuICAgICAgbG5nMDogJ2xuZyBvcmlnZW4gJyxcbiAgICAgIGxhdDE6ICdsYXQgZGVzdGlubycsXG4gICAgICBsbmcxOiAnbG5nIGRlc3Rpbm8nXG4gICAgfSxcbiAgICBsaW5lOiB7XG4gICAgICBhbHQwOiAnYWx0dXJhIG9yaWdlbicsXG4gICAgICBhbHQxOiAnYWx0dXJhIGRlc3Rpbm8nXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiAnVGFtYcOxbyBkZSBsYSBtYWxsYSAoa20pJ1xuICAgIH0sXG4gICAgaGV4YWdvbjoge1xuICAgICAgd29ybGRVbml0U2l6ZTogJ1JhZGlvIGRlIGhleMOhZ29ubyAoa20pJ1xuICAgIH0sXG4gICAgaGV4X2lkOiAnaWQgaGV4J1xuICB9LFxuICBjb2xvcjoge1xuICAgIGN1c3RvbVBhbGV0dGU6ICdQYWxldGEgcGVyc29uYWxpemFkYScsXG4gICAgc3RlcHM6ICdwYXNvcycsXG4gICAgdHlwZTogJ3RpcG8nLFxuICAgIHJldmVyc2VkOiAnaW52ZXJ0aWRhJ1xuICB9LFxuICBzY2FsZToge1xuICAgIGNvbG9yU2NhbGU6ICdFc2NhbGEgZGUgY29sb3InLFxuICAgIHNpemVTY2FsZTogJ0VzY2FsYSBkZSBtZWRpZGFzJyxcbiAgICBzdHJva2VTY2FsZTogJ0VzY2FsYSBkZSB0cmF6bycsXG4gICAgc2NhbGU6ICdFc2NhbGEnXG4gIH0sXG4gIGZpbGVVcGxvYWRlcjoge1xuICAgIG1lc3NhZ2U6ICdBcnJhc3RyYSB5IHN1ZWx0YSBlbCBhcmNoaXZvIGFxdcOtJyxcbiAgICBjaHJvbWVNZXNzYWdlOlxuICAgICAgJyp1c3VhcmlvIGRlIENocm9tZTogbGEgbWVkaWRhIG3DoXhpbWEgc29uIDI1MG1iLCBzaSBkZWJlcyBjYXJnYXIgdW4gYXJjaGl2byBtw6FzIGdyYW5kZSB1dGlsaXphIFNhZmFyaScsXG4gICAgZGlzY2xhaW1lcjpcbiAgICAgICcqa2VwbGVyLmdsIGVzIHVuYSBhcGxpY2FjacOzbiBhbCBsYWRvIGNsaWVudGUgcXVlIG5vIHV0aWxpemEgbmluZ8O6biBzZXJ2aWRvci4gTG9zIGRhdG9zIHPDs2xvIGV4aXN0ZW4gZW4gdHUgbcOhcXVpbmEvbmF2ZWdhZG9yLiAnICtcbiAgICAgICdObyBzZSBlbnZpYW4gZGF0b3MgbmkgbWFwYXMgYSBuaW5nw7puIHNlcnZpZG9yLicsXG4gICAgY29uZmlnVXBsb2FkTWVzc2FnZTpcbiAgICAgICdDYXJnYXIge2ZpbGVGb3JtYXROYW1lc30gbyB1biBtYXBhIGd1YXJkYWRvIGVuICoqSnNvbioqLiBNw6FzIGluZm9ybWFjacOzbiBzb2JyZSBbKipzdXBwb3J0ZWQgZmlsZSBmb3JtYXRzKipdJyxcbiAgICBicm93c2VGaWxlczogJ25hdmVnYSBwb3IgdHVzIGFyY2hpdm9zJyxcbiAgICB1cGxvYWRpbmc6ICdDYXJnYW5kbycsXG4gICAgZmlsZU5vdFN1cHBvcnRlZDogJ0VsIGFyY2hpdm8ge2Vycm9yRmlsZXN9IG5vIGVzIGNvbXBhdGlibGUuJyxcbiAgICBvcjogJ28nXG4gIH0sXG4gIGdlb2NvZGVyOiB7XG4gICAgdGl0bGU6ICdJbnRyb2R1Y2UgdW5hIGRpcmVjY2nDs24nXG4gIH0sXG4gIGZpZWxkU2VsZWN0b3I6IHtcbiAgICBjbGVhckFsbDogJ1F1aXRhciB0b2RvcycsXG4gICAgZm9ybWF0dGluZzogJ0Zvcm1hdG8nXG4gIH0sXG4gIGNvbXBhcmU6IHtcbiAgICBtb2RlTGFiZWw6ICdNb2RvIENvbXBhcmFjacOzbicsXG4gICAgdHlwZUxhYmVsOiAnVGlwbyBkZSBDb21wYXJhY2nDs24nLFxuICAgIHR5cGVzOiB7XG4gICAgICBhYnNvbHV0ZTogJ0Fic29sdXRhJyxcbiAgICAgIHJlbGF0aXZlOiAnUmVsYXRpdmEnXG4gICAgfVxuICB9LFxuICBtYXBQb3BvdmVyOiB7XG4gICAgcHJpbWFyeTogJ1ByaW5jaXBhbCdcbiAgfSxcbiAgZGVuc2l0eTogJ2RlbnNpZGFkJyxcbiAgJ0J1ZyBSZXBvcnQnOiAnSW5mb3JtZSBkZSBlcnJvcmVzJyxcbiAgJ1VzZXIgR3VpZGUnOiAnR3XDrWEgZGUgdXN1YXJpbycsXG4gIFNhdmU6ICdHdWFkYXInLFxuICBTaGFyZTogJ0NvbXBhcnRpcidcbn07XG4iXX0=