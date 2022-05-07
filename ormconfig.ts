import config from 'config';

export default {
  type: 'postgres',
  host: config.get<string>('dbHost'),
  port: 5432,
  username: config.get<string>('dbUsername'),
  password: config.get<string>('dbPassword'),
  database: config.get<string>('dbName'),
  logging: false,
  entities: [
    'src/entities/**/*.{js,ts}'
  ],
  migrations: [
    'src/migrations/**/*.ts'
  ],
  cli: {
    migrationsDir: 'src/migrations',
    entitiesDir: 'src/entities'
  }
};
