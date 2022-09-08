import { Bagel, Handler } from '../src';

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
