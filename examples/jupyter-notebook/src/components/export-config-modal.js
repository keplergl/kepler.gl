// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import styled from 'styled-components';
import Clipboard from 'clipboard';
import {Button, StyledModalContent} from 'kepler.gl/components';
import ClipboardIcon from './clipboard-icon';
import CheckIcon from './check-icon';

// string to replace between js object and python dict
const Params = {
  true: 'True',
  false: 'False',
  null: 'None'
};

const StyledExportConfigSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 0;
  width: 100%;

  .selection {
    flex-grow: 1;

    textarea {
      border: 1px solid ${props => props.theme.selectBorderColorLT};
      background-color: white;
      border-radius: 2px;
      display: inline-block;
      font: inherit;
      line-height: 1.5em;
      padding: 0.5em 3.5em 0.5em 1em;
      margin: 0;
      box-sizing: border-box;
      appearance: none;
      height: 300px;
      width: 100%;
      overflow-y: scroll;
    }
  }
`;

const StyledModalContentInner = styled.div`
  width: 100%;
`;

function ExportConfigModalFactory() {
  return class ExportConfigModal extends Component {
    state = {
      isCopied: false
    };

    componentDidMount() {
      this.clip = new Clipboard('#share-btn');
    }

    componentWillUnmount() {
      this.clip.destroy();
    }

    onClickCopy = () => {
      this.setState({isCopied: true});
      if (typeof this.props.onCopy === 'function') {
        this.props.onCopy();
      }
    };

    // Return string suitable for use in Jupyter-Voyager to configure layers
    _getConfig = () => {
      // replace true => True; false => False; null => None
      const configStr = JSON.stringify(this.props.config, null, 2);
      return configStr.replace(/: ([a-z]+)/g, (_, key) => `: ${Params[key]}` || `: ${key}`);
    }

    render() {
      const {isCopied} = this.state;
      return (
        <div className="export-config-modal">
          <StyledModalContent>
            <StyledModalContentInner className="export-config-modal__inner">
              <Button
                id="share-btn"
                secondary={!isCopied}
                onClick={this.onClickCopy}
                data-clipboard-target="#copyConfig"
              >
                {isCopied ? <CheckIcon height="12px" /> : <ClipboardIcon height="12px" />}
                {isCopied ? 'copied' : 'copy config'}
              </Button>
              <StyledExportConfigSection>
                <div className="selection">
                  <textarea
                    rows="20"
                    id="copyConfig" value={this._getConfig()}/>
                </div>
              </StyledExportConfigSection>
            </StyledModalContentInner>
          </StyledModalContent>
        </div>
      );
    }
  }
}

export default ExportConfigModalFactory;
