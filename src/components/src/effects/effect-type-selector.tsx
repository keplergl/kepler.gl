import React, {useRef, useCallback} from 'react';
import styled from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {addEffect} from '@kepler.gl/actions';

import {Button} from '../common/styled-components';
import {Add} from '../common/icons';
import TippyTooltip from '../common/tippy-tooltip';

export type EffectTypeSelectorProps = {
  options: {type: string; name: string}[];
  onSelect: typeof addEffect;
};

const StyledTippyTooltipContentContainer = styled.div`
  background-color: ${props => props.theme.panelBackgroundHover};
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: -7px -18px; /* compensate for kepler tippy parent padding */
  border-radius: 2px;
  .button {
    width: 100%;
    justify-content: start;
    color: ${props => props.theme.WHITE};
  }
`;

/** @type [number, number] */
const TIPPY_DURATION: [number, number] = [300, 0];
/** @type [number, number] */
const TIPPY_OFFSET: [number, number] = [0, 4];

function EffectTypeSelectorFactory(): React.FC<EffectTypeSelectorProps> {
  const EffectTypeSelector = ({onSelect, options}: EffectTypeSelectorProps) => {
    /** @type any */
    const tippyInstance = useRef(null);

    const render = useCallback(
      () => (
        <StyledTippyTooltipContentContainer>
          {options.map((effectDesc, idx) => {
            return (
              <Button
                key={`${effectDesc.type}-${idx}`}
                onClick={() => {
                  onSelect({config: {type: effectDesc.type}});
                  // @ts-expect-error type current
                  tippyInstance.current?.hide();
                }}
                secondary
              >
                {effectDesc.name}
              </Button>
            );
          })}
        </StyledTippyTooltipContentContainer>
      ),
      [options, tippyInstance, tippyInstance.current, onSelect]
    );

    return (
      <TippyTooltip
        placement="bottom-start"
        offset={TIPPY_OFFSET}
        duration={TIPPY_DURATION}
        trigger="click"
        interactive={true}
        arrow={false}
        hideOnClick={true}
        onTrigger={instance => {
          // @ts-expect-error type current
          tippyInstance.current = instance;
        }}
        zIndex={999} // defaults to 9999; keep it below modals (1000)
        render={render}
      >
        <div>
          <Button className="add-effect-button" secondary>
            <Add height="12px" />
            <FormattedMessage id={'effectManager.addEffect'} />
          </Button>
        </div>
      </TippyTooltip>
    );
  };
  return EffectTypeSelector;
}

export default EffectTypeSelectorFactory;
