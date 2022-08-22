const Joi = require('joi');

const nameSchema = Joi.string().min(3).max(30).required();
const emailSchema = Joi.string().min(3).email().required();
const passwordSchema = Joi.string().min(8).max(30).required();

module.exports.signupSchema = Joi.object({ 
    username: nameSchema,
    email: emailSchema, 
    password: passwordSchema
});

module.exports.loginSchema = Joi.object({ 
    email:emailSchema, 
    password: Joi.string().required()
});