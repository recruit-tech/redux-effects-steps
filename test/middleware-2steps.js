import assert from 'assert';
import { steps } from '../src';
import { sync, async, error, failure } from './fixtures/actionCreators';
import { testResolved, testRejected } from './_helpers';

testResolved('2 steps (not array), success -> success, action',
  steps(async(sync('foo')),
    sync('success1'), sync('success2')
  ),
  sync('success2'),
  [sync('success1'), sync('success2')]
);

testResolved('2 steps, success -> success, action',
  steps(async(sync('foo')),
    [sync('success1'), assert.fail],
    [sync('success2'), assert.fail]
  ),
  sync('success2'),
  [sync('success1'), sync('success2')]
);

testResolved('2 steps, success -> success, sync action creator',
  steps(async(sync('foo')),
    [sync('success1'), assert.fail],
    [() => sync('success2'), assert.fail]
  ),
  sync('success2'),
  [sync('success1'), sync('success2')]
);

testResolved('2 steps, success -> success, async action creator',
  steps(async(sync('foo')),
    [sync('success1'), assert.fail],
    [() => async(sync('success2')), assert.fail]
  ),
  sync('success2'),
  [sync('success1')]
);

testResolved('2 steps, success -> success, default handler',
  steps(async(sync('foo')),
    [sync('success1'), assert.fail],
    [, assert.fail]
  ),
  void 0,
  [sync('success1')]
);

testRejected('2 steps, success -> failure, action',
  steps(async(sync('foo')),
    [error('failure1'), assert.fail],
    [assert.fail, failure('failure2')]
  ),
  'failure2',
  [error('failure1'), failure('failure2')]
);

testRejected('2 steps, success -> failure, sync action creator',
  steps(async(sync('foo')),
    [error('failure1'), assert.fail],
    [assert.fail, () => failure('failure2')]
  ),
  'failure2',
  [error('failure1'), failure('failure2')]
);

testRejected('2 steps, success -> failure, async action creator',
  steps(async(sync('foo')),
    [error('failure1'), assert.fail],
    [assert.fail, () => async(failure('failure2'))]
  ),
  'failure2',
  [error('failure1')]
);

testRejected('2 steps, success -> failure, default handler',
  steps(async(sync('foo')),
    [error('failure1'), assert.fail],
    [assert.fail]
  ),
  new Error('failure1'),
  [error('failure1')]
);
