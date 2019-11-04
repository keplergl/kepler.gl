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
