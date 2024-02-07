// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useMemo} from 'react';
import styled, {css} from 'styled-components';
import moment from 'moment';
import {SCALE_TYPES, SCALE_FUNC, ALL_FIELD_TYPES, ColorRange} from '@kepler.gl/constants';
import {getTimeWidgetHintFormatter, formatNumber} from '@kepler.gl/utils';
import {isObject} from '@kepler.gl/utils';
import {Reset} from './icons';
import {InlineInput} from './styled-components';
import {HexColor} from '@kepler.gl/types';

const ROW_H = 15;
const GAP = 4;
const RECT_W = 20;

const stopClickPropagation = e => e.stopPropagation();

const inputCss = css`
  input {
    pointer-events: none;
  }
`;
const StyledLegend = styled.div<{disableEdit: boolean}>`
  ${props => props.theme.sidePanelScrollBar};
  max-height: 180px;
  overflow: auto;
  margin-bottom: ${GAP}px;
  display: grid;
  grid-row-gap: ${GAP}px;
  padding: 2px 0;

  ${props => (props.disableEdit ? inputCss : '')}
`;

const defaultFormat = d => d;

const getTimeLabelFormat = domain => {
  const formatter = getTimeWidgetHintFormatter(domain);
  return val => moment.utc(val).format(formatter);
};

const getQuantLabelFormat = (domain, fieldType) => {
  // quant scale can only be assigned to linear Fields: real, timestamp, integer
  return fieldType === ALL_FIELD_TYPES.timestamp
    ? getTimeLabelFormat(domain)
    : !fieldType
    ? defaultFormat
    : n => formatNumber(n, fieldType);
};

const getOrdinalLegends = scale => {
  const domain = scale.domain();
  const labels = scale.domain();
  const data = domain.map(scale);
  return data.map((datum, index) => ({
    data: datum,
    label: labels[index]
  }));
};

const getQuantLegends = (scale, labelFormat) => {
  if (typeof scale.invertExtent !== 'function') {
    return [];
  }

  const labels = scale.range().map(d => {
    const invert = scale.invertExtent(d);
    return `${labelFormat(invert[0])} to ${labelFormat(invert[1])}`;
  });

  const data = scale.range();

  return labels.map((label, index) => ({
    data: data[index],
    label
  }));
};

const StyledLegendRow = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
`;

export function ResetColorLabelFactory() {
  return styled(Reset)`
    color: ${props => props.theme.labelColorLT};
    cursor: pointer;

    :hover {
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

type ColorLegendProps = {
  scaleType: string;
  domain: number[] | string[];
  fieldType?: string | null;
  range?: ColorRange | null;
  labelFormat?: (n: any) => string;
  displayLabel?: boolean;
  disableEdit?: boolean;
  onUpdateColorLegend?: (colorLegends: {[key: HexColor]: string}) => void;
};

ColorLegendFactory.deps = [LegendRowFactory];
function ColorLegendFactory(LegendRow: ReturnType<typeof LegendRowFactory>) {
  const ColorLegend: React.FC<ColorLegendProps> = ({
    domain,
    range,
    labelFormat,
    scaleType,
    fieldType,
    onUpdateColorLegend,
    displayLabel = true,
    disableEdit = false
  }) => {
    const {colorLegends} = range || {};

    const legends = useMemo(() => {
      let currentLegends: any[] = [];
      if (!range) {
        return currentLegends;
      }
      if (Array.isArray(range.colors)) {
        if (!domain || !scaleType) {
          return currentLegends;
        }

        const scaleFunction = SCALE_FUNC[scaleType];
        // color scale can only be quantize, quantile or ordinal
        const scale = scaleFunction().domain(domain).range(range.colors);

        if (scaleType === SCALE_TYPES.ordinal) {
          return getOrdinalLegends(scale);
        }

        const formatLabel = labelFormat || getQuantLabelFormat(scale.domain(), fieldType);

        currentLegends = getQuantLegends(scale, formatLabel);
      }

      if (range.colorLegends && isObject(range.colorLegends)) {
        // override labels with color legends
        const data = Object.keys(range.colorLegends);
        const labels = Object.values(range.colorLegends);

        currentLegends = overrideColorLegends(currentLegends, {data, labels});
      }

      if (Array.isArray(range.colorMap)) {
        const data = range.colorMap.map(cm => cm[1]);
        const labels = range.colorMap.map(cm => cm[0]);

        currentLegends = overrideColorLegends(currentLegends, {data, labels});
      }

      return currentLegends;
    }, [domain, range, labelFormat, scaleType, fieldType]);

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
      <StyledLegend disableEdit={disableEdit}>
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
