import { Errorlike, ServeOptions, Server } from 'bun';
import { Router } from './router';
import { AnyHandler, BagelRequest, Handler, Method } from './request';
import { BagelResponse } from './response';
import { normalizeURLPath } from './utils/common';
import { Route } from './route';
import * as logger from './utils/logger';

type ListenCallback = (err?: Errorlike) => void;

interface BagelOptions {
  error?: (res: BagelResponse, err: Errorlike) => Promise<any>;
}

export class Bagel {
  private readonly opts: BagelOptions;
  public readonly routes: Route[];
  private readonly middlewares: Handler[];
  private server?: Server;

  constructor(opts: BagelOptions = {}) {
    this.opts = opts;
    this.routes = [];
    this.middlewares = [];
  }

  use(...middlewares: AnyHandler[]): Bagel {
    // Store middlewares
    this.middlewares.push(...middlewares);

    // Append middlewares to existing routes
    this.routes.forEach((route) => {
      route.addHandlers(...middlewares);
    });

    return this;
  }

  get(path: string, ...handlers: AnyHandler[]): Bagel {
    this.register('GET', path, ...this.middlewares, ...handlers);
    return this;
  }

  post(path: string, ...handlers: AnyHandler[]): Bagel {
    this.register('POST', path, ...this.middlewares, ...handlers);
    return this;
  }

  put(path: string, ...handlers: AnyHandler[]): Bagel {
    this.register('PUT', path, ...this.middlewares, ...handlers);
    return this;
  }

  delete(path: string, ...handlers: AnyHandler[]): Bagel {
    this.register('DELETE', path, ...this.middlewares, ...handlers);
    return this;
  }

  patch(path: string, ...handlers: AnyHandler[]): Bagel {
    this.register('PATCH', path, ...this.middlewares, ...handlers);
    return this;
  }

  options(path: string, ...handlers: AnyHandler[]): Bagel {
    this.register('OPTIONS', path, ...this.middlewares, ...handlers);
    return this;
  }

  register(method: Method, path: string, ...handlers: AnyHandler[]): Bagel {
    this.routes.push(new Route(method, path, handlers));
    return this;
  }

  mount(prefix: string, router: Router): Bagel {
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

  listen(port: number, callback?: ListenCallback) {
    const fetch: ServeOptions['fetch'] = async (req) => {
      const { pathname } = new URL(req.url);

      // Find matching route
      const route = this.routes.find((route) =>
        route.match(req.method as Method, pathname),
      );

      // Return 404 if there is no handlers for the route
      if (!route) {
        return new Response('Not found', { status: 404 });
      }

      const { handlers } = route;

      // Construct Bagel Request from Bun Request
      const bagelRequest = await BagelRequest.from(req, route.params(pathname));
      // Initialize Bagel Response instance
      const bagelResponse = new BagelResponse();

      // Execute endpoint handlers
      let index = 0;
      while (index < handlers.length) {
        const next = async () => {
          const handler = handlers[index++];
          if (!handler) return;
          await handler(bagelRequest, bagelResponse, next);
        };

        await next();
      }

      return bagelResponse.done();
    };

    const error: ServeOptions['error'] = (err: Errorlike) => {
      logger.error(err);

      // Default status 500
      const bagelResponse = new BagelResponse().status(500);
      bagelResponse.send('');

      // Run custom error function if exists
      if (this.opts.error) {
        this.opts.error?.(bagelResponse, err);
        return bagelResponse.done();
      }

      return bagelResponse.done();
    };

    this.server = Bun.serve({
      port,
      fetch,
      error,
    });

    logger.info(`Bun is running on port ${port} (Press CTRL+C to quit)`);

    callback?.();
  }

  stop() {
    if (!this.server) {
      console.warn('Server has not started yet');
      return;
    }
    this.server.stop();
  }
}
