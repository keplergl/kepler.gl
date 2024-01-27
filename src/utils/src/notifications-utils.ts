// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {generateHashId} from './utils';

import {
  DEFAULT_NOTIFICATION_MESSAGE,
  DEFAULT_NOTIFICATION_TOPICS,
  DEFAULT_NOTIFICATION_TYPES,
  DEFAULT_UUID_COUNT,
  BUG_REPORT_LINK
} from '@kepler.gl/constants';

export type Notification = Record<string, any> & {
  id: string;
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
  topic: 'global' | 'file';
  count: number;
};

/**
 * Creates a notification
 */
export function createNotification({
  message = DEFAULT_NOTIFICATION_MESSAGE,
  type = DEFAULT_NOTIFICATION_TYPES.info,
  topic = DEFAULT_NOTIFICATION_TOPICS.global,
  id = generateHashId(DEFAULT_UUID_COUNT),
  count = 1,
  ...options
}: Partial<Notification>): Notification {
  return {
    ...options,
    id,
    message,
    type,
    topic,
    count: count > 99 ? 99 : count // no more than 2 digits
  };
}

/**
 * Creates an error notification
 * @param options
 * @returns {{topic, id, message, type: (null|number)}}
 */
export const errorNotification = options => ({
  ...createNotification(options),
  type: DEFAULT_NOTIFICATION_TYPES.error
});

/**
 * Creates a success notification
 * @param options
 * @returns {{topic, id, message, type: null}}
 */
export const successNotification = options => ({
  ...createNotification(options),
  type: DEFAULT_NOTIFICATION_TYPES.success
});

export const exportImageError = options =>
  errorNotification({
    ...options,
    id: 'EXPORT_IMAGE_ERROR_ID',
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    message: `Failed to export image, please take a screenshot of the javascript console, report the with [this link](${BUG_REPORT_LINK}) `
  });
