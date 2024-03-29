const Joi = require("joi");
const { errorResponseData } = require("../utils/response");
const { PAGINATION } = require("../constants/constants");

/**
 * @description It will validate cancel ride attributes.
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const bookedAndOfferedRidesListValidation = (req, res, callback) => {
  const schema = Joi.object({
    page: Joi.number().allow(""),
    perPage: Joi.number().max(PAGINATION.MAXIMUM_PER_PAGE).allow("").optional(),
    rideType: Joi.string().trim().valid("booked", "offered"),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = bookedAndOfferedRidesListValidation;
