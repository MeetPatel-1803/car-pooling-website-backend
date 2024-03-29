const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

/**
 * In this variable all credentials related to database will be stored
 */

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    define: {
      timestamps: false,
    },
  }
);

/**
 * this will try to make a connection with database using that credentials
 */

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
} catch (error) {
  console.log(error);
}
module.exports = sequelize;
