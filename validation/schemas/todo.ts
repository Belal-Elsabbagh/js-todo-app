const Joi = require('joi');
export default Joi.object({ task: Joi.string().required() })