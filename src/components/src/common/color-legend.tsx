// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled, {css} from 'styled-components';

import {SCALE_TYPES} from '@kepler.gl/constants';
import {Layer} from '@kepler.gl/layers';
import {ColorRange, HexColor, MapState} from '@kepler.gl/types';
import {
  getLayerColorScale,
  getLegendOfScale,
  getVisualChannelScaleByZoom,
  colorMapToCategoricalColorBreaks,
  isObject
} from '@kepler.gl/utils';

import {Reset} from './icons';
import {InlineInput} from './styled-components';

const ROW_H = 15;
const GAP = 2;
const RECT_W = 20;

const stopClickPropagation = e => e.stopPropagation();

const inputCss = css`
  input {
    pointer-events: none;
  }
`;
const StyledLegend = styled.div<{disableEdit: boolean; isExpanded?: boolean}>`
  ${props => props.theme.sidePanelScrollBar};
  ${props => (props.isExpanded ? '' : `max-height: 156px;`)};
  overflow: auto;
  margin-bottom: ${GAP}px;
  display: grid;
  grid-row-gap: ${GAP}px;
  padding: 2px 0;

  ${props => (props.disableEdit ? inputCss : '')}
`;

const StyledLegendRow = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
`;

export function ResetColorLabelFactory() {
  return styled(Reset)`
    color: ${props => props.theme.labelColorLT};
    cursor: pointer;

    &:hover {
      color: ${props => props.theme.panelHeaderIconHover};
    }
  `;
}

const StyleInlineInput = styled(InlineInput)`
  font-size: 9.5px;
  line-height: ${ROW_H}px;
  height: ${ROW_H}px;
  color: ${props => props.theme.textColor};
  width: unset;
  padding: 2px;
  flex: 1;
  margin: 0 ${GAP}px;
  :hover {
    height: ${ROW_H}px;
  }
`;

export type LegendRowEditorProps = {
  color: string;
  label: string;
  customLabel?: string;
  onEdit: (newValue: string) => void;
  disabled?: boolean;
};
export function LegendRowEditorFactory() {
  const LegendRowEditor: React.FC<LegendRowEditorProps> = ({
    color,
    label,
    onEdit,
    disabled = false
  }) => {
    const onChange = useCallback(event => onEdit(event.target.value), [onEdit]);
    return (
      <StyleInlineInput
        type="text"
        className="legend__label__title__editor"
        value={label}
        onClick={stopClickPropagation}
        onChange={onChange}
        disabled={disabled}
        id={`${color}:input-legend-label`}
      />
    );
  };

  LegendRowEditor.displayName = 'LegendRowEditor';
  return LegendRowEditor;
}

const LegendRowStyle = {
  width: `${RECT_W}px`,
  height: `${ROW_H}px`
};

export function LegendColorDisplayFactory() {
  const LegendColorDisplay = ({color}) => {
    const style = useMemo(
      () => ({...LegendRowStyle, backgroundColor: color, marginRight: `${GAP}px`}),
      [color]
    );
    return <div style={style} className="legend-row-color" />;
  };

  return LegendColorDisplay;
}

const StyledLabel = styled.div`
  font-size: 10px;
  color: ${props => props.theme.textColor};
  padding-left: 2px;
