import { describe, expect, it } from 'bun:test';
import sinon from 'sinon';
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

describe('use', () => {
  it('should run middlewares', async () => {
    const app = new Bagel();

    const fn = () => null;

    const spy = sinon.spy(fn);

    app.use(async (req, res, next) => {
      spy();
      next();
    });

    app.get('/', async (_, res) => res.send('OK'));

    app.listen(9999);

    const response = await fetch('http://localhost:9999');

    expect(await response.text()).toBe('OK');
    expect(spy.calledOnce).toBeTruthy();

    app.stop();
  });
});

describe('options', () => {
  it('should register an OPTIONS / route with 2 handlers', () => {
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
  it('should mount sub router', () => {
    const app = new Bagel();

    const router = new Router();
    router.get('/items', async () => true);
    router.post('/items', async () => true);

    app.mount('/v1', router);

    expect(app.routes.length).toBe(2);
    expect(app.routes[0].method).toBe('GET');
    expect(app.routes[0].path).toBe('/v1/items');
    expect(app.routes[0].handlers.length).toBe(1);

    expect(app.routes[1].method).toBe('POST');
    expect(app.routes[1].path).toBe('/v1/items');
    expect(app.routes[1].handlers.length).toBe(1);
  });

  it('should call middlewares for subrouter', async () => {
    const app = new Bagel();
    const spy = sinon.spy(() => null);

    app.use(async (req, res, next) => {
      spy();
      next();
    });

    const router = new Router();
    router.get('/items', async (_, res) => res.send('OK'));
    router.get('/users', async (_, res) => res.send('OK'));
    app.mount('/v1', router);
    app.listen(1006);

    const response = await fetch('http://localhost:1006/v1/items');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('OK');
    expect(spy.calledOnce).toBeTruthy();

    app.stop();
  });
});
