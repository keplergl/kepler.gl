import styled from 'styled-components';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
  restrictToParentElement
} from '@dnd-kit/modifiers';
import {arrayMove} from '@dnd-kit/sortable';

export const DragItem = styled.div`
  color: ${props => props.theme.textColorHl};
  border-radius: ${props => props.theme.radioButtonRadius}px;
  padding: 5px 10px;
  display: inline;
`;

export const DND_MODIFIERS = [restrictToVerticalAxis, restrictToParentElement];
export const DND_EMPTY_MODIFIERS = [];
export const DRAGOVERLAY_MODIFIERS = [restrictToWindowEdges];
export const findDndContainerId = (id, items) =>
  id in items ? id : Object.keys(items).find(key => items[key].includes(id));
export const getLayerOrderOnSort = (layerOrder, dndItems, activeLayerId, overLayerId) => {
  const activeIndex = dndItems.indexOf(activeLayerId);
  const overIndex = dndItems.indexOf(overLayerId);

  return activeIndex === overIndex ? layerOrder : arrayMove(layerOrder, activeIndex, overIndex);
};
