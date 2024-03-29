"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  /**
   * @description It will create booking_requests table.
   * @param {*} queryInterface
   * @param {*} Sequelize
   * @returns
   */
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("booking_requests", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      trip_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "trips",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      trip_status: {
        type: DataTypes.ENUM,
        values: ["accepted", "rejected", "pending"],
        allowNull: false,
        defaultValue: "pending",
      },
    });
  },

  /**
   * @description It will drop booking_requests table.
   * @param {*} queryInterface
   * @param {*} Sequelize
   * @returns
   */

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("booking_requests");
  },
};
