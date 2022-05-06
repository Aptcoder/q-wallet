/* eslint-disable max-classes-per-file */

export class APIError {
  public status;

  public message;

  public data;

  public meta;

  constructor(message: string, status: number, data = {}, meta: object | null = null) {
    this.message = message;
    this.status = status;
    this.data = data;
    this.meta = meta;
  }
}

export class NotFoundError extends APIError {
  constructor(message: string, data = {}, meta: object | null = null) {
    super(message, 404);
    this.data = data;
    this.meta = meta;
  }
}
