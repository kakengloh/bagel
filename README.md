<h1>
  <img width="40" align="left" alt="Bagel.js logo" src="https://user-images.githubusercontent.com/40446720/189159247-721df1ee-4dae-44bf-8693-257d0b78c576.svg" />
  <span>Bagel</span>
</h1>

**Bagel** is a tiny and expressive web framework for [Bun.js](https://bun.sh/) for building web APIs.

Inspired by [Express.js](https://expressjs.com/) and [Koa.js](https://koajs.com/).

Here we treat **Typescript** as first class citizen, hence every request handler supports **generic** and you may specify your own typing of request params, query, body and response body.

## Contents

- [Features](#features)
- [Examples](#examples)
- [Benchmark](#benchmark)

## Features

✅ Routing

✅ Middlewares

✅ JSON parsing

✅ Strongly typed route handlers

## Installation

```bash
bun add @kakengloh/bagel
```

## Examples

### Basic

```typescript
import { Bagel, Router } from '@kakengloh/bagel';

const app = new Bagel();

app.get('/', async (req, res) => res.send('Hello from Bagel.js!'));

app.listen(3000);
```

### Router

```typescript
import { Bagel, Router } from '@kakengloh/bagel';

// Create items router
const items = new Router();
items.get('/', async (req, res) => res.json({ items: [] }));

// Create v1 router
const v1 = new Router();
// Mount items router to v1 router
v1.mount('/items', items);

const app = new Bagel();

// Mount v1 router to app
app.mount('/v1', v1);

app.listen(3000);
```

### Middleware

```typescript
import { Bagel, Router } from '@kakengloh/bagel';

const app = new Bagel();

// Before middleware
app.use(async (req, res, next) => {
  console.log('Before');
});

// Route handler
app.get('/', async (req, res) => res.send('Hello from Bagel.js!'));

// After middleware
app.use(async (req, res, next) => {
  console.log('After');
});

app.listen(3000);
```

### Strong typing

```typescript
import { Bagel, Handler } from '@kakengloh/bagel';

// Entity
interface Bread {
  bakeryId: string;
  name: string;
  price: number;
}

// Path parameters
interface PathParams {
  bakeryId: string;
}

// Query parameters
type QueryParams = Record<string, unknown>;

// Request body
type RequestBody = Bread;

// Response body
interface ResponseBody {
  bread: Bread;
}

// Route handler with all types specified
const createBread: Handler<
  PathParams,
  QueryParams,
  RequestBody,
  ResponseBody
> = async (req, res) => {
  const { name, price } = req.body; // Typed inferred
  const { bakeryId } = req.params; // Typed inferred

  const bread: Bread = {
    bakeryId,
    name,
    price,
  };

  return res.json({ bread }); // Typed checked
};

const app = new Bagel();
app.post('/bakeries/:bakeryId/breads', createBread);

app.listen(3000);
```

### Error handling

```typescript
import { Bagel } from '@kakengloh/bagel';

const app = new Bagel({
  // Every error thrown will go through this function
  // Here you can return a custom response
  error: async (res, err) => {
    return res.status(400).json({ error: 'Bad request' });
  },
});

app.get('/error', async () => {
  throw new Error('Some error');
});

app.listen(3000);
```

## Benchmark

Below is a simple benchmark of **Bagel.js** and **Express.js** conducted on my machine using [autocannon](https://github.com/mcollina/autocannon) (12 threads, 500 concurrent connections, 10 seconds)

> The output shows that Bagel.js can handle ~2.67x more requests than Express.js

<img width="612" alt="Screenshot 2022-09-09 at 9 19 02 PM" src="https://user-images.githubusercontent.com/40446720/189360153-4178e19d-0d80-40b0-ad2e-404bec214e8b.png">
<img width="602" alt="Screenshot 2022-09-09 at 9 15 42 PM" src="https://user-images.githubusercontent.com/40446720/189360193-f5a68eb0-535b-4f0d-bde0-0cf680477fac.png">
