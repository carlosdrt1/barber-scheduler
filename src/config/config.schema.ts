import Joi from 'joi';

export const configSchema = Joi.object({
  NODE_ENV: Joi.valid('development', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
});
