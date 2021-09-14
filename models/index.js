const User = require('./User');
const Post = require("./Post");
const Comment = require("./Comment");

// user relation to the other tables
User.hasMany(Post, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

// post relation to the other tables
Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});
Post.belongsTo(User, {
  foreignKey: "user_id",
});

// comments relation to the other tables
Comment.belongsTo(Post, {
  foreignKey: "post_id",
});
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Post, Comment };