import type {RoomCommand} from '@sqlrooms/room-store';
import {z} from 'zod';
import {FeatureCollection, Feature} from 'geojson';
import zips from 'zip3';
import {bbox} from '@turf/bbox';
import {polygon} from '@turf/helpers';
import {KeplerContext} from '../types';
import {
  getGeometriesFromDataset,
  getConnector,
  ensureSpatialExtension,
  FETCH_TIMEOUT_MS,
  combineSignals,
  mapboxRateLimiter,
  nominatimRateLimiter,
  overpassRateLimiter,
  githubRateLimiter,
  datasetNameToTableName,
  arrowTableToObjects
} from '../tools/utils';
import {saveToDuckdb, saveGeojsonToDuckdb, getTableAsGeoJSON} from '../tools/duckdb-cache';
import {getRoutingCommand} from './routing-command';

export function getGeoCommands(ctx: KeplerContext): Record<string, RoomCommand> {
  const getGeometries = async (datasetName: string): Promise<Feature[]> => {
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

  const routing = getRoutingCommand(ctx, onToolCompleted);

  const isochrone: RoomCommand = {
    id: 'geo.isochrone',
    name: 'Isochrone polygons',
    group: 'Geo',
    description:
      'Get isochrone polygons showing reachable areas within a time/distance from a point.',
    inputSchema: z.object({
      origin: z.object({longitude: z.number(), latitude: z.number()}),
      timeLimit: z.number().optional().describe('Time limit in minutes'),
      distanceLimit: z.number().optional().describe('Distance limit in meters'),
      profile: z.enum(['driving', 'walking', 'cycling']).optional(),
      datasetName: z.string().describe('Name for the output dataset')
    }) as any,
    execute: async (_execCtx, input) => {
      const {origin, timeLimit, distanceLimit, profile = 'driving', datasetName} = (input ?? {}) as {
        origin: {longitude: number; latitude: number};
        timeLimit?: number;
        distanceLimit?: number;
        profile?: 'driving' | 'walking' | 'cycling';
        datasetName: string;
      };
      const {signal, cleanup} = combineSignals(FETCH_TIMEOUT_MS, undefined);
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
        if (!data.features || data.features.length === 0) {
          return {success: false, commandId: 'geo.isochrone', error: 'No isochrone data returned'};
        }
        const geojson = {
          type: 'FeatureCollection' as const,
          features: data.features.map((f: any) => ({
            type: 'Feature' as const,
            geometry: f.geometry,
            properties: {}
          }))
        };
        await onToolCompleted(datasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          commandId: 'geo.isochrone',
          data: {datasetName, details: `Isochrone polygons saved as ${datasetName}.`}
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geo.isochrone',
          error: `Failed to generate isochrone: ${error}`
        };
      } finally {
        cleanup();
      }
    }
  };

  const geocoding: RoomCommand = {
    id: 'geo.geocode',
    name: 'Geocode address',
    group: 'Geo',
    description: 'Geocode an address to get latitude and longitude.',
    inputSchema: z.object({
      address: z.string().describe('The address to geocode'),
      datasetName: z.string().describe('Name for the output dataset')
    }) as any,
    execute: async (_execCtx, input) => {
      const {address, datasetName} = (input ?? {}) as {address: string; datasetName: string};
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
        await onToolCompleted(datasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          commandId: 'geo.geocode',
          data: {
            datasetName,
            details: `Geocoded address: ${address}. Saved as ${datasetName}.`
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geo.geocode',
          error: `Failed to geocode: ${error}`
        };
      }
    }
  };

  const spatialQuery: RoomCommand = {
    id: 'geo.spatial-query',
    name: 'Spatial SQL query',
    group: 'Geo',
    description:
      'Run a DuckDB spatial SQL query on one or more datasets. Use ST_* functions for spatial operations (ST_Intersects, ST_Within, ST_Buffer, ST_Centroid, ST_Union_Agg, ST_Length, ST_Area, ST_Perimeter, ST_AsGeoJSON, ST_GeomFromGeoJSON, etc). The geometry column stores GeoJSON strings — wrap with ST_GeomFromGeoJSON(geometry) for spatial ops. Reference tables using __tbl0__, __tbl1__, ... placeholders (mapped to datasetNames in order).',
    inputSchema: z.object({
      datasetNames: z
        .array(z.string())
        .describe(
          'Dataset names to load into DuckDB before querying (order matches __tbl0__, __tbl1__, ...)'
        ),
      outputDatasetName: z.string().describe('Name for the output GeoJSON dataset'),
      sqlQuery: z
        .string()
        .describe('DuckDB spatial SQL query using __tbl0__, __tbl1__, ... as table placeholders'),
      reasoning: z.string().describe('Explanation of what this spatial query does')
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetNames, outputDatasetName, sqlQuery, reasoning} = (input ?? {}) as {
        datasetNames: string[];
        outputDatasetName: string;
        sqlQuery: string;
        reasoning: string;
      };
      try {
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
        const rows = arrowTableToObjects(result);

        const features = rows.map((row: any) => {
          const geometry =
            typeof row.geometry === 'string' ? JSON.parse(row.geometry) : row.geometry;
          const props = {...row};
          delete props.geometry;
          return {type: 'Feature' as const, geometry, properties: props};
        });

        const geojson = {type: 'FeatureCollection' as const, features};
        await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          commandId: 'geo.spatial-query',
          data: {
            details: `${reasoning} — ${features.length} features -> ${outputDatasetName}.`,
            outputDatasetName,
            // Preview of the result rows (properties only, geometry excluded) so
            // the LLM can read scalar values (e.g. area/length/perimeter) computed
            // by the spatial SQL. Surfaced via `toModelOutput`'s firstFiveRows.
            firstFiveRows: features.slice(0, 5).map(f => f.properties)
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geo.spatial-query',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  const gridCommand: RoomCommand = {
    id: 'geo.grid',
    name: 'Rectangular grid',
    group: 'Geo',
    description:
      'Create a rectangular grid of polygons that divides a given area into rows and columns.',
    inputSchema: z.object({
      datasetName: z.string().describe('Dataset whose bounding box defines the grid extent'),
      rows: z.number().positive().describe('Number of rows in the grid'),
      columns: z.number().positive().describe('Number of columns in the grid'),
      outputDatasetName: z.string()
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName, rows, columns, outputDatasetName} = (input ?? {}) as {
        datasetName: string;
        rows: number;
        columns: number;
        outputDatasetName: string;
      };
      try {
        const geometries = await getGeometries(datasetName);
        if (!geometries || geometries.length === 0)
          throw new Error(`Dataset ${datasetName} is empty or not found`);

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
            gridFeatures.push(
              polygon(
                [
                  [
                    [x1, y1],
                    [x2, y1],
                    [x2, y2],
                    [x1, y2],
                    [x1, y1]
                  ]
                ],
                {row, column: col, gridId: `${row}_${col}`}
              )
            );
          }
        }

        const geojson: FeatureCollection = {type: 'FeatureCollection', features: gridFeatures};
        await onToolCompleted(outputDatasetName, {type: 'geojson', content: geojson});
        return {
          success: true,
          commandId: 'geo.grid',
          data: {
            details: `Grid of ${rows}x${columns} (${gridFeatures.length} cells) from ${datasetName} -> ${outputDatasetName}.`,
            outputDatasetName
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geo.grid',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  const roads: RoomCommand = {
    id: 'geo.roads',
    name: 'Road networks',
    group: 'Geo',
    description:
      'Fetch road networks from OpenStreetMap (Overpass API) within a bounding box. The box can come from a dataset boundary, explicit mapBounds, or the current map viewport.',
    inputSchema: z.object({
      datasetName: z
        .string()
        .optional()
        .describe('Dataset whose boundary defines the fetch area (takes precedence over mapBounds)'),
      mapBounds: z
        .object({
          northwest: z.object({longitude: z.number(), latitude: z.number()}),
          southeast: z.object({longitude: z.number(), latitude: z.number()})
        })
        .optional()
        .describe('Bounding box to fetch roads within'),
      outputDatasetName: z
        .string()
        .optional()
        .describe('Name for the output dataset (default: roads_<timestamp>)')
    }) as any,
    execute: async (_execCtx, input) => {
      const {datasetName, mapBounds, outputDatasetName} = (input ?? {}) as {
        datasetName?: string;
        mapBounds?: {
          northwest: {longitude: number; latitude: number};
          southeast: {longitude: number; latitude: number};
        };
        outputDatasetName?: string;
      };
      try {
        let south = mapBounds?.southeast.latitude ?? 0;
        let east = mapBounds?.southeast.longitude ?? 0;
        let north = mapBounds?.northwest.latitude ?? 0;
        let west = mapBounds?.northwest.longitude ?? 0;

        if (datasetName) {
          const geometries = await getGeometries(datasetName);
          if (!geometries || geometries.length === 0)
            throw new Error(`Dataset ${datasetName} is empty or not found`);
          const fc: FeatureCollection = {
            type: 'FeatureCollection',
            features: (geometries as any[]).map((feat: any) => ({
              type: 'Feature',
              geometry: feat.geometry || feat,
              properties: feat.properties || {}
            }))
          };
          const [minX, minY, maxX, maxY] = bbox(fc);
          south = minY;
          west = minX;
          north = maxY;
          east = maxX;
        } else if (!mapBounds) {
          const boundary = ctx.getMapBoundary();
          if (boundary) {
            const {nw, se} = boundary;
            west = nw[0];
            north = nw[1];
            east = se[0];
            south = se[1];
          }
        }

        const query = `[out:json][timeout:25];(way[highway~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|service|living_street|path|track|road)$"](${south},${west},${north},${east}););out body;>;out skel qt;`;

        await overpassRateLimiter.waitForNextCall();
        const {signal, cleanup} = combineSignals(FETCH_TIMEOUT_MS, undefined);
        try {
          const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            signal
          });
          if (!response.ok) throw new Error(`Overpass API request failed: ${response.statusText}`);
          const data = await response.json();

          const nodeMap = new Map<number, {lon: number; lat: number}>();
          const ways: {id: number; nodes: number[]; tags: {highway?: string; name?: string}}[] = [];
          data.elements.forEach((element: any) => {
            if (element.type === 'node') nodeMap.set(element.id, element);
            else if (element.type === 'way') ways.push(element);
          });

          const features: Feature[] = [];
          for (const way of ways) {
            const coordinates = way.nodes.map(nodeId => {
              const node = nodeMap.get(nodeId);
              if (!node) throw new Error(`Node ${nodeId} not found`);
              return [node.lon, node.lat];
            });
            features.push({
              type: 'Feature',
              geometry: {type: 'LineString', coordinates},
              properties: {
                id: way.id,
                highway: way.tags.highway,
                name: way.tags.name || 'Unnamed Road'
              }
            });
          }

          const geojson: FeatureCollection = {type: 'FeatureCollection', features};
          const outName = outputDatasetName || `roads_${Date.now()}`;
          await onToolCompleted(outName, {type: 'geojson', content: geojson});
          return {
            success: true,
            commandId: 'geo.roads',
            data: {
              details: `Fetched ${features.length} roads -> ${outName}.`,
              outputDatasetName: outName
            }
          };
        } finally {
          cleanup();
        }
      } catch (error) {
        return {
          success: false,
          commandId: 'geo.roads',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  const usBoundary: RoomCommand = {
    id: 'geo.us-boundary',
    name: 'US boundaries',
    group: 'Geo',
    description:
      'Fetch US state, county, or zipcode boundary GeoJSON from public GitHub datasets.',
    inputSchema: z.object({
      type: z.enum(['state', 'county', 'zipcode']).describe('Boundary type to fetch'),
      ids: z
        .array(z.string())
        .describe(
          'State names (lowercase, e.g. "california"), 5-digit county FIPS codes, or 5-digit zipcodes'
        ),
      outputDatasetName: z
        .string()
        .optional()
        .describe('Name for the output dataset (default: states_/counties_/zipcodes_<timestamp>)')
    }) as any,
    execute: async (_execCtx, input) => {
      const {type, ids, outputDatasetName} = (input ?? {}) as {
        type: 'state' | 'county' | 'zipcode';
        ids: string[];
        outputDatasetName?: string;
      };
      try {
        const features: Feature[] = [];

        for (const id of ids) {
          await githubRateLimiter.waitForNextCall();
          let url: string;
          if (type === 'state') {
            url = `https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/${id}.geojson`;
          } else if (type === 'county') {
            const stateCode = id.slice(0, 2);
            url = `https://raw.githubusercontent.com/hyperknot/country-levels-export/master/geojson/medium/fips/${stateCode}/${id}.geojson`;
          } else {
            const stateCode = zips[id.slice(0, 3)]?.state;
            if (!stateCode) throw new Error(`Unknown zipcode prefix for ${id}`);
            url = `https://raw.githubusercontent.com/greencoder/us-zipcode-to-geojson/refs/heads/master/data/${stateCode}/${id}.geojson`;
          }

          const {signal, cleanup} = combineSignals(FETCH_TIMEOUT_MS, undefined);
          let geojson: any;
          try {
            const response = await fetch(url, {signal});
            if (!response.ok) throw new Error(`HTTP ${response.status} for ${id}`);
            geojson = await response.json();
          } finally {
            cleanup();
          }

          if (type === 'zipcode' && geojson && 'features' in geojson) {
            // drop the first centroid feature
            geojson.features.shift();
            features.push(...geojson.features);
          } else if (geojson && 'features' in geojson) {
            features.push(...geojson.features);
          } else if (geojson) {
            features.push(geojson);
          }
        }

        const geojson: FeatureCollection = {type: 'FeatureCollection', features};
        const prefix = type === 'state' ? 'states' : type === 'county' ? 'counties' : 'zipcodes';
        const outName = outputDatasetName || `${prefix}_${Date.now()}`;
        await onToolCompleted(outName, {type: 'geojson', content: geojson});
        return {
          success: true,
          commandId: 'geo.us-boundary',
          data: {
            details: `Fetched ${features.length} ${type} boundaries -> ${outName}.`,
            outputDatasetName: outName
          }
        };
      } catch (error) {
        return {
          success: false,
          commandId: 'geo.us-boundary',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  };

  return {
    'geo.routing': routing,
    'geo.isochrone': isochrone,
    'geo.geocode': geocoding,
    'geo.spatial-query': spatialQuery,
    'geo.grid': gridCommand,
    'geo.roads': roads,
    'geo.us-boundary': usBoundary
  };
}