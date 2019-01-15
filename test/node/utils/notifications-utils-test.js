import test from 'tape';
import {errorNotification, successNotification} from 'utils/notifications-utils';

test('#notificationsUtils -> errorNotification', t => {
  const notification = errorNotification({message: 'test', id: 'test-1'});

  t.deepEqual(notification, {
    id: 'test-1',
    message: 'test',
    type: 'error',
    topic: 'global'
  }, 'ErrorNotification creates an error notification');

  t.end();
});

test('#notificationsUtils -> successNotification', t => {
  const notification = successNotification({message: 'test', id: 'test-1'});

  t.deepEqual(notification, {
    id: 'test-1',
    message: 'test',
    type: 'success',
    topic: 'global'
  }, 'SuccessNotification creates an error notification');

  t.end();
});
