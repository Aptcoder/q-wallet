import config from 'config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface reqWithUser extends Request {
  user?: any
}

export function auth(req: reqWithUser, res: Response, next: NextFunction) {
  const token = req.header('x-auth');
  if (!token) return res.status(403).send('Access Denied. Please supply a token');

  try {
    const decoded = jwt.verify(token, config.get<string>('jwtsecret'));
    req.user = decoded;
    return next();
  } catch (ex) {
    return res.status(403).send('Invalid token supplied');
  }
}

export function authRole(role: string) {
  return (req: reqWithUser, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      if (!user) return res.status(403).send('Not allowed');
      if (user.role !== role) return res.status(403).send('Not allowed');
      return next();
    } catch (err) {
      return res.status(403).send('Not allowed');
    }
  };
}
