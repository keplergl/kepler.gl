// Copyright (c) 2021 Uber Technologies, Inc.
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
import {FormattedMessage} from 'localization';

import styled from 'styled-components';
import Modal from 'react-modal';
import {Delete} from 'components/common/icons';
import {Button} from 'components/common/styled-components';
import {media} from 'styles/media-breakpoints';

const ModalContentWrapper = styled.div`
  overflow-y: auto;
  max-width: 70vw;
  max-height: 85vh;
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

  ${media.portable`
    padding: 12px 36px 24px;
    max-width: 80vw;
  `}

  ${media.palm`
    max-width: 100vw;
  `}

  ${props => props.cssStyle || ''};
`;

const ModalContent = styled.div`
  position: relative;
  z-index: ${props => props.theme.modalContentZ};
`;

export const ModalTitle = styled.div`
  font-size: ${props => props.theme.modalTitleFontSize};
  color: ${props => props.theme.modalTitleColor};
  margin-bottom: 10px;
  position: relative;
  z-index: ${props => props.theme.modalTitleZ};
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
  z-index: ${props => props.theme.modalFooterZ};
`;

const CloseButton = styled.div`
  color: ${props => props.theme.titleColorLT};
  display: flex;
  justify-content: flex-end;
  z-index: ${props => props.theme.modalButtonZ};
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
  children: 'modal.button.defaultCancel'
};

const defaultConfirmButton = {
  cta: true,
  large: true,
  width: '160px',
  children: 'modal.button.defaultConfirm'
};

export const ModalFooter = ({cancel, confirm, cancelButton, confirmButton}) => {
  const cancelButtonProps = {...defaultCancelButton, ...cancelButton};
  const confirmButtonProps = {...defaultConfirmButton, ...confirmButton};
  return (
    <StyledModalFooter className="modal--footer">
      <FooterActionWrapper>
        <Button className="modal--footer--cancel-button" {...cancelButtonProps} onClick={cancel}>
          <FormattedMessage id={cancelButtonProps.children} />
        </Button>
        <Button className="modal--footer--confirm-button" {...confirmButtonProps} onClick={confirm}>
          <FormattedMessage id={confirmButtonProps.children} />
        </Button>
      </FooterActionWrapper>
    </StyledModalFooter>
  );
};

class ModalDialog extends Component {
  static propTypes = {
    footer: PropTypes.bool,
    close: PropTypes.bool,
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
    close: true,
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
            backgroundColor: (props.theme && props.theme.modalOverlayBgd) || 'rgba(0, 0, 0, 0.5)',
            zIndex: (props.theme && props.theme.modalOverLayZ) || 1000,
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
            <CloseButton className="modal--close" onClick={props.onCancel}>
              <Delete height="14px" />
            </CloseButton>
          )}
          <div>
            {props.title && (
              <ModalTitle className="modal--title">
                <FormattedMessage id={props.title} />
              </ModalTitle>
            )}
            <ModalContent className="modal--body">{props.children}</ModalContent>
            {props.footer && (
              <ModalFooter
                cancel={props.onCancel}
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
    outline: 0;
  }
`;

export default StyledModal;
