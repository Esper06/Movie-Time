const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");
// const youtubeApi = process.env.youtubeApi;
// const ombdApi = process.env.ombdApi;


class User extends Model {
  checkPassword(pwToCheck) {
    return bcrypt.compareSync(pwToCheck, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },

    // ombdApi: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   defaultValue: ombdApi,
    // },
    // youtubeApi: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   defaultValue: youtubeApi,
    //   // AIzaSyAvOiFSZjxuzYcAk91Mw1Whc2c2C7UFrA8
    // },
  },
  {
    hooks: {
      beforeCreate: async (newUser) => {
        newUser.password = await bcrypt.hash(newUser.password, 10);
        // newUser.ombdApi = await bcrypt.hash(newUser.ombdApi, 10);
        // newUser.youtubeApi = await bcrypt.hash(newUser.youtubeApi, 10);
        return newUser;
      },
      beforeUpdate: async (updatedUser) => {
        updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        // updatedUser.ombdApi = await bcrypt.hash(updatedUser.ombdApi, 10);
        // updatedUser.youtubeApi = await bcrypt.hash(updatedUser.youtubeApi, 10);
        return updatedUser;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
