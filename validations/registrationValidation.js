const Joi = require("joi");
const { validationErrorResponseData } = require("../utils/response");

/**
 * @description It will validate registration attributes
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 * @returns 
 */

const registrationValidation = (req, res, callback) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .trim(true)
      .required()
      .pattern(/[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}/), // EMAIL DOMAIN VALIDATION
    password: Joi.string()
      .min(6)
      .max(100)
      .trim(true)
      .required()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/),
    country_code: Joi.string()
      .max(10)
      .required()
      .pattern(/(\+\d{1,3}|\d{1,4})/),
    mobile_no: Joi.string()
      .min(3)
      .max(12)
      .required()
      .pattern(/\s*[0-9]{10,11}/),
  });
  const { error } = schema.validate(req);
  if (error) {
    return validationErrorResponseData(res,error.message, 400);
  } else {
    return callback(true);
  }
};
module.exports = registrationValidation;
