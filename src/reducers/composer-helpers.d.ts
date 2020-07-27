/** Returns a function that logs a value with a given message */
declare export function log(text: string): (value: any) => void;

/** Wraps a value in an object and stores it the `payload` field */
declare export function payload_<P>(payload: P): {payload: P};

/** Wraps a value in an object and stores it the `payload` field */
declare export function compose_<State>(fns: Array<(s: State) => State>): (s: State) => State;

/** TBA */
declare export function apply_<State, P>(
  updater: (s: State, p: P) => State,
  payload: P
): (s: State) => State;

/** TBA */
declare export function pick_<State, Prop extends keyof State>(
  prop: Prop
): (fn: (p: State[Prop]) => State[Prop]) => (state: State) => State;

/** Returns a reducer function that merges props with state */
declare export function merge_<State, Props>(
  object: Props
): (state: State) => State & Props;

declare export function pickKepler_<X>(fn: (x: X) => X): (s: {keplerGL: {map: X}}) => {keplerGL: {map: X}}

/** TBA */
declare export function swap_<X>(item: X): (arr: X[]) => X[]

/** TBA */
declare export function findById<X>(id: string): (arr: X[]) => X | undefined

/** TBA */
declare export function with_<State>(fn: (state: State) => State): (state: State) => State;

/** TBA */
declare export function if_(pred: boolean, fn: (state: State) => State): (state: State) => State;

