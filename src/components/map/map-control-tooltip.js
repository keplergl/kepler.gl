import React from 'react';
import {Tooltip} from '..';
import {FormattedMessage} from 'localization';

function MapControlTooltipFactory() {
  /** @type {import('./map-control-tooltip').MapControlTooltipComponent} */
  const MapControlTooltip = React.memo(({id, message}) => (
    <Tooltip id={id} place="left" effect="solid">
      <span>
        <FormattedMessage id={message} />
      </span>
    </Tooltip>
  ));

  MapControlTooltip.displayName = 'MapControlTooltip';

  return MapControlTooltip;
}

export default MapControlTooltipFactory;
