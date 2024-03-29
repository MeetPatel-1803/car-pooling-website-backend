const aws = require("aws-sdk");
const { errorResponseData } = require("./response");

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
const s3 = new aws.S3(credentials);

/**
 * @desc This function will generate pre-signed url for given image.
 * @param {*} AWS_BUCKET_NAME
 * @param {*} FILE_PATH
 * @param {*} expiresIn
 * @returns
 */

const generatePreSignedUrl = (AWS_BUCKET_NAME, FILE_PATH, expiresIn) => {
  return s3.getSignedUrl("putObject", {
    Bucket: AWS_BUCKET_NAME,
    Key: FILE_PATH,
    Expires: expiresIn,
  });
};

/**
 * @description This function will remove image from s3 bucket.
 * @param {*} AWS_BUCKET_NAME
 * @param {*} FILE_PATH
 * @param {*} res
 * @returns
 */
const removeOldImage = (AWS_BUCKET_NAME, FILE_PATH, res) => {
  return new Promise((resolve, reject) => {
    try {
      return s3.deleteObject(
        {
          Bucket: AWS_BUCKET_NAME,
          Key: FILE_PATH,
        },
        (err, data) => {
          if (data) {
            resolve({ data });
          }
          reject(res, err);
        }
      );
    } catch (error) {
      return errorResponseData(res, error.message);
    }
  });
};

const fetchPreSignedUrl = (file) => {
  try {
    return s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${process.env.FILE_PATH_PROFILE}/${file}`,
    });
  } catch (error) {
    return errorResponseData(res, error.message);
  }
};

module.exports = { generatePreSignedUrl, removeOldImage, fetchPreSignedUrl };
