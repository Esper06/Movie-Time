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
      }
    });
    if(!MovieCheck){    const newMovie = await Movie.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newMovie);

  }else{
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
  let Likemovie = await Movie.findOne({
    where: {
       id: req.params.id },
    },
  );
  Likemovie = Likemovie.get({ plain: true });
  let likcount=Likemovie.likes_count


  let LikeById = await LikedMovie.findOne({
    where: {
      [Op.and]: [{ user_id: req.session.user_id }, { movie_id: req.params.id }],
    },
  });
  LikeById = LikeById.get({ plain: true });
  
 
  console.log("\n Like is \n", LikeById);
  console.log("\n Like is \n", LikeById.isLike);
  console.log("\n Like is \n", req.body.isLike);
let Likecount=0
  try {
    if (LikeById) {
      if (LikeById.isLike != req.body.isLike) {
        console.log("\n trying to update Like \n");

        let newLike = await LikedMovie.update(
          {
            ...req.body,
          },
          {
            where: {
              [Op.and]: [
                { user_id: req.session.user_id },
                { movie_id: req.params.id },
              ],
            },
          }
        );
          
        res.status(200).json({
          message: "voteChanged",
        });

      } else {
        {
          res.status(200).json({
            message: "votedAlready",
          });
        }
      }
    } else {
      console.log("\n trying to create Like \n");

      const newLike = await LikedMovie.create({
        ...req.body,
        user_id: req.session.user_id,
        movie_id: req.params.id,
      });
      
      res.status(200).json({
        message: "voteChanged",
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }

   Likecount = await LikedMovie.findAndCountAll({
    where: {
      [Op.and]: [{ isLike: true }, { movie_id: req.params.id }],
    },
  });
  console.log("\n totla like is", Likecount.count);
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
