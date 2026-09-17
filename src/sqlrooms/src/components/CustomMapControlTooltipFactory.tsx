// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React from 'react';
import {MapControlTooltipFactory} from '@kepler.gl/components';
import {FormattedMessage} from '@kepler.gl/localization';
import {Tooltip, TooltipContent, TooltipTrigger} from '@sqlrooms/ui';

type MapControlTooltipProps = Parameters<ReturnType<typeof MapControlTooltipFactory>>[0];

export const CustomMapControlTooltipFactory = () => {
  const CustomMapControlTooltip = ({message, children}: MapControlTooltipProps) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="border-border overflow-hidden rounded-md border">{children}</div>
      </TooltipTrigger>
      <TooltipContent side="left">
        <FormattedMessage id={message} />
      </TooltipContent>
    </Tooltip>
  );
  return CustomMapControlTooltip;
};
