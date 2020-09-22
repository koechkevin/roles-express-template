import Joi from 'joi';
export const rolesSchema = {
  id: Joi.string().optional(),
  name: Joi.string().required(),
  description: Joi.string().required(),
};

export const roleUpdateSchema = {
  id: Joi.string().required(),
};

export const addPermission = {
  roleId: Joi.number().required(),
  name: Joi.string().required(),
  endpoint: Joi.string().required(),
  isBackend: Joi.boolean().required()
};
