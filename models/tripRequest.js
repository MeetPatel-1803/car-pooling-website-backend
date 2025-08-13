const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const user = require("./user");

const tripRequest = sequelize.define(
  "trip_requests",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: user,
        key: "id",
      },
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
  }
);

module.exports = tripRequest;
