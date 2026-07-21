
import {tool} from 'ai';
import {z} from 'zod';
import {FeatureCollection, Feature} from 'geojson';
import {
  getCartogram,
  getMinimumSpanningTree,
  getThiessenPolygons,
  deviationFromMean,
  standardizeMAD,
  rangeAdjust,
  rangeStandardize,
  standardize,
  excessRisk,
  empiricalBayes,
  SpatialGeometry
} from '@geoda/core';
import {bbox} from '@turf/bbox';
import {polygon} from '@turf/helpers';
import {KeplerContext} from '../types';
import {getValuesFromDataset, getGeometriesFromDataset, getConnector, ensureSpatialExtension, FETCH_TIMEOUT_MS, combineSignals, mapboxRateLimiter, nominatimRateLimiter, overpassRateLimiter, githubRateLimiter, datasetNameToTableName} from './utils';
import {saveToDuckdb, saveGeojsonToDuckdb, getTableAsGeoJSON} from './duckdb-cache';
import {getRoutingTool} from './routing';

function extractAllCoordinates(geom: any): [number, number][] {
  if (!geom) return [];
  if (geom.type === 'Point') return [geom.coordinates];
  if (geom.type === 'MultiPoint' || geom.type === 'LineString') return geom.coordinates;
  if (geom.type === 'MultiLineString' || geom.type === 'Polygon') return geom.coordinates.flat();
  if (geom.type === 'MultiPolygon') return geom.coordinates.flat(2);
  if (geom.type === 'GeometryCollection')
    return (geom.geometries || []).flatMap(extractAllCoordinates);
  return [];
}

