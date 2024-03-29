const Joi = require("joi");
const { validationErrorResponseData } = require("../utils/response");
const { IMAGE_MIMETYPE } = require("../constants/constants");

/**
 * @description It will validate the attributes paassed in request param
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const imageValidation = (req, res, callback) => {
  const pattern = new RegExp(`/^[A-Za-z0-9-_]+\/${IMAGE_MIMETYPE.join("|")}$/`);
  const schema = Joi.object({
    profileId: Joi.number(),
    mimetype: Joi.string().pattern(pattern),
  });
  const { error } = schema.validate(req);
  if (error) {
    return validationErrorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = imageValidation;
