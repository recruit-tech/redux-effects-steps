/*
 * A part of these functions are:
 *   Copyright 2015 Andrew Shaffer (http://github.com/ashaffer)"
 *   Released under the MIT license.
 *   https://github.com/redux-effects/redux-effects/blob/master/src/index.js
 */

import isPromise from 'is-promise';

/*
 * Action Types
 */
export const EFFECT_STEPS = 'EFFECT_STEPS';

/*
 * Action creators
 */
export function steps(action, ...steps) {
  return {
    type: EFFECT_STEPS,
    payload: action,
    meta: {
      steps,
    },
  };
}

/*
 * Middleware
 */
export default function stepsMiddleware({ dispatch }) {
  return (next) => (action) => action.type === EFFECT_STEPS ? dispatchEffect(action) : next(action);

  function dispatchEffect(action) {
    const promise = promisify(maybeDispatch(action.payload));
    return action.meta && action.meta.steps
      ? applySteps(promise, action.meta.steps)
      : promise;
  }

  function maybeDispatch(action) {
    if (!action || isPromise(action)) {
      return action;
    }

    if (Array.isArray(action)) {
      return action.filter(Boolean).map(dispatch);
    }

    return dispatch(action);
  }

  function applySteps(promise, steps = []) {
    return steps
      .map((step) => Array.isArray(step) ? step : [step])
      .reduce((promise, [success = noop, failure = reject]) =>
        promise.then(
          (val) => promisify(maybeDispatch(createAction(success, val))),
          (err) => promisify(maybeDispatch(createAction(failure, err)))
        ), promise);
  }
}

function promisify(val) {
  if (isPromise(val)) {
    return val;
  }

  if (Array.isArray(val)) {
    return Promise.all(val.map(promisify));
  }

  return !isErrorAction(val) ? Promise.resolve(val) : Promise.reject(val.payload);
}

function noop() {
}

function reject(err) {
  return Promise.reject(err);
}

function createAction(actionOrCreator, param) {
  if (!actionOrCreator || isPromise(actionOrCreator)) {
    return;
  }

  if (typeof actionOrCreator === 'function') {
    return actionOrCreator(param);
  }

  return actionOrCreator;
}

function isErrorAction(val) {
  return val && typeof val === 'object' && typeof val.then !== 'function' && val.type && val.error;
}
