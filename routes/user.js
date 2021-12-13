const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:id/unfollow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    console.log("user.id");
    console.log(user.id);
    console.log(req.user.id);
    if (user) {
      //데이터베이스에서 찾은 사용자가 있다면
      await user.removeFollower(parseInt(req.user.id)); //팔로잉 끊기
      res.send("success");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
