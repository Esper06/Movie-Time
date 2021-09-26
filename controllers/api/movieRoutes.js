const router = require("express").Router();
const { Movie, LikedMovie, Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");
const { Op, sequelize } = require("sequelize");

// creat a new movie
router.post("/", withAuth, async (req, res) => {
  console.log("\ntrying to add a movie\n");
  try {
    const MovieCheck = await Movie.findOne({
      where: {
        title: req.body.title,
      },
    });
    if (!MovieCheck) {
      const newMovie = await Movie.create({
        ...req.body,
        user_id: req.session.user_id,
      });

      res.status(200).json(newMovie);
    } else {
      res.status(500).json({ message: "Movie already in the list" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});
router.get("/:id", withAuth, async (req, res) => {
  try {
    const MovieById = await Movie.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "date_created"],
      include: [
        {
          model: Comment,
          attributes: ["id", "content", "Movie_id", "user_id", "date_created"],
          include: {
            model: User,
            attributes: ["userName"],
          },
        },
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });
    if (!MovieById) {
      res.status(404).json({ message: "No Movie found with this id" });
      return;
    }
    const Movie = MovieById.get({ plain: true });
    // pass data to template
    res.render("updateMovie", {
      Movie,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const newMovie = await Movie.update(
      {
        ...req.body,
        user_id: req.session.user_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json(newMovie);
  } catch (err) {
    res.status(400).json(err);
  }
});
// update lieks
router.put("/like/:id", withAuth, async (req, res) => {
  var message;
  // find the movie to operste like dislike action on it
  try {
    let AllLikeForMovie = await Movie.findOne({
      where: {
        id: req.params.id,
      },
    });

    AllLikeForMovie = await AllLikeForMovie.get({ plain: true });

    // find the data related to that specific movie and user
    let LikeById = await LikedMovie.findOne({
      where: {
        [Op.and]: [
          { user_id: req.session.user_id },
          { movie_id: req.params.id },
        ],
      },
    });

    if (!LikeById) {
      console.log("\n requested to create post \n");
      let isLike = false;
      let isdisLike = false;

      if (req.body.like_evt) {
        isLike = true;
        message = isLike;
      }
      if (req.body.disLike_evt) {
        isdisLike = true;
        message = isdisLike;
      }
      console.log("\n requested to change like event \n", req.body.like_evt);
      console.log(
        "\n requested to change dislike event \n",
        req.body.disLike_evt
      );
      const newLikeData = await LikedMovie.create({
        user_id: req.session.user_id,
        movie_id: req.params.id,
        is_like: isLike,
        is_dis_like: isdisLike,
      });
    } else {
      let isLike = false;
      let isdisLike = false;
      console.log(
        "\n requested to change like to post \n",
        LikeById.get({ plain: true })
      );
      console.log("\n requested to change like event \n", req.body.like_evt);
      console.log(
        "\n requested to change dislike event \n",
        req.body.disLike_evt
      );
      if (req.body.like_evt) {
        isLike = await !LikeById.is_like;
        message = isLike;
      }
      if (req.body.disLike_evt) {
        isdisLike = await !LikeById.is_dis_like;
        message = isdisLike;
      }
      await LikeById.update({
        user_id: req.session.user_id,
        movie_id: req.params.id,
        is_like: isLike,
        is_dis_like: isdisLike,
      });
    }
    console.log("\n callying count\n");

    let likes_count = await LikedMovie.findAndCountAll({
      where: {
        [Op.and]: [[{ is_like: true }, { movie_id: req.params.id }]],
      },
    });
    likes_count = likes_count.count;
    console.log("\n Totall count\n", likes_count);

    let dislikes_count = await LikedMovie.findAndCountAll({
      where: {
        [Op.and]: [{ is_dis_like: true }, { movie_id: req.params.id }],
      },
    });
    dislikes_count = dislikes_count.count;
    console.log("\n count\n", dislikes_count);

    await Movie.update(
      {
        likes_count: likes_count,
        dislikes_count: dislikes_count,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message, likes_count, dislikes_count });
  } catch (err) {
    res.status(400).json(err);
  }
});


// delete movie by id
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const MovieData = await Movie.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!MovieData) {
      res.status(404).json({ message: "No Movie found with this id!" });
      return;
    }

    res.status(200).json(MovieData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/new-Movie", withAuth, async (req, res) => {
  try {
    const newMovie = await Movie.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    console.log(newMovie);

    res.status(200).json(newMovie);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});
module.exports = router;
