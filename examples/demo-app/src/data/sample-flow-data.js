// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const sampleFlowData = `source_lat,source_lng,target_lat,target_lng,count,source_name,target_name
40.7128,-74.0060,40.7580,-73.9855,320,Lower Manhattan,Midtown
40.7580,-73.9855,40.7831,-73.9712,185,Midtown,Upper East Side
40.7831,-73.9712,40.7128,-74.0060,210,Upper East Side,Lower Manhattan
40.7580,-73.9855,40.7282,-73.7949,450,Midtown,JFK Airport
40.7282,-73.7949,40.7580,-73.9855,430,JFK Airport,Midtown
40.7128,-74.0060,40.6501,-73.9496,175,Lower Manhattan,Brooklyn Downtown
40.6501,-73.9496,40.7128,-74.0060,160,Brooklyn Downtown,Lower Manhattan
40.7580,-73.9855,40.7484,-73.9857,95,Midtown,Times Square
40.7484,-73.9857,40.7580,-73.9855,90,Times Square,Midtown
40.7831,-73.9712,40.7282,-73.7949,280,Upper East Side,JFK Airport
40.7282,-73.7949,40.7831,-73.9712,265,JFK Airport,Upper East Side
40.6501,-73.9496,40.6782,-73.9442,140,Brooklyn Downtown,Prospect Park
40.6782,-73.9442,40.6501,-73.9496,130,Prospect Park,Brooklyn Downtown
40.7128,-74.0060,40.7282,-73.7949,390,Lower Manhattan,JFK Airport
40.7282,-73.7949,40.7128,-74.0060,375,JFK Airport,Lower Manhattan
40.7580,-73.9855,40.6501,-73.9496,220,Midtown,Brooklyn Downtown
40.6501,-73.9496,40.7580,-73.9855,205,Brooklyn Downtown,Midtown
40.7831,-73.9712,40.6501,-73.9496,115,Upper East Side,Brooklyn Downtown
40.6501,-73.9496,40.7831,-73.9712,105,Brooklyn Downtown,Upper East Side
40.7484,-73.9857,40.7128,-74.0060,150,Times Square,Lower Manhattan
40.7128,-74.0060,40.7484,-73.9857,155,Lower Manhattan,Times Square
40.7484,-73.9857,40.7282,-73.7949,340,Times Square,JFK Airport
40.7282,-73.7949,40.7484,-73.9857,330,JFK Airport,Times Square
40.6782,-73.9442,40.7128,-74.0060,100,Prospect Park,Lower Manhattan
40.7128,-74.0060,40.6782,-73.9442,95,Lower Manhattan,Prospect Park
`;

export const config = {
  version: 'v1',
  config: {
    visState: {
      layers: [
        {
          type: 'flow',
          config: {
            dataId: 'flow_data',
            label: 'NYC Flow',
            columns: {
              lat0: 'source_lat',
              lng0: 'source_lng',
              lat1: 'target_lat',
              lng1: 'target_lng',
              count: 'count',
              sourceName: 'source_name',
              targetName: 'target_name'
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              flowClusteringEnabled: true,
              flowLocationTotalsEnabled: true,
              flowFadeEnabled: true
            }
          }
        }
      ]
    },
    mapState: {
      latitude: 40.72,
      longitude: -73.95,
      zoom: 10
    }
  }
};
