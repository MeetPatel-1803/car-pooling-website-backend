"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn(
      "booking_requests",
      "no_of_passanger",
      {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.removeColumn(
      "booking_requests",
      "no_of_passanger"
    );
  },
};
