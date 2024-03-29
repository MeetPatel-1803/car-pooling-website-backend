const Joi = require("joi");
const { validationErrorResponseData } = require("../utils/response");

/**
 * @description It will validate the attributes paassed in request param
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 * @returns 
 */

const loginValidation = (req, res, callback) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .trim(true)
      .required()
      .pattern(/[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}/),
    password: Joi.string()
      .min(6)
      .max(100)
      .trim(true)
      .required()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/),
  });
  const { error } = schema.validate(req);
  if (error) {
    return validationErrorResponseData(res,error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = loginValidation;
