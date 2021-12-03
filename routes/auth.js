const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require('path');
var appDir = path.dirname(require.main.filename);

const router = express.Router();

var generateRandom = function (min, max) {
  var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, id, name, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { id } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const exUser2 = await User.findOne({ where: { email } });
    if (exUser2) {
      return res.redirect("/join?error=exist");
    }
    /*
    let authNum = Math.random().toString().substr(2, 6);
    let emailTemplete;
    ejs.renderFile(
      appDir + "/template/authMail.ejs",
      { authCode: authNum },
      function (err, data) {
        if (err) {
          console.log(err);
        }
        emailTemplete = data;
      }
    );

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    let mailOptions = await transporter.sendMail({
      from: `SSUSTAGRAM`,
      to: req.body.email,
      subject: "회원가입을 위한 인증번호를 입력해주세요.",
      html: emailTemplete,
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      console.log("Finish sending email : " + info.response);
      res.send(authNum);
      transporter.close();
    });*/

    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      name,
      id,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});
{
  /*
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});
*/
}
module.exports = router;
