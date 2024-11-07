// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {DraggableAttributes} from '@dnd-kit/core';
import {CSS, Transform} from '@dnd-kit/utilities';
import {ChickletButton} from '../../../common/item-selector/chickleted-input';
import {Hash, Delete, VertDots} from '../../../common/icons';
import DropdownList from '../../../common/item-selector/dropdown-list';
import {FormattedMessage} from '@kepler.gl/localization';
import {TimeLabelFormat, TooltipFields} from '@kepler.gl/types';
import {getFormatValue, getFormatLabels} from '@kepler.gl/utils';
import TippyTooltip from '../../../common/tippy-tooltip';
import {TooltipFormat} from '@kepler.gl/constants';
import useOnClickOutside from '../../../hooks/use-on-click-outside';

interface TooltipChickletProps {
  disabled: boolean;
  item: {name: string};
  displayOption: (item: any) => string;
  remove: any;

  attributes: DraggableAttributes;
  listeners: any;
  setNodeRef: (node: HTMLElement | null) => void;
  transform: Transform | null;
  transition?: string;
  isDragging: boolean;
}

type TooltipConfig = {
  fieldsToShow: {
    [key: string]: {name: string; format: string | null}[];
  };
  compareMode: boolean;
  compareType: string | null;
};

type IconDivProps = {
  status: string | null;
};

const ChickletAddonWrapper = styled.div`
  position: relative;
`;

const ChickletAddon = styled.div`
  margin-right: 4px;
`;

const StyledPopover = styled.div`
  margin-left: -64px;
  position: absolute;
  top: 20px;
  width: 140px;
  z-index: 101;
`;

const hashStyles = {
  SHOW: 'SHOW',
  ACTIVE: 'ACTIVE'
};

const IconDiv = styled.div.attrs({
  className: 'tooltip-chicklet__icon'
})<IconDivProps>`
  color: ${props =>
    props.status === hashStyles.SHOW
      ? props.theme.subtextColorActive
      : props.status === hashStyles.ACTIVE
      ? props.theme.activeColor
      : props.theme.textColor};
`;

type SortableStyledItemProps = {
  transition?: string;
  transform?: string;
};
const SortableStyledItem = styled.div<SortableStyledItemProps>`
  transition: ${props => props.transition};
  transform: ${props => props.transform};
  &.sorting {
    opacity: 0.3;
    pointer-events: none;
  }
  :hover {
    .tooltip-chicklet__drag-handler {
      opacity: 1;
    }
  }
`;

const StyledDragHandle = styled.div.attrs({
  className: 'tooltip-chicklet__drag-handler'
})`
  display: flex;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  margin-left: -5px;
  :hover {
    cursor: move;
    color: ${props => props.theme.tooltipVerticalLineColor};
  }
`;

const StyledTag = styled.span`
  margin-right: 5px;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  max-width: 160px;
`;

function getFormatTooltip(formatLabels: TimeLabelFormat[], format: string | null) {
  if (!format) {
    return null;
  }
  const formatLabel = formatLabels.find(fl => getFormatValue(fl) === format);
  if (formatLabel) {
    return formatLabel.label;
  }
  return typeof format === 'object' ? JSON.stringify(format, null, 2) : String(format);
}

function TooltipChickletFactory(
  dataId: string,
  config: TooltipConfig,
  onChange: (cfg: TooltipConfig) => void,
  fields: TooltipFields[],
  onDisplayFormatChange
): React.FC<TooltipChickletProps> {
  const TooltipChicklet: React.FC<TooltipChickletProps> = (props: TooltipChickletProps) => {
    const {
      disabled,
      item,
      displayOption,
      remove,
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = props;

    const [show, setShow] = useState(false);
    const ref = useOnClickOutside<HTMLDivElement>(() => setShow(false));
    // const {show} = this.state;
    const tooltipField = config.fieldsToShow[dataId].find(
      fieldToShow => fieldToShow.name === item.name
    );
    if (!tooltipField) {
      return null;
    }
    const field = fields.find(f => f.name === tooltipField.name);
    if (!field) {
      return null;
    }
    const formatLabels = getFormatLabels(fields, tooltipField.name);
    const hasFormat = Boolean(field.displayFormat);
    const selectionIndex = formatLabels.findIndex(fl => getFormatValue(fl) === field.displayFormat);
    const hashStyle = show ? hashStyles.SHOW : hasFormat ? hashStyles.ACTIVE : null;

    return (
      <SortableStyledItem
        ref={setNodeRef}
        className={classnames('sortable-layer-items', {sorting: isDragging})}
        transform={CSS.Translate.toString(transform)}
        transition={transition || ''}
        {...attributes}
      >
        <ChickletButton>
          <StyledDragHandle {...listeners}>
            <VertDots height="12px" />
          </StyledDragHandle>
          <StyledTag title={displayOption(item)}>{displayOption(item)}</StyledTag>
          {formatLabels.length > 1 && (
            <ChickletAddonWrapper>
              <TippyTooltip
                placement="top"
                render={() => (
                  <span>
                    {hasFormat ? (
                      getFormatTooltip(formatLabels, field.displayName)
                    ) : (
                      <FormattedMessage id={'fieldSelector.formatting'} />
                    )}
                  </span>
                )}
              >
                <ChickletAddon>
                  <IconDiv status={hashStyle}>
                    <Hash
                      height="8px"
                      onClick={e => {
                        e.stopPropagation();
                        setShow(Boolean(!show));
                      }}
                    />
                  </IconDiv>
                </ChickletAddon>
              </TippyTooltip>
              {show && (
                <StyledPopover ref={ref}>
                  <DropdownList
                    options={formatLabels}
                    selectionIndex={selectionIndex}
                    displayOption={option => (option as TooltipFormat).label}
                    onOptionSelected={(result, e) => {
                      e.stopPropagation();
                      setShow(false);

                      const displayFormat = getFormatValue(result);
                      const oldFieldsToShow = config.fieldsToShow[dataId];
                      const fieldsToShow = oldFieldsToShow.map(fieldToShow => {
                        return fieldToShow.name === tooltipField.name
                          ? {
                              name: tooltipField.name,
                              format: displayFormat
                            }
                          : fieldToShow;
                      });
                      const newConfig = {
                        ...config,
                        fieldsToShow: {
                          ...config.fieldsToShow,
                          [dataId]: fieldsToShow
                        }
                      };
                      onChange(newConfig);
                      onDisplayFormatChange(dataId, field.name, displayFormat);
                    }}
                  />
                </StyledPopover>
              )}
            </ChickletAddonWrapper>
          )}
          <Delete onClick={disabled ? null : remove} />
        </ChickletButton>
      </SortableStyledItem>
    );
  };

  return TooltipChicklet;
}

export default TooltipChickletFactory;
