import { Middleware, Store } from 'redux'

type Action<P> = {
  type: string
  payload?: P
  meta?: Record<string | symbol | number, any>
  error?: boolean
}

type AnyAction = Action<any>


interface ActionCreator<A = any> {
 (args: A): AnyAction
}

type SuccessOrFailure<Succ = any, Err = any> = [
  ActionCreator<Succ>,
  ActionCreator<Err>
]

type PromisableFunction<A = any> = (args: A) => Promise<any>

export declare const EFFECT_STEPS : 'EFFECT_STEPS'

type StepItem = SuccessOrFailure | PromisableFunction | ActionCreator | Array<Promise<any> | PromisableFunction> | AnyAction

export declare type StepAction<A = AnyAction> = {
  type: typeof EFFECT_STEPS
  payload: A
  meta: {
    steps: Array<StepItem>
  }
}

export declare function steps<R = any>(
  ...args: [
    AnyAction | Array<Promise<any> | PromisableFunction>,
    ...Array<StepItem>
  ]
): StepAction

export default function<S = any>(store: Store<S>): ReturnType<Middleware>