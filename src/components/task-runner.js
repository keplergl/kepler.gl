import {useEffect} from 'react';
import {taskMiddleware} from 'react-palm/tasks';
import {useStore} from 'react-redux';

const IDENTITY = i => i;

function runTasks(store) {
  // Run the taskMiddleware without a dummy action
  return taskMiddleware(store)(IDENTITY)(null);
}

export default function TaskRunner() {
  const store = useStore();

  useEffect(() => {
    if (!store) {
      return;
    }
    // Initial batch of tasks on initialization of store
    runTasks(store);

    // Subscribe to subsequent updates
    const unsubscribe = store.subscribe(() => {
      runTasks(store);
    });
    return () => {
      unsubscribe();
    };
  }, [store]);
  return null;
}
