const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate password and confirmpassword
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 * @returns 
 */

const passwordValidation = (req, res, callback) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(6)
      .max(100)
      .trim(true)
      .required()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/),

    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
    token: Joi.string(),
  });

  const { error } = schema.validate(req);
  if (error) {
    errorResponseData(res, error.message);
  } else {
    return callback(true);
  }
};

module.exports = passwordValidation;
