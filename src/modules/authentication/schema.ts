import Joi from 'joi';
export const registrationSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().required(),
  roleId: Joi.number().required(),
});

export const checkPath = Joi.object().keys({ path: Joi.string().required() });

export const loginSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required()
});
