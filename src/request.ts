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

export type AnyHandler = Handler<any, any, any, any>;

export type Next = () => Promise<any>;

export interface BagelRequestConstructor<
  TPathParams,
  TQueryParams,
  TBodyParams,
> {
  method: Method;
  path: string;
  url: string;
  headers: Record<string, any>;
  params: TPathParams;
  query: TQueryParams;
  body: TBodyParams;
}

export class BagelRequest<
  TPathParams = Record<string, any>,
  TQueryParams = Record<string, any>,
  TBodyParams = Record<string, any>,
> {
  public readonly method: Method;
  public readonly path: string;
  public readonly url: string;
  public readonly headers: Record<string, any>;
  public readonly params: TPathParams;
  public readonly query: TQueryParams;
  public readonly body: TBodyParams;

  constructor(
    options: BagelRequestConstructor<TPathParams, TQueryParams, TBodyParams>,
  ) {
    this.method = options.method;
    this.path = options.path;
    this.url = options.url;
    this.headers = options.headers;
    this.params = options.params;
    this.query = options.query;
    this.body = options.body;
  }

  static async from(req: Request, params: object): Promise<BagelRequest> {
    const { searchParams, pathname } = new URL(req.url);

    const body = await req.json();

    if (body instanceof Error) {
      throw body;
    }

    return new BagelRequest({
      method: req.method as Method,
      path: normalizeURLPath(pathname),
      url: req.url,
      query: Object.fromEntries(searchParams.entries()),
      params,
      body: body as Record<string, any>,
      headers: Object.fromEntries(req.headers.entries()),
    });
  }
}
