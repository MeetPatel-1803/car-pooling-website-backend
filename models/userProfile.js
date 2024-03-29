const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const user = require("./user");
const Vehicle = require("./userVehicle");

const Profile = sequelize.define("profiles", {
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

module.exports = Profile;
