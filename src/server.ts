import config from 'config';
import express from 'express';
import * as loader from './loaders';

const PORT: string = config.get<string>('port');

async function startServer(){
  const app = express()
  await loader.init({ expressApp: app })

  app.listen(PORT, (): void => {
    console.log('server is running at port', PORT);
  });

}

startServer()