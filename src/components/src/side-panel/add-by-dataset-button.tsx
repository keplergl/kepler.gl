// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {Datasets} from '@kepler.gl/table';

import Tippy from '@tippyjs/react';
import {Add} from '../common/icons';
import {Button, DatasetSquare} from '../common/styled-components';
import Typeahead from '../common/item-selector/typeahead';
import Accessor from '../common/item-selector/accessor';
import {useIntl} from 'react-intl';
import {RootContext} from '../context';

const DropdownContainer = styled.div.attrs({
  className: 'add-layer-menu-dropdown'
})`
  .list-selector {
    border-top: 1px solid ${props => props.theme.secondaryInputBorderColor};
    width: 100%;
    /* disable scrolling, currently set to 280px internally */
    max-height: unset;
  }
  .list__item > div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    line-height: 18px;
    padding: 0;
    svg {
      margin-right: 10px;
    }
  }
`;

const DropdownMenu = styled.div.attrs({
  className: 'dropdown-menu'
})`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  max-width: 240px;
  position: absolute;
  top: 100%;
  left: -53px;
  z-index: 5;
`;

const ListItemWrapper = styled.div.attrs({
  className: 'dropdown-menu-list-item-wrapper'
})`
  display: flex;
  color: ${props => props.theme.textColor};
  font-size: 11px;
  letter-spacing: 0.2px;
  overflow: auto;
  .dataset-color {
    flex-shrink: 0;
    margin-top: 3px;
  }
  .dataset-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TYPEAHEAD_CLASS = 'typeahead';
const TYPEAHEAD_INPUT_CLASS = 'typeahead__input';

export type AddByDatasetButtonProps = {
  datasets: Datasets;
  onAdd: (dataId: string) => void;
  width: string;
  buttonIntlId: string;
  inactive?: boolean;
  className?: string;
};

const ListItem = ({value}) => (
  <ListItemWrapper>
    <DatasetSquare className="dataset-color" backgroundColor={value.color} />
    <div className="dataset-name" title={value.label}>
      {value.label}
    </div>
  </ListItemWrapper>
);

const AddByDatasetButton: React.FC<AddByDatasetButtonProps> = ({
  datasets,
  onAdd,
  buttonIntlId,
  width,
  className,
  inactive
}) => {
  const [tippyInstance, setTippyInstance] = useState();

  const options = useMemo(() => {
    return Object.values(datasets).map(ds => ({
      label: ds.label,
      value: ds.id,
      color: ds.color
    }));
  }, [datasets]);

  const onClickBtn = useCallback(() => {
    if (options.length === 1) {
      onAdd(options[0].value);
    }

    return;
  }, [options, onAdd]);

  const onOptionSelected = useCallback(
    option => {
      onAdd(option.value);
      if (tippyInstance) {
        // @ts-ignore
        tippyInstance.hide();
      }
    },
    [onAdd, tippyInstance]
  );

  const intl = useIntl();

  const buttonRendered = (
    <Button
      tabIndex={-1}
      className={className || 'add-by-dataset-button'}
      width={width}
      onClick={onClickBtn}
      disabled={!options.length || inactive}
    >
      <Add height="12px" />
      <FormattedMessage id={buttonIntlId} />
    </Button>
  );

  return options.length === 1 ? (
    buttonRendered
  ) : (
    <RootContext.Consumer>
      {context => (
        <Tippy
          trigger="click"
          arrow={false}
          interactive
          placement="bottom"
          appendTo={context?.current || 'parent'}
          // @ts-ignore
          onCreate={setTippyInstance}
          duration={0}
          content={
            <DropdownMenu>
              <DropdownContainer>
                <Typeahead
                  className={TYPEAHEAD_CLASS}
                  customClasses={{
                    results: 'list-selector',
                    input: TYPEAHEAD_INPUT_CLASS,
                    listItem: 'list__item'
                  }}
                  placeholder={intl ? intl.formatMessage({id: 'placeholder.search'}) : 'Search'}
                  selectedItems={null}
                  options={options}
                  displayOption={Accessor.generateOptionToStringFor('label')}
                  filterOption={'label'}
                  searchable
                  onOptionSelected={onOptionSelected}
                  customListItemComponent={ListItem}
                />
              </DropdownContainer>
            </DropdownMenu>
          }
        >
          {buttonRendered}
        </Tippy>
      )}
    </RootContext.Consumer>
  );
};

export default AddByDatasetButton;
