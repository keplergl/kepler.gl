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
    heightRange: 'Alcance da Altura'
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
    configUploadMessage: 'Envie **CSV**, **GeoJson** ou mapas salvos **Json**. Leia mais sobre [**tipos de arquivos suportados**]',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2NhbGl6YXRpb24vcHQuanMiXSwibmFtZXMiOlsicHJvcGVydHkiLCJ3ZWlnaHQiLCJsYWJlbCIsImZpbGxDb2xvciIsImNvbG9yIiwic3Ryb2tlQ29sb3IiLCJyYWRpdXMiLCJvdXRsaW5lIiwic3Ryb2tlIiwiZGVuc2l0eSIsImhlaWdodCIsInN1bSIsInBvaW50Q291bnQiLCJwbGFjZWhvbGRlciIsInNlYXJjaCIsInNlbGVjdEZpZWxkIiwieUF4aXMiLCJzZWxlY3RUeXBlIiwic2VsZWN0VmFsdWUiLCJlbnRlclZhbHVlIiwiZW1wdHkiLCJtaXNjIiwiYnkiLCJ2YWx1ZXNJbiIsInZhbHVlRXF1YWxzIiwiZGF0YVNvdXJjZSIsImJydXNoUmFkaXVzIiwibWFwTGF5ZXJzIiwidGl0bGUiLCJyb2FkIiwiYm9yZGVyIiwiYnVpbGRpbmciLCJ3YXRlciIsImxhbmQiLCJwYW5lbCIsInRleHQiLCJsYWJlbFdpdGhJZCIsImZvbnRTaXplIiwiZm9udENvbG9yIiwidGV4dEFuY2hvciIsImFsaWdubWVudCIsImFkZE1vcmVMYWJlbCIsInNpZGViYXIiLCJwYW5lbHMiLCJsYXllciIsImZpbHRlciIsImludGVyYWN0aW9uIiwiYmFzZW1hcCIsInJlcXVpcmVkIiwicHJvcGVydHlCYXNlZE9uIiwiY292ZXJhZ2UiLCJzdHJva2VXaWR0aCIsImJhc2ljIiwidHJhaWxMZW5ndGgiLCJ0cmFpbExlbmd0aERlc2NyaXB0aW9uIiwibmV3TGF5ZXIiLCJlbGV2YXRpb25CeURlc2NyaXB0aW9uIiwiY29sb3JCeURlc2NyaXB0aW9uIiwiYWdncmVnYXRlQnkiLCJ0eXBlIiwicG9pbnQiLCJhcmMiLCJsaW5lIiwiZ3JpZCIsImhleGJpbiIsInBvbHlnb24iLCJnZW9qc29uIiwiY2x1c3RlciIsImljb24iLCJoZWF0bWFwIiwiaGV4YWdvbiIsImhleGFnb25pZCIsInRyaXAiLCJzMiIsImxheWVyVmlzQ29uZmlncyIsInN0cm9rZVdpZHRoUmFuZ2UiLCJmaXhlZFJhZGl1cyIsImZpeGVkUmFkaXVzRGVzY3JpcHRpb24iLCJyYWRpdXNSYW5nZSIsImNsdXN0ZXJSYWRpdXMiLCJyYWRpdXNSYW5nZVBpeGVscyIsIm9wYWNpdHkiLCJjb2xvclJhbmdlIiwic3Ryb2tlQ29sb3JSYW5nZSIsInRhcmdldENvbG9yIiwiY29sb3JBZ2dyZWdhdGlvbiIsImhlaWdodEFnZ3JlZ2F0aW9uIiwicmVzb2x1dGlvblJhbmdlIiwic2l6ZVNjYWxlIiwid29ybGRVbml0U2l6ZSIsImVsZXZhdGlvblNjYWxlIiwiaGVpZ2h0U2NhbGUiLCJjb3ZlcmFnZVJhbmdlIiwiaGlnaFByZWNpc2lvblJlbmRlcmluZyIsImhpZ2hQcmVjaXNpb25SZW5kZXJpbmdEZXNjcmlwdGlvbiIsImhlaWdodERlc2NyaXB0aW9uIiwiZmlsbCIsImVuYWJsZVBvbHlnb25IZWlnaHQiLCJzaG93V2lyZWZyYW1lIiwid2VpZ2h0SW50ZW5zaXR5Iiwiem9vbVNjYWxlIiwiaGVpZ2h0UmFuZ2UiLCJsYXllck1hbmFnZXIiLCJhZGREYXRhIiwiYWRkTGF5ZXIiLCJsYXllckJsZW5kaW5nIiwibWFwTWFuYWdlciIsIm1hcFN0eWxlIiwiYWRkTWFwU3R5bGUiLCJsYXllckNvbmZpZ3VyYXRpb24iLCJkZWZhdWx0RGVzY3JpcHRpb24iLCJob3dUbyIsImZpbHRlck1hbmFnZXIiLCJhZGRGaWx0ZXIiLCJkYXRhc2V0VGl0bGUiLCJzaG93RGF0YVRhYmxlIiwicmVtb3ZlRGF0YXNldCIsImRhdGFzZXRJbmZvIiwicm93Q291bnQiLCJ0b29sdGlwIiwiaGlkZUxheWVyIiwic2hvd0xheWVyIiwiaGlkZUZlYXR1cmUiLCJzaG93RmVhdHVyZSIsImhpZGUiLCJzaG93IiwicmVtb3ZlTGF5ZXIiLCJsYXllclNldHRpbmdzIiwiY2xvc2VQYW5lbCIsInN3aXRjaFRvRHVhbFZpZXciLCJzaG93TGVnZW5kIiwiZGlzYWJsZTNETWFwIiwiRHJhd09uTWFwIiwic2VsZWN0TG9jYWxlIiwiaGlkZUxheWVyUGFuZWwiLCJzaG93TGF5ZXJQYW5lbCIsIm1vdmVUb1RvcCIsInNlbGVjdEJhc2VNYXBTdHlsZSIsInRpbWVQbGF5YmFjayIsImNsb3VkU3RvcmFnZSIsInRvb2xiYXIiLCJleHBvcnRJbWFnZSIsImV4cG9ydERhdGEiLCJleHBvcnRNYXAiLCJzaGFyZU1hcFVSTCIsInNhdmVNYXAiLCJzZWxlY3QiLCJyZWN0YW5nbGUiLCJMT0NBTEVTIiwibW9kYWwiLCJkZWxldGVEYXRhc2V0IiwiYWRkRGF0YVRvTWFwIiwiYWRkQ3VzdG9tTWFwYm94U3R5bGUiLCJzaGFyZVVSTCIsImJ1dHRvbiIsImRvd25sb2FkIiwiYWRkU3R5bGUiLCJzYXZlIiwiZGVmYXVsdENhbmNlbCIsImRlZmF1bHRDb25maXJtIiwicmF0aW9UaXRsZSIsInJhdGlvRGVzY3JpcHRpb24iLCJyYXRpb09yaWdpbmFsU2NyZWVuIiwicmF0aW9DdXN0b20iLCJyYXRpbzRfMyIsInJhdGlvMTZfOSIsInJlc29sdXRpb25UaXRsZSIsInJlc29sdXRpb25EZXNjcmlwdGlvbiIsIm1hcExlZ2VuZFRpdGxlIiwibWFwTGVnZW5kQWRkIiwiZGF0YXNldFN1YnRpdGxlIiwiYWxsRGF0YXNldHMiLCJkYXRhVHlwZVRpdGxlIiwiZGF0YVR5cGVTdWJ0aXRsZSIsImZpbHRlckRhdGFUaXRsZSIsImZpbHRlckRhdGFTdWJ0aXRsZSIsImZpbHRlcmVkRGF0YSIsInVuZmlsdGVyZWREYXRhIiwiZmlsZUNvdW50IiwiZGVsZXRlRGF0YSIsIndhcm5pbmciLCJwdWJsaXNoVGl0bGUiLCJwdWJsaXNoU3VidGl0bGUxIiwicHVibGlzaFN1YnRpdGxlMiIsInB1Ymxpc2hTdWJ0aXRsZTMiLCJwdWJsaXNoU3VidGl0bGU0IiwicHVibGlzaFN1YnRpdGxlNSIsInB1Ymxpc2hTdWJ0aXRsZTYiLCJwdWJsaXNoU3VidGl0bGU3IiwiZXhhbXBsZVRva2VuIiwicGFzdGVUaXRsZSIsInBhc3RlU3VidGl0bGUxIiwicGFzdGVTdWJ0aXRsZTIiLCJuYW1pbmdUaXRsZSIsInNoYXJlTWFwIiwic2hhcmVVcmlUaXRsZSIsInNoYXJlVXJpU3VidGl0bGUiLCJjbG91ZFRpdGxlIiwiY2xvdWRTdWJ0aXRsZSIsInNoYXJlRGlzY2xhaW1lciIsImdvdG9QYWdlIiwic3RhdHVzUGFuZWwiLCJtYXBVcGxvYWRpbmciLCJlcnJvciIsInN1YnRpdGxlIiwiZm9ybWF0VGl0bGUiLCJmb3JtYXRTdWJ0aXRsZSIsImh0bWwiLCJzZWxlY3Rpb24iLCJ0b2tlblRpdGxlIiwidG9rZW5TdWJ0aXRsZSIsInRva2VuUGxhY2Vob2xkZXIiLCJ0b2tlbk1pc3VzZVdhcm5pbmciLCJ0b2tlbkRpc2NsYWltZXIiLCJ0b2tlblVwZGF0ZSIsIm1vZGVUaXRsZSIsIm1vZGVTdWJ0aXRsZTEiLCJtb2RlU3VidGl0bGUyIiwibW9kZURlc2NyaXB0aW9uIiwicmVhZCIsImVkaXQiLCJqc29uIiwiY29uZmlnVGl0bGUiLCJjb25maWdEaXNjbGFpbWVyIiwiZGlzY2xhaW1lciIsImxvYWRpbmdEaWFsb2ciLCJsb2FkaW5nIiwibG9hZERhdGEiLCJ1cGxvYWQiLCJzdG9yYWdlIiwidHJpcEluZm8iLCJkZXNjcmlwdGlvbjEiLCJjb2RlIiwiZGVzY3JpcHRpb24yIiwiZXhhbXBsZSIsImljb25JbmZvIiwiaWNvbnMiLCJzdG9yYWdlTWFwVmlld2VyIiwibGFzdE1vZGlmaWVkIiwiYmFjayIsIm92ZXJ3cml0ZU1hcCIsImFscmVhZHlFeGlzdHMiLCJsb2FkU3RvcmFnZU1hcCIsImdvVG9QYWdlIiwic3RvcmFnZU1hcHMiLCJub1NhdmVkTWFwcyIsImhlYWRlciIsInZpc2libGVMYXllcnMiLCJsYXllckxlZ2VuZCIsImludGVyYWN0aW9ucyIsImJydXNoIiwiY29vcmRpbmF0ZSIsImFkZGl0aXZlIiwibm9ybWFsIiwic3VidHJhY3RpdmUiLCJjb2x1bW5zIiwibGF0IiwibG5nIiwiYWx0aXR1ZGUiLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiY3VzdG9tUGFsZXR0ZSIsInN0ZXBzIiwicmV2ZXJzZWQiLCJzY2FsZSIsImNvbG9yU2NhbGUiLCJzdHJva2VTY2FsZSIsImZpbGVVcGxvYWRlciIsIm1lc3NhZ2UiLCJjaHJvbWVNZXNzYWdlIiwiY29uZmlnVXBsb2FkTWVzc2FnZSIsImJyb3dzZUZpbGVzIiwidXBsb2FkaW5nIiwiZmlsZU5vdFN1cHBvcnRlZCIsIm9yIiwiU2F2ZSIsIlNoYXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7Ozs7O2VBRWU7QUFDYkEsRUFBQUEsUUFBUSxFQUFFO0FBQ1JDLElBQUFBLE1BQU0sRUFBRSxvQkFEQTtBQUVSQyxJQUFBQSxLQUFLLEVBQUUsUUFGQztBQUdSQyxJQUFBQSxTQUFTLEVBQUUsc0JBSEg7QUFJUkMsSUFBQUEsS0FBSyxFQUFFLEtBSkM7QUFLUkMsSUFBQUEsV0FBVyxFQUFFLGNBTEw7QUFNUkMsSUFBQUEsTUFBTSxFQUFFLE1BTkE7QUFPUkMsSUFBQUEsT0FBTyxFQUFFLFVBUEQ7QUFRUkMsSUFBQUEsTUFBTSxFQUFFLFNBUkE7QUFTUkMsSUFBQUEsT0FBTyxFQUFFLFdBVEQ7QUFVUkMsSUFBQUEsTUFBTSxFQUFFLFFBVkE7QUFXUkMsSUFBQUEsR0FBRyxFQUFFLE1BWEc7QUFZUkMsSUFBQUEsVUFBVSxFQUFFO0FBWkosR0FERztBQWViQyxFQUFBQSxXQUFXLEVBQUU7QUFDWEMsSUFBQUEsTUFBTSxFQUFFLFdBREc7QUFFWEMsSUFBQUEsV0FBVyxFQUFFLG9CQUZGO0FBR1hDLElBQUFBLEtBQUssRUFBRSxRQUhJO0FBSVhDLElBQUFBLFVBQVUsRUFBRSxtQkFKRDtBQUtYQyxJQUFBQSxXQUFXLEVBQUUsb0JBTEY7QUFNWEMsSUFBQUEsVUFBVSxFQUFFLGlCQU5EO0FBT1hDLElBQUFBLEtBQUssRUFBRTtBQVBJLEdBZkE7QUF3QmJDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxFQUFFLEVBQUUsRUFEQTtBQUVKQyxJQUFBQSxRQUFRLEVBQUUsWUFGTjtBQUdKQyxJQUFBQSxXQUFXLEVBQUUsZUFIVDtBQUlKQyxJQUFBQSxVQUFVLEVBQUUsa0JBSlI7QUFLSkMsSUFB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RDtBQStaYjRRLEVBQUFBLElBQUksRUFBRSxRQS9aTztBQWdhYkMsRUFBQUEsS0FBSyxFQUFFO0FBaGFNLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjAgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge0xPQ0FMRVN9IGZyb20gJy4vbG9jYWxlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcHJvcGVydHk6IHtcbiAgICB3ZWlnaHQ6ICdFc3Blc3N1cmEgZG8gdGV4dG8nLFxuICAgIGxhYmVsOiAnUsOzdHVsbycsXG4gICAgZmlsbENvbG9yOiAnQ29yIGRvIHByZWVuY2hpbWVudG8nLFxuICAgIGNvbG9yOiAnQ29yJyxcbiAgICBzdHJva2VDb2xvcjogJ0NvciBkYSBib3JkYScsXG4gICAgcmFkaXVzOiAnUmFpbycsXG4gICAgb3V0bGluZTogJ0NvbnRvcm5vJyxcbiAgICBzdHJva2U6ICdUcmHDp2FkbycsXG4gICAgZGVuc2l0eTogJ0RlbnNpZGFkZScsXG4gICAgaGVpZ2h0OiAnQWx0dXJhJyxcbiAgICBzdW06ICdTb21hJyxcbiAgICBwb2ludENvdW50OiAnQ29udGFnZW0gZGUgUG9udG9zJ1xuICB9LFxuICBwbGFjZWhvbGRlcjoge1xuICAgIHNlYXJjaDogJ1Blc3F1aXNhcicsXG4gICAgc2VsZWN0RmllbGQ6ICdTZWxlY2lvbmUgdW0gY2FtcG8nLFxuICAgIHlBeGlzOiAnRWl4byBZJyxcbiAgICBzZWxlY3RUeXBlOiAnU2VsZWNpb25lIHVtIFRpcG8nLFxuICAgIHNlbGVjdFZhbHVlOiAnU2VsZWNpb25lIHVtIHZhbG9yJyxcbiAgICBlbnRlclZhbHVlOiAnSW5zaXJhIHVtIHZhbG9yJyxcbiAgICBlbXB0eTogJ1ZhemlvJ1xuICB9LFxuICBtaXNjOiB7XG4gICAgYnk6ICcnLFxuICAgIHZhbHVlc0luOiAnVmFsb3JlcyBlbScsXG4gICAgdmFsdWVFcXVhbHM6ICdWYWxvciBpZ3VhbCBhJyxcbiAgICBkYXRhU291cmNlOiAnT3JpZ2VtIGRvcyBkYWRvcycsXG4gICAgYnJ1c2hSYWRpdXM6ICdSYWlvIGRvIFRyYcOnbyAoa20pJyxcbiAgICBlbXB0eTogJyAnXG4gIH0sXG4gIG1hcExheWVyczoge1xuICAgIHRpdGxlOiAnQ2FtYWRhcyBkbyBtYXBhJyxcbiAgICBsYWJlbDogJ1LDs3R1bG8nLFxuICAgIHJvYWQ6ICdFc3RyYWRhJyxcbiAgICBib3JkZXI6ICdGcm9udGVpcmEnLFxuICAgIGJ1aWxkaW5nOiAnRWRpZsOtY2lvcycsXG4gICAgd2F0ZXI6ICfDgWd1YScsXG4gICAgbGFuZDogJ1RlcnJhJyxcbiAgICAnM2RCdWlsZGluZyc6ICdFZGlmw61jaW9zIGVtIDNkJ1xuICB9LFxuICBwYW5lbDoge1xuICAgIHRleHQ6IHtcbiAgICAgIGxhYmVsOiAnUsOzdHVsbycsXG4gICAgICBsYWJlbFdpdGhJZDogJ1LDs3R1bG8ge2xhYmVsSWR9JyxcbiAgICAgIGZvbnRTaXplOiAnVGFtYW5obyBkYSBmb250ZScsXG4gICAgICBmb250Q29sb3I6ICdDb3IgZGEgZm9udGUnLFxuICAgICAgdGV4dEFuY2hvcjogJ8OCbmNvcmEgZG8gdGV4dG8nLFxuICAgICAgYWxpZ25tZW50OiAnQWxpbmhhbWVudG8nLFxuICAgICAgYWRkTW9yZUxhYmVsOiAnQWRpY2lvbmFyIG1haXMgUsOzdHVsb3MnXG4gICAgfVxuICB9LFxuICBzaWRlYmFyOiB7XG4gICAgcGFuZWxzOiB7XG4gICAgICBsYXllcjogJ0NhbWFkYXMnLFxuICAgICAgZmlsdGVyOiAnRmlsdHJvcycsXG4gICAgICBpbnRlcmFjdGlvbjogJ0ludGVyYcOnw7VlcycsXG4gICAgICBiYXNlbWFwOiAnTWFwYSBiYXNlJ1xuICAgIH1cbiAgfSxcbiAgbGF5ZXI6IHtcbiAgICByZXF1aXJlZDogJ09icmlnYXTDs3JpbyonLFxuICAgIHJhZGl1czogJ1JhaW8nLFxuICAgIGNvbG9yOiAnQ29yJyxcbiAgICBmaWxsQ29sb3I6ICdDb3IgZGUgcHJlZW5jaGltZW50bycsXG4gICAgb3V0bGluZTogJ0NvbnRvcm5vJyxcbiAgICB3ZWlnaHQ6ICdFc3Blc3N1cmEnLFxuICAgIHByb3BlcnR5QmFzZWRPbjogJ3twcm9wZXJ0eX0gYmFzZWFkYSBlbScsXG4gICAgY292ZXJhZ2U6ICdDb2JlcnR1cmEnLFxuICAgIHN0cm9rZTogJ1RyYcOnbycsXG4gICAgc3Ryb2tlV2lkdGg6ICdMYXJndXJhIGRvIFRyYcOnYWRvJyxcbiAgICBzdHJva2VDb2xvcjogJ0NvciBkbyBUcmHDp2FkbycsXG4gICAgYmFzaWM6ICdCw6FzaWNvJyxcbiAgICB0cmFpbExlbmd0aDogJ0NvbXByaW1lbnRvIGRhIHRyaWxoYScsXG4gICAgdHJhaWxMZW5ndGhEZXNjcmlwdGlvbjogJ07Dum1lcm8gZGUgc2VndW5kb3MgcGFyYSB1bSBjYW1pbmhvIGNvbXBsZXRhbWVudGUgZGVzYXBhcmVjZXInLFxuICAgIG5ld0xheWVyOiAnbm92YSBjYW1hZGEnLFxuICAgIGVsZXZhdGlvbkJ5RGVzY3JpcHRpb246ICdRdWFuZG8gZGVzbGlnYWRvLCBhIGFsdHVyYSDDqSBiYXNlYWRhIG5hIGNvbnRhZ2VtIGRlIHBvbnRvcycsXG4gICAgY29sb3JCeURlc2NyaXB0aW9uOiAnUXVhbmRvIGRlc2xpZ2FkbywgYSBjb3Igw6kgYmFzZWFkYSBuYSBjb250YWdlbSBkZSBwb250b3MnLFxuICAgIGFnZ3JlZ2F0ZUJ5OiAne2ZpZWxkfSBhZ3JlZ2FkbyBwb3InLFxuICAgICczRE1vZGVsJzogJ01vZGVsbyAzRCcsXG4gICAgJzNETW9kZWxPcHRpb25zJzogJ09ww6fDtWVzIGRvIE1vZGVsbyAzRCcsXG4gICAgdHlwZToge1xuICAgICAgcG9pbnQ6ICdwb250bycsXG4gICAgICBhcmM6ICdhcmNvJyxcbiAgICAgIGxpbmU6ICdsaW5oYScsXG4gICAgICBncmlkOiAnZ3JhZGUnLFxuICAgICAgaGV4YmluOiAnaGV4w6Fnb25vJyxcbiAgICAgIHBvbHlnb246ICdwb2zDrWdvbm8nLFxuICAgICAgZ2VvanNvbjogJ2dlb2pzb24nLFxuICAgICAgY2x1c3RlcjogJ2dydXBvJyxcbiAgICAgIGljb246ICdpY29uJyxcbiAgICAgIGhlYXRtYXA6ICdtYXBhIGRlIGNhbG9yJyxcbiAgICAgIGhleGFnb246ICdoZXjDoWdvbm8nLFxuICAgICAgaGV4YWdvbmlkOiAnSDMnLFxuICAgICAgdHJpcDogJ3ZpYWdlbScsXG4gICAgICBzMjogJ1MyJyxcbiAgICAgICczZCc6ICczRCdcbiAgICB9XG4gIH0sXG4gIGxheWVyVmlzQ29uZmlnczoge1xuICAgIHN0cm9rZVdpZHRoOiAnTGFyZ3VyYSBkbyBUcmHDp28nLFxuICAgIHN0cm9rZVdpZHRoUmFuZ2U6ICdBbGNhbmNlIGRhIExhcmd1cmEgZG8gVHJhw6dvJyxcbiAgICByYWRpdXM6ICdSYWlvJyxcbiAgICBmaXhlZFJhZGl1czogJ1JhaW8gYWp1c3RhZG8gcGFyYSBtZXRybycsXG4gICAgZml4ZWRSYWRpdXNEZXNjcmlwdGlvbjogJ1JhaW8gZG8gTWFwYSBwYXJhIFJhaW8gYWJzb2x1dG8gZW0gbWV0cm9zLCBlLmcuIDUgcGFyYSA1IG1ldHJvcycsXG4gICAgcmFkaXVzUmFuZ2U6ICdBbGNhbmNlIGRvIFJhaW8nLFxuICAgIGNsdXN0ZXJSYWRpdXM6ICdSYWlvIGRvIEFncnVwYW1lbnRvIGVtIHBpeGVscycsXG4gICAgcmFkaXVzUmFuZ2VQaXhlbHM6ICdBbGNhbmNlIGRvIFJhaW8gZW0gcGl4ZWxzJyxcbiAgICBvcGFjaXR5OiAnT3BhY2lkYWRlJyxcbiAgICBjb3ZlcmFnZTogJ0NvYmVydHVyYScsXG4gICAgb3V0bGluZTogJ0NvbnRvcm5vJyxcbiAgICBjb2xvclJhbmdlOiAnQWxjYW5jZSBkYSBDb3InLFxuICAgIHN0cm9rZTogJ1RyYcOnYWRvJyxcbiAgICBzdHJva2VDb2xvcjogJ0NvciBkbyBUcmHDp2FkbycsXG4gICAgc3Ryb2tlQ29sb3JSYW5nZTogJ0FsY2FuY2UgZGEgQ29yIGRvIFRyYcOnYWRvJyxcbiAgICB0YXJnZXRDb2xvcjogJ0NvciBkZSBkZXN0aW5vJyxcbiAgICBjb2xvckFnZ3JlZ2F0aW9uOiAnQWdyZWdhw6fDo28gZGEgQ29yJyxcbiAgICBoZWlnaHRBZ2dyZWdhdGlvbjogJ0FncmVnYcOnw6NvIGRhIEFsdHVyYScsXG4gICAgcmVzb2x1dGlvblJhbmdlOiAnQWxjYW5jZSBkYSBSZXNvbHXDp8OjbycsXG4gICAgc2l6ZVNjYWxlOiAnRXNjYWxhIGRlIHRhbWFuaG8nLFxuICAgIHdvcmxkVW5pdFNpemU6ICdUYW1hbmhvIHVuaXTDoXJpbyBkbyBtdW5kbycsXG4gICAgZWxldmF0aW9uU2NhbGU6ICdFc2NhbGEgZGUgRWxldmHDp8OjbycsXG4gICAgaGVpZ2h0U2NhbGU6ICdFc2NhbGEgZGUgQWx0dXJhJyxcbiAgICBjb3ZlcmFnZVJhbmdlOiAnQWxjYW5jZSBkZSBjb2JlcnR1cmEnLFxuICAgIGhpZ2hQcmVjaXNpb25SZW5kZXJpbmc6ICdSZW5kZXJpemHDp8OjbyBkZSBBbHRhIFByZWNpc8OjbycsXG4gICAgaGlnaFByZWNpc2lvblJlbmRlcmluZ0Rlc2NyaXB0aW9uOiAnQWx0YSBwcmVjaXPDo28gaXLDoSBlbSByZXN1bHRhciBlbSBiYWl4YSBwZXJmb3JtYW5jZScsXG4gICAgaGVpZ2h0OiAnQWx0dXJhJyxcbiAgICBoZWlnaHREZXNjcmlwdGlvbjpcbiAgICAgICdDbGlxdWUgbm8gYm90w6NvIG5vIGNhbnRvIHN1cGVyaW9yIGRpcmVpdG8gcGFyYSB0cm9jYXIgcGFyYSBhIHZpc3VhbGl6YcOnw6NvIDNkJyxcbiAgICBmaWxsOiAnUHJlZW5jaGltZW50bycsXG4gICAgZW5hYmxlUG9seWdvbkhlaWdodDogJ0hhYmlsaXRhciBBbHR1cmEgZGUgUG9sw61nb25vJyxcbiAgICBzaG93V2lyZWZyYW1lOiAnTW9zdHJhciBXaXJlZnJhbWUnLFxuICAgIHdlaWdodEludGVuc2l0eTogJ0ludGVuc2lkYWRlIGRhIEVzcGVzc3VyYScsXG4gICAgem9vbVNjYWxlOiAnRXNjYWxhIGRvIFpvb20nLFxuICAgIGhlaWdodFJhbmdlOiAnQWxjYW5jZSBkYSBBbHR1cmEnXG4gIH0sXG4gIGxheWVyTWFuYWdlcjoge1xuICAgIGFkZERhdGE6ICdBZGljaW9uYXIgRGFkb3MnLFxuICAgIGFkZExheWVyOiAnQWRpY2lvbmFyIENhbWFkYScsXG4gICAgbGF5ZXJCbGVuZGluZzogJ01pc3R1cmEgZGUgQ2FtYWRhJ1xuICB9LFxuICBtYXBNYW5hZ2VyOiB7XG4gICAgbWFwU3R5bGU6ICdFc3RpbG8gZG8gTWFwYScsXG4gICAgYWRkTWFwU3R5bGU6ICdBZGljaW9uYXIgRXN0aWxvIGRlIE1hcGEnLFxuICAgICczZEJ1aWxkaW5nQ29sb3InOiAnQ29yIGRvIEVkaWbDrWNpbyAzRCdcbiAgfSxcbiAgbGF5ZXJDb25maWd1cmF0aW9uOiB7XG4gICAgZGVmYXVsdERlc2NyaXB0aW9uOiAnQ2FsY3VsYXIge3Byb3BlcnR5fSBiYXNlYWRhIG5vIGNhbXBvIHNlbGVjaW9uYWRvJyxcbiAgICBob3dUbzogJ0NvbW8nXG4gIH0sXG4gIGZpbHRlck1hbmFnZXI6IHtcbiAgICBhZGRGaWx0ZXI6ICdBZGljaW9uYXIgRmlsdHJvJ1xuICB9LFxuICBkYXRhc2V0VGl0bGU6IHtcbiAgICBzaG93RGF0YVRhYmxlOiAnTW9zdHJhciB0YWJlbGEgZGUgZGFkb3MnLFxuICAgIHJlbW92ZURhdGFzZXQ6ICdSZW1vdmVyIHRhYmVsYSBkZSBkYWRvcydcbiAgfSxcbiAgZGF0YXNldEluZm86IHtcbiAgICByb3dDb3VudDogJ3tyb3dDb3VudH0gbGluaGFzJ1xuICB9LFxuICB0b29sdGlwOiB7XG4gICAgaGlkZUxheWVyOiAnZXNjb25kZXIgY2FtYWRhJyxcbiAgICBzaG93TGF5ZXI6ICdtb3N0cmFyIGNhbWFkYScsXG4gICAgaGlkZUZlYXR1cmU6ICdFc2NvbmRlciBwcm9wcmllZGFkZScsXG4gICAgc2hvd0ZlYXR1cmU6ICdNb3N0cmFyIHByb3ByaWVkYWRlJyxcbiAgICBoaWRlOiAnZXNjb25kZXInLFxuICAgIHNob3c6ICdtb3N0cmFyJyxcbiAgICByZW1vdmVMYXllcjogJ1JlbW92ZXIgQ2FtYWRhJyxcbiAgICBsYXllclNldHRpbmdzOiAnQ29uZmlndXJhw6fDtWVzIGRlIENhbWFkYScsXG4gICAgY2xvc2VQYW5lbDogJ0ZlY2hhciBwYWluZWwgYXR1YWwnLFxuICAgIHN3aXRjaFRvRHVhbFZpZXc6ICdUcm9jYXIgcGFyYSB2aXN1YWxpemHDp8OjbyBkdXBsYSBkZSBtYXBhJyxcbiAgICBzaG93TGVnZW5kOiAnbW9zdHJhciBsZWdlbmRhJyxcbiAgICBkaXNhYmxlM0RNYXA6ICdEZXNhYmlsaXRhciBNYXBhIDNEJyxcbiAgICBEcmF3T25NYXA6ICdEZXNlbmhhciBubyBtYXBhJyxcbiAgICBzZWxlY3RMb2NhbGU6ICdTZWxlY2lvbmFyIGzDrW5ndWEnLFxuICAgIGhpZGVMYXllclBhbmVsOiAnRXNjb25kZXIgcGFpbmVsIGRlIGNhbWFkYScsXG4gICAgc2hvd0xheWVyUGFuZWw6ICdNb3N0cmFyIHBhaW5lbCBkZSBjYW1hZGEnLFxuICAgIG1vdmVUb1RvcDogJ01vdmVyIHBhcmEgbyB0b3BvIGRhcyBjYW1hZGFzJyxcbiAgICBzZWxlY3RCYXNlTWFwU3R5bGU6ICdTZWxlY2lvbmFyIG8gRXN0aWxvIGRvIE1hcGEgQmFzZScsXG4gICAgZGVsZXRlOiAnRGVsZXRhcicsXG4gICAgdGltZVBsYXliYWNrOiAnVGVtcG8gZGUgcmVwcm9kdcOnw6NvJyxcbiAgICBjbG91ZFN0b3JhZ2U6ICdBcm1hemVuYW1lbnRvIENsb3VkJyxcbiAgICAnM0RNYXAnOiAnIE1hcGEgM0QnXG4gIH0sXG4gIHRvb2xiYXI6IHtcbiAgICBleHBvcnRJbWFnZTogJ0V4cG9ydGFyIEltYWdlbScsXG4gICAgZXhwb3J0RGF0YTogJ0V4cG9ydGFyIERhZG9zJyxcbiAgICBleHBvcnRNYXA6ICdFeHBvcnRhciBNYXBhJyxcbiAgICBzaGFyZU1hcFVSTDogJ0NvbXBhcnRpbGhhciBVUkwgZG8gTWFwYScsXG4gICAgc2F2ZU1hcDogJ1NhbHZhciBNYXBhJyxcbiAgICBzZWxlY3Q6ICdzZWxlY2lvbmFyJyxcbiAgICBwb2x5Z29uOiAncG9sw61nb25vJyxcbiAgICByZWN0YW5nbGU6ICdyZXTDom5ndWxvJyxcbiAgICBoaWRlOiAnZXNjb25kZXInLFxuICAgIHNob3c6ICdtb3N0cmFyJyxcbiAgICAuLi5MT0NBTEVTXG4gIH0sXG4gIG1vZGFsOiB7XG4gICAgdGl0bGU6IHtcbiAgICAgIGRlbGV0ZURhdGFzZXQ6ICdEZWxldGFyIENvbmp1bnRvIGRlIERhZG9zJyxcbiAgICAgIGFkZERhdGFUb01hcDogJ0FkaWNpb25hciBEYWRvcyBhbyBNYXBhJyxcbiAgICAgIGV4cG9ydEltYWdlOiAnRXhwb3J0YXIgSW1hZ2VtJyxcbiAgICAgIGV4cG9ydERhdGE6ICdFeHBvcnRhciBEYWRvcycsXG4gICAgICBleHBvcnRNYXA6ICdFeHBvcnRhciBNYXBhJyxcbiAgICAgIGFkZEN1c3RvbU1hcGJveFN0eWxlOiAnQWRpY2lvbmFyIEVzdGlsbyBNYXBib3ggQ3VzdG9taXphZG8nLFxuICAgICAgc2F2ZU1hcDogJ1NhbHZhciBNYXBhJyxcbiAgICAgIHNoYXJlVVJMOiAnQ29tcGFydGlsaGFyIFVSTCdcbiAgICB9LFxuICAgIGJ1dHRvbjoge1xuICAgICAgZGVsZXRlOiAnRGVsZXRhcicsXG4gICAgICBkb3dubG9hZDogJ0Rvd25sb2FkJyxcbiAgICAgIGV4cG9ydDogJ0V4cG9ydGFyJyxcbiAgICAgIGFkZFN0eWxlOiAnQWRpY2lvbmFyIEVzdGlsbycsXG4gICAgICBzYXZlOiAnU2FsdmFyJyxcbiAgICAgIGRlZmF1bHRDYW5jZWw6ICdDYW5jZWxhcicsXG4gICAgICBkZWZhdWx0Q29uZmlybTogJ0NvbmZpcm1hcidcbiAgICB9LFxuICAgIGV4cG9ydEltYWdlOiB7XG4gICAgICByYXRpb1RpdGxlOiAnUHJvcG9yw6fDo28nLFxuICAgICAgcmF0aW9EZXNjcmlwdGlvbjogJ0VzY29saGEgYSBwcm9wb3LDp8OjbyBwYXJhIHbDoXJpb3MgdXNvcy4nLFxuICAgICAgcmF0aW9PcmlnaW5hbFNjcmVlbjogJ1RlbGEgT3JpZ2luYWwnLFxuICAgICAgcmF0aW9DdXN0b206ICdDdXN0b21pemFkbycsXG4gICAgICByYXRpbzRfMzogJzQ6MycsXG4gICAgICByYXRpbzE2Xzk6ICcxNjo5JyxcbiAgICAgIHJlc29sdXRpb25UaXRsZTogJ1Jlc29sdcOnw6NvJyxcbiAgICAgIHJlc29sdXRpb25EZXNjcmlwdGlvbjogJ0FsdGEgcmVzb2x1w6fDo28gw6kgbWVsaG9yIHBhcmEgaW1wcmVzc8O1ZXMuJyxcbiAgICAgIG1hcExlZ2VuZFRpdGxlOiAnTGVnZW5kYSBkbyBNYXBhJyxcbiAgICAgIG1hcExlZ2VuZEFkZDogJ0FkaWNpb25hciBMZWdlbmRhIG5vIG1hcGEnXG4gICAgfSxcbiAgICBleHBvcnREYXRhOiB7XG4gICAgICBkYXRhc2V0VGl0bGU6ICdDb25qdW50byBkZSBkYWRvcycsXG4gICAgICBkYXRhc2V0U3VidGl0bGU6ICdFc2NvbGhhIG8gY29uanVudG8gZGUgZGFkb3MgcXVlIHZvY8OqIHF1ZXIgZXhwb3J0YXInLFxuICAgICAgYWxsRGF0YXNldHM6ICdUb2RvcycsXG4gICAgICBkYXRhVHlwZVRpdGxlOiAnVGlwbyBkZSBEYWRvJyxcbiAgICAgIGRhdGFUeXBlU3VidGl0bGU6ICdFc2NvbGhhIG8gdGlwbyBkZSBkYWRvcyBxdWUgdm9jw6ogcXVlciBleHBvcnRhcicsXG4gICAgICBmaWx0ZXJEYXRhVGl0bGU6ICdGaWx0cmFyIERhZG9zJyxcbiAgICAgIGZpbHRlckRhdGFTdWJ0aXRsZTogJ1ZvY8OqIHBvZGUgZXNjb2xoZXIgZXhwb3J0YXIgb3MgZGFkb3Mgb3JpZ2luYWlzIG91IG9zIGRhZG9zIGZpbHRyYWRvcycsXG4gICAgICBmaWx0ZXJlZERhdGE6ICdEYWRvcyBGaWx0cmFkb3MnLFxuICAgICAgdW5maWx0ZXJlZERhdGE6ICdEYWRvcyBuw6NvIGZpbHRyYWRvcycsXG4gICAgICBmaWxlQ291bnQ6ICd7ZmlsZUNvdW50fSBBcnF1aXZvcycsXG4gICAgICByb3dDb3VudDogJ3tyb3dDb3VudH0gTGluaGFzJ1xuICAgIH0sXG4gICAgZGVsZXRlRGF0YToge1xuICAgICAgd2FybmluZzogJ3ZvY8OqIGlyw6EgZGVsZXRhciBlc3NlIGNvbmp1bnRvIGRlIGRhZG9zLiBJc3NvIGlyw6EgYWZldGFyIHtsZW5ndGh9IGNhbWFkYXMnXG4gICAgfSxcbiAgICBhZGRTdHlsZToge1xuICAgICAgcHVibGlzaFRpdGxlOiAnMS4gUHVibGlxdWUgbyBzZXUgRXN0aWxvIG5vIE1hcGJveCBvdSBwcm92aWRlbmNpZSBhIGNoYXZlIGRlIGFjZXNzbycsXG4gICAgICBwdWJsaXNoU3VidGl0bGUxOiAnVm9jw6ogcG9kZSBjcmlhciBvIHNldSBwcsOzcHJpbyBlc3RpbG8gZW0nLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMjogJ2UnLFxuICAgICAgcHVibGlzaFN1YnRpdGxlMzogJ3B1YmxpY2FyJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTQ6ICdpc3NvLicsXG4gICAgICBwdWJsaXNoU3VidGl0bGU1OiAnUGFyYSB1dGlsaXphciBlc3RpbG8gcHJpdmFkbywgY29sZSBhIHN1YScsXG4gICAgICBwdWJsaXNoU3VidGl0bGU2OiAnY2hhdmUgZGUgYWNlc3NvJyxcbiAgICAgIHB1Ymxpc2hTdWJ0aXRsZTc6XG4gICAgICAgICdhcXVpLiAqa2VwbGVyLmdsIMOpIHVtYSBhcGxpY2HDp8OjbyBjbGllbnQtc2lkZSwgb3MgZGFkb3MgcGVybWFuZWNlbSBubyBzZXUgYnJvd3Nlci4uJyxcbiAgICAgIGV4YW1wbGVUb2tlbjogJ2UuZy4gcGsuYWJjZGVmZy54eHh4eHgnLFxuICAgICAgcGFzdGVUaXRsZTogJzIuIENvbGUgYSB1cmwgZG8gc2V1IGVzdGlsbycsXG4gICAgICBwYXN0ZVN1YnRpdGxlMTogJ08gcXVlIMOpIHVtYScsXG4gICAgICBwYXN0ZVN1YnRpdGxlMjogJ1VSTCBkZSBlc3RpbG8nLFxuICAgICAgbmFtaW5nVGl0bGU6ICczLiBOb21laWUgbyBzZXUgZXN0aWxvJ1xuICAgIH0sXG4gICAgc2hhcmVNYXA6IHtcbiAgICAgIHNoYXJlVXJpVGl0bGU6ICdDb21wYXJ0aWxoYXIgYSBVUkwgZG8gTWFwYScsXG4gICAgICBzaGFyZVVyaVN1YnRpdGxlOiAnR2VyYXIgYSB1cmwgZG8gbWFwYSBlIGNvbXBhcnRpbGhhciBjb20gb3V0cm9zJyxcbiAgICAgIGNsb3VkVGl0bGU6ICdBcm1hemVuYW1lbnRvIENsb3VkJyxcbiAgICAgIGNsb3VkU3VidGl0bGU6ICdDb25lY3RlLXNlIGUgZW52aWUgb3MgZGFkb3MgZG8gbWFwYSBwYXJhIG8gc2V1IGFybWF6ZW5hbWVudG8gY2xvdWQgcGVzc29hbCcsXG4gICAgICBzaGFyZURpc2NsYWltZXI6XG4gICAgICAgICdrZXBsZXIuZ2wgaXLDoSBzYWx2YXIgb3MgZGFkb3MgZG8gbWFwYSBlbSBzZXUgYXJtYXplbmFtZW50byBjbG91ZCBwZXNzb2FsLCBhcGVuYXMgcGVzc29hcyBjb20gYSBVUkwgcG9kZW0gYWNlc3NhciBvIHNldSBtYXBhIGUgZGFkb3MuICcgK1xuICAgICAgICAnVm9jw6ogcG9kZSBlZGl0YXIvZGVsZXRhciBvIGFycXVpdm8gZGUgZGFkb3MgbmEgc3VhIGNvbnRhIGRlIGFybWF6ZW5hbWVudG8gY2xvdWQgZW0gcXVhbHF1ZXIgbW9tZW50by4nLFxuICAgICAgZ290b1BhZ2U6ICdWw6EgcGFyYSBhIHN1YSBww6FnaW5hIEtlcGxlci5nbCB7Y3VycmVudFByb3ZpZGVyfSdcbiAgICB9LFxuICAgIHN0YXR1c1BhbmVsOiB7XG4gICAgICBtYXBVcGxvYWRpbmc6ICdFbnZpYW5kbyBNYXBhJyxcbiAgICAgIGVycm9yOiAnRXJybydcbiAgICB9LFxuICAgIHNhdmVNYXA6IHtcbiAgICAgIHRpdGxlOiAnQXJtYXplbmFtZW50byBDbG91ZCcsXG4gICAgICBzdWJ0aXRsZTogJ0NvbmVjdGUtc2UgcGFyYSBzYWx2YXIgbyBtYXBhIHBhcmEgbyBzZXUgYXJtYXplbmFtZW50byBjbG91ZCBwZXNzb2FsJ1xuICAgIH0sXG4gICAgZXhwb3J0TWFwOiB7XG4gICAgICBmb3JtYXRUaXRsZTogJ0Zvcm1hdG8gZG8gbWFwYScsXG4gICAgICBmb3JtYXRTdWJ0aXRsZTogJ0VzY29saGVyIG8gZm9ybWF0byBkZSBtYXBhIHBhcmEgZXhwb3J0YXInLFxuICAgICAgaHRtbDoge1xuICAgICAgICBzZWxlY3Rpb246ICdFeHBvcnRhciBzZXUgbWFwYSBlbSB1bSBhcnF1aXZvIGh0bWwgaW50ZXJhdGl2by4nLFxuICAgICAgICB0b2tlblRpdGxlOiAnQ2hhdmUgZGUgYWNlc3NvIGRvIE1hcGJveCcsXG4gICAgICAgIHRva2VuU3VidGl0bGU6ICdVc2UgYSBzdWEgcHLDs3ByaWEgY2hhdmUgZGUgYWNlc3NvIE1hcGJveCBlbSBzZXUgYXJxdWl2byBodG1sIChvcGNpb25hbCknLFxuICAgICAgICB0b2tlblBsYWNlaG9sZGVyOiAnQ29sZSBhIHN1YSBjaGF2ZSBkZSBhY2Vzc28gTWFwYm94JyxcbiAgICAgICAgdG9rZW5NaXN1c2VXYXJuaW5nOlxuICAgICAgICAgICcqIFNlIHZvY8OqIG7Do28gZm9ybmVjZXIgYSBzdWEgcHLDs3ByaWEgY2hhdmUgZGUgYWNlc3NvLCBvIG1hcGEgcG9kZSBmYWxoYXIgZW0gZXhpYmlyIGEgcXVhbHF1ZXIgbW9tZW50byBxdWFuZG8gbsOzcyBzdWJzdGl0dWlybW9zIGEgbm9zc2EgcGFyYSBldml0YXIgbWF1IHVzby4gJyxcbiAgICAgICAgdG9rZW5EaXNjbGFpbWVyOlxuICAgICAgICAgICdWb2PDqiBwb2RlIHRyb2NhciBhIHN1YSBjaGF2ZSBkZSBhY2Vzc28gTWFwYm94IG1haXMgdGFyZGUgdXRpemFuZG8gYXMgaW5zdHJ1w6fDtWVzIHNlZ3VpbnRlczogJyxcbiAgICAgICAgdG9rZW5VcGRhdGU6ICdDb21vIGF0dWFsaXphciBhIGNoYXZlIGRlIGFjZXNzbyBkZSB1bSBtYXBhIGV4aXN0ZW50ZS4nLFxuICAgICAgICBtb2RlVGl0bGU6ICdNb2RvIGRvIE1hcGEnLFxuICAgICAgICBtb2RlU3VidGl0bGUxOiAnU2VsZWNpb25hciBvIG1vZG8gZG8gYXBsaWNhdGl2by4gTWFpcyAnLFxuICAgICAgICBtb2RlU3VidGl0bGUyOiAnaW5mbycsXG4gICAgICAgIG1vZGVEZXNjcmlwdGlvbjogJ1Blcm1pdGlyIHVzdcOhcmlvcyBhIHttb2RlfSBvIG1hcGEnLFxuICAgICAgICByZWFkOiAnbGVyJyxcbiAgICAgICAgZWRpdDogJ2VkaXRhcidcbiAgICAgIH0sXG4gICAgICBqc29uOiB7XG4gICAgICAgIGNvbmZpZ1RpdGxlOiAnQ29uZmlndXJhw6fDtWVzIGRvIE1hcGEnLFxuICAgICAgICBjb25maWdEaXNjbGFpbWVyOlxuICAgICAgICAgICdBIGNvbmZpZ3VyYcOnw6NvIGRvIG1hcGEgc2Vyw6EgaW5jbHVpZGEgbm8gYXJxdWl2byBKc29uLiBTZSB2b2PDqiBlc3TDoSB1dGlsaXphbmRvIGtlcGxlci5nbCBubyBzZXUgcHLDs3ByaW8gbWFwYS4gVm9jw6ogcG9kZSBjb3BpYXIgZXNzYSBjb25maWd1cmHDp8OjbyBlIHBhc3NhciBwYXJhIGVsZSAnLFxuICAgICAgICBzZWxlY3Rpb246XG4gICAgICAgICAgJ0V4cG9ydGFyIGF0dWFpcyBkYWRvcyBlIGNvbmZpZ3VyYcOnw7VlcyBkbyBtYXBhIGVtIHVtIMO6bmljbyBhcnF1aXZvIEpzb24uIFZvY8OqIHBvZGUgbWFpcyB0YXJkZSBhYnJpciBvIG1lc21vIG1hcGEgZW52aWFuZG8gZXNzZSBhcnF1aXZvIHBhcmEgbyBrZXBsZXIuZ2wuJyxcbiAgICAgICAgZGlzY2xhaW1lcjpcbiAgICAgICAgICAnKiBDb25maWd1cmHDp8OjbyBkbyBtYXBhIMOpIGFjbG9wYWRvIGNvbSBjb25qdW50byBkZSBkYWRvcyBjYXJyZWdhZG9zLiDigJhkYXRhSWTigJkgw6kgdXRpbGl6YWRvIHBhcmEgbGlnYXIgYXMgY2FtYWRhcywgZmlsdHJvcywgZSBkaWNhcyBkZSBjb250ZXh0b3MgYSBjb25qdW50byBkZSBkYWRvcyBleHBlY8OtZmljb3MuICcgK1xuICAgICAgICAgICdRdWFuZG8gcGFzc2FuZG8gZXNzYSBjb25maWd1cmHDp8OjbyBwYXJhIGFkZERhdGFUb01hcCwgdGVuaGEgY2VydGV6YSBkZSBxdWUgbyBpZCBkbyBjb25qdW50byBkZSBkYWRvcyBjb21iaW5hIGNvbSBvKHMpIGRhdGFJZC9zIG5lc3NhIGNvbmZpZ3VyYcOnw6NvLidcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWRpbmdEaWFsb2c6IHtcbiAgICAgIGxvYWRpbmc6ICdDYXJyZWdhbmRvLi4uJ1xuICAgIH0sXG4gICAgbG9hZERhdGE6IHtcbiAgICAgIHVwbG9hZDogJ0NhcnJlZ2FyIGFycXVpdm8nLFxuICAgICAgc3RvcmFnZTogJ0NhcnJlZ2FyIGRvIGFybWF6ZW5hbWVudG8nXG4gICAgfSxcbiAgICB0cmlwSW5mbzoge1xuICAgICAgdGl0bGU6ICdDb21vIGhhYmlsaXRhciBhbmltYcOnw6NvIGRlIHZpYWdlbScsXG4gICAgICBkZXNjcmlwdGlvbjE6XG4gICAgICAgICdQYXJhIGFuaW1hciBvIGNhbWluaG8sIG8gZGFkbyBnZW9KU09OIGRldmUgY29udGVyIGBMaW5lU3RyaW5nYCBuYSBzdWEgcHJvcHJpZWRhZGUgZ2VvbWV0cnksIGUgYXMgY29vcmRlbmFkYXMgbmEgTGluZVN0cmluZyBkZXZlbSB0ZXIgNCBlbGVtZW50b3Mgbm8gc2VndWludGUgZm9ybWF0bycsXG4gICAgICBjb2RlOiAnIFtsb25naXR1ZGUsIGxhdGl0dWRlLCBhbHRpdHVkZSwgZGF0YV0gJyxcbiAgICAgIGRlc2NyaXB0aW9uMjpcbiAgICAgICAgJ2NvbSB1bSB1bHRpbW8gZWxlbWVudG8gc2VuZG8gdW1hIGRhdGEuIFVtIGZvcm1hdG8gZGUgZGF0YSB2w6FsaWRhIGluY2x1aSBzZWd1bmRvcyB1bml4IGNvbW8gYDE1NjQxODQzNjNgIG91IGVtIG1pbGlzZWd1bmRvcyBjb21vIGAxNTY0MTg0MzYzMDAwYC4nLFxuICAgICAgZXhhbXBsZTogJ0V4ZW1wbG86J1xuICAgIH0sXG4gICAgaWNvbkluZm86IHtcbiAgICAgIHRpdGxlOiAnQ29tbyBkZXNlbmhhciDDrWNvbmVzJyxcbiAgICAgIGRlc2NyaXB0aW9uMTpcbiAgICAgICAgJ05vIHNldSBjc3YsIGNyaWUgdW1hIGNvbHVuYSwgY29sb3F1ZSBvIG5vbWUgZG8gw61jb25lIHF1ZSB2b2PDqiBxdWVyIGRlc2VuaGFyIG5lbGUuIFZvY8OqIHBvZGUgZGVpeGFyIG8gY2FtcG8gdmF6aW8gc2Ugdm9jw6ogbsOjbyBkZXNlamFyIHF1ZSBvIMOtY29uZSBhcGFyZcOnYSBwYXJhIGFsZ3VucyBwb250b3MuIFF1YW5kbyBhIGNvbHVuYSB0ZW0gbm9tZScsXG4gICAgICBjb2RlOiAnaWNvbicsXG4gICAgICBkZXNjcmlwdGlvbjI6ICcga2VwbGVyLmdsIGlyw6EgYXV0b21hdGljYW1lbnRlIGNyaWFyIHVtYSBjYW1hZGEgZGUgw61jb25lIHBhcmEgdm9jw6ouJyxcbiAgICAgIGV4YW1wbGU6ICdFeGVtcGxvczonLFxuICAgICAgaWNvbnM6ICfDjWNvbmVzJ1xuICAgIH0sXG4gICAgc3RvcmFnZU1hcFZpZXdlcjoge1xuICAgICAgbGFzdE1vZGlmaWVkOiAnTW9kaWZpY2FkbyBow6Ege2xhc3RVcGRhdGVkfScsXG4gICAgICBiYWNrOiAnVm9sdGFyJ1xuICAgIH0sXG4gICAgb3ZlcndyaXRlTWFwOiB7XG4gICAgICB0aXRsZTogJ1NhbHZhbmRvIG1hcGEuLi4nLFxuICAgICAgYWxyZWFkeUV4aXN0czogJ2rDoSBleGlzdGUgbm8gbWFwYSB7bWFwU2F2ZWR9LiBWb2PDqiBkZXNlamFyaWEgc29icmVzY3JldmVyIG8gbWFwYT8nXG4gICAgfSxcbiAgICBsb2FkU3RvcmFnZU1hcDoge1xuICAgICAgYmFjazogJ1ZvbHRhcicsXG4gICAgICBnb1RvUGFnZTogJ1bDoSBwYXJhIGEgc3VhIHDDoWdpbmEge2Rpc3BsYXlOYW1lfSBkbyBLZXBsZXIuZ2wnLFxuICAgICAgc3RvcmFnZU1hcHM6ICdBcm1hemVuYW1lbnRvIC8gTWFwYXMnLFxuICAgICAgbm9TYXZlZE1hcHM6ICdOZW5odW0gbWFwYSBzYWx2bydcbiAgICB9XG4gIH0sXG4gIGhlYWRlcjoge1xuICAgIHZpc2libGVMYXllcnM6ICdDYW1hZGFzIFZpc8OtdmVpcycsXG4gICAgbGF5ZXJMZWdlbmQ6ICdMZWdlbmRhIGRhIENhbWFkYSdcbiAgfSxcbiAgaW50ZXJhY3Rpb25zOiB7XG4gICAgdG9vbHRpcDogJ0RpY2EgZGUgY29udGV4dG8nLFxuICAgIGJydXNoOiAnUGluY2VsJyxcbiAgICBjb29yZGluYXRlOiAnQ29vcmRlbmFkYXMnXG4gIH0sXG4gIGxheWVyQmxlbmRpbmc6IHtcbiAgICB0aXRsZTogJ01pc3R1cmEgZGUgQ2FtYWRhcycsXG4gICAgYWRkaXRpdmU6ICdhZGl0aXZvJyxcbiAgICBub3JtYWw6ICdub3JtYWwnLFxuICAgIHN1YnRyYWN0aXZlOiAnc3VidHJhdGl2bydcbiAgfSxcbiAgY29sdW1uczoge1xuICAgIHRpdGxlOiAnQ29sdW5hcycsXG4gICAgbGF0OiAnbGF0JyxcbiAgICBsbmc6ICdsb24nLFxuICAgIGFsdGl0dWRlOiAnYWx0aXR1ZGUnLFxuICAgIGljb246ICfDrWNvbmUnLFxuICAgIGdlb2pzb246ICdnZW9qc29uJyxcbiAgICBhcmM6IHtcbiAgICAgIGxhdDA6ICdvcmlnZW0gbGF0JyxcbiAgICAgIGxuZzA6ICdvcmlnZW0gbG5nJyxcbiAgICAgIGxhdDE6ICdkZXN0aW5vIGxhdCcsXG4gICAgICBsbmcxOiAnZGVzdGlubyBsbmcnXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICB3b3JsZFVuaXRTaXplOiAnVGFtYW5obyBkYSBHcmFkZSAoa20pJ1xuICAgIH0sXG4gICAgaGV4YWdvbjoge1xuICAgICAgd29ybGRVbml0U2l6ZTogJ1JhaW8gZG8gSGV4w6Fnb25vIChrbSknXG4gICAgfVxuICB9LFxuICBjb2xvcjoge1xuICAgIGN1c3RvbVBhbGV0dGU6ICdQYWxldGFzIGN1c3RvbWl6YWRhcycsXG4gICAgc3RlcHM6ICdjYW1pbmhvcycsXG4gICAgdHlwZTogJ3RpcG8nLFxuICAgIHJldmVyc2VkOiAncmV2ZXJzbydcbiAgfSxcbiAgc2NhbGU6IHtcbiAgICBjb2xvclNjYWxlOiAnRXNjYWxhIGRhIENvcicsXG4gICAgc2l6ZVNjYWxlOiAnVGFtYW5obyBkYSBFc2NhbGEnLFxuICAgIHN0cm9rZVNjYWxlOiAnRXNjYWxhIGRvIFRyYcOnbycsXG4gICAgc2NhbGU6ICdFc2NhbGEnXG4gIH0sXG4gIGZpbGVVcGxvYWRlcjoge1xuICAgIG1lc3NhZ2U6ICdBcnJhc3RlIGUgc29sdGUgc2V1KHMpIGFycXVpdm8ocykgYXF1aScsXG4gICAgY2hyb21lTWVzc2FnZTpcbiAgICAgICcqVXN1w6FyaW9zIGRvIGNocm9tZTogTyBsaW1pdGUgZGUgdGFtYW5obyBkZSBhcnF1aXZvIMOpIDI1MG1iLCBzZSB2b2PDqiBwcmVjaXNhIGZhemVyIHVwbG9hZCBkZSBhcnF1aXZvcyBtYWlvcmVzIHRlbnRlIG8gU2FmYXJpJyxcbiAgICBkaXNjbGFpbWVyOlxuICAgICAgJyprZXBsZXIuZ2wgw6kgdW1hIGFwbGljYcOnw6NvIGNsaWVudC1zaWRlLCBzZW0gdW0gc2Vydmlkb3IgYmFja2VuZC4gT3MgZGFkb3MgZmljYW0gYXBlbmFzIG5hIHN1YSBtw6FxdWluYS9icm93c2VyLiAnICtcbiAgICAgICdOZW5odW1hIGluZm9ybWHDp8OjbyBvdSBkYWRvcyBkZSBtYXBhIMOpIGVudmlhZG8gcGFyYSBxdWFscXVlciBzZXJ2ZXIuJyxcbiAgICBjb25maWdVcGxvYWRNZXNzYWdlOlxuICAgICAgJ0VudmllICoqQ1NWKiosICoqR2VvSnNvbioqIG91IG1hcGFzIHNhbHZvcyAqKkpzb24qKi4gTGVpYSBtYWlzIHNvYnJlIFsqKnRpcG9zIGRlIGFycXVpdm9zIHN1cG9ydGFkb3MqKl0nLFxuICAgIGJyb3dzZUZpbGVzOiAncHJvY3VyZSBzZXVzIGFycXVpdm9zJyxcbiAgICB1cGxvYWRpbmc6ICdFbnZpYW5kbycsXG4gICAgZmlsZU5vdFN1cHBvcnRlZDogJ0FycXVpdm8ge2Vycm9yRmlsZXN9IG7Do28gw6kgc3Vwb3J0YWRvLicsXG4gICAgb3I6ICdvdSdcbiAgfSxcbiAgZGVuc2l0eTogJ2RlbnNpZGFkZScsXG4gICdCdWcgUmVwb3J0JzogJ1JlcG9ydGFyIEJ1ZycsXG4gICdVc2VyIEd1aWRlJzogJ0d1aWEgZG8gVXN1w6FyaW8nLFxuICBTYXZlOiAnU2FsdmFyJyxcbiAgU2hhcmU6ICdDb21wYXJ0aWxoYXInXG59O1xuIl19