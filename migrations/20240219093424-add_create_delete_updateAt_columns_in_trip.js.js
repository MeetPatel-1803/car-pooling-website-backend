"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("trips", "created_at", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    });

    await queryInterface.addColumn("trips", "updated_at", {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    });

    await queryInterface.addColumn("trips", "deleted_at", {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("trips", "created_at");
    await queryInterface.removeColumn("trips", "updated_at");
    await queryInterface.removeColumn("trips", "deleted_at");
  },
};
