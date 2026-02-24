import {tableFromIPC} from 'apache-arrow';
import {processCsvData, processGeojson} from '@kepler.gl/processors';
import type {ProcessorResult} from '@kepler.gl/types';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import type {DatasetPayload} from '../types';

const DEBUG = true;
function debug(...args: unknown[]) {
  if (DEBUG) {
    console.log('[keplergl-data]', ...args);
  }
}

// GeoArrow extension metadata key
const GEOARROW_METADATA_KEY = 'ARROW:extension:name';

export async function processDataset(payload: DatasetPayload): Promise<ProcessorResult | null> {
  const {id, data, format} = payload;
  debug('processDataset called:', {id, format, dataType: typeof data});

  try {
    let result: ProcessorResult | null = null;
    switch (format) {
      case 'arrow':
      case 'geoarrow':
        debug('Processing as arrow/geoarrow');
        result = processGeoArrowData(data as string);
        break;
      case 'csv':
        debug('Processing as CSV');
        result = processCsvData(data as string);
        break;
      case 'geojson':
        debug('Processing as GeoJSON');
        result = processGeojson(data as object);
        break;
      case 'json':
      case 'df':
        debug('Processing as JSON/DataFrame', data);
        result = processJsonData(data);
        break;
      default:
        throw new Error(`Unknown data format: ${format}`);
    }
    debug(
      'processDataset result:',
      result ? {fields: result.fields?.length, rows: result.rows?.length} : null
    );
    return result;
  } catch (error) {
    console.error('[keplergl-data] Error processing dataset:', error);
    throw error;
  }
}

/**
 * Process GeoArrow data by converting to row-based format.
 * This avoids Arrow version mismatch issues between our code and kepler.gl's internal Arrow.
 */
function processGeoArrowData(base64Data: string): ProcessorResult | null {
  debug('processGeoArrowData: decoding base64 data, length:', base64Data.length);
  const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
  debug('processGeoArrowData: decoded to', bytes.length, 'bytes');
  
  const table = tableFromIPC(bytes);
  debug('processGeoArrowData: created table with', table.numRows, 'rows and', table.numCols, 'columns');
  
  if (table.numRows === 0) {
    return null;
  }

  // Build fields from schema, detecting geoarrow columns from metadata
  const fields = table.schema.fields.map((field, fieldIndex) => {
    const extensionName = field.metadata?.get(GEOARROW_METADATA_KEY);
    const isGeoArrow = extensionName?.startsWith('geoarrow');
    
    debug(`Field ${field.name}: type=${field.type.toString()}, extensionName=${extensionName}, isGeoArrow=${isGeoArrow}`);

    let type: string;
    let analyzerType: string;

    if (isGeoArrow) {
      type = ALL_FIELD_TYPES.geoarrow;
      analyzerType = 'GEOMETRY';
    } else {
      type = arrowTypeToKeplerType(field.type);
      analyzerType = arrowTypeToAnalyzerType(field.type);
    }

    return {
      name: field.name,
      id: field.name,
      displayName: field.name,
      format: '',
      fieldIdx: fieldIndex,
      type,
      analyzerType
    };
  });

  // Convert Arrow table to row-based format
  // For geometry columns, convert to GeoJSON strings that kepler.gl can parse
  const rows: any[][] = [];
  for (let rowIdx = 0; rowIdx < table.numRows; rowIdx++) {
    const row: any[] = [];
    for (let colIdx = 0; colIdx < table.numCols; colIdx++) {
      const field = fields[colIdx];
      const value = table.getChildAt(colIdx)?.get(rowIdx);
      
      if (field.type === ALL_FIELD_TYPES.geoarrow && value !== null) {
        // Convert geoarrow geometry to GeoJSON string
        row.push(arrowGeometryToGeoJSON(value));
      } else {
        row.push(value);
      }
    }
    rows.push(row);
  }

  debug('processGeoArrowData: converted to', rows.length, 'rows');
  debug('processGeoArrowData: first row sample:', rows[0]?.slice(0, 3));

  // Update field types for geometry columns to geojson since we converted them
  const updatedFields = fields.map(f => {
    if (f.type === ALL_FIELD_TYPES.geoarrow) {
      return {...f, type: ALL_FIELD_TYPES.geojson, analyzerType: 'GEOMETRY'};
    }
    return f;
  });

  return {
    fields: updatedFields,
    rows
  };
}

/**
 * Convert Arrow geometry value to GeoJSON string.
 * Handles various geoarrow geometry types (point, polygon, etc.)
 */
