# Bagel

Bagel is a tiny and expressive web framework for Bun.js for building web APIs.

Inspired by Express.js and Koa.js.

Here we treat **Typescript** as first class citizen, hence every request handler supports **generic** and you may specify your own typing of request params, query, body and response body.

## Features
✅ Routing

✅ Middlewares

✅ JSON parsing

✅ Strongly typed route handlers

## Examples

### Basic

```typescript
import { Bagel, Router } from 'bagel-js'; // Haven't published yet

const app = new Bagel();

app.get('/', async (req, res) => res.send('Hello from Bagel.js!'));

app.listen(3000);
```

### Router
```typescript
import { Bagel, Router } from 'bagel-js'; // Haven't published yet

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
import { Bagel, Router } from 'bagel-js'; // Haven't published yet

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
import { Bagel, Handler } from 'bagel-js'; // Haven't published yet

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
