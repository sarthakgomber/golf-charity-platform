// backend/src/middleware/validationMiddleware.js
const Joi = require('joi');

// User registration validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

// User login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

// Score validation
const scoreValidation = (data) => {
  const schema = Joi.object({
    scores: Joi.array().items(
      Joi.object({
        value: Joi.number().integer().min(1).max(45).required(),
        date: Joi.date().iso().required()
      })
    ).min(1).max(5).required()
  });
  return schema.validate(data);
};

// Subscription validation
const subscriptionValidation = (data) => {
  const schema = Joi.object({
    planType: Joi.string().valid('monthly', 'yearly').required(),
    charityId: Joi.string().required(),
    charityPercentage: Joi.number().min(10).max(100).required()
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  scoreValidation,
  subscriptionValidation
};
