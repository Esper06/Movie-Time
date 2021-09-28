const router = require("express").Router();
const { Movie, LikedMovie, Comment, User } = require("../models");
const withAuth = require("../utils/auth");

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  req.flash("pageActive", "login");

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

router.get("/apikey", (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }
  res.render("apikey");
});

router.get("/register", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  req.flash("pageActive", "register");

  res.render("register");
});

router.get("/search", withAuth, (req, res) => {
  req.flash("pageActive", "searchPage");

  res.render("searchPage", {
    logged_in: req.session.logged_in,
    userName: req.session.userName,
    user_id: req.session.user_id,
  });
});

router.get("/comment/:id", withAuth, async (req, res) => {
  try {
    const UserData = await User.findOne({
      where: {
        id: req.session.user_id,
      },
    });
    const currentUser = await UserData.get({ plain: true });
    const userName = currentUser.userName;
    const movieById = await Movie.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "year", "date_created"],
      include: [
        {
          model: Comment,
          attributes: ["id", "content", "movie_id", "user_id", "date_created"],
          include: {
            model: User,
            attributes: ["userName"],
          },
        },
        {
          model: User,
          attributes: ["userName", "id"],
        },
      ],
    });
    if (!movieById) {
      res.status(404).json({ message: "No movie found with this id" });
      return;
    }
    const movie = movieById.get({ plain: true });
    // pass data to template
    res.render("makeComment", {
      movie,
      userName,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/profile", withAuth, async (req, res) => {
  req.flash("pageActive", "profile");

  const UserData = await User.findOne({
    where: {
      id: req.session.user_id,
    },
  });
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

  const blogMovies = userMovies.map((movie) => movie.get({ plain: true }));
  const message = req.flash("msg");

  res.render("profile", {
    blogMovies,
    logged_in: req.session.logged_in,
    userName: req.session.userName,
    user_id: req.session.user_id,
    currentUser,
    message,
  });
});
router.get("/", async (req, res) => {
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
        "genre",
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
      order: [["date_created", "DESC"]],
    });

    // In the homepage template pass a single Movie object
    let movies = dbMovieData.map((movie) => movie.get({ plain: true }));

    const message = req.flash("msg");
    res.render("home", {
      movies,
      logged_in: req.session.logged_in,
      userName: req.session.userName,
      user_id: req.session.user_id,
      message,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



module.exports = router;
