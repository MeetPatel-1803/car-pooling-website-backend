const Joi = require("joi");
const { errorResponseData } = require("../utils/response");
const { PAGINATION, MAX_NO_OF_PASSANGER } = require("../constants/constants");

/**
 * @description It will validate trip attributes
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const availableRideListValidation = (req, res, callback) => {
  const schema = Joi.object({
    page: Joi.number().allow(""),
    perPage: Joi.number()
      .max(PAGINATION.MAXIMUM_PER_PAGE)
      .allow("")
      .optional(),
    sortBy: Joi.string().allow("").optional(),
    sortType: Joi.string().valid("ASC", "DESC").optional().allow(""),
    search: Joi.string().allow("").optional(),
    sourceAddress: Joi.string().trim(),
    destAddress: Joi.string().trim(),
    departureDateFrom: Joi.date().optional(),
    departureDateTo: Joi.date().optional(),
    departureTimeFrom: Joi.string().pattern(/^([01]?[0-9])\:([0-5][0-9])$/i),
    departureTimeTo: Joi.string().pattern(/^([01]?[0-9])\:([0-5][0-9])$/i),
    noOfPassanger: Joi.number().max(MAX_NO_OF_PASSANGER),
    fareMin: Joi.number().precision(2),
    fareMax: Joi.number().precision(2),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = availableRideListValidation;
