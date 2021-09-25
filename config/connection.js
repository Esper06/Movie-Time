const Sequelize = require("sequelize"); //we bring in sequelize
require("dotenv").config(); //we bring in dotenv so that we can use placeholder passwords and usernames

let sequelize; //we create a variable for sequelize

if (process.env.JAWSDB_URL) { //if heroku has the JAWSDB attachment do the below code
  sequelize = new Sequelize(process.env.JAWSDB_URL,process.env.youtubeApi,process.env.ombdApi);
} else {
  sequelize = new Sequelize( //otherwise do this instead
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
      host: "localhost",
      dialect: "mysql",
      port: 3306,
    }
  );
  console.log("Dtabase is connected");
}

module.exports = sequelize; //we then export the code out so it can be used elsewhere
