import React from 'react';
import styled from 'styled-components';
import {FormattedMessage} from 'localization';
import {IconRoundSmall} from 'components/common/styled-components';
import {Close} from 'components/common/icons';

const StyledMapControlPanel = styled.div`
  background-color: ${props => props.theme.mapPanelBackgroundColor};
  flex-grow: 1;
  z-index: 1;
  p {
    margin-bottom: 0;
  }
`;

const StyledMapControlPanelContent = styled.div.attrs({
  className: 'map-control__panel-content'
})`
  ${props => props.theme.dropdownScrollBar};
  max-height: 500px;
  min-height: 100px;
  min-width: ${props => props.theme.mapControl.width}px;
  overflow: auto;
`;

const StyledMapControlPanelHeader = styled.div.attrs({
  className: 'map-control__panel-header'
})`
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.theme.mapPanelHeaderBackgroundColor};
  height: 32px;
  padding: 6px 12px;
  font-size: 11px;
  color: ${props => props.theme.titleTextColor};
  position: relative;

  button {
    width: 18px;
    height: 18px;
  }
`;

function MapControlPanelFactory() {
  /** @type {import('./map-control-panel').MapControlPanelComponent} */
  const MapControlPanel = React.memo(
    ({children, header, onClick, scale = 1, isExport, logoComponent}) => (
      <StyledMapControlPanel
        style={{
          transform: `scale(${scale})`,
          marginBottom: '8px'
        }}
      >
        <StyledMapControlPanelHeader>
          {isExport && logoComponent ? (
            logoComponent
          ) : header ? (
            <span style={{verticalAlign: 'middle'}}>
              <FormattedMessage id={header} />
            </span>
          ) : null}
          {isExport ? null : (
            <IconRoundSmall className="close-map-control-item" onClick={onClick}>
              <Close height="16px" />
            </IconRoundSmall>
          )}
        </StyledMapControlPanelHeader>
        <StyledMapControlPanelContent>{children}</StyledMapControlPanelContent>
      </StyledMapControlPanel>
    )
  );

  MapControlPanel.displayName = 'MapControlPanel';

  return MapControlPanel;
}

export default MapControlPanelFactory;
