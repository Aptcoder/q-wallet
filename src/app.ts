/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, {
  Application, NextFunction, Request, Response
} from 'express';
import paymenthook from './paymenthook';
import 'reflect-metadata';
import initDb from './loaders/db';
initDb();

console.log('here')
import apiRouter from './routes/api/api.routes';

const app: Application = express();

app.use(express.json());

app.use('/api', apiRouter)


app.use('*', (req, res) => res.send({
  status: 'failed',
  message: 'Endpoint not found',
  data: {}
}));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('err', err);
  res.status(err.status || 500).send({
    status: 'failed',
    message: 'Something unexpected happened'
  });
});
export default app;
