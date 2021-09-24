const router = require('express').Router();
const userRoutes = require('./userRoutes');
const movieRoutes = require("./movieRoutes");
const commentRoutes = require("./commentRoutes");

router.use("/users", userRoutes);
router.use("/movie", movieRoutes);
router.use("/comment", commentRoutes);

module.exports = router;
