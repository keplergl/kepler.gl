// Copyright (c) 2018 Uber Technologies, Inc.
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

import {console as Console} from 'global/window';
import KeplerGlSchema from 'kepler.gl/schemas';
import {updateVisData, receiveMapConfig} from 'kepler.gl/actions';
import Processor from 'kepler.gl/processors';

// CONSTANTS
export const INIT = 'INIT';

// ACTIONS
function handleJuptyerDataFormat(dataEntry) {
  // This makes passing data between Jupyter the iframe easier
  // detect data type here
  let parsed = dataEntry.data;
  let type = 'csv';
  try {
    parsed = JSON.parse(dataEntry.data);
    type = 'json';

  } catch(e) {
    // assume it is csv
  }
  return {data: parsed, type, id: dataEntry.id};
}

export function processReceivedData({data, info}) {
    // assume there is only 1 file
    const processed = info.queryType === 'csv' ?
      Processor.processCsvData(data) :
      info.queryType === 'json' ?
      Processor.processGeojson(data) : null;

    return {data: processed, info};
}

export function loadJupyterData(rawData) {
  const dataToLoad = rawData
    .map(handleJuptyerDataFormat)
    .map(rd => ({
      data: rd.data,
      info: {
        id: rd.id,
        label: rd.id,
        queryType: rd.type,
        queryOption: 'jupyter'
      }
    }));
  return dataToLoad.map(processReceivedData);
}

// for jupyter integration
export function receivePostMessage(e) {

  return (dispatch, getState) => {
    const {data} = e;
    let {config} = e;
    // This makes passing data between Jupyter the iframe easier
    if (typeof config === 'string') {
      config = JSON.parse(config);
    }

    if (!Array.isArray(data)) {
      return;
    }

    if (!data.every(d => d.id)) {
      Console.alert('Each data entry should have an unique id that matches dataId in layer/filter');
      return;
    }

    if (config && !config.version) {
      Console.alert('Config should have a valid version');
      return;
    }

    if (config && !config.version === KeplerGlSchema._version) {
      Console.alert('This config is saved in an older version, voyager currently support it, to avoid future issues, ' +
        'please save it again by clicking the copy config button');
    }

    return new Promise((resolve, reject) => {
        // resolve({appConfig: config});
        if (config) {
          const parsedConfig = KeplerGlSchema.parseSavedConfig(config);
          if (parsedConfig) {
            // pass new config
            dispatch(receiveMapConfig(parsedConfig));
          }
        }

        const results = loadJupyterData(data);
        const succeeded = results.filter(r => r && r.data);

        if (succeeded.length) {
          dispatch(updateVisData(succeeded));
        }
        return;
      })
      .catch(error => {
        Console.warn(error);
      })

  }
}
