const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Movie extends Model {}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "user",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posterLink: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    trailerLink: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    plot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    actors: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "actors",
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0%",
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    likes_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dislikes_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "movie",
  }
);

module.exports = Movie;
