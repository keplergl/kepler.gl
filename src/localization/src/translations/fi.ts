// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LOCALES} from '../locales';

export default {
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
    empty: 'tyhjä',
    selectLayer: 'Valitse taso'
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
    '3dBuilding': '3d-rakennukset',
    background: 'Tausta'
  },
  panel: {
    text: {
      label: 'Nimiö',
      labelWithId: 'Nimiö {labelId}',
      fontSize: 'Fontin koko',
      fontWeight: 'Fontin paino',
      fontColor: 'Fontin väri',
      backgroundColor: 'Taustaväri',
      textAnchor: 'Tekstin ankkuri',
      alignment: 'Sijoittelu',
      addMoreLabel: 'Lisää uusia nimiöitä',
      outlineWidth: 'Ääriviivan leveys',
      outlineColor: 'Ääriviivan väri'
    }
  },
  sidebar: {
    panels: {
      layer: 'Tasot',
      filter: 'Suodattimet',
      interaction: 'Interaktiot',
      basemap: 'Taustakartta'
    },
    panelViewToggle: {
      list: 'Näytä lista',
      byDataset: 'Näytä aineistoittain'
    }
  },
  layer: {
    required: 'Pakollinen*',
    columnModesSeparator: 'Tai',
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
    service: 'Palvelu',
    layer: 'Taso',
    appearance: 'Ulkoasu',
    uniqueIdField: 'Yksilöivä ID-kenttä',
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
      '3d': '3D',
      flow: 'virtaus',
      vectortile: 'vektoritiili',
      rastertile: 'rasteritiili',
      wms: 'WMS',
      tile3d: '3D-tiili'
    },
    wms: {
      hover: 'Arvo:'
    },
    layerUpdateError:
      'Tason päivityksen aikana tapahtui virhe: {errorMessage}. Varmista, että syötetietojen muoto on kelvollinen.',
    interaction: 'Vuorovaikutus',
    heatmap: 'Heatmap',
    aggregation: 'Aggregation'
  },
  layerVisConfigs: {
    angle: 'Kulma',
    strokeWidth: 'Viivan paksuus',
    strokeWidthRange: 'Viivan paksuuden rajat',
    radius: 'Säde',
    fixedRadius: 'Vakiosäde metreinä',
    fixedRadiusDescription: 'Kartan säde absoluuttiseksi säteeksi metreinä, esim. 5 -> 5 metriin',
    radiusRange: 'Säteen rajat',
    clusterRadius: 'Klusterien säde pikseleinä',
    radiusRangePixels: 'Säteen rajat pikseleinä',
    billboard: 'Billboard -tila',
    billboardDescription: 'Suuntaa geometria kameraa kohti',
    fadeTrail: 'Häipyvä polku',
    opacity: 'Läpinäkyvyys',
    pointSize: 'Pisteen koko',
    coverage: 'Kattavuus',
    outline: 'Ääriviiva',
    colorRange: 'Värien rajat',
    stroke: 'Viiva',
    strokeColor: 'Viivan väri',
    strokeColorRange: 'Viivan värin rajat',
    targetColor: 'Kohteen väri',
    colorAggregation: 'Värien aggregointi',
    heightAggregation: 'Korkeuden aggregointi',
    weightAggregation: 'Weight Aggregation',
    resolutionRange: 'Resoluution rajat',
    sizeScale: 'Koon skaala',
    worldUnitSize: 'Yksikkö',
    elevationScale: 'Korottamisen skaala',
    enableElevationZoomFactor: 'Käytä korkeuden zoomauskerrointa',
    enableElevationZoomFactorDescription:
      'Säädä korkeus / korkeus nykyisen zoomauskertoimen perusteella',
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
    intensity: 'Intensity',
    threshold: 'Threshold',
    zoomScale: 'Zoomausskaala',
    heightRange: 'Korkeuden rajat',
    heightMultiplier: 'Korkeuskerroin',
    fixedHeight: 'Kiinteä korkeus',
    fixedHeightDescription: 'Käytä korkeutta ilman muutoksia',
    allowHover: 'Näytä työkaluvihje',
    allowHoverDescription:
      'Näytä tai piilota työkaluvihje, kun osoitin on tason ominaisuuksien päällä',
    flow: {
      fade: 'Häivytys',
      fadeEnabled: 'Häivytys',
      fadeAmount: 'Häivytyksen määrä',
      display: 'Näyttö',
      renderingMode: 'Viivatyyli',
      renderingModes: {
        straight: 'Suora',
        curved: 'Kaareva',
        'animated-straight': 'Animoitu'
      },
      adaptiveScalesEnabled: 'Mukautuvat skaalat',
      clusteringEnabled: 'Klusterointi',
      lineThicknessScale: 'Viivan paksuus',
      lineCurviness: 'Kaarevuus',
      locationTotalsEnabled: 'Sijaintien kokonaismäärät',
      maxTopFlowsDisplayNum: 'Suurin virtausten lukumäärä'
    },
    showNeighborOnHover: 'Korosta naapurit osoittaessa',
    showHighlightColor: 'Näytä korostusväri',
    darkModeEnabled: 'Tumma taustakartta',
    transparentBackground: 'Läpinäkyvä tausta'
  },
  layerManager: {
    addData: 'Lisää aineisto',
    addLayer: 'Lisää taso',
    layerBlending: 'Tasojen sekoittuvuus',
    overlayBlending: 'Päällekkäissekoitus'
  },
  mapManager: {
    mapStyle: 'Kartan tyyli',
    addMapStyle: 'Lisää tyyli kartalle',
    '3dBuildingColor': '3D-rakennusten väri',
    backgroundColor: 'Taustaväri'
  },
  effectManager: {
    effects: 'Efektit',
    addEffect: 'Lisää efekti',
    pickDateTime: 'Valitse päivämäärä/aika',
    currentTime: 'Nykyinen aika',
    pickCurrrentTime: 'Valitse nykyinen aika',
    date: 'Päivämäärä',
    time: 'Aika',
    timezone: 'Aikavyöhyke'
  },
  effectDescription: {
    lightAndShadow:
      'Simuloi realistista auringonvaloa ja varjojen heijastusta vuorokaudenajan ja maantieteellisen sijainnin perusteella. Säädettävä varjon voimakkuus, auringon- ja ympäristövalon värit.',
    ink: 'Käyttää mustepesumaista taiteellista tyyliä, joka tummentaa reunoja ja luo käsin piirretyn ulkoasun. Säädä voimakkuutta tehon hallitsemiseksi.',
    brightnessContrast:
      'Säätää kartan yleistä kirkkautta ja kontrastia. Käytä positiivisia arvoja kirkastaaksesi tai lisätäksesi kontrastia, negatiivisia arvoja tummentaaksesi tai tasoittaaksesi kuvaa.',
    hueSaturation:
      'Siirtää värisävyä ja säätää kylläisyyttä koko kartalla. Hyödyllinen väriteemojen luomiseen tai näkymän värikylläisyyden vähentämiseen.',
    vibrance:
      'Nostaa valikoivasti himeiden värien voimakkuutta ylikyllästämättä jo eläviä värejä. Tuottaa luonnollisemman näköisen värinparannuksen kuin kylläisyys.',
    sepia:
      'Käyttää lämmintä ruskeaa sävyä, joka muistuttaa vanhoja valokuvia. Hallitse määrää sekoittaaksesi alkuperäisten värien ja seepiamaisen ulkoasun välillä.',
    dotScreen:
      'Muuntaa kuvan mustavalkoisten pisteiden kuvioksi, joka muistuttaa sanomalehtien rasteripainatusta. Säädä kulmaa, pisteen kokoa ja keskikohtaa.',
    colorHalftone:
      'Simuloi CMYK-värirasteripinatusta erillisillä pistekuvioilla kullekin värikanavalle. Hallitse kulmaa, pisteen kokoa ja keskikohtaa.',
    noise:
      'Lisää satunnaista filmirakeista kohinaa kartalle. Hyödyllinen teksturoidun, analogisen estetiikan luomiseen tai väriporrastuksen vähentämiseen.',
    triangleBlur:
      'Käyttää tasaista gaussimaista sumennusta tasaisesti kartalla. Hallitse sumennuksen sädettä pehmeyden tason säätämiseksi.',
    zoomBlur:
      'Luo säteittäisen liikesumennuksen, joka lähtee keskipisteestä simuloiden kamerazoomia. Säädä voimakkuutta ja keskikohtaa.',
    tiltShift:
      'Simuloi tilt-shift-linssitehostetta, joka sumentaa tarkennuskaistan ulkopuoliset alueet luoden pienoismallimaisen ulkoasun. Aseta tarkennuskaista alku-/loppukohdilla.',
    edgeWork:
      'Korostaa kuvan rakenteellisia reunoja taiteellisella hiilipiirrostyylillä. Säädä tunnistussädettä viivan paksuuden hallitsemiseksi.',
    vignette:
      'Tummentaa kartan kulmat ja reunat ohjaten huomion keskelle. Hallitse tummentamisen määrää ja kirkkaan alueen sädettä.',
    magnify:
      'Luo pyöreän suurennuslasin peiton asetettavaan kohtaan. Säädä kokoa, zoomaustasoa ja reunuksen leveyttä.',
    hexagonalPixelate:
      'Korvaa kuvan heksagonaalisten laattojen ruudukolla, joista kukin on täytetty kattamansa alueen keskivärillä. Säädä laatan mittakaavaa.',
    distanceFog:
      'Häivyttää kaukaisia kohteita sumuväriksi niiden syvyyden perusteella kamerasta, tehostamalla syvyysvaikutelmaa. Hallitse tiheyttä, alkuetäisyyttä, aluetta ja sumun väriä.',
    surfaceFog:
      'Renderöi sumukerroksen tietyllä korkeudella maanpinnan yläpuolella. Säädä korkeutta, siirtymän paksuutta, tiheyttä, väriä ja valinnaista kohinakuviota.'
  },
  layerConfiguration: {
    defaultDescription: 'Laske suureen {property} arvo valitun kentän perusteella',
    howTo: 'Miten toimii',
    showColorChart: 'Näytä värikartta',
    hideColorChart: 'Piilota värikartta'
  },
  filterManager: {
    addFilter: 'Lisää suodatin',
    timeFilterSync: 'Synkronoidut aineistot',
    timeLayerSync: 'Linkitä tason aikajanaan',
    timeLayerUnsync: 'Poista linkitys tason aikajanasta',
    column: 'Sarake'
  },
  datasetTitle: {
    showDataTable: 'Näytä attribuuttitaulu',
    removeDataset: 'Poista aineisto'
  },
  datasetInfo: {
    rowCount: '{rowCount} riviä',
    vectorTile: 'Vektoritiili',
    rasterTile: 'Rasteritiili',
    wmsTile: 'WMS-tiili',
    tile3d: '3D-tiili'
  },
  tooltip: {
    hideLayer: 'Piilota taso',
    showLayer: 'Näytä taso',
    hideFeature: 'Piilota kohde',
    showFeature: 'Näytä kohde',
    hide: 'piilota',
    show: 'näytä',
    removeLayer: 'Poista taso',
    duplicateLayer: 'Kopioi taso',
    zoomToLayer: 'Zoomaa tasoon',
    resetAfterError: 'Yritä ottaa taso käyttöön virheen jälkeen',
    layerSettings: 'Tason asetukset',
    closePanel: 'Sulje paneeli',
    switchToDualView: 'Vaihda kaksoiskarrtanäkymään',
    showLegend: 'Näytä selite',
    disable3DMap: 'Poistu 3D-näkymästä',
    DrawOnMap: 'Piirrä kartalle',
    selectLocale: 'Valitse kielisyys',
    showAiAssistantPanel: 'Näytä AI-apuohjelman paneeli',
    hideAiAssistantPanel: 'Piilota AI-apuohjelman paneeli',
    hideLayerPanel: 'Piilota tasopaneeli',
    showLayerPanel: 'Näytä tasopaneeli',
    moveToTop: 'Siirrä tasojen päällimmäiseksi',
    selectBaseMapStyle: 'Valitse taustakarttatyyli',
    removeBaseMapStyle: 'Poista taustakartan tyyli',
    delete: 'Poista',
    timePlayback: 'Ajan animointi',
    cloudStorage: 'Pilvitallennus',
    '3DMap': '3D-näkymä',
    mapViewMode: 'Karttanäkymätila',
    mapViewMode2D: '2D',
    mapViewMode3D: '3D',
    mapViewModeGlobe: 'Maapallo',
    animationByWindow: 'Liukuva aikaikkuna',
    animationByIncremental: 'Kasvava aikaikkuna',
    speed: 'nopeus',
    play: 'toista',
    pause: 'tauko',
    reset: 'nollaa',
    export: 'vie',
    timeFilterSync: 'Synkronoi toisen aineiston sarakkeen kanssa',
    syncTimelineStart: 'Nykyisen suodattimen aikajakson alku',
    syncTimelineEnd: 'Nykyisen suodattimen aikajakson loppu',
    showEffectPanel: 'Näytä efektipaneeli',
    hideEffectPanel: 'Piilota efektipaneeli',
    removeEffect: 'Poista efekti',
    disableEffect: 'Poista efekti käytöstä',
    effectSettings: 'Efektiasetukset',
    timeLayerSync: 'Linkitä tason aikajanaan',
    timeLayerUnsync: 'Poista linkitys tason aikajanasta'
  },
  toolbar: {
    exportImage: 'Vie kuva',
    exportData: 'Vie aineistot',
    exportMap: 'Vie kartta',
    exportVideo: 'Vie video',
    shareMapURL: 'Jaa kartan URL',
    saveMap: 'Tallenna kartta',
    select: 'valitse',
    polygon: 'polygoni',
    rectangle: 'nelikulmio',
    hide: 'piilota',
    show: 'näytä',
    ...LOCALES
  },
  editor: {
    filterLayer: 'Suodata tasoja',
    filterLayerDisabled: 'Ei-monikulmiogeometrioita ei voi käyttää suodatukseen',
    copyGeometry: 'Kopioi geometria',
    noLayersToFilter: 'Ei tasoja suodatettavaksi'
  },
  exportVideoModal: {
    animation: 'Animaatio',
    settings: 'Asetukset'
  },
  modal: {
    title: {
      deleteDataset: 'Poista aineisto',
      addDataToMap: 'Lisää aineistoja kartalle',
      exportImage: 'Vie kuva',
      exportData: 'Vie aineistot',
      exportMap: 'Vie kartta',
      exportVideo: 'Vie video',
      addCustomMapboxStyle: 'Lisää oma Mapbox-tyyli',
      saveMap: 'Tallenna kartta',
      shareURL: 'Jaa URL'
    },
    button: {
      delete: 'Poista',
      download: 'Lataa',
      export: 'Vie',
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
      resolutionPlaceholder: 'Valitse resoluutio...',
      mapLegendTitle: 'Kartan selite',
      mapLegendAdd: 'Lisää selite karttaan'
    },
    exportVideo: {
      animation: 'Animaatio',
      settings: 'Asetukset'
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
      rowCount: '{rowCount} riviä',
      tiledDatasetWarning: '* Tietojen vienti tiiliaineistoille ei ole tuettu'
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
      publishSubtitle7:
        'tänne. *kepler.gl on client-side sovellus, data pysyy vain selaimessasi...',
      exampleToken: 'esim. pk.abcdefg.xxxxxx',
      pasteTitle: '2. Liitä tyyli-URL',
      pasteSubtitle0: 'Tyyli-URL voi olla Mapboxin',
      pasteSubtitle1: 'Mikä on',
      pasteSubtitle2: 'tyyli-URL?',
      pasteSubtitle3: 'tai style.json, joka käyttää',
      pasteSubtitle4: 'Mapbox GL Style Spec -määritystä',
      namingTitle: '3. Nimeä tyylisi'
    },
    shareMap: {
      title: 'Jaa kartta',
      shareUriTitle: 'Jaa kartan URL',
      shareUriSubtitle: 'Luo kartalle URL, jonka voit jakaa muiden kanssa',
      cloudTitle: 'Pilvitallennus',
      cloudSubtitle:
        'Kirjaudu sisään ja lataa kartta ja aineistot henkilökohtaiseen pilvipalveluun',
      shareDisclaimer:
        'kepler.gl tallentaa kartan datan henkilökohtaiseen pilvitallennustilaasi, vain ihmiset, joilla on URL, voivat päästä käsiksi karttaan ja aineistoihin. ' +
        'Voit muokata tiedostoja tai poistaa ne pilvipalvelustasi milloin vain.',
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
        tokenMisuseWarning:
          '* Jos et käytä omaa tunnistettasi, kartta voi lakata toimimasta milloin vain kun vaihdamme omaa tunnistettamme väärinkäytön estämiseksi. ',
        tokenSecurityWarning:
          '* Varoitus: Mapbox-tunnisteesi upotetaan vietyyn HTML-tiedostoon. Kuka tahansa, jolla on pääsy tähän tiedostoon, voi nähdä ja käyttää tunnistettasi. Käytä mahdollisuuksien mukaan URL-rajoitettua tunnistetta. ',
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
        configDisclaimer:
          'Kartan asetukset sisältyvät Json-tiedostoon. Jos käytät kirjastoa kepler.gl omassa sovelluksessasi. Voit kopioida asetukset ja antaa ne funktiolle: ',
        selection:
          'Vie kyseisen kartan aineistot ja asetukset yhdessä json-tiedostossa. Voit myöhemmin avata saman kartan lataamalla tiedoston kepler.gl:n',
        disclaimer:
          '* Kartan asetukset ovat sidoksissa ladattuihin aineistoihin. Arvoa ‘dataId’ käytetään tasojen, suodattimien ja vihjeiden liittämiseksi tiettyyn aineistoon. ' +
          'Varmista, että aineiston dataId:t vastaavat asetusten arvoja jos lataat asetukset käyttäen `addDataToMap`-funktiolle.'
      }
    },
    loadingDialog: {
      loading: 'Ladataan...'
    },
    loadData: {
      upload: 'Lataa tiedostot',
      tileset: 'Tiilijoukko',
      storage: 'Lataa tallennustilasta'
    },
    tripInfo: {
      title: 'Kuinka käyttää matka-animaatiota',
      titleTable: 'Luo matkoja pisteluettelosta',
      description1:
        'Reitin animoimiseksi geoJSON-aineiston täytyy olla geometriatyypiltään `LineString`, LineString-koordinaattien täytyy sisältää 4 elementtiä formaatissa:',
      code: ' [pituusaste, leveysaste, korkeus, aikaleima] ',
      description2:
        'siten, että viimeinen elementti on aikaleima. Aikaleima voi olla muodoltaan unix-sekunteja, kuten `1564184363` tai millisekunteja, kuten `1564184363000`.',
      descriptionTable1:
        'Matkat voidaan luoda yhdistämällä luettelo pisteistä leveys- ja pituusasteista, lajittelemalla aikaleiman mukaan ja ryhmittelemällä yksilöivillä tunnuksilla.',
      example: 'Esimerkki:'
    },
    iconInfo: {
      title: 'Miten piirtää kuvia',
      description1:
        'csv-tiedostossasi, luo sarake nimeltä icon. Voit jättää sen tyhjäksi jos et halua piirtää kuvaa joillain pisteillä. Kun sarakkeen nimi on ',
      code: 'icon',
      description2: ' kepler.gl luo automaattisesti kuvatason sinua varten.',
      example: 'Esimerkki:',
      icons: 'Kuvat'
    },
    polygonInfo: {
      title: 'Luo monikulmiotaso GeoJSON-ominaisuudesta',
      titleTable: 'Luo polku pisteistä',
      descriptionTable: `Polut voidaan luoda yhdistämällä luettelo pisteistä leveys- ja pituusasteista, lajittelemalla indeksikentän (esim. aikaleima) mukaan ja ryhmittelemällä yksilöivillä tunnuksilla.

  ### Tason sarakkeet:
  - **id**: - *pakollinen*&nbsp;- \`id\`-saraketta käytetään pisteiden ryhmittelyyn. Pisteet, joilla on sama id, yhdistetään yhdeksi poluksi.
  - **lat**: - *pakollinen*&nbsp;- Pisteen leveysaste
  - **lon**: - *pakollinen*&nbsp;- Pisteen pituusaste
  - **alt**: - *valinnainen*&nbsp;- Pisteen korkeus
  - **sort by**: - *valinnainen*&nbsp;- \`sort by\`-saraketta käytetään pisteiden lajitteluun; jos ei ole määritetty, pisteet lajitellaan rivin indeksin mukaan.
`,
      exampleTable: 'Example CSV'
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
      noSavedMaps: 'Ei tallennettuja karttoja vielä',
      foursquareStorageMessage:
        'Tässä näytetään vain kartat, jotka on tallennettu Kepler.gl > Tallenna > Foursquare-tallennus -vaihtoehdon avulla'
    }
  },
  header: {
    visibleLayers: 'Näkyvissä olevat tasot',
    layerLegend: 'Tason selite'
  },
  interactions: {
    tooltip: 'Vihje',
    brush: 'Harja',
    coordinate: 'Koordinaatit',
    geocoder: 'Geocoder'
  },
  layerBlending: {
    title: 'Tasojen sekoittuvuus',
    additive: 'lisäävä',
    normal: 'normaali',
    subtractive: 'vähentävä'
  },
  overlayBlending: {
    title: 'Kartan päällekkäissekoitus',
    description: 'Sekoita tasot taustakartan kanssa niin, että molemmat näkyvät.',
    screen: 'tumma taustakartta',
    normal: 'normaali',
    darken: 'vaalea taustakartta'
  },
  columns: {
    title: 'Sarakkeet',
    lat: 'lat',
    lng: 'lng',
    altitude: 'korkeus',
    alt: 'korkeus',
    id: 'id',
    timestamp: 'aika',
    icon: 'kuva',
    geojson: 'geojson',
    geoarrow: 'geoarrow',
    geoarrow0: 'geoarrow lähde',
    geoarrow1: 'geoarrow kohde',
    token: 'token',
    sortBy: 'lajittele',
    neighbors: 'naapurit',
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
    },
    flow: {
      source: {
        lat: 'lähteen lat',
        lng: 'lähteen lng',
        name: 'lähteen nimi',
        h3: 'lähteen H3'
      },
      target: {
        lat: 'kohteen lat',
        lng: 'kohteen lng',
        name: 'kohteen nimi',
        h3: 'kohteen H3'
      },
      count: 'lukumäärä'
    },
    hex_id: 'hex id'
  },
  color: {
    customPalette: 'Mukautettu paletti',
    steps: 'askeleet',
    type: 'tyyppi',
    colorBlindSafe: 'Värisokeusturvallinen',
    reversed: 'käänteinen',
    disableStepReason:
      'Askeleiden määrää ei voi muuttaa mukautetuilla värikatkaisuilla, käytä mukautettua palettia muokataksesi askeleita',
    preset: 'Esimääritetyt värit',
    picker: 'Värivalitsin'
  },
  scale: {
    colorScale: 'Värin skaala',
    sizeScale: 'Koon skaala',
    strokeScale: 'Viivan paksuuden skaala',
    strokeColorScale: 'Viivan värin skaala',
    scale: 'Skaala'
  },
  fileUploader: {
    message: 'Raahaa ja pudota tiedostosi tänne',
    chromeMessage:
      '*Chromen käyttäjä: Rajoita tiedostokokosi 250Mb:hen. Jos haluat suurempia tiedostoja, kokeile Safaria',
    disclaimer:
      '*kepler.gl on client-side sovellus, data pysyy vain selaimessasi...' +
      'Tietoja ei lähetetä palvelimelle.',
    configUploadMessage:
      'Lisää {fileFormatNames} tai tallennettu kartta **Json**. Lue lisää [**tuetuista formaateista**]',
    browseFiles: 'selaa tiedostojasi',
    uploading: 'ladataan',
    fileNotSupported: 'Tiedosto {errorFiles} ei ole tuettu.',
    or: 'tai'
  },
  density: 'tiheys',
  'Bug Report': 'Bugiraportointi',
  'User Guide': 'Opas',
  Save: 'Tallenna',
  Share: 'Jaa',
  flow: {
    tooltip: {
      location: {
        name: 'Nimi',
        incomingCount: 'Saapuvat',
        outgoingCount: 'Lähtevät',
        internalCount: 'Sisäiset'
      },
      flow: {
        sourceName: 'Lähtöpaikka',
        targetName: 'Määränpää',
        count: 'Lukumäärä'
      }
    }
  },
  tilesetSetup: {
    header: 'Vektoritiilien asetukset',
    rasterTileHeader: 'Rasteritiilien asetukset',
    addTilesetText: 'Lisää tiilijoukko'
  },
  geocoder: {
    title: 'Syötä osoite tai koordinaatit, esim. 37.79,-122.40'
  },
  fieldSelector: {
    clearAll: 'Tyhjennä kaikki',
    formatting: 'Muotoilu'
  },
  compare: {
    modeLabel: 'Vertailutila',
    typeLabel: 'Vertailutyyppi',
    types: {
      absolute: 'Absoluuttinen',
      relative: 'Suhteellinen'
    }
  },
  mapPopover: {
    primary: 'Ensisijainen'
  },
  mapLegend: {
    layers: {
      line: {
        singleColor: {
          sourceColor: 'Lähde',
          targetColor: 'Kohde'
        }
      },
      arc: {
        singleColor: {
          sourceColor: 'Lähde',
          targetColor: 'Kohde'
        }
      },
      default: {
        singleColor: {
          color: 'Täyttöväri',
          strokeColor: 'Ääriviiva'
        }
      }
    }
  }
};
