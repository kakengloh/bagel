import { pathToRegexp, match } from 'path-to-regexp';
import { Handler, Method } from './request';

export class Route {
  constructor(
    public readonly method: Method,
    public readonly path: string,
    public readonly handlers: Handler[],
  ) {
    match(path);
  }

  addHandlers(...handlers: Handler[]) {
    this.handlers.push(...handlers);
  }

  match(method: Method, path: string): boolean {
    if (this.method !== method) {
      return false;
    }

    return pathToRegexp(this.path).test(path);
  }

  params(path: string) {
    const fn = match(this.path, { decode: decodeURIComponent });
    const result = fn(path);

    if (typeof result === 'boolean' || !('params' in result)) {
      throw new Error('Failed to parse path params');
    }

    return result.params;
  }
}
