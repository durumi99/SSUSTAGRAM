const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
  service: "Naver",
  auth: {
    user: "kms990615@naver.com",
    pass: "kms45464",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  smtpTransport,
};
// gitignore 등록