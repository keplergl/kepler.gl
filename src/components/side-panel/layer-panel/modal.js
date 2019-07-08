import React from "react";
import Modal from "react-modal";
import { SketchPicker } from 'react-color';
import styled from 'styled-components';

const customStyles = {
  content: {
    top: "50%",
    left: "40%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-60%, -45%)",
    padding: "0px 0px 0px 0px"
  }
};

const StyledCover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`

export default class SketcherModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

  }

  openModal =() => {
    this.setState({ modalIsOpen: true });
  }

  closeModal=() => {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <div>
        <div
          style={{
            width: "32px",
            height: "18px",
            backgroundColor: "#CDCDCD",
            cursor: "pointer"
          }}
          onClick={this.openModal}>
        </div>

        {this.state.modalIsOpen ?
          <div>
            <StyledCover onClick={this.closeModal} />
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
            >
              <MyPicker />
            </Modal>
          </div>
          : null
        }
      </div>
    );
  }
}

const MyPicker = ({ }) => (
  <SketchPicker
/*     passedStyles={

    } */
    disableAlpha={true}
    presetColors={[]}
  />
)
