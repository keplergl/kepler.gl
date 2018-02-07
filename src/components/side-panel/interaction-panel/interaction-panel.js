import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Switch from 'components/common/switch';
import RangeSlider from 'components/common/range-slider';
import FieldSelector from 'components/common/field-selector';
import {
  PanelLabel,
  SidePanelSection,
  StyledPanelHeader,
  PanelHeaderTitle,
  PanelHeaderContent,
  PanelContent
} from 'components/common/styled-components';
import {DatasetTag} from '../source-data-catalog';
import {BRUSH_CONFIG} from 'constants/default-settings';

const propTypes = {
  datasets: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  onConfigChange: PropTypes.func.isRequired
};

const StyledPanelContent = PanelContent.extend`
  border-top: 1px solid ${props => props.theme.panelBorderColor};
`;

const StyledInteractionPanel = styled.div`
  padding-bottom: 6px;
`;

export default class InteractionPanel extends Component {
  state = {isConfigActive: false};

  _updateConfig = newProp => {
    this.props.onConfigChange({
      ...this.props.config,
      ...newProp
    });
  };

  _enableConfig = () => {
    this.setState({isConfigActive: !this.state.isConfigActive});
  };

  render() {
    const {config, datasets} = this.props;
    const onChange = newConfig => this._updateConfig({config: newConfig});
    let template = null;

    switch (config.id) {
      case 'tooltip':
        template = (
          <TooltipConfig
            datasets={datasets}
            config={config.config}
            width={this.state.innerPanelWidth}
            onChange={onChange}
          />
        );
        break;

      case 'brush':
        template = <BrushConfig config={config.config} onChange={onChange} />;
        break;

      default:
        break;
    }

    return (
      <StyledInteractionPanel className="interaction-panel">
        <StyledPanelHeader
          className="interaction-panel__header"
          onClick={this._enableConfig}
        >
          <PanelHeaderContent className="interaction-panel__header__content">
            <div className="interaction-panel__header__icon icon">
              <config.iconComponent height="12px"/>
            </div>
            <div className="interaction-panel__header__title">
              <PanelHeaderTitle>{config.id}</PanelHeaderTitle>
            </div>
          </PanelHeaderContent>
          <div className="interaction-panel__header__actions">
            <Switch
              checked={config.enabled}
              id={`${config.id}-toggle`}
              onChange={() => this._updateConfig({enabled: !config.enabled})}
              secondary
            />
          </div>
        </StyledPanelHeader>
        {config.enabled && (
          <StyledPanelContent className="interaction-panel__content">
            {template}
          </StyledPanelContent>
        )}
      </StyledInteractionPanel>
    );
  }
}

InteractionPanel.propTypes = propTypes;

const TooltipConfig = ({config, datasets, width, onChange}) => (
  <div>
    {Object.keys(config.fieldsToShow).map(dataId => (
      <SidePanelSection key={dataId}>
        <DatasetTag dataset={datasets[dataId]} />
        <FieldSelector
          fields={datasets[dataId].fields}
          value={config.fieldsToShow[dataId]}
          onSelect={fieldsToShow => {
            const newConfig = {
              ...config,
              fieldsToShow: {
                ...config.fieldsToShow,
                [dataId]: fieldsToShow.map(d => d.name)
              }
            };
            onChange(newConfig);
          }}
          closeOnSelect={false}
          multiSelect
        />
      </SidePanelSection>
    ))}
  </div>
);

const BrushConfig = ({config, onChange}) => (
  <SidePanelSection>
    <PanelLabel>Brush Radius (km)</PanelLabel>
    <RangeSlider
      range={BRUSH_CONFIG.range}
      value0={0}
      value1={config.size || 10 / 2}
      step={0.1}
      isRanged={false}
      onChange={value => onChange({...config, size: value[1]})}
      inputTheme="secondary"
    />
  </SidePanelSection>
);
