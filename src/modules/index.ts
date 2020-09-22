import { Express, Router } from 'express';
import roles from './roles';
import auth from './authentication';

const baseUrl = `/api`;
const modules: Router[] = [roles, auth];

export default (app: Express): Express => {
  modules.forEach((module: Router) => {
    app.use(baseUrl, module);
  });
  return app;
};
