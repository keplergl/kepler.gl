// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export default `a5,value
1ae2958000000000,0.5979242952642347
1ae2968000000000,0.5446256069712141
1adebc8000000000,0.1187171597109975
1ae2978000000000,0.2859146314037557
1ae2918000000000,0.19549012367504126
1ae2998000000000,0.3373452974230604
1ae29a8000000000,0.9218176408795662
1ae2988000000000,0.23470692356446143
`;

export const dataId = 'a5-data';
export const config = {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          type: 'a5',
          config: {
            dataId,
            label: 'A5 Layer',
            color: [241, 92, 23],
            columns: {
              token: 'a5'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              strokeColor: [253, 230, 230],
              colorRange: {
                name: 'Global Warming',
                type: 'sequential',
                category: 'Uber',
                colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
              }
            }
          },
          visualChannels: {
            colorField: {
              name: 'value',
              type: 'real'
            },
            colorScale: 'quantile'
          }
        }
      ]
    }
  }
};
