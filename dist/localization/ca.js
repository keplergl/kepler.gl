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
    weight: 'pes',
    label: 'etiqueta',
    fillColor: 'color fons',
    color: 'color',
    coverage: 'cobertura',
    strokeColor: 'color de traç',
    radius: 'radi',
    outline: 'outline',
    stroke: 'traç',
    density: 'densitat',
    height: 'alçada',
    sum: 'suma',
    pointCount: 'Recompte de Punts'
  },
  placeholder: {
    search: 'Cerca',
    selectField: 'Selecciona un camp',
    yAxis: 'Eix Y',
    selectType: 'Selecciona un Tipus',
    selectValue: 'Selecciona un Valor',
    enterValue: 'Entra un valor',
    empty: 'buit'
  },
  misc: {
    by: '',
    valuesIn: 'Valors a',
    valueEquals: 'Valor igual a',
    dataSource: 'Font de dades',
    brushRadius: 'Radi del pinzell (km)',
    empty: ' '
  },
  mapLayers: {
    title: 'Capes del mapa',
    label: 'Etiqueta',
    road: 'Carretera',
    border: 'Frontera',
    building: 'Edifici',
    water: 'Aigua',
    land: 'Terra',
    '3dBuilding': 'Edifici 3D'
  },
  panel: {
    text: {
      label: 'etiqueta',
      labelWithId: 'Etiqueta {labelId}',
      fontSize: 'Mida de la font',
      fontColor: 'Color de la font',
      textAnchor: 'Àncora del text',
      alignment: 'Alineació',
      addMoreLabel: 'Afegeix més etiquetes'
    }
  },
  sidebar: {
    panels: {
      layer: 'Capes',
      filter: 'Filtres',
      interaction: 'Interaccions',
      basemap: 'Mapa base'
    }
  },
  layer: {
    required: 'Requerit*',
    radius: 'Radi',
    color: 'Color',
    fillColor: 'Color fons',
    outline: 'Contorn',
    weight: 'Gruix',
    propertyBasedOn: '{property} basada en',
    coverage: 'Cobertura',
    stroke: 'Traç',
    strokeWidth: 'Amplada de traç',
    strokeColor: 'Color de traç',
    basic: 'Basic',
    trailLength: 'Longitud de pista',
    trailLengthDescription: 'Nombre de segons fins que desapareix el camí',
    newLayer: 'nova capa',
    elevationByDescription: "Si desactivat, l'alçada es basa en el recompte de punts",
    colorByDescription: 'Si desactivat, el color es basa en el recompte de punts',
    aggregateBy: '{field} agregat per',
    '3DModel': 'Model 3D',
    '3DModelOptions': 'Opcions del model 3D',
    type: {
      point: 'punt',
      arc: 'arc',
      line: 'línia',
      grid: 'malla',
      hexbin: 'hexbin',
      polygon: 'polígon',
      geojson: 'geojson',
      cluster: 'cluster',
      icon: 'icona',
      heatmap: 'heatmap',
      hexagon: 'hexàgon',
      hexagonid: 'H3',
      trip: 'viatge',
      s2: 'S2',
      '3d': '3D'
    }
  },
  layerVisConfigs: {
    angle: 'Angle',
    strokeWidth: 'Amplada traç',
    strokeWidthRange: 'Rang amplada de traç',
    radius: 'Radi',
    fixedRadius: 'Radi fixe a mesurar',
    fixedRadiusDescription: 'Ajusta el radi al radi absolut en metres, p.ex 5 a 5 metres',
    radiusRange: 'Rang de radi',
    clusterRadius: 'Radi Cluster en Pixels',
    radiusRangePixels: 'Rang del radi en pixels',
    opacity: 'Opacitat',
    coverage: 'Cobertura',
    outline: 'Outline',
    colorRange: 'Rang de color',
    stroke: 'Traç',
    strokeColor: 'Color de traç',
    strokeColorRange: 'Rang de color de traç',
    targetColor: 'Color destí',
    colorAggregation: 'Agregació de color',
    heightAggregation: 'Agregació alçada',
    resolutionRange: 'Rang de resolució',
    sizeScale: 'Mida escala',
    worldUnitSize: 'Mida de la unitat mundial',
    elevationScale: 'Escala elevació',
    enableElevationZoomFactor: 'Utilitzeu el factor de zoom d’elevació',
    enableElevationZoomFactorDescription: "'Ajusteu l'alçada / elevació en funció del factor de zoom actual",
    enableHeightZoomFactor: 'Utilitzeu el factor de zoom d’alçada',
    heightScale: 'Escala alçada',
    coverageRange: 'Rang ed cobertura',
    highPrecisionRendering: 'Representació alta precisió',
    highPrecisionRenderingDescription: 'La precisió alta tindrà rendiment més baix',
    height: 'Alçada',
    heightDescription: 'Fes clic al botó a dalt a la dreta del mapa per canviar a vista 3D',
    fill: 'Omple',
    enablePolygonHeight: 'Activa alçada del polígon',
    showWireframe: 'Mostra Wireframe',
    weightIntensity: 'Intensitat de pes',
    zoomScale: 'Escala de zoom',
    heightRange: 'Rang alçada',
    heightMultiplier: "Multiplicador d'alçada"
  },
  layerManager: {
    addData: 'Afegeix Dades',
    addLayer: 'Afegeix Capes',
    layerBlending: 'Combinar capes'
  },
  mapManager: {
    mapStyle: 'Estil de mapa',
    addMapStyle: 'Afegeix estils de mapa',
    '3dBuildingColor': 'Color edifici 3D'
  },
  layerConfiguration: {
    defaultDescription: 'Calcula {property} segons el camp seleccionat',
    howTo: 'How to'
  },
  filterManager: {
    addFilter: 'Afegeix Filtre'
  },
  datasetTitle: {
    showDataTable: 'Mostra taula de dades',
    removeDataset: 'Elimina conjunt de dades'
  },
  datasetInfo: {
    rowCount: '{rowCount} files'
  },
  tooltip: {
    hideLayer: 'oculta la capa',
    showLayer: 'mostra la capa',
    hideFeature: "Amaga l'objecte",
    showFeature: "Mostra l'objecte",
    hide: 'amaga',
    show: 'mostra',
    removeLayer: 'Elimina capa',
    layerSettings: 'Configuració de capa',
    closePanel: 'Tanca panel actual',
    switchToDualView: 'Canvia a la vista de mapa dual',
    showLegend: 'mostra llegenda',
    disable3DMap: 'Desactiva mapa 3D',
    DrawOnMap: 'Dibuixa al mapa',
    selectLocale: 'Selecciona configuració regional',
    hideLayerPanel: 'Oculta el tauler de capes',
    showLayerPanel: 'Mostra el tauler de capes',
    moveToTop: 'Desplaça a dalt de tot de les capes de dades',
    selectBaseMapStyle: 'Selecciona estil de mapa base',
    "delete": 'Esborra',
    timePlayback: 'Reproducció de temps',
    cloudStorage: 'Emmagatzematge al núvol',
    '3DMap': 'Mapa 3D',
    animationByWindow: 'Finestra Temporal Mòbil',
    animationByIncremental: 'Finestra Temporal Incremental',
    speed: 'velocitat',
    play: 'iniciar',
    pause: 'pausar',
    reset: 'reiniciar'
  },
  toolbar: _objectSpread({
    exportImage: 'Exporta imatge',
    exportData: 'Exporta dades',
    exportMap: 'Exporta mapa',
    shareMapURL: 'Comparteix URL del mapa',
    saveMap: 'Desa mapa',
    select: 'selecciona',
    polygon: 'polígon',
    rectangle: 'rectangle',
    hide: 'amaga',
    show: 'mostra'
  }, _locales.LOCALES),
  modal: {
    title: {
      deleteDataset: 'Esborra conjunt de dades',
      addDataToMap: 'Afegeix dades al mapa',
      exportImage: 'Exporta imatge',
      exportData: 'Exporta dades',
      exportMap: 'Exporta mapa',
      addCustomMapboxStyle: 'Afegeix estil Mapbox propi',
      saveMap: 'Desa mapa',
      shareURL: 'Comparteix URL'
    },
    button: {
      "delete": 'Esborra',
      download: 'Descarrega',
      "export": 'Exporta',
      addStyle: 'Afegeix estil',
      save: 'Desa',
      defaultCancel: 'Cancel·la',
      defaultConfirm: 'Confirma'
    },
    exportImage: {
      ratioTitle: 'Ràtio',
      ratioDescription: 'Escull ràtio per diversos usos.',
      ratioOriginalScreen: 'Pantalla original',
      ratioCustom: 'Personalitzat',
      ratio4_3: '4:3',
      ratio16_9: '16:9',
      resolutionTitle: 'Resolució',
      resolutionDescription: 'Alta resolució és millor per a les impressions.',
      mapLegendTitle: 'Llegenda del mapa',
      mapLegendAdd: 'Afegir llegenda al mapa'
    },
    exportData: {
      datasetTitle: 'Conjunt de dades',
      datasetSubtitle: 'Escull els conjunts de dades que vols exportar',
      allDatasets: 'Tots',
      dataTypeTitle: 'Tipus de dades',
      dataTypeSubtitle: 'Escull els tipus de dades que vols exportar',
      filterDataTitle: 'Filtra dades',
      filterDataSubtitle: 'Pots escollir exportar les dades originals o les filtrades',
      filteredData: 'Dades filtrades',
      unfilteredData: 'Dades sense filtrar',
      fileCount: '{fileCount} Arxius',
      rowCount: '{rowCount} Files'
    },
    deleteData: {
      warning: "estàs a punt d'esborrar aquest conjunt de dades. Afectarà {length} capes"
    },
    addStyle: {
      publishTitle: "2. Publica el teu estil a Mapbox o proporciona el token d'accés",
      publishSubtitle1: 'Pots crear el teu propi estil de mapa a',
      publishSubtitle2: 'i',
      publishSubtitle3: 'publicar',
      publishSubtitle4: 'ho.',
      publishSubtitle5: 'Per utilitzar un estil privat, enganxa el teu',
      publishSubtitle6: "token d'accés",
      publishSubtitle7: 'aquí. *kepler.gl és una aplicació client, les dades romanen al teu navegador..',
      exampleToken: 'p.ex. pk.abcdefg.xxxxxx',
      pasteTitle: "1. Enganxa la URL de l'estil",
      pasteSubtitle1: 'Què és un',
      pasteSubtitle2: "URL de l'estil",
      namingTitle: '3. Posa nom al teu estil'
    },
    shareMap: {
      shareUriTitle: 'Comparteix URL del mapa',
      shareUriSubtitle: 'Genera una URL del mapa per compartir amb altri',
      cloudTitle: 'Emmagatzematge al núvol',
      cloudSubtitle: 'Accedeix i carrega dades de mapa al teu emmagatzematge al núvol personal',
      shareDisclaimer: 'kepler.gl desarà les dades del mapa al teu emmagatzematge al núvol personal, només qui tingui la URL podrà accedir al mapa i a les dades . ' + "Pots editar/esborrar l'arxiu de dades en el teu compte al núvol en qualsevol moment.",
      gotoPage: 'Ves a la pàgina de {currentProvider} de Kepler.gl'
    },
    statusPanel: {
      mapUploading: 'Carregar un mapa',
      error: 'Error'
    },
    saveMap: {
      title: 'Emmagatzematge al núvol',
      subtitle: 'Accedeix per desar el mapa al teu emmagatzematge al núvol'
    },
    exportMap: {
      formatTitle: 'Format de mapa',
      formatSubtitle: 'Escull el format amb què vols exportar el teu mapa',
      html: {
        selection: 'Exporta el teu mapa com un arxiu HTML interactiu.',
        tokenTitle: "Token d'accés de Mapbox",
        tokenSubtitle: "Utilitza el teu token d'accés de Mapbox a l'arxiu HTML (opcional)",
        tokenPlaceholder: "Enganxa el teu token d'accés a Mapbox",
        tokenMisuseWarning: '* Si no proporciones el teu propi token, el mapa podria fallar en qualsevol moment quan reemplacem el nostre token per evitar abusos. ',
        tokenDisclaimer: 'Pots canviar el toke de Mapbox més endavant fent servir aquestes instruccions: ',
        tokenUpdate: 'Com actualitzar un token preexistent.',
        modeTitle: 'Mode mapa',
        modeSubtitle1: 'Selecciona mode app. Més ',
        modeSubtitle2: 'informació',
        modeDescription: 'Permet als usuaris {mode} el mapa',
        read: 'llegir',
        edit: 'editar'
      },
      json: {
        configTitle: 'Configuració del mapa',
        configDisclaimer: "La configuració del mapa s'inclourà a l'arxiu Json. Si utilitzes kepler.gl a la teva pròpia app pots copiar aquesta configuració i passar-la a  ",
        selection: 'Exporta les dades del mapa i la configuració en un sol arxiu Json. Més endavant pots obrir aquest mateix mapa carregant aquest mateix arxiu a kepler.gl.',
        disclaimer: "* La configuració del mapa es combina amb els conjunts de dades carregats. ‘dataId’ s'utilitza per lligar capes, filtres i suggeriments a un conjunt de dades específic. " + "Quan passis aquesta configuració a addDataToMap, assegura que l'identificador del conjunt de dades coincideixi amb els ‘dataId’ d'aquesta configuració."
      }
    },
    loadingDialog: {
      loading: 'Carregant...'
    },
    loadData: {
      upload: 'Carregar arxius',
      storage: "Carregar des d'emmagatzematge"
    },
    tripInfo: {
      title: 'Com habilitar l’animació de viatge',
      description1: 'Per animar la ruta, les dades geoJSON han de contenir `LineString` en la seva geometria i les coordenades de LineString han de tenir 4 elements en els formats de ',
      code: ' [longitude, latitude, altitude, timestamp] ',
      description2: 'i el darrer element ha de ser la marca de temps. Els formats vàlids per a la marca de temps inclouen Unix en segons com `1564184363` o en milisegons com `1564184363000`.',
      example: 'Exemple:'
    },
    iconInfo: {
      title: 'Com dibuixar icones',
      description1: "En el teu CSV crea una columna i posa-hi el nom de la icona que vols dibuixar. Pots deixar la cel·la buida quan no vulguis que es mostri per a certs punts. Quan la columna s'anomena",
      code: 'icon',
      description2: " kepler.gl automàticament crearà una capa d'icona.",
      example: 'Exemple:',
      icons: 'Icones'
    },
    storageMapViewer: {
      lastModified: 'Darrera modificació fa {lastUpdated}',
      back: 'Enrere'
    },
    overwriteMap: {
      title: 'Desant mapa...',
      alreadyExists: 'ja existeix a {mapSaved}. El vols sobreescriure?'
    },
    loadStorageMap: {
      back: 'Enrere',
      goToPage: 'Ves a la pàgina {displayName} de Kepler.gl',
      storageMaps: 'Emmagatzematge / Mapes',
      noSavedMaps: 'Cap mapa desat encara'
    }
  },
  header: {
    visibleLayers: 'Capes visibles',
    layerLegend: 'Llegenda de capes'
  },
  interactions: {
    tooltip: 'Suggeriment',
    brush: 'Pinzell',
    coordinate: 'Coordenades',
    geocoder: 'Geocodificador'
  },
  layerBlending: {
    title: 'Combinació de capes',
    additive: 'additiva',
    normal: 'normal',
    subtractive: 'substractiva'
  },
  columns: {
    title: 'Columnes',
    lat: 'lat',
    lng: 'lon',
    altitude: 'alçada',
    icon: 'icona',
    geojson: 'geojson',
    arc: {
      lat0: 'lat origen',
      lng0: 'lng origen ',
      lat1: 'lat destinació',
      lng1: 'lng destinació'
    },
    line: {
      alt0: 'alçada origen',
      alt1: 'alçada destinació'
    },
    grid: {
      worldUnitSize: 'Mida de malla (km)'
    },
    hexagon: {
      worldUnitSize: "Radi d'hexàgon (km)"
    },
    hex_id: 'id hex'
  },
  color: {
    customPalette: 'Paleta personalitzada',
    steps: 'intervals',
    type: 'tipus',
    reversed: 'invertida'
  },
  scale: {
    colorScale: 'Escala de color',
    sizeScale: 'Escala de mides',
    strokeScale: 'Escala de traç',
    scale: 'Escala'
  },
  fileUploader: {
    message: "Arrossega i deixa anar l'arxiu aquí",
    chromeMessage: '*usuari de Chrome: la mida màxima són 250mb, si has de carrgar un arxiu més gran fes servir Safari',
    disclaimer: '*kepler.gl és una aplicació a la banda client que no es recolza en cap servidor. Les dades només existeixen a la teva màquina/navegador. ' + "No s'envien dades ni mapes a cap servidor.",
    configUploadMessage: 'Carrega {fileFormatNames} o un mapa desat en **Json**. Més informació sobre [**supported file formats**]',
    browseFiles: 'navega pels teus arxius',
    uploading: 'Carregant',
    fileNotSupported: "L'arxiu {errorFiles} no és compatible.",
    or: 'o'
  },
  geocoder: {
    title: 'Introdueix una adreça'
  },
  fieldSelector: {
    clearAll: 'Treure tots',
    formatting: 'Format'
  },
  compare: {
    modeLabel: 'Mode Comparació',
    typeLabel: 'Tipus de Comparació',
    types: {
      absolute: 'Absoluta',
      relative: 'Relativa'
    }
  },
  mapPopover: {
    primary: 'Principal'
  },
  density: 'densitat',
  'Bug Report': "Informe d'errors",
  'User Guide': "Guia d'usuari",
  Save: 'Desa',
  Share: 'Comparteix'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vY2EuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwiY292ZXJhZ2UiLCJzdHJva2VDb2xvciIsInJhZGl1cyIsIm91dGxpbmUiLCJzdHJva2UiLCJkZW5zaXR5IiwiaGVpZ2h0Iiwic3VtIiwicG9pbnRDb3VudCIsInBsYWNlaG9sZGVyIiwic2VhcmNoIiwic2VsZWN0RmllbGQiLCJ5QXhpcyIsInNlbGVjdFR5cGUiLCJzZWxlY3RWYWx1ZSIsImVudGVyVmFsdWUiLCJlbXB0eSIsIm1pc2MiLCJieSIsInZhbHVlc0luIiwidmFsdWVFcXVhbHMiLCJkYXRhU291cmNlIiwiYnJ1c2hSYWRpdXMiLCJtYXBMYXllcnMiLCJ0aXRsZSIsInJvYWQiLCJib3JkZXIiLCJidWlsZGluZyIsIndhdGVyIiwibGFuZCIsInBhbmVsIiwidGV4dCIsImxhYmVsV2l0aElkIiwiZm9udFNpemUiLCJmb250Q29sb3IiLCJ0ZXh0QW5jaG9yIiwiYWxpZ25tZW50IiwiYWRkTW9yZUxhYmVsIiwic2lkZWJhciIsInBhbmVscyIsImxheWVyIiwiZmlsdGVyIiwiaW50ZXJhY3Rpb24iLCJiYXNlbWFwIiwicmVxdWlyZWQiLCJwcm9wZXJ0eUJhc2VkT24iLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsImFuZ2xlIiwic3Ryb2tlV2lkdGhSYW5nZSIsImZpeGVkUmFkaXVzIiwiZml4ZWRSYWRpdXNEZXNjcmlwdGlvbiIsInJhZGl1c1JhbmdlIiwiY2x1c3RlclJhZGl1cyIsInJhZGl1c1JhbmdlUGl4ZWxzIiwib3BhY2l0eSIsImNvbG9yUmFuZ2UiLCJzdHJva2VDb2xvclJhbmdlIiwidGFyZ2V0Q29sb3IiLCJjb2xvckFnZ3JlZ2F0aW9uIiwiaGVpZ2h0QWdncmVnYXRpb24iLCJyZXNvbHV0aW9uUmFuZ2UiLCJzaXplU2NhbGUiLCJ3b3JsZFVuaXRTaXplIiwiZWxldmF0aW9uU2NhbGUiLCJlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yIiwiZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvckRlc2NyaXB0aW9uIiwiZW5hYmxlSGVpZ2h0Wm9vbUZhY3RvciIsImhlaWdodFNjYWxlIiwiY292ZXJhZ2VSYW5nZSIsImhpZ2hQcmVjaXNpb25SZW5kZXJpbmciLCJoaWdoUHJlY2lzaW9uUmVuZGVyaW5nRGVzY3JpcHRpb24iLCJoZWlnaHREZXNjcmlwdGlvbiIsImZpbGwiLCJlbmFibGVQb2x5Z29uSGVpZ2h0Iiwic2hvd1dpcmVmcmFtZSIsIndlaWdodEludGVuc2l0eSIsInpvb21TY2FsZSIsImhlaWdodFJhbmdlIiwiaGVpZ2h0TXVsdGlwbGllciIsImxheWVyTWFuYWdlciIsImFkZERhdGEiLCJhZGRMYXllciIsImxheWVyQmxlbmRpbmciLCJtYXBNYW5hZ2VyIiwibWFwU3R5bGUiLCJhZGRNYXBTdHlsZSIsImxheWVyQ29uZmlndXJhdGlvbiIsImRlZmF1bHREZXNjcmlwdGlvbiIsImhvd1RvIiwiZmlsdGVyTWFuYWdlciIsImFkZEZpbHRlciIsImRhdGFzZXRUaXRsZSIsInNob3dEYXRhVGFibGUiLCJyZW1vdmVEYXRhc2V0IiwiZGF0YXNldEluZm8iLCJyb3dDb3VudCIsInRvb2x0aXAiLCJoaWRlTGF5ZXIiLCJzaG93TGF5ZXIiLCJoaWRlRmVhdHVyZSIsInNob3dGZWF0dXJlIiwiaGlkZSIsInNob3ciLCJyZW1vdmVMYXllciIsImxheWVyU2V0dGluZ3MiLCJjbG9zZVBhbmVsIiwic3dpdGNoVG9EdWFsVmlldyIsInNob3dMZWdlbmQiLCJkaXNhYmxlM0RNYXAiLCJEcmF3T25NYXAiLCJzZWxlY3RMb2NhbGUiLCJoaWRlTGF5ZXJQYW5lbCIsInNob3dMYXllclBhbmVsIiwibW92ZVRvVG9wIiwic2VsZWN0QmFzZU1hcFN0eWxlIiwidGltZVBsYXliYWNrIiwiY2xvdWRTdG9yYWdlIiwiYW5pbWF0aW9uQnlXaW5kb3ciLCJhbmltYXRpb25CeUluY3JlbWVudGFsIiwic3BlZWQiLCJwbGF5IiwicGF1c2UiLCJyZXNldCIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwibW9kYWwiLCJkZWxldGVEYXRhc2V0IiwiYWRkRGF0YVRvTWFwIiwiYWRkQ3VzdG9tTWFwYm94U3R5bGUiLCJzaGFyZVVSTCIsImJ1dHRvbiIsImRvd25sb2FkIiwiYWRkU3R5bGUiLCJzYXZlIiwiZGVmYXVsdENhbmNlbCIsImRlZmF1bHRDb25maXJtIiwicmF0aW9UaXRsZSIsInJhdGlvRGVzY3JpcHRpb24iLCJyYXRpb09yaWdpbmFsU2NyZWVuIiwicmF0aW9DdXN0b20iLCJyYXRpbzRfMyIsInJhdGlvMTZfOSIsInJlc29sdXRpb25UaXRsZSIsInJlc29sdXRpb25EZXNjcmlwdGlvbiIsIm1hcExlZ2VuZFRpdGxlIiwibWFwTGVnZW5kQWRkIiwiZGF0YXNldFN1YnRpdGxlIiwiYWxsRGF0YXNldHMiLCJkYXRhVHlwZVRpdGxlIiwiZGF0YVR5cGVTdWJ0aXRsZSIsImZpbHRlckRhdGFUaXRsZSIsImZpbHRlckRhdGFTdWJ0aXRsZSIsImZpbHRlcmVkRGF0YSIsInVuZmlsdGVyZWREYXRhIiwiZmlsZUNvdW50IiwiZGVsZXRlRGF0YSIsIndhcm5pbmciLCJwdWJsaXNoVGl0bGUiLCJwdWJsaXNoU3VidGl0bGUxIiwicHVibGlzaFN1YnRpdGxlMiIsInB1Ymxpc2hTdWJ0aXRsZTMiLCJwdWJsaXNoU3VidGl0bGU0IiwicHVibGlzaFN1YnRpdGxlNSIsInB1Ymxpc2hTdWJ0aXRsZTYiLCJwdWJsaXNoU3VidGl0bGU3IiwiZXhhbXBsZVRva2VuIiwicGFzdGVUaXRsZSIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJuYW1pbmdUaXRsZSIsInNoYXJlTWFwIiwic2hhcmVVcmlUaXRsZSIsInNoYXJlVXJpU3VidGl0bGUiLCJjbG91ZFRpdGxlIiwiY2xvdWRTdWJ0aXRsZSIsInNoYXJlRGlzY2xhaW1lciIsImdvdG9QYWdlIiwic3RhdHVzUGFuZWwiLCJtYXBVcGxvYWRpbmciLCJlcnJvciIsInN1YnRpdGxlIiwiZm9ybWF0VGl0bGUiLCJmb3JtYXRTdWJ0aXRsZSIsImh0bWwiLCJzZWxlY3Rpb24iLCJ0b2tlblRpdGxlIiwidG9rZW5TdWJ0aXRsZSIsInRva2VuUGxhY2Vob2xkZXIiLCJ0b2tlbk1pc3VzZVdhcm5pbmciLCJ0b2tlbkRpc2NsYWltZXIiLCJ0b2tlblVwZGF0ZSIsIm1vZGVUaXRsZSIsIm1vZGVTdWJ0aXRsZTEiLCJtb2RlU3VidGl0bGUyIiwibW9kZURlc2NyaXB0aW9uIiwicmVhZCIsImVkaXQiLCJqc29uIiwiY29uZmlnVGl0bGUiLCJjb25maWdEaXNjbGFpbWVyIiwiZGlzY2xhaW1lciIsImxvYWRpbmdEaWFsb2ciLCJsb2FkaW5nIiwibG9hZERhdGEiLCJ1cGxvYWQiLCJzdG9yYWdlIiwidHJpcEluZm8iLCJkZXNjcmlwdGlvbjEiLCJjb2RlIiwiZGVzY3JpcHRpb24yIiwiZXhhbXBsZSIsImljb25JbmZvIiwiaWNvbnMiLCJzdG9yYWdlTWFwVmlld2VyIiwibGFzdE1vZGlmaWVkIiwiYmFjayIsIm92ZXJ3cml0ZU1hcCIsImFscmVhZHlFeGlzdHMiLCJsb2FkU3RvcmFnZU1hcCIsImdvVG9QYWdlIiwic3RvcmFnZU1hcHMiLCJub1NhdmVkTWFwcyIsImhlYWRlciIsInZpc2libGVMYXllcnMiLCJsYXllckxlZ2VuZCIsImludGVyYWN0aW9ucyIsImJydXNoIiwiY29vcmRpbmF0ZSIsImdlb2NvZGVyIiwiYWRkaXRpdmUiLCJub3JtYWwiLCJzdWJ0cmFjdGl2ZSIsImNvbHVtbnMiLCJsYXQiLCJsbmciLCJhbHRpdHVkZSIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJhbHQwIiwiYWx0MSIsImhleF9pZCIsImN1c3RvbVBhbGV0dGUiLCJzdGVwcyIsInJldmVyc2VkIiwic2NhbGUiLCJjb2xvclNjYWxlIiwic3Ryb2tlU2NhbGUiLCJmaWxlVXBsb2FkZXIiLCJtZXNzYWdlIiwiY2hyb21lTWVzc2FnZSIsImNvbmZpZ1VwbG9hZE1lc3NhZ2UiLCJicm93c2VGaWxlcyIsInVwbG9hZGluZyIsImZpbGVOb3RTdXBwb3J0ZWQiLCJvciIsImZpZWxkU2VsZWN0b3IiLCJjbGVhckFsbCIsImZvcm1hdHRpbmciLCJjb21wYXJlIiwibW9kZUxhYmVsIiwidHlwZUxhYmVsIiwidHlwZXMiLCJhYnNvbHV0ZSIsInJlbGF0aXZlIiwibWFwUG9wb3ZlciIsInByaW1hcnkiLCJTYXZlIiwiU2hhcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7ZUFFZTtBQUNiQSxFQUFBQSxRQUFRLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFLEtBREE7QUFFUkMsSUFBQUEsS0FBSyxFQUFFLFVBRkM7QUFHUkMsSUFBQUEsU0FBUyxFQUFFLFlBSEg7QUFJUkMsSUFBQUEsS0FBSyxFQUFFLE9BSkM7QUFLUkMsSUFBQUEsUUFBUSxFQUFFLFdBTEY7QUFNUkMsSUFBQUEsV0FBVyxFQUFFLGVBTkw7QUFPUkMsSUFBQUEsTUFBTSxFQUFFLE1BUEE7QUFRUkMsSUFBQUEsT0FBTyxFQUFFLFNBUkQ7QUFTUkMsSUFBQUEsTUFBTSxFQUFFLE1BVEE7QUFVUkMsSUFBQUEsT0FBTyxFQUFFLFVBVkQ7QUFXUkMsSUFBQUEsTUFBTSxFQUFFLFFBWEE7QUFZUkMsSUFBQUEsR0FBRyxFQUFFLE1BWkc7QUFhUkMsSUFBQUEs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SUFBQUEsVUFBVSxFQUFFO0FBRkMsR0FqYkY7QUFxYmJDLEVBQUFBLE9BQU8sRUFBRTtBQUNQQyxJQUFBQSxTQUFTLEVBQUUsaUJBREo7QUFFUEMsSUFBQUEsU0FBUyxFQUFFLHFCQUZKO0FBR1BDLElBQUFBLEtBQUssRUFBRTtBQUNMQyxNQUFBQSxRQUFRLEVBQUUsVUFETDtBQUVMQyxNQUFBQSxRQUFRLEVBQUU7QUFGTDtBQUhBLEdBcmJJO0FBNmJiQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsT0FBTyxFQUFFO0FBREMsR0E3YkM7QUFnY2JwUyxFQUFBQSxPQUFPLEVBQUUsVUFoY0k7QUFpY2IsZ0JBQWMsa0JBamNEO0FBa2NiLGdCQUFjLGVBbGNEO0FBbWNicVMsRUFBQUEsSUFBSSxFQUFFLE1BbmNPO0FBb2NiQyxFQUFBQSxLQUFLLEVBQUU7QUFwY00sQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMSBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7TE9DQUxFU30gZnJvbSAnLi9sb2NhbGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBwcm9wZXJ0eToge1xuICAgIHdlaWdodDogJ3BlcycsXG4gICAgbGFiZWw6ICdldGlxdWV0YScsXG4gICAgZmlsbENvbG9yOiAnY29sb3IgZm9ucycsXG4gICAgY29sb3I6ICdjb2xvcicsXG4gICAgY292ZXJhZ2U6ICdjb2JlcnR1cmEnLFxuICAgIHN0cm9rZUNvbG9yOiAnY29sb3IgZGUgdHJhw6cnLFxuICAgIHJhZGl1czogJ3JhZGknLFxuICAgIG91dGxpbmU6ICdvdXRsaW5lJyxcbiAgICBzdHJva2U6ICd0cmHDpycsXG4gICAgZGVuc2l0eTogJ2RlbnNpdGF0JyxcbiAgICBoZWlnaHQ6ICdhbMOnYWRhJyxcbiAgICBzdW06ICdzdW1hJyxcbiAgICBwb2ludENvdW50OiAnUmVjb21wdGUgZGUgUHVudHMnXG4gIH0sXG4gIHBsYWNlaG9sZGVyOiB7XG4gICAgc2VhcmNoOiAnQ2VyY2EnLFxuICAgIHNlbGVjdEZpZWxkOiAnU2VsZWNjaW9uYSB1biBjYW1wJyxcbiAgICB5QXhpczogJ0VpeCBZJyxcbiAgICBzZWxlY3RUeXBlOiAnU2VsZWNjaW9uYSB1biBUaXB1cycsXG4gICAgc2VsZWN0VmFsdWU6ICdTZWxlY2Npb25hIHVuIFZhbG9yJyxcbiAgICBlbnRlclZhbHVlOiAnRW50cmEgdW4gdmFsb3InLFxuICAgIGVtcHR5OiAnYnVpdCdcbiAgfSxcbiAgbWlzYzoge1xuICAgIGJ5OiAnJyxcbiAgICB2YWx1ZXNJbjogJ1ZhbG9ycyBhJyxcbiAgICB2YWx1ZUVxdWFsczogJ1ZhbG9yIGlndWFsIGEnLFxuICAgIGRhdGFTb3VyY2U6ICdGb250IGRlIGRhZGVzJyxcbiAgICBicnVzaFJhZGl1czogJ1JhZGkgZGVsIHBpbnplbGwgKGttKScsXG4gICAgZW1wdHk6ICcgJ1xuICB9LFxuICBtYXBMYXllcnM6IHtcbiAgICB0aXRsZTogJ0NhcGVzIGRlbCBtYXBhJyxcbiAgICBsYWJlbDogJ0V0aXF1ZXRhJyxcbiAgICByb2FkOiAnQ2FycmV0ZXJhJyxcbiAgICBib3JkZXI6ICdGcm9udGVyYScsXG4gICAgYnVpbGRpbmc6ICdFZGlmaWNpJyxcbiAgICB3YXRlcjogJ0FpZ3VhJyxcbiAgICBsYW5kOiAnVGVycmEnLFxuICAgICczZEJ1aWxkaW5nJzogJ0VkaWZpY2kgM0QnXG4gIH0sXG4gIHBhbmVsOiB7XG4gICAgdGV4dDoge1xuICAgICAgbGFiZWw6ICdldGlxdWV0YScsXG4gICAgICBsYWJlbFdpdGhJZDogJ0V0aXF1ZXRhIHtsYWJlbElkfScsXG4gICAgICBmb250U2l6ZTogJ01pZGEgZGUgbGEgZm9udCcsXG4gICAgICBmb250Q29sb3I6ICdDb2xvciBkZSBsYSBmb250JyxcbiAgICAgIHRleHRBbmNob3I6ICfDgG5jb3JhIGRlbCB0ZXh0JyxcbiAgICAgIGFsaWdubWVudDogJ0FsaW5lYWNpw7MnLFxuICAgICAgYWRkTW9yZUxhYmVsOiAnQWZlZ2VpeCBtw6lzIGV0aXF1ZXRlcydcbiAgICB9XG4gIH0sXG4gIHNpZGViYXI6IHtcbiAgICBwYW5lbHM6IHtcbiAgICAgIGxheWVyOiAnQ2FwZXMnLFxuICAgICAgZmlsdGVyOiAnRmlsdHJlcycsXG4gICAgICBpbnRlcmFjdGlvbjogJ0ludGVyYWNjaW9ucycsXG4gICAgICBiYXNlbWFwOiAnTWFwYSBiYXNlJ1xuICAgIH1cbiAgfSxcbiAgbGF5ZXI6IHtcbiAgICByZXF1aXJlZDogJ1JlcXVlcml0KicsXG4gICAgcmFkaXVzOiAnUmFkaScsXG4gICAgY29sb3I6ICdDb2xvcicsXG4gICAgZmlsbENvbG9yOiAnQ29sb3IgZm9ucycsXG4gICAgb3V0bGluZTogJ0NvbnRvcm4nLFxuICAgIHdlaWdodDogJ0dydWl4JyxcbiAgICBwcm9wZXJ0eUJhc2VkT246ICd7cHJvcGVydHl9IGJhc2FkYSBlbicsXG4gICAgY292ZXJhZ2U6ICdDb2JlcnR1cmEnLFxuICAgIHN0cm9rZTogJ1RyYcOnJyxcbiAgICBzdHJva2VXaWR0aDogJ0FtcGxhZGEgZGUgdHJhw6cnLFxuICAgIHN0cm9rZUNvbG9yOiAnQ29sb3IgZGUgdHJhw6cnLFxuICAgIGJhc2ljOiAnQmFzaWMnLFxuICAgIHRyYWlsTGVuZ3RoOiAnTG9uZ2l0dWQgZGUgcGlzdGEnLFxuICAgIHRyYWlsTGVuZ3RoRGVzY3JpcHRpb246ICdOb21icmUgZGUgc2Vnb25zIGZpbnMgcXVlIGRlc2FwYXJlaXggZWwgY2Ftw60nLFxuICAgIG5ld0xheWVyOiAnbm92YSBjYXBhJyxcbiAgICBlbGV2YXRpb25CeURlc2NyaXB0aW9uOiBcIlNpIGRlc2FjdGl2YXQsIGwnYWzDp2FkYSBlcyBiYXNhIGVuIGVsIHJlY29tcHRlIGRlIHB1bnRzXCIsXG4gICAgY29sb3JCeURlc2NyaXB0aW9uOiAnU2kgZGVzYWN0aXZhdCwgZWwgY29sb3IgZXMgYmFzYSBlbiBlbCByZWNvbXB0ZSBkZSBwdW50cycsXG4gICAgYWdncmVnYXRlQnk6ICd7ZmllbGR9IGFncmVnYXQgcGVyJyxcbiAgICAnM0RNb2RlbCc6ICdNb2RlbCAzRCcsXG4gICAgJzNETW9kZWxPcHRpb25zJzogJ09wY2lvbnMgZGVsIG1vZGVsIDNEJyxcbiAgICB0eXBlOiB7XG4gICAgICBwb2ludDogJ3B1bnQnLFxuICAgICAgYXJjOiAnYXJjJyxcbiAgICAgIGxpbmU6ICdsw61uaWEnLFxuICAgICAgZ3JpZDogJ21hbGxhJyxcbiAgICAgIGhleGJpbjogJ2hleGJpbicsXG4gICAgICBwb2x5Z29uOiAncG9sw61nb24nLFxuICAgICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgICAgY2x1c3RlcjogJ2NsdXN0ZXInLFxuICAgICAgaWNvbjogJ2ljb25hJyxcbiAgICAgIGhlYXRtYXA6ICdoZWF0bWFwJyxcbiAgICAgIGhleGFnb246ICdoZXjDoGdvbicsXG4gICAgICBoZXhhZ29uaWQ6ICdIMycsXG4gICAgICB0cmlwOiAndmlhdGdlJyxcbiAgICAgIHMyOiAnUzInLFxuICAgICAgJzNkJzogJzNEJ1xuICAgIH1cbiAgfSxcbiAgbGF5ZXJWaXNDb25maWdzOiB7XG4gICAgYW5nbGU6ICdBbmdsZScsXG4gICAgc3Ryb2tlV2lkdGg6ICdBbXBsYWRhIHRyYcOnJyxcbiAgICBzdHJva2VXaWR0aFJhbmdlOiAnUmFuZyBhbXBsYWRhIGRlIHRyYcOnJyxcbiAgICByYWRpdXM6ICdSYWRpJyxcbiAgICBmaXhlZFJhZGl1czogJ1JhZGkgZml4ZSBhIG1lc3VyYXInLFxuICAgIGZpeGVkUmFkaXVzRGVzY3JpcHRpb246ICdBanVzdGEgZWwgcmFkaSBhbCByYWRpIGFic29sdXQgZW4gbWV0cmVzLCBwLmV4IDUgYSA1IG1ldHJlcycsXG4gICAgcmFkaXVzUmFuZ2U6ICdSYW5nIGRlIHJhZGknLFxuICAgIGNsdXN0ZXJSYWRpdXM6ICdSYWRpIENsdXN0ZXIgZW4gUGl4ZWxzJyxcbiAgICByYWRpdXNSYW5nZVBpeGVsczogJ1JhbmcgZGVsIHJhZGkgZW4gcGl4ZWxzJyxcbiAgICBvcGFjaXR5OiAnT3BhY2l0YXQnLFxuICAgIGNvdmVyYWdlOiAnQ29iZXJ0dXJhJyxcbiAgICBvdXRsaW5lOiAnT3V0bGluZScsXG4gICAgY29sb3JSYW5nZTogJ1JhbmcgZGUgY29sb3InLFxuICAgIHN0cm9rZTogJ1RyYcOnJyxcbiAgICBzdHJva2VDb2xvcjogJ0NvbG9yIGRlIHRyYcOnJyxcbiAgICBzdHJva2VDb2xvclJhbmdlOiAnUmFuZyBkZSBjb2xvciBkZSB0cmHDpycsXG4gICAgdGFyZ2V0Q29sb3I6ICdDb2xvciBkZXN0w60nLFxuICAgIGNvbG9yQWdncmVnYXRpb246ICdBZ3JlZ2FjacOzIGRlIGNvbG9yJyxcbiAgICBoZWlnaHRBZ2dyZWdhdGlvbjogJ0FncmVnYWNpw7MgYWzDp2FkYScsXG4gICAgcmVzb2x1dGlvblJhbmdlOiAnUmFuZyBkZSByZXNvbHVjacOzJyxcbiAgICBzaXplU2NhbGU6ICdNaWRhIGVzY2FsYScsXG4gICAgd29ybGRVbml0U2l6ZTogJ01pZGEgZGUgbGEgdW5pdGF0IG11bmRpYWwnLFxuICAgIGVsZXZhdGlvblNjYWxlOiAnRXNjYWxhIGVsZXZhY2nDsycsXG4gICAgZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvcjogJ1V0aWxpdHpldSBlbCBmYWN0b3IgZGUgem9vbSBk4oCZZWxldmFjacOzJyxcbiAgICBlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yRGVzY3JpcHRpb246XG4gICAgICBcIidBanVzdGV1IGwnYWzDp2FkYSAvIGVsZXZhY2nDsyBlbiBmdW5jacOzIGRlbCBmYWN0b3IgZGUgem9vbSBhY3R1YWxcIixcbiAgICBlbmFibGVIZWlnaHRab29tRmFjdG9yOiAnVXRpbGl0emV1IGVsIGZhY3RvciBkZSB6b29tIGTigJlhbMOnYWRhJyxcbiAgICBoZWlnaHRTY2FsZTogJ0VzY2FsYSBhbMOnYWRhJyxcbiAgICBjb3ZlcmFnZVJhbmdlOiAnUmFuZyBlZCBjb2JlcnR1cmEnLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmc6ICdSZXByZXNlbnRhY2nDsyBhbHRhIHByZWNpc2nDsycsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZ0Rlc2NyaXB0aW9uOiAnTGEgcHJlY2lzacOzIGFsdGEgdGluZHLDoCByZW5kaW1lbnQgbcOpcyBiYWl4JyxcbiAgICBoZWlnaHQ6ICdBbMOnYWRhJyxcbiAgICBoZWlnaHREZXNjcmlwdGlvbjogJ0ZlcyBjbGljIGFsIGJvdMOzIGEgZGFsdCBhIGxhIGRyZXRhIGRlbCBtYXBhIHBlciBjYW52aWFyIGEgdmlzdGEgM0QnLFxuICAgIGZpbGw6ICdPbXBsZScsXG4gICAgZW5hYmxlUG9seWdvbkhlaWdodDogJ0FjdGl2YSBhbMOnYWRhIGRlbCBwb2zDrWdvbicsXG4gICAgc2hvd1dpcmVmcmFtZTogJ01vc3RyYSBXaXJlZnJhbWUnLFxuICAgIHdlaWdodEludGVuc2l0eTogJ0ludGVuc2l0YXQgZGUgcGVzJyxcbiAgICB6b29tU2NhbGU6ICdFc2NhbGEgZGUgem9vbScsXG4gICAgaGVpZ2h0UmFuZ2U6ICdSYW5nIGFsw6dhZGEnLFxuICAgIGhlaWdodE11bHRpcGxpZXI6IFwiTXVsdGlwbGljYWRvciBkJ2Fsw6dhZGFcIlxuICB9LFxuICBsYXllck1hbmFnZXI6IHtcbiAgICBhZGREYXRhOiAnQWZlZ2VpeCBEYWRlcycsXG4gICAgYWRkTGF5ZXI6ICdBZmVnZWl4IENhcGVzJyxcbiAgICBsYXllckJsZW5kaW5nOiAnQ29tYmluYXIgY2FwZXMnXG4gIH0sXG4gIG1hcE1hbmFnZXI6IHtcbiAgICBtYXBTdHlsZTogJ0VzdGlsIGRlIG1hcGEnLFxuICAgIGFkZE1hcFN0eWxlOiAnQWZlZ2VpeCBlc3RpbHMgZGUgbWFwYScsXG4gICAgJzNkQnVpbGRpbmdDb2xvcic6ICdDb2xvciBlZGlmaWNpIDNEJ1xuICB9LFxuICBsYXllckNvbmZpZ3VyYXRpb246IHtcbiAgICBkZWZhdWx0RGVzY3JpcHRpb246ICdDYWxjdWxhIHtwcm9wZXJ0eX0gc2Vnb25zIGVsIGNhbXAgc2VsZWNjaW9uYXQnLFxuICAgIGhvd1RvOiAnSG93IHRvJ1xuICB9LFxuICBmaWx0ZXJNYW5hZ2VyOiB7XG4gICAgYWRkRmlsdGVyOiAnQWZlZ2VpeCBGaWx0cmUnXG4gIH0sXG4gIGRhdGFzZXRUaXRsZToge1xuICAgIHNob3dEYXRhVGFibGU6ICdNb3N0cmEgdGF1bGEgZGUgZGFkZXMnLFxuICAgIHJlbW92ZURhdGFzZXQ6ICdFbGltaW5hIGNvbmp1bnQgZGUgZGFkZXMnXG4gIH0sXG4gIGRhdGFzZXRJbmZvOiB7XG4gICAgcm93Q291bnQ6ICd7cm93Q291bnR9IGZpbGVzJ1xuICB9LFxuICB0b29sdGlwOiB7XG4gICAgaGlkZUxheWVyOiAnb2N1bHRhIGxhIGNhcGEnLFxuICAgIHNob3dMYXllcjogJ21vc3RyYSBsYSBjYXBhJyxcbiAgICBoaWRlRmVhdHVyZTogXCJBbWFnYSBsJ29iamVjdGVcIixcbiAgICBzaG93RmVhdHVyZTogXCJNb3N0cmEgbCdvYmplY3RlXCIsXG4gICAgaGlkZTogJ2FtYWdhJyxcbiAgICBzaG93OiAnbW9zdHJhJyxcbiAgICByZW1vdmVMYXllcjogJ0VsaW1pbmEgY2FwYScsXG4gICAgbGF5ZXJTZXR0aW5nczogJ0NvbmZpZ3VyYWNpw7MgZGUgY2FwYScsXG4gICAgY2xvc2VQYW5lbDogJ1RhbmNhIHBhbmVsIGFjdHVhbCcsXG4gICAgc3dpdGNoVG9EdWFsVmlldzogJ0NhbnZpYSBhIGxhIHZpc3RhIGRlIG1hcGEgZHVhbCcsXG4gICAgc2hvd0xlZ2VuZDogJ21vc3RyYSBsbGVnZW5kYScsXG4gICAgZGlzYWJsZTNETWFwOiAnRGVzYWN0aXZhIG1hcGEgM0QnLFxuICAgIERyYXdPbk1hcDogJ0RpYnVpeGEgYWwgbWFwYScsXG4gICAgc2VsZWN0TG9jYWxlOiAnU2VsZWNjaW9uYSBjb25maWd1cmFjacOzIHJlZ2lvbmFsJyxcbiAgICBoaWRlTGF5ZXJQYW5lbDogJ09jdWx0YSBlbCB0YXVsZXIgZGUgY2FwZXMnLFxuICAgIHNob3dMYXllclBhbmVsOiAnTW9zdHJhIGVsIHRhdWxlciBkZSBjYXBlcycsXG4gICAgbW92ZVRvVG9wOiAnRGVzcGxhw6dhIGEgZGFsdCBkZSB0b3QgZGUgbGVzIGNhcGVzIGRlIGRhZGVzJyxcbiAgICBzZWxlY3RCYXNlTWFwU3R5bGU6ICdTZWxlY2Npb25hIGVzdGlsIGRlIG1hcGEgYmFzZScsXG4gICAgZGVsZXRlOiAnRXNib3JyYScsXG4gICAgdGltZVBsYXliYWNrOiAnUmVwcm9kdWNjacOzIGRlIHRlbXBzJyxcbiAgICBjbG91ZFN0b3JhZ2U6ICdFbW1hZ2F0emVtYXRnZSBhbCBuw7p2b2wnLFxuICAgICczRE1hcCc6ICdNYXBhIDNEJyxcbiAgICBhbmltYXRpb25CeVdpbmRvdzogJ0ZpbmVzdHJhIFRlbXBvcmFsIE3DsmJpbCcsXG4gICAgYW5pbWF0aW9uQnlJbmNyZW1lbnRhbDogJ0ZpbmVzdHJhIFRlbXBvcmFsIEluY3JlbWVudGFsJyxcbiAgICBzcGVlZDogJ3ZlbG9jaXRhdCcsXG4gICAgcGxheTogJ2luaWNpYXInLFxuICAgIHBhdXNlOiAncGF1c2FyJyxcbiAgICByZXNldDogJ3JlaW5pY2lhcidcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0YSBpbWF0Z2UnLFxuICAgIGV4cG9ydERhdGE6ICdFeHBvcnRhIGRhZGVzJyxcbiAgICBleHBvcnRNYXA6ICdFeHBvcnRhIG1hcGEnLFxuICAgIHNoYXJlTWFwVVJMOiAnQ29tcGFydGVpeCBVUkwgZGVsIG1hcGEnLFxuICAgIHNhdmVNYXA6ICdEZXNhIG1hcGEnLFxuICAgIHNlbGVjdDogJ3NlbGVjY2lvbmEnLFxuICAgIHBvbHlnb246ICdwb2zDrWdvbicsXG4gICAgcmVjdGFuZ2xlOiAncmVjdGFuZ2xlJyxcbiAgICBoaWRlOiAnYW1hZ2EnLFxuICAgIHNob3c6ICdtb3N0cmEnLFxuICAgIC4uLkxPQ0FMRVNcbiAgfSxcbiAgbW9kYWw6IHtcbiAgICB0aXRsZToge1xuICAgICAgZGVsZXRlRGF0YXNldDogJ0VzYm9ycmEgY29uanVudCBkZSBkYWRlcycsXG4gICAgICBhZGREYXRhVG9NYXA6ICdBZmVnZWl4IGRhZGVzIGFsIG1hcGEnLFxuICAgICAgZXhwb3J0SW1hZ2U6ICdFeHBvcnRhIGltYXRnZScsXG4gICAgICBleHBvcnREYXRhOiAnRXhwb3J0YSBkYWRlcycsXG4gICAgICBleHBvcnRNYXA6ICdFeHBvcnRhIG1hcGEnLFxuICAgICAgYWRkQ3VzdG9tTWFwYm94U3R5bGU6ICdBZmVnZWl4IGVzdGlsIE1hcGJveCBwcm9waScsXG4gICAgICBzYXZlTWFwOiAnRGVzYSBtYXBhJyxcbiAgICAgIHNoYXJlVVJMOiAnQ29tcGFydGVpeCBVUkwnXG4gICAgfSxcbiAgICBidXR0b246IHtcbiAgICAgIGRlbGV0ZTogJ0VzYm9ycmEnLFxuICAgICAgZG93bmxvYWQ6ICdEZXNjYXJyZWdhJyxcbiAgICAgIGV4cG9ydDogJ0V4cG9ydGEnLFxuICAgICAgYWRkU3R5bGU6ICdBZmVnZWl4IGVzdGlsJyxcbiAgICAgIHNhdmU6ICdEZXNhJyxcbiAgICAgIGRlZmF1bHRDYW5jZWw6ICdDYW5jZWzCt2xhJyxcbiAgICAgIGRlZmF1bHRDb25maXJtOiAnQ29uZmlybWEnXG4gICAgfSxcbiAgICBleHBvcnRJbWFnZToge1xuICAgICAgcmF0aW9UaXRsZTogJ1LDoHRpbycsXG4gICAgICByYXRpb0Rlc2NyaXB0aW9uOiAnRXNjdWxsIHLDoHRpbyBwZXIgZGl2ZXJzb3MgdXNvcy4nLFxuICAgICAgcmF0aW9PcmlnaW5hbFNjcmVlbjogJ1BhbnRhbGxhIG9yaWdpbmFsJyxcbiAgICAgIHJhdGlvQ3VzdG9tOiAnUGVyc29uYWxpdHphdCcsXG4gICAgICByYXRpbzRfMzogJzQ6MycsXG4gICAgICByYXRpbzE2Xzk6ICcxNjo5JyxcbiAgICAgIHJlc29sdXRpb25UaXRsZTogJ1Jlc29sdWNpw7MnLFxuICAgICAgcmVzb2x1dGlvbkRlc2NyaXB0aW9uOiAnQWx0YSByZXNvbHVjacOzIMOpcyBtaWxsb3IgcGVyIGEgbGVzIGltcHJlc3Npb25zLicsXG4gICAgICBtYXBMZWdlbmRUaXRsZTogJ0xsZWdlbmRhIGRlbCBtYXBhJyxcbiAgICAgIG1hcExlZ2VuZEFkZDogJ0FmZWdpciBsbGVnZW5kYSBhbCBtYXBhJ1xuICAgIH0sXG4gICAgZXhwb3J0RGF0YToge1xuICAgICAgZGF0YXNldFRpdGxlOiAnQ29uanVudCBkZSBkYWRlcycsXG4gICAgICBkYXRhc2V0U3VidGl0bGU6ICdFc2N1bGwgZWxzIGNvbmp1bnRzIGRlIGRhZGVzIHF1ZSB2b2xzIGV4cG9ydGFyJyxcbiAgICAgIGFsbERhdGFzZXRzOiAnVG90cycsXG4gICAgICBkYXRhVHlwZVRpdGxlOiAnVGlwdXMgZGUgZGFkZXMnLFxuICAgICAgZGF0YVR5cGVTdWJ0aXRsZTogJ0VzY3VsbCBlbHMgdGlwdXMgZGUgZGFkZXMgcXVlIHZvbHMgZXhwb3J0YXInLFxuICAgICAgZmlsdGVyRGF0YVRpdGxlOiAnRmlsdHJhIGRhZGVzJyxcbiAgICAgIGZpbHRlckRhdGFTdWJ0aXRsZTogJ1BvdHMgZXNjb2xsaXIgZXhwb3J0YXIgbGVzIGRhZGVzIG9yaWdpbmFscyBvIGxlcyBmaWx0cmFkZXMnLFxuICAgICAgZmlsdGVyZWREYXRhOiAnRGFkZXMgZmlsdHJhZGVzJyxcbiAgICAgIHVuZmlsdGVyZWREYXRhOiAnRGFkZXMgc2Vuc2UgZmlsdHJhcicsXG4gICAgICBmaWxlQ291bnQ6ICd7ZmlsZUNvdW50fSBBcnhpdXMnLFxuICAgICAgcm93Q291bnQ6ICd7cm93Q291bnR9IEZpbGVzJ1xuICAgIH0sXG4gICAgZGVsZXRlRGF0YToge1xuICAgICAgd2FybmluZzogXCJlc3TDoHMgYSBwdW50IGQnZXNib3JyYXIgYXF1ZXN0IGNvbmp1bnQgZGUgZGFkZXMuIEFmZWN0YXLDoCB7bGVuZ3RofSBjYXBlc1wiXG4gICAgfSxcbiAgICBhZGRTdHlsZToge1xuICAgICAgcHVibGlzaFRpdGxlOiBcIjIuIFB1YmxpY2EgZWwgdGV1IGVzdGlsIGEgTWFwYm94IG8gcHJvcG9yY2lvbmEgZWwgdG9rZW4gZCdhY2PDqXNcIixcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTE6ICdQb3RzIGNyZWFyIGVsIHRldSBwcm9waSBlc3RpbCBkZSBtYXBhIGEnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMjogJ2knLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMzogJ3B1YmxpY2FyJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTQ6ICdoby4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNTogJ1BlciB1dGlsaXR6YXIgdW4gZXN0aWwgcHJpdmF0LCBlbmdhbnhhIGVsIHRldScsXG4gICAgICBwdWJsaXNoU3VidGl0bGU2OiBcInRva2VuIGQnYWNjw6lzXCIsXG4gICAgICBwdWJsaXNoU3VidGl0bGU3OlxuICAgICAgICAnYXF1w60uICprZXBsZXIuZ2wgw6lzIHVuYSBhcGxpY2FjacOzIGNsaWVudCwgbGVzIGRhZGVzIHJvbWFuZW4gYWwgdGV1IG5hdmVnYWRvci4uJyxcbiAgICAgIGV4YW1wbGVUb2tlbjogJ3AuZXguIHBrLmFiY2RlZmcueHh4eHh4JyxcbiAgICAgIHBhc3RlVGl0bGU6IFwiMS4gRW5nYW54YSBsYSBVUkwgZGUgbCdlc3RpbFwiLFxuICAgICAgcGFzdGVTdWJ0aXRsZTE6ICdRdcOoIMOpcyB1bicsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogXCJVUkwgZGUgbCdlc3RpbFwiLFxuICAgICAgbmFtaW5nVGl0bGU6ICczLiBQb3NhIG5vbSBhbCB0ZXUgZXN0aWwnXG4gICAgfSxcbiAgICBzaGFyZU1hcDoge1xuICAgICAgc2hhcmVVcmlUaXRsZTogJ0NvbXBhcnRlaXggVVJMIGRlbCBtYXBhJyxcbiAgICAgIHNoYXJlVXJpU3VidGl0bGU6ICdHZW5lcmEgdW5hIFVSTCBkZWwgbWFwYSBwZXIgY29tcGFydGlyIGFtYiBhbHRyaScsXG4gICAgICBjbG91ZFRpdGxlOiAnRW1tYWdhdHplbWF0Z2UgYWwgbsO6dm9sJyxcbiAgICAgIGNsb3VkU3VidGl0bGU6ICdBY2NlZGVpeCBpIGNhcnJlZ2EgZGFkZXMgZGUgbWFwYSBhbCB0ZXUgZW1tYWdhdHplbWF0Z2UgYWwgbsO6dm9sIHBlcnNvbmFsJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCBkZXNhcsOgIGxlcyBkYWRlcyBkZWwgbWFwYSBhbCB0ZXUgZW1tYWdhdHplbWF0Z2UgYWwgbsO6dm9sIHBlcnNvbmFsLCBub23DqXMgcXVpIHRpbmd1aSBsYSBVUkwgcG9kcsOgIGFjY2VkaXIgYWwgbWFwYSBpIGEgbGVzIGRhZGVzIC4gJyArXG4gICAgICAgIFwiUG90cyBlZGl0YXIvZXNib3JyYXIgbCdhcnhpdSBkZSBkYWRlcyBlbiBlbCB0ZXUgY29tcHRlIGFsIG7DunZvbCBlbiBxdWFsc2V2b2wgbW9tZW50LlwiLFxuICAgICAgZ290b1BhZ2U6ICdWZXMgYSBsYSBww6BnaW5hIGRlIHtjdXJyZW50UHJvdmlkZXJ9IGRlIEtlcGxlci5nbCdcbiAgICB9LFxuICAgIHN0YXR1c1BhbmVsOiB7XG4gICAgICBtYXBVcGxvYWRpbmc6ICdDYXJyZWdhciB1biBtYXBhJyxcbiAgICAgIGVycm9yOiAnRXJyb3InXG4gICAgfSxcbiAgICBzYXZlTWFwOiB7XG4gICAgICB0aXRsZTogJ0VtbWFnYXR6ZW1hdGdlIGFsIG7DunZvbCcsXG4gICAgICBzdWJ0aXRsZTogJ0FjY2VkZWl4IHBlciBkZXNhciBlbCBtYXBhIGFsIHRldSBlbW1hZ2F0emVtYXRnZSBhbCBuw7p2b2wnXG4gICAgfSxcbiAgICBleHBvcnRNYXA6IHtcbiAgICAgIGZvcm1hdFRpdGxlOiAnRm9ybWF0IGRlIG1hcGEnLFxuICAgICAgZm9ybWF0U3VidGl0bGU6ICdFc2N1bGwgZWwgZm9ybWF0IGFtYiBxdcOoIHZvbHMgZXhwb3J0YXIgZWwgdGV1IG1hcGEnLFxuICAgICAgaHRtbDoge1xuICAgICAgICBzZWxlY3Rpb246ICdFeHBvcnRhIGVsIHRldSBtYXBhIGNvbSB1biBhcnhpdSBIVE1MIGludGVyYWN0aXUuJyxcbiAgICAgICAgdG9rZW5UaXRsZTogXCJUb2tlbiBkJ2FjY8OpcyBkZSBNYXBib3hcIixcbiAgICAgICAgdG9rZW5TdWJ0aXRsZTogXCJVdGlsaXR6YSBlbCB0ZXUgdG9rZW4gZCdhY2PDqXMgZGUgTWFwYm94IGEgbCdhcnhpdSBIVE1MIChvcGNpb25hbClcIixcbiAgICAgICAgdG9rZW5QbGFjZWhvbGRlcjogXCJFbmdhbnhhIGVsIHRldSB0b2tlbiBkJ2FjY8OpcyBhIE1hcGJveFwiLFxuICAgICAgICB0b2tlbk1pc3VzZVdhcm5pbmc6XG4gICAgICAgICAgJyogU2kgbm8gcHJvcG9yY2lvbmVzIGVsIHRldSBwcm9waSB0b2tlbiwgZWwgbWFwYSBwb2RyaWEgZmFsbGFyIGVuIHF1YWxzZXZvbCBtb21lbnQgcXVhbiByZWVtcGxhY2VtIGVsIG5vc3RyZSB0b2tlbiBwZXIgZXZpdGFyIGFidXNvcy4gJyxcbiAgICAgICAgdG9rZW5EaXNjbGFpbWVyOlxuICAgICAgICAgICdQb3RzIGNhbnZpYXIgZWwgdG9rZSBkZSBNYXBib3ggbcOpcyBlbmRhdmFudCBmZW50IHNlcnZpciBhcXVlc3RlcyBpbnN0cnVjY2lvbnM6ICcsXG4gICAgICAgIHRva2VuVXBkYXRlOiAnQ29tIGFjdHVhbGl0emFyIHVuIHRva2VuIHByZWV4aXN0ZW50LicsXG4gICAgICAgIG1vZGVUaXRsZTogJ01vZGUgbWFwYScsXG4gICAgICAgIG1vZGVTdWJ0aXRsZTE6ICdTZWxlY2Npb25hIG1vZGUgYXBwLiBNw6lzICcsXG4gICAgICAgIG1vZGVTdWJ0aXRsZTI6ICdpbmZvcm1hY2nDsycsXG4gICAgICAgIG1vZGVEZXNjcmlwdGlvbjogJ1Blcm1ldCBhbHMgdXN1YXJpcyB7bW9kZX0gZWwgbWFwYScsXG4gICAgICAgIHJlYWQ6ICdsbGVnaXInLFxuICAgICAgICBlZGl0OiAnZWRpdGFyJ1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgY29uZmlnVGl0bGU6ICdDb25maWd1cmFjacOzIGRlbCBtYXBhJyxcbiAgICAgICAgY29uZmlnRGlzY2xhaW1lcjpcbiAgICAgICAgICBcIkxhIGNvbmZpZ3VyYWNpw7MgZGVsIG1hcGEgcydpbmNsb3Vyw6AgYSBsJ2FyeGl1IEpzb24uIFNpIHV0aWxpdHplcyBrZXBsZXIuZ2wgYSBsYSB0ZXZhIHByw7JwaWEgYXBwIHBvdHMgY29waWFyIGFxdWVzdGEgY29uZmlndXJhY2nDsyBpIHBhc3Nhci1sYSBhICBcIixcbiAgICAgICAgc2VsZWN0aW9uOlxuICAgICAgICAgICdFeHBvcnRhIGxlcyBkYWRlcyBkZWwgbWFwYSBpIGxhIGNvbmZpZ3VyYWNpw7MgZW4gdW4gc29sIGFyeGl1IEpzb24uIE3DqXMgZW5kYXZhbnQgcG90cyBvYnJpciBhcXVlc3QgbWF0ZWl4IG1hcGEgY2FycmVnYW50IGFxdWVzdCBtYXRlaXggYXJ4aXUgYSBrZXBsZXIuZ2wuJyxcbiAgICAgICAgZGlzY2xhaW1lcjpcbiAgICAgICAgICBcIiogTGEgY29uZmlndXJhY2nDsyBkZWwgbWFwYSBlcyBjb21iaW5hIGFtYiBlbHMgY29uanVudHMgZGUgZGFkZXMgY2FycmVnYXRzLiDigJhkYXRhSWTigJkgcyd1dGlsaXR6YSBwZXIgbGxpZ2FyIGNhcGVzLCBmaWx0cmVzIGkgc3VnZ2VyaW1lbnRzIGEgdW4gY29uanVudCBkZSBkYWRlcyBlc3BlY8OtZmljLiBcIiArXG4gICAgICAgICAgXCJRdWFuIHBhc3NpcyBhcXVlc3RhIGNvbmZpZ3VyYWNpw7MgYSBhZGREYXRhVG9NYXAsIGFzc2VndXJhIHF1ZSBsJ2lkZW50aWZpY2Fkb3IgZGVsIGNvbmp1bnQgZGUgZGFkZXMgY29pbmNpZGVpeGkgYW1iIGVscyDigJhkYXRhSWTigJkgZCdhcXVlc3RhIGNvbmZpZ3VyYWNpw7MuXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRpbmdEaWFsb2c6IHtcbiAgICAgIGxvYWRpbmc6ICdDYXJyZWdhbnQuLi4nXG4gICAgfSxcbiAgICBsb2FkRGF0YToge1xuICAgICAgdXBsb2FkOiAnQ2FycmVnYXIgYXJ4aXVzJyxcbiAgICAgIHN0b3JhZ2U6IFwiQ2FycmVnYXIgZGVzIGQnZW1tYWdhdHplbWF0Z2VcIlxuICAgIH0sXG4gICAgdHJpcEluZm86IHtcbiAgICAgIHRpdGxlOiAnQ29tIGhhYmlsaXRhciBs4oCZYW5pbWFjacOzIGRlIHZpYXRnZScsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdQZXIgYW5pbWFyIGxhIHJ1dGEsIGxlcyBkYWRlcyBnZW9KU09OIGhhbiBkZSBjb250ZW5pciBgTGluZVN0cmluZ2AgZW4gbGEgc2V2YSBnZW9tZXRyaWEgaSBsZXMgY29vcmRlbmFkZXMgZGUgTGluZVN0cmluZyBoYW4gZGUgdGVuaXIgNCBlbGVtZW50cyBlbiBlbHMgZm9ybWF0cyBkZSAnLFxuICAgICAgY29kZTogJyBbbG9uZ2l0dWRlLCBsYXRpdHVkZSwgYWx0aXR1ZGUsIHRpbWVzdGFtcF0gJyxcbiAgICAgIGRlc2NyaXB0aW9uMjpcbiAgICAgICAgJ2kgZWwgZGFycmVyIGVsZW1lbnQgaGEgZGUgc2VyIGxhIG1hcmNhIGRlIHRlbXBzLiBFbHMgZm9ybWF0cyB2w6BsaWRzIHBlciBhIGxhIG1hcmNhIGRlIHRlbXBzIGluY2xvdWVuIFVuaXggZW4gc2Vnb25zIGNvbSBgMTU2NDE4NDM2M2AgbyBlbiBtaWxpc2Vnb25zIGNvbSBgMTU2NDE4NDM2MzAwMGAuJyxcbiAgICAgIGV4YW1wbGU6ICdFeGVtcGxlOidcbiAgICB9LFxuICAgIGljb25JbmZvOiB7XG4gICAgICB0aXRsZTogJ0NvbSBkaWJ1aXhhciBpY29uZXMnLFxuICAgICAgZGVzY3JpcHRpb24xOlxuICAgICAgICBcIkVuIGVsIHRldSBDU1YgY3JlYSB1bmEgY29sdW1uYSBpIHBvc2EtaGkgZWwgbm9tIGRlIGxhIGljb25hIHF1ZSB2b2xzIGRpYnVpeGFyLiBQb3RzIGRlaXhhciBsYSBjZWzCt2xhIGJ1aWRhIHF1YW4gbm8gdnVsZ3VpcyBxdWUgZXMgbW9zdHJpIHBlciBhIGNlcnRzIHB1bnRzLiBRdWFuIGxhIGNvbHVtbmEgcydhbm9tZW5hXCIsXG4gICAgICBjb2RlOiAnaWNvbicsXG4gICAgICBkZXNjcmlwdGlvbjI6IFwiIGtlcGxlci5nbCBhdXRvbcOgdGljYW1lbnQgY3JlYXLDoCB1bmEgY2FwYSBkJ2ljb25hLlwiLFxuICAgICAgZXhhbXBsZTogJ0V4ZW1wbGU6JyxcbiAgICAgIGljb25zOiAnSWNvbmVzJ1xuICAgIH0sXG4gICAgc3RvcmFnZU1hcFZpZXdlcjoge1xuICAgICAgbGFzdE1vZGlmaWVkOiAnRGFycmVyYSBtb2RpZmljYWNpw7MgZmEge2xhc3RVcGRhdGVkfScsXG4gICAgICBiYWNrOiAnRW5yZXJlJ1xuICAgIH0sXG4gICAgb3ZlcndyaXRlTWFwOiB7XG4gICAgICB0aXRsZTogJ0Rlc2FudCBtYXBhLi4uJyxcbiAgICAgIGFscmVhZHlFeGlzdHM6ICdqYSBleGlzdGVpeCBhIHttYXBTYXZlZH0uIEVsIHZvbHMgc29icmVlc2NyaXVyZT8nXG4gICAgfSxcbiAgICBsb2FkU3RvcmFnZU1hcDoge1xuICAgICAgYmFjazogJ0VucmVyZScsXG4gICAgICBnb1RvUGFnZTogJ1ZlcyBhIGxhIHDDoGdpbmEge2Rpc3BsYXlOYW1lfSBkZSBLZXBsZXIuZ2wnLFxuICAgICAgc3RvcmFnZU1hcHM6ICdFbW1hZ2F0emVtYXRnZSAvIE1hcGVzJyxcbiAgICAgIG5vU2F2ZWRNYXBzOiAnQ2FwIG1hcGEgZGVzYXQgZW5jYXJhJ1xuICAgIH1cbiAgfSxcbiAgaGVhZGVyOiB7XG4gICAgdmlzaWJsZUxheWVyczogJ0NhcGVzIHZpc2libGVzJyxcbiAgICBsYXllckxlZ2VuZDogJ0xsZWdlbmRhIGRlIGNhcGVzJ1xuICB9LFxuICBpbnRlcmFjdGlvbnM6IHtcbiAgICB0b29sdGlwOiAnU3VnZ2VyaW1lbnQnLFxuICAgIGJydXNoOiAnUGluemVsbCcsXG4gICAgY29vcmRpbmF0ZTogJ0Nvb3JkZW5hZGVzJyxcbiAgICBnZW9jb2RlcjogJ0dlb2NvZGlmaWNhZG9yJ1xuICB9LFxuICBsYXllckJsZW5kaW5nOiB7XG4gICAgdGl0bGU6ICdDb21iaW5hY2nDsyBkZSBjYXBlcycsXG4gICAgYWRkaXRpdmU6ICdhZGRpdGl2YScsXG4gICAgbm9ybWFsOiAnbm9ybWFsJyxcbiAgICBzdWJ0cmFjdGl2ZTogJ3N1YnN0cmFjdGl2YSdcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAnQ29sdW1uZXMnLFxuICAgIGxhdDogJ2xhdCcsXG4gICAgbG5nOiAnbG9uJyxcbiAgICBhbHRpdHVkZTogJ2Fsw6dhZGEnLFxuICAgIGljb246ICdpY29uYScsXG4gICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgIGFyYzoge1xuICAgICAgbGF0MDogJ2xhdCBvcmlnZW4nLFxuICAgICAgbG5nMDogJ2xuZyBvcmlnZW4gJyxcbiAgICAgIGxhdDE6ICdsYXQgZGVzdGluYWNpw7MnLFxuICAgICAgbG5nMTogJ2xuZyBkZXN0aW5hY2nDsydcbiAgICB9LFxuICAgIGxpbmU6IHtcbiAgICAgIGFsdDA6ICdhbMOnYWRhIG9yaWdlbicsXG4gICAgICBhbHQxOiAnYWzDp2FkYSBkZXN0aW5hY2nDsydcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIHdvcmxkVW5pdFNpemU6ICdNaWRhIGRlIG1hbGxhIChrbSknXG4gICAgfSxcbiAgICBoZXhhZ29uOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiBcIlJhZGkgZCdoZXjDoGdvbiAoa20pXCJcbiAgICB9LFxuICAgIGhleF9pZDogJ2lkIGhleCdcbiAgfSxcbiAgY29sb3I6IHtcbiAgICBjdXN0b21QYWxldHRlOiAnUGFsZXRhIHBlcnNvbmFsaXR6YWRhJyxcbiAgICBzdGVwczogJ2ludGVydmFscycsXG4gICAgdHlwZTogJ3RpcHVzJyxcbiAgICByZXZlcnNlZDogJ2ludmVydGlkYSdcbiAgfSxcbiAgc2NhbGU6IHtcbiAgICBjb2xvclNjYWxlOiAnRXNjYWxhIGRlIGNvbG9yJyxcbiAgICBzaXplU2NhbGU6ICdFc2NhbGEgZGUgbWlkZXMnLFxuICAgIHN0cm9rZVNjYWxlOiAnRXNjYWxhIGRlIHRyYcOnJyxcbiAgICBzY2FsZTogJ0VzY2FsYSdcbiAgfSxcbiAgZmlsZVVwbG9hZGVyOiB7XG4gICAgbWVzc2FnZTogXCJBcnJvc3NlZ2EgaSBkZWl4YSBhbmFyIGwnYXJ4aXUgYXF1w61cIixcbiAgICBjaHJvbWVNZXNzYWdlOlxuICAgICAgJyp1c3VhcmkgZGUgQ2hyb21lOiBsYSBtaWRhIG3DoHhpbWEgc8OzbiAyNTBtYiwgc2kgaGFzIGRlIGNhcnJnYXIgdW4gYXJ4aXUgbcOpcyBncmFuIGZlcyBzZXJ2aXIgU2FmYXJpJyxcbiAgICBkaXNjbGFpbWVyOlxuICAgICAgJyprZXBsZXIuZ2wgw6lzIHVuYSBhcGxpY2FjacOzIGEgbGEgYmFuZGEgY2xpZW50IHF1ZSBubyBlcyByZWNvbHphIGVuIGNhcCBzZXJ2aWRvci4gTGVzIGRhZGVzIG5vbcOpcyBleGlzdGVpeGVuIGEgbGEgdGV2YSBtw6BxdWluYS9uYXZlZ2Fkb3IuICcgK1xuICAgICAgXCJObyBzJ2VudmllbiBkYWRlcyBuaSBtYXBlcyBhIGNhcCBzZXJ2aWRvci5cIixcbiAgICBjb25maWdVcGxvYWRNZXNzYWdlOlxuICAgICAgJ0NhcnJlZ2Ege2ZpbGVGb3JtYXROYW1lc30gbyB1biBtYXBhIGRlc2F0IGVuICoqSnNvbioqLiBNw6lzIGluZm9ybWFjacOzIHNvYnJlIFsqKnN1cHBvcnRlZCBmaWxlIGZvcm1hdHMqKl0nLFxuICAgIGJyb3dzZUZpbGVzOiAnbmF2ZWdhIHBlbHMgdGV1cyBhcnhpdXMnLFxuICAgIHVwbG9hZGluZzogJ0NhcnJlZ2FudCcsXG4gICAgZmlsZU5vdFN1cHBvcnRlZDogXCJMJ2FyeGl1IHtlcnJvckZpbGVzfSBubyDDqXMgY29tcGF0aWJsZS5cIixcbiAgICBvcjogJ28nXG4gIH0sXG4gIGdlb2NvZGVyOiB7XG4gICAgdGl0bGU6ICdJbnRyb2R1ZWl4IHVuYSBhZHJlw6dhJ1xuICB9LFxuICBmaWVsZFNlbGVjdG9yOiB7XG4gICAgY2xlYXJBbGw6ICdUcmV1cmUgdG90cycsXG4gICAgZm9ybWF0dGluZzogJ0Zvcm1hdCdcbiAgfSxcbiAgY29tcGFyZToge1xuICAgIG1vZGVMYWJlbDogJ01vZGUgQ29tcGFyYWNpw7MnLFxuICAgIHR5cGVMYWJlbDogJ1RpcHVzIGRlIENvbXBhcmFjacOzJyxcbiAgICB0eXBlczoge1xuICAgICAgYWJzb2x1dGU6ICdBYnNvbHV0YScsXG4gICAgICByZWxhdGl2ZTogJ1JlbGF0aXZhJ1xuICAgIH1cbiAgfSxcbiAgbWFwUG9wb3Zlcjoge1xuICAgIHByaW1hcnk6ICdQcmluY2lwYWwnXG4gIH0sXG4gIGRlbnNpdHk6ICdkZW5zaXRhdCcsXG4gICdCdWcgUmVwb3J0JzogXCJJbmZvcm1lIGQnZXJyb3JzXCIsXG4gICdVc2VyIEd1aWRlJzogXCJHdWlhIGQndXN1YXJpXCIsXG4gIFNhdmU6ICdEZXNhJyxcbiAgU2hhcmU6ICdDb21wYXJ0ZWl4J1xufTtcbiJdfQ==