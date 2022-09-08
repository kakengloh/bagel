import { Bagel } from '../src';

const app = new Bagel();

app.get('/', async (req, res) => res.send('Hello from Bagel.js!'));

app.listen(3000);
