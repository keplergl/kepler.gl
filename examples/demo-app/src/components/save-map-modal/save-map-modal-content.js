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
import {StyledModalContent} from 'kepler.gl/components';

const formInputStyle = (props) => `
  flex: 1 1 auto;
  padding: 10px 12px;
  border: 1px solid #D3D8D6;
  margin-bottom: 36px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 500;
  line-height: 11px;
`;

const StyledSaveMapForm = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.label`
  flex: 1 1 auto;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;

const StyledInput = styled.input`
  ${props => formInputStyle(props)}
`;

const StyledTextarea = styled.textarea`
  ${props => formInputStyle(props)}
`;

const SaveMapModalContent = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}) => {
  return (
    <StyledModalContent className="export-cloud-modal">
      <div style={{width: '100%'}}>
        <StyledSaveMapForm>
          <StyledLabel>Name*</StyledLabel>
          <StyledInput
            type="text"
            value={title}
            placeholder="Type your title"
            onChange={ event => onTitleChange(event.currentTarget.value) }
          />
          <StyledLabel>Description</StyledLabel>
          <StyledTextarea
            placeholder="Type your description"
            maxLength="70"
            value={description}
            onChange={ event => onDescriptionChange(event.currentTarget.value) }
          />
        </StyledSaveMapForm>
      </div>
    </StyledModalContent>
  );
};

export default SaveMapModalContent;
