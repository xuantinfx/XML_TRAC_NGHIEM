const request = require("request")
const URL_SECURITY = "http://localhost:3003"
module.exports.checkLogin = (token) => {
    return new Promise((resole, reject) => {
      request({
          uri: URL_SECURITY + "/check-login",
          method: "POST",
          body: JSON.stringify({
            token
          })
        },
        (err, res, body) => {
          if (err) {
            console.log(err);
            return resole(false);
          } else {
            resole(body);
          }
        }
      );
    })
  }