const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate oldPassword, password and confirmpassword
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const changePasswordValidation = (req, res, callback) => {
  const schema = Joi.object({
    oldPassword: Joi.string(),
    newPassword: Joi.string()
      .min(6)
      .max(100)
      .trim(true)
      .required()
      .pattern(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}/),

    confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")),
  });

  const { error } = schema.validate(req);
  if (error) {
    errorResponseData(res, error.message);
  } else {
    return callback(true);
  }
};

module.exports = changePasswordValidation;
