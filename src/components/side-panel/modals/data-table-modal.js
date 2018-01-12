import React, {Component} from 'react';
import styled from 'styled-components';
import {navigator} from 'global';

import {ALL_FIELD_TYPES} from '../../../constants/default-settings';
import FieldToken from '../../common/field-token';
import {Clock} from '../../common/icons';
import ReactDataGrid from 'react-data-grid';

let shouldPreventScrollBack = false;

if (window.navigator && window.navigator.userAgent) {
// Detect browsers
// http://stackoverflow.com/questions/5899783/detect-safari-using-jquery
  const isMac = navigator.userAgent.match(/Macintosh/);
  const is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  const is_safari = navigator.userAgent.indexOf("Safari") > -1;
  const is_firefox = navigator.userAgent.indexOf('Firefox') > -1;

// prevent chrome scroll back
  shouldPreventScrollBack = isMac && (is_chrome || is_safari || is_firefox);
}

export function isChrome() {
  // Chrome 1+
  return window.chrome && window.chrome.webstore;
}
const dgSettings = {
  sidePadding: '38px'
};

const DataGridWrapper = styled.div`
  .react-grid-Main {
    outline: 0;
  }

  .react-grid-Grid {
    border: 0;
  }

  .react-grid-Cell {
    border-right: 0;
    border-bottom: ${props => props.theme.panelBorderLT};
    padding-left: 16px;
  }

  .react-grid-HeaderCell {
    border-right: 0;
    border-bottom: 0;
    background: ${props => props.theme.panelBackgroundLT};
    color: ${props => props.theme.titleColorLT};
    padding: 14px 8px 14px 0;
  }
  .react-grid-Cell:first-child,
  .react-grid-HeaderCell:first-child {
    padding-left: ${dgSettings.sidePadding};
  }
  .react-grid-Cell:last-child,
  .react-grid-HeaderCell:last-child {
    padding-right: ${dgSettings.sidePadding};
  }
  .react-grid-Cell__value {
    color: ${props => props.theme.labelColorLT};
  }
  .react-grid-Canvas {
    ${props => props.theme.modalScrollBar};
  }
`;

const BooleanFormatter = ({value}) => <span>{String(value)}</span>;

export default class DataTableModal extends Component {
  _onMouseWheel = (e) => {
    // Prevent futile scroll, which would trigger the Back/Next page event
    // https://github.com/micho/jQuery.preventMacBackScroll
    // This prevents scroll when reaching the topmost or leftmost
    // positions of a container.

    // react-data-grid canvas element can be scrolled
    const canvas = this.refs.root.querySelector('.react-grid-Canvas');

    // If canvas can not be scrolled left anymore when we try to scroll left
    const prevent_left = e.deltaX < 0 && canvas.scrollLeft <= 0;
    // If canvas can not be scrolled up when we try to scroll up
    const prevent_up = e.deltaY < 0 && canvas.scrollTop <= 0;

    if (prevent_left || prevent_up) {
      e.preventDefault();
    }
  }

  render() {
    const {datasets, dataId, showDatasetTable} = this.props;

    if (!datasets || !dataId) {
      return null;
    }

    const activeDataset = datasets[dataId];
    const rows = activeDataset.data;
    const columns = activeDataset.fields
      .map((field, i) => ({
        ...field,
        key: i,
        headerRenderer: <FieldHeader {...field} />,
        resizable: true,
        formatter:
          field.type === ALL_FIELD_TYPES.boolean ? BooleanFormatter : undefined
      }))
      .filter(({name}) => name !== '_geojson');

    return (
      <div ref="root" className="dataset-modal" style={{overflow: 'overlay'}}>
        <DatasetTabs
          activeDataset={activeDataset}
          datasets={datasets}
          showDatasetTable={showDatasetTable}
        />
        <DataGridWrapper
          onWheel={
            shouldPreventScrollBack ? this._onMouseWheel : null
          }
        >
          {ReactDataGrid ? <ReactDataGrid
            headerRowHeight={72}
            columns={columns}
            minColumnWidth={172}
            minWidth={this.props.width}
            minHeight={this.props.height - 65}
            rowGetter={i => rows[i]}
            rowHeight={48}
            rowsCount={rows.length}
          /> : null}
        </DataGridWrapper>
      </div>
    );
  }
}

const tagContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const FieldHeader = ({name, type}) => (
  <div style={tagContainerStyle}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div style={{marginRight: type === 'timestamp' ? '2px' : '18px', height: '16px'}}>
        {type === 'timestamp' ? <Clock height="16px"/> : null}</div>
        {name}
    </div>
    <div style={{marginLeft: '18px'}}>
      <FieldToken type={type}/>
    </div>
  </div>
);

const DatasetCatalog = styled.div`
  display: flex;
  padding: 0 ${dgSettings.sidePadding};
`;

export const DatasetModalTab = styled.div`
  align-items: center;
  border-bottom: 3px solid ${props => (props.active ? 'black' : 'transparent')};
  cursor: pointer;
  display: flex;
  height: 35px;
  margin: 0 3px;
  padding: 0 5px;

  :first-child {
    margin-left: 0;
    padding-left: 0;
  }
`;

const DatasetName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.titleColorLT};
`;

const DatasetColorIcon = styled.div`
  display: inline-block;
  margin-right: 20px;
  height: 10px;
  width: 10px;
  background: rgb(${props => props.color.join(',')});
`;

export const DatasetTabs = ({activeDataset, datasets, showDatasetTable}) => (
  <DatasetCatalog className="dataset-modal-catalog">
    {Object.values(datasets).map(dataset => (
      <DatasetModalTab
        className="dataset-modal-tab"
        active={dataset === activeDataset}
        key={dataset.id}
        onClick={() => showDatasetTable(dataset.id)}
      >
        <DatasetColorIcon className="indicator" color={dataset.color} />
        <DatasetName className="dataset-name">{dataset.label}</DatasetName>
      </DatasetModalTab>
    ))}
  </DatasetCatalog>
);
