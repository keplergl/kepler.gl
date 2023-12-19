// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ReactElement, JSXElementConstructor} from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import TippyTooltip from '../common/tippy-tooltip';

export type MapControlTooltipProps = {
  id: string;
  message: string;
  children?: ReactElement<any, string | JSXElementConstructor<any>>;
};

function MapControlTooltipFactory() {
  const MapControlTooltip: React.FC<MapControlTooltipProps> = React.memo(
    ({id, message, children}) => (
      <TippyTooltip
        placement="left"
        render={() => (
          <div id={id}>
            <FormattedMessage id={message} />
          </div>
        )}
      >
        {children}
      </TippyTooltip>
    )
  );

  MapControlTooltip.displayName = 'MapControlTooltip';

  return MapControlTooltip;
}

export default MapControlTooltipFactory;
