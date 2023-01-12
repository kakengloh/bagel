import { Route } from './route';
import { AnyHandler, Handler, Method } from './request';
import { normalizeURLPath } from './utils/common';

export class Router {
  public readonly routes: Route[];
  private readonly middlewares: Handler[];

  constructor() {
    this.routes = [];
    this.middlewares = [];
  }

  use(...middlewares: AnyHandler[]): Router {
    // Store middlewares
    this.middlewares.push(...middlewares);

    // Append middlewares to existing routes
    this.routes.forEach((route) => {
      route.addHandlers(...middlewares);
    });

    return this;
  }

  get(path: string, ...handlers: AnyHandler[]): Router {
    this.register('GET', path, ...this.middlewares, ...handlers);
    return this;
  }

  post(path: string, ...handlers: AnyHandler[]): Router {
    this.register('POST', path, ...this.middlewares, ...handlers);
    return this;
  }

  put(path: string, ...handlers: AnyHandler[]): Router {
    this.register('PUT', path, ...this.middlewares, ...handlers);
    return this;
  }

  delete(path: string, ...handlers: AnyHandler[]): Router {
    this.register('DELETE', path, ...this.middlewares, ...handlers);
    return this;
  }

  patch(path: string, ...handlers: AnyHandler[]): Router {
    this.register('PATCH', path, ...this.middlewares, ...handlers);
    return this;
  }

  options(path: string, ...handlers: AnyHandler[]): Router {
    this.register('OPTIONS', path, ...this.middlewares, ...handlers);
    return this;
  }

  register(method: Method, path: string, ...handlers: AnyHandler[]) {
    this.routes.push(new Route(method, path, handlers));
  }

  mount(prefix: string, router: Router): Router {
    router.routes.forEach((route) => {
      this.register(
        route.method,
        normalizeURLPath(prefix + route.path),
        ...this.middlewares,
        ...route.handlers,
      );
    });

    return this;
  }
}