function arrowGeometryToGeoJSON(geom: any): string {
  try {
    // The geometry is stored as nested Arrow structures
    // We need to extract coordinates and build GeoJSON
    
    if (geom === null || geom === undefined) {
      return '';
    }

    // For geoarrow polygon type, the structure is:
    // List<List<Struct<x: Float64, y: Float64>>> for polygon rings
    // We need to recursively extract the coordinates
    
    const coords = extractCoordinates(geom);
    
    if (!coords || coords.length === 0) {
      return '';
    }

    // Determine geometry type based on structure
    let geojson: any;
    
    if (typeof coords[0] === 'number') {
      // Point: [x, y]
      geojson = {type: 'Point', coordinates: coords};
    } else if (typeof coords[0][0] === 'number') {
      // LineString or Polygon ring: [[x, y], ...]
      // Check if it's closed (polygon) or open (linestring)
      const first = coords[0];
      const last = coords[coords.length - 1];
      if (coords.length >= 4 && first[0] === last[0] && first[1] === last[1]) {
        geojson = {type: 'Polygon', coordinates: [coords]};
      } else {
        geojson = {type: 'LineString', coordinates: coords};
      }
    } else if (Array.isArray(coords[0][0])) {
      // Polygon with rings or MultiLineString
      if (typeof coords[0][0][0] === 'number') {
        geojson = {type: 'Polygon', coordinates: coords};
      } else {
        geojson = {type: 'MultiPolygon', coordinates: coords};
      }
    } else {
      // Fallback - try to make a polygon
      geojson = {type: 'Polygon', coordinates: coords};
    }

    return JSON.stringify(geojson);
  } catch (e) {
    debug('arrowGeometryToGeoJSON error:', e);
    return '';
  }
}

/**
 * Recursively extract coordinates from Arrow geometry structure
 */
function extractCoordinates(value: any): any {
  if (value === null || value === undefined) {
    return null;
  }

  // If it's a simple object with x, y properties (Point struct)
  if (typeof value === 'object' && 'x' in value && 'y' in value) {
    return [value.x, value.y];
  }

  // If it's an array-like structure (Arrow Vector or Array)
  if (Array.isArray(value) || (typeof value === 'object' && typeof value.length === 'number')) {
    const result: any[] = [];
    const len = value.length;
    
    for (let i = 0; i < len; i++) {
      const item = Array.isArray(value) ? value[i] : value.get?.(i) ?? value[i];
      const extracted = extractCoordinates(item);
      if (extracted !== null) {
        result.push(extracted);
      }
    }
    return result;
  }

  // If it has a toArray method (Arrow Vector)
  if (typeof value.toArray === 'function') {
    return extractCoordinates(value.toArray());
  }

  // If it has a get method but no length (might be a struct)
  if (typeof value.get === 'function') {
    // Try to get x, y from struct
    const x = value.get('x') ?? value.get(0);
    const y = value.get('y') ?? value.get(1);
    if (x !== undefined && y !== undefined) {
      return [x, y];
    }
  }

  return null;
}

/**
 * Map Arrow data type to Kepler field type
 */
function arrowTypeToKeplerType(arrowType: any): string {
  const typeStr = arrowType.toString();
  
  if (typeStr.startsWith('Int') || typeStr.startsWith('Uint')) {
    return ALL_FIELD_TYPES.integer;
  }
  if (typeStr.startsWith('Float') || typeStr === 'Decimal') {
    return ALL_FIELD_TYPES.real;
  }
  if (typeStr === 'Bool') {
    return ALL_FIELD_TYPES.boolean;
  }
  if (typeStr.startsWith('Timestamp') || typeStr.startsWith('Date')) {
    return ALL_FIELD_TYPES.timestamp;
  }
  if (typeStr === 'Utf8' || typeStr === 'LargeUtf8') {
    return ALL_FIELD_TYPES.string;
  }
  
  return ALL_FIELD_TYPES.string;
}

/**
 * Map Arrow data type to type-analyzer type
 */
function arrowTypeToAnalyzerType(arrowType: any): string {
  const typeStr = arrowType.toString();
  
  if (typeStr.startsWith('Int') || typeStr.startsWith('Uint')) {
    return 'INT';
  }
  if (typeStr.startsWith('Float') || typeStr === 'Decimal') {
    return 'FLOAT';
  }
  if (typeStr === 'Bool') {
    return 'BOOLEAN';
  }
  if (typeStr.startsWith('Timestamp') || typeStr.startsWith('Date')) {
    return 'DATETIME';
  }
  
  return 'STRING';
}

function processJsonData(data: unknown): ProcessorResult | null {
  debug('processJsonData input:', data);
  if (typeof data === 'object' && data !== null && 'columns' in data) {
    const {columns, data: rows} = data as {columns: string[]; data: unknown[][]};
    debug('processJsonData parsed:', {columns, rowCount: rows?.length, firstRow: rows?.[0]});
    const result = {
      fields: columns.map(name => ({name})),
      rows: rows as any[][]
    };
    debug('processJsonData result:', {
      fieldCount: result.fields.length,
      rowCount: result.rows.length
    });
    return result;
  }
  debug('processJsonData: data does not have expected structure');
  return null;
}
