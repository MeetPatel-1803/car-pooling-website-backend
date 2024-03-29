const registrationValidation = require("../validations/registrationValidation");
const user = require("../models/user");
const loginValidation = require("../validations/loginValidation");
const { generateJWTToken } = require("../utils/JWTToken");
const bcrypt = require("bcrypt");
const { randomTokens } = require("../utils/helper");
const passwordValidation = require("../validations/passwordValidation");
const nodemailer = require("nodemailer");
const {
  responseSuccessWithMessage,
  errorResponseData,
  errorResponseWithoutData,
  successResponseWithoutData,
} = require("../utils/response");
const {
  USER_REGISTERED,
  EMAIL_ALREADY_TAKEN,
  UNAUTHORIZED_USER,
  INCORRECT_PASSWORD,
  INCORRECT_MAIL,
  INCORRECT_TOKEN,
  PASSWORD_UPDATED,
  TOKEN_EXPIRED,
  LOGIN_SUCCESSFUL,
  MAIL_NOT_REGISTERED,
  INCORRECT_OLD_PASSWORD,
  SOMETHING_WRONG,
} = require("../utils/message");
const changePasswordValidation = require("../validations/changePasswordValidation");
const profile = require("../models/userProfile");

/**
 * @description It will register a user and validate its credentials.
 * @param {*} req
 * @param {*} res
 */

const register = async (req, res) => {
  const reqParams = req.body;
  registrationValidation(reqParams, res, async (validate) => {
    if (validate) {
      const userDetail = await user.findOne({
        where: {
          email: reqParams.email,
        },
      });
      if (!userDetail) {
        bcrypt.hash(reqParams.password, 10, async (err, hash) => {
          if (err) {
            errorResponseData(res, err.message, 500);
          } else {
            const userData = await user.create({
              email: reqParams.email,
              password: hash,
              country_code: reqParams.country_code,
              mobile_no: reqParams.mobile_no,
            });
            responseSuccessWithMessage(res, userData, USER_REGISTERED);
          }
        });
      } else {
        errorResponseData(res, EMAIL_ALREADY_TAKEN, 409);
      }
    }
  });
};

/**
 * @description It will verify a user for login and validate its credentials.
 * @param {*} req
 * @param {*} res
 */

const login = async (req, res) => {
  const reqParams = req.body;
  loginValidation(reqParams, res, async (validate) => {
    if (validate) {
      const userDetail = await user.findOne({
        where: {
          email: reqParams.email,
        },
      });

      if (!userDetail) {
        return errorResponseData(res, UNAUTHORIZED_USER, 401);
      } else {
        const profileData = await profile.findOne({
          where: {
            user_id: userDetail.id,
          },
        });

        bcrypt.compare(
          reqParams.password,
          userDetail.password,
          (err, isValid) => {
            if (err) {
              return errorResponseWithoutData(res, err);
            } else if (!isValid) {
              return errorResponseData(res, INCORRECT_PASSWORD, 400);
            } else {
              const token = generateJWTToken(userDetail.id, res);

              if (profileData) {
                responseSuccessWithMessage(
                  res,
                  { isProfileCreated: true, token: token },
                  LOGIN_SUCCESSFUL
                );
              } else {
                responseSuccessWithMessage(
                  res,
                  { isProfileCreated: false, token: token },
                  LOGIN_SUCCESSFUL
                );
              }
            }
          }
        );
      }
    }
  });
};

/**
 * @description It will authencticate a user and pass email for reset password
 * @param {*} req
 * @param {*} res
 * @returns
 */
const forgotPassword = async (req, res) => {
  const reqParams = req.body;

  const userDetail = await user.findOne({
    where: {
      email: reqParams.email,
    },
  });

  if (userDetail) {
    const token = randomTokens(2);
    const d = new Date();
    const tokenExpire = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() + 1,
      d.getSeconds(),
      d.getMilliseconds()
    );

    const setToken = await user.update(
      { Token: token, token_expire: tokenExpire },
      { where: { email: reqParams.email } }
    );

    if (!setToken) {
      return errorResponseData(res, INCORRECT_MAIL, 498);
    } else {
      const resetPasswordUrl = `http://${process.env.FRONTEND_URL}/reset-password?tokenId=${token}`;

      const transporter = nodemailer.createTransport({
        host: process.env.HOST_SERVICE,
        port: process.env.SERVICE_PORT,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      try {
        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: reqParams.email,
          subject: "RESET PASSWORD",
          html: `${resetPasswordUrl}`,
        });
      } catch (error) {
        errorResponseWithoutData(res, error);
      }

      responseSuccessWithMessage(res, resetPasswordUrl, token);
    }
  } else {
    errorResponseData(res, MAIL_NOT_REGISTERED, 409);
  }
};

/**
 * @description It will reset password and validate password
 * @param {*} req
 * @param {*} res
 */

const resetPassword = async (req, res) => {
  const reqParams = req.body;
  const token = reqParams.token;

  passwordValidation(reqParams, res, async (validate) => {
    if (validate) {
      const userDetail = await user.findOne({
        where: {
          Token: token,
        },
      });

      if (userDetail && userDetail.token_expire < new Date()) {
        return errorResponseWithoutData(res, TOKEN_EXPIRED, 401);
      } else {
        if (userDetail) {
          bcrypt.hash(reqParams.password, 10, async (err, hash) => {
            if (err) {
              return errorResponseWithoutData(res, err);
            } else {
              const setData = await user.update(
                { password: hash, Token: null, token_expire: null },
                { where: { Token: token } }
              );
              if (!setData) {
                errorResponseData(res, INCORRECT_TOKEN, 498);
              } else {
                successResponseWithoutData(res, PASSWORD_UPDATED);
              }
            }
          });
        } else {
          errorResponseData(res, INCORRECT_TOKEN, 498);
        }
      }
    }
  });
};

/**
 * @description This function will change user's password based on old password.
 * @param {*} req
 * @param {*} res
 * @returns
 */

const changePassword = async (req, res) => {
  try {
    const reqParams = req.body;

    changePasswordValidation(reqParams, res, async (validate) => {
      if (validate) {
        const userData = await user.findOne({ where: { id: req.id } });

        bcrypt.compare(
          reqParams.oldPassword,
          userData.password,
          async (err, isValid) => {
            if (err) {
              return errorResponseData(res, err);
            } else if (!isValid) {
              return errorResponseData(res, INCORRECT_OLD_PASSWORD);
            } else {
              bcrypt.hash(reqParams.newPassword, 10, async (err, hash) => {
                if (err) {
                  return errorResponseData(res, err);
                } else {
                  const updateUserPassword = await user.update(
                    { password: hash },
                    { where: { id: req.id } }
                  );

                  if (!updateUserPassword) {
                    return errorResponseWithoutData(res, SOMETHING_WRONG);
                  }
                  successResponseWithoutData(res, PASSWORD_UPDATED);
                }
              });
            }
          }
        );
      }
    });
  } catch (error) {
    return errorResponseData(res, error.message);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};
