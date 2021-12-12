import config from 'config';
import app from './app';

const PORT: string = config.get<string>('port');

app.listen(PORT, (): void => {
  console.log('server is running at port', PORT);
});
