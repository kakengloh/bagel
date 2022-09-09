import { describe, it, expect } from 'bun:test';
import { Router } from './router';

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
