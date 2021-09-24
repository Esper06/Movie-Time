const router = require("express").Router();
const { Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    const newcomment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newcomment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", withAuth, async (req, res) => {
  try {
    const commentById = await Comment.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "date_created"],
      include: [
        {
          model: Post,
          attributes: ["id", "content", "user_id", "date_created"],
          include: {
            model: User,
            attributes: ["userName"],
          },
        },
        {
          model: User,
          attributes: ["userName, id"],
        },
      ],
    });
    if (!postById) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    const post = postById.get({ plain: true });
    // pass data to template
    res.render("updatePost", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
