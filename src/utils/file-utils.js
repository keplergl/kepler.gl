import {generateHashId} from 'utils/utils';
import {getFileHandler} from 'processors/file-handler';

export const processFileToLoad = (file) => {
  return {
    fileBlob: file,
    info: {
      id: generateHashId(4),
      label: file.name,
      size: file.size
    },
    handler: getFileHandler(file)
  }
};
