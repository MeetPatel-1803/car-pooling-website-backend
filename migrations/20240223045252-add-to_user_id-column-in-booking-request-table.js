"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("booking_requests", "to_user_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn("booking_requests", "created_at", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    });

    await queryInterface.addColumn("booking_requests", "updated_at", {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    });

    await queryInterface.addColumn("booking_requests", "deleted_at", {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("booking_requests", "to_user_id");
    await queryInterface.removeColumn("booking_requests", "created_at");
    await queryInterface.removeColumn("booking_requests", "updated_at");
    await queryInterface.removeColumn("booking_requests", "deleted_at");
  },
};
