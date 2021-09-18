const User = require('./User');
const Movie = require("./Movie");
const Comment = require("./Comment");
const Like = require("./Like");

// user relation to the other tables
User.hasMany(Movie, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

// Movie relation to the other tables
Movie.hasMany(Comment, {
  foreignKey: "movie_id",
  onDelete: "CASCADE",
});
Movie.belongsTo(User, {
  foreignKey: "user_id",
});
// Like association to movie
Movie.hasMany(Like, {
  foreignKey: "movie_id",
  targetKey: "id",
});
Like.belongsTo(Movie, {
  foreignKey: "user_id",
  targetKey: "id",
});
User.hasMany(Like, {
  foreignKey: "user_id",
  targetKey: "id",
});
Like.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});
// comments relation to the other tables
Comment.belongsTo(Movie, {
  foreignKey: "movie_id",
});
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Movie, Comment, Like };