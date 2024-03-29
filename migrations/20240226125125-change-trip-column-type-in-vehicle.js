"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.changeColumn("vehicles", "type", {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [
        "SUV",
        "Sedan",
        "Hatchback",
        "Coupe",
        "Van",
        "Compact Sedan",
        "Compact SUV",
        "MUV",
      ],
      defaultValue: "Hatchback",
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.changeColumn("vehicles", "type", {
      type: DataTypes.STRING(20),
      allowNull: false,
    });
  },
};
