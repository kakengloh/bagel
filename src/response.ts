export class BagelResponse<TResponseBody = Record<string, any>> {
  private opts: ResponseInit;
  private response: Response | undefined;

  constructor() {
    this.opts = {};
  }

  done() {
    return this.response ?? new Response('');
  }

  status(code: number): BagelResponse<TResponseBody> {
    this.opts.status = code;
    return this;
  }

  option(opts: ResponseInit): BagelResponse<TResponseBody> {
    this.opts = opts;
    return this;
  }

  json(body: TResponseBody): void {
    if (this.response) {
      throw new Error('Response is already set');
    }
    this.response = Response.json(body, this.opts);
  }

  send(body: string): void {
    if (this.response) {
      throw new Error('Response is already set');
    }
    this.response = new Response(body, this.opts);
  }

  sendStatus(code: number): void {
    if (this.response) {
      throw new Error('Response is already set');
    }

    this.response = new Response('OK', {
      ...this.opts,
      status: code,
    });
  }
}
