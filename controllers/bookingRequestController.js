const { Sequelize, Op } = require("sequelize");
const bookingRequests = require("../models/bookingRequests");
const trip = require("../models/trip");
const {
  BOOKING_REQUEST_CREATED,
  SEATS_ARE_NOT_AVAILABLE,
  RIDE_IS_FULL,
  CANNOT_UPDATE_A_RIDE,
  RIDE_UPDATED,
  RIDE_STATUS_ACCEPTED,
  RIDE_STATUS_REJECTED,
  CANNOT_CANCEL_A_RIDE,
  CANCEL_REQUESTED_RIDE,
  CREATED_RIDE_REQUESTS_NOT_FOUND,
  CREATED_RIDE_REQUESTS_LIST_FETCHED,
  BOOKED_RIDE_REQUESTS_NOT_FOUND,
  BOOKED_RIDE_REQUESTS_LIST_FETCHED,
} = require("../utils/message");
const {
  errorResponseData,
  responseSuccessWithMessage,
  successResponseWithoutData,
} = require("../utils/response");
const addEditBookingRequestValidation = require("../validations/addEditBookingRequestValidation");
const sequelize = require("../config/database");
const updateStatusOfBookingRequestValidation = require("../validations/updateStatusOfBookingRequestValidation");
const cancelBookingRequestValidation = require("../validations/cancelBookingRequestValidation");
const { PAGINATION } = require("../constants/constants");
const bookingRequestListValidation = require("../validations/bookingRequestListValidation");

/**
 * @description This function will create booking request antry in table & send message to driver.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addEditBookingRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;
    addEditBookingRequestValidation(reqParams, res, async (validate) => {
      if (validate) {
        if (reqParams.booking_request_id) {
          const existRequest = await bookingRequests.findOne({
            where: { id: reqParams.booking_request_id, status: "pending" },
          });

          if (!existRequest) {
            return successResponseWithoutData(res, CANNOT_UPDATE_A_RIDE);
          }

          await bookingRequests.update(
            {
              no_of_passanger: Sequelize.literal(
                `no_of_passanger + ${reqParams.no_of_passanger}`
              ),
            },
            { where: { id: reqParams.booking_request_id } }
          );

          const updatedBookingRequest = await bookingRequests.findOne({
            where: { id: reqParams.booking_request_id },
          });

          await transaction.commit();
          return responseSuccessWithMessage(
            res,
            {
              updatedBookingRequest,
            },
            RIDE_UPDATED
          );
        } else {
          const tripDetail = await trip.findOne({
            where: { id: reqParams.trip_id },
            attributes: ["user_id"],
          });

          const bookingRequest = await bookingRequests.create({
            trip_id: reqParams.trip_id,
            user_id: req.id, // user who request for a ride
            to_user_id: tripDetail.user_id, // user who create a ride
            no_of_passanger: reqParams.no_of_passanger,
          });

          await transaction.commit();
          return responseSuccessWithMessage(
            res,
            {
              bookingRequest: bookingRequest,
            },
            BOOKING_REQUEST_CREATED
          );
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will update a ride status from pending to accepted / rejected.
 * @param {*} req
 * @param {*} res
 * @returns
 */

const updateStatusOfBookingRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    updateStatusOfBookingRequestValidation(reqParams, res, async (validate) => {
      if (validate) {
        const existRequest = await bookingRequests.findOne({
          where: { id: reqParams.booking_request_id, status: "pending" },
        });

        if (!existRequest) {
          return successResponseWithoutData(res, CANNOT_UPDATE_A_RIDE);
        }
        if (reqParams?.is_accepted) {
          const checkAvailableSeats = await trip.findOne({
            where: { id: existRequest.trip_id },
            attributes: ["available_seats"],
          });

          if (checkAvailableSeats.available_seats == 0) {
            return responseSuccessWithMessage(res, null, RIDE_IS_FULL);
          } else if (
            checkAvailableSeats.available_seats < existRequest.no_of_passanger
          ) {
            return responseSuccessWithMessage(
              res,
              { availableSeats: checkAvailableSeats.available_seats },
              SEATS_ARE_NOT_AVAILABLE
            );
          }

          await trip.update(
            {
              available_seats: Sequelize.literal(
                `available_seats - ${existRequest.no_of_passanger}`
              ),
            },
            { where: { id: existRequest.trip_id } }
          );

          await bookingRequests.update(
            { status: "accepted" },
            { where: { id: reqParams.booking_request_id } }
          );

          const currentAvailableSeats = await trip.findOne({
            where: { id: existRequest.trip_id },
            attributes: ["available_seats"],
          });

          return responseSuccessWithMessage(
            res,
            { currentAvailableSeats: currentAvailableSeats },
            RIDE_STATUS_ACCEPTED
          );
        }

        if (reqParams?.is_rejected) {
          await bookingRequests.update(
            { status: "rejected" },
            { where: { id: reqParams.booking_request_id } }
          );

          return successResponseWithoutData(res, RIDE_STATUS_REJECTED);
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will cancel rquested ride.
 * @param {*} req
 * @param {*} res
 */
const cancelBookingRequest = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    cancelBookingRequestValidation(reqParams, res, async (validate) => {
      if (validate) {
        const existRequest = await bookingRequests.findOne({
          where: { id: reqParams.booking_request_id, status: "pending" },
        });

        if (!existRequest) {
          return successResponseWithoutData(res, CANNOT_CANCEL_A_RIDE);
        }

        await bookingRequests.destroy({
          where: { id: reqParams.booking_request_id },
        });

        await transaction.commit();
        return successResponseWithoutData(res, CANCEL_REQUESTED_RIDE);
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will lists a booking request to driver(a person who creates a trip) based on status.
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getBookingRequestList = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.query;

    bookingRequestListValidation(reqParams, res, async (validate) => {
      if (validate) {
        const order = [["created_at", "DESC"]];

        const page = reqParams.page
          ? parseInt(reqParams.page)
          : PAGINATION.PAGE;

        const perPage = reqParams.perPage
          ? parseInt(reqParams.perPage)
          : PAGINATION.PER_PAGE;

        const offset = (page - 1) * perPage;

        let where = {
          to_user_id: req.id,
        };

        if (reqParams?.status) {
          where.status = reqParams?.status;
        }

        const bookingRequestList = await bookingRequests.findAndCountAll({
          where,
          order,
          limit: perPage,
          offset,
        });

        if (bookingRequestList.rows.length == 0) {
          return errorResponseData(res, CREATED_RIDE_REQUESTS_NOT_FOUND);
        }

        return responseSuccessWithMessage(
          res,
          bookingRequestList.rows,
          CREATED_RIDE_REQUESTS_LIST_FETCHED,
          1,
          { page, perPage, totalCount: bookingRequestList.count }
        );
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will lists a booking request to rider(a person who request for a trip) based on status.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getMyBookingRequestList = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.query;

    bookingRequestListValidation(reqParams, res, async (validate) => {
      if (validate) {
        const order = [["created_at", "DESC"]];

        const page = reqParams.page
          ? parseInt(reqParams.page)
          : PAGINATION.PAGE;

        const perPage = reqParams.perPage
          ? parseInt(reqParams.perPage)
          : PAGINATION.PER_PAGE;

        const offset = (page - 1) * perPage;

        let where = {
          user_id: req.id,
        };

        if (reqParams?.status) {
          where.status = reqParams?.status;
        }

        const bookingRequestList = await bookingRequests.findAndCountAll({
          where,
          order,
          limit: perPage,
          offset,
        });

        if (bookingRequestList.rows.length == 0) {
          return errorResponseData(res, BOOKED_RIDE_REQUESTS_NOT_FOUND);
        }

        return responseSuccessWithMessage(
          res,
          bookingRequestList.rows,
          BOOKED_RIDE_REQUESTS_LIST_FETCHED,
          1,
          { page, perPage, totalCount: bookingRequestList.count }
        );
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};
module.exports = {
  addEditBookingRequest,
  updateStatusOfBookingRequest,
  cancelBookingRequest,
  getBookingRequestList,
  getMyBookingRequestList,
};
