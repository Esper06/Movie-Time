const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Like extends Model {}

Like.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "movie",
        key: "id",
      },
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "like",
  }
);

module.exports = Like;
