import stepsMiddleware, { steps, StepAction } from '../'
import { AnyAction, Middleware } from 'redux';

type AssertEqual<T, Expected> =
  T extends Expected
  ? (Expected extends T ? true : never)
  : never;

function assertType<_T extends true>() {}

const createAction = <P = void>(type: string) => {
  const actionCreator = (payload: P) => ({ type, payload })
  actionCreator.type = type // like as redux-act, typescript-fsa, and etc third party
  return actionCreator
}

const ready = createAction("ready")
const promisableFunc = () => Promise.resolve("ok")
const success = createAction<string>("success")
const failure = createAction("failure")

const sampleAction = () => {
  return steps(
    ready(),
    promisableFunc,
    [success, failure]
  )
}

const noop = () => ({ type: 'noop' })

const doSomeThing = createAction("do some thing")

const promiseAll = () => {
  const f1 = async () => await Promise.resolve(1)
  const f2 = async () => await Promise.resolve(2)
  return steps(
    ready(),
    [f1, f2],  
    [success, failure],
    [doSomeThing, noop],
  )
}

assertType<AssertEqual<ReturnType<typeof sampleAction>, StepAction>>()
assertType<AssertEqual<ReturnType<typeof promiseAll>, StepAction>>()

// for redux
assertType<AssertEqual<ReturnType<typeof sampleAction>, AnyAction>>()
assertType<AssertEqual<typeof stepsMiddleware, Middleware>>() 