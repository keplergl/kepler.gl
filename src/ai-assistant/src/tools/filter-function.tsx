// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useSelector} from 'react-redux';

import {ActionHandler, createOrUpdateFilter, setFilter, setFilterPlot} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';
import {Filter} from '@kepler.gl/types';
import React, {ReactNode, useEffect} from 'react';
import {
  CallbackFunctionProps,
  CustomFunctionCall,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps
} from 'react-ai-assist';
import {checkDatasetNotExists, checkFieldNotExists} from './utils';
import {getDefaultFilter, getFilterProps, updateFilterPlot} from '@kepler.gl/utils';
import {RangeFilterFactory, appInjector} from '@kepler.gl/components';

export function filterFunctionDefinition(
  context: CustomFunctionContext<
    | Datasets
    | Filter[]
    | ActionHandler<typeof createOrUpdateFilter>
    | ActionHandler<typeof setFilter>
    | ActionHandler<typeof setFilterPlot>
  >
): RegisterFunctionCallingProps {
  return {
    name: 'filter',
    description: 'filter data by a field and value',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset to filter. If not provided, use the first dataset or ask user to select or upload a dataset.'
      },
      field: {
        type: 'string',
        description: 'The field to filter by'
      },
      value: {
        type: 'string',
        description: 'The value to filter by'
      },
      valueRange: {
        type: 'array',
        items: {
          type: 'string'
        },
        description:
          'The range of values to filter by. It could be a pair of min and max values, or multiple unique string values.'
      }
    },
    required: ['datasetName', 'field'],
    callbackFunction: filterCallback,
    callbackFunctionContext: context,
    callbackMessage: filterCallbackMessage
  };
}

type FilterCallbackArgs = {
  datasetName: string;
  field: string;
  value?: unknown;
  valueRange?: unknown[];
};

type FilterCallbackContext = {
  datasets: Datasets;
  filters: Filter[];
  createOrUpdateFilter: ActionHandler<typeof createOrUpdateFilter>;
  setFilter: ActionHandler<typeof setFilter>;
  setFilterPlot: ActionHandler<typeof setFilterPlot>;
};

type OutputResultProps =
  | ErrorCallbackResult
  | {
      success: boolean;
      datasetId: string;
      filterId: string;
      range?: number[];
      value?: string | number;
      details: string;
    };

type OutputDataProps = {
  datasetId: string;
  fieldName: string;
  filter: Filter;
  filterIdx: number;
  setFilter: ActionHandler<typeof setFilter>;
  setFilterPlot: ActionHandler<typeof setFilterPlot>;
  createOrUpdateFilter: ActionHandler<typeof createOrUpdateFilter>;
};

type FilterCallbackOutput = CustomFunctionOutputProps<OutputResultProps, OutputDataProps>;

async function filterCallback({
  functionName,
  functionArgs,
  functionContext
}: CallbackFunctionProps): Promise<FilterCallbackOutput> {
  const {datasetName, field, value, valueRange} = functionArgs as FilterCallbackArgs;
  const {datasets, filters, createOrUpdateFilter, setFilter, setFilterPlot} =
    functionContext as FilterCallbackContext;

  // check if dataset exists
  const datasetError = checkDatasetNotExists(datasets, datasetName, functionName);
  const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
  if (datasetError || !datasetId) {
    return Promise.resolve(datasetError as FilterCallbackOutput);
  }

  const dataset = datasets[datasetId];

  // check if field exists
  const fieldError = checkFieldNotExists(dataset, field, functionName);
  const selectField = dataset.fields.find(f => f.name === field);
  if (fieldError || !selectField) {
    return Promise.resolve(fieldError as FilterCallbackOutput);
  }

  let filterValue = value;
  let filterRange = valueRange;

  if (selectField?.type === 'integer' || selectField?.type === 'real') {
    filterValue = Number(value);
    filterRange = valueRange?.map(Number);
  } else if (selectField?.type === 'string') {
    filterValue = `${value}`;
    filterRange = valueRange?.map(v => `${v}`);
  }
  // TODO: add support for other field types like date, boolean, etc.
  const setFilterValue = filterValue || filterRange || null;
  const newFilter = {
    ...getDefaultFilter({dataId: datasetId}),
    ...getFilterProps(selectField, dataset.getColumnFilterDomain(selectField)),
    value: setFilterValue,
    fieldIndex: selectField.fieldIdx
  };
  // update the filter plot, so we can render the filter in the filter message component
  const updatedFilter = updateFilterPlot(datasets, newFilter, datasetId);

  // create filter only and apply the filter value later in the filter message component
  // await createOrUpdateFilter(updatedFilter.id, datasetId, selectField?.name);

  return Promise.resolve({
    type: 'filter',
    name: functionName,
    result: {
      success: true,
      datasetId,
      filterId: updatedFilter.id,
      ...(filterRange ? {range: filterRange} : {}),
      ...(filterValue ? {value: filterValue} : {}),
      details: `Filter created successfully for the dataset and field ${field}`
    },
    data: {
      datasetId,
      fieldName: selectField.name,
      filterIdx: filters.length,
      filter: updatedFilter,
      setFilter,
      setFilterPlot,
      createOrUpdateFilter
    }
  });
}

const RangeFilterComponent = appInjector.get(RangeFilterFactory);

function FilterMessage({output}: CustomFunctionCall) {
  const outputData = output.data as OutputDataProps;

  // run this when the component is mounted
  useEffect(() => {
    outputData.createOrUpdateFilter(
      outputData.filter.id,
      outputData.datasetId,
      outputData.fieldName,
      outputData.filter.value
    );
  }, [outputData, outputData.filter]);

  const filters = useSelector(state => {
    // @ts-ignore TODO: fix this: we need to get the updated filters from the visState, but nicely
    return state.demo.keplerGl.map.visState.filters;
  });

  const filter = filters.find(f => f.id === outputData.filter.id);

  const onSetFilter = value => outputData.setFilter(outputData.filterIdx, 'value', value);

  const onSetFilterPlot = (newProp, valueIndex) => {
    outputData.setFilterPlot(outputData.filterIdx, newProp, valueIndex);
  };

  return (
    filter && (
      <div>
        <RangeFilterComponent
          filter={filter}
          setFilter={onSetFilter}
          setFilterPlot={onSetFilterPlot}
        />
      </div>
    )
  );
}

function filterCallbackMessage(props: CustomFunctionCall): ReactNode | null {
  return <FilterMessage {...props} />;
}
