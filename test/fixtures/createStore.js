import { createStore, applyMiddleware } from 'redux';
import { default as steps } from '../../src';

export const actions = [];

function log(store) {
  return (next) => (action) => {
    actions.push(action);
    return next(action);
  };
}

function async({ dispatch }) {
  return (next) => (action) => {
    if (action.type !== 'ASYNC') {
      return next(action);
    }

    return !action.payload.error ? Promise.resolve(action.payload) : Promise.reject(action.payload.payload);
  };
}

export default function () {
  return createStore(() => {
  }, {}, applyMiddleware(steps, async, log));
}
