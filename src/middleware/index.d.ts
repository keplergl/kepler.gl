import {Middleware} from 'redux';

export const enhanceReduxMiddleware: (middlewares: Middleware[]) => Middleware[];
