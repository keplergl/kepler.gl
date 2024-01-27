// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Add english messages here, other languages will use these
// if translations not available for every message
const en = {
  'modal.loadData.remote': 'Load Map using URL',
  'sampleMapsTab.noData': 'No data ?',
  'sampleMapsTab.trySampleData': 'Try sample data',
  'sampleDataViewer.rowCount': ' {rowCount} rows',
  'loadRemoteMap.description': 'Load your map using your custom URL',
  'loadRemoteMap.message':
    'You can use the following formats: CSV | JSON | Kepler.gl config json. Make sure the url contains the file extension.',
  'loadRemoteMap.examples': 'Examples:',
  'loadRemoteMap.cors':
    '* CORS policy must be defined on your custom url domain in order to be accessible. For more info ',
  'loadRemoteMap.clickHere':
    '<a rel="noopener noreferrer" target="_blank" href="{corsLink}">click here</a>',
  'loadRemoteMap.fetch': 'Fetch'
};

export const messages = {
  en,
  fi: {
    'modal.loadData.remote': 'Lataa kartta URL-osoitteen avulla',
    'sampleMapsTab.noData': 'Ei aineistoja?',
    'sampleMapsTab.trySampleData': 'Kokeile testiaineistoja',
    'sampleDataViewer.rowCount': ' {rowCount} riviä',
    'loadRemoteMap.description': 'Lataa karttasi käyttämällä omaa urlia',
    'loadRemoteMap.message':
      'Voit käyttää formaatteja: CSV | JSON | Kepler.gl asetus-json. Varmista, että url sisältää tiedostopäätteen nimen.',
    'loadRemoteMap.examples': 'Esimerkkejä:',
    'loadRemoteMap.cors':
      '* CORS-käytäntö pitää olla määriteltynä urlin domainissa, jotta aineiston voi ladata.',
    'loadRemoteMap.clickHere':
      '<a rel="noopener noreferrer" target="_blank" href="{corsLink}">Lisätietoja</a>',
    'loadRemoteMap.fetch': 'Nouda'
  },
  ca: {
    'modal.loadData.remote': 'Carrega mapa mitjançant URL',
    'sampleMapsTab.noData': 'Cap dada?',
    'sampleMapsTab.trySampleData': 'Prova dades de mostra',
    'sampleDataViewer.rowCount': ' {rowCount} files',
    'loadRemoteMap.description': 'Carrega el teu mapa amb la teva URL personalitzada',
    'loadRemoteMap.message':
      "Pots emprar els següents formats: CSV | JSON | Kepler.gl config json. Assegura't que la URL contingui l'extensió de l'arxiu.",
    'loadRemoteMap.examples': 'Exemples:',
    'loadRemoteMap.cors':
      '* La política CORS s’ha de definir al teu domini per tal que sigui accessible. Per a més informació ',
    'loadRemoteMap.clickHere':
      '<a rel="noopener noreferrer" target="_blank" href="{corsLink}">fes clic aquí</a>',
    'loadRemoteMap.fetch': 'Cerca'
  },
  es: {
    'modal.loadData.remote': 'Cargar mapa usando URL',
    'sampleMapsTab.noData': 'Ningún dato?',
    'sampleMapsTab.trySampleData': 'Prueba datos de muestra',
    'sampleDataViewer.rowCount': ' {rowCount} files',
    'loadRemoteMap.description': 'Carga tu mapa con tu enlace personalizado',
    'loadRemoteMap.message':
      'Puedes usar los siguientes formatos: CSV | JSON | Kepler.gl config json. Asegurate que el enlace contenga la extensión del archivo.',
    'loadRemoteMap.examples': 'Ejemplos:',
    'loadRemoteMap.cors':
      '* La política CORS debe ser definida en tu dominio para que sea accessible. Para más información ',
    'loadRemoteMap.clickHere':
      '<a rel="noopener noreferrer" target="_blank" href="{corsLink}">haz clic aquí</a>',
    'loadRemoteMap.fetch': 'Busca'
  },
  cn: {
    'modal.loadData.remote': '使用 URL 加载地图',
    'sampleMapsTab.noData': '没有数据？',
    'sampleMapsTab.trySampleData': '尝试样本数据',
    'sampleDataViewer.rowCount': ' {rowCount} 行',
    'loadRemoteMap.description': '使用自定义 URL 加载地图',
    'loadRemoteMap.message':
      '您可以使用以下格式：CSV | JSON | Kepler.gl 配置 json。 确保 url 包含文件扩展名。',
    'loadRemoteMap.examples': '示例：',
    'loadRemoteMap.cors': '* 必须在您的自定义 url 域上定义 CORS 策略才能访问。欲了解更多信息',
    'loadRemoteMap.clickHere':
      '<a rel="noopener noreferrer" target="_blank" href="{corsLink}">点击此处</a>',
    'loadRemoteMap.fetch': '获取'
  }
};
