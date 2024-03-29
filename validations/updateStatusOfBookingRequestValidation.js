const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate requested ride attributes.
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const updateStatusOfBookingRequestValidation = (req, res, callback) => {
  const schema = Joi.object({
    booking_request_id: Joi.number().optional(),
    is_accepted: Joi.boolean().optional(),
    is_rejected: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = updateStatusOfBookingRequestValidation;
