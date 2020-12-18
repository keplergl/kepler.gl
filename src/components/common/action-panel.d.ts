import {FunctionComponent, PropsWithChildren, ComponentType, CSSProperties} from 'react';

export type ActionPanelItemProps = PropsWithChildren<{
  color?: string,
  className?: string,
  Icon?: ComponentType<any>,
  label: string,
  onClick?: () => void,
  isSelection?: boolean,
  isActive?: boolean,
  style?: CSSProperties
}>;

export const ActionPanelItem: FunctionComponent<ActionPanelItemProps>;

export type ActionPanelProps = PropsWithChildren<{
  color?: string,
  className?: string,
  direction?: string
}>;

export const ActionPanel: FunctionComponent<ActionPanelProps>;

export default ActionPanel;
