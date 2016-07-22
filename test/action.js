import { test } from 'eater/runner';
import assert from 'assert';
import { steps, EFFECT_STEPS } from '../src';
import { sync } from './fixtures/actionCreators';

test('no step', () => {
  const action = steps(sync('foo'));
  assert.deepEqual(action, {
    type: EFFECT_STEPS,
    payload: {
      type: 'SYNC',
      payload: {
        name: 'foo',
      },
    },
    meta: {
      steps: [],
    },
  });
});

test('1 step', () => {
  const action = steps(sync('foo'), [sync('ok'), sync('ng')]);
  assert.deepEqual(action, {
    type: EFFECT_STEPS,
    payload: {
      type: 'SYNC',
      payload: {
        name: 'foo',
      },
    },
    meta: {
      steps: [
        [
          {
            type: 'SYNC',
            payload: {
              name: 'ok',
            },
          },
          {
            type: 'SYNC',
            payload: {
              name: 'ng',
            },
          },
        ],
      ],
    },
  });
});

test('2 steps', () => {
  const action = steps(sync('foo'), [sync('ok'), sync('ng')], [sync('good'), sync('bad')]);
  assert.deepEqual(action, {
    type: EFFECT_STEPS,
    payload: {
      type: 'SYNC',
      payload: {
        name: 'foo',
      },
    },
    meta: {
      steps: [
        [
          {
            type: 'SYNC',
            payload: {
              name: 'ok',
            },
          },
          {
            type: 'SYNC',
            payload: {
              name: 'ng',
            },
          },
        ],
        [
          {
            type: 'SYNC',
            payload: {
              name: 'good',
            },
          },
          {
            type: 'SYNC',
            payload: {
              name: 'bad',
            },
          },
        ],
      ],
    },
  });
});
