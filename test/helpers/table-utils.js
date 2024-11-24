// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createNewDataEntry} from '@kepler.gl/table';

/**
 * A test function to execute the task from createNewDataEntry with await syntax.
 * @param {ProtoDataset} props
 * @returns {Datasets}
 */
export const createNewDataEntryMock = async props => {
  const newDataEntry = createNewDataEntry(props);
  let table = null;
  await newDataEntry.run(
    async (effectorPrime, success, error) => {
      const res = effectorPrime(success, error);
      await res;
    },
    value => {
      table = value;
    }
  );
  return {
    [props.info.id]: table
  };
};
