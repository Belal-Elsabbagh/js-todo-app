const Joi = require('joi');
module.exports = Joi.object({ task: Joi.string().required() })