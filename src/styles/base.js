import {css} from 'styled-components';
import {DIMENSIONS} from '../constants/default-settings';

export const transition = 'all .4s ease';

export const boxShadow = '0 1px 2px 0 rgba(0,0,0,0.10)';
export const boxSizing = 'border-box';
export const borderRadius = '1px';
export const borderColor = '#3A414C';
export const borderColorLight = '#F1F1F1';

// TEXT
export const labelColor = '#747576';
export const labelHoverColor = '#C6C6C6';
export const labelColorLT = '#6A7485';

export const textColor = '#A0A7B4';
export const textColorLT = '#3A414C';
export const titleColorLT = '#29323C';

export const subtextColor = '#6A7485';
export const subtextColorLT = '#A0A7B4';

export const textColorHl = '#D3D8E0';
export const activeColor = '#11939A';
export const activeColorHover = '#108188';
export const errorColor = '#CA3B27';
export const errorBgColor = '#FEEFEB';
export const positiveColor = '#629A41';
export const positiveBgColor = '#F3F9ED';

// Button
export const primaryBtnBgd = '#0F9668';
export const primaryBtnActBgd = '#13B17B';
export const primaryBtnColor = '#FFFFFF';
export const primaryBtnActColor = '#FFFFFF';
export const primaryBtnBgdHover = '#13B17B';

export const secondaryBtnBgd = '#6A7485';
export const secondaryBtnActBgd = '#A0A7B4';
export const secondaryBtnColor = '#FFFFFF';
export const secondaryBtnActColor = '#FFFFFF';
export const secondaryBtnBgdHover = '#A0A7B4';

export const linkBtnBgd = 'transparent';
export const linkBtnActBgd = linkBtnBgd;
export const linkBtnColor = '#A0A7B4';
export const linkBtnActColor = '#3A414C';
export const linkBtnActBgdHover = linkBtnBgd;

export const selectColor = textColor;
export const selectColorLT = titleColorLT;

export const selectActiveBorderColor = '#A0A7B4';
export const selectFontSize = '11px';
export const selectFontWeight = '400';
export const selectFontWeightBold = '500';

export const selectColorPlaceHolder = '#747576';
export const selectBackground = '#494949';
export const selectBackgroundHover = '#3E3E3E';
export const selectBackgroundLT = '#FFFFFF';
export const selectBackgroundHoverLT = '#F8F8F9';
export const selectBorderColor = '#717171';
export const selectBorderRadius = '1px';
export const selectBorder = 0;

export const dropdownListHighlightBg = '#717171';

export const panelBackground = '#2E2E2F';
export const panelBackgroundLT = '#f8f8f9';

export const panelActiveBg = '#333334';
export const panelBorderColor = '#3A414C';
export const panelBorder = `1px solid ${borderColor}`;
export const panelBorderLT = `1px solid ${borderColorLight}`;

export const sideNavBg = '#29292A';
export const sidePanelBg = '#232324';

export const inputBoxHeight = '28px';
export const inputPadding = '4px 10px';
export const inputFontSize = '12px';
export const inputFontWeight = 500;

export const mapPanelBackgroundColor = '#242730';
export const mapPanelHeaderBackgroundColor = '#29323C';
export const tooltipBg = '#F8F8F9';
export const tooltipColor = '#333334';

// Modal
export const modalTitleColor = '#3A414C';
export const modalTitleFontSize = '32px';
export const modalFooterBgd = '#F8F8F9';

export const textTruncate = {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordWrap: 'normal'
};

// theme is passed to kepler.gl when it's mounted,
// it is used by styled-components to pass along to
// all child components
const input = css`
  align-items: center;
  background-color: ${props => props.theme.selectBackground};
  border: 1px solid
    ${props =>
      props.active
        ? props.theme.selectActiveBorderColor
        : props.error ? props.theme.errorColor : props.theme.selectBackground};
  caret-color: ${props => props.theme.selectActiveBorderColor};
  color: ${props => props.theme.selectColor};
  display: flex;
  font-size: ${props => props.theme.inputFontSize};
  font-weight: ${props => props.theme.inputFontWeight};
  height: ${props => props.theme.inputBoxHeight};
  justify-content: space-between;
  outline: none;
  overflow: hidden;
  padding: ${props => props.theme.inputPadding};
  text-overflow: ellipsis;
  transition: ${props => props.theme.transition};
  white-space: nowrap;
  width: 100%;
  word-wrap: normal;
  pointer-events: ${props => (props.disabled ? 'none' : 'all')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.selectBackgroundHover};
  }
`;

