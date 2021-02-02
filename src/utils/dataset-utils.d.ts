
import {Datasets} from '../reducers/vis-state-updaters';
import {ProtoDataset} from '../actions';
import {RGBColor} from 'reducers/types';

export function createNewDataEntry(data: ProtoDataset, datasets?: Datasets): Datasets

export function getNewDatasetColor(ds: Datasets): RGBColor;

export const datasetColorMaker: Generator<RGBColor>;
