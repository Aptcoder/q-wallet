import { Request } from 'express';
import ServiceError from './service.error';

export type errorType = ServiceError | Error;

export interface reqWithUser extends Request {
  user?: any
}
