/** Returns a function that logs a value with a given message */
export declare function log(text: string): (value: any) => void;

/** Wraps a value in an object and stores it the `payload` field */
export declare function payload_<P>(payload: P): {payload: P};

/** Wraps a value in an object and stores it the `payload` field */
export declare function compose_<State>(fns: Array<(s: State) => State>): (s: State) => State;

/** TBA */
export declare function apply_<State, P>(
  updater: (s: State, p: P) => State,
  payload: P
): (s: State) => State;

/** TBA */
export declare function pick_<State, Prop extends keyof State>(
  prop: Prop
): (fn: (p: State[Prop]) => State[Prop]) => (state: State) => State;

/** Returns a reducer function that merges props with state */
export declare function merge_<State, Props>(object: Props): (state: State) => State & Props;

export declare function pickKepler_<X>(fn: (x: X) => X): (s: {keplerGL: {map: X}}) => {keplerGL: {map: X}};

export declare function swap_<X>(item: X): (arr: X[]) => X[];

export declare function findById<X>(id: string): (arr: X[]) => X | undefined;

export declare function with_<State>(fn: (state: State) => State): (state: State) => State;

export declare function if_(pred: boolean, fn: (state: State) => State): (state: State) => State;
