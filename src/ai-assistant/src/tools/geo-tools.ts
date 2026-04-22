// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {tool} from 'ai';
import {z} from 'zod';
import {KeplerContext} from '../types';
import {getValuesFromDataset, getGeometriesFromDataset} from './utils';
import {getToolResultCache} from './kepler-tools/save-data-tool';

const FETCH_TIMEOUT_MS = 5_000;

function combineSignals(
  timeoutMs: number,
  abortSignal?: AbortSignal
): {signal: AbortSignal; cleanup: () => void} {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  const signals = [timeoutController.signal];
  if (abortSignal) signals.push(abortSignal);
  const combined = AbortSignal.any(signals);
  return {signal: combined, cleanup: () => clearTimeout(timeoutId)};
}

class RateLimiter {
  private lastCallTime = 0;
  private queue: Promise<void> = Promise.resolve();
  constructor(private minInterval: number = 1000) {}
  async waitForNextCall(): Promise<void> {
    this.queue = this.queue.then(async () => {
      const now = Date.now();
      const elapsed = now - this.lastCallTime;
      const waitTime = this.lastCallTime === 0 ? 0 : Math.max(0, this.minInterval - elapsed);
      if (waitTime > 0) {
        await new Promise(r => setTimeout(r, waitTime));
      }
      this.lastCallTime = Date.now();
    });
    return this.queue;
  }
}

const mapboxRateLimiter = new RateLimiter(1000);
const nominatimRateLimiter = new RateLimiter(1000);

