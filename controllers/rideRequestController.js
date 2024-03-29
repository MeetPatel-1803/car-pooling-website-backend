const sequelize = require("../config/database");
const tripRequest = require("../models/tripRequest");
const {
  RIDE_REQUEST_NOT_EXIST,
  RIDE_REQUEST_UPDATED,
  RIDE_REQUEST_CREATED,
  RIDE_REQUEST_ALREADY_CREATED,
  RIDE_REQUEST_CANCELLED,
} = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
  successResponseWithoutData,
} = require("../utils/response");
const cancelRideRequestValidation = require("../validations/cancelRideRequestValidation");
const addEditRideRequestValidation = require("../validations/addEditRideRequestValidation");

/**
 * @description This function will add / edit ride request(special request).
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addEditRideRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    addEditRideRequestValidation(reqParams, res, async (validate) => {
      if (validate) {
        const filterCondition = {
          source_address: reqParams.sourceAddress,
          source_lat: reqParams.sourceLat,
          source_long: reqParams.sourceLong,
          dest_address: reqParams.destAddress,
          dest_lat: reqParams.destLat,
          dest_long: reqParams.destLong,
          departure_date: reqParams.departureDate,
          departure_time: reqParams.departureTime,
          no_of_passenger: reqParams.noOfPassenger,
        };

        if (reqParams.rideRequestId) {
          const requestExist = await tripRequest.findOne({
            where: { id: reqParams.rideRequestId },
          });

          if (!requestExist) {
            return errorResponseData(res, RIDE_REQUEST_NOT_EXIST);
          }

          await tripRequest.update(filterCondition, {
            where: { id: reqParams.rideRequestId },
          });

          const updatedRideRequest = await tripRequest.findOne({
            where: { id: reqParams.rideRequestId },
          });

          await transaction.commit();
          return responseSuccessWithMessage(
            res,
            updatedRideRequest,
            RIDE_REQUEST_UPDATED
          );
        } else {
          const requestExist = await tripRequest.findOne({
            where: filterCondition,
          });

          if (!requestExist) {
            filterCondition = {
              ...filterCondition,
              user_id: req.id,
            };

            const rideRequest = await tripRequest.create(filterCondition);

            await transaction.commit();
            return responseSuccessWithMessage(
              res,
              rideRequest,
              RIDE_REQUEST_CREATED
            );
          } else {
            return errorResponseData(res, RIDE_REQUEST_ALREADY_CREATED);
          }
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will cancel ride request.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const cancelRideRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    cancelRideRequestValidation(reqParams, res, async (validate) => {
      if (validate) {
        const existRequest = await tripRequest.findOne({
          where: { id: reqParams.trip_request_id },
        });

        if (!existRequest) {
          return errorResponseData(res, RIDE_REQUEST_NOT_EXIST);
        }

        await tripRequest.destroy({
          where: { id: reqParams.trip_request_id },
        });

        await transaction.commit();
        return successResponseWithoutData(res, RIDE_REQUEST_CANCELLED);
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

module.exports = { addEditRideRequest, cancelRideRequest };
