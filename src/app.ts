import express, { Application } from 'express';
import userRouter from './controllers/routes/user.routes';
import 'reflect-metadata';
import initDb from './loaders/db';

initDb();

const app: Application = express();

app.use('/users', userRouter);

export default app;
