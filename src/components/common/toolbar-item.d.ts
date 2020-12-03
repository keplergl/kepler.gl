import {ComponentType, FunctionComponent, MouseEvent} from 'react';

export type ToolbarItemProps = {
  id?: string,
  label: string,
  className?: string,
  active?: boolean,
  onClose?: () => void,
  onClick: (event: MouseEvent<HTMLDivElement>) => void,
  icon?: ComponentType<any>
};

export const ToolbarItem: FunctionComponent<ToolbarItemProps>;
export default ToolbarItem;
