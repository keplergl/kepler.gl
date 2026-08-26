// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export default `geohash,value
9q8yyk,0.5979242952642347
9q8yyw,0.5446256069712141
9q8yy4,0.1187171597109975
9q8zn8,0.2859146314037557
9q8yvc,0.19549012367504126
9q8znf,0.3373452974230604
9q8ytx,0.9218176408795662
9q8zp5,0.23470692356446143
`;

export const dataId = 'geohash-data';
export const config = {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          type: 'geohash',
          config: {
            dataId,
            label: 'GeoHash Layer',
            color: [241, 92, 23],
            columns: {
              token: 'geohash'
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
