import { Bagel } from '../src';

const app = new Bagel({
  error: async (res, err) => {
    return res.status(400).json({ error: 'Bad request' });
  },
});

app.get('/error', async () => {
  throw new Error('Some error');
});

app.listen(3000);
