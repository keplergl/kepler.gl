import {useSelector} from 'react-redux';

import {ActionHandler, createOrUpdateFilter, setFilter, setFilterPlot} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';
import {Filter} from '@kepler.gl/types';
import React, {ReactNode} from 'react';
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
import RangeFilterFactory from 'src/components/src/filters/range-filter';
import {appInjector} from 'src/components/src/container';

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
  filter: Filter;
  filterIdx: number;
  setFilter: ActionHandler<typeof setFilter>;
  setFilterPlot: ActionHandler<typeof setFilterPlot>;
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
  const updatedFilter = updateFilterPlot(datasets, newFilter, datasetId);

  await createOrUpdateFilter(updatedFilter.id, datasetId, selectField?.name, setFilterValue);

  console.log('filters', filters);

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
      filterIdx: filters.length,
      filter: updatedFilter,
      setFilter,
      setFilterPlot
    }
  });
}

const RangeFilterComponent = appInjector.get(RangeFilterFactory);

function FilterMessage({output}: CustomFunctionCall) {
  const outputData = output.data as OutputDataProps;

  const filters = useSelector(state => {
    // @ts-ignore TODO: fix this we need to get the updatedfilters from the visState
    return state.demo.keplerGl.map.visState.filters;
  });

  const filter = filters.find(f => f.id === outputData.filter.id);

  const onSetFilter = value => outputData.setFilter(outputData.filterIdx, 'value', value);

  const onSetFilterPlot = (newProp, valueIndex) => {
    outputData.setFilterPlot(outputData.filterIdx, newProp, valueIndex);
  };

  return (
    <div>
      <RangeFilterComponent
        filter={filter}
        setFilter={onSetFilter}
        setFilterPlot={onSetFilterPlot}
      />
    </div>
  );
}

function filterCallbackMessage(props: CustomFunctionCall): ReactNode | null {
  return <FilterMessage {...props} />;
}
