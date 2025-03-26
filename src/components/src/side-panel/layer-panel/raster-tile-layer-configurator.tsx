// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';

import {
  PanelLabel,
  PanelLabelWrapper,
  Input,
  VisConfigSwitch,
  ItemSelector,
  SidePanelSection,

  // factory
  InfoHelperFactory,
  VisConfigSliderFactory,
  LayerConfigGroupFactory,
  Switch
} from '@kepler.gl/components';
import {
  filterAvailablePresets,
  getAvailableMosaics,
  getEOBands,
  getRasterStatisticsMinMax,
  getSingleBandPresetOptions,
  isColormapAllowed,
  isFilterAllowed,
  isRescalingAllowed,
  isSearchableStac,
  CompleteSTACObject,
  DataSourceParams,
  PresetOption,
  RasterTileLayer,
  CATEGORICAL_COLORMAP_ID,
  PRESET_OPTIONS
} from '@kepler.gl/layers';
import {FormattedMessage} from '@kepler.gl/localization';
import {capitalizeFirstLetter} from '@kepler.gl/utils';
import {KeplerTable as KeplerDataset} from '@kepler.gl/table';
import type {StacTypes} from '@kepler.gl/types';

import {getColorMapListItemComponent} from './raster-tile-colormap-list-item';

type EOBand = StacTypes.Band;
const STAC_SEARCH_UI_ENABLED = false;

const StyledVisConfigSwitch = styled.div`
  display: flex;
  justify-content: space-between;

  .vis-config-switch__title {
    display: flex;
  }
`;

// Needed until STAC search is out of beta, then we can go back to standard VisConfigSwitch
const BetaVisConfigSwitch = ({
  layer: {id, config},
  property,
  onChange,
  label,
  disabled
}: {
  layer: RasterTileLayer;
  property: string;
  onChange: (value: any) => void;
  label: string;
  disabled: boolean;
}) => (
  <SidePanelSection disabled={Boolean(disabled)}>
    <StyledVisConfigSwitch className="vis-config-switch">
      <div className="vis-config-switch__title">
        <PanelLabelWrapper>
          {label ? (
            <PanelLabel>
              {(label && <FormattedMessage id={label} />) || capitalizeFirstLetter(property)}
            </PanelLabel>
          ) : null}
        </PanelLabelWrapper>
      </div>
      <div className="vis-config-switch__switch">
        <Switch
          checked={config.visConfig[property]}
          id={`${id}-${property}-switch`}
          onChange={() => onChange({[property]: !config.visConfig[property]})}
        />
      </div>
    </StyledVisConfigSwitch>
  </SidePanelSection>
);

const StyledLayerConfigurator = styled.div`
  margin-top: 12px;
`;

const DescriptionText = styled(PanelLabel)`
  text-transform: none;
  display: inline;
  color: ${props => props.theme.subtextColor};

  a {
    text-decoration: underline;
    margin-left: 4px;
  }
`;

// TODO: combine these two helpers into one
function findVisConfigItemById(layer, prop) {
  return layer.visConfigSettings[prop].options.find(op => op.id === layer.config.visConfig[prop]);
}

function findItemById(layer, options, prop) {
  // For now it's possible that non-raster metadata will be passed to the raster configurator, so
  // options may be null
  return options?.find(op => op.id === layer.config.visConfig[prop]);
}

/**
 * Generate drop down labels for single band selector
 * @param stac - STAC item metadata object
 * @returns array of {id, label} elements
 */
function getBandSelectorOptions(stac: CompleteSTACObject): {id?: string; label?: string}[] {
  const eoBands = getEOBands(stac) || [];
  return eoBands.map((eoBand: EOBand) => ({
    id: eoBand.name,
    label: eoBand.common_name ? `${eoBand.name} (${eoBand.common_name})` : eoBand.name
  }));
}

function getCategoricalColormapListItem(categoricalColorMap) {
  let categoricalItem: {label: string; id: string} | undefined;
  if (categoricalColorMap) {
    categoricalItem = {label: 'Categorical', id: CATEGORICAL_COLORMAP_ID};
  }
  return categoricalItem;
}

/**
 * Check if data source global pixel color range is calculated correctly
 * @param layer - raster layer
 * @param stac - STAC metadata object
 * @param preset - preset name
 * @param singleBandPresetOptions - options for single band preset
 * @returns boolean value
 */
