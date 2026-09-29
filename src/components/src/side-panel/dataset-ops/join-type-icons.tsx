// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType} from 'react';
import {AttributeJoinType} from '@kepler.gl/table';

import Base, {BaseProps} from '../../common/icons/base';

const SECONDARY = '#F7F8FA';
const ACCENT = '#5558DB';

function JoinTypeIcon({
  className,
  children,
  ...props
}: Partial<BaseProps> & {className: string; children: React.ReactNode}) {
  return (
    <Base viewBox="0 0 20 12" height="20px" predefinedClassName={className} {...props}>
      {children}
    </Base>
  );
}

export const JoinLeftIcon: ComponentType<Partial<BaseProps>> = props => (
  <JoinTypeIcon className="data-ex-icons-join-left" {...props}>
    <circle cx="14" cy="6.125" r="6" fill={SECONDARY} />
    <circle opacity="0.6" cx="6" cy="6.125" r="6" fill={ACCENT} />
  </JoinTypeIcon>
);

export const JoinInnerIcon: ComponentType<Partial<BaseProps>> = props => (
  <JoinTypeIcon className="data-ex-icons-join-inner" {...props}>
    <circle cx="14" cy="6.125" r="6" fill={SECONDARY} />
    <circle cx="6" cy="6.125" r="6" fill={SECONDARY} />
    <path
      opacity="0.8"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 10.5972C11.2275 9.49857 12 7.902 12 6.125C12 4.348 11.2275 2.75143 10 1.65279C8.7725 2.75143 8 4.348 8 6.125C8 7.902 8.7725 9.49857 10 10.5972Z"
      fill={ACCENT}
    />
  </JoinTypeIcon>
);

export const JoinFullIcon: ComponentType<Partial<BaseProps>> = props => (
  <JoinTypeIcon className="data-ex-icons-join-full" {...props}>
    <circle opacity="0.8" cx="14" cy="6.125" r="6" fill={ACCENT} />
    <circle opacity="0.8" cx="6" cy="6.125" r="6" fill={ACCENT} />
  </JoinTypeIcon>
);

export const JOIN_TYPE_ICONS: Record<AttributeJoinType, ComponentType<Partial<BaseProps>>> = {
  LEFT: JoinLeftIcon,
  INNER: JoinInnerIcon,
  FULL: JoinFullIcon
};
