import { Request, Response } from 'express';
import models from '../../database/models';
import { RoleModel } from './role.interfaces';
import { Op } from 'sequelize';

export const paginate = (array: any[], pageSize: any, pageNumber: any) => {
  const page = pageNumber - 1;
  const pageCount = Math.ceil(array.length / pageSize);
  return { data: array.slice(page * pageSize, pageNumber * pageSize), pageCount };
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const roleData: RoleModel = req.body;
    const role = await models['role'].create(roleData);
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ message: 'possible server error', error });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    let { id, permissions, page, limit, ...restQuery } = query;
    const searchParams: any = {};
    Object.keys(restQuery).forEach((searchParam: string) => {
      searchParams[searchParam] = {
        [Op.iLike]: `%${query[searchParam]}%`,
      };
    });

    const roles = await models['role'].findAll({
      where: {
        id: id || { [Op.not]: null },
        ...searchParams,
      },
      include: [
        {
          model: models['user'],
          as: 'users',
          attributes: { exclude: ['password'] },
        },
        {
          model: models['permission'],
          as: 'permissions',
        },
      ],
      order: [['id', 'DESC']],
    });
    page = Number(query.page || '1') as any;
    limit = Number(query.limit) || roles.length;

    const { data, pageCount } = paginate(roles, limit, page);
    res.status(200).json({ roles: data, pagination: { current: page, pageCount, total: roles.length } });
  } catch (error) {
    res.status(400).json({ message: 'possible server error', error });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const roleData: Partial<RoleModel> = req.body;
    const { id } = req.query;
    const didUpdate = await models['role'].update(roleData, { where: { id } });
    if (didUpdate[0]) {
      const role = await models['role'].findOne({
        where: { id },
        include: [
          {
            model: models['user'],
            as: 'users',
            attributes: { exclude: ['password'] },
          },
          {
            model: models['permission'],
            as: 'permissions',
          },
        ],
      });
      return res.status(200).json(role);
    }
    res.status(404).json({ message: 'No Role was updated' });
  } catch (error) {
    res.status(400).json({ message: 'possible server error', error });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const didDestroy = await models['role'].destroy({ where: { id } });
    if (didDestroy) {
      return res.status(200).json({});
    }
    return res.status(404).json({ message: 'no record was deleted' });
  } catch (error) {
    res.status(400).json({ message: 'possible server error', error });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  try {
    const { roleId, endpoint } = req.body;
    const exists = await models['permission'].findOne({ where: { roleId, endpoint }});
    if (exists) {
      return res.status(422).json({ message: `Permission "${req.body.name}" Already exists`})
    }
    const created = await models['permission'].create(req.body);
    const permissions = await models['permission'].findOne({
      where: { id: created.id },
      include: [
        {
          model: models['role'],
          as: 'role',
        },
      ],
    });
    res.status(200).json({ permissions });
  } catch (error) {
    res.status(400).json({ message: 'possible server error', error });
  }
};

export const getFrontendPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await models['permission'].findAll({ where : { isBackend: false }});
    res.status(200).json({ permissions });
  } catch (error) {
    res.status(400).json({ message: 'possible server error', error });
  }
};
