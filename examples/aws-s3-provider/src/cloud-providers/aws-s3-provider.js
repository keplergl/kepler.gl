// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand
} from '@aws-sdk/client-cognito-identity';
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import {KEPLER_FORMAT, Provider} from '@kepler.gl/cloud-providers';
import AwsIcon from './aws-icon';

const NAME = 'aws-s3';
const DISPLAY_NAME = 'AWS S3';
const STORAGE_KEY = 'aws-s3';
const MAP_SUFFIX = '.map.json';
const THUMB_SUFFIX = '.thumbnail.png';
const META_SUFFIX = '.meta.json';
const KEY_ROOT = 'kepler';

/**
 * Cognito Hosted UI + S3 private storage provider (BYOA).
 *
 * Maps live in the operator's bucket under:
 *   private/{cognitoIdentityId}/kepler/{title}.map.json
 */
export default class AwsS3Provider extends Provider {
  constructor(config = {}) {
    const {
      region,
      userPoolId,
      userPoolClientId,
      identityPoolId,
      bucket,
      cognitoDomain,
      displayName
    } = config;

    super({
      name: NAME,
      displayName: displayName || DISPLAY_NAME,
      icon: AwsIcon
    });

    this.region = region || null;
    this.userPoolId = userPoolId || null;
    this.userPoolClientId = userPoolClientId || null;
    this.identityPoolId = identityPoolId || null;
    this.bucket = bucket || null;
    this.cognitoDomain = (cognitoDomain || '').replace(/^https?:\/\//, '').replace(/\/$/, '');

    this._idToken = null;
    this._identityId = null;
    this._user = null;
    this._credentials = null;
    this._s3 = null;

    this._restoreSession();
  }

  isEnabled() {
    return Boolean(
      this.region &&
        this.userPoolId &&
        this.userPoolClientId &&
        this.identityPoolId &&
        this.bucket &&
        this.cognitoDomain
    );
  }

  hasPrivateStorage() {
    return true;
  }

  hasSharingUrl() {
    // v1: private only. Pre-signed URLs expire; use CloudFront for durable public links later.
    return false;
  }

  getManagementUrl() {
    if (!this.bucket || !this._identityId) {
      return this.bucket
        ? `https://s3.console.aws.amazon.com/s3/buckets/${this.bucket}`
        : 'https://s3.console.aws.amazon.com/s3/home';
    }
    const prefix = encodeURIComponent(`private/${this._identityId}/${KEY_ROOT}/`);
    return `https://s3.console.aws.amazon.com/s3/buckets/${this.bucket}?prefix=${prefix}`;
  }

  getMapUrl(loadParams = {}) {
    return loadParams.key || '';
  }

  async getAccessToken() {
    if (!this.isEnabled()) {
      return null;
    }
    if (this._idToken && this._identityId) {
      return this._idToken;
    }
    this._restoreSession();
    return this._idToken && this._identityId ? this._idToken : null;
  }

  async getUser() {
    const token = await this.getAccessToken();
    if (!token) {
      return null;
    }
    if (this._user) {
      return this._user;
    }
    try {
      await this._ensureAwsClients();
      return this._user;
    } catch (err) {
      this._clearSession();
      return null;
    }
  }

  getUserName() {
    return this._user?.name || this._user?.email || '';
  }

  async login() {
    if (!this.isEnabled()) {
      throw new Error(
        'AWS S3 provider is not configured. Set AwsRegion, AwsUserPoolId, AwsUserPoolClientId, AwsIdentityPoolId, AwsS3Bucket, and AwsCognitoDomain in .env'
      );
    }

    const redirectUri = `${window.location.origin}/auth`;
    const authUrl =
      `https://${this.cognitoDomain}/login?` +
      new URLSearchParams({
        client_id: this.userPoolClientId,
        response_type: 'token',
        scope: 'openid email profile',
        redirect_uri: redirectUri
      }).toString();

    return new Promise((resolve, reject) => {
      const popup = window.open(authUrl, 'awsCognitoLogin', 'width=500,height=640');
      if (!popup) {
        reject(new Error('Popup blocked. Allow popups for Cognito login.'));
        return;
      }

      const onMessage = async event => {
        if (event.origin !== window.location.origin || !event.data?.awsS3Auth) {
          return;
        }
        window.removeEventListener('message', onMessage);
        try {
          popup.close();
        } catch (e) {
          // ignore
        }

        if (event.data.error) {
          reject(new Error(event.data.error));
          return;
        }

        try {
          const user = await this._completeLogin(event.data.idToken);
          resolve(user);
        } catch (err) {
          reject(err);
        }
      };

      window.addEventListener('message', onMessage);
    });
  }

  /**
   * Called from the /auth popup after Cognito redirects back with hash tokens.
   */
  handleAuthRedirect() {
    if (!window.opener) {
      return false;
    }
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');
    const error = params.get('error_description') || params.get('error');

    window.opener.postMessage(
      {
        awsS3Auth: true,
        idToken,
        accessToken,
        error: error || (!idToken ? 'Missing id_token from Cognito' : null)
      },
      window.location.origin
    );
    window.close();
    return true;
  }

  async logout() {
    this._clearSession();
    if (this.cognitoDomain && this.userPoolClientId) {
      const logoutUri = encodeURIComponent(`${window.location.origin}/`);
      // Best-effort Hosted UI logout (may be blocked as popup); local session is already cleared.
      window.open(
        `https://${this.cognitoDomain}/logout?client_id=${this.userPoolClientId}&logout_uri=${logoutUri}`,
        '_blank',
        'width=500,height=600'
      );
    }
  }

  async listMaps() {
    await this._ensureAwsClients();
    const prefix = this._prefix();
    const listed = await this._s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix
      })
    );

    const contents = listed.Contents || [];
    const mapKeys = contents.filter(obj => obj.Key && obj.Key.endsWith(MAP_SUFFIX));

    const visualizations = await Promise.all(
      mapKeys.map(async obj => {
        const key = obj.Key;
        const title = key.slice(prefix.length, -MAP_SUFFIX.length);
        const metaKey = `${prefix}${title}${META_SUFFIX}`;
        const thumbKey = `${prefix}${title}${THUMB_SUFFIX}`;

        let description = '';
        let thumbnail;
        try {
          const meta = await this._getJsonObject(metaKey);
          description = meta?.description || '';
        } catch (e) {
          // optional
        }
        try {
          if (contents.some(c => c.Key === thumbKey)) {
            thumbnail = await this._getObjectDataUrl(thumbKey);
          }
        } catch (e) {
          // optional
        }

        return {
          id: key,
          title,
          description,
          updatedAt: obj.LastModified ? new Date(obj.LastModified).getTime() : undefined,
          privateMap: true,
          thumbnail,
          loadParams: {key, title}
        };
      })
    );

    return visualizations.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  async uploadMap({mapData, options = {}}) {
    await this._ensureAwsClients();
    const {map, thumbnail} = mapData;
    const title = (map.info && map.info.title) || 'Untitled Map';
    const description = (map.info && map.info.description) || '';
    const prefix = this._prefix();
    const mapKey = `${prefix}${title}${MAP_SUFFIX}`;

    if (!options.overwrite) {
      const exists = await this._objectExists(mapKey);
      if (exists) {
        throw this.getFileConflictError();
      }
    }

    await this._s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: mapKey,
        Body: JSON.stringify(map),
        ContentType: 'application/json'
      })
    );

    await this._s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${prefix}${title}${META_SUFFIX}`,
        Body: JSON.stringify({description}),
        ContentType: 'application/json'
      })
    );

    if (thumbnail) {
      await this._s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: `${prefix}${title}${THUMB_SUFFIX}`,
          Body: thumbnail,
          ContentType: 'image/png'
        })
      );
    }

    return {
      id: mapKey,
      title,
      description,
      privateMap: true,
      loadParams: {key: mapKey, title}
    };
  }

  async downloadMap(loadParams = {}) {
    await this._ensureAwsClients();
    const key = loadParams.key;
    if (!key) {
      throw new Error('AWS S3: no object key in loadParams');
    }
    const map = await this._getJsonObject(key);
    return {map, format: KEPLER_FORMAT};
  }

  // —— private ——

  _prefix() {
    if (!this._identityId) {
      throw new Error('Missing Cognito identity id');
    }
    return `private/${this._identityId}/${KEY_ROOT}/`;
  }

  _loginKey() {
    return `cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;
  }

  _restoreSession() {
    try {
      const raw = window.localStorage?.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const stored = JSON.parse(raw);
      if (stored?.expiresAt && Date.now() > stored.expiresAt - 60_000) {
        this._clearSession();
        return;
      }
      this._idToken = stored.idToken || null;
      this._identityId = stored.identityId || null;
      this._user = stored.user || null;
    } catch (e) {
      this._clearSession();
    }
  }

  _persistSession({idToken, identityId, user, expiresIn}) {
    this._idToken = idToken;
    this._identityId = identityId;
    this._user = user;
    const expiresAt = Date.now() + (Number(expiresIn) || 3600) * 1000;
    window.localStorage?.setItem(
      STORAGE_KEY,
      JSON.stringify({idToken, identityId, user, expiresAt})
    );
  }

  _clearSession() {
    this._idToken = null;
    this._identityId = null;
    this._user = null;
    this._credentials = null;
    this._s3 = null;
    window.localStorage?.removeItem(STORAGE_KEY);
  }

  async _completeLogin(idToken) {
    if (!idToken) {
      throw new Error('Cognito login did not return an id token');
    }

    const identityClient = new CognitoIdentityClient({region: this.region});
    const loginKey = this._loginKey();
    const logins = {[loginKey]: idToken};

    const {IdentityId} = await identityClient.send(
      new GetIdCommand({
        IdentityPoolId: this.identityPoolId,
        Logins: logins
      })
    );

    const {Credentials} = await identityClient.send(
      new GetCredentialsForIdentityCommand({
        IdentityId,
        Logins: logins
      })
    );

    this._credentials = {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
    };

    const user = this._userFromIdToken(idToken);
    this._persistSession({
      idToken,
      identityId: IdentityId,
      user,
      expiresIn: Credentials.Expiration
        ? Math.max(60, (new Date(Credentials.Expiration).getTime() - Date.now()) / 1000)
        : 3600
    });

    this._s3 = new S3Client({
      region: this.region,
      credentials: async () => this._refreshCredentials()
    });

    return user;
  }

  async _ensureAwsClients() {
    if (!this._idToken) {
      this._restoreSession();
    }
    if (!this._idToken) {
      throw new Error('Not logged in to AWS');
    }
    if (!this._s3 || !this._identityId) {
      await this._completeLogin(this._idToken);
    }
  }

  async _refreshCredentials() {
    if (
      this._credentials?.expiration &&
      new Date(this._credentials.expiration).getTime() > Date.now() + 60_000
    ) {
      return {
        accessKeyId: this._credentials.accessKeyId,
        secretAccessKey: this._credentials.secretAccessKey,
        sessionToken: this._credentials.sessionToken
      };
    }

    const identityClient = new CognitoIdentityClient({region: this.region});
    const logins = {[this._loginKey()]: this._idToken};
    const {Credentials} = await identityClient.send(
      new GetCredentialsForIdentityCommand({
        IdentityId: this._identityId,
        Logins: logins
      })
    );
    this._credentials = {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
    };
    return {
      accessKeyId: this._credentials.accessKeyId,
      secretAccessKey: this._credentials.secretAccessKey,
      sessionToken: this._credentials.sessionToken
    };
  }

  _userFromIdToken(idToken) {
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return {
        name: payload.name || payload.email || payload['cognito:username'] || 'AWS User',
        email: payload.email || '',
        thumbnail: payload.picture
      };
    } catch (e) {
      return {name: 'AWS User', email: ''};
    }
  }

  async _objectExists(key) {
    try {
      await this._s3.send(new HeadObjectCommand({Bucket: this.bucket, Key: key}));
      return true;
    } catch (err) {
      const status = err.$metadata?.httpStatusCode;
      if (status === 404 || err.name === 'NotFound' || err.name === 'NoSuchKey') {
        return false;
      }
      throw err;
    }
  }

  async _getJsonObject(key) {
    const res = await this._s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      })
    );
    const text = await res.Body.transformToString();
    return JSON.parse(text);
  }

  async _getObjectDataUrl(key) {
    const res = await this._s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      })
    );
    const bytes = await res.Body.transformToByteArray();
    const blob = new Blob([bytes], {type: res.ContentType || 'image/png'});
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
