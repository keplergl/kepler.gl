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
    heightRange: 'Rango de alturas'
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
    '3DMap': 'Mapa 3D'
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
    coordinate: 'Coordenadas'
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
    grid: {
      worldUnitSize: 'Tamaño de la malla (km)'
    },
    hexagon: {
      worldUnitSize: 'Radio de hexágono (km)'
    }
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
    configUploadMessage: 'Cargar **CSV**, **GeoJson** o un mapa guardado en **Json**. Más información sobre [**supported file formats**]',
    browseFiles: 'navega por tus archivos',
    uploading: 'Cargando',
    fileNotSupported: 'El archivo {errorFiles} no es compatible.',
    or: 'o'
  },
  density: 'densidad',
  'Bug Report': 'Informe de errores',
  'User Guide': 'Guía de usuario',
  Save: 'Guadar',
  Share: 'Compartir'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vZXMuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwic3Ryb2tlQ29sb3IiLCJyYWRpdXMiLCJvdXRsaW5lIiwic3Ryb2tlIiwiZGVuc2l0eSIsImhlaWdodCIsInN1bSIsInBvaW50Q291bnQiLCJwbGFjZWhvbGRlciIsInNlYXJjaCIsInNlbGVjdEZpZWxkIiwieUF4aXMiLCJzZWxlY3RUeXBlIiwic2VsZWN0VmFsdWUiLCJlbnRlclZhbHVlIiwiZW1wdHkiLCJtaXNjIiwiYnkiLCJ2YWx1ZXNJbiIsInZhbHVlRXF1YWxzIiwiZGF0YVNvdXJjZSIsImJydXNoUmFkaXVzIiwibWFwTGF5ZXJzIiwidGl0bGUiLCJyb2FkIiwiYm9yZGVyIiwiYnVpbGRpbmciLCJ3YXRlciIsImxhbmQiLCJwYW5lbCIsInRleHQiLCJsYWJlbFdpdGhJZCIsImZvbnRTaXplIiwiZm9udENvbG9yIiwidGV4dEFuY2hvciIsImFsaWdubWVudCIsImFkZE1vcmVMYWJlbCIsInNpZGViYXIiLCJwYW5lbHMiLCJsYXllciIsImZpbHRlciIsImludGVyYWN0aW9uIiwiYmFzZW1hcCIsInJlcXVpcmVkIiwicHJvcGVydHlCYXNlZE9uIiwiY292ZXJhZ2UiLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsInN0cm9rZVdpZHRoUmFuZ2UiLCJmaXhlZFJhZGl1cyIsImZpeGVkUmFkaXVzRGVzY3JpcHRpb24iLCJyYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXMiLCJyYWRpdXNSYW5nZVBpeGVscyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwic3Ryb2tlQ29sb3JSYW5nZSIsInRhcmdldENvbG9yIiwiY29sb3JBZ2dyZWdhdGlvbiIsImhlaWdodEFnZ3JlZ2F0aW9uIiwicmVzb2x1dGlvblJhbmdlIiwic2l6ZVNjYWxlIiwid29ybGRVbml0U2l6ZSIsImVsZXZhdGlvblNjYWxlIiwiaGVpZ2h0U2NhbGUiLCJjb3ZlcmFnZVJhbmdlIiwiaGlnaFByZWNpc2lvblJlbmRlcmluZyIsImhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbiIsImhlaWdodERlc2NyaXB0aW9uIiwiZmlsbCIsImVuYWJsZVBvbHlnb25IZWlnaHQiLCJzaG93V2lyZWZyYW1lIiwid2VpZ2h0SW50ZW5zaXR5Iiwiem9vbVNjYWxlIiwiaGVpZ2h0UmFuZ2UiLCJsYXllck1hbmFnZXIiLCJhZGREYXRhIiwiYWRkTGF5ZXIiLCJsYXllckJsZW5kaW5nIiwibWFwTWFuYWdlciIsIm1hcFN0eWxlIiwiYWRkTWFwU3R5bGUiLCJsYXllckNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJob3dUbyIsImZpbHRlck1hbmFnZXIiLCJhZGRGaWx0ZXIiLCJkYXRhc2V0VGl0bGUiLCJzaG93RGF0YVRhYmxlIiwicmVtb3ZlRGF0YXNldCIsImRhdGFzZXRJbmZvIiwicm93Q291bnQiLCJ0b29sdGlwIiwiaGlkZUxheWVyIiwic2hvd0xheWVyIiwiaGlkZUZlYXR1cmUiLCJzaG93RmVhdHVyZSIsImhpZGUiLCJzaG93IiwicmVtb3ZlTGF5ZXIiLCJsYXllclNldHRpbmdzIiwiY2xvc2VQYW5lbCIsInN3aXRjaFRvRHVhbFZpZXciLCJzaG93TGVnZW5kIiwiZGlzYWJsZTNETWFwIiwiRHJhd09uTWFwIiwic2VsZWN0TG9jYWxlIiwiaGlkZUxheWVyUGFuZWwiLCJzaG93TGF5ZXJQYW5lbCIsIm1vdmVUb1RvcCIsInNlbGVjdEJhc2VNYXBTdHlsZSIsInRpbWVQbGF5YmFjayIsImNsb3VkU3RvcmFnZSIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwibW9kYWwiLCJkZWxldGVEYXRhc2V0IiwiYWRkRGF0YVRvTWFwIiwiYWRkQ3VzdG9tTWFwYm94U3R5bGUiLCJzaGFyZVVSTCIsImJ1dHRvbiIsImRvd25sb2FkIiwiYWRkU3R5bGUiLCJzYXZlIiwiZGVmYXVsdENhbmNlbCIsImRlZmF1bHRDb25maXJtIiwicmF0aW9UaXRsZSIsInJhdGlvRGVzY3JpcHRpb24iLCJyYXRpb09yaWdpbmFsU2NyZWVuIiwicmF0aW9DdXN0b20iLCJyYXRpbzRfMyIsInJhdGlvMTZfOSIsInJlc29sdXRpb25UaXRsZSIsInJlc29sdXRpb25EZXNjcmlwdGlvbiIsIm1hcExlZ2VuZFRpdGxlIiwibWFwTGVnZW5kQWRkIiwiZGF0YXNldFN1YnRpdGxlIiwiYWxsRGF0YXNldHMiLCJkYXRhVHlwZVRpdGxlIiwiZGF0YVR5cGVTdWJ0aXRsZSIsImZpbHRlckRhdGFUaXRsZSIsImZpbHRlckRhdGFTdWJ0aXRsZSIsImZpbHRlcmVkRGF0YSIsInVuZmlsdGVyZWREYXRhIiwiZmlsZUNvdW50IiwiZGVsZXRlRGF0YSIsIndhcm5pbmciLCJwdWJsaXNoVGl0bGUiLCJwdWJsaXNoU3VidGl0bGUxIiwicHVibGlzaFN1YnRpdGxlMiIsInB1Ymxpc2hTdWJ0aXRsZTMiLCJwdWJsaXNoU3VidGl0bGU0IiwicHVibGlzaFN1YnRpdGxlNSIsInB1Ymxpc2hTdWJ0aXRsZTYiLCJwdWJsaXNoU3VidGl0bGU3IiwiZXhhbXBsZVRva2VuIiwicGFzdGVUaXRsZSIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJuYW1pbmdUaXRsZSIsInNoYXJlTWFwIiwic2hhcmVVcmlUaXRsZSIsInNoYXJlVXJpU3VidGl0bGUiLCJjbG91ZFRpdGxlIiwiY2xvdWRTdWJ0aXRsZSIsInNoYXJlRGlzY2xhaW1lciIsImdvdG9QYWdlIiwic3RhdHVzUGFuZWwiLCJtYXBVcGxvYWRpbmciLCJlcnJvciIsInN1YnRpdGxlIiwiZm9ybWF0VGl0bGUiLCJmb3JtYXRTdWJ0aXRsZSIsImh0bWwiLCJzZWxlY3Rpb24iLCJ0b2tlblRpdGxlIiwidG9rZW5TdWJ0aXRsZSIsInRva2VuUGxhY2Vob2xkZXIiLCJ0b2tlbk1pc3VzZVdhcm5pbmciLCJ0b2tlbkRpc2NsYWltZXIiLCJ0b2tlblVwZGF0ZSIsIm1vZGVUaXRsZSIsIm1vZGVTdWJ0aXRsZTEiLCJtb2RlU3VidGl0bGUyIiwibW9kZURlc2NyaXB0aW9uIiwicmVhZCIsImVkaXQiLCJqc29uIiwiY29uZmlnVGl0bGUiLCJjb25maWdEaXNjbGFpbWVyIiwiZGlzY2xhaW1lciIsImxvYWRpbmdEaWFsb2ciLCJsb2FkaW5nIiwibG9hZERhdGEiLCJ1cGxvYWQiLCJzdG9yYWdlIiwidHJpcEluZm8iLCJkZXNjcmlwdGlvbjEiLCJjb2RlIiwiZGVzY3JpcHRpb24yIiwiZXhhbXBsZSIsImljb25JbmZvIiwiaWNvbnMiLCJzdG9yYWdlTWFwVmlld2VyIiwibGFzdE1vZGlmaWVkIiwiYmFjayIsIm92ZXJ3cml0ZU1hcCIsImFscmVhZHlFeGlzdHMiLCJsb2FkU3RvcmFnZU1hcCIsImdvVG9QYWdlIiwic3RvcmFnZU1hcHMiLCJub1NhdmVkTWFwcyIsImhlYWRlciIsInZpc2libGVMYXllcnMiLCJsYXllckxlZ2VuZCIsImludGVyYWN0aW9ucyIsImJydXNoIiwiY29vcmRpbmF0ZSIsImFkZGl0aXZlIiwibm9ybWFsIiwic3VidHJhY3RpdmUiLCJjb2x1bW5zIiwibGF0IiwibG5nIiwiYWx0aXR1ZGUiLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiY3VzdG9tUGFsZXR0ZSIsInN0ZXBzIiwicmV2ZXJzZWQiLCJzY2FsZSIsImNvbG9yU2NhbGUiLCJzdHJva2VTY2FsZSIsImZpbGVVcGxvYWRlciIsIm1lc3NhZ2UiLCJjaHJvbWVNZXNzYWdlIiwiY29uZmlnVXBsb2FkTWVzc2FnZSIsImJyb3dzZUZpbGVzIiwidXBsb2FkaW5nIiwiZmlsZU5vdFN1cHBvcnRlZCIsIm9yIiwiU2F2ZSIsIlNoYXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7Ozs7O2VBRWU7QUFDYkEsRUFBQUEsUUFBUSxFQUFFO0FBQ1JDLElBQUFBLE1BQU0sRUFBRSxNQURBO0FBRVJDLElBQUFBLEtBQUssRUFBRSxVQUZDO0FBR1JDLElBQUFBLFNBQVMsRUFBRSxrQkFISDtBQUlSQyxJQUFBQSxLQUFLLEVBQUUsT0FKQztBQUtSQyxJQUFBQSxXQUFXLEVBQUUsZ0JBTEw7QUFNUkMsSUFBQUEsTUFBTSxFQUFFLE9BTkE7QUFPUkMsSUFBQUEsT0FBTyxFQUFFLFVBUEQ7QUFRUkMsSUFBQUEsTUFBTSxFQUFFLE9BUkE7QUFTUkMsSUFBQUEsT0FBTyxFQUFFLFVBVEQ7QUFVUkMsSUFBQUEsTUFBTSxFQUFFLFFBVkE7QUFXUkMsSUFBQUEsR0FBRyxFQUFFLE1BWEc7QUFZUkMsSUFBQUEsVUFBVSxFQUFFO0FBWkosR0FERztBQWViQyxFQUFBQSxXQUFXLEVBQUU7QUFDWEMsSUFBQUEsTUFBTSxFQUFFLFVBREc7QUFFWEMsSUFBQUEsV0FBVyxFQUFFLHFCQUZGO0FBR1hDLElBQUFBLEtBQUssRUFBRSxPQUhJO0FBSVhDLElBQUFBLFVBQVUsRUFBRSxvQkFKRDtBQUtYQyxJQUFBQSxXQUFXLEVBQUUscUJBTEY7QUFNWEMsSUFBQUEsVUFBVSxFQUFFLGdCQU5EO0FBT1hDLElBQUFBLEtBQUssRUFBRTtBQVBJLEdBZkE7QUF3QmJDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxFQUFFLEVBQUUsRUFEQTtBQUVKQyxJQUFBQSxRQUFRLEVBQUUsWUFGTjtBQUdKQyxJQUFBQSxXQUFXLEVBQUUsZUFIVDtBQUlKQyxJQUFBQSxVQUFVLEVBQUUsaUJBSlI7QUFLSkMsSUFB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RDtBQStaYjRRLEVBQUFBLElBQUksRUFBRSxRQS9aTztBQWdhYkMsRUFBQUEsS0FBSyxFQUFFO0FBaGFNLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0xPQ0FMRVN9IGZyb20gJy4vbG9jYWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcGVydHk6IHtcbiAgICB3ZWlnaHQ6ICdwZXNvJyxcbiAgICBsYWJlbDogJ2V0aXF1ZXRhJyxcbiAgICBmaWxsQ29sb3I6ICdjb2xvciBkZSByZWxsZW5vJyxcbiAgICBjb2xvcjogJ2NvbG9yJyxcbiAgICBzdHJva2VDb2xvcjogJ2NvbG9yIGRlIHRyYXpvJyxcbiAgICByYWRpdXM6ICdyYWRpbycsXG4gICAgb3V0bGluZTogJ2NvbnRvcm5vJyxcbiAgICBzdHJva2U6ICd0cmF6bycsXG4gICAgZGVuc2l0eTogJ2RlbnNpZGFkJyxcbiAgICBoZWlnaHQ6ICdhbHR1cmEnLFxuICAgIHN1bTogJ3N1bWEnLFxuICAgIHBvaW50Q291bnQ6ICdSZWN1ZW50byBkZSBwdW50b3MnXG4gIH0sXG4gIHBsYWNlaG9sZGVyOiB7XG4gICAgc2VhcmNoOiAnQnVzcXVlZGEnLFxuICAgIHNlbGVjdEZpZWxkOiAnU2VsZWNjaW9uYSB1biBjYW1wbycsXG4gICAgeUF4aXM6ICdFamUgWScsXG4gICAgc2VsZWN0VHlwZTogJ1NlbGVjY2lvbmEgdW4gVGlwbycsXG4gICAgc2VsZWN0VmFsdWU6ICdTZWxlY2Npb25hIHVuIFZhbG9yJyxcbiAgICBlbnRlclZhbHVlOiAnRW50cmEgdW4gdmFsb3InLFxuICAgIGVtcHR5OiAndmFjaW8nXG4gIH0sXG4gIG1pc2M6IHtcbiAgICBieTogJycsXG4gICAgdmFsdWVzSW46ICdWYWxvcmVzIGVuJyxcbiAgICB2YWx1ZUVxdWFsczogJ1ZhbG9yIGlndWFsIGEnLFxuICAgIGRhdGFTb3VyY2U6ICdGdWVudGUgZGUgZGF0b3MnLFxuICAgIGJydXNoUmFkaXVzOiAnUmFkaW8gZGVsIHBpbmNlbCAoa20pJyxcbiAgICBlbXB0eTogJyAnXG4gIH0sXG4gIG1hcExheWVyczoge1xuICAgIHRpdGxlOiAnQ2FwYXMgZGVsIG1hcGEnLFxuICAgIGxhYmVsOiAnRXRpcXVldGEnLFxuICAgIHJvYWQ6ICdDYXJyZXRlcmEnLFxuICAgIGJvcmRlcjogJ0Zyb250ZXJhJyxcbiAgICBidWlsZGluZzogJ0VkaWZpY2lvJyxcbiAgICB3YXRlcjogJ0FndWEnLFxuICAgIGxhbmQ6ICdUaWVycmEnLFxuICAgICczZEJ1aWxkaW5nJzogJ0VkaWZpY2lvIDNEJ1xuICB9LFxuICBwYW5lbDoge1xuICAgIHRleHQ6IHtcbiAgICAgIGxhYmVsOiAnZXRpcXVldGEnLFxuICAgICAgbGFiZWxXaXRoSWQ6ICdFdGlxdWV0YSB7bGFiZWxJZH0nLFxuICAgICAgZm9udFNpemU6ICdUYW1hw7FvIGRlIGZ1ZW50ZScsXG4gICAgICBmb250Q29sb3I6ICdDb2xvciBkZSBmdWVudGUnLFxuICAgICAgdGV4dEFuY2hvcjogJ0FuY2xhamUgZGVsIHRleHRvJyxcbiAgICAgIGFsaWdubWVudDogJ0FsaW5lYWNpw7NuJyxcbiAgICAgIGFkZE1vcmVMYWJlbDogJ0HDsWFkaXIgbcOhcyBldGlxdWV0YXMnXG4gICAgfVxuICB9LFxuICBzaWRlYmFyOiB7XG4gICAgcGFuZWxzOiB7XG4gICAgICBsYXllcjogJ0NhcGFzJyxcbiAgICAgIGZpbHRlcjogJ0ZpbHRyb3MnLFxuICAgICAgaW50ZXJhY3Rpb246ICdJbnRlcmFjY2lvbmVzJyxcbiAgICAgIGJhc2VtYXA6ICdNYXBhIGJhc2UnXG4gICAgfVxuICB9LFxuICBsYXllcjoge1xuICAgIHJlcXVpcmVkOiAnUmVxdWVyaWRvKicsXG4gICAgcmFkaXVzOiAnUmFkaW8nLFxuICAgIGNvbG9yOiAnQ29sb3InLFxuICAgIGZpbGxDb2xvcjogJ0NvbG9yIGRlIHJlbGxlbm8nLFxuICAgIG91dGxpbmU6ICdDb250b3JubycsXG4gICAgd2VpZ2h0OiAnR3J1ZXNvJyxcbiAgICBwcm9wZXJ0eUJhc2VkT246ICd7cHJvcGVydHl9IGJhc2FkbyBlbicsXG4gICAgY292ZXJhZ2U6ICdDb2JlcnR1cmEnLFxuICAgIHN0cm9rZTogJ1RyYXpvJyxcbiAgICBzdHJva2VXaWR0aDogJ0dyb3NvciBkZSB0cmF6bycsXG4gICAgc3Ryb2tlQ29sb3I6ICdDb2xvciBkZSB0cmF6bycsXG4gICAgYmFzaWM6ICdCw6FzaWNvJyxcbiAgICB0cmFpbExlbmd0aDogJ0xvbmdpdHVkIGRlIHBpc3RhJyxcbiAgICB0cmFpbExlbmd0aERlc2NyaXB0aW9uOiAnTnVtZXJvIGRlIHNlZ3VuZG9zIGhhc3RhIHF1ZSBkZXNhcGFyZXpjYSBlbCBjYW1pbm8nLFxuICAgIG5ld0xheWVyOiAnbnVldmEgY2FwYScsXG4gICAgZWxldmF0aW9uQnlEZXNjcmlwdGlvbjogJ1NpIGRlc2FjdGl2YWRvLCBsYSBhbHR1cmEgc2UgYmFzYSBlbiBlbCByZWN1ZW50byBkZSBwdW50b3MnLFxuICAgIGNvbG9yQnlEZXNjcmlwdGlvbjogJ1NpIGRlc2FjdGl2YWRvLCBlbCBjb2xvciBzZSBiYXNhIGVuIGVsIHJlY3VlbnRvIGRlIHB1bnRvcycsXG4gICAgYWdncmVnYXRlQnk6ICd7ZmllbGR9IGFncmVnYWRvIHBvcicsXG4gICAgJzNETW9kZWwnOiAnTW9kZWxvIDNEJyxcbiAgICAnM0RNb2RlbE9wdGlvbnMnOiAnT3BjaW9uZXMgZGVsIG1vZGVsbyAzRCcsXG4gICAgdHlwZToge1xuICAgICAgcG9pbnQ6ICdwdW50bycsXG4gICAgICBhcmM6ICdhcmNvJyxcbiAgICAgIGxpbmU6ICdsw61uZWEnLFxuICAgICAgZ3JpZDogJ21hbGxhJyxcbiAgICAgIGhleGJpbjogJ2hleGJpbicsXG4gICAgICBwb2x5Z29uOiAncG9sw61nb25vJyxcbiAgICAgIGdlb2pzb246ICdnZW9qc29uJyxcbiAgICAgIGNsdXN0ZXI6ICdjbHVzdGVyJyxcbiAgICAgIGljb246ICdpY29ubycsXG4gICAgICBoZWF0bWFwOiAnY29uY2VudHJhY2nDs24nLFxuICAgICAgaGV4YWdvbjogJ2hleMOhZ29ubycsXG4gICAgICBoZXhhZ29uaWQ6ICdIMycsXG4gICAgICB0cmlwOiAndmlhamUnLFxuICAgICAgczI6ICdTMicsXG4gICAgICAnM2QnOiAnM0QnXG4gICAgfVxuICB9LFxuICBsYXllclZpc0NvbmZpZ3M6IHtcbiAgICBzdHJva2VXaWR0aDogJ0FuY2hvIGRlbCB0cmF6bycsXG4gICAgc3Ryb2tlV2lkdGhSYW5nZTogJ1JhbmdvIGRlbCBhbmNobyBkZWwgdHJhem8nLFxuICAgIHJhZGl1czogJ1JhZGlvJyxcbiAgICBmaXhlZFJhZGl1czogJ1JhZGlvIGZpam8gYSBtZWRpcicsXG4gICAgZml4ZWRSYWRpdXNEZXNjcmlwdGlvbjogJ0FqdXN0YXIgZWwgcmFkaW8gYWwgcmFkaW8gYWJzb2x1dG8gZW4gbWV0cm9zLCBwLmUuIDUgYSA1IG1ldHJvcycsXG4gICAgcmFkaXVzUmFuZ2U6ICdSYW5nbyBkZSByYWRpbycsXG4gICAgY2x1c3RlclJhZGl1czogJ1JhZGlvIGRlbCBjbHVzdGVyIGVuIHDDrXhlbGVzJyxcbiAgICByYWRpdXNSYW5nZVBpeGVsczogJ1JhbmdvIGRlbCByYWRpbyBlbiBww614ZWxlcycsXG4gICAgb3BhY2l0eTogJ09wYWNpZGFkJyxcbiAgICBjb3ZlcmFnZTogJ0NvYmVydHVyYScsXG4gICAgb3V0bGluZTogJ0NvbnRvcm5vJyxcbiAgICBjb2xvclJhbmdlOiAnUmFuZ28gZGUgY29sb3InLFxuICAgIHN0cm9rZTogJ1RyYXpvJyxcbiAgICBzdHJva2VDb2xvcjogJ0NvbG9yIGRlIHRyYXpvJyxcbiAgICBzdHJva2VDb2xvclJhbmdlOiAnUmFuZ28gZGUgY29sb3IgZGUgdHJhem8nLFxuICAgIHRhcmdldENvbG9yOiAnQ29sb3IgZGVzdGlubycsXG4gICAgY29sb3JBZ2dyZWdhdGlvbjogJ0FncmVnYWNpw7NuIGRlIGNvbG9yJyxcbiAgICBoZWlnaHRBZ2dyZWdhdGlvbjogJ0FncmVnYWNpw7NuIGRlIGxhIGFsdHVyYScsXG4gICAgcmVzb2x1dGlvblJhbmdlOiAnUmFuZ28gZGUgcmVzb2x1Y2nDs24nLFxuICAgIHNpemVTY2FsZTogJ01lZGlkYSBkZSBlc2NhbGEnLFxuICAgIHdvcmxkVW5pdFNpemU6ICdNZWRpZGEgZGUgbGEgdW5pZGFkIG11bmRpYWwnLFxuICAgIGVsZXZhdGlvblNjYWxlOiAnRXNjYWxhIGRlIGVsZXZhY2nDs24nLFxuICAgIGhlaWdodFNjYWxlOiAnRXNjYWxhIGRlIGFsdHVyYScsXG4gICAgY292ZXJhZ2VSYW5nZTogJ1JhbmdvIGRlIGNvYmVydHVyYScsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZzogJ1JlcHJlc2VudGFjacOzbiBkZSBhbHRhIHByZWNpc2nDs24nLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbjogJ0xhIHByZWNpc2nDs24gYWx0YSB0ZW5kcsOhIHVuIHJlbmRpbWllbnRvIG3DoXMgYmFqbycsXG4gICAgaGVpZ2h0OiAnQWx0dXJhJyxcbiAgICBoZWlnaHREZXNjcmlwdGlvbjpcbiAgICAgICdIYXogY2xpYyBlbiBlbCBib3TDs24gZGUgYXJyaWJhIGEgbGEgZGVyZWNoYSBkZWwgbWFwYSBwZXIgY2FtYmlhciBhIHZpc3RhIDNEJyxcbiAgICBmaWxsOiAnUmVsbGVuYXInLFxuICAgIGVuYWJsZVBvbHlnb25IZWlnaHQ6ICdBY3RpdmFyIGxhIGFsdHVyYSBkZWwgcG9sw61nb25vJyxcbiAgICBzaG93V2lyZWZyYW1lOiAnTXVlc3RyYSBlc3F1ZW3DoHRpY28nLFxuICAgIHdlaWdodEludGVuc2l0eTogJ0ludGVuc2lkYWQgZGUgcGVzbycsXG4gICAgem9vbVNjYWxlOiAnRXNjYWxhIGRlIHpvb20nLFxuICAgIGhlaWdodFJhbmdlOiAnUmFuZ28gZGUgYWx0dXJhcydcbiAgfSxcbiAgbGF5ZXJNYW5hZ2VyOiB7XG4gICAgYWRkRGF0YTogJ0HDsWFkaXIgZGF0b3MnLFxuICAgIGFkZExheWVyOiAnQcOxYWRpciBjYXBhJyxcbiAgICBsYXllckJsZW5kaW5nOiAnQ29tYmluYXIgY2FwYXMnXG4gIH0sXG4gIG1hcE1hbmFnZXI6IHtcbiAgICBtYXBTdHlsZTogJ0VzdGlsbyBkZSBtYXBhJyxcbiAgICBhZGRNYXBTdHlsZTogJ0HDsWFkaXIgZXN0aWxvIGRlIG1hcGEnLFxuICAgICczZEJ1aWxkaW5nQ29sb3InOiAnQ29sb3IgZWRpZmljaW9zIDNEJ1xuICB9LFxuICBsYXllckNvbmZpZ3VyYXRpb246IHtcbiAgICBkZWZhdWx0RGVzY3JpcHRpb246ICdDYWxjdWxhciB7cHJvcGVydHl9IHNlZ8O6biBlbCBjYW1wbyBzZWxlY2Npb25hZG8nLFxuICAgIGhvd1RvOiAnSG93IHRvJ1xuICB9LFxuICBmaWx0ZXJNYW5hZ2VyOiB7XG4gICAgYWRkRmlsdGVyOiAnQcOxYWRpciBmaWx0cm8nXG4gIH0sXG4gIGRhdGFzZXRUaXRsZToge1xuICAgIHNob3dEYXRhVGFibGU6ICdNb3N0YXIgbGEgdGFibGEgZGUgZGF0b3MnLFxuICAgIHJlbW92ZURhdGFzZXQ6ICdFbGltaW5hciBjb25qdW50byBkZSBkYXRvcydcbiAgfSxcbiAgZGF0YXNldEluZm86IHtcbiAgICByb3dDb3VudDogJ3tyb3dDb3VudH0gZmlsZXMnXG4gIH0sXG4gIHRvb2x0aXA6IHtcbiAgICBoaWRlTGF5ZXI6ICdPY3VsdGFyIGxhIGNhcGEnLFxuICAgIHNob3dMYXllcjogJ01vc3RyYXIgbGEgY2FwYScsXG4gICAgaGlkZUZlYXR1cmU6ICdPY3VsdGFyIGVsIG9iamV0bycsXG4gICAgc2hvd0ZlYXR1cmU6ICdNb3N0cmFyIGVsIG9iamV0bycsXG4gICAgaGlkZTogJ09jdWx0YXInLFxuICAgIHNob3c6ICdNb3N0cmFyJyxcbiAgICByZW1vdmVMYXllcjogJ0VsaW1pbmFyIGNhcGEnLFxuICAgIGxheWVyU2V0dGluZ3M6ICdDb25maWd1cmFjacOzbiBkZSBjYXBhJyxcbiAgICBjbG9zZVBhbmVsOiAnQ2VycmFyIGVsIHBhbmVsIGFjdHVhbCcsXG4gICAgc3dpdGNoVG9EdWFsVmlldzogJ0NhbWJpYXIgYSBsYSB2aXN0YSBkZSBtYXBhIGR1YWwnLFxuICAgIHNob3dMZWdlbmQ6ICdNb3N0cmFyIGxleWVuZGEnLFxuICAgIGRpc2FibGUzRE1hcDogJ0Rlc2FjdGl2YXIgbWFwYSAzRCcsXG4gICAgRHJhd09uTWFwOiAnRGlidWphciBlbiBlbCBtYXBhJyxcbiAgICBzZWxlY3RMb2NhbGU6ICdTZWxlY2Npb25hciBjb25maWd1cmFjacOzbiByZWdpb25hbCcsXG4gICAgaGlkZUxheWVyUGFuZWw6ICdPY3VsdGFyIGxhIHRhYmxhIGRlIGNhcGFzJyxcbiAgICBzaG93TGF5ZXJQYW5lbDogJ01vc3RyYXIgbGEgdGFibGEgIGRlIGNhcGFzJyxcbiAgICBtb3ZlVG9Ub3A6ICdEZXNwbGF6YXIgYXJyaWJhIGRlIGxhcyBjYXBhcyBkZSBkYXRvcycsXG4gICAgc2VsZWN0QmFzZU1hcFN0eWxlOiAnU2VsZWNjaW9uYXIgZXN0aWxvIGRlIG1hcGEgYmFzZScsXG4gICAgZGVsZXRlOiAnQm9ycmFyJyxcbiAgICB0aW1lUGxheWJhY2s6ICdSZXByb2R1Y2Npw7NuIGRlIHRpZW1wbycsXG4gICAgY2xvdWRTdG9yYWdlOiAnQWxtYWNlbmFqZSBlbiBsYSBudWJlJyxcbiAgICAnM0RNYXAnOiAnTWFwYSAzRCdcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0YXIgaW1hZ2VuJyxcbiAgICBleHBvcnREYXRhOiAnRXhwb3J0YXIgZGF0b3MnLFxuICAgIGV4cG9ydE1hcDogJ0V4cG9ydGFyIG1hcGEnLFxuICAgIHNoYXJlTWFwVVJMOiAnQ29tcGFydGlyIGVsIGVubGFjZSBkZWwgbWFwYScsXG4gICAgc2F2ZU1hcDogJ0d1YXJkYXIgbWFwYScsXG4gICAgc2VsZWN0OiAnc2VsZWNjaW9uYScsXG4gICAgcG9seWdvbjogJ3BvbMOtZ29ubycsXG4gICAgcmVjdGFuZ2xlOiAncmVjdMOhbmd1bG8nLFxuICAgIGhpZGU6ICdlc2NvbmRlcicsXG4gICAgc2hvdzogJ21vc3RyYXInLFxuICAgIC4uLkxPQ0FMRVNcbiAgfSxcbiAgbW9kYWw6IHtcbiAgICB0aXRsZToge1xuICAgICAgZGVsZXRlRGF0YXNldDogJ0JvcnJhciBjb25qdW50byBkZSBkYXRvcycsXG4gICAgICBhZGREYXRhVG9NYXA6ICdBw7FhZGlyIGRhdG9zIGFsIG1hcGEnLFxuICAgICAgZXhwb3J0SW1hZ2U6ICdFeHBvcnRhciBpbWFnZW4nLFxuICAgICAgZXhwb3J0RGF0YTogJ0V4cG9ydGFyIGRhdG9zJyxcbiAgICAgIGV4cG9ydE1hcDogJ0V4cG9ydGFyIG1hcGEnLFxuICAgICAgYWRkQ3VzdG9tTWFwYm94U3R5bGU6ICdBw7FhZGlyIGVzdGlsbyBkZSBNYXBib3ggcHJvcGlvJyxcbiAgICAgIHNhdmVNYXA6ICdHdWFyZGFyIG1hcGEnLFxuICAgICAgc2hhcmVVUkw6ICdDb21wYXJ0aXIgZW5sYWNlJ1xuICAgIH0sXG4gICAgYnV0dG9uOiB7XG4gICAgICBkZWxldGU6ICdCb3JyYXInLFxuICAgICAgZG93bmxvYWQ6ICdEZXNjYXJnYXInLFxuICAgICAgZXhwb3J0OiAnRXhwb3J0YXInLFxuICAgICAgYWRkU3R5bGU6ICdBw7FhZGlyIGVzdGlsbycsXG4gICAgICBzYXZlOiAnR3VhcmRhcicsXG4gICAgICBkZWZhdWx0Q2FuY2VsOiAnQ2FuY2VsYXInLFxuICAgICAgZGVmYXVsdENvbmZpcm06ICdDb25maXJtYXInXG4gICAgfSxcbiAgICBleHBvcnRJbWFnZToge1xuICAgICAgcmF0aW9UaXRsZTogJ1JhdGlvJyxcbiAgICAgIHJhdGlvRGVzY3JpcHRpb246ICdFc29nZXIgcmF0aW8gcG9yIGRpdmVyc29zIHVzb3MuJyxcbiAgICAgIHJhdGlvT3JpZ2luYWxTY3JlZW46ICdQYW50YWxsYSBvcmlnaW5hbCcsXG4gICAgICByYXRpb0N1c3RvbTogJ1BlcnNvbmFsaXphZG8nLFxuICAgICAgcmF0aW80XzM6ICc0OjMnLFxuICAgICAgcmF0aW8xNl85OiAnMTY6OScsXG4gICAgICByZXNvbHV0aW9uVGl0bGU6ICdSZXNvbHVjacOzbicsXG4gICAgICByZXNvbHV0aW9uRGVzY3JpcHRpb246ICdVbmEgYWx0YSByZXNvbHVjacOzbiBlcyBtZWpvciBwYXJhIGxhcyBpbXByZXNpb25lcy4nLFxuICAgICAgbWFwTGVnZW5kVGl0bGU6ICdMZXllbmRhIGRlbCBtYXBhJyxcbiAgICAgIG1hcExlZ2VuZEFkZDogJ0HDsWFkaXIgbGV5ZW5kYSBhbCBtYXBhJ1xuICAgIH0sXG4gICAgZXhwb3J0RGF0YToge1xuICAgICAgZGF0YXNldFRpdGxlOiAnQ29uanVudG8gZGUgZGF0b3MnLFxuICAgICAgZGF0YXNldFN1YnRpdGxlOiAnRXNjb2dlciBsb3MgY29uanVudG9zIGRlIGRhdG9zIGEgZXhwb3J0YXInLFxuICAgICAgYWxsRGF0YXNldHM6ICdUb2RvcycsXG4gICAgICBkYXRhVHlwZVRpdGxlOiAnVGlwbyBkZSBkYXRvcycsXG4gICAgICBkYXRhVHlwZVN1YnRpdGxlOiAnRXNjb2dlciBlbCB0aXBvIGRlIGRhdG9zIGEgZXhwb3J0YXInLFxuICAgICAgZmlsdGVyRGF0YVRpdGxlOiAnRmlsdHJhciBkYXRvcycsXG4gICAgICBmaWx0ZXJEYXRhU3VidGl0bGU6ICdTZSBwdWVkZSBlc2NvZ2VyIGV4cG9ydGFyIGxvcyBkYXRvcyBvcmlnaW5hbGVzIG8gZmlsdHJhZG9zJyxcbiAgICAgIGZpbHRlcmVkRGF0YTogJ0RhdG9zIGZpbHRyYWRvcycsXG4gICAgICB1bmZpbHRlcmVkRGF0YTogJ0RhdG9zIHNpbiBmaWx0cmFyJyxcbiAgICAgIGZpbGVDb3VudDogJ3tmaWxlQ291bnR9IEFyY2hpdm9zJyxcbiAgICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSBGaWxlcydcbiAgICB9LFxuICAgIGRlbGV0ZURhdGE6IHtcbiAgICAgIHdhcm5pbmc6ICdlc3TDoXMgYSBwdW50byBkZSBib3JyYXIgZXN0ZSBjb25qdW50byBkZSBkYXRvcy4gQWZlY3RhcsOhIGEge2xlbmd0aH0gY2FwYXMnXG4gICAgfSxcbiAgICBhZGRTdHlsZToge1xuICAgICAgcHVibGlzaFRpdGxlOiAnMS4gUHVibGljYXIgdHUgZXN0aWxvIGVuIE1hcGJveCBvIHByb3BvcmNpb25hciBlbCB0b2tlbiBkZSBhY2Nlc28nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMTogJ1B1ZWRlcyBjcmVhciBlbCB0dSBwcm9waW8gZXN0aWxvIGRlIG1hcGEgZW4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMjogJ3knLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMzogJ3B1YmxpY2FyJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTQ6ICdsby4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNTogJ1BhcmEgdXRpbGl6YXIgdW4gZXN0aWxvIHByaXZhZG8sIGVuZ2FuY2hhIHR1JyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTY6ICd0b2tlbiBkZSBhY2Nlc28nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNzpcbiAgICAgICAgJ2FxdcOtLiAqa2VwbGVyLmdsIGVzIHVuYSBhcGxpY2FjacOzbiBjbGllbnRlLCBsb3MgZGF0b3MgcXVlZGFuIGVuIHR1IG5hdmVnYWRvci4uJyxcbiAgICAgIGV4YW1wbGVUb2tlbjogJ3AuZS4gcGsuYWJjZGVmZy54eHh4eHgnLFxuICAgICAgcGFzdGVUaXRsZTogJzIuIEVuZ2FuY2hhIGVsIGVubGFjZSBkZWwgZXN0aWxvJyxcbiAgICAgIHBhc3RlU3VidGl0bGUxOiAnUXXDqSBlcyB1bicsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogJ2VubGFjZSBkZWwgZXN0aWxvJyxcbiAgICAgIG5hbWluZ1RpdGxlOiAnMy4gUG9uZXIgbm9tYnJlIGEgdHUgZXN0aWxvJ1xuICAgIH0sXG4gICAgc2hhcmVNYXA6IHtcbiAgICAgIHNoYXJlVXJpVGl0bGU6ICdDb21wYXJ0aXIgZWwgZW5sYWNlIGRlbCBtYXBhJyxcbiAgICAgIHNoYXJlVXJpU3VidGl0bGU6ICdHZW5lcmFyIHVuIGVubGFjZSBkZWwgbWFwYSBwYXJhIGNvbXBhcnRpciBjb24gb3Ryb3MnLFxuICAgICAgY2xvdWRUaXRsZTogJ0FsbWFjZW5hZ2UgZW4gbGEgbnViZScsXG4gICAgICBjbG91ZFN1YnRpdGxlOiAnQWNjZWRlciB5IGNhcmdhciBkYXRvcyBkZWwgbWFwYSBhIHR1IGFsbWFjZW5hZ2UgYSBsYSBudWJlIHBlcnNvbmFsJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCBndWFyZGFyw6EgbG9zIGRhdG9zIGRlbCBtYXBhIGVuIGVsIGFsbWFjZW5hZ2UgZGUgdHUgbnViZSBwZXJzb25hbCwgc8OzbG8gcXVpZW4gdGVuZ2EgZWwgZW5sYWNlIHBvZHJhIGFjY2VkZXIgYWwgbWFwYSB5IGEgbG9zIGRhdG9zIC4gJyArXG4gICAgICAgICdQdWVkZXMgZWRpdGFyL2JvcnJhciBlbCBhcmNoaXZvIGRlIGRhdG9zIGVuIHR1IGN1ZW50YSBlbiBsYSBudWJlIGVuIGN1YWxxdWllciBtb21lbnRvLicsXG4gICAgICBnb3RvUGFnZTogJ1ZlcyBhIGxhIHDDoWdpbmEgZGUge2N1cnJlbnRQcm92aWRlcn0gZGUgS2VwbGVyLmdsJ1xuICAgIH0sXG4gICAgc3RhdHVzUGFuZWw6IHtcbiAgICAgIG1hcFVwbG9hZGluZzogJ0NhcmdhciB1biBtYXBhJyxcbiAgICAgIGVycm9yOiAnRXJyb3InXG4gICAgfSxcbiAgICBzYXZlTWFwOiB7XG4gICAgICB0aXRsZTogJ0FsbWFjZW50YWdlIGVuIGxhIG51YmUnLFxuICAgICAgc3VidGl0bGU6ICdBY2NlZGVyIHBhcmEgZ3VhcmRhciBlbCBtYXBhIGVuIHRldSBhbG1hY2VuYWdlIGVuIGxhIG51YmUnXG4gICAgfSxcbiAgICBleHBvcnRNYXA6IHtcbiAgICAgIGZvcm1hdFRpdGxlOiAnRm9ybWF0byBkZSBtYXBhJyxcbiAgICAgIGZvcm1hdFN1YnRpdGxlOiAnRXNjb2dlciBlbCBmb3JtYXRvIGFsIHF1ZSBzZSBkZXNlYSBleHBvcnRhciBlbCBtYXBhJyxcbiAgICAgIGh0bWw6IHtcbiAgICAgICAgc2VsZWN0aW9uOiAnRXhwb3J0YXIgdHUgbWFwYSBjb21vIHVuIGFyY2hpdm8gSFRNTCBpbnRlcmFjdGl2by4nLFxuICAgICAgICB0b2tlblRpdGxlOiAnVG9rZW4gZGUgYWNjZXNvIGRlIE1hcGJveCcsXG4gICAgICAgIHRva2VuU3VidGl0bGU6ICdVdGlsaXphciB0dSB0b2tlbiBkZSBhY2Nlc28gYSBNYXBib3ggYWwgYXJjaGl2byBIVE1MIChvcGNpb25hbCknLFxuICAgICAgICB0b2tlblBsYWNlaG9sZGVyOiAnRW5nYW5jaGFyIHR1IHRva2VuIGRlIGFjY2VzbyBhIE1hcGJveCcsXG4gICAgICAgIHRva2VuTWlzdXNlV2FybmluZzpcbiAgICAgICAgICAnKiBTaSBubyBwcm9wb3JjaW9uYXMgdHUgcHJvcGlvIHRva2VuLCBlbCBtYXBhIHBvZHLDrWEgZmFsbGFyIGVuIGN1YWxxdWllciBtb21lbnRvIGN1YW5kbyByZWVtcGxhY2Vtb3MgbnVlc3RybyB0b2tlbiBwYXJhIGV2aXRhciBhYnVzb3MuICcsXG4gICAgICAgIHRva2VuRGlzY2xhaW1lcjpcbiAgICAgICAgICAnUHVlZGVzIGNhbWJpYXIgZWwgdG9rZW4gZGUgTWFwYm94IHBvc3Rlcmlvcm1lbnRlIHV0aWxpemFuZG8gZXN0YXMgaW5zdHJ1Y2Npb25lczogJyxcbiAgICAgICAgdG9rZW5VcGRhdGU6ICdDb21vIGFjdHVhbGl0emFyIHVuIHRva2VuIHByZWV4aXN0ZW50ZS4nLFxuICAgICAgICBtb2RlVGl0bGU6ICdNb2RvIG1hcGEnLFxuICAgICAgICBtb2RlU3VidGl0bGUxOiAnU2VsZWNjaW9uYXIgbW9kbyBhcHAuIE3DoXMgJyxcbiAgICAgICAgbW9kZVN1YnRpdGxlMjogJ2luZm9ybWFjacOzbicsXG4gICAgICAgIG1vZGVEZXNjcmlwdGlvbjogJ1Blcm1taXRlIGEgbG9zIHVzdWFyaW9zIHttb2RvfSBlbCBtYXBhJyxcbiAgICAgICAgcmVhZDogJ2xlZXInLFxuICAgICAgICBlZGl0OiAnZWRpdGFyJ1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgY29uZmlnVGl0bGU6ICdDb25maWd1cmFjacOzbiBkZWwgbWFwYScsXG4gICAgICAgIGNvbmZpZ0Rpc2NsYWltZXI6XG4gICAgICAgICAgJ0xhIGNvbmZpZ3VyYWNpw7NuIGRlbCBtYXBhIHNlcsOhIGluY2x1aWRhIGVuIGVsIGFyY2hpdm8gSnNvbi4gU2kgdXRpbGl0emFzIGtlcGxlci5nbCBlbiB0dSBwcm9waWEgYXBwIHB1ZWRlcyBjb3BpYXIgZXN0YSBjb25maWd1cmFjacOzbiB5IHBhc2FybGEgYSAgJyxcbiAgICAgICAgc2VsZWN0aW9uOlxuICAgICAgICAgICdFeHBvcnRhciBsb3MgZGF0b3MgZGVsIG1hcGEgeSBsYSBjb25maWd1cmFjacOzbiBlbiB1biBzb2xvIGFyY2hpdm8gSnNvbi4gUG9zdGVyaW9ybWVudGUgcHVlZGVzIGFicmlyIGVzdGUgbWlzbW8gbWFwYSBjYXJnYW5kbyBlc3RlIG1pc21vIGFyY2hpdm8gYSBrZXBsZXIuZ2wuJyxcbiAgICAgICAgZGlzY2xhaW1lcjpcbiAgICAgICAgICAnKiBMYSBjb25maWd1cmFjacOzbiBkZWwgbWFwYSBzZSBjb21iaW5hIGNvbiBsb3MgY29uanVudG9zIGRlIGRhdG9zIGNhcmdhZG9zLiDigJhkYXRhSWTigJkgc2UgdXRpbGl6YSBwYXJhIHZpbmN1bGFyIGNhcGFzLCBmaWx0cm9zIHkgc3VnZXJlbmNpYXMgYSB1biBjb25qdW50byBkZSBkYXRvcyBlc3BlY8OtZmljby4gJyArXG4gICAgICAgICAgJ0N1YW5kbyBwYXNlcyBlc3RhIGNvbmZpZ3VyYWNpw7NuIGEgYWRkRGF0YVRvTWFwLCBhc2VndXJhIHF1ZSBlbCBpZGVudGlmaWNhZG9yIGRlbCBjb25qdW50byBkZSBkYXRvcyBjb2luY2lkYSBjb24gbG9zIOKAmGRhdGFJZOKAmSBkZSBlc3RhIGNvbmZpZ3VyYWNpw7NuLidcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRpbmdEaWFsb2c6IHtcbiAgICAgIGxvYWRpbmc6ICdDYXJnYW5kby4uLidcbiAgICB9LFxuICAgIGxvYWREYXRhOiB7XG4gICAgICB1cGxvYWQ6ICdDYXJnYXIgYXJjaGl2b3MnLFxuICAgICAgc3RvcmFnZTogJ0NhcmdhciBkZXNkZSBhbG1hY2VuYWdlJ1xuICAgIH0sXG4gICAgdHJpcEluZm86IHtcbiAgICAgIHRpdGxlOiAnQ29tbyBoYWJpbGl0YXIgbGEgYW5pbWFjacOzbiBkZSB2aWFqZScsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdQYXJhIGFuaW1hciBsYSBydXRhLCBsb3MgZGF0b3MgZ2VvSlNPTiBoYW4gZGUgY29udGVuZXIgYExpbmVTdHJpbmdgIGVuIHN1IGdlb21ldHLDrWEgeSBsYXMgY29vcmRlbmFkYXMgZGUgTGluZVN0cmluZyBkZWJlbiB0ZW5lciA0IGVsZW1lbnRvcyBlbiBsb3MgZm9ybWF0cyBkZSAnLFxuICAgICAgY29kZTogJyBbbG9uZ2l0dWRlLCBsYXRpdHVkZSwgYWx0aXR1ZGUsIHRpbWVzdGFtcF0gJyxcbiAgICAgIGRlc2NyaXB0aW9uMjpcbiAgICAgICAgJ3kgZWwgw7psdGltbyBlbGVtZW50byBkZWJlIHNlciBsYSBtYXJjYSBkZWwgdGllbXBvLiBMb3MgZm9ybWF0b3MgdsOhbGlkb3MgcGFyYSBsYSBtYXJjYSBkZSB0aWVtcG8gaW5jbHV5ZW4gVW5peCBlbiBzZWd1bmRvcyBjb21vIGAxNTY0MTg0MzYzYCBvIGVuIG1pbGlzZWd1bmRvcyBjb21vIGAxNTY0MTg0MzYzMDAwYC4nLFxuICAgICAgZXhhbXBsZTogJ0VqZW1wbG86J1xuICAgIH0sXG4gICAgaWNvbkluZm86IHtcbiAgICAgIHRpdGxlOiAnQ29tbyBkaWJ1amFyIMOtY29ub3MnLFxuICAgICAgZGVzY3JpcHRpb24xOlxuICAgICAgICAnRW4gdHUgQ1NWIGNyZWEgdW5hIGNvbHVtbmEgeSBwb24gZWwgbm9tYnJlIGRlbCDDrWNvbm8gcXVlIHF1aWVyZXMgZGlidWphci4gUHVlZGVzIGRlamFyIGxhIGNlbGRhIHZhY8OtYSBjdWFuZG8gbm8gcXVpZXJhcyBxdWUgc2UgbXVlc3RyZSBwYXJhIGNpZXJ0b3MgcHVudG9zLiBDdWFuZG8gbGEgY29sdW1uYSBzZSBsbGFtYScsXG4gICAgICBjb2RlOiAnw61jb25vJyxcbiAgICAgIGRlc2NyaXB0aW9uMjogJyBrZXBsZXIuZ2wgYXV0b23DoXRpY2FtZW50ZSBjcmVhcsOhIHVuYSBjYXBhIGRlIMOtY29uby4nLFxuICAgICAgZXhhbXBsZTogJ0VqZW1wbG86JyxcbiAgICAgIGljb25zOiAnSWNvbm9zJ1xuICAgIH0sXG4gICAgc3RvcmFnZU1hcFZpZXdlcjoge1xuICAgICAgbGFzdE1vZGlmaWVkOiAnw5psdGltYSBtb2RpZmljYWNpw7NuIGhhY2Uge2xhc3RVcGRhdGVkfScsXG4gICAgICBiYWNrOiAnQXRyw6FzJ1xuICAgIH0sXG4gICAgb3ZlcndyaXRlTWFwOiB7XG4gICAgICB0aXRsZTogJ0d1YXJkYW5kbyBlbCBtYXBhLi4uJyxcbiAgICAgIGFscmVhZHlFeGlzdHM6ICdqYSBleGlzdGUgZW4ge21hcFNhdmVkfS4gTG8gcXVpZXJlcyBzb2JyZWVzY3JpdmlyPydcbiAgICB9LFxuICAgIGxvYWRTdG9yYWdlTWFwOiB7XG4gICAgICBiYWNrOiAnQXRyw6FzJyxcbiAgICAgIGdvVG9QYWdlOiAnVmVzIGEgbGEgcMOhZ2luYSB7ZGlzcGxheU5hbWV9IGRlIEtlcGxlci5nbCcsXG4gICAgICBzdG9yYWdlTWFwczogJ0FsbWFuY2VuYWdlIC8gTWFwYXMnLFxuICAgICAgbm9TYXZlZE1hcHM6ICdObyBoYXkgbmluZ8O6biBtYXBhIGd1YXJkYWRvIHRvZGF2w61hJ1xuICAgIH1cbiAgfSxcbiAgaGVhZGVyOiB7XG4gICAgdmlzaWJsZUxheWVyczogJ0NhcGFzIHZpc2libGVzJyxcbiAgICBsYXllckxlZ2VuZDogJ0NhcGEgZGUgbGV5ZW5kYSdcbiAgfSxcbiAgaW50ZXJhY3Rpb25zOiB7XG4gICAgdG9vbHRpcDogJ1N1Z2VyZW5jaWFzJyxcbiAgICBicnVzaDogJ1BpbmNlbCcsXG4gICAgY29vcmRpbmF0ZTogJ0Nvb3JkZW5hZGFzJ1xuICB9LFxuICBsYXllckJsZW5kaW5nOiB7XG4gICAgdGl0bGU6ICdDb21iaW5hY2nDs24gZGUgY2FwYXMnLFxuICAgIGFkZGl0aXZlOiAnYWRpdGl2YScsXG4gICAgbm9ybWFsOiAnbm9ybWFsJyxcbiAgICBzdWJ0cmFjdGl2ZTogJ3N1YnN0cmFjdGl2YSdcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAnQ29sdW1uYXMnLFxuICAgIGxhdDogJ2xhdCcsXG4gICAgbG5nOiAnbG9uJyxcbiAgICBhbHRpdHVkZTogJ2FsdHVyYScsXG4gICAgaWNvbjogJ8OtY29ubycsXG4gICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgIGFyYzoge1xuICAgICAgbGF0MDogJ2xhdCBvcmlnZW4nLFxuICAgICAgbG5nMDogJ2xuZyBvcmlnZW4gJyxcbiAgICAgIGxhdDE6ICdsYXQgZGVzdGlubycsXG4gICAgICBsbmcxOiAnbG5nIGRlc3Rpbm8nXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiAnVGFtYcOxbyBkZSBsYSBtYWxsYSAoa20pJ1xuICAgIH0sXG4gICAgaGV4YWdvbjoge1xuICAgICAgd29ybGRVbml0U2l6ZTogJ1JhZGlvIGRlIGhleMOhZ29ubyAoa20pJ1xuICAgIH1cbiAgfSxcbiAgY29sb3I6IHtcbiAgICBjdXN0b21QYWxldHRlOiAnUGFsZXRhIHBlcnNvbmFsaXphZGEnLFxuICAgIHN0ZXBzOiAncGFzb3MnLFxuICAgIHR5cGU6ICd0aXBvJyxcbiAgICByZXZlcnNlZDogJ2ludmVydGlkYSdcbiAgfSxcbiAgc2NhbGU6IHtcbiAgICBjb2xvclNjYWxlOiAnRXNjYWxhIGRlIGNvbG9yJyxcbiAgICBzaXplU2NhbGU6ICdFc2NhbGEgZGUgbWVkaWRhcycsXG4gICAgc3Ryb2tlU2NhbGU6ICdFc2NhbGEgZGUgdHJhem8nLFxuICAgIHNjYWxlOiAnRXNjYWxhJ1xuICB9LFxuICBmaWxlVXBsb2FkZXI6IHtcbiAgICBtZXNzYWdlOiAnQXJyYXN0cmEgeSBzdWVsdGEgZWwgYXJjaGl2byBhcXXDrScsXG4gICAgY2hyb21lTWVzc2FnZTpcbiAgICAgICcqdXN1YXJpbyBkZSBDaHJvbWU6IGxhIG1lZGlkYSBtw6F4aW1hIHNvbiAyNTBtYiwgc2kgZGViZXMgY2FyZ2FyIHVuIGFyY2hpdm8gbcOhcyBncmFuZGUgdXRpbGl6YSBTYWZhcmknLFxuICAgIGRpc2NsYWltZXI6XG4gICAgICAnKmtlcGxlci5nbCBlcyB1bmEgYXBsaWNhY2nDs24gYWwgbGFkbyBjbGllbnRlIHF1ZSBubyB1dGlsaXphIG5pbmfDum4gc2Vydmlkb3IuIExvcyBkYXRvcyBzw7NsbyBleGlzdGVuIGVuIHR1IG3DoXF1aW5hL25hdmVnYWRvci4gJyArXG4gICAgICAnTm8gc2UgZW52aWFuIGRhdG9zIG5pIG1hcGFzIGEgbmluZ8O6biBzZXJ2aWRvci4nLFxuICAgIGNvbmZpZ1VwbG9hZE1lc3NhZ2U6XG4gICAgICAnQ2FyZ2FyICoqQ1NWKiosICoqR2VvSnNvbioqIG8gdW4gbWFwYSBndWFyZGFkbyBlbiAqKkpzb24qKi4gTcOhcyBpbmZvcm1hY2nDs24gc29icmUgWyoqc3VwcG9ydGVkIGZpbGUgZm9ybWF0cyoqXScsXG4gICAgYnJvd3NlRmlsZXM6ICduYXZlZ2EgcG9yIHR1cyBhcmNoaXZvcycsXG4gICAgdXBsb2FkaW5nOiAnQ2FyZ2FuZG8nLFxuICAgIGZpbGVOb3RTdXBwb3J0ZWQ6ICdFbCBhcmNoaXZvIHtlcnJvckZpbGVzfSBubyBlcyBjb21wYXRpYmxlLicsXG4gICAgb3I6ICdvJ1xuICB9LFxuICBkZW5zaXR5OiAnZGVuc2lkYWQnLFxuICAnQnVnIFJlcG9ydCc6ICdJbmZvcm1lIGRlIGVycm9yZXMnLFxuICAnVXNlciBHdWlkZSc6ICdHdcOtYSBkZSB1c3VhcmlvJyxcbiAgU2F2ZTogJ0d1YWRhcicsXG4gIFNoYXJlOiAnQ29tcGFydGlyJ1xufTtcbiJdfQ==