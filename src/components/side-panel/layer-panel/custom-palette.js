import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SketchPicker, CustomPicker} from 'react-color';
import { Button, SidePanelDivider} from 'components/common/styled-components';
import {VertDots, Delete, Trash} from 'components/common/icons';
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import onClickOutside from 'react-onclickoutside';
import ColorPalette from './color-palette';


class CustomPalette extends React.Component {
  static propTypes = {
    customPalette: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        category: PropTypes.string,
        colors: PropTypes.arrayOf(PropTypes.string)
      })
    ,
    setCustomPalette: PropTypes.func
  };

  constructor(props) {
    super(props)
    this.state = {
      showSketcher: false,
      currentSwatchIndex: null,
      showSwatches: true,
      modalIsOpen: false
    }
  }

  _onColorUpdate = (color) => {
    const { colors } = this.props.customPalette;
    const newColors = [...colors];
    newColors[this.state.currentSwatchIndex] = color.hex;
    this.props.setCustomPalette({
      name: 'Custom Palette',
      type: null,
      category: 'Uber',
      colors: newColors
    });
  }

  _onColorDelete = (index) => {
    const { colors } = this.props.customPalette;
    const newColors = [...colors];
    newColors.splice(index, 1);
    this.props.setCustomPalette({
      name: 'Custom Palette',
      type: null,
      category: 'Uber',
      colors: newColors
    });
  }

  _onColorAdd = () => {
    const { colors } = this.props.customPalette;
    const newColors = [...colors];
    newColors.push('#F0F0F0');
    this.props.setCustomPalette({
      name: 'Custom Palette',
      type: null,
      category: 'Uber',
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
    const { colors } = this.props.customPalette['colors'];
    const newColors = [...colors];
    event.stopPropagation();
    event.preventDefault();
    this.props.onApply({
      name: 'Custom Palette',
      type: null,
      category: 'Uber',
      colors: newColors
    }, event)
  }

  _onSortEnd = ({ oldIndex, newIndex }) => {
    const { colors } = this.props.customPalette;
    const newColors = arrayMove(colors, oldIndex, newIndex);
    this.props.setCustomPalette({
      name: 'Custom Palette',
      type: null,
      category: 'Uber',
      colors: newColors
    });
  };


  render() {

    const { colors } = this.props.customPalette;
    return (
      <StyledWrapper>

        <StyledColorRange>
          <ColorPalette
            colors={colors}
          />
        </StyledColorRange>

        <SortableContainer className="custom-palette-container"
          onSortEnd={this._onSortEnd}
          lockAxis="y"
          useDragHandle={true}
          helperClass=""
          >
          {colors.map((color, index) =>
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
                    position: "relative",
                    overflow: "visible",
                    zIndex: "1000"
                  }}>
                    <StyledCover onClick={this._onSwatchClose}/>
                    <div
                      style={{
                        float: "left",
                        position: "absolute",
                        top: "10px",
                        left: "2px"
                      }}
                    >
                    <SketchPicker
                      color={this.props.customPalette['colors'][this.state.currentSwatchIndex]}
                      presetColors={[]}
                      onChangeComplete={this._onColorUpdate}
                      />
                      </div>
                  </div>
                ) : null
              }

              <StyledHex>
                {color.toUpperCase()}
              </StyledHex>

              <StyledTrash onClick={() => this._onColorDelete(index)}>
                <Trash/>
              </StyledTrash>

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

        <StyledButtonContainer>
          <TransparentButton
              onClick={this._onApply}>Confirm
          </TransparentButton>
          <TransparentButton
              onClick={this.props.onCancel} > Cancel
          </TransparentButton>
        </StyledButtonContainer>

      </StyledWrapper>
    );
  };
}

export default CustomPalette;

const StyledSortableItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  padding-top: 6px;
  padding-bottom: 6px;
  z-index: 100;
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
  color: #A0A7B4;
`

const StyledHex = styled.div`
  color: #F0F0F0;
  font-size: 10px;
  padding-left: 10px;
`

const StyledTrash = styled.div`
  height: 12px;
  margin-left: auto;
  order: 2;
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

const StyledColorRange = styled.div`
  padding: 0 8px;
  :hover {
    background-color: ${props => props.theme.panelBackgroundHover};
    cursor: pointer;
  }
`

const TransparentButton = styled(Button)`
  background-color: transparent;
`;

const StyledSketcher = styled(SketchPicker)`
  background-color: black;
  fill: black;
  color: black;
`;

const StyledCover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`

const StyledButtonContainer = styled.div`
  margin-top: 11px;
  display: flex;
  direction: rtl;
`
// const Sketcher = onClickOutside(SketchPicker)

// class MyColorPicker extends React.Component {
//   render() {
//     return <div>MyColorPicker</div>;
//   }
// }
// const NewPIcker = listenOnClick(SketchPicker);
