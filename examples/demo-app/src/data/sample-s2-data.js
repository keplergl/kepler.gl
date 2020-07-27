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

export default `s2, value
80858004,0.5979242952642347
8085800c,0.5446256069712141
80858014,0.1187171597109975
8085801c,0.2859146314037557
80858024,0.19549012367504126
80858034,0.3373452974230604
8085803c,0.9218176408795662
80858044,0.23470692356446143
8085804c,0.1580509670379684
80858054,0.15992745628743954
`;

export const dataId = 's2-data';
export const config = {
  version: 'v1',
  config: {
    visState: {
      filters: [],
      layers: [
        {
          type: 's2',
          config: {
            dataId,
            label: 'S2 Layer',
            color: [241, 92, 23],
            columns: {
              token: 's2'
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
              name: ' value',
              type: 'real'
            },
            colorScale: 'quantile'
          }
        }
      ]
    }
  }
};
