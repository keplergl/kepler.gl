// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Add english messages here, other languages will use these
// if translations not available for every message
const en = {
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
    ...en,
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
  }
};
