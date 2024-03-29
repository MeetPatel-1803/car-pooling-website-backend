"use strict";
const { DataTypes } = require("sequelize");

/**
 *  It will create table according to specified attributes.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("trips", {
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
        onUpdate: "RESTRICT",
      },
      vehicle_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "vehicles",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "RESTRICT",
      },
      source_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Source_lat: {
        type: DataTypes.DECIMAL(15, 10),
        allowNull: false,
      },
      Source_long: {
        type: DataTypes.DECIMAL(15, 10),
        allowNull: false,
      },
      dest_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dest_lat: {
        type: DataTypes.DECIMAL(15, 10),
        allowNull: false,
      },
      dest_long: {
        type: DataTypes.DECIMAL(15, 10),
        allowNull: false,
      },
      departure_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      departure_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      available_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      fare: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
      },
      trip_type: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ["single trip", "recurring trip"],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("trips");
  },
};
