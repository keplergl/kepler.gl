// Copyright (c) 2019 Uber Technologies, Inc.
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

import React, { useState } from 'react';
import styled from 'styled-components';
import {StyledModalContent} from 'kepler.gl/components';
import BackendTile from './BackendTile';
import {BACKEND_PROVIDERS} from '../../utils/backend-providers';

const StyledBackendExportSection = styled.div`
  display: flex;
`;

const StyledSubtitle = styled.div`
  margin-bottom: 36px;
  font-size: 14px;
`;

function useForceUpdate(){
  const [value, setValue] = useState(true);
  return () => setValue(!value);
}

const BackendStorageModalContent = () => {
  const forceUpdate = useForceUpdate();

  return (
    <StyledModalContent className="export-cloud-modal">
      <div style={{width: '100%'}}>
        <StyledSubtitle>
          Connect to your Backend Storage to save your maps privately
        </StyledSubtitle>

        <StyledBackendExportSection>
          {Object.keys(BACKEND_PROVIDERS).map((name, index) => (
            <BackendTile
              key={index}
              Icon={BACKEND_PROVIDERS[name].icon}
              isConnected={BACKEND_PROVIDERS[name].isConnected}
              onConnect={BACKEND_PROVIDERS[name].connect.bind(this, forceUpdate)}
              onManageStorage={BACKEND_PROVIDERS[name].manageStorage}
              onLogout={BACKEND_PROVIDERS[name].logout.bind(this, forceUpdate)}
            />
          ))}
        </StyledBackendExportSection>
      </div>
    </StyledModalContent>
  );
};

export default BackendStorageModalContent;
