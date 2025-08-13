"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("trip_requests", {
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
      source_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      source_lat: {
        type: DataTypes.DECIMAL(15, 10),
        allowNull: false,
      },
      source_long: {
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
      no_of_passenger: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("trip_request");
  },
};
