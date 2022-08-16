const Joi = require('joi');
module.exports.signupSchema = Joi.object({ 
    name: Joi.string().required(), 
    email: Joi.string().required(), 
    password: Joi.string().required() 
});

module.exports.loginSchema = Joi.object({ 
    email: Joi.string().required(), 
    password: Joi.string().required() 
});