# AWS S3 Cloud Provider (BYOA)

Bring-your-own-AWS example: kepler.gl saves and loads maps from **your** Cognito-authenticated S3 bucket.

This is **not** enabled on [kepler.gl/demo](https://kepler.gl/demo). Dropbox / Google Drive work there with a public OAuth client ID and the user’s own storage. Cognito + S3 always uses an **operator-owned** bucket, so it belongs in a separate example (same guidance as [#1147](https://github.com/keplergl/kepler.gl/pull/1147)).

## What you get

- Cognito Hosted UI login (popup)
- Private map storage in S3 under `private/{cognitoIdentityId}/kepler/`
- Save / overwrite / list / load via the standard Kepler cloud provider UI
- No Amplify dependency — AWS SDK v3 only
- Sharing disabled in v1 (`hasSharingUrl: false`); add CloudFront or authenticated deep links later if needed

## Prerequisites

- An AWS account
- Node 20+ and Yarn
- A Mapbox token (or MapLibre-only setup if you change basemap config)

## Where each `.env` value comes from

| `.env` key | Where to find / set it | Example |
|---|---|---|
| `MapboxAccessToken` | [Mapbox account → Access tokens](https://account.mapbox.com/access-tokens/) | `pk.eyJ1Ijoi...` |
| `AwsRegion` | AWS Console region selector (top right) | `us-east-1` |
| `AwsUserPoolId` | **Cognito → User pools → [pool] → User pool overview → User pool ID** | `us-east-1_AbCdEf123` |
| `AwsUserPoolClientId` | **Same pool → App integration → App clients → Client ID** | `1a2b3c4d5e6f7g8h9i0j` |
| `AwsCognitoDomain` | **Same pool → App integration → Domain** (Hosted UI domain host only, no `https://`) | `my-kepler-maps.auth.us-east-1.amazoncognito.com` |
| `AwsIdentityPoolId` | **Cognito → Identity pools → [pool] → Identity pool ID** | `us-east-1:11111111-2222-3333-4444-555555555555` |
| `AwsS3Bucket` | **S3 → Buckets →** bucket **name** (not the ARN) | `my-kepler-maps` |
| `AwsAccountDisplayName` | Your choice — label shown on the cloud provider tile | `My Kepler S3` |

Console entry points:

- User pools: https://console.aws.amazon.com/cognito/v2/idp/user-pools  
- Identity pools: https://console.aws.amazon.com/cognito/v2/idpool  
- S3 buckets: https://s3.console.aws.amazon.com/s3/buckets  

If you see **“AWS S3 provider is not configured”**, one or more of the required AWS fields above is still empty in `.env`. Fill them all, then restart `yarn start`.

## 1. Create Cognito + S3 (console)

### User pool

1. Open [User pools](https://console.aws.amazon.com/cognito/v2/idp/user-pools) → **Create user pool**
2. Sign-in options: **Email**
3. App client: **Public client**, **no client secret**, enable Hosted UI
4. Hosted UI domain: create a Cognito domain (e.g. prefix `my-kepler-maps`)
5. Allowed callback URL: `http://localhost:8080/auth`
6. Allowed sign-out URL: `http://localhost:8080/`
7. OAuth: **Implicit grant**, scopes: `openid`, `email`, `profile`
8. After create, copy:
   - **User pool ID** → `AwsUserPoolId`
   - **App client ID** → `AwsUserPoolClientId`
   - Domain host (e.g. `my-kepler-maps.auth.us-east-1.amazoncognito.com`) → `AwsCognitoDomain`

### Identity pool

1. Open [Identity pools](https://console.aws.amazon.com/cognito/v2/idpool) → **Create identity pool**
2. Enable access for **authenticated** identities
3. Authentication providers → **Cognito user pool**: select the user pool + app client from above
4. Create / attach an **authenticated** IAM role (used for S3 access next)
5. Copy **Identity pool ID** → `AwsIdentityPoolId`  
   Format: `us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### S3 bucket

1. Open [S3 buckets](https://s3.console.aws.amazon.com/s3/buckets) → **Create bucket** (same region as Cognito)
2. Name → `AwsS3Bucket` (e.g. `my-kepler-maps`)
3. Block public access: **on** (private only)
4. Permissions → CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:8080"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### IAM (authenticated role)

Find the role on the Identity pool’s **User access** / authenticated role, then allow that role to use only the caller’s prefix (replace the bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::my-kepler-maps"],
      "Condition": {
        "StringLike": {
          "s3:prefix": ["private/${cognito-identity.amazonaws.com:sub}/*"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": [
        "arn:aws:s3:::my-kepler-maps/private/${cognito-identity.amazonaws.com:sub}/*"
      ]
    }
  ]
}
```

> Amplify-style policies use `${cognito-identity.amazonaws.com:sub}` for the identity id folder. If ListBucket fails, temporarily broaden the prefix condition while debugging, then tighten again.

## 2. Configure the example

```sh
cd examples/aws-s3-provider
cp .env.template .env
```

Edit `.env` with the values from the table above:

```sh
MapboxAccessToken=pk....
AwsRegion=us-east-1
AwsUserPoolId=us-east-1_AbCdEf123
AwsUserPoolClientId=1a2b3c4d5e6f7g8h9i0j
AwsIdentityPoolId=us-east-1:11111111-2222-3333-4444-555555555555
AwsS3Bucket=my-kepler-maps
AwsCognitoDomain=my-kepler-maps.auth.us-east-1.amazoncognito.com
AwsAccountDisplayName=My Kepler S3
```

Notes:

- `AwsCognitoDomain` must **not** include `https://`
- Cognito callback URL must match the app origin: `http://localhost:8080/auth`
- All AWS fields except `AwsAccountDisplayName` are required for the provider tile to appear

## 3. Run

```sh
touch yarn.lock && yarn
yarn start
```

Open http://localhost:8080 → Save / Storage → **AWS S3** → log in.

## Object layout

```
s3://{bucket}/private/{identityId}/kepler/
  {title}.map.json
  {title}.thumbnail.png
  {title}.meta.json
```

## Optional: Amplify Gen 2

You can still provision Auth + Storage with Amplify Gen 2 / CDK and point this example at the resulting User Pool, Identity Pool, and bucket IDs. The app does not import Amplify JS.

## Related

- Modern Google Drive provider (demo-app): [#3623](https://github.com/keplergl/kepler.gl/pull/3623)
- Historical Amplify demo-app PR: [#1147](https://github.com/keplergl/kepler.gl/pull/1147)
