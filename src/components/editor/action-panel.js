import React from 'react';
import styled from 'styled-components';
import {
  ArrowRight
} from 'components/common/icons';

const StyledItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  
  .item__label {
    margin-left: 8px;
  }
  
  .item__label-nested {
    margin-left: auto;
  }
`;

export const ActionPanelItem = React.memo(({
  className,
  Icon,
  label,
  nested,
  onClick,
  style}) => (
  <StyledItem style={style} className={className} onClick={onClick}>
    {Icon ? (
      <div className="item__label-icon">
        <Icon height="16px"/>
      </div>
      ) : null}
    <span className="item__label">{label}</span>
    {nested ? (
      <div className="item__label-nested">
        <ArrowRight height="16px" />
      </div>
    ) : null}
  </StyledItem>
));

ActionPanelItem.displayName = 'ActionPanelItem';

const StyledActionPanel = styled.div`
  width: 110px;
  display: flex;
  flex-direction: ${props => props.direction};
  box-shadow: ${props => props.theme.dropdownListShadow};
  background-color: ${props => props.theme.dropdownListBgd};
  transition: ${props => props.theme.transitionSlow};
  color: ${props => props.theme.textColor};

  .action-panel-item {
    font-size: 12px;
    line-height: 14px;
    padding: 8px;
    height: 32px;
    text-transform: capitalize;
    
    ${props => props.direction === 'column' ?
      `border-bottom: 1px solid ${props.theme.panelHeaderIcon}`
      :
      `border-right: 1px solid ${props.theme.panelHeaderIcon}`
    }

    :hover {
      cursor: pointer;
      color: ${props => props.theme.textColorHl};
    }
  }
`;

// React compound element https://medium.com/@Dane_s/react-js-compound-components-a6e54b5c9992
const ActionPanel = ({children, className, direction = 'column', onClick}) => (
  <StyledActionPanel className={className} direction={direction}>
    {React.Children.map(children, (child, index) => React.cloneElement(child, {
      onClick: () => {
        if (React.isValidElement(child)) {
          if (child.props.onClick) {
            child.props.onClick(index);
          } else {
            onClick(index);
          }
        }
      },
      className: 'action-panel-item'
    }))}
  </StyledActionPanel>
);

ActionPanel.displayName = 'ActionPanel';

export default ActionPanel;
