const addEditVehicleValidation = require("../validations/addEditVehicleValidation");
const vehicle = require("../models/userVehicle");
const {
  VEHICLE_ADDED,
  VEHICLE_UPDATED,
  VEHICLE_NOT_FOUND,
  VEHICLE_IMAGE_NOT_FOUND,
  VEHICLES_FETCHED_SUCCESSFULLY,
  VEHICLE_DELETED,
} = require("../utils/message");
const {
  responseSuccessWithMessage,
  errorResponseData,
  successResponseWithoutData,
} = require("../utils/response");
const sequelize = require("../config/database");
const { randomDigits } = require("../utils/helper");
const { generatePreSignedUrl, removeOldImage } = require("../utils/s3Bucket");
const deleteVehicleValidation = require("../validations/deleteVehicleValidation");

/**
 * @description This function will add user vehicle and can update also.
 * @param {*} req
 * @param {*} res
 */
const addEditVehicle = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    addEditVehicleValidation(reqParams, res, async (validate) => {
      if (validate) {
        if (reqParams.vehicleId) {
          const vehicleExist = await vehicle.findOne({
            where: { id: reqParams.vehicleId },
          });
          if (!vehicleExist) {
            return errorResponseData(res, VEHICLE_NOT_FOUND);
          }

          let url;
          if (reqParams.mimetype) {
            const file = `${process.env.FILE_PATH_VEHICLE}/${vehicleExist.images}`;
            removeOldImage(process.env.AWS_BUCKET_NAME, file, res);

            const imgExtension = reqParams?.mimetype.split("/")[1];
            const imgFileName = reqParams?.mimetype.split("/")[0];
            const fileName = `${Date.now()}${randomDigits(
              4
            )}-${imgFileName}.${imgExtension}`;
            const key = `${process.env.FILE_PATH_VEHICLE}/${fileName}`;
            const expiresIn = 600;

            await vehicle.update(
              { images: fileName },
              { where: { id: reqParams.vehicleId } }
            );

            url = generatePreSignedUrl(
              process.env.AWS_BUCKET_NAME,
              key,
              expiresIn
            );
          }

          const updateCondition = {
            name: reqParams?.name,
            type: reqParams?.type,
            number: reqParams?.number,
            no_of_seats: reqParams?.noOfSeats,
          };

          await vehicle.update(updateCondition, {
            where: { id: reqParams.vehicleId },
          });

          const updatedVehicle = await vehicle.findOne({
            where: { id: reqParams.vehicleId },
          });

          await transaction.commit();
          return responseSuccessWithMessage(
            res,
            { updatedVehicle: updatedVehicle, image_url: url },
            VEHICLE_UPDATED
          );
        } else {
          try {
            let url;
            if (reqParams.mimetype) {
              const imgExtension = reqParams?.mimetype.split("/")[1];
              const imgFileName = reqParams?.mimetype.split("/")[0];
              const fileName = `${Date.now()}${randomDigits(
                4
              )}-${imgFileName}.${imgExtension}`;

              const key = `${process.env.FILE_PATH_VEHICLE}/${fileName}`;
              const expiresIn = 600;

              url = generatePreSignedUrl(
                process.env.AWS_BUCKET_NAME,
                key,
                expiresIn
              );

              const setData = await vehicle.create({
                user_id: req.id,
                name: reqParams.name,
                type: reqParams.type,
                number: reqParams.number,
                no_of_seats: reqParams.noOfSeats,
                images: fileName,
              });

              await transaction.commit();
              return responseSuccessWithMessage(
                res,
                { setData, image_url: url },
                VEHICLE_ADDED
              );
            }

            const setData = await vehicle.create({
              user_id: req.id,
              name: reqParams.name,
              type: reqParams.type,
              number: reqParams.number,
              no_of_seats: reqParams.noOfSeats,
            });

            await transaction.commit();
            return responseSuccessWithMessage(res, setData, VEHICLE_ADDED);
          } catch (error) {
            await transaction.rollback();
            return errorResponseData(res, error.message);
          }
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will delete vehicle & remove its pictures from DB & S3.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteVehicle = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const reqParams = req.body;

    deleteVehicleValidation(reqParams, res, async (validate) => {
      if (validate) {
        const existVehicle = await vehicle.findOne({
          where: { id: reqParams.vehicleId },
        });

        if (!existVehicle) {
          return successResponseWithoutData(res, VEHICLE_NOT_FOUND);
        }

        const file = `${process.env.FILE_PATH_VEHICLE}/${existVehicle.images}`;
        removeOldImage(process.env.AWS_BUCKET_NAME, file, res);

        await vehicle.destroy({
          where: { id: reqParams.vehicleId },
        });

        await transaction.commit();
        return successResponseWithoutData(res, VEHICLE_DELETED);
      }
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will collect all vehicles based on user id.
 * @param {*} req
 * @param {*} res
 */

const getUserVehiclesList = async (req, res) => {
  try {
    const vehicleList = await vehicle.findAll({
      where: { user_id: req.id },
    });

    if (!vehicleList) {
      return errorResponseData(res, VEHICLE_NOT_FOUND);
    }

    return responseSuccessWithMessage(
      res,
      { vehicleList },
      VEHICLES_FETCHED_SUCCESSFULLY
    );
  } catch (error) {
    return errorResponseData(res, error);
  }
};

module.exports = {
  addEditVehicle,
  deleteVehicle,
  getUserVehiclesList,
};
