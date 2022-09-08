import { Bagel, Router } from '../src';

const items = new Router();
items.get('/', async (req, res) => res.json({ items: [] }));

const v1 = new Router();
v1.mount('/items', items);

const app = new Bagel();
app.mount('/v1', v1);

app.listen(3000);
