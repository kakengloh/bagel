import { Errorlike, ServeOptions } from 'bun';
import { RouteHandlers, Router } from './router';
import { BagelRequest, Handler, Method } from './request';
import { BagelResponse } from './response';
import { normalizeURLPath } from './utils/common';

type ListenCallback = (err?: Errorlike) => void;

interface BagelOptions {
  onError?: (err: Errorlike) => any;
}

export class Bagel {
  private readonly opts: BagelOptions;
  private readonly handlers: RouteHandlers;
  private readonly middlewares: Handler[];

  constructor(opts: BagelOptions = {}) {
    this.opts = opts;
    this.handlers = new Map();
    this.middlewares = [];
  }

  use(middlewares: Handler[]): Bagel {
    // Store middlewares
    this.middlewares.push(...middlewares);

    // Append middlewares to existing routes
    this.handlers.forEach((handlers, key) => {
      this.handlers.set(key, [...handlers, ...middlewares]);
    });

    return this;
  }

  get(path: string, ...handlers: Handler[]): Bagel {
    this.register('GET', path, ...this.middlewares, ...handlers);
    return this;
  }

  post(path: string, ...handlers: Handler[]): Bagel {
    this.register('POST', path, ...this.middlewares, ...handlers);
    return this;
  }

  put(path: string, ...handlers: Handler[]): Bagel {
    this.register('PUT', path, ...this.middlewares, ...handlers);
    return this;
  }

  delete(path: string, ...handlers: Handler[]): Bagel {
    this.register('DELETE', path, ...this.middlewares, ...handlers);
    return this;
  }

  patch(path: string, ...handlers: Handler[]): Bagel {
    this.register('PATCH', path, ...this.middlewares, ...handlers);
    return this;
  }

  options(path: string, ...handlers: Handler[]): Bagel {
    this.register('OPTIONS', path, ...this.middlewares, ...handlers);
    return this;
  }

  register(method: Method, path: string, ...handlers: Handler[]): Bagel {
    this.handlers.set(`${method} ${normalizeURLPath(path)}`, handlers);
    return this;
  }

  mount(prefix: string, router: Router): Bagel {
    router.handlers.forEach((handlers, key) => {
      const [method, path] = key.split(' ');
      const newKey = `${method} ${normalizeURLPath(prefix + path)}`;
      this.handlers.set(newKey, [...this.middlewares, ...handlers]);
    });
    return this;
  }

  listen(port: number, callback?: ListenCallback) {
    const fetch: ServeOptions['fetch'] = async (req) => {
      // Construct Bagel Request from Bun Request
      const bagelRequest = await BagelRequest.from(req);

      // Initialize Bagel Response instance
      const bagelResponse = new BagelResponse();

      // Get route handlers
      const key = `${bagelRequest.method} ${bagelRequest.path}`;
      const handlers = this.handlers.get(key);

      // Return 404 if there is no handlers for the route
      if (!handlers) {
        return new Response('Not found', { status: 404 });
      }

      // Execute endpoint handlers
      for (const handler of handlers) {
        await handler(bagelRequest, bagelResponse);
      }

      return bagelResponse.done();
    };

    const error: ServeOptions['error'] = (err: Errorlike) => {
      const body: BlobPart = this.opts.onError?.(err) ?? err;
      return new Response(body);
    };

    Bun.serve({
      port,
      fetch,
      error,
    });

    callback?.();
  }
}
