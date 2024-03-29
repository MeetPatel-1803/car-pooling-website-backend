const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate requested ride attributes.
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const addEditBookingRequestValidation = (req, res, callback) => {
  const schema = Joi.object({
    trip_id: Joi.number().optional(),
    booking_request_id: Joi.number().optional(),
    no_of_passanger: Joi.number().required(),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = addEditBookingRequestValidation;
