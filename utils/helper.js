module.exports = {
  /**
   * This function will generate random tokens
   * @param {*} length  Ex: length = 1 will create 10 characters token
   * @returns
   */

  randomTokens(length) {
    let token = "";
    for (let i = 1; i <= length; i++) {
      token += Math.random().toString(36).substring(2);
    }
    return token;
  },

  /**
   * This function will generate random digits of length 4
   * @param {*} length
   * @returns
   */

  randomDigits(length) {
    const digits = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += digits[Math.floor(Math.random() * 10)];
    }
    return result;
  },
};
