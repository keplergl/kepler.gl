// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {LOCALES} from '../locales';

export default {
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
    coverage: 'Cobertura',
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
    empty: 'Vazio',
    selectLayer: 'Selecione uma camada'
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
    '3dBuilding': 'Edifícios em 3d',
    background: 'Fundo'
  },
  panel: {
    text: {
      label: 'Rótulo',
      labelWithId: 'Rótulo {labelId}',
      fontSize: 'Tamanho da fonte',
      fontColor: 'Cor da fonte',
      textAnchor: 'Âncora do texto',
      alignment: 'Alinhamento',
      addMoreLabel: 'Adicionar mais Rótulos',
      backgroundColor: 'Cor de fundo',
      outlineWidth: 'Largura do contorno',
      outlineColor: 'Cor do contorno'
    }
  },
  sidebar: {
    panels: {
      layer: 'Camadas',
      filter: 'Filtros',
      interaction: 'Interações',
      basemap: 'Mapa base'
    },
    panelViewToggle: {
      list: 'Ver Lista',
      byDataset: 'Ver por Conjunto de dados'
    }
  },
  layer: {
    required: 'Obrigatório*',
    columnModesSeparator: 'Ou',
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
    service: 'Serviço',
    layer: 'Camada',
    appearance: 'Aparência',
    uniqueIdField: 'Campo ID único',
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
      '3d': '3D',
      vectortile: 'mosaico vetorial',
      rastertile: 'mosaico raster',
      wms: 'WMS',
      tile3d: 'mosaico 3D'
    },
    wms: {
      hover: 'Value:'
    },
    layerUpdateError:
      'Ocorreu um erro ao atualizar a camada: {errorMessage}. Certifique-se de que o formato dos dados de entrada seja válido.',
    interaction: 'Interação',
    heatmap: 'Heatmap',
    aggregation: 'Aggregation'
  },
  layerVisConfigs: {
    angle: 'Ângulo',
    strokeWidth: 'Largura do Traço',
    strokeWidthRange: 'Alcance da Largura do Traço',
    radius: 'Raio',
    fixedRadius: 'Raio ajustado para metro',
    fixedRadiusDescription: 'Raio do Mapa para Raio absoluto em metros, e.g. 5 para 5 metros',
    radiusRange: 'Alcance do Raio',
    clusterRadius: 'Raio do Agrupamento em pixels',
    radiusRangePixels: 'Alcance do Raio em pixels',
    billboard: 'Câmera de rosto',
    billboardDescription: 'Oriente a geometria em direção à câmera',
    fadeTrail: 'Fade trilha',
    opacity: 'Opacidade',
    pointSize: 'Tamanho do ponto',
    coverage: 'Cobertura',
    outline: 'Contorno',
    colorRange: 'Alcance da Cor',
    stroke: 'Traçado',
    strokeColor: 'Cor do Traçado',
    strokeColorRange: 'Alcance da Cor do Traçado',
    targetColor: 'Cor de destino',
    colorAggregation: 'Agregação da Cor',
    heightAggregation: 'Agregação da Altura',
    weightAggregation: 'Weight Aggregation',
    resolutionRange: 'Alcance da Resolução',
    sizeScale: 'Escala de tamanho',
    worldUnitSize: 'Tamanho unitário do mundo',
    elevationScale: 'Escala de Elevação',
    enableElevationZoomFactor: 'Use fator de zoom de elevação',
    enableElevationZoomFactorDescription:
      'Ajuste a altura / elevação com base no fator de zoom atual',
    enableHeightZoomFactor: 'Usar fator de zoom de altura',
    heightScale: 'Escala de Altura',
    coverageRange: 'Alcance de cobertura',
    highPrecisionRendering: 'Renderização de Alta Precisão',
    highPrecisionRenderingDescription: 'Alta precisão irá em resultar em baixa performance',
    height: 'Altura',
    heightDescription:
      'Clique no botão no canto superior direito para trocar para a visualização 3d',
    fill: 'Preenchimento',
    enablePolygonHeight: 'Habilitar Altura de Polígono',
    showWireframe: 'Mostrar Wireframe',
    weightIntensity: 'Intensidade da Espessura',
    intensity: 'Intensity',
    threshold: 'Threshold',
    zoomScale: 'Escala do Zoom',
    heightRange: 'Alcance da Altura',
    heightMultiplier: 'Multiplicador de altura',
    fixedHeight: 'Altura fixa',
    fixedHeightDescription: 'Use a altura sem modificações',
    allowHover: 'Mostrar dica de ferramenta',
    allowHoverDescription:
      'Mostrar ou ocultar dica de ferramenta ao passar o cursor sobre os recursos da camada',
    showNeighborOnHover: 'Destacar vizinhos ao passar o cursor',
    showHighlightColor: 'Mostrar cor de destaque',
    darkModeEnabled: 'Mapa base escuro',
    transparentBackground: 'Fundo transparente'
  },
  layerManager: {
    addData: 'Adicionar Dados',
    addLayer: 'Adicionar Camada',
    layerBlending: 'Mistura de Camada',
    overlayBlending: 'Mistura de sobreposição'
  },
  mapManager: {
    mapStyle: 'Estilo do Mapa',
    addMapStyle: 'Adicionar Estilo de Mapa',
    '3dBuildingColor': 'Cor do Edifício 3D',
    backgroundColor: 'Cor de Fundo'
  },
  effectManager: {
    effects: 'Efeitos',
    addEffect: 'Adicionar efeito',
    pickDateTime: 'Selecionar data/hora',
    currentTime: 'Hora atual',
    pickCurrrentTime: 'Selecionar hora atual',
    date: 'Data',
    time: 'Hora',
    timezone: 'Fuso horário'
  },
  effectDescription: {
    lightAndShadow:
      'Simula iluminação solar realista e projeção de sombras com base na hora do dia e localização geográfica. Intensidade de sombra, cores de luz solar e ambiente ajustáveis.',
    ink: 'Aplica um estilo artístico de tinta que escurece as bordas e cria uma aparência desenhada à mão. Ajuste a intensidade para controlar o efeito.',
    brightnessContrast:
      'Ajusta o brilho e o contraste gerais do mapa. Use valores positivos para aumentar o brilho ou contraste, valores negativos para escurecer ou achatar a imagem.',
    hueSaturation:
      'Altera o tom de cor e ajusta a saturação em todo o mapa. Útil para criar temas de cor ou dessaturar a vista.',
    vibrance:
      'Aumenta seletivamente a intensidade de cores suaves sem sobressaturar as já vivas. Produz um realce de cor mais natural que a saturação.',
    sepia:
      'Aplica um tom acastanhado quente que lembra fotografias envelhecidas. Controle a quantidade para misturar entre as cores originais e o aspecto sépia.',
    dotScreen:
      'Converte a imagem em um padrão de pontos monocromáticos, semelhante à impressão de meios-tons de jornal. Ajuste o ângulo, tamanho dos pontos e posição central.',
    colorHalftone:
      'Simula a impressão de meios-tons de cor CMYK com padrões de pontos separados para cada canal de cor. Controle o ângulo, tamanho dos pontos e posição central.',
    noise:
      'Adiciona ruído aleatório estilo grão de filme ao mapa. Útil para uma estética texturizada e analógica ou para reduzir banding de cor.',
    triangleBlur:
      'Aplica um desfoque suave do tipo gaussiano uniformemente no mapa. Controle o raio do desfoque para ajustar o nível de suavidade.',
    zoomBlur:
      'Cria um desfoque de movimento radial que emana de um ponto central, simulando um zoom de câmera. Ajuste a intensidade e a posição central.',
    tiltShift:
      'Simula um efeito de lente tilt-shift que desfoca áreas fora de uma faixa focal, criando uma aparência de maquete em miniatura. Defina a faixa focal com posições de início/fim.',
    edgeWork:
      'Destaca as bordas estruturais da imagem usando um estilo artístico de desenho a carvão. Ajuste o raio de detecção para controlar a espessura da linha.',
    vignette:
      'Escurece os cantos e bordas do mapa, direcionando o foco para o centro. Controle a quantidade de escurecimento e o raio da área clara.',
    magnify:
      'Cria uma sobreposição de lupa circular em uma posição configurável. Ajuste o tamanho, o nível de zoom e a largura da borda.',
    hexagonalPixelate:
      'Substitui a imagem por uma grade de mosaicos hexagonais, cada um preenchido com a cor média da área que cobre. Ajuste a escala do mosaico.',
    distanceFog:
      'Desvanece objetos distantes em uma cor de neblina com base na profundidade em relação à câmera, realçando a sensação de profundidade. Controle a densidade, distância inicial, alcance e cor da neblina.',
    surfaceFog:
      'Renderiza uma camada de neblina em uma elevação específica acima da superfície do terreno. Ajuste a elevação, espessura de transição, densidade, cor e um padrão de ruído opcional.'
  },
  layerConfiguration: {
    defaultDescription: 'Calcular {property} baseada no campo selecionado',
    howTo: 'Como',
    showColorChart: 'Mostrar gráfico de cores',
    hideColorChart: 'Ocultar gráfico de cores'
  },
  filterManager: {
    addFilter: 'Adicionar Filtro',
    timeFilterSync: 'Conjuntos sincronizados',
    timeLayerSync: 'Vincular à linha do tempo da camada',
    timeLayerUnsync: 'Desvincular da linha do tempo da camada',
    column: 'Coluna'
  },
  datasetTitle: {
    showDataTable: 'Mostrar tabela de dados',
    removeDataset: 'Remover tabela de dados'
  },
  datasetInfo: {
    rowCount: '{rowCount} linhas',
    vectorTile: 'Mosaico vetorial',
    rasterTile: 'Mosaico raster',
    wmsTile: 'Mosaico WMS',
    tile3d: 'Mosaico 3D'
  },
  tooltip: {
    hideLayer: 'esconder camada',
    showLayer: 'mostrar camada',
    hideFeature: 'Esconder propriedade',
    showFeature: 'Mostrar propriedade',
    hide: 'esconder',
    show: 'mostrar',
    removeLayer: 'Remover Camada',
    duplicateLayer: 'Duplicar camada',
    zoomToLayer: 'Zoom para a camada',
    resetAfterError: 'Tente habilitar a camada após um erro',
    layerSettings: 'Configurações de Camada',
    closePanel: 'Fechar painel atual',
    switchToDualView: 'Trocar para visualização dupla de mapa',
    showLegend: 'mostrar legenda',
    disable3DMap: 'Desabilitar Mapa 3D',
    DrawOnMap: 'Desenhar no mapa',
    selectLocale: 'Selecionar língua',
    showAiAssistantPanel: 'Mostrar painel de AI Assistant',
    hideAiAssistantPanel: 'Esconder painel de AI Assistant',
    hideLayerPanel: 'Esconder painel de camada',
    showLayerPanel: 'Mostrar painel de camada',
    moveToTop: 'Mover para o topo das camadas',
    selectBaseMapStyle: 'Selecionar o Estilo do Mapa Base',
    removeBaseMapStyle: 'Remover estilo de mapa base',
    delete: 'Deletar',
    timePlayback: 'Tempo de reprodução',
    timeFilterSync: 'Sync with a column from another dataset',
    cloudStorage: 'Armazenamento Cloud',
    '3DMap': ' Mapa 3D',
    animationByWindow: 'Moving Time Window',
    animationByIncremental: 'Incremental Time Window',
    speed: 'velocidade',
    play: 'reproduzir',
    pause: 'pausar',
    reset: 'redefinir',
    export: 'exportar',
    timeLayerSync: 'Vincular com a linha do tempo da camada',
    timeLayerUnsync: 'Desvincular da linha do tempo da camada',
    syncTimelineStart: 'Início do período de tempo do filtro atual',
    syncTimelineEnd: 'Fim do período de tempo do filtro atual',
    showEffectPanel: 'Mostrar painel de efeitos',
    hideEffectPanel: 'Ocultar painel de efeitos',
    removeEffect: 'Remover efeito',
    disableEffect: 'Desativar efeito',
    effectSettings: 'Configurações de efeito'
  },
  toolbar: {
    exportImage: 'Exportar Imagem',
    exportData: 'Exportar Dados',
    exportMap: 'Exportar Mapa',
    exportVideo: 'Exportar Vídeo',
    shareMapURL: 'Compartilhar URL do Mapa',
    saveMap: 'Salvar Mapa',
    select: 'selecionar',
    polygon: 'polígono',
    rectangle: 'retângulo',
    hide: 'esconder',
    show: 'mostrar',
    ...LOCALES
  },
  editor: {
    filterLayer: 'Filtrar camadas',
    filterLayerDisabled: 'Geometrias não poligonais não podem ser usadas para filtragem',
    copyGeometry: 'Copiar geometria',
    noLayersToFilter: 'Sem camadas para filtrar'
  },
  exportVideoModal: {
    animation: 'Animação',
    settings: 'Configurações'
  },
  modal: {
    title: {
      deleteDataset: 'Deletar Conjunto de Dados',
      addDataToMap: 'Adicionar Dados ao Mapa',
      exportImage: 'Exportar Imagem',
      exportData: 'Exportar Dados',
      exportMap: 'Exportar Mapa',
      exportVideo: 'Exportar Vídeo',
      addCustomMapboxStyle: 'Adicionar Estilo Mapbox Customizado',
      saveMap: 'Salvar Mapa',
      shareURL: 'Compartilhar URL'
    },
    button: {
      delete: 'Deletar',
      download: 'Download',
      export: 'Exportar',
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
      resolutionPlaceholder: 'Selecionar resolução...',
      mapLegendTitle: 'Legenda do Mapa',
      mapLegendAdd: 'Adicionar Legenda no mapa'
    },
    exportVideo: {
      animation: 'Animação',
      settings: 'Configurações'
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
      rowCount: '{rowCount} Linhas',
      tiledDatasetWarning: "* A exportação de dados para conjuntos de dados em mosaico não é suportada"
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
      publishSubtitle7:
        'aqui. *kepler.gl é uma aplicação client-side, os dados permanecem no seu browser..',
      exampleToken: 'e.g. pk.abcdefg.xxxxxx',
      pasteTitle: '2. Cole a url do seu estilo',
      pasteSubtitle0: 'Style url can be a mapbox',
      pasteSubtitle1: 'O que é uma',
      pasteSubtitle2: 'URL de estilo',
      pasteSubtitle3: 'or a style.json using the',
      pasteSubtitle4: 'Mapbox GL Style Spec',
      namingTitle: '3. Nomeie o seu estilo'
    },
    shareMap: {
      title: 'Compartilhar Mapa',
      shareUriTitle: 'Compartilhar a URL do Mapa',
      shareUriSubtitle: 'Gerar a url do mapa e compartilhar com outros',
      cloudTitle: 'Armazenamento Cloud',
      cloudSubtitle: 'Conecte-se e envie os dados do mapa para o seu armazenamento cloud pessoal',
      shareDisclaimer:
        'kepler.gl irá salvar os dados do mapa em seu armazenamento cloud pessoal, apenas pessoas com a URL podem acessar o seu mapa e dados. ' +
        'Você pode editar/deletar o arquivo de dados na sua conta de armazenamento cloud em qualquer momento.',
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
        tokenMisuseWarning:
          '* Se você não fornecer a sua própria chave de acesso, o mapa pode falhar em exibir a qualquer momento quando nós substituirmos a nossa para evitar mau uso. ',
        tokenSecurityWarning:
          '* Aviso: seu token Mapbox será incorporado no arquivo HTML exportado. Qualquer pessoa com acesso a este arquivo poderá ver e usar seu token. Use um token com restrições de URL quando possível. ',
        tokenDisclaimer:
          'Você pode trocar a sua chave de acesso Mapbox mais tarde utizando as instruções seguintes: ',
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
        configDisclaimer:
          'A configuração do mapa será incluida no arquivo Json. Se você está utilizando kepler.gl no seu próprio mapa. Você pode copiar essa configuração e passar para ele ',
        selection:
          'Exportar atuais dados e configurações do mapa em um único arquivo Json. Você pode mais tarde abrir o mesmo mapa enviando esse arquivo para o kepler.gl.',
        disclaimer:
          '* Configuração do mapa é aclopado com conjunto de dados carregados. ‘dataId’ é utilizado para ligar as camadas, filtros, e dicas de contextos a conjunto de dados expecíficos. ' +
          'Quando passando essa configuração para addDataToMap, tenha certeza de que o id do conjunto de dados combina com o(s) dataId/s nessa configuração.'
      }
    },
    loadingDialog: {
      loading: 'Carregando...'
    },
    loadData: {
      upload: 'Carregar arquivo',
      tileset: 'Conjunto de mosaico',
      storage: 'Carregar do armazenamento'
    },
    tripInfo: {
      title: 'Como habilitar animação de viagem',
      titleTable: 'Criar viagens a partir de uma lista de pontos',
      description1:
        'Para animar o caminho, o dado geoJSON deve conter `LineString` na sua propriedade geometry, e as coordenadas na LineString devem ter 4 elementos no seguinte formato',
      descriptionTable1:
        'As viagens podem ser criadas unindo uma lista de pontos de latitude e longitude, ordenando por marcas de tempo e agrupando por identificadores únicos.',
      code: ' [longitude, latitude, altitude, data] ',
      description2:
        'com um ultimo elemento sendo uma data. Um formato de data válida inclui segundos unix como `1564184363` ou em milisegundos como `1564184363000`.',
      example: 'Exemplo:',
      exampleTable: 'Example Csv'
    },
    polygonInfo: {
      title: 'Criar camada de polígonos a partir de recursos GeoJSON',
      titleTable: 'Criar caminho a partir de pontos',
      descriptionTable: `Os caminhos podem ser criados unindo uma lista de pontos de latitude e longitude, ordenando por um campo de índice (ex. marca de tempo) e agrupando por identificadores únicos.

  ### Colunas da camada:
  - **id**: - *obrigatório*&nbsp;- Uma coluna \`id\` é usada para agrupar pontos. Pontos com o mesmo id serão unidos em um único caminho.
  - **lat**: - *obrigatório*&nbsp;- A latitude do ponto
  - **lon**: - *obrigatório*&nbsp;- A longitude do ponto
  - **alt**: - *opcional*&nbsp;- A altitude do ponto
  - **sort by**: - *opcional*&nbsp;- Uma coluna \`sort by\` é usada para ordenar os pontos; se não especificada, os pontos serão ordenados por índice de linha.
`,
      exampleTable: 'Example CSV'
    },
    iconInfo: {
      title: 'Como desenhar ícones',
      description1:
        'No seu csv, crie uma coluna, coloque o nome do ícone que você quer desenhar nele. Você pode deixar o campo vazio se você não desejar que o ícone apareça para alguns pontos. Quando a coluna tem nome',
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
      noSavedMaps: 'Nenhum mapa salvo',
      foursquareStorageMessage:
        'Apenas mapas salvos com a opção Kepler.gl > Salvar > Armazenamento Foursquare são mostrados aqui'
    }
  },
  header: {
    visibleLayers: 'Camadas Visíveis',
    layerLegend: 'Legenda da Camada'
  },
  interactions: {
    tooltip: 'Dica de contexto',
    brush: 'Pincel',
    coordinate: 'Coordenadas',
    geocoder: 'Geocoder'
  },
  layerBlending: {
    title: 'Mistura de Camadas',
    additive: 'aditivo',
    normal: 'normal',
    subtractive: 'subtrativo'
  },
  overlayBlending: {
    title: 'Mistura de sobreposição do mapa',
    description: 'Misturar camadas com o mapa base para que ambos sejam visíveis.',
    screen: 'mapa base escuro',
    normal: 'normal',
    darken: 'mapa base claro'
  },
  columns: {
    title: 'Colunas',
    lat: 'lat',
    lng: 'lon',
    altitude: 'altitude',
    alt: 'altitude',
    id: 'id',
    timestamp: 'tempo',
    icon: 'ícone',
    geojson: 'geojson',
    geoarrow: 'geoarrow',
    geoarrow0: 'geoarrow origem',
    geoarrow1: 'geoarrow destino',
    token: 'token',
    sortBy: 'ordenar por',
    neighbors: 'vizinhos',
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
    },
    hex_id: 'hex id'
  },
  color: {
    customPalette: 'Paletas customizadas',
    steps: 'caminhos',
    type: 'tipo',
    colorBlindSafe: 'Seguro para daltônicos',
    reversed: 'reverso',
    disableStepReason: "Não é possível alterar o número de passos com quebras de cor personalizadas, use a paleta personalizada para editar os passos",
    preset: 'Cores predefinidas',
    picker: 'Seletor de cor'
  },
  scale: {
    colorScale: 'Escala da Cor',
    sizeScale: 'Tamanho da Escala',
    strokeScale: 'Escala do Traço',
    strokeColorScale: 'Escala de cor do traço',
    scale: 'Escala'
  },
  fileUploader: {
    message: 'Arraste e solte seu(s) arquivo(s) aqui',
    chromeMessage:
      '*Usuários do chrome: O limite de tamanho de arquivo é 250mb, se você precisa fazer upload de arquivos maiores tente o Safari',
    disclaimer:
      '*kepler.gl é uma aplicação client-side, sem um servidor backend. Os dados ficam apenas na sua máquina/browser. ' +
      'Nenhuma informação ou dados de mapa é enviado para qualquer server.',
    configUploadMessage:
      'Envie {fileFormatNames} ou mapas salvos **Json**. Leia mais sobre [**tipos de arquivos suportados**]',
    browseFiles: 'procure seus arquivos',
    uploading: 'Enviando',
    fileNotSupported: 'Arquivo {errorFiles} não é suportado.',
    or: 'ou'
  },
  tilesetSetup: {
    header: 'Configurar mosaicos vetoriais',
    rasterTileHeader: 'Configurar mosaicos raster',
    addTilesetText: 'Adicionar conjunto de mosaico'
  },
  geocoder: {
    title: 'Insira um endereço ou coordenadas, ex 37.79,-122.40'
  },
  fieldSelector: {
    clearAll: 'Limpar tudo',
    formatting: 'Formatação'
  },
  compare: {
    modeLabel: 'Modo de comparação',
    typeLabel: 'Tipo de comparação',
    types: {
      absolute: 'Absoluto',
      relative: 'Relativo'
    }
  },
  mapPopover: {
    primary: 'Primário'
  },
  density: 'densidade',
  'Bug Report': 'Reportar Bug',
  'User Guide': 'Guia do Usuário',
  Save: 'Salvar',
  Share: 'Compartilhar',
  mapLegend: {
    layers: {
      line: {
        singleColor: {
          sourceColor: 'Source',
          targetColor: 'Target'
        }
      },
      arc: {
        singleColor: {
          sourceColor: 'Source',
          targetColor: 'Target'
        }
      },
      default: {
        singleColor: {
          color: 'Fill color',
          strokeColor: 'Outline'
        }
      }
    }
  }
};
