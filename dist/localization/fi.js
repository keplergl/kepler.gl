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
    heightRange: 'Korkeuden rajat'
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
    configUploadMessage: 'Lisää **CSV**, **GeoJson** tai tallennettu kartta **Json**. Lue lisää [**tuetuista formaateista**]',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vZmkuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwic3Ryb2tlQ29sb3IiLCJyYWRpdXMiLCJvdXRsaW5lIiwic3Ryb2tlIiwiZGVuc2l0eSIsImNvdmVyYWdlIiwic3VtIiwicG9pbnRDb3VudCIsInBsYWNlaG9sZGVyIiwic2VhcmNoIiwic2VsZWN0RmllbGQiLCJ5QXhpcyIsInNlbGVjdFR5cGUiLCJzZWxlY3RWYWx1ZSIsImVudGVyVmFsdWUiLCJlbXB0eSIsIm1pc2MiLCJieSIsInZhbHVlc0luIiwidmFsdWVFcXVhbHMiLCJkYXRhU291cmNlIiwiYnJ1c2hSYWRpdXMiLCJtYXBMYXllcnMiLCJ0aXRsZSIsInJvYWQiLCJib3JkZXIiLCJidWlsZGluZyIsIndhdGVyIiwibGFuZCIsInBhbmVsIiwidGV4dCIsImxhYmVsV2l0aElkIiwiZm9udFNpemUiLCJmb250Q29sb3IiLCJ0ZXh0QW5jaG9yIiwiYWxpZ25tZW50IiwiYWRkTW9yZUxhYmVsIiwic2lkZWJhciIsInBhbmVscyIsImxheWVyIiwiZmlsdGVyIiwiaW50ZXJhY3Rpb24iLCJiYXNlbWFwIiwicmVxdWlyZWQiLCJwcm9wZXJ0eUJhc2VkT24iLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsInN0cm9rZVdpZHRoUmFuZ2UiLCJmaXhlZFJhZGl1cyIsImZpeGVkUmFkaXVzRGVzY3JpcHRpb24iLCJyYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXMiLCJyYWRpdXNSYW5nZVBpeGVscyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwic3Ryb2tlQ29sb3JSYW5nZSIsInRhcmdldENvbG9yIiwiY29sb3JBZ2dyZWdhdGlvbiIsImhlaWdodEFnZ3JlZ2F0aW9uIiwicmVzb2x1dGlvblJhbmdlIiwic2l6ZVNjYWxlIiwid29ybGRVbml0U2l6ZSIsImVsZXZhdGlvblNjYWxlIiwiaGVpZ2h0U2NhbGUiLCJjb3ZlcmFnZVJhbmdlIiwiaGlnaFByZWNpc2lvblJlbmRlcmluZyIsImhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbiIsImhlaWdodCIsImhlaWdodERlc2NyaXB0aW9uIiwiZmlsbCIsImVuYWJsZVBvbHlnb25IZWlnaHQiLCJzaG93V2lyZWZyYW1lIiwid2VpZ2h0SW50ZW5zaXR5Iiwiem9vbVNjYWxlIiwiaGVpZ2h0UmFuZ2UiLCJsYXllck1hbmFnZXIiLCJhZGREYXRhIiwiYWRkTGF5ZXIiLCJsYXllckJsZW5kaW5nIiwibWFwTWFuYWdlciIsIm1hcFN0eWxlIiwiYWRkTWFwU3R5bGUiLCJsYXllckNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJob3dUbyIsImZpbHRlck1hbmFnZXIiLCJhZGRGaWx0ZXIiLCJkYXRhc2V0VGl0bGUiLCJzaG93RGF0YVRhYmxlIiwicmVtb3ZlRGF0YXNldCIsImRhdGFzZXRJbmZvIiwicm93Q291bnQiLCJ0b29sdGlwIiwiaGlkZUxheWVyIiwic2hvd0xheWVyIiwiaGlkZUZlYXR1cmUiLCJzaG93RmVhdHVyZSIsImhpZGUiLCJzaG93IiwicmVtb3ZlTGF5ZXIiLCJsYXllclNldHRpbmdzIiwiY2xvc2VQYW5lbCIsInN3aXRjaFRvRHVhbFZpZXciLCJzaG93TGVnZW5kIiwiZGlzYWJsZTNETWFwIiwiRHJhd09uTWFwIiwic2VsZWN0TG9jYWxlIiwiaGlkZUxheWVyUGFuZWwiLCJzaG93TGF5ZXJQYW5lbCIsIm1vdmVUb1RvcCIsInNlbGVjdEJhc2VNYXBTdHlsZSIsInRpbWVQbGF5YmFjayIsImNsb3VkU3RvcmFnZSIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwibW9kYWwiLCJkZWxldGVEYXRhc2V0IiwiYWRkRGF0YVRvTWFwIiwiYWRkQ3VzdG9tTWFwYm94U3R5bGUiLCJzaGFyZVVSTCIsImJ1dHRvbiIsImRvd25sb2FkIiwiYWRkU3R5bGUiLCJzYXZlIiwiZGVmYXVsdENhbmNlbCIsImRlZmF1bHRDb25maXJtIiwicmF0aW9UaXRsZSIsInJhdGlvRGVzY3JpcHRpb24iLCJyYXRpb09yaWdpbmFsU2NyZWVuIiwicmF0aW9DdXN0b20iLCJyYXRpbzRfMyIsInJhdGlvMTZfOSIsInJlc29sdXRpb25UaXRsZSIsInJlc29sdXRpb25EZXNjcmlwdGlvbiIsIm1hcExlZ2VuZFRpdGxlIiwibWFwTGVnZW5kQWRkIiwiZGF0YXNldFN1YnRpdGxlIiwiYWxsRGF0YXNldHMiLCJkYXRhVHlwZVRpdGxlIiwiZGF0YVR5cGVTdWJ0aXRsZSIsImZpbHRlckRhdGFUaXRsZSIsImZpbHRlckRhdGFTdWJ0aXRsZSIsImZpbHRlcmVkRGF0YSIsInVuZmlsdGVyZWREYXRhIiwiZmlsZUNvdW50IiwiZGVsZXRlRGF0YSIsIndhcm5pbmciLCJwdWJsaXNoVGl0bGUiLCJwdWJsaXNoU3VidGl0bGUxIiwicHVibGlzaFN1YnRpdGxlMiIsInB1Ymxpc2hTdWJ0aXRsZTMiLCJwdWJsaXNoU3VidGl0bGU0IiwicHVibGlzaFN1YnRpdGxlNSIsInB1Ymxpc2hTdWJ0aXRsZTYiLCJwdWJsaXNoU3VidGl0bGU3IiwiZXhhbXBsZVRva2VuIiwicGFzdGVUaXRsZSIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJuYW1pbmdUaXRsZSIsInNoYXJlTWFwIiwic2hhcmVVcmlUaXRsZSIsInNoYXJlVXJpU3VidGl0bGUiLCJjbG91ZFRpdGxlIiwiY2xvdWRTdWJ0aXRsZSIsInNoYXJlRGlzY2xhaW1lciIsImdvdG9QYWdlIiwic3RhdHVzUGFuZWwiLCJtYXBVcGxvYWRpbmciLCJlcnJvciIsInN1YnRpdGxlIiwiZm9ybWF0VGl0bGUiLCJmb3JtYXRTdWJ0aXRsZSIsImh0bWwiLCJzZWxlY3Rpb24iLCJ0b2tlblRpdGxlIiwidG9rZW5TdWJ0aXRsZSIsInRva2VuUGxhY2Vob2xkZXIiLCJ0b2tlbk1pc3VzZVdhcm5pbmciLCJ0b2tlbkRpc2NsYWltZXIiLCJ0b2tlblVwZGF0ZSIsIm1vZGVUaXRsZSIsIm1vZGVTdWJ0aXRsZTEiLCJtb2RlU3VidGl0bGUyIiwibW9kZURlc2NyaXB0aW9uIiwicmVhZCIsImVkaXQiLCJqc29uIiwiY29uZmlnVGl0bGUiLCJjb25maWdEaXNjbGFpbWVyIiwiZGlzY2xhaW1lciIsImxvYWRpbmdEaWFsb2ciLCJsb2FkaW5nIiwibG9hZERhdGEiLCJ1cGxvYWQiLCJzdG9yYWdlIiwidHJpcEluZm8iLCJkZXNjcmlwdGlvbjEiLCJjb2RlIiwiZGVzY3JpcHRpb24yIiwiZXhhbXBsZSIsImljb25JbmZvIiwiaWNvbnMiLCJzdG9yYWdlTWFwVmlld2VyIiwibGFzdE1vZGlmaWVkIiwiYmFjayIsIm92ZXJ3cml0ZU1hcCIsImFscmVhZHlFeGlzdHMiLCJsb2FkU3RvcmFnZU1hcCIsImdvVG9QYWdlIiwic3RvcmFnZU1hcHMiLCJub1NhdmVkTWFwcyIsImhlYWRlciIsInZpc2libGVMYXllcnMiLCJsYXllckxlZ2VuZCIsImludGVyYWN0aW9ucyIsImJydXNoIiwiY29vcmRpbmF0ZSIsImFkZGl0aXZlIiwibm9ybWFsIiwic3VidHJhY3RpdmUiLCJjb2x1bW5zIiwibGF0IiwibG5nIiwiYWx0aXR1ZGUiLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiY3VzdG9tUGFsZXR0ZSIsInN0ZXBzIiwicmV2ZXJzZWQiLCJzY2FsZSIsImNvbG9yU2NhbGUiLCJzdHJva2VTY2FsZSIsImZpbGVVcGxvYWRlciIsIm1lc3NhZ2UiLCJjaHJvbWVNZXNzYWdlIiwiY29uZmlnVXBsb2FkTWVzc2FnZSIsImJyb3dzZUZpbGVzIiwidXBsb2FkaW5nIiwiZmlsZU5vdFN1cHBvcnRlZCIsIm9yIiwiU2F2ZSIsIlNoYXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7Ozs7O2VBRWU7QUFDYkEsRUFBQUEsUUFBUSxFQUFFO0FBQ1JDLElBQUFBLE1BQU0sRUFBRSxVQURBO0FBRVJDLElBQUFBLEtBQUssRUFBRSxPQUZDO0FBR1JDLElBQUFBLFNBQVMsRUFBRSxZQUhIO0FBSVJDLElBQUFBLEtBQUssRUFBRSxNQUpDO0FBS1JDLElBQUFBLFdBQVcsRUFBRSxhQUxMO0FBTVJDLElBQUFBLE1BQU0sRUFBRSxNQU5BO0FBT1JDLElBQUFBLE9BQU8sRUFBRSxXQVBEO0FBUVJDLElBQUFBLE1BQU0sRUFBRSxPQVJBO0FBU1JDLElBQUFBLE9BQU8sRUFBRSxRQVREO0FBVVJDLElBQUFBLFFBQVEsRUFBRSxXQVZGO0FBV1JDLElBQUFBLEdBQUcsRUFBRSxPQVhHO0FBWVJDLElBQUFBLFVBQVUsRUFBRTtBQVpKLEdBREc7QUFlYkMsRUFBQUEsV0FBVyxFQUFFO0FBQ1hDLElBQUFBLE1BQU0sRUFBRSxNQURHO0FBRVhDLElBQUFBLFdBQVcsRUFBRSxnQkFGRjtBQUdYQyxJQUFBQSxLQUFLLEVBQUUsVUFISTtBQUlYQyxJQUFBQSxVQUFVLEVBQUUsZ0JBSkQ7QUFLWEMsSUFBQUEsV0FBVyxFQUFFLGNBTEY7QUFNWEMsSUFBQUEsVUFBVSxFQUFFLFdBTkQ7QUFPWEMsSUFBQUEsS0FBSyxFQUFFO0FBUEksR0FmQTtBQXdCYkMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLEVBQUUsRUFBRSxFQURBO0FBRUpDLElBQUFBLFFBQVEsRUFBRSxpQkFGTjtBQUdKQyxJQUFBQSxXQUFXLEVBQUUsd0JBSFQ7QUFJSkMsSUFBQUEsVUFBVSxFQUFFLGVBSlI7QUFLSkMsSUFBQUEs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O0FBK1piQyxFQUFBQSxLQUFLLEVBQUU7QUEvWk0sQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAyMCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7TE9DQUxFU30gZnJvbSAnLi9sb2NhbGVzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBwcm9wZXJ0eToge1xuICAgIHdlaWdodDogJ3BhaW5vdHVzJyxcbiAgICBsYWJlbDogJ25pbWnDticsXG4gICAgZmlsbENvbG9yOiAndMOkeXR0w7Z2w6RyaScsXG4gICAgY29sb3I6ICd2w6RyaScsXG4gICAgc3Ryb2tlQ29sb3I6ICd2aWl2YW4gdsOkcmknLFxuICAgIHJhZGl1czogJ3PDpGRlJyxcbiAgICBvdXRsaW5lOiAnw6TDpHJpdmlpdmEnLFxuICAgIHN0cm9rZTogJ3ZpaXZhJyxcbiAgICBkZW5zaXR5OiAndGloZXlzJyxcbiAgICBjb3ZlcmFnZTogJ2thdHRhdnV1cycsXG4gICAgc3VtOiAnc3VtbWEnLFxuICAgIHBvaW50Q291bnQ6ICdwaXN0ZWlkZW4gbHVrdW3DpMOkcsOkJ1xuICB9LFxuICBwbGFjZWhvbGRlcjoge1xuICAgIHNlYXJjaDogJ0V0c2knLFxuICAgIHNlbGVjdEZpZWxkOiAnVmFsaXRzZSBrZW50dMOkJyxcbiAgICB5QXhpczogJ1ktYWtzZWxpJyxcbiAgICBzZWxlY3RUeXBlOiAnVmFsaXRzZSB0eXlwcGknLFxuICAgIHNlbGVjdFZhbHVlOiAnVmFsaXRzZSBhcnZvJyxcbiAgICBlbnRlclZhbHVlOiAnQW5uYSBhcnZvJyxcbiAgICBlbXB0eTogJ3R5aGrDpCdcbiAgfSxcbiAgbWlzYzoge1xuICAgIGJ5OiAnJyxcbiAgICB2YWx1ZXNJbjogJ0Fydm90IGpvdWtvc3NhOicsXG4gICAgdmFsdWVFcXVhbHM6ICdBcnZvIG9uIHlodMOkc3V1cmkga3VpbicsXG4gICAgZGF0YVNvdXJjZTogJ0FpbmVpc3RvbMOkaGRlJyxcbiAgICBicnVzaFJhZGl1czogJ0hhcmphbiBzw6RkZSAoa20pJyxcbiAgICBlbXB0eTogJyAnXG4gIH0sXG4gIG1hcExheWVyczoge1xuICAgIHRpdGxlOiAnS2FydGFuIHRhc290JyxcbiAgICBsYWJlbDogJ05pbWnDtnQnLFxuICAgIHJvYWQ6ICdUaWV0JyxcbiAgICBib3JkZXI6ICdSYWphdCcsXG4gICAgYnVpbGRpbmc6ICdSYWtlbm51a3NldCcsXG4gICAgd2F0ZXI6ICdWZXNpJyxcbiAgICBsYW5kOiAnTWFhJyxcbiAgICAnM2RCdWlsZGluZyc6ICczZC1yYWtlbm51a3NldCdcbiAgfSxcbiAgcGFuZWw6IHtcbiAgICB0ZXh0OiB7XG4gICAgICBsYWJlbDogJ05pbWnDticsXG4gICAgICBsYWJlbFdpdGhJZDogJ05pbWnDtiB7bGFiZWxJZH0nLFxuICAgICAgZm9udFNpemU6ICdGb250aW4ga29rbycsXG4gICAgICBmb250Q29sb3I6ICdGb250aW4gdsOkcmknLFxuICAgICAgdGV4dEFuY2hvcjogJ1Rla3N0aW4gYW5ra3VyaScsXG4gICAgICBhbGlnbm1lbnQ6ICdTaWpvaXR0ZWx1JyxcbiAgICAgIGFkZE1vcmVMYWJlbDogJ0xpc8Okw6QgdXVzaWEgbmltacO2aXTDpCdcbiAgICB9XG4gIH0sXG4gIHNpZGViYXI6IHtcbiAgICBwYW5lbHM6IHtcbiAgICAgIGxheWVyOiAnVGFzb3QnLFxuICAgICAgZmlsdGVyOiAnU3VvZGF0dGltZXQnLFxuICAgICAgaW50ZXJhY3Rpb246ICdJbnRlcmFrdGlvdCcsXG4gICAgICBiYXNlbWFwOiAnVGF1c3Rha2FydHRhJ1xuICAgIH1cbiAgfSxcbiAgbGF5ZXI6IHtcbiAgICByZXF1aXJlZDogJ1Bha29sbGluZW4qJyxcbiAgICByYWRpdXM6ICdTw6RkZScsXG4gICAgd2VpZ2h0OiAnUGFpbm90dXMnLFxuICAgIHByb3BlcnR5QmFzZWRPbjogJ3twcm9wZXJ0eX0gcGVydXN0dWVuIGFydm9vbicsXG4gICAgY29sb3I6ICdWw6RyaScsXG4gICAgZmlsbENvbG9yOiAnVMOkeXTDtm4gdsOkcmknLFxuICAgIG91dGxpbmU6ICfDpMOkcml2aWl2YScsXG4gICAgY292ZXJhZ2U6ICdLYXR0YXZ1dXMnLFxuICAgIHN0cm9rZTogJ1ZpaXZhJyxcbiAgICBzdHJva2VXaWR0aDogJ1ZpaXZhbiBwYWtzdXVzJyxcbiAgICBzdHJva2VDb2xvcjogJ1ZpaXZhbiB2w6RyaScsXG4gICAgYmFzaWM6ICdQZXJ1cycsXG4gICAgdHJhaWxMZW5ndGg6ICdKw6RsamVuIHBpdHV1cycsXG4gICAgdHJhaWxMZW5ndGhEZXNjcmlwdGlvbjogJ0rDpGxqZW4ga2VzdG8gc2VrdW50ZWluYSwgZW5uZW5rdWluIHNlIGhpbW1lbmVlIG7DpGt5dmlzdMOkJyxcbiAgICBuZXdMYXllcjogJ3V1c2kgdGFzbycsXG4gICAgZWxldmF0aW9uQnlEZXNjcmlwdGlvbjogJ0t1biBhc2V0dXMgb24gcG9pcyBww6TDpGx0w6QsIGtvcmtldXMgcGVydXN0dXUgcGlzdGVpZGVuIG3DpMOkcsOkw6RuJyxcbiAgICBjb2xvckJ5RGVzY3JpcHRpb246ICdLdW4gYXNldHVzIG9uIHBvaXMgcMOkw6RsdMOkLCB2w6RyaSBwZXJ1c3R1dSBwaXN0ZWlkZW4gbcOkw6Ryw6TDpG4nLFxuICAgIGFnZ3JlZ2F0ZUJ5OiAnQWdncmVnb2kga2VudHTDpCB7ZmllbGR9IGJ5JyxcbiAgICAnM0RNb2RlbCc6ICczRC1tYWxsaScsXG4gICAgJzNETW9kZWxPcHRpb25zJzogJzNELW1hbGxpbiBhc2V0dWtzZXQnLFxuICAgIHR5cGU6IHtcbiAgICAgIHBvaW50OiAncGlzdGUnLFxuICAgICAgYXJjOiAna2FhcmknLFxuICAgICAgbGluZTogJ3ZpaXZhJyxcbiAgICAgIGdyaWQ6ICdydXVkdWtrbycsXG4gICAgICBoZXhiaW46ICdoZXhiaW4nLFxuICAgICAgcG9seWdvbjogJ3BvbHlnb25pJyxcbiAgICAgIGdlb2pzb246ICdnZW9qc29uJyxcbiAgICAgIGNsdXN0ZXI6ICdrbHVzdGVyaScsXG4gICAgICBpY29uOiAna3V2YScsXG4gICAgICBoZWF0bWFwOiAnbMOkbXDDtmthcnR0YScsXG4gICAgICBoZXhhZ29uOiAna3V1c2lrdWxtaW8nLFxuICAgICAgaGV4YWdvbmlkOiAnSDMnLFxuICAgICAgdHJpcDogJ21hdGthJyxcbiAgICAgIHMyOiAnUzInLFxuICAgICAgJzNkJzogJzNEJ1xuICAgIH1cbiAgfSxcbiAgbGF5ZXJWaXNDb25maWdzOiB7XG4gICAgc3Ryb2tlV2lkdGg6ICdWaWl2YW4gcGFrc3V1cycsXG4gICAgc3Ryb2tlV2lkdGhSYW5nZTogJ1ZpaXZhbiBwYWtzdXVkZW4gcmFqYXQnLFxuICAgIHJhZGl1czogJ1PDpGRlJyxcbiAgICBmaXhlZFJhZGl1czogJ1Zha2lvc8OkZGUgbWV0cmVpbsOkJyxcbiAgICBmaXhlZFJhZGl1c0Rlc2NyaXB0aW9uOiAnS2FydGFuIHPDpGRlIGFic29sdXV0dGlzZWtzaSBzw6R0ZWVrc2kgbWV0cmVpbsOkLCBlc2ltLiA1IC0+IDUgbWV0cmlpbicsXG4gICAgcmFkaXVzUmFuZ2U6ICdTw6R0ZWVuIHJhamF0JyxcbiAgICBjbHVzdGVyUmFkaXVzOiAnS2x1c3RlcmllbiBzw6RkZSBwaWtzZWxlaW7DpCcsXG4gICAgcmFkaXVzUmFuZ2VQaXhlbHM6ICdTw6R0ZWVuIHJhamF0IHBpa3NlbGVpbsOkJyxcbiAgICBvcGFjaXR5OiAnTMOkcGluw6RreXZ5eXMnLFxuICAgIGNvdmVyYWdlOiAnS2F0dGF2dXVzJyxcbiAgICBvdXRsaW5lOiAnw4TDpHJpdmlpdmEnLFxuICAgIGNvbG9yUmFuZ2U6ICdWw6RyaWVuIHJhamF0JyxcbiAgICBzdHJva2U6ICdWaWl2YScsXG4gICAgc3Ryb2tlQ29sb3I6ICdWaWl2YW4gdsOkcmknLFxuICAgIHN0cm9rZUNvbG9yUmFuZ2U6ICdWaWl2YW4gdsOkcmluIHJhamF0JyxcbiAgICB0YXJnZXRDb2xvcjogJ0tvaHRlZW4gdsOkcmknLFxuICAgIGNvbG9yQWdncmVnYXRpb246ICdWw6RyaWVuIGFnZ3JlZ29pbnRpJyxcbiAgICBoZWlnaHRBZ2dyZWdhdGlvbjogJ0tvcmtldWRlbiBhZ2dyZWdvaW50aScsXG4gICAgcmVzb2x1dGlvblJhbmdlOiAnUmVzb2x1dXRpb24gcmFqYXQnLFxuICAgIHNpemVTY2FsZTogJ0tvb24gc2thYWxhJyxcbiAgICB3b3JsZFVuaXRTaXplOiAnWWtzaWtrw7YnLFxuICAgIGVsZXZhdGlvblNjYWxlOiAnS29yb3R0YW1pc2VuIHNrYWFsYScsXG4gICAgaGVpZ2h0U2NhbGU6ICdLb3JrZXVkZW4gc2thYWxhJyxcbiAgICBjb3ZlcmFnZVJhbmdlOiAnUGVpdHTDpHZ5eWRlbiByYWphdCcsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZzogJ1RhcmtrYSByZW5kZXLDtmludGknLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbjogJ1RhcmtrYSByZW5kZXLDtmludGkgam9odGFhIGhpdGFhbXBhYW4gc3Vvcml0dGFtaXNlZW4nLFxuICAgIGhlaWdodDogJ0tvcmtldXMnLFxuICAgIGhlaWdodERlc2NyaXB0aW9uOiAnS2xpa2thYSBvaWtlYXN0YSB5bMOkbnVya2FzdGEgbmFwcGlhIHZhaWh0YWFrc2VzaSAzRC1uw6RreW3DpMOkbicsXG4gICAgZmlsbDogJ1TDpHl0dMO2JyxcbiAgICBlbmFibGVQb2x5Z29uSGVpZ2h0OiAnU2FsbGkgcG9seWdvbmllbiBrb3JrZXVzJyxcbiAgICBzaG93V2lyZWZyYW1lOiAnTsOkeXTDpCByYXV0YWxhbmthbWFsbGknLFxuICAgIHdlaWdodEludGVuc2l0eTogJ1BhaW5vdHVrc2VuIGludGVuc2l0ZWV0dGknLFxuICAgIHpvb21TY2FsZTogJ1pvb21hdXNza2FhbGEnLFxuICAgIGhlaWdodFJhbmdlOiAnS29ya2V1ZGVuIHJhamF0J1xuICB9LFxuICBsYXllck1hbmFnZXI6IHtcbiAgICBhZGREYXRhOiAnTGlzw6TDpCBhaW5laXN0bycsXG4gICAgYWRkTGF5ZXI6ICdMaXPDpMOkIHRhc28nLFxuICAgIGxheWVyQmxlbmRpbmc6ICdUYXNvamVuIHNla29pdHR1dnV1cydcbiAgfSxcbiAgbWFwTWFuYWdlcjoge1xuICAgIG1hcFN0eWxlOiAnS2FydGFuIHR5eWxpJyxcbiAgICBhZGRNYXBTdHlsZTogJ0xpc8Okw6QgdHl5bGkga2FydGFsbGUnLFxuICAgICczZEJ1aWxkaW5nQ29sb3InOiAnM0QtcmFrZW5udXN0ZW4gdsOkcmknXG4gIH0sXG4gIGxheWVyQ29uZmlndXJhdGlvbjoge1xuICAgIGRlZmF1bHREZXNjcmlwdGlvbjogJ0xhc2tlIHN1dXJlZW4ge3Byb3BlcnR5fSBhcnZvIHZhbGl0dW4ga2VudMOkbiBwZXJ1c3RlZWxsYScsXG4gICAgaG93VG86ICdNaXRlbiB0b2ltaWknXG4gIH0sXG4gIGZpbHRlck1hbmFnZXI6IHtcbiAgICBhZGRGaWx0ZXI6ICdMaXPDpMOkIHN1b2RhdGluJ1xuICB9LFxuICBkYXRhc2V0VGl0bGU6IHtcbiAgICBzaG93RGF0YVRhYmxlOiAnTsOkeXTDpCBhdHRyaWJ1dXR0aXRhdWx1JyxcbiAgICByZW1vdmVEYXRhc2V0OiAnUG9pc3RhIGFpbmVpc3RvJ1xuICB9LFxuICBkYXRhc2V0SW5mbzoge1xuICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSByaXZpw6QnXG4gIH0sXG4gIHRvb2x0aXA6IHtcbiAgICBoaWRlTGF5ZXI6ICdQaWlsb3RhIHRhc28nLFxuICAgIHNob3dMYXllcjogJ07DpHl0w6QgdGFzbycsXG4gICAgaGlkZUZlYXR1cmU6ICdQaWlsb3RhIGtvaGRlJyxcbiAgICBzaG93RmVhdHVyZTogJ07DpHl0w6Qga29oZGUnLFxuICAgIGhpZGU6ICdwaWlsb3RhJyxcbiAgICBzaG93OiAnbsOkeXTDpCcsXG4gICAgcmVtb3ZlTGF5ZXI6ICdQb2lzdGEgdGFzbycsXG4gICAgbGF5ZXJTZXR0aW5nczogJ1Rhc29uIGFzZXR1a3NldCcsXG4gICAgY2xvc2VQYW5lbDogJ1N1bGplIHBhbmVlbGknLFxuICAgIHN3aXRjaFRvRHVhbFZpZXc6ICdWYWloZGEga2Frc29pc2thcnJ0YW7DpGt5bcOkw6RuJyxcbiAgICBzaG93TGVnZW5kOiAnTsOkeXTDpCBzZWxpdGUnLFxuICAgIGRpc2FibGUzRE1hcDogJ1BvaXN0dSAzRC1uw6RreW3DpHN0w6QnLFxuICAgIERyYXdPbk1hcDogJ1BpaXJyw6Qga2FydGFsbGUnLFxuICAgIHNlbGVjdExvY2FsZTogJ1ZhbGl0c2Uga2llbGlzeXlzJyxcbiAgICBoaWRlTGF5ZXJQYW5lbDogJ1BpaWxvdGEgdGFzb3BhbmVlbGknLFxuICAgIHNob3dMYXllclBhbmVsOiAnTsOkeXTDpCB0YXNvcGFuZWVsaScsXG4gICAgbW92ZVRvVG9wOiAnU2lpcnLDpCB0YXNvamVuIHDDpMOkbGxpbW3DpGlzZWtzaScsXG4gICAgc2VsZWN0QmFzZU1hcFN0eWxlOiAnVmFsaXRzZSB0YXVzdGFrYXJ0dGF0eXlsaScsXG4gICAgZGVsZXRlOiAnUG9pc3RhJyxcbiAgICB0aW1lUGxheWJhY2s6ICdBamFuIGFuaW1vaW50aScsXG4gICAgY2xvdWRTdG9yYWdlOiAnUGlsdml0YWxsZW5udXMnLFxuICAgICczRE1hcCc6ICczRC1uw6RreW3DpCdcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnVmllIGt1dmEnLFxuICAgIGV4cG9ydERhdGE6ICdWaWUgYWluZWlzdG90JyxcbiAgICBleHBvcnRNYXA6ICdWaWUga2FydHRhJyxcbiAgICBzaGFyZU1hcFVSTDogJ0phYSBrYXJ0YW4gVVJMJyxcbiAgICBzYXZlTWFwOiAnVGFsbGVubmEga2FydHRhJyxcbiAgICBzZWxlY3Q6ICd2YWxpdHNlJyxcbiAgICBwb2x5Z29uOiAncG9seWdvbmknLFxuICAgIHJlY3RhbmdsZTogJ25lbGlrdWxtaW8nLFxuICAgIGhpZGU6ICdwaWlsb3RhJyxcbiAgICBzaG93OiAnbsOkeXTDpCcsXG4gICAgLi4uTE9DQUxFU1xuICB9LFxuICBtb2RhbDoge1xuICAgIHRpdGxlOiB7XG4gICAgICBkZWxldGVEYXRhc2V0OiAnUG9pc3RhIGFpbmVpc3RvJyxcbiAgICAgIGFkZERhdGFUb01hcDogJ0xpc8Okw6QgYWluZWlzdG9qYSBrYXJ0YWxsZScsXG4gICAgICBleHBvcnRJbWFnZTogJ1ZpZSBrdXZhJyxcbiAgICAgIGV4cG9ydERhdGE6ICdWaWUgYWluZWlzdG90JyxcbiAgICAgIGV4cG9ydE1hcDogJ1ZpZSBrYXJ0dGEnLFxuICAgICAgYWRkQ3VzdG9tTWFwYm94U3R5bGU6ICdMaXPDpMOkIG9tYSBNYXBib3gtdHl5bGknLFxuICAgICAgc2F2ZU1hcDogJ1RhbGxlbm5hIGthcnR0YScsXG4gICAgICBzaGFyZVVSTDogJ0phYSBVUkwnXG4gICAgfSxcbiAgICBidXR0b246IHtcbiAgICAgIGRlbGV0ZTogJ1BvaXN0YScsXG4gICAgICBkb3dubG9hZDogJ0xhdGFhJyxcbiAgICAgIGV4cG9ydDogJ1ZpZScsXG4gICAgICBhZGRTdHlsZTogJ0xpc8Okw6QgdHl5bGknLFxuICAgICAgc2F2ZTogJ1RhbGxlbm5hJyxcbiAgICAgIGRlZmF1bHRDYW5jZWw6ICdQZXJ1JyxcbiAgICAgIGRlZmF1bHRDb25maXJtOiAnVmFodmlzdGEnXG4gICAgfSxcbiAgICBleHBvcnRJbWFnZToge1xuICAgICAgcmF0aW9UaXRsZTogJ0t1dmFzdWhkZScsXG4gICAgICByYXRpb0Rlc2NyaXB0aW9uOiAnVmFsaXRzZSBzb3BpdmEga3V2YXN1aGRlIGvDpHl0dMO2dGFwYXVzdGFzaSB2YXJ0ZW4uJyxcbiAgICAgIHJhdGlvT3JpZ2luYWxTY3JlZW46ICdBbGt1cGVyw6RpbmVuIG7DpHl0dMO2JyxcbiAgICAgIHJhdGlvQ3VzdG9tOiAnS3VzdG9tb2l0dScsXG4gICAgICByYXRpbzRfMzogJzQ6MycsXG4gICAgICByYXRpbzE2Xzk6ICcxNjo5JyxcbiAgICAgIHJlc29sdXRpb25UaXRsZTogJ1Jlc29sdXV0aW8nLFxuICAgICAgcmVzb2x1dGlvbkRlc2NyaXB0aW9uOiAnS29ya2VhIHJlc29sdXV0aW8gb24gcGFyZW1waSB0dWxvc3RhbWlzdGEgdmFydGVuLicsXG4gICAgICBtYXBMZWdlbmRUaXRsZTogJ0thcnRhbiBzZWxpdGUnLFxuICAgICAgbWFwTGVnZW5kQWRkOiAnTGlzw6TDpCBzZWxpdGUga2FydHRhYW4nXG4gICAgfSxcbiAgICBleHBvcnREYXRhOiB7XG4gICAgICBkYXRhc2V0VGl0bGU6ICdBaW5laXN0b3QnLFxuICAgICAgZGF0YXNldFN1YnRpdGxlOiAnVmFsaXRzZSBhaW5laXN0bywgam9ua2EgYWlvdCB2aWVkw6QnLFxuICAgICAgYWxsRGF0YXNldHM6ICdLYWlra2knLFxuICAgICAgZGF0YVR5cGVUaXRsZTogJ0FpbmVpc3RvamVuIGZvcm1hYXR0aScsXG4gICAgICBkYXRhVHlwZVN1YnRpdGxlOiAnVmFsaXRzZSBhaW5laXN0b2Zvcm1hYXR0aSB2YWxpdHNlbWlsbGVzaSBhaW5laXN0b2lsbGUnLFxuICAgICAgZmlsdGVyRGF0YVRpdGxlOiAnU3VvZGF0YSBhaW5laXN0b2phJyxcbiAgICAgIGZpbHRlckRhdGFTdWJ0aXRsZTogJ1ZvaXQgdmllZMOkIGpva28gYWxrdXBlcsOkaXNldCBhaW5laXN0b3QgdGFpIHN1b2RhdGV0dXQgYWluZWlzdG90JyxcbiAgICAgIGZpbHRlcmVkRGF0YTogJ1N1b2RhdGV0dXQgYWluZWlzdG90JyxcbiAgICAgIHVuZmlsdGVyZWREYXRhOiAnU3VvZGF0dGFtYXR0b21hdCBhaW5laXN0b3QnLFxuICAgICAgZmlsZUNvdW50OiAne2ZpbGVDb3VudH0gdGllZG9zdG9hJyxcbiAgICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSByaXZpw6QnXG4gICAgfSxcbiAgICBkZWxldGVEYXRhOiB7XG4gICAgICB3YXJuaW5nOiAnYWlvdCBwb2lzdGFhIHTDpG3DpG4gYWluZWlzdG9uLiBBaW5lb3N0b2Ega8OkeXR0w6R2aWVuIHRhc29qZW4gbHVrdW3DpMOkcsOkOiB7bGVuZ3RofSdcbiAgICB9LFxuICAgIGFkZFN0eWxlOiB7XG4gICAgICBwdWJsaXNoVGl0bGU6ICcxLiBKdWxrYWlzZSB0eXlsaXNpIE1hcGJveGlzc2EgdGFpIGFubmEgdHVubmlzdGUnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMTogJ1ZvaXQgbHVvZGEgb21hbiBrYXJ0dGF0eXlsaXNpIHNpdnVsbGEnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMjogJ2phJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTM6ICdqdWxrYWlzdGEnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNDogJ3Nlbi4nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNTogJ0vDpHl0dMOkw6Rrc2VzaSB5a3NpdHlpc3TDpCB0eXlsacOkLCBsaWl0w6QnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNjogJ3R1bm5pc3RlZXNpJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTc6XG4gICAgICAgICd0w6RubmUuICprZXBsZXIuZ2wgb24gY2xpZW50LXNpZGUgc292ZWxsdXMsIGRhdGEgcHlzeXkgdmFpbiBzZWxhaW1lc3Nhc2kuLi4nLFxuICAgICAgZXhhbXBsZVRva2VuOiAnZXNpbS4gcGsuYWJjZGVmZy54eHh4eHgnLFxuICAgICAgcGFzdGVUaXRsZTogJzIuIExpaXTDpCB0eXlsaS1VUkwnLFxuICAgICAgcGFzdGVTdWJ0aXRsZTE6ICdNaWvDpCBvbicsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogJ3R5eWxpLVVSTD8nLFxuICAgICAgbmFtaW5nVGl0bGU6ICczLiBOaW1lw6QgdHl5bGlzaSdcbiAgICB9LFxuICAgIHNoYXJlTWFwOiB7XG4gICAgICBzaGFyZVVyaVRpdGxlOiAnSmFhIGthcnRhbiBVUkwnLFxuICAgICAgc2hhcmVVcmlTdWJ0aXRsZTogJ0x1byBrYXJ0YWxsZSBVUkwsIGpvbmthIHZvaXQgamFrYWEgbXVpZGVuIGthbnNzYScsXG4gICAgICBjbG91ZFRpdGxlOiAnUGlsdml0YWxsZW5udXMnLFxuICAgICAgY2xvdWRTdWJ0aXRsZTpcbiAgICAgICAgJ0tpcmphdWR1IHNpc8Okw6RuIGphIGxhdGFhIGthcnR0YSBqYSBhaW5laXN0b3QgaGVua2lsw7Zrb2h0YWlzZWVuIHBpbHZpcGFsdmVsdXVuJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCB0YWxsZW50YWEga2FydGFuIGRhdGFuIGhlbmtpbMO2a29odGFpc2VlbiBwaWx2aXRhbGxlbm51c3RpbGFhc2ksIHZhaW4gaWhtaXNldCwgam9pbGxhIG9uIFVSTCwgdm9pdmF0IHDDpMOkc3TDpCBrw6RzaWtzaSBrYXJ0dGFhbiBqYSBhaW5laXN0b2loaW4uICcgK1xuICAgICAgICAnVm9pdCBtdW9rYXRhIHRpZWRvc3RvamEgdGFpIHBvaXN0YWEgbmUgcGlsdmlwYWx2ZWx1c3Rhc2kgbWlsbG9pbiB2YWluLicsXG4gICAgICBnb3RvUGFnZTogJ01lbmUgS2VwbGVyLmdsIHtjdXJyZW50UHJvdmlkZXJ9IHNpdnVsbGVzaSdcbiAgICB9LFxuICAgIHN0YXR1c1BhbmVsOiB7XG4gICAgICBtYXBVcGxvYWRpbmc6ICdLYXJ0dGFhIGxhZGF0YWFuJyxcbiAgICAgIGVycm9yOiAnVmlyaGUnXG4gICAgfSxcbiAgICBzYXZlTWFwOiB7XG4gICAgICB0aXRsZTogJ1BpbHZpdGFsbGVubnVzJyxcbiAgICAgIHN1YnRpdGxlOiAnS2lyamF1ZHUgc2lzw6TDpG4gcGlsdmlwYWx2ZWx1dXNpIHRhbGxlbnRhYWtzZXNpIGthcnRhbidcbiAgICB9LFxuICAgIGV4cG9ydE1hcDoge1xuICAgICAgZm9ybWF0VGl0bGU6ICdLYXJ0YW4gZm9ybWFhdHRpJyxcbiAgICAgIGZvcm1hdFN1YnRpdGxlOiAnVmFsaXRzZSBmb3JtYWF0dGksIGpvc3NhIHZpZXQga2FydGFuJyxcbiAgICAgIGh0bWw6IHtcbiAgICAgICAgc2VsZWN0aW9uOiAnVmllIGthcnR0YSBpbnRlcmFrdGlpdmlzZW5hIGh0bWwtdGllZG9zdG9uYScsXG4gICAgICAgIHRva2VuVGl0bGU6ICdNYXBib3gtdHVubmlzdGUnLFxuICAgICAgICB0b2tlblN1YnRpdGxlOiAnS8OkeXTDpCBvbWFhIE1hcGJveC10dW5uaXN0ZXR0YXNpIGh0bWwtdGllZG9zdG9zc2EgKHZhbGlubmFpbmVuKScsXG4gICAgICAgIHRva2VuUGxhY2Vob2xkZXI6ICdMaWl0w6QgTWFwYm94LXR1bm5pc3RlZXNpJyxcbiAgICAgICAgdG9rZW5NaXN1c2VXYXJuaW5nOlxuICAgICAgICAgICcqIEpvcyBldCBrw6R5dMOkIG9tYWEgdHVubmlzdGV0dGFzaSwga2FydHRhIHZvaSBsYWthdGEgdG9pbWltYXN0YSBtaWxsb2luIHZhaW4ga3VuIHZhaWhkYW1tZSBvbWFhIHR1bm5pc3RldHRhbW1lIHbDpMOkcmlua8OkeXTDtm4gZXN0w6RtaXNla3NpLiAnLFxuICAgICAgICB0b2tlbkRpc2NsYWltZXI6ICdWb2l0IHZhaWh0YWEgTWFwYm94LXR1bm5pc3RlZXNpIG7DpGlkZW4gb2hqZWlkZW4gYXZ1bGxhOiAnLFxuICAgICAgICB0b2tlblVwZGF0ZTogJ0t1aW5rYSB2YWlodGFhIG9sZW1hc3Nhb2xldmEgTWFwYm94LXR1bm5pc3RlJyxcbiAgICAgICAgbW9kZVRpdGxlOiAnS2FydGFuIHRpbGEnLFxuICAgICAgICBtb2RlU3VidGl0bGUxOiAnVmFsaXRzZSBrYXJ0YW4gdGlsYS4nLFxuICAgICAgICBtb2RlU3VidGl0bGUyOiAnTGlzw6R0aWV0b2phJyxcbiAgICAgICAgbW9kZURlc2NyaXB0aW9uOiAnQW5uYSBrw6R5dHTDpGppZW4ge21vZGV9IGthcnR0YWEnLFxuICAgICAgICByZWFkOiAnbHVrZWEnLFxuICAgICAgICBlZGl0OiAnbXVva2F0YSdcbiAgICAgIH0sXG4gICAgICBqc29uOiB7XG4gICAgICAgIGNvbmZpZ1RpdGxlOiAnS2FydGFuIGFzZXR1a3NldCcsXG4gICAgICAgIGNvbmZpZ0Rpc2NsYWltZXI6XG4gICAgICAgICAgJ0thcnRhbiBhc2V0dWtzZXQgc2lzw6RsdHl2w6R0IEpzb24tdGllZG9zdG9vbi4gSm9zIGvDpHl0w6R0IGtpcmphc3RvYSBrZXBsZXIuZ2wgb21hc3NhIHNvdmVsbHVrc2Vzc2FzaS4gVm9pdCBrb3Bpb2lkYSBhc2V0dWtzZXQgamEgYW50YWEgbmUgZnVua3Rpb2xsZTogJyxcbiAgICAgICAgc2VsZWN0aW9uOlxuICAgICAgICAgICdWaWUga3lzZWlzZW4ga2FydGFuIGFpbmVpc3RvdCBqYSBhc2V0dWtzZXQgeWhkZXNzw6QganNvbi10aWVkb3N0b3NzYS4gVm9pdCBtecO2aGVtbWluIGF2YXRhIHNhbWFuIGthcnRhbiBsYXRhYW1hbGxhIHRpZWRvc3RvbiBrZXBsZXIuZ2w6bicsXG4gICAgICAgIGRpc2NsYWltZXI6XG4gICAgICAgICAgJyogS2FydGFuIGFzZXR1a3NldCBvdmF0IHNpZG9rc2lzc2EgbGFkYXR0dWloaW4gYWluZWlzdG9paGluLiBBcnZvYSDigJhkYXRhSWTigJkga8OkeXRldMOkw6RuIHRhc29qZW4sIHN1b2RhdHRpbWllbiBqYSB2aWhqZWlkZW4gbGlpdHTDpG1pc2Vrc2kgdGlldHR5eW4gYWluZWlzdG9vbi4gJyArXG4gICAgICAgICAgJ1Zhcm1pc3RhLCBldHTDpCBhaW5laXN0b24gZGF0YUlkOnQgdmFzdGFhdmF0IGFzZXR1c3RlbiBhcnZvamEgam9zIGxhdGFhdCBhc2V0dWtzZXQga8OkeXR0w6RlbiBgYWRkRGF0YVRvTWFwYC1mdW5rdGlvbGxlLidcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRpbmdEaWFsb2c6IHtcbiAgICAgIGxvYWRpbmc6ICdMYWRhdGFhbi4uLidcbiAgICB9LFxuICAgIGxvYWREYXRhOiB7XG4gICAgICB1cGxvYWQ6ICdMYXRhYSB0aWVkb3N0b3QnLFxuICAgICAgc3RvcmFnZTogJ0xhdGFhIHRhbGxlbm51c3RpbGFzdGEnXG4gICAgfSxcbiAgICB0cmlwSW5mbzoge1xuICAgICAgdGl0bGU6ICdLdWlua2Ega8OkeXR0w6TDpCBtYXRrYS1hbmltYWF0aW90YScsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdSZWl0aW4gYW5pbW9pbWlzZWtzaSBnZW9KU09OLWFpbmVpc3RvbiB0w6R5dHl5IG9sbGEgZ2VvbWV0cmlhdHl5cGlsdMOkw6RuIGBMaW5lU3RyaW5nYCwgTGluZVN0cmluZy1rb29yZGluYWF0dGllbiB0w6R5dHl5IHNpc8OkbHTDpMOkIDQgZWxlbWVudHRpw6QgZm9ybWFhdGlzc2E6JyxcbiAgICAgIGNvZGU6ICcgW3BpdHV1c2FzdGUsIGxldmV5c2FzdGUsIGtvcmtldXMsIGFpa2FsZWltYV0gJyxcbiAgICAgIGRlc2NyaXB0aW9uMjpcbiAgICAgICAgJ3NpdGVuLCBldHTDpCB2aWltZWluZW4gZWxlbWVudHRpIG9uIGFpa2FsZWltYS4gQWlrYWxlaW1hIHZvaSBvbGxhIG11b2RvbHRhYW4gdW5peC1zZWt1bnRlamEsIGt1dGVuIGAxNTY0MTg0MzYzYCB0YWkgbWlsbGlzZWt1bnRlamEsIGt1dGVuIGAxNTY0MTg0MzYzMDAwYC4nLFxuICAgICAgZXhhbXBsZTogJ0VzaW1lcmtraTonXG4gICAgfSxcbiAgICBpY29uSW5mbzoge1xuICAgICAgdGl0bGU6ICdNaXRlbiBwaWlydMOkw6Qga3V2aWEnLFxuICAgICAgZGVzY3JpcHRpb24xOlxuICAgICAgICAnY3N2LXRpZWRvc3Rvc3Nhc2ksIGx1byBzYXJha2UgbmltZWx0w6QgaWNvbi4gVm9pdCBqw6R0dMOkw6Qgc2VuIHR5aGrDpGtzaSBqb3MgZXQgaGFsdWEgcGlpcnTDpMOkIGt1dmFhIGpvaWxsYWluIHBpc3RlaWxsw6QuIEt1biBzYXJha2tlZW4gbmltaSBvbiAnLFxuICAgICAgY29kZTogJ2ljb24nLFxuICAgICAgZGVzY3JpcHRpb24yOiAnIGtlcGxlci5nbCBsdW8gYXV0b21hYXR0aXNlc3RpIGt1dmF0YXNvbiBzaW51YSB2YXJ0ZW4uJyxcbiAgICAgIGV4YW1wbGU6ICdFc2ltZXJra2k6JyxcbiAgICAgIGljb25zOiAnS3V2YXQnXG4gICAgfSxcbiAgICBzdG9yYWdlTWFwVmlld2VyOiB7XG4gICAgICBsYXN0TW9kaWZpZWQ6ICdWaWltZWtzaSBtdW9rYXR0dSB7bGFzdFVwZGF0ZWR9IHNpdHRlbicsXG4gICAgICBiYWNrOiAnVGFrYWlzaW4nXG4gICAgfSxcbiAgICBvdmVyd3JpdGVNYXA6IHtcbiAgICAgIHRpdGxlOiAnVGFsbGVubmV0YWFuIGthcnR0YWEuLi4nLFxuICAgICAgYWxyZWFkeUV4aXN0czogJ29uIGpvIHttYXBTYXZlZH06c3NhLiBIYWx1YXRrbyB5bGlraXJqb2l0dGFhIHNlbj8nXG4gICAgfSxcbiAgICBsb2FkU3RvcmFnZU1hcDoge1xuICAgICAgYmFjazogJ1Rha2Fpc2luJyxcbiAgICAgIGdvVG9QYWdlOiAnTWVuZSBLZXBsZXIuZ2wge2Rpc3BsYXlOYW1lfSBzaXZ1bGxlc2knLFxuICAgICAgc3RvcmFnZU1hcHM6ICdUYWxsZW5udXMgLyBLYXJ0YXQnLFxuICAgICAgbm9TYXZlZE1hcHM6ICdFaSB0YWxsZW5uZXR0dWphIGthcnR0b2phIHZpZWzDpCdcbiAgICB9XG4gIH0sXG4gIGhlYWRlcjoge1xuICAgIHZpc2libGVMYXllcnM6ICdOw6RreXZpc3PDpCBvbGV2YXQgdGFzb3QnLFxuICAgIGxheWVyTGVnZW5kOiAnVGFzb24gc2VsaXRlJ1xuICB9LFxuICBpbnRlcmFjdGlvbnM6IHtcbiAgICB0b29sdGlwOiAnVmloamUnLFxuICAgIGJydXNoOiAnSGFyamEnLFxuICAgIGNvb3JkaW5hdGU6ICdLb29yZGluYWF0aXQnXG4gIH0sXG4gIGxheWVyQmxlbmRpbmc6IHtcbiAgICB0aXRsZTogJ1Rhc29qZW4gc2Vrb2l0dHV2dXVzJyxcbiAgICBhZGRpdGl2ZTogJ2xpc8Okw6R2w6QnLFxuICAgIG5vcm1hbDogJ25vcm1hYWxpJyxcbiAgICBzdWJ0cmFjdGl2ZTogJ3bDpGhlbnTDpHbDpCdcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAnU2FyYWtrZWV0JyxcbiAgICBsYXQ6ICdsYXQnLFxuICAgIGxuZzogJ2xuZycsXG4gICAgYWx0aXR1ZGU6ICdrb3JrZXVzJyxcbiAgICBpY29uOiAna3V2YScsXG4gICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgIGFyYzoge1xuICAgICAgbGF0MDogJ2zDpGhkw7ZuIGxhdCcsXG4gICAgICBsbmcwOiAnbMOkaGTDtm4gbG5nJyxcbiAgICAgIGxhdDE6ICdrb2h0ZWVuIGxhdCcsXG4gICAgICBsbmcxOiAna29odGVlbiBsbmcnXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiAnUnV1dHVqZW4ga29rbyAoa20pJ1xuICAgIH0sXG4gICAgaGV4YWdvbjoge1xuICAgICAgd29ybGRVbml0U2l6ZTogJ0hleGFnb25pZW4gc8OkZGUgKGttKSdcbiAgICB9XG4gIH0sXG4gIGNvbG9yOiB7XG4gICAgY3VzdG9tUGFsZXR0ZTogJ011a2F1dGV0dHUgcGFsZXR0aScsXG4gICAgc3RlcHM6ICdhc2tlbGVldCcsXG4gICAgdHlwZTogJ3R5eXBwaScsXG4gICAgcmV2ZXJzZWQ6ICdrw6TDpG50ZWluZW4nXG4gIH0sXG4gIHNjYWxlOiB7XG4gICAgY29sb3JTY2FsZTogJ1bDpHJpbiBza2FhbGEnLFxuICAgIHNpemVTY2FsZTogJ0tvb24gc2thYWxhJyxcbiAgICBzdHJva2VTY2FsZTogJ1ZpaXZhbiBwYWtzdXVkZW4gc2thYWxhJyxcbiAgICBzY2FsZTogJ1NrYWFsYSdcbiAgfSxcbiAgZmlsZVVwbG9hZGVyOiB7XG4gICAgbWVzc2FnZTogJ1JhYWhhYSBqYSBwdWRvdGEgdGllZG9zdG9zaSB0w6RubmUnLFxuICAgIGNocm9tZU1lc3NhZ2U6XG4gICAgICAnKkNocm9tZW4ga8OkeXR0w6Rqw6Q6IFJham9pdGEgdGllZG9zdG9rb2tvc2kgMjUwTWI6aGVuLiBKb3MgaGFsdWF0IHN1dXJlbXBpYSB0aWVkb3N0b2phLCBrb2tlaWxlIFNhZmFyaWEnLFxuICAgIGRpc2NsYWltZXI6XG4gICAgICAnKmtlcGxlci5nbCBvbiBjbGllbnQtc2lkZSBzb3ZlbGx1cywgZGF0YSBweXN5eSB2YWluIHNlbGFpbWVzc2FzaS4uLicgK1xuICAgICAgJ1RpZXRvamEgZWkgbMOkaGV0ZXTDpCBwYWx2ZWxpbWVsbGUuJyxcbiAgICBjb25maWdVcGxvYWRNZXNzYWdlOlxuICAgICAgJ0xpc8Okw6QgKipDU1YqKiwgKipHZW9Kc29uKiogdGFpIHRhbGxlbm5ldHR1IGthcnR0YSAqKkpzb24qKi4gTHVlIGxpc8Okw6QgWyoqdHVldHVpc3RhIGZvcm1hYXRlaXN0YSoqXScsXG4gICAgYnJvd3NlRmlsZXM6ICdzZWxhYSB0aWVkb3N0b2phc2knLFxuICAgIHVwbG9hZGluZzogJ2xhZGF0YWFuJyxcbiAgICBmaWxlTm90U3VwcG9ydGVkOiAnVGllZG9zdG8ge2Vycm9yRmlsZXN9IGVpIG9sZSB0dWV0dHUuJyxcbiAgICBvcjogJ3RhaSdcbiAgfSxcbiAgZGVuc2l0eTogJ3RpaGV5cycsXG4gICdCdWcgUmVwb3J0JzogJ0J1Z2lyYXBvcnRvaW50aScsXG4gICdVc2VyIEd1aWRlJzogJ09wYXMnLFxuICBTYXZlOiAnVGFsbGVubmEnLFxuICBTaGFyZTogJ0phYSdcbn07XG4iXX0=