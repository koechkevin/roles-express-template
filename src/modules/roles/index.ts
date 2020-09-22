import express, { Router } from 'express';
import {
  createPermission,
  createRole,
  deleteRole,
  getFrontendPermissions,
  getRoles,
  updateRole,
} from './roles';
import { addPermission, rolesSchema, roleUpdateSchema } from './schema';
import { validationMiddleware } from '../../middlewares/joiValidator';
import { tokenMiddleware } from '../../middlewares/tokenValidator';
import { checkPermission } from '../../middlewares/roleValidator';
import {
   ADD_PERMISSION,
  CREATE_USER_ROLE,
  DELETE_USER_ROLE,
  GET_FRONTEND_PERMISSIONS,
  GET_ROLES,
  UPDATE_USER_ROLE,
} from '../config';

const roles: Router = express.Router();

roles.get(GET_ROLES, tokenMiddleware, checkPermission, getRoles);

roles.post(CREATE_USER_ROLE, tokenMiddleware, checkPermission, validationMiddleware(rolesSchema, 'body'), createRole);

roles.patch(
  UPDATE_USER_ROLE,
  tokenMiddleware,
  checkPermission,
  validationMiddleware(roleUpdateSchema, 'query'),
  validationMiddleware(rolesSchema, 'body'),
  updateRole,
);

roles.delete(
  DELETE_USER_ROLE,
  tokenMiddleware,
  checkPermission,
  validationMiddleware(roleUpdateSchema, 'query'),
  deleteRole,
);

roles.post(
  ADD_PERMISSION,
  tokenMiddleware,
  checkPermission,
  validationMiddleware(addPermission, 'body'),
  createPermission,
);

roles.get(GET_FRONTEND_PERMISSIONS, tokenMiddleware, checkPermission,getFrontendPermissions);

export default roles;
