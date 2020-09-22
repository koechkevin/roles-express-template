import { NextFunction, Request, Response } from 'express';
import models from '../database/models';

export const checkPermission = async (req: Request, res: Response, next: NextFunction) => {
  const {  id }: any = req.app.locals.userData;
  const user = await models['user'].findOne({
    where: { id },
    include: [
      {
        model: models['role'],
        as: 'role',
        include: [{
          model: models['permission'],
          as: 'permissions'
        }]
      },
    ],
  });
  if (user.role.id === 1) {
    return next();
  }

  if (user?.role) {
    const { permissions: permissionObject } = user?.role;
    const permissions = permissionObject?.map((permission: any) => permission.endpoint);
    if (permissions?.includes(req.route.path)) {
      return next();
    }
  }
  res.status(403).json({ path: req.route.path, error: `You are not authorized to access ${req.route.path}` });
};

export const checkUserPermissionByEndpoint = (req: Request, res: Response, next: NextFunction) => {
  const { path } = req.query;
  req.route.path = path;
  return checkPermission(req, res, next);
};
