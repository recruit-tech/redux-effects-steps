import { steps } from '../src';
import { sync, async, error, failure } from './fixtures/actionCreators';
import { testResolved, testRejected } from './_helpers';

testResolved('fetch success',
  steps(sync('begin'),
    async(sync('fetch')),
    [sync('success'), (error) => failure(error)]
  ),
  sync('success'),
  [sync('begin'), sync('success')]
);

testRejected('fetch feilure',
  steps(sync('begin'),
    async(error('failure')),
    [sync('success'), (error) => failure(error)]
  ),
  new Error('failure'),
  [sync('begin'), failure(new Error('failure'))]
);
