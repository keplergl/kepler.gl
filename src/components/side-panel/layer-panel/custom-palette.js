import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { Button } from 'components/common/styled-components';
import {VertDots, Delete} from 'components/common/icons';
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import onClickOutside from 'react-onclickoutside';
import ColorPalette from './color-palette';
import ColorModal from './modal'

class CustomPalette extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      colors: props.colors,
      showSketcher: false,
      currentSwatchIndex: null,
      showSwatches: true,
      modalIsOpen: false
    }
  }

  _onColorUpdate = (color) => {
    const newColors = [...this.state.colors];
    newColors[this.state.currentSwatchIndex] = color.hex;
    this.setState({
      colors: newColors
    });
  }

  _onColorDelete = (index) => {
    const newColors = [...this.state.colors];
    newColors.splice(index, 1);
    this.setState({
      colors: newColors
    });
  }

  _onColorAdd = () => {
    const newColors = [...this.state.colors];
    newColors.push('#F0F0F0');
    this.setState({
      colors: newColors
    });
  }

  _onSwatchClick = (index) => {
    this.setState({
      showSketcher: !this.state.showSketcher,
      currentSwatchIndex: index
    })
  }

  _onSwatchClose = (index) => {
    this.setState({
      showSketcher: false
    });
  };

  handleClickOutside = e => {
    this.setState({
      showSketcher: false
    });
  };

  _onApply = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onApply({
      name: 'Custom Palette',
      type: null,
      category: 'Uber',
      colors: this.state.colors
    }, event)
  }

  _onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ colors }) => ({
      colors: arrayMove(colors, oldIndex, newIndex)
    }));
  };


  render() {

    return (
      <StyledWrapper>

        <div>
          <ColorPalette
            colors={this.state.colors} />
        </div>

        <ColorModal />
        <ColorModal />

        <SortableContainer className="custom-palette-container"
          onSortEnd={this._onSortEnd}
          lockAxis="y"
          useDragHandle={true}
          >
          {this.state.colors.map((color, index) =>
            <SortableItem
              key={index}
              index={index}>

              <DragHandle className="layer__drag-handle">
                <VertDots height="20px" />
              </DragHandle>

              <StyledSwatch
                color ={color}
                onClick={() => this._onSwatchClick(index)} >
              </StyledSwatch>

              {this.state.showSketcher && this.state.currentSwatchIndex === index ?
              (
                  <div style={{
                    position: "absolute",
                    top: "19px",
                    left: "38px",
                    overflow: "visible",
                    zIndex: "1000"
                  }}>
                    <div style={{
                        position: "fixed",
                        top: "0px",
                        right: "0px",
                        bottom: "0px",
                        left: "0px"
                      }}
                      onClick={this._onSwatchClose}
                  />

                    <SketchPicker
                      color={this.state.colors[this.state.currentSwatchIndex]}
                      presetColors={[]}
                      onChangeComplete={this._onColorUpdate}
                    />
                  </div>
                ) : null
              }

              <StyledHex>
                {color.toUpperCase()}
              </StyledHex>

              <StyledDelete onClick={() => this._onColorDelete(index)}>
                <Delete/>
              </StyledDelete>

            </SortableItem>
            )
          }
        </SortableContainer>

        <Button
          style={{
            float: "left",
            backgroundColor: "transparent",
            marginBottom: "5px"
          }}
          onClick={this._onColorAdd}>
          + Add New Step
        </Button>

        <StyledLine />

        <div
          style={{
            marginTop: "11px"
          }}>

          <Button
            style={{float: "right", backgroundColor:"transparent"}}
              onClick={this._onApply}>Apply
          </Button>
          <Button
            style={{float: "right", backgroundColor:"transparent"}}
              onClick={this.props.onCancel} > Cancel
          </Button>

        </div>

      </StyledWrapper>
    );
  };
}

export default CustomPalette;

// const NewPIcker = listenOnClick(SketchPicker);

const StyledSortableItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  padding-top: 6px;
  padding-bottom: 6px;
  :hover {
    background-color: #3A4552;

    .layer__drag-handle {
      opacity: 1;
    }
  }
`

 const SortableItem = sortableElement(({children}) =>
    <StyledSortableItem>
      {children}
    </StyledSortableItem>
);

const SortableContainer = sortableContainer(({ children }) =>
  (<div>{children}</div>)
);

const StyledDragHandle = styled.div`
  display: flex;
  align-items: center;
  opacity: 0;
  z-index: 1000;

  :hover {
    cursor: move;
    opacity: 1;
    color: ${props => props.theme.textColorHl};
  }
`;

const DragHandle = sortableHandle(({className, children}) =>
  <StyledDragHandle className={className}>
    {children}
  </StyledDragHandle>
);

const StyledWrapper = styled.div`
  color: #F0F0F0;
`

const StyledHex = styled.div`
  color: #F0F0F0;
  font-size: 10px;
  padding-left: 10px;
`

const StyledDelete = styled.div`
  margin-left: auto;
  order: 2;

  :hover {
    cursor: pointer;
  }
`

const StyledButton = styled.button`
  background-color: transparent;
  border-color: transparent;
  color: #fff;
  padding-top: 15px;
`

const StyledLine = styled.div`
  width: 220px;
  height: 1px;
  background-color: #6A7485;
  margin-top: 30px;
  margin-left: 12px;
`

const StyledSwatch = styled.div`
  background-color: ${props => props.color};
  width: 32px;
  height: 18px;
  display: inline-block;
  cursor: pointer;
`

const Sketcher = onClickOutside(SketchPicker)
