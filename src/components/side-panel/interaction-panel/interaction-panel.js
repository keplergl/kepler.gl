import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Switch} from '@uber/react-switch';
import RangeSlider from 'components/common/range-slider';
import FieldSelector from 'components/common/field-selector';
import {
  PanelLabel,
  SidePanelSection
} from 'components/common/styled-components';
import {DatasetTag} from '../source-data-catalog';

const propTypes = {
  datasets: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  onConfigChange: PropTypes.func.isRequired
};

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
      <div
        className={classnames('layer-panel', {
          disabled: config.id === 'select',
          active: config.enabled
        })}
      >
        <div
          className="soft-small--sides soft-tiny--ends cursor--pointer
          layer-panel__header no-highlight"
          onClick={this._enableConfig}
          style={{borderLeftWidth: 0}}
        >
          <span
            className={`icon icon_${
              config.icon
            } text-uber-black-60 push-tiny--right`}
          />
          <PanelLabel>{config.id}</PanelLabel>
          <EnableConfig
            config={config}
            onClick={() => this._updateConfig({enabled: !config.enabled})}
          />
        </div>
        {config.enabled && (
          <div className="soft-tiny layer-panel__config">{template}</div>
        )}
      </div>
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
      minValue={0}
      maxValue={10}
      value0={0}
      value1={config.size || 10 / 2}
      step={0.1}
      isRanged={false}
      showInput={true}
      onChange={value => onChange({...config, size: value[1]})}
    />
  </SidePanelSection>
);

export const EnableConfig = ({config, onClick}) => (
  <div className="float--right push-tiny--left display--inline-block flush">
    <Switch
      style={{marginBottom: 0, marginRight: '-10px'}}
      checked={config.enabled}
      id={`${config.id}-toggle`}
      label={config.enabled ? 'on' : 'off'}
      onChange={onClick}
      size="small"
    />
  </div>
);
