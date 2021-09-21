const dbConnection = require("../config/connection");
const { User, Movie, Comment, Like } = require("../models");

const userData = require("./userData.json");
const movieData = require("./movieData.json");
const commentData = require("./commentData.json");
const likeData = require("./likeData.json");

const seedDatabase = async () => {
  await dbConnection.sync({ force: true });
  console.log("DB Flashed");

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log("Users Added");

  await Movie.bulkCreate(movieData);
  console.log("Movie Added");
  await Comment.bulkCreate(commentData);
  console.log("Comment Added");
  await Like.bulkCreate(likeData);
  console.log("Like Added");
  process.exit(0);
};

seedDatabase();
