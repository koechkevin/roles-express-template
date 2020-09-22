import express, { Router } from 'express';
import { validationMiddleware } from '../../middlewares/joiValidator';
import { checkPath, loginSchema, registrationSchema } from './schema';
import { getAllUsers, getUserProfile, login, register, validateUserName } from './auth';
import { tokenMiddleware } from '../../middlewares/tokenValidator';
import { checkUserPermissionByEndpoint, checkPermission } from '../../middlewares/roleValidator';
import { CHECK_PERMISSION, GET_USER, GET_USERS, LOGIN_URL, REGISTER_URL } from '../config';

const auth: Router = express.Router();

auth.post(REGISTER_URL, validationMiddleware(registrationSchema, 'body'), validateUserName, register);
auth.post(LOGIN_URL, validationMiddleware(loginSchema, 'body'), login);
auth.get(
  CHECK_PERMISSION,
  tokenMiddleware,
  validationMiddleware(checkPath, 'query'),
  checkUserPermissionByEndpoint,
  (req, res) => res.status(200).json({}),
);
auth.get(GET_USER, tokenMiddleware, getUserProfile);
auth.get(GET_USERS, tokenMiddleware, checkPermission, getAllUsers);

export default auth
