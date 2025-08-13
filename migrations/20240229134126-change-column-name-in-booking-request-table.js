"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "booking_requests",
      "trip_status",
      "status"
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "booking_requests",
      "trip_status",
      "status"
    );
  },
};
