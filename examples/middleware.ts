import { Bagel } from '../src';

const app = new Bagel();

app.use(async (req, res, next) => {
  console.log('Before');
});

app.get('/', async (req, res) => res.send('Hello from Bagel.js!'));

app.use(async (req, res, next) => {
  console.log('After');
});

app.listen(3000);
