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

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import Modal from 'react-modal';
import {Delete} from 'components/common/icons';
import {Button} from 'components/common/styled-components';
import {media} from 'styles/media-breakpoints';

const ModalContentWrapper = styled.div`
  overflow-y: scroll;
  max-width: 960px;
  max-height: 70vh;
  padding: 24px 72px 40px;
  position: relative;
  top: 92px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 4px;
  transition: ${props => props.theme.transition};
  box-sizing: border-box;
  font-size: 12px;
  color: ${props => props.theme.labelColorLT};
  ${props => props.cssStyle || ''};
  ${media.portable`
    padding: 12px 36px 24px;
  `}
`;

const ModalContent = styled.div`
  position: relative;
  z-index: 10002;
`;

export const ModalTitle = styled.div`
  font-size: ${props => props.theme.modalTitleFontSize};
  color: ${props => props.theme.modalTitleColor};
  margin-bottom: 10px;
  position: relative;
  z-index: 10003;
`;

const StyledModalFooter = styled.div`
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 24px;
  ${media.portable`
    padding-top: 24px;  
  `};
  
  ${media.palm`
    padding-top: 16px;
  `};
  z-index: 10001;
`;

const CloseButton = styled.div`
  color: ${props => props.theme.titleColorLT};
  display: flex;
  justify-content: flex-end;
  z-index: 10005;
  position: absolute;
  top: 24px;
  right: 24px;

  :hover {
    cursor: pointer;
  }
`;

const FooterActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const defaultCancelButton = {
  link: true,
  large: true,
  children: 'Cancel'
};

const defaultConfirmButton = {
  large: true,
  width: '160px',
  children: 'Confirm'
};

export const ModalFooter = ({
  cancel,
  confirm,
  cancelButton,
  confirmButton
}) => {
  const cancelButtonProps = {...defaultCancelButton, ...cancelButton};
  const confirmButtonProps = {...defaultConfirmButton, ...confirmButton};
  return (
    <StyledModalFooter className="modal--footer">
      <FooterActionWrapper>
        <Button {...cancelButtonProps} onClick={cancel}>
          {cancelButtonProps.children}
        </Button>
        <Button {...confirmButtonProps} onClick={confirm}>
          {confirmButtonProps.children}
        </Button>
      </FooterActionWrapper>
    </StyledModalFooter>
  );
};

class ModalDialog extends Component {
  static propTypes = {
    footer: PropTypes.bool,
    close: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    confirmButton: PropTypes.object,
    confirmButtonLabel: PropTypes.string,
    cancelButton: PropTypes.object,
    cancelButtonLabel: PropTypes.string,
    cssStyle: PropTypes.arrayOf(PropTypes.any)
  };

  static defaultProps = {
    footer: false,
    close: () => {},
    onConfirm: () => {},
    onCancel: () => {},
    cancelButton: defaultCancelButton,
    confirmButton: defaultConfirmButton,
    cssStyle: []
  };

  render() {
    const {props} = this;
    return (
      <Modal
        className={this.props.className}
        {...props}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            // in case we want to override the modal dialog style
            ...props.style
          }
        }}
      >
        <ModalContentWrapper
          className="modal--wrapper"
          cssStyle={props.cssStyle}
          footer={props.footer}
        >
          {props.close && (
            <CloseButton className="modal--close" onClick={props.close}>
              <Delete height="14px" />
            </CloseButton>
          )}
          <div>
            {props.title && (
              <ModalTitle className="modal--title">{props.title}</ModalTitle>
            )}
            <ModalContent className="modal--body">{props.children}</ModalContent>
            {props.footer && (
              <ModalFooter
                cancel={props.close}
                confirm={props.onConfirm}
                cancelButton={props.cancelButton}
                confirmButton={props.confirmButton}
              />
            )}
          </div>

        </ModalContentWrapper>
      </Modal>
    );
  }
}

const StyledModal = styled(ModalDialog)`
  top: 0;
  left: 0;
  z-index: 10000;
  transition: ${props => props.theme.transition};
  padding-left: 40px;
  padding-right: 40px; 

  ${media.portable`
    padding-left: 24px;
    padding-right: 24px; 
  `};
  
  ${media.palm`
    padding-left: 0;
    padding-right: 0;
  `};

  :focus {
    outline: 0
  }
`;

export default StyledModal;
