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
    heightRange: 'Rang alçada'
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
    '3DMap': 'Mapa 3D'
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
      publishTitle: "1. Publica el teu estil a Mapbox o proporciona el token d'accés",
      publishSubtitle1: 'Pots crear el teu propi estil de mapa a',
      publishSubtitle2: 'i',
      publishSubtitle3: 'publicar',
      publishSubtitle4: 'ho.',
      publishSubtitle5: 'Per utilitzar un estil privat, enganxa el teu',
      publishSubtitle6: "token d'accés",
      publishSubtitle7: 'aquí. *kepler.gl és una aplicació client, les dades romanen al teu navegador..',
      exampleToken: 'p.ex. pk.abcdefg.xxxxxx',
      pasteTitle: "2. Enganxa la URL de l'estil",
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
    coordinate: 'Coordenades'
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
    grid: {
      worldUnitSize: 'Mida de malla (km)'
    },
    hexagon: {
      worldUnitSize: "Radi d'hexàgon (km)"
    }
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
    configUploadMessage: 'Carrega **CSV**, **GeoJson** o un mapa desat en **Json**. Més informació sobre [**supported file formats**]',
    browseFiles: 'navega pels teus arxius',
    uploading: 'Carregant',
    fileNotSupported: "L'arxiu {errorFiles} no és compatible.",
    or: 'o'
  },
  density: 'densitat',
  'Bug Report': "Informe d'errors",
  'User Guide': "Guia d'usuari",
  Save: 'Desa',
  Share: 'Comparteix'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vY2EuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwic3Ryb2tlQ29sb3IiLCJyYWRpdXMiLCJvdXRsaW5lIiwic3Ryb2tlIiwiZGVuc2l0eSIsImhlaWdodCIsInN1bSIsInBvaW50Q291bnQiLCJwbGFjZWhvbGRlciIsInNlYXJjaCIsInNlbGVjdEZpZWxkIiwieUF4aXMiLCJzZWxlY3RUeXBlIiwic2VsZWN0VmFsdWUiLCJlbnRlclZhbHVlIiwiZW1wdHkiLCJtaXNjIiwiYnkiLCJ2YWx1ZXNJbiIsInZhbHVlRXF1YWxzIiwiZGF0YVNvdXJjZSIsImJydXNoUmFkaXVzIiwibWFwTGF5ZXJzIiwidGl0bGUiLCJyb2FkIiwiYm9yZGVyIiwiYnVpbGRpbmciLCJ3YXRlciIsImxhbmQiLCJwYW5lbCIsInRleHQiLCJsYWJlbFdpdGhJZCIsImZvbnRTaXplIiwiZm9udENvbG9yIiwidGV4dEFuY2hvciIsImFsaWdubWVudCIsImFkZE1vcmVMYWJlbCIsInNpZGViYXIiLCJwYW5lbHMiLCJsYXllciIsImZpbHRlciIsImludGVyYWN0aW9uIiwiYmFzZW1hcCIsInJlcXVpcmVkIiwicHJvcGVydHlCYXNlZE9uIiwiY292ZXJhZ2UiLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsInN0cm9rZVdpZHRoUmFuZ2UiLCJmaXhlZFJhZGl1cyIsImZpeGVkUmFkaXVzRGVzY3JpcHRpb24iLCJyYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXMiLCJyYWRpdXNSYW5nZVBpeGVscyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwic3Ryb2tlQ29sb3JSYW5nZSIsInRhcmdldENvbG9yIiwiY29sb3JBZ2dyZWdhdGlvbiIsImhlaWdodEFnZ3JlZ2F0aW9uIiwicmVzb2x1dGlvblJhbmdlIiwic2l6ZVNjYWxlIiwid29ybGRVbml0U2l6ZSIsImVsZXZhdGlvblNjYWxlIiwiaGVpZ2h0U2NhbGUiLCJjb3ZlcmFnZVJhbmdlIiwiaGlnaFByZWNpc2lvblJlbmRlcmluZyIsImhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbiIsImhlaWdodERlc2NyaXB0aW9uIiwiZmlsbCIsImVuYWJsZVBvbHlnb25IZWlnaHQiLCJzaG93V2lyZWZyYW1lIiwid2VpZ2h0SW50ZW5zaXR5Iiwiem9vbVNjYWxlIiwiaGVpZ2h0UmFuZ2UiLCJsYXllck1hbmFnZXIiLCJhZGREYXRhIiwiYWRkTGF5ZXIiLCJsYXllckJsZW5kaW5nIiwibWFwTWFuYWdlciIsIm1hcFN0eWxlIiwiYWRkTWFwU3R5bGUiLCJsYXllckNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJob3dUbyIsImZpbHRlck1hbmFnZXIiLCJhZGRGaWx0ZXIiLCJkYXRhc2V0VGl0bGUiLCJzaG93RGF0YVRhYmxlIiwicmVtb3ZlRGF0YXNldCIsImRhdGFzZXRJbmZvIiwicm93Q291bnQiLCJ0b29sdGlwIiwiaGlkZUxheWVyIiwic2hvd0xheWVyIiwiaGlkZUZlYXR1cmUiLCJzaG93RmVhdHVyZSIsImhpZGUiLCJzaG93IiwicmVtb3ZlTGF5ZXIiLCJsYXllclNldHRpbmdzIiwiY2xvc2VQYW5lbCIsInN3aXRjaFRvRHVhbFZpZXciLCJzaG93TGVnZW5kIiwiZGlzYWJsZTNETWFwIiwiRHJhd09uTWFwIiwic2VsZWN0TG9jYWxlIiwiaGlkZUxheWVyUGFuZWwiLCJzaG93TGF5ZXJQYW5lbCIsIm1vdmVUb1RvcCIsInNlbGVjdEJhc2VNYXBTdHlsZSIsInRpbWVQbGF5YmFjayIsImNsb3VkU3RvcmFnZSIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwibW9kYWwiLCJkZWxldGVEYXRhc2V0IiwiYWRkRGF0YVRvTWFwIiwiYWRkQ3VzdG9tTWFwYm94U3R5bGUiLCJzaGFyZVVSTCIsImJ1dHRvbiIsImRvd25sb2FkIiwiYWRkU3R5bGUiLCJzYXZlIiwiZGVmYXVsdENhbmNlbCIsImRlZmF1bHRDb25maXJtIiwicmF0aW9UaXRsZSIsInJhdGlvRGVzY3JpcHRpb24iLCJyYXRpb09yaWdpbmFsU2NyZWVuIiwicmF0aW9DdXN0b20iLCJyYXRpbzRfMyIsInJhdGlvMTZfOSIsInJlc29sdXRpb25UaXRsZSIsInJlc29sdXRpb25EZXNjcmlwdGlvbiIsIm1hcExlZ2VuZFRpdGxlIiwibWFwTGVnZW5kQWRkIiwiZGF0YXNldFN1YnRpdGxlIiwiYWxsRGF0YXNldHMiLCJkYXRhVHlwZVRpdGxlIiwiZGF0YVR5cGVTdWJ0aXRsZSIsImZpbHRlckRhdGFUaXRsZSIsImZpbHRlckRhdGFTdWJ0aXRsZSIsImZpbHRlcmVkRGF0YSIsInVuZmlsdGVyZWREYXRhIiwiZmlsZUNvdW50IiwiZGVsZXRlRGF0YSIsIndhcm5pbmciLCJwdWJsaXNoVGl0bGUiLCJwdWJsaXNoU3VidGl0bGUxIiwicHVibGlzaFN1YnRpdGxlMiIsInB1Ymxpc2hTdWJ0aXRsZTMiLCJwdWJsaXNoU3VidGl0bGU0IiwicHVibGlzaFN1YnRpdGxlNSIsInB1Ymxpc2hTdWJ0aXRsZTYiLCJwdWJsaXNoU3VidGl0bGU3IiwiZXhhbXBsZVRva2VuIiwicGFzdGVUaXRsZSIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJuYW1pbmdUaXRsZSIsInNoYXJlTWFwIiwic2hhcmVVcmlUaXRsZSIsInNoYXJlVXJpU3VidGl0bGUiLCJjbG91ZFRpdGxlIiwiY2xvdWRTdWJ0aXRsZSIsInNoYXJlRGlzY2xhaW1lciIsImdvdG9QYWdlIiwic3RhdHVzUGFuZWwiLCJtYXBVcGxvYWRpbmciLCJlcnJvciIsInN1YnRpdGxlIiwiZm9ybWF0VGl0bGUiLCJmb3JtYXRTdWJ0aXRsZSIsImh0bWwiLCJzZWxlY3Rpb24iLCJ0b2tlblRpdGxlIiwidG9rZW5TdWJ0aXRsZSIsInRva2VuUGxhY2Vob2xkZXIiLCJ0b2tlbk1pc3VzZVdhcm5pbmciLCJ0b2tlbkRpc2NsYWltZXIiLCJ0b2tlblVwZGF0ZSIsIm1vZGVUaXRsZSIsIm1vZGVTdWJ0aXRsZTEiLCJtb2RlU3VidGl0bGUyIiwibW9kZURlc2NyaXB0aW9uIiwicmVhZCIsImVkaXQiLCJqc29uIiwiY29uZmlnVGl0bGUiLCJjb25maWdEaXNjbGFpbWVyIiwiZGlzY2xhaW1lciIsImxvYWRpbmdEaWFsb2ciLCJsb2FkaW5nIiwibG9hZERhdGEiLCJ1cGxvYWQiLCJzdG9yYWdlIiwidHJpcEluZm8iLCJkZXNjcmlwdGlvbjEiLCJjb2RlIiwiZGVzY3JpcHRpb24yIiwiZXhhbXBsZSIsImljb25JbmZvIiwiaWNvbnMiLCJzdG9yYWdlTWFwVmlld2VyIiwibGFzdE1vZGlmaWVkIiwiYmFjayIsIm92ZXJ3cml0ZU1hcCIsImFscmVhZHlFeGlzdHMiLCJsb2FkU3RvcmFnZU1hcCIsImdvVG9QYWdlIiwic3RvcmFnZU1hcHMiLCJub1NhdmVkTWFwcyIsImhlYWRlciIsInZpc2libGVMYXllcnMiLCJsYXllckxlZ2VuZCIsImludGVyYWN0aW9ucyIsImJydXNoIiwiY29vcmRpbmF0ZSIsImFkZGl0aXZlIiwibm9ybWFsIiwic3VidHJhY3RpdmUiLCJjb2x1bW5zIiwibGF0IiwibG5nIiwiYWx0aXR1ZGUiLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiY3VzdG9tUGFsZXR0ZSIsInN0ZXBzIiwicmV2ZXJzZWQiLCJzY2FsZSIsImNvbG9yU2NhbGUiLCJzdHJva2VTY2FsZSIsImZpbGVVcGxvYWRlciIsIm1lc3NhZ2UiLCJjaHJvbWVNZXNzYWdlIiwiY29uZmlnVXBsb2FkTWVzc2FnZSIsImJyb3dzZUZpbGVzIiwidXBsb2FkaW5nIiwiZmlsZU5vdFN1cHBvcnRlZCIsIm9yIiwiU2F2ZSIsIlNoYXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7Ozs7O2VBRWU7QUFDYkEsRUFBQUEsUUFBUSxFQUFFO0FBQ1JDLElBQUFBLE1BQU0sRUFBRSxLQURBO0FBRVJDLElBQUFBLEtBQUssRUFBRSxVQUZDO0FBR1JDLElBQUFBLFNBQVMsRUFBRSxZQUhIO0FBSVJDLElBQUFBLEtBQUssRUFBRSxPQUpDO0FBS1JDLElBQUFBLFdBQVcsRUFBRSxlQUxMO0FBTVJDLElBQUFBLE1BQU0sRUFBRSxNQU5BO0FBT1JDLElBQUFBLE9BQU8sRUFBRSxTQVBEO0FBUVJDLElBQUFBLE1BQU0sRUFBRSxNQVJBO0FBU1JDLElBQUFBLE9BQU8sRUFBRSxVQVREO0FBVVJDLElBQUFBLE1BQU0sRUFBRSxRQVZBO0FBV1JDLElBQUFBLEdBQUcsRUFBRSxNQVhHO0FBWVJDLElBQUFBLFVBQVUsRUFBRTtBQVpKLEdBREc7QUFlYkMsRUFBQUEsV0FBVyxFQUFFO0FBQ1hDLElBQUFBLE1BQU0sRUFBRSxPQURHO0FBRVhDLElBQUFBLFdBQVcsRUFBRSxvQkFGRjtBQUdYQyxJQUFBQSxLQUFLLEVBQUUsT0FISTtBQUlYQyxJQUFBQSxVQUFVLEVBQUUscUJBSkQ7QUFLWEMsSUFBQUEsV0FBVyxFQUFFLHFCQUxGO0FBTVhDLElBQUFBLFVBQVUsRUFBRSxnQkFORDtBQU9YQyxJQUFBQSxLQUFLLEVBQUU7QUFQSSxHQWZBO0FBd0JiQyxFQUFBQSxJQUFJLEVBQUU7QUFDSkMsSUFBQUEsRUFBRSxFQUFFLEVBREE7QUFFSkMsSUFBQUEsUUFBUSxFQUFFLFVBRk47QUFHSkMsSUFBQUEsV0FBVyxFQUFFLGVBSFQ7QUFJSkMsSUFBQUEsVUFBVSxFQUFFLGVBSlI7QUFLSkMsSUFBQUEs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QSxJQUFJLEVBQUUsTUE5Wk87QUErWmJDLEVBQUFBLEtBQUssRUFBRTtBQS9aTSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIwIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtMT0NBTEVTfSBmcm9tICcuL2xvY2FsZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BlcnR5OiB7XG4gICAgd2VpZ2h0OiAncGVzJyxcbiAgICBsYWJlbDogJ2V0aXF1ZXRhJyxcbiAgICBmaWxsQ29sb3I6ICdjb2xvciBmb25zJyxcbiAgICBjb2xvcjogJ2NvbG9yJyxcbiAgICBzdHJva2VDb2xvcjogJ2NvbG9yIGRlIHRyYcOnJyxcbiAgICByYWRpdXM6ICdyYWRpJyxcbiAgICBvdXRsaW5lOiAnb3V0bGluZScsXG4gICAgc3Ryb2tlOiAndHJhw6cnLFxuICAgIGRlbnNpdHk6ICdkZW5zaXRhdCcsXG4gICAgaGVpZ2h0OiAnYWzDp2FkYScsXG4gICAgc3VtOiAnc3VtYScsXG4gICAgcG9pbnRDb3VudDogJ1JlY29tcHRlIGRlIFB1bnRzJ1xuICB9LFxuICBwbGFjZWhvbGRlcjoge1xuICAgIHNlYXJjaDogJ0NlcmNhJyxcbiAgICBzZWxlY3RGaWVsZDogJ1NlbGVjY2lvbmEgdW4gY2FtcCcsXG4gICAgeUF4aXM6ICdFaXggWScsXG4gICAgc2VsZWN0VHlwZTogJ1NlbGVjY2lvbmEgdW4gVGlwdXMnLFxuICAgIHNlbGVjdFZhbHVlOiAnU2VsZWNjaW9uYSB1biBWYWxvcicsXG4gICAgZW50ZXJWYWx1ZTogJ0VudHJhIHVuIHZhbG9yJyxcbiAgICBlbXB0eTogJ2J1aXQnXG4gIH0sXG4gIG1pc2M6IHtcbiAgICBieTogJycsXG4gICAgdmFsdWVzSW46ICdWYWxvcnMgYScsXG4gICAgdmFsdWVFcXVhbHM6ICdWYWxvciBpZ3VhbCBhJyxcbiAgICBkYXRhU291cmNlOiAnRm9udCBkZSBkYWRlcycsXG4gICAgYnJ1c2hSYWRpdXM6ICdSYWRpIGRlbCBwaW56ZWxsIChrbSknLFxuICAgIGVtcHR5OiAnICdcbiAgfSxcbiAgbWFwTGF5ZXJzOiB7XG4gICAgdGl0bGU6ICdDYXBlcyBkZWwgbWFwYScsXG4gICAgbGFiZWw6ICdFdGlxdWV0YScsXG4gICAgcm9hZDogJ0NhcnJldGVyYScsXG4gICAgYm9yZGVyOiAnRnJvbnRlcmEnLFxuICAgIGJ1aWxkaW5nOiAnRWRpZmljaScsXG4gICAgd2F0ZXI6ICdBaWd1YScsXG4gICAgbGFuZDogJ1RlcnJhJyxcbiAgICAnM2RCdWlsZGluZyc6ICdFZGlmaWNpIDNEJ1xuICB9LFxuICBwYW5lbDoge1xuICAgIHRleHQ6IHtcbiAgICAgIGxhYmVsOiAnZXRpcXVldGEnLFxuICAgICAgbGFiZWxXaXRoSWQ6ICdFdGlxdWV0YSB7bGFiZWxJZH0nLFxuICAgICAgZm9udFNpemU6ICdNaWRhIGRlIGxhIGZvbnQnLFxuICAgICAgZm9udENvbG9yOiAnQ29sb3IgZGUgbGEgZm9udCcsXG4gICAgICB0ZXh0QW5jaG9yOiAnw4BuY29yYSBkZWwgdGV4dCcsXG4gICAgICBhbGlnbm1lbnQ6ICdBbGluZWFjacOzJyxcbiAgICAgIGFkZE1vcmVMYWJlbDogJ0FmZWdlaXggbcOpcyBldGlxdWV0ZXMnXG4gICAgfVxuICB9LFxuICBzaWRlYmFyOiB7XG4gICAgcGFuZWxzOiB7XG4gICAgICBsYXllcjogJ0NhcGVzJyxcbiAgICAgIGZpbHRlcjogJ0ZpbHRyZXMnLFxuICAgICAgaW50ZXJhY3Rpb246ICdJbnRlcmFjY2lvbnMnLFxuICAgICAgYmFzZW1hcDogJ01hcGEgYmFzZSdcbiAgICB9XG4gIH0sXG4gIGxheWVyOiB7XG4gICAgcmVxdWlyZWQ6ICdSZXF1ZXJpdConLFxuICAgIHJhZGl1czogJ1JhZGknLFxuICAgIGNvbG9yOiAnQ29sb3InLFxuICAgIGZpbGxDb2xvcjogJ0NvbG9yIGZvbnMnLFxuICAgIG91dGxpbmU6ICdDb250b3JuJyxcbiAgICB3ZWlnaHQ6ICdHcnVpeCcsXG4gICAgcHJvcGVydHlCYXNlZE9uOiAne3Byb3BlcnR5fSBiYXNhZGEgZW4nLFxuICAgIGNvdmVyYWdlOiAnQ29iZXJ0dXJhJyxcbiAgICBzdHJva2U6ICdUcmHDpycsXG4gICAgc3Ryb2tlV2lkdGg6ICdBbXBsYWRhIGRlIHRyYcOnJyxcbiAgICBzdHJva2VDb2xvcjogJ0NvbG9yIGRlIHRyYcOnJyxcbiAgICBiYXNpYzogJ0Jhc2ljJyxcbiAgICB0cmFpbExlbmd0aDogJ0xvbmdpdHVkIGRlIHBpc3RhJyxcbiAgICB0cmFpbExlbmd0aERlc2NyaXB0aW9uOiAnTm9tYnJlIGRlIHNlZ29ucyBmaW5zIHF1ZSBkZXNhcGFyZWl4IGVsIGNhbcOtJyxcbiAgICBuZXdMYXllcjogJ25vdmEgY2FwYScsXG4gICAgZWxldmF0aW9uQnlEZXNjcmlwdGlvbjogXCJTaSBkZXNhY3RpdmF0LCBsJ2Fsw6dhZGEgZXMgYmFzYSBlbiBlbCByZWNvbXB0ZSBkZSBwdW50c1wiLFxuICAgIGNvbG9yQnlEZXNjcmlwdGlvbjogJ1NpIGRlc2FjdGl2YXQsIGVsIGNvbG9yIGVzIGJhc2EgZW4gZWwgcmVjb21wdGUgZGUgcHVudHMnLFxuICAgIGFnZ3JlZ2F0ZUJ5OiAne2ZpZWxkfSBhZ3JlZ2F0IHBlcicsXG4gICAgJzNETW9kZWwnOiAnTW9kZWwgM0QnLFxuICAgICczRE1vZGVsT3B0aW9ucyc6ICdPcGNpb25zIGRlbCBtb2RlbCAzRCcsXG4gICAgdHlwZToge1xuICAgICAgcG9pbnQ6ICdwdW50JyxcbiAgICAgIGFyYzogJ2FyYycsXG4gICAgICBsaW5lOiAnbMOtbmlhJyxcbiAgICAgIGdyaWQ6ICdtYWxsYScsXG4gICAgICBoZXhiaW46ICdoZXhiaW4nLFxuICAgICAgcG9seWdvbjogJ3BvbMOtZ29uJyxcbiAgICAgIGdlb2pzb246ICdnZW9qc29uJyxcbiAgICAgIGNsdXN0ZXI6ICdjbHVzdGVyJyxcbiAgICAgIGljb246ICdpY29uYScsXG4gICAgICBoZWF0bWFwOiAnaGVhdG1hcCcsXG4gICAgICBoZXhhZ29uOiAnaGV4w6Bnb24nLFxuICAgICAgaGV4YWdvbmlkOiAnSDMnLFxuICAgICAgdHJpcDogJ3ZpYXRnZScsXG4gICAgICBzMjogJ1MyJyxcbiAgICAgICczZCc6ICczRCdcbiAgICB9XG4gIH0sXG4gIGxheWVyVmlzQ29uZmlnczoge1xuICAgIHN0cm9rZVdpZHRoOiAnQW1wbGFkYSB0cmHDpycsXG4gICAgc3Ryb2tlV2lkdGhSYW5nZTogJ1JhbmcgYW1wbGFkYSBkZSB0cmHDpycsXG4gICAgcmFkaXVzOiAnUmFkaScsXG4gICAgZml4ZWRSYWRpdXM6ICdSYWRpIGZpeGUgYSBtZXN1cmFyJyxcbiAgICBmaXhlZFJhZGl1c0Rlc2NyaXB0aW9uOiAnQWp1c3RhIGVsIHJhZGkgYWwgcmFkaSBhYnNvbHV0IGVuIG1ldHJlcywgcC5leCA1IGEgNSBtZXRyZXMnLFxuICAgIHJhZGl1c1JhbmdlOiAnUmFuZyBkZSByYWRpJyxcbiAgICBjbHVzdGVyUmFkaXVzOiAnUmFkaSBDbHVzdGVyIGVuIFBpeGVscycsXG4gICAgcmFkaXVzUmFuZ2VQaXhlbHM6ICdSYW5nIGRlbCByYWRpIGVuIHBpeGVscycsXG4gICAgb3BhY2l0eTogJ09wYWNpdGF0JyxcbiAgICBjb3ZlcmFnZTogJ0NvYmVydHVyYScsXG4gICAgb3V0bGluZTogJ091dGxpbmUnLFxuICAgIGNvbG9yUmFuZ2U6ICdSYW5nIGRlIGNvbG9yJyxcbiAgICBzdHJva2U6ICdUcmHDpycsXG4gICAgc3Ryb2tlQ29sb3I6ICdDb2xvciBkZSB0cmHDpycsXG4gICAgc3Ryb2tlQ29sb3JSYW5nZTogJ1JhbmcgZGUgY29sb3IgZGUgdHJhw6cnLFxuICAgIHRhcmdldENvbG9yOiAnQ29sb3IgZGVzdMOtJyxcbiAgICBjb2xvckFnZ3JlZ2F0aW9uOiAnQWdyZWdhY2nDsyBkZSBjb2xvcicsXG4gICAgaGVpZ2h0QWdncmVnYXRpb246ICdBZ3JlZ2FjacOzIGFsw6dhZGEnLFxuICAgIHJlc29sdXRpb25SYW5nZTogJ1JhbmcgZGUgcmVzb2x1Y2nDsycsXG4gICAgc2l6ZVNjYWxlOiAnTWlkYSBlc2NhbGEnLFxuICAgIHdvcmxkVW5pdFNpemU6ICdNaWRhIGRlIGxhIHVuaXRhdCBtdW5kaWFsJyxcbiAgICBlbGV2YXRpb25TY2FsZTogJ0VzY2FsYSBlbGV2YWNpw7MnLFxuICAgIGhlaWdodFNjYWxlOiAnRXNjYWxhIGFsw6dhZGEnLFxuICAgIGNvdmVyYWdlUmFuZ2U6ICdSYW5nIGVkIGNvYmVydHVyYScsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZzogJ1JlcHJlc2VudGFjacOzIGFsdGEgcHJlY2lzacOzJyxcbiAgICBoaWdoUHJlY2lzaW9uUmVuZGVyaW5nRGVzY3JpcHRpb246ICdMYSBwcmVjaXNpw7MgYWx0YSB0aW5kcsOgIHJlbmRpbWVudCBtw6lzIGJhaXgnLFxuICAgIGhlaWdodDogJ0Fsw6dhZGEnLFxuICAgIGhlaWdodERlc2NyaXB0aW9uOiAnRmVzIGNsaWMgYWwgYm90w7MgYSBkYWx0IGEgbGEgZHJldGEgZGVsIG1hcGEgcGVyIGNhbnZpYXIgYSB2aXN0YSAzRCcsXG4gICAgZmlsbDogJ09tcGxlJyxcbiAgICBlbmFibGVQb2x5Z29uSGVpZ2h0OiAnQWN0aXZhIGFsw6dhZGEgZGVsIHBvbMOtZ29uJyxcbiAgICBzaG93V2lyZWZyYW1lOiAnTW9zdHJhIFdpcmVmcmFtZScsXG4gICAgd2VpZ2h0SW50ZW5zaXR5OiAnSW50ZW5zaXRhdCBkZSBwZXMnLFxuICAgIHpvb21TY2FsZTogJ0VzY2FsYSBkZSB6b29tJyxcbiAgICBoZWlnaHRSYW5nZTogJ1JhbmcgYWzDp2FkYSdcbiAgfSxcbiAgbGF5ZXJNYW5hZ2VyOiB7XG4gICAgYWRkRGF0YTogJ0FmZWdlaXggRGFkZXMnLFxuICAgIGFkZExheWVyOiAnQWZlZ2VpeCBDYXBlcycsXG4gICAgbGF5ZXJCbGVuZGluZzogJ0NvbWJpbmFyIGNhcGVzJ1xuICB9LFxuICBtYXBNYW5hZ2VyOiB7XG4gICAgbWFwU3R5bGU6ICdFc3RpbCBkZSBtYXBhJyxcbiAgICBhZGRNYXBTdHlsZTogJ0FmZWdlaXggZXN0aWxzIGRlIG1hcGEnLFxuICAgICczZEJ1aWxkaW5nQ29sb3InOiAnQ29sb3IgZWRpZmljaSAzRCdcbiAgfSxcbiAgbGF5ZXJDb25maWd1cmF0aW9uOiB7XG4gICAgZGVmYXVsdERlc2NyaXB0aW9uOiAnQ2FsY3VsYSB7cHJvcGVydHl9IHNlZ29ucyBlbCBjYW1wIHNlbGVjY2lvbmF0JyxcbiAgICBob3dUbzogJ0hvdyB0bydcbiAgfSxcbiAgZmlsdGVyTWFuYWdlcjoge1xuICAgIGFkZEZpbHRlcjogJ0FmZWdlaXggRmlsdHJlJ1xuICB9LFxuICBkYXRhc2V0VGl0bGU6IHtcbiAgICBzaG93RGF0YVRhYmxlOiAnTW9zdHJhIHRhdWxhIGRlIGRhZGVzJyxcbiAgICByZW1vdmVEYXRhc2V0OiAnRWxpbWluYSBjb25qdW50IGRlIGRhZGVzJ1xuICB9LFxuICBkYXRhc2V0SW5mbzoge1xuICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSBmaWxlcydcbiAgfSxcbiAgdG9vbHRpcDoge1xuICAgIGhpZGVMYXllcjogJ29jdWx0YSBsYSBjYXBhJyxcbiAgICBzaG93TGF5ZXI6ICdtb3N0cmEgbGEgY2FwYScsXG4gICAgaGlkZUZlYXR1cmU6IFwiQW1hZ2EgbCdvYmplY3RlXCIsXG4gICAgc2hvd0ZlYXR1cmU6IFwiTW9zdHJhIGwnb2JqZWN0ZVwiLFxuICAgIGhpZGU6ICdhbWFnYScsXG4gICAgc2hvdzogJ21vc3RyYScsXG4gICAgcmVtb3ZlTGF5ZXI6ICdFbGltaW5hIGNhcGEnLFxuICAgIGxheWVyU2V0dGluZ3M6ICdDb25maWd1cmFjacOzIGRlIGNhcGEnLFxuICAgIGNsb3NlUGFuZWw6ICdUYW5jYSBwYW5lbCBhY3R1YWwnLFxuICAgIHN3aXRjaFRvRHVhbFZpZXc6ICdDYW52aWEgYSBsYSB2aXN0YSBkZSBtYXBhIGR1YWwnLFxuICAgIHNob3dMZWdlbmQ6ICdtb3N0cmEgbGxlZ2VuZGEnLFxuICAgIGRpc2FibGUzRE1hcDogJ0Rlc2FjdGl2YSBtYXBhIDNEJyxcbiAgICBEcmF3T25NYXA6ICdEaWJ1aXhhIGFsIG1hcGEnLFxuICAgIHNlbGVjdExvY2FsZTogJ1NlbGVjY2lvbmEgY29uZmlndXJhY2nDsyByZWdpb25hbCcsXG4gICAgaGlkZUxheWVyUGFuZWw6ICdPY3VsdGEgZWwgdGF1bGVyIGRlIGNhcGVzJyxcbiAgICBzaG93TGF5ZXJQYW5lbDogJ01vc3RyYSBlbCB0YXVsZXIgZGUgY2FwZXMnLFxuICAgIG1vdmVUb1RvcDogJ0Rlc3BsYcOnYSBhIGRhbHQgZGUgdG90IGRlIGxlcyBjYXBlcyBkZSBkYWRlcycsXG4gICAgc2VsZWN0QmFzZU1hcFN0eWxlOiAnU2VsZWNjaW9uYSBlc3RpbCBkZSBtYXBhIGJhc2UnLFxuICAgIGRlbGV0ZTogJ0VzYm9ycmEnLFxuICAgIHRpbWVQbGF5YmFjazogJ1JlcHJvZHVjY2nDsyBkZSB0ZW1wcycsXG4gICAgY2xvdWRTdG9yYWdlOiAnRW1tYWdhdHplbWF0Z2UgYWwgbsO6dm9sJyxcbiAgICAnM0RNYXAnOiAnTWFwYSAzRCdcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0YSBpbWF0Z2UnLFxuICAgIGV4cG9ydERhdGE6ICdFeHBvcnRhIGRhZGVzJyxcbiAgICBleHBvcnRNYXA6ICdFeHBvcnRhIG1hcGEnLFxuICAgIHNoYXJlTWFwVVJMOiAnQ29tcGFydGVpeCBVUkwgZGVsIG1hcGEnLFxuICAgIHNhdmVNYXA6ICdEZXNhIG1hcGEnLFxuICAgIHNlbGVjdDogJ3NlbGVjY2lvbmEnLFxuICAgIHBvbHlnb246ICdwb2zDrWdvbicsXG4gICAgcmVjdGFuZ2xlOiAncmVjdGFuZ2xlJyxcbiAgICBoaWRlOiAnYW1hZ2EnLFxuICAgIHNob3c6ICdtb3N0cmEnLFxuICAgIC4uLkxPQ0FMRVNcbiAgfSxcbiAgbW9kYWw6IHtcbiAgICB0aXRsZToge1xuICAgICAgZGVsZXRlRGF0YXNldDogJ0VzYm9ycmEgY29uanVudCBkZSBkYWRlcycsXG4gICAgICBhZGREYXRhVG9NYXA6ICdBZmVnZWl4IGRhZGVzIGFsIG1hcGEnLFxuICAgICAgZXhwb3J0SW1hZ2U6ICdFeHBvcnRhIGltYXRnZScsXG4gICAgICBleHBvcnREYXRhOiAnRXhwb3J0YSBkYWRlcycsXG4gICAgICBleHBvcnRNYXA6ICdFeHBvcnRhIG1hcGEnLFxuICAgICAgYWRkQ3VzdG9tTWFwYm94U3R5bGU6ICdBZmVnZWl4IGVzdGlsIE1hcGJveCBwcm9waScsXG4gICAgICBzYXZlTWFwOiAnRGVzYSBtYXBhJyxcbiAgICAgIHNoYXJlVVJMOiAnQ29tcGFydGVpeCBVUkwnXG4gICAgfSxcbiAgICBidXR0b246IHtcbiAgICAgIGRlbGV0ZTogJ0VzYm9ycmEnLFxuICAgICAgZG93bmxvYWQ6ICdEZXNjYXJyZWdhJyxcbiAgICAgIGV4cG9ydDogJ0V4cG9ydGEnLFxuICAgICAgYWRkU3R5bGU6ICdBZmVnZWl4IGVzdGlsJyxcbiAgICAgIHNhdmU6ICdEZXNhJyxcbiAgICAgIGRlZmF1bHRDYW5jZWw6ICdDYW5jZWzCt2xhJyxcbiAgICAgIGRlZmF1bHRDb25maXJtOiAnQ29uZmlybWEnXG4gICAgfSxcbiAgICBleHBvcnRJbWFnZToge1xuICAgICAgcmF0aW9UaXRsZTogJ1LDoHRpbycsXG4gICAgICByYXRpb0Rlc2NyaXB0aW9uOiAnRXNjdWxsIHLDoHRpbyBwZXIgZGl2ZXJzb3MgdXNvcy4nLFxuICAgICAgcmF0aW9PcmlnaW5hbFNjcmVlbjogJ1BhbnRhbGxhIG9yaWdpbmFsJyxcbiAgICAgIHJhdGlvQ3VzdG9tOiAnUGVyc29uYWxpdHphdCcsXG4gICAgICByYXRpbzRfMzogJzQ6MycsXG4gICAgICByYXRpbzE2Xzk6ICcxNjo5JyxcbiAgICAgIHJlc29sdXRpb25UaXRsZTogJ1Jlc29sdWNpw7MnLFxuICAgICAgcmVzb2x1dGlvbkRlc2NyaXB0aW9uOiAnQWx0YSByZXNvbHVjacOzIMOpcyBtaWxsb3IgcGVyIGEgbGVzIGltcHJlc3Npb25zLicsXG4gICAgICBtYXBMZWdlbmRUaXRsZTogJ0xsZWdlbmRhIGRlbCBtYXBhJyxcbiAgICAgIG1hcExlZ2VuZEFkZDogJ0FmZWdpciBsbGVnZW5kYSBhbCBtYXBhJ1xuICAgIH0sXG4gICAgZXhwb3J0RGF0YToge1xuICAgICAgZGF0YXNldFRpdGxlOiAnQ29uanVudCBkZSBkYWRlcycsXG4gICAgICBkYXRhc2V0U3VidGl0bGU6ICdFc2N1bGwgZWxzIGNvbmp1bnRzIGRlIGRhZGVzIHF1ZSB2b2xzIGV4cG9ydGFyJyxcbiAgICAgIGFsbERhdGFzZXRzOiAnVG90cycsXG4gICAgICBkYXRhVHlwZVRpdGxlOiAnVGlwdXMgZGUgZGFkZXMnLFxuICAgICAgZGF0YVR5cGVTdWJ0aXRsZTogJ0VzY3VsbCBlbHMgdGlwdXMgZGUgZGFkZXMgcXVlIHZvbHMgZXhwb3J0YXInLFxuICAgICAgZmlsdGVyRGF0YVRpdGxlOiAnRmlsdHJhIGRhZGVzJyxcbiAgICAgIGZpbHRlckRhdGFTdWJ0aXRsZTogJ1BvdHMgZXNjb2xsaXIgZXhwb3J0YXIgbGVzIGRhZGVzIG9yaWdpbmFscyBvIGxlcyBmaWx0cmFkZXMnLFxuICAgICAgZmlsdGVyZWREYXRhOiAnRGFkZXMgZmlsdHJhZGVzJyxcbiAgICAgIHVuZmlsdGVyZWREYXRhOiAnRGFkZXMgc2Vuc2UgZmlsdHJhcicsXG4gICAgICBmaWxlQ291bnQ6ICd7ZmlsZUNvdW50fSBBcnhpdXMnLFxuICAgICAgcm93Q291bnQ6ICd7cm93Q291bnR9IEZpbGVzJ1xuICAgIH0sXG4gICAgZGVsZXRlRGF0YToge1xuICAgICAgd2FybmluZzogXCJlc3TDoHMgYSBwdW50IGQnZXNib3JyYXIgYXF1ZXN0IGNvbmp1bnQgZGUgZGFkZXMuIEFmZWN0YXLDoCB7bGVuZ3RofSBjYXBlc1wiXG4gICAgfSxcbiAgICBhZGRTdHlsZToge1xuICAgICAgcHVibGlzaFRpdGxlOiBcIjEuIFB1YmxpY2EgZWwgdGV1IGVzdGlsIGEgTWFwYm94IG8gcHJvcG9yY2lvbmEgZWwgdG9rZW4gZCdhY2PDqXNcIixcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTE6ICdQb3RzIGNyZWFyIGVsIHRldSBwcm9waSBlc3RpbCBkZSBtYXBhIGEnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMjogJ2knLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMzogJ3B1YmxpY2FyJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTQ6ICdoby4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNTogJ1BlciB1dGlsaXR6YXIgdW4gZXN0aWwgcHJpdmF0LCBlbmdhbnhhIGVsIHRldScsXG4gICAgICBwdWJsaXNoU3VidGl0bGU2OiBcInRva2VuIGQnYWNjw6lzXCIsXG4gICAgICBwdWJsaXNoU3VidGl0bGU3OlxuICAgICAgICAnYXF1w60uICprZXBsZXIuZ2wgw6lzIHVuYSBhcGxpY2FjacOzIGNsaWVudCwgbGVzIGRhZGVzIHJvbWFuZW4gYWwgdGV1IG5hdmVnYWRvci4uJyxcbiAgICAgIGV4YW1wbGVUb2tlbjogJ3AuZXguIHBrLmFiY2RlZmcueHh4eHh4JyxcbiAgICAgIHBhc3RlVGl0bGU6IFwiMi4gRW5nYW54YSBsYSBVUkwgZGUgbCdlc3RpbFwiLFxuICAgICAgcGFzdGVTdWJ0aXRsZTE6ICdRdcOoIMOpcyB1bicsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogXCJVUkwgZGUgbCdlc3RpbFwiLFxuICAgICAgbmFtaW5nVGl0bGU6ICczLiBQb3NhIG5vbSBhbCB0ZXUgZXN0aWwnXG4gICAgfSxcbiAgICBzaGFyZU1hcDoge1xuICAgICAgc2hhcmVVcmlUaXRsZTogJ0NvbXBhcnRlaXggVVJMIGRlbCBtYXBhJyxcbiAgICAgIHNoYXJlVXJpU3VidGl0bGU6ICdHZW5lcmEgdW5hIFVSTCBkZWwgbWFwYSBwZXIgY29tcGFydGlyIGFtYiBhbHRyaScsXG4gICAgICBjbG91ZFRpdGxlOiAnRW1tYWdhdHplbWF0Z2UgYWwgbsO6dm9sJyxcbiAgICAgIGNsb3VkU3VidGl0bGU6ICdBY2NlZGVpeCBpIGNhcnJlZ2EgZGFkZXMgZGUgbWFwYSBhbCB0ZXUgZW1tYWdhdHplbWF0Z2UgYWwgbsO6dm9sIHBlcnNvbmFsJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCBkZXNhcsOgIGxlcyBkYWRlcyBkZWwgbWFwYSBhbCB0ZXUgZW1tYWdhdHplbWF0Z2UgYWwgbsO6dm9sIHBlcnNvbmFsLCBub23DqXMgcXVpIHRpbmd1aSBsYSBVUkwgcG9kcsOgIGFjY2VkaXIgYWwgbWFwYSBpIGEgbGVzIGRhZGVzIC4gJyArXG4gICAgICAgIFwiUG90cyBlZGl0YXIvZXNib3JyYXIgbCdhcnhpdSBkZSBkYWRlcyBlbiBlbCB0ZXUgY29tcHRlIGFsIG7DunZvbCBlbiBxdWFsc2V2b2wgbW9tZW50LlwiLFxuICAgICAgZ290b1BhZ2U6ICdWZXMgYSBsYSBww6BnaW5hIGRlIHtjdXJyZW50UHJvdmlkZXJ9IGRlIEtlcGxlci5nbCdcbiAgICB9LFxuICAgIHN0YXR1c1BhbmVsOiB7XG4gICAgICBtYXBVcGxvYWRpbmc6ICdDYXJyZWdhciB1biBtYXBhJyxcbiAgICAgIGVycm9yOiAnRXJyb3InXG4gICAgfSxcbiAgICBzYXZlTWFwOiB7XG4gICAgICB0aXRsZTogJ0VtbWFnYXR6ZW1hdGdlIGFsIG7DunZvbCcsXG4gICAgICBzdWJ0aXRsZTogJ0FjY2VkZWl4IHBlciBkZXNhciBlbCBtYXBhIGFsIHRldSBlbW1hZ2F0emVtYXRnZSBhbCBuw7p2b2wnXG4gICAgfSxcbiAgICBleHBvcnRNYXA6IHtcbiAgICAgIGZvcm1hdFRpdGxlOiAnRm9ybWF0IGRlIG1hcGEnLFxuICAgICAgZm9ybWF0U3VidGl0bGU6ICdFc2N1bGwgZWwgZm9ybWF0IGFtYiBxdcOoIHZvbHMgZXhwb3J0YXIgZWwgdGV1IG1hcGEnLFxuICAgICAgaHRtbDoge1xuICAgICAgICBzZWxlY3Rpb246ICdFeHBvcnRhIGVsIHRldSBtYXBhIGNvbSB1biBhcnhpdSBIVE1MIGludGVyYWN0aXUuJyxcbiAgICAgICAgdG9rZW5UaXRsZTogXCJUb2tlbiBkJ2FjY8OpcyBkZSBNYXBib3hcIixcbiAgICAgICAgdG9rZW5TdWJ0aXRsZTogXCJVdGlsaXR6YSBlbCB0ZXUgdG9rZW4gZCdhY2PDqXMgZGUgTWFwYm94IGEgbCdhcnhpdSBIVE1MIChvcGNpb25hbClcIixcbiAgICAgICAgdG9rZW5QbGFjZWhvbGRlcjogXCJFbmdhbnhhIGVsIHRldSB0b2tlbiBkJ2FjY8OpcyBhIE1hcGJveFwiLFxuICAgICAgICB0b2tlbk1pc3VzZVdhcm5pbmc6XG4gICAgICAgICAgJyogU2kgbm8gcHJvcG9yY2lvbmVzIGVsIHRldSBwcm9waSB0b2tlbiwgZWwgbWFwYSBwb2RyaWEgZmFsbGFyIGVuIHF1YWxzZXZvbCBtb21lbnQgcXVhbiByZWVtcGxhY2VtIGVsIG5vc3RyZSB0b2tlbiBwZXIgZXZpdGFyIGFidXNvcy4gJyxcbiAgICAgICAgdG9rZW5EaXNjbGFpbWVyOlxuICAgICAgICAgICdQb3RzIGNhbnZpYXIgZWwgdG9rZSBkZSBNYXBib3ggbcOpcyBlbmRhdmFudCBmZW50IHNlcnZpciBhcXVlc3RlcyBpbnN0cnVjY2lvbnM6ICcsXG4gICAgICAgIHRva2VuVXBkYXRlOiAnQ29tIGFjdHVhbGl0emFyIHVuIHRva2VuIHByZWV4aXN0ZW50LicsXG4gICAgICAgIG1vZGVUaXRsZTogJ01vZGUgbWFwYScsXG4gICAgICAgIG1vZGVTdWJ0aXRsZTE6ICdTZWxlY2Npb25hIG1vZGUgYXBwLiBNw6lzICcsXG4gICAgICAgIG1vZGVTdWJ0aXRsZTI6ICdpbmZvcm1hY2nDsycsXG4gICAgICAgIG1vZGVEZXNjcmlwdGlvbjogJ1Blcm1ldCBhbHMgdXN1YXJpcyB7bW9kZX0gZWwgbWFwYScsXG4gICAgICAgIHJlYWQ6ICdsbGVnaXInLFxuICAgICAgICBlZGl0OiAnZWRpdGFyJ1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgY29uZmlnVGl0bGU6ICdDb25maWd1cmFjacOzIGRlbCBtYXBhJyxcbiAgICAgICAgY29uZmlnRGlzY2xhaW1lcjpcbiAgICAgICAgICBcIkxhIGNvbmZpZ3VyYWNpw7MgZGVsIG1hcGEgcydpbmNsb3Vyw6AgYSBsJ2FyeGl1IEpzb24uIFNpIHV0aWxpdHplcyBrZXBsZXIuZ2wgYSBsYSB0ZXZhIHByw7JwaWEgYXBwIHBvdHMgY29waWFyIGFxdWVzdGEgY29uZmlndXJhY2nDsyBpIHBhc3Nhci1sYSBhICBcIixcbiAgICAgICAgc2VsZWN0aW9uOlxuICAgICAgICAgICdFeHBvcnRhIGxlcyBkYWRlcyBkZWwgbWFwYSBpIGxhIGNvbmZpZ3VyYWNpw7MgZW4gdW4gc29sIGFyeGl1IEpzb24uIE3DqXMgZW5kYXZhbnQgcG90cyBvYnJpciBhcXVlc3QgbWF0ZWl4IG1hcGEgY2FycmVnYW50IGFxdWVzdCBtYXRlaXggYXJ4aXUgYSBrZXBsZXIuZ2wuJyxcbiAgICAgICAgZGlzY2xhaW1lcjpcbiAgICAgICAgICBcIiogTGEgY29uZmlndXJhY2nDsyBkZWwgbWFwYSBlcyBjb21iaW5hIGFtYiBlbHMgY29uanVudHMgZGUgZGFkZXMgY2FycmVnYXRzLiDigJhkYXRhSWTigJkgcyd1dGlsaXR6YSBwZXIgbGxpZ2FyIGNhcGVzLCBmaWx0cmVzIGkgc3VnZ2VyaW1lbnRzIGEgdW4gY29uanVudCBkZSBkYWRlcyBlc3BlY8OtZmljLiBcIiArXG4gICAgICAgICAgXCJRdWFuIHBhc3NpcyBhcXVlc3RhIGNvbmZpZ3VyYWNpw7MgYSBhZGREYXRhVG9NYXAsIGFzc2VndXJhIHF1ZSBsJ2lkZW50aWZpY2Fkb3IgZGVsIGNvbmp1bnQgZGUgZGFkZXMgY29pbmNpZGVpeGkgYW1iIGVscyDigJhkYXRhSWTigJkgZCdhcXVlc3RhIGNvbmZpZ3VyYWNpw7MuXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRpbmdEaWFsb2c6IHtcbiAgICAgIGxvYWRpbmc6ICdDYXJyZWdhbnQuLi4nXG4gICAgfSxcbiAgICBsb2FkRGF0YToge1xuICAgICAgdXBsb2FkOiAnQ2FycmVnYXIgYXJ4aXVzJyxcbiAgICAgIHN0b3JhZ2U6IFwiQ2FycmVnYXIgZGVzIGQnZW1tYWdhdHplbWF0Z2VcIlxuICAgIH0sXG4gICAgdHJpcEluZm86IHtcbiAgICAgIHRpdGxlOiAnQ29tIGhhYmlsaXRhciBs4oCZYW5pbWFjacOzIGRlIHZpYXRnZScsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdQZXIgYW5pbWFyIGxhIHJ1dGEsIGxlcyBkYWRlcyBnZW9KU09OIGhhbiBkZSBjb250ZW5pciBgTGluZVN0cmluZ2AgZW4gbGEgc2V2YSBnZW9tZXRyaWEgaSBsZXMgY29vcmRlbmFkZXMgZGUgTGluZVN0cmluZyBoYW4gZGUgdGVuaXIgNCBlbGVtZW50cyBlbiBlbHMgZm9ybWF0cyBkZSAnLFxuICAgICAgY29kZTogJyBbbG9uZ2l0dWRlLCBsYXRpdHVkZSwgYWx0aXR1ZGUsIHRpbWVzdGFtcF0gJyxcbiAgICAgIGRlc2NyaXB0aW9uMjpcbiAgICAgICAgJ2kgZWwgZGFycmVyIGVsZW1lbnQgaGEgZGUgc2VyIGxhIG1hcmNhIGRlIHRlbXBzLiBFbHMgZm9ybWF0cyB2w6BsaWRzIHBlciBhIGxhIG1hcmNhIGRlIHRlbXBzIGluY2xvdWVuIFVuaXggZW4gc2Vnb25zIGNvbSBgMTU2NDE4NDM2M2AgbyBlbiBtaWxpc2Vnb25zIGNvbSBgMTU2NDE4NDM2MzAwMGAuJyxcbiAgICAgIGV4YW1wbGU6ICdFeGVtcGxlOidcbiAgICB9LFxuICAgIGljb25JbmZvOiB7XG4gICAgICB0aXRsZTogJ0NvbSBkaWJ1aXhhciBpY29uZXMnLFxuICAgICAgZGVzY3JpcHRpb24xOlxuICAgICAgICBcIkVuIGVsIHRldSBDU1YgY3JlYSB1bmEgY29sdW1uYSBpIHBvc2EtaGkgZWwgbm9tIGRlIGxhIGljb25hIHF1ZSB2b2xzIGRpYnVpeGFyLiBQb3RzIGRlaXhhciBsYSBjZWzCt2xhIGJ1aWRhIHF1YW4gbm8gdnVsZ3VpcyBxdWUgZXMgbW9zdHJpIHBlciBhIGNlcnRzIHB1bnRzLiBRdWFuIGxhIGNvbHVtbmEgcydhbm9tZW5hXCIsXG4gICAgICBjb2RlOiAnaWNvbicsXG4gICAgICBkZXNjcmlwdGlvbjI6IFwiIGtlcGxlci5nbCBhdXRvbcOgdGljYW1lbnQgY3JlYXLDoCB1bmEgY2FwYSBkJ2ljb25hLlwiLFxuICAgICAgZXhhbXBsZTogJ0V4ZW1wbGU6JyxcbiAgICAgIGljb25zOiAnSWNvbmVzJ1xuICAgIH0sXG4gICAgc3RvcmFnZU1hcFZpZXdlcjoge1xuICAgICAgbGFzdE1vZGlmaWVkOiAnRGFycmVyYSBtb2RpZmljYWNpw7MgZmEge2xhc3RVcGRhdGVkfScsXG4gICAgICBiYWNrOiAnRW5yZXJlJ1xuICAgIH0sXG4gICAgb3ZlcndyaXRlTWFwOiB7XG4gICAgICB0aXRsZTogJ0Rlc2FudCBtYXBhLi4uJyxcbiAgICAgIGFscmVhZHlFeGlzdHM6ICdqYSBleGlzdGVpeCBhIHttYXBTYXZlZH0uIEVsIHZvbHMgc29icmVlc2NyaXVyZT8nXG4gICAgfSxcbiAgICBsb2FkU3RvcmFnZU1hcDoge1xuICAgICAgYmFjazogJ0VucmVyZScsXG4gICAgICBnb1RvUGFnZTogJ1ZlcyBhIGxhIHDDoGdpbmEge2Rpc3BsYXlOYW1lfSBkZSBLZXBsZXIuZ2wnLFxuICAgICAgc3RvcmFnZU1hcHM6ICdFbW1hZ2F0emVtYXRnZSAvIE1hcGVzJyxcbiAgICAgIG5vU2F2ZWRNYXBzOiAnQ2FwIG1hcGEgZGVzYXQgZW5jYXJhJ1xuICAgIH1cbiAgfSxcbiAgaGVhZGVyOiB7XG4gICAgdmlzaWJsZUxheWVyczogJ0NhcGVzIHZpc2libGVzJyxcbiAgICBsYXllckxlZ2VuZDogJ0xsZWdlbmRhIGRlIGNhcGVzJ1xuICB9LFxuICBpbnRlcmFjdGlvbnM6IHtcbiAgICB0b29sdGlwOiAnU3VnZ2VyaW1lbnQnLFxuICAgIGJydXNoOiAnUGluemVsbCcsXG4gICAgY29vcmRpbmF0ZTogJ0Nvb3JkZW5hZGVzJ1xuICB9LFxuICBsYXllckJsZW5kaW5nOiB7XG4gICAgdGl0bGU6ICdDb21iaW5hY2nDsyBkZSBjYXBlcycsXG4gICAgYWRkaXRpdmU6ICdhZGRpdGl2YScsXG4gICAgbm9ybWFsOiAnbm9ybWFsJyxcbiAgICBzdWJ0cmFjdGl2ZTogJ3N1YnN0cmFjdGl2YSdcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAnQ29sdW1uZXMnLFxuICAgIGxhdDogJ2xhdCcsXG4gICAgbG5nOiAnbG9uJyxcbiAgICBhbHRpdHVkZTogJ2Fsw6dhZGEnLFxuICAgIGljb246ICdpY29uYScsXG4gICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgIGFyYzoge1xuICAgICAgbGF0MDogJ2xhdCBvcmlnZW4nLFxuICAgICAgbG5nMDogJ2xuZyBvcmlnZW4gJyxcbiAgICAgIGxhdDE6ICdsYXQgZGVzdGluYWNpw7MnLFxuICAgICAgbG5nMTogJ2xuZyBkZXN0aW5hY2nDsydcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIHdvcmxkVW5pdFNpemU6ICdNaWRhIGRlIG1hbGxhIChrbSknXG4gICAgfSxcbiAgICBoZXhhZ29uOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiBcIlJhZGkgZCdoZXjDoGdvbiAoa20pXCJcbiAgICB9XG4gIH0sXG4gIGNvbG9yOiB7XG4gICAgY3VzdG9tUGFsZXR0ZTogJ1BhbGV0YSBwZXJzb25hbGl0emFkYScsXG4gICAgc3RlcHM6ICdpbnRlcnZhbHMnLFxuICAgIHR5cGU6ICd0aXB1cycsXG4gICAgcmV2ZXJzZWQ6ICdpbnZlcnRpZGEnXG4gIH0sXG4gIHNjYWxlOiB7XG4gICAgY29sb3JTY2FsZTogJ0VzY2FsYSBkZSBjb2xvcicsXG4gICAgc2l6ZVNjYWxlOiAnRXNjYWxhIGRlIG1pZGVzJyxcbiAgICBzdHJva2VTY2FsZTogJ0VzY2FsYSBkZSB0cmHDpycsXG4gICAgc2NhbGU6ICdFc2NhbGEnXG4gIH0sXG4gIGZpbGVVcGxvYWRlcjoge1xuICAgIG1lc3NhZ2U6IFwiQXJyb3NzZWdhIGkgZGVpeGEgYW5hciBsJ2FyeGl1IGFxdcOtXCIsXG4gICAgY2hyb21lTWVzc2FnZTpcbiAgICAgICcqdXN1YXJpIGRlIENocm9tZTogbGEgbWlkYSBtw6B4aW1hIHPDs24gMjUwbWIsIHNpIGhhcyBkZSBjYXJyZ2FyIHVuIGFyeGl1IG3DqXMgZ3JhbiBmZXMgc2VydmlyIFNhZmFyaScsXG4gICAgZGlzY2xhaW1lcjpcbiAgICAgICcqa2VwbGVyLmdsIMOpcyB1bmEgYXBsaWNhY2nDsyBhIGxhIGJhbmRhIGNsaWVudCBxdWUgbm8gZXMgcmVjb2x6YSBlbiBjYXAgc2Vydmlkb3IuIExlcyBkYWRlcyBub23DqXMgZXhpc3RlaXhlbiBhIGxhIHRldmEgbcOgcXVpbmEvbmF2ZWdhZG9yLiAnICtcbiAgICAgIFwiTm8gcydlbnZpZW4gZGFkZXMgbmkgbWFwZXMgYSBjYXAgc2Vydmlkb3IuXCIsXG4gICAgY29uZmlnVXBsb2FkTWVzc2FnZTpcbiAgICAgICdDYXJyZWdhICoqQ1NWKiosICoqR2VvSnNvbioqIG8gdW4gbWFwYSBkZXNhdCBlbiAqKkpzb24qKi4gTcOpcyBpbmZvcm1hY2nDsyBzb2JyZSBbKipzdXBwb3J0ZWQgZmlsZSBmb3JtYXRzKipdJyxcbiAgICBicm93c2VGaWxlczogJ25hdmVnYSBwZWxzIHRldXMgYXJ4aXVzJyxcbiAgICB1cGxvYWRpbmc6ICdDYXJyZWdhbnQnLFxuICAgIGZpbGVOb3RTdXBwb3J0ZWQ6IFwiTCdhcnhpdSB7ZXJyb3JGaWxlc30gbm8gw6lzIGNvbXBhdGlibGUuXCIsXG4gICAgb3I6ICdvJ1xuICB9LFxuICBkZW5zaXR5OiAnZGVuc2l0YXQnLFxuICAnQnVnIFJlcG9ydCc6IFwiSW5mb3JtZSBkJ2Vycm9yc1wiLFxuICAnVXNlciBHdWlkZSc6IFwiR3VpYSBkJ3VzdWFyaVwiLFxuICBTYXZlOiAnRGVzYScsXG4gIFNoYXJlOiAnQ29tcGFydGVpeCdcbn07XG4iXX0=