const dropdownScrollBar = css`
  ::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }
  
  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.selectBackground};
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.selectBackground};
  }
  
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${props => props.theme.labelColor};
    border: 3px solid ${props => props.theme.selectBackground};
  };
  
  :vertical:hover {
    background: ${props => props.theme.selectBackgroundHover};
  }
}`;

const dropdownListAnchor = css`
  color: ${props => props.theme.selectColor};
  padding-left: 3px;
`;

const dropdownListItem = css`
  font-size: 11px;
  padding: 5px 9px;

  &.hover,
  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.dropdownListHighlightBg};
  }
`;

const dropdownListHeader = css`
  font-size: 11px;
  padding: 5px 9px;
  color: ${props => props.theme.labelColor};
`;

const dropdownListSection = css`
  padding: 0 0 4px 0;
  margin-bottom: 4px;
  border-bottom: 1px solid ${props => props.theme.labelColor};
`;

const dropdownList = css`
  overflow-y: overlay;
  max-height: 280px;

  .list__section {
    ${props => props.theme.dropdownListSection};
  }
  .list__header {
    ${props => props.theme.dropdownListHeader};
  }

  .list__item {
    ${props => props.theme.dropdownListItem};
  }

  .list__item__anchor {
    ${props => props.theme.dropdownListAnchor};
  }

  ${props => props.theme.dropdownScrollBar};
`;

const scrollBar = css`
  ::-webkit-scrollbar {
    width: 14px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.sidePanelBg};
  }
  
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${props => props.theme.panelBackground};
    border: 3px solid ${props => props.theme.sidePanelBg}

    ':vertical': {
      background: ${props => props.theme.panelBackground};
    },

    ':vertical:hover': {
      background: ${props => props.theme.selectBackgroundHover};
    }
  }
}`;

export const modalScrollBar = css`
  ::-webkit-scrollbar {
    width: 14px;
    height: 16px;
  }

  ::-webkit-scrollbar-track {
    background: white;
  }
  ::-webkit-scrollbar-track:horizontal {
    background: ${props => props.theme.textColorHl};
  }
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.labelColorLT};
    border: 4px solid white;
  }

  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.textColorHl};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #969da9;
  }

  ::-webkit-scrollbar-thumb:vertical {
    border-radius: 7px;
  }

  ::-webkit-scrollbar-thumb:horizontal {
    border-radius: 9px;
    border: 4px solid ${props => props.theme.textColorHl};
  }
`;

export const theme = {
  ...DIMENSIONS,
  // templates
  input,
  dropdownScrollBar,
  dropdownList,
  dropdownListItem,
  dropdownListAnchor,
  dropdownListHeader,
  dropdownListSection,
  modalScrollBar,
  scrollBar,

  // styles
  activeColor,
  activeColorHover,
  borderRadius,
  boxShadow,
  errorColor,
  dropdownListHighlightBg,
  inputBoxHeight,
  inputPadding,
  inputFontSize,
  inputFontWeight,
  labelColor,
  labelColorLT,
  labelHoverColor,
  mapPanelBackgroundColor,
  mapPanelHeaderBackgroundColor,

  // Panel
  panelActiveBg,
  panelBackground,
  panelBackgroundLT,
  panelBorder,
  panelBorderColor,
  panelBorderLT,

  // Select
  selectActiveBorderColor,
  selectBackground,
  selectBackgroundLT,
  selectBackgroundHover,
  selectBackgroundHoverLT,
  selectBorder,
  selectBorderRadius,
  selectColor,
  selectColorPlaceHolder,
  selectFontSize,
  selectFontWeight,
  selectColorLT,

  // Button
  primaryBtnBgd,
  primaryBtnActBgd,
  primaryBtnColor,
  primaryBtnActColor,
  primaryBtnBgdHover,
  secondaryBtnBgd,
  secondaryBtnActBgd,
  secondaryBtnBgdHover,
  secondaryBtnColor,
  secondaryBtnActColor,
  linkBtnBgd,
  linkBtnActBgd,
  linkBtnColor,
  linkBtnActColor,
  linkBtnActBgdHover,

  // Modal
  modalTitleColor,
  modalTitleFontSize,
  modalFooterBgd,

  sidePanelBg,
  textColor,
  textColorLT,
  textColorHl,
  subtextColor,
  subtextColorLT,
  textTruncate,
  titleColorLT,
  transition,
  tooltipBg,
  tooltipColor
};
