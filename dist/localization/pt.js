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
    weight: 'Espessura do texto',
    label: 'Rótulo',
    fillColor: 'Cor do preenchimento',
    color: 'Cor',
    strokeColor: 'Cor da borda',
    radius: 'Raio',
    outline: 'Contorno',
    stroke: 'Traçado',
    density: 'Densidade',
    height: 'Altura',
    sum: 'Soma',
    pointCount: 'Contagem de Pontos'
  },
  placeholder: {
    search: 'Pesquisar',
    selectField: 'Selecione um campo',
    yAxis: 'Eixo Y',
    selectType: 'Selecione um Tipo',
    selectValue: 'Selecione um valor',
    enterValue: 'Insira um valor',
    empty: 'Vazio'
  },
  misc: {
    by: '',
    valuesIn: 'Valores em',
    valueEquals: 'Valor igual a',
    dataSource: 'Origem dos dados',
    brushRadius: 'Raio do Traço (km)',
    empty: ' '
  },
  mapLayers: {
    title: 'Camadas do mapa',
    label: 'Rótulo',
    road: 'Estrada',
    border: 'Fronteira',
    building: 'Edifícios',
    water: 'Água',
    land: 'Terra',
    '3dBuilding': 'Edifícios em 3d'
  },
  panel: {
    text: {
      label: 'Rótulo',
      labelWithId: 'Rótulo {labelId}',
      fontSize: 'Tamanho da fonte',
      fontColor: 'Cor da fonte',
      textAnchor: 'Âncora do texto',
      alignment: 'Alinhamento',
      addMoreLabel: 'Adicionar mais Rótulos'
    }
  },
  sidebar: {
    panels: {
      layer: 'Camadas',
      filter: 'Filtros',
      interaction: 'Interações',
      basemap: 'Mapa base'
    }
  },
  layer: {
    required: 'Obrigatório*',
    radius: 'Raio',
    color: 'Cor',
    fillColor: 'Cor de preenchimento',
    outline: 'Contorno',
    weight: 'Espessura',
    propertyBasedOn: '{property} baseada em',
    coverage: 'Cobertura',
    stroke: 'Traço',
    strokeWidth: 'Largura do Traçado',
    strokeColor: 'Cor do Traçado',
    basic: 'Básico',
    trailLength: 'Comprimento da trilha',
    trailLengthDescription: 'Número de segundos para um caminho completamente desaparecer',
    newLayer: 'nova camada',
    elevationByDescription: 'Quando desligado, a altura é baseada na contagem de pontos',
    colorByDescription: 'Quando desligado, a cor é baseada na contagem de pontos',
    aggregateBy: '{field} agregado por',
    '3DModel': 'Modelo 3D',
    '3DModelOptions': 'Opções do Modelo 3D',
    type: {
      point: 'ponto',
      arc: 'arco',
      line: 'linha',
      grid: 'grade',
      hexbin: 'hexágono',
      polygon: 'polígono',
      geojson: 'geojson',
      cluster: 'grupo',
      icon: 'icon',
      heatmap: 'mapa de calor',
      hexagon: 'hexágono',
      hexagonid: 'H3',
      trip: 'viagem',
      s2: 'S2',
      '3d': '3D'
    }
  },
  layerVisConfigs: {
    strokeWidth: 'Largura do Traço',
    strokeWidthRange: 'Alcance da Largura do Traço',
    radius: 'Raio',
    fixedRadius: 'Raio ajustado para metro',
    fixedRadiusDescription: 'Raio do Mapa para Raio absoluto em metros, e.g. 5 para 5 metros',
    radiusRange: 'Alcance do Raio',
    clusterRadius: 'Raio do Agrupamento em pixels',
    radiusRangePixels: 'Alcance do Raio em pixels',
    opacity: 'Opacidade',
    coverage: 'Cobertura',
    outline: 'Contorno',
    colorRange: 'Alcance da Cor',
    stroke: 'Traçado',
    strokeColor: 'Cor do Traçado',
    strokeColorRange: 'Alcance da Cor do Traçado',
    targetColor: 'Cor de destino',
    colorAggregation: 'Agregação da Cor',
    heightAggregation: 'Agregação da Altura',
    resolutionRange: 'Alcance da Resolução',
    sizeScale: 'Escala de tamanho',
    worldUnitSize: 'Tamanho unitário do mundo',
    elevationScale: 'Escala de Elevação',
    enableElevationZoomFactor: 'Use fator de zoom de elevação',
    enableElevationZoomFactorDescription: 'Ajuste a altura / elevação com base no fator de zoom atual',
    enableHeightZoomFactor: 'Usar fator de zoom de altura',
    heightScale: 'Escala de Altura',
    coverageRange: 'Alcance de cobertura',
    highPrecisionRendering: 'Renderização de Alta Precisão',
    highPrecisionRenderingDescription: 'Alta precisão irá em resultar em baixa performance',
    height: 'Altura',
    heightDescription: 'Clique no botão no canto superior direito para trocar para a visualização 3d',
    fill: 'Preenchimento',
    enablePolygonHeight: 'Habilitar Altura de Polígono',
    showWireframe: 'Mostrar Wireframe',
    weightIntensity: 'Intensidade da Espessura',
    zoomScale: 'Escala do Zoom',
    heightRange: 'Alcance da Altura',
    heightMultiplier: 'Multiplicador de altura'
  },
  layerManager: {
    addData: 'Adicionar Dados',
    addLayer: 'Adicionar Camada',
    layerBlending: 'Mistura de Camada'
  },
  mapManager: {
    mapStyle: 'Estilo do Mapa',
    addMapStyle: 'Adicionar Estilo de Mapa',
    '3dBuildingColor': 'Cor do Edifício 3D'
  },
  layerConfiguration: {
    defaultDescription: 'Calcular {property} baseada no campo selecionado',
    howTo: 'Como'
  },
  filterManager: {
    addFilter: 'Adicionar Filtro'
  },
  datasetTitle: {
    showDataTable: 'Mostrar tabela de dados',
    removeDataset: 'Remover tabela de dados'
  },
  datasetInfo: {
    rowCount: '{rowCount} linhas'
  },
  tooltip: {
    hideLayer: 'esconder camada',
    showLayer: 'mostrar camada',
    hideFeature: 'Esconder propriedade',
    showFeature: 'Mostrar propriedade',
    hide: 'esconder',
    show: 'mostrar',
    removeLayer: 'Remover Camada',
    layerSettings: 'Configurações de Camada',
    closePanel: 'Fechar painel atual',
    switchToDualView: 'Trocar para visualização dupla de mapa',
    showLegend: 'mostrar legenda',
    disable3DMap: 'Desabilitar Mapa 3D',
    DrawOnMap: 'Desenhar no mapa',
    selectLocale: 'Selecionar língua',
    hideLayerPanel: 'Esconder painel de camada',
    showLayerPanel: 'Mostrar painel de camada',
    moveToTop: 'Mover para o topo das camadas',
    selectBaseMapStyle: 'Selecionar o Estilo do Mapa Base',
    "delete": 'Deletar',
    timePlayback: 'Tempo de reprodução',
    cloudStorage: 'Armazenamento Cloud',
    '3DMap': ' Mapa 3D'
  },
  toolbar: _objectSpread({
    exportImage: 'Exportar Imagem',
    exportData: 'Exportar Dados',
    exportMap: 'Exportar Mapa',
    shareMapURL: 'Compartilhar URL do Mapa',
    saveMap: 'Salvar Mapa',
    select: 'selecionar',
    polygon: 'polígono',
    rectangle: 'retângulo',
    hide: 'esconder',
    show: 'mostrar'
  }, _locales.LOCALES),
  modal: {
    title: {
      deleteDataset: 'Deletar Conjunto de Dados',
      addDataToMap: 'Adicionar Dados ao Mapa',
      exportImage: 'Exportar Imagem',
      exportData: 'Exportar Dados',
      exportMap: 'Exportar Mapa',
      addCustomMapboxStyle: 'Adicionar Estilo Mapbox Customizado',
      saveMap: 'Salvar Mapa',
      shareURL: 'Compartilhar URL'
    },
    button: {
      "delete": 'Deletar',
      download: 'Download',
      "export": 'Exportar',
      addStyle: 'Adicionar Estilo',
      save: 'Salvar',
      defaultCancel: 'Cancelar',
      defaultConfirm: 'Confirmar'
    },
    exportImage: {
      ratioTitle: 'Proporção',
      ratioDescription: 'Escolha a proporção para vários usos.',
      ratioOriginalScreen: 'Tela Original',
      ratioCustom: 'Customizado',
      ratio4_3: '4:3',
      ratio16_9: '16:9',
      resolutionTitle: 'Resolução',
      resolutionDescription: 'Alta resolução é melhor para impressões.',
      mapLegendTitle: 'Legenda do Mapa',
      mapLegendAdd: 'Adicionar Legenda no mapa'
    },
    exportData: {
      datasetTitle: 'Conjunto de dados',
      datasetSubtitle: 'Escolha o conjunto de dados que você quer exportar',
      allDatasets: 'Todos',
      dataTypeTitle: 'Tipo de Dado',
      dataTypeSubtitle: 'Escolha o tipo de dados que você quer exportar',
      filterDataTitle: 'Filtrar Dados',
      filterDataSubtitle: 'Você pode escolher exportar os dados originais ou os dados filtrados',
      filteredData: 'Dados Filtrados',
      unfilteredData: 'Dados não filtrados',
      fileCount: '{fileCount} Arquivos',
      rowCount: '{rowCount} Linhas'
    },
    deleteData: {
      warning: 'você irá deletar esse conjunto de dados. Isso irá afetar {length} camadas'
    },
    addStyle: {
      publishTitle: '1. Publique o seu Estilo no Mapbox ou providencie a chave de acesso',
      publishSubtitle1: 'Você pode criar o seu próprio estilo em',
      publishSubtitle2: 'e',
      publishSubtitle3: 'publicar',
      publishSubtitle4: 'isso.',
      publishSubtitle5: 'Para utilizar estilo privado, cole a sua',
      publishSubtitle6: 'chave de acesso',
      publishSubtitle7: 'aqui. *kepler.gl é uma aplicação client-side, os dados permanecem no seu browser..',
      exampleToken: 'e.g. pk.abcdefg.xxxxxx',
      pasteTitle: '2. Cole a url do seu estilo',
      pasteSubtitle1: 'O que é uma',
      pasteSubtitle2: 'URL de estilo',
      namingTitle: '3. Nomeie o seu estilo'
    },
    shareMap: {
      shareUriTitle: 'Compartilhar a URL do Mapa',
      shareUriSubtitle: 'Gerar a url do mapa e compartilhar com outros',
      cloudTitle: 'Armazenamento Cloud',
      cloudSubtitle: 'Conecte-se e envie os dados do mapa para o seu armazenamento cloud pessoal',
      shareDisclaimer: 'kepler.gl irá salvar os dados do mapa em seu armazenamento cloud pessoal, apenas pessoas com a URL podem acessar o seu mapa e dados. ' + 'Você pode editar/deletar o arquivo de dados na sua conta de armazenamento cloud em qualquer momento.',
      gotoPage: 'Vá para a sua página Kepler.gl {currentProvider}'
    },
    statusPanel: {
      mapUploading: 'Enviando Mapa',
      error: 'Erro'
    },
    saveMap: {
      title: 'Armazenamento Cloud',
      subtitle: 'Conecte-se para salvar o mapa para o seu armazenamento cloud pessoal'
    },
    exportMap: {
      formatTitle: 'Formato do mapa',
      formatSubtitle: 'Escolher o formato de mapa para exportar',
      html: {
        selection: 'Exportar seu mapa em um arquivo html interativo.',
        tokenTitle: 'Chave de acesso do Mapbox',
        tokenSubtitle: 'Use a sua própria chave de acesso Mapbox em seu arquivo html (opcional)',
        tokenPlaceholder: 'Cole a sua chave de acesso Mapbox',
        tokenMisuseWarning: '* Se você não fornecer a sua própria chave de acesso, o mapa pode falhar em exibir a qualquer momento quando nós substituirmos a nossa para evitar mau uso. ',
        tokenDisclaimer: 'Você pode trocar a sua chave de acesso Mapbox mais tarde utizando as instruções seguintes: ',
        tokenUpdate: 'Como atualizar a chave de acesso de um mapa existente.',
        modeTitle: 'Modo do Mapa',
        modeSubtitle1: 'Selecionar o modo do aplicativo. Mais ',
        modeSubtitle2: 'info',
        modeDescription: 'Permitir usuários a {mode} o mapa',
        read: 'ler',
        edit: 'editar'
      },
      json: {
        configTitle: 'Configurações do Mapa',
        configDisclaimer: 'A configuração do mapa será incluida no arquivo Json. Se você está utilizando kepler.gl no seu próprio mapa. Você pode copiar essa configuração e passar para ele ',
        selection: 'Exportar atuais dados e configurações do mapa em um único arquivo Json. Você pode mais tarde abrir o mesmo mapa enviando esse arquivo para o kepler.gl.',
        disclaimer: '* Configuração do mapa é aclopado com conjunto de dados carregados. ‘dataId’ é utilizado para ligar as camadas, filtros, e dicas de contextos a conjunto de dados expecíficos. ' + 'Quando passando essa configuração para addDataToMap, tenha certeza de que o id do conjunto de dados combina com o(s) dataId/s nessa configuração.'
      }
    },
    loadingDialog: {
      loading: 'Carregando...'
    },
    loadData: {
      upload: 'Carregar arquivo',
      storage: 'Carregar do armazenamento'
    },
    tripInfo: {
      title: 'Como habilitar animação de viagem',
      description1: 'Para animar o caminho, o dado geoJSON deve conter `LineString` na sua propriedade geometry, e as coordenadas na LineString devem ter 4 elementos no seguinte formato',
      code: ' [longitude, latitude, altitude, data] ',
      description2: 'com um ultimo elemento sendo uma data. Um formato de data válida inclui segundos unix como `1564184363` ou em milisegundos como `1564184363000`.',
      example: 'Exemplo:'
    },
    iconInfo: {
      title: 'Como desenhar ícones',
      description1: 'No seu csv, crie uma coluna, coloque o nome do ícone que você quer desenhar nele. Você pode deixar o campo vazio se você não desejar que o ícone apareça para alguns pontos. Quando a coluna tem nome',
      code: 'icon',
      description2: ' kepler.gl irá automaticamente criar uma camada de ícone para você.',
      example: 'Exemplos:',
      icons: 'Ícones'
    },
    storageMapViewer: {
      lastModified: 'Modificado há {lastUpdated}',
      back: 'Voltar'
    },
    overwriteMap: {
      title: 'Salvando mapa...',
      alreadyExists: 'já existe no mapa {mapSaved}. Você desejaria sobrescrever o mapa?'
    },
    loadStorageMap: {
      back: 'Voltar',
      goToPage: 'Vá para a sua página {displayName} do Kepler.gl',
      storageMaps: 'Armazenamento / Mapas',
      noSavedMaps: 'Nenhum mapa salvo'
    }
  },
  header: {
    visibleLayers: 'Camadas Visíveis',
    layerLegend: 'Legenda da Camada'
  },
  interactions: {
    tooltip: 'Dica de contexto',
    brush: 'Pincel',
    coordinate: 'Coordenadas'
  },
  layerBlending: {
    title: 'Mistura de Camadas',
    additive: 'aditivo',
    normal: 'normal',
    subtractive: 'subtrativo'
  },
  columns: {
    title: 'Colunas',
    lat: 'lat',
    lng: 'lon',
    altitude: 'altitude',
    icon: 'ícone',
    geojson: 'geojson',
    arc: {
      lat0: 'origem lat',
      lng0: 'origem lng',
      lat1: 'destino lat',
      lng1: 'destino lng'
    },
    line: {
      alt0: 'origem altitude',
      alt1: 'destino altitude'
    },
    grid: {
      worldUnitSize: 'Tamanho da Grade (km)'
    },
    hexagon: {
      worldUnitSize: 'Raio do Hexágono (km)'
    }
  },
  color: {
    customPalette: 'Paletas customizadas',
    steps: 'caminhos',
    type: 'tipo',
    reversed: 'reverso'
  },
  scale: {
    colorScale: 'Escala da Cor',
    sizeScale: 'Tamanho da Escala',
    strokeScale: 'Escala do Traço',
    scale: 'Escala'
  },
  fileUploader: {
    message: 'Arraste e solte seu(s) arquivo(s) aqui',
    chromeMessage: '*Usuários do chrome: O limite de tamanho de arquivo é 250mb, se você precisa fazer upload de arquivos maiores tente o Safari',
    disclaimer: '*kepler.gl é uma aplicação client-side, sem um servidor backend. Os dados ficam apenas na sua máquina/browser. ' + 'Nenhuma informação ou dados de mapa é enviado para qualquer server.',
    configUploadMessage: 'Envie {fileFormatNames} ou mapas salvos **Json**. Leia mais sobre [**tipos de arquivos suportados**]',
    browseFiles: 'procure seus arquivos',
    uploading: 'Enviando',
    fileNotSupported: 'Arquivo {errorFiles} não é suportado.',
    or: 'ou'
  },
  density: 'densidade',
  'Bug Report': 'Reportar Bug',
  'User Guide': 'Guia do Usuário',
  Save: 'Salvar',
  Share: 'Compartilhar'
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vcHQuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwic3Ryb2tlQ29sb3IiLCJyYWRpdXMiLCJvdXRsaW5lIiwic3Ryb2tlIiwiZGVuc2l0eSIsImhlaWdodCIsInN1bSIsInBvaW50Q291bnQiLCJwbGFjZWhvbGRlciIsInNlYXJjaCIsInNlbGVjdEZpZWxkIiwieUF4aXMiLCJzZWxlY3RUeXBlIiwic2VsZWN0VmFsdWUiLCJlbnRlclZhbHVlIiwiZW1wdHkiLCJtaXNjIiwiYnkiLCJ2YWx1ZXNJbiIsInZhbHVlRXF1YWxzIiwiZGF0YVNvdXJjZSIsImJydXNoUmFkaXVzIiwibWFwTGF5ZXJzIiwidGl0bGUiLCJyb2FkIiwiYm9yZGVyIiwiYnVpbGRpbmciLCJ3YXRlciIsImxhbmQiLCJwYW5lbCIsInRleHQiLCJsYWJlbFdpdGhJZCIsImZvbnRTaXplIiwiZm9udENvbG9yIiwidGV4dEFuY2hvciIsImFsaWdubWVudCIsImFkZE1vcmVMYWJlbCIsInNpZGViYXIiLCJwYW5lbHMiLCJsYXllciIsImZpbHRlciIsImludGVyYWN0aW9uIiwiYmFzZW1hcCIsInJlcXVpcmVkIiwicHJvcGVydHlCYXNlZE9uIiwiY292ZXJhZ2UiLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsInN0cm9rZVdpZHRoUmFuZ2UiLCJmaXhlZFJhZGl1cyIsImZpeGVkUmFkaXVzRGVzY3JpcHRpb24iLCJyYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXMiLCJyYWRpdXNSYW5nZVBpeGVscyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwic3Ryb2tlQ29sb3JSYW5nZSIsInRhcmdldENvbG9yIiwiY29sb3JBZ2dyZWdhdGlvbiIsImhlaWdodEFnZ3JlZ2F0aW9uIiwicmVzb2x1dGlvblJhbmdlIiwic2l6ZVNjYWxlIiwid29ybGRVbml0U2l6ZSIsImVsZXZhdGlvblNjYWxlIiwiZW5hYmxlRWxldmF0aW9uWm9vbUZhY3RvciIsImVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3JEZXNjcmlwdGlvbiIsImVuYWJsZUhlaWdodFpvb21GYWN0b3IiLCJoZWlnaHRTY2FsZSIsImNvdmVyYWdlUmFuZ2UiLCJoaWdoUHJlY2lzaW9uUmVuZGVyaW5nIiwiaGlnaFByZWNpc2lvblJlbmRlcmluZ0Rlc2NyaXB0aW9uIiwiaGVpZ2h0RGVzY3JpcHRpb24iLCJmaWxsIiwiZW5hYmxlUG9seWdvbkhlaWdodCIsInNob3dXaXJlZnJhbWUiLCJ3ZWlnaHRJbnRlbnNpdHkiLCJ6b29tU2NhbGUiLCJoZWlnaHRSYW5nZSIsImhlaWdodE11bHRpcGxpZXIiLCJsYXllck1hbmFnZXIiLCJhZGREYXRhIiwiYWRkTGF5ZXIiLCJsYXllckJsZW5kaW5nIiwibWFwTWFuYWdlciIsIm1hcFN0eWxlIiwiYWRkTWFwU3R5bGUiLCJsYXllckNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJob3dUbyIsImZpbHRlck1hbmFnZXIiLCJhZGRGaWx0ZXIiLCJkYXRhc2V0VGl0bGUiLCJzaG93RGF0YVRhYmxlIiwicmVtb3ZlRGF0YXNldCIsImRhdGFzZXRJbmZvIiwicm93Q291bnQiLCJ0b29sdGlwIiwiaGlkZUxheWVyIiwic2hvd0xheWVyIiwiaGlkZUZlYXR1cmUiLCJzaG93RmVhdHVyZSIsImhpZGUiLCJzaG93IiwicmVtb3ZlTGF5ZXIiLCJsYXllclNldHRpbmdzIiwiY2xvc2VQYW5lbCIsInN3aXRjaFRvRHVhbFZpZXciLCJzaG93TGVnZW5kIiwiZGlzYWJsZTNETWFwIiwiRHJhd09uTWFwIiwic2VsZWN0TG9jYWxlIiwiaGlkZUxheWVyUGFuZWwiLCJzaG93TGF5ZXJQYW5lbCIsIm1vdmVUb1RvcCIsInNlbGVjdEJhc2VNYXBTdHlsZSIsInRpbWVQbGF5YmFjayIsImNsb3VkU3RvcmFnZSIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwibW9kYWwiLCJkZWxldGVEYXRhc2V0IiwiYWRkRGF0YVRvTWFwIiwiYWRkQ3VzdG9tTWFwYm94U3R5bGUiLCJzaGFyZVVSTCIsImJ1dHRvbiIsImRvd25sb2FkIiwiYWRkU3R5bGUiLCJzYXZlIiwiZGVmYXVsdENhbmNlbCIsImRlZmF1bHRDb25maXJtIiwicmF0aW9UaXRsZSIsInJhdGlvRGVzY3JpcHRpb24iLCJyYXRpb09yaWdpbmFsU2NyZWVuIiwicmF0aW9DdXN0b20iLCJyYXRpbzRfMyIsInJhdGlvMTZfOSIsInJlc29sdXRpb25UaXRsZSIsInJlc29sdXRpb25EZXNjcmlwdGlvbiIsIm1hcExlZ2VuZFRpdGxlIiwibWFwTGVnZW5kQWRkIiwiZGF0YXNldFN1YnRpdGxlIiwiYWxsRGF0YXNldHMiLCJkYXRhVHlwZVRpdGxlIiwiZGF0YVR5cGVTdWJ0aXRsZSIsImZpbHRlckRhdGFUaXRsZSIsImZpbHRlckRhdGFTdWJ0aXRsZSIsImZpbHRlcmVkRGF0YSIsInVuZmlsdGVyZWREYXRhIiwiZmlsZUNvdW50IiwiZGVsZXRlRGF0YSIsIndhcm5pbmciLCJwdWJsaXNoVGl0bGUiLCJwdWJsaXNoU3VidGl0bGUxIiwicHVibGlzaFN1YnRpdGxlMiIsInB1Ymxpc2hTdWJ0aXRsZTMiLCJwdWJsaXNoU3VidGl0bGU0IiwicHVibGlzaFN1YnRpdGxlNSIsInB1Ymxpc2hTdWJ0aXRsZTYiLCJwdWJsaXNoU3VidGl0bGU3IiwiZXhhbXBsZVRva2VuIiwicGFzdGVUaXRsZSIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJuYW1pbmdUaXRsZSIsInNoYXJlTWFwIiwic2hhcmVVcmlUaXRsZSIsInNoYXJlVXJpU3VidGl0bGUiLCJjbG91ZFRpdGxlIiwiY2xvdWRTdWJ0aXRsZSIsInNoYXJlRGlzY2xhaW1lciIsImdvdG9QYWdlIiwic3RhdHVzUGFuZWwiLCJtYXBVcGxvYWRpbmciLCJlcnJvciIsInN1YnRpdGxlIiwiZm9ybWF0VGl0bGUiLCJmb3JtYXRTdWJ0aXRsZSIsImh0bWwiLCJzZWxlY3Rpb24iLCJ0b2tlblRpdGxlIiwidG9rZW5TdWJ0aXRsZSIsInRva2VuUGxhY2Vob2xkZXIiLCJ0b2tlbk1pc3VzZVdhcm5pbmciLCJ0b2tlbkRpc2NsYWltZXIiLCJ0b2tlblVwZGF0ZSIsIm1vZGVUaXRsZSIsIm1vZGVTdWJ0aXRsZTEiLCJtb2RlU3VidGl0bGUyIiwibW9kZURlc2NyaXB0aW9uIiwicmVhZCIsImVkaXQiLCJqc29uIiwiY29uZmlnVGl0bGUiLCJjb25maWdEaXNjbGFpbWVyIiwiZGlzY2xhaW1lciIsImxvYWRpbmdEaWFsb2ciLCJsb2FkaW5nIiwibG9hZERhdGEiLCJ1cGxvYWQiLCJzdG9yYWdlIiwidHJpcEluZm8iLCJkZXNjcmlwdGlvbjEiLCJjb2RlIiwiZGVzY3JpcHRpb24yIiwiZXhhbXBsZSIsImljb25JbmZvIiwiaWNvbnMiLCJzdG9yYWdlTWFwVmlld2VyIiwibGFzdE1vZGlmaWVkIiwiYmFjayIsIm92ZXJ3cml0ZU1hcCIsImFscmVhZHlFeGlzdHMiLCJsb2FkU3RvcmFnZU1hcCIsImdvVG9QYWdlIiwic3RvcmFnZU1hcHMiLCJub1NhdmVkTWFwcyIsImhlYWRlciIsInZpc2libGVMYXllcnMiLCJsYXllckxlZ2VuZCIsImludGVyYWN0aW9ucyIsImJydXNoIiwiY29vcmRpbmF0ZSIsImFkZGl0aXZlIiwibm9ybWFsIiwic3VidHJhY3RpdmUiLCJjb2x1bW5zIiwibGF0IiwibG5nIiwiYWx0aXR1ZGUiLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiYWx0MCIsImFsdDEiLCJjdXN0b21QYWxldHRlIiwic3RlcHMiLCJyZXZlcnNlZCIsInNjYWxlIiwiY29sb3JTY2FsZSIsInN0cm9rZVNjYWxlIiwiZmlsZVVwbG9hZGVyIiwibWVzc2FnZSIsImNocm9tZU1lc3NhZ2UiLCJjb25maWdVcGxvYWRNZXNzYWdlIiwiYnJvd3NlRmlsZXMiLCJ1cGxvYWRpbmciLCJmaWxlTm90U3VwcG9ydGVkIiwib3IiLCJTYXZlIiwiU2hhcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7ZUFFZTtBQUNiQSxFQUFBQSxRQUFRLEVBQUU7QUFDUkMsSUFBQUEsTUFBTSxFQUFFLG9CQURBO0FBRVJDLElBQUFBLEtBQUssRUFBRSxRQUZDO0FBR1JDLElBQUFBLFNBQVMsRUFBRSxzQkFISDtBQUlSQyxJQUFBQSxLQUFLLEVBQUUsS0FKQztBQUtSQyxJQUFBQSxXQUFXLEVBQUUsY0FMTDtBQU1SQyxJQUFBQSxNQUFNLEVBQUUsTUFOQTtBQU9SQyxJQUFBQSxPQUFPLEVBQUUsVUFQRDtBQVFSQyxJQUFBQSxNQUFNLEVBQUUsU0FSQTtBQVNSQyxJQUFBQSxPQUFPLEVBQUUsV0FURDtBQVVSQyxJQUFBQSxNQUFNLEVBQUUsUUFWQTtBQVdSQyxJQUFBQSxHQUFHLEVBQUUsTUFYRztBQVlSQyxJQUFBQSxVQUFVLEVBQUU7QUFaSixHQURHO0FBZWJDLEVBQUFBLFdBQVcsRUFBRTtBQUNYQyxJQUFBQSxNQUFNLEVBQUUsV0FERztBQUVYQyxJQUFBQSxXQUFXLEVBQUUsb0JBRkY7QUFHWEMsSUFBQUEsS0FBSyxFQUFFLFFBSEk7QUFJWEMsSUFBQUEsVUFBVSxFQUFFLG1CQUpEO0FBS1hDLElBQUFBLFdBQVcsRUFBRSxvQkFMRjtBQU1YQyxJQUFBQSxVQUFVLEVBQUUsaUJBTkQ7QUFPWEMsSUFBQUEsS0FBSyxFQUFFO0FBUEksR0FmQTtBQXdCYkMsRUFBQUEsSUFB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QUFKRixHQWpaTTtBQXVaYkcsRUFBQUEsWUFBWSxFQUFFO0FBQ1pDLElBQUFBLE9BQU8sRUFBRSx3Q0FERztBQUVaQyxJQUFBQSxhQUFhLEVBQ1gsOEhBSFU7QUFJWmpELElBQUFBLFVBQVUsRUFDUixvSEFDQSxxRUFOVTtBQU9aa0QsSUFBQUEsbUJBQW1CLEVBQ2pCLHNHQVJVO0FBU1pDLElBQUFBLFdBQVcsRUFBRSx1QkFURDtBQVVaQyxJQUFBQSxTQUFTLEVBQUUsVUFWQztBQVdaQyxJQUFBQSxnQkFBZ0IsRUFBRSx1Q0FYTjtBQVlaQyxJQUFBQSxFQUFFLEVBQUU7QUFaUSxHQXZaRDtBQXFhYmpSLEVBQUFBLE9BQU8sRUFBRSxXQXJhSTtBQXNhYixnQkFBYyxjQXRhRDtBQXVhYixnQkFBYyxpQkF2YUQ7QUF3YWJrUixFQUFBQSxJQUFJLEVBQUUsUUF4YU87QUF5YWJDLEVBQUFBLEtBQUssRUFBRTtBQXphTSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDIxIFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtMT0NBTEVTfSBmcm9tICcuL2xvY2FsZXMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHByb3BlcnR5OiB7XG4gICAgd2VpZ2h0OiAnRXNwZXNzdXJhIGRvIHRleHRvJyxcbiAgICBsYWJlbDogJ1LDs3R1bG8nLFxuICAgIGZpbGxDb2xvcjogJ0NvciBkbyBwcmVlbmNoaW1lbnRvJyxcbiAgICBjb2xvcjogJ0NvcicsXG4gICAgc3Ryb2tlQ29sb3I6ICdDb3IgZGEgYm9yZGEnLFxuICAgIHJhZGl1czogJ1JhaW8nLFxuICAgIG91dGxpbmU6ICdDb250b3JubycsXG4gICAgc3Ryb2tlOiAnVHJhw6dhZG8nLFxuICAgIGRlbnNpdHk6ICdEZW5zaWRhZGUnLFxuICAgIGhlaWdodDogJ0FsdHVyYScsXG4gICAgc3VtOiAnU29tYScsXG4gICAgcG9pbnRDb3VudDogJ0NvbnRhZ2VtIGRlIFBvbnRvcydcbiAgfSxcbiAgcGxhY2Vob2xkZXI6IHtcbiAgICBzZWFyY2g6ICdQZXNxdWlzYXInLFxuICAgIHNlbGVjdEZpZWxkOiAnU2VsZWNpb25lIHVtIGNhbXBvJyxcbiAgICB5QXhpczogJ0VpeG8gWScsXG4gICAgc2VsZWN0VHlwZTogJ1NlbGVjaW9uZSB1bSBUaXBvJyxcbiAgICBzZWxlY3RWYWx1ZTogJ1NlbGVjaW9uZSB1bSB2YWxvcicsXG4gICAgZW50ZXJWYWx1ZTogJ0luc2lyYSB1bSB2YWxvcicsXG4gICAgZW1wdHk6ICdWYXppbydcbiAgfSxcbiAgbWlzYzoge1xuICAgIGJ5OiAnJyxcbiAgICB2YWx1ZXNJbjogJ1ZhbG9yZXMgZW0nLFxuICAgIHZhbHVlRXF1YWxzOiAnVmFsb3IgaWd1YWwgYScsXG4gICAgZGF0YVNvdXJjZTogJ09yaWdlbSBkb3MgZGFkb3MnLFxuICAgIGJydXNoUmFkaXVzOiAnUmFpbyBkbyBUcmHDp28gKGttKScsXG4gICAgZW1wdHk6ICcgJ1xuICB9LFxuICBtYXBMYXllcnM6IHtcbiAgICB0aXRsZTogJ0NhbWFkYXMgZG8gbWFwYScsXG4gICAgbGFiZWw6ICdSw7N0dWxvJyxcbiAgICByb2FkOiAnRXN0cmFkYScsXG4gICAgYm9yZGVyOiAnRnJvbnRlaXJhJyxcbiAgICBidWlsZGluZzogJ0VkaWbDrWNpb3MnLFxuICAgIHdhdGVyOiAnw4FndWEnLFxuICAgIGxhbmQ6ICdUZXJyYScsXG4gICAgJzNkQnVpbGRpbmcnOiAnRWRpZsOtY2lvcyBlbSAzZCdcbiAgfSxcbiAgcGFuZWw6IHtcbiAgICB0ZXh0OiB7XG4gICAgICBsYWJlbDogJ1LDs3R1bG8nLFxuICAgICAgbGFiZWxXaXRoSWQ6ICdSw7N0dWxvIHtsYWJlbElkfScsXG4gICAgICBmb250U2l6ZTogJ1RhbWFuaG8gZGEgZm9udGUnLFxuICAgICAgZm9udENvbG9yOiAnQ29yIGRhIGZvbnRlJyxcbiAgICAgIHRleHRBbmNob3I6ICfDgm5jb3JhIGRvIHRleHRvJyxcbiAgICAgIGFsaWdubWVudDogJ0FsaW5oYW1lbnRvJyxcbiAgICAgIGFkZE1vcmVMYWJlbDogJ0FkaWNpb25hciBtYWlzIFLDs3R1bG9zJ1xuICAgIH1cbiAgfSxcbiAgc2lkZWJhcjoge1xuICAgIHBhbmVsczoge1xuICAgICAgbGF5ZXI6ICdDYW1hZGFzJyxcbiAgICAgIGZpbHRlcjogJ0ZpbHRyb3MnLFxuICAgICAgaW50ZXJhY3Rpb246ICdJbnRlcmHDp8O1ZXMnLFxuICAgICAgYmFzZW1hcDogJ01hcGEgYmFzZSdcbiAgICB9XG4gIH0sXG4gIGxheWVyOiB7XG4gICAgcmVxdWlyZWQ6ICdPYnJpZ2F0w7NyaW8qJyxcbiAgICByYWRpdXM6ICdSYWlvJyxcbiAgICBjb2xvcjogJ0NvcicsXG4gICAgZmlsbENvbG9yOiAnQ29yIGRlIHByZWVuY2hpbWVudG8nLFxuICAgIG91dGxpbmU6ICdDb250b3JubycsXG4gICAgd2VpZ2h0OiAnRXNwZXNzdXJhJyxcbiAgICBwcm9wZXJ0eUJhc2VkT246ICd7cHJvcGVydHl9IGJhc2VhZGEgZW0nLFxuICAgIGNvdmVyYWdlOiAnQ29iZXJ0dXJhJyxcbiAgICBzdHJva2U6ICdUcmHDp28nLFxuICAgIHN0cm9rZVdpZHRoOiAnTGFyZ3VyYSBkbyBUcmHDp2FkbycsXG4gICAgc3Ryb2tlQ29sb3I6ICdDb3IgZG8gVHJhw6dhZG8nLFxuICAgIGJhc2ljOiAnQsOhc2ljbycsXG4gICAgdHJhaWxMZW5ndGg6ICdDb21wcmltZW50byBkYSB0cmlsaGEnLFxuICAgIHRyYWlsTGVuZ3RoRGVzY3JpcHRpb246ICdOw7ptZXJvIGRlIHNlZ3VuZG9zIHBhcmEgdW0gY2FtaW5obyBjb21wbGV0YW1lbnRlIGRlc2FwYXJlY2VyJyxcbiAgICBuZXdMYXllcjogJ25vdmEgY2FtYWRhJyxcbiAgICBlbGV2YXRpb25CeURlc2NyaXB0aW9uOiAnUXVhbmRvIGRlc2xpZ2FkbywgYSBhbHR1cmEgw6kgYmFzZWFkYSBuYSBjb250YWdlbSBkZSBwb250b3MnLFxuICAgIGNvbG9yQnlEZXNjcmlwdGlvbjogJ1F1YW5kbyBkZXNsaWdhZG8sIGEgY29yIMOpIGJhc2VhZGEgbmEgY29udGFnZW0gZGUgcG9udG9zJyxcbiAgICBhZ2dyZWdhdGVCeTogJ3tmaWVsZH0gYWdyZWdhZG8gcG9yJyxcbiAgICAnM0RNb2RlbCc6ICdNb2RlbG8gM0QnLFxuICAgICczRE1vZGVsT3B0aW9ucyc6ICdPcMOnw7VlcyBkbyBNb2RlbG8gM0QnLFxuICAgIHR5cGU6IHtcbiAgICAgIHBvaW50OiAncG9udG8nLFxuICAgICAgYXJjOiAnYXJjbycsXG4gICAgICBsaW5lOiAnbGluaGEnLFxuICAgICAgZ3JpZDogJ2dyYWRlJyxcbiAgICAgIGhleGJpbjogJ2hleMOhZ29ubycsXG4gICAgICBwb2x5Z29uOiAncG9sw61nb25vJyxcbiAgICAgIGdlb2pzb246ICdnZW9qc29uJyxcbiAgICAgIGNsdXN0ZXI6ICdncnVwbycsXG4gICAgICBpY29uOiAnaWNvbicsXG4gICAgICBoZWF0bWFwOiAnbWFwYSBkZSBjYWxvcicsXG4gICAgICBoZXhhZ29uOiAnaGV4w6Fnb25vJyxcbiAgICAgIGhleGFnb25pZDogJ0gzJyxcbiAgICAgIHRyaXA6ICd2aWFnZW0nLFxuICAgICAgczI6ICdTMicsXG4gICAgICAnM2QnOiAnM0QnXG4gICAgfVxuICB9LFxuICBsYXllclZpc0NvbmZpZ3M6IHtcbiAgICBzdHJva2VXaWR0aDogJ0xhcmd1cmEgZG8gVHJhw6dvJyxcbiAgICBzdHJva2VXaWR0aFJhbmdlOiAnQWxjYW5jZSBkYSBMYXJndXJhIGRvIFRyYcOnbycsXG4gICAgcmFkaXVzOiAnUmFpbycsXG4gICAgZml4ZWRSYWRpdXM6ICdSYWlvIGFqdXN0YWRvIHBhcmEgbWV0cm8nLFxuICAgIGZpeGVkUmFkaXVzRGVzY3JpcHRpb246ICdSYWlvIGRvIE1hcGEgcGFyYSBSYWlvIGFic29sdXRvIGVtIG1ldHJvcywgZS5nLiA1IHBhcmEgNSBtZXRyb3MnLFxuICAgIHJhZGl1c1JhbmdlOiAnQWxjYW5jZSBkbyBSYWlvJyxcbiAgICBjbHVzdGVyUmFkaXVzOiAnUmFpbyBkbyBBZ3J1cGFtZW50byBlbSBwaXhlbHMnLFxuICAgIHJhZGl1c1JhbmdlUGl4ZWxzOiAnQWxjYW5jZSBkbyBSYWlvIGVtIHBpeGVscycsXG4gICAgb3BhY2l0eTogJ09wYWNpZGFkZScsXG4gICAgY292ZXJhZ2U6ICdDb2JlcnR1cmEnLFxuICAgIG91dGxpbmU6ICdDb250b3JubycsXG4gICAgY29sb3JSYW5nZTogJ0FsY2FuY2UgZGEgQ29yJyxcbiAgICBzdHJva2U6ICdUcmHDp2FkbycsXG4gICAgc3Ryb2tlQ29sb3I6ICdDb3IgZG8gVHJhw6dhZG8nLFxuICAgIHN0cm9rZUNvbG9yUmFuZ2U6ICdBbGNhbmNlIGRhIENvciBkbyBUcmHDp2FkbycsXG4gICAgdGFyZ2V0Q29sb3I6ICdDb3IgZGUgZGVzdGlubycsXG4gICAgY29sb3JBZ2dyZWdhdGlvbjogJ0FncmVnYcOnw6NvIGRhIENvcicsXG4gICAgaGVpZ2h0QWdncmVnYXRpb246ICdBZ3JlZ2HDp8OjbyBkYSBBbHR1cmEnLFxuICAgIHJlc29sdXRpb25SYW5nZTogJ0FsY2FuY2UgZGEgUmVzb2x1w6fDo28nLFxuICAgIHNpemVTY2FsZTogJ0VzY2FsYSBkZSB0YW1hbmhvJyxcbiAgICB3b3JsZFVuaXRTaXplOiAnVGFtYW5obyB1bml0w6FyaW8gZG8gbXVuZG8nLFxuICAgIGVsZXZhdGlvblNjYWxlOiAnRXNjYWxhIGRlIEVsZXZhw6fDo28nLFxuICAgIGVuYWJsZUVsZXZhdGlvblpvb21GYWN0b3I6ICdVc2UgZmF0b3IgZGUgem9vbSBkZSBlbGV2YcOnw6NvJyxcbiAgICBlbmFibGVFbGV2YXRpb25ab29tRmFjdG9yRGVzY3JpcHRpb246XG4gICAgICAnQWp1c3RlIGEgYWx0dXJhIC8gZWxldmHDp8OjbyBjb20gYmFzZSBubyBmYXRvciBkZSB6b29tIGF0dWFsJyxcbiAgICBlbmFibGVIZWlnaHRab29tRmFjdG9yOiAnVXNhciBmYXRvciBkZSB6b29tIGRlIGFsdHVyYScsXG4gICAgaGVpZ2h0U2NhbGU6ICdFc2NhbGEgZGUgQWx0dXJhJyxcbiAgICBjb3ZlcmFnZVJhbmdlOiAnQWxjYW5jZSBkZSBjb2JlcnR1cmEnLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmc6ICdSZW5kZXJpemHDp8OjbyBkZSBBbHRhIFByZWNpc8OjbycsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZ0Rlc2NyaXB0aW9uOiAnQWx0YSBwcmVjaXPDo28gaXLDoSBlbSByZXN1bHRhciBlbSBiYWl4YSBwZXJmb3JtYW5jZScsXG4gICAgaGVpZ2h0OiAnQWx0dXJhJyxcbiAgICBoZWlnaHREZXNjcmlwdGlvbjpcbiAgICAgICdDbGlxdWUgbm8gYm90w6NvIG5vIGNhbnRvIHN1cGVyaW9yIGRpcmVpdG8gcGFyYSB0cm9jYXIgcGFyYSBhIHZpc3VhbGl6YcOnw6NvIDNkJyxcbiAgICBmaWxsOiAnUHJlZW5jaGltZW50bycsXG4gICAgZW5hYmxlUG9seWdvbkhlaWdodDogJ0hhYmlsaXRhciBBbHR1cmEgZGUgUG9sw61nb25vJyxcbiAgICBzaG93V2lyZWZyYW1lOiAnTW9zdHJhciBXaXJlZnJhbWUnLFxuICAgIHdlaWdodEludGVuc2l0eTogJ0ludGVuc2lkYWRlIGRhIEVzcGVzc3VyYScsXG4gICAgem9vbVNjYWxlOiAnRXNjYWxhIGRvIFpvb20nLFxuICAgIGhlaWdodFJhbmdlOiAnQWxjYW5jZSBkYSBBbHR1cmEnLFxuICAgIGhlaWdodE11bHRpcGxpZXI6ICdNdWx0aXBsaWNhZG9yIGRlIGFsdHVyYSdcbiAgfSxcbiAgbGF5ZXJNYW5hZ2VyOiB7XG4gICAgYWRkRGF0YTogJ0FkaWNpb25hciBEYWRvcycsXG4gICAgYWRkTGF5ZXI6ICdBZGljaW9uYXIgQ2FtYWRhJyxcbiAgICBsYXllckJsZW5kaW5nOiAnTWlzdHVyYSBkZSBDYW1hZGEnXG4gIH0sXG4gIG1hcE1hbmFnZXI6IHtcbiAgICBtYXBTdHlsZTogJ0VzdGlsbyBkbyBNYXBhJyxcbiAgICBhZGRNYXBTdHlsZTogJ0FkaWNpb25hciBFc3RpbG8gZGUgTWFwYScsXG4gICAgJzNkQnVpbGRpbmdDb2xvcic6ICdDb3IgZG8gRWRpZsOtY2lvIDNEJ1xuICB9LFxuICBsYXllckNvbmZpZ3VyYXRpb246IHtcbiAgICBkZWZhdWx0RGVzY3JpcHRpb246ICdDYWxjdWxhciB7cHJvcGVydHl9IGJhc2VhZGEgbm8gY2FtcG8gc2VsZWNpb25hZG8nLFxuICAgIGhvd1RvOiAnQ29tbydcbiAgfSxcbiAgZmlsdGVyTWFuYWdlcjoge1xuICAgIGFkZEZpbHRlcjogJ0FkaWNpb25hciBGaWx0cm8nXG4gIH0sXG4gIGRhdGFzZXRUaXRsZToge1xuICAgIHNob3dEYXRhVGFibGU6ICdNb3N0cmFyIHRhYmVsYSBkZSBkYWRvcycsXG4gICAgcmVtb3ZlRGF0YXNldDogJ1JlbW92ZXIgdGFiZWxhIGRlIGRhZG9zJ1xuICB9LFxuICBkYXRhc2V0SW5mbzoge1xuICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSBsaW5oYXMnXG4gIH0sXG4gIHRvb2x0aXA6IHtcbiAgICBoaWRlTGF5ZXI6ICdlc2NvbmRlciBjYW1hZGEnLFxuICAgIHNob3dMYXllcjogJ21vc3RyYXIgY2FtYWRhJyxcbiAgICBoaWRlRmVhdHVyZTogJ0VzY29uZGVyIHByb3ByaWVkYWRlJyxcbiAgICBzaG93RmVhdHVyZTogJ01vc3RyYXIgcHJvcHJpZWRhZGUnLFxuICAgIGhpZGU6ICdlc2NvbmRlcicsXG4gICAgc2hvdzogJ21vc3RyYXInLFxuICAgIHJlbW92ZUxheWVyOiAnUmVtb3ZlciBDYW1hZGEnLFxuICAgIGxheWVyU2V0dGluZ3M6ICdDb25maWd1cmHDp8O1ZXMgZGUgQ2FtYWRhJyxcbiAgICBjbG9zZVBhbmVsOiAnRmVjaGFyIHBhaW5lbCBhdHVhbCcsXG4gICAgc3dpdGNoVG9EdWFsVmlldzogJ1Ryb2NhciBwYXJhIHZpc3VhbGl6YcOnw6NvIGR1cGxhIGRlIG1hcGEnLFxuICAgIHNob3dMZWdlbmQ6ICdtb3N0cmFyIGxlZ2VuZGEnLFxuICAgIGRpc2FibGUzRE1hcDogJ0Rlc2FiaWxpdGFyIE1hcGEgM0QnLFxuICAgIERyYXdPbk1hcDogJ0Rlc2VuaGFyIG5vIG1hcGEnLFxuICAgIHNlbGVjdExvY2FsZTogJ1NlbGVjaW9uYXIgbMOtbmd1YScsXG4gICAgaGlkZUxheWVyUGFuZWw6ICdFc2NvbmRlciBwYWluZWwgZGUgY2FtYWRhJyxcbiAgICBzaG93TGF5ZXJQYW5lbDogJ01vc3RyYXIgcGFpbmVsIGRlIGNhbWFkYScsXG4gICAgbW92ZVRvVG9wOiAnTW92ZXIgcGFyYSBvIHRvcG8gZGFzIGNhbWFkYXMnLFxuICAgIHNlbGVjdEJhc2VNYXBTdHlsZTogJ1NlbGVjaW9uYXIgbyBFc3RpbG8gZG8gTWFwYSBCYXNlJyxcbiAgICBkZWxldGU6ICdEZWxldGFyJyxcbiAgICB0aW1lUGxheWJhY2s6ICdUZW1wbyBkZSByZXByb2R1w6fDo28nLFxuICAgIGNsb3VkU3RvcmFnZTogJ0FybWF6ZW5hbWVudG8gQ2xvdWQnLFxuICAgICczRE1hcCc6ICcgTWFwYSAzRCdcbiAgfSxcbiAgdG9vbGJhcjoge1xuICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0YXIgSW1hZ2VtJyxcbiAgICBleHBvcnREYXRhOiAnRXhwb3J0YXIgRGFkb3MnLFxuICAgIGV4cG9ydE1hcDogJ0V4cG9ydGFyIE1hcGEnLFxuICAgIHNoYXJlTWFwVVJMOiAnQ29tcGFydGlsaGFyIFVSTCBkbyBNYXBhJyxcbiAgICBzYXZlTWFwOiAnU2FsdmFyIE1hcGEnLFxuICAgIHNlbGVjdDogJ3NlbGVjaW9uYXInLFxuICAgIHBvbHlnb246ICdwb2zDrWdvbm8nLFxuICAgIHJlY3RhbmdsZTogJ3JldMOibmd1bG8nLFxuICAgIGhpZGU6ICdlc2NvbmRlcicsXG4gICAgc2hvdzogJ21vc3RyYXInLFxuICAgIC4uLkxPQ0FMRVNcbiAgfSxcbiAgbW9kYWw6IHtcbiAgICB0aXRsZToge1xuICAgICAgZGVsZXRlRGF0YXNldDogJ0RlbGV0YXIgQ29uanVudG8gZGUgRGFkb3MnLFxuICAgICAgYWRkRGF0YVRvTWFwOiAnQWRpY2lvbmFyIERhZG9zIGFvIE1hcGEnLFxuICAgICAgZXhwb3J0SW1hZ2U6ICdFeHBvcnRhciBJbWFnZW0nLFxuICAgICAgZXhwb3J0RGF0YTogJ0V4cG9ydGFyIERhZG9zJyxcbiAgICAgIGV4cG9ydE1hcDogJ0V4cG9ydGFyIE1hcGEnLFxuICAgICAgYWRkQ3VzdG9tTWFwYm94U3R5bGU6ICdBZGljaW9uYXIgRXN0aWxvIE1hcGJveCBDdXN0b21pemFkbycsXG4gICAgICBzYXZlTWFwOiAnU2FsdmFyIE1hcGEnLFxuICAgICAgc2hhcmVVUkw6ICdDb21wYXJ0aWxoYXIgVVJMJ1xuICAgIH0sXG4gICAgYnV0dG9uOiB7XG4gICAgICBkZWxldGU6ICdEZWxldGFyJyxcbiAgICAgIGRvd25sb2FkOiAnRG93bmxvYWQnLFxuICAgICAgZXhwb3J0OiAnRXhwb3J0YXInLFxuICAgICAgYWRkU3R5bGU6ICdBZGljaW9uYXIgRXN0aWxvJyxcbiAgICAgIHNhdmU6ICdTYWx2YXInLFxuICAgICAgZGVmYXVsdENhbmNlbDogJ0NhbmNlbGFyJyxcbiAgICAgIGRlZmF1bHRDb25maXJtOiAnQ29uZmlybWFyJ1xuICAgIH0sXG4gICAgZXhwb3J0SW1hZ2U6IHtcbiAgICAgIHJhdGlvVGl0bGU6ICdQcm9wb3LDp8OjbycsXG4gICAgICByYXRpb0Rlc2NyaXB0aW9uOiAnRXNjb2xoYSBhIHByb3BvcsOnw6NvIHBhcmEgdsOhcmlvcyB1c29zLicsXG4gICAgICByYXRpb09yaWdpbmFsU2NyZWVuOiAnVGVsYSBPcmlnaW5hbCcsXG4gICAgICByYXRpb0N1c3RvbTogJ0N1c3RvbWl6YWRvJyxcbiAgICAgIHJhdGlvNF8zOiAnNDozJyxcbiAgICAgIHJhdGlvMTZfOTogJzE2OjknLFxuICAgICAgcmVzb2x1dGlvblRpdGxlOiAnUmVzb2x1w6fDo28nLFxuICAgICAgcmVzb2x1dGlvbkRlc2NyaXB0aW9uOiAnQWx0YSByZXNvbHXDp8OjbyDDqSBtZWxob3IgcGFyYSBpbXByZXNzw7Vlcy4nLFxuICAgICAgbWFwTGVnZW5kVGl0bGU6ICdMZWdlbmRhIGRvIE1hcGEnLFxuICAgICAgbWFwTGVnZW5kQWRkOiAnQWRpY2lvbmFyIExlZ2VuZGEgbm8gbWFwYSdcbiAgICB9LFxuICAgIGV4cG9ydERhdGE6IHtcbiAgICAgIGRhdGFzZXRUaXRsZTogJ0Nvbmp1bnRvIGRlIGRhZG9zJyxcbiAgICAgIGRhdGFzZXRTdWJ0aXRsZTogJ0VzY29saGEgbyBjb25qdW50byBkZSBkYWRvcyBxdWUgdm9jw6ogcXVlciBleHBvcnRhcicsXG4gICAgICBhbGxEYXRhc2V0czogJ1RvZG9zJyxcbiAgICAgIGRhdGFUeXBlVGl0bGU6ICdUaXBvIGRlIERhZG8nLFxuICAgICAgZGF0YVR5cGVTdWJ0aXRsZTogJ0VzY29saGEgbyB0aXBvIGRlIGRhZG9zIHF1ZSB2b2PDqiBxdWVyIGV4cG9ydGFyJyxcbiAgICAgIGZpbHRlckRhdGFUaXRsZTogJ0ZpbHRyYXIgRGFkb3MnLFxuICAgICAgZmlsdGVyRGF0YVN1YnRpdGxlOiAnVm9jw6ogcG9kZSBlc2NvbGhlciBleHBvcnRhciBvcyBkYWRvcyBvcmlnaW5haXMgb3Ugb3MgZGFkb3MgZmlsdHJhZG9zJyxcbiAgICAgIGZpbHRlcmVkRGF0YTogJ0RhZG9zIEZpbHRyYWRvcycsXG4gICAgICB1bmZpbHRlcmVkRGF0YTogJ0RhZG9zIG7Do28gZmlsdHJhZG9zJyxcbiAgICAgIGZpbGVDb3VudDogJ3tmaWxlQ291bnR9IEFycXVpdm9zJyxcbiAgICAgIHJvd0NvdW50OiAne3Jvd0NvdW50fSBMaW5oYXMnXG4gICAgfSxcbiAgICBkZWxldGVEYXRhOiB7XG4gICAgICB3YXJuaW5nOiAndm9jw6ogaXLDoSBkZWxldGFyIGVzc2UgY29uanVudG8gZGUgZGFkb3MuIElzc28gaXLDoSBhZmV0YXIge2xlbmd0aH0gY2FtYWRhcydcbiAgICB9LFxuICAgIGFkZFN0eWxlOiB7XG4gICAgICBwdWJsaXNoVGl0bGU6ICcxLiBQdWJsaXF1ZSBvIHNldSBFc3RpbG8gbm8gTWFwYm94IG91IHByb3ZpZGVuY2llIGEgY2hhdmUgZGUgYWNlc3NvJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTE6ICdWb2PDqiBwb2RlIGNyaWFyIG8gc2V1IHByw7NwcmlvIGVzdGlsbyBlbScsXG4gICAgICBwdWJsaXNoU3VidGl0bGUyOiAnZScsXG4gICAgICBwdWJsaXNoU3VidGl0bGUzOiAncHVibGljYXInLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNDogJ2lzc28uJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTU6ICdQYXJhIHV0aWxpemFyIGVzdGlsbyBwcml2YWRvLCBjb2xlIGEgc3VhJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTY6ICdjaGF2ZSBkZSBhY2Vzc28nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlNzpcbiAgICAgICAgJ2FxdWkuICprZXBsZXIuZ2wgw6kgdW1hIGFwbGljYcOnw6NvIGNsaWVudC1zaWRlLCBvcyBkYWRvcyBwZXJtYW5lY2VtIG5vIHNldSBicm93c2VyLi4nLFxuICAgICAgZXhhbXBsZVRva2VuOiAnZS5nLiBway5hYmNkZWZnLnh4eHh4eCcsXG4gICAgICBwYXN0ZVRpdGxlOiAnMi4gQ29sZSBhIHVybCBkbyBzZXUgZXN0aWxvJyxcbiAgICAgIHBhc3RlU3VidGl0bGUxOiAnTyBxdWUgw6kgdW1hJyxcbiAgICAgIHBhc3RlU3VidGl0bGUyOiAnVVJMIGRlIGVzdGlsbycsXG4gICAgICBuYW1pbmdUaXRsZTogJzMuIE5vbWVpZSBvIHNldSBlc3RpbG8nXG4gICAgfSxcbiAgICBzaGFyZU1hcDoge1xuICAgICAgc2hhcmVVcmlUaXRsZTogJ0NvbXBhcnRpbGhhciBhIFVSTCBkbyBNYXBhJyxcbiAgICAgIHNoYXJlVXJpU3VidGl0bGU6ICdHZXJhciBhIHVybCBkbyBtYXBhIGUgY29tcGFydGlsaGFyIGNvbSBvdXRyb3MnLFxuICAgICAgY2xvdWRUaXRsZTogJ0FybWF6ZW5hbWVudG8gQ2xvdWQnLFxuICAgICAgY2xvdWRTdWJ0aXRsZTogJ0NvbmVjdGUtc2UgZSBlbnZpZSBvcyBkYWRvcyBkbyBtYXBhIHBhcmEgbyBzZXUgYXJtYXplbmFtZW50byBjbG91ZCBwZXNzb2FsJyxcbiAgICAgIHNoYXJlRGlzY2xhaW1lcjpcbiAgICAgICAgJ2tlcGxlci5nbCBpcsOhIHNhbHZhciBvcyBkYWRvcyBkbyBtYXBhIGVtIHNldSBhcm1hemVuYW1lbnRvIGNsb3VkIHBlc3NvYWwsIGFwZW5hcyBwZXNzb2FzIGNvbSBhIFVSTCBwb2RlbSBhY2Vzc2FyIG8gc2V1IG1hcGEgZSBkYWRvcy4gJyArXG4gICAgICAgICdWb2PDqiBwb2RlIGVkaXRhci9kZWxldGFyIG8gYXJxdWl2byBkZSBkYWRvcyBuYSBzdWEgY29udGEgZGUgYXJtYXplbmFtZW50byBjbG91ZCBlbSBxdWFscXVlciBtb21lbnRvLicsXG4gICAgICBnb3RvUGFnZTogJ1bDoSBwYXJhIGEgc3VhIHDDoWdpbmEgS2VwbGVyLmdsIHtjdXJyZW50UHJvdmlkZXJ9J1xuICAgIH0sXG4gICAgc3RhdHVzUGFuZWw6IHtcbiAgICAgIG1hcFVwbG9hZGluZzogJ0VudmlhbmRvIE1hcGEnLFxuICAgICAgZXJyb3I6ICdFcnJvJ1xuICAgIH0sXG4gICAgc2F2ZU1hcDoge1xuICAgICAgdGl0bGU6ICdBcm1hemVuYW1lbnRvIENsb3VkJyxcbiAgICAgIHN1YnRpdGxlOiAnQ29uZWN0ZS1zZSBwYXJhIHNhbHZhciBvIG1hcGEgcGFyYSBvIHNldSBhcm1hemVuYW1lbnRvIGNsb3VkIHBlc3NvYWwnXG4gICAgfSxcbiAgICBleHBvcnRNYXA6IHtcbiAgICAgIGZvcm1hdFRpdGxlOiAnRm9ybWF0byBkbyBtYXBhJyxcbiAgICAgIGZvcm1hdFN1YnRpdGxlOiAnRXNjb2xoZXIgbyBmb3JtYXRvIGRlIG1hcGEgcGFyYSBleHBvcnRhcicsXG4gICAgICBodG1sOiB7XG4gICAgICAgIHNlbGVjdGlvbjogJ0V4cG9ydGFyIHNldSBtYXBhIGVtIHVtIGFycXVpdm8gaHRtbCBpbnRlcmF0aXZvLicsXG4gICAgICAgIHRva2VuVGl0bGU6ICdDaGF2ZSBkZSBhY2Vzc28gZG8gTWFwYm94JyxcbiAgICAgICAgdG9rZW5TdWJ0aXRsZTogJ1VzZSBhIHN1YSBwcsOzcHJpYSBjaGF2ZSBkZSBhY2Vzc28gTWFwYm94IGVtIHNldSBhcnF1aXZvIGh0bWwgKG9wY2lvbmFsKScsXG4gICAgICAgIHRva2VuUGxhY2Vob2xkZXI6ICdDb2xlIGEgc3VhIGNoYXZlIGRlIGFjZXNzbyBNYXBib3gnLFxuICAgICAgICB0b2tlbk1pc3VzZVdhcm5pbmc6XG4gICAgICAgICAgJyogU2Ugdm9jw6ogbsOjbyBmb3JuZWNlciBhIHN1YSBwcsOzcHJpYSBjaGF2ZSBkZSBhY2Vzc28sIG8gbWFwYSBwb2RlIGZhbGhhciBlbSBleGliaXIgYSBxdWFscXVlciBtb21lbnRvIHF1YW5kbyBuw7NzIHN1YnN0aXR1aXJtb3MgYSBub3NzYSBwYXJhIGV2aXRhciBtYXUgdXNvLiAnLFxuICAgICAgICB0b2tlbkRpc2NsYWltZXI6XG4gICAgICAgICAgJ1ZvY8OqIHBvZGUgdHJvY2FyIGEgc3VhIGNoYXZlIGRlIGFjZXNzbyBNYXBib3ggbWFpcyB0YXJkZSB1dGl6YW5kbyBhcyBpbnN0cnXDp8O1ZXMgc2VndWludGVzOiAnLFxuICAgICAgICB0b2tlblVwZGF0ZTogJ0NvbW8gYXR1YWxpemFyIGEgY2hhdmUgZGUgYWNlc3NvIGRlIHVtIG1hcGEgZXhpc3RlbnRlLicsXG4gICAgICAgIG1vZGVUaXRsZTogJ01vZG8gZG8gTWFwYScsXG4gICAgICAgIG1vZGVTdWJ0aXRsZTE6ICdTZWxlY2lvbmFyIG8gbW9kbyBkbyBhcGxpY2F0aXZvLiBNYWlzICcsXG4gICAgICAgIG1vZGVTdWJ0aXRsZTI6ICdpbmZvJyxcbiAgICAgICAgbW9kZURlc2NyaXB0aW9uOiAnUGVybWl0aXIgdXN1w6FyaW9zIGEge21vZGV9IG8gbWFwYScsXG4gICAgICAgIHJlYWQ6ICdsZXInLFxuICAgICAgICBlZGl0OiAnZWRpdGFyJ1xuICAgICAgfSxcbiAgICAgIGpzb246IHtcbiAgICAgICAgY29uZmlnVGl0bGU6ICdDb25maWd1cmHDp8O1ZXMgZG8gTWFwYScsXG4gICAgICAgIGNvbmZpZ0Rpc2NsYWltZXI6XG4gICAgICAgICAgJ0EgY29uZmlndXJhw6fDo28gZG8gbWFwYSBzZXLDoSBpbmNsdWlkYSBubyBhcnF1aXZvIEpzb24uIFNlIHZvY8OqIGVzdMOhIHV0aWxpemFuZG8ga2VwbGVyLmdsIG5vIHNldSBwcsOzcHJpbyBtYXBhLiBWb2PDqiBwb2RlIGNvcGlhciBlc3NhIGNvbmZpZ3VyYcOnw6NvIGUgcGFzc2FyIHBhcmEgZWxlICcsXG4gICAgICAgIHNlbGVjdGlvbjpcbiAgICAgICAgICAnRXhwb3J0YXIgYXR1YWlzIGRhZG9zIGUgY29uZmlndXJhw6fDtWVzIGRvIG1hcGEgZW0gdW0gw7puaWNvIGFycXVpdm8gSnNvbi4gVm9jw6ogcG9kZSBtYWlzIHRhcmRlIGFicmlyIG8gbWVzbW8gbWFwYSBlbnZpYW5kbyBlc3NlIGFycXVpdm8gcGFyYSBvIGtlcGxlci5nbC4nLFxuICAgICAgICBkaXNjbGFpbWVyOlxuICAgICAgICAgICcqIENvbmZpZ3VyYcOnw6NvIGRvIG1hcGEgw6kgYWNsb3BhZG8gY29tIGNvbmp1bnRvIGRlIGRhZG9zIGNhcnJlZ2Fkb3MuIOKAmGRhdGFJZOKAmSDDqSB1dGlsaXphZG8gcGFyYSBsaWdhciBhcyBjYW1hZGFzLCBmaWx0cm9zLCBlIGRpY2FzIGRlIGNvbnRleHRvcyBhIGNvbmp1bnRvIGRlIGRhZG9zIGV4cGVjw61maWNvcy4gJyArXG4gICAgICAgICAgJ1F1YW5kbyBwYXNzYW5kbyBlc3NhIGNvbmZpZ3VyYcOnw6NvIHBhcmEgYWRkRGF0YVRvTWFwLCB0ZW5oYSBjZXJ0ZXphIGRlIHF1ZSBvIGlkIGRvIGNvbmp1bnRvIGRlIGRhZG9zIGNvbWJpbmEgY29tIG8ocykgZGF0YUlkL3MgbmVzc2EgY29uZmlndXJhw6fDo28uJ1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9hZGluZ0RpYWxvZzoge1xuICAgICAgbG9hZGluZzogJ0NhcnJlZ2FuZG8uLi4nXG4gICAgfSxcbiAgICBsb2FkRGF0YToge1xuICAgICAgdXBsb2FkOiAnQ2FycmVnYXIgYXJxdWl2bycsXG4gICAgICBzdG9yYWdlOiAnQ2FycmVnYXIgZG8gYXJtYXplbmFtZW50bydcbiAgICB9LFxuICAgIHRyaXBJbmZvOiB7XG4gICAgICB0aXRsZTogJ0NvbW8gaGFiaWxpdGFyIGFuaW1hw6fDo28gZGUgdmlhZ2VtJyxcbiAgICAgIGRlc2NyaXB0aW9uMTpcbiAgICAgICAgJ1BhcmEgYW5pbWFyIG8gY2FtaW5obywgbyBkYWRvIGdlb0pTT04gZGV2ZSBjb250ZXIgYExpbmVTdHJpbmdgIG5hIHN1YSBwcm9wcmllZGFkZSBnZW9tZXRyeSwgZSBhcyBjb29yZGVuYWRhcyBuYSBMaW5lU3RyaW5nIGRldmVtIHRlciA0IGVsZW1lbnRvcyBubyBzZWd1aW50ZSBmb3JtYXRvJyxcbiAgICAgIGNvZGU6ICcgW2xvbmdpdHVkZSwgbGF0aXR1ZGUsIGFsdGl0dWRlLCBkYXRhXSAnLFxuICAgICAgZGVzY3JpcHRpb24yOlxuICAgICAgICAnY29tIHVtIHVsdGltbyBlbGVtZW50byBzZW5kbyB1bWEgZGF0YS4gVW0gZm9ybWF0byBkZSBkYXRhIHbDoWxpZGEgaW5jbHVpIHNlZ3VuZG9zIHVuaXggY29tbyBgMTU2NDE4NDM2M2Agb3UgZW0gbWlsaXNlZ3VuZG9zIGNvbW8gYDE1NjQxODQzNjMwMDBgLicsXG4gICAgICBleGFtcGxlOiAnRXhlbXBsbzonXG4gICAgfSxcbiAgICBpY29uSW5mbzoge1xuICAgICAgdGl0bGU6ICdDb21vIGRlc2VuaGFyIMOtY29uZXMnLFxuICAgICAgZGVzY3JpcHRpb24xOlxuICAgICAgICAnTm8gc2V1IGNzdiwgY3JpZSB1bWEgY29sdW5hLCBjb2xvcXVlIG8gbm9tZSBkbyDDrWNvbmUgcXVlIHZvY8OqIHF1ZXIgZGVzZW5oYXIgbmVsZS4gVm9jw6ogcG9kZSBkZWl4YXIgbyBjYW1wbyB2YXppbyBzZSB2b2PDqiBuw6NvIGRlc2VqYXIgcXVlIG8gw61jb25lIGFwYXJlw6dhIHBhcmEgYWxndW5zIHBvbnRvcy4gUXVhbmRvIGEgY29sdW5hIHRlbSBub21lJyxcbiAgICAgIGNvZGU6ICdpY29uJyxcbiAgICAgIGRlc2NyaXB0aW9uMjogJyBrZXBsZXIuZ2wgaXLDoSBhdXRvbWF0aWNhbWVudGUgY3JpYXIgdW1hIGNhbWFkYSBkZSDDrWNvbmUgcGFyYSB2b2PDqi4nLFxuICAgICAgZXhhbXBsZTogJ0V4ZW1wbG9zOicsXG4gICAgICBpY29uczogJ8ONY29uZXMnXG4gICAgfSxcbiAgICBzdG9yYWdlTWFwVmlld2VyOiB7XG4gICAgICBsYXN0TW9kaWZpZWQ6ICdNb2RpZmljYWRvIGjDoSB7bGFzdFVwZGF0ZWR9JyxcbiAgICAgIGJhY2s6ICdWb2x0YXInXG4gICAgfSxcbiAgICBvdmVyd3JpdGVNYXA6IHtcbiAgICAgIHRpdGxlOiAnU2FsdmFuZG8gbWFwYS4uLicsXG4gICAgICBhbHJlYWR5RXhpc3RzOiAnasOhIGV4aXN0ZSBubyBtYXBhIHttYXBTYXZlZH0uIFZvY8OqIGRlc2VqYXJpYSBzb2JyZXNjcmV2ZXIgbyBtYXBhPydcbiAgICB9LFxuICAgIGxvYWRTdG9yYWdlTWFwOiB7XG4gICAgICBiYWNrOiAnVm9sdGFyJyxcbiAgICAgIGdvVG9QYWdlOiAnVsOhIHBhcmEgYSBzdWEgcMOhZ2luYSB7ZGlzcGxheU5hbWV9IGRvIEtlcGxlci5nbCcsXG4gICAgICBzdG9yYWdlTWFwczogJ0FybWF6ZW5hbWVudG8gLyBNYXBhcycsXG4gICAgICBub1NhdmVkTWFwczogJ05lbmh1bSBtYXBhIHNhbHZvJ1xuICAgIH1cbiAgfSxcbiAgaGVhZGVyOiB7XG4gICAgdmlzaWJsZUxheWVyczogJ0NhbWFkYXMgVmlzw612ZWlzJyxcbiAgICBsYXllckxlZ2VuZDogJ0xlZ2VuZGEgZGEgQ2FtYWRhJ1xuICB9LFxuICBpbnRlcmFjdGlvbnM6IHtcbiAgICB0b29sdGlwOiAnRGljYSBkZSBjb250ZXh0bycsXG4gICAgYnJ1c2g6ICdQaW5jZWwnLFxuICAgIGNvb3JkaW5hdGU6ICdDb29yZGVuYWRhcydcbiAgfSxcbiAgbGF5ZXJCbGVuZGluZzoge1xuICAgIHRpdGxlOiAnTWlzdHVyYSBkZSBDYW1hZGFzJyxcbiAgICBhZGRpdGl2ZTogJ2FkaXRpdm8nLFxuICAgIG5vcm1hbDogJ25vcm1hbCcsXG4gICAgc3VidHJhY3RpdmU6ICdzdWJ0cmF0aXZvJ1xuICB9LFxuICBjb2x1bW5zOiB7XG4gICAgdGl0bGU6ICdDb2x1bmFzJyxcbiAgICBsYXQ6ICdsYXQnLFxuICAgIGxuZzogJ2xvbicsXG4gICAgYWx0aXR1ZGU6ICdhbHRpdHVkZScsXG4gICAgaWNvbjogJ8OtY29uZScsXG4gICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgIGFyYzoge1xuICAgICAgbGF0MDogJ29yaWdlbSBsYXQnLFxuICAgICAgbG5nMDogJ29yaWdlbSBsbmcnLFxuICAgICAgbGF0MTogJ2Rlc3Rpbm8gbGF0JyxcbiAgICAgIGxuZzE6ICdkZXN0aW5vIGxuZydcbiAgICB9LFxuICAgIGxpbmU6IHtcbiAgICAgIGFsdDA6ICdvcmlnZW0gYWx0aXR1ZGUnLFxuICAgICAgYWx0MTogJ2Rlc3Rpbm8gYWx0aXR1ZGUnXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiAnVGFtYW5obyBkYSBHcmFkZSAoa20pJ1xuICAgIH0sXG4gICAgaGV4YWdvbjoge1xuICAgICAgd29ybGRVbml0U2l6ZTogJ1JhaW8gZG8gSGV4w6Fnb25vIChrbSknXG4gICAgfVxuICB9LFxuICBjb2xvcjoge1xuICAgIGN1c3RvbVBhbGV0dGU6ICdQYWxldGFzIGN1c3RvbWl6YWRhcycsXG4gICAgc3RlcHM6ICdjYW1pbmhvcycsXG4gICAgdHlwZTogJ3RpcG8nLFxuICAgIHJldmVyc2VkOiAncmV2ZXJzbydcbiAgfSxcbiAgc2NhbGU6IHtcbiAgICBjb2xvclNjYWxlOiAnRXNjYWxhIGRhIENvcicsXG4gICAgc2l6ZVNjYWxlOiAnVGFtYW5obyBkYSBFc2NhbGEnLFxuICAgIHN0cm9rZVNjYWxlOiAnRXNjYWxhIGRvIFRyYcOnbycsXG4gICAgc2NhbGU6ICdFc2NhbGEnXG4gIH0sXG4gIGZpbGVVcGxvYWRlcjoge1xuICAgIG1lc3NhZ2U6ICdBcnJhc3RlIGUgc29sdGUgc2V1KHMpIGFycXVpdm8ocykgYXF1aScsXG4gICAgY2hyb21lTWVzc2FnZTpcbiAgICAgICcqVXN1w6FyaW9zIGRvIGNocm9tZTogTyBsaW1pdGUgZGUgdGFtYW5obyBkZSBhcnF1aXZvIMOpIDI1MG1iLCBzZSB2b2PDqiBwcmVjaXNhIGZhemVyIHVwbG9hZCBkZSBhcnF1aXZvcyBtYWlvcmVzIHRlbnRlIG8gU2FmYXJpJyxcbiAgICBkaXNjbGFpbWVyOlxuICAgICAgJyprZXBsZXIuZ2wgw6kgdW1hIGFwbGljYcOnw6NvIGNsaWVudC1zaWRlLCBzZW0gdW0gc2Vydmlkb3IgYmFja2VuZC4gT3MgZGFkb3MgZmljYW0gYXBlbmFzIG5hIHN1YSBtw6FxdWluYS9icm93c2VyLiAnICtcbiAgICAgICdOZW5odW1hIGluZm9ybWHDp8OjbyBvdSBkYWRvcyBkZSBtYXBhIMOpIGVudmlhZG8gcGFyYSBxdWFscXVlciBzZXJ2ZXIuJyxcbiAgICBjb25maWdVcGxvYWRNZXNzYWdlOlxuICAgICAgJ0VudmllIHtmaWxlRm9ybWF0TmFtZXN9IG91IG1hcGFzIHNhbHZvcyAqKkpzb24qKi4gTGVpYSBtYWlzIHNvYnJlIFsqKnRpcG9zIGRlIGFycXVpdm9zIHN1cG9ydGFkb3MqKl0nLFxuICAgIGJyb3dzZUZpbGVzOiAncHJvY3VyZSBzZXVzIGFycXVpdm9zJyxcbiAgICB1cGxvYWRpbmc6ICdFbnZpYW5kbycsXG4gICAgZmlsZU5vdFN1cHBvcnRlZDogJ0FycXVpdm8ge2Vycm9yRmlsZXN9IG7Do28gw6kgc3Vwb3J0YWRvLicsXG4gICAgb3I6ICdvdSdcbiAgfSxcbiAgZGVuc2l0eTogJ2RlbnNpZGFkZScsXG4gICdCdWcgUmVwb3J0JzogJ1JlcG9ydGFyIEJ1ZycsXG4gICdVc2VyIEd1aWRlJzogJ0d1aWEgZG8gVXN1w6FyaW8nLFxuICBTYXZlOiAnU2FsdmFyJyxcbiAgU2hhcmU6ICdDb21wYXJ0aWxoYXInXG59O1xuIl19