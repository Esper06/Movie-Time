const router = require("express").Router();
const { User, Movie, Comment, Like } = require("../models");
const withAuth = require("../utils/auth");
router.get("/profile", (req, res) => {
  res.render("profile");
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/search", (req, res) => {
  res.render("searchPage");
});
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/", async (req, res) => {
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
          attributes: ["id", "userName"],
        },
        {
          model: Comment,
          attributes: [
            "id",
            "user_id",
            "movie_id",
            "user_id",
            "content",
            "date_created",
          ],
        },
      ],
    });

    // In the homepage template pass a single post object
    const movies = dbMovieData.map((movie) => movie.get({ plain: true }));

    // console.log(req.session, "homepage render");
    console.log("\n we found alll moviesm", movies[0]);
    res.render("home", {
      movies,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  // else login
  res.render("login");
});
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  // else login
  res.render("signup");
});

router.get("/post/:id", (req, res) => {
  console.log(req.session, "post testing");
  Post.findOne({
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
          "post_id",
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
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      console.log(post);
      console.log(post.user.username);
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
