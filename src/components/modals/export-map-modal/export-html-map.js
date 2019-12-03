import React from 'react';
import PropTypes from 'prop-types';
import {
  StyledExportSection,
  StyledType
} from 'components/common/styled-components';
import {
  StyledExportMapSection,
  StyledWarning,
  ExportMapLink
} from './components';
import {
  DISCLAIMER,
  EXPORT_HTML_MAP_MODE_OPTIONS,
  TOKEN_MISUSE_WARNING,
  NO_OP
} from 'constants/default-settings';
import {
  GITHUB_EXPORT_HTML_MAP,
  GITHUB_EXPORT_HTML_MAP_MODES
} from 'constants/user-guides';
import styled from 'styled-components';

const ExportMapStyledExportSection = styled(StyledExportSection)`
  .disclaimer {
    font-size: ${props => props.theme.inputFontSize};
    color: ${props => props.theme.inputColor};
    margin-top: 12px;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => props.error ? 'red' : props.theme.titleColorLT};
  height: ${props => props.theme.inputBoxHeight};
  outline: 0;
  font-size: ${props => props.theme.inputFontSize};

  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;

const BigStyledTile = styled(StyledType)`
  height: unset;
  width: unset;
  img {
    width: 180px;
    height: 120px;
  }
`;

const exportHtmlPropTypes = {
  options: PropTypes.object,
  onEditUserMapboxAccessToken: PropTypes.func.isRequired
};

const ExportHtmlMap = React.memo(({
  onChangeExportMapHTMLMode = NO_OP,
  onEditUserMapboxAccessToken = NO_OP,
  options = {}
}) => (
  <div>
    <StyledExportMapSection>
      <div className="description" />
      <div className="selection">
        Export your map into an interactive html file.
      </div>
    </StyledExportMapSection>
    <ExportMapStyledExportSection className="export-map-modal__html-options">
      <div className="description">
        <div className="title">
          Mapbox access token
        </div>
        <div className="subtitle">
          Use your own Mapbox access token in the html (optional)
        </div>
      </div>
      <div className="selection">
        <StyledInput
          onChange={e => onEditUserMapboxAccessToken(e.target.value)}
          type="text"
          placeholder="Paste your Mapbox access token"
          value={options ? options.userMapboxToken : ''}
        />
        <div className="disclaimer">
          <StyledWarning>{TOKEN_MISUSE_WARNING}</StyledWarning>
          <span>{DISCLAIMER}</span>
          <ExportMapLink href={GITHUB_EXPORT_HTML_MAP}>
            How to update an existing map token.
          </ExportMapLink>
        </div>
      </div>
    </ExportMapStyledExportSection>
    <ExportMapStyledExportSection>
      <div className="description">
        <div className="title">
          Map Mode
        </div>
        <div className="subtitle">
          Select the app mode. More <a href={GITHUB_EXPORT_HTML_MAP_MODES}>info</a>
        </div>
      </div>
      <div className="selection">
        {EXPORT_HTML_MAP_MODE_OPTIONS.map(mode =>
          <BigStyledTile
            key={mode.id}
            selected={options.mode === mode.id}
            available={mode.available}
            onClick={() => mode.available && onChangeExportMapHTMLMode(mode.id)}
          >
            <img src={mode.url} alt=""/>
            <p>Allow users to {mode.label} the map</p>
          </BigStyledTile>
        )}
      </div>
    </ExportMapStyledExportSection>
  </div>
));

ExportHtmlMap.propTypes = exportHtmlPropTypes;

const ExportHtmlMapFactory = () => ExportHtmlMap;

export default ExportHtmlMapFactory;

