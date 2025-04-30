export type Result<T, E extends Error> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  private constructor(public readonly value: T) {}

  static of<T, E>(value: T): Ok<T, E> {
    return new Ok(value);
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }
}

export class Err<T, E> {
  private constructor(public readonly error: E) {}

  static of<T, E>(error: E): Err<T, E> {
    return new Err(error);
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }
}
