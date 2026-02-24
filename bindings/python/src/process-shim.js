export const process = {
  env: {
    NODE_ENV: typeof window !== 'undefined' ? 'production' : 'development'
  },
  browser: true,
  version: '',
  platform: 'browser',
  nextTick: (fn, ...args) => queueMicrotask(() => fn(...args)),
  cwd: () => '/',
  argv: []
};
