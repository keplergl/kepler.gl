// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import {Tooltip} from 'components/common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';

export type MapControlTooltipProps = {
  id: string;
  message: string;
};

function MapControlTooltipFactory() {
  /** @type {import('./map-control-tooltip').MapControlTooltipComponent} */
  const MapControlTooltip: React.FC<MapControlTooltipProps> = React.memo(({id, message}) => (
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
