import React from 'react';
import styled from 'styled-components';

import FileUpload from 'components/common/file-uploader/file-upload';

const StyledLoadDataModal = styled.div`
  padding: 10px 0;
`;

const propTypes = {
  onClose: React.PropTypes.func.isRequired,

  // call backs
  onFileUpload: React.PropTypes.func.isRequired
};

const LoadDataModal = props => (
  <StyledLoadDataModal>
    <div className="load-data-modal">
      <FileUpload onFileUpload={props.onFileUpload} />
    </div>
  </StyledLoadDataModal>
);

LoadDataModal.propTypes = propTypes;

export default LoadDataModal;

export const loadDataModalFactory = () => LoadDataModal;