function isDataSourceColorRangeAvailable(
  layer: RasterTileLayer,
  stac: CompleteSTACObject,
  preset: string,
  singleBandPresetOptions: PresetOption['singleBand']
): boolean {
  let minPixelValue: number | null = null;
  let maxPixelValue: number | null = null;
  const dataSourceParams: DataSourceParams | null = layer.getDataSourceParams(stac, preset, {
    singleBand: singleBandPresetOptions
  });
  if (dataSourceParams) {
    minPixelValue = dataSourceParams.minPixelValue;
    maxPixelValue = dataSourceParams.maxPixelValue;
  }
  return minPixelValue !== null && maxPixelValue !== null;
}

type Props = {
  layer: RasterTileLayer;
  visConfiguratorProps: any;
  dataset: KeplerDataset;
};

RasterTileLayerConfiguratorFactory.deps = [
  LayerConfigGroupFactory,
  VisConfigSliderFactory,
  InfoHelperFactory
];

function RasterTileLayerConfiguratorFactory(
  LayerConfigGroup: ReturnType<typeof LayerConfigGroupFactory>,
  VisConfigSlider: ReturnType<typeof VisConfigSliderFactory>,
  InfoHelper: ReturnType<typeof InfoHelperFactory>
): React.FC<Props> {
  /**
   * Wrapper around configurator to check for dataset.metadata being null/undefined
   */
  const STACCheckConfiguratorWrapper = ({layer, visConfiguratorProps, dataset}: Props) => {
    const stac = dataset?.metadata;

    // If no dataset is loaded into Kepler, stac can be undefined
    if (!stac) {
      return null;
    }

    return (
      <RasterTileLayerConfigurator
        layer={layer}
        visConfiguratorProps={visConfiguratorProps}
        dataset={dataset}
      />
    );
  };

  // eslint-disable-next-line complexity
  const RasterTileLayerConfigurator: React.FC<Props> = ({layer, visConfiguratorProps, dataset}) => {
    const {
      preset,
      nonLinearRescaling,
      useSTACSearching,
      colorRange: {colorMap: categoricalColorMap},
      dynamicColor,
      singleBandName
    } = layer.config.visConfig;
    // TODO: This cast is not type safe, and code below will throw if this is inaccurate
    const stac: CompleteSTACObject = dataset?.metadata as any;

    const availablePresets = useMemo(() => filterAvailablePresets(stac, PRESET_OPTIONS), [stac]);
    const availableMosaics = useMemo(() => getAvailableMosaics(stac), [stac]);

    // it's possible that non-raster metadata will be passed to the raster configurator, so availablePresets may be null
    const presetOptions = useMemo(
      () =>
        (
          layer.visConfigSettings.preset.options as unknown as {
            id: string;
            label: string;
          }[]
        ).filter(({id}) => availablePresets?.includes(id)),
      [layer.visConfigSettings.preset.options, availablePresets]
    );
    const singleBandOptions = useMemo(() => getBandSelectorOptions(stac), [stac]);
    const colormapOptions = useMemo(() => {
      const options = [
        ...(layer.visConfigSettings.colormapId.options as unknown as {
          id: string;
          label: string;
        }[])
      ];
      const categoricalListItem = getCategoricalColormapListItem(categoricalColorMap);
      if (categoricalListItem) {
        options.push(categoricalListItem);
      }
      return options;
    }, [layer.visConfigSettings.colormapId.options, categoricalColorMap]);

    const {bandCombination} = PRESET_OPTIONS[preset] || {};
    const colormapAllowed = isColormapAllowed(bandCombination);
    const rescalingAllowed = !categoricalColorMap && isRescalingAllowed(bandCombination);
    const filterAllowed = isFilterAllowed(bandCombination);

    // Here we show the UI when useSTACSearching is explicitly set to true so that the UI shows up
    const stacSearchAllowed = isSearchableStac(stac) || useSTACSearching;

    const selectedColormap =
      findVisConfigItemById(layer, 'colormapId') ||
      getCategoricalColormapListItem(categoricalColorMap);
    const selectedMosaic = findItemById(layer, availableMosaics, 'mosaicId');
    const selectedPreset = findVisConfigItemById(layer, 'preset');
    const selectedSingleBandName = findItemById(layer, singleBandOptions, 'singleBandName');

    const singleBandPresetOptions = getSingleBandPresetOptions(stac, singleBandName);
    const [minCategoricalBandValue, maxCategoricalBandValue] = getRasterStatisticsMinMax(
      stac,
      preset,
      singleBandPresetOptions
    );
    const ColorMapListItem = useMemo(
      () =>
        getColorMapListItemComponent({
          colorMap: categoricalColorMap,
          minValue: minCategoricalBandValue,
          maxValue: maxCategoricalBandValue
        }),
      [categoricalColorMap, minCategoricalBandValue, maxCategoricalBandValue]
    );
    const isDynamicColorsOnly = !isDataSourceColorRangeAvailable(
      layer,
      stac,
      preset,
      singleBandPresetOptions
    );

    // Default of `dynamicColor` is false. Set it true if it is not possible to get data source
    // wide color range
    useEffect(() => {
      if (isDynamicColorsOnly && !dynamicColor) {
        visConfiguratorProps.onChange({dynamicColor: true});
      }
    }, [visConfiguratorProps, dynamicColor, isDynamicColorsOnly]);

    return (
      <StyledLayerConfigurator>
        {availablePresets && (
          <LayerConfigGroup {...visConfiguratorProps} label="Image Selection" collapsible={false}>
            <SidePanelSection>
              <PanelLabelWrapper>
                <PanelLabel>Preset</PanelLabel>
                <InfoHelper
                  id="preset"
                  description="Select a preset to describe how to combine spectral bands."
                />
              </PanelLabelWrapper>
              <ItemSelector
                selectedItems={selectedPreset}
                options={presetOptions}
                multiSelect={false}
                searchable={false}
                displayOption="label"
                getOptionValue="id"
                onChange={val => {
                  visConfiguratorProps.onChange({preset: val});
                }}
              />
              {selectedPreset?.description ? (
                <DescriptionText>
                  {selectedPreset?.description}
                  {selectedPreset?.infoUrl ? (
                    <a target="_blank" rel="noopener noreferrer" href={selectedPreset?.infoUrl}>
                      More Info
                    </a>
                  ) : null}
                </DescriptionText>
              ) : null}
            </SidePanelSection>

            {selectedPreset.id === 'singleBand' && (
              <SidePanelSection>
                <PanelLabelWrapper>
                  <PanelLabel>Single Band Name</PanelLabel>
                  <InfoHelper
                    id={`${layer.id}-single-band-name`}
                    description="Select a single band."
                  />
                </PanelLabelWrapper>
                <ItemSelector
                  selectedItems={selectedSingleBandName}
                  options={singleBandOptions}
                  multiSelect={false}
                  searchable={false}
                  displayOption="label"
                  getOptionValue="id"
                  onChange={val => {
                    visConfiguratorProps.onChange({singleBandName: val});
                  }}
                />
              </SidePanelSection>
            )}

            {STAC_SEARCH_UI_ENABLED && stacSearchAllowed && (
              <BetaVisConfigSwitch
                {...layer.visConfigSettings.useSTACSearching}
                {...visConfiguratorProps}
              />
            )}

            {STAC_SEARCH_UI_ENABLED && (
              <>
                {stacSearchAllowed && useSTACSearching ? (
                  <SidePanelSection>
                    <PanelLabelWrapper>
                      <PanelLabel>STAC Search Provider</PanelLabel>
                    </PanelLabelWrapper>
                    <ItemSelector
                      {...layer.visConfigSettings.stacSearchProvider}
                      selectedItems={findVisConfigItemById(layer, 'stacSearchProvider')}
                      placeholder="Choose a mosaic"
                      multiSelect={false}
                      searchable={false}
                      displayOption="label"
                      getOptionValue="id"
                      onChange={val => {
                        // TODO: check when switching layers so that you don't mismatch allowed mosaics with layers
                        visConfiguratorProps.onChange({stacSearchProvider: val});
                      }}
                    />

                    <PanelLabelWrapper>
                      <PanelLabel>Date Range</PanelLabel>
                    </PanelLabelWrapper>
                    <Input
                      type="text"
                      id={`${layer.id}-startDate`}
                      onChange={({target: {value}}) => {
                        visConfiguratorProps.onChange({startDate: value});
                      }}
                      value={layer.config.visConfig.startDate}
                    />
                    <Input
                      type="text"
                      id={`${layer.id}-endDate`}
                      onChange={({target: {value}}) => {
                        visConfiguratorProps.onChange({endDate: value});
                      }}
                      value={layer.config.visConfig.endDate}
                    />
                    <DescriptionText>Date format must be "YYYY-MM-DD"</DescriptionText>
                  </SidePanelSection>
                ) : (
                  availableMosaics && (
                    <SidePanelSection>
                      <PanelLabelWrapper>
                        <PanelLabel>Mosaic</PanelLabel>
                        <InfoHelper
                          id="mosaic"
                          description="Select a mosaic to choose imagery from a specific time range."
                        />
                      </PanelLabelWrapper>
                      <ItemSelector
                        selectedItems={selectedMosaic}
                        options={availableMosaics}
                        placeholder="Choose a mosaic"
                        multiSelect={false}
                        searchable={false}
                        displayOption="label"
                        getOptionValue="id"
                        onChange={val => {
                          // TODO: check when switching layers so that you don't mismatch allowed mosaics with layers
                          visConfiguratorProps.onChange({mosaicId: val});
                        }}
                      />
                      {selectedMosaic?.description ? (
                        <DescriptionText>{selectedMosaic?.description}</DescriptionText>
                      ) : null}
                    </SidePanelSection>
                  )
                )}
              </>
            )}
          </LayerConfigGroup>
        )}

        <LayerConfigGroup {...visConfiguratorProps} label="Visual Settings" collapsible={false}>
          <VisConfigSlider {...layer.visConfigSettings.opacity} {...visConfiguratorProps} />
          {colormapAllowed && (
            <SidePanelSection>
              <PanelLabel>Colormap</PanelLabel>
              <ItemSelector
                selectedItems={selectedColormap}
                options={colormapOptions}
                multiSelect={false}
                displayOption="label"
                getOptionValue="id"
                onChange={val => {
                  visConfiguratorProps.onChange({colormapId: val});
                }}
                DropDownLineItemRenderComponent={ColorMapListItem}
                filterOption="label"
                searchable
              />
            </SidePanelSection>
          )}
        </LayerConfigGroup>

        {/* Rescaling */}
        {rescalingAllowed && (
          <LayerConfigGroup {...visConfiguratorProps} label="Rescaling">
            <VisConfigSwitch
              {...visConfiguratorProps}
              {...layer.visConfigSettings.dynamicColor}
              disabled={isDynamicColorsOnly}
            />
            <VisConfigSwitch
              {...layer.visConfigSettings.nonLinearRescaling}
              {...visConfiguratorProps}
              label={nonLinearRescaling ? 'Non-Linear Rescaling' : 'Linear Rescaling'}
            />

            {/* TODO: add sliders for red, green, blue, not a single slider */}
            {nonLinearRescaling ? (
              <div>
                <VisConfigSlider
                  {...layer.visConfigSettings.gammaContrastFactor}
                  {...visConfiguratorProps}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.sigmoidalContrastFactor}
                  {...visConfiguratorProps}
                />
                <VisConfigSlider
                  {...layer.visConfigSettings.sigmoidalBiasFactor}
                  {...visConfiguratorProps}
                />
              </div>
            ) : (
              <VisConfigSlider
                {...layer.visConfigSettings.linearRescalingFactor}
                {...visConfiguratorProps}
              />
            )}

            <VisConfigSlider
              {...layer.visConfigSettings.saturationValue}
              {...visConfiguratorProps}
            />
          </LayerConfigGroup>
        )}

        {filterAllowed && (
          <LayerConfigGroup
            {...layer.visConfigSettings.filterEnabled}
            {...visConfiguratorProps}
            collapsible
          >
            <VisConfigSlider {...layer.visConfigSettings.filterRange} {...visConfiguratorProps} />
          </LayerConfigGroup>
        )}

        <LayerConfigGroup {...visConfiguratorProps} label="Terrain">
          <VisConfigSwitch {...visConfiguratorProps} {...layer.visConfigSettings.enableTerrain} />
        </LayerConfigGroup>
      </StyledLayerConfigurator>
    );
  };

  return STACCheckConfiguratorWrapper;
}

export default RasterTileLayerConfiguratorFactory;
