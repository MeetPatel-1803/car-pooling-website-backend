"use strict";

const router = require("express").Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../../controllers/authController");
const {
  getProfile,
  addEditProfile,
  addEditProfilePicture,
  removeProfilePicture,
} = require("../../controllers/userProfileController");
const { isAuthenticatedUser } = require("../../middleware/auth");
const {
  addEditVehicle,
  getUserVehiclesList,
  deleteVehicle,
} = require("../../controllers/vehicleController");
const {
  addEditRide,
  availableRidesList,
  bookedAndOfferedRidesList,
} = require("../../controllers/ridesController");
const {
  addEditBookingRequest,
  updateStatusOfBookingRequest,
  cancelBookingRequest,
  getBookingRequestList,
  getMyBookingRequestList,
} = require("../../controllers/bookingRequestController");
const {
  addEditRideRequest,
  cancelRideRequest,
} = require("../../controllers/rideRequestController");

/**
 * User
 */
router.post("/signup", register);
router.post("/signin", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", isAuthenticatedUser, changePassword);

/**
 * Profile
 */
router.post("/profile", isAuthenticatedUser, addEditProfile);
router.get("/profile", isAuthenticatedUser, getProfile);
router.post(
  "/change-profile-picture",
  isAuthenticatedUser,
  addEditProfilePicture
);
router.delete(
  "/remove-profile-picture",
  isAuthenticatedUser,
  removeProfilePicture
);

/**
 * Vehicle
 */
router.post("/add-edit-vehicle", isAuthenticatedUser, addEditVehicle);
router.delete("/delete-vehicle", isAuthenticatedUser, deleteVehicle);
router.get("/user-vehicles-list", isAuthenticatedUser, getUserVehiclesList);

/**
 * Rides
 */
router.post("/add-edit-ride", isAuthenticatedUser, addEditRide);
router.get("/available-rides", isAuthenticatedUser, availableRidesList);

/**
 * booking requested ride
 */
router.post("/add-edit-booking-request", isAuthenticatedUser, addEditBookingRequest);
router.post(
  "/update-booking-request-status",
  isAuthenticatedUser,
  updateStatusOfBookingRequest
);
router.delete("/cancel-booking-request", isAuthenticatedUser, cancelBookingRequest);
router.get("/booking-request-list", isAuthenticatedUser, getBookingRequestList);
router.get("/my-booking-request-list", isAuthenticatedUser, getMyBookingRequestList);
router.get("/booked-and-offered-rides-list", isAuthenticatedUser, bookedAndOfferedRidesList);

/**
 *  ride request
 */
router.post("/add-edit-ride-request", isAuthenticatedUser, addEditRideRequest);
router.delete("/cancel-ride-request", isAuthenticatedUser, cancelRideRequest);
module.exports = router;
