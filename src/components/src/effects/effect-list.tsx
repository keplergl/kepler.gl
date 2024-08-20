// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {CSS} from '@dnd-kit/utilities';
import {useSortable, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';

import {dataTestIds, SORTABLE_EFFECT_TYPE, SORTABLE_EFFECT_PANEL_TYPE} from '@kepler.gl/constants';
import {findById} from '@kepler.gl/utils';
import {Effect} from '@kepler.gl/types';
import {
  addEffect,
  updateEffect,
  removeEffect,
  reorderEffect,
  ActionHandler
} from '@kepler.gl/actions';

import EffectPanelFactory from './effect-panel';

export type EffectListProps = {
  effects: Effect[];
  effectOrder: string[];
  visStateActions: {
    addEffect: ActionHandler<typeof addEffect>;
    updateEffect: ActionHandler<typeof updateEffect>;
    removeEffect: ActionHandler<typeof removeEffect>;
    reorderEffect: ActionHandler<typeof reorderEffect>;
  };
  isSortable: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

type SortableStyledItemProps = {transition?: string; transform?: string};
const SortableStyledItem = styled.div<SortableStyledItemProps>`
  z-index: ${props => props.theme.dropdownWrapperZ + 1};
  transition: ${props => props.transition};
  transform: ${props => props.transform};
  outline: none;
  &.sorting {
    opacity: 0.3;
    pointer-events: none;
  }
  &.sorting-effects .effect-panel__header {
    background-color: ${props => props.theme.panelBackgroundHover};
    font-family: ${props => props.theme.fontFamily};
    font-weight: ${props => props.theme.fontWeight};
    font-size: ${props => props.theme.fontSize};
    line-height: ${props => props.theme.lineHeight};
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    .effect__drag-handle {
      opacity: 1;
      color: ${props => props.theme.textColorHl};
    }
  }
`;

EffectListFactory.deps = [EffectPanelFactory];

function EffectListFactory(
  EffectPanel: ReturnType<typeof EffectPanelFactory>
): React.FC<EffectListProps> {
  const SortableItem = ({effect, idx, panelProps, disabled}) => {
    const {attributes, listeners, setNodeRef, isDragging, transform, transition} = useSortable({
      id: effect.id,
      data: {
        type: SORTABLE_EFFECT_TYPE,
        parent: SORTABLE_EFFECT_PANEL_TYPE
      },
      disabled
    });

    return (
      <SortableStyledItem
        ref={setNodeRef}
        className={classnames(
          {[dataTestIds.sortableEffectItem]: !disabled},
          {[dataTestIds.staticEffectItem]: disabled},
          {sorting: isDragging}
        )}
        data-testid={disabled ? dataTestIds.staticEffectItem : dataTestIds.sortableEffectItem}
        transform={CSS.Transform.toString(transform)}
        transition={transition || ''}
        {...attributes}
      >
        <EffectPanel
          {...panelProps}
          key={effect.id}
          idx={idx}
          effect={effect}
          listeners={listeners}
          isDraggable={!disabled}
        />
      </SortableStyledItem>
    );
  };

  const EffectList = (props: EffectListProps) => {
    const {effects, effectOrder, visStateActions} = props;

    const effectsToShow = useMemo(() => {
      return effectOrder.reduce((acc, effectId) => {
        const effect = findById(effectId)(effects.filter(Boolean));
        if (!effect) {
          return acc;
        }
        return [...acc, effect];
      }, [] as Effect[]);
    }, [effects, effectOrder]);

    const sidePanelDndItems = useMemo(() => {
      return effectsToShow.map(({id}) => id);
    }, [effectsToShow]);

    const panelProps = useMemo(
      () => ({
        effects,
        effectOrder,
        removeEffect: visStateActions.removeEffect,
        updateEffect: visStateActions.updateEffect
      }),
      [effects, effectOrder, visStateActions]
    );

    return (
      <Container>
        <SortableContext
          id={SORTABLE_EFFECT_PANEL_TYPE}
          items={sidePanelDndItems}
          strategy={verticalListSortingStrategy}
          disabled={false}
        >
          {effectsToShow.map(effect => (
            <SortableItem
              key={effect.id}
              effect={effect}
              idx={effects.findIndex(l => l?.id === effect.id)}
              panelProps={panelProps}
              disabled={false}
            />
          ))}
        </SortableContext>
      </Container>
    );
  };
  return EffectList;
}

export default EffectListFactory;