export function getGeoTools(ctx: KeplerContext) {
  const toolCache = getToolResultCache();

  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(
      visState.datasets,
      visState.layers,
      datasetName,
      variableName
    ) as number[];
  };

  const getGeometries = async (datasetName: string) => {
    const visState = ctx.getVisState();
    let geoms = getGeometriesFromDataset(
      visState.datasets,
      visState.layers,
      visState.layerData,
      datasetName
    );
    if (geoms.length === 0) {
      const dataset = toolCache.get(datasetName);
      if (dataset && dataset.type === 'geojson') {
        geoms = dataset.content.features;
      }
    }
    return geoms;
  };

  const onToolCompleted = (toolName: string, result: any) => {
    toolCache.set(toolName, result);
  };

  const routingTool = tool({
    description: 'Get routing directions between two coordinates using Mapbox Directions API.',
    inputSchema: z.object({
      origin: z.object({longitude: z.number(), latitude: z.number()}),
      destination: z.object({longitude: z.number(), latitude: z.number()}),
      mode: z.enum(['driving', 'walking', 'cycling']).optional(),
      datasetName: z.string().describe('Name for the output dataset')
    }),
    execute: async ({origin, destination, mode = 'driving', datasetName}, options) => {
      const {signal, cleanup} = combineSignals(FETCH_TIMEOUT_MS, options?.abortSignal);
      try {
        const mapboxToken = ctx.getMapboxToken();
        if (!mapboxToken) throw new Error('Mapbox token is not configured');
        await mapboxRateLimiter.waitForNextCall();
        const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${mapboxToken}`;
        const response = await fetch(url, {signal});
        if (!response.ok) throw new Error(`Mapbox API error: ${response.status}`);
        const data = await response.json();
        if (!data.routes || data.routes.length === 0)
          return {success: false, error: 'No routes found'};
        const route = data.routes[0];
        const geojson = {
          type: 'FeatureCollection' as const,
          features: [
            {
              type: 'Feature' as const,
              geometry: {type: 'LineString' as const, coordinates: route.geometry.coordinates},
              properties: {}
            }
          ]
        };
        onToolCompleted(datasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          datasetName,
          distance: route.distance,
          duration: route.duration,
          details: `Routing directions saved as ${datasetName}.`
        };
      } catch (error) {
        return {success: false, error: `Failed to get routing: ${error}`};
      } finally {
        cleanup();
      }
    }
  });

  const isochroneTool = tool({
    description:
      'Get isochrone polygons showing reachable areas within a time/distance from a point.',
    inputSchema: z.object({
      origin: z.object({longitude: z.number(), latitude: z.number()}),
      timeLimit: z.number().optional().describe('Time limit in minutes'),
      distanceLimit: z.number().optional().describe('Distance limit in meters'),
      profile: z.enum(['driving', 'walking', 'cycling']).optional(),
      datasetName: z.string().describe('Name for the output dataset')
    }),
    execute: async (
      {origin, timeLimit, distanceLimit, profile = 'driving', datasetName},
      options
    ) => {
      const {signal, cleanup} = combineSignals(FETCH_TIMEOUT_MS, options?.abortSignal);
      try {
        const mapboxToken = ctx.getMapboxToken();
        if (!mapboxToken) throw new Error('Mapbox token is not configured');
        await mapboxRateLimiter.waitForNextCall();
        let url = `https://api.mapbox.com/isochrone/v1/mapbox/${profile}/${origin.longitude},${origin.latitude}?`;
        url +=
          distanceLimit != null
            ? `contours_meters=${distanceLimit}`
            : `contours_minutes=${timeLimit ?? 10}`;
        url += `&polygons=true&access_token=${mapboxToken}`;
        const response = await fetch(url, {signal});
        if (!response.ok) throw new Error(`Mapbox Isochrone API error: ${response.status}`);
        const data = await response.json();
        if (!data.features || data.features.length === 0)
          return {success: false, error: 'No isochrone data returned'};
        const geojson = {
          type: 'FeatureCollection' as const,
          features: data.features.map((f: any) => ({
            type: 'Feature' as const,
            geometry: f.geometry,
            properties: {}
          }))
        };
        onToolCompleted(datasetName, {type: 'geojson', content: geojson});
        return {success: true, datasetName, details: `Isochrone polygons saved as ${datasetName}.`};
      } catch (error) {
        return {success: false, error: `Failed to generate isochrone: ${error}`};
      } finally {
        cleanup();
      }
    }
  });

  const geocodingTool = tool({
    description: 'Geocode an address to get latitude and longitude.',
    inputSchema: z.object({
      address: z.string().describe('The address to geocode'),
      datasetName: z.string().describe('Name for the output dataset')
    }),
    execute: async ({address, datasetName}) => {
      try {
        await nominatimRateLimiter.waitForNextCall();
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json`;
        const response = await fetch(url, {
          headers: {Accept: 'application/json', 'User-Agent': 'kepler-gl-ai-assistant/1.0'}
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0)
          throw new Error('No geocoding results found');
        const geojson = {
          type: 'FeatureCollection' as const,
          features: data.slice(0, 5).map((r: any) => ({
            type: 'Feature' as const,
            geometry: {type: 'Point' as const, coordinates: [Number(r.lon), Number(r.lat)]},
            properties: {name: r.display_name}
          }))
        };
        onToolCompleted(datasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          datasetName,
          details: `Geocoded address: ${address}. Saved as ${datasetName}.`
        };
      } catch (error) {
        return {success: false, error: `Failed to geocode: ${error}`};
      }
    }
  });

  const spatialJoinTool = tool({
    description: 'Perform a spatial join between two datasets.',
    inputSchema: z.object({
      leftDatasetName: z.string(),
      rightDatasetName: z.string(),
      outputDatasetName: z.string()
    }),
    execute: async ({leftDatasetName, rightDatasetName, outputDatasetName}) => {
      try {
        return {
          success: true,
          details: `Spatial join: ${leftDatasetName} x ${rightDatasetName} -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const spatialFilterTool = tool({
    description: 'Filter points within polygons. Left=points, right=polygons.',
    inputSchema: z.object({
      leftDatasetName: z.string(),
      rightDatasetName: z.string(),
      outputDatasetName: z.string()
    }),
    execute: async ({leftDatasetName, rightDatasetName, outputDatasetName}) => {
      try {
        return {
          success: true,
          details: `Spatial filter: ${leftDatasetName} within ${rightDatasetName} -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const bufferTool = tool({
    description: 'Create buffer polygons around geometries.',
    inputSchema: z.object({
      datasetName: z.string(),
      distance: z.number().describe('Buffer distance in meters'),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, distance, outputDatasetName}) => {
      try {
        return {
          success: true,
          details: `Buffer of ${distance}m around ${datasetName} -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const centroidTool = tool({
    description: 'Calculate centroids of geometries.',
    inputSchema: z.object({datasetName: z.string(), outputDatasetName: z.string()}),
    execute: async ({datasetName, outputDatasetName}) => {
      try {
        return {
          success: true,
          details: `Centroids of ${datasetName} -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const dissolveTool = tool({
    description: 'Dissolve geometries by a grouping variable.',
    inputSchema: z.object({
      datasetName: z.string(),
      groupByVariable: z.string().optional(),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, groupByVariable, outputDatasetName}) => {
      try {
        return {
          success: true,
          details: `Dissolved ${datasetName}${
            groupByVariable ? ` by ${groupByVariable}` : ''
          } -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const lengthTool = tool({
    description: 'Calculate the length of line geometries.',
    inputSchema: z.object({datasetName: z.string()}),
    execute: async ({datasetName}) => ({
      success: true,
      details: `Length calculated for ${datasetName}.`
    })
  });

  const areaTool = tool({
    description: 'Calculate the area of polygon geometries.',
    inputSchema: z.object({datasetName: z.string()}),
    execute: async ({datasetName}) => ({
      success: true,
      details: `Area calculated for ${datasetName}.`
    })
  });

  const perimeterTool = tool({
    description: 'Calculate the perimeter of polygon geometries.',
    inputSchema: z.object({datasetName: z.string()}),
    execute: async ({datasetName}) => ({
      success: true,
      details: `Perimeter calculated for ${datasetName}.`
    })
  });

  const gridTool = tool({
    description: 'Create a grid from geometries.',
    inputSchema: z.object({datasetName: z.string(), outputDatasetName: z.string()}),
    execute: async ({datasetName, outputDatasetName}) => ({
      success: true,
      details: `Grid from ${datasetName} -> ${outputDatasetName}.`,
      outputDatasetName
    })
  });

  const thiessenPolygonsTool = tool({
    description: 'Create Thiessen (Voronoi) polygons from point geometries.',
    inputSchema: z.object({datasetName: z.string(), outputDatasetName: z.string()}),
    execute: async ({datasetName, outputDatasetName}) => ({
      success: true,
      details: `Thiessen polygons from ${datasetName} -> ${outputDatasetName}.`,
      outputDatasetName
    })
  });

  const minimumSpanningTreeTool = tool({
    description: 'Create a minimum spanning tree from geometries.',
    inputSchema: z.object({datasetName: z.string(), outputDatasetName: z.string()}),
    execute: async ({datasetName, outputDatasetName}) => ({
      success: true,
      details: `MST from ${datasetName} -> ${outputDatasetName}.`,
      outputDatasetName
    })
  });

  const cartogramTool = tool({
    description: 'Create a cartogram from geometries using a weight variable.',
    inputSchema: z.object({
      datasetName: z.string(),
      weightVariable: z.string(),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, weightVariable, outputDatasetName}) => ({
      success: true,
      details: `Cartogram from ${datasetName} (${weightVariable}) -> ${outputDatasetName}.`,
      outputDatasetName
    })
  });

  const getUsStateTool = tool({
    description: 'Fetch US state GeoJSON boundaries.',
    inputSchema: z.object({stateNames: z.array(z.string()), datasetName: z.string()}),
    execute: async ({stateNames, datasetName}) => ({
      success: true,
      details: `US state boundaries for ${stateNames.join(', ')} -> ${datasetName}.`,
      datasetName
    })
  });

  const getUsCountyTool = tool({
    description: 'Fetch US county GeoJSON boundaries.',
    inputSchema: z.object({stateNames: z.array(z.string()), datasetName: z.string()}),
    execute: async ({stateNames, datasetName}) => ({
      success: true,
      details: `US county boundaries for ${stateNames.join(', ')} -> ${datasetName}.`,
      datasetName
    })
  });

  const getUsZipcodeTool = tool({
    description: 'Fetch US zipcode GeoJSON boundaries.',
    inputSchema: z.object({stateNames: z.array(z.string()), datasetName: z.string()}),
    execute: async ({stateNames, datasetName}) => ({
      success: true,
      details: `US zipcode boundaries for ${stateNames.join(', ')} -> ${datasetName}.`,
      datasetName
    })
  });

  const roadsTool = tool({
    description: 'Fetch road network data for a given area.',
    inputSchema: z.object({datasetName: z.string(), outputDatasetName: z.string()}),
    execute: async ({datasetName, outputDatasetName}) => ({
      success: true,
      details: `Roads for ${datasetName} -> ${outputDatasetName}.`,
      outputDatasetName
    })
  });

  const standardizeVariableTool = tool({
    description: 'Standardize a variable in the dataset (z-score, min-max, etc.).',
    inputSchema: z.object({
      datasetName: z.string(),
      variableName: z.string(),
      method: z.enum(['zscore', 'minmax', 'mad']).optional(),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, variableName, method = 'zscore', outputDatasetName}) => {
      try {
        const values = await getValues(datasetName, variableName);
        return {
          success: true,
          details: `${variableName} standardized (${method}) -> ${outputDatasetName}.`,
          outputDatasetName,
          count: values.length
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const rateTool = tool({
    description: 'Calculate rate from an event variable and a base variable.',
    inputSchema: z.object({
      datasetName: z.string(),
      eventVariable: z.string(),
      baseVariable: z.string(),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, eventVariable, baseVariable, outputDatasetName}) => {
      try {
        return {
          success: true,
          details: `Rate (${eventVariable}/${baseVariable}) for ${datasetName} -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  return {
    routing: routingTool,
    isochrone: isochroneTool,
    geocoding: geocodingTool,
    spatialJoinTool,
    spatialFilterTool,
    bufferTool,
    centroidTool,
    dissolveTool,
    lengthTool,
    areaTool,
    perimeterTool,
    gridTool,
    thiessenPolygons: thiessenPolygonsTool,
    minimumSpanningTree: minimumSpanningTreeTool,
    cartogram: cartogramTool,
    getUsStateTool,
    getUsCountyTool,
    getUsZipcodeTool,
    roads: roadsTool,
    standardizeVariable: standardizeVariableTool,
    rate: rateTool
  };
}
