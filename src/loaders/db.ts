import { createConnection, Connection } from 'typeorm';
import config from 'config';
import path from 'path';

const entityPath = path.resolve(__dirname, '..', 'entities');

export default (): Promise<void | Connection> => createConnection({
  name: 'q-wallet',
  type: 'postgres',
  host: config.get<string>('dbHost'),
  port: 5432,
  username: config.get<string>('dbUsername'),
  password: config.get<string>('dbPassword'),
  database: config.get<string>('dbName'),
  entities: [
    `${entityPath}/*.js`,
    `${entityPath}/*.ts`
  ],
  synchronize: true,
  logging: false
})
  .then(() => {
    console.log('Sucessfully connected to db');
  })
  .catch((err) => {
    console.log('Could not connect to db', err);
    process.exit();
  });
