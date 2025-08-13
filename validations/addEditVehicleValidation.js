const Joi = require("joi");
const { errorResponseData } = require("../utils/response");
const { IMAGE_MIMETYPE } = require("../constants/constants");

/**
 * @description It will validate number plate
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @returns
 */

const addEditVehicleValidation = (req, res, callback) => {
  const pattern = new RegExp(`/^[A-Za-z0-9-_]+\/${IMAGE_MIMETYPE.join("|")}$/`);
  const schema = Joi.object({
    vehicleId: Joi.number(),
    name: Joi.string().required(),
    type: Joi.string()
      .valid(
        "SUV",
        "Sedan",
        "Hatchback",
        "Coupe",
        "Van",
        "Compact Sedan",
        "Compact SUV",
        "MUV"
      )
      .trim()
      .insensitive()
      .required(),
    number: Joi.string()
      .required()
      .pattern(/^[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$/),
    noOfSeats: Joi.number().required(),
    mimetype: Joi.string().pattern(pattern),
  });
  const { error } = schema.validate(req);
  if (error) {
    return errorResponseData(res, error.message, 401);
  } else {
    return callback(true);
  }
};
module.exports = addEditVehicleValidation;
