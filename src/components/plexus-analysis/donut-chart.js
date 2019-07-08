
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {createSelector} from 'reselect';
import {format} from 'd3-format';

import {
  SCALE_TYPES,
  SCALE_FUNC,
  ALL_FIELD_TYPES
} from 'constants/default-settings';
import {RadialChart, Hint} from 'react-vis';

const DonutPanel = styled.div `
  display: flex;
  flex-direction: column;
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;

  .control-panel-item {
    margin-top: 12px 0 8px 0;
  }

  .control-panel-item:nth-child(2) {
    display: flex;
    justify-content: flex-end;
  }

  p {
    color: ${props => props.theme.labelColor};
    margin: 0;
  }

  .control-panel__title{
    font-weight: 500;
    color: ${props => props.theme.labelColor};
    font-size: 1.2em;
    font-weight:500;    
  }
`;

export class DonutChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: null,
    }
  }


  render() {
    const {
      data, 
      activeIndicator,
      title,
      legends,
      values,
      xLabel,
      xKeyArr
    } = this.props;

    let pData;
    let aData = [0,0,0,0,0,0];
    
    // console.log('donut-chart data ' + activeIndicator);
    // console.log(pData);
    // console.log(aData);
    // console.log(data);
    // console.log(activeIndicator);
    
    if(legends) {
      pData = legends.data.map((d, idx) => ({
        angle: 0,
        color: d,
      })) ;

      // console.log('donut-chart data 2 ' + activeIndicator);
      // console.log(pData);
      // console.log(aData);

      for(var i=0; i<data.length; i++) {
          for(var j=0; j<legends.data.length; j++) {
              if(data[i][activeIndicator] >= legends.labels[j].low && data[i][activeIndicator] <= legends.labels[j].high) {
                  pData[j].angle = pData[j].angle+1;
                  aData[j]++;
                  break;
              }
          }
      }

      // console.log('donut-chart data 3 ' + activeIndicator);
      // console.log(pData);
      // console.log(aData);
    } else if(values && xLabel) {
      
      pData = values.map((d) => ({
        angle: d[xLabel],
        value: d[xLabel],
      }));
      // console.error('donut');
      // console.error(pData);
    } else if(values && xKeyArr) {
      pData = [];
      let inserted = {};
      xKeyArr.forEach((x) => {
        // console.error(x);
        // console.error(values);
        values.forEach(d => {
          // let key = x
          // console.error(d);
          if(x.name in inserted) {
            pData.filter(a=>a.label==x.name)[0].angle += d[x.name];
          } else {
            inserted[x.name] = 0;
            pData.push({
              label: x.name,
              value: d[x.name],
              angle: d[x.name],
            });
          }
        });
      });
      // console.error(values);
      // console.error(pData);
    }
    

    return (
      <DonutPanel>
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">{title}</p>            
          </div>
        </ControlPanel>
        <RadialChart 
          animation
          data={pData} 
          innerRadius={50}
          radius={70}
          width={280} 
          height={170} 
          colorType={legends?"literal":"category"}
          onValueMouseOver={v => {console.error('radial over');console.error(v);this.setState({hovered: v})}}
          onSeriesMouseOut={v => this.setState({hovered: null})}
          >
            {this.state.hovered && (
              <Hint
                // xType="literal"
                // yType="literal"
                // getX={d => d.x}
                // getY={d => d.y}
                value={(legends) ? {Count: this.state.hovered.value} : {
                  // Barangay: this.state.hovered.y,
                  // [categoryLabel ? categoryLabel : 'Category']: this.state.hovered.valueLabel,
                  Category: this.state.hovered.label,
                  Count: this.state.hovered.value,
                }}
              />
            )}
          </RadialChart>
      </DonutPanel>
    );
  }
}

const DonutChartFactory = () => DonutChart;
export default DonutChartFactory;
