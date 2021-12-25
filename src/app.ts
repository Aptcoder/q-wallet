import express, { Application } from 'express';
import userRouter from './routes/user.routes';
import accountRouter from './routes/account.routes';
import 'reflect-metadata';
import initDb from './loaders/db';

initDb();

const app: Application = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/accounts', accountRouter);

export default app;