`;

export type LegendRowProps = {
  label: string;
  customLabel?: string;
  displayLabel?: boolean;
  color: string;
  onUpdateLabel?: (selectedColor: string, newLabel: string) => void;
  onResetLabel?: (color: string) => void;
  disableEdit?: boolean;
};

LegendRowFactory.deps = [LegendColorDisplayFactory, LegendRowEditorFactory, ResetColorLabelFactory];
export function LegendRowFactory(
  LegendColorDisplay: ReturnType<typeof LegendColorDisplayFactory>,
  LegendRowEditor: ReturnType<typeof LegendRowEditorFactory>,
  ResetColorLabel: ReturnType<typeof ResetColorLabelFactory>
) {
  const LegendRow: React.FC<LegendRowProps> = ({
    label = '',
    displayLabel,
    color,
    onUpdateLabel,
    onResetLabel
  }) => {
    const onEdit = useCallback(
      newLabel => onUpdateLabel && onUpdateLabel(color, newLabel),
      [color, onUpdateLabel]
    );
    const onReset = useCallback(() => onResetLabel && onResetLabel(color), [color, onResetLabel]);
    const value = displayLabel ? label.toString() : '';
    return (
      <StyledLegendRow>
        <LegendColorDisplay color={color} />
        {onUpdateLabel ? (
          <LegendRowEditor disabled={!onUpdateLabel} label={value} color={color} onEdit={onEdit} />
        ) : (
          <StyledLabel>{value}</StyledLabel>
        )}
        {onResetLabel ? <ResetColorLabel onClick={onReset} height="16px" /> : null}
      </StyledLegendRow>
    );
  };
  LegendRow.displayName = 'LegendRow';
  return LegendRow;
}

const overrideColorLegends = (colorLegends, overrides) => {
  const {data, labels} = overrides;

  const newColorLegends = [...colorLegends];

  data.forEach((datum, index) => {
    const currentIndex = colorLegends.findIndex(d => d.data === datum);
    if (currentIndex !== -1) {
      newColorLegends[currentIndex] = {
        label: labels[index],
        data: datum,
        override: true
      };
      newColorLegends[currentIndex].label = labels[index];
    } else {
      newColorLegends.push({
        data: datum,
        label: labels[index],
        override: true
      });
    }
  });

  return newColorLegends;
};

type OverrideByCustomLegendOptions = {
  /**
   * Legend parameters to override
   */
  colorLegends?: Record<string, any>;
  /**
   * Original Legends
   */
  currentLegends?: ReturnType<typeof getLegendOfScale>;
};

/**
 * Overrides legend labels with color legends.
 * @param param0 Legend info and override parameters.
 * @returns Original or overriden lenends.
 */
function overrideByCustomLegend({colorLegends, currentLegends}: OverrideByCustomLegendOptions) {
  if (colorLegends && isObject(colorLegends)) {
    // override labels with color legends
    const data = Object.keys(colorLegends);
    const labels = Object.values(colorLegends);

    return overrideColorLegends(currentLegends, {data, labels});
  }

  return currentLegends;
}

export function useLayerColorLegends(
  layer: ColorLegendProps['layer'],
  scaleType: ColorLegendProps['scaleType'],
  domain: ColorLegendProps['domain'],
  range: ColorLegendProps['range'],
  isFixed: ColorLegendProps['isFixed'],
  fieldType: ColorLegendProps['fieldType'],
  labelFormat: ColorLegendProps['labelFormat'],
  mapState: ColorLegendProps['mapState']
): Legend[] {
  const scale = useMemo(
    () => getLayerColorScale({range, domain, scaleType, isFixed, layer}),
    [range, domain, scaleType, isFixed, layer]
  );

  const scaleByZoom = useMemo(
    () => getVisualChannelScaleByZoom({scale, layer, mapState}),
    [scale, layer, mapState]
  );

  const currentLegends = useMemo(() => {
    if (scaleType === SCALE_TYPES.customOrdinal && range?.colorMap) {
      const colorBreaks = colorMapToCategoricalColorBreaks(range.colorMap);
      return colorBreaks?.map(cb => {
        return {
          data: cb.data,
          label: Array.isArray(cb.label)
            ? cb.label.length > 5
              ? `${cb.label.length} selected`
              : cb.label
            : cb.label || ''
        };
      });
    }
    return getLegendOfScale({scale: scaleByZoom, scaleType, labelFormat, fieldType});
  }, [range, scaleByZoom, scaleType, labelFormat, fieldType]);

  const LegendsWithCustomLegends = useMemo(
    () =>
      overrideByCustomLegend({
        colorLegends: range?.colorLegends,
        currentLegends
      }),
    [range?.colorLegends, currentLegends]
  );

  return LegendsWithCustomLegends || [];
}

export type ColorLegendProps = {
  layer: Layer;
  scaleType: string;
  domain: number[] | string[];
  fieldType?: string | null;
  range?: ColorRange | null;
  labelFormat?: (n: any) => string;
  displayLabel?: boolean;
  disableEdit?: boolean;
  mapState?: MapState;
  isFixed?: boolean;
  isExpanded?: boolean;
  onUpdateColorLegend?: (colorLegends: {[key: HexColor]: string}) => void;
};

export type Legend = {
  data: string;
  label: string;
  override?: boolean;
};

ColorLegendFactory.deps = [LegendRowFactory];
function ColorLegendFactory(LegendRow: ReturnType<typeof LegendRowFactory>) {
  const ColorLegend: React.FC<ColorLegendProps> = ({
    layer,
    isFixed,
    isExpanded,
    domain,
    range,
    labelFormat,
    scaleType,
    fieldType,
    mapState,
    onUpdateColorLegend,
    displayLabel = true,
    disableEdit = false
  }) => {
    const {colorLegends} = range || {};

    const legends = useLayerColorLegends(
      layer,
      scaleType,
      domain,
      range,
      isFixed,
      fieldType,
      labelFormat,
      mapState
    );

    const onUpdateLabel = useCallback(
      (color, newValue) => {
        if (onUpdateColorLegend) {
          onUpdateColorLegend({
            ...colorLegends,
            [color]: newValue
          });
        }
      },
      [onUpdateColorLegend, colorLegends]
    );

    const onResetLabel = useCallback(
      color => {
        /* eslint-disable no-unused-vars */
        // @ts-ignore
        const {[color]: _, ...rest} = colorLegends;
        if (onUpdateColorLegend && rest) {
          onUpdateColorLegend(rest);
        }
        /* eslint-enable no-unused-vars */
      },
      [onUpdateColorLegend, colorLegends]
    );

    return (
      <StyledLegend
        className="styled-color-legend"
        disableEdit={disableEdit}
        isExpanded={isExpanded}
      >
        {legends.map((legend, i) => (
          <LegendRow
            key={`${legend.data}-${i}`}
            label={legend.label}
            displayLabel={displayLabel}
            color={legend.data}
            onUpdateLabel={!disableEdit ? onUpdateLabel : undefined}
            onResetLabel={legend.override && !disableEdit ? onResetLabel : undefined}
          />
        ))}
      </StyledLegend>
    );
  };

  return React.memo(ColorLegend);
}

export default ColorLegendFactory;
