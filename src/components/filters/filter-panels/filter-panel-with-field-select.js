import React, {useCallback, useMemo} from 'react';
import {StyledFilterContent} from 'components/common/styled-components';
import FilterPanelHeaderFactory from 'components/side-panel/filter-panel/filter-panel-header';
import FieldSelector from 'components/common/field-selector';
import PanelHeaderAction from 'components/side-panel/panel-header-action';
import SourceDataSelectorFactory from 'components/side-panel/common/source-data-selector';

FieldPanelWithFieldSelectFactory.deps = [
  FilterPanelHeaderFactory,
  SourceDataSelectorFactory
];

function FieldPanelWithFieldSelectFactory(
  FilterPanelHeader,
  SourceDataSelector
) {
  const FilterPanelWithFieldSelect = React.memo(({
    allAvailableFields,
    children,
    datasets,
    filter,
    idx,
    removeFilter,
    setFilter,
    panelActions = []
  }) => {
    const onFieldSelector = useCallback(field =>
        setFilter(idx, 'name', field.name),
      [idx, setFilter]
    );

    const onSourceDataSelector = useCallback(value =>
        setFilter(idx, 'dataId', value),
      [idx, setFilter]
    );

    const fieldValue = useMemo(() => Array.isArray(filter.name) ?
      filter.name[0] : filter.name,
      [filter.name]
    );

    return (
      <>
        <FilterPanelHeader
          datasets={[datasets[filter.dataId[0]]]}
          allAvailableFields={allAvailableFields}
          idx={idx}
          filter={filter}
          removeFilter={removeFilter}
        >
          <FieldSelector
            inputTheme="secondary"
            fields={allAvailableFields}
            value={fieldValue}
            erasable={false}
            onSelect={onFieldSelector}
          />
          {panelActions && panelActions.map(panelAction => (
            <PanelHeaderAction
              id={panelAction.id}
              onClick={panelAction.onClick}
              tooltip={panelAction.tooltip}
              IconComponent={panelAction.iconComponent}
              active={panelAction.active}
            />
          ))}
        </FilterPanelHeader>
        <StyledFilterContent className="filter-panel__content">
          {Object.keys(datasets).length > 1 && (
            <SourceDataSelector
              inputTheme="secondary"
              datasets={datasets}
              disabled={filter.freeze}
              dataId={filter.dataId}
              onSelect={onSourceDataSelector}
            />
          )}
          {children}
        </StyledFilterContent>
      </>
    )
  });

  FilterPanelWithFieldSelect.displayName = 'FilterPanelWithFieldSelect';

  return FilterPanelWithFieldSelect;
}

export default FieldPanelWithFieldSelectFactory;
