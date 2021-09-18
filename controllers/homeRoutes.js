const router = require("express").Router();
const { User, Movie, Comment, Like } = require("../models");
const withAuth = require("../utils/auth");
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/search", (req, res) => {
  res.render("searchPage");
});
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/home", (req, res) => {
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
        "youtubeApi",
        "description",
        "year",
        "likes",
        "dislikes",
      ],
      include: [
        {
          model: User,
          attributes: ["id, userName"],
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
          include: {
            model: User,
            attributes: ["id,userName"],
          },
        },
      ],
    });
    // In the homepage template pass a single post object
    const movies = dbMovieData.map((post) => post.get({ plain: true }));
    // console.log(req.session, "homepage render");
    console.log(movies[0]);
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
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
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
