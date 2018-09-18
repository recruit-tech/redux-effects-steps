# redux-effects-steps

Another version of
[redux-effects](https://www.npmjs.com/package/redux-effects)
handling
[error action](https://github.com/acdlite/flux-standard-action#errors-as-a-first-class-concept)
properly.

## Installation

```
npm install --save redux-effects-steps
```

## Usage

### Installing the middleware

```javascript
import { createStore, applyMiddleware } from 'redux';
import stepsMiddleware from 'redux-effects-steps';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(
    stepsMiddleware
  )
);
```

### Defining action creators

```javascript
import { createAction } from 'redux-actions';
import { steps } from 'redux-effects-steps';
import { fetchrRead } from 'redux-effects-fetchr';

const fetchUserRequest = createAction('FETCH_USER_REQUEST');
const fetchUserSuccess = createAction('FETCH_USER_SUCCESS');
const fetchUserFail = createAction('FETCH_USER_FAIL');

function fetchUser({ user }) {
  return steps(
    fetchUserRequest(),
    fetchrRead('users', { user }),
    [fetchUserSuccess, fetchUserFail]
  );
}
```

### Using actions

```javascript
const promise = store.dispatch(fetchUser({ user }));
```

## Under the food

Example:

```javascript
const promise = store.dispatch(steps(
    originAction,
    [firstSuccess, firstFailure],
    [secondSuccess, secondFailure]
  ));
```

is evaluated by redux-effects-steps like this:

```javascript
const promise = store.dispatch(originAction)
    .then((result) => store.dispatch(firstSuccess(result)), (error) => store.dispatch(firstFailure(error)))
    .then((result) => store.dispatch(secondSuccess(result)), (error) => store.dispatch(secondFailure(error)));
```

## Kind of Actions

### Async Actions

Async action returns a Promise object when it's dispatched.
If the dispatched action fails, the returned Promise will be rejected.

### Sync Actions

Sync action returns an object which is not a Promise (by default, dispatched action itself.) when it's dispatched.
If the action represents fail, it should be
[error action](https://github.com/acdlite/flux-standard-action#errors-as-a-first-class-concept).

## Defferences from redux-effects

### Error handling

redux-effects:

```javascript
import { createAction } from 'redux-actions';
import { bind } from 'redux-effects';
import { fetch } from 'redux-effects-fetch';

const success = createAction('FIND_USER_SUCCESS');
const failure = createAction('FIND_USER_FAILURE');

function findUser(condition) {
  return bind(fetch('/api/users', {method: 'POST', body: condition}), success, failure);
}

const finalPromise = store.dispatch(findUser(condition));
```

If `fetch()` action fails, the
[error action](https://github.com/acdlite/flux-standard-action#errors-as-a-first-class-concept)
created by `failure()` is dispatched.
And then, redux-effects *resolves* the next Promise, so the `finalPromise` isn't rejected.

This is the problem when the action creator is used with
[redux-form](https://www.npmjs.com/package/redux-form).

In this example, `onSubmit()` handler always succeed if the action fails.

```javascript
reduxForm({ form: 'myForm', fields: [...] }, null, {
  onSubmit:(values, dispatch) => dispatch(findUser(values.user))
})(MyForm)
```

On the other hand, redux-effects-steps *rejects* the next Promise when
[error action](https://github.com/acdlite/flux-standard-action#errors-as-a-first-class-concept)
is dispatched.

### Action creator

redux-effects provides an action creator takes just one step.

```javascript
import { bind } from 'redux-effects';

const action = bind(fetch(), success, failure);
```

redux-effects-steps provides an action creator takes *multiple steps*.

```javascript
import { steps } from 'redux-effects-steps';

const action = steps(begin(),
  [fetch('/api/users')],
  [success, failure]
);
```

## API

## Action Creators

#### `steps(origin, [...steps])`

##### Arguments

* `origin` *(Array|Object)*
    * One of the:
        * `action` *(Object)*: A 
          [FSA](https://github.com/acdlite/flux-standard-action)
          compliant action object.
        * `actions` *(Array)*: An array of actions.
* `steps` *(Array)*
    * Each element is in a `[success, failure]` tuple Array.
    * `success` and `failure` are one of the:
        * `action` *(Object)*: A
          [FSA](https://github.com/acdlite/flux-standard-action)
          compliant action object.
        * `actions` *(Array)*: An array of
          [FSA](https://github.com/acdlite/flux-standard-action)
          compliant action object.
        * `actionCreator` *(Function)*: An action creator.
    * If `failure` is not needed, you can pass just `success` instead of an Array.

##### Returns

*(Object)*: A
  [FSA](https://github.com/acdlite/flux-standard-action)
  compliant action object.
