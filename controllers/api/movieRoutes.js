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
  let AllLikeForMovie = await Movie.findOne({
    where: {
      id: req.params.id,
    },
  });
  AllLikeForMovie = AllLikeForMovie.get({ plain: true });

  let likcount = AllLikeForMovie.likes_count;
  console.log(`\n like couts for movie${req.params.id} movie is \n`, likcount);

  let LikeById = await LikedMovie.findOne({
    where: {
      [Op.and]: [{ user_id: req.session.user_id }, { movie_id: req.params.id }],
    },
  });

  try {
    if (LikeById) {
      LikeById = LikeById.get({ plain: true });
      console.log("\n Like is \n", LikeById);
      console.log("\n Like is \n", LikeById.isLike);
      console.log("\n Like is \n", req.body.isLike);
      if (LikeById.isLike != req.body.isLike) {
        console.log("\n trying to update Like \n");

        await LikeById.update({
          ...req.body,
        });

        res.status(200).json({
          message: "voteChanged",
        });
      } else {
        res.status(200).json({
          message: "votedAlready",
        });
      }
    } else {
      console.log("\n trying to create Like \n");

      await LikedMovie.create({
        ...req.body,
        user_id: req.session.user_id,
        movie_id: req.params.id,
      });

      res.status(200).json({
        message: "voteChanged",
      });
    }
  } catch (err) {
    res.status(200).json(err);
  }

  let likes_count = await LikedMovie.findAndCountAll({
    where: {
      [Op.and]: [{ isLike: true }, { movie_id: req.params.id }],
    },
  });
  likes_count = likes_count.count;
  let dislikes_count = await LikedMovie.findAndCountAll({
    where: {
      [Op.and]: [{ isLike: false }, { movie_id: req.params.id }],
    },
  });
  dislikes_count = dislikes_count.count;
  const test = await Movie.update(
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
  console.log("\n totla like is", likes_count, dislikes_count);
});

        // Likecount = await LikedMovie.findAndCountAll({
        //   where: {
        //     [Op.and]: [{ isLike: true }, { movie_id: req.params.id }],
        //   },
        // });
        // await Movie.update(
        //   {
        //     likes_count:Likecount
        //   },
        //   {
        //     where: {
        //       id: req.params.id,
        //     },
        //   })
        // console.log("\n totla like is", Likecount.count);
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
