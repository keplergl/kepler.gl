/* global gapi */
import GoogleProvider from './google-provider';
import GoogleDriveIcon from '../components/icons/google-drive-icon';

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

const SCOPES = ['https://www.googleapis.com/auth/drive.file']; // Restrict to files from this app

// There is a selection of access scopes for Google Drive, e.g.
// - https://www.googleapis.com/auth/drive	See, edit, create, and delete all of your Google Drive files
// - https://www.googleapis.com/auth/drive.appdata	View and manage its own configuration data in your Google Drive
// - https://www.googleapis.com/auth/drive.file	View and manage Google Drive files and folders that you have opened or created with this app
// See https://developers.google.com/identity/protocols/googlescopes#drivev3

export default class GoogleDriveProvider extends GoogleProvider {
  /**
   * To access Google Drive, specify it in scopes
   * param scopes = ['https://www.googleapis.com/auth/drive.file'];
   */
  constructor(appName, clientId, appKey, scopes = SCOPES) {
    super({
      clientId,
      appKey,
      name: 'Google Drive',
      appName,
      icon: GoogleDriveIcon,
      discoveryDocs: DISCOVERY_DOCS,
      scopes
    });
  }

  /**
   * Uploads a file to Google Drive
   * @param blob to upload
   * @param name if blob doesn't contain a file name, this field is used
   * @param isPublic define whether the file will be available pubblicaly once uploaded
   * @returns {Promise<void>}
   */
  async uploadFile({blob, name, isPublic = true}) {
    const mimeType = 'application/json';
    // gapi.client.drive doesn't seem to have good stubs for uploading, so we use the Google Drive REST API
    const metadata = {
      name, // Filename on Google Drive
      mimeType, // mimeType on Google Drive
      parents: ['root'] // Folder ID at Google Drive
    };

    // The body of the post request will be this form
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: mimeType}));
    form.append('file', blob);
    const accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.

    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: new Headers({Authorization: `Bearer ${accessToken}`}),
      body: form
    })
    .then(res => res.json())
    .catch(error => console.error(val)); // eslint-disable-line

    // TODO - implement sharing 
  }
}
