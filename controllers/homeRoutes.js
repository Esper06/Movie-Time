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
router.get("/profile", withAuth, (req, res) => {
  res.render("profile", {
    logged_in: req.session.logged_in,
    userName: req.session.userName,
    user_id: req.session.user_id,
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
        "imgLink",
        "trailerLink",
        "description",
        "year",
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

router.get("/movie/:id", (req, res) => {
  console.log(req.session, "Movie testing");
  Movie.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "date_created"],
    include: [
      {
        model: Comment,
        attributes: [
          "id",
          "comment_text",
          "Movie_id",
          "user_id",
          "date_created",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbMovieData) => {
      if (!dbMovieData) {
        res.status(404).json({ message: "No Movie found with this id" });
        return;
      }

      // serialize the data
      const Movie = dbMovieData.get({ plain: true });

      // pass data to template
      console.log(Movie);
      console.log(Movie.user.username);
      res.render("single-Movie", {
        Movie,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
