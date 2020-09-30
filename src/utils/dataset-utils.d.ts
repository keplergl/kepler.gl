
import {Dataset, Datasets, FieldPair} from '../reducers/vis-state-updaters';
import {ProtoDataset} from '../actions';
import {RGBColor} from 'reducers/types';

export function createNewDataEntry(data: ProtoDataset, datasets: Datasets): Datasets

export function getNewDatasetColor(ds: Datasets): RGBColor;

export function findPointFieldPairs(fields: Feild[]): FieldPair[];

export function sortDatasetByColumn(
  dataset: Dataset, 
  column: string, 
  mode?: string
): Dataset

export const datasetColorMaker: Generator<RGBColor>;
