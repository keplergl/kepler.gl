import React from 'react';
import styled from 'styled-components';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export const StyledInputLabel = styled.label`
  font-size: 12px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => (props.error ? 'red' : props.theme.titleColorLT)};
  height: ${props => props.theme.inputBoxHeight};
  border: 0;
  outline: 0;
  font-size: 14px;

  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

const StyledBtn = styled.button`
  background-color: ${props => props.theme.primaryBtnActBgd};
  color: ${props => props.theme.primaryBtnActColor};
  &:focus {
    outline: none;
  }
`;

const StyleSharingUrl = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 14px;
  flex-direction: column;
`;

const SharingUrl = ({url, message}) => (
  <StyleSharingUrl>
    <StyledInputLabel>{message}</StyledInputLabel>
    <div style={{display: 'flex'}}>
      <StyledInput readOnly type="text" value={url} />
      <CopyToClipboard text={url}>
        <StyledBtn>copy</StyledBtn>
      </CopyToClipboard>
    </div>
  </StyleSharingUrl>
);

export default SharingUrl;
