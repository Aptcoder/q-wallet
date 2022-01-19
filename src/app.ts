/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, {
  Application, NextFunction, Request, Response
} from 'express';
import userRouter from './routes/user.routes';
import { accountRouter, accountsRouter } from './routes/account.routes';
import paymenthook from './paymenthook';
import 'reflect-metadata';
import initDb from './loaders/db';

initDb();

const app: Application = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/accounts', accountsRouter);
app.use('/account', accountRouter);
app.post('/payment-hook', paymenthook);

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
