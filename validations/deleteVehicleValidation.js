const Joi = require("joi");
const { errorResponseData } = require("../utils/response");

/**
 * @description It will validate vehicleId attribute.
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const deleteVehicleValidation = (req, res, callback) => {
  const schema = Joi.object({
    vehicleId: Joi.number().required(),
  });

  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = deleteVehicleValidation;
