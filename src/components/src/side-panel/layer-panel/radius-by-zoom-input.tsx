// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import classnames from 'classnames';
import React, {useCallback, useState} from 'react';
// @ts-expect-error - react-sortable-hoc libdef does not match true exports
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import styled, {css} from 'styled-components';

import {ZoomStops, ZoomStopsConfig} from '@kepler.gl/types';
import {arrayMove} from '@kepler.gl/common-utils';

import {Icons, Input, PanelLabel, Button} from '../../common';

const SliderInput = styled(Input)`
  width: 48px;
  margin: 0 4px 0 8px;
  font-size: ${props => props.theme.list1Size};
`;

type StyledInputRowProps = {
  isEditing?: boolean;
};

const StyledInputRow = styled.div<StyledInputRowProps>`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  .layer__drag-handle {
    visibility: ${props => (props.isEditing ? 'visible' : 'hidden')};
  }
  .side-panel-panel__label {
    margin-bottom: 0;
    text-transform: none;
  }
`;

type StyledTrashProps = {
  isEditing?: boolean;
};

const StyledTrash = styled.div<StyledTrashProps>`
  color: ${props => props.theme.subtextColor};
  display: flex;
  align-items: center;
  margin-left: 8px;
  visibility: ${props => (props.isEditing ? 'visible' : 'hidden')};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.subtextColorActive};
  }
`;

const StyledDragHandle = styled.div`
  display: flex;
  align-items: center;
  opacity: 0;
`;

const dragHandleActive = css`
  .layer__drag-handle {
    color: ${props => props.theme.textColorHl};
    opacity: 1;
    cursor: move;
  }
`;

const StyledSortableItem = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0;
  z-index: ${props => props.theme.dropdownWrapperZ + 1};
  margin-left: -6px;

  &:not(.sorting) {
    &:hover {
      ${dragHandleActive};
    }
  }

  &.sorting-colors {
    background-color: ${props => props.theme.panelBackgroundHover};
    ${dragHandleActive};
  }
`;

const SortableContainer = sortableContainer(({children}) => <div>{children}</div>);
const DragHandle = sortableHandle(({className, children}) => (
  <StyledDragHandle className={className}>{children}</StyledDragHandle>
));
const SortableItem = sortableElement(({children, isSorting}) => (
  <StyledSortableItem
    className={classnames('custom-palette__sortable-items', {sorting: isSorting})}
  >
    {children}
  </StyledSortableItem>
));

function stringToNumber(val) {
  return val === '' ? null : Number(val);
}

type InputRowProps = {
  idx: number;
  stop: number;
  value: number;
  isSorting: boolean;
  isEditing: boolean;
  onChange: (value: [number | null, number | null]) => void;
  onRemove: () => void;
};
const InputRow: React.FC<InputRowProps> = ({
  idx,
  stop,
  value,
  isSorting,
  isEditing,
  onChange,
  onRemove
}) => {
  return (
    <SortableItem key={idx} index={idx} isSorting={isSorting}>
      <StyledInputRow isEditing={isEditing}>
        <DragHandle className="layer__drag-handle">
          <Icons.VertDots height="20px" />
        </DragHandle>
        <PanelLabel>zoom</PanelLabel>
        <SliderInput
          className="vis-config-zoom__input__stop"
          type="number"
          id={`${idx}-stop`}
          key={`${idx}-stop`}
          value={stop}
          onChange={e => onChange([stringToNumber(e.target.value), value])}
          disabled={!isEditing}
        />
        <SliderInput
          className="vis-config-zoom__input__value"
          type="number"
          id={`${idx}-value`}
          key={`${idx}-value`}
          value={value}
          onChange={e => onChange([stop, stringToNumber(e.target.value)])}
          disabled={!isEditing}
        />
        <PanelLabel>px</PanelLabel>
        <StyledTrash isEditing={isEditing}>
          <Icons.Trash onClick={onRemove} height="16px" />
        </StyledTrash>
      </StyledInputRow>
    </SortableItem>
  );
};

function insertStop(stops: ZoomStops): ZoomStops {
  let newStops: ZoomStops | null = null;
  let i = 0;
  while (!newStops && i < stops.length) {
    if (stops[i][0] + 1 < stops[i + 1][0]) {
      const st = stops[i][0] + 1;
      const value = (stops[i][1] + stops[i + 1][1]) / 2;
      newStops = [...stops.slice(0, i + 1), [st, value], ...stops.slice(i + 1)];
    } else {
      i++;
    }
  }

  if (!newStops) {
    newStops = [
      ...stops.slice(0, i),
      [stops[i][0], (stops[i][1] + stops[i + 1][1]) / 2],
      ...stops.slice(i)
    ];
  }

  return newStops;
}

type VisConfigByZoomInputContainerProps = {
  isEditing?: boolean;
};

const VisConfigByZoomInputContainer = styled.div<VisConfigByZoomInputContainerProps>`
  background-color: ${props => (props.isEditing ? props.theme.AZURE950 : 'transparent')};
  margin: 8px 8px 12px 8px;

  .bottom-action {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .bottom-action.editing {
    justify-content: space-between;
  }
`;

type Props = {
  config: ZoomStopsConfig;
  property: string;
  label: string;
  unit: string;
  onChange: (update: Record<string, ZoomStopsConfig>) => void;
};

const VisConfigByZoomInput: React.FC<Props> = ({config = {}, property, onChange}) => {
  const [stopsState, setStops] = useState(config.stops || []);
  const [isSorting, toggleSorting] = useState(false);
  const [isEditing, toggleEditing] = useState(false);

  const onConfirm = useCallback(() => {
    onChange({
      [property]: {
        ...config,
        stops: stopsState
      }
    });
    toggleEditing(false);
  }, [property, config, stopsState, onChange, toggleEditing]);
  const addStop = useCallback(() => setStops(insertStop(stopsState)), [setStops, stopsState]);
  const removeStop = useCallback(
    i => setStops([...stopsState.slice(0, i), ...stopsState.slice(i + 1)]),
    [setStops, stopsState]
  );
  const onSortEnd = useCallback(
    ({oldIndex, newIndex}) => {
      const newStopsState = arrayMove(stopsState, oldIndex, newIndex);
      setStops(newStopsState);
      toggleSorting(false);
    },
    [stopsState, setStops, toggleSorting]
  );
  const onSortStart = useCallback(() => {
    toggleSorting(true);
  }, [toggleSorting]);

  return (
    <VisConfigByZoomInputContainer isEditing={isEditing}>
      <SortableContainer
        className="custom-palette-container"
        onSortEnd={onSortEnd}
        onSortStart={onSortStart}
        lockAxis="y"
        helperClass="sorting-colors"
        useDragHandle
      >
        {stopsState.map((stop, idx) => (
          <InputRow
            isEditing={isEditing}
            key={`input-${idx}`}
            idx={idx}
            stop={stop[0]}
            value={stop[1]}
            isSorting={isSorting}
            onChange={v => setStops(Object.assign([...(stopsState || [])], {[idx]: v}))}
            onRemove={() => removeStop(idx)}
          />
        ))}
      </SortableContainer>
      {isEditing ? (
        <div className="bottom-action editing">
          <Button secondary onClick={addStop} small>
            <Icons.Add height="16px" /> Add Stop
          </Button>
          <Button onClick={onConfirm} small>
            Confirm
          </Button>
        </div>
      ) : (
        <div className="bottom-action">
          <Button onClick={() => toggleEditing(true)} small>
            Edit
          </Button>
        </div>
      )}
    </VisConfigByZoomInputContainer>
  );
};

export default VisConfigByZoomInput;
