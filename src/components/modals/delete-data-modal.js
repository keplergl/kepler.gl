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

import React from 'react';
import styled from 'styled-components';
import DatasetLabel from 'components/common/dataset-label';

const StyledMsg = styled.div`
  margin-top: 24px;
`;

export const DeleteDatasetModal = ({dataset = {}, layers = []}) => {
  // retrieve only layers related to the current dataset
  const currDatasetLayers = layers.filter(
    layer => layer.config.dataId === dataset.id
  );

  return (
    <div className="delete-dataset-modal">
      <DatasetLabel dataset={dataset} />
      <StyledMsg className="delete-dataset-msg">
        {`you are going to delete this dataset. It will affect ${currDatasetLayers.length} layers`}
      </StyledMsg>
    </div>
  );
};

const DeleteDatasetModalFactory = () => DeleteDatasetModal;
export default DeleteDatasetModalFactory;
