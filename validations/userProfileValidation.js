const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate profile attributes
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const profileValidation = (req, res, callback) => {
  const schema = Joi.object({
    first_name: Joi.string().trim(true).required(true),
    last_name: Joi.string().trim(true),
    bio: Joi.string(),
    address: Joi.string(),
    gender: Joi.string().valid("male", "female").insensitive(),
    date_of_birth: Joi.date(),
    profileId: Joi.number().optional(),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = profileValidation;
