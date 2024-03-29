const { Op } = require("sequelize");
const moment = require("moment");
const { PAGINATION } = require("../constants/constants");
const trip = require("../models/trip");
const {
  SOMETHING_WRONG,
  RIDE_CREATED,
  AVAILABLE_RIDES_FETCHED,
  NO_RIDES_FOUND,
  RIDE_NOT_FOUND,
  CANNOT_UPDATE_A_RIDE,
  CANCEL_OFFERED_RIDE,
  RIDE_UPDATED,
  RIDES_LIST_FETCHED,
  RIDES_NOT_FOUND,
} = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
  successResponseWithoutData,
} = require("../utils/response");
const addEditRideValidation = require("../validations/addEditRideValidation");
const availableRideListValidation = require("../validations/availableRideListValidation");
const bookingRequests = require("../models/bookingRequests");
const sequelize = require("../config/database");
const bookedAndOfferedRidesListValidation = require("../validations/bookedAndOfferedRidesListValidation");

/**
 * @description This function will create a trip for who want to provide trip.
 * @param {*} req
 * @param {*} res
 */
const addEditRide = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    addEditRideValidation(reqParams, res, async (validate) => {
      if (validate) {
        if (reqParams.tripId) {
          const tripExist = await trip.findOne({
            where: { id: reqParams.tripId },
          });

          if (!tripExist) {
            return errorResponseData(res, RIDE_NOT_FOUND);
          }

          if (reqParams?.cancelOfferRide) {
            await trip.destroy({
              where: { id: reqParams.tripId },
            });

            await transaction.commit();
            return successResponseWithoutData(res, CANCEL_OFFERED_RIDE);
          }
          const isTripStatusAccepted = await bookingRequests.findAll({
            where: { trip_id: reqParams.tripId, status: "accepted" },
            attributes: ["trip_id", "status"],
          });

          if (isTripStatusAccepted.length == 0) {
            const updateCondition = {
              source_address: reqParams.sourceAddress,
              source_lat: reqParams.sourceLat,
              source_long: reqParams.sourceLong,
              dest_address: reqParams.destAddress,
              dest_lat: reqParams.destLat,
              dest_long: reqParams.destLong,
              departure_date: reqParams.departureDate,
              departure_time: reqParams.departureTime,
              available_seats: reqParams.availableSeats,
              fare: reqParams.fare,
              vehicle_id: reqParams.vehicleId,
            };

            await trip.update(updateCondition, {
              where: { id: reqParams.tripId },
            });

            const updatedTrip = await trip.findOne({
              where: { id: reqParams.tripId },
            });

            await transaction.commit();
            return responseSuccessWithMessage(res, updatedTrip, RIDE_UPDATED);
          } else {
            return errorResponseData(res, CANNOT_UPDATE_A_RIDE);
          }
        } else {
          const ride = await trip.create({
            user_id: req.id,
            source_address: reqParams.sourceAddress,
            source_lat: reqParams.sourceLat,
            source_long: reqParams.sourceLong,
            dest_address: reqParams.destAddress,
            dest_lat: reqParams.destLat,
            dest_long: reqParams.destLong,
            departure_date: reqParams.departureDate,
            departure_time: reqParams.departureTime,
            available_seats: reqParams.availableSeats,
            fare: reqParams.fare,
            vehicle_id: reqParams.vehicleId,
          });

          if (!ride) {
            return errorResponseData(res, SOMETHING_WRONG, 500);
          }

          await transaction.commit();
          return responseSuccessWithMessage(res, ride, RIDE_CREATED);
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function is used to get list of created rides.
 * @param {*} req
 * @param {*} res
 * @returns
 */

const availableRidesList = async (req, res) => {
  try {
    const reqParams = req.query;

    availableRideListValidation(reqParams, res, async (validate) => {
      if (validate) {
        const page = reqParams.page
          ? parseInt(reqParams.page)
          : PAGINATION.PAGE;

        const perPage = reqParams.perPage
          ? parseInt(reqParams.perPage)
          : PAGINATION.PER_PAGE;

        const pageItems = (page - 1) * perPage;

        let sortingOrder = [["created_at", "DESC"]];

        if (reqParams.sortBy && reqParams.sortType) {
          sortingOrder = [[reqParams.sortBy, reqParams.sortType]];
        }

        const listOfRides = await trip.findAndCountAll({
          where: {
            ...(reqParams.sourceAddress && {
              source_address: reqParams.sourceAddress,
            }),
            ...(reqParams.destAddress && {
              dest_address: reqParams.destAddress,
            }),
            ...(reqParams.departureDateFrom && reqParams.departureDateTo
              ? {
                  departure_date: {
                    [Op.gte]: reqParams.departureDateFrom,
                    [Op.lte]: reqParams.departureDateTo,
                  },
                }
              : {
                  departure_date: {
                    [Op.gte]: moment(new Date()).format("YYYY-MM-DD"),
                  },
                }),
            ...(reqParams.departureTimeFrom && reqParams.departureTimeTo
              ? {
                  departure_time: {
                    [Op.gte]: reqParams.departureTimeFrom,
                    [Op.lte]: reqParams.departureTimeTo,
                  },
                }
              : {
                  departure_time: {
                    [Op.gte]: moment(new Date()).format("HH:MM:SS"),
                  },
                }),
            ...(reqParams.noOfPassanger
              ? {
                  available_seats: {
                    [Op.gte]: parseInt(reqParams.noOfPassanger),
                  },
                }
              : { available_seats: { [Op.gte]: 1 } }),
            ...(reqParams.fareMin &&
              reqParams.fareMax && {
                fare: {
                  [Op.gte]: reqParams.fareMin,
                  [Op.lte]: reqParams.fareMax,
                },
              }),
          },
          order: sortingOrder,
          limit: perPage,
          offset: pageItems,
        });

        if (!listOfRides.rows.length) {
          return responseSuccessWithMessage(res, listOfRides, NO_RIDES_FOUND);
        }

        return responseSuccessWithMessage(
          res,
          listOfRides.rows,
          AVAILABLE_RIDES_FETCHED,
          1,
          { page, perPage, totalCount: listOfRides.count }
        );
      }
    });
  } catch (error) {
    return errorResponseData(res, error.message, 0);
  }
};

/**
 * @description This function will get ride list as offeredRides / bookedRides.
 * @param {*} req
 * @param {*} res
 * @returns
 */

const bookedAndOfferedRidesList = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.query;

    bookedAndOfferedRidesListValidation(reqParams, res, async (validate) => {
      if (validate) {
        const order = [["created_at", "DESC"]];

        const page = reqParams.page
          ? parseInt(reqParams.page)
          : PAGINATION.PAGE;

        const perPage = reqParams.perPage
          ? parseInt(reqParams.perPage)
          : PAGINATION.PER_PAGE;

        const offset = (page - 1) * perPage;
        let ridesList;
        let filterCondition = {
          departure_date: {
            [Op.gte]: moment(new Date()).format("YYYY-MM-DD"),
          },
        };

        if (reqParams?.rideType) {
          ridesList = await trip.findAndCountAll({
            where: (filterCondition, { user_id: req.id }),
            order,
            limit: perPage,
            offset,
          });
        } else {
          ridesList = await bookingRequests.findAndCountAll({
            where: { user_id: req.id },
            include: [
              {
                model: trip,
                where: filterCondition,
              },
            ],
            order,
            limit: perPage,
            offset,
          });
        }

        if (!ridesList.rows.length) {
          return errorResponseData(res, RIDES_NOT_FOUND);
        }

        return responseSuccessWithMessage(
          res,
          ridesList.rows,
          RIDES_LIST_FETCHED,
          1,
          { page, perPage, totalCount: ridesList.count }
        );
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

module.exports = { addEditRide, availableRidesList, bookedAndOfferedRidesList };
