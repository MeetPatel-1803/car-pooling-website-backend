const Joi = require("joi");
const { errorResponseData } = require("../utils/response");
const { MAX_NO_OF_PASSANGER } = require("../constants/constants");

/**
 * @description It will validate trip attributes
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const addEditRideRequestValidation = (req, res, callback) => {
  const schema = Joi.object({
    rideRequestId: Joi.number().optional(),
    sourceAddress: Joi.string().trim().required(),
    sourceLat: Joi.number().min(-90).max(90).precision(2).required(),
    sourceLong: Joi.number().min(-180).max(180).precision(2).required(),
    destAddress: Joi.string().trim().required(),
    destLat: Joi.number().min(-90).max(90).precision(2).required(),
    destLong: Joi.number().min(-180).max(180).precision(2).required(),
    departureDate: Joi.date().iso(),
    departureTime: Joi.string().pattern(/^([012]?[0-9])\:([0-5][0-9])$/i),
    noOfPassenger: Joi.number().required().max(MAX_NO_OF_PASSANGER),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = addEditRideRequestValidation;
