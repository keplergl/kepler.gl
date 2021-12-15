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
    weight: 'painotus',
    label: 'nimiö',
    fillColor: 'täyttöväri',
    color: 'väri',
    strokeColor: 'viivan väri',
    radius: 'säde',
    outline: 'ääriviiva',
    stroke: 'viiva',
    density: 'tiheys',
    coverage: 'kattavuus',
    sum: 'summa',
    pointCount: 'pisteiden lukumäärä'
  },
  placeholder: {
    search: 'Etsi',
    selectField: 'Valitse kenttä',
    yAxis: 'Y-akseli',
    selectType: 'Valitse tyyppi',
    selectValue: 'Valitse arvo',
    enterValue: 'Anna arvo',
    empty: 'tyhjä'
  },
  misc: {
    by: '',
    valuesIn: 'Arvot joukossa:',
    valueEquals: 'Arvo on yhtäsuuri kuin',
    dataSource: 'Aineistolähde',
    brushRadius: 'Harjan säde (km)',
    empty: ' '
  },
  mapLayers: {
    title: 'Kartan tasot',
    label: 'Nimiöt',
    road: 'Tiet',
    border: 'Rajat',
    building: 'Rakennukset',
    water: 'Vesi',
    land: 'Maa',
    '3dBuilding': '3d-rakennukset'
  },
  panel: {
    text: {
      label: 'Nimiö',
      labelWithId: 'Nimiö {labelId}',
      fontSize: 'Fontin koko',
      fontColor: 'Fontin väri',
      textAnchor: 'Tekstin ankkuri',
      alignment: 'Sijoittelu',
      addMoreLabel: 'Lisää uusia nimiöitä'
    }
  },
  sidebar: {
    panels: {
      layer: 'Tasot',
      filter: 'Suodattimet',
      interaction: 'Interaktiot',
      basemap: 'Taustakartta'
    }
  },
  layer: {
    required: 'Pakollinen*',
    radius: 'Säde',
    weight: 'Painotus',
    propertyBasedOn: '{property} perustuen arvoon',
    color: 'Väri',
    fillColor: 'Täytön väri',
    outline: 'ääriviiva',
    coverage: 'Kattavuus',
    stroke: 'Viiva',
    strokeWidth: 'Viivan paksuus',
    strokeColor: 'Viivan väri',
    basic: 'Perus',
    trailLength: 'Jäljen pituus',
    trailLengthDescription: 'Jäljen kesto sekunteina, ennenkuin se himmenee näkyvistä',
    newLayer: 'uusi taso',
    elevationByDescription: 'Kun asetus on pois päältä, korkeus perustuu pisteiden määrään',
    colorByDescription: 'Kun asetus on pois päältä, väri perustuu pisteiden määrään',
    aggregateBy: 'Aggregoi kenttä {field} by',
    '3DModel': '3D-malli',
    '3DModelOptions': '3D-mallin asetukset',
    type: {
      point: 'piste',
      arc: 'kaari',
      line: 'viiva',
      grid: 'ruudukko',
      hexbin: 'hexbin',
      polygon: 'polygoni',
      geojson: 'geojson',
      cluster: 'klusteri',
      icon: 'kuva',
      heatmap: 'lämpökartta',
      hexagon: 'kuusikulmio',
      hexagonid: 'H3',
      trip: 'matka',
      s2: 'S2',
      '3d': '3D'
    }
  },
  layerVisConfigs: {
    strokeWidth: 'Viivan paksuus',
    strokeWidthRange: 'Viivan paksuuden rajat',
    radius: 'Säde',
    fixedRadius: 'Vakiosäde metreinä',
    fixedRadiusDescription: 'Kartan säde absoluuttiseksi säteeksi metreinä, esim. 5 -> 5 metriin',
    radiusRange: 'Säteen rajat',
    clusterRadius: 'Klusterien säde pikseleinä',
    radiusRangePixels: 'Säteen rajat pikseleinä',
    opacity: 'Läpinäkyvyys',
    coverage: 'Kattavuus',
    outline: 'Ääriviiva',
    colorRange: 'Värien rajat',
    stroke: 'Viiva',
    strokeColor: 'Viivan väri',
    strokeColorRange: 'Viivan värin rajat',
    targetColor: 'Kohteen väri',
    colorAggregation: 'Värien aggregointi',
    heightAggregation: 'Korkeuden aggregointi',
    resolutionRange: 'Resoluution rajat',
    sizeScale: 'Koon skaala',
    worldUnitSize: 'Yksikkö',
    elevationScale: 'Korottamisen skaala',
    enableElevationZoomFactor: 'Käytä korkeuden zoomauskerrointa',
    enableElevationZoomFactorDescription: 'Säädä korkeus / korkeus nykyisen zoomauskertoimen perusteella',
    enableHeightZoomFactor: 'Käytä korkeuden zoomauskerrointa',
    heightScale: 'Korkeuden skaala',
    coverageRange: 'Peittävyyden rajat',
    highPrecisionRendering: 'Tarkka renderöinti',
    highPrecisionRenderingDescription: 'Tarkka renderöinti johtaa hitaampaan suorittamiseen',
    height: 'Korkeus',
    heightDescription: 'Klikkaa oikeasta ylänurkasta nappia vaihtaaksesi 3D-näkymään',
    fill: 'Täyttö',
    enablePolygonHeight: 'Salli polygonien korkeus',
    showWireframe: 'Näytä rautalankamalli',
    weightIntensity: 'Painotuksen intensiteetti',
    zoomScale: 'Zoomausskaala',
    heightRange: 'Korkeuden rajat',
    heightMultiplier: 'Korkeuskerroin'
  },
  layerManager: {
    addData: 'Lisää aineisto',
    addLayer: 'Lisää taso',
    layerBlending: 'Tasojen sekoittuvuus'
  },
  mapManager: {
    mapStyle: 'Kartan tyyli',
    addMapStyle: 'Lisää tyyli kartalle',
    '3dBuildingColor': '3D-rakennusten väri'
  },
  layerConfiguration: {
    defaultDescription: 'Laske suureen {property} arvo valitun kentän perusteella',
    howTo: 'Miten toimii'
  },
  filterManager: {
    addFilter: 'Lisää suodatin'
  },
  datasetTitle: {
    showDataTable: 'Näytä attribuuttitaulu',
    removeDataset: 'Poista aineisto'
  },
  datasetInfo: {
    rowCount: '{rowCount} riviä'
  },
  tooltip: {
    hideLayer: 'Piilota taso',
    showLayer: 'Näytä taso',
    hideFeature: 'Piilota kohde',
    showFeature: 'Näytä kohde',
    hide: 'piilota',
    show: 'näytä',
    removeLayer: 'Poista taso',
    layerSettings: 'Tason asetukset',
    closePanel: 'Sulje paneeli',
    switchToDualView: 'Vaihda kaksoiskarrtanäkymään',
    showLegend: 'Näytä selite',
    disable3DMap: 'Poistu 3D-näkymästä',
    DrawOnMap: 'Piirrä kartalle',
    selectLocale: 'Valitse kielisyys',
    hideLayerPanel: 'Piilota tasopaneeli',
    showLayerPanel: 'Näytä tasopaneeli',
    moveToTop: 'Siirrä tasojen päällimmäiseksi',
    selectBaseMapStyle: 'Valitse taustakarttatyyli',
    "delete": 'Poista',
    timePlayback: 'Ajan animointi',
    cloudStorage: 'Pilvitallennus',
    '3DMap': '3D-näkymä'
  },
  toolbar: _objectSpread({
    exportImage: 'Vie kuva',
    exportData: 'Vie aineistot',
    exportMap: 'Vie kartta',
    shareMapURL: 'Jaa kartan URL',
    saveMap: 'Tallenna kartta',
    select: 'valitse',
    polygon: 'polygoni',
    rectangle: 'nelikulmio',
    hide: 'piilota',
    show: 'näytä'
  }, _locales.LOCALES),
  modal: {
    title: {
      deleteDataset: 'Poista aineisto',
      addDataToMap: 'Lisää aineistoja kartalle',
      exportImage: 'Vie kuva',
      exportData: 'Vie aineistot',
      exportMap: 'Vie kartta',
      addCustomMapboxStyle: 'Lisää oma Mapbox-tyyli',
      saveMap: 'Tallenna kartta',
      shareURL: 'Jaa URL'
    },
    button: {
      "delete": 'Poista',
      download: 'Lataa',
      "export": 'Vie',
      addStyle: 'Lisää tyyli',
      save: 'Tallenna',
      defaultCancel: 'Peru',
      defaultConfirm: 'Vahvista'
    },
    exportImage: {
      ratioTitle: 'Kuvasuhde',
      ratioDescription: 'Valitse sopiva kuvasuhde käyttötapaustasi varten.',
      ratioOriginalScreen: 'Alkuperäinen näyttö',
      ratioCustom: 'Kustomoitu',
      ratio4_3: '4:3',
      ratio16_9: '16:9',
      resolutionTitle: 'Resoluutio',
      resolutionDescription: 'Korkea resoluutio on parempi tulostamista varten.',
      mapLegendTitle: 'Kartan selite',
      mapLegendAdd: 'Lisää selite karttaan'
    },
    exportData: {
      datasetTitle: 'Aineistot',
      datasetSubtitle: 'Valitse aineisto, jonka aiot viedä',
      allDatasets: 'Kaikki',
      dataTypeTitle: 'Aineistojen formaatti',
      dataTypeSubtitle: 'Valitse aineistoformaatti valitsemillesi aineistoille',
      filterDataTitle: 'Suodata aineistoja',
      filterDataSubtitle: 'Voit viedä joko alkuperäiset aineistot tai suodatetut aineistot',
      filteredData: 'Suodatetut aineistot',
      unfilteredData: 'Suodattamattomat aineistot',
      fileCount: '{fileCount} tiedostoa',
      rowCount: '{rowCount} riviä'
    },
    deleteData: {
      warning: 'aiot poistaa tämän aineiston. Aineostoa käyttävien tasojen lukumäärä: {length}'
    },
    addStyle: {
      publishTitle: '1. Julkaise tyylisi Mapboxissa tai anna tunniste',
      publishSubtitle1: 'Voit luoda oman karttatyylisi sivulla',
      publishSubtitle2: 'ja',
      publishSubtitle3: 'julkaista',
      publishSubtitle4: 'sen.',
      publishSubtitle5: 'Käyttääksesi yksityistä tyyliä, liitä',
      publishSubtitle6: 'tunnisteesi',
      publishSubtitle7: 'tänne. *kepler.gl on client-side sovellus, data pysyy vain selaimessasi...',
      exampleToken: 'esim. pk.abcdefg.xxxxxx',
      pasteTitle: '2. Liitä tyyli-URL',
      pasteSubtitle1: 'Mikä on',
      pasteSubtitle2: 'tyyli-URL?',
      namingTitle: '3. Nimeä tyylisi'
    },
    shareMap: {
      shareUriTitle: 'Jaa kartan URL',
      shareUriSubtitle: 'Luo kartalle URL, jonka voit jakaa muiden kanssa',
      cloudTitle: 'Pilvitallennus',
      cloudSubtitle: 'Kirjaudu sisään ja lataa kartta ja aineistot henkilökohtaiseen pilvipalveluun',
      shareDisclaimer: 'kepler.gl tallentaa kartan datan henkilökohtaiseen pilvitallennustilaasi, vain ihmiset, joilla on URL, voivat päästä käsiksi karttaan ja aineistoihin. ' + 'Voit muokata tiedostoja tai poistaa ne pilvipalvelustasi milloin vain.',
      gotoPage: 'Mene Kepler.gl {currentProvider} sivullesi'
    },
    statusPanel: {
      mapUploading: 'Karttaa ladataan',
      error: 'Virhe'
    },
    saveMap: {
      title: 'Pilvitallennus',
      subtitle: 'Kirjaudu sisään pilvipalveluusi tallentaaksesi kartan'
    },
    exportMap: {
      formatTitle: 'Kartan formaatti',
      formatSubtitle: 'Valitse formaatti, jossa viet kartan',
      html: {
        selection: 'Vie kartta interaktiivisena html-tiedostona',
        tokenTitle: 'Mapbox-tunniste',
        tokenSubtitle: 'Käytä omaa Mapbox-tunnistettasi html-tiedostossa (valinnainen)',
        tokenPlaceholder: 'Liitä Mapbox-tunnisteesi',
        tokenMisuseWarning: '* Jos et käytä omaa tunnistettasi, kartta voi lakata toimimasta milloin vain kun vaihdamme omaa tunnistettamme väärinkäytön estämiseksi. ',
        tokenDisclaimer: 'Voit vaihtaa Mapbox-tunnisteesi näiden ohjeiden avulla: ',
        tokenUpdate: 'Kuinka vaihtaa olemassaoleva Mapbox-tunniste',
        modeTitle: 'Kartan tila',
        modeSubtitle1: 'Valitse kartan tila.',
        modeSubtitle2: 'Lisätietoja',
        modeDescription: 'Anna käyttäjien {mode} karttaa',
        read: 'lukea',
        edit: 'muokata'
      },
      json: {
        configTitle: 'Kartan asetukset',
        configDisclaimer: 'Kartan asetukset sisältyvät Json-tiedostoon. Jos käytät kirjastoa kepler.gl omassa sovelluksessasi. Voit kopioida asetukset ja antaa ne funktiolle: ',
        selection: 'Vie kyseisen kartan aineistot ja asetukset yhdessä json-tiedostossa. Voit myöhemmin avata saman kartan lataamalla tiedoston kepler.gl:n',
        disclaimer: '* Kartan asetukset ovat sidoksissa ladattuihin aineistoihin. Arvoa ‘dataId’ käytetään tasojen, suodattimien ja vihjeiden liittämiseksi tiettyyn aineistoon. ' + 'Varmista, että aineiston dataId:t vastaavat asetusten arvoja jos lataat asetukset käyttäen `addDataToMap`-funktiolle.'
      }
    },
    loadingDialog: {
      loading: 'Ladataan...'
    },
    loadData: {
      upload: 'Lataa tiedostot',
      storage: 'Lataa tallennustilasta'
    },
    tripInfo: {
      title: 'Kuinka käyttää matka-animaatiota',
      description1: 'Reitin animoimiseksi geoJSON-aineiston täytyy olla geometriatyypiltään `LineString`, LineString-koordinaattien täytyy sisältää 4 elementtiä formaatissa:',
      code: ' [pituusaste, leveysaste, korkeus, aikaleima] ',
      description2: 'siten, että viimeinen elementti on aikaleima. Aikaleima voi olla muodoltaan unix-sekunteja, kuten `1564184363` tai millisekunteja, kuten `1564184363000`.',
      example: 'Esimerkki:'
    },
    iconInfo: {
      title: 'Miten piirtää kuvia',
      description1: 'csv-tiedostossasi, luo sarake nimeltä icon. Voit jättää sen tyhjäksi jos et halua piirtää kuvaa joillain pisteillä. Kun sarakkeen nimi on ',
      code: 'icon',
      description2: ' kepler.gl luo automaattisesti kuvatason sinua varten.',
      example: 'Esimerkki:',
      icons: 'Kuvat'
    },
    storageMapViewer: {
      lastModified: 'Viimeksi muokattu {lastUpdated} sitten',
      back: 'Takaisin'
    },
    overwriteMap: {
      title: 'Tallennetaan karttaa...',
      alreadyExists: 'on jo {mapSaved}:ssa. Haluatko ylikirjoittaa sen?'
    },
    loadStorageMap: {
      back: 'Takaisin',
      goToPage: 'Mene Kepler.gl {displayName} sivullesi',
      storageMaps: 'Tallennus / Kartat',
      noSavedMaps: 'Ei tallennettuja karttoja vielä'
    }
  },
  header: {
    visibleLayers: 'Näkyvissä olevat tasot',
    layerLegend: 'Tason selite'
  },
  interactions: {
    tooltip: 'Vihje',
    brush: 'Harja',
    coordinate: 'Koordinaatit'
  },
  layerBlending: {
    title: 'Tasojen sekoittuvuus',
    additive: 'lisäävä',
    normal: 'normaali',
    subtractive: 'vähentävä'
  },
  columns: {
    title: 'Sarakkeet',
    lat: 'lat',
    lng: 'lng',
    altitude: 'korkeus',
    icon: 'kuva',
    geojson: 'geojson',
    arc: {
      lat0: 'lähdön lat',
      lng0: 'lähdön lng',
      lat1: 'kohteen lat',
      lng1: 'kohteen lng'
    },
    line: {
      alt0: 'lähteen korkeus',
      alt1: 'kohde korkeus'
    },
    grid: {
      worldUnitSize: 'Ruutujen koko (km)'
    },
    hexagon: {
      worldUnitSize: 'Hexagonien säde (km)'
    }
  },
  color: {
    customPalette: 'Mukautettu paletti',
    steps: 'askeleet',
    type: 'tyyppi',
    reversed: 'käänteinen'
  },
  scale: {
    colorScale: 'Värin skaala',
    sizeScale: 'Koon skaala',
    strokeScale: 'Viivan paksuuden skaala',
    scale: 'Skaala'
  },
  fileUploader: {
    message: 'Raahaa ja pudota tiedostosi tänne',
    chromeMessage: '*Chromen käyttäjä: Rajoita tiedostokokosi 250Mb:hen. Jos haluat suurempia tiedostoja, kokeile Safaria',
    disclaimer: '*kepler.gl on client-side sovellus, data pysyy vain selaimessasi...' + 'Tietoja ei lähetetä palvelimelle.',
    configUploadMessage: 'Lisää {fileFormatNames} tai tallennettu kartta **Json**. Lue lisää [**tuetuista formaateista**]',
    browseFiles: 'selaa tiedostojasi',
    uploading: 'ladataan',
    fileNotSupported: 'Tiedosto {errorFiles} ei ole tuettu.',
    or: 'tai'
  },
  density: 'tiheys',
  'Bug Report': 'Bugiraportointi',
  'User Guide': 'Opas',
  Save: 'Tallenna',
  Share: 'Jaa'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vZmkuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwic3Ryb2tlQ29sb3IiLCJyYWRpdXMiLCJvdXRsaW5lIiwic3Ryb2tlIiwiZGVuc2l0eSIsImNvdmVyYWdlIiwic3VtIiwicG9pbnRDb3VudCIsInBsYWNlaG9sZGVyIiwic2VhcmNoIiwic2VsZWN0RmllbGQiLCJ5QXhpcyIsInNlbGVjdFR5cGUiLCJzZWxlY3RWYWx1ZSIsImVudGVyVmFsdWUiLCJlbXB0eSIsIm1pc2MiLCJieSIsInZhbHVlc0luIiwidmFsdWVFcXVhbHMiLCJkYXRhU291cmNlIiwiYnJ1c2hSYWRpdXMiLCJtYXBMYXllcnMiLCJ0aXRsZSIsInJvYWQiLCJib3JkZXIiLCJidWlsZGluZyIsIndhdGVyIiwibGFuZCIsInBhbmVsIiwidGV4dCIsImxhYmVsV2l0aElkIiwiZm9udFNpemUiLCJmb250Q29sb3IiLCJ0ZXh0QW5jaG9yIiwiYWxpZ25tZW50IiwiYWRkTW9yZUxhYmVsIiwic2lkZWJhciIsInBhbmVscyIsImxheWVyIiwiZmlsdGVyIiwiaW50ZXJhY3Rpb24iLCJiYXNlbWFwIiwicmVxdWlyZWQiLCJwcm9wZXJ0eUJhc2VkT24iLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsInN0cm9rZVdpZHRoUmFuZ2UiLCJmaXhlZFJhZGl1cyIsImZpeGVkUmFkaXVzRGVzY3JpcHRpb24iLCJyYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXMiLCJyYWRpdXNSYW5nZVBpeGVscyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwic3Ryb2tlQ29sb3JSYW5nZSIsInRhcmdldENvbG9yIiwiY29sb3JBZ2dyZWdhdGlvbiIsImhlaWdodEFnZ3JlZ2F0aW9uIiwicmVzb2x1dGlvblJhbmdlIiwic2l6ZVNjYWxlIiwid29ybGRVbml0U2l6ZSIsImVsZXZhdGlvblNjYWxlIiwiZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvciIsImVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3JEZXNjcmlwdGlvbiIsImVuYWJsZUhlaWdodFpvb21GYWN0b3IiLCJoZWlnaHRTY2FsZSIsImNvdmVyYWdlUmFuZ2UiLCJoaWdoUHJlY2lzaW9uUmVuZGVyaW5nIiwiaGlnaFByZWNpc2lvblJlbmRlcmluZ0Rlc2NyaXB0aW9uIiwiaGVpZ2h0IiwiaGVpZ2h0RGVzY3JpcHRpb24iLCJmaWxsIiwiZW5hYmxlUG9seWdvbkhlaWdodCIsInNob3dXaXJlZnJhbWUiLCJ3ZWlnaHRJbnRlbnNpdHkiLCJ6b29tU2NhbGUiLCJoZWlnaHRSYW5nZSIsImhlaWdodE11bHRpcGxpZXIiLCJsYXllck1hbmFnZXIiLCJhZGREYXRhIiwiYWRkTGF5ZXIiLCJsYXllckJsZW5kaW5nIiwibWFwTWFuYWdlciIsIm1hcFN0eWxlIiwiYWRkTWFwU3R5bGUiLCJsYXllckNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJob3dUbyIsImZpbHRlck1hbmFnZXIiLCJhZGRGaWx0ZXIiLCJkYXRhc2V0VGl0bGUiLCJzaG93RGF0YVRhYmxlIiwicmVtb3ZlRGF0YXNldCIsImRhdGFzZXRJbmZvIiwicm93Q291bnQiLCJ0b29sdGlwIiwiaGlkZUxheWVyIiwic2hvd0xheWVyIiwiaGlkZUZlYXR1cmUiLCJzaG93RmVhdHVyZSIsImhpZGUiLCJzaG93IiwicmVtb3ZlTGF5ZXIiLCJsYXllclNldHRpbmdzIiwiY2xvc2VQYW5lbCIsInN3aXRjaFRvRHVhbFZpZXciLCJzaG93TGVnZW5kIiwiZGlzYWJsZTNETWFwIiwiRHJhd09uTWFwIiwic2VsZWN0TG9jYWxlIiwiaGlkZUxheWVyUGFuZWwiLCJzaG93TGF5ZXJQYW5lbCIsIm1vdmVUb1RvcCIsInNlbGVjdEJhc2VNYXBTdHlsZSIsInRpbWVQbGF5YmFjayIsImNsb3VkU3RvcmFnZSIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwibW9kYWwiLCJkZWxldGVEYXRhc2V0IiwiYWRkRGF0YVRvTWFwIiwiYWRkQ3VzdG9tTWFwYm94U3R5bGUiLCJzaGFyZVVSTCIsImJ1dHRvbiIsImRvd25sb2FkIiwiYWRkU3R5bGUiLCJzYXZlIiwiZGVmYXVsdENhbmNlbCIsImRlZmF1bHRDb25maXJtIiwicmF0aW9UaXRsZSIsInJhdGlvRGVzY3JpcHRpb24iLCJyYXRpb09yaWdpbmFsU2NyZWVuIiwicmF0aW9DdXN0b20iLCJyYXRpbzRfMyIsInJhdGlvMTZfOSIsInJlc29sdXRpb25UaXRsZSIsInJlc29sdXRpb25EZXNjcmlwdGlvbiIsIm1hcExlZ2VuZFRpdGxlIiwibWFwTGVnZW5kQWRkIiwiZGF0YXNldFN1YnRpdGxlIiwiYWxsRGF0YXNldHMiLCJkYXRhVHlwZVRpdGxlIiwiZGF0YVR5cGVTdWJ0aXRsZSIsImZpbHRlckRhdGFUaXRsZSIsImZpbHRlckRhdGFTdWJ0aXRsZSIsImZpbHRlcmVkRGF0YSIsInVuZmlsdGVyZWREYXRhIiwiZmlsZUNvdW50IiwiZGVsZXRlRGF0YSIsIndhcm5pbmciLCJwdWJsaXNoVGl0bGUiLCJwdWJsaXNoU3VidGl0bGUxIiwicHVibGlzaFN1YnRpdGxlMiIsInB1Ymxpc2hTdWJ0aXRsZTMiLCJwdWJsaXNoU3VidGl0bGU0IiwicHVibGlzaFN1YnRpdGxlNSIsInB1Ymxpc2hTdWJ0aXRsZTYiLCJwdWJsaXNoU3VidGl0bGU3IiwiZXhhbXBsZVRva2VuIiwicGFzdGVUaXRsZSIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJuYW1pbmdUaXRsZSIsInNoYXJlTWFwIiwic2hhcmVVcmlUaXRsZSIsInNoYXJlVXJpU3VidGl0bGUiLCJjbG91ZFRpdGxlIiwiY2xvdWRTdWJ0aXRsZSIsInNoYXJlRGlzY2xhaW1lciIsImdvdG9QYWdlIiwic3RhdHVzUGFuZWwiLCJtYXBVcGxvYWRpbmciLCJlcnJvciIsInN1YnRpdGxlIiwiZm9ybWF0VGl0bGUiLCJmb3JtYXRTdWJ0aXRsZSIsImh0bWwiLCJzZWxlY3Rpb24iLCJ0b2tlblRpdGxlIiwidG9rZW5TdWJ0aXRsZSIsInRva2VuUGxhY2Vob2xkZXIiLCJ0b2tlbk1pc3VzZVdhcm5pbmciLCJ0b2tlbkRpc2NsYWltZXIiLCJ0b2tlblVwZGF0ZSIsIm1vZGVUaXRsZSIsIm1vZGVTdWJ0aXRsZTEiLCJtb2RlU3VidGl0bGUyIiwibW9kZURlc2NyaXB0aW9uIiwicmVhZCIsImVkaXQiLCJqc29uIiwiY29uZmlnVGl0bGUiLCJjb25maWdEaXNjbGFpbWVyIiwiZGlzY2xhaW1lciIsImxvYWRpbmdEaWFsb2ciLCJsb2FkaW5nIiwibG9hZERhdGEiLCJ1cGxvYWQiLCJzdG9yYWdlIiwidHJpcEluZm8iLCJkZXNjcmlwdGlvbjEiLCJjb2RlIiwiZGVzY3JpcHRpb24yIiwiZXhhbXBsZSIsImljb25JbmZvIiwiaWNvbnMiLCJzdG9yYWdlTWFwVmlld2VyIiwibGFzdE1vZGlmaWVkIiwiYmFjayIsIm92ZXJ3cml0ZU1hcCIsImFscmVhZHlFeGlzdHMiLCJsb2FkU3RvcmFnZU1hcCIsImdvVG9QYWdlIiwic3RvcmFnZU1hcHMiLCJub1NhdmVkTWFwcyIsImhlYWRlciIsInZpc2libGVMYXllcnMiLCJsYXllckxlZ2VuZCIsImludGVyYWN0aW9ucyIsImJydXNoIiwiY29vcmRpbmF0ZSIsImFkZGl0aXZlIiwibm9ybWFsIiwic3VidHJhY3RpdmUiLCJjb2x1bW5zIiwibGF0IiwibG5nIiwiYWx0aXR1ZGUiLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiYWx0MCIsImFsdDEiLCJjdXN0b21QYWxldHRlIiwic3RlcHMiLCJyZXZlcnNlZCIsInNjYWxlIiwiY29sb3JTY2FsZSIsInN0cm9rZVNjYWxlIiwiZmlsZVVwbG9hZGVyIiwibWVzc2FnZSIsImNocm9tZU1lc3NhZ2UiLCJjb25maWdVcGxvYWRNZXNzYWdlIiwiYnJvd3NlRmlsZXMiLCJ1cGxvYWRpbmciLCJmaWxlTm90U3VwcG9ydGVkIiwib3IiLCJTYXZlIiwiU2hhcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7ZUFFZTtBQUNiQSxFQUFBQSxRQUFRLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFLFVBREE7QUFFUkMsSUFBQUEsS0FBSyxFQUFFLE9BRkM7QUFHUkMsSUFBQUEsU0FBUyxFQUFFLFlBSEg7QUFJUkMsSUFBQUEsS0FBSyxFQUFFLE1BSkM7QUFLUkMsSUFBQUEsV0FBVyxFQUFFLGFBTEw7QUFNUkMsSUFBQUEsTUFBTSxFQUFFLE1BTkE7QUFPUkMsSUFBQUEsT0FBTyxFQUFFLFdBUEQ7QUFRUkMsSUFBQUEsTUFBTSxFQUFFLE9BUkE7QUFTUkMsSUFBQUEsT0FBTyxFQUFFLFFBVEQ7QUFVUkMsSUFBQUEsUUFBUSxFQUFFLFdBVkY7QUFXUkMsSUFBQUEsR0FBRyxFQUFFLE9BWEc7QUFZUkMsSUFBQUEsVUFBVSxFQUFFO0FBWkosR0FERztBQWViQyxFQUFBQSxXQUFXLEVBQUU7QUFDWEMsSUFBQUEsTUFBTSxFQUFFLE1BREc7QUFFWEMsSUFBQUEsV0FBVyxFQUFFLGdCQUZGO0FBR1hDLElBQUFBLEtBQUssRUFBRSxVQUhJO0FBSVhDLElBQUFBLFVBQVUsRUFBRSxnQkFKRDtBQUtYQyxJQUFBQSxXQUFXLEVBQUUsY0FMRjtBQU1YQyxJQUFBQSxVQUFVLEVBQUUsV0FORDtBQU9YQyxJQUFBQSxLQUFLLEVBQUU7QUFQSSxHQWZBO0FBd0JiQyxFQUFBQSxJQUFJLEVB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QUU7QUFDWkMsSUFBQUEsT0FBTyxFQUFFLG1DQURHO0FBRVpDLElBQUFBLGFBQWEsRUFDWCx1R0FIVTtBQUlaakQsSUFBQUEsVUFBVSxFQUNSLHdFQUNBLG1DQU5VO0FBT1prRCxJQUFBQSxtQkFBbUIsRUFDakIsaUdBUlU7QUFTWkMsSUFBQUEsV0FBVyxFQUFFLG9CQVREO0FBVVpDLElBQUFBLFNBQVMsRUFBRSxVQVZDO0FBV1pDLElBQUFBLGdCQUFnQixFQUFFLHNDQVhOO0FBWVpDLElBQUFBLEVBQUUsRUFBRTtBQVpRLEdBdFpEO0FBb2FialIsRUFBQUEsT0FBTyxFQUFFLFFBcGFJO0FBcWFiLGdCQUFjLGlCQXJhRDtBQXNhYixnQkFBYyxNQXRhRDtBQXVhYmtSLEVBQUFBLElBQUksRUFBRSxVQXZhTztBQXdhYkMsRUFBQUEsS0FBSyxFQUFFO0FBeGFNLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0xPQ0FMRVN9IGZyb20gJy4vbG9jYWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcGVydHk6IHtcbiAgICB3ZWlnaHQ6ICdwYWlub3R1cycsXG4gICAgbGFiZWw6ICduaW1pw7YnLFxuICAgIGZpbGxDb2xvcjogJ3TDpHl0dMO2dsOkcmknLFxuICAgIGNvbG9yOiAndsOkcmknLFxuICAgIHN0cm9rZUNvbG9yOiAndmlpdmFuIHbDpHJpJyxcbiAgICByYWRpdXM6ICdzw6RkZScsXG4gICAgb3V0bGluZTogJ8Okw6RyaXZpaXZhJyxcbiAgICBzdHJva2U6ICd2aWl2YScsXG4gICAgZGVuc2l0eTogJ3RpaGV5cycsXG4gICAgY292ZXJhZ2U6ICdrYXR0YXZ1dXMnLFxuICAgIHN1bTogJ3N1bW1hJyxcbiAgICBwb2ludENvdW50OiAncGlzdGVpZGVuIGx1a3Vtw6TDpHLDpCdcbiAgfSxcbiAgcGxhY2Vob2xkZXI6IHtcbiAgICBzZWFyY2g6ICdFdHNpJyxcbiAgICBzZWxlY3RGaWVsZDogJ1ZhbGl0c2Uga2VudHTDpCcsXG4gICAgeUF4aXM6ICdZLWFrc2VsaScsXG4gICAgc2VsZWN0VHlwZTogJ1ZhbGl0c2UgdHl5cHBpJyxcbiAgICBzZWxlY3RWYWx1ZTogJ1ZhbGl0c2UgYXJ2bycsXG4gICAgZW50ZXJWYWx1ZTogJ0FubmEgYXJ2bycsXG4gICAgZW1wdHk6ICd0eWhqw6QnXG4gIH0sXG4gIG1pc2M6IHtcbiAgICBieTogJycsXG4gICAgdmFsdWVzSW46ICdBcnZvdCBqb3Vrb3NzYTonLFxuICAgIHZhbHVlRXF1YWxzOiAnQXJ2byBvbiB5aHTDpHN1dXJpIGt1aW4nLFxuICAgIGRhdGFTb3VyY2U6ICdBaW5laXN0b2zDpGhkZScsXG4gICAgYnJ1c2hSYWRpdXM6ICdIYXJqYW4gc8OkZGUgKGttKScsXG4gICAgZW1wdHk6ICcgJ1xuICB9LFxuICBtYXBMYXllcnM6IHtcbiAgICB0aXRsZTogJ0thcnRhbiB0YXNvdCcsXG4gICAgbGFiZWw6ICdOaW1pw7Z0JyxcbiAgICByb2FkOiAnVGlldCcsXG4gICAgYm9yZGVyOiAnUmFqYXQnLFxuICAgIGJ1aWxkaW5nOiAnUmFrZW5udWtzZXQnLFxuICAgIHdhdGVyOiAnVmVzaScsXG4gICAgbGFuZDogJ01hYScsXG4gICAgJzNkQnVpbGRpbmcnOiAnM2QtcmFrZW5udWtzZXQnXG4gIH0sXG4gIHBhbmVsOiB7XG4gICAgdGV4dDoge1xuICAgICAgbGFiZWw6ICdOaW1pw7YnLFxuICAgICAgbGFiZWxXaXRoSWQ6ICdOaW1pw7Yge2xhYmVsSWR9JyxcbiAgICAgIGZvbnRTaXplOiAnRm9udGluIGtva28nLFxuICAgICAgZm9udENvbG9yOiAnRm9udGluIHbDpHJpJyxcbiAgICAgIHRleHRBbmNob3I6ICdUZWtzdGluIGFua2t1cmknLFxuICAgICAgYWxpZ25tZW50OiAnU2lqb2l0dGVsdScsXG4gICAgICBhZGRNb3JlTGFiZWw6ICdMaXPDpMOkIHV1c2lhIG5pbWnDtml0w6QnXG4gICAgfVxuICB9LFxuICBzaWRlYmFyOiB7XG4gICAgcGFuZWxzOiB7XG4gICAgICBsYXllcjogJ1Rhc290JyxcbiAgICAgIGZpbHRlcjogJ1N1b2RhdHRpbWV0JyxcbiAgICAgIGludGVyYWN0aW9uOiAnSW50ZXJha3Rpb3QnLFxuICAgICAgYmFzZW1hcDogJ1RhdXN0YWthcnR0YSdcbiAgICB9XG4gIH0sXG4gIGxheWVyOiB7XG4gICAgcmVxdWlyZWQ6ICdQYWtvbGxpbmVuKicsXG4gICAgcmFkaXVzOiAnU8OkZGUnLFxuICAgIHdlaWdodDogJ1BhaW5vdHVzJyxcbiAgICBwcm9wZXJ0eUJhc2VkT246ICd7cHJvcGVydHl9IHBlcnVzdHVlbiBhcnZvb24nLFxuICAgIGNvbG9yOiAnVsOkcmknLFxuICAgIGZpbGxDb2xvcjogJ1TDpHl0w7ZuIHbDpHJpJyxcbiAgICBvdXRsaW5lOiAnw6TDpHJpdmlpdmEnLFxuICAgIGNvdmVyYWdlOiAnS2F0dGF2dXVzJyxcbiAgICBzdHJva2U6ICdWaWl2YScsXG4gICAgc3Ryb2tlV2lkdGg6ICdWaWl2YW4gcGFrc3V1cycsXG4gICAgc3Ryb2tlQ29sb3I6ICdWaWl2YW4gdsOkcmknLFxuICAgIGJhc2ljOiAnUGVydXMnLFxuICAgIHRyYWlsTGVuZ3RoOiAnSsOkbGplbiBwaXR1dXMnLFxuICAgIHRyYWlsTGVuZ3RoRGVzY3JpcHRpb246ICdKw6RsamVuIGtlc3RvIHNla3VudGVpbmEsIGVubmVua3VpbiBzZSBoaW1tZW5lZSBuw6RreXZpc3TDpCcsXG4gICAgbmV3TGF5ZXI6ICd1dXNpIHRhc28nLFxuICAgIGVsZXZhdGlvbkJ5RGVzY3JpcHRpb246ICdLdW4gYXNldHVzIG9uIHBvaXMgcMOkw6RsdMOkLCBrb3JrZXVzIHBlcnVzdHV1IHBpc3RlaWRlbiBtw6TDpHLDpMOkbicsXG4gICAgY29sb3JCeURlc2NyaXB0aW9uOiAnS3VuIGFzZXR1cyBvbiBwb2lzIHDDpMOkbHTDpCwgdsOkcmkgcGVydXN0dXUgcGlzdGVpZGVuIG3DpMOkcsOkw6RuJyxcbiAgICBhZ2dyZWdhdGVCeTogJ0FnZ3JlZ29pIGtlbnR0w6Qge2ZpZWxkfSBieScsXG4gICAgJzNETW9kZWwnOiAnM0QtbWFsbGknLFxuICAgICczRE1vZGVsT3B0aW9ucyc6ICczRC1tYWxsaW4gYXNldHVrc2V0JyxcbiAgICB0eXBlOiB7XG4gICAgICBwb2ludDogJ3Bpc3RlJyxcbiAgICAgIGFyYzogJ2thYXJpJyxcbiAgICAgIGxpbmU6ICd2aWl2YScsXG4gICAgICBncmlkOiAncnV1ZHVra28nLFxuICAgICAgaGV4YmluOiAnaGV4YmluJyxcbiAgICAgIHBvbHlnb246ICdwb2x5Z29uaScsXG4gICAgICBnZW9qc29uOiAnZ2VvanNvbicsXG4gICAgICBjbHVzdGVyOiAna2x1c3RlcmknLFxuICAgICAgaWNvbjogJ2t1dmEnLFxuICAgICAgaGVhdG1hcDogJ2zDpG1ww7ZrYXJ0dGEnLFxuICAgICAgaGV4YWdvbjogJ2t1dXNpa3VsbWlvJyxcbiAgICAgIGhleGFnb25pZDogJ0gzJyxcbiAgICAgIHRyaXA6ICdtYXRrYScsXG4gICAgICBzMjogJ1MyJyxcbiAgICAgICczZCc6ICczRCdcbiAgICB9XG4gIH0sXG4gIGxheWVyVmlzQ29uZmlnczoge1xuICAgIHN0cm9rZVdpZHRoOiAnVmlpdmFuIHBha3N1dXMnLFxuICAgIHN0cm9rZVdpZHRoUmFuZ2U6ICdWaWl2YW4gcGFrc3V1ZGVuIHJhamF0JyxcbiAgICByYWRpdXM6ICdTw6RkZScsXG4gICAgZml4ZWRSYWRpdXM6ICdWYWtpb3PDpGRlIG1ldHJlaW7DpCcsXG4gICAgZml4ZWRSYWRpdXNEZXNjcmlwdGlvbjogJ0thcnRhbiBzw6RkZSBhYnNvbHV1dHRpc2Vrc2kgc8OkdGVla3NpIG1ldHJlaW7DpCwgZXNpbS4gNSAtPiA1IG1ldHJpaW4nLFxuICAgIHJhZGl1c1JhbmdlOiAnU8OkdGVlbiByYWphdCcsXG4gICAgY2x1c3RlclJhZGl1czogJ0tsdXN0ZXJpZW4gc8OkZGUgcGlrc2VsZWluw6QnLFxuICAgIHJhZGl1c1JhbmdlUGl4ZWxzOiAnU8OkdGVlbiByYWphdCBwaWtzZWxlaW7DpCcsXG4gICAgb3BhY2l0eTogJ0zDpHBpbsOka3l2eXlzJyxcbiAgICBjb3ZlcmFnZTogJ0thdHRhdnV1cycsXG4gICAgb3V0bGluZTogJ8OEw6RyaXZpaXZhJyxcbiAgICBjb2xvclJhbmdlOiAnVsOkcmllbiByYWphdCcsXG4gICAgc3Ryb2tlOiAnVmlpdmEnLFxuICAgIHN0cm9rZUNvbG9yOiAnVmlpdmFuIHbDpHJpJyxcbiAgICBzdHJva2VDb2xvclJhbmdlOiAnVmlpdmFuIHbDpHJpbiByYWphdCcsXG4gICAgdGFyZ2V0Q29sb3I6ICdLb2h0ZWVuIHbDpHJpJyxcbiAgICBjb2xvckFnZ3JlZ2F0aW9uOiAnVsOkcmllbiBhZ2dyZWdvaW50aScsXG4gICAgaGVpZ2h0QWdncmVnYXRpb246ICdLb3JrZXVkZW4gYWdncmVnb2ludGknLFxuICAgIHJlc29sdXRpb25SYW5nZTogJ1Jlc29sdXV0aW9uIHJhamF0JyxcbiAgICBzaXplU2NhbGU6ICdLb29uIHNrYWFsYScsXG4gICAgd29ybGRVbml0U2l6ZTogJ1lrc2lra8O2JyxcbiAgICBlbGV2YXRpb25TY2FsZTogJ0tvcm90dGFtaXNlbiBza2FhbGEnLFxuICAgIGVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3I6ICdLw6R5dMOkIGtvcmtldWRlbiB6b29tYXVza2Vycm9pbnRhJyxcbiAgICBlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yRGVzY3JpcHRpb246XG4gICAgICAnU8Okw6Rkw6Qga29ya2V1cyAvIGtvcmtldXMgbnlreWlzZW4gem9vbWF1c2tlcnRvaW1lbiBwZXJ1c3RlZWxsYScsXG4gICAgZW5hYmxlSGVpZ2h0Wm9vbUZhY3RvcjogJ0vDpHl0w6Qga29ya2V1ZGVuIHpvb21hdXNrZXJyb2ludGEnLFxuICAgIGhlaWdodFNjYWxlOiAnS29ya2V1ZGVuIHNrYWFsYScsXG4gICAgY292ZXJhZ2VSYW5nZTogJ1BlaXR0w6R2eXlkZW4gcmFqYXQnLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmc6ICdUYXJra2EgcmVuZGVyw7ZpbnRpJyxcbiAgICBoaWdoUHJlY2lzaW9uUmVuZGVyaW5nRGVzY3JpcHRpb246ICdUYXJra2EgcmVuZGVyw7ZpbnRpIGpvaHRhYSBoaXRhYW1wYWFuIHN1b3JpdHRhbWlzZWVuJyxcbiAgICBoZWlnaHQ6ICdLb3JrZXVzJyxcbiAgICBoZWlnaHREZXNjcmlwdGlvbjogJ0tsaWtrYWEgb2lrZWFzdGEgeWzDpG51cmthc3RhIG5hcHBpYSB2YWlodGFha3Nlc2kgM0QtbsOka3ltw6TDpG4nLFxuICAgIGZpbGw6ICdUw6R5dHTDticsXG4gICAgZW5hYmxlUG9seWdvbkhlaWdodDogJ1NhbGxpIHBvbHlnb25pZW4ga29ya2V1cycsXG4gICAgc2hvd1dpcmVmcmFtZTogJ07DpHl0w6QgcmF1dGFsYW5rYW1hbGxpJyxcbiAgICB3ZWlnaHRJbnRlbnNpdHk6ICdQYWlub3R1a3NlbiBpbnRlbnNpdGVldHRpJyxcbiAgICB6b29tU2NhbGU6ICdab29tYXVzc2thYWxhJyxcbiAgICBoZWlnaHRSYW5nZTogJ0tvcmtldWRlbiByYWphdCcsXG4gICAgaGVpZ2h0TXVsdGlwbGllcjogJ0tvcmtldXNrZXJyb2luJ1xuICB9LFxuICBsYXllck1hbmFnZXI6IHtcbiAgICBhZGREYXRhOiAnTGlzw6TDpCBhaW5laXN0bycsXG4gICAgYWRkTGF5ZXI6ICdMaXPDpMOkIHRhc28nLFxuICAgIGxheWVyQmxlbmRpbmc6ICdUYXNvamVuIHNla29pdHR1dnV1cydcbiAgfSxcbiAgbWFwTWFuYWdlcjoge1xuICAgIG1hcFN0eWxlOiAnS2FydGFuIHR5eWxpJyxcbiAgICBhZGRNYXBTdHlsZTogJ0xpc8Okw6QgdHl5bGkga2FydGFsbGUnLFxuICAgICczZEJ1aWxkaW5nQ29sb3InOiAnM0QtcmFrZW5udXN0ZW4gdsOkcmknXG4gIH0sXG4gIGxheWVyQ29uZmlndXJhdGlvbjoge1xuICAgIGRlZmF1bHREZXNjcmlwdGlvbjogJ0xhc2tlIHN1dXJlZW4ge3Byb3BlcnR5fSBhcnZvIHZhbGl0dW4ga2VudMOkbiBwZXJ1c3RlZWxsYScsXG4gICAgaG93VG86ICdNaXRlbiB0b2ltaWknXG4gIH0sXG4gIGZpbHRlck1hbmFnZXI6IHtcbiAgICBhZGRGaWx0ZXI6ICdMaXPDpMOkIHN1b2RhdGluJ1xuICB9LFxuICBkYXRhc2V0VGl0bGU6IHtcbiAgICBzaG93RGF0YVRhYmxlOiAnTsOkeXTDpCBhdHRyaWJ1dXR0aXRhdWx1JyxcbiAgICByZW1vdmVEYXRhc2V0OiAnUG9pc3RhIGFpbmVpc3RvJ1xuICB9LFxuICBkYXRhc2V0SW5mbzoge1xuICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSByaXZpw6QnXG4gIH0sXG4gIHRvb2x0aXA6IHtcbiAgICBoaWRlTGF5ZXI6ICdQaWlsb3RhIHRhc28nLFxuICAgIHNob3dMYXllcjogJ07DpHl0w6QgdGFzbycsXG4gICAgaGlkZUZlYXR1cmU6ICdQaWlsb3RhIGtvaGRlJyxcbiAgICBzaG93RmVhdHVyZTogJ07DpHl0w6Qga29oZGUnLFxuICAgIGhpZGU6ICdwaWlsb3RhJyxcbiAgICBzaG93OiAnbsOkeXTDpCcsXG4gICAgcmVtb3ZlTGF5ZXI6ICdQb2lzdGEgdGFzbycsXG4gICAgbGF5ZXJTZXR0aW5nczogJ1Rhc29uIGFzZXR1a3NldCcsXG4gICAgY2xvc2VQYW5lbDogJ1N1bGplIHBhbmVlbGknLFxuICAgIHN3aXRjaFRvRHVhbFZpZXc6ICdWYWloZGEga2Frc29pc2thcnJ0YW7DpGt5bcOkw6RuJyxcbiAgICBzaG93TGVnZW5kOiAnTsOkeXTDpCBzZWxpdGUnLFxuICAgIGRpc2FibGUzRE1hcDogJ1BvaXN0dSAzRC1uw6RreW3DpHN0w6QnLFxuICAgIERyYXdPbk1hcDogJ1BpaXJyw6Qga2FydGFsbGUnLFxuICAgIHNlbGVjdExvY2FsZTogJ1ZhbGl0c2Uga2llbGlzeXlzJyxcbiAgICBoaWRlTGF5ZXJQYW5lbDogJ1BpaWxvdGEgdGFzb3BhbmVlbGknLFxuICAgIHNob3dMYXllclBhbmVsOiAnTsOkeXTDpCB0YXNvcGFuZWVsaScsXG4gICAgbW92ZVRvVG9wOiAnU2lpcnLDpCB0YXNvamVuIHDDpMOkbGxpbW3DpGlzZWtzaScsXG4gICAgc2VsZWN0QmFzZU1hcFN0eWxlOiAnVmFsaXRzZSB0YXVzdGFrYXJ0dGF0eXlsaScsXG4gICAgZGVsZXRlOiAnUG9pc3RhJyxcbiAgICB0aW1lUGxheWJhY2s6ICdBamFuIGFuaW1vaW50aScsXG4gICAgY2xvdWRTdG9yYWdlOiAnUGlsdml0YWxsZW5udXMnLFxuICAgICczRE1hcCc6ICczRC1uw6RreW3DpCdcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnVmllIGt1dmEnLFxuICAgIGV4cG9ydERhdGE6ICdWaWUgYWluZWlzdG90JyxcbiAgICBleHBvcnRNYXA6ICdWaWUga2FydHRhJyxcbiAgICBzaGFyZU1hcFVSTDogJ0phYSBrYXJ0YW4gVVJMJyxcbiAgICBzYXZlTWFwOiAnVGFsbGVubmEga2FydHRhJyxcbiAgICBzZWxlY3Q6ICd2YWxpdHNlJyxcbiAgICBwb2x5Z29uOiAncG9seWdvbmknLFxuICAgIHJlY3RhbmdsZTogJ25lbGlrdWxtaW8nLFxuICAgIGhpZGU6ICdwaWlsb3RhJyxcbiAgICBzaG93OiAnbsOkeXTDpCcsXG4gICAgLi4uTE9DQUxFU1xuICB9LFxuICBtb2RhbDoge1xuICAgIHRpdGxlOiB7XG4gICAgICBkZWxldGVEYXRhc2V0OiAnUG9pc3RhIGFpbmVpc3RvJyxcbiAgICAgIGFkZERhdGFUb01hcDogJ0xpc8Okw6QgYWluZWlzdG9qYSBrYXJ0YWxsZScsXG4gICAgICBleHBvcnRJbWFnZTogJ1ZpZSBrdXZhJyxcbiAgICAgIGV4cG9ydERhdGE6ICdWaWUgYWluZWlzdG90JyxcbiAgICAgIGV4cG9ydE1hcDogJ1ZpZSBrYXJ0dGEnLFxuICAgICAgYWRkQ3VzdG9tTWFwYm94U3R5bGU6ICdMaXPDpMOkIG9tYSBNYXBib3gtdHl5bGknLFxuICAgICAgc2F2ZU1hcDogJ1RhbGxlbm5hIGthcnR0YScsXG4gICAgICBzaGFyZVVSTDogJ0phYSBVUkwnXG4gICAgfSxcbiAgICBidXR0b246IHtcbiAgICAgIGRlbGV0ZTogJ1BvaXN0YScsXG4gICAgICBkb3dubG9hZDogJ0xhdGFhJyxcbiAgICAgIGV4cG9ydDogJ1ZpZScsXG4gICAgICBhZGRTdHlsZTogJ0xpc8Okw6QgdHl5bGknLFxuICAgICAgc2F2ZTogJ1RhbGxlbm5hJyxcbiAgICAgIGRlZmF1bHRDYW5jZWw6ICdQZXJ1JyxcbiAgICAgIGRlZmF1bHRDb25maXJtOiAnVmFodmlzdGEnXG4gICAgfSxcbiAgICBleHBvcnRJbWFnZToge1xuICAgICAgcmF0aW9UaXRsZTogJ0t1dmFzdWhkZScsXG4gICAgICByYXRpb0Rlc2NyaXB0aW9uOiAnVmFsaXRzZSBzb3BpdmEga3V2YXN1aGRlIGvDpHl0dMO2dGFwYXVzdGFzaSB2YXJ0ZW4uJyxcbiAgICAgIHJhdGlvT3JpZ2luYWxTY3JlZW46ICdBbGt1cGVyw6RpbmVuIG7DpHl0dMO2JyxcbiAgICAgIHJhdGlvQ3VzdG9tOiAnS3VzdG9tb2l0dScsXG4gICAgICByYXRpbzRfMzogJzQ6MycsXG4gICAgICByYXRpbzE2Xzk6ICcxNjo5JyxcbiAgICAgIHJlc29sdXRpb25UaXRsZTogJ1Jlc29sdXV0aW8nLFxuICAgICAgcmVzb2x1dGlvbkRlc2NyaXB0aW9uOiAnS29ya2VhIHJlc29sdXV0aW8gb24gcGFyZW1waSB0dWxvc3RhbWlzdGEgdmFydGVuLicsXG4gICAgICBtYXBMZWdlbmRUaXRsZTogJ0thcnRhbiBzZWxpdGUnLFxuICAgICAgbWFwTGVnZW5kQWRkOiAnTGlzw6TDpCBzZWxpdGUga2FydHRhYW4nXG4gICAgfSxcbiAgICBleHBvcnREYXRhOiB7XG4gICAgICBkYXRhc2V0VGl0bGU6ICdBaW5laXN0b3QnLFxuICAgICAgZGF0YXNldFN1YnRpdGxlOiAnVmFsaXRzZSBhaW5laXN0bywgam9ua2EgYWlvdCB2aWVkw6QnLFxuICAgICAgYWxsRGF0YXNldHM6ICdLYWlra2knLFxuICAgICAgZGF0YVR5cGVUaXRsZTogJ0FpbmVpc3RvamVuIGZvcm1hYXR0aScsXG4gICAgICBkYXRhVHlwZVN1YnRpdGxlOiAnVmFsaXRzZSBhaW5laXN0b2Zvcm1hYXR0aSB2YWxpdHNlbWlsbGVzaSBhaW5laXN0b2lsbGUnLFxuICAgICAgZmlsdGVyRGF0YVRpdGxlOiAnU3VvZGF0YSBhaW5laXN0b2phJyxcbiAgICAgIGZpbHRlckRhdGFTdWJ0aXRsZTogJ1ZvaXQgdmllZMOkIGpva28gYWxrdXBlcsOkaXNldCBhaW5laXN0b3QgdGFpIHN1b2RhdGV0dXQgYWluZWlzdG90JyxcbiAgICAgIGZpbHRlcmVkRGF0YTogJ1N1b2RhdGV0dXQgYWluZWlzdG90JyxcbiAgICAgIHVuZmlsdGVyZWREYXRhOiAnU3VvZGF0dGFtYXR0b21hdCBhaW5laXN0b3QnLFxuICAgICAgZmlsZUNvdW50OiAne2ZpbGVDb3VudH0gdGllZG9zdG9hJyxcbiAgICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSByaXZpw6QnXG4gICAgfSxcbiAgICBkZWxldGVEYXRhOiB7XG4gICAgICB3YXJuaW5nOiAnYWlvdCBwb2lzdGFhIHTDpG3DpG4gYWluZWlzdG9uLiBBaW5lb3N0b2Ega8OkeXR0w6R2aWVuIHRhc29qZW4gbHVrdW3DpMOkcsOkOiB7bGVuZ3RofSdcbiAgICB9LFxuICAgIGFkZFN0eWxlOiB7XG4gICAgICBwdWJsaXNoVGl0bGU6ICcxLiBKdWxrYWlzZSB0eXlsaXNpIE1hcGJveGlzc2EgdGFpIGFubmEgdHVubmlzdGUnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMTogJ1ZvaXQgbHVvZGEgb21hbiBrYXJ0dGF0eXlsaXNpIHNpdnVsbGEnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMjogJ2phJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTM6ICdqdWxrYWlzdGEnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNDogJ3Nlbi4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNTogJ0vDpHl0dMOkw6Rrc2VzaSB5a3NpdHlpc3TDpCB0eXlsacOkLCBsaWl0w6QnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNjogJ3R1bm5pc3RlZXNpJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTc6XG4gICAgICAgICd0w6RubmUuICprZXBsZXIuZ2wgb24gY2xpZW50LXNpZGUgc292ZWxsdXMsIGRhdGEgcHlzeXkgdmFpbiBzZWxhaW1lc3Nhc2kuLi4nLFxuICAgICAgZXhhbXBsZVRva2VuOiAnZXNpbS4gcGsuYWJjZGVmZy54eHh4eHgnLFxuICAgICAgcGFzdGVUaXRsZTogJzIuIExpaXTDpCB0eXlsaS1VUkwnLFxuICAgICAgcGFzdGVTdWJ0aXRsZTE6ICdNaWvDpCBvbicsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogJ3R5eWxpLVVSTD8nLFxuICAgICAgbmFtaW5nVGl0bGU6ICczLiBOaW1lw6QgdHl5bGlzaSdcbiAgICB9LFxuICAgIHNoYXJlTWFwOiB7XG4gICAgICBzaGFyZVVyaVRpdGxlOiAnSmFhIGthcnRhbiBVUkwnLFxuICAgICAgc2hhcmVVcmlTdWJ0aXRsZTogJ0x1byBrYXJ0YWxsZSBVUkwsIGpvbmthIHZvaXQgamFrYWEgbXVpZGVuIGthbnNzYScsXG4gICAgICBjbG91ZFRpdGxlOiAnUGlsdml0YWxsZW5udXMnLFxuICAgICAgY2xvdWRTdWJ0aXRsZTpcbiAgICAgICAgJ0tpcmphdWR1IHNpc8Okw6RuIGphIGxhdGFhIGthcnR0YSBqYSBhaW5laXN0b3QgaGVua2lsw7Zrb2h0YWlzZWVuIHBpbHZpcGFsdmVsdXVuJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCB0YWxsZW50YWEga2FydGFuIGRhdGFuIGhlbmtpbMO2a29odGFpc2VlbiBwaWx2aXRhbGxlbm51c3RpbGFhc2ksIHZhaW4gaWhtaXNldCwgam9pbGxhIG9uIFVSTCwgdm9pdmF0IHDDpMOkc3TDpCBrw6RzaWtzaSBrYXJ0dGFhbiBqYSBhaW5laXN0b2loaW4uICcgK1xuICAgICAgICAnVm9pdCBtdW9rYXRhIHRpZWRvc3RvamEgdGFpIHBvaXN0YWEgbmUgcGlsdmlwYWx2ZWx1c3Rhc2kgbWlsbG9pbiB2YWluLicsXG4gICAgICBnb3RvUGFnZTogJ01lbmUgS2VwbGVyLmdsIHtjdXJyZW50UHJvdmlkZXJ9IHNpdnVsbGVzaSdcbiAgICB9LFxuICAgIHN0YXR1c1BhbmVsOiB7XG4gICAgICBtYXBVcGxvYWRpbmc6ICdLYXJ0dGFhIGxhZGF0YWFuJyxcbiAgICAgIGVycm9yOiAnVmlyaGUnXG4gICAgfSxcbiAgICBzYXZlTWFwOiB7XG4gICAgICB0aXRsZTogJ1BpbHZpdGFsbGVubnVzJyxcbiAgICAgIHN1YnRpdGxlOiAnS2lyamF1ZHUgc2lzw6TDpG4gcGlsdmlwYWx2ZWx1dXNpIHRhbGxlbnRhYWtzZXNpIGthcnRhbidcbiAgICB9LFxuICAgIGV4cG9ydE1hcDoge1xuICAgICAgZm9ybWF0VGl0bGU6ICdLYXJ0YW4gZm9ybWFhdHRpJyxcbiAgICAgIGZvcm1hdFN1YnRpdGxlOiAnVmFsaXRzZSBmb3JtYWF0dGksIGpvc3NhIHZpZXQga2FydGFuJyxcbiAgICAgIGh0bWw6IHtcbiAgICAgICAgc2VsZWN0aW9uOiAnVmllIGthcnR0YSBpbnRlcmFrdGlpdmlzZW5hIGh0bWwtdGllZG9zdG9uYScsXG4gICAgICAgIHRva2VuVGl0bGU6ICdNYXBib3gtdHVubmlzdGUnLFxuICAgICAgICB0b2tlblN1YnRpdGxlOiAnS8OkeXTDpCBvbWFhIE1hcGJveC10dW5uaXN0ZXR0YXNpIGh0bWwtdGllZG9zdG9zc2EgKHZhbGlubmFpbmVuKScsXG4gICAgICAgIHRva2VuUGxhY2Vob2xkZXI6ICdMaWl0w6QgTWFwYm94LXR1bm5pc3RlZXNpJyxcbiAgICAgICAgdG9rZW5NaXN1c2VXYXJuaW5nOlxuICAgICAgICAgICcqIEpvcyBldCBrw6R5dMOkIG9tYWEgdHVubmlzdGV0dGFzaSwga2FydHRhIHZvaSBsYWthdGEgdG9pbWltYXN0YSBtaWxsb2luIHZhaW4ga3VuIHZhaWhkYW1tZSBvbWFhIHR1bm5pc3RldHRhbW1lIHbDpMOkcmlua8OkeXTDtm4gZXN0w6RtaXNla3NpLiAnLFxuICAgICAgICB0b2tlbkRpc2NsYWltZXI6ICdWb2l0IHZhaWh0YWEgTWFwYm94LXR1bm5pc3RlZXNpIG7DpGlkZW4gb2hqZWlkZW4gYXZ1bGxhOiAnLFxuICAgICAgICB0b2tlblVwZGF0ZTogJ0t1aW5rYSB2YWlodGFhIG9sZW1hc3Nhb2xldmEgTWFwYm94LXR1bm5pc3RlJyxcbiAgICAgICAgbW9kZVRpdGxlOiAnS2FydGFuIHRpbGEnLFxuICAgICAgICBtb2RlU3VidGl0bGUxOiAnVmFsaXRzZSBrYXJ0YW4gdGlsYS4nLFxuICAgICAgICBtb2RlU3VidGl0bGUyOiAnTGlzw6R0aWV0b2phJyxcbiAgICAgICAgbW9kZURlc2NyaXB0aW9uOiAnQW5uYSBrw6R5dHTDpGppZW4ge21vZGV9IGthcnR0YWEnLFxuICAgICAgICByZWFkOiAnbHVrZWEnLFxuICAgICAgICBlZGl0OiAnbXVva2F0YSdcbiAgICAgIH0sXG4gICAgICBqc29uOiB7XG4gICAgICAgIGNvbmZpZ1RpdGxlOiAnS2FydGFuIGFzZXR1a3NldCcsXG4gICAgICAgIGNvbmZpZ0Rpc2NsYWltZXI6XG4gICAgICAgICAgJ0thcnRhbiBhc2V0dWtzZXQgc2lzw6RsdHl2w6R0IEpzb24tdGllZG9zdG9vbi4gSm9zIGvDpHl0w6R0IGtpcmphc3RvYSBrZXBsZXIuZ2wgb21hc3NhIHNvdmVsbHVrc2Vzc2FzaS4gVm9pdCBrb3Bpb2lkYSBhc2V0dWtzZXQgamEgYW50YWEgbmUgZnVua3Rpb2xsZTogJyxcbiAgICAgICAgc2VsZWN0aW9uOlxuICAgICAgICAgICdWaWUga3lzZWlzZW4ga2FydGFuIGFpbmVpc3RvdCBqYSBhc2V0dWtzZXQgeWhkZXNzw6QganNvbi10aWVkb3N0b3NzYS4gVm9pdCBtecO2aGVtbWluIGF2YXRhIHNhbWFuIGthcnRhbiBsYXRhYW1hbGxhIHRpZWRvc3RvbiBrZXBsZXIuZ2w6bicsXG4gICAgICAgIGRpc2NsYWltZXI6XG4gICAgICAgICAgJyogS2FydGFuIGFzZXR1a3NldCBvdmF0IHNpZG9rc2lzc2EgbGFkYXR0dWloaW4gYWluZWlzdG9paGluLiBBcnZvYSDigJhkYXRhSWTigJkga8OkeXRldMOkw6RuIHRhc29qZW4sIHN1b2RhdHRpbWllbiBqYSB2aWhqZWlkZW4gbGlpdHTDpG1pc2Vrc2kgdGlldHR5eW4gYWluZWlzdG9vbi4gJyArXG4gICAgICAgICAgJ1Zhcm1pc3RhLCBldHTDpCBhaW5laXN0b24gZGF0YUlkOnQgdmFzdGFhdmF0IGFzZXR1c3RlbiBhcnZvamEgam9zIGxhdGFhdCBhc2V0dWtzZXQga8OkeXR0w6RlbiBgYWRkRGF0YVRvTWFwYC1mdW5rdGlvbGxlLidcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRpbmdEaWFsb2c6IHtcbiAgICAgIGxvYWRpbmc6ICdMYWRhdGFhbi4uLidcbiAgICB9LFxuICAgIGxvYWREYXRhOiB7XG4gICAgICB1cGxvYWQ6ICdMYXRhYSB0aWVkb3N0b3QnLFxuICAgICAgc3RvcmFnZTogJ0xhdGFhIHRhbGxlbm51c3RpbGFzdGEnXG4gICAgfSxcbiAgICB0cmlwSW5mbzoge1xuICAgICAgdGl0bGU6ICdLdWlua2Ega8OkeXR0w6TDpCBtYXRrYS1hbmltYWF0aW90YScsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdSZWl0aW4gYW5pbW9pbWlzZWtzaSBnZW9KU09OLWFpbmVpc3RvbiB0w6R5dHl5IG9sbGEgZ2VvbWV0cmlhdHl5cGlsdMOkw6RuIGBMaW5lU3RyaW5nYCwgTGluZVN0cmluZy1rb29yZGluYWF0dGllbiB0w6R5dHl5IHNpc8OkbHTDpMOkIDQgZWxlbWVudHRpw6QgZm9ybWFhdGlzc2E6JyxcbiAgICAgIGNvZGU6ICcgW3BpdHV1c2FzdGUsIGxldmV5c2FzdGUsIGtvcmtldXMsIGFpa2FsZWltYV0gJyxcbiAgICAgIGRlc2NyaXB0aW9uMjpcbiAgICAgICAgJ3NpdGVuLCBldHTDpCB2aWltZWluZW4gZWxlbWVudHRpIG9uIGFpa2FsZWltYS4gQWlrYWxlaW1hIHZvaSBvbGxhIG11b2RvbHRhYW4gdW5peC1zZWt1bnRlamEsIGt1dGVuIGAxNTY0MTg0MzYzYCB0YWkgbWlsbGlzZWt1bnRlamEsIGt1dGVuIGAxNTY0MTg0MzYzMDAwYC4nLFxuICAgICAgZXhhbXBsZTogJ0VzaW1lcmtraTonXG4gICAgfSxcbiAgICBpY29uSW5mbzoge1xuICAgICAgdGl0bGU6ICdNaXRlbiBwaWlydMOkw6Qga3V2aWEnLFxuICAgICAgZGVzY3JpcHRpb24xOlxuICAgICAgICAnY3N2LXRpZWRvc3Rvc3Nhc2ksIGx1byBzYXJha2UgbmltZWx0w6QgaWNvbi4gVm9pdCBqw6R0dMOkw6Qgc2VuIHR5aGrDpGtzaSBqb3MgZXQgaGFsdWEgcGlpcnTDpMOkIGt1dmFhIGpvaWxsYWluIHBpc3RlaWxsw6QuIEt1biBzYXJha2tlZW4gbmltaSBvbiAnLFxuICAgICAgY29kZTogJ2ljb24nLFxuICAgICAgZGVzY3JpcHRpb24yOiAnIGtlcGxlci5nbCBsdW8gYXV0b21hYXR0aXNlc3RpIGt1dmF0YXNvbiBzaW51YSB2YXJ0ZW4uJyxcbiAgICAgIGV4YW1wbGU6ICdFc2ltZXJra2k6JyxcbiAgICAgIGljb25zOiAnS3V2YXQnXG4gICAgfSxcbiAgICBzdG9yYWdlTWFwVmlld2VyOiB7XG4gICAgICBsYXN0TW9kaWZpZWQ6ICdWaWltZWtzaSBtdW9rYXR0dSB7bGFzdFVwZGF0ZWR9IHNpdHRlbicsXG4gICAgICBiYWNrOiAnVGFrYWlzaW4nXG4gICAgfSxcbiAgICBvdmVyd3JpdGVNYXA6IHtcbiAgICAgIHRpdGxlOiAnVGFsbGVubmV0YWFuIGthcnR0YWEuLi4nLFxuICAgICAgYWxyZWFkeUV4aXN0czogJ29uIGpvIHttYXBTYXZlZH06c3NhLiBIYWx1YXRrbyB5bGlraXJqb2l0dGFhIHNlbj8nXG4gICAgfSxcbiAgICBsb2FkU3RvcmFnZU1hcDoge1xuICAgICAgYmFjazogJ1Rha2Fpc2luJyxcbiAgICAgIGdvVG9QYWdlOiAnTWVuZSBLZXBsZXIuZ2wge2Rpc3BsYXlOYW1lfSBzaXZ1bGxlc2knLFxuICAgICAgc3RvcmFnZU1hcHM6ICdUYWxsZW5udXMgLyBLYXJ0YXQnLFxuICAgICAgbm9TYXZlZE1hcHM6ICdFaSB0YWxsZW5uZXR0dWphIGthcnR0b2phIHZpZWzDpCdcbiAgICB9XG4gIH0sXG4gIGhlYWRlcjoge1xuICAgIHZpc2libGVMYXllcnM6ICdOw6RreXZpc3PDpCBvbGV2YXQgdGFzb3QnLFxuICAgIGxheWVyTGVnZW5kOiAnVGFzb24gc2VsaXRlJ1xuICB9LFxuICBpbnRlcmFjdGlvbnM6IHtcbiAgICB0b29sdGlwOiAnVmloamUnLFxuICAgIGJydXNoOiAnSGFyamEnLFxuICAgIGNvb3JkaW5hdGU6ICdLb29yZGluYWF0aXQnXG4gIH0sXG4gIGxheWVyQmxlbmRpbmc6IHtcbiAgICB0aXRsZTogJ1Rhc29qZW4gc2Vrb2l0dHV2dXVzJyxcbiAgICBhZGRpdGl2ZTogJ2xpc8Okw6R2w6QnLFxuICAgIG5vcm1hbDogJ25vcm1hYWxpJyxcbiAgICBzdWJ0cmFjdGl2ZTogJ3bDpGhlbnTDpHbDpCdcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAnU2FyYWtrZWV0JyxcbiAgICBsYXQ6ICdsYXQnLFxuICAgIGxuZzogJ2xuZycsXG4gICAgYWx0aXR1ZGU6ICdrb3JrZXVzJyxcbiAgICBpY29uOiAna3V2YScsXG4gICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgIGFyYzoge1xuICAgICAgbGF0MDogJ2zDpGhkw7ZuIGxhdCcsXG4gICAgICBsbmcwOiAnbMOkaGTDtm4gbG5nJyxcbiAgICAgIGxhdDE6ICdrb2h0ZWVuIGxhdCcsXG4gICAgICBsbmcxOiAna29odGVlbiBsbmcnXG4gICAgfSxcbiAgICBsaW5lOiB7XG4gICAgICBhbHQwOiAnbMOkaHRlZW4ga29ya2V1cycsXG4gICAgICBhbHQxOiAna29oZGUga29ya2V1cydcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIHdvcmxkVW5pdFNpemU6ICdSdXV0dWplbiBrb2tvIChrbSknXG4gICAgfSxcbiAgICBoZXhhZ29uOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiAnSGV4YWdvbmllbiBzw6RkZSAoa20pJ1xuICAgIH1cbiAgfSxcbiAgY29sb3I6IHtcbiAgICBjdXN0b21QYWxldHRlOiAnTXVrYXV0ZXR0dSBwYWxldHRpJyxcbiAgICBzdGVwczogJ2Fza2VsZWV0JyxcbiAgICB0eXBlOiAndHl5cHBpJyxcbiAgICByZXZlcnNlZDogJ2vDpMOkbnRlaW5lbidcbiAgfSxcbiAgc2NhbGU6IHtcbiAgICBjb2xvclNjYWxlOiAnVsOkcmluIHNrYWFsYScsXG4gICAgc2l6ZVNjYWxlOiAnS29vbiBza2FhbGEnLFxuICAgIHN0cm9rZVNjYWxlOiAnVmlpdmFuIHBha3N1dWRlbiBza2FhbGEnLFxuICAgIHNjYWxlOiAnU2thYWxhJ1xuICB9LFxuICBmaWxlVXBsb2FkZXI6IHtcbiAgICBtZXNzYWdlOiAnUmFhaGFhIGphIHB1ZG90YSB0aWVkb3N0b3NpIHTDpG5uZScsXG4gICAgY2hyb21lTWVzc2FnZTpcbiAgICAgICcqQ2hyb21lbiBrw6R5dHTDpGrDpDogUmFqb2l0YSB0aWVkb3N0b2tva29zaSAyNTBNYjpoZW4uIEpvcyBoYWx1YXQgc3V1cmVtcGlhIHRpZWRvc3RvamEsIGtva2VpbGUgU2FmYXJpYScsXG4gICAgZGlzY2xhaW1lcjpcbiAgICAgICcqa2VwbGVyLmdsIG9uIGNsaWVudC1zaWRlIHNvdmVsbHVzLCBkYXRhIHB5c3l5IHZhaW4gc2VsYWltZXNzYXNpLi4uJyArXG4gICAgICAnVGlldG9qYSBlaSBsw6RoZXRldMOkIHBhbHZlbGltZWxsZS4nLFxuICAgIGNvbmZpZ1VwbG9hZE1lc3NhZ2U6XG4gICAgICAnTGlzw6TDpCB7ZmlsZUZvcm1hdE5hbWVzfSB0YWkgdGFsbGVubmV0dHUga2FydHRhICoqSnNvbioqLiBMdWUgbGlzw6TDpCBbKip0dWV0dWlzdGEgZm9ybWFhdGVpc3RhKipdJyxcbiAgICBicm93c2VGaWxlczogJ3NlbGFhIHRpZWRvc3RvamFzaScsXG4gICAgdXBsb2FkaW5nOiAnbGFkYXRhYW4nLFxuICAgIGZpbGVOb3RTdXBwb3J0ZWQ6ICdUaWVkb3N0byB7ZXJyb3JGaWxlc30gZWkgb2xlIHR1ZXR0dS4nLFxuICAgIG9yOiAndGFpJ1xuICB9LFxuICBkZW5zaXR5OiAndGloZXlzJyxcbiAgJ0J1ZyBSZXBvcnQnOiAnQnVnaXJhcG9ydG9pbnRpJyxcbiAgJ1VzZXIgR3VpZGUnOiAnT3BhcycsXG4gIFNhdmU6ICdUYWxsZW5uYScsXG4gIFNoYXJlOiAnSmFhJ1xufTtcbiJdfQ==