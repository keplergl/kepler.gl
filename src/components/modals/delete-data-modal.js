import React from 'react';
import styled from 'styled-components';
import DatasetLabel from 'components/common/dataset-label';

const StyledMsg = styled.div`
  margin-top: 24px;
`;

const DeleteDatasetModal = ({dataset = {}, layers = []}) => {
  // retrieve only layers related to the current dataset
  const currDatasetLayers = layers.filter(
    layer => layer.config.dataId === dataset.id
  );

  return (
    <div className="delete-dataset-modal">
      <DatasetLabel dataset={dataset} />
      <StyledMsg className="delete-dataset-msg">{`you are going to delete this dataset. It will affect ${
        currDatasetLayers.length
      } layers`}</StyledMsg>
    </div>
  );
};

export const deleteDatasetModalFactory = () => DeleteDatasetModal;
export default DeleteDatasetModal;
