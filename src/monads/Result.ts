import { Variant } from "../utils/Variant";

interface Ok<R> extends Variant {
  tag: "Ok";
  value: R;
}

interface Err<E> extends Variant {
  tag: "Err";
  reason: E;
}

export type Result<R, E> = Ok<R> | Err<E>;

export namespace Result {
  export type t<R, E> = Result<R, E>;

  export const Ok: <R = never, E = never>(r: R) => Result<R, E> = (r) => ({
    tag: "Ok",
    value: r,
  });

  export const Err: <R = never, E = never>(e: E) => Result<R, E> = (e) => ({
    tag: "Err",
    reason: e,
  });

  export const fromTryCatch: <R, Error>(fn: () => R) => Result<R, Error> = (
    fn
  ) => {
    try {
      const res = fn();
      return Ok(res);
    } catch (e: any) {
      return Err(e);
    }
  };

  export const map: <R, E, T>(
    fn: (v: R) => T,
    val: Result<R, E>
  ) => Result<T, E> = (fn, val) => {
    switch (val.tag) {
      case "Ok":
        return Ok(fn(val.value));
      case "Err":
        return val;
    }
  };

  export const bind: <R, E, T>(
    fn: (v: R) => Result<T, E>,
    val: Result<R, E>
  ) => Result<T, E> = (fn, val) => {
    switch (val.tag) {
      case "Ok":
        return fn(val.value);
      case "Err":
        return val;
    }
  };
}

export const succeed: <R = never, E = never>(r: R) => Result<R, E> = (r) =>
  Result.Ok(r);

export const fail: <R = never, E = never>(e: E) => Result<R, E> = (e) =>
  Result.Err(e);

export const tryCatch: <R, Error>(fn: () => R) => Result<R, Error> = (fn) =>
  Result.fromTryCatch(fn);
