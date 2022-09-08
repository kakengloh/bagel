import { normalizeURLPath } from './utils/common';
import { BagelResponse } from './response';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export type Handler<
  TPathParams = Record<string, any>,
  TQueryParams = Record<string, any>,
  TRequestBody = Record<string, any>,
  TResponseBody = Record<string, any>,
> = (
  req: BagelRequest<TPathParams, TQueryParams, TRequestBody>,
  res: BagelResponse<TResponseBody>,
  next: Next,
) => Promise<any>;

export type Next = () => Promise<any>;

export class BagelRequest<
  TPathParams = Record<string, any>,
  TQueryParams = Record<string, any>,
  TBodyParams = Record<string, any>,
> {
  public readonly method: Method;
  public readonly path: string;
  public readonly headers: Record<string, any>;
  public readonly params: TPathParams;
  public readonly query: TQueryParams;
  public readonly body: TBodyParams;

  constructor() {
    throw new Error('Constructor should not be called directly');
  }

  static async from(req: Request): Promise<BagelRequest> {
    const { searchParams, pathname } = new URL(req.url);

    return {
      method: req.method as Method,
      path: normalizeURLPath(pathname),
      query: Object.fromEntries(searchParams.entries()),
      params: {},
      body: await req.json(),
      headers: Object.fromEntries(req.headers.entries()),
    };
  }
}
