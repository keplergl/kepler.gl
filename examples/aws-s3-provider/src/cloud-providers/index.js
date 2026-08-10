// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import AwsS3Provider from './aws-s3-provider';

export function createCloudProviders() {
  const provider = new AwsS3Provider({
    region: process.env.AwsRegion,
    userPoolId: process.env.AwsUserPoolId,
    userPoolClientId: process.env.AwsUserPoolClientId,
    identityPoolId: process.env.AwsIdentityPoolId,
    bucket: process.env.AwsS3Bucket,
    cognitoDomain: process.env.AwsCognitoDomain,
    displayName: process.env.AwsAccountDisplayName || 'AWS S3'
  });

  return provider.isEnabled() ? [provider] : [];
}

export {AwsS3Provider};
