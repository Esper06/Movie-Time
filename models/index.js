const User = require('./User');
const Movie = require("./Movie");
const Comment = require("./Comment");

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

// comments relation to the other tables
Comment.belongsTo(Movie, {
  foreignKey: "movie_id",
});
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Movie, Comment };