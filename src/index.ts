import express, { Express, Request, Response } from 'express';
import { createServer, Server } from 'http';
import bodyParser from 'body-parser';
import { config as envConfig } from 'dotenv';
import modules from './modules';

envConfig();

const app: Express = express();

const server: Server = createServer(app);

app.use(bodyParser.json());

modules(app);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

const environment = process.env.NODE_ENV;
const PORT: number = parseInt(environment === 'development' ? '9000' : (process.env.PORT || '9000'), 10);

server.listen(PORT, () => console.log(PORT));
