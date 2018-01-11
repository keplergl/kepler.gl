import {FileReader} from 'global/window';
import {processCsvData, processGeojson} from './data-processor';

export function getFileHandler(fileBlob) {
  const type = getFileType(fileBlob.name);

  return type === 'csv' ? loadCsv : type === 'geojson' ? loadGeoJSON : null;
}

export function getFileType(filename) {
  if (filename.endsWith('csv')) {
    return 'csv';
  } else if (filename.endsWith('json') || filename.endsWith('geojson')) {
    // Read GeoJson from browser
    return 'geojson';
  }

  // Wait to add other file type handler
  return 'other';
}

function readCSVFile(fileBlob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = ({target: {result}}) => {
      resolve(result);
    };

    fileReader.readAsText(fileBlob);
  });
}

export function loadCsv(fileBlob, processor = processCsvData) {
  return readCSVFile(fileBlob)
    .then(rawData => rawData ? processor(rawData) : null);
}

function readGeoJSONFile(fileBlob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = ({target: {result}}) => {
      try {
        const geo = JSON.parse(result);
        resolve(geo);
      } catch (err) {
        resolve(null);
      }
    };

    fileReader.readAsText(fileBlob);
  });
}

export function loadGeoJSON(fileBlob, processor = processGeojson) {
  return readGeoJSONFile(fileBlob)
    .then(rawData => rawData ? processor(rawData) : null);
}
