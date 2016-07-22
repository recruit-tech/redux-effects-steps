import { test } from 'eater/runner';
import assert from 'assert';
import { steps } from '../src';
import { sync, async } from './fixtures/actionCreators';
import { default as createStore, actions } from './fixtures/createStore';
import { testResolved } from './_helpers';

test('not steps action, pass through', () => {
  const store = createStore();
  const result = store.dispatch(sync('foo'));
  assert.deepEqual(result, sync('foo'));
  assert.deepEqual(actions, [sync('foo')]);
});

testResolved('no step, single sync action',
  steps(sync('foo')),
  sync('foo'),
  [sync('foo')]
);

testResolved('no step, multiple sync actions',
  steps([sync('foo'), sync('bar')]),
  [sync('foo'), sync('bar')],
  [sync('foo'), sync('bar')]
);

testResolved('no step, single async action',
  steps(async('foo')),
  'foo',
  []
);

testResolved('no step, multiple async actions',
  steps([async('foo'), async('bar')]),
  [async('foo').payload, async('bar').payload],
  []
);
