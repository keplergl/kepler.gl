import React from 'react';
import styled from 'styled-components';

const BarangayInfo = styled.div`
flex-grow: 3;
max-width: 300px;
margin-top: 15px;

.barangay-info__section {
  display: flex;
  justify-content: flex-start;
  padding-top: 5px;
}
.barangay-info__section:nth-child(1) {
  padding-top: 0;
  padding-bottom: 5px;
}
.barangay-info__section > div {
  padding-top: 0;
  padding-left: 30px;
}
.barangay-info__section > div:nth-child(1) {
  padding-left: 0;
}
`;

export class DataRow extends Component {
  
}