// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import uniq from 'lodash/uniq';
import KeplerTable, {Datasets} from './kepler-table';
import {ProtoDataset, RGBColor} from '@kepler.gl/types';
import Task from 'react-palm/tasks';

import {DatasetType, RemoteTileFormat, VectorTileDatasetMetadata} from '@kepler.gl/constants';
import {
  hexToRgb,
  validateInputData,
  datasetColorMaker,
  getApplicationConfig
} from '@kepler.gl/utils';
import {PMTilesSource, PMTilesMetadata} from '@loaders.gl/pmtiles';
import {/* MVTSource,*/ TileJSON} from '@loaders.gl/mvt';

import {getMVTMetadata} from './tileset/tileset-utils';
import {parseVectorMetadata, getFieldsFromTile} from './tileset/vector-tile-utils';

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
): Datasets | null {
  const TableClass = getApplicationConfig().table ?? KeplerTable;
  let dataValidator = validateInputData;
  if (typeof TableClass.getInputDataValidator === 'function') {
    dataValidator = TableClass.getInputDataValidator();
  }

  const validatedData = dataValidator(data);
  if (!validatedData) {
    return null;
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

async function createTable(datasetInfo: CreateTableProps) {
  const {info, color, opts, data} = datasetInfo;

  // update metadata for remote tiled datasets
  const refreshedMetadata = await refreshRemoteData(datasetInfo);
  let metadata = opts.metadata;
  if (refreshedMetadata) {
    metadata = {...opts.metadata, ...refreshedMetadata};
    data.fields = metadata?.fields;
  }

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
async function refreshRemoteData(datasetInfo: CreateTableProps) {
  // so far only vector tile layers should refresh metadata
  if (datasetInfo.info.type !== DatasetType.VECTOR_TILE) {
    return null;
  }

  const {remoteTileFormat, tilesetMetadataUrl, tilesetDataUrl} =
    (datasetInfo.opts.metadata as VectorTileDatasetMetadata) || {};

  if (
    !(remoteTileFormat === RemoteTileFormat.PMTILES || remoteTileFormat === RemoteTileFormat.MVT) ||
    typeof tilesetMetadataUrl !== 'string' ||
    typeof tilesetDataUrl !== 'string'
  ) {
    return null;
  }

  try {
    let rawMetadata: PMTilesMetadata | TileJSON | null = null;
    if (remoteTileFormat === RemoteTileFormat.MVT) {
      rawMetadata = await getMVTMetadata(tilesetMetadataUrl);
    } else {
      const tileSource = PMTilesSource.createDataSource(tilesetMetadataUrl, {});
      rawMetadata = await tileSource.metadata;
    }

    if (rawMetadata) {
      const metadata = parseVectorMetadata(rawMetadata);

      await getFieldsFromTile({
        remoteTileFormat,
        tilesetUrl: tilesetDataUrl,
        metadataUrl: tilesetMetadataUrl,
        metadata
      });

      return metadata;
    }
  } catch (err) {
    // ignore for now, and use old metadata?
  }

  return null;
}
