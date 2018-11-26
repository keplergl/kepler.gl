import React from 'react';
import ModalDialog from 'kepler.gl/components/common/modal';
import CloudStorage from '../components/sharing/cloud-storage';
import {ThemeProvider} from 'styled-components';
import {themeLT as theme} from 'kepler.gl/styles';

const ExportUrlModal = ({sharing, isOpen, onClose, onExport}) => (
  <ThemeProvider theme={theme}>
    <ModalDialog
      isOpen={isOpen}
      close={onClose}
      title={'Store your map'}
    >
      <CloudStorage
        authTokens={sharing.authTokens}
        isLoading={sharing.isLoading}
        info={sharing.info}
        onExportToDropbox={onExport}
      />
    </ModalDialog>
  </ThemeProvider>
);

export default ExportUrlModal;
