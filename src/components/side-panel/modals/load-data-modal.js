import React from 'react';
import styled from 'styled-components';

import FileUpload from 'kepler.gl/components/common/file-uploader/file-upload';

const ContentWraooer = styled.div`
  padding: 10px 96px;
`;

const propTypes = {
  onClose: React.PropTypes.func.isRequired,

  // call backs
  onFileUpload: React.PropTypes.func.isRequired
};

const LoadDataModal = (props) => (
  <ContentWraooer>
    <div className="">
      <FileUpload onFileUpload={props.onFileUpload}/>
    </div>
  </ContentWraooer>
);

LoadDataModal.propTypes = propTypes;

export default LoadDataModal;
