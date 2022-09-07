# Bagel

Bagel is a tiny and expressive web framework for Bun.js for building web APIs.

Inspired by Express.js and Koa.js.

Here we treat **Typescript** as first class citizen, hence every request handler supports **generic** and you may specify your own typing of request params, query, body and response body.

## Example

```typescript
import { Bagel, Router } from 'bagel-js'; // Haven't published yet

// Create a router
const router = new Router();
// Register a route
router.get('/', (req, res) => res.send('Hello from Bagel.js'));

// Create server
const app = new Bagel();
// Mount router to the server
app.mount('/v1', router);

const port = 3000;
// Listen to port 3000
app.listen(port, () => console.info('App is running on port', port));
```
