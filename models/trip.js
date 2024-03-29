const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const user = require("./user");
const vehicle = require("./userVehicle");

const Trip = sequelize.define(
  "trips",
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
    vehicle_id: {
      type: DataTypes.INTEGER,
      references: {
        model: vehicle,
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
  },
  {
    sequelize,
  }
);

module.exports = Trip;
