"use strict";
const { DataTypes } = require("sequelize");


module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      mobile_no: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      role: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        defaultValue: "USER",
      },
      Token: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      token_expire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return await queryInterface.dropTable("users");
  },
};
