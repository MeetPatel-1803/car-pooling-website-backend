const profileValidation = require("../validations/userProfileValidation");
const profile = require("../models/userProfile");
const { randomDigits } = require("../utils/helper");
const {
  PROFILE_FORM_SUBMITTED,
  SOMETHING_WRONG,
  USER_PROFILE_FETCHED,
  PROFILE_NOT_FOUND,
  IMAGE_UPLOADED,
  PROFILE_IMAGE_NOT_FOUND,
  PROFILE_UPDATED,
  PROFILE_PICTURE_REMOVED,
} = require("../utils/message");
const {
  responseSuccessWithMessage,
  errorResponseWithoutData,
  errorResponseData,
  successResponseWithoutData,
} = require("../utils/response");
const {
  generatePreSignedUrl,
  removeOldImage,
  fetchPreSignedUrl,
} = require("../utils/s3Bucket");
const imageValidation = require("../validations/imageValidation");

/**
 * @description This function will get the information and update about user profile.
 * @param {*} req
 * @param {*} res
 */
const getProfile = async (req, res) => {
  try {
    const profileDetail = await profile.findOne({
      where: {
        user_id: req.id,
      },
    });

    if (!profileDetail) {
      return errorResponseData(res, PROFILE_NOT_FOUND);
    }

    const file = profileDetail.profile_picture;
    if (file == null) {
      return responseSuccessWithMessage(
        res,
        { profileDetail },
        USER_PROFILE_FETCHED,
        (code = 1)
      );
    }
    const imageUrl = fetchPreSignedUrl(file);

    return responseSuccessWithMessage(
      res,
      { profileDetail, imageUrl },
      USER_PROFILE_FETCHED,
      (code = 1)
    );
  } catch (error) {
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will get information from user.
 * @param {*} req
 * @param {*} res
 */

const addEditProfile = async (req, res) => {
  try {
    const reqParams = req.body;

    profileValidation(reqParams, res, async (validate) => {
      if (validate) {
        if (reqParams.profileId) {
          const profileExist = await profile.findOne({
            where: { id: reqParams.profileId },
          });

          if (!profileExist) {
            return errorResponseData(res, PROFILE_NOT_FOUND);
          }

          const updateCondition = {
            first_name: reqParams?.first_name,
            last_name: reqParams?.last_name,
            bio: reqParams?.bio,
            address: reqParams?.address,
            gender: reqParams?.gender,
            date_of_birth: reqParams?.date_of_birth,
          };

          await profile.update(updateCondition, {
            where: { id: reqParams.profileId },
          });

          const updatedProfile = await profile.findOne({
            where: { id: reqParams.profileId },
          });

          responseSuccessWithMessage(
            res,
            { updatedProfile: updatedProfile },
            PROFILE_UPDATED
          );
        } else {
          const setData = await profile.create({
            user_id: req.id,
            first_name: reqParams?.first_name,
            last_name: reqParams?.last_name,
            date_of_birth: reqParams?.date_of_birth,
            gender: reqParams?.gender,
          });

          if (!setData) {
            return errorResponseWithoutData(res, SOMETHING_WRONG);
          } else {
            responseSuccessWithMessage(res, setData, PROFILE_FORM_SUBMITTED);
          }
        }
      }
    });
  } catch (error) {
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will uplaod a profile picture of user to s3 bucket using presigned url.
 * @param {*} req
 * @param {*} res
 */

const addEditProfilePicture = async (req, res) => {
  const reqParams = req.body;

  try {
    imageValidation(reqParams, res, async (validate) => {
      if (validate) {
        const profileDetail = await profile.findOne({
          where: { id: reqParams.profileId },
          attributes: ["profile_picture"],
        });

        if (profileDetail.profile_picture != null) {
          const file = `${process.env.FILE_PATH_PROFILE}/${profileDetail.profile_picture}`;
          await removeOldImage(process.env.AWS_BUCKET_NAME, file, res);
        }

        const imgExtension = reqParams.mimetype.split("/")[1];
        const imgFileName = reqParams.mimetype.split("/")[0];
        const fileName = `${Date.now()}${randomDigits(
          4
        )}-${imgFileName}.${imgExtension}`;
        const key = `${process.env.FILE_PATH_PROFILE}/${fileName}`;
        const expiresIn = 600;

        const profileImage = await profile.update(
          { profile_picture: fileName },
          { where: { id: reqParams.profileId } }
        );

        if (!profileImage) {
          return errorResponseData(res, PROFILE_NOT_FOUND, 400);
        }

        const url = generatePreSignedUrl(
          process.env.AWS_BUCKET_NAME,
          key,
          expiresIn
        );
        return responseSuccessWithMessage(
          res,
          { Profile_image: url },
          IMAGE_UPLOADED
        );
      }
    });
  } catch (error) {
    return errorResponseData(res, error.message);
  }
};

/**
 * @description This function will delete uploaded image from database and s3 Bucket.
 * @param {*} req
 * @param {*} res
 * @returns
 */

const removeProfilePicture = async (req, res) => {
  const reqParams = req.body;
  try {
    const profileImage = await profile.findOne({
      where: { id: reqParams.id },
    });

    if (!profileImage) {
      return errorResponseData(res, PROFILE_IMAGE_NOT_FOUND, 404);
    }

    await profile.update(
      { profile_picture: null },
      { where: { id: reqParams.id } }
    );

    const file = `${process.env.FILE_PATH_PROFILE}/${profileImage.profile_picture}`;
    removeOldImage(process.env.AWS_BUCKET_NAME, file, res);

    return successResponseWithoutData(res, PROFILE_PICTURE_REMOVED);
  } catch (error) {
    return errorResponseData(res, error, 400);
  }
};

module.exports = {
  addEditProfile,
  getProfile,
  addEditProfilePicture,
  removeProfilePicture,
};
