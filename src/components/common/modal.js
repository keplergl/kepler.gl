import React, {Component} from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import {Delete} from 'kepler.gl/components/common/icons';
import {Button} from 'kepler.gl/components/common/styled-components';

const ModalContentWrapper = styled.div`
  width: 60%;
  padding-top: 77px;
  padding-bottom: ${props => (props.footer ? '150px' : '77px')};
  position: absolute;
  top: 92px;
  left: 0;
  right: 0;
  margin-left: auto;
  background-color: #ffffff;
  border-radius: 4px;
  transition: ${props => props.theme.transition};
  min-width: 600px;
  overflow: hidden;
  box-sizing: border-box;
  margin-right: auto;
  font-size: 12px;
  ${props => props.cssStyle || ''};
`;

const CloseButton = styled.div`
  color: ${props => props.theme.titleColorLT};
  display: flex;
  justify-content: flex-end;
  left: 0;
  padding: 24px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10005;

  :hover {
    cursor: pointer;
  }
`;

const ModalTitle = styled.div`
  font-size: ${props => props.theme.modalTitleFontSize};
  color: ${props => props.theme.modalTitleColor};
  margin-bottom: 10px;
  padding: 0 96px;
  position: relative;
  z-index: 10003;
`;

const ModalFooter = styled.div`
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 64px;
  background-color: ${props => props.theme.modalFooterBgd};
  height: 234px;
  position: absolute;
  z-index: 10001;
`;

const ModalContent = styled.div`
  position: relative;
  z-index: 10002;
`;

const FooterActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 96px;
`;

const Footer = ({cancel, confirm}) => (
  <ModalFooter>
    <FooterActionWrapper>
      <Button link large onClick={cancel}>
        Cancel
      </Button>
      <Button large onClick={confirm} width="160px">
        Confirm
      </Button>
    </FooterActionWrapper>
  </ModalFooter>
);

class ModalDialog extends Component {

  render() {
    const {props} = this;
    return (
      <Modal
        {...props}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            overflowY: 'auto',
            position: 'absolute'
          }
        }}
      >
        <ModalContentWrapper cssStyle={props.cssStyle} footer={props.footer}>
          <CloseButton onClick={props.close}>
            <Delete height="14px" />
          </CloseButton>
          {props.title ? <ModalTitle>{props.title}</ModalTitle> : null}
          <ModalContent>{props.children}</ModalContent>
          {props.footer ? (
            <Footer cancel={props.onClose} confirm={props.onConfirm} />
          ) : null}
        </ModalContentWrapper>
      </Modal>
    );
  }
}

const StyledModal = styled(ModalDialog)`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10000;
  transition: ${props => props.theme.transition};
`;

export default StyledModal;
