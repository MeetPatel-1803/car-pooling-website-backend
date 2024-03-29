"use strict";
const { DataTypes } = require("sequelize");
const Vehicle = require("../models/userVehicle");

/**
 * It will create table according to specified attributes.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("profiles", {
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
      vehicle_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "vehicles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT("tiny"),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["Male", "Female"],
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      profile_picture: {
        type: DataTypes.STRING(60),
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  /**
   * It will Drop a table .
   * @param {*} queryInterface
   * @param {*} Sequelize
   * @returns
   */

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("profiles");
  },
};
