"use strict";
const { DataTypes } = require("sequelize");
const user = require("../models/user");

/**
 *  It will create table according to specified attributes.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("vehicles", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        References: {
          model: user,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      images: {
        type: DataTypes.BLOB("long"),
        allowNull: false,
      },
      no_of_seats: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("vehicles");
  },
};
