module.exports = {
  /**
   * @description This function use for success response of rest api
   * @param data
   * @param code
   * @param message
   * @param res
   * @param extras
   * @returns {{data: *, meta: {message: *, code: *}}}
   */

  responseSuccessWithMessage(res, data, message, code = 1, extras) {
    const response = {
      data,
      meta: {
        code,
        message,
      },
    };

    if (extras) {
      Object.keys(extras).forEach((key) => {
        if ({}.hasOwnProperty.call(extras, key)) {
          response.meta[key] = extras[key];
        }
      });
    }

    return res.send(response);
  },

  successResponseDatasecond(res, data, data1, message, code = 1, extras) {
    const response = {
      data,
      data1,
      meta: {
        code,
        message,
      },
    };

    return res.send(response);
  },

  successResponseWithoutData(res, message, code = 1) {
    const response = {
      data: null,
      meta: {
        code,
        message,
      },
    };
    return res.send(response);
  },

  errorResponseWithoutData(res, message, code = 0, status = 500) {
    const response = {
      data: null,
      meta: {
        code,
        message,
      },
    };
    return res.status(status).send(response);
  },

  errorResponseData(res, message, code = 400) {
    const response = {
      code,
      message,
    };
    return res.status(code).send(response);
  },

  validationErrorResponseData(res, message, code = 400) {
    const response = {
      code,
      message,
    };
    return res.status(code).send(response);
  },
};
