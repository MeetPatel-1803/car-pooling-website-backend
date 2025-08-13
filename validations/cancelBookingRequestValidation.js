const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate cancel ride attributes.
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const cancelBookingRequestValidation = (req, res, callback) => {
  const schema = Joi.object({
    booking_request_id: Joi.number().required(),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = cancelBookingRequestValidation;
