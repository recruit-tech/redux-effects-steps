import { test } from 'eater/runner';
import assert from 'assert';
import mustCall from 'must-call';
import isPromise from 'is-promise';
import { default as createStore, actions } from './fixtures/createStore';

export function testResolved(msg, action, expectedResult, expectedActions) {
  return test(msg, () => {
    const store = createStore();
    const promise = store.dispatch(action);
    assert(isPromise(promise));
    promise.then(mustCall((result) => {
      assert.deepEqual(result, expectedResult);
      assert.deepEqual(actions, expectedActions);
    }), assert.fail);
  });
}

export function testRejected(msg, action, expectedResult, expectedActions) {
  return test(msg, () => {
    const store = createStore();
    const promise = store.dispatch(action);
    assert(isPromise(promise));
    promise.then(assert.fail, mustCall((result) => {
      assert.deepEqual(result, expectedResult);
      assert.deepEqual(actions, expectedActions);
    }));
  });
}
