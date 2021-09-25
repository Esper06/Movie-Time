const router = require("express").Router();
const { Movie, LikedMovie, Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");
const bcrypt = require("bcrypt");

// creat /register a new user
router.post("/", async (req, res) => {
  try {
    const userToCheck = await User.findOne({
      where: { email: req.body.email },
    });

    if (userToCheck) {
      res.status(400).json({
        message: `Error: Email: ${req.body.email} is registered already!`,
      });
      return;
    }
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.userName = userData.userName;
      req.session.youtubeApi = userData.youtubeApi;
      req.session.ombdApi = userData.ombdApi;
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update", withAuth, async (req, res) => {
  console.log("\nnew user name is \n", req.body);
  try {
    const updatedUser = await User.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.session.user_id,
        },
      }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.userName = userData.userName;
      req.session.logged_in = true;
      req.session.youtubeApi = userData.youtubeApi;
      req.session.ombdApi = userData.ombdApi;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get("/Apikey", withAuth, async (req, res) => {
  let youtubeApi = process.env.youtubeApi;
  let ombdApi = process.env.ombdApi;
  console.log("\n Api\n", youtubeApi, ombdApi);

  if (youtubeApi && ombdApi) {
    res.status(200).json({
      youtubeApi: youtubeApi,
      ombdApi: ombdApi,
      message: "We have found Api Keys!",
    });
    return;
  }
  res.status(400).json({ message: "No Api found!" });
  return;
});
module.exports = router;
