import styled from 'styled-components';

export const Button = styled.div.attrs({
  className: 'kg-button'
})`
  align-items: center;
  background-color: ${props =>
  props.negative
    ? props.theme.negativeBtnBgd
    : props.secondary
    ? props.theme.secondaryBtnBgd
    : props.link ? props.theme.linkBtnBgd : props.theme.primaryBtnBgd};
  border-radius: ${props => props.theme.primaryBtnRadius};
  color: ${props =>
  props.negative
    ? props.theme.negativeBtnColor
    : props.secondary
    ? props.theme.secondaryBtnColor
    : props.link ? props.theme.linkBtnColor : props.theme.primaryBtnColor};
  cursor: pointer;
  display: inline-flex;
  font-size: ${props => (props.large ? '14px' : '11px')};
  font-weight: 500;
  justify-content: center;
  letter-spacing: 0.3px;
  line-height: 14px;
  outline: 0;
  padding: ${props => (props.large ? '14px 32px' : '9px 12px')};
  text-align: center;
  transition: ${props => props.theme.transition};
  vertical-align: middle;
  width: ${props => props.width || 'auto'};

  :hover,
  :focus,
  :active,
  &.active {
    background-color: ${props =>
  props.negative
    ? props.theme.negativeBtnBgdHover
    : props.secondary
    ? props.theme.secondaryBtnBgdHover
    : props.link
      ? props.theme.linkBtnActBgdHover
      : props.theme.primaryBtnBgdHover};
    color: ${props =>
  props.negative
    ? props.theme.negativeBtnActColor
    : props.secondary
    ? props.theme.secondaryBtnActColor
    : props.link
      ? props.theme.linkBtnActColor
      : props.theme.primaryBtnActColor};
  }

  svg {
    margin-right: 8px;
  }
`;
