import { describe, expect, it } from 'bun:test';
import { Bagel } from './bagel';
import { Router } from './router';

describe('register', () => {
  it('should register a GET / route with 2 handlers', () => {
    const app = new Bagel();
    app.register(
      'GET',
      '/',
      async () => true,
      async () => true,
    );
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].method).toBe('GET');
    expect(app.routes[0].path).toBe('/');
    expect(app.routes[0].handlers.length).toBe(2);
  });
});

describe('get', () => {
  it('should register a GET / route with 2 handlers', () => {
    const app = new Bagel();
    app.get(
      '/',
      async () => true,
      async () => true,
    );
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].method).toBe('GET');
    expect(app.routes[0].path).toBe('/');
    expect(app.routes[0].handlers.length).toBe(2);
  });
});

describe('post', () => {
  it('should register a POST / route with 2 handlers', () => {
    const app = new Bagel();
    app.post(
      '/',
      async () => true,
      async () => true,
    );
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].method).toBe('POST');
    expect(app.routes[0].path).toBe('/');
    expect(app.routes[0].handlers.length).toBe(2);
  });
});

describe('put', () => {
  it('should register a PUT / route with 2 handlers', () => {
    const app = new Bagel();
    app.put(
      '/',
      async () => true,
      async () => true,
    );
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].method).toBe('PUT');
    expect(app.routes[0].path).toBe('/');
    expect(app.routes[0].handlers.length).toBe(2);
  });
});

describe('delete', () => {
  it('should register a DELETE / route with 2 handlers', () => {
    const app = new Bagel();
    app.delete(
      '/',
      async () => true,
      async () => true,
    );
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].method).toBe('DELETE');
    expect(app.routes[0].path).toBe('/');
    expect(app.routes[0].handlers.length).toBe(2);
  });
});

describe('patch', () => {
  it('should register a PATCH / route with 2 handlers', () => {
    const app = new Bagel();
    app.patch(
      '/',
      async () => true,
      async () => true,
    );
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].method).toBe('PATCH');
    expect(app.routes[0].path).toBe('/');
    expect(app.routes[0].handlers.length).toBe(2);
  });
});

describe('options', () => {
  it('should register a PATCH / route with 2 handlers', () => {
    const app = new Bagel();
    app.options(
      '/',
      async () => true,
      async () => true,
    );
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].method).toBe('OPTIONS');
    expect(app.routes[0].path).toBe('/');
    expect(app.routes[0].handlers.length).toBe(2);
  });
});

describe('mount', () => {
  const app = new Bagel();

  const router = new Router();
  router.get('/items', async () => true);
  router.post('/items', async () => true);

  app.mount('/v1', router);

  expect(app.routes.length).toBe(2);
  expect(app.routes[0].method).toBe('GET');
  expect(app.routes[0].path).toBe('/items');
  expect(app.routes[0].handlers.length).toBe(1);
  expect(app.routes[1].method).toBe('POST');
  expect(app.routes[1].path).toBe('/items');
  expect(app.routes[1].handlers.length).toBe(1);
});
