import { describe, it, expect } from 'bun:test';
import * as test from 'bun:test';
import { Router } from './router';
import { Bagel } from './bagel';

describe('register', () => {
  it('should register a GET / route with 2 handlers', () => {
    const router = new Router();
    router.register(
      'GET',
      '/',
      async () => true,
      async () => true,
    );
    expect(router.routes.length).toBe(1);
    expect(router.routes[0].method).toBe('GET');
    expect(router.routes[0].path).toBe('/');
    expect(router.routes[0].handlers.length).toBe(2);
  });
});

describe('get', () => {
  it('should register a GET / route with 2 handlers', () => {
    const router = new Router();
    router.get(
      '/',
      async () => true,
      async () => true,
    );
    expect(router.routes.length).toBe(1);
    expect(router.routes[0].method).toBe('GET');
    expect(router.routes[0].path).toBe('/');
    expect(router.routes[0].handlers.length).toBe(2);
  });
});

describe('post', () => {
  it('should register a POST / route with 2 handlers', () => {
    const router = new Router();
    router.post(
      '/',
      async () => true,
      async () => true,
    );
    expect(router.routes.length).toBe(1);
    expect(router.routes[0].method).toBe('POST');
    expect(router.routes[0].path).toBe('/');
    expect(router.routes[0].handlers.length).toBe(2);
  });
});

describe('put', () => {
  it('should register a PUT / route with 2 handlers', () => {
    const router = new Router();
    router.put(
      '/',
      async () => true,
      async () => true,
    );
    expect(router.routes.length).toBe(1);
    expect(router.routes[0].method).toBe('PUT');
    expect(router.routes[0].path).toBe('/');
    expect(router.routes[0].handlers.length).toBe(2);
  });
});

describe('delete', () => {
  it('should register a DELETE / route with 2 handlers', () => {
    const router = new Router();
    router.delete(
      '/',
      async () => true,
      async () => true,
    );
    expect(router.routes.length).toBe(1);
    expect(router.routes[0].method).toBe('DELETE');
    expect(router.routes[0].path).toBe('/');
    expect(router.routes[0].handlers.length).toBe(2);
  });
});

describe('patch', () => {
  it('should register a PATCH / route with 2 handlers', () => {
    const router = new Router();
    router.patch(
      '/',
      async () => true,
      async () => true,
    );
    expect(router.routes.length).toBe(1);
    expect(router.routes[0].method).toBe('PATCH');
    expect(router.routes[0].path).toBe('/');
    expect(router.routes[0].handlers.length).toBe(2);
  });
});

describe('options', () => {
  it('should register a PATCH / route with 2 handlers', () => {
    const router = new Router();
    router.options(
      '/',
      async () => true,
      async () => true,
    );
    expect(router.routes.length).toBe(1);
    expect(router.routes[0].method).toBe('OPTIONS');
    expect(router.routes[0].path).toBe('/');
    expect(router.routes[0].handlers.length).toBe(2);
  });
});

describe('mount', () => {
  const router = new Router();
  router.get('/', async () => 'OK');

  const itemsRouter = new Router();
  itemsRouter.get('/', async () => true);

  router.mount('/items', itemsRouter);

  expect(router.routes.length).toBe(2);
  expect(router.routes[0].method).toBe('GET');
  expect(router.routes[0].path).toBe('/');
  expect(router.routes[0].handlers.length).toBe(1);

  expect(router.routes[1].method).toBe('GET');
  expect(router.routes[1].path).toBe('/items');
  expect(router.routes[1].handlers.length).toBe(1);
});

// Temp implementation for now as `afterAll` doesn't seems to work
// So we will listen the server before each test and stop it after each test
describe('listen', () => {
  const app = new Bagel();

  // Disabling TS due to lack of typing from 'bun:test'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  test.beforeEach(() => {
    app.listen(9999);
  });

  it('should return response text', async () => {
    app.get('/response-text', async (req, res) => res.sendStatus(200));

    const response = await fetch('://127.0.0.1:9999/response-text');
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe('OK');

    app.stop();
  });

  it('should return response JSON', async () => {
    app.get('/response-json', async (req, res) => res.json({ hello: 'world' }));

    const response = await fetch('://127.0.0.1:9999/response-json');
    expect(response.status).toBe(200);
    const json = await response.json<Record<string, unknown>>();
    expect(json.hello).toBe('world');

    app.stop();
  });

  it('should parse path params', async () => {
    app.get('/path/:var', async (req, res) => res.json(req.params));

    const response = await fetch('://127.0.0.1:9999/path/hello');
    expect(response.status).toBe(200);
    const json = await response.json<Record<string, unknown>>();
    expect(json.var).toBe('hello');

    app.stop();
  });

  it('should parse query params', async () => {
    app.get('/query', async (req, res) => res.json(req.query));

    const response = await fetch('://127.0.0.1:9999/query?a=1&b=2');
    expect(response.status).toBe(200);
    const json = await response.json<Record<string, unknown>>();
    expect(json.a).toBe('1');
    expect(json.b).toBe('2');

    app.stop();
  });

  it('should parse json body', async () => {
    app.get('/request-json', async (req, res) => res.json(req.body));

    const response = await fetch('://127.0.0.1:9999/request-json', {
      body: JSON.stringify({ hello: 'world' }),
    });
    expect(response.status).toBe(200);
    const json = await response.json<Record<string, unknown>>();
    expect(json.hello).toBe('world');

    app.stop();
  });

  it('should return response with 500 status code', async () => {
    app.get('/e500', async () => {
      throw new Error('error');
    });

    const response = await fetch('://127.0.0.1:9999/e500');
    expect(response.status).toBe(500);

    app.stop();
  });
});
