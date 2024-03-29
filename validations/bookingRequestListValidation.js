const Joi = require("joi");
const { errorResponseData } = require("../utils/response");
const {
  PAGINATION,
  BOOKING_REQUEST_STATUS,
} = require("../constants/constants");

/**
 * @description It will validate cancel ride attributes.
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const bookingRequestListValidation = (req, res, callback) => {
  const schema = Joi.object({
    page: Joi.number().allow(""),
    perPage: Joi.number().max(PAGINATION.MAXIMUM_PER_PAGE).allow("").optional(),
    status: Joi.string()
      .trim()
      .valid(...BOOKING_REQUEST_STATUS),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = bookingRequestListValidation;
