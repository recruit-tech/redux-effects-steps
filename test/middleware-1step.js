import assert from 'assert';
import { steps } from '../src';
import { sync, async, error, failure } from './fixtures/actionCreators';
import { testResolved, testRejected } from './_helpers';

testResolved('1 step (not array), success, single action',
  steps(async(sync('foo')),
    sync('success')
  ),
  sync('success'),
  [sync('success')]
);

testResolved('1 step, success, single action',
  steps(async(sync('foo')),
    [sync('success'), assert.fail]
  ),
  sync('success'),
  [sync('success')]
);

testResolved('1 step, success, multiple actions',
  steps(async(sync('foo')),
    [[sync('success1'), sync('success2')], assert.fail]
  ),
  [sync('success1'), sync('success2')],
  [sync('success1'), sync('success2')]
);

testResolved('1 step, success, sync action creator',
  steps(async('foo'),
    [sync, assert.fail]
  ),
  sync('foo'),
  [sync('foo')]
);

testResolved('1 step, success, async action creator',
  steps(async('foo'),
    [() => async('success'), assert.fail]
  ),
  'success',
  []
);

testResolved('1 step, success, default handler',
  steps(async(sync('foo')),
    [, assert.fail] // eslint-disable-line no-sparse-arrays
  ),
  void 0,
  []
);

testRejected('1 step, failure, action',
  steps(async(error(('failure'))),
    [assert.fail, error('error')]
  ),
  new Error('error'),
  [error('error')]
);

testRejected('1 step, failure, action creator',
  steps(async(error(('failure'))),
    [assert.fail, failure]
  ),
  new Error('failure'),
  [failure(new Error('failure'))]
);

testRejected('1 step, failure, default handler',
  steps(async(error(('failure'))),
    [assert.fail]
  ),
  new Error('failure'),
  []
);
