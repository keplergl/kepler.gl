// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import uniq from 'lodash.uniq';
import KeplerTable, {Datasets} from './kepler-table';
import {ProtoDataset, RGBColor} from '@kepler.gl/types';
import Task from 'react-palm/tasks';

import {DatasetType, VectorTileType} from '@kepler.gl/constants';
import {
  hexToRgb,
  validateInputData,
  datasetColorMaker,
  getApplicationConfig
} from '@kepler.gl/utils';
import {PMTilesSource, PMTilesMetadata} from '@loaders.gl/pmtiles';
import {/* MVTSource,*/ TileJSON} from '@loaders.gl/mvt';

import {getMVTMetadata} from './tileset/tileset-utils';
import {parseVectorMetadata} from './tileset/vector-tile-utils';

// apply a color for each dataset
// to use as label colors
const datasetColors = [
  '#8F2FBF',
  '#005CFF',
  '#C06C84',
  '#F8B195',
  '#547A82',
  '#3EACA8',
  '#A2D4AB'
].map(hexToRgb);

export function getNewDatasetColor(datasets: Datasets): RGBColor {
  const presetColors = datasetColors.map(String);
  const usedColors = uniq(Object.values(datasets).map(d => String(d.color))).filter(c =>
    presetColors.includes(c)
  );

  if (usedColors.length === presetColors.length) {
    // if we already depleted the pool of color
    return datasetColorMaker.next().value;
  }

  let color = datasetColorMaker.next().value;
  while (usedColors.includes(String(color))) {
    color = datasetColorMaker.next().value;
  }

  return color;
}

/**
 * Take datasets payload from addDataToMap, create datasets entry save to visState
 */
export function createNewDataEntry(
  {info, data, ...opts}: ProtoDataset,
  datasets: Datasets = {}
): Datasets {
  const validatedData = validateInputData(data);
  if (!validatedData) {
    return {};
  }

  // check if dataset already exists, and update it when loading data by batches incrementally
  if (info && info.id && datasets[info.id]) {
    // get keplerTable from datasets
    const keplerTable = datasets[info.id];
    // update the data in keplerTable
    return UPDATE_TABLE_TASK({table: keplerTable, data: validatedData});
  }

  info = info || {};
  const color = info.color || getNewDatasetColor(datasets);

  return CREATE_TABLE_TASK({
    info,
    color,
    opts,
    data: validatedData
  });
}

async function updateTable({table, data}) {
  const updated = await table.update(data); // Assuming `table` has an `update` method
  return updated;
}

type CreateTableProps = {
  info: any;
  color: RGBColor;
  opts: {
    metadata?: Record<string, unknown>;
  };
  data: any;
};

async function createTable(dataasetInfo: CreateTableProps) {
  const {info, color, opts, data} = dataasetInfo;

  // update metadata for remote tiled datasets
  const refreshedMetadata = await refreshMetadata(dataasetInfo);
  const metadata = refreshedMetadata ? {...opts.metadata, ...refreshedMetadata} : opts.metadata;

  const TableClass = getApplicationConfig().table ?? KeplerTable;
  const table = new TableClass({
    info,
    color,
    ...opts,
    metadata
  });
  await table.importData({data});

  return table;
}
const UPDATE_TABLE_TASK = Task.fromPromise(updateTable, 'UPDATE_TABLE_TASK');
const CREATE_TABLE_TASK = Task.fromPromise(createTable, 'CREATE_TABLE_TASK');

/**
 * Fetch metadata for vector tile layers using tilesetMetadataUrl from metadata
 * @param datasetInfo
 * @returns
 */
async function refreshMetadata(datasetInfo: CreateTableProps) {
  // so far only vector tile layers should refresh metadata
  if (datasetInfo.info.type !== DatasetType.VECTOR_TILE) {
    return null;
  }

  const {type, tilesetMetadataUrl} = datasetInfo.opts.metadata || {};

  if (
    !(type === VectorTileType.PMTILES || type === VectorTileType.MVT) ||
    typeof tilesetMetadataUrl !== 'string'
  ) {
    return null;
  }

  try {
    let rawMetadata: PMTilesMetadata | TileJSON | null = null;
    if (type === VectorTileType.MVT) {
      rawMetadata = await getMVTMetadata(tilesetMetadataUrl);
    } else {
      const tileSource = PMTilesSource.createDataSource(tilesetMetadataUrl, {});
      rawMetadata = await tileSource.metadata;
    }

    if (rawMetadata) {
      return parseVectorMetadata(rawMetadata);
    }
  } catch (err) {
    // ignore for now, and use old metadata?
  }

  return null;
}