export function getGeoTools(ctx: KeplerContext) {
  const getValues = async (datasetName: string, variableName: string) => {
    const visState = ctx.getVisState();
    return getValuesFromDataset(
      visState.datasets,
      visState.layers,
      datasetName,
      variableName
    ) as number[];
  };

  const getGeometries = async (datasetName: string): Promise<SpatialGeometry> => {
    const visState = ctx.getVisState();
    let geoms = getGeometriesFromDataset(
      visState.datasets,
      visState.layers,
      visState.layerData,
      datasetName
    );
    if (geoms.length === 0) {
      const geojson = await getTableAsGeoJSON(datasetName);
      if (geojson) {
        geoms = geojson.features;
      }
    }
    return geoms as Feature[];
  };

  const onToolCompleted = async (toolName: string, result: any) => {
    // save to duckdb cache
    await saveToDuckdb(toolName, result);
  };

  const ensureDatasetInDuckdb = async (datasetName: string) => {
    const tableName = datasetNameToTableName(datasetName);
    let geojson = await getTableAsGeoJSON(tableName);
    if (!geojson) {
      const geometries = await getGeometries(datasetName);
      if (!geometries || geometries.length === 0) return null;
      geojson = {
        type: 'FeatureCollection',
        features: (geometries as any[]).map((feat: any) => ({
          type: 'Feature',
          geometry: feat.geometry || feat,
          properties: feat.properties || {}
        }))
      };
      await saveGeojsonToDuckdb(tableName, geojson);
    }
    return geojson;
  };

  const routingTool = getRoutingTool(ctx, onToolCompleted);

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
      {abortSignal}
    ) => {
      const {signal, cleanup} = combineSignals(FETCH_TIMEOUT_MS, abortSignal);
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
        await onToolCompleted(datasetName, {type: 'geojson', content: geojson});
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
    execute: async ({address, datasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        await nominatimRateLimiter.waitForNextCall();
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json`;
        const response = await fetch(url, {
          headers: {Accept: 'application/json', 'User-Agent': 'kepler-gl-ai-assistant/1.0'},
          signal: abortSignal
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
        await onToolCompleted(datasetName, {type: 'geojson', content: geojson});
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

  const spatialQueryTool = tool({
    description: 'Run a DuckDB spatial SQL query on one or more datasets. Use ST_* functions for spatial operations (ST_Intersects, ST_Within, ST_Buffer, ST_Centroid, ST_Union_Agg, ST_Length, ST_Area, ST_Perimeter, ST_AsGeoJSON, ST_GeomFromGeoJSON, etc). The geometry column stores GeoJSON strings — wrap with ST_GeomFromGeoJSON(geometry) for spatial ops. Reference tables using __tbl0__, __tbl1__, ... placeholders (mapped to datasetNames in order).',
    inputSchema: z.object({
      datasetNames: z.array(z.string()).describe('Dataset names to load into DuckDB before querying (order matches __tbl0__, __tbl1__, ...)'),
      outputDatasetName: z.string().describe('Name for the output GeoJSON dataset'),
      sqlQuery: z.string().describe('DuckDB spatial SQL query using __tbl0__, __tbl1__, ... as table placeholders'),
      reasoning: z.string().describe('Explanation of what this spatial query does')
    }),
    execute: async ({datasetNames, outputDatasetName, sqlQuery, reasoning}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();

        for (const name of datasetNames) {
          const loaded = await ensureDatasetInDuckdb(name);
          if (!loaded) throw new Error(`Dataset ${name} is empty or not found`);
        }

        await ensureSpatialExtension();
        const db = await getConnector();

        let resolvedSql = sqlQuery;
        datasetNames.forEach((name, i) => {
          const tableName = datasetNameToTableName(name);
          resolvedSql = resolvedSql.replace(new RegExp(`__tbl${i}__`, 'g'), `"${tableName}"`);
        });

        const result = await db.query(resolvedSql);
        const rows = result.toArray().map((row: any) =>
          typeof row.toJSON === 'function' ? row.toJSON() : row
        );

        const features = rows.map((row: any) => {
          const geometry = typeof row.geometry === 'string' ? JSON.parse(row.geometry) : row.geometry;
          const props = {...row};
          delete props.geometry;
          return {type: 'Feature' as const, geometry, properties: props};
        });

        const geojson = {type: 'FeatureCollection' as const, features};
        await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          details: `${reasoning} — ${features.length} features -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const gridTool = tool({
    description: 'Create a rectangular grid of polygons that divides a given area into rows and columns.',
    inputSchema: z.object({
      datasetName: z.string().describe('Dataset whose bounding box defines the grid extent'),
      rows: z.number().positive().describe('Number of rows in the grid'),
      columns: z.number().positive().describe('Number of columns in the grid'),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, rows, columns, outputDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const geometries = await getGeometries(datasetName);
        if (!geometries || geometries.length === 0) throw new Error(`Dataset ${datasetName} is empty or not found`);

        const featureCollection: FeatureCollection = {
          type: 'FeatureCollection',
          features: (geometries as any[]).map((feat: any) => ({
            type: 'Feature' as const,
            geometry: feat.geometry || feat,
            properties: feat.properties || {}
          }))
        };
        const [minX, minY, maxX, maxY] = bbox(featureCollection);

        const cellWidth = (maxX - minX) / columns;
        const cellHeight = (maxY - minY) / rows;

        const gridFeatures: Feature[] = [];
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const x1 = minX + col * cellWidth;
            const y1 = minY + row * cellHeight;
            const x2 = x1 + cellWidth;
            const y2 = y1 + cellHeight;
            gridFeatures.push(polygon([[
              [x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]
            ]], {row, column: col, gridId: `${row}_${col}`}));
          }
        }

        const geojson: FeatureCollection = {type: 'FeatureCollection', features: gridFeatures};
        await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          details: `Grid of ${rows}x${columns} (${gridFeatures.length} cells) from ${datasetName} -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const thiessenPolygonsTool = tool({
    description: 'Create Thiessen (Voronoi) polygons from geometries using GeoDa.',
    inputSchema: z.object({
      datasetName: z.string(),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, outputDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const geometries = await getGeometries(datasetName);
        if (!geometries || geometries.length === 0) throw new Error(`Dataset ${datasetName} is empty or not found`);

        const thiessenFeatures = await getThiessenPolygons({geoms: geometries});
        const geojson: FeatureCollection = {
          type: 'FeatureCollection',
          features: thiessenFeatures
        };
        await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          details: `Thiessen polygons from ${geometries.length} features -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const minimumSpanningTreeTool = tool({
    description: 'Create a minimum spanning tree (MST) from geometries using GeoDa.',
    inputSchema: z.object({
      datasetName: z.string(),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, outputDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const geometries = await getGeometries(datasetName);
        if (!geometries || geometries.length === 0) throw new Error(`Dataset ${datasetName} is empty or not found`);

        const mstFeatures = await getMinimumSpanningTree({geoms: geometries});
        const geojson: FeatureCollection = {
          type: 'FeatureCollection',
          features: mstFeatures
        };
        await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          details: `MST with ${mstFeatures.length} edges from ${geometries.length} features -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const cartogramTool = tool({
    description: 'Create a Dorling cartogram from polygon geometries using a weight variable (GeoDa).',
    inputSchema: z.object({
      datasetName: z.string(),
      weightVariable: z.string().describe('Property name to use as weight'),
      iterations: z.number().optional().describe('Number of iterations for cartogram optimization (default 100)'),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, weightVariable, iterations = 100, outputDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const geometries = await getGeometries(datasetName);
        if (!geometries || geometries.length === 0) throw new Error(`Dataset ${datasetName} is empty or not found`);

        const values = await getValues(datasetName, weightVariable);
        const cartogramFeatures: Feature[] = await getCartogram(geometries, values, iterations);

        const geojson: FeatureCollection = {
          type: 'FeatureCollection',
          features: cartogramFeatures.map((feature, index) => ({
            ...feature,
            properties: {
              ...feature.properties,
              [weightVariable]: values[index]
            }
          }))
        };
        await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          details: `Cartogram from ${cartogramFeatures.length} features (${weightVariable}) -> ${outputDatasetName}.`,
          outputDatasetName
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const getUsStateTool = tool({
    description: 'Fetch US state GeoJSON boundaries from GitHub (glynnbird/usstatesgeojson).',
    inputSchema: z.object({
      stateNames: z.array(z.string().describe('US state name in lowercase (e.g. "california", "north dakota")')),
      datasetName: z.string().describe('Name for the output dataset')
    }),
    execute: async ({stateNames, datasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const features: any[] = [];
        for (const stateName of stateNames) {
          await githubRateLimiter.waitForNextCall();
          const response = await fetch(
            `https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/${stateName.toLowerCase()}.geojson`,
            {signal: abortSignal}
          );
          if (!response.ok) throw new Error(`Failed to fetch state ${stateName}: ${response.statusText}`);
          const geojson = await response.json();
          if (geojson) features.push(geojson);
        }
        const finalGeojson = {type: 'FeatureCollection' as const, features};
        await onToolCompleted(datasetName, {type: 'geojson', content: finalGeojson});
        return {
          success: true,
          datasetName,
          details: `US state boundaries for ${stateNames.join(', ')} saved as ${datasetName}.`
        };
      } catch (error) {
        return {success: false, error: `Failed to fetch US state boundaries: ${error}`};
      }
    }
  });

  const getUsCountyTool = tool({
    description: 'Fetch US county GeoJSON boundaries by FIPS codes (from hyperknot/country-levels-export).',
    inputSchema: z.object({
      fipsCodes: z.array(z.string().describe('5-digit FIPS code (e.g. "01001" for Autauga County, Alabama)')),
      datasetName: z.string().describe('Name for the output dataset')
    }),
    execute: async ({fipsCodes, datasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const features: any[] = [];
        for (const fips of fipsCodes) {
          await githubRateLimiter.waitForNextCall();
          const stateCode = fips.substring(0, 2);
          const response = await fetch(
            `https://raw.githubusercontent.com/hyperknot/country-levels-export/master/geojson/medium/fips/${stateCode}/${fips}.geojson`,
            {signal: abortSignal}
          );
          if (!response.ok) throw new Error(`Failed to fetch county ${fips}: ${response.statusText}`);
          const geojson = await response.json();
          if (geojson) features.push(geojson);
        }
        const finalGeojson = {type: 'FeatureCollection' as const, features};
        await onToolCompleted(datasetName, {type: 'geojson', content: finalGeojson});
        return {
          success: true,
          datasetName,
          details: `US county boundaries for FIPS ${fipsCodes.join(', ')} saved as ${datasetName}.`
        };
      } catch (error) {
        return {success: false, error: `Failed to fetch US county boundaries: ${error}`};
      }
    }
  });

  const getUsZipcodeTool = tool({
    description: 'Fetch US zipcode GeoJSON boundaries (from greencoder/us-zipcode-to-geojson).',
    inputSchema: z.object({
      zipcodes: z.array(z.string().describe('5-digit US zipcode')),
      datasetName: z.string().describe('Name for the output dataset')
    }),
    execute: async ({zipcodes, datasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const features: any[] = [];
        for (const zipcode of zipcodes) {
          await githubRateLimiter.waitForNextCall();
          const prefix = zipcode.slice(0, 3);
          const stateCodeResponse = await fetch(
            `https://raw.githubusercontent.com/greencoder/us-zipcode-to-geojson/refs/heads/master/data/lookup.json`,
            {signal: abortSignal}
          );
          let stateCode = '';
          if (stateCodeResponse.ok) {
            const lookup = await stateCodeResponse.json();
            stateCode = lookup[prefix] || '';
          }
          if (!stateCode) {
            const stateMap: Record<string, string> = {
              '006': 'PR', '007': 'PR', '008': 'PR', '009': 'PR',
              '010': 'AL', '011': 'AL', '012': 'AL', '013': 'AL',
              '100': 'NY', '101': 'NY', '102': 'NY', '103': 'NY',
              '900': 'CA', '901': 'CA', '902': 'CA', '903': 'CA'
            };
            stateCode = stateMap[prefix] || 'unknown';
          }
          await githubRateLimiter.waitForNextCall();
          const response = await fetch(
            `https://raw.githubusercontent.com/greencoder/us-zipcode-to-geojson/refs/heads/master/data/${stateCode}/${zipcode}.geojson`,
            {signal: abortSignal}
          );
          if (!response.ok) throw new Error(`Failed to fetch zipcode ${zipcode}: ${response.statusText}`);
          const geojson = await response.json();
          if (geojson && 'features' in geojson) {
            geojson.features.shift();
            features.push(...geojson.features);
          }
        }
        const finalGeojson = {type: 'FeatureCollection' as const, features};
        await onToolCompleted(datasetName, {type: 'geojson', content: finalGeojson});
        return {
          success: true,
          datasetName,
          details: `US zipcode boundaries for ${zipcodes.join(', ')} saved as ${datasetName}.`
        };
      } catch (error) {
        return {success: false, error: `Failed to fetch US zipcode boundaries: ${error}`};
      }
    }
  });

  const roadsTool = tool({
    description: 'Fetch road network data from OpenStreetMap Overpass API for a given area.',
    inputSchema: z.object({
      mapBounds: z.object({
        northwest: z.object({longitude: z.number(), latitude: z.number()}),
        southeast: z.object({longitude: z.number(), latitude: z.number()})
      }).optional(),
      datasetName: z.string().optional().describe('Name of an existing dataset whose boundary will be used to fetch roads'),
      outputDatasetName: z.string().describe('Name for the output dataset')
    }),
    execute: async ({mapBounds, datasetName, outputDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        let south = mapBounds?.southeast.latitude || 0;
        let east = mapBounds?.southeast.longitude || 0;
        let north = mapBounds?.northwest.latitude || 0;
        let west = mapBounds?.northwest.longitude || 0;

        if (datasetName) {
          const geometries = await getGeometries(datasetName);
          if (geometries && geometries.length > 0) {
            let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
            for (const feat of geometries as any[]) {
              const geom = feat.geometry || feat;
              const coords = extractAllCoordinates(geom);
              for (const [lon, lat] of coords) {
                if (lat < minLat) minLat = lat;
                if (lat > maxLat) maxLat = lat;
                if (lon < minLon) minLon = lon;
                if (lon > maxLon) maxLon = lon;
              }
            }
            south = minLat;
            west = minLon;
            north = maxLat;
            east = maxLon;
          }
        }

        const query = `
          [out:json][timeout:25];
          (
            way[highway~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|service|living_street|path|track|road)$"](${south},${west},${north},${east});
          );
          out body;
          >;
          out skel qt;
        `;

        await overpassRateLimiter.waitForNextCall();
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query,
          signal: abortSignal
        });
        if (!response.ok) throw new Error(`Overpass API request failed: ${response.statusText}`);
        const data = await response.json();

        const nodeMap = new Map<number, {lat: number; lon: number}>();
        const ways: any[] = [];
        for (const element of data.elements) {
          if (element.type === 'node') {
            nodeMap.set(element.id, {lat: element.lat, lon: element.lon});
          } else if (element.type === 'way') {
            ways.push(element);
          }
        }

        const features: any[] = [];
        for (const way of ways) {
          const coordinates = way.nodes
            .map((nodeId: number) => {
              const node = nodeMap.get(nodeId);
              return node ? [node.lon, node.lat] : null;
            })
            .filter(Boolean);
          if (coordinates.length >= 2) {
            features.push({
              type: 'Feature' as const,
              geometry: {type: 'LineString' as const, coordinates},
              properties: {
                id: way.id,
                highway: way.tags?.highway,
                name: way.tags?.name || 'Unnamed Road'
              }
            });
          }
        }

        const roadsGeojson = {type: 'FeatureCollection' as const, features};
        await onToolCompleted(outputDatasetName, {type: 'geojson', content: roadsGeojson});
        return {
          success: true,
          datasetName: outputDatasetName,
          details: `Retrieved ${features.length} roads saved as ${outputDatasetName}.`
        };
      } catch (error) {
        return {success: false, error: `Failed to fetch roads: ${error}`};
      }
    }
  });

  const standardizeVariableTool = tool({
    description:
      'Standardize a variable using statistical methods: deviationFromMean, standardizeMAD, rangeAdjust, rangeStandardize, or standardize (Z-score).',
    inputSchema: z.object({
      datasetName: z.string(),
      variableName: z.string(),
      method: z.enum(['deviationFromMean', 'standardizeMAD', 'rangeAdjust', 'rangeStandardize', 'standardize']),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, variableName, method, outputDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const values = await getValues(datasetName, variableName);

        let standardizedValues: number[] | undefined;
        switch (method) {
          case 'deviationFromMean':
            standardizedValues = await deviationFromMean(values);
            break;
          case 'standardizeMAD':
            standardizedValues = await standardizeMAD(values);
            break;
          case 'rangeAdjust':
            standardizedValues = await rangeAdjust(values);
            break;
          case 'rangeStandardize':
            standardizedValues = await rangeStandardize(values);
            break;
          case 'standardize':
            standardizedValues = await standardize(values);
            break;
          default:
            throw new Error(`Invalid standardization method: ${method}`);
        }

        if (!standardizedValues) {
          throw new Error(`Failed to standardize ${variableName} using ${method}`);
        }

        const outputVariableName = `${variableName}_${method}`;
        await onToolCompleted(outputDatasetName, {
          type: 'columnData',
          content: {[outputVariableName]: standardizedValues}
        });

        return {
          success: true,
          details: `Standardized ${variableName} using ${method} -> ${outputDatasetName} (column: ${outputVariableName}).`,
          outputDatasetName,
          outputVariableName,
          count: standardizedValues.length
        };
      } catch (error) {
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
      }
    }
  });

  const rateTool = tool({
    description: 'Calculate rate from an event variable and a base variable using excess risk or empirical Bayes smoothing.',
    inputSchema: z.object({
      datasetName: z.string(),
      eventVariable: z.string(),
      baseVariable: z.string(),
      method: z.enum(['excessRisk', 'empiricalBayes']).optional().describe('Rate method (default: excessRisk)'),
      outputDatasetName: z.string()
    }),
    execute: async ({datasetName, eventVariable, baseVariable, method = 'excessRisk', outputDatasetName}, {abortSignal}) => {
      try {
        abortSignal?.throwIfAborted();
        const eventValues = await getValues(datasetName, eventVariable);
        const baseValues = await getValues(datasetName, baseVariable);

        let rateValues: number[];
        if (method === 'empiricalBayes') {
          rateValues = empiricalBayes(baseValues, eventValues);
        } else {
          rateValues = excessRisk(baseValues, eventValues);
        }

        const outputVariableName = `${eventVariable}_${method}_rate`;
        await onToolCompleted(outputDatasetName, {
          type: 'columnData',
          content: {[outputVariableName]: rateValues}
        });

        return {
          success: true,
          details: `Rate (${method}) for ${eventVariable}/${baseVariable} on ${datasetName} -> ${outputDatasetName} (column: ${outputVariableName}).`,
          outputDatasetName,
          outputVariableName,
          count: rateValues.length
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
    spatialQuery: spatialQueryTool,
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
