import { Response, Request } from 'express';

export default (req: Request, res: Response) => {
  console.log('req.body', req.body);
  res.send('Got you');
};
