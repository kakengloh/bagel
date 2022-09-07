import { Handler, Method } from './request';
import { normalizeURLPath } from './utils/common';

export type RouteHandlers = Map<string, Handler[]>;

export class Router {
  public readonly handlers: RouteHandlers;
  private readonly middlewares: Handler[];

  constructor() {
    this.handlers = new Map();
    this.middlewares = [];
  }

  use(...middlewares: Handler[]): Router {
    // Store middlewares
    this.middlewares.push(...middlewares);

    // Append middlewares to existing routes
    this.handlers.forEach((handlers, key) => {
      this.handlers.set(key, [...handlers, ...middlewares]);
    });

    return this;
  }

  get(path: string, ...handlers: Handler[]): Router {
    this.register('GET', path, ...this.middlewares, ...handlers);
    return this;
  }

  post(path: string, ...handlers: Handler[]): Router {
    this.register('POST', path, ...this.middlewares, ...handlers);
    return this;
  }

  put(path: string, ...handlers: Handler[]): Router {
    this.register('PUT', path, ...this.middlewares, ...handlers);
    return this;
  }

  delete(path: string, ...handlers: Handler[]): Router {
    this.register('DELETE', path, ...this.middlewares, ...handlers);
    return this;
  }

  patch(path: string, ...handlers: Handler[]): Router {
    this.register('PATCH', path, ...this.middlewares, ...handlers);
    return this;
  }

  options(path: string, ...handlers: Handler[]): Router {
    this.register('OPTIONS', path, ...this.middlewares, ...handlers);
    return this;
  }

  register(method: Method, path: string, ...handlers: Handler[]) {
    this.handlers.set(`${method} ${normalizeURLPath(path)}`, handlers);
  }
}
