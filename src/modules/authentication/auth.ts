import { Op } from 'sequelize';
import { NextFunction, Request, Response } from 'express';
import models from '../../database/models';
import crypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const paginate = (array: any[], pageSize: any, pageNumber: any) => {
  const page = pageNumber - 1;
  const pageCount = Math.ceil(array.length / pageSize);
  return { data: array.slice(page * pageSize, pageNumber * pageSize), pageCount };
};

export const getAllUsers = async (req: Request, res: Response) => {
  const { query } = req as any;
  let { id, permissions, page, limit, ...restQuery } = query;
  try {
    const searchParams: any = {};
    Object.keys(restQuery).forEach((searchParam: string) => {
      searchParams[searchParam] = {
        [Op.iLike]: `%${query[searchParam]}%`,
      };
    });
    const users = await models.user.findAll({
      where: {
        id: id || { [Op.not]: null },
        ...searchParams,
      },
      include: [
        {
          model: models['role'],
          as: 'role',
          include: [
            {
              model: models['permission'],
              as: 'permissions',
            },
          ],
        },
      ],
      attributes: { exclude: ['password'] },
    });
    limit = Number(query.limit) || users.length;
    page = Number(query.page || '1') as any;

    const { data, pageCount } = paginate(users, limit, page);
    res.status(200).json({ users: data, pagination: { current: page, pageCount, total: users.length } });
  } catch (e) {
    res.status(400).json({ message: 'possible server error' });
  }
};

export const validateUserName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = await models['user'].findOne({ where: { username: req.body.username } });
    if (username) {
      return res.status(422).json({ errors: [{ field: 'username', message: 'username already taken' }] });
    }
    next();
  } catch (e) {
    res.status(400).json({ message: 'possible server error' });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await models['user'].findOne({ where: { username } });
    if (user) {
      const match = await crypt.compare(password, user.password);
      if (match) {
        const { password, ...userDetails } = user.dataValues;
        const { profile, ...rest} = user.dataValues;
        const token = jwt.sign(userDetails, process.env.SECRET_KEY, { expiresIn: '24h' });
        const output = {...rest, ...profile, token, password: undefined};
        return res.status(200).json(output);
      }
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (e) {
    res.status(400).json({ message: 'possible server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, roleId, ...profile } = req.body;
    const password = await crypt.hash(req.body.password, Number(process.env.SALT_ROUNDS));
    const user = { username, roleId, password, profile };

    const { dataValues: created } = await models.user.create(user);

    const role = await models['role'].findOne({
      where: { id: created.roleId },
      include: [
        {
          model: models['permission'],
          as: 'permissions',
        },
      ],
    });

    res.status(200).json({ ...created, role });
  } catch (e) {
    res.status(400).json({ message: 'possible server error', error: e });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const username = req.app.locals.userData.username;
    const value = await models['user'].findOne({
      where: { username },
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
      attributes: { exclude: ['password'] },
    });
    const user = value.dataValues;
    res.status(200).json({...user, profile: undefined, ...user.profile});
  } catch (e) {
    res.status(400).json({ message: 'possible server error' });
  }
};
