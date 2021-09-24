const router = require("express").Router();
const { User, Movie, Comment, Like } = require("../models");
const withAuth = require("../utils/auth");

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  // else login
  res.render("login");
});

router.get("/username", (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }
  res.render("username", {
    logged_in: req.session.logged_in,
    userName: req.session.userName,
    user_id: req.session.user_id,
  });
});

router.get("/password", (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }
  res.render("password", {
    logged_in: req.session.logged_in,
    userName: req.session.userName,
    user_id: req.session.user_id,
  });
});

router.get("/email", (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }
  res.render("email");
});

router.get("/apikey", (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }
  res.render("apikey");
});

router.get("/dashboard", (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }
  res.render("dashboard");
});

router.get("/register", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("register");
});

router.get("/search", withAuth, (req, res) => {
  res.render("searchPage", {
    logged_in: req.session.logged_in,
    userName: req.session.userName,
    user_id: req.session.user_id,
  });
});

router.get("/profile", withAuth, async (req, res) => {
  const UserData = await User.findOne({
    where: {
      id: req.session.user_id,
    },
  });
  console.log(UserData.get({ plain: true }));
  const currentUser = await UserData.get({ plain: true });

  const userMovies = await Movie.findAll({
    where: {
      user_id: req.session.user_id,
    },
    include: [
      {
        model: User,
        attributes: ["userName"],
      },
      {
        model: Comment,
        include: [User],
        attributes: {
          exclude: ["password"],
        },
      },
    ],
    order: [["date_created", "DESC"]],
  });

  console.log("\n in profile route\n");

  const blogMovies = userMovies.map((movie) => movie.get({ plain: true }));
  console.log(blogMovies);

  res.render("profile", {
    blogMovies,
    logged_in: req.session.logged_in,
    userName: req.session.userName,
    user_id: req.session.user_id,
    currentUser,
  });
});
router.get("/", withAuth, async (req, res) => {
  // console.log(req.session, "homepage render");
  try {
    const dbMovieData = await Movie.findAll({
      attributes: [
        "id",
        "user_id",
        "title",
        "posterLink",
        "trailerLink",
        "plot",
        "year",
        "actors",
        "rating",
        "likes_count",
        "dislikes_count",
        "date_created",
      ],
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
        {
          model: Comment,
          attributes: ["id", "user_id", "movie_id", "content", "date_created"],
          include: {
            model: User,
            attributes: ["userName"],
          },
        },
      ],
    });

    // In the homepage template pass a single Movie object
    const movies = dbMovieData.map((movie) => movie.get({ plain: true }));

    // console.log(req.session, "homepage render");
    console.log("\n we found alll movies", movies[0]);
    res.render("home", {
      movies,
      logged_in: req.session.logged_in,
      userName: req.session.userName,
      user_id: req.session.user_id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



module.exports = router;
